import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  Shield, Lock, Cpu, Server, Activity, FileCheck, 
  Globe, Download, Cloud, ChevronRight, Zap, RefreshCw,
  Database, LayoutGrid, Check, AlertCircle, Terminal
} from 'lucide-react';

const PRODUCTS_DATA = [
  {
    id: 'vulnguard',
    name: 'Nixsoft VulnGuard™',
    tagline: 'Next-Gen Vulnerability Management',
    description: 'A continuous security posture management platform designed specifically for dynamic, containerized, and hybrid environments. VulnGuard moves beyond static scanning to provide real-time context and prioritized remediation.',
    features: [
      'Real-time CVE Scanning (Container & Host)',
      'Context-Aware Prioritization',
      'Integration with Jira/ServiceNow',
      'Automated Patch Deployment'
    ],
    deployment: ['SaaS (Managed)', 'Self-Hosted (Air-gapped)', 'Hybrid Agent'],
    benefits: ['Reduce MTTD (Mean Time to Detect) by 70%', 'Eliminate 95% of false positives', 'Single pane of glass for multi-cloud security'],
    visualType: 'radar',
    accent: 'nixGreen'
  },
  {
    id: 'securebench',
    name: 'SecureBench Automation',
    tagline: 'CIS Compliance on Autopilot',
    description: 'Automated hardening framework that enforces CIS Level 1 & 2 benchmarks across your entire server fleet. Detect configuration drift and auto-remediate deviations in seconds.',
    features: [
      'One-click CIS Hardening',
      'Configuration Drift Detection',
      'Audit-Ready Compliance Reports (PDF/CSV)',
      'Rollback Capabilities'
    ],
    deployment: ['Ansible/Puppet Module', 'Standalone Binary', 'Kubernetes Operator'],
    benefits: ['100% Audit Readiness', 'Standardized Security Baseline', 'Zero manual configuration errors'],
    visualType: 'stack',
    accent: 'nixBlue'
  },
  {
    id: 'nixops-ai',
    name: 'NixOps AI Agents',
    tagline: 'Self-Healing Infrastructure Intelligence',
    description: 'Lightweight, intelligent agents that live on your endpoints. They utilize local machine learning models to predict failures, optimize resource usage, and automatically fix common operational issues.',
    features: [
      'Predictive Anomaly Detection',
      'Automated Log Analysis',
      'Self-Healing Scripts',
      'Resource Optimization (Cost Saving)'
    ],
    deployment: ['Linux Daemon', 'Windows Service', 'Kubernetes Sidecar'],
    benefits: ['Reduce L1 Support Tickets by 60%', 'Prevent outages before they occur', 'Lower cloud compute costs by optimizing usage'],
    visualType: 'network',
    accent: 'nixOrange'
  }
];

