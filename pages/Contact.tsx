import React, { useState } from 'react';
import { Mail, MapPin, Send, Calendar, MessageCircle, ArrowRight, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

// ─── Validation helpers ────────────────────────────────────────────────────────
function validateForm(data: typeof INITIAL_FORM): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name.trim() || data.name.trim().length < 2)
    errors.name = 'Full name must be at least 2 characters.';
  if (data.name.length > 100)
    errors.name = 'Name is too long (max 100 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Please enter a valid email address.';
  if (!/^\+?[\d\s\-().]{7,20}$/.test(data.phone))
    errors.phone = 'Please enter a valid phone number.';
  if (!data.company.trim())
    errors.company = 'Company name is required.';
  if (data.message.trim().length < 10)
    errors.message = 'Message must be at least 10 characters.';
  if (data.message.length > 2000)
    errors.message = 'Message is too long (max 2000 characters).';
  return errors;
}

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: ''
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Client-side validation before network call
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData(INITIAL_FORM);
      } else {
        setServerError('Failed to send message. Please try again later.');
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the specific field error on change
    if (fieldErrors[name]) {
      setFieldErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  return (
    <div className="flex flex-col">
      <SEO 
        title="Contact Our DevOps & IT Experts in Mumbai"
        description="Talk to Nixsoft's DevOps and IT infrastructure experts in Mumbai. Book a free consultation on managed IT, cloud, security testing or automation for your business."
        path="/contact"
        keywords="contact Nixsoft Technologies, DevOps consultation Mumbai, free IT infrastructure consultation, managed IT services enquiry"
      />
       {/* Hero / Header */}
       <section className="bg-nixDark pt-32 pb-24 px-4">
         <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Let's Build Secure &amp; Scalable Systems Together
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Ready to modernize? Connect with our enterprise architects to discuss your specific needs in DevOps, Automation, Cloud Security, or Database Reliability.
            </p>
         </div>
       </section>

       <section className="bg-white pb-24 px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
             <div className="grid lg:grid-cols-5 min-h-[600px]">

                {/* Left Column: Contact Info & Direct Actions */}
                <div className="lg:col-span-2 bg-slate-50 p-8 md:p-12 border-r border-gray-100">
                   <h3 className="text-xl font-bold text-nixBlue mb-8">Quick Connect</h3>

                   {/* Direct Channels */}
                   <div className="space-y-4 mb-10">
                      <a href="https://wa.me/919769888498" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group">
                         <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">
                               <MessageCircle size={20} />
                            </div>
                            <div className="text-left">
                               <span className="block text-xs text-slate-400 uppercase font-bold">WhatsApp Us</span>
                               <span className="font-semibold text-slate-800 group-hover:text-green-600">Start Chat</span>
                            </div>
                         </div>
                         <ArrowRight size={16} className="text-slate-300 group-hover:text-green-600 transition-colors" />
                      </a>

                      <a href="mailto:sales@nixsoftech.in" className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-nixBlue hover:shadow-md transition-all group">
                         <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 text-nixBlue rounded-full flex items-center justify-center mr-3">
                               <Mail size={20} />
                            </div>
                            <div className="text-left">
                               <span className="block text-xs text-slate-400 uppercase font-bold">Email Sales</span>
                               <span className="font-semibold text-slate-800 group-hover:text-nixBlue">sales@nixsoftech.in</span>
                            </div>
                         </div>
                         <ArrowRight size={16} className="text-slate-300 group-hover:text-nixBlue transition-colors" />
                      </a>

                      <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-nixOrange hover:shadow-md transition-all group text-left">
                         <div className="flex items-center">
                            <div className="w-10 h-10 bg-orange-100 text-nixOrange rounded-full flex items-center justify-center mr-3">
                               <Calendar size={20} />
                            </div>
                            <div className="text-left">
                               <span className="block text-xs text-slate-400 uppercase font-bold">Schedule Call</span>
                               <span className="font-semibold text-slate-800 group-hover:text-nixOrange">Book 30-min Slot</span>
                            </div>
                         </div>
                         <ArrowRight size={16} className="text-slate-300 group-hover:text-nixOrange transition-colors" />
                      </button>
                   </div>

                   {/* Location */}
                   <div className="mb-8">
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                         <MapPin size={18} className="text-nixBlue mr-2" /> HQ Location
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed ml-6">
                         804, 8th Floor, IJMIMA Complex,<br/>
                         Mindspace, Malad West,<br/>
                         Mumbai – 400064, India
                      </p>
                   </div>

                   {/* Map Embed */}
                   <div className="rounded-xl overflow-hidden h-48 border border-gray-200 shadow-sm relative bg-slate-200">
                     <iframe
                       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.665798440816!2d72.83328967498013!3d19.166104082057305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b64d0d1b1c6d%3A0x6b4f7e1b1c6d1c6d!2sIJMIMA%20Complex!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                       width="100%"
                       height="100%"
                       style={{border:0}}
                       allowFullScreen
                       loading="lazy"
                       referrerPolicy="no-referrer-when-downgrade"
                       title="Nixsoft Office Location"
                     ></iframe>
                   </div>
                </div>

                {/* Right Column: Contact Form */}
                <div className="lg:col-span-3 p-8 md:p-12 bg-white">
                   {submitted ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fade-in">
                         <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
                            <Send className="text-green-600" size={40} />
                         </div>
                         <h3 className="text-3xl font-display font-bold text-slate-900 mb-4">Request Received!</h3>
                         <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
                            Thank you for contacting Nixsoft. Our technical team has been notified and will review your requirements. You can expect a response within 24 hours.
                         </p>
                         <button onClick={() => setSubmitted(false)} className="text-nixBlue font-semibold hover:underline flex items-center">
                            Send another message <ArrowRight size={16} className="ml-1" />
                         </button>
                      </div>
                   ) : (
                      <form onSubmit={handleSubmit} noValidate className="space-y-6 h-full flex flex-col justify-center">
                         <div className="mb-6">
                            <h3 className="text-2xl font-bold text-slate-900">Send us a Message</h3>
                            <p className="text-slate-500 mt-1">Fill in the details below and we'll get back to you shortly.</p>
                         </div>

                         {/* Server-level error banner */}
                         {serverError && (
                           <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                             <AlertCircle size={16} className="shrink-0" />
                             <span>{serverError}</span>
                           </div>
                         )}

                         <div className="grid md:grid-cols-2 gap-6">
                            {/* ✅ htmlFor + id on all labels/inputs for accessibility */}
                            <div>
                               <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                               <input
                                  id="name"
                                  required
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  className={`w-full px-4 py-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-1 transition-all ${fieldErrors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-nixBlue focus:ring-nixBlue'}`}
                                  placeholder="John Doe"
                               />
                               {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                            </div>
                            <div>
                               <label htmlFor="company" className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
                               <input
                                  id="company"
                                  required
                                  type="text"
                                  name="company"
                                  value={formData.company}
                                  onChange={handleChange}
                                  className={`w-full px-4 py-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-1 transition-all ${fieldErrors.company ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-nixBlue focus:ring-nixBlue'}`}
                                  placeholder="Enterprise Ltd."
                               />
                               {fieldErrors.company && <p className="text-red-500 text-xs mt-1">{fieldErrors.company}</p>}
                            </div>
                         </div>

                         <div className="grid md:grid-cols-2 gap-6">
                            <div>
                               <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Work Email</label>
                               <input
                                  id="email"
                                  required
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  className={`w-full px-4 py-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-1 transition-all ${fieldErrors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-nixBlue focus:ring-nixBlue'}`}
                                  placeholder="john@company.com"
                               />
                               {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                            </div>
                            <div>
                               <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                               <input
                                  id="phone"
                                  required
                                  type="tel"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  className={`w-full px-4 py-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-1 transition-all ${fieldErrors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-nixBlue focus:ring-nixBlue'}`}
                                  placeholder="+91 98765 43210"
                               />
                               {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
                            </div>
                         </div>

                         <div>
                            <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Requirement / Message</label>
                            <textarea
                               id="message"
                               required
                               name="message"
                               rows={5}
                               value={formData.message}
                               onChange={handleChange}
                               className={`w-full px-4 py-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-1 transition-all resize-none ${fieldErrors.message ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-nixBlue focus:ring-nixBlue'}`}
                               placeholder="Briefly describe your infrastructure needs..."
                            ></textarea>
                            {fieldErrors.message && <p className="text-red-500 text-xs mt-1">{fieldErrors.message}</p>}
                         </div>

                         <button
                           type="submit"
                           disabled={isSubmitting}
                           className="w-full bg-nixOrange hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-orange-900/20 flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            {isSubmitting ? 'Sending Request...' : 'Request Consultation'}
                            {!isSubmitting && <ArrowRight size={20} className="ml-2" />}
                         </button>

                         <p className="text-center text-xs text-slate-400 mt-2">
                            By submitting this form, you agree to our privacy policy. We respect your inbox.
                         </p>
                      </form>
                   )}
                </div>
             </div>
          </div>
       </section>
    </div>
  );
};

export default Contact;
