const baseUrl = process.argv[2] || 'http://127.0.0.1:4173/PRAVAC/';
const cdpUrl = process.argv[3] || 'http://127.0.0.1:9222';

const target = await createTarget(baseUrl);
const client = await connect(target.webSocketDebuggerUrl);

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });

  await navigate(baseUrl);
  await expectEval('home route renders', () => location.pathname === '/PRAVAC/' && !document.body.innerText.includes('Page not found'));
  await expectEval('header language control is visible', () => {
    const select = [...document.querySelectorAll('header select')].find((item) => {
      const rect = item.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    if (!select) return false;
    const rect = select.getBoundingClientRect();
    return rect.width >= 60 && rect.height >= 40;
  });
  await expectEval('mobile quick navigation is visible', () => {
    const nav = [...document.querySelectorAll('header nav')].find((item) => {
      const rect = item.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    return Boolean(nav && nav.querySelectorAll('a').length >= 5);
  });

  await evaluate(() => {
    const select = [...document.querySelectorAll('header select')].find((item) => {
      const rect = item.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    select.value = 'en';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await waitFor(() => document.documentElement.lang === 'en');
  await expectEval('header language switch works', () => document.documentElement.lang === 'en');

  await tapSelector('button[aria-controls="mobile-menu"]');
  await waitFor(() => Boolean(document.querySelector('#mobile-menu')));
  await expectEval('mobile menu opens from real tap', () => Boolean(document.querySelector('#mobile-menu')));

  await evaluate(() => document.querySelector('#mobile-menu nav a')?.click());
  await waitFor(() => location.pathname === '/PRAVAC/sk/short-term-car-rental');
  await expectEval('mobile nav keeps base path', () => location.pathname === '/PRAVAC/sk/short-term-car-rental');

  await navigate(new URL('sk/airport-transfers', baseUrl).toString());
  await expectEval('direct project route renders', () => location.pathname === '/PRAVAC/sk/airport-transfers' && !document.body.innerText.includes('Page not found'));

  await navigate(baseUrl);
  await evaluate(() => document.querySelector('.hero-panel form button[type="submit"]')?.click());
  await waitFor(() => location.hash === '' && window.scrollY > 300);
  await expectEval('hero search scrolls to reservation', () => window.scrollY > 300);

  console.log('Mobile smoke test passed.');
} finally {
  await send('Page.close').catch(() => {});
  client.close();
}

async function createTarget(url) {
  const response = await fetch(`${cdpUrl}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
  if (!response.ok) throw new Error(`Cannot create Chrome target: ${response.status}`);
  return response.json();
}

function connect(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const events = new EventTarget();

  socket.addEventListener('message', (message) => {
    const data = JSON.parse(message.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(data.error.message));
      else resolve(data.result || {});
      return;
    }

    if (data.method) events.dispatchEvent(new CustomEvent(data.method, { detail: data.params }));
  });

  return new Promise((resolve, reject) => {
    socket.addEventListener('open', () => {
      resolve({
        close: () => socket.close(),
        eventTarget: events,
        send: (method, params = {}) => new Promise((innerResolve, innerReject) => {
          const messageId = ++id;
          pending.set(messageId, { resolve: innerResolve, reject: innerReject });
          socket.send(JSON.stringify({ id: messageId, method, params }));
        }),
      });
    });
    socket.addEventListener('error', () => reject(new Error('Chrome DevTools websocket failed.')));
  });
}

function send(method, params) {
  return client.send(method, params);
}

async function navigate(url) {
  await send('Page.navigate', { url });
  await waitForEvent('Page.loadEventFired');
}

async function evaluate(fn) {
  const result = await send('Runtime.evaluate', {
    expression: `(${fn})()`,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result?.value;
}

async function expectEval(label, fn) {
  const passed = await evaluate(fn);
  if (!passed) throw new Error(`Failed: ${label}`);
  console.log(`ok - ${label}`);
}

async function tapSelector(selector) {
  const rect = await evaluateExpression(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    };
  })()`);

  if (!rect || rect.width <= 0 || rect.height <= 0) {
    throw new Error(`Cannot tap missing or hidden selector: ${selector}`);
  }

  await send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: rect.x, y: rect.y }],
  });
  await send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  await send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: rect.x,
    y: rect.y,
    button: 'none',
  });
  await send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: rect.x,
    y: rect.y,
    button: 'left',
    clickCount: 1,
  });
  await send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: rect.x,
    y: rect.y,
    button: 'left',
    clickCount: 1,
  });
}

async function evaluateExpression(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result?.value;
}

async function waitFor(fn, timeoutMs = 5000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await evaluate(fn)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Timed out waiting for browser condition.');
}

function waitForEvent(eventName, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      client.eventTarget.removeEventListener(eventName, onEvent);
      reject(new Error(`Timed out waiting for ${eventName}`));
    }, timeoutMs);
    const onEvent = () => {
      clearTimeout(timeout);
      client.eventTarget.removeEventListener(eventName, onEvent);
      resolve();
    };
    client.eventTarget.addEventListener(eventName, onEvent);
  });
}
