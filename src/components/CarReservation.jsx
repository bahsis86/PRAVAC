import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Car,
  Check,
  ChevronDown,
  Filter,
  Fuel,
  Gauge,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { findAvailableVehicleModels } from '../utils/availability.js';
import { getLocationName } from '../utils/displayText.js';
import { calculatePriceBreakdown } from '../utils/pricing.js';
import { appendCollectionItem, createId, getMockStore, loadCollection, saveCollection } from '../utils/storage.js';
import AmbientBackground from './visual/AmbientBackground.jsx';
import GlowCard from './visual/GlowCard.jsx';

const defaultSearch = {
  pickupLocationId: 'bratislava-center',
  returnLocationId: 'bratislava-airport',
  pickupDate: '2026-05-06',
  pickupTime: '09:00',
  returnDate: '2026-05-09',
  returnTime: '09:00',
};

const defaultFilters = {
  category: '',
  transmission: '',
  fuelType: '',
  minSeats: '',
  maxPrice: '',
  minLuggage: '',
  is4x4: false,
  isMinivan: false,
  isFamily: false,
  crossBorderAllowed: false,
};

export default function CarReservation() {
  const { t, language } = useI18n();
  const copy = flowCopy[language] || flowCopy.en;
  const [store, setStore] = useState(() => getMockStore());
  const [search, setSearch] = useState(defaultSearch);
  const [submittedSearch, setSubmittedSearch] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [contact, setContact] = useState({ customerName: '', customerPhone: '', customerEmail: '', customerComment: '' });
  const [bookingSent, setBookingSent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const refresh = () => setStore(getMockStore());
    window.addEventListener('pravac:mock-store-updated', refresh);
    return () => window.removeEventListener('pravac:mock-store-updated', refresh);
  }, []);

  useEffect(() => {
    const onHeroSearch = (event) => {
      const detail = event.detail || {};
      const next = fromHeroSearch(detail);
      setSearch(next);
      runSearch(next);
    };

    window.addEventListener('pravac:search-cars', onHeroSearch);
    return () => window.removeEventListener('pravac:search-cars', onHeroSearch);
  }, []);

  const normalizedSearch = submittedSearch ? toAvailabilitySearch(submittedSearch) : null;
  const baseResults = useMemo(
    () => (normalizedSearch ? findAvailableVehicleModels(normalizedSearch, store, defaultFilters) : null),
    [normalizedSearch, store],
  );
  const filteredResults = useMemo(
    () => (normalizedSearch ? findAvailableVehicleModels(normalizedSearch, store, filters) : null),
    [normalizedSearch, store, filters],
  );

  const pickupLocation = submittedSearch ? store.locations.find((location) => location.id === submittedSearch.pickupLocationId) : null;
  const returnLocation = submittedSearch ? store.locations.find((location) => location.id === submittedSearch.returnLocationId) : null;
  const selectedModel = selectedItem?.model || null;
  const breakdown = selectedModel && filteredResults ? calculatePriceBreakdown({
    model: selectedModel,
    rentalDays: filteredResults.rentalDays,
    pickupLocation,
    returnLocation,
    selectedExtraServiceIds: selectedExtras,
    extraServices: store.extraServices,
    pricingSettings: store.pricingSettings,
    pricingTiers: store.pricingTiers,
  }) : null;

  const activeStep = bookingSent ? 5 : selectedItem ? 3 : submittedSearch ? 2 : 1;
  const categories = [...new Set(store.vehicleModels.map((model) => model.category))];
  const transmissions = [...new Set(store.vehicleModels.map((model) => model.transmission))];
  const fuelTypes = [...new Set(store.vehicleModels.map((model) => model.fuelType))];

  function runSearch(nextSearch = search) {
    if (new Date(toDateTime(nextSearch.returnDate, nextSearch.returnTime)) <= new Date(toDateTime(nextSearch.pickupDate, nextSearch.pickupTime))) {
      setError(t('reservation.dateError'));
      return;
    }
    setError('');
    setLoading(true);
    setSelectedItem(null);
    setSelectedExtras([]);
    setBookingSent(null);
    window.setTimeout(() => {
      setSubmittedSearch(nextSearch);
      setLoading(false);
      document.getElementById('car-reservation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 280);
  }

  const submitSearch = (event) => {
    event.preventDefault();
    runSearch(search);
  };

  const updateSearch = (event) => {
    setSearch((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const updateFilter = (event) => {
    const { name, type, checked, value } = event.target;
    setFilters((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setMobileFiltersOpen(false);
  };

  const chooseVehicle = (item) => {
    setSelectedItem(item);
    setSelectedExtras([]);
    setContact({ customerName: '', customerPhone: '', customerEmail: '', customerComment: '' });
    window.setTimeout(() => document.getElementById('booking-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  };

  const submitBooking = (event) => {
    event.preventDefault();
    if (!selectedItem || !breakdown || !submittedSearch) return;
    const bookingId = createId('booking');
    const availabilitySearch = toAvailabilitySearch(submittedSearch);
    const booking = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      status: breakdown.prepaymentAmount > 0 ? 'pending_prepayment' : 'pending_confirmation',
      vehicleModelId: selectedItem.model.id,
      assignedVehicleUnitId: selectedItem.assignedUnit.id,
      pickupLocationId: submittedSearch.pickupLocationId,
      returnLocationId: submittedSearch.returnLocationId,
      pickupDateTime: availabilitySearch.pickupDateTime,
      returnDateTime: availabilitySearch.returnDateTime,
      rentalDays: breakdown.rentalDays,
      selectedExtraServices: selectedExtras,
      customerName: contact.customerName,
      customerPhone: contact.customerPhone,
      customerEmail: contact.customerEmail,
      customerComment: contact.customerComment,
      calculatedBasePrice: breakdown.basePrice,
      discountAmount: breakdown.discountAmount,
      locationFees: breakdown.locationFees,
      extrasTotal: breakdown.extrasTotal,
      estimatedTotal: breakdown.estimatedTotal,
      prepaymentPercent: breakdown.prepaymentPercent,
      prepaymentAmount: breakdown.prepaymentAmount,
      depositFrom: breakdown.depositFrom,
      managerAdjustmentAmount: 0,
      finalPrice: breakdown.estimatedTotal,
      managerNote: '',
    };

    appendCollectionItem('bookings', booking);
    saveCollection('availabilityBlocks', [
      ...loadCollection('availabilityBlocks'),
      {
        id: createId('block'),
        vehicleUnitId: selectedItem.assignedUnit.id,
        startDateTime: availabilitySearch.pickupDateTime,
        endDateTime: availabilitySearch.returnDateTime,
        type: 'booking',
        status: 'active',
        reason: `Booking ${bookingId}`,
        bookingId,
      },
    ]);
    setBookingSent(booking);
    setStore(getMockStore());
    window.setTimeout(() => document.getElementById('booking-confirmation')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  };

  return (
    <section className="relative overflow-hidden bg-[var(--pravac-black)] py-14 md:py-20">
      <AmbientBackground variant="section" />
      <div className="container-shell relative z-10" id="car-reservation">
        <StepProgress activeStep={activeStep} copy={copy} />

        {!bookingSent && (
          <RentalSearchPanel
            copy={copy}
            error={error}
            language={language}
            loading={loading}
            locations={store.locations}
            onChange={updateSearch}
            onSubmit={submitSearch}
            search={search}
          />
        )}

        {loading && <LoadingResults copy={copy} />}

        {!loading && submittedSearch && !bookingSent && filteredResults && (
          <>
            <SearchSummary
              copy={copy}
              language={language}
              onEdit={() => document.getElementById('rental-search-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              rentalDays={filteredResults.rentalDays}
              search={submittedSearch}
              store={store}
            />

            {!selectedItem && (
              <section className="mt-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-pravac">{copy.resultsEyebrow}</p>
                    <h2 className="mt-2 text-3xl font-black text-graphite md:text-5xl">{copy.resultsTitle}</h2>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                      {filteredResults.available.length} {copy.availableCars}
                      {baseResults?.available.length !== filteredResults.available.length ? ` / ${baseResults?.available.length} ${copy.beforeFilters}` : ''}
                    </p>
                  </div>
                  <button className="button-secondary gap-2 md:hidden" type="button" onClick={() => setMobileFiltersOpen((value) => !value)}>
                    <Filter size={18} /> {copy.filters}
                  </button>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
                  <VehicleFilterPanel
                    categories={categories}
                    clearFilters={clearFilters}
                    copy={copy}
                    filters={filters}
                    fuelTypes={fuelTypes}
                    mobileOpen={mobileFiltersOpen}
                    onChange={updateFilter}
                    transmissions={transmissions}
                  />
                  <VehicleResults
                    baseCount={baseResults?.available.length || 0}
                    copy={copy}
                    language={language}
                    onChoose={chooseVehicle}
                    pickupLocation={pickupLocation}
                    results={filteredResults}
                    returnLocation={returnLocation}
                    store={store}
                  />
                </div>
              </section>
            )}

            {selectedItem && breakdown && (
              <BookingDetailsStep
                bookingSent={bookingSent}
                breakdown={breakdown}
                contact={contact}
                copy={copy}
                language={language}
                onBack={() => setSelectedItem(null)}
                onContactChange={(event) => setContact((current) => ({ ...current, [event.target.name]: event.target.value }))}
                onSubmit={submitBooking}
                pickupLocation={pickupLocation}
                returnLocation={returnLocation}
                search={submittedSearch}
                selectedExtras={selectedExtras}
                selectedItem={selectedItem}
                setSelectedExtras={setSelectedExtras}
                store={store}
              />
            )}
          </>
        )}

        {bookingSent && selectedModel && breakdown && (
          <BookingConfirmation
            booking={bookingSent}
            breakdown={breakdown}
            copy={copy}
            language={language}
            pickupLocation={pickupLocation}
            returnLocation={returnLocation}
            search={submittedSearch}
            selectedExtras={selectedExtras}
            selectedModel={selectedModel}
            store={store}
          />
        )}
      </div>
    </section>
  );
}

function RentalSearchPanel({ copy, error, language, loading, locations, onChange, onSubmit, search }) {
  return (
    <section id="rental-search-panel" className="premium-panel overflow-hidden bg-graphite text-white shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[1fr_0.42fr]">
        <form className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 lg:p-7" onSubmit={onSubmit}>
          <div className="md:col-span-2 lg:col-span-3">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-200">{copy.searchEyebrow}</p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl">{copy.searchTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">{copy.searchIntro}</p>
          </div>
          <LocationSelect label={copy.pickupLocation} language={language} locations={locations.filter((location) => location.pickupAvailable)} name="pickupLocationId" value={search.pickupLocationId} onChange={onChange} />
          <LocationSelect label={copy.returnLocation} language={language} locations={locations.filter((location) => location.returnAvailable)} name="returnLocationId" value={search.returnLocationId} onChange={onChange} />
          <div className="hidden lg:block" />
          <Input label={copy.pickupDate} name="pickupDate" type="date" value={search.pickupDate} onChange={onChange} />
          <Input label={copy.pickupTime} name="pickupTime" type="time" value={search.pickupTime} onChange={onChange} />
          <Input label={copy.returnDate} name="returnDate" type="date" value={search.returnDate} onChange={onChange} />
          <Input label={copy.returnTime} name="returnTime" type="time" value={search.returnTime} onChange={onChange} />
          <button className="button-primary h-12 gap-2 md:col-span-2 lg:col-span-2" type="submit" disabled={loading}>
            <Search size={18} /> {loading ? copy.searching : copy.searchCars}
          </button>
          {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 md:col-span-2 lg:col-span-3">{error}</p>}
        </form>
        <div className="grid content-center gap-3 border-t border-white/10 bg-black/25 p-5 lg:border-l lg:border-t-0 lg:p-7">
          {copy.trustItems.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Check size={18} className="text-red-200" /> {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepProgress({ activeStep, copy }) {
  return (
    <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-sm backdrop-blur">
      <div className="grid grid-cols-5 gap-2">
        {copy.steps.map((step, index) => {
          const stepNumber = index + 1;
          const active = activeStep >= stepNumber;
          return (
            <div key={step} className="min-w-0">
              <div className={`h-1.5 rounded-full ${active ? 'bg-pravac' : 'bg-zinc-200'}`} />
              <p className={`mt-2 truncate text-xs font-black ${active ? 'text-graphite' : 'text-zinc-400'}`}>{stepNumber}. {step}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchSummary({ copy, language, onEdit, rentalDays, search, store }) {
  const pickupLocation = store.locations.find((location) => location.id === search.pickupLocationId);
  const returnLocation = store.locations.find((location) => location.id === search.returnLocationId);

  return (
    <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="grid gap-3 text-sm md:grid-cols-5">
          <SummaryItem label={copy.pickupLocation} value={getLocationName(pickupLocation, language)} />
          <SummaryItem label={copy.returnLocation} value={getLocationName(returnLocation, language)} />
          <SummaryItem label={copy.pickup} value={`${formatDate(search.pickupDate)} ${search.pickupTime}`} />
          <SummaryItem label={copy.return} value={`${formatDate(search.returnDate)} ${search.returnTime}`} />
          <SummaryItem label={copy.rentalDays} value={`${rentalDays} ${copy.days}`} />
        </div>
        <button className="button-secondary gap-2" type="button" onClick={onEdit}>
          <SlidersHorizontal size={18} /> {copy.editSearch}
        </button>
      </div>
    </section>
  );
}

function VehicleFilterPanel({ categories, clearFilters, copy, filters, fuelTypes, mobileOpen, onChange, transmissions }) {
  return (
    <aside className={`${mobileOpen ? 'block' : 'hidden'} rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-sm backdrop-blur lg:block lg:self-start lg:sticky lg:top-6`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-black text-graphite"><Filter size={18} className="text-pravac" /> {copy.filters}</h3>
        <button className="text-sm font-bold text-pravac" type="button" onClick={clearFilters}>{copy.clear}</button>
      </div>
      <div className="mt-5 grid gap-4">
        <SelectFilter label={copy.class} allLabel={copy.all} name="category" value={filters.category} onChange={onChange} options={categories} />
        <SelectFilter label={copy.transmission} allLabel={copy.all} name="transmission" value={filters.transmission} onChange={onChange} options={transmissions} />
        <SelectFilter label={copy.fuel} allLabel={copy.all} name="fuelType" value={filters.fuelType} onChange={onChange} options={fuelTypes} />
        <InputFilter label={copy.seatsMin} name="minSeats" value={filters.minSeats} onChange={onChange} type="number" min="1" />
        <InputFilter label={copy.maxPrice} name="maxPrice" value={filters.maxPrice} onChange={onChange} type="number" min="1" />
        <InputFilter label={copy.luggageMin} name="minLuggage" value={filters.minLuggage} onChange={onChange} type="number" min="0" />
        <CheckboxFilter label={copy.fourByFour} name="is4x4" checked={filters.is4x4} onChange={onChange} />
        <CheckboxFilter label={copy.minivan} name="isMinivan" checked={filters.isMinivan} onChange={onChange} />
        <CheckboxFilter label={copy.family} name="isFamily" checked={filters.isFamily} onChange={onChange} />
        <CheckboxFilter label={copy.crossBorder} name="crossBorderAllowed" checked={filters.crossBorderAllowed} onChange={onChange} />
      </div>
    </aside>
  );
}

function VehicleResults({ baseCount, copy, language, onChoose, pickupLocation, results, returnLocation, store }) {
  if (baseCount === 0) {
    return <EmptyState title={copy.noAvailableTitle} text={copy.noAvailableText} />;
  }

  if (results.available.length === 0) {
    return <EmptyState title={copy.noFilterTitle} text={copy.noFilterText} />;
  }

  return (
    <div className="grid gap-5">
      {results.available.map((item) => (
        <VehicleResultCard
          copy={copy}
          item={item}
          key={item.model.id}
          language={language}
          onChoose={() => onChoose(item)}
          pickupLocation={pickupLocation}
          results={results}
          returnLocation={returnLocation}
          store={store}
        />
      ))}
    </div>
  );
}

function VehicleResultCard({ copy, item, onChoose, pickupLocation, results, returnLocation, store }) {
  const { model, freeUnits } = item;
  const breakdown = calculatePriceBreakdown({
    model,
    rentalDays: results.rentalDays,
    pickupLocation,
    returnLocation,
    selectedExtraServiceIds: [],
    extraServices: store.extraServices,
    pricingSettings: store.pricingSettings,
    pricingTiers: store.pricingTiers,
  });

  return (
    <GlowCard className="overflow-hidden shadow-sm">
      <div className="grid lg:grid-cols-[315px_1fr_245px]">
        <VehicleMedia model={model} />
        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-pravac">{model.category}</p>
              <h3 className="mt-1 text-2xl font-black text-graphite">{model.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">{model.shortDescription}</p>
            </div>
            {breakdown.discountPercent > 0 && <Badge tone="green">{breakdown.discountPercent}% {copy.discountBadge}</Badge>}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 border-y border-zinc-100 py-4 text-sm text-zinc-600 sm:grid-cols-5">
            <Spec icon={<Gauge size={16} />} text={model.transmission} />
            <Spec icon={<Fuel size={16} />} text={model.fuelType} />
            <Spec icon={<Users size={16} />} text={`${model.seats} ${copy.seats}`} />
            <Spec icon={<Briefcase size={16} />} text={`${model.luggage} ${copy.luggage}`} />
            <Spec icon={<Sparkles size={16} />} text={`${model.includedKmPerDay} km/${copy.dayIncluded}`} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {model.crossBorderAllowed && <Badge>{copy.crossBorderAllowed}</Badge>}
            {model.is4x4 && <Badge>4x4</Badge>}
            {model.isMinivan && <Badge>{copy.minivan}</Badge>}
            {model.isFamily && <Badge>{copy.family}</Badge>}
            <Badge>{freeUnits.length} {copy.unitsFree}</Badge>
          </div>
        </div>
        <div className="relative border-t border-white/10 bg-white/[0.035] p-5 lg:border-l lg:border-t-0">
          {breakdown.discountPercent > 0 && (
            <div className="absolute right-0 top-5 rounded-l-md bg-pravac px-3 py-2 text-sm font-black text-white">
              -{breakdown.discountPercent}%
            </div>
          )}
          <p className="text-sm text-zinc-500">{copy.dailyPrice}</p>
          <p className="mt-1 text-2xl font-black text-graphite">{model.dailyPriceFrom} €</p>
          <p className="mt-4 text-sm text-zinc-600">{results.rentalDays} {copy.days} · {breakdown.discountPercent}% {copy.durationDiscount}</p>
          <p className="mt-3 text-sm font-bold text-zinc-600">{copy.estimatedTotal}</p>
          <p className="text-3xl font-black text-pravac">{breakdown.estimatedTotal} €</p>
          <p className="mt-3 text-sm text-zinc-500">{copy.depositFrom}: <span className="font-black text-ink">{model.depositFrom} €</span></p>
          <button className="button-primary mt-5 w-full gap-2" type="button" onClick={onChoose}>
            <Car size={18} /> {copy.chooseCar}
          </button>
        </div>
      </div>
    </GlowCard>
  );
}

function BookingDetailsStep(props) {
  const {
    breakdown,
    contact,
    copy,
    language,
    onBack,
    onContactChange,
    onSubmit,
    pickupLocation,
    returnLocation,
    search,
    selectedExtras,
    selectedItem,
    setSelectedExtras,
    store,
  } = props;
  const model = selectedItem.model;
  const selectedServices = store.extraServices.filter((service) => selectedExtras.includes(service.id));

  return (
    <section className="mt-8" id="booking-details">
      <button className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-pravac hover:text-wine" type="button" onClick={onBack}>
        <ArrowLeft size={18} /> {copy.backToResults}
      </button>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <SelectedVehiclePanel copy={copy} model={model} />
          <ExtraServicesSelector copy={copy} language={language} selectedExtras={selectedExtras} setSelectedExtras={setSelectedExtras} services={store.extraServices} />
          <CustomerContactForm contact={contact} copy={copy} onChange={onContactChange} onSubmit={onSubmit} />
        </div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <BookingSummary
            breakdown={breakdown}
            copy={copy}
            language={language}
            pickupLocation={pickupLocation}
            returnLocation={returnLocation}
            search={search}
            selectedServices={selectedServices}
            title={copy.finalSummary}
            vehicleTitle={model.title}
          />
        </aside>
      </div>
    </section>
  );
}

function SelectedVehiclePanel({ copy, model }) {
  return (
    <GlowCard as="section" className="overflow-hidden shadow-sm">
      <VehicleMedia model={model} large />
      <div className="p-5 md:p-7">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-pravac">{copy.selectedVehicle}</p>
        <h2 className="mt-2 text-3xl font-black text-graphite">{model.title}</h2>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-600">{model.description}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile label={copy.transmission} value={model.transmission} />
          <InfoTile label={copy.fuel} value={model.fuelType} />
          <InfoTile label={copy.seats} value={model.seats} />
          <InfoTile label={copy.includedKm} value={`${model.includedKmPerDay} km/${copy.day}`} />
        </div>
      </div>
    </GlowCard>
  );
}

function ExtraServicesSelector({ copy, language, selectedExtras, services, setSelectedExtras }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-sm backdrop-blur md:p-7">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-pravac">{copy.extrasEyebrow}</p>
      <h2 className="mt-2 text-2xl font-black text-graphite">{copy.extrasTitle}</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {services.filter((service) => service.active).map((service) => {
          const text = getExtraServiceText(service, language);
          const selected = selectedExtras.includes(service.id);
          return (
            <label key={service.id} className={`rounded-lg border p-4 transition duration-200 ${selected ? 'border-pravac bg-pravac/15 shadow-[0_12px_34px_rgba(169,21,36,0.12)]' : 'border-white/10 bg-white/[0.035] hover:border-pravac/30 hover:bg-white/[0.06]'}`}>
              <div className="flex items-start gap-3">
                <input
                  className="mt-1"
                  type="checkbox"
                  checked={selected}
                  onChange={(event) => setSelectedExtras((current) => (
                    event.target.checked ? [...current, service.id] : current.filter((id) => id !== service.id)
                  ))}
                />
                <span>
                  <span className="block text-base font-black text-graphite">{text.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-zinc-600">{text.description}</span>
                  <span className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge tone="light">{service.price} € · {copy.priceTypes[service.priceType] || service.priceType}</Badge>
                    {service.requiresManagerConfirmation && <Badge tone="red">{copy.requiresConfirmation}</Badge>}
                  </span>
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}

function CustomerContactForm({ contact, copy, onChange, onSubmit }) {
  return (
    <form className="premium-panel bg-graphite p-5 text-white shadow-soft md:p-7" onSubmit={onSubmit}>
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-red-200">{copy.contactEyebrow}</p>
      <h2 className="mt-2 text-2xl font-black">{copy.contactTitle}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-300">{copy.offlineNotice}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <DarkInput label={copy.name} name="customerName" value={contact.customerName} onChange={onChange} required />
        <DarkInput label={copy.phone} name="customerPhone" value={contact.customerPhone} onChange={onChange} placeholder="+421 999 999 999" type="tel" required />
        <DarkInput label={copy.email} name="customerEmail" value={contact.customerEmail} onChange={onChange} placeholder="info@example.com" type="email" required />
        <label>
          <span className="field-label text-zinc-300">{copy.comment}</span>
          <textarea className="input-base min-h-24" name="customerComment" value={contact.customerComment} onChange={onChange} placeholder={copy.commentPlaceholder} />
        </label>
      </div>
      <button className="button-primary mt-5 gap-2" type="submit">
        <CalendarDays size={18} /> {copy.requestBooking}
      </button>
    </form>
  );
}

function BookingSummary({ breakdown, copy, language, pickupLocation, returnLocation, search, selectedServices, title, vehicleTitle }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-soft backdrop-blur">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-pravac">{copy.estimatedPrice}</p>
      <h3 className="mt-2 text-2xl font-black text-graphite">{title}</h3>
      <div className="mt-5 grid gap-3 text-sm">
        <SummaryItem label={copy.car} value={vehicleTitle} />
        <SummaryItem label={copy.pickup} value={`${getLocationName(pickupLocation, language)} · ${formatDate(search.pickupDate)} ${search.pickupTime}`} />
        <SummaryItem label={copy.return} value={`${getLocationName(returnLocation, language)} · ${formatDate(search.returnDate)} ${search.returnTime}`} />
        <SummaryItem label={copy.rentalDays} value={`${breakdown.rentalDays} ${copy.days}`} />
      </div>
      {selectedServices.length > 0 && (
        <div className="mt-5 rounded-md border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm font-black text-graphite">{copy.selectedExtras}</p>
          <ul className="mt-2 grid gap-1 text-sm text-zinc-600">
            {selectedServices.map((service) => <li key={service.id}>{getExtraServiceText(service, language).title}</li>)}
          </ul>
        </div>
      )}
      <PriceBreakdown breakdown={breakdown} copy={copy} />
      <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{copy.managerNotice}</p>
    </section>
  );
}

function PriceBreakdown({ breakdown, copy }) {
  const rows = [
    [copy.rentalDays, breakdown.rentalDays],
    [copy.basePrice, `${breakdown.basePrice} €`],
    ...(breakdown.discountAmount > 0 ? [[`${copy.durationDiscount} (${breakdown.discountPercent}%)`, `-${breakdown.discountAmount} €`, 'positive']] : []),
    [copy.locationFees, `${breakdown.locationFees} €`],
    [copy.extraServices, `${breakdown.extrasTotal} €`],
    [copy.prepayment, `${breakdown.prepaymentAmount} €`],
    [copy.depositFrom, `${breakdown.depositFrom} €`],
  ];

  return (
    <div className="mt-5 rounded-md border border-white/10 bg-black/20 p-4">
      <dl className="grid gap-2 text-sm">
        {rows.map(([label, value, tone]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-zinc-200 pb-2 last:border-0">
            <dt className={tone === 'positive' ? 'font-semibold text-emerald-700' : 'text-zinc-600'}>{label}</dt>
            <dd className={`font-black ${tone === 'positive' ? 'text-emerald-700' : 'text-ink'}`}>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 rounded-md border border-pravac/25 bg-pravac/10 p-4 shadow-[0_18px_44px_rgba(169,21,36,0.12)]">
        <p className="text-sm font-bold text-zinc-500">{copy.estimatedTotal}</p>
        <p className="text-3xl font-black text-pravac">{breakdown.estimatedTotal} €</p>
      </div>
    </div>
  );
}

function BookingConfirmation({ booking, breakdown, copy, language, pickupLocation, returnLocation, search, selectedExtras, selectedModel, store }) {
  const selectedServices = store.extraServices.filter((service) => selectedExtras.includes(service.id));
  return (
    <section className="mt-8 rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-5 text-emerald-50 shadow-sm md:p-8" id="booking-confirmation">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <ShieldCheck size={26} />
          </div>
          <h2 className="mt-5 text-3xl font-black text-white">{copy.confirmationTitle}</h2>
          <p className="mt-3 max-w-3xl leading-7">{copy.confirmationText}</p>
          <p className="mt-4 text-sm font-black">{copy.requestNumber}: {booking.id}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5 text-white shadow-sm lg:min-w-80">
          <p className="text-sm font-bold text-zinc-500">{copy.estimatedTotal}</p>
          <p className="text-3xl font-black text-pravac">{breakdown.estimatedTotal} €</p>
          <p className="mt-2 text-sm text-zinc-600">{copy.prepayment}: <span className="font-black">{breakdown.prepaymentAmount} €</span></p>
          <p className="text-sm text-zinc-600">{copy.depositFrom}: <span className="font-black">{breakdown.depositFrom} €</span></p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 rounded-lg border border-white/10 bg-white/[0.06] p-5 text-white md:grid-cols-2">
        <SummaryItem label={copy.car} value={selectedModel.title} />
        <SummaryItem label={copy.dates} value={`${formatDate(search.pickupDate)} ${search.pickupTime} - ${formatDate(search.returnDate)} ${search.returnTime}`} />
        <SummaryItem label={copy.pickupLocation} value={getLocationName(pickupLocation, language)} />
        <SummaryItem label={copy.returnLocation} value={getLocationName(returnLocation, language)} />
        <SummaryItem label={copy.selectedExtras} value={selectedServices.length ? selectedServices.map((service) => getExtraServiceText(service, language).title).join(', ') : copy.noExtras} />
        <SummaryItem label={copy.nextStep} value={copy.nextStepText} />
      </div>
      <p className="mt-5 rounded-md border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-emerald-50">{copy.offlineNotice}</p>
    </section>
  );
}

function LoadingResults({ copy }) {
  return (
    <section className="mt-8 grid gap-4">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-pravac">{copy.searching}</p>
      {[0, 1, 2].map((item) => <div key={item} className="h-32 animate-pulse rounded-lg bg-zinc-100" />)}
    </section>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.05] p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-pravac">
        <X size={22} />
      </div>
      <h3 className="mt-4 text-2xl font-black text-graphite">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600">{text}</p>
    </div>
  );
}

function LocationSelect({ label, locations, language, ...props }) {
  return (
    <label>
      <span className="field-label text-zinc-300">{label}</span>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <select className="input-base pl-10" {...props} required>
          {locations.map((location) => <option key={location.id} value={location.id}>{getLocationName(location, language)}</option>)}
        </select>
      </div>
    </label>
  );
}

function Input({ label, ...props }) {
  return (
    <label>
      <span className="field-label text-zinc-300">{label}</span>
      <input className="input-base" {...props} required />
    </label>
  );
}

function DarkInput({ label, ...props }) {
  return (
    <label>
      <span className="field-label text-zinc-300">{label}</span>
      <input className="input-base" {...props} />
    </label>
  );
}

function SelectFilter({ label, options, allLabel, ...props }) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <select className="input-base" {...props}>
        <option value="">{allLabel}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function InputFilter({ label, ...props }) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <input className="input-base" {...props} />
    </label>
  );
}

function CheckboxFilter({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-bold text-ink">
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}

function VehicleMedia({ model, large = false }) {
  if (model.image?.type === 'remote') {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.98),rgba(244,245,247,0.92)_52%,rgba(21,21,21,0.08))] ${large ? 'h-72' : 'h-full min-h-56 lg:min-h-full'}`}>
        <div className="absolute inset-x-8 bottom-8 h-8 rounded-full bg-black/15 blur-xl" />
        <div className="absolute left-8 top-8 h-28 w-28 rounded-full bg-pravac/10 blur-3xl" />
        <img
          className="relative z-10 h-full max-h-[82%] w-full object-contain px-5 py-7"
          src={model.image.url}
          alt={model.title}
          style={{ objectPosition: model.image.position || 'center' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-end overflow-hidden p-5 text-white ${large ? 'h-72' : 'h-full min-h-56 lg:min-h-full'}`}
      style={{ background: `radial-gradient(circle at 22% 16%, rgba(255,255,255,0.22), transparent 30%), linear-gradient(135deg, ${model.image?.from || '#171717'}, ${model.image?.to || '#a91524'})` }}
    >
      <div className="absolute -right-10 bottom-5 h-20 w-64 rounded-full border-8 border-white/20" />
      <div className="absolute right-8 bottom-10 h-10 w-40 rounded-t-full bg-white/25" />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">{model.category}</p>
        <p className="mt-1 text-2xl font-black">{model.title}</p>
      </div>
    </div>
  );
}

function Spec({ icon, text }) {
  return <span className="inline-flex min-w-0 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 font-semibold shadow-sm">{icon} <span className="truncate">{text}</span></span>;
}

function Badge({ children, tone = 'default' }) {
  const styles = {
    default: 'bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200',
    green: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
    red: 'bg-red-50 text-pravac ring-1 ring-red-100',
    light: 'bg-white/10 text-zinc-200 ring-1 ring-white/10',
  };
  return <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-black ${styles[tone]}`}>{children}</span>;
}

function SummaryItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 font-black text-graphite">{value}</p>
    </div>
  );
}

function InfoTile({ label, value }) {
  return <div className="rounded-md border border-white/10 bg-white/[0.04] p-4"><p className="text-xs font-bold uppercase tracking-wide text-zinc-500">{label}</p><p className="mt-1 text-lg font-black text-graphite">{value}</p></div>;
}

function toDateTime(date, time) {
  return `${date}T${time || '09:00'}`;
}

function toAvailabilitySearch(search) {
  return {
    pickupLocationId: search.pickupLocationId,
    returnLocationId: search.returnLocationId,
    pickupDateTime: toDateTime(search.pickupDate, search.pickupTime),
    returnDateTime: toDateTime(search.returnDate, search.returnTime),
  };
}

function fromHeroSearch(detail) {
  const pickupAt = splitDateTime(detail.pickupAt || detail.pickupDateTime || defaultSearch.pickupDate);
  const returnAt = splitDateTime(detail.dropoffAt || detail.returnDateTime || defaultSearch.returnDate);
  return {
    pickupLocationId: detail.pickupLocation || detail.pickupLocationId || defaultSearch.pickupLocationId,
    returnLocationId: detail.dropoffLocation || detail.returnLocationId || defaultSearch.returnLocationId,
    pickupDate: pickupAt.date,
    pickupTime: pickupAt.time,
    returnDate: returnAt.date,
    returnTime: returnAt.time,
  };
}

function splitDateTime(value) {
  const [date, time = '09:00'] = String(value).split('T');
  return { date, time: time.slice(0, 5) };
}

function formatDate(value) {
  return new Date(`${value}T12:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

function getExtraServiceText(service, language) {
  return extraServiceCopy[language]?.[service.id] || extraServiceCopy.en[service.id] || {
    title: service.title,
    description: service.description,
  };
}

const flowCopy = {
  sk: {
    steps: ['Hladanie', 'Vyber auta', 'Doplnky', 'Kontakt', 'Potvrdenie'],
    searchEyebrow: 'Kratkodoby prenajom',
    searchTitle: 'Vyhladajte auto pre svoj termin',
    searchIntro: 'Vyberte lokality, datum a cas. Kontakty zadate az po vybere auta a kontrole predbeznej ceny.',
    trustItems: ['Transparentna predbezna cena', 'Bratislava a letiska', 'Bez registracie uctu', 'Potvrdenie manazerom ked je potrebne'],
    pickupLocation: 'Miesto prevzatia',
    returnLocation: 'Miesto vratenia',
    pickupDate: 'Datum prevzatia',
    pickupTime: 'Cas prevzatia',
    returnDate: 'Datum vratenia',
    returnTime: 'Cas vratenia',
    searchCars: 'Vyhladat auta',
    searching: 'Hladame dostupne auta',
    editSearch: 'Upravit hladanie',
    pickup: 'Prevzatie',
    return: 'Vratenie',
    rentalDays: 'Dni prenajmu',
    days: 'dni',
    resultsEyebrow: 'Dostupne auta',
    resultsTitle: 'Auta dostupne pre vas termin',
    availableCars: 'dostupnych aut',
    beforeFilters: 'pred filtrami',
    filters: 'Filtre',
    clear: 'Vymazat',
    all: 'Vsetko',
    class: 'Trieda',
    transmission: 'Prevodovka',
    fuel: 'Palivo',
    seatsMin: 'Min. miest',
    maxPrice: 'Max €/den',
    luggageMin: 'Min. batozina',
    fourByFour: '4x4',
    minivan: 'Minivan',
    family: 'Rodinne auto',
    crossBorder: 'Cesta do zahranicia',
    seats: 'miest',
    luggage: 'batozina',
    unitsFree: 'volne kusy',
    dayIncluded: 'den v cene',
    day: 'den',
    crossBorderAllowed: 'Zahranicie povolene',
    discountBadge: 'zlava',
    dailyPrice: 'Cena za den',
    durationDiscount: 'Zlava za dlzku',
    estimatedTotal: 'Predbezna suma',
    depositFrom: 'Depozit od',
    chooseCar: 'Vybrat auto',
    noAvailableTitle: 'Pre tento termin nie su dostupne auta',
    noAvailableText: 'Skuste zmenit datum, cas alebo lokality a spustite hladanie znova.',
    noFilterTitle: 'Ziadne auta nevyhovuju filtrom',
    noFilterText: 'Upravte alebo vymazte filtre, aby ste videli dostupne auta.',
    backToResults: 'Spat na vysledky',
    selectedVehicle: 'Vybrane auto',
    includedKm: 'Kilometre v cene',
    extrasEyebrow: 'Doplnkove sluzby',
    extrasTitle: 'Pridajte iba to, co potrebujete',
    requiresConfirmation: 'Vyžaduje potvrdenie',
    priceTypes: { per_booking: 'za rezervaciu', per_day: 'za den', per_unit: 'za kus' },
    contactEyebrow: 'Kontakt',
    contactTitle: 'Kam mame poslat potvrdenie?',
    offlineNotice: 'Dokumenty a finalna kontrola prenajmu prebiehaju offline pri prevzati vozidla.',
    name: 'Meno',
    phone: 'Telefon',
    email: 'Email',
    comment: 'Komentar',
    commentPlaceholder: 'Let, preferencie alebo poznamka k odovzdaniu',
    requestBooking: 'Odoslat dopyt',
    finalSummary: 'Finalny prehlad',
    estimatedPrice: 'Predbezna cena',
    car: 'Auto',
    selectedExtras: 'Vybrane doplnky',
    noExtras: 'Bez doplnkov',
    managerNotice: 'Rezervacia moze vyzadovat potvrdenie manazerom.',
    basePrice: 'Zakladna cena',
    locationFees: 'Poplatky za lokacie',
    extraServices: 'Doplnkove sluzby',
    prepayment: 'Predplatba',
    confirmationTitle: 'Dopyt na rezervaciu bol prijaty',
    confirmationText: 'Manazer PRAVAC potvrdi dostupnost a posle dalsie instrukcie k platbe.',
    requestNumber: 'Cislo dopytu',
    dates: 'Terminy',
    nextStep: 'Dalsi krok',
    nextStepText: 'Kontaktujeme vas s potvrdenim dostupnosti.',
  },
  en: {
    steps: ['Search', 'Choose car', 'Extras', 'Contact', 'Confirmation'],
    searchEyebrow: 'Short-term rental',
    searchTitle: 'Find a car for your dates',
    searchIntro: 'Choose pickup, return, date and time. Contact details come only after you see available cars and estimated price.',
    trustItems: ['Transparent estimated pricing', 'Bratislava and airports', 'No account needed', 'Manager confirmation when needed'],
    pickupLocation: 'Pickup location',
    returnLocation: 'Return location',
    pickupDate: 'Pickup date',
    pickupTime: 'Pickup time',
    returnDate: 'Return date',
    returnTime: 'Return time',
    searchCars: 'Search cars',
    searching: 'Searching available cars',
    editSearch: 'Edit search',
    pickup: 'Pickup',
    return: 'Return',
    rentalDays: 'Rental days',
    days: 'days',
    resultsEyebrow: 'Available cars',
    resultsTitle: 'Available cars for your dates',
    availableCars: 'available cars',
    beforeFilters: 'before filters',
    filters: 'Filters',
    clear: 'Clear',
    all: 'All',
    class: 'Class',
    transmission: 'Transmission',
    fuel: 'Fuel',
    seatsMin: 'Seats min.',
    maxPrice: 'Max €/day',
    luggageMin: 'Luggage min.',
    fourByFour: '4x4',
    minivan: 'Minivan',
    family: 'Family car',
    crossBorder: 'Cross-border',
    seats: 'seats',
    luggage: 'bags',
    unitsFree: 'unit(s) free',
    dayIncluded: 'day included',
    day: 'day',
    crossBorderAllowed: 'Cross-border allowed',
    discountBadge: 'discount',
    dailyPrice: 'Daily price',
    durationDiscount: 'Duration discount',
    estimatedTotal: 'Estimated total',
    depositFrom: 'Deposit from',
    chooseCar: 'Choose car',
    noAvailableTitle: 'No cars are available for these dates',
    noAvailableText: 'Try changing dates, time or locations and search again.',
    noFilterTitle: 'No cars match your filters',
    noFilterText: 'Adjust or clear filters to see available cars.',
    backToResults: 'Back to results',
    selectedVehicle: 'Selected vehicle',
    includedKm: 'Included km',
    extrasEyebrow: 'Extra services',
    extrasTitle: 'Add only what you need',
    requiresConfirmation: 'Requires confirmation',
    priceTypes: { per_booking: 'per booking', per_day: 'per day', per_unit: 'per unit' },
    contactEyebrow: 'Contact',
    contactTitle: 'Where should we send confirmation?',
    offlineNotice: 'Documents and final rental check are completed offline at vehicle pickup.',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    comment: 'Comment',
    commentPlaceholder: 'Flight, preferences or handover note',
    requestBooking: 'Send booking request',
    finalSummary: 'Final summary',
    estimatedPrice: 'Estimated price',
    car: 'Car',
    selectedExtras: 'Selected extras',
    noExtras: 'No extras',
    managerNotice: 'Booking may require manager confirmation.',
    basePrice: 'Base price',
    locationFees: 'Location fees',
    extraServices: 'Extra services',
    prepayment: 'Prepayment',
    confirmationTitle: 'Your booking request has been received',
    confirmationText: 'PRAVAC manager will confirm availability and payment instructions.',
    requestNumber: 'Request number',
    dates: 'Dates',
    nextStep: 'Next step',
    nextStepText: 'We will contact you with availability confirmation.',
  },
};

flowCopy.ru = {
  ...flowCopy.en,
  steps: ['Поиск', 'Выбор авто', 'Допуслуги', 'Контакты', 'Подтверждение'],
  searchEyebrow: 'Краткосрочная аренда',
  searchTitle: 'Найдите авто на ваши даты',
  searchIntro: 'Выберите локации, дату и время. Контакты понадобятся только после выбора авто и просмотра предварительной цены.',
  trustItems: ['Прозрачная предварительная цена', 'Братислава и аэропорты', 'Без регистрации аккаунта', 'Подтверждение менеджером при необходимости'],
  pickupLocation: 'Место получения',
  returnLocation: 'Место возврата',
  pickupDate: 'Дата получения',
  pickupTime: 'Время получения',
  returnDate: 'Дата возврата',
  returnTime: 'Время возврата',
  searchCars: 'Найти авто',
  searching: 'Ищем доступные авто',
  editSearch: 'Изменить поиск',
  pickup: 'Получение',
  return: 'Возврат',
  rentalDays: 'Дней аренды',
  days: 'дней',
  resultsEyebrow: 'Доступные авто',
  resultsTitle: 'Авто, доступные на ваши даты',
  availableCars: 'доступных авто',
  beforeFilters: 'до фильтров',
  filters: 'Фильтры',
  clear: 'Очистить',
  all: 'Все',
  class: 'Класс',
  transmission: 'Коробка',
  fuel: 'Топливо',
  seatsMin: 'Мин. мест',
  maxPrice: 'Макс. €/день',
  luggageMin: 'Мин. багаж',
  minivan: 'Минивэн',
  family: 'Семейное авто',
  crossBorder: 'Выезд за границу',
  seats: 'мест',
  luggage: 'багаж',
  unitsFree: 'свободных машин',
  dayIncluded: 'день включено',
  day: 'день',
  crossBorderAllowed: 'Выезд за границу разрешён',
  discountBadge: 'скидка',
  dailyPrice: 'Цена за день',
  durationDiscount: 'Скидка за срок',
  estimatedTotal: 'Предварительно',
  depositFrom: 'Депозит от',
  chooseCar: 'Выбрать авто',
  noAvailableTitle: 'Нет доступных авто на эти даты',
  noAvailableText: 'Измените даты, время или локации и запустите поиск снова.',
  noFilterTitle: 'Нет авто по выбранным фильтрам',
  noFilterText: 'Измените или очистите фильтры, чтобы увидеть доступные авто.',
  backToResults: 'Назад к результатам',
  selectedVehicle: 'Выбранное авто',
  includedKm: 'Км включено',
  extrasEyebrow: 'Дополнительные услуги',
  extrasTitle: 'Добавьте только то, что нужно',
  requiresConfirmation: 'Требует подтверждения',
  priceTypes: { per_booking: 'за бронь', per_day: 'за день', per_unit: 'за единицу' },
  contactEyebrow: 'Контакты',
  contactTitle: 'Куда отправить подтверждение?',
  offlineNotice: 'Документы и финальная проверка аренды проходят офлайн при получении автомобиля.',
  name: 'Имя',
  phone: 'Телефон',
  email: 'Email',
  comment: 'Комментарий',
  commentPlaceholder: 'Рейс, предпочтения или комментарий к передаче',
  requestBooking: 'Отправить заявку',
  finalSummary: 'Итоговая сводка',
  estimatedPrice: 'Предварительная цена',
  car: 'Авто',
  selectedExtras: 'Выбранные допуслуги',
  noExtras: 'Без допуслуг',
  managerNotice: 'Бронь может потребовать подтверждения менеджером.',
  basePrice: 'Базовая цена',
  locationFees: 'Сборы за локации',
  extraServices: 'Доп. услуги',
  prepayment: 'Предоплата',
  confirmationTitle: 'Ваша заявка на бронирование получена',
  confirmationText: 'Менеджер PRAVAC подтвердит доступность и отправит инструкции по оплате.',
  requestNumber: 'Номер заявки',
  dates: 'Даты',
  nextStep: 'Следующий шаг',
  nextStepText: 'Мы свяжемся с вами для подтверждения доступности.',
};

flowCopy.tr = {
  ...flowCopy.en,
  steps: ['Arama', 'Arac sec', 'Ekler', 'Iletisim', 'Onay'],
  searchEyebrow: 'Kisa sureli kiralama',
  searchTitle: 'Tarihlerinize uygun arac bulun',
  searchIntro: 'Lokasyon, tarih ve saat secin. Iletisim bilgileri yalnizca arac ve tahmini fiyat gorulduktan sonra istenir.',
  trustItems: ['Seffaf tahmini fiyat', 'Bratislava ve havalimanlari', 'Hesap gerekmez', 'Gerektiginde yonetici onayi'],
  searchCars: 'Arac ara',
  chooseCar: 'Arac sec',
};

const extraServiceCopy = {
  sk: {
    'child-seat': { title: 'Detska sedacka', description: 'Detska sedacka pre mensich pasazierov.' },
    'booster-seat': { title: 'Podsedak', description: 'Podsedak pre starsie deti.' },
    'additional-driver': { title: 'Dalsi vodic', description: 'Pridanie jedneho dalsieho vodica k prenajmu.' },
    'delivery-address': { title: 'Dorucenie na adresu', description: 'Pristavenie vozidla na zvolenu adresu.' },
    'return-address': { title: 'Vratenie z adresy', description: 'Prevzatie vozidla zo zvolenej adresy.' },
    'after-hours-pickup': { title: 'Prevzatie mimo otvaracich hodin', description: 'Prevzatie mimo standardnych pracovnych hodin.' },
    'after-hours-return': { title: 'Vratenie mimo otvaracich hodin', description: 'Vratenie mimo standardnych pracovnych hodin.' },
    'cross-border': { title: 'Povolenie do zahranicia', description: 'Povolenie na cestu mimo krajiny.' },
    'extra-mileage': { title: 'Balik kilometrov navyse', description: 'Prida 500 km k zahrnutemu najazdu.' },
    'reduced-deposit': { title: 'Znizeny depozit / extra poistenie', description: 'Volitelny balik na znizenie depozitneho rizika.' },
  },
  en: {
    'child-seat': { title: 'Child seat', description: 'Child seat for younger passengers.' },
    'booster-seat': { title: 'Booster seat', description: 'Booster seat for older children.' },
    'additional-driver': { title: 'Additional driver', description: 'Add one extra driver to the rental.' },
    'delivery-address': { title: 'Delivery to address', description: 'Vehicle delivery to selected address.' },
    'return-address': { title: 'Return from address', description: 'Vehicle return from selected address.' },
    'after-hours-pickup': { title: 'After-hours pickup', description: 'Pickup outside standard working hours.' },
    'after-hours-return': { title: 'After-hours return', description: 'Return outside standard working hours.' },
    'cross-border': { title: 'Cross-border permission', description: 'Permission for cross-border travel.' },
    'extra-mileage': { title: 'Extra mileage package', description: 'Adds 500 km to included mileage.' },
    'reduced-deposit': { title: 'Reduced deposit / extra insurance', description: 'Optional package reducing deposit exposure.' },
  },
  ru: {
    'child-seat': { title: 'Детское кресло', description: 'Детское кресло для маленьких пассажиров.' },
    'booster-seat': { title: 'Бустер', description: 'Бустер для детей старшего возраста.' },
    'additional-driver': { title: 'Дополнительный водитель', description: 'Добавить ещё одного водителя к аренде.' },
    'delivery-address': { title: 'Доставка по адресу', description: 'Подача автомобиля по выбранному адресу.' },
    'return-address': { title: 'Возврат с адреса', description: 'Возврат автомобиля с выбранного адреса.' },
    'after-hours-pickup': { title: 'Получение вне рабочих часов', description: 'Получение автомобиля вне стандартного рабочего времени.' },
    'after-hours-return': { title: 'Возврат вне рабочих часов', description: 'Возврат автомобиля вне стандартного рабочего времени.' },
    'cross-border': { title: 'Разрешение на выезд за границу', description: 'Разрешение для поездок за пределы страны.' },
    'extra-mileage': { title: 'Пакет дополнительных километров', description: 'Добавляет 500 км к включённому пробегу.' },
    'reduced-deposit': { title: 'Сниженный депозит / доп. страховка', description: 'Опциональный пакет для снижения депозитного риска.' },
  },
  tr: {
    'child-seat': { title: 'Cocuk koltugu', description: 'Kucuk yolcular icin cocuk koltugu.' },
    'booster-seat': { title: 'Yukseltici koltuk', description: 'Daha buyuk cocuklar icin yukseltici koltuk.' },
    'additional-driver': { title: 'Ek surucu', description: 'Kiralama icin bir ek surucu ekleyin.' },
    'delivery-address': { title: 'Adrese teslim', description: 'Aracin secilen adrese teslimi.' },
    'return-address': { title: 'Adresten iade', description: 'Aracin secilen adresten alinmasi.' },
    'after-hours-pickup': { title: 'Mesai disi teslim alma', description: 'Standart calisma saatleri disinda teslim alma.' },
    'after-hours-return': { title: 'Mesai disi iade', description: 'Standart calisma saatleri disinda iade.' },
    'cross-border': { title: 'Sinir gecis izni', description: 'Ulke disina seyahat izni.' },
    'extra-mileage': { title: 'Ek kilometre paketi', description: 'Dahil kilometreye 500 km ekler.' },
    'reduced-deposit': { title: 'Azaltilmis depozito / ek sigorta', description: 'Depozito riskini azaltan opsiyonel paket.' },
  },
};
