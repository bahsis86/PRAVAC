import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  Car,
  CheckCircle2,
  Luggage,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { locations } from '../../data/locations.js';
import { vehicleModels } from '../../data/vehicles.js';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { Link } from '../../router/Link.jsx';
import { assetPath } from '../../utils/assetPath.js';
import { appendCollectionItem, createId } from '../../utils/storage.js';
import CarReservation from '../CarReservation.jsx';
import SearchFormLongTerm from '../SearchFormLongTerm.jsx';
import TransferForm from '../TransferForm.jsx';
import VehicleImagePlaceholder from '../VehicleImagePlaceholder.jsx';

const contact = {
  phone: '+421 999 999 999',
  email: 'info@pravac.sk',
  address: 'PRAVAC Mobility Point, Bratislava',
};

const copy = {
  en: {
    heroTitle: 'Car rental in Bratislava',
    heroText: 'Simple rentals, airport pickup and clear booking requests for city trips, business and weekends.',
    pickup: 'Pickup location',
    return: 'Return location',
    pickupDate: 'Pickup date',
    returnDate: 'Return date',
    showCars: 'Show cars',
    services: 'Services',
    servicesTitle: 'Choose what you need',
    featured: 'Featured cars',
    featuredTitle: 'Popular choices',
    why: 'Why PRAVAC',
    whyTitle: 'Simple rental support',
    open: 'Open',
    contactTitle: 'Need a car or transfer?',
    contactText: 'Send a request and a manager will confirm the details.',
    requestCar: 'Request a car',
    view: 'View',
    from: 'from',
    day: 'day',
    deposit: 'deposit from',
    shortIntro: 'Search dates, compare available cars and send a compact booking request.',
    longIntro: 'Long-term rental is priced individually. Tell us the car class, period and mileage.',
    transferIntro: 'Request a transfer with route, time, passengers and luggage details.',
    corporateIntro: 'A simple request for company mobility, fleet needs and rental periods.',
    tripsIntro: 'Plan a private trip from Bratislava with pickup, date and passenger details.',
    submit: 'Send request',
    sent: 'Thank you, your request has been received. A PRAVAC manager will contact you.',
  },
};

copy.sk = {
  ...copy.en,
  heroTitle: 'Pozicovna aut v Bratislave',
  heroText: 'Jednoduchy prenajom, vyzdvihnutie na letisku a jasne dopyty pre mesto, biznis aj vikendy.',
  pickup: 'Miesto prevzatia',
  return: 'Miesto vratenia',
  pickupDate: 'Datum prevzatia',
  returnDate: 'Datum vratenia',
  showCars: 'Ukazat auta',
  services: 'Sluzby',
  servicesTitle: 'Vyberte si sluzbu',
  featured: 'Vybrane auta',
  featuredTitle: 'Oblubene auta',
  why: 'Preco PRAVAC',
  whyTitle: 'Jednoducha podpora prenajmu',
  open: 'Otvorit',
  contactTitle: 'Potrebujete auto alebo transfer?',
  contactText: 'Poslite dopyt a manazer potvrdi detaily.',
  requestCar: 'Poslat dopyt',
  view: 'Zobrazit',
  from: 'od',
  day: 'den',
  deposit: 'depozit od',
  shortIntro: 'Vyhladajte termin, porovnajte dostupne auta a poslite kratky dopyt.',
  longIntro: 'Dlhodoby prenajom sa nacenuje individualne podla triedy auta, obdobia a najazdu.',
  transferIntro: 'Poslite trasu, cas, pocet pasazierov a batozinu.',
  corporateIntro: 'Jednoduchy firemny dopyt na vozidla, obdobie a potreby timu.',
  tripsIntro: 'Naplanujte sukromny vylet z Bratislavy s pohodlnou dopravou.',
  submit: 'Odoslat dopyt',
  sent: 'Dakujeme, dopyt bol prijaty. Manazer PRAVAC sa vam ozve.',
};

