// Vercel serverless function: POST /api/contact/ → emails the brief to Mehedi through Resend.
// Needs RESEND_API_KEY in Vercel > Settings > Environment Variables (see .env.example).
// Nothing is stored here: the message is passed to Resend and then to the inbox.

const LIMITS = { name: 120, email: 200, business: 300, message: 6000 };
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

const clean = (v, max) => String(v ?? '').replace(/\r\n?/g, '\n').trim().slice(0, max);
const oneLine = (v) => v.replace(/[\r\n]+/g, ' ');

export default async function handler(req, res) {
  const configured = Boolean(process.env.RESEND_API_KEY);
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method', configured });
  }

  // JSON from the React form; URL-encoded when the browser posts the form without JavaScript.
  const wantsJson = (req.headers['content-type'] || '').includes('application/json');
  const reply = (status, payload) => (wantsJson
    ? res.status(status).json(payload)
    : res.redirect(303, payload.ok ? '/contact/?sent=1#form' : '/contact/?error=1#form'));

  const b = req.body && typeof req.body === 'object' ? req.body : {};

  // Spam: the hidden field is filled, or the form was sent faster than a person can type.
  if (b.website || (b.elapsed !== undefined && Number(b.elapsed) < 3000)) return reply(200, { ok: true });

  const f = {
    name: oneLine(clean(b.name, LIMITS.name)),
    email: oneLine(clean(b.email, LIMITS.email)),
    business: oneLine(clean(b.business, LIMITS.business)),
    message: clean(b.message, LIMITS.message),
  };
  if (!f.name || !EMAIL_RE.test(f.email) || f.message.length < 10) return reply(400, { ok: false, error: 'invalid' });
  if (!configured) {
    console.error('contact: RESEND_API_KEY is not set');
    return reply(500, { ok: false, error: 'not-configured' });
  }

  const text = [
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    `Business: ${f.business || '(not given)'}`,
    '',
    f.message,
    '',
    '--',
    'Sent from the contact form on monobook.co. Reply to this email to answer them directly.',
  ].join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'MonoBook Website <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO || 'mehedi@monobook.co'],
        reply_to: f.email,
        subject: `Brief from ${f.name}${f.business ? `, ${f.business}` : ''}`.slice(0, 200),
        text,
      }),
    });
    if (!r.ok) {
      console.error('contact: Resend error', r.status, await r.text());
      return reply(502, { ok: false, error: 'send' });
    }
    return reply(200, { ok: true });
  } catch (err) {
    console.error('contact: request failed', err);
    return reply(502, { ok: false, error: 'send' });
  }
}
