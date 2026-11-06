import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GA_MEASUREMENT_ID, ANALYTICS_HOSTS } from '../constants';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const enabled = ANALYTICS_HOSTS.includes(window.location.hostname);

// Load gtag.js once, at startup, on production hosts only.
if (enabled) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js reads the `arguments` object itself, not an array copy.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // Page views are sent below on every route change. The GA4 stream's
  // "page changes based on browser history events" option is OFF, so this
  // is the only source of SPA page views — turning that option on in the GA
  // admin would count every in-app navigation twice.
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

let lastSentTitle = '';

/** Sends a GA4 page_view for each client-side route change. */
const Analytics = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!enabled) return;
    // Pages set their <title> only once they've loaded (lazy chunks, and blog
    // posts after the WordPress fetch), so wait for the title to change
    // before reporting, up to MAX_WAIT_MS for pages that share a title.
    // A client redirect (e.g. an unknown blog slug -> /blog) changes the
    // route during the wait and cancels this one, so it counts once.
    const MAX_WAIT_MS = 5000;
    const started = Date.now();
    const send = () => {
      clearInterval(id);
      lastSentTitle = document.title;
      window.gtag('event', 'page_view', {
        page_location: window.location.href,
        page_title: document.title,
      });
    };
    const id = setInterval(() => {
      const titleChanged = document.title !== '' && document.title !== lastSentTitle;
      if (titleChanged || Date.now() - started >= MAX_WAIT_MS) send();
    }, 250);
    return () => clearInterval(id);
  }, [pathname, search]);

  return null;
};

export default Analytics;
