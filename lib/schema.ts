/**
 * Structured data (schema.org JSON-LD) for the whole site, in one place.
 *
 * Every indexable page emits ONE JSON-LD block with an @graph (built by
 * components/SEO.tsx) containing:
 *   Organization  https://nixsoftech.in/#organization  (same node on every page)
 *   WebSite       https://nixsoftech.in/#website
 *   WebPage       <page url>#webpage   (or AboutPage / ContactPage / CollectionPage / ProfilePage)
 *   BreadcrumbList <page url>#breadcrumb  (sub-pages)
 *   + the page's main entity, from the helpers below:
 *     Service <url>#service, SoftwareApplication <url>#software,
 *     BlogPosting <url>#article, Person /team/<slug>#person, ItemList <url>#list
 * Nodes reference each other by @id, so search engines see one connected graph.
 *
 * RULE: only facts that are visible on the site and verified. No prices,
 * ratings, reviews, certifications or compliance claims. Fields still to be
 * confirmed are listed in VERIFY_BEFORE_ADDING below and are NOT emitted.
 */
import { SITE_URL, ORG_ID, SOCIAL_LINKS } from '../constants';
import type { OfferingData } from '../types';
import type { ProductData } from '../data/products';
import type { IndustryData } from '../data/industries';
import { teamPath, type TeamMember } from '../data/team';

export type JsonLdNode = Record<string, unknown>;

export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;

/** Absolute URL for a site path ("/" stays "/"). */
export const absUrl = (path: string): string =>
  /^https?:\/\//.test(path) ? path : `${SITE_URL}${path === '/' ? '/' : path}`;

export const pageId = (path: string) => `${absUrl(path)}#webpage`;
export const breadcrumbId = (path: string) => `${absUrl(path)}#breadcrumb`;
export const serviceId = (path: string) => `${absUrl(path)}#service`;
export const softwareId = (path: string) => `${absUrl(path)}#software`;
export const articleId = (path: string) => `${absUrl(path)}#article`;
export const listId = (path: string) => `${absUrl(path)}#list`;
/** A director's Person @id lives on their profile page (/team/<slug>). */
export const personId = (member: Pick<TeamMember, 'id'>) => `${absUrl(teamPath(member))}#person`;

const ref = (id: string) => ({ '@id': id });

/** A Service defined on another page: @id plus enough to identify it here. */
const serviceStub = (path: string, name: string) => ({
  '@type': 'Service', '@id': serviceId(path), name, url: absUrl(path),
});
const INDIA = { '@type': 'Country', name: 'India' };

/**
 * Not emitted until confirmed (see the schema audit, Cowork 11_):
 * - legalName: the company register may list "P. S. Nixsoft Technologies
 *   Private Limited" (CIN U74999MH2019PTC321004, per third-party registries);
 *   the footer says "Nixsoft Technologies Pvt. Ltd.". Check on mca.gov.in.
 * - identifier (CIN) and the registered-office address, from the same check.
 * - founder: the site calls Wajid and Pravin "Director", not founders.
 */

/** The company. Values match the footer, /contact and /about. */
export const organizationNode: JsonLdNode = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Nixsoft Technologies',
  alternateName: 'Nixsoftech',
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    '@id': LOGO_ID,
    url: `${SITE_URL}/logo.png?v=2`,
    contentUrl: `${SITE_URL}/logo.png?v=2`,
    width: 512,
    height: 512,
    caption: 'Nixsoft Technologies',
  },
  image: ref(LOGO_ID),
  description:
    'Mumbai-based DevOps and IT infrastructure company, founded in 2019, providing managed IT, DevOps, cloud, monitoring, database, testing and security services with open-source tools.',
  foundingDate: '2019',
  email: 'sales@nixsoftech.in',
  telephone: '+91-97698-88498',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '804, 8th Floor, IJMIMA Complex, Mindspace, Malad West',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    postalCode: '400064',
    addressCountry: 'IN',
  },
  areaServed: INDIA,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-97698-88498',
    email: 'sales@nixsoftech.in',
    contactType: 'sales',
    areaServed: 'IN',
    availableLanguage: ['en'],
  },
  knowsAbout: [
    'DevOps', 'Managed IT services', 'IT operations and NOC', 'Cloud management',
    'Infrastructure monitoring', 'Application performance monitoring',
    'Database administration', 'PostgreSQL', 'MySQL', 'Middleware administration',
    'Test automation', 'Performance testing', 'Security testing (VAPT)',
    'Robotic process automation', 'Open-source software',
  ],
  sameAs: Object.values(SOCIAL_LINKS),
};

export const websiteNode: JsonLdNode = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: 'Nixsoft Technologies',
  alternateName: 'Nixsoftech',
  inLanguage: 'en-IN',
  publisher: ref(ORG_ID),
};

export type PageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'ProfilePage';

export function webPageNode(opts: {
  path: string;
  name: string;
  description: string;
  type?: PageType;
  hasBreadcrumb?: boolean;
  mainEntityId?: string;
  /** The page is about the company itself (home, about, contact). */
  aboutOrganization?: boolean;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  reviewedById?: string;
}): JsonLdNode {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': pageId(opts.path),
    url: absUrl(opts.path),
    name: opts.name,
    description: opts.description,
    inLanguage: 'en-IN',
    isPartOf: ref(WEBSITE_ID),
    publisher: ref(ORG_ID),
    ...(opts.aboutOrganization && { about: ref(ORG_ID) }),
    ...(opts.hasBreadcrumb && { breadcrumb: ref(breadcrumbId(opts.path)) }),
    ...(opts.mainEntityId && { mainEntity: ref(opts.mainEntityId) }),
    ...(opts.image && { primaryImageOfPage: { '@type': 'ImageObject', url: absUrl(opts.image) } }),
    ...(opts.datePublished && { datePublished: opts.datePublished }),
    ...(opts.dateModified && { dateModified: opts.dateModified }),
    ...(opts.reviewedById && { reviewedBy: ref(opts.reviewedById) }),
  };
}

