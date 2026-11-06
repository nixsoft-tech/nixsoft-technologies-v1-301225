#!/usr/bin/env node
/**
 * Build-time prerender: writes real HTML for every indexable page,
 * so crawlers that don't run JavaScript (ChatGPT's, Claude's and Perplexity's
 * crawlers, link previews) see the full page, its <title>/<meta> tags and its
 * structured data. The browser then hydrates the same markup (index.tsx).
 *
 * Runs after `vite build` (client, into dist/) and `vite build --ssr`
 * (entry-server.tsx, into dist-ssr/). See the "build" script in package.json.
 *
 * Pages: staticRoutes() from entry-server.tsx (built from the site's data)
 * plus one page per WordPress post.
 *
 * Output
 *   dist/index.html                   home page
 *   dist/<path>/index.html            every other page
 *   dist/app.html                     the plain app shell, for URLs that are
 *                                     not prerendered (nginx @app, 404s)
 *   dist/feed.xml                     RSS 2.0 feed of the blog posts (newest
 *                                     first), linked from every page
 *   dist/sitemap.xml                  generated from the pages written: each
 *                                     URL with the images it shows
 *                                     (<image:loc>), and <lastmod> only where
 *                                     the date is real (WordPress's modified
 *                                     date for posts and the blog index)
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

const { render, mapWordPressPost, seedBlogCache, staticRoutes } = await import(
  pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href
);

// The shell from `vite build`. On a re-run (dist/index.html is already the
// prerendered home page) start again from the saved shell.
const shellFile = fs.existsSync(path.join(dist, 'app.html')) ? 'app.html' : 'index.html';
const template = fs.readFileSync(path.join(dist, shellFile), 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error(`prerender: dist/${shellFile} has no empty #root`);

// The untouched shell, for everything that isn't prerendered.
fs.writeFileSync(path.join(dist, 'app.html'), template);

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

// Pages to render: the site's pages, with the blog posts right after /blog.
const statics = staticRoutes();
const postRoutes = (posts ?? []).map((p) => `/blog/${p.slug}`);
const blogAt = statics.indexOf('/blog');
const routes = [...statics.slice(0, blogAt + 1), ...postRoutes, ...statics.slice(blogAt + 1)];

// ---- Sitemap helpers -------------------------------------------------------
const SITE = 'https://nixsoftech.in';
// Images listed in the sitemap: content images on our own hosts. Logos and
// icons (SVG), data: URIs and images hotlinked from other sites are left out.
const IMAGE_HOSTS = new Set(['nixsoftech.in', 'blog.nixsoftech.in']);
const MAX_IMAGES_PER_URL = 1000; // sitemap protocol limit
const decodeAttr = (v) => v.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
const xmlEscape = (v) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

function pageImages(html) {
  // From the app's <main> to the last </main> (blog posts nest a second
  // <main> around the article body): page content, without header and footer.
  const start = html.search(/<main\b/);
  const main = start < 0 ? '' : html.slice(start, html.lastIndexOf('</main>'));
  const urls = new Set();
  for (const [, raw] of main.matchAll(/<img\b[^>]*?\ssrc="([^"]+)"/g)) {
    const src = decodeAttr(raw);
    if (src.startsWith('data:') || /\.svg(\?|$)/i.test(src)) continue;
    let url;
    try { url = new URL(src, SITE); } catch { continue; }
    if (!IMAGE_HOSTS.has(url.hostname) || /logo/i.test(url.pathname)) continue;
    urls.add(url.href);
    if (urls.size >= MAX_IMAGES_PER_URL) break;
  }
  return [...urls];
}

const isoDate = (iso) => (iso ? iso.slice(0, 10) : undefined);
const sitemapEntries = [];

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

  // lastmod only where it's real: a post's WordPress "modified" date, and
  // for /blog the latest of them. Other pages get none rather than a guess.
  let lastmod;
  if (seed?.post) lastmod = isoDate(seed.post.dateModified);
  else if (route === '/blog' && posts) lastmod = isoDate(posts.map((p) => p.dateModified ?? '').sort().at(-1));
  sitemapEntries.push({ loc: route === '/' ? `${SITE}/` : `${SITE}${route}`, lastmod, images: pageImages(html) });
}

// ---- Write the sitemap -------------------------------------------------------
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<!-- Generated by scripts/prerender.mjs at build time. Do not edit. -->',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ...sitemapEntries.map(({ loc, lastmod, images }) => [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    ...images.map((src) => `    <image:image><image:loc>${xmlEscape(src)}</image:loc></image:image>`),
    '  </url>',
  ].join('\n')),
  '</urlset>',
  '',
].join('\n');
fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml);
const imageCount = sitemapEntries.reduce((n, e) => n + e.images.length, 0);
console.log(`prerender: sitemap.xml with ${sitemapEntries.length} URLs and ${imageCount} images`);

// ---- Write the RSS feed ------------------------------------------------------
// Links point at nixsoftech.in (WordPress's own feed lists blog.nixsoftech.in).
// Each item carries its featured image (media:content) for feed readers and
// Google's "Follow".
if (posts && posts.length) {
  const rfc822 = (iso) => new Date(iso).toUTCString();
  const newest = [...posts].sort((a, b) => String(b.datePublished).localeCompare(String(a.datePublished)));
  const latest = posts.map((p) => p.dateModified ?? p.datePublished ?? '').sort().at(-1);
  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- Generated by scripts/prerender.mjs at build time. Do not edit. -->',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">',
    '  <channel>',
    '    <title>Nixsoft Technologies Blog</title>',
    `    <link>${SITE}/blog</link>`,
    `    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />`,
    '    <description>Practical guides on DevOps, cloud, security testing and IT infrastructure from Nixsoft Technologies, Mumbai.</description>',
    '    <language>en-in</language>',
    ...(latest ? [`    <lastBuildDate>${rfc822(latest)}</lastBuildDate>`] : []),
    '    <image>',
    `      <url>${SITE}/logo.png?v=2</url>`,
    '      <title>Nixsoft Technologies Blog</title>',
    `      <link>${SITE}/blog</link>`,
    '    </image>',
    ...newest.map((p) => {
      const link = `${SITE}/blog/${p.slug}`;
      return [
        '    <item>',
        `      <title>${xmlEscape(p.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        ...(p.datePublished ? [`      <pubDate>${rfc822(p.datePublished)}</pubDate>`] : []),
        `      <description>${xmlEscape(p.excerpt)}</description>`,
        ...(p.category ? [`      <category>${xmlEscape(p.category)}</category>`] : []),
        ...(p.image
          ? [`      <media:content url="${xmlEscape(p.image)}" medium="image"${p.imageWidth && p.imageHeight ? ` width="${p.imageWidth}" height="${p.imageHeight}"` : ''} />`]
          : []),
        '    </item>',
      ].join('\n');
    }),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(dist, 'feed.xml'), rss);
  console.log(`prerender: feed.xml with ${posts.length} posts`);
} else {
  console.warn('prerender: no posts, feed.xml not written');
}

console.log(`prerender: ${written} pages written${skipped.length ? `, ${skipped.length} skipped (${skipped.join(', ')})` : ''} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
