import { MapPinned } from 'lucide-react';
import { destinationItems } from '../data/siteData.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import GlowCard from './visual/GlowCard.jsx';
import PremiumSection from './visual/PremiumSection.jsx';

export default function DestinationCards() {
  const { t } = useI18n();

  return (
    <PremiumSection className="py-14 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-pravac">{t('destinations.eyebrow')}</p>
        <h2 className="mt-3 text-3xl font-black text-graphite md:text-5xl">{t('destinations.heading')}</h2>
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {destinationItems.map((destination) => (
            <GlowCard key={destination.key} className="overflow-hidden shadow-soft">
              <img className="h-44 w-full object-cover" src={destination.image} alt="" />
              <div className="p-5">
                <MapPinned className="text-pravac" size={22} />
                <h3 className="mt-3 text-xl font-black text-graphite">{t(`destinations.${destination.key}`)[0]}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{t(`destinations.${destination.key}`)[1]}</p>
              </div>
            </GlowCard>
          ))}
        </div>
    </PremiumSection>
  );
}
