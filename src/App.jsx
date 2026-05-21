import { useEffect } from 'react';
import CTASection from './components/CTASection.jsx';
import CarReservation from './components/CarReservation.jsx';
import ContentSection from './components/ContentSection.jsx';
import DestinationCards from './components/DestinationCards.jsx';
import FeatureBar from './components/FeatureBar.jsx';
import FleetAvailability from './components/FleetAvailability.jsx';
import Hero from './components/Hero.jsx';
import PageShell from './components/PageShell.jsx';
import SearchFormLongTerm from './components/SearchFormLongTerm.jsx';
import SearchFormShortTerm from './components/SearchFormShortTerm.jsx';
import ServiceCards from './components/ServiceCards.jsx';
import TransferForm from './components/TransferForm.jsx';
import AdminPanel from './components/admin/AdminPanel.jsx';
import GlowCard from './components/visual/GlowCard.jsx';
import PremiumSection from './components/visual/PremiumSection.jsx';
import { heroImages } from './data/siteData.js';
import { useI18n } from './i18n/I18nContext.jsx';
import { usePathname } from './router/usePathname.js';

const simpleRoutes = {
  '/sk/contact': 'contact',
  '/sk/faq': 'faq',
  '/sk/legal': 'legal',
  '/sk/cookie': 'cookie',
  '/sk/scooters': 'scooters',
  '/sk/franchise': 'franchise',
};

export default function App() {
  const pathname = usePathname();
  const { t, language } = useI18n();
  const Page = routes[pathname] || (() => <SimplePage pageKey="notFound" />);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('meta.defaultTitle');
    updateMetaDescription(t('meta.defaultDescription'));
  }, [language, t]);

  return <Page />;
}

function HomePage() {
  const { dict } = useI18n();
  const page = dict.pages.home;

  return (
    <PageShell>
      <Hero title={page.title} image={heroImages.home}>
        <SearchFormShortTerm />
      </Hero>
      <FeatureBar />
      <ContentSection title={page.contentTitle} image="https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80">
        {page.body.map((text) => <p key={text}>{text}</p>)}
      </ContentSection>
      <CarReservation />
      <FleetAvailability />
      <ServiceCards />
    </PageShell>
  );
}

function ShortTermPage() {
  const { dict } = useI18n();
  const page = dict.pages.short;

  return (
    <PageShell>
      <Hero title={page.title} image={heroImages.short}>
        <SearchFormShortTerm />
      </Hero>
      <FeatureBar />
      <CarReservation />
      <ContentSection title={page.contentTitle} image="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80">
        {page.sections.map(([title, text]) => (
          <section key={title}>
            <h3 className="text-xl font-black text-graphite">{title}</h3>
            <p>{text}</p>
          </section>
        ))}
      </ContentSection>
      <FleetAvailability />
      <ServiceCards />
    </PageShell>
  );
}

function LongTermPage() {
  const { dict } = useI18n();
  const page = dict.pages.long;

  return (
    <PageShell>
      <Hero title={page.title} image={heroImages.long}>
        <SearchFormLongTerm />
      </Hero>
      <FeatureBar />
      <ContentSection title={page.contentTitle} image="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80">
        <p>{page.intro}</p>
        <h3 className="text-xl font-black text-graphite">{page.offerTitle}</h3>
        <ul className="grid gap-3 font-semibold text-ink">
          {page.offer.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <h3 className="text-xl font-black text-graphite">{page.supportTitle}</h3>
        <p>{page.support}</p>
        <h3 className="text-xl font-black text-graphite">{page.aboutTitle}</h3>
        <p>{page.about}</p>
      </ContentSection>
      <FleetAvailability />
      <ServiceCards />
    </PageShell>
  );
}

function CorporatePage() {
  const { dict } = useI18n();
  const page = dict.pages.corporate;

  return (
    <PageShell>
      <Hero title={page.title} subtitle={page.subtitle} image={heroImages.corporate} compact />
      <FeatureBar />
      <PromoGrid promos={page.promos} />
      <ContentSection title={page.mainTitle} muted>
        <p>{page.main}</p>
        <h3 className="text-xl font-black text-graphite">{page.termsTitle}</h3>
        {page.terms.map((item) => <p key={item}>{item}</p>)}
      </ContentSection>
      <ContentSection title={page.benefitsTitle} image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80">
        <p>{page.benefits}</p>
        <p>{page.bloggers}</p>
      </ContentSection>
    </PageShell>
  );
}

function TransferPage() {
  const { dict } = useI18n();
  const page = dict.pages.transfer;

  return (
    <PageShell>
      <Hero title={page.title} subtitle={page.subtitle} image={heroImages.transfer} compact />
      <FeatureBar variant="transfer" />
      <TransferForm />
      <ContentSection title={page.contentTitle} image="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80">
        {page.sections.map(([title, text], index) => (
          index === 0 ? <p key={title}>{text}</p> : (
            <section key={title}>
              <h3 className="text-xl font-black text-graphite">{title}</h3>
              <p>{text}</p>
            </section>
          )
        ))}
      </ContentSection>
      <ServiceCards />
    </PageShell>
  );
}

function TripsPage() {
  const { dict } = useI18n();
  const page = dict.pages.trips;

  return (
    <PageShell>
      <Hero title={page.title} image={heroImages.trips} compact />
      <ContentSection title={page.introTitle} image="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80">
        <p>{page.intro}</p>
      </ContentSection>
      <DestinationCards />
      <ContentSection title={page.whyTitle} muted>
        {page.why.map((item) => <p key={item}>{item}</p>)}
      </ContentSection>
      <CTASection title={page.ctaTitle} text={page.ctaText} />
    </PageShell>
  );
}

function SimplePage({ pageKey }) {
  const { dict } = useI18n();
  const [title, text] = dict.pages.simple[pageKey];

  return (
    <PageShell>
      <Hero title={title} image={heroImages.placeholder} compact />
      <ContentSection title={title}>
        <p>{text}</p>
        <p>{dict.pages.simple.extra}</p>
      </ContentSection>
      <CTASection title={dict.pages.simple.ctaTitle} text={dict.pages.simple.ctaText} />
    </PageShell>
  );
}

function PromoGrid({ promos }) {
  return (
    <PremiumSection className="py-14 md:py-20" innerClassName="grid gap-5 md:grid-cols-2">
        {promos.map(([title, text]) => (
          <GlowCard key={title} className="p-7 shadow-sm">
            <h2 className="text-2xl font-black text-graphite">{title}</h2>
            <p className="mt-4 leading-8 text-zinc-600">{text}</p>
          </GlowCard>
        ))}
    </PremiumSection>
  );
}

const routes = {
  '/': HomePage,
  '/sk': HomePage,
  '/sk/short-term-car-rental': ShortTermPage,
  '/sk/long-term-car-rental': LongTermPage,
  '/sk/corporate-car-rentals': CorporatePage,
  '/sk/airport-transfers': TransferPage,
  '/sk/trips': TripsPage,
  '/sk/admin-pravac': AdminPanel,
  ...Object.fromEntries(Object.entries(simpleRoutes).map(([path, pageKey]) => [path, () => <SimplePage pageKey={pageKey} />])),
};

function updateMetaDescription(content) {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'description');
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}
