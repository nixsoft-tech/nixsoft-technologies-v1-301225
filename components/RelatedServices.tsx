import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getServiceBySlug } from '../data/services';
import type { OfferingData } from '../types';

interface RelatedServicesProps {
  /** Service slugs, rendered as links to /services/<slug>. */
  slugs: string[];
  heading?: string;
}

/** Cross-links to Services pages (internal links help each page rank). */
const RelatedServices: React.FC<RelatedServicesProps> = ({ slugs, heading = 'Related Services' }) => {
  const services = slugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is OfferingData => Boolean(s));
  if (services.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">{heading}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <Link
            key={s.id}
            to={`/services/${s.slug}`}
            className="group flex flex-col p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-nixBlue/30 transition-all"
          >
            <div className={`w-12 h-12 rounded-lg ${s.iconBg} flex items-center justify-center mb-4`}>
              <s.icon size={24} className={s.iconColor} strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 group-hover:text-nixBlue transition-colors">{s.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-grow">{s.summary}</p>
            <span className="inline-flex items-center text-nixBlue font-semibold text-sm">
              Learn more <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedServices;
