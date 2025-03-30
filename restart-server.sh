#!/bin/bash

# Kill all existing React servers
pkill -f "react-scripts start" || echo "No running servers found"

# Wait a moment for processes to terminate
sleep 2

# Start the server on a new port
cd /home/partivotes/partivotes
echo "y" | npm start