const ArchitectureVisual: React.FC<{ type: string }> = ({ type }) => {
  // Inject custom styles for animations
  const styles = (
    <style>{`
      @keyframes radar-sweep {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes scan-line {
        0% { transform: translateY(-100%); opacity: 0; }
        15% { opacity: 1; }
        85% { opacity: 1; }
        100% { transform: translateY(400%); opacity: 0; }
      }
      @keyframes flow {
        to { stroke-dashoffset: -20; }
      }
      .animate-radar-sweep {
        animation: radar-sweep 3s linear infinite;
      }
      .animate-scan-line {
        animation: scan-line 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      .animate-flow {
        animation: flow 1s linear infinite;
      }
    `}</style>
  );

  if (type === 'radar') {
    return (
      <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
        {styles}
        {/* Radar Background Grid */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle, #39FF14 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
        
        {/* Concentric Circles */}
        <div className="absolute w-48 h-48 border border-nixGreen/20 rounded-full"></div>
        <div className="absolute w-72 h-72 border border-nixGreen/10 rounded-full"></div>

        {/* Radar Sweep Effect */}
        <div className="absolute w-full h-full animate-radar-sweep origin-center flex items-center justify-center pointer-events-none">
           <div className="w-1/2 h-full absolute right-1/2 bg-gradient-to-l from-nixGreen/10 to-transparent transform origin-right" style={{ clipPath: 'polygon(100% 0, 100% 50%, 0 0)' }}></div>
        </div>
        
        {/* Central Hub */}
        <div className="relative z-10 w-20 h-20 bg-slate-800 rounded-full border border-nixGreen flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.2)]">
          <Shield size={32} className="text-nixGreen" />
          <div className="absolute inset-0 rounded-full border border-nixGreen opacity-50 animate-ping"></div>
        </div>

        {/* Orbiting Nodes (Threats) */}
        <div className="absolute top-1/4 left-1/4 animate-bounce duration-1000">
           <div className="relative group">
             <div className="w-8 h-8 bg-slate-800 border border-red-500 rounded flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.4)]">
               <AlertCircle size={14} className="text-red-500" />
             </div>
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-red-500 font-mono bg-slate-900 px-1 border border-red-500/30 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
               CVE-2024-99
             </div>
           </div>
        </div>
        
        <div className="absolute bottom-1/3 right-1/4">
           <div className="w-8 h-8 bg-slate-800 border border-slate-600 rounded flex items-center justify-center group hover:border-nixGreen transition-colors">
             <Server size={14} className="text-slate-400 group-hover:text-nixGreen" />
           </div>
           <div className="text-[10px] text-green-500 mt-1 font-mono flex items-center bg-slate-800/80 px-1 rounded"><Check size={8} className="mr-1"/> Secure</div>
        </div>
      </div>
    );
  }

  if (type === 'stack') {
    return (
      <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-8">
        {styles}
        {/* Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-nixBlue shadow-[0_0_15px_#0A4A8F] animate-scan-line z-20"></div>
        
        <div className="w-full max-w-xs space-y-3 z-10 relative">
          <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
            <span>CONFIG_CHECK</span>
            <span>STATUS</span>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between bg-slate-800 p-3 rounded border-l-4 border-nixBlue group hover:bg-slate-700 transition-colors">
              <div className="flex items-center">
                <FileCheck size={16} className="text-slate-400 mr-3 group-hover:text-nixBlue transition-colors" />
                <span className="text-sm text-slate-200 font-mono">CIS_L1_Rule_{100 + i}</span>
              </div>
              <span 
                className="flex items-center text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded animate-fade-in"
                style={{ animationDelay: `${i * 400}ms` }}
              >
                <Check size={10} className="mr-1" /> PASS
              </span>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-slate-700">
             <div className="flex items-center text-xs text-slate-500 animate-pulse">
               <Terminal size={12} className="mr-2" />
               <span className="font-mono text-nixBlue">Generating audit_report_v2.pdf...</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'network') {
    return (
      <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
        {styles}
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#FFA500 1px, transparent 1px), linear-gradient(90deg, #FFA500 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* Nodes */}
        <div className="grid grid-cols-3 gap-12 relative z-10">
           {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="relative group">
               <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-all duration-500 z-10 relative bg-slate-900 ${i === 2 ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-slate-600 hover:border-nixOrange'}`}>
                 <Cpu size={20} className={i === 2 ? 'text-red-500' : 'text-slate-400 group-hover:text-nixOrange'} />
               </div>
               
               {/* Self-Healing Animation for Node 2 */}
               {i === 2 && (
                 <div className="absolute -top-3 -right-3 bg-nixOrange rounded-full p-1.5 animate-bounce shadow-lg shadow-orange-500/50 z-20">
                   <Zap size={12} className="text-white" />
                 </div>
               )}
             </div>
           ))}
        </div>
        
        {/* Connection Lines with Data Flow */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
           {/* Line 1 */}
           <path d="M110 120 L240 120 L240 180" stroke="#334155" strokeWidth="2" fill="none" />
           <path d="M110 120 L240 120 L240 180" stroke="#FFA500" strokeWidth="2" fill="none" strokeDasharray="5,10" className="animate-flow opacity-50" />
           
           {/* Line 2 */}
           <path d="M260 140 L160 260" stroke="#334155" strokeWidth="2" fill="none" />
           <path d="M260 140 L160 260" stroke="#FFA500" strokeWidth="2" fill="none" strokeDasharray="5,10" className="animate-flow opacity-50" style={{ animationDuration: '1.5s' }} />

           {/* Line 3 */}
           <path d="M380 120 L280 120" stroke="#334155" strokeWidth="2" fill="none" />
        </svg>

        <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur border border-slate-700 p-2 rounded text-xs font-mono text-nixOrange shadow-lg">
           <span className="animate-pulse">{">"} Agent_02: Auto-restart triggered</span>
        </div>
      </div>
    );
  }

  return null;
};

const Products: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO 
        title="Enterprise Security & Automation Products"
        description="Discover Nixsoft's enterprise-grade open-source automation and compliance platforms: VulnGuard for vulnerability management and SecureBench for CIS hardening."
        path="/products"
        keywords="VulnGuard, SecureBench, CIS Hardening Automation, Vulnerability Management Software, Nixsoft Products"
      />
      {/* Hero Section */}
      <section className="bg-nixDark py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-800/50 -skew-x-12 transform origin-top-right"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Enterprise-Grade <span className="text-nixBlue bg-white px-2">Frameworks</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Proprietary tools built on open-source foundations. Designed for security, compliance, and automated operations.
          </p>
        </div>
      </section>

      {/* Products Loop */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          {PRODUCTS_DATA.map((product, index) => (
            <div key={product.id} className={`flex flex-col lg:flex-row gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Text Content */}
              <div className="flex-1">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-white border shadow-sm ${
                  product.accent === 'nixGreen' ? 'text-green-600 border-green-200' : 
                  product.accent === 'nixBlue' ? 'text-blue-600 border-blue-200' : 'text-orange-600 border-orange-200'
                }`}>
                  PRODUCT / 0{index + 1}
                </div>
                <h2 className="text-4xl font-display font-bold text-slate-900 mb-2">{product.name}</h2>
                <h3 className={`text-xl font-medium mb-6 ${
                  product.accent === 'nixGreen' ? 'text-green-600' : 
                  product.accent === 'nixBlue' ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  {product.tagline}
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Features Grid */}
                <div className="mb-8">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center uppercase text-sm tracking-wide">
                    <Activity size={16} className="mr-2 text-slate-400" /> Key Features
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {product.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <Check size={18} className="text-slate-400 mr-2 mt-0.5 shrink-0" />
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deployment & Benefits */}
                <div className="grid sm:grid-cols-2 gap-8 border-t border-slate-200 pt-8">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center uppercase text-sm tracking-wide">
                      <Cloud size={16} className="mr-2 text-slate-400" /> Deployment
                    </h4>
                    <ul className="space-y-1">
                      {product.deployment.map((d, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></span> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-800 mb-3 flex items-center uppercase text-sm tracking-wide">
                      <Zap size={16} className="mr-2 text-slate-400" /> Impact
                    </h4>
                     <ul className="space-y-1">
                      {product.benefits.map((b, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <Link to="/contact" className={`inline-flex items-center font-bold hover:underline ${
                     product.accent === 'nixGreen' ? 'text-green-700' : 
                     product.accent === 'nixBlue' ? 'text-blue-700' : 'text-orange-700'
                  }`}>
                    Request {product.name.split(' ')[0]} Demo <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>

              {/* Visual Side */}
              <div className="flex-1 w-full">
                <div className="bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-500">
                  <div className="bg-slate-900 rounded-xl p-4">
                     <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
                        <span className="text-slate-400 text-xs font-mono uppercase">Architecture View</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                        </div>
                     </div>
                     <ArchitectureVisual type={product.visualType} />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-24 border-t border-gray-100">
         <div className="max-w-4xl mx-auto px-4 text-center">
           <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Built for scale. Secured by design.</h2>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/contact" className="bg-nixBlue text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20">
               Talk to an Engineer
             </Link>
             <a href="#" className="bg-slate-100 text-slate-700 px-8 py-4 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center justify-center">
               <Download size={18} className="mr-2" /> Download Product Briefs
             </a>
           </div>
         </div>
      </section>
    </div>
  );
};

export default Products;
