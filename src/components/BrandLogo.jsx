import { Link } from '../router/Link.jsx';

const logoUrl = '/assets/pravac/logo/pravac-logo-header-compact.svg';

export default function BrandLogo({
  className = '',
  imageClassName = '',
  href = '/sk',
  onClick,
}) {
  const content = (
    <span className={`inline-flex items-center rounded-md bg-white px-2 py-1 shadow-sm ${className}`}>
      <img
        alt="PRAVAC Rent a Car"
        className={`h-10 w-auto object-contain ${imageClassName}`}
        src={logoUrl}
      />
    </span>
  );

  if (!href) return content;

  return (
    <Link className="inline-flex shrink-0" href={href} onClick={onClick}>
      {content}
    </Link>
  );
}
