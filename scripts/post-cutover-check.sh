#!/usr/bin/env bash
# Post-cutover checks for the nixsoftech.in domain swap (DigitalOcean -> EC2).
#
#   bash scripts/post-cutover-check.sh
#   EXPECTED_IP=13.232.118.191 bash scripts/post-cutover-check.sh
#
# Run right after DNS is switched, and again any time later. Read-only: it
# only makes HTTP and DNS-over-HTTPS requests, so it can run from the EC2
# server or any machine with bash, curl and openssl.
#
# Covers what can be checked automatically: DNS, email DNS records, TLS,
# http->https and www->apex redirects, indexability (robots/noindex/sitemap),
# the production build's settings, the WordPress blog, the API, and the
# old-site URL redirects. NOT covered (test by hand): sending/receiving email,
# the contact form, NixBot answers, and the Google Analytics Realtime report.
#
# Exit code: 0 if nothing FAILed (WARNs allowed), 1 otherwise.
#
# Environment overrides:
#   DOMAIN       site apex             (default nixsoftech.in)
#   BLOG_HOST    WordPress host        (default blog.$DOMAIN)
#   WWW_HOST     www host              (default www.$DOMAIN)
#   EXPECTED_IP  EC2 Elastic IP; when unset, the script only checks that all
#                hosts agree and none still points at the old server
#   OLD_IP       old DigitalOcean IP   (default 104.236.2.104)
#   GA_ID        GA4 measurement ID    (default G-MMF22YW499)

set -u

DOMAIN="${DOMAIN:-nixsoftech.in}"
BLOG_HOST="${BLOG_HOST:-blog.$DOMAIN}"
WWW_HOST="${WWW_HOST:-www.$DOMAIN}"
EXPECTED_IP="${EXPECTED_IP:-}"
OLD_IP="${OLD_IP:-104.236.2.104}"
GA_ID="${GA_ID:-G-MMF22YW499}"
SITE="https://$DOMAIN"

# nginx-proxy allows 100 requests/min per IP (burst 50); pace the redirect
# sweep so the check itself doesn't trip the limit and report false 503s.
PACE=0.7

PASSES=0; FAILS=0; WARNS=0
if [ -t 1 ]; then G=$'\e[32m'; R=$'\e[31m'; Y=$'\e[33m'; B=$'\e[1m'; N=$'\e[0m'; else G=; R=; Y=; B=; N=; fi
pass()    { PASSES=$((PASSES+1)); echo "  ${G}PASS${N}  $*"; }
fail()    { FAILS=$((FAILS+1));   echo "  ${R}FAIL${N}  $*"; }
warn()    { WARNS=$((WARNS+1));   echo "  ${Y}WARN${N}  $*"; }
section() { echo; echo "${B}== $* ==${N}"; }

# curl wrapper: never hang, never follow redirects unless asked.
c() { curl -s --max-time 15 "$@"; }
status()   { c -o /dev/null -w '%{http_code}' "$1"; }
location() { c -I "$1" | tr -d '\r' | awk 'tolower($1)=="location:" {print $2}' | tail -1; }
header()   { c -I "$1" | tr -d '\r' | grep -i "^$2:" | head -1 | cut -d' ' -f2-; }

# A records via public DNS-over-HTTPS resolvers, so the answer reflects the
# internet, not this machine's cache. Prints the last A record (after CNAMEs).
doh_a() { # $1=resolver(google|cloudflare) $2=name
  local url
  if [ "$1" = google ]; then url="https://dns.google/resolve?name=$2&type=A"
  else url="https://cloudflare-dns.com/dns-query?name=$2&type=A"; fi
  c -H 'accept: application/dns-json' "$url" \
    | grep -oE '"type": ?1,[^}]*"data": ?"[0-9.]+"' | grep -oE '[0-9]+(\.[0-9]+){3}' | tail -1
}
doh_records() { # $1=name $2=type -> one record per line
  c -H 'accept: application/dns-json' "https://cloudflare-dns.com/dns-query?name=$1&type=$2" \
    | grep -oE '"data": ?"([^"\\]|\\.)*"' | sed -E 's/"data": ?"//; s/"$//; s/\\"//g'
}

echo "${B}Post-cutover check for $SITE${N}  (blog: $BLOG_HOST)  $(date -u '+%Y-%m-%d %H:%M UTC')"

