import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, SOCIAL_LINKS, ORG_ID } from '../constants';

/**
 * Sitewide structured data: the Organization only. Page-specific types
 * (WebSite on the home page, Service on offering pages, BlogPosting on posts,
 * BreadcrumbList) come from each page's <SEO jsonLd={…} />. Every value here
 * must match what the site shows (footer, contact page, About).
 */
const Schema: React.FC = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    "name": "Nixsoft Technologies",
    "alternateName": "Nixsoftech",
    "url": `${SITE_URL}/`,
    "logo": `${SITE_URL}/logo.png?v=2`,
    "foundingDate": "2019",
    "email": "sales@nixsoftech.in",
    "telephone": "+91-97698-88498",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "804, 8th Floor, IJMIMA Complex, Mindspace, Malad West",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400064",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-97698-88498",
      "email": "sales@nixsoftech.in",
      "contactType": "sales",
      "areaServed": "IN",
      "availableLanguage": "en"
    },
    "sameAs": Object.values(SOCIAL_LINKS)
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default Schema;
