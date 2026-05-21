import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { isUnitBlockedOnDate } from '../utils/availability.js';
import { getMockStore } from '../utils/storage.js';
import VehicleImagePlaceholder from './VehicleImagePlaceholder.jsx';
import AmbientBackground from './visual/AmbientBackground.jsx';
import GlowCard from './visual/GlowCard.jsx';

export default function FleetAvailability() {
  const { t } = useI18n();
  const [store, setStore] = useState(() => getMockStore());
  const [selectedModelId, setSelectedModelId] = useState(store.vehicleModels[0]?.id);
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    const refresh = () => setStore(getMockStore());
    window.addEventListener('pravac:mock-store-updated', refresh);
    return () => window.removeEventListener('pravac:mock-store-updated', refresh);
  }, []);

  const selectedModel = store.vehicleModels.find((model) => model.id === selectedModelId) || store.vehicleModels[0];
  const monthDate = useMemo(() => new Date(2026, 4 + monthOffset, 1), [monthOffset]);
  const monthLabel = monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  return (
    <section className="relative overflow-hidden bg-[var(--pravac-black)] py-14 md:py-20">
      <AmbientBackground variant="section" />
      <div className="container-shell relative z-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-pravac">{t('fleet.eyebrow')}</p>
            <h2 className="mt-3 text-3xl font-black text-graphite md:text-5xl">{t('fleet.heading')}</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-zinc-600">{t('fleet.intro')}</p>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid max-h-[760px] gap-3 overflow-auto pr-1">
            {store.vehicleModels.filter((model) => model.active).map((model) => {
              const selected = selectedModel?.id === model.id;
              return (
                <GlowCard
                  as="button"
                  interactive
                  key={model.id}
                  className={`grid grid-cols-[112px_1fr] overflow-hidden text-left shadow-sm sm:grid-cols-[120px_1fr] ${selected ? 'border-pravac ring-4 ring-pravac/10' : 'border-zinc-100'}`}
                  type="button"
                  onClick={() => setSelectedModelId(model.id)}
                >
                  <MiniVehicleMedia model={model} />
                  <div className="p-4">
                    <h3 className="text-lg font-black text-graphite">{model.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-pravac">{model.category}</p>
                    <p className="mt-3 text-sm text-zinc-600">{model.seats} seats | {model.transmission} | {model.dailyPriceFrom} € / {t('reservation.day')}</p>
                  </div>
                </GlowCard>
              );
            })}
          </div>

          {selectedModel && (
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-soft backdrop-blur">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-pravac">{selectedModel.title}</p>
                  <h3 className="mt-2 flex items-center gap-2 text-2xl font-black text-graphite">
                    <CalendarDays className="text-pravac" size={24} /> {t('fleet.calendar')}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button className="button-secondary !px-3" type="button" onClick={() => setMonthOffset((value) => value - 1)} aria-label={t('fleet.prev')}>
                    <ChevronLeft size={18} />
                  </button>
                  <span className="min-w-36 text-center text-sm font-bold capitalize text-ink">{monthLabel}</span>
                  <button className="button-secondary !px-3" type="button" onClick={() => setMonthOffset((value) => value + 1)} aria-label={t('fleet.next')}>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
                  const available = isModelAvailableOnDate(selectedModel.id, store, date);
                  return (
                    <div
                      key={day}
                      className={`flex aspect-square items-center justify-center rounded-md border text-sm font-bold ${available ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-red-100 bg-red-50 text-red-700'}`}
                      title={available ? t('fleet.free') : t('fleet.booked')}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-600">
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-100 ring-1 ring-emerald-200" /> {t('fleet.free')}</span>
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-red-100 ring-1 ring-red-200" /> {t('fleet.booked')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function isModelAvailableOnDate(modelId, store, date) {
  const units = store.vehicleUnits.filter((unit) => unit.vehicleModelId === modelId && unit.active && unit.status === 'available');
  return units.some((unit) => !isUnitBlockedOnDate(unit.id, store.availabilityBlocks, date));
}

function MiniVehicleMedia({ model }) {
  return <VehicleImagePlaceholder className="h-full min-h-28" model={model} />;
}
