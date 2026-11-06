import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../constants';

interface SEOProps {
  /** Page title without the brand; " | Nixsoft" is appended. Aim for <= 50 chars. */
  title: string;
  /** Meta description. Aim for 140-160 chars. */
  description: string;
  /** Site-relative path for this route, e.g. "/about" or "/" — never a full URL. */
  path?: string;
  ogType?: string;
  ogImage?: string;
  keywords?: string;
  /** Breadcrumb trail after Home, e.g. [{ name: 'Services', path: '/services' }, …]. */
  breadcrumbs?: { name: string; path: string }[];
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  path,
  ogType = 'website',
  ogImage = `${SITE_URL}/og-image.png`,
  keywords,
  breadcrumbs,
}) => {
  // Short brand suffix keeps titles inside the ~60 characters Google displays.
  const fullTitle = `${title} | Nixsoft`;
  const socialTitle = `${title} | Nixsoft Technologies`;
  const canonical = path === undefined ? undefined : `${SITE_URL}${path}`;

  const breadcrumbLd = breadcrumbs && breadcrumbs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [{ name: 'Home', path: '/' }, ...breadcrumbs].map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          item: `${SITE_URL}${crumb.path}`,
        })),
      }
    : undefined;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {breadcrumbLd && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
