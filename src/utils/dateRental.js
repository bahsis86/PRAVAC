export const rentalDateConfig = {
  graceMinutes: 0,
};

export function calculateRentalDays(startDateTime, endDateTime, options = {}) {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const graceMinutes = options.graceMinutes ?? rentalDateConfig.graceMinutes;

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { valid: false, days: 0, error: 'invalid_date' };
  }

  if (end <= start) {
    return { valid: false, days: 0, error: 'return_before_pickup' };
  }

  const rentalMs = end.getTime() - start.getTime();
  const graceMs = graceMinutes * 60 * 1000;
  const days = Math.max(1, Math.ceil(Math.max(0, rentalMs - graceMs) / 86400000));

  return { valid: true, days, error: null };
}

export function toDateInputValue(date = new Date()) {
  const normalized = new Date(date);
  normalized.setMinutes(normalized.getMinutes() - normalized.getTimezoneOffset());
  return normalized.toISOString().slice(0, 16);
}
