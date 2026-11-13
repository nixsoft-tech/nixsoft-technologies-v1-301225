/**
 * Build-time renderer used by scripts/prerender.mjs (never shipped to
 * browsers). Renders one URL of the app to static HTML, waiting for every
 * lazy page chunk, with the same tree the browser hydrates (index.tsx):
 * StrictMode > HelmetProvider > router > AppShell.
 */
import React from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppShell } from './App';

export { mapWordPressPost, seedBlogCache } from './services/blogService';
/** Profile page that lists every blog post (needs the post list at prerender). */
export const REVIEWER_PROFILE = `/team/${BLOG_REVIEWER_ID}`;
import { SERVICE_CATEGORIES, getServicesByCategory } from './data/services';
import { SOLUTIONS_DATA } from './data/solutions';
import { PRODUCTS_DATA } from './data/products';
import { INDUSTRIES_DATA } from './data/industries';
import { TEAM, teamPath, BLOG_REVIEWER_ID } from './data/team';

/**
 * Every indexable page except blog posts (those come from WordPress at build
 * time), in sitemap order. Built from the same data the pages render, so a
 * new service, solution, product or industry is listed automatically.
 * Add a route here when you add a new standalone page.
 */
export function staticRoutes(): string[] {
  return [
    '/',
    '/about',
    ...TEAM.map((m) => teamPath(m)),
    '/services',
    ...SERVICE_CATEGORIES.flatMap((c) => getServicesByCategory(c.id)).map((s) => `/services/${s.slug}`),
    '/solutions',
    ...SOLUTIONS_DATA.map((s) => `/solutions/${s.slug}`),
    '/products',
    ...PRODUCTS_DATA.map((p) => `/products/${p.slug}`),
    '/industries',
    ...INDUSTRIES_DATA.map((i) => `/industries/${i.slug}`),
    '/clients',
    '/blog',
    '/contact',
    '/privacy-policy',
    '/terms-and-conditions',
  ];
}

async function renderOnce(url: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <React.StrictMode>
      <HelmetProvider>
        <StaticRouter location={url}>
          <AppShell />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>,
    // React outlines completed Suspense boundaries above this size (default
    // ~12 KB) into hidden segments plus an inline swap script, for streaming.
    // A static page has nothing to stream: keep every boundary inline.
    { progressiveChunkSize: Number.MAX_SAFE_INTEGER },
  );
  const chunks: Buffer[] = [];
  for await (const chunk of prelude) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

// A lazy component that is still loading makes React emit its Suspense
// fallback plus a hidden copy of the content and an inline script that swaps
// them. Crawlers that don't run JavaScript would see the fallback. Each pass
// starts the loads it meets; once every lazy module on the page has resolved,
// the page renders in one piece with no hidden segments or inline scripts.
const STREAMED = /<template id="B:|<div hidden id="S:|\$RC\(/;

export async function render(url: string): Promise<string> {
  let html = '';
  for (let pass = 0; pass < 6; pass++) {
    html = await renderOnce(url);
    if (!STREAMED.test(html)) return html;
  }
  throw new Error(`prerender: ${url} still has streamed Suspense segments after 6 passes`);
}
