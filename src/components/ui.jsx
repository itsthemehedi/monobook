// Small building blocks used by every page section.
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { site, tok, MAILTO, SOURCED } from '../lib/content.js';

// Internal links ("/work/") use the router; everything else is a normal <a>.
export function SmartLink({ href, children, ...rest }) {
  if (href.startsWith('/') && !href.startsWith('//')) return <Link to={href} {...rest}>{children}</Link>;
  return <a href={href} {...rest}>{children}</a>;
}

// Renders copy from JSON: niche tokens, [label](href) links and {{EMAIL_LINK}}.
export function Inline({ text }) {
  const s = tok(text);
  const out = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\{\{EMAIL_LINK\}\}/g;
  let last = 0;
  let m;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(m[0] === '{{EMAIL_LINK}}'
      ? <a key={m.index} href={`mailto:${site.email}`}>{site.email}</a>
      : <SmartLink key={m.index} href={m[2]}>{m[1]}</SmartLink>);
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return <>{out}</>;
}

export function Cta({ className = 'btn' }) {
  return <a className={className} href={MAILTO}>{site.ctaLabel}</a>;
}

export function Section({ b = {}, className = '', as: Tag = 'section', children, ...rest }) {
  const ink = b.theme === 'ink' ? ' section-ink' : '';
  return (
    <Tag id={b.id} className={`section${ink} ${className}`} {...rest}>
      <div className="wrap">{children}</div>
    </Tag>
  );
}

export const Eyebrow = ({ b }) => (b.eyebrow ? <p className="eyebrow">{b.eyebrow}</p> : null);

export const linksOf = (b) => b.links || (b.link ? [b.link] : []);
export function More({ links }) {
  if (!links || !links.length) return null;
  return (
    <p className="more">
      {links.map((l, i) => (
        <Fragment key={l.href}>
          {i > 0 && <span className="inline-block w-6"> </span>}
          <SmartLink className="ulink" href={l.href}>{l.label}</SmartLink>
        </Fragment>
      ))}
    </p>
  );
}

export function Social({ className = '' }) {
  return (
    <ul className={`label flex flex-wrap gap-x-6 ${className}`}>
      {(site.social || []).map((s) => (
        <li key={s.href}>
          <a className="inline-flex min-h-tap items-center" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
        </li>
      ))}
    </ul>
  );
}

// Real work images: <base>-sm.jpg (about 1000px) and <base>-lg.jpg (about 2000px).
export function Pic({ base, alt, sizes = '100vw', className = 'w-full' }) {
  return <img className={className} src={`${base}-lg.jpg`} srcSet={`${base}-sm.jpg 1000w, ${base}-lg.jpg 2000w`} sizes={sizes} alt={alt} loading="lazy" decoding="async" />;
}

export function Figure({ im, sizes, className = '', zoom = false }) {
  return (
    <figure className={`m-0 ${className}`}>
      <div className={zoom ? 'group overflow-hidden' : 'overflow-hidden'}>
        <Pic base={im.src} alt={im.alt} sizes={sizes} className={`w-full bg-off ${zoom ? 'transition-transform duration-[1200ms] ease-soft group-hover:scale-[1.025]' : ''}`} />
      </div>
      {im.caption && <figcaption className="figcap">{im.caption}</figcaption>}
    </figure>
  );
}

export function Facts({ rows }) {
  return (
    <dl data-stagger className="max-w-[64rem] border-t border-ink">
      {rows.map((r) => (
        <div key={r.label} className="grid gap-2 border-b border-line py-6 md:grid-cols-[4fr_8fr]">
          <dt className="label text-muted">{r.label}</dt>
          <dd className="row-text"><Inline text={r.text} /></dd>
        </div>
      ))}
    </dl>
  );
}

export function Checklist({ className = '' }) {
  return <ol className={`numlist ${className}`}>{site.checklistSeven.items.map((i) => <li key={i}>{i}</li>)}</ol>;
}

export function Quote() {
  const m = site.mayfair;
  const who = m.person + (SOURCED(m.title) && m.title.value ? `, ${m.title.value}` : '');
  return (
    <figure className="m-0 max-w-[60rem]">
      <blockquote className="m-0 font-display text-h3 font-medium leading-[1.2] tracking-[-.025em]">
        {m.quote.map((p, i, a) => <p key={i} className="mb-6">{`${i === 0 ? '“' : ''}${p}${i === a.length - 1 ? '”' : ''}`}</p>)}
      </blockquote>
      <figcaption className="label text-muted">{who}</figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  const i = site.mayfair.images;
  if (!SOURCED(i)) return null;
  const sides = [[i.before, i.beforeAlt, i.beforeCaption], [i.after, i.afterAlt, i.afterCaption]];
  return (
    <div data-stagger className="full my-8 grid gap-px border border-line bg-line md:grid-cols-2">
      {sides.map(([src, alt, caption]) => (
        <figure key={src} className="m-0 bg-paper p-6">
          <Pic base={src} alt={alt} sizes="(min-width: 768px) 45vw, 100vw" className="w-full mix-blend-multiply" />
          <figcaption className="label mt-3">{caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
