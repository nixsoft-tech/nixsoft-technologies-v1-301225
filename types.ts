import type { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'DevOps' | 'Cloud' | 'Security' | 'Database';
  slug: string;
}

/** Category groupings for the Services overview page. */
export type ServiceCategoryId =
  | 'managed-it'
  | 'devops'
  | 'monitoring'
  | 'quality'
  | 'cloud-infra';

export interface OfferingCategory {
  id: ServiceCategoryId;
  name: string;
  blurb: string;
  /** Banner photo shared by every service in this category. */
  image: string;
  /** Descriptive alt text for the banner photo. */
  imageAlt: string;
}

/**
 * Shared shape for a service (Services tab) or platform solution (Solutions
 * tab). Rendered on the overview cards and the shared OfferingDetail page.
 */
export interface OfferingData {
  /** Internal short key, also used as the React key. */
  id: string;
  /** URL segment — /services/<slug> or /solutions/<slug>. */
  slug: string;
  /** Category grouping (Services only; omitted for Solutions). */
  category?: ServiceCategoryId;
  title: string;
  /** Short eyebrow line shown above the title. */
  subtitle: string;
  /** One-line summary used on the overview cards. */
  summary: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  /** Banner photo. Services fall back to their category's image. */
  image?: string;
  /** Descriptive alt text for the banner photo. */
  imageAlt?: string;
  /** Opening paragraph on the detail page. */
  overview: string;
  /** "What we do" — concrete deliverables / scope of work. */
  whatWeDo: string[];
  /** How Nixsoft delivers it. */
  approach: string;
  /** Tools & technologies. */
  stack: string[];
  /** Measurable outcomes. */
  outcomes: string[];
  /** SEO <title> (brand suffix is added automatically). Keep <= 50 chars. */
  seoTitle: string;
  /** SEO meta description for the detail page. 140-160 chars. */
  metaDescription: string;
  /**
   * Primary keyword as a natural noun phrase, used inside H2s — e.g.
   * "VAPT and security testing" → "How we deliver VAPT and security testing".
   */
  keywordPhrase: string;
  /** Primary + long-tail keywords for this page (keyword map). */
  keywords: string[];
  /** Question-style FAQs that target long-tail searches. */
  faqs?: { q: string; a: string }[];
  /** Old-site slugs that should 301-redirect to this page. */
  legacyAliases?: string[];
}

export interface ProductItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
}

export interface NavItem {
  label: string;
  path: string;
}

export enum ContactReason {
  General = 'General Inquiry',
  Sales = 'Sales / Partnership',
  Support = 'Technical Support',
  Careers = 'Careers'
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}
