/**
 * Poll Filter Test Script
 * Run with: node test-poll-filter.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/partivotes';
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return false;
  }
}

// Define Poll schema matching our application
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
  status: { type: String, required: true },
  type: { type: String, required: true },
  maxSelections: { type: Number, default: 1 },
  totalVotes: { type: Number, default: 0 },
  network: { type: String, default: 'mainnet' }
});

// Create Poll model
const Poll = mongoose.model('Poll', pollSchema);

// Test fetching polls with different status filters
async function testPollFilters() {
  try {
    // 1. Get all polls
    const allPolls = await Poll.find({});
    console.log(`Total polls in database: ${allPolls.length}`);
    
    // 2. Log unique status values to check case
    const uniqueStatuses = [...new Set(allPolls.map(poll => poll.status))];
    console.log('Unique status values in database:', uniqueStatuses);
    
    // 3. Test each status filter
    for (const status of uniqueStatuses) {
      console.log(`\nTesting filter for status: ${status}`);
      
      // 3.1. Exact match filter
      const exactMatch = await Poll.find({ status });
      console.log(`Exact match (status: "${status}"): ${exactMatch.length} polls`);
      
      // 3.2. Uppercase filter
      const upperMatch = await Poll.find({ status: status.toUpperCase() });
      console.log(`Uppercase match (status: "${status.toUpperCase()}"): ${upperMatch.length} polls`);
      
      // 3.3. Lowercase filter
      const lowerMatch = await Poll.find({ status: status.toLowerCase() });
      console.log(`Lowercase match (status: "${status.toLowerCase()}"): ${lowerMatch.length} polls`);
      
      // 3.4. First poll with this status
      if (exactMatch.length > 0) {
        const samplePoll = exactMatch[0];
        console.log('Sample poll with this status:');
        console.log(`  ID: ${samplePoll._id}`);
        console.log(`  Title: ${samplePoll.title}`);
        console.log(`  Status: ${samplePoll.status}`);
        console.log(`  Start Date: ${samplePoll.startDate}`);
        console.log(`  End Date: ${samplePoll.endDate}`);
      }
    }
    
    // 4. Check for common status values regardless of case
    console.log('\nChecking for standard status values (case-insensitive):');
    const standardStatuses = ['active', 'pending', 'ended', 'cancelled'];
    
    for (const status of standardStatuses) {
      // Case-insensitive regex search
      const regexFilter = new RegExp(status, 'i');
      const matches = await Poll.find({ status: regexFilter });
      console.log(`Status "${status}" (case-insensitive): ${matches.length} polls`);
    }
  } catch (error) {
    console.error('Error testing poll filters:', error);
  }
}

// Run tests
async function runTests() {
  const connected = await connectToMongoDB();
  if (connected) {
    await testPollFilters();
    console.log('\nTests completed');
    await mongoose.connection.close();
  }
}

runTests();
