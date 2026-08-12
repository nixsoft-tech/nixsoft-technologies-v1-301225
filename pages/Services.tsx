import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu } from 'lucide-react';
import SEO from '../components/SEO';
import { SERVICE_CATEGORIES, getServicesByCategory } from '../data/services';

const Services: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO
        title="Services"
        description="Nixsoft's full technical services catalogue — Managed IT & Operations, DevOps, Monitoring, Quality Engineering, Cloud, and Infrastructure — delivered with open-source excellence."
        path="/services"
        keywords="Managed IT Services, DevOps, Infrastructure Monitoring, Automation Testing, Security Testing, Cloud Management, Middleware, Database Management, RPA"
      />

      {/* Hero */}
      <section className="relative bg-nixDark py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-nixBlue/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-nixGreen/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 animate-fade-in">
            Our <span className="text-nixGreen">Services</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            End-to-end technical services across the full infrastructure lifecycle — from day-to-day operations to DevOps, observability, quality engineering, and cloud.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {SERVICE_CATEGORIES.map((category) => {
            const services = getServicesByCategory(category.id);
            if (services.length === 0) return null;
            return (
              <div key={category.id}>
                <div className="mb-8 pb-4 border-b border-gray-100">
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">{category.name}</h2>
                  <p className="text-slate-500 mt-2">{category.blurb}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      to={`/services/${service.slug}`}
                      className="group flex flex-col p-8 bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl hover:border-nixBlue/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className={`w-16 h-16 rounded-2xl ${service.iconBg} flex items-center justify-center mb-6`}>
                        <service.icon size={32} className={service.iconColor} strokeWidth={1.5} />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider mb-2 ${service.iconColor}`}>
                        {service.subtitle}
                      </span>
                      <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{service.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{service.summary}</p>
                      <span className="inline-flex items-center text-nixBlue font-semibold text-sm group-hover:underline">
                        Learn more <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-nixDark text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <Cpu size={48} className="text-nixGreen mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Not sure which service you need?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Tell us the outcome you're after and we'll map it to the right engagement.
          </p>
          <Link to="/contact" className="inline-block bg-nixGreen text-slate-900 font-bold px-8 py-4 rounded-lg hover:bg-green-400 transition-colors shadow-lg shadow-green-900/20">
            Talk to an Expert
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
