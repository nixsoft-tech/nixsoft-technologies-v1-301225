# Remaining Fixes — Post-Review Tracker

**Project:** Nixsoft Technologies website & backend
**Status after fix pass (12 Jul 2026):** All 4 Critical and 6 High findings resolved in code.
**Current UAT verdict:** ✅ Ready with Minor Issues — the items below are the "minor issues".

---

## 🔴 Action required before UAT (cannot be done in code)

| # | Item | Why | Owner |
|---|------|-----|-------|
| 1 | **Rotate the exposed Gemini API key** (`AIzaSy…6IE`) | It was committed in `docker-compose.yml` and `.env.local` — treat as compromised. Regenerate in Google AI Studio, put the new key in `.env` as `GEMINI_API_KEY`. | You |
| 2 | **Set fresh production credentials in `.env`** | `cp .env.example .env`, then set strong values for `ADMIN_PASSWORD`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`, and the real `SMTP_PASS`. The old values (`Nixsoft@2026`, `wp_password`, `root_password`) were committed — do not reuse them. | You |
| 3 | **Supply `og-image.png`, `logo.png`, `favicon.ico`** | All three are referenced by `index.html`, `SEO.tsx`, and `Schema.tsx` but do not exist in `public/` — they 404 today. Social shares render blank and the Organization schema's required `logo` field fails the Rich Results Test. Needs real brand assets from design; not something code can generate. | You / Design |
| 4 | **Re-create the `www` → apex 301 in nginx at cutover** | `https://www.nixsoftech.in` currently 301s to the apex, but that redirect is served by the **old WordPress/Apache** stack (`X-Redirect-By: WordPress`). It is not in `nginx-proxy/conf.d/default.conf`. When DNS moves to the new stack the redirect vanishes, and www + apex both serve 200 → duplicate content against the canonicals now pointing at the apex. | DevOps |

---

## 🟡 Medium — recommended before or during UAT

### 1. No Content-Security-Policy header
- **Where:** `nginx-proxy/conf.d/default.conf` (security headers block, ~line 61)
- **Issue:** HSTS, X-Frame-Options, etc. are set, but no CSP. The app renders external HTML (blog posts, chat replies), so CSP is meaningful defense-in-depth even now that DOMPurify covers both paths.
- **Fix:** Add `Content-Security-Policy` (start with `script-src 'self'`; restrict `object-src`, `frame-ancestors`). Roll out as `Content-Security-Policy-Report-Only` first to catch breakage (Google Fonts and the Google Maps iframe on `/contact` will need allowances).

### 2. Outdated dependencies with published advisories
- **Where:** root `package.json`
- **Issue:** `npm audit` flags installed `dompurify` (multiple sanitizer-bypass advisories) and `react-router` 7.x (DoS + CSRF advisories). Both have patched versions available.
- **Fix:** `npm audit fix`, rebuild, re-run audit until clean. Also remove `@google/generative-ai` from the **root** `package.json` — the frontend no longer uses it (it now lives in `server/package.json`).

### 3. Chat transcripts hold PII with no retention policy
- **Where:** `server/index.js` (`/api/chat/log`), `chat_logs` Docker volume
- **Issue:** Visitor conversations (may include names, emails, phone numbers) are stored as plaintext JSON indefinitely.
- **Fix:** Decide a retention window (e.g. 90 days), add a purge job (cron or on-startup sweep deleting files older than the window), and confirm `pages/PrivacyPolicy.tsx` discloses chat logging.

### 4. Admin log endpoint loads all history, unpaginated
- **Where:** `server/index.js` (`GET /api/admin/chats`)
- **Issue:** Reads and parses every day's log file on each request. Degrades linearly as history accumulates.
- **Fix:** Accept `?from=YYYY-MM-DD&to=YYYY-MM-DD` and only read files in range; default to the last 30 days. (A retention policy from item 3 also caps this.)

### 5. No automated tests
- **Where:** repo-wide (no `*.test.*`, no CI)
- **Issue:** No regression safety net. The admin-login bug that blocked the dashboard would have been caught by a single integration test.
- **Fix:** Minimum viable set — integration tests for `/api/admin/chats` (auth success/failure/lockout), `/api/contact` (validation + 503 path), and `/api/chat` (demo mode + invalid input). Supertest + a test runner is enough; wire into CI when one exists.

### 6. ~~HTTPS bring-up still needs a manual edit~~ ✅ Resolved
- `init-letsencrypt.sh` now uncomments the `ssl_certificate` / `include` / `ssl_dhparam`
  lines automatically after the temporary cert is created, and was fixed to work with
  Docker Compose v2 (`docker compose`) and the named `certbot_conf` volume.

