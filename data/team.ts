/**
 * Leadership: the Team section of /about and each director's profile page
 * (/team/<id>, pages/TeamMember.tsx). The same records feed the Person
 * structured data (lib/schema.ts), so the markup always matches the page.
 * Only add facts that are shown on the page and verified.
 */
export interface TeamMember {
  /** Stable slug: the profile URL (/team/<id>) and the Person schema @id. */
  id: string;
  name: string;
  role: string;
  photo: string;
  email: string;
  bio: string;
  focus: string[];
  /** Public profile URLs (e.g. LinkedIn). Leave empty until confirmed. */
  sameAs?: string[];
  /** Search description for the profile page (about 150 characters, from the bio). */
  seoDescription: string;
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
    focus: ['Business Strategy', 'Client Success', 'IT Leadership'],
    seoDescription: 'Wajid Shaikh is a Director at Nixsoft Technologies with 20+ years in IT, leading the company’s strategy, client relationships and delivery teams.'
  },
  {
    id: 'pravin-kore',
    name: 'Pravin Kore',
    role: 'Director',
    photo: '/images/team/pravin-kore.webp',
    email: 'pravin@nixsoftech.in',
    sameAs: ['https://www.linkedin.com/in/pravin-h-kore'],
    bio: 'Pravin brings 15+ years of experience leading IT infrastructure management, architecture and design. He has run server, cloud and data-centre operations across Linux, UNIX, Solaris and virtualisation platforms, and leads Nixsoft’s technical delivery in DevOps, cloud and open-source architecture.',
    focus: ['Infrastructure Architecture', 'Cloud & DevOps', 'Open Source'],
    seoDescription: 'Pravin Kore is a Director at Nixsoft Technologies with 15+ years in IT infrastructure, cloud and DevOps. He technically reviews every Nixsoft blog article.'
  }
];

/** The director who technically reviews every blog post (shown on each post). */
export const BLOG_REVIEWER_ID = 'pravin-kore';

/** Profile page path for a director. */
export const teamPath = (member: Pick<TeamMember, 'id'>) => `/team/${member.id}`;

export const getTeamMember = (id?: string): TeamMember | undefined =>
  TEAM.find((m) => m.id === id);
