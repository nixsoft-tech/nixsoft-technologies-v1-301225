import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu } from 'lucide-react';
import ROICalculator from '../components/ROICalculator';
import SEO from '../components/SEO';
import { SOLUTIONS_DATA } from '../data/solutions';

const Solutions: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO
        title="Infrastructure Solutions & Consulting"
        description="Explore our enterprise-grade solutions for DevOps, Cloud Management, Security, Testing, Middleware, RPA, and AI-Driven Monitoring using open-source excellence."
        path="/solutions"
        keywords="Cloud Solutions, Infrastructure Management, DevSecOps, SRE Services, AI-Ops, RPA, Middleware, Test Automation"
      />
      {/* Hero Section */}
      <section className="relative bg-nixDark py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-nixBlue/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-nixGreen/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 animate-fade-in">
            Engineering <span className="text-nixGreen">Infrastructure Excellence</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We don't just fix problems; we architect resilient, self-healing systems that drive business growth.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SOLUTIONS_DATA.map((solution) => (
              <Link
                key={solution.id}
                to={`/service/${solution.slug}`}
                className="group flex flex-col p-8 bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl hover:border-nixBlue/30 transition-all duration-300 hover:-translate-y-1"
              >
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

      {/* ROI Calculator Section */}
      <section className="bg-slate-50 py-24 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Calculate Your ROI</h2>
             <p className="text-lg text-slate-600">See the immediate financial impact of moving to Nixsoft's automated open-source solutions.</p>
           </div>
           <ROICalculator />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-nixDark text-center relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-4 relative z-10">
           <Cpu size={48} className="text-nixGreen mx-auto mb-6 animate-pulse" />
           <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
             Solving Complex Engineering Challenges?
           </h2>
           <p className="text-slate-300 text-lg mb-8">
             Let's build a roadmap tailored to your specific infrastructure needs.
           </p>
           <Link to="/contact" className="inline-block bg-nixGreen text-slate-900 font-bold px-8 py-4 rounded-lg hover:bg-green-400 transition-colors shadow-lg shadow-green-900/20">
             Talk to an Architect
           </Link>
         </div>
      </section>
    </div>
  );
};

export default Solutions;
