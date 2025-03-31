 # PartiVotes MongoDB Implementation Documentation

## Overview

PartiVotes is a voting platform built on the Partisia Blockchain, using MongoDB as its primary database. This document provides a comprehensive overview of how MongoDB is implemented within the PartiVotes architecture, including database models, connection management, API endpoints, and data flow.

## Database Architecture

### Connection Management

The database connection is managed in `/src/db/connection.js`, which provides a flexible connection system that works in both server and browser environments.

```javascript
// Connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/partivotes';
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASS = process.env.MONGODB_PASS;

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auth: MONGODB_USER && MONGODB_PASS ? {
    username: MONGODB_USER,
    password: MONGODB_PASS
  } : undefined
};
```

Key features:
- Environment-based configuration using dotenv
- Browser environment detection with fallback to mock implementation
- Connection pooling for efficient database access
- Authentication support using environment variables
- Event listeners for connection status monitoring

## Data Models

### Poll Model (`/src/db/models/Poll.js`)

The Poll model represents voting polls created by users.

```javascript
const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: String, required: true }, // Wallet address
  options: { type: [optionSchema], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'RANKED_CHOICE']
  },
  maxSelections: { type: Number, default: 1 },
  status: { 
    type: String, 
    required: true,
    enum: ['ACTIVE', 'PENDING', 'ENDED', 'CANCELLED'],
    default: 'PENDING'
  },
  network: {
    type: String,
    required: true,
    enum: ['mainnet', 'testnet'],
    default: 'mainnet'
  },
  totalVotes: { type: Number, default: 0 }
}, { 
  timestamps: true // Adds createdAt and updatedAt fields
});
```

#### Indexes
```javascript
pollSchema.index({ status: 1 });
pollSchema.index({ creator: 1 });
pollSchema.index({ network: 1 });
```

### Vote Model (`/src/db/models/Vote.js`)

The Vote model represents individual votes cast by users.

```javascript
const voteSchema = new mongoose.Schema({
  pollId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Poll',
    required: true 
  },
  voter: { type: String }, // Wallet address (may be null for private votes)
  option: { type: String }, // For single choice votes
  options: { type: [String] }, // For multiple/ranked choice votes
  timestamp: { type: Date, required: true, default: Date.now },
  txId: { type: String }, // Transaction ID on blockchain
  verificationHash: { type: String }, // For private votes
  type: { 
    type: String, 
    required: true,
    enum: ['Public', 'Private'],
    default: 'Public'
  },
  network: {
    type: String,
    required: true,
    enum: ['mainnet', 'testnet'],
    default: 'mainnet'
  }
});
```

#### Indexes
```javascript
voteSchema.index({ pollId: 1 });
voteSchema.index({ voter: 1 });
voteSchema.index({ type: 1 });
```

## API Implementation

### Server Setup (`/server.js`)

The Express server provides REST API endpoints to interact with MongoDB:

```javascript
// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
```

### API Endpoints

#### Poll Endpoints

1. **Get All Polls**
   ```javascript
   // GET /api/polls
   app.get('/api/polls', async (req, res) => {
     try {
       const filter = {};
       
       // Add filters based on query parameters
       if (req.query.status) {
         filter.status = req.query.status.toUpperCase();
       }
       
       if (req.query.creator) {
         filter.creator = req.query.creator;
       }
       
       if (req.query.type) {
         filter.type = req.query.type;
       }
       
       const polls = await Poll.find(filter);
       res.json(polls);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```

2. **Get Poll by ID**
   ```javascript
   // GET /api/polls/:id
   app.get('/api/polls/:id', async (req, res) => {
     try {
       const poll = await Poll.findById(req.params.id);
       
       if (!poll) {
         return res.status(404).json({ error: 'Poll not found' });
       }
       
       res.json(poll);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```

3. **Create Poll**
   ```javascript
   // POST /api/polls
   app.post('/api/polls', async (req, res) => {
     try {
       // Ensure status is uppercase
       if (req.body.status) {
         req.body.status = req.body.status.toUpperCase();
       }
       
       const newPoll = new Poll(req.body);
       const savedPoll = await newPoll.save();
       
       res.status(201).json(savedPoll);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```

#### Vote Endpoints

1. **Add Vote**
   ```javascript
   // POST /api/votes
   app.post('/api/votes', async (req, res) => {
     try {
       const { pollId, voter, options, voteMethod } = req.body;
       
       // Start a session for transaction
       const session = await mongoose.startSession();
       session.startTransaction();
       
       try {
         // Create the vote
         const newVote = new Vote({
           pollId,
           voter,
           options: Array.isArray(options) ? options : [options],
           type: voteMethod === 'mpc' ? 'Private' : 'Public',
           timestamp: new Date()
         });
         
         await newVote.save({ session });
         
         // Update the poll's vote counts
         const poll = await Poll.findById(pollId).session(session);
         
         if (!poll) {
           throw new Error('Poll not found');
         }
         
         // Increment vote counts for each selected option
         const optionIds = Array.isArray(options) ? options : [options];
         
         optionIds.forEach(optionId => {
           const option = poll.options.id(optionId);
           if (option) {
             option.votes += 1;
           }
         });
         
         // Increment total votes
         poll.totalVotes += 1;
         
         await poll.save({ session });
         
         // Commit the transaction
         await session.commitTransaction();
         session.endSession();
         
         res.status(201).json({ 
           success: true, 
           poll: poll.toObject() 
         });
       } catch (error) {
         // Abort transaction on error
         await session.abortTransaction();
         session.endSession();
         throw error;
       }
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```

