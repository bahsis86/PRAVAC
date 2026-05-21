import { useI18n } from '../i18n/I18nContext.jsx';

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
      <option className="text-ink" value="sk">
        SK
      </option>
      <option className="text-ink" value="en">
        EN
      </option>
      <option className="text-ink" value="ru">
        RU
      </option>
      <option className="text-ink" value="tr">
        TR
      </option>
    </select>
  );
}
