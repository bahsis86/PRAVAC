const bodyProfiles = {
  hatchback: 'M75 122 C100 92 136 78 188 78 H250 C281 79 313 96 333 124',
  sedan: 'M67 125 C95 98 137 84 193 84 H266 C297 85 325 101 342 126',
  estate: 'M62 126 C91 98 135 82 207 82 H284 C315 86 340 102 356 126',
  suv: 'M64 130 C92 96 132 77 203 77 H280 C318 80 348 101 365 130',
  minivan: 'M61 129 C86 96 126 78 216 78 H304 C334 82 358 103 374 129',
  van: 'M56 130 C76 98 116 80 222 80 H326 C350 84 370 104 383 130',
  premium: 'M62 124 C95 94 143 80 207 81 H282 C317 82 345 100 363 124',
};

const bodyHeights = {
  hatchback: 'M113 122 H328 C344 122 358 136 361 153 L366 178 H58 L65 145 C68 133 82 124 113 122 Z',
  sedan: 'M105 125 H331 C347 125 360 138 364 155 L369 178 H55 L64 145 C68 132 80 126 105 125 Z',
  estate: 'M98 124 H343 C360 124 372 138 376 156 L381 178 H55 L64 145 C68 132 79 125 98 124 Z',
  suv: 'M95 124 H341 C361 124 377 140 381 160 L386 182 H52 L61 145 C65 132 77 125 95 124 Z',
  minivan: 'M87 122 H353 C374 123 389 140 392 161 L396 183 H50 L59 146 C63 132 74 123 87 122 Z',
  van: 'M78 121 H364 C386 122 402 140 405 163 L409 184 H47 L56 145 C60 130 69 122 78 121 Z',
  premium: 'M101 123 H339 C356 123 371 136 376 153 L382 178 H52 L62 144 C66 130 79 124 101 123 Z',
};

export default function VehicleImagePlaceholder({ model, className = '', hero = false }) {
  const bodyType = normalizeBodyType(model?.bodyType || model?.category);
  const roof = bodyProfiles[bodyType] || bodyProfiles.sedan;
  const body = bodyHeights[bodyType] || bodyHeights.sedan;

  return (
    <div className={`relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc,#eef2f7)] ${className}`}>
      <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-pravac-orange/20 blur-3xl" />
      <div className="absolute -left-14 bottom-0 h-44 w-44 rounded-full bg-pravac-blue/15 blur-3xl" />
      <svg
        aria-hidden="true"
        className="relative z-10 h-full w-full"
        viewBox="0 0 430 230"
      >
        <path d="M30 162 C92 115 132 95 204 95 C276 95 335 115 400 160" fill="none" stroke="#f59a0b" strokeWidth="8" strokeLinecap="round" opacity="0.72" />
        <path d={roof} fill="none" stroke="#082f49" strokeWidth={hero ? 9 : 7} strokeLinecap="round" strokeLinejoin="round" />
        <path d={body} fill="#ffffff" stroke="#082f49" strokeWidth={hero ? 8 : 6} strokeLinejoin="round" />
        <path d="M132 123 L163 94 H221 L246 123" fill="none" stroke="#f59a0b" strokeWidth={hero ? 7 : 5} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M260 124 H326" fill="none" stroke="#f59a0b" strokeWidth={hero ? 7 : 5} strokeLinecap="round" />
        <circle cx="122" cy="179" r="23" fill="#082f49" />
        <circle cx="122" cy="179" r="10" fill="#f59a0b" />
        <circle cx="311" cy="179" r="23" fill="#082f49" />
        <circle cx="311" cy="179" r="10" fill="#f59a0b" />
        <path d="M76 178 H358" fill="none" stroke="#f59a0b" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      </svg>
      {model?.bodyType && (
        <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-pravac-blue shadow-sm">
          {model.bodyType}
        </span>
      )}
    </div>
  );
}

function normalizeBodyType(value = '') {
  const text = String(value).toLowerCase();
  if (text.includes('hatch')) return 'hatchback';
  if (text.includes('estate') || text.includes('combi') || text.includes('variant')) return 'estate';
  if (text.includes('suv')) return 'suv';
  if (text.includes('mini')) return 'minivan';
  if (text.includes('van')) return 'van';
  if (text.includes('premium')) return 'premium';
  if (text.includes('business')) return 'premium';
  return 'sedan';
}