copy.ru = {
  ...copy.en,
  heroTitle: 'Аренда авто в Братиславе',
  heroText: 'Простая аренда, подача в аэропорт и понятная заявка для города, бизнеса и поездок.',
  pickup: 'Место получения',
  return: 'Место возврата',
  pickupDate: 'Дата получения',
  returnDate: 'Дата возврата',
  showCars: 'Показать авто',
  services: 'Услуги',
  featured: 'Популярные авто',
  why: 'Почему PRAVAC',
  contactTitle: 'Нужен автомобиль или трансфер?',
  contactText: 'Отправьте заявку, и менеджер подтвердит детали.',
  requestCar: 'Оставить заявку',
  view: 'Смотреть',
  from: 'от',
  day: 'день',
  deposit: 'депозит от',
  shortIntro: 'Выберите даты, сравните доступные авто и отправьте короткую заявку.',
  longIntro: 'Долгосрочная аренда рассчитывается индивидуально по классу, сроку и пробегу.',
  transferIntro: 'Укажите маршрут, время, пассажиров и багаж.',
  corporateIntro: 'Простая заявка для компании: автомобили, сроки и потребности команды.',
  tripsIntro: 'Запланируйте частную поездку из Братиславы с комфортным транспортом.',
  submit: 'Отправить заявку',
  sent: 'Спасибо, заявка получена. Менеджер PRAVAC свяжется с вами.',
};

copy.tr = {
  ...copy.en,
  heroTitle: 'Bratislava arac kiralama',
  heroText: 'Sehir, is ve hafta sonu planlari icin kolay kiralama, havalimani teslimi ve net talep formu.',
  pickup: 'Teslim alma yeri',
  return: 'Iade yeri',
  pickupDate: 'Teslim alma tarihi',
  returnDate: 'Iade tarihi',
  showCars: 'Araclari goster',
  services: 'Hizmetler',
  servicesTitle: 'Ihtiyacinizi secin',
  featured: 'One cikan araclar',
  featuredTitle: 'Populer secenekler',
  why: 'Neden PRAVAC',
  whyTitle: 'Kolay kiralama destegi',
  open: 'Ac',
  contactTitle: 'Arac veya transfer mi gerekiyor?',
  contactText: 'Talep gonderin, yonetici detaylari onaylasin.',
  requestCar: 'Talep gonder',
  view: 'Gor',
  from: 'baslayan',
  day: 'gun',
  deposit: 'depozito',
  shortIntro: 'Tarihleri arayin, uygun araclari karsilastirin ve kisa talep gonderin.',
  longIntro: 'Uzun sureli kiralama; sinif, sure ve kilometreye gore ozel fiyatlandirilir.',
  transferIntro: 'Rota, saat, yolcu ve bagaj bilgileriyle transfer talebi gonderin.',
  corporateIntro: 'Sirket arac ihtiyaci, donem ve ekip planlari icin basit talep.',
  tripsIntro: 'Bratislava cikisli ozel gezinizi konforlu ulasimla planlayin.',
  submit: 'Talep gonder',
  sent: 'Tesekkurler, talebiniz alindi. PRAVAC yoneticisi sizinle iletisime gececek.',
};

const shortcuts = [
  { key: 'shortTerm', href: '/sk/short-term-car-rental', icon: Car, text: 'Fast car rental for days and weekends.' },
  { key: 'longTerm', href: '/sk/long-term-car-rental', icon: CalendarDays, text: 'Individual monthly offers for longer periods.' },
  { key: 'corporate', href: '/sk/corporate-car-rentals', icon: Briefcase, text: 'Company rentals and practical fleet support.' },
  { key: 'transfer', href: '/sk/airport-transfers', icon: MapPin, text: 'Airport and city transfers on request.' },
  { key: 'trips', href: '/sk/trips', icon: Users, text: 'Private trips with comfortable transport.' },
];

const whyItems = [
  'Bratislava and airport pickup',
  'Flexible rental periods',
  'Transparent estimated pricing',
];

const heroModel = {
  title: 'PRAVAC rental car',
  bodyType: 'estate',
};

