import React from 'react';
import { Linkedin, Twitter, Github, Mail, MapPin, Phone, Landmark, RadioTower, ShoppingBag, Factory } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-nixDark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 border-b border-slate-800 pb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.svg" alt="Nixsoft Technologies" className="w-10 h-10" width={40} height={40} />
              <span className="font-display font-bold text-xl tracking-tight">Nixsoftech</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering enterprises with open-source automation, cloud scalability, and military-grade security.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-nixOrange transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-nixOrange transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-nixOrange transition-colors"><Github size={20} /></a>
            </div>
          </div>

          {/* Services & Solutions */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4 text-nixGreen">Services</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/services/devops-services" className="hover:text-white transition-colors">DevOps Services</Link></li>
              <li><Link to="/services/cloud-management-services" className="hover:text-white transition-colors">Cloud Management</Link></li>
              <li><Link to="/services/security-testing" className="hover:text-white transition-colors">Security Testing (VAPT)</Link></li>
              <li><Link to="/services/infrastructure-monitoring" className="hover:text-white transition-colors">Infrastructure Monitoring</Link></li>
              <li><Link to="/services/it-managed-services" className="hover:text-white transition-colors">IT Managed Services</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors font-medium text-slate-300">View all services →</Link></li>
            </ul>
            <h4 className="font-display font-semibold text-lg mt-6 mb-4 text-nixGreen">Solutions</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/solutions/asset-management" className="hover:text-white transition-colors">Asset Management</Link></li>
              <li><Link to="/solutions/email-collaboration" className="hover:text-white transition-colors">Email & Collaboration</Link></li>
              <li><Link to="/solutions/ticketing-system" className="hover:text-white transition-colors">Ticketing System</Link></li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4 text-nixGreen">Industries</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/industries/bfsi" className="hover:text-white transition-colors flex items-center"><Landmark size={16} className="mr-2 text-slate-500" /> BFSI</Link></li>
              <li><Link to="/industries/telecom" className="hover:text-white transition-colors flex items-center"><RadioTower size={16} className="mr-2 text-slate-500" /> Telecom</Link></li>
              <li><Link to="/industries/retail" className="hover:text-white transition-colors flex items-center"><ShoppingBag size={16} className="mr-2 text-slate-500" /> Retail</Link></li>
              <li><Link to="/industries/manufacturing" className="hover:text-white transition-colors flex items-center"><Factory size={16} className="mr-2 text-slate-500" /> Manufacturing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4 text-nixGreen">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/clients" className="hover:text-white transition-colors">Clients</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4 text-nixGreen">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-1 text-nixBlue shrink-0" />
                <span>804, 8th Floor, IJMIMA Complex,<br />Mindspace, Malad West,<br />Mumbai – 400064, India</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-nixBlue shrink-0" />
                <a href="mailto:sales@nixsoftech.in" className="hover:text-white">sales@nixsoftech.in</a>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-nixBlue shrink-0" />
                <span>+91 97698 88498</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 text-center text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2025 Nixsoft Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="mt-2 md:mt-0">ISO 27001 Certified | CMMI Level 3</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;