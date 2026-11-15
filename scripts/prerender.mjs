// After `vite build`: writes a full HTML file for every page (good for Google, works without JavaScript),
// plus 404.html, sitemap.xml and robots.txt. Every page in content/pages becomes its own file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SSR = path.join(ROOT, 'dist-ssr');
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const { render, PAGES, site, headFor } = await import(pathToFileURL(path.join(SSR, 'entry-server.js')).href);

for (const page of PAGES) {
  const is404 = page.path === '/404.html';
  const html = template.replace('<!--head-->', headFor(page)).replace('<!--app-->', render(is404 ? '/__not-found__' : page.path));
  const file = is404 ? path.join(DIST, '404.html') : path.join(DIST, page.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.filter((p) => !p.noindex).map((p) => `<url><loc>${site.origin}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-Agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
fs.rmSync(SSR, { recursive: true, force: true });
console.log(`Prerendered ${PAGES.length} pages: ${PAGES.map((p) => p.path).join(', ')}`);
