import Footer from './Footer.jsx';
import Header from './Header.jsx';
import CursorGlow from './visual/CursorGlow.jsx';

export default function PageShell({ children }) {
  return (
    <>
      <CursorGlow />
      <Header />
      <main className="public-shell relative overflow-x-clip bg-[var(--pravac-black)]">{children}</main>
      <Footer />
    </>
  );
}
