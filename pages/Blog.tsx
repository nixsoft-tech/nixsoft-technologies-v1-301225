import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { getBlogPosts } from '../services/blogService';
import { BlogPost } from '../types';
import SEO from '../components/SEO';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getBlogPosts();
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      <SEO 
        title="DevOps, Cloud & IT Infrastructure Blog"
        description="Practical guides on DevOps, cloud, security testing and IT infrastructure from Nixsoft engineers: Kubernetes, CI/CD, monitoring, VAPT and open-source automation."
        path="/blog"
        keywords="DevOps blog, cloud infrastructure guides, Kubernetes tutorials, CI/CD best practices, IT infrastructure blog India"
      />
      {/* Header */}
      <section className="bg-nixDark py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-nixBlue/20 to-transparent z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-nixGreen/20 rounded-full px-4 py-1.5 border border-nixGreen/30 mb-6">
              <BookOpen size={16} className="text-nixGreen" />
              <span className="text-nixGreen text-xs font-semibold uppercase tracking-wider">Knowledge Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Insights on <span className="text-nixGreen">Automation</span> & Security
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Deep dives into DevOps, cloud native engineering, and the future of self-healing infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group">
                  <Link to={`/blog/${post.slug}`} className="block overflow-hidden h-48 relative">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-nixBlue/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                        {post.category}
                      </span>
                    </div>
                  </Link>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-slate-400 text-xs mb-4 space-x-4">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1.5" />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-nixBlue transition-colors">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-nixBlue">
                          <User size={16} />
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{post.author}</span>
                      </div>
                      
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="text-nixBlue hover:text-blue-700 font-bold text-sm flex items-center"
                      >
                        Read Post <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-20 bg-nixBlue relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Stay ahead of the curve</h2>
          <p className="text-blue-100 mb-8">Join 5,000+ IT leaders receiving our monthly insights on open-source automation.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="work@company.com" 
              className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-nixGreen/50"
            />
            <button className="bg-nixGreen hover:bg-green-400 text-nixBlue font-bold px-8 py-3 rounded-xl transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
