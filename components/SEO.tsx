import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../constants';

interface SEOProps {
  title: string;
  description: string;
  /** Site-relative path for this route, e.g. "/about" or "/" — never a full URL. */
  path?: string;
  ogType?: string;
  ogImage?: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  path,
  ogType = 'website',
  ogImage = `${SITE_URL}/og-image.png`,
  keywords
}) => {
  const siteName = 'Nixsoft Technologies';
  const fullTitle = `${title} | ${siteName}`;
  const canonical = path === undefined ? undefined : `${SITE_URL}${path}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
