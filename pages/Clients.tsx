import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  ArrowRight, Building2, Globe, ShieldCheck, TrendingUp, 
  Landmark, RadioTower, ShoppingBag, Cpu, CheckCircle2
} from 'lucide-react';

type CaseStudy = {
  name: string;
  industry: string;
  engagement: string;
  summary: string;
  logo?: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    name: 'NCDEX',
    logo: '/clients/ncdex.png',
    industry: 'Exchange',
    engagement: 'MySQL & PostgreSQL Database Management',
    summary: 'Faced with high-latency transactions during peak hours, we re-architected the database layer using advanced tuning and replication strategies. This resulted in 99.99% availability and sub-millisecond response times for critical trading operations.'
  },
  {
    name: 'NCCL',
    industry: 'Clearing Corp',
    engagement: 'PostgreSQL Performance Optimization',
    summary: 'To support surging clearing volumes, we implemented a proactive maintenance framework. Our comprehensive tuning and automated monitoring ensured zero-data-loss reliability for risk management systems.'
  },
  {
    name: 'Zero Mass',
    industry: 'FinTech',
    engagement: 'Linux Infrastructure Support',
    summary: 'Required a hardened operating environment for financial inclusion services. Nixsoft provided end-to-end Enterprise Linux support and automated patch management, delivering a secure foundation for millions of end-users.'
  },
  {
    name: 'Hathway',
    logo: '/clients/hathway.ico',
    industry: 'Telecom',
    engagement: 'Infrastructure & Network Monitoring',
    summary: 'Managing a distributed network required centralized visibility. We deployed a unified Network Monitoring System (NMS) with intelligent alerting, reducing noise and enabling proactive incident resolution.'
  },
  {
    name: 'Tata Trent',
    logo: '/clients/tatatrent.png',
    industry: 'Retail',
    engagement: 'Automated Patch Management & VulnGuard™',
    summary: 'Manual patching was a security risk across their vast retail footprint. We implemented VulnGuard™ to automate vulnerability assessment, ensuring 100% compliance without disrupting daily retail operations.'
  },
  {
    name: 'Atos',
    logo: '/clients/atos.png',
    industry: 'Technology',
    engagement: 'Database & Linux Vulnerability Remediation',
    summary: 'Faced with strict audit requirements, the client needed rapid remediation. We executed a systematic automated hardening strategy across database and OS layers, closing critical gaps and meeting global standards.'
  },
  {
    name: 'Globus',
    logo: '/clients/globus.png',
    industry: 'Retail',
    engagement: 'Enterprise Monitoring Solutions',
    summary: 'Operational blind spots were leading to unpredicted downtime. We engineered a full-stack observability suite providing real-time dashboards, preventing outages and optimizing resource utilization.'
  },
  {
    name: 'IndusInd Bank',
    logo: '/clients/indusind.png',
    industry: 'BFSI',
    engagement: 'Linux & Monitoring Support',
    summary: 'In a highly regulated environment, security and uptime are non-negotiable. We delivered 24/7 specialized Linux support and real-time monitoring, ensuring strict compliance and seamless banking operations.'
  }
];

const IndustryIcon: React.FC<{ industry: string; size?: number; className?: string }> = ({
  industry,
  size = 14,
  className = 'mr-1.5',
}) => {
  switch (industry) {
    case 'BFSI':
    case 'Clearing Corp':
    case 'FinTech':
      return <Landmark size={size} className={className} />;
    case 'Exchange':
      return <TrendingUp size={size} className={className} />;
    case 'Retail':
      return <ShoppingBag size={size} className={className} />;
    case 'Telecom':
      return <RadioTower size={size} className={className} />;
    case 'Technology':
      return <Cpu size={size} className={className} />;
    default:
      return <Building2 size={size} className={className} />;
  }
};

