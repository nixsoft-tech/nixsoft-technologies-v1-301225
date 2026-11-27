import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../constants';
import {
  organizationNode, websiteNode, webPageNode, breadcrumbNode,
  type JsonLdNode, type PageType,
} from '../lib/schema';

interface SEOProps {
  /** Page title without the brand; " | Nixsoft" is appended when the result fits in 60 chars. Aim for <= 50 chars. */
  title: string;
  /** Meta description. Aim for 140-160 chars. */
  description: string;
  /** Site-relative path for this route, e.g. "/about" or "/" — never a full URL. */
  path?: string;
  ogType?: string;
  ogImage?: string;
  /** Pixel size of a custom ogImage, when known (the default image is 1200×630). */
  ogImageWidth?: number;
  ogImageHeight?: number;
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

const BRAND_SUFFIX = ' | Nixsoft';
const MAX_TITLE = 60;
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png?v=2`; // 1200×630

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  path,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  ogImageWidth,
  ogImageHeight,
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
  // Google shows about 60 characters of a title. The short brand suffix is
  // added only when it still fits; a long title (e.g. a blog post's) is
  // shown whole rather than cut off mid-word.
  const fullTitle = title.length + BRAND_SUFFIX.length <= MAX_TITLE ? `${title}${BRAND_SUFFIX}` : title;
  // Social cards show the brand from og:site_name (index.html) above the
  // title, so the title itself carries no brand; X shows about 70 characters.
  const socialTitle = title;
  const isDefaultImage = ogImage === DEFAULT_OG_IMAGE;
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
      {/* max-image-preview:large lets Google Discover and Search show the large
          image (Discover's guidelines); without it they may use a thumbnail. */}
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} />
      {canonical && !noindex && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {/* Declared size must match the image: posts' featured images are not 1200×630. */}
      {isDefaultImage ? <meta property="og:image:width" content="1200" /> : ogImageWidth && <meta property="og:image:width" content={String(ogImageWidth)} />}
      {isDefaultImage ? <meta property="og:image:height" content="630" /> : ogImageHeight && <meta property="og:image:height" content={String(ogImageHeight)} />}
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
