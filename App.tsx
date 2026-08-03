import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Schema from './components/Schema';
import Home from './pages/Home';

const Solutions = lazy(() => import('./pages/Solutions'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
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
              <Route path="/solutions" element={<Solutions />} />
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
              <Route path="/services" element={<Navigate to="/solutions" replace />} />
              <Route path="/nixsoft-blog" element={<Navigate to="/blog" replace />} />

              {/* Legacy duplicate/overlapping old-site slugs — 301 to the canonical dedicated page
                  (avoids serving the same content at multiple URLs). */}
              <Route path="/service/it-managed-services" element={<Navigate to="/service/it-ops-services" replace />} />
              <Route path="/service/on-demand-services" element={<Navigate to="/service/it-ops-services" replace />} />
              <Route path="/service/performance-testing" element={<Navigate to="/service/automation-testing" replace />} />
              <Route path="/service/functional-testing" element={<Navigate to="/service/automation-testing" replace />} />
              <Route path="/service/synthetic-monitoring" element={<Navigate to="/service/infrastructure-monitoring" replace />} />
              <Route path="/service/application-performance-monitoring" element={<Navigate to="/service/infrastructure-monitoring" replace />} />

              {/* Dedicated service pages — canonical slugs (devops-automation, cloud-managed-service,
                  security-testing, database-management-service, infrastructure-monitoring,
                  it-ops-services, automation-testing, middleware-services, robotics-process-automation)
                  are all served here, matched against data/solutions.ts. Unknown slugs redirect to /solutions. */}
              <Route path="/service/:slug" element={<ServiceDetail />} />

              {/* Product/Utility Redirects */}
              <Route path="/asset-management" element={<Navigate to="/products" replace />} />
              <Route path="/email-collaboration" element={<Navigate to="/products" replace />} />
              <Route path="/ticketing-system" element={<Navigate to="/products" replace />} />
              <Route path="/get-quote" element={<Navigate to="/contact" replace />} />
              <Route path="/raise-ticket" element={<Navigate to="/contact" replace />} />
              <Route path="/testing" element={<Navigate to="/solutions" replace />} />
              <Route path="/monitoring" element={<Navigate to="/solutions" replace />} />
              <Route path="/it-service-management" element={<Navigate to="/solutions" replace />} />

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
