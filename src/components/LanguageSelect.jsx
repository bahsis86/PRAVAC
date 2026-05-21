import { useI18n } from '../i18n/I18nContext.jsx';

const languageOptions = [
  { value: 'sk', label: 'SK' },
  { value: 'en', label: 'EN' },
  { value: 'ru', label: 'RU' },
  { value: 'tr', label: 'TR' },
];

export function LanguageSelect({ compact = false, className = '' }) {
  const { language, setLanguage, t } = useI18n();

  return (
    <select
      aria-label={t('common.language')}
      className={`min-h-11 min-w-20 rounded-md border border-white/25 bg-zinc-950/80 text-sm font-semibold text-white outline-none transition active:bg-white/15 hover:bg-white/15 focus:border-pravac focus:ring-4 focus:ring-pravac/20 ${
        compact ? 'px-2 py-2 pr-8' : 'px-3 py-2 pr-9'
      } ${className}`}
      value={language}
      onChange={(event) => setLanguage(event.target.value)}
    >
      {languageOptions.map((option) => (
        <option className="text-ink" key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function LanguageButtons({ className = '' }) {
  const { language, setLanguage, t } = useI18n();

  return (
    <div aria-label={t('common.language')} className={`grid grid-cols-4 gap-2 ${className}`} role="group">
      {languageOptions.map((option) => {
        const active = language === option.value;
        const chooseLanguage = () => setLanguage(option.value);
        return (
          <button
            aria-pressed={active}
            className={`min-h-11 rounded-md border px-3 text-sm font-black transition active:scale-95 ${
              active
                ? 'border-pravac bg-pravac text-white'
                : 'border-white/15 bg-white/10 text-white active:bg-white/20'
            }`}
            key={option.value}
            onClick={chooseLanguage}
            onPointerDown={chooseLanguage}
            onTouchStart={chooseLanguage}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
