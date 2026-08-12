import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Schema from './components/Schema';
import Home from './pages/Home';
import { getServiceBySlugOrAlias } from './data/services';

const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Solutions = lazy(() => import('./pages/Solutions'));
const SolutionDetail = lazy(() => import('./pages/SolutionDetail'));
const Products = lazy(() => import('./pages/Products'));
const Industries = lazy(() => import('./pages/Industries'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Clients = lazy(() => import('./pages/Clients'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Admin = lazy(() => import('./pages/Admin'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

// Scroll to top wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Client-side catch-all redirect component for root-level blog slugs
const BlogPostRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/blog/${slug}`} replace />;
};

// Legacy /service/<slug> URLs now live under /services. Resolve the old slug
// (canonical or alias) to the current service and 301 there; unknown → /services.
const LegacyServiceRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlugOrAlias(slug) : undefined;
  return <Navigate to={service ? `/services/${service.slug}` : '/services'} replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <Schema />
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
              <Route path="/industries" element={<Industries />} />
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

              {/* Root-Level Blog Redirect Catch-All */}
              <Route path="/:slug" element={<BlogPostRedirect />} />
            </Routes>
          </Suspense>
        </main>
        
        <Footer />
        <ChatWidget />
      </div>
    </BrowserRouter>
  );
};

export default App;
