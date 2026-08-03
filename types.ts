export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'DevOps' | 'Cloud' | 'Security' | 'Database';
  slug: string;
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
