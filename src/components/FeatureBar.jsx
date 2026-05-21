import { Clock, Gauge, ShieldCheck, Star } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext.jsx';
import GlowCard from './visual/GlowCard.jsx';

const icons = [Clock, Gauge, ShieldCheck, Star];

export default function FeatureBar({ variant = 'default' }) {
  const { dict } = useI18n();
  const items = variant === 'transfer' ? dict.transferFeatures : dict.features;

  return (
    <section className="relative overflow-hidden bg-[var(--pravac-bg-soft)]">
      <div className="container-shell grid gap-3 py-7 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = icons[index] || ShieldCheck;
          return (
            <GlowCard key={item} as="div" className="flex items-center gap-3 p-4 shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-pravac/10 text-pravac">
                <Icon size={22} />
              </span>
              <span className="font-bold text-ink">{item}</span>
            </GlowCard>
          );
        })}
      </div>
    </section>
  );
}
