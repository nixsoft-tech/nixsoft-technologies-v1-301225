#!/usr/bin/env node
// Verify the blog migration from the old WordPress site to the new headless one.
//
//   node scripts/verify-blog-migration.js
//   OLD_WP=https://nixsoftech.in NEW_WP=https://blog.new.nixsoftech.in node scripts/verify-blog-migration.js
//
// For every published post on the old site, checks that the new WordPress has
// a post with the SAME slug (so old URLs keep redirecting to /blog/<slug>), a
// featured image, and no images still loaded from the old site's uploads.
// Exits 1 if anything is missing. Read-only: uses the public REST APIs.

const OLD_WP = (process.env.OLD_WP || 'https://nixsoftech.in').replace(/\/+$/, '');
const NEW_WP = (process.env.NEW_WP || 'https://blog.new.nixsoftech.in').replace(/\/+$/, '');
const OLD_UPLOADS = `${new URL(OLD_WP).host}/wp-content/uploads/`;

async function allPosts(base) {
  const posts = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${base}/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=slug,title,featured_media,content,link`);
    if (res.status === 400) break; // past the last page
    if (!res.ok) throw new Error(`${base}: HTTP ${res.status}`);
    const batch = await res.json();
    posts.push(...batch);
    if (batch.length < 100) break;
  }
  return posts;
}

(async () => {
  const [oldPosts, newPosts] = await Promise.all([allPosts(OLD_WP), allPosts(NEW_WP)]);
  const bySlug = new Map(newPosts.map((p) => [p.slug, p]));
  let problems = 0;

  console.log(`Old site: ${oldPosts.length} posts   New site: ${newPosts.length} posts\n`);
  for (const old of oldPosts) {
    const post = bySlug.get(old.slug);
    const issues = [];
    if (!post) {
      issues.push('MISSING on new site (or slug changed)');
    } else {
      if (!post.featured_media) issues.push('no featured image');
      const oldImgs = (post.content.rendered.match(/src="[^"]+"/g) || []).filter((s) => s.includes(OLD_UPLOADS));
      if (oldImgs.length) issues.push(`${oldImgs.length} image(s) still loaded from ${OLD_UPLOADS}`);
    }
    problems += issues.length ? 1 : 0;
    console.log(`${issues.length ? '✖' : '✔'} ${old.slug}${issues.length ? `\n    ${issues.join('\n    ')}` : ''}`);
  }

  const extras = newPosts.filter((p) => !oldPosts.some((o) => o.slug === p.slug)).map((p) => p.slug);
  if (extras.length) console.log(`\nOnly on new site (check these are intended): ${extras.join(', ')}`);

  console.log(problems ? `\n${problems} post(s) need attention.` : '\nAll posts migrated correctly.');
  process.exit(problems ? 1 : 0);
})().catch((err) => { console.error(err.message); process.exit(2); });
