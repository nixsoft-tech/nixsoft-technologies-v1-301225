import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ChevronLeft, Share2, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { getBlogPostBySlug, peekBlogPost } from '../services/blogService';
import { sanitizeHtml } from '../services/sanitize';
import { TEAM } from '../data/team';
import { personId, personNode } from '../lib/schema';
import { BlogPost as BlogPostType } from '../types';
import SEO from '../components/SEO';
import NotFound from './NotFound';
import { blogPostingNode, articleId } from '../lib/schema';

// Technical reviewer shown on every post (and in its structured data).
const REVIEWER = TEAM.find((m) => m.id === 'pravin-kore')!;

const SIZED_IMAGE = /-\d+x\d+(\.(?:jpe?g|png|gif|webp))$/i;

/** Add loading="lazy" decoding="async" to <img> tags that don't set loading. */
const lazyImages = (html: string): string =>
  html.replace(/<img\b(?![^>]*\sloading=)/gi, '<img loading="lazy" decoding="async"');

/** Swap a missing resized WordPress image ("photo-750x510.jpg") for its original. */
function restoreOriginalImage(img: HTMLImageElement) {
  const src = img.getAttribute('src') || '';
  if (!SIZED_IMAGE.test(src)) return; // already the original — don't loop
  img.removeAttribute('srcset');
  img.removeAttribute('sizes');
  img.src = src.replace(SIZED_IMAGE, '$1');
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  // Prerendered pages start with the post already in the cache.
  const initial = slug ? peekBlogPost(slug) : undefined;
  const [post, setPost] = useState<BlogPostType | null>(initial ?? null);
  const [loading, setLoading] = useState(!initial);
  const [notFound, setNotFound] = useState(false);

  // WordPress content is external HTML — sanitize before rendering
  // Images inside the article sit below the featured image, so they load
  // lazily: imported posts had no loading attribute, and phones downloaded
  // all 7-10 full-size images (~1.7 MB) at once, competing with the featured
  // image (the page's LCP). Same string on the server and in the browser.
  const safeContent = useMemo(
    () => (post ? lazyImages(sanitizeHtml(post.content)) : ''),
    [post]
  );

  // Posts imported from the old site reference resized copies (e.g.
  // "photo-750x510.jpg") from the old theme that the new WordPress never
  // generated. When one fails, fall back to the original upload.
  // A capturing listener on the container catches every image error
  // (error events don't bubble), whenever it happens and for any post shown
  // in this element, so there's no timing dependency on when images fail.
  const contentRef = useCallback((root: HTMLDivElement | null) => {
    if (!root) return;
    root.addEventListener('error', (e) => {
      if (e.target instanceof HTMLImageElement) restoreOriginalImage(e.target);
    }, true);
    // Images that already failed before the listener was attached
    root.querySelectorAll('img').forEach((img) => {
      if (img.complete && img.naturalWidth === 0) restoreOriginalImage(img);
    });
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      // Already have it (prerendered page): nothing to fetch.
      if (slug && post?.slug === slug) return;
      if (slug) {
        const data = await getBlogPostBySlug(slug);
        setPost(data ?? null);
        setNotFound(!data);
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-nixBlue border-t-nixGreen rounded-full animate-spin"></div>
      </div>
    );
  }

  if (notFound) return <NotFound />;
  if (!post) return null;

  return (
    <div className="pt-24 min-h-screen bg-white">
      <SEO 
        title={post.seoTitle ?? post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.image}
        keywords={`${post.category}, DevOps, Automation, ${post.author}`}
        breadcrumbs={[
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
        datePublished={post.datePublished}
        dateModified={post.dateModified}
        mainEntityId={articleId(`/blog/${post.slug}`)}
        reviewedById={personId(REVIEWER)}
        entities={[blogPostingNode(post), personNode(REVIEWER)]}
      />
      {/* Article Header */}
      <header className="py-12 bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center text-nixBlue hover:text-blue-700 font-semibold mb-8 group">
            <ChevronLeft size={20} className="mr-1 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
          
          <div className="mb-6">
            <span className="bg-nixBlue text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-8 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm border-t border-slate-200 pt-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-nixBlue mr-3 font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-slate-900 font-bold">{post.author}</p>
                <p className="text-xs">
                  Technically reviewed by{' '}
                  <Link to={`/about#${REVIEWER.id}`} className="text-nixBlue hover:underline">{REVIEWER.name}</Link>, {REVIEWER.role}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar size={18} className="mr-2 text-slate-400" />
              {post.date}
            </div>
            
            <div className="flex items-center">
              <Clock size={18} className="mr-2 text-slate-400" />
              {post.readTime}
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className="aspect-video mb-12 rounded-3xl overflow-hidden shadow-2xl">
                {/* The page's Largest Contentful Paint: high priority, and a
                    WordPress-sized copy for the screen instead of the original. */}
                <img
                  src={post.image}
                  srcSet={post.imageSrcSet}
                  sizes="(min-width: 1280px) 800px, (min-width: 1024px) 66vw, calc(100vw - 32px)"
                  alt={post.title}
                  width={post.imageWidth}
                  height={post.imageHeight}
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div
                ref={contentRef}
                className="wp-content prose prose-lg max-w-none prose-slate prose-headings:font-display prose-headings:font-bold prose-headings:scroll-mt-28 prose-a:text-nixBlue prose-strong:text-slate-900 prose-img:rounded-xl prose-table:my-0"
                dangerouslySetInnerHTML={{ __html: safeContent }}
              />
              
              <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-bold text-slate-900">Share this post:</span>
                  <button className="p-2 bg-slate-50 rounded-full text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Twitter size={20} />
                  </button>
                  <button className="p-2 bg-slate-50 rounded-full text-slate-500 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <Linkedin size={20} />
                  </button>
                  <button className="p-2 bg-slate-50 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                    <LinkIcon size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-12">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <Share2 size={20} className="mr-3 text-nixBlue" />
                  Related Services
                </h3>
                <div className="space-y-4">
                  <Link to="/solutions" className="block p-4 bg-white rounded-xl border border-slate-200 hover:border-nixBlue transition-colors group">
                    <h4 className="font-bold text-slate-900 group-hover:text-nixBlue">Enterprise DevOps</h4>
                    <p className="text-sm text-slate-500">Automate your delivery pipeline.</p>
                  </Link>
                  <Link to="/solutions" className="block p-4 bg-white rounded-xl border border-slate-200 hover:border-nixBlue transition-colors group">
                    <h4 className="font-bold text-slate-900 group-hover:text-nixBlue">Cloud Transformation</h4>
                    <p className="text-sm text-slate-500">Scale without boundaries.</p>
                  </Link>
                </div>
              </div>

              <div className="bg-nixDark rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">Need help implementing this?</h3>
                  <p className="text-blue-100 mb-6 text-sm">Our experts specialize in the technologies discussed in this article.</p>
                  <Link to="/contact" className="block text-center bg-nixGreen text-nixBlue font-bold py-3 rounded-xl hover:bg-green-400 transition-colors">
                    Talk to an Expert
                  </Link>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-nixBlue/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPost;
