export const navItems = [
  { key: 'shortTerm', href: '/sk/short-term-car-rental' },
  { key: 'longTerm', href: '/sk/long-term-car-rental' },
  { key: 'corporate', href: '/sk/corporate-car-rentals' },
  { key: 'transfer', href: '/sk/airport-transfers' },
  { key: 'trips', href: '/sk/trips' },
];

export const quickLinks = [
  { key: 'legal', href: '/sk/legal' },
  { key: 'faq', href: '/sk/faq' },
  { key: 'contact', href: '/sk/contact' },
  { key: 'cookie', href: '/sk/cookie' },
];

export const footerNav = [
  ...navItems,
  { key: 'scooters', href: '/sk/scooters' },
  { key: 'franchise', href: '/sk/franchise' },
];

export const serviceItems = [
  {
    key: 'longTerm',
    href: '/sk/long-term-car-rental',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'transfer',
    href: '/sk/airport-transfers',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'partners',
    href: '/sk/corporate-car-rentals',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
  },
];

export const destinationItems = [
  {
    key: 'hallstatt',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/HALLSTATT.jpg?width=1000',
  },
  {
    key: 'wachau',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Wachau%20D%C3%BCrnstein%20Donau%202020-10-03.jpg?width=1000',
  },
  {
    key: 'aqualand',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pasohl%C3%A1vky%2C_Aqualand_Moravia.jpg?width=1000',
  },
  {
    key: 'piestany',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kupele%20Piestany%20Thermia%20Palace.jpg?width=1000',
  },
];

export const testCars = [
  {
    id: 'city-compact',
    key: 'octavia',
    dailyRate: 39,
    locations: ['bratislava-center', 'bratislava-airport', 'vienna-airport'],
    unavailableRanges: [{ from: '2026-05-03', to: '2026-05-05' }],
    image: 'https://images.unsplash.com/photo-1549927681-0b673b8243ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'premium-suv',
    key: 'kodiaq',
    dailyRate: 69,
    locations: ['bratislava-center', 'bratislava-airport', 'vienna-airport', 'budapest-airport'],
    unavailableRanges: [{ from: '2026-05-08', to: '2026-05-10' }],
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'business-van',
    key: 'vclass',
    dailyRate: 89,
    locations: ['bratislava-airport', 'vienna-airport'],
    unavailableRanges: [{ from: '2026-05-01', to: '2026-05-02' }],
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'estate-auto',
    key: 'passat',
    dailyRate: 49,
    locations: ['bratislava-center', 'bratislava-airport'],
    unavailableRanges: [{ from: '2026-05-12', to: '2026-05-14' }],
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80',
  },
];

export const rentalLocations = [
  { id: 'bratislava-center', key: 'bratislavaCenter', fee: 0 },
  { id: 'bratislava-airport', key: 'bratislavaAirport', fee: 0 },
  { id: 'vienna-airport', key: 'viennaAirport', fee: 35 },
  { id: 'budapest-airport', key: 'budapestAirport', fee: 65 },
];

export const heroImages = {
  home: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/%C5%A0koda_Octavia_IV_Combi.png?width=1800',
    'https://commons.wikimedia.org/wiki/Special:FilePath/White_%C5%A0koda_Kodiaq_three-quarter_front_view.jpg?width=1800',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80',
  ],
  short: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1800&q=80',
  long: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=80',
  corporate: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=80',
  transfer: 'https://images.unsplash.com/photo-1483450388369-9ed95738483c?auto=format&fit=crop&w=1800&q=80',
  trips: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=80',
  placeholder: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1800&q=80',
};
