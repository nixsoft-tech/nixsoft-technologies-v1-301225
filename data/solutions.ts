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
    title: 'Asset Management',
    subtitle: 'Every Asset, Accounted For',
    summary: 'A single source of truth for your IT and enterprise assets — from procurement to retirement — with automated discovery and lifecycle tracking.',
    icon: Boxes,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    image: '/images/banners/sol-asset.webp',
    overview: 'Untracked assets drain budgets, create compliance gaps, and slow down audits. We deploy and manage an IT Asset Management (ITAM) platform that discovers, catalogues, and tracks every asset across its full lifecycle — so you always know what you own, where it is, and what it costs.',
    whatWeDo: [
      'Automated hardware and software discovery across your estate',
      'Full lifecycle tracking — procurement, deployment, maintenance, retirement',
      'Software licence and compliance management to avoid true-up penalties',
      'CMDB integration and audit-ready reporting',
    ],
    approach: 'We implement a centralised asset repository with automated discovery agents, integrate it with your service desk and procurement processes, and configure dashboards that turn raw inventory into decisions on cost, compliance, and refresh cycles.',
    stack: ['SnipeIT', 'GLPI', 'ServiceNow ITAM', 'Lansweeper', 'PostgreSQL', 'Grafana'],
    outcomes: [
      'Complete, real-time visibility of every asset',
      'Reduced software licence and compliance risk',
      'Faster audits and smarter refresh planning',
    ],
    metaDescription: 'Asset Management solutions from Nixsoft — automated discovery, lifecycle tracking, and licence compliance for IT and enterprise assets.',
    legacyAliases: ['asset-management'],
  },
  {
    id: 'email-collaboration',
    slug: 'email-collaboration',
    title: 'Email & Collaboration',
    subtitle: 'Secure Communication, Fully in Your Control',
    summary: 'Enterprise email and collaboration platforms — deployed, secured, and managed — including sovereign open-source alternatives to public SaaS.',
    icon: Mail,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    image: '/images/banners/sol-email.webp',
    overview: 'Email and collaboration are mission-critical yet often outside your control, with data residency and cost concerns mounting. We deploy and manage secure, scalable communication platforms — including sovereign open-source stacks — that keep your data where you want it.',
    whatWeDo: [
      'Deployment of enterprise email and groupware platforms',
      'Migration from legacy or public-cloud mail with zero data loss',
      'Security hardening — anti-spam, encryption, DMARC/DKIM/SPF',
      'High-availability, backup, and ongoing administration',
    ],
    approach: 'We assess your data-residency, security, and cost requirements, then deploy the right platform — commercial or open-source — with hardened security, reliable backups, and managed operations so your teams collaborate without interruption.',
    stack: ['Zimbra', 'Postfix', 'Microsoft 365', 'Google Workspace', 'Nextcloud', 'ClamAV'],
    outcomes: [
      'Secure, compliant control over communication data',
      'Seamless migration with no mailbox disruption',
      'Reliable, fully managed collaboration platform',
    ],
    metaDescription: 'Email & Collaboration solutions from Nixsoft — secure, managed enterprise email and groupware, including sovereign open-source platforms.',
    legacyAliases: ['email-collaboration'],
  },
  {
    id: 'ticketing-system',
    slug: 'ticketing-system',
    title: 'Ticketing System',
    subtitle: 'Service Desk That Runs Itself',
    summary: 'A configured, ITIL-aligned service desk and ticketing platform that streamlines support, tracks SLAs, and automates routine workflows.',
    icon: Ticket,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    image: '/images/banners/sol-ticketing.webp',
    overview: 'Support requests lost in inboxes mean missed SLAs and frustrated users. We deploy and configure a proper ITSM ticketing platform that captures every request, routes it intelligently, and gives you the reporting to run support as a measurable service.',
    whatWeDo: [
      'Deployment and configuration of an ITIL-aligned service desk',
      'Multi-channel intake — email, portal, chat — into one queue',
      'SLA policies, escalation rules, and workflow automation',
      'Knowledge base, self-service portal, and analytics dashboards',
    ],
    approach: 'We configure the platform to your support processes — categories, SLAs, escalations, and automations — integrate it with your asset and monitoring systems, and set up dashboards so support performance is visible and continuously improving.',
    stack: ['GLPI', 'Zammad', 'osTicket', 'Jira Service Mgmt', 'Freshservice', 'PostgreSQL'],
    outcomes: [
      'No request lost — every ticket tracked to closure',
      'SLA compliance you can measure and prove',
      'Less manual triage through workflow automation',
    ],
    metaDescription: 'Ticketing System solutions from Nixsoft — configured, ITIL-aligned service desk platforms with SLA tracking and workflow automation.',
    legacyAliases: ['ticketing-system'],
  },
];

export const getSolutionBySlug = (slug: string): OfferingData | undefined =>
  SOLUTIONS_DATA.find((s) => s.slug === slug);
