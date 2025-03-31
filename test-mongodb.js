/**
 * Test script to verify MongoDB connection and poll creation
 */
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/partivotes';

// Define a simple Poll schema
const PollSchema = new mongoose.Schema({
  title: String,
  description: String,
  creator: String,
  options: [{
    text: String,
    votes: { type: Number, default: 0 }
  }],
  startDate: Date,
  endDate: Date,
  type: String,
  maxSelections: { type: Number, default: 1 },
  status: String,
  network: String,
  totalVotes: { type: Number, default: 0 }
}, { timestamps: true });

// Create Poll model
const Poll = mongoose.model('Poll', PollSchema);

// Test function to create a poll
async function testCreatePoll() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Create a test poll
    const testPoll = new Poll({
      title: 'Test Poll from Script',
      description: 'This is a test poll created by the test script',
      creator: '0xTestScript',
      options: [
        { text: 'Option 1', votes: 0 },
        { text: 'Option 2', votes: 0 }
      ],
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      type: 'SINGLE_CHOICE',
      maxSelections: 1,
      status: 'ACTIVE',
      network: 'testnet',
      totalVotes: 0
    });
    
    // Save the poll
    const savedPoll = await testPoll.save();
    console.log('Test poll created successfully:', savedPoll);
    
    // List all polls
    const allPolls = await Poll.find();
    console.log(`Found ${allPolls.length} polls in database`);
    allPolls.forEach((poll, index) => {
      console.log(`${index + 1}. ${poll.title} (ID: ${poll._id})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testCreatePoll();
