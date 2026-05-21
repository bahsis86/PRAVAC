import { MapPin, Search } from 'lucide-react';
import { locations } from '../data/locations.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { getLocationName } from '../utils/displayText.js';

export default function SearchFormShortTerm() {
  const { t } = useI18n();

  const onSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    window.dispatchEvent(new CustomEvent('pravac:search-cars', {
      detail: {
        pickupLocation: form.get('pickupLocation'),
        dropoffLocation: form.get('dropoffLocation'),
        pickupAt: form.get('pickupAt'),
        dropoffAt: form.get('dropoffAt'),
      },
    }));
    document.getElementById('car-reservation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <form className="grid gap-4 rounded-lg bg-white p-4 text-ink shadow-soft md:grid-cols-2 md:p-5 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end" onSubmit={onSubmit}>
      <LocationSelect label={t('reservation.pickupLocation')} name="pickupLocation" defaultValue="bratislava-center" />
      <LocationSelect label={t('reservation.dropoffLocation')} name="dropoffLocation" defaultValue="bratislava-airport" />
      <label>
        <span className="field-label">{t('reservation.pickupAt')}</span>
        <input className="input-base" name="pickupAt" type="datetime-local" defaultValue="2026-05-06T09:00" required />
      </label>
      <label>
        <span className="field-label">{t('reservation.dropoffAt')}</span>
        <input className="input-base" name="dropoffAt" type="datetime-local" defaultValue="2026-05-09T09:00" required />
      </label>
      <button className="button-primary h-12 gap-2" type="submit">
        <Search size={18} /> {t('forms.search')}
      </button>
    </form>
  );
}

function LocationSelect({ label, name, defaultValue }) {
  const { language } = useI18n();

  return (
    <label>
      <span className="field-label">{label}</span>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <select className="input-base pl-10" name={name} defaultValue={defaultValue} required>
          {locations
            .filter((location) => name === 'pickupLocation' ? location.pickupAvailable : location.returnAvailable)
            .map((location) => (
            <option key={location.id} value={location.id}>
              {getLocationName(location, language)}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}
