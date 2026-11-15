// Sections shared by the inner pages: page heading, text, process lists, contact, 404.
import { site } from '../lib/content.js';
import { Inline, Cta, Section, Eyebrow, More, linksOf, Social, Facts, SmartLink } from '../components/ui.jsx';

export function PageHead({ b }) {
  return (
    <section className="pagehead border-b border-line pb-16 pt-24">
      <div className="wrap">
        <h1 className="display">{b.h1}</h1>
        {b.lead && <p className="lead mt-8 text-muted"><Inline text={b.lead} /></p>}
      </div>
    </section>
  );
}

export function Text({ b }) {
  return (
    <Section b={b}>
      <Eyebrow b={b} />
      {b.heading && <h2 className="h2">{b.heading}</h2>}
      <div className="prose-lead max-w-[44rem]">{b.paras.map((p) => <p key={p}><Inline text={p} /></p>)}</div>
      {b.social && <Social className="mt-6" />}
      {b.cta && <div className="actions"><Cta /></div>}
      <More links={linksOf(b)} />
    </Section>
  );
}

export function PartsDetail({ b }) {
  return b.items.map((p) => (
    <Section key={p.anchor} b={{ id: p.anchor }}>
      <h2 className="h2">{p.name}</h2>
      <Facts rows={[
        { label: 'What it is', text: p.what },
        { label: 'Where it is used', text: b.where },
        ...(b.receive && b.receive.status === 'SOURCED' && p.receive ? [{ label: 'What you receive', text: p.receive }] : []),
      ]} />
    </Section>
  ));
}

export function Steps({ b }) {
  return (
    <Section b={b}>
      <ol data-stagger className="numlist">{b.items.map((s) => <li key={s}><Inline text={s} /></li>)}</ol>
    </Section>
  );
}

export function TimedList({ b }) {
  return (
    <Section b={b}>
      <h2 className="h2">{b.heading}</h2>
      <Facts rows={b.items.map((i) => ({ label: i.when, text: i.text }))} />
    </Section>
  );
}

export function FactsBlock({ b }) {
  return <Section b={b}><Facts rows={b.rows} /></Section>;
}

export function Contact({ b }) {
  return (
    <Section b={b}>
      <p className="font-display text-email font-medium leading-none tracking-[-.04em] [overflow-wrap:anywhere]">
        <a className="decoration-2 underline-offset-[.12em]" href={`mailto:${site.email}`}>{site.email}</a>
      </p>
      <p className="lead">{b.reply}</p>
      <div className="actions"><Cta /></div>
      {b.lines.map((l) => <p key={l} className="note mt-4">{l}</p>)}
    </Section>
  );
}

export function BackHome({ b }) {
  return <Section b={b}><p className="more"><SmartLink className="ulink" href="/">{b.label}</SmartLink></p></Section>;
}

export function NotFound({ b }) {
  return (
    <section className="pagehead pb-16 pt-24">
      <div className="wrap">
        <h1 className="display">{b.h1}</h1>
        <p className="lead"><Inline text={b.text} /></p>
        <div className="actions"><Cta /></div>
      </div>
    </section>
  );
}
