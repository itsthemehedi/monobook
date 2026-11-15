// Work page: Mayfair (case one, refined) and Gärtnerabo (case two, built new).
import { site, SOURCED, findMedia } from '../lib/content.js';
import { Inline, Section, Eyebrow, Pic, Figure, Facts, Quote, BeforeAfter } from '../components/ui.jsx';

export function CaseHead({ b }) {
  const c = site[b.case];
  const im = b.image && findMedia(b.case, b.image);
  return (
    <Section b={b}>
      <div className={`grid items-end gap-8 ${im ? 'xl:grid-cols-[6fr_4fr]' : ''}`}>
        <div>
          <Eyebrow b={b} />
          <h2 className="h2 leading-[.95] tracking-[-.04em]">{c.name}</h2>
          <p className="lead"><Inline text={c.line} /></p>
        </div>
        {im && (
          <figure className="m-0 bg-off">
            <Pic base={im.src} alt={im.alt} sizes="(min-width: 1000px) 40vw, 100vw" className="mx-auto w-full max-w-[22rem] mix-blend-multiply" />
          </figure>
        )}
      </div>
    </Section>
  );
}

export function CaseFacts({ b }) {
  return <Section b={b}><Facts rows={site[b.case].facts} /></Section>;
}

function Showcase({ im }) {
  return (
    <figure className="showcase full m-0 overflow-hidden">
      <Pic base={im.src} alt={im.alt} />
      {im.caption && <figcaption className="figcap">{im.caption}</figcaption>}
    </figure>
  );
}

export function CaseImage({ b }) {
  return <Section b={b} className="section-flush"><Showcase im={site[b.case].media[b.which]} /></Section>;
}

export function CaseGallery({ b }) {
  const g = site[b.case].galleries[b.key];
  return (
    <Section b={b}>
      <h2 className="h2">{g.heading}</h2>
      <div data-stagger className="full grid gap-x-4 gap-y-8 md:grid-cols-2">
        {g.items.map((im, i) => <Figure key={im.src} im={im} zoom className={i === 0 ? 'md:col-span-2' : ''} sizes="(min-width: 768px) 50vw, 100vw" />)}
      </div>
    </Section>
  );
}

export function BeforeAfterBlock({ b }) {
  if (!SOURCED(site.mayfair.images)) return null;
  return <Section b={b}><Eyebrow b={b} /><BeforeAfter /></Section>;
}

export function Changes({ b }) {
  const c = site.mayfair.changes;
  return (
    <Section b={b}>
      <h2 className="h2">{c.heading}</h2>
      <ul data-stagger className="max-w-[60rem] border-t border-ink">
        {c.items.map((i) => <li key={i} className="row-text border-b border-line py-4">{i}</li>)}
      </ul>
    </Section>
  );
}

export function MayfairImage({ b }) {
  const im = site.mayfair[b.which];
  if (!SOURCED(site.mayfair.images) || !im) return null;
  const hasHead = b.eyebrow || b.heading || b.text;
  return (
    <Section b={b} className={hasHead ? '' : 'section-flush'}>
      <Eyebrow b={b} />
      {b.heading && <h2 className="h2">{b.heading}</h2>}
      {b.text && <p className="lead"><Inline text={b.text} /></p>}
      <Showcase im={im} />
    </Section>
  );
}

export function QuoteBlock({ b }) {
  return <Section b={b}><h2 className="h2">{b.heading}</h2><Quote /></Section>;
}
