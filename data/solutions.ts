import {
  Infinity, Cloud, ShieldCheck, Database, BrainCircuit,
  LifeBuoy, TestTube, Network, Bot, LucideIcon
} from 'lucide-react';

export interface SolutionData {
  /** Internal short key, also used as the React key. */
  id: string;
  /** Canonical URL segment — rendered at /service/<slug>. Matches the old site's URL where one exists. */
  slug: string;
  title: string;
  subtitle: string;
  /** One-line summary used on the /solutions overview cards. */
  summary: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  problem: string;
  approach: string;
  stack: string[];
  outcomes: string[];
  /** SEO meta description for the dedicated /service/<slug> page. */
  metaDescription: string;
  /** Old-site URL slugs that should 301-redirect to this page (duplicate/overlapping old pages). */
  legacyAliases?: string[];
}

export const SOLUTIONS_DATA: SolutionData[] = [
  {
    id: 'devops',
    slug: 'devops-automation',
    title: 'DevOps & Automation',
    subtitle: 'Accelerate Delivery with Precision',
    summary: 'CI/CD, infrastructure as code, and zero-downtime deployments for engineering teams shipping fast without breaking production.',
    icon: Infinity,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    problem: 'Enterprises often struggle with siloed teams, manual configuration drift, and slow release cycles, leading to delayed time-to-market and unstable production environments.',
    approach: 'We implement "Everything as Code." From infrastructure provisioning to policy enforcement, we build self-service platforms that allow developers to ship features rapidly while Operations maintains strict stability and governance.',
    stack: ['Kubernetes', 'Terraform', 'Ansible', 'ArgoCD', 'Jenkins', 'Docker'],
    outcomes: [
      '95% reduction in deployment lead time',
      'Zero-downtime updates via Blue/Green strategies',
      'Fully automated disaster recovery protocols'
    ],
    metaDescription: 'Enterprise DevOps and automation services — CI/CD pipelines, infrastructure as code, and zero-downtime deployments using Kubernetes, Terraform, and Ansible.'
  },
  {
    id: 'cloud',
    slug: 'cloud-managed-service',
    title: 'Cloud & Data Center Management',
    subtitle: 'Hybrid Flexibility, Optimized Cost',
    summary: 'Vendor-agnostic hybrid and multi-cloud architecture that cuts spend without sacrificing performance or portability.',
    icon: Cloud,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50',
    problem: 'Uncontrolled cloud sprawl leads to spiraling costs (FinOps challenges) and vendor lock-in, while legacy data centers struggle to keep up with modern, dynamic workloads.',
    approach: 'We design vendor-agnostic hybrid architectures. Whether extending your on-premise VMware environment to AWS or managing multi-cloud Kubernetes clusters, we prioritize cost-efficiency, portability, and performance.',
    stack: ['AWS', 'Azure', 'Google Cloud', 'OpenShift', 'VMware', 'Linux'],
    outcomes: [
      '30-40% reduction in monthly cloud spend',
      'Seamless workload portability across providers',
      '99.99% infrastructure availability SLA'
    ],
    metaDescription: 'Cloud and data center management services — multi-cloud architecture, FinOps cost optimization, and hybrid infrastructure across AWS, Azure, and Google Cloud.'
  },
  {
    id: 'security',
    slug: 'security-testing',
    title: 'Security & Compliance',
    subtitle: 'Defend. Detect. Remediate.',
    summary: 'DevSecOps, CIS benchmark hardening, and continuous VAPT so compliance audits stop being a manual scramble.',
    icon: ShieldCheck,
    iconColor: 'text-nixGreen',
    iconBg: 'bg-green-50',
    problem: 'Traditional perimeter security fails in cloud-native environments. Compliance audits (ISO 27001, PCI-DSS) are typically manual, painful, and prone to human error.',
    approach: 'We shift security left (DevSecOps). Our proprietary VulnGuard™ framework automates CIS Benchmark hardening, real-time VAPT, and continuous compliance monitoring directly within the CI/CD pipeline.',
    stack: ['VulnGuard™', 'SonarQube', 'Trivy', 'Wazuh', 'Vault', 'Falco'],
    outcomes: [
      'Continuous compliance verification (Audit-ready)',
      'Automated remediation of critical vulnerabilities',
      'Implementation of Zero Trust architecture'
    ],
    metaDescription: 'Security testing, VAPT, and compliance automation — DevSecOps, CIS Benchmark hardening, and continuous audit-readiness for cloud-native environments.'
  },
  {
    id: 'database',
    slug: 'database-management-service',
    title: 'Database & App Management',
    subtitle: 'High Performance at Scale',
    summary: 'Site reliability engineering for your data layer — sharding, replication, and backup testing built for scale.',
    icon: Database,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    problem: 'Data bottlenecks, slow query performance, and the risk of data loss threaten business continuity as transaction volumes scale exponentially.',
    approach: 'We provide site reliability engineering (SRE) for your data layer. This includes automated sharding strategies, read-replica scaling, connection pooling, and chaotic testing of backup/restore procedures.',
    stack: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Kafka', 'Cassandra'],
    outcomes: [
      'Sub-millisecond query latency for critical paths',
      'RPO/RTO reduced to < 5 minutes',
      'Seamless version upgrades with no downtime'
    ],
    metaDescription: 'Database and application management services — SRE for PostgreSQL, MongoDB, and enterprise databases, with sharding, replication, and disaster recovery.'
  },
  {
    id: 'ai-ops',
    slug: 'infrastructure-monitoring',
    title: 'AI-Driven Monitoring & Intelligence',
    subtitle: 'From Reactive to Predictive',
    summary: 'Full-stack observability with NixOps AI agents that catch anomalies before they become incidents.',
    icon: BrainCircuit,
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50',
    problem: 'Alert fatigue causes teams to miss critical signals amidst the noise. Traditional monitoring tools lack context and predictive capabilities.',
    approach: 'We deploy full-stack observability coupled with NixOps AI agents. Our systems learn normal baselines to detect anomalies and auto-remediate known issues before they impact users.',
    stack: ['Prometheus', 'Grafana', 'ELK Stack', 'NixOps AI', 'Jaeger', 'Opentelemetry'],
    outcomes: [
      '50% reduction in Mean Time To Resolution (MTTR)',
      'Proactive anomaly detection using ML models',
      'Unified single-pane-of-glass dashboard'
    ],
    metaDescription: 'Infrastructure, synthetic, and application performance monitoring — full-stack observability with AI-driven anomaly detection and a single-pane-of-glass dashboard.',
    legacyAliases: ['synthetic-monitoring', 'application-performance-monitoring']
  },
  {
    id: 'managed-it-ops',
    slug: 'it-ops-services',
    title: 'Managed IT & On-Demand Operations',
    subtitle: 'Your Extended Infrastructure Team',
    summary: '24/7 managed operations plus on-demand engineering capacity for projects that don’t need a full-time hire.',
    icon: LifeBuoy,
    iconColor: 'text-cyan-600',
    iconBg: 'bg-cyan-50',
    problem: 'In-house teams get stretched thin covering routine server, network, and application administration around the clock, leaving little bandwidth for strategic projects — while one-off spikes in workload don\'t justify a full-time hire.',
    approach: 'We run day-to-day IT operations as a managed service — 24/7 monitoring, patching, incident response, and helpdesk escalation — backed by on-demand engineering resources you can scale up for migrations, audits, or short-term projects without long procurement cycles.',
    stack: ['ServiceNow', 'Zabbix', 'Ansible', 'ITIL', 'Jira Service Mgmt', 'PRTG'],
    outcomes: [
      '24/7 L1/L2/L3 operations coverage',
      'SLA-backed incident response times',
      'Flexible on-demand engineering capacity, no long-term overhead'
    ],
    metaDescription: 'Managed IT services, IT operations, and on-demand engineering support — 24/7 monitoring, patching, incident response, and flexible project capacity.',
    legacyAliases: ['it-managed-services', 'on-demand-services']
  },
  {
    id: 'testing',
    slug: 'automation-testing',
    title: 'Quality Engineering & Test Automation',
    subtitle: 'Ship Faster Without Breaking Things',
    summary: 'Automated functional, performance, and regression testing built into your CI/CD pipeline, not bolted on after.',
    icon: TestTube,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    problem: 'Manual regression cycles slow releases and still miss defects, while performance issues and functional gaps often surface only after code reaches production.',
    approach: 'We build automated functional, performance, and regression test suites integrated directly into your CI/CD pipeline, so every release is validated for correctness and load behavior before it ships — not after.',
    stack: ['Selenium', 'JMeter', 'Playwright', 'TestNG', 'k6', 'Postman'],
    outcomes: [
      'Up to 70% reduction in manual regression effort',
      'Performance bottlenecks caught pre-release',
      'Continuous functional coverage integrated into CI/CD'
    ],
    metaDescription: 'Automation, performance, and functional testing services — CI/CD-integrated test suites built with Selenium, JMeter, and Playwright.',
    legacyAliases: ['performance-testing', 'functional-testing']
  },
  {
    id: 'middleware',
    slug: 'middleware-services',
    title: 'Middleware Management',
    subtitle: 'The Layer That Keeps Everything Talking',
    summary: 'End-to-end administration of app servers, message queues, and integration layers before they become the outage.',
    icon: Network,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    problem: 'Application servers, message queues, and integration layers are frequently the least visible — and most fragile — part of the stack, with config drift and version sprawl causing outages that are hard to trace back to root cause.',
    approach: 'We administer and tune your middleware layer end-to-end — app server clustering, message broker health, connection pooling, and patch/version governance — with proactive monitoring so integration failures are caught before they cascade.',
    stack: ['WebLogic', 'JBoss/WildFly', 'Apache Kafka', 'RabbitMQ', 'Nginx', 'Tomcat'],
    outcomes: [
      'Reduced integration-layer downtime',
      'Standardized middleware versioning and patch governance',
      'Faster root-cause isolation across app/integration tiers'
    ],
    metaDescription: 'Middleware management services — application server clustering, message broker administration, and patch governance for WebLogic, Kafka, and RabbitMQ.'
  },
  {
    id: 'rpa',
    slug: 'robotics-process-automation',
    title: 'Robotics Process Automation (RPA)',
    subtitle: 'Automate the Repetitive, Free Up the Team',
    summary: 'Software bots that handle rule-based back-office work end-to-end, without touching your existing systems.',
    icon: Bot,
    iconColor: 'text-fuchsia-600',
    iconBg: 'bg-fuchsia-50',
    problem: 'High-volume, rule-based back-office tasks — data entry, reconciliation, report generation — consume hours of skilled staff time and are prone to manual error.',
    approach: 'We design and deploy software bots that mimic human interaction with your existing applications, automating repetitive workflows end-to-end without requiring changes to underlying systems.',
    stack: ['UiPath', 'Automation Anywhere', 'Power Automate', 'Python', 'OCR/IDP'],
    outcomes: [
      'Up to 80% reduction in manual processing time for automated workflows',
      'Near-zero error rate on rule-based tasks',
      'Staff redeployed from repetitive work to higher-value tasks'
    ],
    metaDescription: 'Robotics Process Automation (RPA) services — software bots for data entry, reconciliation, and report generation using UiPath and Power Automate.'
  }
];

export const getSolutionBySlug = (slug: string): SolutionData | undefined =>
  SOLUTIONS_DATA.find((s) => s.slug === slug);
