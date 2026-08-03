import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, CheckCircle2, Layers, Terminal, Cpu, Zap
} from 'lucide-react';
import ROICalculator from '../components/ROICalculator';
import SEO from '../components/SEO';
import { SOLUTIONS_DATA, getSolutionBySlug } from '../data/solutions';

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const solution = slug ? getSolutionBySlug(slug) : undefined;

  if (!solution) {
    return <Navigate to="/solutions" replace />;
  }

  const related = SOLUTIONS_DATA.filter((s) => s.id !== solution.id).slice(0, 3);

  return (
    <div className="flex flex-col">
      <SEO
        title={solution.title}
        description={solution.metaDescription}
        path={`/service/${solution.slug}`}
        keywords={`${solution.title}, ${solution.stack.join(', ')}`}
      />

      {/* Hero */}
      <section className="relative bg-nixDark py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-nixBlue/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-nixGreen/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/solutions" className="inline-flex items-center text-slate-400 hover:text-white text-sm font-medium mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> All Solutions
          </Link>

          <div className="flex items-center gap-6 mb-6">
            <div className={`p-4 rounded-2xl ${solution.iconBg}`}>
              <solution.icon size={40} className={solution.iconColor} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-nixGreen">{solution.subtitle}</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">{solution.title}</h1>
            </div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">{solution.summary}</p>
        </div>
      </section>

      {/* Detail */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-50 p-8 rounded-xl border border-gray-100">
              <h4 className="flex items-center text-sm font-bold text-slate-700 mb-4 uppercase">
                <Terminal size={16} className="mr-2 text-red-500" /> The Challenge
              </h4>
              <p className="text-slate-600 leading-relaxed">{solution.problem}</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl border border-gray-100">
              <h4 className="flex items-center text-sm font-bold text-slate-700 mb-4 uppercase">
                <Zap size={16} className="mr-2 text-nixGreen" /> The Nixsoft Approach
              </h4>
              <p className="text-slate-600 leading-relaxed">{solution.approach}</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-12">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
              <Layers size={18} className="mr-2 text-slate-400" /> Tools & Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {solution.stack.map((tech) => (
                <span key={tech} className="px-4 py-1.5 bg-white border border-gray-200 rounded text-sm font-medium text-slate-600 shadow-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Outcomes */}
          <div className="mb-12">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
              <CheckCircle2 size={18} className="mr-2 text-slate-400" /> Key Outcomes
            </h4>
            <ul className="space-y-3">
              {solution.outcomes.map((outcome, i) => (
                <li key={i} className="flex items-start text-slate-600 text-lg">
                  <div className="min-w-2 h-2 rounded-full bg-nixBlue mt-2.5 mr-3"></div>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <Link to="/contact" className="inline-flex items-center text-nixBlue font-bold hover:underline text-lg">
              Schedule a Technical Deep Dive <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Related Solutions */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-8">Related Solutions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/service/${r.slug}`}
                className="group p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-nixBlue/30 transition-all"
              >
                <div className={`w-12 h-12 rounded-lg ${r.iconBg} flex items-center justify-center mb-4`}>
                  <r.icon size={24} className={r.iconColor} strokeWidth={1.5} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2 group-hover:text-nixBlue transition-colors">{r.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{r.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="bg-white py-24 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Calculate Your ROI</h2>
            <p className="text-lg text-slate-600">See the immediate financial impact of moving to Nixsoft's automated open-source solutions.</p>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* CTA */}
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

export default ServiceDetail;
