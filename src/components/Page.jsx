// Renders one page from its JSON: each SOURCED block, in order.
import { useEffect } from 'react';
import { BLOCKS } from '../blocks/index.js';
import { SOURCED, site } from '../lib/content.js';

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export default function Page({ page }) {
  // Keep the tab title and meta right when moving between pages without a reload.
  useEffect(() => {
    document.title = page.title;
    setMeta('meta[name="description"]', 'content', page.description);
    if (page.path !== '/404.html') setMeta('link[rel="canonical"]', 'href', `${site.origin}${page.path}`);
  }, [page]);

  return page.blocks.map((b, i) => {
    if (!SOURCED(b)) return null;
    const Block = BLOCKS[b.type];
    if (!Block) throw new Error(`No component for block type "${b.type}" on ${page.path}`);
    return <Block key={`${b.type}-${i}`} b={b} />;
  });
}
