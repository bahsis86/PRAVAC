import { Menu } from 'lucide-react';
import { useState } from 'react';
import { navItems } from '../data/siteData.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { Link } from '../router/Link.jsx';
import { LanguageSelect } from './LanguageSelect.jsx';
import MobileMenu from './MobileMenu.jsx';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useI18n();

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-black/75 text-white backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-6">
        <Link href="/sk" className="text-2xl font-black tracking-wide">
          PRAVAC
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-zinc-200 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} className="transition hover:text-red-200" href={item.href}>
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSelect />
        </div>
        <button
          className="relative z-10 flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/10 text-white transition active:scale-95 active:bg-white/20 lg:hidden"
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label={t('common.openMenu')}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <Menu size={28} />
        </button>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
