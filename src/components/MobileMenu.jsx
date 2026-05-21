import { X } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from '../router/Link.jsx';
import { navItems, quickLinks } from '../data/siteData.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import BrandLogo from './BrandLogo.jsx';
import { LanguageButtons } from './LanguageSelect.jsx';

export default function MobileMenu({ open, onClose }) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div id="mobile-menu" className="fixed inset-0 z-[999] overflow-y-auto bg-pravac-blue text-white lg:hidden" role="dialog" aria-modal="true">
      <div className="container-shell sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/10 bg-pravac-blue/95 backdrop-blur">
        <BrandLogo imageClassName="h-9" onClick={onClose} />
        <button className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/10 transition active:scale-95 active:bg-white/20" type="button" onClick={onClose} aria-label={t('common.closeMenu')}>
          <X size={28} />
        </button>
      </div>
      <div className="container-shell pt-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{t('common.language')}</p>
        <LanguageButtons />
      </div>
      <nav className="container-shell grid gap-2 pt-6 text-lg font-semibold">
        {navItems.map((item) => (
          <Link key={item.href} className="flex min-h-12 items-center rounded-md bg-white/[0.08] px-4 py-3 active:bg-white/15" href={item.href} onClick={onClose}>
            {t(`nav.${item.key}`)}
          </Link>
        ))}
      </nav>
      <div className="container-shell mt-8 grid gap-4 pb-10">
        <div className="grid grid-cols-2 gap-3">
        {quickLinks.map((item) => (
          <Link key={item.href} className="rounded-md border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-zinc-200 active:bg-white/15" href={item.href} onClick={onClose}>
            {t(`nav.${item.key}`)}
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
}
