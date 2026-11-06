/**
 * Search titles and summaries for blog posts, by WordPress slug.
 *
 * The posts' own titles are long (up to 92 characters, cut off in Google
 * results) and their excerpts are the article's opening hook ("Is your
 * MySQL database crawling at a snail's pace? 🐌"), which doesn't tell a
 * searcher what they'll learn. These replace them in the <title>, meta
 * description, social cards, the /blog card summary, the RSS feed and the
 * article schema description. The article's visible headline (H1) and the
 * schema headline stay the WordPress title.
 *
 * Rules: title <= 50 characters (" | Nixsoft" is added, keeping it within
 * ~60); summary 120-155 characters, says what the reader gets, no emoji,
 * matches the article's actual sections. A new post without an entry here
 * uses its WordPress title and excerpt, so add one when you publish.
 */
export interface BlogSeo {
  title: string;
  description: string;
}

export const BLOG_SEO: Record<string, BlogSeo> = {
  'the-dark-side-of-application-management-secrets-your-it-department-doesnt-want-you-to-know': {
    title: 'Application Management Risks: Hidden Costs & Fixes',
    description: 'Hidden costs and risks in application management, from licence fees and missed patches to downtime and shadow IT, with practical ways to fix each.',
  },
  'turbocharge-your-mysql-10-essential-tips-for-lightning-fast-performance': {
    title: 'MySQL Performance Tuning: 10 Practical Tips',
    description: 'Ten ways to speed up MySQL: InnoDB buffer pool and connection settings, better indexes, query optimisation, partitioning, replication and monitoring.',
  },
  'securing-postgresql-essential-tips-to-protect-your-database': {
    title: 'PostgreSQL Security: Best Practices Checklist',
    description: 'How to secure PostgreSQL: strong authentication, least-privilege roles, SSL/TLS connections, encryption, monitoring and auditing, and secure backups.',
  },
  'scaling-postgresql-for-high-traffic-applications-tips-and-best-practices': {
    title: 'Scaling PostgreSQL for High-Traffic Applications',
    description: 'Scale PostgreSQL under heavy load: schema and index design, partitioning, connection pooling, caching, read replicas, configuration tuning and monitoring.',
  },
  'the-essential-role-of-it-automation-in-modern-business-operations': {
    title: 'IT Automation for Business: Uses, Benefits, Tools',
    description: 'What IT automation covers across networks, data centres, cloud, security and delivery, its business benefits, how to pick tools and pitfalls to plan for.',
  },
  'streamlining-operations-with-it-service-management-using-open-source-tools': {
    title: 'Open-Source ITSM Tools: Implementation Guide',
    description: 'How to run IT service management with open-source tools: ITSM principles, popular tools, incident and problem management, workflow automation and KPIs.',
  },
  'open-source-tools-for-it-operations-monitoring-a-comprehensive-review': {
    title: 'Open-Source IT Monitoring Tools Compared',
    description: 'A review of open-source monitoring tools (Nagios, Zabbix, Prometheus and Grafana) for network, application, log and infrastructure monitoring.',
  },
  'how-automation-testing-enhances-software-quality-and-efficiency': {
    title: 'Automation Testing: Benefits & Best Practices',
    description: 'How test automation improves software quality: test types, benefits over manual testing, where it helps most, best practices and how to measure impact.',
  },
  'top-5-essential-cybersecurity-services-every-business-needs': {
    title: '5 Cybersecurity Services Every Business Needs',
    description: 'Five security services every business needs: network security, data encryption, identity and access management, endpoint protection and awareness training.',
  },
  'top-aws-cloud-management-best-practices-for-2024': {
    title: 'AWS Cloud Management Best Practices',
    description: 'AWS best practices: IAM and MFA, encryption, cost control with Cost Explorer and tags, scaling, automation, monitoring and compliance governance.',
  },
  'how-ai-and-machine-learning-are-transforming-industries': {
    title: 'How AI and Machine Learning Transform Industries',
    description: 'AI and machine learning explained, with uses in healthcare, finance, manufacturing and retail, their benefits, adoption challenges and trends to watch.',
  },
  'the-rise-of-open-source-solutions-in-financial-tech-opportunities-and-challenges': {
    title: 'Open Source in FinTech: Opportunities & Risks',
    description: 'Why financial institutions adopt open source: popular FinTech tools, cost and flexibility benefits, security and compliance challenges, and future trends.',
  },
  'top-10-it-managed-services-support-and-solution-providers-in-mumbai': {
    title: 'Top 10 Managed IT Service Providers in Mumbai',
    description: 'Ten managed IT service companies in Mumbai, from TCS, Wipro and Infosys to specialist firms, with what to consider when choosing a provider.',
  },
  'why-cloud-computing-services-are-essential-for-indian-startups': {
    title: 'Why Indian Startups Need Cloud Computing',
    description: 'How cloud computing helps Indian startups: pay-as-you-grow scaling, remote work, security and disaster recovery, faster launches and new technology.',
  },
  'understanding-devops-a-comprehensive-guide-for-beginners': {
    title: "What Is DevOps? A Beginner's Guide",
    description: "A beginner's guide to DevOps: what it is, the culture behind it, core practices like CI/CD and infrastructure as code, key tools, adoption and careers.",
  },
  'top-10-benefits-of-it-managed-services-for-indian-businesses': {
    title: '10 Benefits of Managed IT Services in India',
    description: 'Ten reasons Indian businesses use managed IT services: lower, predictable costs, stronger security, 24/7 support, scalability, expert skills and less risk.',
  },
  'the-future-of-it-managed-services-trends-and-innovations-in-2024': {
    title: 'IT Managed Services Trends: AI, Security, Cloud',
    description: 'Trends shaping IT managed services: AI and machine learning, cybersecurity, hybrid cloud, RPA, DevOps and predictive analytics, and the challenges ahead.',
  },
};
