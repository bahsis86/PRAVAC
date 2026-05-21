import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from './translations.js';

const I18nContext = createContext(null);
const supportedLanguages = ['sk', 'en', 'ru', 'tr'];

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => getInitialLanguage());

  const setLanguage = (nextLanguage) => {
    const normalized = supportedLanguages.includes(nextLanguage) ? nextLanguage : 'en';
    setLanguageState(normalized);
    localStorage.setItem('pravac-language', normalized);
  };

  const value = useMemo(() => {
    const dict = translations[language] || translations.en;
    const t = (path, fallback = '') => {
      const value = path.split('.').reduce((acc, key) => acc?.[key], dict);
      return value ?? fallback ?? path;
    };

    return { dict, language, setLanguage, t };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function getInitialLanguage() {
  const saved = localStorage.getItem('pravac-language');
  if (supportedLanguages.includes(saved)) return saved;

  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const detected = browserLanguages
    .map((item) => item?.toLowerCase().split('-')[0])
    .find((item) => supportedLanguages.includes(item));

  return detected || 'en';
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}
