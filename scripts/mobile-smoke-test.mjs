const baseUrl = process.argv[2] || 'http://127.0.0.1:4173/PRAVAC/';
const cdpUrl = process.argv[3] || 'http://127.0.0.1:9222';

const target = await createTarget(baseUrl);
const client = await connect(target.webSocketDebuggerUrl);

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');
  const browserErrors = [];
  client.eventTarget.addEventListener('Runtime.exceptionThrown', (event) => {
    browserErrors.push(event.detail?.exceptionDetails?.text || 'runtime exception');
  });
  client.eventTarget.addEventListener('Log.entryAdded', (event) => {
    const entry = event.detail?.entry;
    if (entry?.level === 'error') browserErrors.push(entry.text || 'browser log error');
  });
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
  await expectEval('mobile quick navigation is compact and visible', () => {
    const nav = [...document.querySelectorAll('header nav')].find((item) => {
      const rect = item.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    return Boolean(nav && nav.querySelectorAll('a').length === 3);
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
  await expectEval('mobile menu is a right drawer with service and quick links', () => {
    const menu = document.querySelector('#mobile-menu aside');
    if (!menu) return false;
    const rect = menu.getBoundingClientRect();
    const links = menu.querySelectorAll('a');
    return rect.right <= window.innerWidth + 1 && rect.left > 0 && links.length >= 10 && menu.innerText.includes('Short-term rental');
  });

  await evaluate(() => document.querySelector('#mobile-menu nav a')?.click());
  await waitFor(() => location.pathname === '/PRAVAC/sk/short-term-car-rental');
  await expectEval('mobile nav keeps base path', () => location.pathname === '/PRAVAC/sk/short-term-car-rental');

  await navigate(new URL('sk/airport-transfers', baseUrl).toString());
  await expectEval('direct project route renders', () => location.pathname === '/PRAVAC/sk/airport-transfers' && !document.body.innerText.includes('Page not found'));

  await navigate(baseUrl);
  await evaluate(() => document.querySelector('.hero-panel form button[type="submit"]')?.click());
  await waitFor(() => location.hash === '' && window.scrollY > 300);
  await expectEval('hero search scrolls to reservation', () => window.scrollY > 300);

  await navigate(baseUrl);
  for (const [lang, expected] of [
    ['sk', 'Krátkodobý prenájom'],
    ['en', 'Short-term rental'],
    ['ru', 'Краткосрочная аренда'],
    ['tr', 'Kisa sureli kiralama'],
  ]) {
    await evaluate((next) => {
      const select = [...document.querySelectorAll('header select')].find((item) => {
        const rect = item.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      select.value = next;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }, lang);
    await waitFor((next) => document.documentElement.lang === next, 5000, lang);
    await expectEval(`${lang} language renders clean navigation`, (label) => document.body.innerText.includes(label), expected);
    await expectEval(`${lang} language has no mojibake markers`, () => {
      const text = document.body.innerText;
      return !/(Рђ|Рџ|Рњ|Рґ|Р°|СЃ|С‚|ГЎ|ГЅ|Г©|Еѕ|ДЌ|в‚|вЂ)/.test(text);
    });
  }

  const routes = [
    '',
    'sk',
    'sk/short-term-car-rental',
    'sk/long-term-car-rental',
    'sk/corporate-car-rentals',
    'sk/airport-transfers',
    'sk/trips',
    'sk/admin-pravac',
  ];

  for (const width of [360, 390, 430]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
    });

    for (const route of routes) {
      await navigate(new URL(route, baseUrl).toString());
      await expectEval(`${width}px ${route || 'home'} has no horizontal scroll`, () => document.documentElement.scrollWidth <= window.innerWidth + 1);
      await expectEval(`${width}px ${route || 'home'} logo renders or falls back`, () => {
        const brandNodes = [...document.querySelectorAll('header img[alt*="PRAVAC"], footer img[alt*="PRAVAC"]')];
        const brokenLogo = brandNodes.some((img) => img.complete && img.naturalWidth === 0);
        const fallback = document.body.innerText.includes('PRAVAC');
        return !brokenLogo && (brandNodes.length > 0 || fallback);
      });
      await expectEval(`${width}px ${route || 'home'} form controls fit viewport`, () => {
        const controls = [...document.querySelectorAll('input, select, textarea, button')];
        return controls.every((control) => {
          const rect = control.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return true;
          return rect.left >= -1 && rect.right <= window.innerWidth + 1;
        });
      });
    }
  }

  if (browserErrors.length) {
    throw new Error(`Browser console errors: ${browserErrors.join(' | ')}`);
  }

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

async function evaluate(fn, ...args) {
  const result = await send('Runtime.evaluate', {
    expression: `(${fn})(...${JSON.stringify(args)})`,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result?.value;
}

async function expectEval(label, fn, ...args) {
  const passed = await evaluate(fn, ...args);
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

async function waitFor(fn, timeoutMs = 5000, ...args) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await evaluate(fn, ...args)) return;
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
