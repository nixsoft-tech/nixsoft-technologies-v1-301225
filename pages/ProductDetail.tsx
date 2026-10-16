import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Activity, Check, ChevronRight, Cloud, Zap, Target } from 'lucide-react';
import SEO from '../components/SEO';
import ProductVisual from '../components/ProductVisual';
import FaqList from '../components/FaqList';
import RelatedServices from '../components/RelatedServices';
import { PRODUCTS_DATA, getProductBySlug } from '../data/products';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const others = PRODUCTS_DATA.filter((p) => p.id !== product.id);

  return (
    <div className="flex flex-col">
      <SEO
        title={product.metaTitle}
        description={product.metaDescription}
        path={`/products/${product.slug}`}
        keywords={product.keywords}
        breadcrumbs={[
          { name: 'Products', path: '/products' },
          { name: product.name, path: `/products/${product.slug}` },
        ]}
      />

      {/* Hero */}
      <section className="relative bg-nixDark py-28 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-800/50 -skew-x-12 transform origin-top-right"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/products" className="inline-flex items-center text-slate-400 hover:text-white text-sm font-medium mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> All Products
          </Link>
          <div className="flex items-center gap-6 mb-6">
            <div className={`p-4 rounded-2xl ${product.accentBg}`}>
              <product.icon size={40} className={product.accentText} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-nixGreen">{product.tagline}</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">{product.name}</h1>
            </div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed mb-8">{product.summary}</p>
          <Link to="/contact" className="inline-flex items-center bg-nixOrange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors">
            Request {product.shortName} Demo <ChevronRight size={18} className="ml-1" />
          </Link>
        </div>
      </section>

      {/* Overview + visual */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">What is {product.shortName}?</h2>
            <div className="space-y-4">
              {product.overview.map((para, i) => (
                <p key={i} className="text-lg text-slate-600 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
          <div className="bg-white p-2 rounded-2xl shadow-2xl border border-gray-100">
            <div className="bg-slate-900 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
                <span className="text-slate-400 text-xs font-mono uppercase">Architecture View</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
              </div>
              <ProductVisual type={product.visualType} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="flex items-center text-2xl font-display font-bold text-slate-900 mb-8">
            <Activity size={22} className="mr-3 text-nixBlue shrink-0" /> Key features of {product.shortName}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {product.features.map((feature) => (
              <div key={feature} className="flex items-start bg-white p-5 rounded-xl border border-gray-100">
                <Check size={20} className={`${product.accentText} mr-3 mt-0.5 shrink-0`} />
                <span className="text-slate-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">How {product.shortName} Works</h2>
          <ol className="grid md:grid-cols-3 gap-6">
            {product.howItWorks.map((step, i) => (
              <li key={step.title} className="p-6 rounded-xl border border-gray-100 bg-slate-50">
                <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg font-bold mb-4 ${product.accentBg} ${product.accentText}`}>
                  {i + 1}
                </span>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="flex items-center text-2xl font-display font-bold text-slate-900 mb-8">
            <Target size={22} className="mr-3 text-nixBlue shrink-0" /> {product.shortName} use cases
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {product.useCases.map((uc) => (
              <div key={uc.title} className="p-6 bg-white rounded-xl border border-gray-100">
                <h3 className="font-bold text-slate-900 mb-2">{uc.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment & impact */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 gap-12">
          <div>
            <h2 className="font-bold text-slate-900 mb-4 flex items-center uppercase text-sm tracking-wide">
              <Cloud size={16} className="mr-2 text-slate-400" /> Deployment Options
            </h2>
            <ul className="space-y-2">
              {product.deployment.map((d) => (
                <li key={d} className="text-slate-600 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-3"></span> {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-slate-900 mb-4 flex items-center uppercase text-sm tracking-wide">
              <Zap size={16} className="mr-2 text-slate-400" /> Impact
            </h2>
            <ul className="space-y-2">
              {product.benefits.map((b) => (
                <li key={b} className="text-slate-600 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-3"></span> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Related services + FAQ */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <RelatedServices slugs={product.relatedServices} heading={`Services that pair with ${product.shortName}`} />
          <FaqList faqs={product.faqs} />
        </div>
      </section>

      {/* Other products */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">Other Products</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {others.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className="group flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-nixBlue/30 transition-all"
              >
                <div className={`p-3 rounded-lg ${p.accentBg} shrink-0`}>
                  <p.icon size={24} className={p.accentText} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-nixBlue transition-colors">{p.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-nixDark py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-white mb-6">See {product.shortName} in your environment</h2>
          <p className="text-slate-300 text-lg mb-8">Book a walkthrough with an engineer, tailored to your stack.</p>
          <Link to="/contact" className="inline-block bg-nixGreen text-slate-900 font-bold px-8 py-4 rounded-lg hover:bg-green-400 transition-colors">
            Request {product.shortName} Demo
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
