import { calculateRentalDays } from './dateRental.js';

export function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

export function getBlockedUnitIds(blocks, pickupDateTime, returnDateTime) {
  const pickup = new Date(pickupDateTime);
  const dropoff = new Date(returnDateTime);

  return new Set(
    blocks
      .filter((block) => block.status !== 'cancelled')
      .filter((block) => rangesOverlap(pickup, dropoff, new Date(block.startDateTime), new Date(block.endDateTime)))
      .map((block) => block.vehicleUnitId),
  );
}

export function findAvailableVehicleModels(search, store, filters = {}) {
  const rental = calculateRentalDays(search.pickupDateTime, search.returnDateTime, {
    graceMinutes: store.pricingSettings?.graceMinutes || 0,
  });

  if (!rental.valid) {
    return { available: [], unavailable: [], rentalDays: 0, error: rental.error };
  }

  const blockedUnitIds = getBlockedUnitIds(store.availabilityBlocks, search.pickupDateTime, search.returnDateTime);
  const location = search.pickupLocationId;
  const available = [];
  const unavailable = [];

  store.vehicleModels
    .filter((model) => model.active)
    .forEach((model) => {
      const units = store.vehicleUnits.filter((unit) => unit.vehicleModelId === model.id && unit.active);
      const freeUnits = units.filter((unit) => unit.status === 'available' && !blockedUnitIds.has(unit.id));
      const locationUnits = freeUnits.filter((unit) => !location || unit.currentLocationId === location || location === 'delivery-address');

      if (locationUnits.length > 0) {
        available.push({ model, freeUnits: locationUnits, assignedUnit: locationUnits[0] });
      } else {
        unavailable.push({
          model,
          reason: units.length === 0 ? 'no_units' : blockedUnitIds.has(units[0]?.id) ? 'date' : 'location_or_status',
        });
      }
    });

  return {
    available: available.filter((item) => matchesVehicleFilters(item.model, filters)),
    unavailable,
    rentalDays: rental.days,
    error: null,
  };
}

export function matchesVehicleFilters(model, filters) {
  if (filters.bodyType && normalizeBodyType(model.bodyType) !== filters.bodyType) return false;
  if (filters.category && model.category !== filters.category) return false;
  if (filters.transmission && model.transmission !== filters.transmission) return false;
  if (filters.fuelType && model.fuelType !== filters.fuelType) return false;
  if (filters.minSeats && model.seats < Number(filters.minSeats)) return false;
  if (filters.maxPrice && model.dailyPriceFrom > Number(filters.maxPrice)) return false;
  if (filters.minLuggage && model.luggage < Number(filters.minLuggage)) return false;
  if (filters.is4x4 && !model.is4x4) return false;
  if (filters.isMinivan && !model.isMinivan) return false;
  if (filters.isFamily && !model.isFamily) return false;
  if (filters.crossBorderAllowed && !model.crossBorderAllowed) return false;
  return true;
}

function normalizeBodyType(bodyType = '') {
  const normalized = bodyType.toLowerCase();
  if (normalized === 'estate') return 'wagon';
  if (normalized === 'van') return 'minivan';
  if (normalized.includes('sedan')) return 'sedan';
  return normalized;
}

export function isUnitBlockedOnDate(unitId, blocks, date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return blocks.some((block) => (
    block.vehicleUnitId === unitId
    && block.status !== 'cancelled'
    && rangesOverlap(start, end, new Date(block.startDateTime), new Date(block.endDateTime))
  ));
}
