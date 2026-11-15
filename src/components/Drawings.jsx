// Line drawings for the hero (five surfaces) and the problem section (two mismatched logos).
// "good" = one consistent brand mark. "badA" / "badB" = the different logos a customer sees.
import { niche, cap } from '../lib/content.js';

const MARKS = {
  good: (x, y, s) => `<g class="mk"><rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.12}" class="mk-bg"/><rect x="${x + s * 0.22}" y="${y + s * 0.3}" width="${s * 0.56}" height="${s * 0.13}" class="mk-fg"/><rect x="${x + s * 0.22}" y="${y + s * 0.56}" width="${s * 0.36}" height="${s * 0.13}" class="mk-fg"/></g>`,
  badA: (x, y, s) => `<g class="mk-bad"><circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s / 2}" class="bad-a"/><circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s / 4.5}" class="bad-a-in"/></g>`,
  badB: (x, y, s) => `<g class="mk-bad"><path d="M${x} ${y + s} L${x + s / 2} ${y} L${x + s} ${y + s} Z" class="bad-b"/><rect x="${x + s * 1.2}" y="${y + s * 0.35}" width="${s * 1.1}" height="${s * 0.3}" class="bad-b"/></g>`,
};

const ICONS = {
  van: (m) => `<path d="M8 66V32h62l18 16h22v18Z"/><path d="M73 36l11 10H73Z"/><circle cx="30" cy="68" r="8" class="wheel"/><circle cx="90" cy="68" r="8" class="wheel"/><line x1="4" y1="78" x2="116" y2="78" class="ground"/>${m(18, 40, 16)}<line x1="40" y1="44" x2="62" y2="44"/><line x1="40" y1="52" x2="56" y2="52"/>`,
  board: (m) => `<rect x="18" y="12" width="84" height="42"/><line x1="34" y1="54" x2="34" y2="78"/><line x1="86" y1="54" x2="86" y2="78"/><line x1="8" y1="78" x2="112" y2="78" class="ground"/>${m(28, 22, 20)}<line x1="56" y1="28" x2="92" y2="28"/><line x1="56" y1="38" x2="84" y2="38"/>`,
  quote: (m) => `<rect x="32" y="6" width="56" height="74"/>${m(40, 14, 13)}<line x1="40" y1="38" x2="80" y2="38"/><line x1="40" y1="46" x2="80" y2="46"/><line x1="40" y1="54" x2="72" y2="54"/><line x1="60" y1="68" x2="80" y2="68" class="thick"/>`,
  workwear: (m) => `<path d="M42 12l12-5q6 8 12 0l12 5 16 15-10 10-6-6v49H42V31l-6 6-10-10Z"/>${m(63, 26, 11)}`,
  website: (m) => `<rect x="12" y="10" width="96" height="66" rx="3"/><line x1="12" y1="21" x2="108" y2="21"/><circle cx="19" cy="15.5" r="1.6" class="dot"/><circle cx="25" cy="15.5" r="1.6" class="dot"/>${m(20, 29, 12)}<line x1="40" y1="35" x2="96" y2="35"/><rect x="20" y="48" width="38" height="20" class="soft"/><rect x="64" y="48" width="36" height="20" class="soft"/>`,
};

function iconFor(label) {
  const l = label.toLowerCase();
  if (/van|vehicle|truck/.test(l)) return ICONS.van;
  if (/board|sign/.test(l)) return ICONS.board;
  if (/quote|invoice|sheet/.test(l)) return ICONS.quote;
  if (/wear|uniform|shirt/.test(l)) return ICONS.workwear;
  if (/web|site|online/.test(l)) return ICONS.website;
  return ICONS.quote;
}

export function Drawing({ label, mark, className = '' }) {
  return <svg viewBox="0 0 120 86" className={`draw ${className}`} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: iconFor(label)(MARKS[mark]) }} />;
}

export function Surfaces({ ink }) {
  const labels = niche.SURFACES.split(',').map((s) => s.trim());
  return (
    <ul data-stagger aria-label={cap(niche.SURFACES)} className={`surfaces mt-16 grid grid-cols-2 gap-px border md:grid-cols-5 ${ink ? 'border-white/15 bg-white/15' : 'border-line bg-line'}`}>
      {labels.map((l, i) => {
        const last = i === labels.length - 1;
        return (
          <li key={l} className={`bg-off ${last ? 'col-span-2 md:col-span-1' : ''}`}>
            <figure className="m-0 px-4 pb-4 pt-6">
              <Drawing label={l} mark="good" className={last ? 'mx-auto max-w-[11rem] md:max-w-none' : ''} />
              <figcaption className="label mt-3 text-ink">{cap(l)}</figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}

export function Mismatch() {
  return (
    <div aria-hidden="true" data-stagger className="grid grid-cols-2 gap-px self-start border border-line bg-line">
      <figure className="m-0 bg-off px-4 pb-4 pt-6"><Drawing label={niche.VEHICLE} mark="badA" /><figcaption className="label mt-3 text-ink">{cap(niche.VEHICLE)}</figcaption></figure>
      <figure className="m-0 bg-off px-4 pb-4 pt-6"><Drawing label="quote" mark="badB" /><figcaption className="label mt-3 text-ink">Quote</figcaption></figure>
    </div>
  );
}
