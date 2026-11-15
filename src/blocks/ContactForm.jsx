// Contact form. Sends to /api/contact/ (api/contact.js on Vercel), which emails the brief to Mehedi.
// Works without JavaScript too: the browser posts the form and the API redirects back here.
import { useEffect, useRef, useState } from 'react';
import { Inline, Section, Eyebrow } from '../components/ui.jsx';

function Field({ f }) {
  const common = { id: `f-${f.name}`, name: f.name, required: !f.optional, maxLength: f.max, autoComplete: f.autocomplete, className: 'field' };
  return (
    <div className="grid gap-2">
      <label className="label" htmlFor={common.id}>
        {f.label}{f.optional && <span className="text-muted"> (optional)</span>}
      </label>
      {f.type === 'textarea' ? <textarea {...common} rows={8} /> : <input {...common} type={f.type || 'text'} />}
      {f.hint && <p className="note m-0">{f.hint}</p>}
    </div>
  );
}

export function ContactForm({ b }) {
  const [state, setState] = useState('idle'); // idle | sending | sent | invalid | error
  const opened = useRef(0);

  useEffect(() => {
    opened.current = Date.now();
    const q = new URLSearchParams(window.location.search);
    if (q.has('sent')) setState('sent');
    else if (q.has('error')) setState('error');
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    setState('sending');
    const data = Object.fromEntries(new FormData(form));
    data.elapsed = Date.now() - opened.current;
    try {
      const r = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) { form.reset(); setState('sent'); }
      else setState(j.error === 'invalid' ? 'invalid' : 'error');
    } catch {
      setState('error');
    }
  }

  const message = { sent: b.sent, invalid: b.invalid, error: b.error }[state];

  return (
    <Section b={b}>
      <Eyebrow b={b} />
      <h2 className="h2">{b.heading}</h2>
      <p className="lead">{b.intro}</p>
      <form action="/api/contact/" method="post" onSubmit={onSubmit} className="mt-12 grid max-w-[44rem] gap-6">
        {b.fields.map((f) => <Field key={f.name} f={f} />)}
        {/* Spam trap: people never see this field, bots fill it in. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="f-website">Leave this empty</label>
          <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div>
          <button type="submit" className="btn" disabled={state === 'sending'}>{state === 'sending' ? b.sending : b.button}</button>
        </div>
        <p role="status" aria-live="polite" className={`m-0 font-display font-medium ${state === 'sent' ? 'text-lead text-ink' : 'text-body text-brand'}`}>
          {message ? <Inline text={message} /> : null}
        </p>
      </form>
      <p className="note mt-6"><Inline text={b.filesNote} /></p>
    </Section>
  );
}
