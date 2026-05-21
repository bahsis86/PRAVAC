import { useEffect } from 'react';
import AdminPanel from './components/admin/AdminPanel.jsx';
import PageShell from './components/PageShell.jsx';
import {
  ContactPage,
  CorporatePage,
  HomePage,
  LongTermPage,
  ShortTermPage,
  SimplePage,
  TransferPage,
  TripsPage,
} from './components/public/PublicPages.jsx';
import { useI18n } from './i18n/I18nContext.jsx';
import { usePathname } from './router/usePathname.js';

const simpleRoutes = {
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

function PublicRoute({ children }) {
  return <PageShell>{children}</PageShell>;
}

const routes = {
  '/': () => <PublicRoute><HomePage /></PublicRoute>,
  '/sk': () => <PublicRoute><HomePage /></PublicRoute>,
  '/sk/short-term-car-rental': () => <PublicRoute><ShortTermPage /></PublicRoute>,
  '/sk/long-term-car-rental': () => <PublicRoute><LongTermPage /></PublicRoute>,
  '/sk/corporate-car-rentals': () => <PublicRoute><CorporatePage /></PublicRoute>,
  '/sk/airport-transfers': () => <PublicRoute><TransferPage /></PublicRoute>,
  '/sk/trips': () => <PublicRoute><TripsPage /></PublicRoute>,
  '/sk/contact': () => <PublicRoute><ContactPage /></PublicRoute>,
  '/sk/admin-pravac': AdminPanel,
  ...Object.fromEntries(Object.entries(simpleRoutes).map(([path, pageKey]) => [
    path,
    () => <PublicRoute><SimplePage pageKey={pageKey} /></PublicRoute>,
  ])),
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
