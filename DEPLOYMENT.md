# Nixsoft Technologies — Deployment Guide

## Architecture Overview

```
Internet (port 80/443)
       │
  [nginx-proxy]  ← ONLY public container
       │
       ├── new.nixsoftech.in/       → app      (React, :80 internal)
       ├── new.nixsoftech.in/api/   → server   (Node.js, :5000 internal)
       └── blog.new.nixsoftech.in/  → wordpress (:80 internal)
```

All internal services are **not reachable** from the internet directly.
Only the `nginx-proxy` container exposes ports `80` and `443`.

---

## Quick Start — Local Development

```bash
# First time: create your local secrets file
cp .env.example .env   # then fill in the values

# Start all services with direct port access (no nginx-proxy, no SSL)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# Access:
#   React App  → http://localhost:3001
#   Node.js API → http://localhost:5000
#   WordPress  → http://localhost:8080
#   Admin      → http://localhost:3001/#/admin  (password: ADMIN_PASSWORD from .env)
```

---

## Production Deployment — Step by Step

### Prerequisites
- A Linux server with Docker + Docker Compose installed
- Ports **80** and **443** open in the firewall
- DNS A records configured (before running the SSL script):

| DNS Record | Type | Value |
|---|---|---|
| `new.nixsoftech.in` | A | `YOUR_SERVER_IP` |
| `blog.new.nixsoftech.in` | A | `YOUR_SERVER_IP` |

### Step 1 — Clone and configure the repo

```bash
git clone <your-repo-url> /opt/nixsoft
cd /opt/nixsoft
```

### Step 2 — Set production secrets

Create `/opt/nixsoft/.env` (this file is gitignored — docker-compose loads it
automatically and refuses to start if a required value is missing):

```bash
cp .env.example .env
```

Then fill in:

```env
ADMIN_PASSWORD=your_secure_admin_password
XAI_API_KEY=your_xai_api_key             # Grok — server-side only, never in the frontend
DEEPSEEK_API_KEY=your_deepseek_api_key   # fallback if Grok fails (optional)
SMTP_PASS=your_real_app_password_here
MYSQL_ROOT_PASSWORD=your_secure_db_root_password
MYSQL_PASSWORD=your_secure_db_password
ALLOWED_ORIGINS=https://new.nixsoftech.in
```

> **Never** commit real values to `docker-compose.yml` or any tracked file.
> If a secret was ever committed, rotate it — it should be treated as compromised.

### Step 3 — Start everything except nginx-proxy (first time only)

```bash
# Start internal services first
docker-compose up -d db wordpress server app
```

### Step 4 — Bootstrap SSL certificates

```bash
# Make the script executable
chmod +x init-letsencrypt.sh

# Run in STAGING mode first (safe, no rate limits)
# Edit init-letsencrypt.sh and set STAGING=1 to test
sudo ./init-letsencrypt.sh

# If staging works (you see a cert issued), edit the script and set STAGING=0
# Then run again for a real trusted certificate:
sudo ./init-letsencrypt.sh
```

### Step 5 — Start the full production stack

```bash
docker-compose up -d
```

### Step 6 — Verify

```bash
# Check all 6 containers are running
docker-compose ps

# Check nginx logs
docker-compose logs nginx-proxy

# Check certbot logs
docker-compose logs certbot

# Test HTTPS
curl -I https://new.nixsoftech.in
curl -I https://blog.new.nixsoftech.in
```

---

## SSL Certificate Renewal

Certificates are renewed **automatically** by the `certbot` service every 12 hours.
Let's Encrypt certificates are valid for **90 days** and renew when < 30 days remain.

To manually force renewal:
```bash
docker-compose run --rm certbot renew --force-renewal
docker-compose exec nginx-proxy nginx -s reload
```

---

## Future Migration — Moving from nixsoftech.in

When you're ready to migrate the old domain to this new server:

1. Update DNS: Point `nixsoftech.in` A record to this server's IP.
2. Add `nixsoftech.in` and `www.nixsoftech.in` to `DOMAINS` in `init-letsencrypt.sh`.
3. Add a new `server_name` block in `nginx-proxy/conf.d/default.conf`.
4. Re-run `sudo ./init-letsencrypt.sh` (staging=0) to issue the new cert.
5. `docker-compose exec nginx-proxy nginx -s reload`

---

## Service Reference

| Service | Description | Internal Address |
|---|---|---|
| `nginx-proxy` | Reverse proxy + SSL termination | Public: `:80`, `:443` |
| `app` | React frontend (Nginx static) | Internal: `app:80` |
| `server` | Node.js API + Chat Logs + SMTP | Internal: `server:5000` |
| `wordpress` | WordPress CMS | Internal: `wordpress:80` |
| `db` | MariaDB database | Internal: `db:3306` |
| `certbot` | Let's Encrypt auto-renewal | Runs on schedule |

## Useful Commands

```bash
# View logs for any service
docker-compose logs -f nginx-proxy
docker-compose logs -f server

# Rebuild only the React app (after code changes)
docker-compose up -d --build app

# Reload nginx config without downtime
docker-compose exec nginx-proxy nginx -s reload

# Check nginx config syntax
docker-compose exec nginx-proxy nginx -t

# Stop everything
docker-compose down

# Stop everything and remove volumes (⚠️ deletes all data)
docker-compose down -v
```
