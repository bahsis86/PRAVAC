import { useState } from 'react';
import { Link } from '../router/Link.jsx';
import logoUrl from '../assets/brand/pravac-logo.svg';

export default function BrandLogo({
  className = '',
  imageClassName = '',
  href = '/sk',
  onClick,
}) {
  const [failed, setFailed] = useState(false);
  const content = (
    <span className={`inline-flex min-h-11 items-center rounded-md bg-white px-2 py-1 shadow-sm ${className}`}>
      {!failed ? (
        <img
          alt="PRAVAC Rent a Car"
          className={`h-10 max-w-[132px] object-contain ${imageClassName}`}
          src={logoUrl}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="grid leading-none text-pravac-blue">
          <span className="font-heading text-lg font-black tracking-normal">PRAVAC</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">Rent a Car</span>
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link className="inline-flex shrink-0" href={href} onClick={onClick}>
      {content}
    </Link>
  );
}
