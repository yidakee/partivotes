// Test script to diagnose and fix voting issues
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
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

// Connect to MongoDB
mongoose.connect(MONGODB_URI, options)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define schemas
const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: String, required: true },
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
  timestamps: true
});

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
    default: 'testnet'
  }
}, {
  timestamps: true
});

// Create models
const Poll = mongoose.model('Poll', pollSchema);
const Vote = mongoose.model('Vote', voteSchema);

// Test functions
async function listPolls() {
  try {
    const polls = await Poll.find({});
    console.log('Available polls:');
    polls.forEach(poll => {
      console.log(`ID: ${poll._id}, Title: ${poll.title}`);
      console.log('Options:');
      poll.options.forEach((opt, index) => {
        console.log(`  ${index}: ${typeof opt === 'object' ? opt.text : opt}`);
      });
    });
    return polls;
  } catch (error) {
    console.error('Error listing polls:', error);
  }
}

async function createTestVote(pollId, option, voter = 'test-voter') {
  try {
    console.log(`Creating vote for poll ${pollId}, option "${option}", voter "${voter}"`);
    
    // Create vote document with all required fields
    const voteData = {
      pollId: pollId,
      voter: voter,
      timestamp: new Date(),
      type: 'Public', // Required field
      network: 'testnet' // Required field
    };
    
    // Add option field
    if (option) {
      voteData.option = option;
      // Also add as array for flexibility
      voteData.options = [option];
    }
    
    console.log('Vote data:', voteData);
    
    // Create and save vote
    const newVote = new Vote(voteData);
    const savedVote = await newVote.save();
    console.log('Vote saved successfully:', savedVote);
    
    // Update poll
    const poll = await Poll.findById(pollId);
    if (poll) {
      console.log('Found poll:', poll.title);
      
      // Find the option in the poll
      let optionIndex = -1;
      
      // Try to find by text match first
      poll.options.forEach((opt, index) => {
        const optText = typeof opt === 'object' ? opt.text : opt;
        if (optText === option) {
          optionIndex = index;
        }
      });
      
      console.log(`Option index found: ${optionIndex}`);
      
      if (optionIndex !== -1) {
        // Ensure the option is an object with a votes property
        if (typeof poll.options[optionIndex] !== 'object') {
          poll.options[optionIndex] = { text: poll.options[optionIndex], votes: 0 };
        } else if (!poll.options[optionIndex].votes) {
          poll.options[optionIndex].votes = 0;
        }
        
        // Increment votes
        poll.options[optionIndex].votes += 1;
        
        // Increment total votes
        if (!poll.totalVotes) {
          poll.totalVotes = 0;
        }
        poll.totalVotes += 1;
        
        await poll.save();
        console.log(`Updated poll with new vote count`);
      } else {
        console.log(`Could not find option "${option}" in poll`);
      }
    }
    
    return savedVote;
  } catch (error) {
    console.error('Error creating vote:', error);
    if (error.errors) {
      Object.keys(error.errors).forEach(field => {
        console.error(`Validation error in field '${field}':`, error.errors[field].message);
      });
    }
    throw error;
  }
}

// Run tests
async function runTests() {
  try {
    const polls = await listPolls();
    if (polls && polls.length > 0) {
      const testPoll = polls[0];
      const testOption = typeof testPoll.options[0] === 'object' ? testPoll.options[0].text : testPoll.options[0];
      
      console.log(`\nTesting vote creation for poll: ${testPoll.title}`);
      await createTestVote(testPoll._id.toString(), testOption);
      
      console.log('\nTests completed successfully');
    } else {
      console.log('No polls available for testing');
    }
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Run the tests
runTests();
