import { Clock, Facebook, Instagram, Linkedin, Mail } from 'lucide-react';
import { footerNav, quickLinks } from '../data/siteData.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { Link } from '../router/Link.jsx';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr_1.2fr]">
        <div>
          <Link href="/sk" className="text-3xl font-black tracking-wide">
            PRAVAC
          </Link>
          <p className="mt-4 text-zinc-300">{t('common.slogan')}</p>
          <div className="mt-6 flex gap-3">
            {[Facebook, Instagram, Linkedin, Mail].map((Icon, index) => (
              <span key={index} className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white">
                <Icon size={18} />
              </span>
            ))}
          </div>
        </div>
        <FooterColumn title={t('common.quickLinks')} items={quickLinks} />
        <FooterColumn title={t('common.navigation')} items={footerNav} />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">{t('common.contact')}</h2>
          <ul className="mt-4 grid gap-3 text-sm text-zinc-300">
            <li className="flex gap-3"><Clock size={18} className="text-pravac" /> {t('common.workingHours')}</li>
            <li className="flex gap-3"><Mail size={18} className="text-pravac" /> {t('common.email')}</li>
            <li>{t('common.phone')}</li>
            <li>{t('common.address')}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-zinc-400">
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