---

## 🟢 Low — quality improvements, not UAT blockers

### 7. Admin auth is still a single shared password
- **Where:** `server/index.js`
- **Now hardened with:** Bearer parsing, timing-safe compare, fail-closed startup, per-IP lockout.
- **Remaining:** It's still one static credential granting access to all transcripts. Longer-term: session/JWT auth with a hashed credential, or put the route behind existing SSO.

### 8. TypeScript strict mode is off
- **Where:** `tsconfig.json`
- **Fix:** Add `"strict": true` and clear errors incrementally. Also add `"types": ["node", "vite/client"]` — its absence is why `tsc --noEmit` currently reports `import.meta.env` errors on every page.

### 9. No caching for WordPress content
- **Where:** `services/blogService.ts`
- **Fix:** Short-TTL cache (in-memory/sessionStorage or CDN) in front of the WP REST calls if blog traffic grows.

### 10. Sales-facing constants hardcoded
- **Where:** `components/ROICalculator.tsx` (`SAVINGS_RATE = 0.40`, `$500/server`)
- **Fix:** Move to a shared constants file so marketing claims are updated in one place.

### 11. Main JS bundle is 782 kB (233 kB gzipped)
- **Where:** Vite build output (single chunk warning)
- **Fix:** Code-split with dynamic `import()` — `recharts` and the admin page are good candidates since most visitors never load them.

---

## ✅ Fixed in UAT review pass (16 Jul 2026)

Triggered by *NIXSOFT WEBSITE UAT REVIEW REPORT v1.0*. Note that much of that
report was inaccurate — it was written without code access, and claimed the
sitemap, meta descriptions, schema markup, security headers, 301 redirects, and
the Products/Industries content were all missing. Every one of those already
existed. The two genuinely critical defects below were **not** in the report.

| Severity | Finding | Resolution |
|----------|---------|------------|
| Critical | **Every canonical pointed at the homepage.** Canonicals used HashRouter format (`/#/about`) while the app runs `BrowserRouter`. Search engines drop the `#` fragment, so all 7 inner pages declared `https://new.nixsoftech.in/` as canonical — instructing Google to deindex them. | `SEO.tsx` now takes a site-relative `path` and builds the URL from `SITE_URL`, so a full URL can't be passed wrong. Verified in-browser: all 8 routes emit unique correct canonicals. |
| Critical | **Canonicals + schema pointed at the UAT domain.** `new.nixsoftech.in` was hardcoded in 9 pages, `Schema.tsx`, and `index.html`. At go-live, production pages would have canonicalized to a staging host that is itself `noindex`. | Single source of truth: `SITE_URL` in `constants.ts`, defaulting to `https://nixsoftech.in` (the apex — `www` 301s to it), overridable via `VITE_SITE_URL`. |
| Critical | UAT was fully indexable (`Allow: /`, no `noindex`) — the report's one valid critical finding. | `X-Robots-Tag: noindex, nofollow, noarchive` + a `Disallow: /` robots.txt override on both `new.nixsoftech.in` and `blog.new.nixsoftech.in`. Uses a header, not a meta tag, because a CSR app's meta tag only exists after JS runs. Scoped to the UAT vhosts, so production needs no revert. |
| Medium | Sitemap omitted `/industries` and `/clients`. | Added; `lastmod` refreshed. (Its domain was already correct.) |

> ⚠️ The nginx changes were **not** machine-verified — Docker was unavailable in
> that session. Run `nginx -t` before reloading the proxy.

### 🚀 Production cutover checklist (UAT `new.nixsoftech.in` → prod `nixsoftech.in`)

The UAT hostname is baked into six places. This list is file-specific — unlike
the generic checklist in the review report, which misses most of them.

| # | File | Change |
|---|------|--------|
| 1 | `nginx-proxy/conf.d/default.conf` | **Delete both UAT noindex blocks** — the `X-Robots-Tag` server headers, the repeat inside the static-asset location, and both `location = /robots.txt` overrides. Leaving any in place silently deindexes production. |
| 2 | `nginx-proxy/conf.d/default.conf` | `server_name` → `nixsoftech.in` (L24, L43) and `blog.nixsoftech.in` (L142). |
| 3 | `nginx-proxy/conf.d/default.conf` | **Add a `www.nixsoftech.in` → apex 301 server block.** Today's www→apex redirect is served by the old WordPress/Apache stack and is lost the moment DNS moves. Without it, www and apex both serve 200. |
| 4 | `nginx-proxy/conf.d/default.conf` | CSP (L67): swap `new.nixsoftech.in` / `blog.new.nixsoftech.in` in `img-src` and `connect-src` for the production hosts. Missing this breaks the blog fetch and the CSP report. |
| 5 | `docker-compose.yml` | `VITE_WORDPRESS_API_URL` (L74) → production blog. `ALLOWED_ORIGINS` default (L61) → `https://nixsoftech.in`, or the contact form and chat 403. Leave `VITE_SITE_URL` **unset**. |
| 6 | `init-letsencrypt.sh` | `DOMAINS` (L17) → the production hostnames, incl. `www.nixsoftech.in` so the redirect block has a cert. |
| 7 | `public/robots.txt` | Already correct for production (`Allow: /` + apex sitemap) — the UAT block is at the nginx layer, so **no revert needed here**. |

