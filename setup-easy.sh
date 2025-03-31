#!/bin/bash
# PartiVotes Easy Setup Script
# This script automatically sets up the API server and nginx configuration

echo "===== PartiVotes Easy Setup ====="
echo "Setting up your API server and connecting it to your website"

# Create a directory for the API server
echo "Creating API server directory..."
mkdir -p ~/partivotes-api

# Copy necessary files
echo "Copying files..."
cp /home/partivotes/partivotes/server.js ~/partivotes-api/
cp /home/partivotes/partivotes/api-package.json ~/partivotes-api/package.json
cp /home/partivotes/partivotes/.env ~/partivotes-api/ 2>/dev/null || echo "Creating default .env file"

# Create default .env if not exists
if [ ! -f ~/partivotes-api/.env ]; then
  echo "Creating default environment file..."
  cat > ~/partivotes-api/.env << EOF
MONGODB_URI=mongodb://localhost:27017/partivotes
MONGODB_USER=partivotes
MONGODB_PASS=changeThisPassword
PORT=3000
EOF
  echo "WARNING: You'll need to update the MongoDB credentials in ~/partivotes-api/.env"
fi

# Install dependencies
echo "Installing API server dependencies..."
cd ~/partivotes-api
npm install

# Create systemd service file
echo "Creating service file..."
cat > ~/partivotes-api/partivotes-api.service << EOF
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

# Create NGINX configuration
echo "Creating NGINX configuration..."
cat > ~/partivotes-api/partivotes-site << EOF
# NGINX Configuration for PartiVotes
server {
    listen 80;
    server_name partivotes.xyz www.partivotes.xyz;

    # Redirect HTTP to HTTPS
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name partivotes.xyz www.partivotes.xyz;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/partivotes.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/partivotes.xyz/privkey.pem;
    
    # Root directory for static files
    root /home/partivotes/partivotes;
    index index.html;

    # API requests - proxy to Node.js server
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Primary location for static files
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

# Test start the API
echo "Testing API server..."
node ~/partivotes-api/server.js &
API_PID=$!
sleep 5
kill $API_PID

echo "===== Installation Complete ====="
echo ""
echo "To finish setup, run the following commands:"
echo ""
echo "1. Install the API as a service:"
echo "   sudo cp ~/partivotes-api/partivotes-api.service /etc/systemd/system/"
echo "   sudo systemctl daemon-reload"
echo "   sudo systemctl enable partivotes-api"
echo "   sudo systemctl start partivotes-api"
echo ""
echo "2. Update NGINX configuration:"
echo "   sudo cp ~/partivotes-api/partivotes-site /etc/nginx/sites-available/partivotes"
echo "   sudo ln -s /etc/nginx/sites-available/partivotes /etc/nginx/sites-enabled/ (if not already linked)"
echo "   sudo nginx -t"
echo "   sudo systemctl reload nginx"
echo ""
echo "3. Check that everything is working:"
echo "   curl http://localhost:3000/api/polls"
echo "   Check your website at https://www.partivotes.xyz"
