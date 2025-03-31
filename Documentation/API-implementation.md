# PartiVotes API Implementation Documentation

## Overview

The PartiVotes application uses a separated architecture with:
- Frontend: React application (`/home/partivotes/partivotes`)
- Backend: Express API server (`/home/partivotes/partivotes-api`)

This document details the API implementation, endpoints, data models, and integration points.

## API Server Configuration

### Server Setup
- **Technology**: Node.js with Express
- **Port**: 4000 (configurable via environment variables)
- **CORS**: Enabled for all origins with methods GET, POST, PUT, DELETE, OPTIONS
- **Content Type**: JSON

### Environment Variables
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/partivotes)
- `MONGODB_USER`: MongoDB username (if authentication is required)
- `MONGODB_PASS`: MongoDB password (if authentication is required)
- `PORT`: Server port (default: 4000)

### Server Management
The API server is managed using a shell script (`restart-api.sh`) that:
1. Stops any existing server instances
2. Starts the server in the background
3. Redirects output to a log file (`api-server.log`)
4. Verifies the server is running

## Database Configuration

### MongoDB Connection
The server connects to MongoDB using mongoose with the following options:
- `useNewUrlParser`: true
- `useUnifiedTopology`: true
- Authentication: Uses environment variables if provided

### Data Models

#### Poll Schema
```javascript
const pollSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  creator: String,
  options: Array,
  startDate: Date,
  endDate: Date,
  type: String,
  createdAt: { type: Date, default: Date.now }
}, { 
  strict: false,
  timestamps: true
});
```

Key features:
- Flexible schema with `strict: false` to accommodate varying field structures
- Automatic timestamps for creation and updates
- Default values for type and creation date

#### Vote Schema
```javascript
const voteSchema = new mongoose.Schema({
  pollId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Poll',
    required: true 
  },
  voter: { type: String, default: 'anonymous' },
  option: { type: String }, // Single option
  options: [{ type: String }], // Array of options
  timestamp: { type: Date, default: Date.now },
  type: { 
    type: String, 
    enum: ['Public', 'Private'],
    default: 'Public',
    required: true
  },
  network: { 
    type: String, 
    enum: ['mainnet', 'testnet'],
    default: 'testnet',
    required: true
  }
});
```

Important notes:
- The `pollId` must be a MongoDB ObjectId type, not a string
- The `type` field must be either "Public" or "Private"
- The `network` field must be either "mainnet" or "testnet"
- Both `type` and `network` fields are required

## API Endpoints

### GET /api/polls
Retrieves all polls or filters by status, creator, or type.

**Query Parameters:**
- `status`: Filter by poll status (e.g., "ACTIVE", "COMPLETED")
- `creator`: Filter by poll creator (wallet address)
- `type`: Filter by poll type (e.g., "single", "multiple")

**Response:**
```json
[
  {
    "_id": "poll_id",
    "title": "Poll Title",
    "description": "Poll Description",
    "status": "ACTIVE",
    "creator": "wallet_address",
    "options": [
      { "text": "Option 1", "votes": 0 },
      { "text": "Option 2", "votes": 0 }
    ],
    "startDate": "2025-03-31T00:00:00.000Z",
    "endDate": "2025-04-07T00:00:00.000Z",
    "type": "single",
    "createdAt": "2025-03-31T17:00:00.000Z",
    "updatedAt": "2025-03-31T17:00:00.000Z"
  }
]
```

### GET /api/polls/:id
Retrieves a single poll by its MongoDB ID.

**URL Parameters:**
- `id`: MongoDB ObjectId of the poll

**Response:**
Same as above but for a single poll object.

### POST /api/polls
Creates a new poll.

**Request Body:**
```json
{
  "title": "Poll Title",
  "description": "Poll Description",
  "status": "ACTIVE",
  "creator": "wallet_address",
  "options": ["Option 1", "Option 2"],
  "startDate": "2025-03-31T00:00:00.000Z",
  "endDate": "2025-04-07T00:00:00.000Z",
  "type": "single"
}
```

**Processing:**
- Options are formatted as objects with `text` and `votes` properties if provided as strings
- Status is converted to uppercase for consistency
- Creator is set to the authenticated wallet address

**Response:**
The created poll object with MongoDB ID and timestamps.

### POST /api/votes
Submits a vote for a poll.

**Request Body:**
```json
{
  "pollId": "67eb0f24d7eddb8ca9104b97",
  "option": "Option 1",
  "voter": "test-voter"
}
```

**Processing:**
- The poll ID is converted to an ObjectId
- Default values are set for type and network
- The options are formatted as an array

**Response:**
The submitted vote object with MongoDB ID and timestamps.

## Frontend Integration

### API Service
The frontend communicates with the API using the `apiService.js` module which provides:

```javascript
// In src/services/apiService.js
export const fetchPolls = async (filters = {}) => {
  // Constructs query parameters and fetches polls
};

export const fetchPollById = async (id) => {
  // Fetches a single poll by ID
};

export const createPoll = async (pollData) => {
  // Creates a new poll with the provided data
};

export const submitVote = async (voteData) => {
  // Submits a vote for a poll with the provided data
};
```

### Poll Creation Flow
1. User fills out poll form in `PollCreate.jsx`
2. Form data is validated and formatted
3. The wallet address is added as the creator
4. Data is sent to the API via `createPoll` function
5. On success, user is redirected to the new poll page

### Vote Submission Flow
1. User selects an option in `PollVote.jsx`
2. Form data is validated and formatted
3. The wallet address is added as the voter
4. Data is sent to the API via `submitVote` function
5. On success, user is redirected to the poll results page

## Error Handling

The API implements comprehensive error handling:
- Request validation errors return 400 status
- Database errors return 500 status with error message
- Not found errors return 404 status
- All errors are logged to the console and api-server.log

## Security Considerations

- CORS is configured to allow cross-origin requests
- No authentication is currently implemented for API endpoints
- Creator field relies on client-side wallet authentication

## Known Issues and Limitations

1. The poll creation process occasionally fails with 502 Bad Gateway errors
2. Poll options formatting needs to be consistent between frontend and backend
3. The creator field must be properly set from the authenticated wallet
4. MongoDB ObjectId handling: When using poll IDs, they must be in a valid MongoDB ObjectId format (24 hex characters). The creator wallet address (which is longer than 24 characters) cannot be used directly as a poll ID. The API has been updated to handle both ObjectId and string-based lookups.

## Troubleshooting

Common issues and solutions:
- If the API server is not responding, check `api-server.log` for errors
- If poll creation fails, verify the format of options and creator fields
- If MongoDB connection fails, check environment variables and database status
- If vote submission fails with "Document failed validation", ensure the vote data matches the expected schema format
- If you get "Cast to ObjectId failed" errors, make sure you're using a valid MongoDB ObjectId as the poll ID (not the creator wallet address)

## Future Improvements

Planned enhancements:
- Add authentication middleware for API endpoints
- Implement rate limiting to prevent abuse
- Add validation for poll data using Joi or similar
- Create additional endpoints for voting functionality
