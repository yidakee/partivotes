/**
 * PartiVotes API Server
 * Simple Express server that provides API endpoints for MongoDB data
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const connectDB = async () => {
  try {
    // Get MongoDB connection details from environment variables
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/partivotes';
    const MONGODB_USER = process.env.MONGODB_USER;
    const MONGODB_PASS = process.env.MONGODB_PASS;
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    
    // Add authentication if credentials are provided
    if (MONGODB_USER && MONGODB_PASS) {
      options.auth = {
        username: MONGODB_USER,
        password: MONGODB_PASS
      };
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Basic schema for polls
const pollSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  creator: String,
  options: Array,
  startDate: Date,
  endDate: Date,
  type: String
}, { 
  strict: false,
  timestamps: true
});

// Create model
const Poll = mongoose.model('Poll', pollSchema);

// API Routes
// Get all polls or filter by status
app.get('/api/polls', async (req, res) => {
  try {
    const filter = {};
    
    // Add filters based on query parameters
    if (req.query.status) {
      filter.status = req.query.status.toUpperCase(); // Ensure uppercase for consistency
    }
    
    if (req.query.creator) {
      filter.creator = req.query.creator;
    }
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    console.log('API: Fetching polls with filter:', filter);
    const polls = await Poll.find(filter);
    console.log(`API: Found ${polls.length} polls`);
    
    res.json(polls);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single poll by ID
app.get('/api/polls/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    
    res.json(poll);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new poll
app.post('/api/polls', async (req, res) => {
  try {
    console.log('Creating new poll with data:', req.body);
    
    // Ensure status is uppercase
    if (req.body.status) {
      req.body.status = req.body.status.toUpperCase();
    }
    
    // Format options properly if they're just strings
    if (req.body.options && Array.isArray(req.body.options)) {
      req.body.options = req.body.options.map(option => 
        typeof option === 'string' ? { text: option, votes: 0 } : option
      );
    }
    
    const newPoll = new Poll(req.body);
    const savedPoll = await newPoll.save();
    
    console.log('Poll created successfully:', savedPoll);
    res.status(201).json(savedPoll);
  } catch (error) {
    console.error('API Error creating poll:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname)));

// The "catchall" handler: for any request that doesn't
// match one above, send back the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
