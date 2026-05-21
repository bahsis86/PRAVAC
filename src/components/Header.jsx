import { Menu } from 'lucide-react';
import { useState } from 'react';
import { navItems } from '../data/siteData.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { Link } from '../router/Link.jsx';
import BrandLogo from './BrandLogo.jsx';
import { LanguageSelect } from './LanguageSelect.jsx';
import MobileMenu from './MobileMenu.jsx';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useI18n();
  const openMenu = () => setMenuOpen(true);

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-pravac-blue/95 text-white backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-3">
        <BrandLogo imageClassName="h-9 sm:h-10" />
        <nav className="hidden items-center gap-6 text-sm font-semibold text-zinc-200 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} className="transition hover:text-pravac-orange" href={item.href}>
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSelect />
        </div>
        <div className="relative z-50 flex shrink-0 items-center gap-2 lg:hidden">
          <LanguageSelect compact className="h-12 w-[72px] text-base" />
          <button
            className="flex h-12 min-w-[92px] items-center justify-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 text-sm font-black text-white transition active:scale-95 active:bg-white/20"
            type="button"
            onClick={openMenu}
            onPointerDown={openMenu}
            onTouchStart={openMenu}
            aria-label={t('common.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={23} />
            <span>{t('common.menu', 'Menu')}</span>
          </button>
        </div>
      </div>
      <nav className="border-t border-white/10 bg-pravac-blue/95 lg:hidden" aria-label={t('common.navigation')}>
        <div className="container-shell flex gap-2 overflow-x-auto py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className="shrink-0 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-black text-zinc-100 active:bg-white/20"
              href={item.href}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
