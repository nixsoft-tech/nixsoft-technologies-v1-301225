import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import HeroImage from '../components/HeroImage';
import { PRODUCTS_DATA } from '../data/products';

const Products: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO
        title="Enterprise Security & Automation Products"
        description="Discover Nixsoft's enterprise-grade open-source automation and compliance platforms: VulnGuard for vulnerability management, SecureBench for CIS hardening, and NixOps AI Agents for self-healing infrastructure."
        path="/products"
        keywords="VulnGuard, SecureBench, NixOps AI Agents, CIS Hardening Automation, Vulnerability Management Software, Nixsoft Products"
      />
      {/* Hero Section */}
      <section className="bg-nixDark py-32 px-4 relative overflow-hidden">
        <HeroImage src="/images/banners/products-hero.webp" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Enterprise-Grade <span className="text-nixBlue bg-white px-2">Frameworks</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Proprietary tools built on open-source foundations. Designed for security, compliance, and automated operations.
          </p>
        </div>
      </section>

      {/* Product cards */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          {PRODUCTS_DATA.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className="group flex flex-col p-8 bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl hover:border-nixBlue/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 rounded-2xl ${product.accentBg} flex items-center justify-center mb-6`}>
                <product.icon size={32} className={product.accentText} strokeWidth={1.5} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider mb-2 ${product.accentText}`}>
                {product.tagline}
              </span>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">{product.name}</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{product.summary}</p>
              <ul className="space-y-2 mb-8 flex-grow">
                {product.features.slice(0, 3).map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-slate-700">
                    <Check size={16} className="text-slate-400 mr-2 mt-0.5 shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center text-nixBlue font-semibold text-sm group-hover:underline">
                Explore {product.shortName} <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Built for scale. Secured by design.</h2>
          <Link to="/contact" className="inline-block bg-nixBlue text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20">
            Talk to an Engineer
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Products;
