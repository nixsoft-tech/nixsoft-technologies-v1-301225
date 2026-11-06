import DOMPurify from 'dompurify';

/**
 * Sanitise WordPress HTML before rendering it. In the browser this is
 * DOMPurify on the page's window. During the build-time prerender (Node, no
 * window) scripts/prerender.mjs provides a DOMPurify bound to a jsdom window
 * as globalThis.__nixSanitize, so the static HTML is cleaned the same way.
 * With neither available, render nothing rather than unsanitised HTML.
 */
export function sanitizeHtml(html: string): string {
  if (DOMPurify.isSupported) return DOMPurify.sanitize(html);
  const ssr = (globalThis as { __nixSanitize?: (h: string) => string }).__nixSanitize;
  return ssr ? ssr(html) : '';
}
