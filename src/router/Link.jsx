import { withBasePath } from './paths.js';

export function Link({ href, children, onClick, className = '' }) {
  const resolvedHref = withBasePath(href);

  const handleClick = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState({}, '', resolvedHref);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'instant' });
    onClick?.();
  };

  return (
    <a className={className} href={resolvedHref} onClick={handleClick}>
      {children}
    </a>
  );
}
