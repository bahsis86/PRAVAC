import { X } from 'lucide-react';
import { Link } from '../router/Link.jsx';
import { navItems, quickLinks } from '../data/siteData.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { LanguageSelect } from './LanguageSelect.jsx';

export default function MobileMenu({ open, onClose }) {
  const { t } = useI18n();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black text-white lg:hidden" role="dialog" aria-modal="true">
      <div className="container-shell flex h-20 items-center justify-between">
        <Link className="text-2xl font-black tracking-wide" href="/sk" onClick={onClose}>
          PRAVAC
        </Link>
        <button className="rounded-md p-2 hover:bg-white/10" type="button" onClick={onClose} aria-label={t('common.closeMenu')}>
          <X size={28} />
        </button>
      </div>
      <nav className="container-shell grid gap-3 pt-8 text-xl font-semibold">
        {navItems.map((item) => (
          <Link key={item.href} className="rounded-md border border-white/10 bg-white/5 px-4 py-4 hover:bg-white/10" href={item.href} onClick={onClose}>
            {t(`nav.${item.key}`)}
          </Link>
        ))}
      </nav>
      <div className="container-shell mt-8 flex flex-wrap items-center gap-3">
        <LanguageSelect />
        {quickLinks.map((item) => (
          <Link key={item.href} className="text-sm text-zinc-300 hover:text-white" href={item.href} onClick={onClose}>
            {t(`nav.${item.key}`)}
          </Link>
        ))}
      </div>
    </div>
  );
}
