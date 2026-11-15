// Makes monobook-site-upload.zip: a folder your developer uploads to Vercel as it is. No build step on Vercel.
//   public/   the finished website (prerendered pages, images, fonts)
//   api/      the contact form function
//   source/   the React + Tailwind code, for future changes
// Run after `npm run build`:  npm run package
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'upload');
const ZIP = path.join(ROOT, 'monobook-site-upload.zip');
if (!fs.existsSync(path.join(ROOT, 'dist', 'index.html'))) throw new Error('Run npm run build first.');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);
fs.cpSync(path.join(ROOT, 'dist'), path.join(OUT, 'public'), { recursive: true });
fs.cpSync(path.join(ROOT, 'api'), path.join(OUT, 'api'), { recursive: true });

const skip = new Set(['node_modules', 'dist', 'dist-ssr', 'upload', '.env.local', '.env', '.vercel', '.DS_Store', 'monobook-site-upload.zip', 'monobook-react-source.zip', 'DEPLOY.md']);
for (const f of fs.readdirSync(ROOT)) if (!skip.has(f)) fs.cpSync(path.join(ROOT, f), path.join(OUT, 'source', f), { recursive: true, filter: (src) => path.basename(src) !== '.DS_Store' });

fs.writeFileSync(path.join(OUT, 'package.json'), JSON.stringify({ name: 'monobook-site', private: true, type: 'module' }, null, 2) + '\n');
const v = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
Object.assign(v, { framework: null, installCommand: '', buildCommand: '', outputDirectory: 'public' });
fs.writeFileSync(path.join(OUT, 'vercel.json'), JSON.stringify(v, null, 2) + '\n');
fs.copyFileSync(path.join(ROOT, 'UPLOAD.md'), path.join(OUT, 'DEPLOY.md'));
fs.copyFileSync(path.join(ROOT, 'check-live.sh'), path.join(OUT, 'check-live.sh'));
fs.copyFileSync(path.join(ROOT, '.env.example'), path.join(OUT, '.env.example'));

fs.rmSync(ZIP, { force: true });
execSync(`cd "${OUT}" && zip -rq "${ZIP}" . -x "*.DS_Store"`);
console.log(`monobook-site-upload.zip: ${(fs.statSync(ZIP).size / 1e6).toFixed(1)} MB`);