export function breadcrumbNode(path: string, crumbs: { name: string; path: string }[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId(path),
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  };
}

/** ItemList for hub pages (/services, /blog …): the cards shown, in order. */
export function itemListNode(path: string, items: { name: string; path: string }[]): JsonLdNode {
  return {
    '@type': 'ItemList',
    '@id': listId(path),
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: absUrl(it.path),
    })),
  };
}

/** Service for a /services/<slug> or /solutions/<slug> page. */
export function offeringServiceNode(
  offering: OfferingData,
  basePath: '/services' | '/solutions',
  opts: { category?: string; related?: OfferingData[] } = {},
): JsonLdNode {
  const path = `${basePath}/${offering.slug}`;
  return {
    '@type': 'Service',
    '@id': serviceId(path),
    name: offering.title,
    serviceType: offering.title,
    description: offering.overview,
    url: absUrl(path),
    mainEntityOfPage: ref(pageId(path)),
    provider: ref(ORG_ID),
    areaServed: INDIA,
    ...(opts.category && { category: opts.category }),
    ...(offering.whatWeDo?.length && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `What's included: ${offering.title}`,
        itemListElement: offering.whatWeDo.map((item) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: item },
        })),
      },
    }),
    ...(opts.related?.length && {
      isRelatedTo: opts.related.map((r) => serviceStub(`${basePath}/${r.slug}`, r.title)),
    }),
  };
}

/**
 * Industry page (/industries/<slug>): the industry-focused service, aimed at
 * that business audience and linked to the services and products the page
 * shows. The page's compliance badges are deliberately NOT included.
 */
export function industryServiceNode(
  industry: IndustryData,
  relatedServices: Pick<OfferingData, 'slug' | 'title'>[],
): JsonLdNode {
  const path = `/industries/${industry.slug}`;
  return {
    '@type': 'Service',
    '@id': serviceId(path),
    name: industry.metaTitle,
    serviceType: `IT infrastructure services for ${industry.fullName}`,
    description: industry.summary,
    url: absUrl(path),
    mainEntityOfPage: ref(pageId(path)),
    provider: ref(ORG_ID),
    areaServed: INDIA,
    audience: { '@type': 'BusinessAudience', audienceType: industry.fullName },
    ...(relatedServices.length && {
      isRelatedTo: relatedServices.map((s) => serviceStub(`/services/${s.slug}`, s.title)),
    }),
  };
}

/** Product page (/products/<slug>). No offers, ratings or OS claims. */
export function productSoftwareNode(product: ProductData): JsonLdNode {
  const path = `/products/${product.slug}`;
  return {
    '@type': 'SoftwareApplication',
    '@id': softwareId(path),
    name: product.name,
    description: product.description,
    url: absUrl(path),
    mainEntityOfPage: ref(pageId(path)),
    applicationCategory: 'SecurityApplication',
    featureList: product.features,
    publisher: ref(ORG_ID),
    creator: ref(ORG_ID),
  };
}

/** A director (/about and their profile page /team/<slug>). */
export function personNode(member: TeamMember): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': personId(member),
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    image: absUrl(member.photo),
    email: member.email,
    url: absUrl(teamPath(member)),
    worksFor: ref(ORG_ID),
    knowsAbout: member.focus,
    ...(member.sameAs?.length && { sameAs: member.sameAs }),
  };
}

/**
 * A blog post (/blog/<slug>), typed as both Article and BlogPosting
 * (BlogPosting is schema.org's Article subtype for blog posts; Google reports
 * either under "Articles"). Properties follow Google's Article guidelines:
 * headline, image with size, dates, author and publisher. Author and publisher
 * reference the Organization / Person defined once in the same @graph, so the
 * page declares each entity only once.
 */
export function blogPostingNode(post: {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  wordCount?: number;
  author: string;
  category?: string;
  datePublished?: string;
  dateModified?: string;
}, author?: TeamMember): JsonLdNode {
  const path = `/blog/${post.slug}`;
  return {
    '@type': ['Article', 'BlogPosting'],
    '@id': articleId(path),
    headline: post.title,
    description: post.excerpt,
    url: absUrl(path),
    mainEntityOfPage: ref(pageId(path)),
    isPartOf: ref(pageId(path)),
    image: {
      '@type': 'ImageObject',
      url: post.image,
      contentUrl: post.image,
      ...(post.imageWidth && post.imageHeight && { width: post.imageWidth, height: post.imageHeight }),
    },
    thumbnailUrl: post.image,
    ...(post.datePublished && { datePublished: post.datePublished }),
    ...(post.dateModified && { dateModified: post.dateModified }),
    ...(post.category && { articleSection: post.category }),
    ...(post.wordCount && { wordCount: post.wordCount }),
    inLanguage: 'en-IN',
    // Posts are bylined "Nixsoft Team" (the company) unless a named author is passed.
    // The Person node must also be in the page's graph when an author is set.
    author: ref(author ? personId(author) : ORG_ID),
    publisher: ref(ORG_ID),
    copyrightHolder: ref(ORG_ID),
  };
}
