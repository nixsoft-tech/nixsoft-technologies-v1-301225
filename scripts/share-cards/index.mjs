/**
 * Share cards: a 1200×630 PNG for each blog post, shown when the post's link
 * is shared on LinkedIn, X, WhatsApp, Slack and others (og:image).
 *
 * The card is the brand's share image (public/og-image.png: white, logo,
 * orange and green bar along the bottom) with the post's title, category and
 * author, so a shared link reads as a Nixsoft article at a glance.
 *
 * Written by scripts/prerender.mjs to dist/og/blog/<slug>.png. The layout is
 * made with satori (HTML/CSS-like layout to SVG) and drawn with resvg.
 * Fonts: Poppins 500/700 as TTF (satori can't read the site's woff2 files),
 * converted from public/fonts; latin-ext covers accented letters.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

// Brand colours (logo and public/og-image.png).
const ORANGE = '#E9560D';
const GREEN = '#70A82E';
const INK = '#0f172a'; // nixDark
const MUTED = '#64748b'; // slate-500

const font = (file) => fs.readFileSync(path.join(here, 'fonts', file));
const FONTS = [
  { name: 'Poppins', weight: 700, style: 'normal', data: font('poppins-700-latin.ttf') },
  { name: 'Poppins', weight: 700, style: 'normal', data: font('poppins-700-latin-ext.ttf') },
  { name: 'Poppins', weight: 500, style: 'normal', data: font('poppins-500-latin.ttf') },
  { name: 'Poppins', weight: 500, style: 'normal', data: font('poppins-500-latin-ext.ttf') },
];

const LOGO = `data:image/svg+xml;base64,${fs.readFileSync(path.join(root, 'public', 'logo.svg')).toString('base64')}`;
const LOGO_HEIGHT = 64;
const LOGO_WIDTH = Math.round((LOGO_HEIGHT * 360) / 94); // logo.svg is 360×94

/** Element for satori: { type, props: { style, children } }. */
const h = (type, style, children, extra = {}) => ({ type, props: { style, children, ...extra } });

/** Bigger type for short titles; four lines at most for the longest. */
const titleSize = (title) => (title.length <= 45 ? 68 : title.length <= 70 ? 60 : title.length <= 95 ? 52 : 46);

// WordPress's catch-all categories say nothing on a card (every post is in
// "Blog" today); the reading time is shown in their place.
const GENERIC_CATEGORIES = new Set(['blog', 'uncategorized', 'technology']);
const badgeText = (category, readTime) =>
  category && !GENERIC_CATEGORIES.has(category.toLowerCase()) ? category : readTime;

// Arrow drawn as a shape: Poppins has no "→".
const arrow = h('svg', { marginLeft: 12 }, [
  h('path', undefined, undefined, { d: 'M2 12h18M13 5l7 7-7 7', stroke: ORANGE, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
], { width: 26, height: 26, viewBox: '0 0 22 24' });

function card({ title, badge, author }) {
  return h('div', {
    width: CARD_WIDTH, height: CARD_HEIGHT, display: 'flex', flexDirection: 'column',
    backgroundColor: '#ffffff', fontFamily: 'Poppins',
  }, [
    h('div', { display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '56px 72px 44px' }, [
      // Logo, and the category on the right
      h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
        h('img', { width: LOGO_WIDTH, height: LOGO_HEIGHT }, undefined, { src: LOGO, width: LOGO_WIDTH, height: LOGO_HEIGHT }),
        badge && h('div', {
          display: 'flex', fontSize: 22, fontWeight: 700, color: GREEN, textTransform: 'uppercase',
          letterSpacing: 2, border: `3px solid ${GREEN}`, borderRadius: 999, padding: '6px 22px',
        }, badge),
      ]),
      // Title, centred in the space between
      h('div', { display: 'flex', flexGrow: 1, alignItems: 'center' }, [
        h('div', {
          display: 'block', fontSize: titleSize(title), fontWeight: 700, color: INK,
          lineHeight: 1.18, letterSpacing: -0.5, lineClamp: 4,
        }, title),
      ]),
      // Author and where to read it
      h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 26, fontWeight: 500 }, [
        h('div', { display: 'flex', color: MUTED }, author ? `By ${author}` : 'Nixsoft Technologies'),
        h('div', { display: 'flex', alignItems: 'center', color: ORANGE, fontWeight: 700 }, ['nixsoftech.in/blog', arrow]),
      ]),
    ]),
    // Brand bar, as on og-image.png
    h('div', { display: 'flex', height: 14 }, [
      h('div', { display: 'flex', flexGrow: 1, backgroundColor: ORANGE }),
      h('div', { display: 'flex', flexGrow: 1, backgroundColor: GREEN }),
    ]),
  ]);
}

/** PNG bytes of a post's share card. */
export async function renderShareCard({ title, category, readTime, author }) {
  const svg = await satori(card({ title, badge: badgeText(category, readTime), author }), { width: CARD_WIDTH, height: CARD_HEIGHT, fonts: FONTS });
  return new Resvg(svg, { fitTo: { mode: 'width', value: CARD_WIDTH } }).render().asPng();
}

/**
 * Write a card for each post to <dist>/og/blog/<slug>.png and return
 * { slug: "/og/blog/<slug>.png?v=<hash>" }. The ?v= changes when the card's
 * text does, so LinkedIn and X (which cache images by URL) fetch the new one.
 */
export async function writeShareCards(posts, dist) {
  const dir = path.join(dist, 'og', 'blog');
  fs.mkdirSync(dir, { recursive: true });
  const urls = {};
  for (const post of posts) {
    // The author line names a person only for posts with a director's byline
    // (otherwise WordPress's account name, "Nixsoft Team").
    const fields = { title: post.title, category: post.category, readTime: post.readTime, author: post.authorId ? post.author : undefined };
    const png = await renderShareCard(fields);
    fs.writeFileSync(path.join(dir, `${post.slug}.png`), png);
    const v = crypto.createHash('sha256').update(png).digest('hex').slice(0, 8);
    urls[post.slug] = `/og/blog/${post.slug}.png?v=${v}`;
  }
  return urls;
}
