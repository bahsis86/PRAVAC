import { ArrowRight } from 'lucide-react';
import { serviceItems } from '../data/siteData.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { Link } from '../router/Link.jsx';
import GlowCard from './visual/GlowCard.jsx';
import PremiumSection from './visual/PremiumSection.jsx';

export default function ServiceCards() {
  const { t } = useI18n();

  return (
    <PremiumSection muted fx className="py-14 md:py-20">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-pravac">{t('services.eyebrow')}</p>
            <h2 className="mt-3 text-3xl font-black text-graphite md:text-5xl">{t('services.heading')}</h2>
          </div>
          <Link className="button-secondary w-fit gap-2" href="/sk/short-term-car-rental">
            {t('common.more')} <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {serviceItems.map((service) => (
            <GlowCard key={service.key} as={Link} interactive className="block overflow-hidden no-underline shadow-sm" href={service.href}>
              <img className="h-48 w-full object-cover" src={service.image} alt="" />
              <div className="p-5">
                <h3 className="text-xl font-black text-graphite">{t(`services.${service.key}`)[0]}</h3>
                <p className="mt-3 min-h-20 text-sm leading-7 text-zinc-600">{t(`services.${service.key}`)[1]}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-pravac">
                  {t('common.more')} <ArrowRight size={16} />
                </span>
              </div>
            </GlowCard>
          ))}
        </div>
    </PremiumSection>
  );
}
