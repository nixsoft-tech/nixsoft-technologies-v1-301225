import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Analytics from './components/Analytics';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { getServiceBySlugOrAlias } from './data/services';

// A page's code chunk can fail to load: a dropped request, or a visitor still
// running the previous build after a deploy (its hashed chunk names are gone).
// Reload once to pick up the current build instead of leaving a blank page; the
// session flag stops a reload loop if the chunk is genuinely missing.
const RELOAD_FLAG = 'nix-chunk-reload';
const lazyPage = <T extends React.ComponentType<any>>(load: () => Promise<{ default: T }>) =>
  lazy(() =>
    load().then(
      (mod) => { if (typeof window !== 'undefined') sessionStorage.removeItem(RELOAD_FLAG); return mod; },
      (err) => {
        if (typeof window !== 'undefined' && !sessionStorage.getItem(RELOAD_FLAG)) {
          sessionStorage.setItem(RELOAD_FLAG, '1');
          window.location.reload();
          return new Promise<never>(() => {});
        }
        throw err;
      }
    )
  );

const Services = lazyPage(() => import('./pages/Services'));
const ServiceDetail = lazyPage(() => import('./pages/ServiceDetail'));
const Solutions = lazyPage(() => import('./pages/Solutions'));
const SolutionDetail = lazyPage(() => import('./pages/SolutionDetail'));
const Products = lazyPage(() => import('./pages/Products'));
const ProductDetail = lazyPage(() => import('./pages/ProductDetail'));
const Industries = lazyPage(() => import('./pages/Industries'));
const IndustryDetail = lazyPage(() => import('./pages/IndustryDetail'));
const Contact = lazyPage(() => import('./pages/Contact'));
const About = lazyPage(() => import('./pages/About'));
const Clients = lazyPage(() => import('./pages/Clients'));
const Blog = lazyPage(() => import('./pages/Blog'));
const BlogPost = lazyPage(() => import('./pages/BlogPost'));
const Admin = lazyPage(() => import('./pages/Admin'));
const PrivacyPolicy = lazyPage(() => import('./pages/PrivacyPolicy'));

// Scroll to top wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Legacy /service/<slug> URLs now live under /services. Resolve the old slug
// (canonical or alias) to the current service and 301 there; unknown → /services.
const LegacyServiceRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlugOrAlias(slug) : undefined;
  return <Navigate to={service ? `/services/${service.slug}` : '/services'} replace />;
};

/**
 * The site's layout and routes, without a router. The browser wraps it in
 * BrowserRouter (App, below); the build-time prerender (entry-server.tsx)
 * wraps it in StaticRouter to produce static HTML for every page.
 */
export const AppShell: React.FC = () => {
  return (
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <Analytics />
        <Navbar />
        
        <main className="flex-grow">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-nixBlue"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/solutions/:slug" element={<SolutionDetail />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/industries/:slug" element={<IndustryDetail />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              {/* Core Page Redirects */}
              <Route path="/about-us" element={<Navigate to="/about" replace />} />
              <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
              <Route path="/nixsoft-blog" element={<Navigate to="/blog" replace />} />

              {/* Legacy /service/<slug> URLs — the technical catalogue moved to /services.
                  Resolve each old slug (canonical or alias) to its current page and 301. */}
              <Route path="/service/:slug" element={<LegacyServiceRedirect />} />
              <Route path="/service" element={<Navigate to="/services" replace />} />

              {/* Platform solutions moved from /products to the Solutions tab. */}
              <Route path="/asset-management" element={<Navigate to="/solutions/asset-management" replace />} />
              <Route path="/email-collaboration" element={<Navigate to="/solutions/email-collaboration" replace />} />
              <Route path="/ticketing-system" element={<Navigate to="/solutions/ticketing-system" replace />} />

              {/* Utility Redirects */}
              <Route path="/get-quote" element={<Navigate to="/contact" replace />} />
              <Route path="/raise-ticket" element={<Navigate to="/contact" replace />} />
              <Route path="/testing" element={<Navigate to="/services" replace />} />
              <Route path="/monitoring" element={<Navigate to="/services" replace />} />
              <Route path="/it-service-management" element={<Navigate to="/services" replace />} />

              {/* Anything else: Not Found (old root-level blog slugs are 301'd by nginx) */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        
        <Footer />
        <ChatWidget />
      </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

export default App;
