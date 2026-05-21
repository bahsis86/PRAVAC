import { Send } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import FormMessage from './FormMessage.jsx';
import AmbientBackground from './visual/AmbientBackground.jsx';

export default function TransferForm() {
  const [sent, setSent] = useState(false);
  const { t } = useI18n();

  const onSubmit = (event) => {
    event.preventDefault();
    if (event.currentTarget.checkValidity()) setSent(true);
  };

  return (
    <section className="relative overflow-hidden bg-[var(--pravac-black)] py-12 md:py-16">
      <AmbientBackground variant="section" />
      <form className="container-shell relative z-10 grid gap-4 rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-soft backdrop-blur md:grid-cols-2 lg:grid-cols-3" onSubmit={onSubmit}>
        <Input label={t('forms.from')} name="from" required />
        <Input label={t('forms.to')} name="to" required />
        <Input label={t('forms.time')} name="time" type="datetime-local" required />
        <Input label={t('forms.people')} name="people" min="1" type="number" required />
        <Input label={t('forms.seats')} name="seats" min="0" type="number" />
        <label>
          <span className="field-label">{t('forms.returnTransfer')}</span>
          <select className="input-base" name="returnTransfer" required>
            <option>{t('forms.no')}</option>
            <option>{t('forms.yes')}</option>
          </select>
        </label>
        <label>
          <span className="field-label">{t('forms.individualCompany')}</span>
          <select className="input-base" name="clientType" required>
            <option>{t('forms.individual')}</option>
            <option>{t('forms.company')}</option>
          </select>
        </label>
        <Input label={t('forms.firstName')} name="firstName" required />
        <Input label={t('forms.lastName')} name="lastName" required />
        <Input label={t('forms.phone')} name="phone" placeholder={t('common.phone')} type="tel" required />
        <Input label={t('forms.email')} name="email" type="email" required />
        <label className="md:col-span-2 lg:col-span-3">
          <span className="field-label">{t('forms.comment')}</span>
          <textarea className="input-base min-h-32" name="comment" placeholder={t('forms.commentPlaceholder')} />
        </label>
        <div className="md:col-span-2 lg:col-span-3">
          <button className="button-primary w-full gap-2 md:w-auto" type="submit">
            <Send size={18} /> {t('forms.submit')}
          </button>
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <FormMessage sent={sent} />
        </div>
      </form>
    </section>
  );
}

function Input({ label, ...props }) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <input className="input-base" {...props} />
    </label>
  );
}
