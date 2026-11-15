import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Page from './components/Page.jsx';
import { PAGES, NOT_FOUND } from './lib/content.js';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {PAGES.filter((p) => p !== NOT_FOUND).map((p) => <Route key={p.path} path={p.path} element={<Page page={p} />} />)}
        <Route path="*" element={<Page page={NOT_FOUND} />} />
      </Route>
    </Routes>
  );
}
