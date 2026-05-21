const locationNames = {
  sk: {
    'bratislava-center': 'Bratislava centrum',
    'bratislava-airport': 'Letisko Bratislava',
    'vienna-airport': 'Letisko Vieden',
    'budapest-airport': 'Letisko Budapest',
    'delivery-address': 'Dorucenie na adresu',
  },
  en: {
    'bratislava-center': 'Bratislava center',
    'bratislava-airport': 'Bratislava Airport',
    'vienna-airport': 'Vienna Airport',
    'budapest-airport': 'Budapest Airport',
    'delivery-address': 'Delivery to address',
  },
  ru: {
    'bratislava-center': 'Центр Братиславы',
    'bratislava-airport': 'Аэропорт Братиславы',
    'vienna-airport': 'Аэропорт Вены',
    'budapest-airport': 'Аэропорт Будапешта',
    'delivery-address': 'Доставка по адресу',
  },
  tr: {
    'bratislava-center': 'Bratislava merkezi',
    'bratislava-airport': 'Bratislava Havalimani',
    'vienna-airport': 'Viyana Havalimani',
    'budapest-airport': 'Budapeste Havalimani',
    'delivery-address': 'Adrese teslim',
  },
};

export function getLocationName(location, language) {
  if (!location) return '';
  return locationNames[language]?.[location.id] || locationNames.en[location.id] || location.name;
}
