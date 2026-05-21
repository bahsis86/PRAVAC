import { ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { Link } from '../router/Link.jsx';
import AmbientBackground from './visual/AmbientBackground.jsx';

export default function CTASection({ title, text, href = '/sk/contact', button }) {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-graphite py-14 text-white md:py-20">
      <AmbientBackground variant="cta" />
      <div className="container-shell flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black md:text-5xl">{title}</h2>
          {text && <p className="mt-4 leading-8 text-zinc-300">{text}</p>}
        </div>
        <Link className="button-primary relative z-10 w-fit gap-2" href={href}>
          {button || t('common.contactCta')} <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
