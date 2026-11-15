// Build Pack Section 9 (a): automated scan. Exit code 1 on any failure.
// Runs at the end of `npm run build` on the prerendered dist/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/site.json'), 'utf8'));
const faq = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/faq.json'), 'utf8'));

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
})(DIST);

const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
function textOf(html) {
  const metas = [...html.matchAll(/<(?:title)>([^<]*)<\/title>|<meta (?:name|property)="(?:description|og:[a-z:]+|twitter:[a-z:]+)" content="([^"]*)"/g)]
    .map((m) => m[1] || m[2] || '').filter((s) => !/^https?:/.test(s));
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    const out = [];
    (function walk(o) { if (typeof o === 'string') { if (!/^https?:|@/.test(o)) out.push(o); } else if (o && typeof o === 'object') Object.entries(o).forEach(([k, v]) => k.startsWith('@') || walk(v)); })(JSON.parse(m[1]));
    return out.join(' ');
  });
  const body = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<head>[\s\S]*?<\/head>/, ' ').replace(/<[^>]+>/g, ' ');
  return decode([...metas, ...ld, body].join(' \n ')).replace(/\s+/g, ' ');
}

const BANNED = ['luxury', 'free', 'audit', 'no obligation', 'bespoke', 'elevate', 'seamless', 'world-class', 'state of the art', 'tailored solutions', 'leverage', 'just checking in', 'circling back', 'I hope this finds you well', 'guarantee', 'guaranteed', 'limited', 'countdown', 'today only', 'starting at', 'increase sales', 'boost revenue', 'losing customers', '10 years', 'never missed', '23 percent', '46.1', 'Stanford', 'Lucidpress', 'coming soon', 'placeholder', 'lorem', 'TODO', 'LORVAL', 'KOVA', 'MAREV', 'VAEL', 'RedBird', 'HiZypern', 'Survival', 'Imam', "world's largest", 'comprehensive agency', 'exceeding', 'only X left'];
const ALLOWED_NUM = new Set(['1', '7', '14', '2', '6', '30', '2016', '2022']);
// Verbatim client quote is exempt from the number rule (it says "40+"). Reported, not hidden.
const QUOTE_EXEMPT = site.mayfair.quote;

const fails = [];
const notes = [];
const fail = (f, m) => fails.push(`${path.relative(DIST, f)}: ${m}`);

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  let t = textOf(html);

  if (/—/.test(html)) fail(f, 'em dash found');
  if (/–/.test(t)) fail(f, 'en dash found');
  if (/!/.test(t)) fail(f, 'exclamation mark found');
  for (const w of BANNED) {
    const re = new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`, 'i');
    if (re.test(t)) fail(f, `banned phrase: "${w}"`);
  }
  if (/[£$€]|\b(USD|GBP|EUR|pounds?|dollars?)\b/i.test(t)) fail(f, 'currency symbol or word');
  if (/\[(NICHE_[A-Z]+|VEHICLE|SURFACES|LISTING_SITES|NEXT_ORDER|TITLE)\]|\{\{/.test(t)) fail(f, 'unreplaced token');

  let tn = t.split(site.email).join(' ').replace(/ico\.org\.uk/g, ' ');
  for (const q of QUOTE_EXEMPT) if (tn.includes(q)) { tn = tn.split(q).join(' '); notes.push(`${path.relative(DIST, f)}: client quote exempt from number rule ("40+")`); }
  for (const m of tn.matchAll(/\d+(?:[.,]\d+)?/g)) if (!ALLOWED_NUM.has(m[0])) fail(f, `number not allowed: "${m[0]}" near "${tn.slice(Math.max(0, m.index - 30), m.index + 30).trim()}"`);

  if (/linkedin\.com\/[^"]*\/admin/i.test(html)) fail(f, 'LinkedIn admin link found');
  for (const m of html.matchAll(/<a [^>]*target="_blank"[^>]*>/g)) if (!/rel="noopener noreferrer"/.test(m[0])) fail(f, 'external link without rel=noopener noreferrer');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(f, `expected exactly one h1, found ${h1}`);
  // The contact form is allowed on /contact/ only, and must post to our own API.
  if (/<form[\s>]/i.test(html) && !(f.endsWith(path.join('contact', 'index.html')) && /<form [^>]*action="\/api\/contact\/"/.test(html))) fail(f, 'form found outside /contact/ or not posting to /api/contact/');
  if (/<(iframe|embed|object)[\s>]/i.test(html)) fail(f, 'embed found');
  for (const m of html.matchAll(/<(?:script|link|img)[^>]+(?:src|href)="(https?:)?\/\/[^"]+"/g)) if (!m[0].includes('rel="canonical"')) fail(f, `external resource: ${m[0].slice(0, 80)}`);
  if (/utm_|gtag|googletagmanager|fbq\(|analytics|plausible|cookie/i.test(html.replace(/There are no cookies, no analytics/, ''))) fail(f, 'tracking reference');
  const expectedMailto = `mailto:${site.email}?subject=${site.mailtoSubject}&amp;body=${site.mailtoBody}`;
  if (!html.includes(expectedMailto)) fail(f, 'brief mailto (live subject and body) missing');
  for (const m of html.matchAll(/href="mailto:([^"]+)"/g)) if (m[1] !== site.email && !m[1].startsWith(`${site.email}?subject=${site.mailtoSubject}&amp;body=`)) fail(f, `unexpected mailto ${m[1].slice(0, 60)}`);

  // PENDING must never show
  for (const i of faq.items.filter((x) => x.status !== 'SOURCED')) if (t.includes(i.question)) fail(f, `PENDING question visible: ${i.id}`);
  for (const p of ['applied system', 'Client, December', 'If you pass all six, you do not need us', 'Do not worry if something is missing', 'schedule comes with your proposal']) if (t.includes(p)) fail(f, `PENDING text visible: "${p}"`);
}

console.log(`Scanned ${files.length} pages.`);
[...new Set(notes)].forEach((n) => console.log('NOTE ' + n));
if (fails.length) { console.log(`FAIL (${fails.length})`); fails.forEach((x) => console.log('  ' + x)); process.exit(1); }
console.log('PASS: Section 9 (a) automated scan');