# -----------------------------------------------------------------------------
section "1. DNS"
first_ip=""
for h in "$DOMAIN" "$WWW_HOST" "$BLOG_HOST"; do
  g=$(doh_a google "$h"); cf=$(doh_a cloudflare "$h")
  if [ -z "$g" ] || [ -z "$cf" ]; then fail "$h does not resolve (google='$g' cloudflare='$cf')"; continue; fi
  if [ "$g" != "$cf" ]; then warn "$h: resolvers disagree (google $g, cloudflare $cf) — still propagating"; fi
  if [ "$g" = "$OLD_IP" ] || [ "$cf" = "$OLD_IP" ]; then fail "$h still points at the OLD server $OLD_IP"; continue; fi
  if [ -n "$EXPECTED_IP" ] && [ "$g" != "$EXPECTED_IP" ]; then fail "$h -> $g, expected $EXPECTED_IP"; continue; fi
  [ -z "$first_ip" ] && first_ip="$g"
  if [ "$g" != "$first_ip" ]; then fail "$h -> $g, but $DOMAIN -> $first_ip"; else pass "$h -> $g"; fi
done

section "2. Email DNS records (must be unchanged by the swap)"
mx=$(doh_records "$DOMAIN" MX)
if echo "$mx" | grep -qi 'aspmx.l.google.com'; then pass "MX points to Google Workspace"; else fail "MX records missing Google Workspace (got: $(echo $mx))"; fi
txt=$(doh_records "$DOMAIN" TXT)
if echo "$txt" | grep -q 'v=spf1.*_spf.google.com'; then pass "SPF record present (includes Google)"; else fail "SPF record missing or lost _spf.google.com"; fi
if echo "$txt" | grep -q 'google-site-verification='; then pass "Google site-verification TXT present (Search Console)"; else warn "google-site-verification TXT missing — Search Console may lose verification"; fi
if doh_records "_dmarc.$DOMAIN" TXT | grep -q 'v=DMARC1'; then pass "DMARC record present"; else fail "DMARC record missing"; fi
if doh_records "google._domainkey.$DOMAIN" TXT | grep -q 'v=DKIM1'; then pass "Google DKIM key present"; else fail "Google DKIM key (google._domainkey) missing"; fi

