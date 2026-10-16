import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

// index.html ships default <title>/meta tags (marked data-default) for crawlers
// and link previews that don't run JavaScript. Once the app runs, each page sets
// its own via <SEO>, so drop the defaults to avoid duplicate titles/descriptions.
document.querySelectorAll('head [data-default]').forEach((el) => el.remove());

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);