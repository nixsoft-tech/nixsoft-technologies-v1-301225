import { BlogPost } from '../types';

const WP_API_URL = import.meta.env.VITE_WORDPRESS_API_URL;

// Simple in-memory cache for WordPress posts
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const blogCache: Record<string, CacheEntry<any>> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedData<T>(key: string): T | null {
  const entry = blogCache[key];
  if (entry && entry.expiry > Date.now()) {
    return entry.data;
  }
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  blogCache[key] = {
    data,
    expiry: Date.now() + CACHE_TTL_MS
  };
}

// Falls back to mock data if no API URL is provided or if the API fails
const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'future-of-devops-automation',
    title: 'The Future of DevOps Automation in 2026',
    excerpt: 'Explore how AI-driven agents are transforming infrastructure management from reactive to proactive self-healing systems.',
    content: '<p>The landscape of DevOps is shifting rapidly...</p>',
    author: 'Sarah Chen',
    date: 'April 15, 2026',
    category: 'DevOps',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=1000',
    readTime: '5 min read'
  }
];

// WordPress returns titles and excerpts as HTML ("Doesn&#8217;t"), but they're
// rendered as plain text, so convert entities to characters. DOMParser never
// executes scripts or loads resources, so this is safe on untrusted input.
// In Node (the build-time prerender) there is no DOMParser: strip tags and
// decode the entities WordPress emits.
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', hellip: '…',
  ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
};
const htmlToText = (html: string): string => {
  if (typeof DOMParser !== 'undefined') {
    return new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim() ?? '';
  }
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED_ENTITIES[n.toLowerCase()] ?? m)
    .trim();
};

/**
 * Shorten text to at most `max` characters for a meta description or card.
 * Prefers ending at a sentence, then at a word, and adds "…" only when cut.
 */
export const summarize = (text: string, max = 155): string => {
  const clean = text.replace(/\s+/g, ' ').replace(/\s*\[(?:&hellip;|…|\.\.\.)\]\s*$/, '').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const sentenceEnd = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (sentenceEnd >= max * 0.6) return cut.slice(0, sentenceEnd + 1);
  const wordEnd = cut.lastIndexOf(' ');
  return `${cut.slice(0, wordEnd > 0 ? wordEnd : cut.length).replace(/[\s,;:.\-–—]+$/, '')}…`;
};

// WordPress *_gmt fields carry no zone suffix; mark them as UTC.
const gmtToIso = (gmt?: string): string | undefined =>
  gmt ? new Date(`${gmt}Z`).toISOString() : undefined;

export const mapWordPressPost = (wpPost: any): BlogPost => {
  return {
    id: wpPost.id.toString(),
    slug: wpPost.slug,
    title: htmlToText(wpPost.title.rendered),
    excerpt: summarize(htmlToText(wpPost.excerpt.rendered)),
    content: wpPost.content.rendered,
    author: wpPost._embedded?.author?.[0]?.name || 'Nixsoft Team',
    date: new Date(wpPost.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    datePublished: gmtToIso(wpPost.date_gmt),
    dateModified: gmtToIso(wpPost.modified_gmt),
    category: wpPost._embedded?.['wp:term']?.[0]?.[0]?.name || 'Technology',
    image: wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000',
    readTime: `${Math.ceil(wpPost.content.rendered.split(' ').length / 200)} min read`
  };
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  if (!WP_API_URL || WP_API_URL.includes('PLACEHOLDER')) {
    console.warn("WordPress API URL not configured, using mock data.");
    return MOCK_POSTS;
  }

  const cacheKey = 'blog_posts_all';
  const cached = getCachedData<BlogPost[]>(cacheKey);
  if (cached) return cached;

  try {
    // 100 is the WordPress REST maximum per request; the /blog page has no
    // pagination, so fetch them all (the migrated archive is 17 posts).
    const response = await fetch(`${WP_API_URL}/posts?_embed&per_page=100`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    const data = await response.json();
    const mapped = data.map(mapWordPressPost);
    setCachedData(cacheKey, mapped);
    return mapped;
  } catch (error) {
    console.error("WordPress API Error:", error);
    return MOCK_POSTS;
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  if (!WP_API_URL || WP_API_URL.includes('PLACEHOLDER')) {
    return MOCK_POSTS.find(p => p.slug === slug);
  }

  const cacheKey = `blog_post_slug_${slug}`;
  const cached = getCachedData<BlogPost | undefined>(cacheKey);
  if (cached !== null) return cached;

  try {
    const response = await fetch(`${WP_API_URL}/posts?_embed&slug=${slug}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    const data = await response.json();
    if (data.length > 0) {
      const mapped = mapWordPressPost(data[0]);
      setCachedData(cacheKey, mapped);
      return mapped;
    }
    setCachedData(cacheKey, undefined);
    return undefined;
  } catch (error) {
    console.error("WordPress API Error:", error);
    return MOCK_POSTS.find(p => p.slug === slug);
  }
};

/** Blog data embedded in a prerendered page (see scripts/prerender.mjs). */
export interface BlogSeed {
  posts?: BlogPost[];
  post?: BlogPost;
}

/**
 * Put prefetched posts in the cache, so the first render of a prerendered
 * page (on the server, and when the browser hydrates it) already has them.
 */
export function seedBlogCache(seed: BlogSeed): void {
  if (seed.posts) setCachedData('blog_posts_all', seed.posts);
  if (seed.post) setCachedData(`blog_post_slug_${seed.post.slug}`, seed.post);
}

/** Cached post list, if any (no network). */
export const peekBlogPosts = (): BlogPost[] | undefined =>
  getCachedData<BlogPost[]>('blog_posts_all') ?? undefined;

/** Cached post, if any (no network). */
export const peekBlogPost = (slug: string): BlogPost | undefined =>
  getCachedData<BlogPost | undefined>(`blog_post_slug_${slug}`) ?? undefined;
