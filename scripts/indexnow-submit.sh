#!/usr/bin/env bash
# Tell IndexNow search engines (Bing, Yandex, Seznam, Naver, Yep; one
# submission is shared with all of them) which pages changed. Google does
# not use IndexNow; it reads the sitemap.
#
# Run on the server after each deploy:
#   bash scripts/indexnow-submit.sh            # submit changed URLs
#   bash scripts/indexnow-submit.sh --dry-run  # only list them
#
# How it decides what changed: it fetches every URL in the live sitemap,
# hashes the page content (the prerendered #root, so a new JS bundle name
# alone doesn't count as a change) and compares with the hashes saved by the
# last successful run (STATE_FILE). New and changed URLs, plus URLs that
# left the sitemap (deleted pages), are sent in one POST. The first run
# sends every URL. IndexNow treats repeated unchanged submissions as spam,
# so unchanged pages are never re-sent.
#
# The key is public by design: it is served at https://nixsoftech.in/<key>.txt
# (public/<key>.txt) and only proves the submissions come from the site.

set -euo pipefail

SITE="${SITE:-https://nixsoftech.in}"
HOST="${SITE#https://}"
KEY="${INDEXNOW_KEY:-eb384c747342e823cf47593d879c753c}"
ENDPOINT="${INDEXNOW_ENDPOINT:-https://api.indexnow.org/indexnow}"
STATE_FILE="${STATE_FILE:-$HOME/.indexnow-nixsoftech.state}"
DRY_RUN=false
[ "${1:-}" = "--dry-run" ] && DRY_RUN=true

UA="Mozilla/5.0 (compatible; nixsoft-indexnow/1.0)"
fetch() { curl -fsS --max-time 30 -A "$UA" "$1"; }

# 0. The key file must be live, or every submission is rejected (403).
if [ "$(fetch "$SITE/$KEY.txt" 2>/dev/null || true)" != "$KEY" ]; then
  echo "ERROR: $SITE/$KEY.txt does not return the key. Deploy the site first." >&2
  exit 1
fi

# 1. Current URLs and a content hash for each.
urls=$(fetch "$SITE/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed -e 's#<loc>##' -e 's#</loc>##')
[ -n "$urls" ] || { echo "ERROR: no URLs found in $SITE/sitemap.xml" >&2; exit 1; }

new_state=$(mktemp)
trap 'rm -f "$new_state"' EXIT
while IFS= read -r url; do
  hash=$(fetch "$url" | tr -d '\n' | sed 's#.*<div id="root">##' | sha256sum | cut -c1-16)
  printf '%s %s\n' "$url" "$hash" >> "$new_state"
  sleep 0.3 # stay well under the site's rate limit
done <<< "$urls"

# 2. What changed since the last successful run.
touch "$STATE_FILE"
changed=$(sort "$new_state" | comm -23 - <(sort "$STATE_FILE") | cut -d' ' -f1)
removed=$(comm -13 <(cut -d' ' -f1 "$new_state" | sort) <(cut -d' ' -f1 "$STATE_FILE" | sort))
submit=$(printf '%s\n%s\n' "$changed" "$removed" | sed '/^$/d' | sort -u)
count=$(printf '%s' "$submit" | grep -c . || true)

echo "Sitemap URLs: $(wc -l < "$new_state"). New or changed: $(printf '%s' "$changed" | grep -c . || true). Removed: $(printf '%s' "$removed" | grep -c . || true)."
if [ "$count" -eq 0 ]; then
  echo "Nothing to submit."
  exit 0
fi
printf '%s\n' "$submit" | sed 's/^/  /'

if $DRY_RUN; then
  echo "Dry run: nothing submitted, state not saved."
  exit 0
fi

# 3. One POST with every URL (the limit is 10,000).
json_list=$(printf '%s\n' "$submit" | sed 's/.*/"&"/' | paste -sd, -)
body="{\"host\":\"$HOST\",\"key\":\"$KEY\",\"urlList\":[$json_list]}"
status=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 30 -X POST "$ENDPOINT" \
  -H 'Content-Type: application/json; charset=utf-8' --data "$body")

case "$status" in
  200|202)
    cp "$new_state" "$STATE_FILE"
    echo "IndexNow: submitted $count URL(s) (HTTP $status). State saved to $STATE_FILE."
    ;;
  *)
    echo "IndexNow: submission failed with HTTP $status (400 bad request, 403 key not valid, 422 URL/host mismatch, 429 too many requests). State not saved; the same URLs will be retried next run." >&2
    exit 1
    ;;
esac
