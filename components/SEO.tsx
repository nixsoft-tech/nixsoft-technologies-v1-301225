import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../constants';
import {
  organizationNode, websiteNode, webPageNode, breadcrumbNode,
  type JsonLdNode, type PageType,
} from '../lib/schema';

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
  /** Keep this page out of search results (e.g. the Not Found page). */
  noindex?: boolean;
  /** schema.org type of the page itself (default WebPage). */
  pageType?: PageType;
  /** The page is about the company (home, about, contact). */
  aboutOrganization?: boolean;
  /** Page-specific entities from lib/schema.ts (Service, BlogPosting, Person …). */
  entities?: JsonLdNode[];
  /** @id of the entity the page is mainly about (one of `entities`). */
  mainEntityId?: string;
  datePublished?: string;
  dateModified?: string;
  /** Person @id of the page's technical reviewer (WebPage.reviewedBy). */
  reviewedById?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  path,
  ogType = 'website',
  ogImage = `${SITE_URL}/og-image.png?v=2`,
  keywords,
  breadcrumbs,
  noindex = false,
  pageType,
  aboutOrganization,
  entities = [],
  mainEntityId,
  datePublished,
  dateModified,
  reviewedById,
}) => {
  // Short brand suffix keeps titles inside the ~60 characters Google displays.
  const fullTitle = `${title} | Nixsoft`;
  const socialTitle = `${title} | Nixsoft Technologies`;
  const canonical = path === undefined ? undefined : `${SITE_URL}${path}`;

  // One connected @graph per indexable page (see lib/schema.ts). Not-found and
  // other noindex pages get none.
  const hasBreadcrumb = !!(breadcrumbs && breadcrumbs.length > 0);
  const graph = path !== undefined && !noindex
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          organizationNode,
          websiteNode,
          webPageNode({
            path,
            name: title,
            description,
            type: pageType,
            hasBreadcrumb,
            mainEntityId,
            aboutOrganization,
            datePublished,
            dateModified,
            reviewedById,
          }),
          ...(hasBreadcrumb ? [breadcrumbNode(path, breadcrumbs!)] : []),
          ...entities,
        ],
      }
    : undefined;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, follow" />}
      {canonical && !noindex && <link rel="canonical" href={canonical} />}

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

      {graph && <script type="application/ld+json">{JSON.stringify(graph)}</script>}
    </Helmet>
  );
};

export default SEO;
