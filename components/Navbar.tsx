import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 glass-effect border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <img src="/logo.svg" alt="Nixsoft Technologies" className="w-11 h-11" width={44} height={44} />
              <span className="font-display font-bold text-2xl text-nixBlue tracking-tight">
                Nixsoft<span className="text-gray-400 font-normal">ech</span>
              </span>
            </Link>
            
            {/* System Status Badge */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-green-50 border border-green-100 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">All Systems Operational</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-nixBlue font-semibold' : 'text-slate-600 hover:text-nixBlue'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="bg-nixOrange hover:bg-orange-600 text-white px-5 py-2.5 rounded-md text-sm font-semibold shadow-lg shadow-orange-200 transition-all flex items-center group"
            >
              Talk to an Expert
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-nixBlue focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-xl">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 rounded-md text-base font-medium text-slate-700 hover:text-nixBlue hover:bg-blue-50"
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center mt-4 bg-nixOrange text-white px-5 py-3 rounded-md font-bold"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
