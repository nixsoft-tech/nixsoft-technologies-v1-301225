import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Cpu, FileKey, Lock, TrendingUp, Building2 } from 'lucide-react';
import SEO from '../components/SEO';
import FaqList from '../components/FaqList';
import RelatedServices from '../components/RelatedServices';
import { INDUSTRIES_DATA, getIndustryBySlug } from '../data/industries';
import { getProductBySlug, type ProductData } from '../data/products';

const IndustryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const industry = slug ? getIndustryBySlug(slug) : undefined;

  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  const products = industry.relatedProducts
    .map((s) => getProductBySlug(s))
    .filter((p): p is ProductData => Boolean(p));
  const others = INDUSTRIES_DATA.filter((i) => i.id !== industry.id);

  return (
    <div className="flex flex-col">
      <SEO
        title={industry.metaTitle}
        description={industry.metaDescription}
        path={`/industries/${industry.slug}`}
        keywords={industry.keywords}
      />

      {/* Hero */}
      <section className="bg-nixDark py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(#39FF14 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/industries" className="inline-flex items-center text-slate-400 hover:text-white text-sm font-medium mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> All Industries
          </Link>
          <div className="flex items-center gap-6 mb-6">
            <div className={`p-4 rounded-2xl ${industry.lightColor}`}>
              <industry.icon size={40} className={industry.textColor} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-nixGreen">{industry.name}</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">{industry.fullName}</h1>
            </div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">{industry.description}</p>
        </div>
      </section>

      {/* Overview + impact */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Overview</h2>
            <div className="space-y-4">
              {industry.overview.map((para, i) => (
                <p key={i} className="text-lg text-slate-600 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
          <aside className={`lg:col-span-4 ${industry.lightColor} p-8 rounded-2xl border border-gray-100 space-y-8 self-start`}>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Impact</p>
              <span className={`block text-4xl font-bold ${industry.textColor}`}>{industry.stats.value}</span>
              <span className="text-slate-600 font-medium">{industry.stats.label}</span>
            </div>
            <div>
              <h3 className="flex items-center font-bold text-slate-800 mb-3">
                <FileKey size={18} className="mr-2 text-slate-400" /> Compliance Ready
              </h3>
              <div className="flex flex-wrap gap-2">
                {industry.compliance.map((c) => (
                  <span key={c} className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-slate-600">{c}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Challenges & use cases */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 bg-nixDark text-white p-8 rounded-2xl self-start">
            <h2 className="text-lg font-bold mb-6 flex items-center text-red-400">
              <Lock size={20} className="mr-2" /> Common Challenges
            </h2>
            <ul className="space-y-4">
              {industry.challenges.map((challenge) => (
                <li key={challenge} className="flex items-start text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 mr-3 shrink-0"></span>
                  {challenge}
                </li>
              ))}
            </ul>
            <h2 className="text-lg font-bold mt-10 mb-4 flex items-center text-nixGreen">
              <TrendingUp size={20} className="mr-2" /> Nixsoft Advantage
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              By automating lower-level infrastructure tasks and enforcing policy-as-code, we free your teams to focus on business logic while reducing operational risk.
            </p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6 flex items-center">
              <Cpu size={24} className={`mr-3 ${industry.textColor}`} /> Specialized Use Cases
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {industry.solutions.map((sol) => (
                <div key={sol.title} className="p-6 bg-white rounded-xl border border-gray-100">
                  <h3 className="font-bold text-slate-800 mb-2">{sol.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{sol.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clients in this sector */}
      {industry.clients.length > 0 && (
        <section className="bg-white py-16 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center gap-6">
            <h2 className="flex items-center text-sm font-bold uppercase tracking-wider text-slate-500 shrink-0">
              <Building2 size={18} className="mr-2" /> Trusted in {industry.name} by
            </h2>
            <div className="flex flex-wrap gap-3">
              {industry.clients.map((c) => (
                <span key={c} className="px-4 py-2 bg-slate-50 border border-gray-200 rounded-lg font-semibold text-slate-700">{c}</span>
              ))}
            </div>
            <Link to="/clients" className="md:ml-auto inline-flex items-center text-nixBlue font-semibold text-sm hover:underline shrink-0">
              Read the case studies <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
        </section>
      )}

      {/* Services, products, FAQ */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <RelatedServices slugs={industry.relatedServices} heading={`Services for ${industry.name}`} />

          {products.length > 0 && (
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Recommended Products</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {products.map((p) => (
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
          )}

          <FaqList faqs={industry.faqs} />
        </div>
      </section>

      {/* Other industries */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">Other Industries</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {others.map((i) => (
              <Link
                key={i.id}
                to={`/industries/${i.slug}`}
                className="group p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-nixBlue/30 transition-all"
              >
                <i.icon size={28} className={`${i.textColor} mb-4`} strokeWidth={1.5} />
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-nixBlue transition-colors">{i.fullName}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{i.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-nixDark py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-white mb-6">Ready to modernise your {industry.name} infrastructure?</h2>
          <Link to="/contact" className="inline-block bg-nixOrange text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-lg">
            Get an Industry-Specific Roadmap
          </Link>
        </div>
      </section>
    </div>
  );
};

export default IndustryDetail;
