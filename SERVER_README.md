# PartiVotes Server

## Overview
This is the backend API server for the PartiVotes application. It provides API endpoints for MongoDB data access and serves the React frontend.

## Dependencies
The server requires the following Node.js packages:
- **express**: Web server framework for handling HTTP requests
- **mongoose**: MongoDB object modeling tool
- **cors**: Middleware for enabling Cross-Origin Resource Sharing
- **dotenv**: For loading environment variables from .env file

These dependencies are listed in the main package.json file.

## Environment Variables
The server uses the following environment variables:
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/partivotes)
- `MONGODB_USER`: MongoDB username (if authentication is required)
- `MONGODB_PASS`: MongoDB password (if authentication is required)
- `PORT`: Server port (default: 3000)

## API Endpoints

### GET /api/polls
Get all polls or filter by status, creator, or type.

### GET /api/polls/:id
Get a single poll by ID.

### POST /api/polls
Create a new poll.

## Starting the Server
To start the server:

```bash
node server.js
```

## Troubleshooting
If you encounter issues with missing dependencies, ensure you have run:

```bash
npm install
```

This will install all dependencies listed in package.json, including express and cors.
