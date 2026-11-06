import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact us' },
];

/**
 * Shown for any URL the site doesn't have: unknown routes, and unknown
 * service/solution/product/industry/blog slugs. For unknown top-level paths
 * nginx also returns HTTP 404 (nginx.conf); this page is the body either way,
 * marked noindex so search engines never treat it as content.
 */
const NotFound: React.FC = () => (
  <div className="pt-32 pb-24 min-h-[70vh] bg-white px-4">
    <SEO
      title="Page Not Found"
      description="The page you were looking for doesn't exist or has moved."
      noindex
    />
    <div className="max-w-2xl mx-auto text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-nixOrange mb-3">Error 404</p>
      <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">Page not found</h1>
      <p className="text-lg text-slate-600 mb-10">
        The page you were looking for doesn’t exist or has moved. Try one of these instead:
      </p>
      <nav aria-label="Suggested pages" className="flex flex-wrap justify-center gap-3">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="inline-flex items-center px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:border-nixBlue hover:text-nixBlue transition-colors"
          >
            {l.label}
            <ArrowRight size={16} className="ml-1.5" />
          </Link>
        ))}
      </nav>
    </div>
  </div>
);

export default NotFound;
