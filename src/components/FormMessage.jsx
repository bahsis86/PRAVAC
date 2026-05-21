import { useI18n } from '../i18n/I18nContext.jsx';

export default function FormMessage({ sent }) {
  const { t } = useI18n();

  if (!sent) return null;

  return (
    <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
      {t('common.thanks')}
    </p>
  );
}
