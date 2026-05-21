import { adminUsers } from '../data/adminUsers.js';
import { availabilityBlocks } from '../data/availability.js';
import { bookings } from '../data/bookings.js';
import { documents } from '../data/documents.js';
import { extraServices } from '../data/extraServices.js';
import { locations } from '../data/locations.js';
import { pricingSettings, pricingTiers } from '../data/pricing.js';
import { vehicleModels, vehicleUnits } from '../data/vehicles.js';

export const storageKeys = {
  vehicleModels: 'pravac_vehicle_models',
  vehicleUnits: 'pravac_vehicle_units',
  locations: 'pravac_locations',
  availabilityBlocks: 'pravac_availability_blocks',
  bookings: 'pravac_bookings',
  pricingSettings: 'pravac_pricing_settings',
  pricingTiers: 'pravac_pricing_tiers',
  extraServices: 'pravac_extra_services',
  documents: 'pravac_documents',
  longTermLeads: 'pravac_long_term_leads',
  adminSession: 'pravac_admin_session',
};

const initialData = {
  vehicleModels,
  vehicleUnits,
  locations,
  availabilityBlocks,
  bookings,
  pricingSettings,
  pricingTiers,
  extraServices,
  documents,
  longTermLeads: [],
  adminUsers,
};

export function loadCollection(name) {
  if (typeof window === 'undefined') return initialData[name] || [];
  const key = storageKeys[name];
  if (!key) return initialData[name] || [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return initialData[name] || [];
    const parsed = JSON.parse(raw);
    if (name === 'vehicleModels') return hydrateVehicleImages(parsed);
    return parsed;
  } catch {
    return initialData[name] || [];
  }
}

function hydrateVehicleImages(models) {
  return models.map((model) => {
    const initial = vehicleModels.find((item) => item.id === model.id);
    if (!initial) return model;
    return { ...model, image: initial.image, images: initial.images };
  });
}

export function saveCollection(name, value) {
  if (typeof window === 'undefined') return;
  const key = storageKeys[name];
  if (!key) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('pravac:mock-store-updated', { detail: { name } }));
}

export function getMockStore() {
  return {
    vehicleModels: loadCollection('vehicleModels'),
    vehicleUnits: loadCollection('vehicleUnits'),
    locations: loadCollection('locations'),
    availabilityBlocks: loadCollection('availabilityBlocks'),
    bookings: loadCollection('bookings'),
    pricingSettings: loadCollection('pricingSettings'),
    pricingTiers: loadCollection('pricingTiers'),
    extraServices: loadCollection('extraServices'),
    documents: loadCollection('documents'),
    longTermLeads: loadCollection('longTermLeads'),
  };
}

export function appendCollectionItem(name, item) {
  const next = [...loadCollection(name), item];
  saveCollection(name, next);
  return next;
}

export function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function isAdminSessionActive() {
  return typeof window !== 'undefined' && window.localStorage.getItem(storageKeys.adminSession) === 'true';
}

export function setAdminSession(active) {
  if (typeof window === 'undefined') return;
  if (active) window.localStorage.setItem(storageKeys.adminSession, 'true');
  else window.localStorage.removeItem(storageKeys.adminSession);
}
