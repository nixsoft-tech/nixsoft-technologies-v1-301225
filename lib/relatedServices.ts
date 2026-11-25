import { getServiceBySlug } from '../data/services';
import type { OfferingData } from '../types';

/**
 * Services that match what a blog post is about, for the post's "Related
 * Services" sidebar. Each rule's words are counted in the title (weighted)
 * and the body; the two best-scoring services win. Posts that match nothing
 * get DevOps and Cloud, the site's two broadest services.
 */
const RULES: [slug: string, words: RegExp][] = [
  ['db-management-services', /postgres|mysql|mariadb|mongodb|oracle|database|\bsql\b|replication|autovacuum/gi],
  ['devops-services', /devops|ci\/cd|kubernetes|docker|pipeline|terraform|ansible|infrastructure as code|\bit automation\b/gi],
  ['application-monitoring', /application (?:performance )?monitoring|application management|\bapm\b/gi],
  ['cloud-management-services', /\bcloud\b|\baws\b|azure|\bgcp\b/gi],
  ['security-testing', /security|cyber|vapt|penetration|vulnerabilit|compliance/gi],
  ['infrastructure-monitoring', /monitoring|observability|prometheus|grafana|zabbix/gi],
  ['it-managed-services', /managed services|managed it|service management|\bitsm\b|helpdesk/gi],
  ['automation-testing', /test automation|automation testing|automated testing|software quality/gi],
  ['robotics-process-automation', /\brpa\b|robotic process/gi],
  ['ai-infrastructure-services', /\bai\b|machine learning|\bgpu\b|\bllms?\b/gi],
];

const FALLBACK = ['devops-services', 'cloud-management-services'];
const TITLE_WEIGHT = 5;
const BODY_CAP = 8; // one long post shouldn't win on repetition alone

const count = (text: string, re: RegExp) => text.match(re)?.length ?? 0;

export function relatedServices(post: { title: string; content: string }, limit = 2): OfferingData[] {
  const body = post.content.replace(/<[^>]*>/g, ' ');
  const ranked = RULES
    .map(([slug, re]) => ({ slug, score: count(post.title, re) * TITLE_WEIGHT + Math.min(count(body, re), BODY_CAP) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.slug);
  const slugs = [...new Set([...ranked, ...FALLBACK])].slice(0, limit);
  return slugs.map((s) => getServiceBySlug(s)).filter((s): s is OfferingData => Boolean(s));
}
