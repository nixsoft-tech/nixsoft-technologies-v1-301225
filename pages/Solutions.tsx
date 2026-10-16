import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu } from 'lucide-react';
import SEO from '../components/SEO';
import HeroImage from '../components/HeroImage';
import { SOLUTIONS_DATA } from '../data/solutions';

const Solutions: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO
        title="Solutions"
        description="Nixsoft's packaged platform solutions — Asset Management, Email & Collaboration, and Ticketing System — deployed, secured, and fully managed."
        path="/solutions"
        keywords="IT Asset Management, Email & Collaboration, Service Desk, Ticketing System, ITSM, Enterprise Solutions"
      />

      {/* Hero */}
      <section className="relative bg-nixDark py-32 px-4 overflow-hidden">
        <HeroImage src="/images/banners/solutions-hero.webp" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 animate-fade-in">
            Platform <span className="text-nixGreen">Solutions</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Ready-to-run enterprise platforms — deployed, secured, and managed by Nixsoft — that put you back in control of your assets, communication, and support.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {SOLUTIONS_DATA.map((solution) => (
              <Link
                key={solution.id}
                to={`/solutions/${solution.slug}`}
                className="group flex flex-col p-8 bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl hover:border-nixBlue/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {solution.image && (
                  <div className="-mx-8 -mt-8 mb-6 h-44 overflow-hidden">
                    <img
                      src={solution.image}
                      alt={solution.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className={`w-16 h-16 rounded-2xl ${solution.iconBg} flex items-center justify-center mb-6`}>
                  <solution.icon size={32} className={solution.iconColor} strokeWidth={1.5} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider mb-2 ${solution.iconColor}`}>
                  {solution.subtitle}
                </span>
                <h2 className="text-xl font-display font-bold text-slate-900 mb-3">{solution.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{solution.summary}</p>
                <span className="inline-flex items-center text-nixBlue font-semibold text-sm group-hover:underline">
                  Learn more <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-nixDark text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <Cpu size={48} className="text-nixGreen mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Looking for a technical service instead?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Explore our full catalogue of DevOps, monitoring, testing, cloud, and managed IT services.
          </p>
          <Link to="/services" className="inline-block bg-nixGreen text-slate-900 font-bold px-8 py-4 rounded-lg hover:bg-green-400 transition-colors shadow-lg shadow-green-900/20">
            Browse Services
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Solutions;