# -----------------------------------------------------------------------------
section "3. HTTPS certificates"
for h in "$DOMAIN" "$WWW_HOST" "$BLOG_HOST"; do
  # Verifies the chain against the system CA store AND that the cert covers $h.
  tls=$(echo | openssl s_client -servername "$h" -connect "$h:443" -verify_hostname "$h" -verify_return_error 2>&1)
  if ! echo "$tls" | grep -q 'Verify return code: 0 (ok)'; then
    why=$(echo "$tls" | grep -m1 -E 'verify error|Verify return code' | sed 's/^ *//')
    fail "https://$h — certificate not valid for $h (${why:-no TLS connection})"; continue
  fi
  end=$(echo "$tls" | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
  if [ -z "$end" ]; then warn "https://$h — valid, but couldn't read the expiry date"; continue; fi
  days=$(( ( $(date -d "$end" +%s) - $(date +%s) ) / 86400 ))
  if [ "$days" -lt 14 ]; then fail "https://$h — certificate expires in $days days"; else pass "https://$h — valid certificate, $days days left"; fi
done

section "4. Redirects to the canonical https://$DOMAIN"
for h in "$DOMAIN" "$WWW_HOST" "$BLOG_HOST"; do
  code=$(status "http://$h/"); loc=$(location "http://$h/")
  if [ "$code" = 301 ] && [[ "$loc" == https://* ]]; then pass "http://$h -> $loc"; else fail "http://$h should 301 to https (got $code ${loc:-no Location})"; fi
done
code=$(status "https://$WWW_HOST/services"); loc=$(location "https://$WWW_HOST/services")
if [ "$code" = 301 ] && [ "$loc" = "$SITE/services" ]; then pass "https://$WWW_HOST/services -> $loc (path kept)"
else fail "https://$WWW_HOST should 301 to $SITE, keeping the path (got $code ${loc:-no Location})"; fi

# -----------------------------------------------------------------------------
section "5. Search engines can index the site"
xr=$(header "$SITE/" x-robots-tag)
if [ -z "$xr" ]; then pass "no X-Robots-Tag on the home page"; else fail "X-Robots-Tag: $xr — delete the UAT noindex blocks in nginx-proxy/conf.d/default.conf"; fi
asset=$(c "$SITE/" | grep -oE '/assets/index-[^"]+\.js' | head -1)
if [ -n "$asset" ]; then
  xr=$(header "$SITE$asset" x-robots-tag)
  if [ -z "$xr" ]; then pass "no X-Robots-Tag on static assets"; else fail "X-Robots-Tag on static assets ($asset): $xr — the repeat inside the asset location block was left in"; fi
fi
robots=$(c "$SITE/robots.txt")
if echo "$robots" | grep -qE '^Disallow: */ *$'; then fail "robots.txt blocks the whole site (Disallow: /) — restore public/robots.txt for production"
elif echo "$robots" | grep -qiE '^User-agent'; then pass "robots.txt allows crawling"
else fail "robots.txt missing or not plain text"; fi
if echo "$robots" | grep -qiE "^Sitemap: *$SITE/sitemap.xml"; then pass "robots.txt lists $SITE/sitemap.xml"; else warn "robots.txt has no 'Sitemap: $SITE/sitemap.xml' line"; fi
sm=$(c "$SITE/sitemap.xml")
locs=$(echo "$sm" | grep -o '<loc>' | wc -l)
if ! echo "$sm" | grep -q '<urlset'; then fail "sitemap.xml is not an XML sitemap"
elif echo "$sm" | grep -o '<loc>[^<]*' | grep -vq "<loc>$SITE/"; then fail "sitemap.xml has URLs outside $SITE (UAT or www hostnames?)"
else pass "sitemap.xml has $locs URLs, all on $SITE"; fi

# -----------------------------------------------------------------------------
section "6. Production build and pages"
if [ -z "$asset" ]; then fail "couldn't find the app bundle (/assets/index-*.js) on $SITE/"
else
  bundle=$(c "$SITE$asset")
  # The WordPress URL lives in the lazy-loaded blog chunk, so search them all.
  all_js="$bundle"
  for chunk in $(echo "$bundle" | grep -oE 'assets/[A-Za-z0-9_.-]+\.js' | sort -u); do
    all_js="$all_js
$(c "$SITE/$chunk")"
    sleep 0.3
  done
  if echo "$all_js" | grep -q "https://$BLOG_HOST/wp-json"; then pass "app is built against https://$BLOG_HOST/wp-json"
  else fail "app build doesn't use https://$BLOG_HOST/wp-json — set VITE_WORDPRESS_API_URL in docker-compose.yml and rebuild"; fi
  if [ "$DOMAIN" = nixsoftech.in ] && echo "$all_js" | grep -q 'new\.nixsoftech\.in'; then
    fail "app build still references new.nixsoftech.in (UAT)"
  fi
  if echo "$bundle" | grep -q "$GA_ID"; then pass "Google Analytics $GA_ID is in the build (verify in GA Realtime)"; else fail "Google Analytics $GA_ID not found in the build"; fi
fi
csp=$(header "$SITE/" content-security-policy-report-only)$(header "$SITE/" content-security-policy)
if echo "$csp" | grep -qE "connect-src[^;]*https://$BLOG_HOST"; then pass "CSP connect-src allows https://$BLOG_HOST"
else fail "CSP connect-src doesn't include https://$BLOG_HOST — update it in nginx-proxy/conf.d/default.conf"; fi
for p in / /services /services/devops-services /solutions /products /industries /clients /about /blog /contact /privacy-policy /images/team/pravin-kore.webp /og-image.png; do
  code=$(status "$SITE$p")
  if [ "$code" = 200 ]; then pass "$p 200"; else fail "$p returned $code"; fi
  sleep "$PACE"
done
code=$(status "$SITE/api/chat")   # GET isn't a route: Express answers 404, a dead backend gives 502
case "$code" in 502|503|504|000) fail "backend API unreachable (/api/chat GET -> $code) — try: docker compose restart nginx-proxy";;
                *) pass "backend API is up (/api/chat GET -> $code)";; esac

# -----------------------------------------------------------------------------
section "7. WordPress blog ($BLOG_HOST)"
hdrs=$(c -I -H "Origin: $SITE" "https://$BLOG_HOST/wp-json/wp/v2/posts?per_page=100" | tr -d '\r')
total=$(echo "$hdrs" | awk 'tolower($1)=="x-wp-total:" {print $2}')
if [ "$total" = 17 ]; then pass "WordPress API: 17 published posts"
elif [ -n "$total" ]; then warn "WordPress API: $total published posts (expected 17 — duplicate '-2' posts still published?)"
else fail "WordPress API not responding at https://$BLOG_HOST/wp-json/wp/v2/posts"; fi
if echo "$hdrs" | grep -qi "^access-control-allow-origin: *\($SITE\|\*\)"; then pass "WordPress API allows browser requests from $SITE (CORS)"
else fail "WordPress API has no Access-Control-Allow-Origin for $SITE — the blog page can't load posts"; fi
if [ "$DOMAIN" = nixsoftech.in ]; then
  n=$(c "https://$BLOG_HOST/wp-json/wp/v2/posts?per_page=100&_fields=content" | grep -o 'blog\.new\.nixsoftech\.in' | wc -l)
  if [ "$n" -eq 0 ]; then pass "post content has no blog.new.nixsoftech.in links"
  else fail "post content still has $n links to blog.new.nixsoftech.in — run: wp search-replace 'blog.new.nixsoftech.in' '$BLOG_HOST'"; fi
fi
code=$(status "https://$BLOG_HOST/wp-login.php")
if [ "$code" = 200 ]; then pass "WordPress login page is up (https://$BLOG_HOST/wp-admin)"; else fail "https://$BLOG_HOST/wp-login.php returned $code"; fi
loc=$(location "$SITE/wp-admin")
if [ "$loc" = "https://$BLOG_HOST/wp-admin" ]; then pass "$SITE/wp-admin -> $loc"; else fail "$SITE/wp-admin should redirect to https://$BLOG_HOST/wp-admin (got ${loc:-no redirect})"; fi

# -----------------------------------------------------------------------------
section "8. Old-site URLs redirect (sample of the busiest, plus every blog post)"
# old path | expected Location (nginx sends site-relative redirects)
REDIRECTS='
/about-us/|/about
/contact-us/|/contact
/nixsoft-blog/|/blog
/service/|/services
/service/it-managed-services/|/services/it-managed-services
/service/devops-automation/|/services/devops-services
/service/cloud-managed-service/|/services/cloud-management-services
/service/database-management-service/|/services/db-management-services
/service/application-performance-monitoring/|/services/application-monitoring
/service/middleware-services/|/services/middleware-services
/asset-management/|/solutions/asset-management
/email-collaboration/|/solutions/email-collaboration
/ticketing-system/|/solutions/ticketing-system
/it-service-management/|/services
/get-quote/|/contact
/raise-ticket/|/contact
/team/pravin-kore/|/about#team
/category/blog/|/blog
/tag/devops/|/blog
/category-service/rpa/|/services/robotics-process-automation
/feed/|/blog
/about-us-2/|/about
'
BLOG_SLUGS='
the-essential-role-of-it-automation-in-modern-business-operations
scaling-postgresql-for-high-traffic-applications-tips-and-best-practices
securing-postgresql-essential-tips-to-protect-your-database
turbocharge-your-mysql-10-essential-tips-for-lightning-fast-performance
the-dark-side-of-application-management-secrets-your-it-department-doesnt-want-you-to-know
top-10-benefits-of-it-managed-services-for-indian-businesses
the-future-of-it-managed-services-trends-and-innovations-in-2024
understanding-devops-a-comprehensive-guide-for-beginners
why-cloud-computing-services-are-essential-for-indian-startups
top-10-it-managed-services-support-and-solution-providers-in-mumbai
the-rise-of-open-source-solutions-in-financial-tech-opportunities-and-challenges
how-ai-and-machine-learning-are-transforming-industries
top-aws-cloud-management-best-practices-for-2024
top-5-essential-cybersecurity-services-every-business-needs
how-automation-testing-enhances-software-quality-and-efficiency
open-source-tools-for-it-operations-monitoring-a-comprehensive-review
streamlining-operations-with-it-service-management-using-open-source-tools
'
for s in $BLOG_SLUGS; do REDIRECTS="$REDIRECTS
/$s/|/blog/$s"; done

bad=0; checked=0
while IFS='|' read -r from to; do
  [ -z "$from" ] && continue
  checked=$((checked+1))
  hdr=$(c -I "$SITE$from" | tr -d '\r')
  code=$(echo "$hdr" | head -1 | awk '{print $2}')
  loc=$(echo "$hdr" | awk 'tolower($1)=="location:" {print $2}' | tail -1)
  loc="${loc#$SITE}"   # accept absolute or relative Location
  if [ "$code" = 301 ] && [ "$loc" = "$to" ]; then :; else
    bad=$((bad+1)); fail "$from -> expected 301 $to, got ${code:-no response} ${loc:-no Location}"
  fi
  sleep "$PACE"
done <<< "$REDIRECTS"
[ "$bad" -eq 0 ] && pass "all $checked old URLs redirect correctly"

code=$(status "$SITE/wp-content/uploads/2019/09/logo-min.png"); loc=$(location "$SITE/wp-content/uploads/2019/09/logo-min.png")
if [ "$code" = 301 ] && [[ "$loc" == "https://$BLOG_HOST/wp-content/uploads/"* ]]; then pass "old /wp-content/uploads/ images redirect to $BLOG_HOST"
else warn "old /wp-content/uploads/ image URLs don't redirect to $BLOG_HOST yet (got $code ${loc:-no Location}) — Google Images and external links to old images will break"; fi

# -----------------------------------------------------------------------------
echo
echo "${B}Summary:${N} ${G}$PASSES passed${N}, ${Y}$WARNS warnings${N}, ${R}$FAILS failed${N}"
echo "Still check by hand: email in/out (SPF/DKIM/DMARC = PASS), contact form, NixBot, GA Realtime."
[ "$FAILS" -eq 0 ]
