#!/bin/bash

# PartiVotes Rollback Script
# This script allows rolling back to a previous working version of the application

set -e  # Exit immediately if a command exits with a non-zero status

echo "🔄 Starting PartiVotes rollback process..."

# Navigate to the project directory
cd "$(dirname "$0")"
PROJECT_DIR=$(pwd)
BACKUP_DIR="$PROJECT_DIR/backups"

# Check if backups exist
if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A "$BACKUP_DIR")" ]; then
  echo "❌ No backups found! Cannot rollback."
  exit 1
fi

# List available backups
echo "📋 Available backups:"
ls -lt "$BACKUP_DIR" | grep -v "total" | awk '{print NR".", $9}'

# Ask which backup to restore
echo ""
read -p "Enter the number of the backup to restore (or 'q' to quit): " choice

if [ "$choice" = "q" ]; then
  echo "🛑 Rollback cancelled."
  exit 0
fi

# Get the selected backup
SELECTED_BACKUP=$(ls -lt "$BACKUP_DIR" | grep -v "total" | awk '{print $9}' | sed -n "${choice}p")

if [ -z "$SELECTED_BACKUP" ]; then
  echo "❌ Invalid selection!"
  exit 1
fi

FULL_BACKUP_PATH="$BACKUP_DIR/$SELECTED_BACKUP"

echo "🔄 Rolling back to backup: $SELECTED_BACKUP"

# Restore the backup
echo "🔄 Restoring build files..."
rm -rf "$PROJECT_DIR/build"
cp -r "$FULL_BACKUP_PATH/build" "$PROJECT_DIR/"

# Restart the service
if systemctl list-unit-files | grep -q partivotes.service; then
  echo "🔄 Restarting service..."
  sudo systemctl restart partivotes.service
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

echo "✅ Rollback completed successfully!"
echo "🌐 Application is running at http://localhost:3000"
