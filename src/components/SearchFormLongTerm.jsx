import { Building2, CalendarClock, Mail, MapPin, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { locations } from '../data/locations.js';
import { vehicleModels } from '../data/vehicles.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { getLocationName } from '../utils/displayText.js';
import { appendCollectionItem, createId } from '../utils/storage.js';

const periodOptions = ['1-3', '3-6', '6-12', '12+'];
const mileageOptions = ['1000', '2000', '3000', '5000+'];

export default function SearchFormLongTerm() {
  const [sent, setSent] = useState(false);
  const { t, language } = useI18n();
  const copy = longTermCopy[language] || longTermCopy.en;

  const onSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    appendCollectionItem('longTermLeads', {
      id: createId('long-lead'),
      createdAt: new Date().toISOString(),
      status: 'new',
      deliveryLocationId: form.get('deliveryLocationId'),
      startDateTime: form.get('startDateTime'),
      rentalPeriod: form.get('rentalPeriod'),
      customerType: form.get('customerType'),
      vehicleInterest: form.get('vehicleInterest'),
      estimatedMonthlyMileage: form.get('estimatedMonthlyMileage'),
      options: form.getAll('options'),
      customerName: form.get('customerName'),
      customerPhone: form.get('customerPhone'),
      customerEmail: form.get('customerEmail'),
      customerComment: form.get('customerComment'),
    });
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <form className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 text-ink shadow-sm md:grid-cols-2 lg:grid-cols-4 lg:items-end lg:p-5" onSubmit={onSubmit}>
      <div className="md:col-span-2 lg:col-span-4">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-pravac">{copy.eyebrow}</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">{copy.intro}</p>
      </div>
      <SelectWithIcon icon={<MapPin size={18} />} label={t('forms.deliveryPlace')} name="deliveryLocationId" defaultValue="bratislava-center">
        {locations.filter((location) => location.pickupAvailable).map((location) => (
          <option key={location.id} value={location.id}>{getLocationName(location, language)}</option>
        ))}
      </SelectWithIcon>
      <label>
        <span className="field-label">{t('forms.dateTimeFrom')}</span>
        <input className="input-base" name="startDateTime" type="datetime-local" defaultValue="2026-05-06T09:00" required />
      </label>
      <label>
        <span className="field-label">{copy.rentalLength}</span>
        <select className="input-base" name="rentalPeriod" defaultValue="6-12" required>
          {periodOptions.map((option) => <option key={option} value={option}>{option} {copy.months}</option>)}
        </select>
      </label>
      <label>
        <span className="field-label">{copy.customerType}</span>
        <select className="input-base" name="customerType" defaultValue="company" required>
          <option value="private">{copy.privatePerson}</option>
          <option value="company">{copy.company}</option>
        </select>
      </label>
      <label>
        <span className="field-label">{copy.classOrCar}</span>
        <select className="input-base" name="vehicleInterest" defaultValue="Business" required>
          {[...new Set(vehicleModels.map((model) => model.category))].map((category) => <option key={category} value={category}>{category}</option>)}
          {vehicleModels.map((model) => <option key={model.id} value={model.id}>{model.title}</option>)}
        </select>
      </label>
      <label>
        <span className="field-label">{copy.monthlyMileage}</span>
        <select className="input-base" name="estimatedMonthlyMileage" defaultValue="2000" required>
          {mileageOptions.map((option) => <option key={option} value={option}>{option} km</option>)}
        </select>
      </label>
      <Input icon={<User size={18} />} label={t('forms.firstName')} name="customerName" required />
      <Input icon={<Phone size={18} />} label={t('forms.phone')} name="customerPhone" type="tel" placeholder="+421 999 999 999" required />
      <Input icon={<Mail size={18} />} label={t('forms.email')} name="customerEmail" type="email" placeholder="info@example.com" required />
      <div className="grid gap-3 rounded-md bg-pravac-blue/[0.04] p-4 md:col-span-2 lg:col-span-4">
        <p className="text-sm font-black text-graphite">{copy.conditions}</p>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          {copy.options.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm font-bold text-ink">
              <input name="options" type="checkbox" value={option.value} /> {option.label}
            </label>
          ))}
        </div>
      </div>
      <label className="md:col-span-2 lg:col-span-3">
        <span className="field-label">{t('forms.comment')}</span>
        <textarea className="input-base min-h-20" name="customerComment" placeholder={copy.commentPlaceholder} />
      </label>
      <button className="button-primary h-12 w-full gap-2 lg:self-end" type="submit">
        <Building2 size={18} /> {copy.submitLead}
      </button>
      {sent && (
        <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 md:col-span-2 lg:col-span-4">
          {t('common.thanks')}
        </p>
      )}
    </form>
  );
}

