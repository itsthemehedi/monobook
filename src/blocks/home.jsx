// Sections used on the Home page (some also appear on other pages).
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { site, SOURCED, faqById } from '../lib/content.js';
import { Inline, Cta, Section, Eyebrow, More, linksOf, Checklist, Quote, BeforeAfter } from '../components/ui.jsx';
import { Surfaces, Mismatch } from '../components/Drawings.jsx';
import { FaqList } from './faq.jsx';

export function Hero({ b }) {
  const ink = b.theme === 'ink';
  return (
    <section className={`hero pb-16 pt-24 ${ink ? 'section-ink' : ''}`}>
      <div className="wrap">
        <h1 className="hero-title display mb-12">
          {b.h1.map((l, i) => <span key={l} className={`block ${i ? (ink ? 'text-[#8f8f8f]' : 'text-muted') : ''}`}>{l}</span>)}
        </h1>
        <p className="lead max-w-[30ch]">{b.sub.map((s, i) => <Fragment key={s}>{i > 0 && <br />}{s}</Fragment>)}</p>
        <div className="actions"><Cta /><p className="note mt-4">{b.under}</p></div>
        {b.visual === 'surfaces' && <Surfaces ink={ink} />}
      </div>
    </section>
  );
}

export function CredStrip({ b }) {
  return (
    <section className="border-b border-line py-6" aria-label="About MonoBook">
      <div className="wrap grid gap-x-8 gap-y-2 lg:grid-cols-2">
        {b.lines.map((l, i) => <p key={l} className={`label m-0 ${i ? 'text-muted' : 'text-ink'}`}><Inline text={l} /></p>)}
      </div>
    </section>
  );
}

export function Statement({ b }) {
  return (
    <Section b={b}>
      <Eyebrow b={b} />
      <div className="grid gap-12 xl:grid-cols-[6fr_4fr] xl:items-end">
        <div>
          {b.lines.map((l, i) => (i === 0
            ? <h2 key={l} className="h2"><Inline text={l} /></h2>
            : <p key={l} className="lead text-muted"><Inline text={l} /></p>))}
        </div>
        {b.visual === 'mismatch' && <Mismatch />}
      </div>
    </Section>
  );
}

export function Parts({ b }) {
  return (
    <Section b={b}>
      <Eyebrow b={b} />
      <h2 className="h2">{b.heading}</h2>
      <dl data-stagger className="border-t border-ink">
        {b.items.map((p) => (
          <div key={p.anchor} className="grid gap-2 border-b border-line py-6 transition-[padding] duration-[400ms] ease-soft hover:pl-3 md:grid-cols-[4fr_8fr] md:items-baseline">
            <dt className="font-display text-h3 font-medium leading-[1.1] tracking-[-.025em]">
              <Link className="ulink" to={`${b.link.href}#${p.anchor}`}>{p.name}</Link>
            </dt>
            <dd className="max-w-[42ch] text-muted"><Inline text={p.text} /></dd>
          </div>
        ))}
      </dl>
      <More links={[b.link]} />
    </Section>
  );
}

export function PathStrip({ b }) {
  return (
    <Section b={b}>
      <Eyebrow b={b} />
      <h2 className="h2">{b.heading}</h2>
      <ol data-stagger className="pathlist grid border-t border-ink md:grid-cols-4 md:gap-x-6">
        {b.items.map(([k, v]) => (
          <li key={k} className="border-b border-line py-6 text-body leading-[1.45] text-muted md:border-b-0 md:pr-3">
            <strong className="mb-2 block font-display text-h3 font-medium leading-[1.1] tracking-[-.025em] text-ink">{k}</strong> <Inline text={v} />
          </li>
        ))}
      </ol>
      <More links={linksOf(b)} />
    </Section>
  );
}

export function Pace({ b }) {
  return (
    <Section b={b}>
      <Eyebrow b={b} />
      <h2 className="h2">{b.heading}</h2>
      <div data-stagger className="mb-12 grid border-t border-ink md:grid-cols-3 md:gap-x-8">
        {b.options.map((o) => (
          <div key={o.name} className="border-b border-line py-8 md:border-b-0">
            <p className="mb-3 font-display text-h2 font-medium leading-none tracking-[-.04em]">{o.days}</p>
            <h3 className="h3 mb-2 text-body tracking-normal">{o.name}</h3>
            <p className="m-0 max-w-[30ch] text-muted"><Inline text={o.text} /></p>
          </div>
        ))}
      </div>
      <p className="lead">{b.line}</p>
      {b.cta && <div className="actions"><Cta /></div>}
    </Section>
  );
}

export function ChecklistBlock({ b }) {
  return (
    <Section b={b}>
      <Eyebrow b={b} />
      <h2 className="h2">{b.heading}</h2>
      <Checklist className="mb-8" />
      {SOURCED(b.under) && <p className="lead"><Inline text={b.under.text} /></p>}
      <div className="actions"><Cta /></div>
    </Section>
  );
}

export function Proof({ b }) {
  if (b.requiresImages && !SOURCED(site.mayfair.images)) return null; // No real images, no section.
  return (
    <Section b={b}>
      <Eyebrow b={b} />
      <h2 className="h2">{b.heading}</h2>
      <p className="lead"><Inline text={b.line} /></p>
      <BeforeAfter />
      <Quote />
      <More links={[b.link]} />
      {b.cta && <div className="actions"><Cta /></div>}
    </Section>
  );
}

export function SixQ({ b }) {
  return (
    <Section b={b}>
      <Eyebrow b={b} />
      <h2 className="h2">{b.heading}</h2>
      <p className="lead">{b.intro}{SOURCED(b.introApproval) ? ` ${b.introApproval.text}` : ''}</p>
      <ol className="numlist">{b.questions.map((q) => <li key={q}><Inline text={q} /></li>)}</ol>
      <p className="lead mt-8">{b.under}</p>
      <div className="actions"><Cta /></div>
    </Section>
  );
}

export function FitBlock({ b }) {
  const col = (title, items) => (
    <div>
      <h3 className="h3 text-body tracking-normal text-muted">{title}</h3>
      <ul data-stagger>{items.map((x) => <li key={x} className="row-text border-b border-line py-3"><Inline text={x} /></li>)}</ul>
    </div>
  );
  return (
    <Section b={b}>
      <Eyebrow b={b} />
      <h2 className="h2">{b.heading}</h2>
      <div className="mb-8 grid gap-8 border-t border-ink pt-6 md:grid-cols-2 md:gap-x-12">{col('For', b.for)}{col('Not for', b.not)}</div>
      <p className="lead"><Inline text={b.line} /></p>
      {b.cta && <div className="actions"><Cta /></div>}
    </Section>
  );
}

export function FaqPick({ b }) {
  return (
    <Section b={b}>
      <Eyebrow b={b} />
      <h2 className="h2">{b.heading}</h2>
      <FaqList items={b.ids.map((id) => faqById[id]).filter(Boolean)} />
      <More links={[b.link]} />
    </Section>
  );
}

export function FinalCta({ b }) {
  return (
    <section className={`section border-t-0 ${b.theme === 'ink' ? 'section-ink' : ''}`}>
      <div className="wrap">
        <h2 className="display">{b.heading}</h2>
        <p className="lead"><Inline text={b.text} /></p>
        <div className="actions"><Cta /></div>
        <More links={linksOf(b)} />
      </div>
    </section>
  );
}