export function HomePage() {
  const { dict, t } = useI18n();
  const c = dict.public || copy.en;
  const featuredCars = useMemo(() => vehicleModels.filter((model) => model.featured).slice(0, 4), []);

  return (
    <>
      <section className="relative overflow-hidden bg-pravac-blue pt-32 text-white md:pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,46,69,0.98),rgba(8,65,88,0.92)_58%,rgba(245,155,18,0.24))]" />
        <img
          className="pointer-events-none absolute right-[-10%] top-20 w-[34rem] max-w-none opacity-[0.06] md:w-[48rem]"
          src={assetPath('assets/pravac/logo/pravac-mark.svg')}
          alt=""
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute left-[8%] top-24 h-48 w-[78%] rounded-[100%] border-t-4 border-pravac-orange/40" />
        <div className="pointer-events-none absolute bottom-0 right-[-12%] h-64 w-64 rounded-full bg-pravac-orange/15 blur-3xl" />
        <div className="container-shell relative z-10 grid gap-5 pb-7 md:gap-7 md:pb-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex max-w-full items-center text-xs font-bold uppercase tracking-[0.12em] text-pravac-orange md:text-sm md:tracking-[0.2em]">PRAVAC Rent a Car</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight md:text-6xl">{c.heroTitle}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-200 md:mt-4 md:text-base md:leading-7">{c.heroText}</p>
            <TrustStrip className="mt-6 hidden md:grid" />
          </div>
          <div className="grid gap-4">
            <VehicleImagePlaceholder className="hidden h-40 rounded-lg sm:block md:h-64 lg:h-72" hero model={heroModel} />
          <div className="hero-panel">
            <SimpleHeroSearch copy={c} />
          </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white py-3 md:py-4">
        <div className="container-shell grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {shortcuts.map((item) => (
            <ServiceShortcut copy={c} item={item} key={item.key} label={t(`nav.${item.key}`)} />
          ))}
        </div>
      </section>

      <PublicSection eyebrow={c.featured} id="featured-cars" title={c.featuredTitle || copy.en.featuredTitle}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {featuredCars.map((model) => (
            <CompactCarCard copy={c} key={model.id} model={model} />
          ))}
        </div>
      </PublicSection>

      <ContactCTA copy={c} />
    </>
  );
}

export function ShortTermPage() {
  const { dict } = useI18n();
  const c = dict.public || copy.en;

  return (
    <>
      <PageIntro eyebrow={c.shortEyebrow} title={c.shortTitle} text={c.shortIntro} />
      <CarReservation />
    </>
  );
}

export function LongTermPage() {
  const { dict } = useI18n();
  const c = dict.public || copy.en;

  return (
    <>
      <PageIntro eyebrow={c.longEyebrow} title={c.longTitle} text={c.longIntro} />
      <PublicSection>
        <SearchFormLongTerm />
      </PublicSection>
      <ContactCTA copy={c} />
    </>
  );
}

export function TransferPage() {
  const { dict } = useI18n();
  const c = dict.public || copy.en;

  return (
    <>
      <PageIntro eyebrow={c.transferEyebrow} title={c.transferTitle} text={c.transferIntro} />
      <TransferForm />
      <ContactCTA copy={c} />
    </>
  );
}

export function CorporatePage() {
  const { dict } = useI18n();
  const c = dict.public || copy.en;

  return (
    <>
      <PageIntro eyebrow={c.corporateEyebrow} title={c.corporateTitle} text={c.corporateIntro} />
      <PublicSection>
        <BenefitRow items={[c.benefits.flexibleTerms, c.benefits.clearCommunication, c.benefits.carsForTeams]} />
        <LeadForm
          button={c.submit}
          leadType="corporate"
          sentText={c.sent}
          fields={[
            ['companyName', c.leadFields.companyName],
            ['contactPerson', c.leadFields.contactPerson],
            ['phone', c.leadFields.phone, 'tel'],
            ['email', c.leadFields.email, 'email'],
            ['fleetNeed', c.leadFields.fleetNeed],
            ['rentalPeriod', c.leadFields.rentalPeriod],
          ]}
          copy={c}
        />
      </PublicSection>
    </>
  );
}

