import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, ChevronLeft, Linkedin, Mail } from 'lucide-react';
import SEO from '../components/SEO';
import NotFound from './NotFound';
import { TEAM, BLOG_REVIEWER_ID, getTeamMember, teamPath } from '../data/team';
import { absUrl, itemListNode, personId, personNode } from '../lib/schema';
import { getBlogPosts, peekBlogPosts } from '../services/blogService';
import type { BlogPost } from '../types';

/**
 * A director's profile page (/team/<id>): photo, role, bio, focus areas and
 * contact links, with a ProfilePage + Person graph. The blog reviewer's page
 * also lists the articles he has technically reviewed (every post shows him as
 * reviewer and links here). Content comes only from data/team.ts and the blog,
 * so it stays in step with /about and the post pages.
 */
const TeamMember: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const member = getTeamMember(slug);
  const isReviewer = member?.id === BLOG_REVIEWER_ID;

  // Prerendered reviewer page starts with the post list in the cache.
  const [posts, setPosts] = useState<BlogPost[]>(() => (isReviewer ? peekBlogPosts() ?? [] : []));

  useEffect(() => {
    if (!isReviewer || peekBlogPosts()) return;
    let live = true;
    getBlogPosts().then((data) => { if (live) setPosts(data); });
    return () => { live = false; };
  }, [isReviewer]);

  if (!member) return <NotFound />;

  const path = teamPath(member);
  const firstName = member.name.split(' ')[0];
  const others = TEAM.filter((m) => m.id !== member.id);
  const linkedIn = member.sameAs?.filter((u) => u.includes('linkedin.com')) ?? [];
  const reviewed = isReviewer ? posts : [];

  return (
    <div className="flex flex-col">
      <SEO
        title={`${member.name}, ${member.role}`}
        description={member.seoDescription}
        path={path}
        ogType="profile"
        ogImage={absUrl(member.photo)}
        keywords={`${member.name}, Nixsoft Technologies ${member.role}, ${member.focus.join(', ')}`}
        pageType="ProfilePage"
        breadcrumbs={[
          { name: 'About', path: '/about' },
          { name: member.name, path },
        ]}
        mainEntityId={personId(member)}
        entities={[
          personNode(member),
          ...(reviewed.length > 0
            ? [itemListNode(path, reviewed.map((p) => ({ name: p.title, path: `/blog/${p.slug}` })))]
            : []),
        ]}
      />

      {/* Header: photo, name, role */}
      <section className="bg-nixDark pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nixBlue/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link to="/about#team" className="inline-flex items-center text-slate-300 hover:text-white font-semibold mb-10 group">
            <ChevronLeft size={20} className="mr-1 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            Our leadership
          </Link>
          <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
            <img
              src={member.photo}
              alt={`${member.name}, ${member.role} at Nixsoft Technologies`}
              width={192}
              height={192}
              fetchPriority="high"
              className="w-48 h-48 rounded-full object-cover object-top ring-4 ring-white/20 shadow-2xl bg-slate-700 shrink-0"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">{member.name}</h1>
              <p className="mt-3 text-lg font-semibold uppercase tracking-wide text-nixOrange">
                {member.role}, Nixsoft Technologies
              </p>
              <ul className="mt-6 flex flex-wrap justify-center md:justify-start gap-2">
                {member.focus.map((f) => (
                  <li key={f} className="text-xs font-semibold text-nixGreen bg-nixGreen/10 border border-nixGreen/30 px-3 py-1 rounded-full">{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bio and contact */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">About {firstName}</h2>
            <p className="text-lg text-slate-600 leading-relaxed">{member.bio}</p>
          </div>
          <aside className="bg-slate-50 rounded-2xl border border-slate-100 p-8 h-fit">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Contact {firstName}</h2>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${member.email}`} className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-nixBlue transition-colors break-all">
                <Mail size={16} className="mr-2 shrink-0" aria-hidden="true" /> {member.email}
              </a>
              {linkedIn.map((u) => (
                <a key={u} href={u} target="_blank" rel="noopener noreferrer me" className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-nixBlue transition-colors">
                  <Linkedin size={16} className="mr-2 shrink-0" aria-hidden="true" /> LinkedIn profile
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* Articles reviewed (blog reviewer only) */}
      {reviewed.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-2 flex items-center">
              <BookOpen size={24} className="mr-3 text-nixBlue" aria-hidden="true" />
              Articles technically reviewed by {firstName}
            </h2>
            <p className="text-slate-600 mb-8">
              {firstName} checks every article on the <Link to="/blog" className="text-nixBlue font-semibold hover:underline">Nixsoft blog</Link> for technical accuracy before it is published.
            </p>
            <ul className="grid md:grid-cols-2 gap-4">
              {reviewed.map((p) => (
                <li key={p.id}>
                  <Link to={`/blog/${p.slug}`} className="block h-full bg-white rounded-xl border border-slate-200 p-5 hover:border-nixBlue transition-colors group">
                    <span className="font-bold text-slate-900 group-hover:text-nixBlue">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* The other director(s) and a way in */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          {others.map((o) => (
            <Link key={o.id} to={teamPath(o)} className="flex items-center gap-4 group">
              <img src={o.photo} alt="" width={64} height={64} loading="lazy" className="w-16 h-16 rounded-full object-cover object-top bg-slate-100" />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Also leading Nixsoft</span>
                <span className="block font-bold text-slate-900 group-hover:text-nixBlue">{o.name}, {o.role}</span>
              </span>
            </Link>
          ))}
          <Link to="/contact" className="inline-flex items-center bg-nixOrange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors">
            Talk to our team <ArrowRight size={18} className="ml-2" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TeamMember;
