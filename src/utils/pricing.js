export function getBestPricingTier(model, rentalDays, pricingTiers) {
  return pricingTiers
    .filter((tier) => tier.active)
    .filter((tier) => tier.vehicleModelId === model.id || tier.category === model.category || tier.category === 'all')
    .filter((tier) => Number(tier.fromDays) <= rentalDays)
    .sort((a, b) => Number(b.fromDays) - Number(a.fromDays))[0] || null;
}

export function calculateExtrasTotal(selectedExtraServiceIds, extraServices, rentalDays) {
  return selectedExtraServiceIds.reduce((total, serviceId) => {
    const service = extraServices.find((item) => item.id === serviceId && item.active);
    if (!service) return total;
    if (service.priceType === 'per_day') return total + (service.price * rentalDays);
    return total + service.price;
  }, 0);
}

export function calculatePriceBreakdown({
  model,
  rentalDays,
  pickupLocation,
  returnLocation,
  selectedExtraServiceIds,
  extraServices,
  pricingSettings,
  pricingTiers,
}) {
  const dailyPrice = Number(model.dailyPriceFrom || 0);
  const basePrice = dailyPrice * rentalDays;
  const tier = getBestPricingTier(model, rentalDays, pricingTiers);
  const discountPercent = tier?.discountType === 'percent' ? Number(tier.discountValue) : 0;
  const discountAmount = roundMoney(basePrice * (discountPercent / 100));
  const locationFees = Number(pickupLocation?.pickupFee || 0) + Number(returnLocation?.returnFee || 0);
  const extrasTotal = calculateExtrasTotal(selectedExtraServiceIds, extraServices, rentalDays);
  const estimatedTotal = roundMoney(basePrice - discountAmount + locationFees + extrasTotal);
  const prepaymentPercent = Number(pricingSettings?.prepaymentPercent || 0);
  const prepaymentAmount = roundMoney(estimatedTotal * (prepaymentPercent / 100));

  return {
    rentalDays,
    dailyPrice,
    basePrice,
    discountPercent,
    discountAmount,
    locationFees,
    extrasTotal,
    estimatedTotal,
    prepaymentPercent,
    prepaymentAmount,
    depositFrom: Number(model.depositFrom || 0),
    appliedTierId: tier?.id || null,
  };
}

export function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}
