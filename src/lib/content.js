// All copy lives in /content (JSON). Only items with status "SOURCED" are shown.
// To change text: edit the JSON, not the components.
import niche from '../../content/niche.json';
import site from '../../content/site.json';
import faq from '../../content/faq.json';
import home from '../../content/pages/home.json';
import whatYouGet from '../../content/pages/what-you-get.json';
import processPage from '../../content/pages/process.json';
import work from '../../content/pages/work.json';
import questions from '../../content/pages/questions.json';
import about from '../../content/pages/about.json';
import contact from '../../content/pages/contact.json';
import privacy from '../../content/pages/privacy.json';
import notFound from '../../content/pages/404.json';

export { niche, site, faq };
export const PAGES = [home, whatYouGet, processPage, work, questions, about, contact, privacy, notFound];
export const NOT_FOUND = notFound;

export const SOURCED = (x) => !!x && x.status === 'SOURCED';

// [NICHE_*] tokens come from content/niche.json. Capitalised at the start of a sentence.
const NICHE_KEYS = ['NICHE_NAME', 'NICHE_FIRMS', 'NICHE_TRADES', 'VEHICLE', 'SURFACES', 'LISTING_SITES', 'NEXT_ORDER'];
export function tok(s) {
  return s.replace(new RegExp(`\\[(${NICHE_KEYS.join('|')})\\]`, 'g'), (m, k, i, all) => {
    const v = niche[k];
    if (v === undefined) throw new Error(`Unknown niche token ${m}`);
    const start = i === 0 || /[.?:]\s$/.test(all.slice(0, i));
    return start ? v[0].toUpperCase() + v.slice(1) : v;
  });
}
export const plain = (s) => tok(s).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1').replace('{{EMAIL_LINK}}', site.email);
export const cap = (s) => s[0].toUpperCase() + s.slice(1);

// The one call to action everywhere: the brief email with the live subject and body.
export const MAILTO = `mailto:${site.email}?subject=${site.mailtoSubject}&body=${site.mailtoBody}`;

export const sourcedFaq = faq.items.filter(SOURCED);
export const faqById = Object.fromEntries(sourcedFaq.map((i) => [i.id, i]));
export const answerPlain = (item) =>
  item.answer.map((p) => (p === '{{CHECKLIST}}' ? site.checklistSeven.items.join(' ') : plain(p))).join(' ');

export function findMedia(caseKey, key) {
  const c = site[caseKey];
  if (c.media && c.media[key]) return c.media[key];
  for (const g of Object.values(c.galleries || {})) {
    const hit = g.items.find((i) => i.src.endsWith('/' + key));
    if (hit) return hit;
  }
  throw new Error(`No media "${key}" for ${caseKey}`);
}
