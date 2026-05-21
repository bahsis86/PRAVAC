import { Clock, Gauge, ShieldCheck, Star } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext.jsx';

const icons = [Clock, Gauge, ShieldCheck, Star];

export default function FeatureBar({ variant = 'default' }) {
  const { dict } = useI18n();
  const items = variant === 'transfer' ? dict.transferFeatures : dict.features;

  return (
    <section className="relative overflow-hidden bg-[var(--pravac-surface-soft)]">
      <div className="container-shell grid gap-3 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = icons[index] || ShieldCheck;
          return (
            <div key={item} className="flex items-center gap-3 px-1 py-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-pravac-orange/10 text-pravac-orange">
                <Icon size={22} />
              </span>
              <span className="font-bold text-pravac-blue">{item}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
