#!/bin/bash
# PartiVotes API Setup Script
# This script installs and configures the API server for PartiVotes

echo "===== PartiVotes API Server Setup ====="
echo "This script will install the API server that connects your website to MongoDB"

# Create API directory if it doesn't exist
echo "Setting up API directory..."
mkdir -p api

# Copy necessary files
echo "Copying server files..."
cp server.js api/
cp api-package.json api/package.json
cp .env api/.env 2>/dev/null || echo "No .env file found, you'll need to create one"

# Move to API directory
cd api

# Install dependencies
echo "Installing dependencies..."
npm install

# Create systemd service file
echo "Creating systemd service file..."
cat > partivotes-api.service << EOF
[Unit]
Description=PartiVotes API Server
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$(pwd)
ExecStart=$(which node) server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

echo "===== Installation Complete ====="
echo ""
echo "To start the API server manually:"
echo "  cd api && npm start"
echo ""
echo "To install as a system service (recommended):"
echo "  sudo mv partivotes-api.service /etc/systemd/system/"
echo "  sudo systemctl daemon-reload"
echo "  sudo systemctl enable partivotes-api"
echo "  sudo systemctl start partivotes-api"
echo ""
echo "To check service status:"
echo "  sudo systemctl status partivotes-api"
