// Used only at build time by scripts/prerender.mjs to turn every page into static HTML.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';

export function render(url) {
  return renderToString(<StrictMode><StaticRouter location={url}><App /></StaticRouter></StrictMode>);
}
export { PAGES, site } from './lib/content.js';
export { headFor } from './lib/head.js';