export function TripsPage() {
  const { dict } = useI18n();
  const c = dict.public || copy.en;

  return (
    <>
      <PageIntro eyebrow={c.tripsEyebrow} title={c.tripsTitle} text={c.tripsIntro} />
      <PublicSection>
        <BenefitRow items={[c.benefits.pickupAgreement, c.benefits.flexibleDestinations, c.benefits.tripSupport]} />
        <LeadForm
          button={c.submit}
          leadType="trip"
          sentText={c.sent}
          fields={[
            ['destination', c.leadFields.destination],
            ['date', c.leadFields.date, 'date'],
            ['passengers', c.leadFields.passengers, 'number'],
            ['name', c.leadFields.name],
            ['phone', c.leadFields.phone, 'tel'],
            ['email', c.leadFields.email, 'email'],
          ]}
          copy={c}
        />
      </PublicSection>
    </>
  );
}

export function ContactPage() {
  const { dict } = useI18n();
  const c = dict.public || copy.en;

  return (
    <>
      <PageIntro eyebrow={c.contactEyebrow} title={c.contactTitle} text={c.contactText} />
      <ContactCTA copy={c} standalone />
    </>
  );
}

export function SimplePage({ pageKey }) {
  const { dict } = useI18n();
  const c = dict.public || copy.en;
  const [title, text] = dict.pages.simple[pageKey] || dict.pages.simple.notFound;

  return (
    <>
      <PageIntro eyebrow="PRAVAC" title={title} text={text} />
      <ContactCTA copy={c} />
    </>
  );
}

function SimpleHeroSearch({ copy: c }) {
  const onSubmit = (event) => {
    event.preventDefault();
    document.getElementById('featured-cars')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <form className="grid gap-3 rounded-lg bg-white p-4 text-ink shadow-soft sm:grid-cols-3" onSubmit={onSubmit}>
      <LocationSelect label={c.pickup} name="pickupLocation" />
      <Field label={c.pickupDate} name="pickupDate" type="date" defaultValue="2026-05-06" />
      <Field label={c.returnDate} name="returnDate" type="date" defaultValue="2026-05-09" />
      <button className="button-primary h-12 w-full gap-2 sm:col-span-3" type="submit">
        <Car size={18} /> {c.showCars}
      </button>
    </form>
  );
}

function ServiceShortcut({ copy: c, item, label }) {
  const Icon = item.icon;

  return (
    <Link className="group flex min-h-14 items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 transition hover:border-pravac-orange hover:bg-orange-50/60" href={item.href}>
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-pravac-blue text-white">
          <Icon size={18} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-graphite">{label}</span>
          <span className="block truncate text-xs text-zinc-500">{item.text}</span>
        </span>
      </span>
      <span className="shrink-0 text-pravac-orange">
        <ArrowRight size={17} aria-label={c.open || copy.en.open} />
      </span>
    </Link>
  );
}

