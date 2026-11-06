import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import SEO from '../components/SEO';

/**
 * Website terms of use. Drafted 6 Nov 2026 as standard terms for a B2B
 * services website; have them reviewed by Nixsoft's legal adviser. Services
 * themselves are governed by each client's signed agreement / SOW, not by
 * these terms. Keep "Last updated" and the sitemap <lastmod> in step.
 */
const LAST_UPDATED = '6 November 2026';

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: 'Acceptance of these terms',
    body: (
      <p>
        These terms govern your use of nixsoftech.in and its pages (the “website”), operated by Nixsoft
        Technologies Pvt. Ltd. (“Nixsoft”, “we”, “us”). By using the website you agree to these terms. If you
        do not agree, please do not use the website.
      </p>
    ),
  },
  {
    title: 'Information on this website',
    body: (
      <>
        <p>
          The website describes our services, solutions and products for general information. It is not
          professional advice for your specific environment, and it is not an offer to contract.
        </p>
        <p>
          Any services we provide are governed by a separate written agreement, proposal or statement of work
          signed with you. If anything on the website conflicts with such an agreement, the agreement prevails.
        </p>
      </>
    ),
  },
  {
    title: 'Using the website',
    body: (
      <>
        <p>You agree to use the website lawfully and not to:</p>
        <ul>
          <li>attempt to gain unauthorised access to the website, its servers or any connected system;</li>
          <li>interfere with its operation, including by overloading it or introducing malicious code;</li>
          <li>submit false, misleading or unlawful information through our forms or chat;</li>
          <li>use the website to send unsolicited or bulk messages.</li>
        </ul>
        <p>Our forms use spam and abuse protection; we may block traffic that misuses the website.</p>
      </>
    ),
  },
  {
    title: 'Intellectual property',
    body: (
      <p>
        The content of the website, including text, graphics, the Nixsoft name and logo, and product names
        such as VulnGuard™, belongs to Nixsoft or its licensors. You may view, print and share pages for your
        own reference, with attribution. Any other reproduction or commercial use needs our written permission.
        Third-party names, logos and trademarks shown on the website belong to their respective owners.
      </p>
    ),
  },
  {
    title: 'Enquiries and your information',
    body: (
      <p>
        Information you send us through the website (contact forms, the audit request, the chat assistant or
        email) is handled as described in our <Link to="/privacy-policy">Privacy Policy</Link>.
      </p>
    ),
  },
  {
    title: 'Third-party services and links',
    body: (
      <p>
        The website links to or uses services run by others, such as Calendly for booking calls, WhatsApp,
        Google Maps, Google Analytics and our social media pages. Their own terms and privacy policies apply
        when you use them, and we are not responsible for their content or availability.
      </p>
    ),
  },
  {
    title: 'Availability and accuracy',
    body: (
      <p>
        We work to keep the website accurate and available, but it is provided “as is”. We do not guarantee
        that it will be uninterrupted or error-free, and we may change or remove content at any time without
        notice.
      </p>
    ),
  },
  {
    title: 'Limitation of liability',
    body: (
      <p>
        To the extent permitted by law, Nixsoft is not liable for any indirect or consequential loss, or any
        loss of data, profit or business, arising from your use of the website or reliance on its content.
        Nothing in these terms limits liability that cannot be limited under applicable law.
      </p>
    ),
  },
  {
    title: 'Changes to these terms',
    body: (
      <p>
        We may update these terms from time to time. The “Last updated” date above shows the current version;
        continued use of the website after a change means you accept the updated terms.
      </p>
    ),
  },
  {
    title: 'Governing law',
    body: (
      <p>
        These terms are governed by the laws of India. The courts at Mumbai, Maharashtra have jurisdiction
        over any dispute arising from them or from your use of the website.
      </p>
    ),
  },
  {
    title: 'Contact us',
    body: (
      <p>
        Questions about these terms? <Link to="/contact">Contact us</Link> or email{' '}
        <span className="font-semibold text-slate-800">info@nixsoftech.in</span>. Nixsoft Technologies Pvt.
        Ltd., 804, 8th Floor, IJMIMA Complex, Mindspace, Malad West, Mumbai – 400064, India.
      </p>
    ),
  },
];

const Terms: React.FC = () => (
  <div className="flex flex-col">
    <SEO
      title="Terms and Conditions"
      description="Terms and conditions for using the Nixsoft Technologies website: use of content, enquiries, third-party services, liability and governing law."
      path="/terms-and-conditions"
      keywords="Nixsoft terms and conditions, website terms of use"
    />

    <section className="bg-nixDark py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-nixBlue/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <FileText size={48} className="text-nixGreen mx-auto mb-4" aria-hidden="true" />
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Terms and Conditions</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">Last updated: {LAST_UPDATED}</p>
      </div>
    </section>

    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none prose-a:text-nixBlue prose-headings:font-display">
          {SECTIONS.map((s, i) => (
            <section key={s.title} className="mb-10">
              <h2 className="text-xl font-bold text-slate-900">{i + 1}. {s.title}</h2>
              {s.body}
            </section>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Terms;