// Company icon shown before the client name. Falls back to a neutral badge
// with the industry icon if no logo is set or the image fails to load.
const ClientLogo: React.FC<{ name: string; industry: string; logo?: string }> = ({ name, industry, logo }) => {
  const [failed, setFailed] = React.useState(false);

  if (logo && !failed) {
    return (
      <span className="w-11 h-11 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
        <img
          src={logo}
          alt={`${name} logo`}
          className="w-7 h-7 object-contain"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    <span className="w-11 h-11 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
      <IndustryIcon industry={industry} size={22} className="" />
    </span>
  );
};

const Clients: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO 
        title="Trusted by Enterprise Industry Leaders"
        description="Read case studies of how Nixsoft Technologies helped market leaders like NCDEX, Hathway, IndusInd Bank, and Tata Trent achieve sub-millisecond database speeds and compliance."
        path="/clients"
        keywords="Nixsoft Case Studies, Enterprise DevOps Portfolio, Database Optimization NCDEX, CIS Compliance Tata Trent"
      />
      {/* Hero Section */}
      <section className="bg-nixDark py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800/30 skew-y-12 transform origin-top-right"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-slate-800/80 rounded-full px-4 py-1.5 border border-slate-700 mb-6 backdrop-blur-md">
            <Building2 size={14} className="text-nixGreen" />
            <span className="text-slate-300 text-xs font-semibold tracking-wide uppercase">Enterprise Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Trusted by <span className="text-nixBlue bg-white px-2">Industry Leaders</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We partner with the world's most ambitious enterprises to deliver secure, scalable, and automation-driven IT infrastructure.
          </p>
        </div>
      </section>

      {/* Trust Indicators */}
      <div className="bg-slate-900 border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
             <ShieldCheck className="text-nixGreen mb-2" size={24} />
             <span className="text-slate-400 text-sm font-medium">Securing Critical Financial Data</span>
          </div>
          <div className="flex flex-col items-center">
             <Globe className="text-nixBlue mb-2" size={24} />
             <span className="text-slate-400 text-sm font-medium">Supporting Pan-Asia Operations</span>
          </div>
          <div className="flex flex-col items-center">
             <TrendingUp className="text-nixOrange mb-2" size={24} />
             <span className="text-slate-400 text-sm font-medium">Scaling High-Volume Retail Events</span>
          </div>
        </div>
      </div>

      {/* Success Stories Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Client Success Stories</h2>
            <p className="text-slate-600 text-lg">Real-world impact delivering mission-critical solutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CASE_STUDIES.map((study, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-nixBlue/30 transition-all duration-300 flex flex-col h-full group"
              >
                <div className="mb-6 pb-4 border-b border-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                        <ClientLogo name={study.name} industry={study.industry} logo={study.logo} />
                        <h3 className="text-2xl font-bold text-slate-900 font-display group-hover:text-nixBlue transition-colors">{study.name}</h3>
                    </div>
                    <span className="inline-flex items-center text-xs font-bold text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-1 rounded">
                        <IndustryIcon industry={study.industry} /> {study.industry}
                    </span>
                </div>
                
                <div className="mb-6 flex-grow">
                    <h4 className="text-sm font-bold text-nixBlue mb-3 uppercase tracking-wide flex items-start">
                        <CheckCircle2 size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                        {study.engagement}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {study.summary}
                    </p>
                </div>
                
                <div className="mt-auto">
                    <Link to="/contact" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-nixOrange transition-colors uppercase tracking-wider">
                        Request Similar Solution <ArrowRight size={12} className="ml-1" />
                    </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-nixDark text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle, #0A4A8F 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Join the League of Future-Ready Enterprises
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Let's discuss how we can bring the same level of reliability and automation to your organization.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="bg-nixOrange hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg shadow-orange-900/20 transition-all">
              Request a Consultation
            </Link>
            <a href="mailto:sales@nixsoftech.in" className="bg-transparent border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all">
              Talk to Sales
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Clients;
