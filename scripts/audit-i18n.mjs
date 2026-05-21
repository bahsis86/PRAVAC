import { translations } from '../src/i18n/translations.js';

const forbiddenOutsideSk = [
  'Viac',
  'Dlhodobý prenájom',
  'Letiskový transfer',
  'Pre partnerov',
  'Naše služby',
  'Mobilita podľa',
  'Predbežná cena',
  'Dostupné',
  'Nedostupné',
  'Všetko',
];

const requiredCommonMore = {
  en: 'More',
  ru: 'Подробнее',
  tr: 'Daha fazla',
};

const failures = [];

for (const [language, expected] of Object.entries(requiredCommonMore)) {
  if (translations[language]?.common?.more !== expected) {
    failures.push(`${language}.common.more expected "${expected}", got "${translations[language]?.common?.more}"`);
  }
}

for (const language of ['en', 'ru', 'tr']) {
  const text = flattenValues(translations[language]).join('\n');
  for (const token of forbiddenOutsideSk) {
    if (text.includes(token)) {
      failures.push(`${language} contains Slovak token: ${token}`);
    }
  }
}

if (failures.length) {
  console.error('i18n audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('i18n audit passed');

function flattenValues(value) {
  if (Array.isArray(value)) return value.flatMap(flattenValues);
  if (value && typeof value === 'object') return Object.values(value).flatMap(flattenValues);
  return typeof value === 'string' ? [value] : [];
}
