/**
 * Test script to verify database connection and poll retrieval
 * Run with: node test-db-connection.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

// Log environment variables (excluding sensitive ones)
console.log('Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set (hidden for security)' : 'Not set');
console.log('- MONGODB_USER:', process.env.MONGODB_USER ? 'Set (hidden for security)' : 'Not set');

// Connect to MongoDB
async function testConnection() {
  try {
    // Connection URI
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/partivotes';
    
    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    // Add authentication if credentials provided
    if (process.env.MONGODB_USER && process.env.MONGODB_PASS) {
      options.auth = {
        username: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASS
      };
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, options);
    console.log('✅ MongoDB connected successfully');
    
    // Define Poll schema (simplified version)
    const PollSchema = new mongoose.Schema({
      title: String,
      description: String,
      creator: String,
      options: Array,
      startDate: Date,
      endDate: Date,
      status: String,
      type: String
    });
    
    // Create model
    const Poll = mongoose.model('Poll', PollSchema);
    
    // Test basic query
    console.log('\nFetching all polls:');
    const allPolls = await Poll.find({});
    console.log(`- Total polls: ${allPolls.length}`);
    
    // Get unique status values
    const statuses = [...new Set(allPolls.map(poll => poll.status))];
    console.log(`- Unique status values: ${statuses.join(', ')}`);
    
    // Check each status with different case formats
    for (const status of statuses) {
      console.log(`\nTesting status: ${status}`);
      
      // Exact match
      const exactMatch = await Poll.find({ status });
      console.log(`- Exact match (${status}): ${exactMatch.length} polls`);
      
      // Uppercase match
      const upperMatch = await Poll.find({ status: status.toUpperCase() });
      console.log(`- Uppercase match (${status.toUpperCase()}): ${upperMatch.length} polls`);
      
      // Lowercase match
      const lowerMatch = await Poll.find({ status: status.toLowerCase() });
      console.log(`- Lowercase match (${status.toLowerCase()}): ${lowerMatch.length} polls`);
      
      // Sample poll
      if (exactMatch.length > 0) {
        const sample = exactMatch[0];
        console.log('- Sample poll:');
        console.log(`  Title: ${sample.title}`);
        console.log(`  Status: ${sample.status}`);
        console.log(`  Start Date: ${sample.startDate}`);
        console.log(`  End Date: ${sample.endDate}`);
      }
    }
    
    console.log('\nTesting connection filters:');
    // Test with lowercase filters
    const activePolls = await Poll.find({ status: 'active' });
    const pendingPolls = await Poll.find({ status: 'pending' });
    const endedPolls = await Poll.find({ status: 'ended' });
    
    console.log(`- 'active' (lowercase): ${activePolls.length} polls`);
    console.log(`- 'pending' (lowercase): ${pendingPolls.length} polls`);
    console.log(`- 'ended' (lowercase): ${endedPolls.length} polls`);
    
    // Test with uppercase filters
    const ACTIVE_polls = await Poll.find({ status: 'ACTIVE' });
    const PENDING_polls = await Poll.find({ status: 'PENDING' });
    const ENDED_polls = await Poll.find({ status: 'ENDED' });
    
    console.log(`- 'ACTIVE' (uppercase): ${ACTIVE_polls.length} polls`);
    console.log(`- 'PENDING' (uppercase): ${PENDING_polls.length} polls`);
    console.log(`- 'ENDED' (uppercase): ${ENDED_polls.length} polls`);
    
  } catch (error) {
    console.error('❌ Error during MongoDB test:', error);
  } finally {
    // Close connection
    await mongoose.disconnect();
    console.log('\nMongoDB connection closed');
  }
}

// Run the test
testConnection();
