// Script to check MongoDB schema validation rules
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

async function checkCollectionValidation() {
  try {
    // Connect directly with MongoDB driver
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(MONGODB_URI, options);
    await client.connect();
    
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Get collection info
    const collections = await db.listCollections().toArray();
    console.log('Collections:');
    for (const collection of collections) {
      console.log(`- ${collection.name}`);
      
      // Get validation rules
      const options = await db.command({ listCollections: 1, filter: { name: collection.name } });
      const collectionInfo = options.cursor.firstBatch[0];
      
      if (collectionInfo.options && collectionInfo.options.validator) {
        console.log(`\nValidation rules for ${collection.name}:`);
        console.log(JSON.stringify(collectionInfo.options.validator, null, 2));
      } else {
        console.log(`\nNo validation rules for ${collection.name}`);
      }
    }
    
    // Close connection
    await client.close();
    console.log('\nConnection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Check mongoose models
function checkMongooseModels() {
  console.log('\nMongoose Models:');
  
  // Connect to MongoDB
  mongoose.connect(MONGODB_URI, options)
    .then(async () => {
      console.log('Connected to MongoDB via Mongoose');
      
      // Check Vote model
      const Vote = mongoose.model('Vote');
      console.log('\nVote model schema:');
      console.log(JSON.stringify(Vote.schema.paths, null, 2));
      
      // Create a test vote
      const testVote = new Vote({
        pollId: new mongoose.Types.ObjectId(),
        voter: 'test-voter',
        option: 'Test Option',
        options: ['Test Option'],
        timestamp: new Date(),
        type: 'Public',
        network: 'testnet'
      });
      
      // Validate without saving
      try {
        await testVote.validate();
        console.log('\nTest vote validation passed!');
      } catch (error) {
        console.error('\nTest vote validation failed:');
        if (error.errors) {
          Object.keys(error.errors).forEach(field => {
            console.error(`- ${field}: ${error.errors[field].message}`);
          });
        } else {
          console.error(error);
        }
      }
      
      // Disconnect
      await mongoose.disconnect();
      console.log('\nMongoose connection closed');
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
    });
}

// Run checks
async function runChecks() {
  await checkCollectionValidation();
  checkMongooseModels();
}

runChecks();
