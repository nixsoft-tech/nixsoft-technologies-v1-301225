#!/usr/bin/env node
/**
 * Build-time prerender: writes real HTML for every page in public/sitemap.xml,
 * so crawlers that don't run JavaScript (ChatGPT's, Claude's and Perplexity's
 * crawlers, link previews) see the full page, its <title>/<meta> tags and its
 * structured data. The browser then hydrates the same markup (index.tsx).
 *
 * Runs after `vite build` (client, into dist/) and `vite build --ssr`
 * (entry-server.tsx, into dist-ssr/). See the "build" script in package.json.
 *
 * Output
 *   dist/index.html                   home page
 *   dist/<path>/index.html            every other sitemap page
 *   dist/app.html                     the plain app shell, for URLs that are
 *                                     not prerendered (nginx @app, 404s)
 * Blog posts come from the WordPress API at build time
 * (VITE_WORDPRESS_API_URL). If it is unreachable, blog pages are skipped and
 * fall back to the app shell; every other page must render or the build fails.
 * Posts published or edited after a build show their old (or no) static
 * page until the next build. The Dockerfile ADDs a snapshot of the posts
 * before building, so `docker compose up -d --build app` re-runs the build
 * whenever any post has changed (and reuses the cache when none has).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const started = Date.now();

// Same sanitiser as the browser (services/sanitize.ts), bound to a jsdom window.
const purify = createDOMPurify(new JSDOM('').window);
globalThis.__nixSanitize = (html) => purify.sanitize(html);

const { render, mapWordPressPost, seedBlogCache } = await import(
  pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href
);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('prerender: dist/index.html has no empty #root');

// The untouched shell, for everything that isn't prerendered.
fs.writeFileSync(path.join(dist, 'app.html'), template);

// Pages to render: every <loc> in the sitemap.
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>https?:\/\/[^/<]+(\/[^<]*)?<\/loc>/g)].map((m) => m[1] || '/');

// Blog posts from WordPress (same request and mapping as the app).
let posts = null;
const api = process.env.VITE_WORDPRESS_API_URL;
if (api) {
  try {
    const res = await fetch(`${api}/posts?_embed&per_page=100`, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    posts = (await res.json()).map(mapWordPressPost);
  } catch (err) {
    console.warn(`prerender: WordPress API unreachable (${err.message}); blog pages fall back to the app shell`);
  }
} else {
  console.warn('prerender: VITE_WORDPRESS_API_URL not set; blog pages fall back to the app shell');
}

// React 19 emits hoisted <title>/<meta>/<link> tags first. Split them off so
// they go into <head>; the rest is the app's markup for #root.
const HOISTED = /^(?:<title>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*>|<style\b[^>]*>[\s\S]*?<\/style>)/;
function splitHead(html) {
  let head = '';
  let rest = html;
  for (let m = rest.match(HOISTED); m; m = rest.match(HOISTED)) {
    head += m[0];
    rest = rest.slice(m[0].length);
  }
  return { head, body: rest };
}

// JSON inside <script>: escape "<" so "</script>" in content can't end it.
const jsonForScript = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

function page(html, blogSeed) {
  const { head, body } = splitHead(html);
  let out = template
    // The page's own tags replace index.html's homepage defaults.
    .replace(/\s*<title data-default>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta data-default [^>]*>/g, '')
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  if (blogSeed) {
    out = out.replace(
      '<div id="root">',
      `<script id="__BLOG_DATA__" type="application/json">${jsonForScript(blogSeed)}</script>\n    <div id="root">`,
    );
  }
  return out;
}

let written = 0;
const skipped = [];
for (const route of routes) {
  let seed;
  if (route === '/blog' || route.startsWith('/blog/')) {
    if (!posts) { skipped.push(route); continue; }
    if (route === '/blog') {
      // The list page needs the cards, not every article body.
      seed = { posts: posts.map(({ content, ...card }) => ({ ...card, content: '' })) };
    } else {
      const post = posts.find((p) => `/blog/${p.slug}` === route);
      if (!post) { skipped.push(route); continue; }
      seed = { post };
    }
    seedBlogCache(seed);
  }

  const html = await render(route);
  if (!/<h1[\s>]/.test(html)) throw new Error(`prerender: ${route} rendered without an <h1>`);
  if (/Page not found/.test(html) && !/noindex/.test(route)) {
    throw new Error(`prerender: ${route} rendered the Not Found page`);
  }

  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page(html, seed));
  written++;
}

console.log(`prerender: ${written} pages written${skipped.length ? `, ${skipped.length} skipped (${skipped.join(', ')})` : ''} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
