/**
 * MongoDB test script for PartiVotes
 * This script tests the MongoDB connection and adds sample data
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../src/db/connection.js';
import Poll from '../src/db/models/Poll.js';

// Initialize dotenv
dotenv.config();

// Sample poll data
const samplePolls = [
  {
    title: "Favorite Programming Language",
    description: "Vote for your favorite programming language",
    creator: "0x123456789abcdef",
    options: [
      { text: "JavaScript", votes: 0 },
      { text: "Python", votes: 0 },
      { text: "Java", votes: 0 },
      { text: "C++", votes: 0 }
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    type: "SINGLE_CHOICE",
    maxSelections: 1,
    status: "ACTIVE",
    network: "mainnet",
    totalVotes: 0
  },
  {
    title: "Best Web Framework",
    description: "What's your favorite web framework?",
    creator: "0x987654321fedcba",
    options: [
      { text: "React", votes: 0 },
      { text: "Angular", votes: 0 },
      { text: "Vue", votes: 0 },
      { text: "Svelte", votes: 0 }
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    type: "MULTIPLE_CHOICE",
    maxSelections: 2,
    status: "ACTIVE",
    network: "mainnet",
    totalVotes: 0
  }
];

// Connect to MongoDB and add sample data
async function testMongoDB() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB successfully');
    
    // Check if polls collection is empty
    const pollCount = await Poll.countDocuments({});
    console.log(`Current poll count: ${pollCount}`);
    
    if (pollCount === 0) {
      // Add sample polls
      console.log('Adding sample polls...');
      await Poll.insertMany(samplePolls);
      console.log('Sample polls added successfully');
    } else {
      console.log('Polls already exist, skipping sample data insertion');
      
      // Display existing polls
      const polls = await Poll.find({});
      console.log('Existing polls:');
      polls.forEach(poll => {
        console.log(`- ${poll.title} (${poll._id})`);
      });
    }
    
    console.log('MongoDB test completed successfully');
  } catch (error) {
    console.error('Error testing MongoDB:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testMongoDB();
