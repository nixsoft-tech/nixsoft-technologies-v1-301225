#!/bin/bash
# =============================================================================
# init-letsencrypt.sh
# One-time bootstrap script for Let's Encrypt SSL with Certbot + Nginx.
#
# Run this ONCE on the server to issue the first certificate.
# After this, Certbot handles renewals automatically (via the certbot service).
#
# Usage:
#   chmod +x init-letsencrypt.sh
#   sudo ./init-letsencrypt.sh
# =============================================================================

set -e

# ─── Configuration ────────────────────────────────────────────────────────────
DOMAINS=("new.nixsoftech.in" "blog.new.nixsoftech.in")
EMAIL="sales@nixsoftech.in"     # Let's Encrypt expiry notifications
RSA_KEY_SIZE=4096
STAGING=0                       # Set to 1 for testing (no rate limits, untrusted cert)
                                # Set to 0 for production (real trusted cert)

# ─── Detect Docker Compose (v2 plugin preferred, v1 binary fallback) ─────────
if docker compose version &> /dev/null; then
  COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
  COMPOSE="docker-compose"
else
  echo "ERROR: Docker Compose not found. Install it first (run ./setup-uat.sh)." >&2
  exit 1
fi
echo "==> Using compose command: $COMPOSE"

# NOTE: certificates live in the named Docker volume 'certbot_conf' mounted at
# /etc/letsencrypt (see docker-compose.yml) — NOT in a host directory. All
# checks and file operations therefore run inside the certbot container.

# ─────────────────────────────────────────────────────────────────────────────
echo "==> Checking for existing certificates..."
if $COMPOSE run --rm --entrypoint "test -d /etc/letsencrypt/live/${DOMAINS[0]}" certbot 2>/dev/null; then
  echo "    Certificate already exists for ${DOMAINS[0]}. Skipping issuance."
  echo "    To force renewal: $COMPOSE run --rm certbot renew --force-renewal"
  exit 0
fi

# ─────────────────────────────────────────────────────────────────────────────
echo "==> Downloading recommended TLS parameters into the certbot volume..."
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

curl -fsS https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
  -o "$TMP_DIR/options-ssl-nginx.conf"
curl -fsS https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem \
  -o "$TMP_DIR/ssl-dhparams.pem"

# Pipe the files into the named volume via the certbot container
$COMPOSE run --rm -T --entrypoint \
  "sh -c 'cat > /etc/letsencrypt/options-ssl-nginx.conf'" certbot \
  < "$TMP_DIR/options-ssl-nginx.conf"
$COMPOSE run --rm -T --entrypoint \
  "sh -c 'cat > /etc/letsencrypt/ssl-dhparams.pem'" certbot \
  < "$TMP_DIR/ssl-dhparams.pem"

# ─────────────────────────────────────────────────────────────────────────────
echo "==> Creating temporary self-signed certificate for ${DOMAINS[0]}..."
# Nginx needs a cert to start — we bootstrap with a self-signed one.
# The live/ directory must be created INSIDE the container (named volume).
$COMPOSE run --rm --entrypoint "\
  sh -c 'mkdir -p /etc/letsencrypt/live/${DOMAINS[0]} && \
    openssl req -x509 -nodes -newkey rsa:$RSA_KEY_SIZE -days 1 \
      -keyout /etc/letsencrypt/live/${DOMAINS[0]}/privkey.pem \
      -out /etc/letsencrypt/live/${DOMAINS[0]}/fullchain.pem \
      -subj /CN=localhost'" certbot

echo "==> Uncommenting SSL config in nginx-proxy/conf.d/default.conf..."
if [ "$(uname)" = "Darwin" ]; then
  sed -i '' 's/#\s*ssl_certificate/ssl_certificate/g' ./nginx-proxy/conf.d/default.conf
  sed -i '' 's/#\s*include\s*\/etc\/letsencrypt/include \/etc\/letsencrypt/g' ./nginx-proxy/conf.d/default.conf
  sed -i '' 's/#\s*ssl_dhparam/ssl_dhparam/g' ./nginx-proxy/conf.d/default.conf
else
  sed -i 's/#\s*ssl_certificate/ssl_certificate/g' ./nginx-proxy/conf.d/default.conf
  sed -i 's/#\s*include\s*\/etc\/letsencrypt/include \/etc\/letsencrypt/g' ./nginx-proxy/conf.d/default.conf
  sed -i 's/#\s*ssl_dhparam/ssl_dhparam/g' ./nginx-proxy/conf.d/default.conf
fi

echo "==> Starting Nginx proxy with the temporary certificate..."
$COMPOSE up --force-recreate -d nginx-proxy
echo "    Waiting for Nginx to come up..."
sleep 5

echo "==> Removing temporary self-signed certificate..."
$COMPOSE run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/${DOMAINS[0]} \
         /etc/letsencrypt/archive/${DOMAINS[0]} \
         /etc/letsencrypt/renewal/${DOMAINS[0]}.conf" certbot

# ─────────────────────────────────────────────────────────────────────────────
echo "==> Requesting Let's Encrypt certificate..."
# Build the -d flags from the DOMAINS array
DOMAIN_ARGS=""
for domain in "${DOMAINS[@]}"; do
  DOMAIN_ARGS="$DOMAIN_ARGS -d $domain"
done

# Staging flag (use --staging for testing, remove for production)
STAGING_FLAG=""
if [ "$STAGING" = "1" ]; then
  STAGING_FLAG="--staging"
  echo "    !! STAGING MODE — Certificate will NOT be trusted by browsers !!"
  echo "    !! Switch STAGING=0 and re-run after testing !!"
fi

$COMPOSE run --rm --entrypoint "\
  certbot certonly --webroot \
    -w /var/www/certbot \
    $STAGING_FLAG \
    $DOMAIN_ARGS \
    --email $EMAIL \
    --rsa-key-size $RSA_KEY_SIZE \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot

# ─────────────────────────────────────────────────────────────────────────────
echo "==> Reloading Nginx with the real certificate..."
$COMPOSE exec nginx-proxy nginx -s reload

echo ""
echo "==================================================================="
echo " SUCCESS! SSL certificate issued for: ${DOMAINS[*]}"
echo " Certificates live in the 'certbot_conf' Docker volume."
echo ""
echo " Certbot will automatically renew the certificate every 12 hours."
echo " Your site is now live at:"
echo "   https://new.nixsoftech.in         (React App + API)"
echo "   https://blog.new.nixsoftech.in    (WordPress Blog)"
echo "==================================================================="
