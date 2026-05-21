import { assetPath } from '../utils/assetPath.js';

const bodyCardAssets = {
  cabriolet: assetPath('assets/pravac/body-cards/body-cabriolet.svg'),
  coupe: assetPath('assets/pravac/body-cards/body-coupe.svg'),
  estate: assetPath('assets/pravac/body-cards/body-wagon.svg'),
  hatchback: assetPath('assets/pravac/body-cards/body-hatchback.svg'),
  minivan: assetPath('assets/pravac/body-cards/body-minivan.svg'),
  pickup: assetPath('assets/pravac/body-cards/body-pickup.svg'),
  premium: assetPath('assets/pravac/body-cards/body-sedan.svg'),
  sedan: assetPath('assets/pravac/body-cards/body-sedan.svg'),
  suv: assetPath('assets/pravac/body-cards/body-suv.svg'),
  van: assetPath('assets/pravac/body-cards/body-van.svg'),
  wagon: assetPath('assets/pravac/body-cards/body-wagon.svg'),
};

export default function VehicleImagePlaceholder({ model, className = '', hero = false }) {
  const bodyType = normalizeBodyType(model?.bodyType || model?.category);
  const bodyCard = bodyCardAssets[bodyType] || bodyCardAssets.sedan;

  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <img
        aria-hidden="true"
        className={`h-full w-full object-contain ${hero ? 'p-2 sm:p-4' : 'p-2'}`}
        src={bodyCard}
        alt=""
      />
      {model?.bodyType && <span className="sr-only">{model.bodyType}</span>}
    </div>
  );
}

function normalizeBodyType(value = '') {
  const text = String(value).toLowerCase();
  if (text.includes('cabrio') || text.includes('convertible')) return 'cabriolet';
  if (text.includes('coupe')) return 'coupe';
  if (text.includes('hatch')) return 'hatchback';
  if (text.includes('estate') || text.includes('combi') || text.includes('variant')) return 'wagon';
  if (text.includes('suv')) return 'suv';
  if (text.includes('pickup')) return 'pickup';
  if (text.includes('mini')) return 'minivan';
  if (text.includes('van')) return 'van';
  if (text.includes('premium')) return 'premium';
  if (text.includes('business')) return 'premium';
  return 'sedan';
}
