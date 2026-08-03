#!/bin/bash
# =============================================================================
# setup-uat.sh
# Automated UAT Deployment Script for Nixsoft Technologies on AWS EC2
#
# Usage:
#   chmod +x setup-uat.sh
#   ./setup-uat.sh
# =============================================================================

set -e

echo "====================================================================="
echo "        Nixsoft Technologies — Automated UAT Bootstrapper"
echo "====================================================================="

# 1. Detect dynamic public IP
echo "--> Detecting public IP..."
PUBLIC_IP=$(curl -s https://api.ipify.org || curl -s https://ifconfig.me || echo "unknown")
echo "    Dynamic Public IP: $PUBLIC_IP"

# 2. Check and configure 2GB Swap Space
if [ -f /swapfile ]; then
  echo "--> Swap file already exists. Skipping creation."
else
  echo "--> Configuring 2GB Swap Space (needed for resource-constrained instances)..."
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  echo "    Swap space enabled successfully."
fi

# 3. Check and install Docker & Docker Compose
# Detect OS platform
OS_FAMILY="debian"
if [ -f /etc/os-release ]; then
  . /etc/os-release
  if [ "$ID" = "amzn" ] || [ "$ID_LIKE" = "fedora" ]; then
    OS_FAMILY="amazon"
  fi
fi

if ! command -v docker &> /dev/null; then
  echo "--> Installing Docker Engine..."
  if [ "$OS_FAMILY" = "amazon" ]; then
    sudo dnf install -y docker
    sudo systemctl enable --now docker
  else
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
  fi
else
  echo "--> Docker is already installed."
  # Ensure Docker service is enabled and running on Amazon Linux 2023
  if [ "$OS_FAMILY" = "amazon" ]; then
    sudo systemctl enable --now docker
  fi
fi

if ! docker compose version &> /dev/null; then
  echo "--> Installing Docker Compose v2..."
  if [ "$OS_FAMILY" = "amazon" ]; then
    sudo mkdir -p /usr/libexec/docker/cli-plugins
    sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" -o /usr/libexec/docker/cli-plugins/docker-compose
    sudo chmod +x /usr/libexec/docker/cli-plugins/docker-compose
  else
    sudo apt-get update
    sudo apt-get install -y docker-compose-v2
  fi
  # Verify the plugin is actually usable before continuing
  if ! docker compose version &> /dev/null; then
    echo "ERROR: 'docker compose' still not working after install. Aborting." >&2
    exit 1
  fi
  echo "    Installed: $(docker compose version)"
else
  echo "--> Docker Compose is already installed."
fi

# `docker compose build` (used by `docker compose up` for the app/server
# images) requires Buildx >= 0.17.0. Amazon Linux's dnf-packaged Docker
# ships an older/no Buildx plugin, which fails with a cryptic error at
# build time rather than at install time — so check the version explicitly.
REQUIRED_BUILDX="0.17.0"
CURRENT_BUILDX=$(docker buildx version 2>/dev/null | sed -n 's/.*v\([0-9]*\.[0-9]*\.[0-9]*\).*/\1/p' | head -1)

NEED_BUILDX=true
if [ -n "$CURRENT_BUILDX" ]; then
  OLDEST=$(printf '%s\n%s\n' "$REQUIRED_BUILDX" "$CURRENT_BUILDX" | sort -V | head -1)
  if [ "$OLDEST" = "$REQUIRED_BUILDX" ]; then
    NEED_BUILDX=false
  fi
fi

if [ "$NEED_BUILDX" = true ]; then
  echo "--> Installing/upgrading Docker Buildx plugin (found: ${CURRENT_BUILDX:-none}, need >= $REQUIRED_BUILDX)..."
  BUILDX_ARCH=$(uname -m)
  case "$BUILDX_ARCH" in
    x86_64) BUILDX_ARCH="amd64" ;;
    aarch64) BUILDX_ARCH="arm64" ;;
  esac
  BUILDX_TAG=$(curl -s https://api.github.com/repos/docker/buildx/releases/latest | grep -m1 '"tag_name"' | cut -d '"' -f4)
  if [ -z "$BUILDX_TAG" ]; then
    echo "ERROR: Could not resolve the latest Buildx release. Check network/GitHub API access." >&2
    exit 1
  fi

  CLI_PLUGINS_DIR="/usr/libexec/docker/cli-plugins"
  [ "$OS_FAMILY" = "amazon" ] || CLI_PLUGINS_DIR="/usr/local/lib/docker/cli-plugins"
  sudo mkdir -p "$CLI_PLUGINS_DIR"
  sudo curl -fSL "https://github.com/docker/buildx/releases/download/${BUILDX_TAG}/buildx-${BUILDX_TAG}.linux-${BUILDX_ARCH}" \
    -o "$CLI_PLUGINS_DIR/docker-buildx"
  sudo chmod +x "$CLI_PLUGINS_DIR/docker-buildx"

  if ! docker buildx version &> /dev/null; then
    echo "ERROR: Buildx still not working after install. Aborting." >&2
    exit 1
  fi
  echo "    Installed: $(docker buildx version)"
else
  echo "--> Docker Buildx $CURRENT_BUILDX already satisfies >= $REQUIRED_BUILDX."
fi

# Add current user to docker group if needed
if ! groups $USER | grep -q docker; then
  echo "--> Adding current user to the 'docker' group..."
  sudo usermod -aG docker $USER
  echo "    User added. NOTE: Run 'newgrp docker' or reconnect SSH to use docker without sudo."
fi

# 4. Generate .env file if missing
if [ -f .env ]; then
  echo "--> .env file already exists. Skipping auto-generation."
else
  echo "--> Copying .env template and auto-generating secure credentials..."
  cp .env.example .env

  # Generate cryptographically secure keys
  ADMIN_PASS=$(openssl rand -hex 16)
  DB_PASS=$(openssl rand -hex 16)
  DB_ROOT_PASS=$(openssl rand -hex 16)

  # Inject credentials into .env (anchored so only the real lines match)
  sed -i "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=$ADMIN_PASS|" .env
  sed -i "s|^MYSQL_PASSWORD=.*|MYSQL_PASSWORD=$DB_PASS|" .env
  sed -i "s|^MYSQL_ROOT_PASSWORD=.*|MYSQL_ROOT_PASSWORD=$DB_ROOT_PASS|" .env

  echo "    Generated credentials stored in .env:"
  echo "    - ADMIN_PASSWORD: $ADMIN_PASS"
  echo "    - MYSQL_PASSWORD: $DB_PASS"
  echo "    - MYSQL_ROOT_PASSWORD: $DB_ROOT_PASS"

  # Replace a KEY=... line with an arbitrary user-supplied value.
  # Uses remove-and-append (no sed) so special characters are always safe.
  set_env_var() {
    local key="$1" value="$2"
    grep -v "^${key}=" .env > .env.tmp
    printf '%s=%s\n' "$key" "$value" >> .env.tmp
    mv .env.tmp .env
  }

  # Prompt for the remaining secrets (both may be skipped — the backend
  # degrades gracefully: chat runs in demo mode, contact form returns 503)
  echo ""
  read -r -p "    Enter GEMINI_API_KEY (blank to configure later): " GEMINI_KEY
  if [ -n "$GEMINI_KEY" ]; then
    set_env_var "GEMINI_API_KEY" "$GEMINI_KEY"
    echo "    GEMINI_API_KEY saved."
  else
    echo "    [!] Skipped — NixBot chat will run in demo mode until set in .env."
  fi

  read -r -s -p "    Enter SMTP_PASS / app password (blank to configure later): " SMTP_PASS_VAL
  echo ""
  if [ -n "$SMTP_PASS_VAL" ]; then
    set_env_var "SMTP_PASS" "$SMTP_PASS_VAL"
    echo "    SMTP_PASS saved."
  else
    echo "    [!] Skipped — contact form emails disabled until set in .env."
  fi
fi

# 5. Let's Encrypt SSL domain warning
echo ""
echo "====================================================================="
echo "                     SSL & DNS VERIFICATION"
echo "====================================================================="
echo "Your instance's current public IP is: $PUBLIC_IP"
echo ""
echo "Before running Let's Encrypt SSL configuration, ensure that your"
echo "DNS provider points 'new.nixsoftech.in' and 'blog.new.nixsoftech.in'"
echo "A-records to this IP ($PUBLIC_IP)."
echo ""
read -p "Do you want to run the Let's Encrypt SSL bootstrapping script now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  chmod +x init-letsencrypt.sh
  sudo ./init-letsencrypt.sh
else
  echo "--> Skipping SSL setup. You can run './init-letsencrypt.sh' manually later."
fi

# 6. Start production stack
echo ""
read -p "Do you want to launch the full Nixsoft Docker stack now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "--> Launching Docker containers..."
  docker compose up -d
  echo "--> Setup Complete! Container status:"
  docker compose ps
else
  echo "--> Setup Complete. Start the stack manually using: docker compose up -d"
fi
