/**
 * Leadership shown in the Team section of /about. The same records feed the
 * Person structured data (lib/schema.ts), so the markup always matches the page.
 * Only add facts that are shown on the page and verified.
 */
export interface TeamMember {
  /** Stable slug, used in the Person schema @id (/about#<slug>). */
  id: string;
  name: string;
  role: string;
  photo: string;
  email: string;
  bio: string;
  focus: string[];
  /** Public profile URLs (e.g. LinkedIn). Leave empty until confirmed. */
  sameAs?: string[];
}

export const TEAM: TeamMember[] = [
  {
    id: 'wajid-shaikh',
    name: 'Wajid Shaikh',
    role: 'Director',
    photo: '/images/team/wajid-shaikh.webp',
    email: 'wajid@nixsoftech.in',
    sameAs: ['https://in.linkedin.com/in/abdul-wajid-shaikh-35808267'],
    bio: 'With more than 20 years in the IT industry, Wajid leads Nixsoft’s strategy and client relationships. He has worked at every level across organisations in different industry verticals, and focuses on understanding what clients need, guiding delivery teams to meet it, and measuring the results.',
    focus: ['Business Strategy', 'Client Success', 'IT Leadership']
  },
  {
    id: 'pravin-kore',
    name: 'Pravin Kore',
    role: 'Director',
    photo: '/images/team/pravin-kore.webp',
    email: 'pravin@nixsoftech.in',
    sameAs: ['https://www.linkedin.com/in/pravin-h-kore'],
    bio: 'Pravin brings 15+ years of experience leading IT infrastructure management, architecture and design. He has run server, cloud and data-centre operations across Linux, UNIX, Solaris and virtualisation platforms, and leads Nixsoft’s technical delivery in DevOps, cloud and open-source architecture.',
    focus: ['Infrastructure Architecture', 'Cloud & DevOps', 'Open Source']
  }
];
