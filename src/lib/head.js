// Builds the <head> tags for each prerendered page (title, meta, Open Graph, JSON-LD).
import { site, sourcedFaq, plain, answerPlain } from './content.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSP = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'";

function jsonLd(page) {
  const o = site.origin;
  const org = { '@type': 'Organization', '@id': `${o}/#org`, name: site.name, alternateName: site.alternateName, foundingDate: site.foundingDate, founder: { '@type': 'Person', name: site.founder }, sameAs: (site.social || []).map((s) => s.href), url: `${o}/`, email: site.email, logo: `${o}/icon.svg`, address: { '@type': 'PostalAddress', addressLocality: 'Satkhira', addressCountry: 'BD' } };
  const graph = [];
  if (page.path === '/') graph.push(org, { '@type': 'WebSite', '@id': `${o}/#site`, url: `${o}/`, name: site.name, publisher: { '@id': `${o}/#org` } });
  if (page.path === '/questions/') graph.push({ '@type': 'FAQPage', mainEntity: sourcedFaq.map((q) => ({ '@type': 'Question', name: plain(q.question), acceptedAnswer: { '@type': 'Answer', text: answerPlain(q) } })) });
  if (!graph.length) return '';
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;
}

export function headFor(page) {
  const url = page.path === '/404.html' ? null : `${site.origin}${page.path}`;
  return [
    `<meta http-equiv="Content-Security-Policy" content="${CSP}">`,
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}">`,
    `<meta name="application-name" content="${esc(site.applicationName)}">`,
    '<meta name="theme-color" content="#FBFBFB">',
    '<meta name="color-scheme" content="light">',
    page.noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index, follow">',
    url && `<link rel="canonical" href="${url}">`,
    `<meta property="og:title" content="${esc(page.title)}">`,
    `<meta property="og:description" content="${esc(page.description)}">`,
    url && `<meta property="og:url" content="${url}">`,
    `<meta property="og:site_name" content="${esc(site.applicationName)}">`,
    '<meta property="og:locale" content="en_GB">',
    '<meta property="og:type" content="website">',
    `<meta property="og:image" content="${site.origin}${site.ogImage}">`,
    `<meta property="og:image:alt" content="${esc(site.ogImageAlt)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(page.title)}">`,
    `<meta name="twitter:description" content="${esc(page.description)}">`,
    `<meta name="twitter:image" content="${site.origin}${site.ogImage}">`,
    '<link rel="icon" href="/icon.svg" type="image/svg+xml">',
    '<link rel="icon" href="/icon-48.png" sizes="48x48" type="image/png">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/manifest.webmanifest">',
    '<link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>',
    '<link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>',
    jsonLd(page),
  ].filter(Boolean).join('\n');
}
