import { Mail, MapPin, Phone } from 'lucide-react';
import { navItems, quickLinks } from '../data/siteData.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { Link } from '../router/Link.jsx';
import BrandLogo from './BrandLogo.jsx';

const secondaryLinks = [
  { key: 'scooters', href: '/sk/scooters' },
  { key: 'franchise', href: '/sk/franchise' },
];

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-white/10 bg-pravac-blue text-white">
      <div className="container-shell grid gap-7 py-9 md:grid-cols-[1.2fr_0.8fr_1fr] md:py-12">
        <div>
          <BrandLogo imageClassName="h-10" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-300">{t('common.slogan')}</p>
          <ul className="mt-4 grid gap-2 text-sm text-zinc-300">
            <li className="flex gap-3"><Phone size={17} className="text-pravac" /> {t('common.phone')}</li>
            <li className="flex gap-3"><Mail size={17} className="text-pravac" /> {t('common.email')}</li>
            <li className="flex gap-3"><MapPin size={17} className="text-pravac" /> {t('common.address')}</li>
          </ul>
        </div>
        <div>
          <FooterColumn title={t('common.navigation')} items={navItems} />
        </div>
        <div className="grid gap-7 sm:grid-cols-2 md:grid-cols-1">
          <FooterColumn title={t('common.quickLinks')} items={quickLinks} />
          <FooterColumn title={t('common.more')} items={secondaryLinks} />
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-zinc-400">
        {t('common.copyright')}
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }) {
  const { t } = useI18n();

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">{title}</h2>
      <ul className="mt-4 grid gap-3 text-sm text-zinc-300">
        {items.map((item) => (
          <li key={item.href}>
            <Link className="transition hover:text-white" href={item.href}>
              {t(`nav.${item.key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
