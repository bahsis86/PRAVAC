const basePath = normalizeBasePath(import.meta.env.BASE_URL);

export function normalizePathname(pathname) {
  const withoutBase = stripBasePath(pathname || '/');
  const normalized = withoutBase.replace(/\/$/, '') || '/';
  return normalized;
}

export function withBasePath(href) {
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
    return href;
  }

  const cleanHref = href.startsWith('/') ? href : `/${href}`;
  if (basePath === '/') return cleanHref;
  if (cleanHref === basePath || cleanHref.startsWith(`${basePath}/`)) return cleanHref;
  return `${basePath}${cleanHref}`;
}

function stripBasePath(pathname) {
  if (basePath === '/') return pathname;
  if (pathname === basePath) return '/';
  if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length) || '/';
  return pathname;
}

function normalizeBasePath(value) {
  if (!value || value === '/') return '/';
  return `/${value.replace(/^\/|\/$/g, '')}`;
}
