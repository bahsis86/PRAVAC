import { CalendarX, Car, ClipboardList, FileText, Gauge, LogOut, MapPin, Settings, Shield, Tag } from 'lucide-react';
import { useState } from 'react';
import { LanguageSelect } from '../LanguageSelect.jsx';
import { adminUsers } from '../../data/adminUsers.js';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { createId, getMockStore, isAdminSessionActive, saveCollection, setAdminSession } from '../../utils/storage.js';

const tabs = [
  ['dashboard', 'dashboard', Gauge],
  ['cars', 'cars', Car],
  ['units', 'units', Shield],
  ['availability', 'availability', CalendarX],
  ['bookings', 'bookings', ClipboardList],
  ['pricing', 'pricing', Tag],
  ['extras', 'extras', Settings],
  ['locations', 'locations', MapPin],
  ['documents', 'documents', FileText],
];

const bookingStatuses = ['pending_confirmation', 'pending_prepayment', 'confirmed', 'cancelled_by_client', 'cancelled_by_manager', 'completed', 'no_show'];
const unitStatuses = ['available', 'service', 'hidden', 'sold', 'inactive'];

export default function AdminPanel() {
  const { language } = useI18n();
  const text = adminCopy[language] || adminCopy.en;
  const [loggedIn, setLoggedIn] = useState(() => isAdminSessionActive());
  const [store, setStore] = useState(() => getMockStore());
  const [activeTab, setActiveTab] = useState('dashboard');

  const refresh = () => setStore(getMockStore());
  const save = (name, value) => {
    saveCollection(name, value);
    refresh();
  };

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} text={text} />;

  const Active = {
    dashboard: Dashboard,
    cars: CarsSection,
    units: UnitsSection,
    availability: AvailabilitySection,
    bookings: BookingsSection,
    pricing: PricingSection,
    extras: ExtrasSection,
    locations: LocationsSection,
    documents: DocumentsSection,
  }[activeTab];

  return (
    <main className="min-h-screen bg-zinc-100 text-ink">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="bg-graphite p-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-2xl font-black tracking-tight">PRAVAC</p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">{text.mockAdmin}</p>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelect compact />
              <button
                className="rounded-md bg-white/10 p-2 text-white hover:bg-white/20"
                type="button"
                onClick={() => {
                  setAdminSession(false);
                  setLoggedIn(false);
                }}
                aria-label={text.logout}
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
          <nav className="mt-8 grid gap-1">
            {tabs.map(([id, labelKey, Icon]) => (
              <button
                key={id}
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-bold transition ${activeTab === id ? 'bg-pravac text-white' : 'text-zinc-300 hover:bg-white/10 hover:text-white'}`}
                type="button"
                onClick={() => setActiveTab(id)}
              >
                <Icon size={18} /> {text.tabs[labelKey]}
              </button>
            ))}
          </nav>
        </aside>
        <section className="p-4 md:p-8">
          <Active store={store} save={save} refresh={refresh} text={text} />
        </section>
      </div>
    </main>
  );
}

function AdminLogin({ onLogin, text }) {
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const user = adminUsers.find((item) => item.email === form.get('email') && item.password === form.get('password'));
    if (!user) {
      setError('Invalid test credentials.');
      return;
    }
    setAdminSession(true);
    onLogin();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-graphite p-4">
      <form className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft" onSubmit={submit}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-pravac">PRAVAC admin</p>
          <div className="rounded-md bg-graphite p-1"><LanguageSelect compact /></div>
        </div>
        <h1 className="mt-3 text-3xl font-black text-graphite">{text.loginTitle}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">{text.loginNote}</p>
        <label className="mt-6 block">
          <span className="field-label">Email</span>
          <input className="input-base" name="email" type="email" required />
        </label>
        <label className="mt-4 block">
          <span className="field-label">Password</span>
          <input className="input-base" name="password" type="password" required />
        </label>
        {error && <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
        <button className="button-primary mt-6 w-full" type="submit">{text.login}</button>
      </form>
    </main>
  );
}

function SectionTitle({ title, text }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-black text-graphite">{title}</h1>
      {text && <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">{text}</p>}
    </div>
  );
}

function Dashboard({ store, text }) {
  const pending = store.bookings.filter((booking) => booking.status.startsWith('pending'));
  const activeUnits = store.vehicleUnits.filter((unit) => unit.active && unit.status === 'available');
  const upcoming = [...store.availabilityBlocks].sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)).slice(0, 6);

  return (
    <>
      <SectionTitle title={text.tabs.dashboard} text={text.dashboardIntro} />
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label={text.vehicleModels} value={store.vehicleModels.length} />
        <Stat label={text.activeUnits} value={activeUnits.length} />
        <Stat label={text.newBookings} value={pending.length} />
        <Stat label={text.longTermLeads} value={store.longTermLeads.length} />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title={text.nearestBlocks}>
          <SimpleList items={upcoming.map((block) => `${block.vehicleUnitId} | ${block.startDateTime} - ${block.endDateTime} | ${block.type}`)} />
        </Panel>
        <Panel title={text.pendingActions}>
          <SimpleList items={[...pending.map((booking) => `${booking.customerName} | ${booking.status} | ${booking.estimatedTotal} €`), ...store.longTermLeads.map((lead) => `${lead.customerName} | long-term lead | ${lead.rentalPeriod}`)]} empty="No pending actions." />
        </Panel>
      </div>
    </>
  );
}

function CarsSection({ store, save, text }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [selectedId, setSelectedId] = useState(store.vehicleModels[0]?.id);
  const selected = store.vehicleModels.find((model) => model.id === selectedId);
  const categories = [...new Set(store.vehicleModels.map((model) => model.category))];
  const filtered = store.vehicleModels.filter((model) => (
    (!query || model.title.toLowerCase().includes(query.toLowerCase()))
    && (!category || model.category === category)
  ));

  const updateModel = (patch) => {
    save('vehicleModels', store.vehicleModels.map((model) => (model.id === selected.id ? { ...model, ...patch } : model)));
  };

  return (
    <>
      <SectionTitle title={text.tabs.cars} text={text.carsIntro} />
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <Panel>
          <div className="grid gap-3 md:grid-cols-3">
            <input className="input-base !mt-0" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.searchCar} />
            <select className="input-base !mt-0" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">{text.allCategories}</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="mt-4 grid gap-2">
            {filtered.map((model) => (
              <button key={model.id} className={`rounded-md border p-4 text-left ${selectedId === model.id ? 'border-pravac bg-red-50' : 'border-zinc-100 bg-white'}`} type="button" onClick={() => setSelectedId(model.id)}>
                <span className="font-black text-graphite">{model.title}</span>
                <span className="ml-3 text-sm text-zinc-500">{model.category} | {model.dailyPriceFrom} € | {model.active ? 'active' : 'hidden'}</span>
              </button>
            ))}
          </div>
        </Panel>
        {selected && (
          <Panel title={`${text.edit} ${selected.title}`}>
            <AdminInput label={text.title} value={selected.title} onChange={(value) => updateModel({ title: value })} />
            <AdminInput label={text.category} value={selected.category} onChange={(value) => updateModel({ category: value })} />
            <AdminInput label={text.dailyPrice} type="number" value={selected.dailyPriceFrom} onChange={(value) => updateModel({ dailyPriceFrom: Number(value) })} />
            <AdminInput label={text.depositFrom} type="number" value={selected.depositFrom} onChange={(value) => updateModel({ depositFrom: Number(value) })} />
            <AdminInput label={text.seats} type="number" value={selected.seats} onChange={(value) => updateModel({ seats: Number(value) })} />
            <AdminInput label={text.transmission} value={selected.transmission} onChange={(value) => updateModel({ transmission: value })} />
            <AdminInput label={text.fuelType} value={selected.fuelType} onChange={(value) => updateModel({ fuelType: value })} />
            <AdminInput label={text.tagsCsv} value={selected.tags.join(', ')} onChange={(value) => updateModel({ tags: value.split(',').map((tag) => tag.trim()).filter(Boolean) })} />
            <label className="mt-4 flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={selected.active} onChange={(event) => updateModel({ active: event.target.checked })} /> {text.active}</label>
            <label className="mt-2 flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={selected.featured} onChange={(event) => updateModel({ featured: event.target.checked })} /> {text.featured}</label>
          </Panel>
        )}
      </div>
    </>
  );
}

function UnitsSection({ store, save, text }) {
  const updateUnit = (id, patch) => save('vehicleUnits', store.vehicleUnits.map((unit) => (unit.id === id ? { ...unit, ...patch } : unit)));
  return (
    <>
      <SectionTitle title={text.tabs.units} text={text.unitsIntro} />
      <Panel>
        <div className="grid gap-3">
          {store.vehicleUnits.map((unit) => {
            const model = store.vehicleModels.find((item) => item.id === unit.vehicleModelId);
            return (
              <div key={unit.id} className="grid gap-3 rounded-md border border-zinc-100 bg-white p-4 md:grid-cols-[1fr_160px_160px_100px] md:items-center">
                <div><p className="font-black">{model?.title}</p><p className="text-sm text-zinc-500">{unit.internalName} | {unit.mockPlate}</p></div>
                <select className="input-base !mt-0" value={unit.status} onChange={(event) => updateUnit(unit.id, { status: event.target.value })}>
                  {unitStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <select className="input-base !mt-0" value={unit.currentLocationId} onChange={(event) => updateUnit(unit.id, { currentLocationId: event.target.value })}>
                  {store.locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={unit.active} onChange={(event) => updateUnit(unit.id, { active: event.target.checked })} /> {text.active}</label>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}

function AvailabilitySection({ store, save, text }) {
  const addBlock = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    save('availabilityBlocks', [...store.availabilityBlocks, {
      id: createId('block'),
      vehicleUnitId: form.get('vehicleUnitId'),
      startDateTime: form.get('startDateTime'),
      endDateTime: form.get('endDateTime'),
      type: form.get('type'),
      status: 'active',
      reason: form.get('reason'),
      bookingId: null,
    }]);
    event.currentTarget.reset();
  };

  return (
    <>
      <SectionTitle title={text.tabs.availability} text={text.availabilityIntro} />
      <Panel title={text.addManualBlock}>
        <form className="grid gap-3 md:grid-cols-5" onSubmit={addBlock}>
          <select className="input-base !mt-0" name="vehicleUnitId" required>
            {store.vehicleUnits.map((unit) => <option key={unit.id} value={unit.id}>{unit.internalName} | {unit.mockPlate}</option>)}
          </select>
          <input className="input-base !mt-0" name="startDateTime" type="datetime-local" required />
          <input className="input-base !mt-0" name="endDateTime" type="datetime-local" required />
          <select className="input-base !mt-0" name="type" defaultValue="manual_block">
            {['manual_block', 'service', 'maintenance', 'preparation', 'corporate_reserve'].map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <button className="button-primary" type="submit">{text.addBlock}</button>
          <input className="input-base !mt-0 md:col-span-5" name="reason" placeholder={text.reason} required />
        </form>
      </Panel>
      <Panel title={text.blocks}>
        <Table rows={store.availabilityBlocks.map((block) => [block.vehicleUnitId, block.startDateTime, block.endDateTime, block.type, block.reason])} />
      </Panel>
    </>
  );
}

function BookingsSection({ store, save, text }) {
  const [selectedId, setSelectedId] = useState(store.bookings[0]?.id);
  const selected = store.bookings.find((booking) => booking.id === selectedId);
  const updateBooking = (patch) => save('bookings', store.bookings.map((booking) => (booking.id === selected.id ? { ...booking, ...patch, finalPrice: Number(patch.finalPrice ?? booking.finalPrice) } : booking)));

  return (
    <>
      <SectionTitle title={text.tabs.bookings} text={text.bookingsIntro} />
      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <Panel>
          <div className="grid gap-2">
            {store.bookings.map((booking) => {
              const model = store.vehicleModels.find((item) => item.id === booking.vehicleModelId);
              return (
                <button key={booking.id} className={`rounded-md border p-4 text-left ${selectedId === booking.id ? 'border-pravac bg-red-50' : 'border-zinc-100 bg-white'}`} type="button" onClick={() => setSelectedId(booking.id)}>
                  <span className="font-black">{booking.customerName}</span>
                  <span className="ml-3 text-sm text-zinc-500">{model?.title} | {booking.status} | {booking.estimatedTotal} €</span>
                </button>
              );
            })}
          </div>
        </Panel>
        {selected && (
          <Panel title={text.bookingDetail}>
            <p className="text-sm text-zinc-500">{selected.pickupDateTime} - {selected.returnDateTime}</p>
            <select className="input-base" value={selected.status} onChange={(event) => updateBooking({ status: event.target.value })}>
              {bookingStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <AdminInput label={text.managerAdjustment} type="number" value={selected.managerAdjustmentAmount || 0} onChange={(value) => updateBooking({ managerAdjustmentAmount: Number(value), finalPrice: Number(selected.estimatedTotal) + Number(value) })} />
            <AdminInput label={text.finalPrice} type="number" value={selected.finalPrice} onChange={(value) => updateBooking({ finalPrice: Number(value) })} />
            <label className="mt-4 block">
              <span className="field-label">{text.managerNote}</span>
              <textarea className="input-base min-h-28" value={selected.managerNote || ''} onChange={(event) => updateBooking({ managerNote: event.target.value })} />
            </label>
            <dl className="mt-4 grid gap-2 text-sm">
              <Breakdown label={text.base} value={`${selected.calculatedBasePrice} €`} />
              <Breakdown label={text.discount} value={`-${selected.discountAmount} €`} />
              <Breakdown label={text.locationFees} value={`${selected.locationFees} €`} />
              <Breakdown label={text.extras} value={`${selected.extrasTotal} €`} />
              <Breakdown label={text.prepayment} value={`${selected.prepaymentAmount} €`} />
              <Breakdown label={text.depositFrom} value={`${selected.depositFrom} €`} />
            </dl>
          </Panel>
        )}
      </div>
    </>
  );
}

function PricingSection({ store, save, text }) {
  const addTier = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    save('pricingTiers', [...store.pricingTiers, {
      id: createId('tier'),
      category: form.get('category'),
      vehicleModelId: null,
      fromDays: Number(form.get('fromDays')),
      discountType: 'percent',
      discountValue: Number(form.get('discountValue')),
      active: true,
    }]);
    event.currentTarget.reset();
  };
  const updateTier = (id, patch) => save('pricingTiers', store.pricingTiers.map((tier) => (tier.id === id ? { ...tier, ...patch } : tier)));

  return (
    <>
      <SectionTitle title={text.tabs.pricing} text={text.pricingIntro} />
      <Panel title={text.settings}>
        <AdminInput label={text.prepaymentPercent} type="number" value={store.pricingSettings.prepaymentPercent} onChange={(value) => save('pricingSettings', { ...store.pricingSettings, prepaymentPercent: Number(value) })} />
      </Panel>
      <Panel title={text.addTier}>
        <form className="grid gap-3 md:grid-cols-4" onSubmit={addTier}>
          <input className="input-base !mt-0" name="category" placeholder="all or category" defaultValue="all" required />
          <input className="input-base !mt-0" name="fromDays" type="number" placeholder="From days" required />
          <input className="input-base !mt-0" name="discountValue" type="number" placeholder="Discount %" required />
          <button className="button-primary" type="submit">{text.addTier}</button>
        </form>
      </Panel>
      <Panel title={text.tiers}>
        <div className="grid gap-2">
          {store.pricingTiers.map((tier) => (
            <div key={tier.id} className="grid gap-3 rounded-md border border-zinc-100 bg-white p-4 md:grid-cols-5 md:items-center">
              <input className="input-base !mt-0" value={tier.category || ''} onChange={(event) => updateTier(tier.id, { category: event.target.value })} />
              <input className="input-base !mt-0" type="number" value={tier.fromDays} onChange={(event) => updateTier(tier.id, { fromDays: Number(event.target.value) })} />
              <input className="input-base !mt-0" type="number" value={tier.discountValue} onChange={(event) => updateTier(tier.id, { discountValue: Number(event.target.value) })} />
              <span className="text-sm font-bold">{text.percent}</span>
              <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={tier.active} onChange={(event) => updateTier(tier.id, { active: event.target.checked })} /> {text.active}</label>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function ExtrasSection({ store, save, text }) {
  const update = (id, patch) => save('extraServices', store.extraServices.map((service) => (service.id === id ? { ...service, ...patch } : service)));
  return (
    <>
      <SectionTitle title={text.tabs.extras} />
      <Panel>
        <div className="grid gap-3">
          {store.extraServices.map((service) => (
            <div key={service.id} className="grid gap-3 rounded-md border border-zinc-100 bg-white p-4 md:grid-cols-[1fr_120px_160px_120px] md:items-center">
              <div><p className="font-black">{service.title}</p><p className="text-sm text-zinc-500">{service.description}</p></div>
              <input className="input-base !mt-0" type="number" value={service.price} onChange={(event) => update(service.id, { price: Number(event.target.value) })} />
              <select className="input-base !mt-0" value={service.priceType} onChange={(event) => update(service.id, { priceType: event.target.value })}>
                {['per_booking', 'per_day', 'per_unit'].map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={service.active} onChange={(event) => update(service.id, { active: event.target.checked })} /> {text.active}</label>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function LocationsSection({ store, save, text }) {
  const update = (id, patch) => save('locations', store.locations.map((location) => (location.id === id ? { ...location, ...patch } : location)));
  return (
    <>
      <SectionTitle title={text.tabs.locations} />
      <Panel>
        <div className="grid gap-3">
          {store.locations.map((location) => (
            <div key={location.id} className="grid gap-3 rounded-md border border-zinc-100 bg-white p-4 md:grid-cols-[1fr_110px_110px_110px_110px] md:items-center">
              <div><p className="font-black">{location.name}</p><p className="text-sm text-zinc-500">{location.type} | {location.workingHours}</p></div>
              <input className="input-base !mt-0" type="number" value={location.pickupFee} onChange={(event) => update(location.id, { pickupFee: Number(event.target.value) })} />
              <input className="input-base !mt-0" type="number" value={location.returnFee} onChange={(event) => update(location.id, { returnFee: Number(event.target.value) })} />
              <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={location.pickupAvailable} onChange={(event) => update(location.id, { pickupAvailable: event.target.checked })} /> {text.pickup}</label>
              <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={location.returnAvailable} onChange={(event) => update(location.id, { returnAvailable: event.target.checked })} /> {text.return}</label>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function DocumentsSection({ store, save, text }) {
  const update = (id, patch) => save('documents', store.documents.map((document) => (document.id === id ? { ...document, ...patch } : document)));
  return (
    <>
      <SectionTitle title={text.tabs.documents} />
      <div className="grid gap-4">
        {store.documents.map((document) => (
          <Panel key={document.id} title={document.title}>
            <textarea className="input-base min-h-36" value={document.content} onChange={(event) => update(document.id, { content: event.target.value })} />
          </Panel>
        ))}
      </div>
    </>
  );
}

function Stat({ label, value }) {
  return <div className="rounded-lg bg-white p-5 shadow-sm"><p className="text-sm font-bold text-zinc-500">{label}</p><p className="mt-2 text-3xl font-black text-graphite">{value}</p></div>;
}

function Panel({ title, children }) {
  return <section className="mb-5 rounded-lg bg-white p-5 shadow-sm">{title && <h2 className="mb-4 text-xl font-black text-graphite">{title}</h2>}{children}</section>;
}

function SimpleList({ items, empty = 'Nothing to show.' }) {
  return items.length ? <ul className="grid gap-2 text-sm text-zinc-700">{items.map((item) => <li key={item} className="rounded-md bg-zinc-50 p-3">{item}</li>)}</ul> : <p className="text-sm text-zinc-500">{empty}</p>;
}

function Table({ rows }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><tbody>{rows.map((row) => <tr key={row.join('|')} className="border-b border-zinc-100">{row.map((cell, index) => <td key={`${cell}-${index}`} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>;
}

function AdminInput({ label, value, onChange, type = 'text' }) {
  return (
    <label className="mt-4 block">
      <span className="field-label">{label}</span>
      <input className="input-base" type={type} value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Breakdown({ label, value }) {
  return <div className="flex justify-between gap-4 border-b border-zinc-100 pb-2"><dt className="text-zinc-500">{label}</dt><dd className="font-black">{value}</dd></div>;
}

const baseAdminCopy = {
  mockAdmin: 'Mock admin',
  logout: 'Logout',
  loginTitle: 'Mock login',
  loginNote: 'Test authorization only. Replace with Directus/backend authentication before production.',
  login: 'Login',
  dashboardIntro: 'Operational snapshot from mock localStorage data.',
  vehicleModels: 'Vehicle models',
  activeUnits: 'Active units',
  newBookings: 'New bookings',
  longTermLeads: 'Long-term leads',
  nearestBlocks: 'Nearest blocks / bookings',
  pendingActions: 'Pending actions',
  longTermLead: 'long-term lead',
  noPending: 'No pending actions.',
  carsIntro: 'Edit public vehicle cards, prices, deposits, active state and tags.',
  searchCar: 'Search car',
  allCategories: 'All categories',
  edit: 'Edit',
  title: 'Title',
  category: 'Category',
  dailyPrice: 'Daily price',
  depositFrom: 'Deposit from',
  seats: 'Seats',
  transmission: 'Transmission',
  fuelType: 'Fuel type',
  tagsCsv: 'Tags CSV',
  active: 'Active',
  featured: 'Featured',
  unitsIntro: 'Physical cars used for availability checks.',
  availabilityIntro: 'Manual blocks here immediately affect public search results.',
  addManualBlock: 'Add manual block',
  addBlock: 'Add block',
  reason: 'Reason',
  blocks: 'Blocks',
  bookingsIntro: 'Review booking details, status, final price and manager notes.',
  bookingDetail: 'Booking detail',
  managerAdjustment: 'Manager adjustment',
  finalPrice: 'Final price',
  managerNote: 'Manager note',
  base: 'Base',
  discount: 'Discount',
  locationFees: 'Location fees',
  extras: 'Extras',
  prepayment: 'Prepayment',
  pricingIntro: 'Duration discounts and prepayment percentage.',
  settings: 'Settings',
  prepaymentPercent: 'Prepayment percent',
  addTier: 'Add tier',
  tiers: 'Tiers',
  percent: 'percent',
  pickup: 'Pickup',
  return: 'Return',
  tabs: {
    dashboard: 'Dashboard',
    cars: 'Cars',
    units: 'Vehicle Units',
    availability: 'Availability',
    bookings: 'Bookings',
    pricing: 'Pricing',
    extras: 'Extra Services',
    locations: 'Locations',
    documents: 'Documents / Terms',
  },
};

const adminCopy = {
  en: baseAdminCopy,
  sk: {
    ...baseAdminCopy,
    mockAdmin: 'Mock admin',
    logout: 'Odhlasit',
    loginTitle: 'Testovacie prihlasenie',
    loginNote: 'Iba testovacia autorizacia. Pred produkciou ju nahradte Directus/backend prihlasenim.',
    login: 'Prihlasit',
    dashboardIntro: 'Prevadzkovy prehlad z mock localStorage dat.',
    vehicleModels: 'Modely vozidiel',
    activeUnits: 'Aktivne vozidla',
    newBookings: 'Nove rezervacie',
    longTermLeads: 'Dlhodobe dopyty',
    nearestBlocks: 'Najblizsie blokacie / rezervacie',
    pendingActions: 'Cakajuce akcie',
    longTermLead: 'dlhodoby dopyt',
    noPending: 'Ziadne cakajuce akcie.',
    carsIntro: 'Uprava verejnych kariet vozidiel, cien, depozitov, aktivnosti a tagov.',
    searchCar: 'Hladat auto',
    allCategories: 'Vsetky kategorie',
    edit: 'Upravit',
    title: 'Nazov',
    category: 'Kategoria',
    dailyPrice: 'Cena za den',
    depositFrom: 'Depozit od',
    seats: 'Miesta',
    transmission: 'Prevodovka',
    fuelType: 'Palivo',
    tagsCsv: 'Tagy CSV',
    active: 'Aktivne',
    featured: 'Odporucane',
    unitsIntro: 'Fyzicke auta pouzivane pri kontrole dostupnosti.',
    availabilityIntro: 'Manualne blokacie okamzite ovplyvnia verejne vysledky hladania.',
    addManualBlock: 'Pridat manualnu blokaciu',
    addBlock: 'Pridat blokaciu',
    reason: 'Dovod',
    blocks: 'Blokacie',
    bookingsIntro: 'Kontrola rezervacii, statusov, finalnej ceny a poznamok manazera.',
    bookingDetail: 'Detail rezervacie',
    managerAdjustment: 'Uprava manazera',
    finalPrice: 'Finalna cena',
    managerNote: 'Poznamka manazera',
    base: 'Zaklad',
    discount: 'Zlava',
    locationFees: 'Poplatky za lokacie',
    extras: 'Doplnky',
    prepayment: 'Zaloha',
    pricingIntro: 'Zlavy za dlzku a percento zalohy.',
    settings: 'Nastavenia',
    prepaymentPercent: 'Percento zalohy',
    addTier: 'Pridat pravidlo',
    tiers: 'Pravidla',
    percent: 'percent',
    pickup: 'Prevzatie',
    return: 'Vratenie',
    tabs: {
      dashboard: 'Prehlad',
      cars: 'Autá',
      units: 'Fyzicke auta',
      availability: 'Dostupnost',
      bookings: 'Rezervacie',
      pricing: 'Ceny',
      extras: 'Doplnkove sluzby',
      locations: 'Lokacie',
      documents: 'Dokumenty / podmienky',
    },
  },
  ru: {
    ...baseAdminCopy,
    logout: 'Выйти',
    loginTitle: 'Тестовый вход',
    loginNote: 'Это только тестовая авторизация. Перед production замените ее на Directus/backend authentication.',
    login: 'Войти',
    dashboardIntro: 'Операционный обзор mock-данных из localStorage.',
    vehicleModels: 'Модели авто',
    activeUnits: 'Активные машины',
    newBookings: 'Новые брони',
    longTermLeads: 'Долгосрочные заявки',
    nearestBlocks: 'Ближайшие блокировки / брони',
    pendingActions: 'Ожидающие действия',
    longTermLead: 'долгосрочная заявка',
    noPending: 'Нет ожидающих действий.',
    carsIntro: 'Редактирование публичных карточек, цен, депозитов, активности и тегов.',
    searchCar: 'Поиск авто',
    allCategories: 'Все категории',
    edit: 'Редактировать',
    title: 'Название',
    category: 'Категория',
    dailyPrice: 'Цена за день',
    depositFrom: 'Депозит от',
    seats: 'Места',
    transmission: 'Коробка',
    fuelType: 'Топливо',
    tagsCsv: 'Теги CSV',
    active: 'Активно',
    featured: 'Рекомендуемое',
    unitsIntro: 'Физические автомобили, которые используются для проверки доступности.',
    availabilityIntro: 'Ручные блокировки сразу влияют на публичные результаты поиска.',
    addManualBlock: 'Добавить ручную блокировку',
    addBlock: 'Добавить блокировку',
    reason: 'Причина',
    blocks: 'Блокировки',
    bookingsIntro: 'Просмотр броней, статусов, финальной цены и комментариев менеджера.',
    bookingDetail: 'Детали брони',
    managerAdjustment: 'Корректировка менеджера',
    finalPrice: 'Финальная цена',
    managerNote: 'Комментарий менеджера',
    base: 'База',
    discount: 'Скидка',
    locationFees: 'Сборы за локации',
    extras: 'Доп. услуги',
    prepayment: 'Предоплата',
    pricingIntro: 'Скидки за срок и процент предоплаты.',
    settings: 'Настройки',
    prepaymentPercent: 'Процент предоплаты',
    addTier: 'Добавить правило',
    tiers: 'Правила',
    percent: 'процент',
    pickup: 'Получение',
    return: 'Возврат',
    tabs: {
      dashboard: 'Дашборд',
      cars: 'Авто',
      units: 'Физические машины',
      availability: 'Доступность',
      bookings: 'Брони',
      pricing: 'Цены',
      extras: 'Доп. услуги',
      locations: 'Локации',
      documents: 'Документы / условия',
    },
  },
  tr: {
    ...baseAdminCopy,
    logout: 'Cikis',
    loginTitle: 'Mock giris',
    loginNote: 'Bu yalnizca test yetkilendirmesidir. Production oncesi Directus/backend authentication ile degistirin.',
    login: 'Giris',
    dashboardIntro: 'localStorage mock verilerinden operasyon ozeti.',
    vehicleModels: 'Arac modelleri',
    activeUnits: 'Aktif araclar',
    newBookings: 'Yeni rezervasyonlar',
    longTermLeads: 'Uzun donem talepler',
    nearestBlocks: 'Yaklasan bloklar / rezervasyonlar',
    pendingActions: 'Bekleyen islemler',
    longTermLead: 'uzun donem talep',
    noPending: 'Bekleyen islem yok.',
    carsIntro: 'Arac kartlari, fiyatlar, depozitolar, aktiflik ve etiketleri duzenleyin.',
    searchCar: 'Arac ara',
    allCategories: 'Tum kategoriler',
    edit: 'Duzenle',
    title: 'Baslik',
    category: 'Kategori',
    dailyPrice: 'Gunluk fiyat',
    depositFrom: 'Depozito',
    seats: 'Koltuk',
    transmission: 'Vites',
    fuelType: 'Yakit',
    tagsCsv: 'Etiketler CSV',
    active: 'Aktif',
    featured: 'One cikan',
    unitsIntro: 'Uygunluk kontrolunde kullanilan fiziksel araclar.',
    availabilityIntro: 'Manuel bloklar herkese acik arama sonuclarini hemen etkiler.',
    addManualBlock: 'Manuel blok ekle',
    addBlock: 'Blok ekle',
    reason: 'Neden',
    blocks: 'Bloklar',
    bookingsIntro: 'Rezervasyon detaylari, durum, final fiyat ve yonetici notlari.',
    bookingDetail: 'Rezervasyon detayi',
    managerAdjustment: 'Yonetici duzenlemesi',
    finalPrice: 'Final fiyat',
    managerNote: 'Yonetici notu',
    base: 'Temel',
    discount: 'Indirim',
    locationFees: 'Lokasyon ucretleri',
    extras: 'Ekler',
    prepayment: 'On odeme',
    pricingIntro: 'Sure indirimleri ve on odeme yuzdesi.',
    settings: 'Ayarlar',
    prepaymentPercent: 'On odeme yuzdesi',
    addTier: 'Kural ekle',
    tiers: 'Kurallar',
    percent: 'yuzde',
    pickup: 'Teslim alma',
    return: 'Iade',
    tabs: {
      dashboard: 'Panel',
      cars: 'Araclar',
      units: 'Fiziksel araclar',
      availability: 'Uygunluk',
      bookings: 'Rezervasyonlar',
      pricing: 'Fiyatlandirma',
      extras: 'Ek hizmetler',
      locations: 'Lokasyonlar',
      documents: 'Belgeler / kosullar',
    },
  },
};
