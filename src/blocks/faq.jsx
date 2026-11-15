// Questions: a short pick on Home, every answer grouped on /questions/.
import { faq, sourcedFaq, faqById } from '../lib/content.js';
import { Inline, Checklist, Eyebrow } from '../components/ui.jsx';

function Answer({ q }) {
  return q.answer.map((p, i) => (p === '{{CHECKLIST}}' ? <Checklist key={i} /> : <p key={i}><Inline text={p} /></p>));
}

export function FaqList({ items, withIds = false }) {
  return (
    <div data-stagger className="faq max-w-[60rem] border-t border-ink">
      {items.map((q) => (
        <details key={q.id} id={withIds ? q.id : undefined} className="border-b border-line">
          <summary><Inline text={q.question} /></summary>
          <div className="max-w-[44rem] pb-6">
            <Answer q={q} />
            {withIds && <p className="note"><a href={`/questions/#${q.id}`}>Link to this answer</a></p>}
          </div>
        </details>
      ))}
    </div>
  );
}

const Chip = ({ href, children }) => (
  <li><a className="ulink label inline-flex min-h-tap items-center" href={href}>{children}</a></li>
);

export function StartHere({ b }) {
  return (
    <nav className="section section-tight" aria-label="Start here">
      <div className="wrap">
        <Eyebrow b={b} />
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {b.ids.filter((id) => faqById[id]).map((id) => <Chip key={id} href={`#${id}`}><Inline text={faqById[id].question} /></Chip>)}
        </ul>
      </div>
    </nav>
  );
}

export function FaqAll() {
  const groups = faq.groups.map((g) => ({ ...g, items: sourcedFaq.filter((i) => i.group === g.id) })).filter((g) => g.items.length);
  return (
    <>
      <nav className="section section-tight" aria-label="Question groups">
        <div className="wrap">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">{groups.map((g) => <Chip key={g.id} href={`#${g.id}`}>{g.title}</Chip>)}</ul>
        </div>
      </nav>
      {groups.map((g) => (
        <section key={g.id} className="section" id={g.id} aria-labelledby={`${g.id}-h`}>
          <div className="wrap">
            <h2 className="h2" id={`${g.id}-h`}>{g.title}</h2>
            <FaqList items={g.items} withIds />
          </div>
        </section>
      ))}
    </>
  );
}
