import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqListProps {
  faqs: { q: string; a: string }[];
  heading?: string;
}

/** Native <details> accordion — answers stay in the DOM, so crawlers see them. */
const FaqList: React.FC<FaqListProps> = ({ faqs, heading = 'Frequently Asked Questions' }) => {
  if (faqs.length === 0) return null;
  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">{heading}</h2>
      <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl bg-white">
        {faqs.map((faq) => (
          <details key={faq.q} className="group p-6">
            <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-nixBlue rounded">
              {faq.q}
              <ChevronDown size={18} className="text-slate-400 shrink-0 ml-4 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-slate-600 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FaqList;
