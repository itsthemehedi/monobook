// Writes check-live.sh: checks every page and file of dist/ on the live site.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); const DIST = path.join(ROOT, 'dist');
const list = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else list.push('/' + path.relative(DIST, p).split(path.sep).join('/')); } })(DIST);
const titles = [];
for (const u of list.filter((x) => x.endsWith('/index.html'))) {
  const t = (fs.readFileSync(path.join(DIST, u), 'utf8').match(/<title>([^<]*)<\/title>/) || [])[1];
  if (t) titles.push([u.slice(0, -10), t.replace(/'/g, "'\\''")]);
}
const urls = list.filter((u) => !/\/(vercel\.json|\.DS_Store)$/.test(u)).map((u) => u.endsWith('/index.html') ? u.slice(0, -10) : u).sort();
const sh = `#!/bin/bash
# Checks that every page, file and the contact form API of the MonoBook site is live. Usage: bash check-live.sh [https://monobook.co]
BASE="\${1:-https://monobook.co}"; MISS=0; OK=0
for u in ${urls.map((u) => `"${u}"`).join(' ')}; do
  code=$(curl -sL -o /dev/null -w "%{http_code}" "$BASE$u")
  if [ "$code" = "200" ]; then OK=$((OK+1)); else echo "MISSING ($code) $u"; MISS=$((MISS+1)); fi
done
code=$(curl -sL -o /dev/null -w "%{http_code}" "$BASE/this-page-does-not-exist-xyz"); [ "$code" = "404" ] || { echo "404 page returns $code, expected 404"; MISS=$((MISS+1)); }
# Each page must be its own prerendered HTML (not the Home page served for every URL).
${titles.map(([u, t]) => `curl -sL "$BASE${u}" | grep -qF '<title>${t}</title>' || { echo "WRONG PAGE ${u}: its own HTML is not being served"; MISS=$((MISS+1)); }`).join('\n')}
# Contact form API must be live. Empty POST should be rejected with 400.
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{}' "$BASE/api/contact/"); [ "$code" = "400" ] || { echo "FORM API missing or broken: POST /api/contact/ returned $code, expected 400"; MISS=$((MISS+1)); }
curl -s "$BASE/api/contact/" | grep -q '"configured":true' || echo "WARNING: form is live but RESEND_API_KEY is not set in Vercel, so briefs will not arrive."
echo "OK: $OK  MISSING: $MISS"; [ $MISS -eq 0 ] && echo "PASS: site is complete" || { echo "FAIL: fix before calling it done"; exit 1; }
`;
fs.writeFileSync(path.join(ROOT, 'check-live.sh'), sh, { mode: 0o755 });
console.log(`check-live.sh: ${urls.length} urls`);
