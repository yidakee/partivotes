#!/bin/bash

# PartiVotes Deployment Script
# This script ensures proper deployment of the PartiVotes application
# It rebuilds the application and restarts the service

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting PartiVotes deployment process..."

# Navigate to the project directory
cd "$(dirname "$0")"
PROJECT_DIR=$(pwd)
echo "📂 Project directory: $PROJECT_DIR"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if the build was successful
if [ ! -d "build" ]; then
  echo "❌ Build failed! Exiting."
  exit 1
fi

# Check if the systemd service exists
if systemctl list-unit-files | grep -q partivotes.service; then
  echo "🔄 Stopping existing service..."
  sudo systemctl stop partivotes.service
  
  echo "🔄 Restarting service..."
  sudo systemctl start partivotes.service
  
  echo "✅ Service restarted successfully!"
else
  # If no systemd service exists, start with serve
  echo "⚠️ No systemd service found. Starting with serve..."
  
  # Kill any existing serve processes
  pkill -f "serve -s build" || true
  
  # Start the server
  echo "🚀 Starting server..."
  npx serve -s build -l 3000 &
  
  echo "✅ Server started on port 3000!"
fi

# Create a backup of the current build
echo "💾 Creating backup of current build..."
BACKUP_DIR="$PROJECT_DIR/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r build "$BACKUP_DIR"

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running at http://localhost:3000"
