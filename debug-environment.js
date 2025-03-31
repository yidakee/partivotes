/**
 * Debug script to test environment detection and MongoDB connectivity
 */
require('dotenv').config();

// Check environment variables
console.log('Environment Variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI || 'Not set');
console.log('MONGODB_USER:', process.env.MONGODB_USER ? 'Set' : 'Not set');
console.log('MONGODB_PASS:', process.env.MONGODB_PASS ? 'Set' : 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('REACT_APP_ENV:', process.env.REACT_APP_ENV || 'Not set');

// Test MongoDB connection
const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Add authentication if credentials are provided
if (process.env.MONGODB_USER && process.env.MONGODB_PASS) {
  options.auth = {
    username: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASS
  };
}

// Connect to MongoDB
async function testConnection() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/partivotes';
    console.log('Connecting to MongoDB at URI:', uri);
    await mongoose.connect(uri, options);
    console.log('MongoDB connected successfully');

    // Get poll collection stats
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Count polls
    const pollsCount = await db.collection('polls').countDocuments();
    console.log('Total polls:', pollsCount);

    // Count polls by status
    const statusCounts = await db.collection('polls').aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]).toArray();
    console.log('Polls by status:', statusCounts);

    // Sample polls
    const polls = await db.collection('polls').find().limit(3).toArray();
    console.log('Sample polls:', polls.map(p => ({ 
      id: p._id, 
      title: p.title, 
      status: p.status,
      startDate: p.startDate,
      endDate: p.endDate
    })));

    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error testing MongoDB connection:', error);
  }
}

testConnection();
