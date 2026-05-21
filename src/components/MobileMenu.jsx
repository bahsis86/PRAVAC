import { ArrowRight, Briefcase, CalendarDays, Car, MapPin, MessageCircle, Phone, Route, X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '../router/Link.jsx';
import { navItems, quickLinks } from '../data/siteData.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import BrandLogo from './BrandLogo.jsx';
import { LanguageButtons } from './LanguageSelect.jsx';

const serviceIcons = {
  shortTerm: Car,
  longTerm: CalendarDays,
  corporate: Briefcase,
  transfer: MapPin,
  trips: Route,
};

const secondaryLinks = [
  { key: 'scooters', href: '/sk/scooters' },
  { key: 'franchise', href: '/sk/franchise' },
];

export default function MobileMenu({ open, onClose }) {
  const { dict, t } = useI18n();
  const menuCopy = dict.menu || {};

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

  return createPortal(
    <div
      id="mobile-menu"
      className="fixed inset-0 z-[2147483647] isolate bg-black/60 text-white backdrop-blur-sm lg:hidden"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <aside
        className="pointer-events-auto ml-auto flex h-dvh w-[min(390px,92vw)] max-w-full flex-col overflow-y-auto bg-pravac-blue shadow-[-24px_0_80px_rgba(0,0,0,0.34)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/10 bg-pravac-blue/95 px-4 backdrop-blur">
          <button className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/10 transition active:scale-95 active:bg-white/20" type="button" onClick={onClose} aria-label={t('common.closeMenu')}>
            <X size={28} />
          </button>
          <BrandLogo imageClassName="h-9" onClick={onClose} />
        </div>

        <div className="px-4 pb-6 pt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-pravac-orange">{t('common.language')}</p>
          <LanguageButtons />
        </div>

        <nav className="grid gap-2 px-4" aria-label={menuCopy.services || t('common.navigation')}>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{menuCopy.services || t('common.navigation')}</p>
          {navItems.map((item) => {
            const Icon = serviceIcons[item.key] || ArrowRight;
            return (
              <Link key={item.href} className="group grid min-h-16 grid-cols-[40px_1fr_20px] items-center gap-3 rounded-md bg-white/[0.08] px-3 py-3 active:bg-white/15" href={item.href} onClick={onClose}>
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-pravac-orange text-pravac-blue">
                  <Icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-black text-white">{t(`nav.${item.key}`)}</span>
                  <span className="mt-0.5 block text-sm leading-5 text-zinc-300">{menuCopy.descriptions?.[item.key]}</span>
                </span>
                <ArrowRight className="text-pravac-orange" size={18} />
              </Link>
            );
          })}
        </nav>

        <div className="mt-7 grid gap-5 px-4 pb-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{menuCopy.quickLinks || t('common.quickLinks')}</p>
            <div className="grid grid-cols-2 gap-2">
              {[...quickLinks, ...secondaryLinks].map((item) => (
                <Link key={item.href} className="rounded-md bg-white/[0.06] px-3 py-3 text-sm font-bold text-zinc-200 active:bg-white/15" href={item.href} onClick={onClose}>
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-white/10 bg-white/[0.06] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{menuCopy.support || t('common.contact')}</p>
            <div className="mt-3 grid gap-2 text-sm font-semibold text-zinc-200">
              <a className="inline-flex items-center gap-2" href={`tel:${t('common.phone')}`}>
                <Phone size={16} className="text-pravac-orange" /> {t('common.phone')}
              </a>
              <Link className="inline-flex items-center gap-2 text-pravac-orange" href="/sk/contact" onClick={onClose}>
                <MessageCircle size={16} /> {t('common.contactCta')}
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