function SelectWithIcon({ label, icon, children, ...props }) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">{icon}</span>
        <select className="input-base pl-10" {...props} required>{children}</select>
      </div>
    </label>
  );
}

function Input({ label, icon, ...props }) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">{icon}</span>
        <input className="input-base pl-10" {...props} />
      </div>
    </label>
  );
}

const baseLongTermCopy = {
  eyebrow: 'Individual offer',
  intro: 'Long-term rental is priced individually. Send the requirements and PRAVAC manager will prepare a monthly offer.',
  rentalLength: 'Rental length',
  months: 'months',
  customerType: 'Customer type',
  privatePerson: 'Private person',
  company: 'Company',
  classOrCar: 'Class or car',
  monthlyMileage: 'Estimated monthly mileage',
  conditions: 'Requested conditions',
  options: [
    { value: 'cross-border', label: 'Cross-border usage' },
    { value: 'service-included', label: 'Service included' },
    { value: 'replacement-car', label: 'Replacement car' },
    { value: 'corporate-conditions', label: 'Corporate conditions' },
  ],
  submitLead: 'Send request',
  commentPlaceholder: 'Preferred class, mileage, company needs...',
};

const longTermCopy = {
  en: baseLongTermCopy,
  sk: {
    ...baseLongTermCopy,
    eyebrow: 'Individualna ponuka',
    intro: 'Dlhodoby prenajom sa nacenuje individualne. Poslite poziadavky a manazer PRAVAC pripravi mesacnu ponuku.',
    rentalLength: 'Dlzka prenajmu',
    months: 'mesiacov',
    customerType: 'Typ klienta',
    privatePerson: 'Sukromna osoba',
    company: 'Firma',
    classOrCar: 'Trieda alebo auto',
    monthlyMileage: 'Odhad km mesacne',
    conditions: 'Pozadovane podmienky',
    options: [
      { value: 'cross-border', label: 'Pouzitie v zahranici' },
      { value: 'service-included', label: 'Servis v cene' },
      { value: 'replacement-car', label: 'Nahradne auto' },
      { value: 'corporate-conditions', label: 'Firemne podmienky' },
    ],
    submitLead: 'Odoslat dopyt',
    commentPlaceholder: 'Preferovana trieda, kilometre, firemne potreby...',
  },
  ru: {
    ...baseLongTermCopy,
    eyebrow: 'Индивидуальное предложение',
    intro: 'Долгосрочная аренда рассчитывается индивидуально. Отправьте требования, и менеджер PRAVAC подготовит месячное предложение.',
    rentalLength: 'Срок аренды',
    months: 'месяцев',
    customerType: 'Тип клиента',
    privatePerson: 'Частное лицо',
    company: 'Компания',
    classOrCar: 'Класс или авто',
    monthlyMileage: 'Оценка км в месяц',
    conditions: 'Нужные условия',
    options: [
      { value: 'cross-border', label: 'Выезд за границу' },
      { value: 'service-included', label: 'Сервис включён' },
      { value: 'replacement-car', label: 'Подменный автомобиль' },
      { value: 'corporate-conditions', label: 'Корпоративные условия' },
    ],
    submitLead: 'Отправить заявку',
    commentPlaceholder: 'Желаемый класс, километраж, потребности компании...',
  },
  tr: {
    ...baseLongTermCopy,
    eyebrow: 'Ozel teklif',
    intro: 'Uzun sureli kiralama bireysel fiyatlandirilir. Ihtiyaclari gonderin, PRAVAC yoneticisi aylik teklif hazirlar.',
    rentalLength: 'Kiralama suresi',
    months: 'ay',
    customerType: 'Musteri tipi',
    privatePerson: 'Ozel kisi',
    company: 'Sirket',
    classOrCar: 'Sinif veya arac',
    monthlyMileage: 'Tahmini aylik km',
    conditions: 'Istenen kosullar',
    options: [
      { value: 'cross-border', label: 'Sinir disi kullanim' },
      { value: 'service-included', label: 'Servis dahil' },
      { value: 'replacement-car', label: 'Yedek arac' },
      { value: 'corporate-conditions', label: 'Kurumsal kosullar' },
    ],
    submitLead: 'Talep gonder',
    commentPlaceholder: 'Tercih edilen sinif, kilometre, sirket ihtiyaclari...',
  },
};
