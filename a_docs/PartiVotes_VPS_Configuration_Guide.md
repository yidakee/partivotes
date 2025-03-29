# PartiVotes - VPS Configuration Guide for Windsurf IDE

## Table of Contents
1. [Introduction](#introduction)
2. [Hetzner Server Setup](#hetzner-server-setup)
3. [Initial Server Configuration](#initial-server-configuration)
4. [Development Environment Setup](#development-environment-setup)
5. [Windsurf IDE Configuration](#windsurf-ide-configuration)
6. [Project Environment Setup](#project-environment-setup)
7. [Nginx Configuration](#nginx-configuration)
8. [SSL/TLS Setup](#ssltls-setup)
9. [Firewall Configuration](#firewall-configuration)
10. [Monitoring and Maintenance](#monitoring-and-maintenance)
11. [Troubleshooting](#troubleshooting)

## Introduction

This guide provides detailed, step-by-step instructions for configuring a Hetzner VPS running Ubuntu 24.04 LTS for the PartiVotes project using Windsurf IDE. The guide is designed to be accessible for users who are not professional coders.

## Hetzner Server Setup

### 1. Create a Hetzner Account

1. Visit [Hetzner Cloud](https://www.hetzner.com/cloud)
2. Click "Sign Up" and complete the registration process
3. Verify your email address

### 2. Create a New Server

1. Log in to your Hetzner Cloud Console
2. Click "Add Server"
3. Select the following options:
   - **Location**: Choose a location close to your target users
   - **Image**: Ubuntu 24.04 LTS
   - **Type**: Standard (CX11 is sufficient for development, consider CX21 or higher for production)
   - **Volume**: Not required for initial setup
   - **Network**: Default
   - **SSH key**: Add your SSH key (recommended) or select "Password" authentication
   - **Name**: `partivotes-server`
4. Click "Create & Buy Now"

### 3. Access Your Server

#### Option 1: Using SSH (recommended for terminal users)

```bash
# Replace YOUR_SERVER_IP with the IP address shown in Hetzner Cloud Console
ssh root@YOUR_SERVER_IP
```

If you're using an SSH key, it should connect automatically. If you chose password authentication, enter the password provided by Hetzner.

#### Option 2: Using Hetzner Console (alternative for GUI access)

1. In the Hetzner Cloud Console, select your server
2. Click the "Console" button
3. Log in with username `root` and the password provided by Hetzner

## Initial Server Configuration

### 1. Update System Packages

```bash
# Update package lists
apt update

# Upgrade installed packages
apt upgrade -y

# Install essential packages
apt install -y curl wget git build-essential
```

### 2. Create a Non-Root User

```bash
# Create a new user (replace 'partivotes' with your preferred username)
adduser partivotes

# Follow the prompts to set a password and user information
# (You can press Enter to accept defaults for most fields)

# Add user to sudo group
usermod -aG sudo partivotes

# Switch to the new user
su - partivotes
```

### 3. Set Up SSH for the New User

```bash
# Create .ssh directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Create authorized_keys file
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

If you have an SSH key, add it to the authorized_keys file:

```bash
# Replace YOUR_PUBLIC_KEY with your actual public key
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
```

Alternatively, you can copy the root user's SSH configuration:

```bash
# Copy root's SSH authorized keys (run as root)
sudo cp /root/.ssh/authorized_keys /home/partivotes/.ssh/
sudo chown partivotes:partivotes /home/partivotes/.ssh/authorized_keys
```

### 4. Configure SSH Security (Optional but Recommended)

Edit the SSH configuration file:

```bash
sudo nano /etc/ssh/sshd_config
```

Make the following changes:
- Change `PermitRootLogin yes` to `PermitRootLogin no`
- Ensure `PasswordAuthentication no` is set if using SSH keys
- Ensure `PubkeyAuthentication yes` is set

Save the file (Ctrl+O, then Enter) and exit (Ctrl+X).

Restart the SSH service:

```bash
sudo systemctl restart sshd
```

**Important**: Before logging out, test that you can log in with the new user in a new terminal session:

```bash
ssh partivotes@YOUR_SERVER_IP
```

## Development Environment Setup

### 1. Install Node.js and npm

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node -v  # Should show v20.x.x
npm -v   # Should show 10.x.x or higher
```

### 2. Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx and enable it to start on boot
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### 3. Install Additional Development Tools

```bash
# Install development tools
sudo apt install -y python3-pip python3-venv

# Install global npm packages
sudo npm install -g pm2 serve
```

### 4. Install Rust and Partisia Tools

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"

# Add WebAssembly target
rustup target add wasm32-unknown-unknown

# Install build dependencies
sudo apt install -y libssl-dev pkg-config

# Install Partisia contract compiler
cargo install cargo-partisia-contract
```

## Windsurf IDE Configuration

### 1. Install Required Packages for Windsurf IDE

```bash
# Install dependencies
sudo apt install -y openssh-server
```

### 2. Configure SSH for Windsurf IDE

Ensure SSH server is running:

```bash
sudo systemctl status ssh
```

If not running:

```bash
sudo systemctl start ssh
sudo systemctl enable ssh
```

### 3. Create Project Directory

```bash
# Create project directory
mkdir -p ~/partivotes
cd ~/partivotes

# Initialize Git repository
git init
```

### 4. Configure Windsurf IDE Connection

#### On Your Local Machine:

1. Open Windsurf IDE
2. Go to "File" > "Open Remote Project"
3. Enter the following details:
   - **Host**: YOUR_SERVER_IP
   - **Username**: partivotes
   - **Authentication**: Choose "Password" or "SSH Key" based on your setup
   - **Project Path**: /home/partivotes/partivotes
4. Click "Connect"

If using password authentication, enter your password when prompted.

### 5. Configure Windsurf IDE Settings

Once connected to the remote server:

1. Go to "File" > "Preferences" > "Settings"
2. Search for "Remote"
3. Configure the following settings:
   - Enable "Auto Save"
   - Set "Format On Save" to true
   - Configure any other preferences you need

## Project Environment Setup

### 1. Initialize React Project

In the Windsurf IDE terminal:

```bash
# Navigate to project directory
cd ~/partivotes

# Initialize a new React project
npx create-react-app .

# Install required dependencies
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @mui/x-date-pickers date-fns
npm install react-router-dom
npm install @partisiablockchain/wallet-sdk
```

### 2. Configure Project Structure

Create the necessary directories:

```bash
# Create project structure
mkdir -p src/components
mkdir -p src/contexts
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/styles
```

### 3. Set Up Environment Variables

Create a `.env` file:

```bash
# Create .env file
cat > .env << EOL
REACT_APP_CONTRACT_ADDRESS=placeholder_contract_address
REACT_APP_NETWORK=mainnet
EOL
```

### 4. Configure Git

```bash
# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Create .gitignore file
cat > .gitignore << EOL
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOL

# Initial commit
git add .
git commit -m "Initial project setup"
```

## Nginx Configuration

### 1. Create Nginx Configuration File

```bash
# Create Nginx configuration file
sudo nano /etc/nginx/sites-available/partivotes
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name YOUR_SERVER_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save the file (Ctrl+O, then Enter) and exit (Ctrl+X).

### 2. Enable the Configuration

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/partivotes /etc/nginx/sites-enabled/

# Remove default configuration
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 3. Configure for Production (when ready)

When you're ready to deploy the production build, update the Nginx configuration:

```bash
# Edit Nginx configuration
sudo nano /etc/nginx/sites-available/partivotes
```

Replace the configuration with:

```nginx
server {
    listen 80;
    server_name YOUR_SERVER_IP;

    root /home/partivotes/partivotes/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Save, test, and restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## SSL/TLS Setup

### 1. Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificate

If you have a domain name pointed to your server:

```bash
# Replace yourdomain.com with your actual domain
sudo certbot --nginx -d yourdomain.com
```

Follow the prompts to complete the certificate installation.

If you don't have a domain, you can use a self-signed certificate for development:

```bash
# Generate self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt
```

Then update your Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/partivotes
```

Add SSL configuration:

```nginx
server {
    listen 443 ssl;
    server_name YOUR_SERVER_IP;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    root /home/partivotes/partivotes/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name YOUR_SERVER_IP;
    return 301 https://$host$request_uri;
}
```

## Firewall Configuration

### 1. Install and Configure UFW

```bash
# Install UFW if not already installed
sudo apt install -y ufw

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow development port (for React development server)
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Monitoring and Maintenance

### 1. Set Up PM2 for Process Management

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application with PM2 (for production)
cd ~/partivotes
pm2 start npm --name "partivotes" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

### 2. Configure Automatic Updates

```bash
# Install unattended-upgrades
sudo apt install -y unattended-upgrades apt-listchanges

# Configure automatic updates
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 3. Set Up Basic Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop

# Install and configure logwatch for email reports
sudo apt install -y logwatch
sudo nano /etc/cron.daily/00logwatch
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Node.js/npm Issues

If you encounter errors with Node.js or npm:

```bash
# Clear npm cache
npm cache clean --force

# Update npm
npm install -g npm@latest

# Check for global conflicts
npm ls -g --depth=0
```

#### 2. Permission Issues

If you encounter permission errors:

```bash
# Fix ownership of the project directory
sudo chown -R partivotes:partivotes ~/partivotes

# Fix permissions
chmod -R 755 ~/partivotes
```

#### 3. Nginx Issues

If Nginx isn't serving your application:

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx configuration
sudo nginx -t
```

#### 4. Firewall Issues

If you can't access your application:

```bash
# Check firewall status
sudo ufw status

# Temporarily disable firewall for testing
sudo ufw disable

# Re-enable after testing
sudo ufw enable
```

#### 5. SSH Connection Issues

If you can't connect to your server via SSH:

```bash
# Check SSH service status
sudo systemctl status ssh

# Restart SSH service
sudo systemctl restart ssh

# Check SSH configuration
sudo nano /etc/ssh/sshd_config
```

### Windsurf IDE Specific Issues

#### 1. Connection Problems

If Windsurf IDE can't connect to your server:

1. Verify SSH is running: `sudo systemctl status ssh`
2. Check firewall allows SSH: `sudo ufw status`
3. Verify your credentials are correct
4. Try connecting via terminal to isolate the issue: `ssh partivotes@YOUR_SERVER_IP`

#### 2. File Synchronization Issues

If files aren't syncing properly:

1. Check your internet connection
2. Restart Windsurf IDE
3. Try manually saving files (File > Save All)
4. Check disk space on the server: `df -h`

#### 3. Terminal Access Issues

If you can't access the terminal in Windsurf IDE:

1. Try opening a new terminal tab
2. Restart the IDE
3. Check if you can access the terminal via SSH directly

## Quick Reference Commands

### System Management

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
htop
```

### Service Management

```bash
# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx

# Restart SSH
sudo systemctl restart ssh

# Check SSH status
sudo systemctl status ssh
```

### Project Management

```bash
# Start development server
cd ~/partivotes
npm start

# Build for production
cd ~/partivotes
npm run build

# Start production server with PM2
cd ~/partivotes
pm2 start npm --name "partivotes" -- start

# Check PM2 status
pm2 status

# View PM2 logs
pm2 logs partivotes
```

### Git Commands

```bash
# Check Git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Pull latest changes
git pull origin main

# Reset to last commit (if things go wrong)
git reset --hard HEAD
```

This guide provides a comprehensive set of instructions for setting up your Hetzner VPS with Ubuntu 24.04 LTS for the PartiVotes project using Windsurf IDE. Follow these steps carefully, and you'll have a fully configured development environment ready for implementation.
