import { Landmark, RadioTower, ShoppingBag, Factory } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface IndustryData {
  id: string;
  /** URL segment — /industries/<slug>. */
  slug: string;
  name: string;
  fullName: string;
  icon: LucideIcon;
  /** One-line summary for overview cards and the Home page. */
  summary: string;
  description: string;
  /** Longer opening copy on the detail page. */
  overview: string[];
  challenges: string[];
  solutions: { title: string; desc: string }[];
  compliance: string[];
  stats: { label: string; value: string };
  /** Service slugs (/services/<slug>) to cross-link. */
  relatedServices: string[];
  /** Product slugs (/products/<slug>) to cross-link. */
  relatedProducts: string[];
  /** Existing clients in this sector (names as shown on /clients). */
  clients: string[];
  faqs: { q: string; a: string }[];
  /** Full Tailwind class strings (kept literal so Tailwind picks them up). */
  lightColor: string;
  textColor: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export const INDUSTRIES_DATA: IndustryData[] = [
  {
    id: 'bfsi',
    slug: 'bfsi',
    name: 'BFSI',
    fullName: 'Banking, Financial Services & Insurance',
    icon: Landmark,
    summary: 'Secure, compliant, always-on infrastructure for banks, exchanges, clearing corporations, insurers, and fintechs.',
    description: 'Modernize legacy core banking systems while maintaining military-grade security and strict regulatory compliance.',
    overview: [
      'Financial institutions run some of the most demanding infrastructure anywhere: transaction platforms that cannot go down, data that regulators require to stay in-country, and audit cycles that never really end.',
      'Nixsoft helps banks, exchanges, clearing corporations, insurers, and fintechs modernise that infrastructure without trading away control — automating compliance, hardening every layer, and engineering the databases and platforms behind critical trading and payment systems for high availability.',
    ],
    challenges: ['Legacy mainframe dependencies', 'Strict data residency laws (RBI/MAS)', 'Zero-tolerance for downtime'],
    solutions: [
      { title: 'Payment Gateway Auto-Scaling', desc: 'Kubernetes architecture that handles 10k+ TPS during peak transaction hours.' },
      { title: 'Fraud Detection Pipelines', desc: 'Real-time data streaming (Kafka) for immediate anomaly detection.' },
      { title: 'Compliance as Code', desc: 'Automated policy enforcement for PCI-DSS and ISO 27001.' },
    ],
    compliance: ['PCI-DSS', 'ISO 27001', 'SOC 2', 'GDPR'],
    stats: { label: 'Faster Compliance Audits', value: '70%' },
    relatedServices: ['security-testing', 'db-management-services', 'infrastructure-monitoring', 'it-managed-services'],
    relatedProducts: ['vulnguard', 'securebench'],
    clients: ['NCDEX', 'NCCL', 'IndusInd Bank', 'Zero Mass'],
    faqs: [
      { q: 'Which compliance frameworks do you support for BFSI?', a: 'Our BFSI engagements are built around PCI-DSS, ISO 27001, SOC 2, and GDPR, with compliance enforced as code so evidence is generated continuously rather than assembled at audit time.' },
      { q: 'Can you work within data residency requirements?', a: 'Yes. We deploy on-premise, in in-country cloud regions, or in air-gapped environments, so regulated data stays where regulators require it.' },
      { q: 'Do you support exchanges and clearing corporations?', a: 'Yes — our BFSI clients include NCDEX and NCCL, where we manage and tune the MySQL and PostgreSQL platforms behind critical trading and clearing systems.' },
    ],
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    metaTitle: 'BFSI — DevOps, Security & Compliance for Financial Services',
    metaDescription: 'Secure, compliant, high-availability infrastructure for banks, exchanges, clearing corporations, insurers, and fintechs — PCI-DSS, ISO 27001, and data-residency ready.',
    keywords: 'BFSI DevOps, banking infrastructure, financial services compliance, PCI-DSS automation, fintech infrastructure, exchange database management',
  },
  {
    id: 'telecom',
    slug: 'telecom',
    name: 'Telecom',
    fullName: 'Telecommunications & 5G',
    icon: RadioTower,
    summary: 'High-throughput, low-latency automation for telecom operators, broadband providers, and 5G and edge networks.',
    description: 'Build the backbone of the future with high-throughput, low-latency infrastructure automation for 5G and edge computing.',
    overview: [
      'Telecom operators run infrastructure at a scale few other industries match — thousands of sites, enormous data volumes, and customers who notice every second of downtime. Manual operations simply do not keep up.',
      'Nixsoft brings automation and observability to telecom networks: zero-touch provisioning for edge locations, modernised OSS/BSS platforms, and unified network monitoring that cuts alert noise so teams can resolve incidents before customers feel them.',
    ],
    challenges: ['Massive scale data ingestion', 'Network function virtualization (NFV)', 'Edge deployment complexity'],
    solutions: [
      { title: 'Zero-Touch Provisioning', desc: 'Automated bare-metal provisioning for thousands of edge locations.' },
      { title: 'OSS/BSS Modernization', desc: 'Migrating monolithic billing systems to microservices.' },
      { title: 'Network Slicing Automation', desc: 'Dynamic resource allocation for prioritized 5G traffic.' },
    ],
    compliance: ['Data Sovereignty', 'TRAI Regulations', '3GPP Standards'],
    stats: { label: 'Deployment Efficiency', value: '10x' },
    relatedServices: ['infrastructure-monitoring', 'devops-services', 'cloud-management-services', 'middleware-services'],
    relatedProducts: ['nixops-ai-agents'],
    clients: ['Hathway'],
    faqs: [
      { q: 'Can you monitor a large, distributed telecom network?', a: 'Yes. For Hathway we deployed a unified Network Monitoring System with intelligent alerting that centralised visibility across a distributed network and reduced alert noise.' },
      { q: 'Do you automate edge and site provisioning?', a: 'We build zero-touch provisioning that automates bare-metal setup across large numbers of edge locations, removing manual site-by-site configuration.' },
    ],
    lightColor: 'bg-green-50',
    textColor: 'text-green-600',
    metaTitle: 'Telecom — Network Automation & Monitoring for 5G and Edge',
    metaDescription: 'Infrastructure automation and network monitoring for telecom operators and broadband providers — zero-touch provisioning, OSS/BSS modernisation, and 5G automation.',
    keywords: 'telecom automation, 5G network automation, network monitoring system, OSS/BSS modernisation, zero-touch provisioning, edge computing infrastructure',
  },
  {
    id: 'retail',
    slug: 'retail',
    name: 'Retail',
    fullName: 'Retail & E-Commerce',
    icon: ShoppingBag,
    summary: 'Elastic, secure platforms that stay fast through sale-day traffic spikes across stores and e-commerce.',
    description: 'Survive and thrive during high-traffic events like Black Friday with elastic, self-healing infrastructure.',
    overview: [
      'Retail infrastructure has to absorb huge swings in demand — a festive sale can bring many times normal traffic in minutes — while securing payments and customer data across hundreds of stores and online channels.',
      'Nixsoft builds retail platforms that scale elastically, heal themselves, and stay patched across a distributed footprint. From automated vulnerability management in stores to full-stack observability for e-commerce, we keep revenue flowing on the days that matter most.',
    ],
    challenges: ['Unpredictable traffic spikes', 'Omnichannel inventory sync', 'Customer data protection'],
    solutions: [
      { title: 'Elastic Kubernetes Clusters', desc: 'Auto-scaling that reacts to traffic surges in seconds, not minutes.' },
      { title: 'Personalization Engines', desc: 'AI-driven recommendation APIs powered by low-latency databases.' },
      { title: 'POS Security Hardening', desc: 'End-point protection for distributed Point-of-Sale systems.' },
    ],
    compliance: ['PCI-DSS', 'Consumer Privacy Acts', 'PaaS Security'],
    stats: { label: 'Uptime During Peaks', value: '99.99%' },
    relatedServices: ['security-testing', 'cloud-management-services', 'performance-testing', 'application-monitoring'],
    relatedProducts: ['vulnguard'],
    clients: ['Tata Trent', 'Globus'],
    faqs: [
      { q: 'How do you keep a retail site up during a big sale?', a: 'We combine elastic Kubernetes auto-scaling with performance testing ahead of the event, so capacity is proven before the traffic arrives and scales automatically when it does.' },
      { q: 'Can you patch systems across many stores without disruption?', a: 'Yes. For Tata Trent we implemented VulnGuard™ to automate vulnerability assessment and patching across their retail footprint without disrupting daily operations.' },
    ],
    lightColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    metaTitle: 'Retail & E-Commerce — Scalable, Secure Infrastructure',
    metaDescription: 'Elastic, self-healing infrastructure for retail and e-commerce — auto-scaling for sale-day traffic, POS security hardening, and automated patch management.',
    keywords: 'retail infrastructure, e-commerce scalability, Black Friday auto-scaling, POS security, retail patch management, e-commerce monitoring',
  },
  {
    id: 'manufacturing',
    slug: 'manufacturing',
    name: 'Manufacturing',
    fullName: 'Manufacturing & Industry 4.0',
    icon: Factory,
    summary: 'Secure IT/OT convergence, IoT data platforms, and predictive maintenance for Industry 4.0.',
    description: 'Bridge the gap between OT (Operational Technology) and IT with secure IoT integration and digital twins.',
    overview: [
      'Modern factories connect production lines, sensors, and legacy control systems to IT networks — unlocking real-time insight, but also exposing operational technology that was never designed to face modern threats.',
      'Nixsoft helps manufacturers converge IT and OT securely: ingesting sensor data at scale, running predictive-maintenance models close to the equipment, and delivering updates safely into isolated, air-gapped factory networks.',
    ],
    challenges: ['IT/OT Convergence security', 'Legacy SCADA systems', 'Supply chain visibility'],
    solutions: [
      { title: 'IoT Data Lakes', desc: 'Secure ingestion pipelines for millions of sensor data points.' },
      { title: 'Predictive Maintenance', desc: 'ML models running on edge devices to predict equipment failure.' },
      { title: 'Air-Gapped Updates', desc: 'Secure CI/CD mechanisms for isolated factory networks.' },
    ],
    compliance: ['IEC 62443', 'ISO 9001', 'Safety Standards'],
    stats: { label: 'Reduction in Downtime', value: '45%' },
    relatedServices: ['infrastructure-monitoring', 'security-testing', 'devops-services', 'it-ops-services'],
    relatedProducts: ['nixops-ai-agents', 'securebench'],
    clients: [],
    faqs: [
      { q: 'Can you deliver updates into air-gapped factory networks?', a: 'Yes. We build secure CI/CD mechanisms designed for isolated networks, so plant systems can be updated without connecting them to the internet.' },
      { q: 'How does predictive maintenance work?', a: 'Machine-learning models run on edge devices near the equipment, analysing sensor data to flag likely failures before they cause unplanned downtime.' },
    ],
    lightColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    metaTitle: 'Manufacturing & Industry 4.0 — Secure IT/OT Infrastructure',
    metaDescription: 'Secure IT/OT convergence for manufacturers — IoT data pipelines, edge predictive maintenance, and air-gapped CI/CD for Industry 4.0 factories.',
    keywords: 'Industry 4.0, manufacturing IT OT convergence, IoT data platform, predictive maintenance, air-gapped CI/CD, IEC 62443',
  },
];

export const getIndustryBySlug = (slug: string): IndustryData | undefined =>
  INDUSTRIES_DATA.find((i) => i.slug === slug);
