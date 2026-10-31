# Production cutover: nixsoftech.in → EC2

Moves `nixsoftech.in` from the old WordPress site (DigitalOcean droplet,
`104.236.2.104`) to the new site on EC2 (`13.232.118.191`, Elastic IP).

- **Branch:** `feat/production-cutover`. It contains everything on
  `feat/services-tab` plus the production-only config: proxy vhosts,
  certificates, the WordPress URL, `ALLOWED_ORIGINS`, and the tool containers.
- **Don't deploy this branch to the server before swap day.** It switches
  UAT off.
- All server commands run in `/home/ec2-user/nixsoft-technologies-v1-301225`.

## Before swap day

| When | Step |
|---|---|
| ≥ 1 day before | **DigitalOcean DNS:** set the TTL of the `@` A record to **300**. `www` is a CNAME to `@`, so it follows. |
| Any time | **DigitalOcean DNS:** add an A record `blog` → `13.232.118.191`. It's a new name, so nothing uses it yet. |
| Any time | **DigitalOcean → API → Tokens:** create a token with write access and save it on the server as `digitalocean.ini` (gitignored): `dns_digitalocean_token = <token>`. Delete the token after step 3. |
| Any time | **`.env` on the server:** delete any `ALLOWED_ORIGINS=` line (the default is now `https://nixsoftech.in`). Confirm `SES_REGION=ap-south-1` and `SMTP_FROM=website@nixsoftech.in` are set: the contact form sends through Amazon SES using the instance's IAM role `nixsoft-website-ses`. |
| Day before | **Snapshots:** the DigitalOcean droplet (the rollback target) and the EC2 EBS volume. |

**Don't touch any other DNS record.** The zone carries Google Workspace mail
(MX, SPF, DKIM, DMARC), MailerLite, Mailjet, `support.` and `track.`.

## Swap day

**1. Back up the WordPress database**
```bash
docker compose exec -T db sh -c 'mariadb-dump -uroot -p"$MYSQL_ROOT_PASSWORD" wordpress' > ~/wp-before-cutover.sql && ls -lh ~/wp-before-cutover.sql
```

**2. Switch the server to the cutover branch**
```bash
git stash                     # UAT's local edits to nginx-proxy/conf.d/default.conf (kept for rollback)
git fetch origin && git checkout feat/production-cutover && git pull
```

**3. Issue the production certificate** (nixsoftech.in, www, blog) through DigitalOcean DNS
```bash
bash scripts/issue-production-certs.sh
```
To try it first without using up Let's Encrypt's rate limit, run it with
`STAGING=1` before the line above.

**4. Check the proxy config**
```bash
docker compose run --rm --no-deps nginx-proxy nginx -t
```
It must end with `test is successful`. If it doesn't, stop here: nothing has
changed for visitors yet.

**5. Point WordPress at blog.nixsoftech.in**
```bash
docker compose run --rm wpcli wp search-replace 'blog.new.nixsoftech.in' 'blog.nixsoftech.in' --skip-columns=guid --dry-run
docker compose run --rm wpcli wp search-replace 'blog.new.nixsoftech.in' 'blog.nixsoftech.in' --skip-columns=guid
docker compose run --rm wpcli wp option get home      # expect https://blog.nixsoftech.in
docker compose run --rm wpcli wp cache flush
```
This also rewrites the `siteurl` and `home` options. From this point, WordPress
admin is at `https://blog.nixsoftech.in/wp-admin`, which won't resolve until
step 7.

**6. Deploy**
```bash
docker compose up -d --build app server
docker compose up -d --force-recreate nginx-proxy
```
From now on, `new.nixsoftech.in` redirects to `nixsoftech.in`, which still
points at the old site until step 7. That's harmless.

**Optional: preview before switching DNS.** Add this line to your PC's hosts
file (`C:\Windows\System32\drivers\etc\hosts`, edited as admin):
```
13.232.118.191  nixsoftech.in www.nixsoftech.in blog.nixsoftech.in
```
Browse the site and WordPress admin, then **remove the line**.

**7. Switch DNS** (DigitalOcean → Networking → Domains → nixsoftech.in)
- Change the `@` A record from `104.236.2.104` to `13.232.118.191`.
- That's the only change. `www` follows the CNAME, and `blog` was added earlier.

**8. Verify** (wait about 5 minutes for the 300-second TTL to expire)
```bash
EXPECTED_IP=13.232.118.191 bash scripts/post-cutover-check.sh
```
Fix anything marked FAIL and run it again. Then check these by hand:
- Send an email to and from a `@nixsoftech.in` address. In Gmail's "Show
  original", SPF, DKIM and DMARC should all say PASS.
- Submit the contact form and confirm it arrives at sales@.
- Ask NixBot a question.
- Open GA → Reports → Realtime and browse the site. Your visit should show up.
- Log in at `https://blog.nixsoftech.in/wp-admin`.
- Test certificate renewal:
  ```bash
  docker compose run --rm --entrypoint "certbot renew --webroot -w /var/www/certbot --dry-run" certbot
  ```

**9. Wrap up**
- Search Console: submit `https://nixsoftech.in/sitemap.xml`, remove the old
  `sitemap_index.xml`, and request indexing for the home page.
- Delete the DigitalOcean API token, then run `rm digitalocean.ini`.
- Merge `feat/production-cutover` into `main` and deploy from `main` from now on.
- Raise the `@` TTL back to 3600 after a stable week.

## Rollback

If something critical breaks and can't be fixed quickly:

1. **DNS:** set the `@` A record back to `104.236.2.104`. The old site is still
   running, and with a 300-second TTL most visitors are back within minutes.
2. **Server (restores UAT):**
   ```bash
   docker compose run --rm wpcli wp search-replace 'blog.nixsoftech.in' 'blog.new.nixsoftech.in' --skip-columns=guid
   git checkout feat/services-tab && git stash pop
   docker compose up -d --build app server && docker compose up -d --force-recreate nginx-proxy
   ```

## Weeks 1–4

- Watch Search Console's Pages report (404s and server errors) and the server's 404s:
  `docker compose logs --since 24h nginx-proxy | awk '$9==404 {print $7}' | sort | uniq -c | sort -rn | head -20`
- A dip in search clicks for 2–4 weeks is normal while Google processes the redirects.
- Keep the droplet as a rollback for 2–4 weeks, then snapshot it and destroy it.
  **Keep the DNS zone**, because email depends on it.
- `new.nixsoftech.in` keeps redirecting for as long as its DNS record and
  certificate exist. Remove both, and the last two server blocks in
  `nginx-proxy/conf.d/default.conf`, once nobody uses the UAT links.
