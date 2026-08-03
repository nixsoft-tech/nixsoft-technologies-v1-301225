import React from 'react';
import SEO from '../components/SEO';
import { ShieldCheck, Eye, Lock, FileText, Globe } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO 
        title="Privacy Policy"
        description="Privacy policy and data protection terms for Nixsoft Technologies. Learn how we collect, use, and protect your information."
        path="/privacy-policy"
        keywords="Privacy Policy, Data Protection, Nixsoft Privacy, Security Terms"
      />
      
      {/* Hero Section */}
      <section className="bg-nixDark py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nixBlue/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <FileText size={48} className="text-nixGreen mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Last Updated: June 26, 2026. Your privacy and trust are paramount to us at Nixsoft Technologies.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none space-y-10 text-slate-600">
            
            {/* Section 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex items-start gap-5">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-nixBlue shrink-0">
                <Globe size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
                <p className="text-sm leading-relaxed mb-3">
                  At Nixsoft Technologies, we collect information to provide better services to our clients. This includes:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-2">
                  <li><strong>Personal Information:</strong> Name, business email, contact number, and organization name when you fill out quote requests or contact forms.</li>
                  <li><strong>Chatbot Conversations:</strong> Transcript logs of your interactions with our AI assistant (NixBot) are recorded to assist with technical queries and optimize our support flow.</li>
                  <li><strong>Technical Data:</strong> Browser type, operating system, IP address, and site usage statistics collected automatically via cookies to improve site performance.</li>
                </ul>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex items-start gap-5">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-nixGreen shrink-0">
                <Eye size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
                <p className="text-sm leading-relaxed mb-3">
                  We use the information gathered solely for:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-2">
                  <li>Responding to quotes, technical inquiries, and scheduling consultations.</li>
                  <li>Processing chat transcripts to handle customer support inquiries (with transcripts automatically purged from our servers after 90 days).</li>
                  <li>Analyzing website traffic patterns and optimizing your user experience.</li>
                  <li>Sending company updates, newsletters, or technical bulletins (you may opt-out at any time).</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex items-start gap-5">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-nixOrange shrink-0">
                <Lock size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">3. Data Protection & Security</h2>
                <p className="text-sm leading-relaxed">
                  We incorporate robust security measures to shield your data from unauthorized access, alteration, or disclosure. As an open-source first infrastructure and security provider, we implement TLS encryption on our server terminals, utilize secure cloud configurations, and strictly limit access to personal data to authorized administrative personnel only.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex items-start gap-5">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">4. Third-Party Sharing</h2>
                <p className="text-sm leading-relaxed">
                  We do not sell, trade, or transfer your personal data to outside parties. This does not include trusted partners who assist us in operating our website or servicing clients, provided those parties agree to keep all information strictly confidential.
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="pt-8 border-t border-slate-100 text-center">
              <h3 className="font-bold text-slate-900 mb-2">Have questions about our Privacy Policy?</h3>
              <p className="text-sm mb-4">Feel free to reach out to our data compliance team.</p>
              <a href="mailto:info@nixsoftech.in" className="inline-block bg-nixBlue text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-900 transition-colors">
                Contact Privacy Team
              </a>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
