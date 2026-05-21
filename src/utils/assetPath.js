export function assetPath(path) {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = String(path).replace(/^\/+/, '');
  return `${cleanBase}${cleanPath}`;
}
