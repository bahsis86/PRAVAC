export const pricingSettings = {
  prepaymentPercent: 20,
  graceMinutes: 0,
};

export const pricingTiers = [
  { id: 'tier-all-3', category: 'all', vehicleModelId: null, fromDays: 3, discountType: 'percent', discountValue: 5, active: true },
  { id: 'tier-all-7', category: 'all', vehicleModelId: null, fromDays: 7, discountType: 'percent', discountValue: 10, active: true },
  { id: 'tier-all-14', category: 'all', vehicleModelId: null, fromDays: 14, discountType: 'percent', discountValue: 15, active: true },
  { id: 'tier-all-30', category: 'all', vehicleModelId: null, fromDays: 30, discountType: 'percent', discountValue: 25, active: true },
];
