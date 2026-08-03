# Nixsoft Technologies — Amazon EC2 Deployment Guide

This guide details the step-by-step instructions to provision, configure, and deploy the Nixsoft stack (Nginx Proxy, React App, Node.js API, WordPress, MariaDB, and Certbot) on an **Amazon Web Services (AWS) EC2** instance.

> [!TIP]
> **UAT / Quick Deployment Script:**
> For quick deployments on a UAT/staging instance (e.g., with a dynamic IP address), you can use the automated **`setup-uat.sh`** script in the root directory. It automatically configures swap space, installs Docker + Docker Compose, auto-generates secure database/admin credentials, and prompts you to launch the Docker stack.

---

## 1. AWS Resource Provisioning

### A. Launch EC2 Instance
1. Open the **AWS EC2 Console**.
2. Click **Launch Instance**.
3. **Name**: `nixsoft-web-production`
4. **AMI (Amazon Machine Image)**: Select **Ubuntu Server 24.04 LTS** (or 22.04 LTS), 64-bit (x86).
5. **Instance Type**: 
   - *Recommended*: **`t3.small`** (2 vCPUs, 2 GiB Memory) or **`t3.medium`** (2 vCPUs, 4 GiB Memory).
   - *Minimum*: **`t3.micro`** (1 GiB Memory). If choosing a micro instance, you **MUST** configure Swap Space (see Section 3) to prevent the OS Out-of-Memory (OOM) killer from crashing MySQL/MariaDB.
6. **Key Pair**: Select or create a secure SSH key pair (`.pem` format) and download it.

### B. Configure Security Group (Firewall)
During launch, configure a Security Group with the following **Inbound Rules**:

| Type | Port Range | Source | Description |
|---|---|---|---|
| **SSH** | 22 | `My IP` (or Custom Admin Range) | Administrative CLI access |
| **HTTP** | 80 | `0.0.0.0/0` (Anywhere) | ACME Let's Encrypt validation & redirects |
| **HTTPS** | 443 | `0.0.0.0/0` (Anywhere) | Encrypted production traffic |

### C. Associate Elastic IP (EIP)
*An Elastic IP ensures your server maintains a static public IP across reboots.*
1. In the EC2 console left sidebar, select **Elastic IPs** (under *Network & Security*).
2. Click **Allocate Elastic IP address** and click **Allocate**.
3. Select the allocated Elastic IP, click **Actions** -> **Associate Elastic IP address**.
4. Choose your running EC2 instance and click **Associate**.

---

## 2. DNS Setup
Before starting the deployment, you must point your DNS A records to your Elastic IP. If using AWS Route 53 or another DNS registrar, create two A records:

| Record Name | Type | Value / Destination |
|---|---|---|
| `new.nixsoftech.in` | **A** | `YOUR_ELASTIC_IP` |
| `blog.new.nixsoftech.in` | **A** | `YOUR_ELASTIC_IP` |

---

## 3. SSH Connect & Server Hardening

### A. Access Instance via SSH
Locate your downloaded key pair file (`.pem`) and run:
```bash
chmod 400 your-key.pem
ssh -i "your-key.pem" ubuntu@YOUR_ELASTIC_IP
```

### B. Setup Swap Space (Mandatory for < 2GB RAM instances)
Run these commands to create a 2GB swap file to prevent memory exhaustion crashes:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
*Verify with:* `free -h`

### C. Update System Packages
For **Ubuntu Server**:
```bash
sudo apt update && sudo apt upgrade -y
```
For **Amazon Linux 2023**:
```bash
sudo dnf update -y
```

---

## 4. Install Docker & Docker Compose

### Option A: For Ubuntu Server
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose (v2)
sudo apt install docker-compose-v2 -y

# Add user 'ubuntu' to docker group to run docker without sudo
sudo usermod -aG docker ubuntu
```
*Note: Log out of the SSH session and log back in to apply group permissions.*

### Option B: For Amazon Linux 2023
```bash
# Install Docker
sudo dnf install -y docker

# Enable and start the Docker service daemon
sudo systemctl enable --now docker

# Install Docker Compose (v2) as a CLI plugin
sudo mkdir -p /usr/libexec/docker/cli-plugins
sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" -o /usr/libexec/docker/cli-plugins/docker-compose
sudo chmod +x /usr/libexec/docker/cli-plugins/docker-compose

# Add EC2 user to docker group to run docker without sudo
sudo usermod -aG docker ec2-user
```
*Note: Log out of the SSH session and log back in (or run 'newgrp docker') to apply group permissions.*

---

## 5. Clone and Configure the Application

### A. Clone Repository
```bash
# Recommended installation directory
sudo mkdir -p /opt/nixsoft
sudo chown ubuntu:ubuntu /opt/nixsoft
git clone <your-repository-url> /opt/nixsoft
cd /opt/nixsoft
```

### B. Configure Environment Variables
Create the production `.env` configuration file:
```bash
cp .env.example .env
nano .env
```

Set the values exactly as follows:
```env
# ─── Required secrets ─────────────────────────────────────────────────────────
ADMIN_PASSWORD=generate_a_long_secure_password
GEMINI_API_KEY=AIzaSy...your_real_gemini_key
SMTP_PASS=your_gmail_app_password

# MariaDB credentials
MYSQL_ROOT_PASSWORD=generate_a_secure_mariadb_root_password
MYSQL_PASSWORD=generate_a_secure_mariadb_user_password

# ─── Configuration overrides ──────────────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=sales@nixsoftech.in
CONTACT_EMAIL=sales@nixsoftech.in
ALLOWED_ORIGINS=https://new.nixsoftech.in
```

---

## 6. SSL Bootstrapping & Launch

### A. Run SSL Bootstrapper Script
Nixsoft includes an automated Let's Encrypt SSL bootstrap script. Run this to issue certificates:
```bash
# Make script executable
chmod +x init-letsencrypt.sh

# Run script. (Set STAGING=1 in script first to test. Then switch back to STAGING=0 for production)
sudo ./init-letsencrypt.sh
```
*The script will automatically request the SSL certificates, configure Nginx, uncomment the certificate bindings in `./nginx-proxy/conf.d/default.conf`, and reload.*

### B. Start Stack
Start all services in detached production mode:
```bash
docker compose up -d
```

---

## 7. Operational & Verification Commands

### Check Service Status
Confirm all 6 containers (`nginx-proxy`, `app`, `server`, `wordpress`, `db`, `certbot`) are running:
```bash
docker compose ps
```

### View Live Logs
```bash
# Nginx Gateway Logs
docker compose logs -f nginx-proxy

# API Server Logs
docker compose logs -f server
```

### Rebuilding Frontend after Updates
If you pull updates to the React code, rebuild and redeploy only the `app` container seamlessly without taking down the database or backend:
```bash
git pull
docker compose up -d --build app
```

### Graceful Downtime Config Reload
If you make changes to the Nginx configs:
```bash
docker compose exec nginx-proxy nginx -t # check syntax first
docker compose exec nginx-proxy nginx -s reload
```
