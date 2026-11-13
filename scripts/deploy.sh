#!/usr/bin/env bash
# Deploy the website (and the API) on the EC2 host, with safety checks.
#
# Usage, from the repo checkout on the server:
#   git pull && bash scripts/deploy.sh            # app + server (default)
#   git pull && bash scripts/deploy.sh app        # website only
#
# (git pull stays outside this script: a script that pulls a new version of
# itself while bash is still reading it can run a mix of old and new lines.)
#
# Steps, stopping at the first failure:
#   1. Build the new images. The running site is untouched until step 3.
#   2. Test the new app image's nginx config (nginx -t). A bad config stops
#      here, and the current containers keep serving.
#   3. Recreate the containers.
#   4. Test and reload nginx-proxy. This applies any proxy config change and
#      makes it look the containers up again (on 13 Nov 2026 recreated
#      containers got new IP addresses and the proxy, which had cached the old
#      ones, returned 502 for every page until it was reloaded).
#   5. Wait until the site, the API and the IndexNow key file answer.
#   6. Submit changed pages to IndexNow.
set -euo pipefail

cd "$(dirname "$0")/.."
SITE="https://nixsoftech.in"
KEY="eb384c747342e823cf47593d879c753c"
if [ $# -gt 0 ]; then SERVICES=("$@"); else SERVICES=(app server); fi

for s in "${SERVICES[@]}"; do
  case "$s" in app|server) ;; *) echo "deploy.sh: only 'app' and 'server' can be deployed with this script (got '$s')" >&2; exit 2 ;; esac
done

step() { printf '\n==> %s\n' "$*"; }

step "Building: ${SERVICES[*]}"
docker compose build "${SERVICES[@]}"

if printf '%s\n' "${SERVICES[@]}" | grep -qx app; then
  step "Testing the new app image's nginx config"
  docker compose run --rm --no-deps app nginx -t
fi

step "Starting the new containers"
docker compose up -d "${SERVICES[@]}"

step "Testing and reloading nginx-proxy"
docker compose exec -T nginx-proxy nginx -t
docker compose exec -T nginx-proxy nginx -s reload

step "Waiting for the live site"
status() { curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$1" || true; }
ok=false
for _ in $(seq 1 30); do
  if [ "$(status "$SITE/")" = 200 ] \
     && [ "$(status "$SITE/api/altcha/challenge")" = 200 ] \
     && [ "$(curl -s --max-time 10 "$SITE/$KEY.txt" || true)" = "$KEY" ]; then
    ok=true; break
  fi
  sleep 2
done
if ! $ok; then
  echo >&2
  echo "DEPLOY CHECK FAILED: $SITE/ -> $(status "$SITE/"), /api -> $(status "$SITE/api/altcha/challenge")" >&2
  echo "Try: docker compose restart nginx-proxy   then: docker compose ps   and   docker compose logs --tail=50 app server nginx-proxy" >&2
  exit 1
fi
echo "Site OK: / 200, /api 200, IndexNow key file served."

step "IndexNow"
bash scripts/indexnow-submit.sh

step "Deploy finished"
