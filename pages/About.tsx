import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Users, Trophy, Target, 
  Code2, Database, ShieldCheck, Zap, 
  MapPin, Phone, ArrowRight, CheckCircle2,
  Globe, Server
} from 'lucide-react';
import SEO from '../components/SEO';

const EXPERTISE = [
  {
    title: 'Kubernetes & Cloud',
    icon: Cloud,
    desc: 'Architecting scalable, self-healing infrastructure on AWS, Azure, and GCP using reliable open-source orchestrators.'
  },
  {
    title: 'Database Reliability',
    icon: Database,
    desc: 'Deep expertise in PostgreSQL and MySQL tuning, high-availability clustering, and disaster recovery planning.'
  },
  {
    title: 'DevOps Automation',
    icon: Infinity,
    desc: 'End-to-end CI/CD pipelines that reduce deployment times from days to minutes while ensuring code quality.'
  },
  {
    title: 'Security Automation',
    icon: ShieldCheck,
    desc: 'Integrating security into the pipeline (DevSecOps) with automated compliance checks and vulnerability scanning.'
  },
  {
    title: 'Performance Engineering',
    icon: Zap,
    desc: ' rigorous load testing and application performance monitoring (APM) to ensure system stability under peak loads.'
  },
  {
    title: 'Managed Services',
    icon: Server,
    desc: '24/7 staff augmentation and managed support to act as an extension of your internal IT operations team.'
  }
];

// Re-importing specific icons needed for the grid that aren't in the top import if needed, 
// but Infinity/Cloud were missing in top import. Adding them now.
import { Cloud, Infinity } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO 
        title="About Our DevOps & Automation Journey"
        description="Founded in 2019, Nixsoft Technologies is Mumbai's premier DevOps consulting firm, serving Pan-Asia with open-source first infrastructure excellence."
        path="/about"
        keywords="Nixsoft Technologies, DevOps Mumbai, Open Source Consulting, IT Modernization"
      />
      {/* Hero Section */}
      <section className="bg-nixDark py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" 
             style={{ backgroundImage: 'linear-gradient(45deg, #0A4A8F 25%, transparent 25%, transparent 75%, #0A4A8F 75%, #0A4A8F), linear-gradient(45deg, #0A4A8F 25%, transparent 25%, transparent 75%, #0A4A8F 75%, #0A4A8F)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }}>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Engineering Trust Through <br/>
            <span className="text-nixGreen">Open Source Excellence</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Nixsoft Technologies is Mumbai's premier DevOps & Automation consulting firm. 
            We help enterprises scale faster, secure their assets, and reduce IT costs by up to 40%.
          </p>
        </div>
      </section>

      {/* Corporate Profile / Stats */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            <div className="p-4">
              <div className="text-4xl font-bold text-nixBlue mb-2">2019</div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Founded</p>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-nixBlue mb-2">HQ</div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Mumbai, India</p>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-nixGreen mb-2">40%</div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Avg Cost Reduction</p>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-nixBlue mb-2">50+</div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Enterprise Experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-nixBlue font-bold tracking-wide uppercase text-sm mb-2">Our Company Identity</h2>
              <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">
                The Digital Backbone for Modern Enterprises
              </h3>
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  Founded in 2019, Nixsoft Technologies (Nixsoftech) emerged with a singular mission: to democratize enterprise-grade infrastructure. We saw too many organizations trapped by expensive vendor lock-ins and fragile legacy systems.
                </p>
                <p>
                  We are an Open-Source First company. This isn't just a technical preference; it's a strategic advantage we pass on to our clients. By leveraging battle-tested open-source technologies for Kubernetes, Databases, and Security, we deliver systems that are more secure, transparent, and significantly more cost-effective than proprietary alternatives.
                </p>
                <p>
                  From our headquarters in Mumbai, we serve critical sectors including BFSI, Telecom, Manufacturing, and Retail across the Pan-Asia region.
                </p>
              </div>
              
              <div className="mt-8 flex items-center space-x-6">
                <div className="flex items-center text-slate-700 font-semibold">
                  <MapPin className="text-nixOrange mr-2" size={20} /> Mumbai, India
                </div>
                <div className="flex items-center text-slate-700 font-semibold">
                  <Globe className="text-nixBlue mr-2" size={20} /> Serving Pan-Asia
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10">
                <h4 className="text-xl font-bold text-slate-900 mb-6">Our Core Values</h4>
                <ul className="space-y-6">
                  <li className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Code2 className="text-nixBlue" size={20} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h5 className="font-bold text-slate-800">No Vendor Lock-in</h5>
                      <p className="text-sm text-slate-600 mt-1">We build on standard, portable open-source stacks that you own completely.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Zap className="text-green-600" size={20} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h5 className="font-bold text-slate-800">Ruthless Automation</h5>
                      <p className="text-sm text-slate-600 mt-1">Manual work is a bug. We automate operations to ensure consistency and speed.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Target className="text-nixOrange" size={20} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h5 className="font-bold text-slate-800">Business-Aligned IT</h5>
                      <p className="text-sm text-slate-600 mt-1">Every technical decision we make is mapped directly to a business outcome.</p>
                    </div>
                  </li>
                </ul>
              </div>
              {/* Decor element */}
              <div className="absolute top-4 -right-4 w-full h-full bg-nixBlue/5 rounded-2xl -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-nixBlue font-bold tracking-wide uppercase text-sm mb-2">Technical Capabilities</h2>
            <h3 className="text-3xl font-display font-bold text-slate-900">
              Comprehensive IT Capabilities
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EXPERTISE.map((item, idx) => (
              <div key={idx} className="group p-8 bg-slate-50 hover:bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                <item.icon size={40} className="text-nixBlue mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-nixDark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800/50 skew-x-12 transform origin-top-right"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Ready to Optimize Your Infrastructure?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Connect with our architects for a free consultation. Discover how an open-source strategy can lower your TCO.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <Link to="/contact" className="bg-nixOrange hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg shadow-orange-900/20 transition-all flex items-center">
              Get a Free Consultation <ArrowRight size={20} className="ml-2" />
            </Link>
            
            <a href="tel:+919769888498" className="flex items-center text-white font-semibold hover:text-nixGreen transition-colors">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-3">
                <Phone size={20} />
              </div>
              <div className="text-left">
                <span className="block text-xs text-slate-400 uppercase tracking-wide">Call Us Directly</span>
                <span className="text-lg">+91 97698 88498</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
