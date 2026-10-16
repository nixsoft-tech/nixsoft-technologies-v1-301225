import { Boxes, Mail, Ticket } from 'lucide-react';
import type { OfferingData } from '../types';

/** @deprecated Use OfferingData. Kept as an alias for existing imports. */
export type SolutionData = OfferingData;

/**
 * The Solutions tab houses Nixsoft's packaged platform solutions — deployed,
 * configured, and managed products (distinct from the technical delivery
 * services under /services, and from Nixsoft's own tools under /products).
 */
export const SOLUTIONS_DATA: OfferingData[] = [
  {
    id: 'asset-management',
    slug: 'asset-management',
    title: 'IT Asset Management Solution',
    subtitle: 'Every Asset, Accounted For',
    summary: 'A single source of truth for IT and enterprise assets, from procurement to retirement, with automated discovery and lifecycle tracking.',
    icon: Boxes,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    image: '/images/banners/sol-asset.webp',
    imageAlt: 'IT team auditing hardware assets in a warehouse with a tablet and clipboard',
    overview: 'Untracked assets drain budgets, create compliance gaps, and slow down audits. We deploy and manage IT asset management software (ITAM) that discovers, catalogues, and tracks every asset across its full lifecycle, covering hardware and software asset tracking as well as software licence compliance, so you always know what you own, where it is, and what it costs.',
    whatWeDo: [
      'Automated hardware and software discovery across your estate',
      'Full lifecycle tracking: procurement, deployment, maintenance, and retirement',
      'Software licence and compliance management to avoid true-up penalties',
      'CMDB integration and audit-ready reporting',
    ],
    approach: 'We implement a central asset repository with automated discovery agents, connect it to your service desk and procurement processes, and configure dashboards that turn raw inventory into decisions on cost, compliance, and refresh cycles.',
    stack: ['SnipeIT', 'GLPI', 'ServiceNow ITAM', 'Lansweeper', 'PostgreSQL', 'Grafana'],
    outcomes: [
      'Complete, real-time visibility of every asset',
      'Lower software licence and compliance risk',
      'Faster audits and smarter refresh planning',
    ],
    seoTitle: 'IT Asset Management Software & ITAM Solution',
    metaDescription: 'IT asset management (ITAM) solution: automated hardware and software discovery, lifecycle tracking and licence compliance, deployed and managed by Nixsoft.',
    keywordPhrase: 'IT asset management',
    keywords: ['IT asset management software', 'ITAM solution India', 'hardware and software asset tracking', 'software licence compliance management', 'asset lifecycle management'],
    faqs: [
      { q: 'What is IT asset management (ITAM)?', a: 'ITAM is the practice of tracking every hardware and software asset an organisation owns, including where it is, who uses it, what it costs, and when it is due for renewal or retirement, in one central system.' },
      { q: 'Can ITAM integrate with our service desk?', a: 'Yes. We connect the asset repository to your ticketing system, so incidents and requests are linked to the exact device or licence involved.' },
    ],
    legacyAliases: ['asset-management'],
  },
  {
    id: 'email-collaboration',
    slug: 'email-collaboration',
    title: 'Email & Collaboration Solutions',
    subtitle: 'Secure Communication, Fully in Your Control',
    summary: 'Enterprise email and collaboration platforms, deployed, secured, and managed, including sovereign open-source alternatives to public SaaS.',
    icon: Mail,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    image: '/images/banners/sol-email.webp',
    imageAlt: 'Team collaborating around a computer screen using business email and shared files',
    overview: 'Email and collaboration are mission-critical, yet often outside your control, with data residency and cost concerns growing. We deploy and manage secure business email and groupware, from Zimbra email server hosting in India to Microsoft 365 and Google Workspace migrations, keeping your data where you want it.',
    whatWeDo: [
      'Deployment of enterprise email and groupware platforms',
      'Migration from legacy or public-cloud mail with zero data loss',
      'Security hardening: anti-spam, encryption, and DMARC, DKIM, and SPF',
      'High availability, backup, and ongoing administration',
    ],
    approach: 'We assess your data-residency, security, and cost requirements, then deploy the right platform, commercial or open-source, with hardened security, reliable backups, and managed operations so your teams collaborate without interruption.',
    stack: ['Zimbra', 'Postfix', 'Microsoft 365', 'Google Workspace', 'Nextcloud', 'ClamAV'],
    outcomes: [
      'Secure, compliant control over communication data',
      'Seamless migration with no mailbox disruption',
      'A reliable, fully managed collaboration platform',
    ],
    seoTitle: 'Zimbra & Enterprise Email Hosting Solutions',
    metaDescription: 'Enterprise email and collaboration solutions: Zimbra email hosting in India, Microsoft 365 and Google Workspace migration, and secure, managed business email.',
    keywordPhrase: 'email and collaboration solutions',
    keywords: ['enterprise email hosting', 'Zimbra email server hosting India', 'business email with data residency in India', 'Microsoft 365 migration services', 'Nextcloud collaboration'],
    faqs: [
      { q: 'Can you host our email in India?', a: 'Yes. We can deploy email on-premise or in Indian cloud regions, so mailbox data stays in the country where data-residency rules require it.' },
      { q: 'Will we lose email during a migration?', a: 'No. We migrate mailboxes in stages with full data validation, and cut over DNS only once the new platform is verified, so users keep their mail and history.' },
    ],
    legacyAliases: ['email-collaboration'],
  },
  {
    id: 'ticketing-system',
    slug: 'ticketing-system',
    title: 'Helpdesk Ticketing System',
    subtitle: 'A Service Desk That Runs Itself',
    summary: 'A configured, ITIL-aligned service desk and ticketing platform that streamlines support, tracks SLAs, and automates routine workflows.',
    icon: Ticket,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    image: '/images/banners/sol-ticketing.webp',
    imageAlt: 'IT helpdesk support agent with a headset handling service desk tickets',
    overview: 'Support requests lost in inboxes mean missed SLAs and frustrated users. We implement and configure an IT helpdesk ticketing system, whether open-source like GLPI and Zammad or commercial service desk software, that captures every request, routes it intelligently, and gives you SLA tracking and reporting to run support as a measurable service.',
    whatWeDo: [
      'Deployment and configuration of an ITIL-aligned service desk',
      'Multi-channel intake from email, portal, and chat into one queue',
      'SLA policies, escalation rules, and workflow automation',
      'Knowledge base, self-service portal, and analytics dashboards',
    ],
    approach: 'We configure the platform around your support processes, including categories, SLAs, escalations, and automations, connect it to your asset and monitoring systems, and set up dashboards so support performance is visible and keeps improving.',
    stack: ['GLPI', 'Zammad', 'osTicket', 'Jira Service Mgmt', 'Freshservice', 'PostgreSQL'],
    outcomes: [
      'No lost requests: every ticket tracked to closure',
      'SLA compliance you can measure and prove',
      'Less manual triage through workflow automation',
    ],
    seoTitle: 'IT Helpdesk Ticketing System & Service Desk',
    metaDescription: 'IT helpdesk ticketing system implementation: ITIL service desk with SLA tracking, automation and self-service, on GLPI, Zammad, Jira Service Management and more.',
    keywordPhrase: 'helpdesk ticketing system',
    keywords: ['IT helpdesk ticketing system', 'ITIL service desk software', 'open-source helpdesk software (GLPI and Zammad)', 'SLA tracking and ticket automation', 'service desk implementation India'],
    faqs: [
      { q: 'Open-source or commercial helpdesk software?', a: 'Open-source tools like GLPI and Zammad avoid per-agent licence fees and keep data in-house; commercial tools like Jira Service Management and Freshservice offer faster SaaS setup. We recommend based on team size, budget, and integration needs.' },
      { q: 'Can the ticketing system track SLAs automatically?', a: 'Yes. We configure SLA policies per category and priority, with automatic escalation and reports that show compliance over time.' },
    ],
    legacyAliases: ['ticketing-system'],
  },
];

export const getSolutionBySlug = (slug: string): OfferingData | undefined =>
  SOLUTIONS_DATA.find((s) => s.slug === slug);
