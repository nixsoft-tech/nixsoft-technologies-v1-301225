import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Calendar, User, Clock, ChevronLeft, Share2, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { getBlogPostBySlug } from '../services/blogService';
import { BlogPost as BlogPostType } from '../types';
import SEO from '../components/SEO';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // WordPress content is external HTML — sanitize before rendering
  const safeContent = useMemo(
    () => (post ? DOMPurify.sanitize(post.content) : ''),
    [post]
  );

  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        const data = await getBlogPostBySlug(slug);
        if (data) {
          setPost(data);
        } else {
          navigate('/blog');
        }
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-nixBlue border-t-nixGreen rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="pt-24 min-h-screen bg-white">
      <SEO 
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.image}
        keywords={`${post.category}, DevOps, Automation, ${post.author}`}
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
                <p className="text-xs">Technical Advisor</p>
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
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
              
              <div 
                className="prose prose-lg max-w-none prose-slate prose-headings:font-display prose-headings:font-bold prose-a:text-nixBlue prose-strong:text-slate-900"
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
