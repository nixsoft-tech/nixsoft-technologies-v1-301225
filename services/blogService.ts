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

const mapWordPressPost = (wpPost: any): BlogPost => {
  return {
    id: wpPost.id.toString(),
    slug: wpPost.slug,
    title: wpPost.title.rendered,
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...',
    content: wpPost.content.rendered,
    author: wpPost._embedded?.author?.[0]?.name || 'Nixsoft Team',
    date: new Date(wpPost.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
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
