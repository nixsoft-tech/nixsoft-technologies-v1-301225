import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../constants';

const Schema: React.FC = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nixsoft Technologies",
    "alternateName": "Nixsoftech",
    "url": `${SITE_URL}/`,
    "logo": `${SITE_URL}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-97698-88498",
      "contactType": "sales",
      "areaServed": "IN",
      "availableLanguage": "en"
    },
    "sameAs": [
      "https://www.linkedin.com/company/nixsoft-technologies"
    ]
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "DevOps & Automation Consulting",
    "provider": {
      "@type": "Organization",
      "name": "Nixsoft Technologies"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "description": "Enterprise-grade open-source automation, DevOps consulting, and cloud security services."
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(servicesSchema)}
      </script>
    </Helmet>
  );
};

export default Schema;
