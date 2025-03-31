/**
 * Script to migrate sample polls to MongoDB
 * This ensures we're using a consistent data source
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./src/db/connection');

// Define Poll schema for MongoDB
const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    votes: { type: Number, default: 0 }
  }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    required: true,
    enum: ['ACTIVE', 'PENDING', 'ENDED', 'CANCELLED'],
    default: 'PENDING'
  },
  type: { 
    type: String, 
    required: true,
    enum: ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'RANKED_CHOICE']
  },
  maxSelections: { type: Number, default: 1 },
  totalVotes: { type: Number, default: 0 },
  network: {
    type: String,
    required: true,
    enum: ['mainnet', 'testnet'],
    default: 'mainnet'
  }
});

// Create Poll model
const Poll = mongoose.model('Poll', pollSchema);

// Helper function to create dates relative to now
const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const lastWeek = new Date(now);
lastWeek.setDate(now.getDate() - 7);
const nextWeek = new Date(now);
nextWeek.setDate(now.getDate() + 7);
const nextMonth = new Date(now);
nextMonth.setDate(now.getDate() + 30);

// Sample polls to add to MongoDB
const samplePolls = [
  // Active Polls
  {
    title: 'Best Layer 1 Blockchain',
    description: 'Which Layer 1 blockchain do you think has the most promising future?',
    options: [
      { text: 'Ethereum', votes: 120 },
      { text: 'Solana', votes: 85 },
      { text: 'Avalanche', votes: 65 },
      { text: 'Polkadot', votes: 50 },
      { text: 'Partisia Blockchain', votes: 95 }
    ],
    startDate: lastWeek,
    endDate: nextMonth,
    status: 'ACTIVE',
    type: 'SINGLE_CHOICE',
    maxSelections: 1,
    totalVotes: 415
  },
  {
    title: 'Crypto Regulation Sentiment',
    description: 'How do you feel about the current regulatory landscape for cryptocurrencies?',
    options: [
      { text: 'Too restrictive', votes: 75 },
      { text: 'Balanced approach', votes: 45 },
      { text: 'Not enough regulation', votes: 30 },
      { text: 'Needs complete overhaul', votes: 60 }
    ],
    startDate: yesterday,
    endDate: nextWeek,
    status: 'ACTIVE',
    type: 'SINGLE_CHOICE',
    maxSelections: 1,
    totalVotes: 210
  },
  // Pending Polls
  {
    title: 'Next Major DeFi Innovation',
    description: 'What do you think will be the next major innovation in DeFi?',
    options: [
      { text: 'Cross-chain interoperability', votes: 0 },
      { text: 'Privacy-focused DeFi', votes: 0 },
      { text: 'Real-world asset tokenization', votes: 0 },
      { text: 'Institutional DeFi solutions', votes: 0 },
      { text: 'Sustainable/green DeFi', votes: 0 }
    ],
    startDate: nextWeek,
    endDate: nextMonth,
    status: 'PENDING',
    type: 'MULTIPLE_CHOICE',
    maxSelections: 2,
    totalVotes: 0
  },
  {
    title: 'Favorite Crypto Conference',
    description: 'Which cryptocurrency conference do you find most valuable?',
    options: [
      { text: 'Consensus', votes: 0 },
      { text: 'DevCon', votes: 0 },
      { text: 'Bitcoin Conference', votes: 0 },
      { text: 'Paris Blockchain Week', votes: 0 },
      { text: 'ETH Denver', votes: 0 }
    ],
    startDate: nextWeek,
    endDate: nextMonth,
    status: 'PENDING',
    type: 'RANKED_CHOICE',
    maxSelections: 5,
    totalVotes: 0
  },
  // Finished Polls
  {
    title: 'Most Important Feature for Blockchain',
    description: 'What do you consider the most important feature for a blockchain?',
    options: [
      { text: 'Security', votes: 150 },
      { text: 'Scalability', votes: 120 },
      { text: 'Decentralization', votes: 135 },
      { text: 'Developer ecosystem', votes: 95 },
      { text: 'User experience', votes: 100 }
    ],
    startDate: new Date(lastWeek.getTime() - 14 * 24 * 60 * 60 * 1000), // 3 weeks ago
    endDate: lastWeek,
    status: 'ENDED',
    type: 'SINGLE_CHOICE',
    maxSelections: 1,
    totalVotes: 600
  }
];

// Function to migrate sample polls to MongoDB
async function migrateSamplePolls() {
  console.log('Starting migration of sample polls to MongoDB...');
  
  // Set all polls to have this owner
  const WALLET_ADDRESS = '00b06f5b47f9b085803f401313b58823a73a7bae7c';
  
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Get existing polls to avoid duplicates
    const existingPolls = await Poll.find({});
    console.log(`Found ${existingPolls.length} existing polls in MongoDB`);
    
    // Convert sample polls to MongoDB format
    const pollsToMigrate = samplePolls.map(poll => {
      return {
        title: poll.title,
        description: poll.description,
        // Set all polls to have the same creator wallet address
        creator: WALLET_ADDRESS,
        options: poll.options,
        startDate: poll.startDate,
        endDate: poll.endDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: poll.status,
        type: poll.type,
        maxSelections: poll.maxSelections,
        totalVotes: poll.totalVotes,
        network: 'mainnet'
      };
    });
    
    // Filter out polls that already exist (by title)
    const newPolls = pollsToMigrate.filter(newPoll => {
      return !existingPolls.some(existingPoll => 
        existingPoll.title === newPoll.title
      );
    });
    
    console.log(`Found ${newPolls.length} new polls to migrate`);
    
    if (newPolls.length === 0) {
      console.log('No new polls to migrate. All sample polls are already in MongoDB.');
      await mongoose.connection.close();
      return;
    }
    
    // Insert new polls into MongoDB
    const result = await Poll.insertMany(newPolls);
    console.log(`Successfully migrated ${result.length} sample polls to MongoDB`);
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('Error migrating sample polls to MongoDB:', error);
    
    try {
      await mongoose.connection.close();
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
}

// Run the migration
migrateSamplePolls();
