#!/bin/bash

# Change to the frontend directory
cd /home/partivotes/partivotes

# Make sure no other instance is running - be more aggressive with cleanup
echo "Stopping any existing frontend processes..."
pkill -f "node.*react-app-rewired" || true
pkill -f "node.*start.js" || true
pkill -f "node.*3000" || true

# Check if port 3000 is in use and kill the process
PORT_PID=$(lsof -t -i:3000 2>/dev/null)
if [ ! -z "$PORT_PID" ]; then
  echo "Killing process using port 3000: $PORT_PID"
  kill -9 $PORT_PID || true
  sleep 2
  
  # Double-check if port is still in use
  PORT_PID=$(lsof -t -i:3000 2>/dev/null)
  if [ ! -z "$PORT_PID" ]; then
    echo "Port 3000 is still in use by process $PORT_PID, trying again..."
    kill -9 $PORT_PID || true
    sleep 2
  fi
fi

# Wait a moment for the processes to terminate
sleep 3

# Start the frontend application
echo "Starting frontend application on port 3000..."
export PORT=3000
cd /home/partivotes/partivotes
npm start >> /home/partivotes/partivotes/frontend.log 2>&1
