import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { seedBlogCache } from './services/blogService';

// index.html ships default <title>/meta tags (marked data-default) for crawlers
// and link previews that don't run JavaScript. Once the app runs, each page sets
// its own via <SEO>, so drop the defaults to avoid duplicate titles/descriptions.
document.querySelectorAll('head [data-default]').forEach((el) => el.remove());

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Blog data the prerender embedded in the page, so the first render matches
// the static HTML without waiting for WordPress.
const blogData = document.getElementById('__BLOG_DATA__');
if (blogData?.textContent) {
  try { seedBlogCache(JSON.parse(blogData.textContent)); } catch { /* ignore */ }
}

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// Pages prerendered at build time (scripts/prerender.mjs) already contain the
// HTML: hydrate it. The plain app shell (app.html: unknown URLs, new posts
// not yet prerendered) has an empty root: render from scratch.
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}