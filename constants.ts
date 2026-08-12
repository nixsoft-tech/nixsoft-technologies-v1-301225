import { ServiceItem, ProductItem, NavItem } from './types';

// Canonical origin for this deployment. Production is the apex domain — www
// 301s to it, so canonicals and schema must never point at www or at a UAT
// host. Override with VITE_SITE_URL per environment; trailing slash stripped
// so callers can safely concatenate a leading-slash path.
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://nixsoftech.in').replace(/\/+$/, '');

export const NAV_LINKS: NavItem[] = [
  { label: 'Services', path: '/services' },
  { label: 'Solutions', path: '/solutions' },
  { label: 'Products', path: '/products' },
  { label: 'Industries', path: '/industries' },
  { label: 'Clients', path: '/clients' },
  { label: 'About', path: '/about' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'devops',
    title: 'Enterprise DevOps',
    description: 'End-to-end CI/CD pipelines, infrastructure as code (IaC), and container orchestration with Kubernetes.',
    iconName: 'Infinity',
    category: 'DevOps',
    slug: 'devops-services'
  },
  {
    id: 'cloud',
    title: 'Cloud Transformation',
    description: 'Strategic migration, multi-cloud management, and cost optimization for AWS, Azure, and Google Cloud.',
    iconName: 'Cloud',
    category: 'Cloud',
    slug: 'cloud-management-services'
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    description: 'CIS Benchmarks, VAPT, Zero Trust architecture implementation, and real-time threat monitoring.',
    iconName: 'ShieldCheck',
    category: 'Security',
    slug: 'security-testing'
  },
  {
    id: 'database',
    title: 'Database Reliability',
    description: 'High-availability architecture, tuning, and management for PostgreSQL, MongoDB, and enterprise SQL.',
    iconName: 'Database',
    category: 'Database',
    slug: 'db-management-services'
  }
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'vulnguard',
    title: 'VulnGuard™',
    tagline: 'Proactive Threat Defense',
    description: 'Automated vulnerability assessment platform specifically designed for hybrid cloud environments.',
    features: ['Continuous Scanning', 'Compliance Reporting', 'Auto-Remediation Scripts']
  },
  {
    id: 'benchmarks',
    title: 'SecureBench',
    tagline: 'Compliance on Autopilot',
    description: 'Automated implementation of CIS Level 1 & 2 benchmarks across your entire server fleet.',
    features: ['One-Click Hardening', 'Drift Detection', 'Audit Logs']
  },
  {
    id: 'ai-agents',
    title: 'NixOps AI Agents',
    tagline: 'Self-Healing Infrastructure',
    description: 'Intelligent agents that detect system anomalies and perform corrective actions without human intervention.',
    features: ['Predictive Maintenance', 'Log Analysis', 'Incident Routing']
  }
];

export const INDUSTRIES = [
  { name: 'BFSI', icon: 'Landmark', desc: 'Secure, compliant infrastructure for banking and fintech.' },
  { name: 'Telecom', icon: 'RadioTower', desc: 'High-throughput, low-latency network automation.' },
  { name: 'Retail', icon: 'ShoppingBag', desc: 'Scalable platforms for high-traffic e-commerce events.' },
  { name: 'Manufacturing', icon: 'Factory', desc: 'IoT integration and supply chain system reliability.' }
];

export const ROI_CONSTANTS = {
  SAVINGS_RATE: 0.40, // 40% cloud savings
  MAINTENANCE_SAVINGS_PER_SERVER: 500, // $500 per server annually
};
