import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  Landmark, RadioTower, ShoppingBag, Factory, 
  ShieldCheck, ArrowRight, TrendingUp, Lock, 
  Cpu, Activity, FileKey, Globe, BarChart4
} from 'lucide-react';

const INDUSTRIES_DATA = [
  {
    id: 'bfsi',
    name: 'BFSI',
    fullName: 'Banking, Financial Services & Insurance',
    icon: Landmark,
    description: 'Modernize legacy core banking systems while maintaining military-grade security and strict regulatory compliance.',
    challenges: ['Legacy mainframe dependencies', 'Strict data residency laws (RBI/MAS)', 'Zero-tolerance for downtime'],
    solutions: [
      { title: 'Payment Gateway Auto-Scaling', desc: 'Kubernetes architecture that handles 10k+ TPS during peak transaction hours.' },
      { title: 'Fraud Detection Pipelines', desc: 'Real-time data streaming (Kafka) for immediate anomaly detection.' },
      { title: 'Compliance as Code', desc: 'Automated policy enforcement for PCI-DSS and ISO 27001.' }
    ],
    compliance: ['PCI-DSS', 'ISO 27001', 'SOC 2', 'GDPR'],
    stats: { label: 'Faster Compliance Audits', value: '70%' },
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    id: 'telecom',
    name: 'Telecom',
    fullName: 'Telecommunications & 5G',
    icon: RadioTower,
    description: 'Build the backbone of the future with high-throughput, low-latency infrastructure automation for 5G and edge computing.',
    challenges: ['Massive scale data ingestion', 'Network function virtualization (NFV)', 'Edge deployment complexity'],
    solutions: [
      { title: 'Zero-Touch Provisioning', desc: 'Automated bare-metal provisioning for thousands of edge locations.' },
      { title: 'OSS/BSS Modernization', desc: 'Migrating monolithic billing systems to microservices.' },
      { title: 'Network Slicing Automation', desc: 'Dynamic resource allocation for prioritized 5G traffic.' }
    ],
    compliance: ['Data Sovereignty', 'TRAI Regulations', '3GPP Standards'],
    stats: { label: 'Deployment Efficiency', value: '10x' },
    color: 'bg-nixGreen',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  {
    id: 'retail',
    name: 'Retail',
    fullName: 'Retail & E-Commerce',
    icon: ShoppingBag,
    description: 'Survive and thrive during high-traffic events like Black Friday with elastic, self-healing infrastructure.',
    challenges: ['Unpredictable traffic spikes', 'Omnichannel inventory sync', 'Customer data protection'],
    solutions: [
      { title: 'Elastic Kubernetes Clusters', desc: 'Auto-scaling that reacts to traffic surges in seconds, not minutes.' },
      { title: 'Personalization Engines', desc: 'AI-driven recommendation APIs powered by low-latency databases.' },
      { title: 'POS Security Hardening', desc: 'End-point protection for distributed Point-of-Sale systems.' }
    ],
    compliance: ['PCI-DSS', 'Consumer Privacy Acts', 'PaaS Security'],
    stats: { label: 'Uptime During Peaks', value: '99.99%' },
    color: 'bg-nixOrange',
    lightColor: 'bg-orange-50',
    textColor: 'text-orange-600'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    fullName: 'Manufacturing & Industry 4.0',
    icon: Factory,
    description: 'Bridge the gap between OT (Operational Technology) and IT with secure IoT integration and digital twins.',
    challenges: ['IT/OT Convergence security', 'Legacy SCADA systems', 'Supply chain visibility'],
    solutions: [
      { title: 'IoT Data Lakes', desc: 'Secure ingestion pipelines for millions of sensor data points.' },
      { title: 'Predictive Maintenance', desc: 'ML models running on edge devices to predict equipment failure.' },
      { title: 'Air-Gapped Updates', desc: 'Secure CI/CD mechanisms for isolated factory networks.' }
    ],
    compliance: ['IEC 62443', 'ISO 9001', 'Safety Standards'],
    stats: { label: 'Reduction in Downtime', value: '45%' },
    color: 'bg-indigo-600',
    lightColor: 'bg-indigo-50',
    textColor: 'text-indigo-600'
  }
];

const Industries: React.FC = () => {
  const [activeTab, setActiveTab] = useState(INDUSTRIES_DATA[0].id);

  const activeData = INDUSTRIES_DATA.find(d => d.id === activeTab) || INDUSTRIES_DATA[0];

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
        <div className="absolute inset-0 z-0">
           {/* Abstract Hexagon Pattern */}
           <div className="absolute top-0 left-0 w-full h-full opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#39FF14 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Powering <span className="text-nixGreen">Critical Infrastructure</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Tailored engineering solutions for highly regulated and high-performance sectors across Asia.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {INDUSTRIES_DATA.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setActiveTab(industry.id)}
                className={`flex items-center px-6 py-4 rounded-xl transition-all duration-300 border ${
                  activeTab === industry.id 
                    ? `${industry.lightColor} ${industry.textColor} border-${industry.textColor} shadow-lg scale-105 ring-1 ring-offset-2 ring-transparent`
                    : 'bg-white text-slate-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <industry.icon size={20} className="mr-2" />
                <span className="font-bold text-sm uppercase tracking-wide">{industry.name}</span>
              </button>
            ))}
          </div>

          {/* Active Industry Content */}
          <div className="animate-fade-in">
            <div className="grid lg:grid-cols-12 gap-12">
              
              {/* Left Column: Overview & Stats */}
              <div className="lg:col-span-4 space-y-8">
                <div className={`${activeData.lightColor} p-8 rounded-3xl border border-gray-100 h-full`}>
                  <activeData.icon size={64} className={`${activeData.textColor} mb-6`} />
                  <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">{activeData.fullName}</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    {activeData.description}
                  </p>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Impact</p>
                    <div className="flex items-baseline">
                      <span className={`text-4xl font-bold ${activeData.textColor} mr-2`}>{activeData.stats.value}</span>
                      <span className="text-slate-600 font-medium">{activeData.stats.label}</span>
                    </div>
                  </div>

                  <div className="mt-8">
                     <h4 className="flex items-center font-bold text-slate-800 mb-4">
                       <FileKey size={18} className="mr-2 text-slate-400" /> Compliance Ready
                     </h4>
                     <div className="flex flex-wrap gap-2">
                       {activeData.compliance.map(c => (
                         <span key={c} className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-slate-600">
                           {c}
                         </span>
                       ))}
                     </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Challenges & Solutions */}
              <div className="lg:col-span-8 space-y-12">
                
                {/* Use Cases / Solutions */}
                <div>
                   <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                     <Cpu size={24} className={`mr-3 ${activeData.textColor}`} /> 
                     Specialized Use Cases
                   </h3>
                   <div className="grid md:grid-cols-2 gap-6">
                     {activeData.solutions.map((sol, idx) => (
                       <div key={idx} className="group p-6 bg-slate-50 hover:bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
                         <h4 className="font-bold text-slate-800 mb-2 group-hover:text-nixBlue transition-colors">{sol.title}</h4>
                         <p className="text-sm text-slate-500 leading-relaxed">{sol.desc}</p>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Challenges & Automation Benefits */}
                <div className="bg-nixDark text-white p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                  
                  <div className="relative z-10 grid md:grid-cols-2 gap-12">
                    <div>
                      <h3 className="text-lg font-bold mb-6 flex items-center text-red-400">
                        <Lock size={20} className="mr-2" /> Common Challenges
                      </h3>
                      <ul className="space-y-4">
                        {activeData.challenges.map((challenge, idx) => (
                          <li key={idx} className="flex items-start text-slate-300 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-3 shrink-0"></span>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-6 flex items-center text-nixGreen">
                        <TrendingUp size={20} className="mr-2" /> Nixsoft Advantage
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        By automating lower-level infrastructure tasks and enforcing policy-as-code, we free your teams to focus on business logic while reducing operational risk.
                      </p>
                      <Link to="/contact" className="inline-flex items-center text-white font-bold text-sm hover:underline">
                        Discuss your specific needs <ArrowRight size={16} className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-50 py-24 border-t border-gray-200">
         <div className="max-w-3xl mx-auto px-4 text-center">
            <Globe size={48} className="text-nixBlue mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Ready to Modernize?</h2>
            <p className="text-slate-600 mb-8">
              Join leading enterprises in {activeData.name} who trust Nixsoft with their most critical workloads.
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