function TrustStrip({ className = '' }) {
  return (
    <div className={`grid gap-2 text-sm font-semibold text-zinc-200 sm:grid-cols-3 ${className}`}>
      {whyItems.map((item) => (
        <div className="flex items-center gap-2 border-l-2 border-pravac-orange/70 pl-3" key={item}>
          <CheckCircle2 className="shrink-0 text-pravac-orange" size={17} />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function CompactCarCard({ copy: c, model }) {
  return (
    <Link className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:-translate-y-1 hover:border-pravac hover:shadow-soft" href="/sk/short-term-car-rental">
      <VehicleMedia model={model} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-graphite">{model.title}</h3>
            <p className="mt-1 text-sm font-bold text-pravac">{model.category}</p>
          </div>
          <p className="shrink-0 text-right text-sm font-black text-graphite">{c.from} {model.dailyPriceFrom} EUR/{c.day}</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-xs font-bold text-zinc-600">
          <span className="inline-flex items-center gap-1"><Users size={15} /> {model.seats}</span>
          <span className="inline-flex items-center gap-1"><Car size={15} /> {model.transmission}</span>
          <span className="inline-flex items-center gap-1"><Luggage size={15} /> {model.luggage}</span>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-sm text-zinc-600">{c.deposit} {model.depositFrom} EUR</span>
          <span className="inline-flex items-center gap-2 text-sm font-black text-pravac">{c.view} <ArrowRight size={16} /></span>
        </div>
      </div>
    </Link>
  );
}

function ContactCTA({ copy: c, standalone = false }) {
  return (
    <section className={`bg-pravac-blue text-white ${standalone ? 'py-12 md:py-20' : 'py-10 md:py-16'}`}>
      <div className="container-shell grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-pravac-orange">{c.contactEyebrow}</p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">{c.contactTitle}</h2>
          <p className="mt-4 max-w-2xl text-zinc-300">{c.contactText}</p>
          <div className="mt-6 grid gap-3 text-sm font-semibold text-zinc-200 sm:grid-cols-3">
            <span className="inline-flex items-center gap-2"><Phone size={17} className="text-pravac" /> {contact.phone}</span>
            <span className="inline-flex items-center gap-2"><Mail size={17} className="text-pravac" /> {contact.email}</span>
            <span className="inline-flex items-center gap-2"><MapPin size={17} className="text-pravac" /> {contact.address}</span>
          </div>
        </div>
        <Link className="button-primary h-12 gap-2" href="/sk/contact">
          <Send size={18} /> {c.requestCar}
        </Link>
      </div>
    </section>
  );
}

function LeadForm({ button, copy: c, fields, leadType, sentText }) {
  const [sent, setSent] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    appendCollectionItem('longTermLeads', {
      id: createId(`${leadType}-lead`),
      leadType,
      createdAt: new Date().toISOString(),
      status: 'new',
      fields: Object.fromEntries(form.entries()),
    });
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <form className="mt-6 grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-2 md:p-5 lg:grid-cols-3" onSubmit={onSubmit}>
      {fields.map(([name, label, type = 'text']) => (
        <Field key={name} label={label} name={name} type={type} required />
      ))}
      <label className="md:col-span-2 lg:col-span-3">
        <span className="field-label">{c.comment}</span>
        <textarea className="input-base min-h-28" name="comment" placeholder={c.commentPlaceholder} />
      </label>
      <div className="md:col-span-2 lg:col-span-3">
        <button className="button-primary h-12 w-full gap-2 sm:w-auto" type="submit">
          <Send size={18} /> {button}
        </button>
      </div>
      {sent && <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 md:col-span-2 lg:col-span-3">{sentText}</p>}
    </form>
  );
}

function PublicSection({ children, eyebrow, id, muted = false, title }) {
  return (
    <section className={`${muted ? 'bg-smoke' : 'bg-white'} py-9 md:py-16`} id={id}>
      <div className="container-shell">
        {(eyebrow || title) && (
          <div className="mb-7 max-w-3xl">
            {eyebrow && <p className="text-sm font-bold uppercase tracking-[0.18em] text-pravac">{eyebrow}</p>}
            {title && <h2 className="mt-3 text-3xl font-black text-graphite md:text-5xl">{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

function PageIntro({ eyebrow, text, title }) {
  return (
    <section className="bg-pravac-blue pt-28 text-white md:pt-36">
      <div className="container-shell pb-8 md:pb-14">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-pravac-orange md:text-sm">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight md:mt-4 md:text-6xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 md:mt-5 md:text-base md:leading-7">{text}</p>
      </div>
    </section>
  );
}

function BenefitRow({ items }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <div className="flex items-center gap-3 rounded-md bg-pravac-blue/[0.04] px-1 py-2" key={item}>
          <ShieldCheck className="shrink-0 text-pravac-orange" size={21} />
          <p className="font-black text-graphite">{item}</p>
        </div>
      ))}
    </div>
  );
}

function LocationSelect({ label, name }) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <select className="input-base" name={name} defaultValue="bratislava-center" required>
        {locations.filter((location) => location.pickupAvailable).map((location) => (
          <option key={location.id} value={location.id}>{location.name}</option>
        ))}
      </select>
    </label>
  );
}

function Field({ label, ...props }) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <input className="input-base" {...props} />
    </label>
  );
}

function VehicleMedia({ model }) {
  return <VehicleImagePlaceholder className="aspect-[16/10]" model={model} />;
}
