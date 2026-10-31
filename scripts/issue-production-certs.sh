#!/usr/bin/env bash
# Issue the production certificate (nixsoftech.in, www, blog) BEFORE the DNS
# switch, so HTTPS works the moment DNS points at this server.
#
#   bash scripts/issue-production-certs.sh            # real certificate
#   STAGING=1 bash scripts/issue-production-certs.sh  # dry run, untrusted cert
#
# A normal (HTTP) challenge can't work yet — nixsoftech.in still points at the
# old server — so this proves ownership through a temporary TXT record that
# certbot creates and deletes in the DigitalOcean DNS zone.
#
# Needs ./digitalocean.ini in the repo root (gitignored), containing:
#   dns_digitalocean_token = <DigitalOcean API token with write access to DNS>
# Create the token at https://cloud.digitalocean.com/account/api/tokens and
# delete it once the certificate is issued — renewals don't need it (see the
# certbot service in docker-compose.yml).
#
# Safe to re-run: if the certificate exists and isn't due, certbot keeps it.

set -euo pipefail
cd "$(dirname "$0")/.."

DOMAINS=(nixsoftech.in www.nixsoftech.in blog.nixsoftech.in)
EMAIL="sales@nixsoftech.in"   # Let's Encrypt expiry notices
CREDS=./digitalocean.ini

if [ ! -f "$CREDS" ]; then
  # Checked here because a missing bind-mount source would make Docker create
  # an empty *directory* named digitalocean.ini.
  echo "ERROR: $CREDS not found. Create it with one line:" >&2
  echo "  dns_digitalocean_token = <your DigitalOcean API token>" >&2
  exit 1
fi
chmod 600 "$CREDS"   # certbot refuses world-readable credentials

DOMAIN_ARGS=()
for d in "${DOMAINS[@]}"; do DOMAIN_ARGS+=(-d "$d"); done
STAGING_ARGS=()
[ "${STAGING:-0}" = 1 ] && STAGING_ARGS=(--staging) && echo "!! STAGING: the certificate will NOT be trusted by browsers !!"

echo "==> Requesting certificate for ${DOMAINS[*]} via DigitalOcean DNS..."
docker compose --profile tools run --rm certbot-dns certonly \
  --dns-digitalocean \
  --dns-digitalocean-credentials /digitalocean.ini \
  --dns-digitalocean-propagation-seconds 60 \
  --cert-name nixsoftech.in \
  "${DOMAIN_ARGS[@]}" \
  --email "$EMAIL" --agree-tos --no-eff-email --non-interactive \
  ${STAGING_ARGS[@]+"${STAGING_ARGS[@]}"}   # bash 4.2-safe expansion of a maybe-empty array

echo
echo "==> Certificate files:"
docker compose --profile tools run --rm --entrypoint "ls -l /etc/letsencrypt/live/nixsoftech.in/" certbot-dns
echo
echo "Done. Next: CUTOVER.md step 3 (deploy the production config)."
echo "You can now delete the DigitalOcean API token and ./digitalocean.ini."
