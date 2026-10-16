import { ShieldCheck, ListChecks, BrainCircuit } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ProductData {
  id: string;
  /** URL segment — /products/<slug>. */
  slug: string;
  name: string;
  /** Short name for buttons, e.g. "Request VulnGuard Demo". */
  shortName: string;
  tagline: string;
  /** One-line summary for overview cards. */
  summary: string;
  description: string;
  /** Longer opening copy on the detail page. */
  overview: string[];
  icon: LucideIcon;
  features: string[];
  howItWorks: { title: string; desc: string }[];
  useCases: { title: string; desc: string }[];
  deployment: string[];
  benefits: string[];
  faqs: { q: string; a: string }[];
  /** Service slugs (/services/<slug>) to cross-link. */
  relatedServices: string[];
  visualType: 'radar' | 'stack' | 'network';
  /** Full Tailwind class strings (kept literal so Tailwind picks them up). */
  accentText: string;
  accentBg: string;
  accentBorder: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export const PRODUCTS_DATA: ProductData[] = [
  {
    id: 'vulnguard',
    slug: 'vulnguard',
    name: 'Nixsoft VulnGuard™',
    shortName: 'VulnGuard',
    tagline: 'Next-Gen Vulnerability Management',
    summary: 'Continuous vulnerability management for containers, hosts, and hybrid cloud — with context-aware prioritisation and automated patching.',
    description: 'A continuous security posture management platform designed specifically for dynamic, containerized, and hybrid environments. VulnGuard moves beyond static scanning to provide real-time context and prioritized remediation.',
    overview: [
      'Traditional vulnerability scanners run on a schedule and hand your team a long, flat list of CVEs. In a containerised, hybrid environment that list is out of date almost immediately — and with no sense of which findings actually matter, critical issues get lost among thousands of low-risk ones.',
      'VulnGuard scans continuously across containers and hosts, ranks every finding by its real-world context so your team fixes what matters first, and closes the loop by raising tickets in the tools you already use and deploying patches automatically.',
    ],
    icon: ShieldCheck,
    features: [
      'Real-time CVE Scanning (Container & Host)',
      'Context-Aware Prioritization',
      'Integration with Jira/ServiceNow',
      'Automated Patch Deployment',
    ],
    howItWorks: [
      { title: 'Discover', desc: 'Continuously inventories hosts and container images across on-premise, cloud, and hybrid estates.' },
      { title: 'Prioritise', desc: 'Ranks each vulnerability by context so the riskiest exposures rise to the top and noise falls away.' },
      { title: 'Remediate', desc: 'Raises tickets in Jira or ServiceNow and deploys patches automatically, tracking every finding to closure.' },
    ],
    useCases: [
      { title: 'Containerised CI/CD pipelines', desc: 'Catch vulnerable images before they reach production and keep running workloads continuously scanned.' },
      { title: 'Regulated and air-gapped environments', desc: 'Run fully self-hosted inside isolated networks where SaaS security tooling is not permitted.' },
      { title: 'Multi-cloud estates', desc: 'One view of security posture across every cloud and data centre instead of a console per provider.' },
    ],
    deployment: ['SaaS (Managed)', 'Self-Hosted (Air-gapped)', 'Hybrid Agent'],
    benefits: ['Reduce MTTD (Mean Time to Detect) by 70%', 'Eliminate 95% of false positives', 'Single pane of glass for multi-cloud security'],
    faqs: [
      { q: 'What does VulnGuard scan?', a: 'VulnGuard scans both container images and hosts for known CVEs, across on-premise, cloud, and hybrid environments.' },
      { q: 'Can VulnGuard run in an air-gapped network?', a: 'Yes. Alongside the managed SaaS and hybrid-agent options, VulnGuard can be deployed fully self-hosted in air-gapped environments.' },
      { q: 'Does it work with our existing ticketing tools?', a: 'VulnGuard integrates with Jira and ServiceNow, so findings flow into the workflow your teams already use.' },
      { q: 'How is VulnGuard different from a traditional scanner?', a: 'Instead of a periodic list of CVEs, VulnGuard scans continuously, prioritises findings by context, and automates patch deployment — so remediation actually keeps pace with change.' },
    ],
    relatedServices: ['security-testing', 'devops-services', 'infrastructure-monitoring'],
    visualType: 'radar',
    accentText: 'text-green-600',
    accentBg: 'bg-green-50',
    accentBorder: 'border-green-200',
    metaTitle: 'VulnGuard™ — Continuous Vulnerability Management',
    metaDescription: 'Nixsoft VulnGuard™ continuously scans containers and hosts for CVEs, prioritises findings by context, and automates patching across hybrid and air-gapped environments.',
    keywords: 'VulnGuard, vulnerability management, container security scanning, CVE scanning, automated patch management, air-gapped vulnerability scanner',
  },
  {
    id: 'securebench',
    slug: 'securebench',
    name: 'SecureBench Automation',
    shortName: 'SecureBench',
    tagline: 'CIS Compliance on Autopilot',
    summary: 'Automated CIS Level 1 & 2 hardening with drift detection, rollback, and audit-ready reports across your entire server fleet.',
    description: 'Automated hardening framework that enforces CIS Level 1 & 2 benchmarks across your entire server fleet. Detect configuration drift and auto-remediate deviations in seconds.',
    overview: [
      'Hardening servers to CIS benchmarks by hand is slow, inconsistent from one engineer to the next, and starts to drift the moment someone changes a setting. Come audit time, teams scramble to prove a baseline they cannot actually guarantee.',
      'SecureBench turns the CIS benchmarks into automation. It applies Level 1 and Level 2 controls in one click, watches every server for configuration drift and corrects it, and produces the audit evidence for you — with rollback if a control ever conflicts with an application.',
    ],
    icon: ListChecks,
    features: [
      'One-click CIS Hardening',
      'Configuration Drift Detection',
      'Audit-Ready Compliance Reports (PDF/CSV)',
      'Rollback Capabilities',
    ],
    howItWorks: [
      { title: 'Harden', desc: 'Applies CIS Level 1 and Level 2 controls across the fleet using your existing automation tooling.' },
      { title: 'Detect drift', desc: 'Continuously compares every server against the approved baseline and flags or auto-remediates deviations.' },
      { title: 'Prove it', desc: 'Generates audit-ready PDF and CSV compliance reports, with rollback available for any control that causes issues.' },
    ],
    useCases: [
      { title: 'Audit preparation', desc: 'Walk into ISO 27001 or PCI-DSS audits with current, automatically generated hardening evidence.' },
      { title: 'Golden server baselines', desc: 'Make every new server hardened from day one instead of relying on a manual checklist.' },
      { title: 'Large and growing fleets', desc: 'Keep hundreds of servers on the same baseline without adding headcount as the estate grows.' },
    ],
    deployment: ['Ansible/Puppet Module', 'Standalone Binary', 'Kubernetes Operator'],
    benefits: ['100% Audit Readiness', 'Standardized Security Baseline', 'Zero manual configuration errors'],
    faqs: [
      { q: 'What is a CIS benchmark?', a: 'CIS Benchmarks are consensus-based secure configuration guidelines published by the Center for Internet Security for operating systems, databases, and other platforms.' },
      { q: 'What is the difference between CIS Level 1 and Level 2?', a: 'Level 1 is a practical security baseline with minimal impact on functionality. Level 2 adds defence-in-depth controls for high-security environments and can restrict some functionality. SecureBench supports both.' },
      { q: 'Can a hardening change be undone?', a: 'Yes. SecureBench includes rollback, so a control that conflicts with an application can be reverted quickly.' },
      { q: 'How is SecureBench deployed?', a: 'As an Ansible or Puppet module, a standalone binary, or a Kubernetes Operator — whichever fits your existing tooling.' },
    ],
    relatedServices: ['security-testing', 'it-managed-services', 'cloud-management-services'],
    visualType: 'stack',
    accentText: 'text-blue-600',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-200',
    metaTitle: 'SecureBench — Automated CIS Benchmark Hardening',
    metaDescription: 'SecureBench automates CIS Level 1 & 2 hardening across your server fleet, detects configuration drift, and generates audit-ready compliance reports.',
    keywords: 'SecureBench, CIS benchmark automation, CIS hardening, server hardening, configuration drift detection, compliance automation',
  },
  {
    id: 'nixops-ai',
    slug: 'nixops-ai-agents',
    name: 'NixOps AI Agents',
    shortName: 'NixOps',
    tagline: 'Self-Healing Infrastructure Intelligence',
    summary: 'Lightweight endpoint agents that predict failures, analyse logs, and fix common operational issues automatically.',
    description: 'Lightweight, intelligent agents that live on your endpoints. They utilize local machine learning models to predict failures, optimize resource usage, and automatically fix common operational issues.',
    overview: [
      'Much of an operations team’s day goes on the same recurring issues: a stopped service, a full disk, a runaway process. Each one becomes a ticket, an alert, and an engineer’s time — and many are only spotted after users notice.',
      'NixOps AI Agents run on your endpoints and use local machine-learning models to learn each system’s normal behaviour. They spot anomalies early, analyse logs automatically, run self-healing scripts for known issues, and right-size resource usage to cut compute cost.',
    ],
    icon: BrainCircuit,
    features: [
      'Predictive Anomaly Detection',
      'Automated Log Analysis',
      'Self-Healing Scripts',
      'Resource Optimization (Cost Saving)',
    ],
    howItWorks: [
      { title: 'Learn', desc: 'Local machine-learning models build a baseline of normal behaviour on each endpoint.' },
      { title: 'Detect', desc: 'Anomalies and log patterns that point to an impending failure are flagged before they cause an outage.' },
      { title: 'Heal and optimise', desc: 'Self-healing scripts resolve common issues automatically, and resource usage is tuned to reduce cost.' },
    ],
    useCases: [
      { title: 'Reducing L1 ticket volume', desc: 'Let agents resolve recurring issues like stopped services so your NOC focuses on real incidents.' },
      { title: 'Large mixed fleets', desc: 'One agent model across Linux, Windows, and Kubernetes workloads.' },
      { title: 'Cloud cost control', desc: 'Spot over-provisioned resources and optimise usage to bring compute spend down.' },
    ],
    deployment: ['Linux Daemon', 'Windows Service', 'Kubernetes Sidecar'],
    benefits: ['Reduce L1 Support Tickets by 60%', 'Prevent outages before they occur', 'Lower cloud compute costs by optimizing usage'],
    faqs: [
      { q: 'Where do NixOps AI Agents run?', a: 'As a Linux daemon, a Windows service, or a Kubernetes sidecar — directly on the endpoints they monitor.' },
      { q: 'Where does the machine learning happen?', a: 'Anomaly detection uses machine-learning models that run locally on each endpoint.' },
      { q: 'What can the agents fix on their own?', a: 'Common, well-understood operational issues — for example restarting a failed service — using self-healing scripts.' },
      { q: 'How do the agents reduce cost?', a: 'They analyse resource usage on each endpoint and optimise it, helping lower cloud compute spend.' },
    ],
    relatedServices: ['infrastructure-monitoring', 'it-ops-services', 'application-monitoring'],
    visualType: 'network',
    accentText: 'text-orange-600',
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-200',
    metaTitle: 'NixOps AI Agents — Self-Healing Infrastructure',
    metaDescription: 'NixOps AI Agents use local machine learning to predict failures, analyse logs, and self-heal common issues across Linux, Windows, and Kubernetes.',
    keywords: 'NixOps AI, AIOps agents, self-healing infrastructure, predictive anomaly detection, automated log analysis, infrastructure automation',
  },
];

export const getProductBySlug = (slug: string): ProductData | undefined =>
  PRODUCTS_DATA.find((p) => p.slug === slug);
