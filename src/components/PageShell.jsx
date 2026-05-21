import Footer from './Footer.jsx';
import Header from './Header.jsx';

export default function PageShell({ children }) {
  return (
    <>
      <Header />
      <main className="public-shell relative overflow-x-clip bg-[var(--pravac-black)]">{children}</main>
      <Footer />
    </>
  );
}
