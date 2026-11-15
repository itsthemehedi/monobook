// Header, footer and mobile bar around every page. Also handles scroll, #hash answers and motion on page change.
import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import wordmarkRaw from '../../content/wordmark.svg?raw';
import { site } from '../lib/content.js';
import { Cta, Social } from './ui.jsx';

const wordmark = wordmarkRaw.replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// Opens and scrolls to the element named in the URL hash, e.g. /questions/#price-how.
function openHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const el = id && document.getElementById(id);
  if (!el) return false;
  if (el.tagName === 'DETAILS') el.open = true;
  el.scrollIntoView();
  return true;
}

function Header() {
  const menu = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => { if (menu.current) menu.current.open = false; }, [pathname]);
  const links = site.nav.map((n) => <li key={n.href}><NavLink className="header-link" to={n.href}>{n.label}</NavLink></li>);
  return (
    <header className="site-header sticky top-0 z-10 h-header border-b border-line bg-paper">
      <div className="wrap flex h-full items-center justify-between gap-6">
        <Link className="inline-flex min-h-tap items-center text-ink" to="/" aria-label="MonoBook, home">
          <span className="block w-[8.25rem]" dangerouslySetInnerHTML={{ __html: wordmark }} />
        </Link>
        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-8">{links}<li><Cta className="header-link header-link-cta" /></li></ul>
        </nav>
        <details ref={menu} className="nav-mobile lg:hidden">
          <summary className="label inline-flex min-h-tap cursor-pointer list-none items-center underline underline-offset-[.35em]">Menu</summary>
          <nav aria-label="Main" className="absolute inset-x-0 top-header border-b border-line bg-paper px-4 pb-8 pt-2 md:px-8">
            <ul className="flex flex-col [&_.header-link]:min-h-control [&_.header-link]:w-full [&_.header-link]:border-b [&_.header-link]:border-line [&_.header-link]:text-h3 [&_.header-link]:tracking-[-.02em]">
              {links}
              <li><NavLink className="header-link" to="/contact/">Contact</NavLink></li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}

function Footer() {
  const a = 'inline-flex min-h-tap items-center';
  return (
    <footer className="site-footer border-t border-line bg-paper pb-8 pt-16 text-ink">
      <div className="wrap">
        <div className="label grid gap-8 md:grid-cols-[5fr_4fr_3fr]">
          <div>
            <p className="mb-2 text-muted">Contact</p>
            <p className="mb-2"><a className={a} href={`mailto:${site.email}`}>{site.email}</a></p>
            <p className="mb-2">{site.footerPlace}</p>
          </div>
          <div>
            <p className="mb-2 text-muted">Pages</p>
            <ul>
              {site.nav.map((n) => <li key={n.href}><Link className={a} to={n.href}>{n.label}</Link></li>)}
              <li><Link className={a} to="/contact/">Contact</Link></li>
            </ul>
          </div>
          <div>
            <Social />
            <ul>
              <li><Link className={a} to="/privacy/">Privacy</Link></li>
              <li><a className={a} href="#top">Back to top</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 text-ink [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: wordmark }} />
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);

  // On page change: start reveal motion for the new content (public/motion.js), then scroll.
  useIsoLayoutEffect(() => {
    if (window.mbMotion) window.mbMotion();
    if (first.current) { first.current = false; if (hash) openHash(); return; }
    if (!(hash && openHash())) window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    window.addEventListener('hashchange', openHash);
    return () => window.removeEventListener('hashchange', openHash);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <div className="mobile-cta lg:hidden"><Cta className="mobile-cta-link" /></div>
    </>
  );
}