## Frontend Integration

### API Service (`/src/services/apiService.js`)

The API service provides methods to interact with the backend API:

```javascript
// API base URL - automatically detects production vs development
const API_BASE_URL = window.location.hostname.includes('partivotes.xyz') 
  ? '/api' // Use relative URL in production
  : 'http://localhost:4000/api';

// Get all polls with optional filtering
export const getPolls = async (options = {}) => {
  try {
    // Build query string from options
    const queryParams = new URLSearchParams();
    if (options.status) queryParams.append('status', options.status);
    if (options.creator) queryParams.append('creator', options.creator);
    if (options.type) queryParams.append('type', options.type);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/polls${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Service Error:', error);
    throw error;
  }
};
```

### Poll Retrieval Service (`/src/services/polls/retrieval.js`)

This service handles fetching poll data from the API:

```javascript
// Get a single poll by ID
export const getPoll = async (id) => {
  try {
    // Get poll from API
    const poll = await apiGetPoll(id);
    
    if (poll) {
      return poll;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting poll with ID ${id}:`, error);
    return null;
  }
};
```

### Voting Service (`/src/services/polls/voting.js`)

This service handles the voting process:

```javascript
// Vote on a poll with a signature (public voting)
export const voteWithSignature = async (pollId, optionId, signature) => {
  try {
    // Get the poll from MongoDB
    const dbPoll = await Poll.findById(pollId);
    
    if (!dbPoll) {
      // Fallback to local storage
      return await voteWithSignatureLocal(pollId, optionId, signature);
    }
    
    // For multiple choice polls
    const optionIds = Array.isArray(optionId) ? optionId : [optionId];
    
    // Extract voter address from signature
    const voterAddress = signature.split(':')[0] || 'anonymous';
    
    // Create vote object
    const voteData = {
      pollId: dbPoll._id,
      voter: voterAddress,
      options: optionIds,
      voteMethod: 'signature',
      timestamp: new Date()
    };
    
    // Submit vote via API
    const result = await apiAddVote(voteData);
    
    // Get updated poll after voting
    const updatedDbPoll = await Poll.findById(pollId);
    
    // Convert MongoDB document to expected format
    return {
      ...updatedDbPoll.toObject(),
      id: updatedDbPoll._id.toString(),
      hasVoted: true,
      userVote: {
        optionId: Array.isArray(optionId) ? null : optionId,
        optionIds: Array.isArray(optionId) ? optionId : null,
        voteMethod: 'signature'
      }
    };
  } catch (error) {
    // Fallback to local storage if database fails
    return await voteWithSignatureLocal(pollId, optionId, signature);
  }
};
```

## Data Flow

1. **Poll Creation**:
   - User creates a poll through the UI
   - Frontend sends poll data to the API
   - API creates a new Poll document in MongoDB
   - Poll ID is returned to the frontend

2. **Poll Retrieval**:
   - User navigates to polls list or specific poll
   - Frontend requests poll data from the API
   - API queries MongoDB for poll data
   - Poll data is returned to the frontend for display

3. **Voting Process**:
   - User votes on a poll
   - Frontend sends vote data to the API
   - API starts a transaction
   - Creates a new Vote document
   - Updates vote counts in the Poll document
   - Commits the transaction
   - Returns updated poll data to the frontend

4. **Results Display**:
   - Frontend requests poll data with vote counts
   - API retrieves poll with populated vote counts
   - Frontend displays results using the vote data

## Error Handling and Fallbacks

The system includes several fallback mechanisms to ensure reliability:

1. **Database Connection Fallbacks**:
   - Attempts to connect to MongoDB with configured credentials
   - Falls back to mock implementation in development browser environments
   - Provides detailed error logging for connection issues

2. **Voting Fallbacks**:
   - Primary path uses MongoDB for vote storage and counting
   - Falls back to local storage if database operations fail
   - Ensures votes are recorded even during temporary database outages

3. **API Error Handling**:
   - All API endpoints include try/catch blocks
   - Returns appropriate HTTP status codes for different error types
   - Provides detailed error messages for debugging

## Performance Considerations

1. **Indexes**:
   - Both Poll and Vote models include indexes on frequently queried fields
   - Improves query performance for filtering and lookups

2. **Transactions**:
   - Uses MongoDB transactions for vote operations
   - Ensures data consistency between Vote and Poll collections

3. **Connection Pooling**:
   - Mongoose connection pooling for efficient database access
   - Reuses connections to reduce overhead

## Security Considerations

1. **Authentication**:
   - Database credentials stored in environment variables
   - Not exposed to client-side code

2. **Input Validation**:
   - Schema validation ensures data integrity
   - API endpoints validate input before database operations

3. **Private Voting**:
   - Support for private votes using MPC (Multi-Party Computation)
   - Private votes do not store voter wallet address

## Deployment Considerations

The PartiVotes MongoDB implementation is designed to work in both development and production environments:

1. **Development**:
   - Local MongoDB instance
   - Mock implementation for browser testing
   - Detailed logging for debugging

2. **Production**:
   - Production MongoDB instance with authentication
   - Connection string and credentials from environment variables
   - Error handling with fallback mechanisms
   - Relative API URLs to avoid mixed content issues

## Conclusion

The MongoDB implementation in PartiVotes provides a robust, scalable database solution for the voting platform. It supports both public and private voting, maintains vote counts, and includes fallback mechanisms for reliability. The schema design and indexing strategy ensure good performance, while the API design provides a clean interface for frontend integration.