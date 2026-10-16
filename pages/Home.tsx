import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Database, Cloud, Infinity, 
  Terminal, Server, Users, BarChart3, ChevronRight,
  Code2, Zap, Lock, CheckCircle2, Cpu
} from 'lucide-react';
import { SERVICES, INDUSTRIES, PRODUCTS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import TerminalSimulator from '../components/TerminalSimulator';
import SEO from '../components/SEO';

const data = [
  { name: 'Traditional IT', efficiency: 40, cost: 100 },
  { name: 'Nixsoft Ops', efficiency: 95, cost: 60 },
];

const TECH_STACK = [
  "Kubernetes", "Terraform", "Docker", "Ansible", "Prometheus", "Grafana", "Vault", "Python", "PostgreSQL", "Jenkins"
];

const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-nixAbyss">
    <style>{`
      @keyframes grid-move {
        0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
        100% { transform: perspective(500px) rotateX(60deg) translateY(60px); }
      }
      @keyframes float-particle {
        0% { transform: translateY(100vh) scale(0); opacity: 0; }
        20% { opacity: 0.6; }
        100% { transform: translateY(-20vh) scale(1); opacity: 0; }
      }
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(1.1); }
      }
      @keyframes beam-scan {
        0% { top: -100%; opacity: 0; }
        50% { opacity: 0.5; }
        100% { top: 200%; opacity: 0; }
      }
    `}</style>

    {/* Base Gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-nixSky/25 via-nixNavy to-nixAbyss z-0"></div>

    {/* Moving Perspective Grid (Floor) */}
    <div className="absolute inset-0 flex items-center justify-center opacity-20 transform-gpu z-0">
       <div 
         className="absolute w-[200%] h-[200%] -top-[40%] -left-[50%]"
         style={{
           backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.4) 1px, transparent 1px)',
           backgroundSize: '60px 60px',
           animation: 'grid-move 3s linear infinite',
         }}
       ></div>
    </div>

    {/* Vertical Data Lanes */}
    <div className="absolute inset-0 w-full h-full z-0 opacity-20">
        <div className="absolute left-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-nixSky to-transparent"></div>
        <div className="absolute left-[35%] w-[1px] h-full bg-gradient-to-b from-transparent via-nixSky to-transparent"></div>
        <div className="absolute right-[35%] w-[1px] h-full bg-gradient-to-b from-transparent via-nixSky to-transparent"></div>
        <div className="absolute right-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-nixSky to-transparent"></div>
    </div>

    {/* Floating Particles (Automation Nodes) */}
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-nixSky shadow-[0_0_8px_#38BDF8]"
        style={{
          width: Math.random() * 3 + 1 + 'px',
          height: Math.random() * 3 + 1 + 'px',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animation: `float-particle ${Math.random() * 15 + 10}s linear infinite`,
          animationDelay: `-${Math.random() * 20}s`,
          opacity: 0
        }}
      ></div>
    ))}

    {/* Ambient Glows */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] bg-nixSky/25 rounded-full blur-[120px] animate-[pulse-glow_8s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[10%] right-[20%] w-[25vw] h-[25vw] bg-nixSky/10 rounded-full blur-[100px] animate-[pulse-glow_10s_ease-in-out_infinite_reverse]"></div>
    </div>
  </div>
);

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setEmail('');
  };

  return (
    <div className="flex flex-col">
      <SEO 
        title="Open-Source DevOps & Managed IT Services in India"
        description="Nixsoft Technologies is a Mumbai-based DevOps and managed IT services company helping enterprises automate, secure and scale infrastructure with open source."
        path="/"
        keywords="DevOps and managed IT services company in India, DevOps consulting company in Mumbai, open-source infrastructure automation, 24x7 managed IT support, Kubernetes consulting"
      />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-nixNavy overflow-hidden pt-20">
        <HeroBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-slate-800/50 rounded-full px-4 py-1.5 border border-slate-700 backdrop-blur-sm shadow-lg">
                <span className="w-2 h-2 bg-nixGreen rounded-full animate-pulse"></span>
                <span className="text-nixGreen text-xs font-semibold tracking-wide uppercase">Open Source First</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight">
                Open-Source <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nixGreen to-blue-400">Automation</span> & <br/>
                DevOps Consulting & Training
              </h1>
              
              <div className="space-y-4">
                <p className="text-xl font-medium text-blue-200">
                  Cloud • Security • Automation • Managed Services
                </p>
                <p className="text-lg text-slate-300/90 max-w-lg leading-relaxed">
                  We help Pan-Asia enterprises modernize infrastructure, secure endpoints, and automate operations using battle-tested open-source technologies.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/contact" className="bg-nixOrange hover:bg-orange-600 text-white text-center px-8 py-4 rounded-lg font-bold text-lg shadow-lg shadow-orange-900/20 transition-all hover:-translate-y-1">
                  Talk to an Expert
                </Link>
                <Link to="/services" className="bg-white/5 border border-white/20 hover:bg-white/10 text-white text-center px-8 py-4 rounded-lg font-semibold text-lg transition-all backdrop-blur-sm">
                  Explore Services
                </Link>
              </div>

              <div className="pt-8 border-t border-slate-700/50 flex flex-wrap gap-6 text-slate-400 text-sm font-medium">
                <span className="flex items-center"><ShieldCheck size={16} className="mr-2 text-nixGreen"/> ISO 27001</span>
                <span className="flex items-center"><Server size={16} className="mr-2 text-nixGreen"/> 99.99% Uptime</span>
                <span className="flex items-center"><Users size={16} className="mr-2 text-nixGreen"/> 50+ Enterprise Clients</span>
              </div>
            </div>

            {/* Hero Visual/Graphic */}
            <div className="hidden md:block relative transform rotate-1 hover:rotate-0 transition-all duration-700">
               <TerminalSimulator />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Ticker (Trust Indicators) */}
      <div className="bg-nixAbyss border-b border-nixSky/20 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <span className="text-slate-500 text-sm font-semibold mr-8 whitespace-nowrap hidden md:block">POWERING ENTERPRISES WITH:</span>
          <div className="flex space-x-12 opacity-50 animate-pulse">
            {TECH_STACK.map((tech) => (
              <span key={tech} className="text-slate-300 font-mono text-sm font-medium uppercase tracking-wider">{tech}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-nixBlue font-bold tracking-wide uppercase text-sm mb-2">Our DevOps & Automation Services</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">
              Managed IT, DevOps &amp; Cloud Services for Enterprises
            </h3>
            <p className="text-slate-600 text-lg">
              We bridge the gap between development agility and operational stability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service) => (
              <div key={service.id} className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl hover:border-nixBlue/30 transition-all duration-300 hover:-translate-y-2">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-nixBlue mb-6 group-hover:bg-nixBlue group-hover:text-white transition-colors">
                  {service.iconName === 'Infinity' && <Infinity size={28} />}
                  {service.iconName === 'Cloud' && <Cloud size={28} />}
                  {service.iconName === 'ShieldCheck' && <ShieldCheck size={28} />}
                  {service.iconName === 'Database' && <Database size={28} />}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
                <p className="text-slate-500 leading-relaxed mb-4">{service.description}</p>
                <Link to={`/services/${service.slug}`} className="text-nixBlue font-semibold flex items-center text-sm group-hover:underline">
                  Learn more <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product: VulnGuard */}
      <section className="py-20 bg-nixNavy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-nixSky/10 skew-x-12 transform origin-top-right"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-nixGreen/20 text-nixGreen text-xs font-bold px-3 py-1 rounded-full mb-4 border border-nixGreen/30">
                FEATURED PRODUCT
              </div>
              <h2 className="text-4xl font-display font-bold text-white mb-4">
                VulnGuard<span className="text-nixGreen">™</span>
              </h2>
              <p className="text-xl text-blue-100 mb-8 font-light">
                Automated vulnerability management for the modern hybrid cloud. Stop chasing false positives.
              </p>
              
              <ul className="space-y-4 mb-8">
                {PRODUCTS.find(p => p.id === 'vulnguard')?.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-slate-300">
                    <CheckCircle2 className="text-nixGreen mr-3" size={20} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/products/vulnguard" className="inline-flex items-center bg-white text-nixDark px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Request Demo <ChevronRight size={18} className="ml-2" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800 rounded-xl p-1 border border-slate-700 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-900 rounded-lg p-6 h-80 flex flex-col relative overflow-hidden">
                   {/* Fake UI */}
                   <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                      <span className="text-xs text-slate-500">VulnGuard v2.4.0</span>
                      <div className="flex space-x-2">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                         <span className="text-xs text-green-500">Scanning Active</span>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded">
                        <div className="flex items-center">
                          <Lock size={16} className="text-red-400 mr-3" />
                          <div>
                            <p className="text-sm text-slate-200">CVE-2024-3094</p>
                            <p className="text-xs text-slate-500">Critical • sshd-liblzma</p>
                          </div>
                        </div>
                        <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20">Patched</span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded">
                        <div className="flex items-center">
                          <Cpu size={16} className="text-yellow-400 mr-3" />
                          <div>
                            <p className="text-sm text-slate-200">Misconfigured S3 Bucket</p>
                            <p className="text-xs text-slate-500">High • prod-assets-log</p>
                          </div>
                        </div>
                        <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded border border-yellow-500/20">Auto-Remediated</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Nixsoft (Enhanced Section) */}
      <section className="py-32 bg-slate-50 relative border-t border-slate-200">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="text-nixBlue font-bold tracking-wide uppercase text-sm mb-3">The Nixsoft Advantage</h2>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">
                    Why Choose Our Open-Source Consulting
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                    We replace expensive, black-box proprietary software with transparent, scalable, and community-audited open-source alternatives.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                {/* Left Column: Differentiators */}
                <div className="lg:col-span-7 space-y-12">
                    {/* Item 1 */}
                    <div className="flex flex-col sm:flex-row gap-6 group">
                         <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/5 border border-blue-50 group-hover:scale-110 transition-transform duration-300">
                                <Code2 className="text-nixBlue" size={32} />
                            </div>
                         </div>
                         <div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-nixBlue transition-colors">No Vendor Lock-in</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Proprietary platforms hold your data hostage. We build on standard, portable open-source stacks (Kubernetes, Postgres, Linux) that you own completely.
                            </p>
                         </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex flex-col sm:flex-row gap-6 group">
                         <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/5 border border-green-50 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="text-nixGreen" size={32} />
                            </div>
                         </div>
                         <div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-nixGreen transition-colors">Automation-First Approach</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Manual operations are a security risk. From intelligent CI/CD pipelines to self-healing AI agents, we automate operational toil to zero.
                            </p>
                         </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex flex-col sm:flex-row gap-6 group">
                         <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/5 border border-orange-50 group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck className="text-nixOrange" size={32} />
                            </div>
                         </div>
                         <div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-nixOrange transition-colors">Security by Design</h4>
                            <p className="text-slate-600 leading-relaxed">
                                We embed CIS Benchmarks, Zero Trust architecture, and automated VAPT into every layer of your stack, not as an afterthought.
                            </p>
                         </div>
                    </div>
                </div>

                {/* Right Column: Chart */}
                <div className="lg:col-span-5 relative">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
                     
                     <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-nixGreen to-nixBlue"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="text-lg font-bold text-slate-800">Business Impact</h4>
                                <p className="text-sm text-slate-500">Client average post-implementation</p>
                            </div>
                            <BarChart3 className="text-slate-300" size={24} />
                        </div>
                        
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                barSize={32}
                            >
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={100} 
                                    tick={{fontSize: 11, fill: '#64748b', fontWeight: 600}} 
                                    interval={0}
                                />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}} 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                                />
                                <Bar dataKey="efficiency" name="Deployment Speed" fill="#39FF14" radius={[0, 4, 4, 0]} animationDuration={1500} />
                                <Bar dataKey="cost" name="Cost Savings" fill="#0A4A8F" radius={[0, 4, 4, 0]} animationDuration={1500} />
                            </BarChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-6 flex items-center justify-between text-xs text-slate-400 border-t border-gray-100 pt-4">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded bg-nixGreen mr-2"></span> Deployment Speed
                            </div>
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded bg-nixBlue mr-2"></span> Cost Efficiency
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 bg-nixBlue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold mb-12">Trusted Across Critical Industries</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {INDUSTRIES.map((ind) => (
              <Link key={ind.name} to={`/industries/${ind.slug}`} className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                 <h3 className="font-bold text-xl text-nixGreen mb-2">{ind.name}</h3>
                 <p className="text-sm text-blue-100">{ind.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 bg-slate-50 p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">
              Get Your Free Infrastructure Audit
            </h2>
            <p className="text-lg text-slate-600">
              Discover hidden vulnerabilities and cost-saving opportunities in your current stack.
            </p>
          </div>
          
          <form onSubmit={handleLeadSubmit} className="max-w-md mx-auto">
            {isSubmitted ? (
              <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center font-semibold animate-fade-in">
                Thank you! Our team will be in touch shortly.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your work email" 
                  className="flex-1 px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-nixBlue focus:ring-1 focus:ring-nixBlue"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="bg-nixOrange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap">
                  Get Started
                </button>
              </div>
            )}
            <p className="text-center text-xs text-slate-400 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;