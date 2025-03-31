#!/bin/bash

# This script installs the PartiVotes application as a systemd service
# that will automatically start on system boot

# Exit on error
set -e

echo "Installing PartiVotes as a systemd service..."

# Copy the service file to the systemd directory
sudo cp /home/partivotes/partivotes/partivotes.service /etc/systemd/system/

# Reload systemd to recognize the new service
echo "Reloading systemd daemon..."
sudo systemctl daemon-reload

# Enable the service to start on boot
echo "Enabling PartiVotes service to start on boot..."
sudo systemctl enable partivotes.service

# Start the service
echo "Starting PartiVotes service..."
sudo systemctl start partivotes.service

# Check the status
echo "Service status:"
sudo systemctl status partivotes.service

echo "PartiVotes service has been installed and started."
echo "You can manage it with the following commands:"
echo "  sudo systemctl start partivotes.service"
echo "  sudo systemctl stop partivotes.service"
echo "  sudo systemctl restart partivotes.service"
echo "  sudo systemctl status partivotes.service"