Verify after cutover:
```bash
curl -sI https://nixsoftech.in | grep -i x-robots-tag   # expect: no output
curl -sI https://www.nixsoftech.in | grep -i location   # expect: 301 → apex
curl -s  https://nixsoftech.in/robots.txt               # expect: Allow: /, not Disallow: /
```

### Still open from that review

- **Prerendering / SSG.** The root cause behind the report's "no meta descriptions"
  claim: this is a pure CSR app, so every route serves the same `index.html` in raw
  HTML and per-page tags only appear after JS executes. The tags are correct now,
  but crawlers that don't render JS (and most social scrapers) never see them —
  `og:image` per-page previews silently fall back to the index.html default. Fix is
  `vite-plugin-ssg` or prerendering the ~9 static routes at build time. Highest-leverage
  remaining SEO item; scope separately.

## ✅ Fixed post-deployment (UAT bring-up)

| Finding | Resolution |
|---------|------------|
| Docker Compose v2 not usable (`docker-compose: command not found`) | `init-letsencrypt.sh`/`setup-uat.sh` now detect and use `docker compose` |
| `docker compose build` failed (`requires buildx 0.17.0 or later`) | `setup-uat.sh` now checks/installs a modern Buildx plugin |
| `init-letsencrypt.sh` wrote certs to a host path not used by `docker-compose.yml` | Rewritten to operate on the `certbot_conf` named volume via the certbot container |
| `nginx-proxy` crash-looped: `"ssl_session_timeout" directive is duplicate` | Removed SSL directives from `nginx-proxy/conf.d/default.conf` that duplicated Certbot's `options-ssl-nginx.conf` |
| `docker compose` refused to start (`required variable SMTP_PASS is missing`) | Softened `SMTP_PASS`/`GEMINI_API_KEY` to optional in `docker-compose.yml` — backend degrades gracefully instead |
| Certbot failed with DNS `NXDOMAIN` | DNS A records for `new.nixsoftech.in`/`blog.new.nixsoftech.in` were never created — added at the DNS provider |
| Visiting `/` (bare domain) 301-redirected to `/blog/index.html` instead of showing the home page | `nginx.conf`'s catch-all blog-slug redirect checked `$request_uri` instead of `$uri` — didn't account for `try_files`' internal redirect to `/index.html` on the root path. Fixed in [nginx.conf](nginx.conf); root now serves the home page correctly (verified live: `200` with no `Location` header) |

## ✅ Fixed in code review pass (for reference)

| Severity | Finding | Resolution |
|----------|---------|------------|
| Critical | Admin login could never succeed (Bearer prefix never stripped) | Server strips scheme; verified 401/200/lockout live |
| Critical | Live secrets committed in plaintext | All secrets moved to gitignored `.env` with `${VAR:?}` guards; rotation pending (see top) |
| Critical | Gemini API key shipped in browser bundle | Calls proxied via new `POST /api/chat`; bundle scanned clean |
| Critical | docker-compose ignored its own documented secrets flow | Compose now reads `.env`; DEPLOYMENT.md updated |
| High | Contact emails guaranteed to fail (placeholder SMTP_PASS) | Startup guard: warns and returns 503 until real credentials are set |
| High | Stored XSS via unsanitized WordPress content | `DOMPurify.sanitize()` in `BlogPost.tsx` |
| High | Weak admin auth (fail-open, no lockout, timing leak) | Fail-closed startup, timing-safe compare, 5-attempt/15-min lockout |
| High | Unrestricted CORS | Origin allow-list via `ALLOWED_ORIGINS`; blocked origins get clean 403 |
| High | Default DB credentials in compose | Env-driven with required-value guards |
| Medium | No server-side validation on `/api/contact` | Mirrors client rules; 400 on failure |
| Medium | Chat-log write race lost entries | Writes serialized through a promise queue |
| Low | SMTP transporter rebuilt per request | Created once at startup |
| Low | Non-constant-time credential comparison | `crypto.timingSafeEqual` |
