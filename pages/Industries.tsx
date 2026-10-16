import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import SEO from '../components/SEO';
import HeroImage from '../components/HeroImage';
import { INDUSTRIES_DATA } from '../data/industries';

const Industries: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO
        title="DevOps & Cloud Solutions for Critical Industries"
        description="Nixsoft Technologies delivers high-performance, compliant DevOps and open-source automation systems for BFSI, Telecom, Retail, and Manufacturing across Pan-Asia."
        path="/industries"
        keywords="BFSI DevOps, Telecom 5G Automation, Retail Auto-scaling, Industry 4.0 IoT Security, Nixsoft Industries"
      />
      {/* Hero Section */}
      <section className="bg-nixDark py-32 px-4 relative overflow-hidden">
        <HeroImage src="/images/banners/industries-hero.webp" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Powering <span className="text-nixGreen">Critical Infrastructure</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Tailored engineering solutions for highly regulated and high-performance sectors across Asia.
          </p>
        </div>
      </section>

      {/* Industry cards */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          {INDUSTRIES_DATA.map((industry) => (
            <Link
              key={industry.id}
              to={`/industries/${industry.slug}`}
              className="group flex flex-col p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl hover:border-nixBlue/30 transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden"
            >
              <div className="-mx-8 -mt-8 mb-6 h-52 overflow-hidden">
                <img
                  src={industry.image}
                  alt={industry.fullName}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 rounded-2xl ${industry.lightColor} flex items-center justify-center`}>
                  <industry.icon size={32} className={industry.textColor} strokeWidth={1.5} />
                </div>
                <div className="text-right">
                  <span className={`block text-3xl font-bold ${industry.textColor}`}>{industry.stats.value}</span>
                  <span className="text-xs text-slate-500">{industry.stats.label}</span>
                </div>
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider mb-2 ${industry.textColor}`}>{industry.name}</span>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">{industry.fullName}</h2>
              <p className="text-slate-500 leading-relaxed mb-6 flex-grow">{industry.summary}</p>
              <span className="inline-flex items-center text-nixBlue font-semibold text-sm group-hover:underline">
                Explore {industry.name} solutions <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-50 py-24 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Globe size={48} className="text-nixBlue mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Ready to Modernize?</h2>
          <p className="text-slate-600 mb-8">
            Join leading enterprises who trust Nixsoft with their most critical workloads.
          </p>
          <Link to="/contact" className="bg-nixOrange text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-lg">
            Get an Industry-Specific Roadmap
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Industries;
