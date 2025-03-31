/**
 * Script to remove mock poll files after migration to MongoDB
 * This ensures we're only using MongoDB as the data source
 */
const fs = require('fs');
const path = require('path');
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
}, { 
  timestamps: true // Adds createdAt and updatedAt fields
});

// Function to verify polls exist in MongoDB before removing mock files
async function verifyAndRemoveMockPolls() {
  console.log('Starting verification of migrated polls in MongoDB...');
  
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Get all polls from MongoDB
    const Poll = mongoose.model('Poll', pollSchema);
    const polls = await Poll.find({});
    console.log(`Found ${polls.length} polls in MongoDB`);
    
    // Only proceed if we have a sufficient number of polls in MongoDB
    if (polls.length < 15) {
      console.error('Not enough polls found in MongoDB. Migration may not have been successful.');
      console.error('Aborting removal of mock poll files for safety.');
      await mongoose.connection.close();
      return;
    }
    
    // Define the directories containing mock polls
    const mockPollDirs = [
      path.join(__dirname, 'src/data/mockPolls/active'),
      path.join(__dirname, 'src/data/mockPolls/pending'),
      path.join(__dirname, 'src/data/mockPolls/ended')
    ];
    
    // Create a backup directory
    const backupDir = path.join(__dirname, 'src/data/mockPolls_backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log(`Created backup directory: ${backupDir}`);
    }
    
    // First, create a backup of the mock polls directory
    const mockPollsDir = path.join(__dirname, 'src/data/mockPolls');
    
    // Copy all files and directories recursively
    copyRecursive(mockPollsDir, backupDir);
    console.log(`Created backup of mock polls in: ${backupDir}`);
    
    // Now remove the mock poll files
    let removedFiles = 0;
    
    // Remove all JS files in each directory
    for (const dir of mockPollDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          
          if (fs.statSync(filePath).isFile() && file.endsWith('.js')) {
            fs.unlinkSync(filePath);
            console.log(`Removed file: ${filePath}`);
            removedFiles++;
          }
        }
      }
    }
    
    // Remove the index.js file in the mockPolls directory
    const indexFile = path.join(mockPollsDir, 'index.js');
    if (fs.existsSync(indexFile)) {
      fs.unlinkSync(indexFile);
      console.log(`Removed file: ${indexFile}`);
      removedFiles++;
    }
    
    console.log(`Successfully removed ${removedFiles} mock poll files`);
    
    // Create a placeholder file to indicate the directory is now empty
    const placeholderFile = path.join(mockPollsDir, 'README.md');
    fs.writeFileSync(placeholderFile, 
      '# Mock Polls\n\n' +
      'This directory previously contained mock poll data that has been migrated to MongoDB.\n' +
      'All polls are now stored in MongoDB for consistency.\n\n' +
      'Migration completed on: ' + new Date().toISOString() + '\n'
    );
    console.log(`Created placeholder file: ${placeholderFile}`);
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('Error verifying and removing mock polls:', error);
    
    try {
      await mongoose.connection.close();
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
}

// Helper function to copy files and directories recursively
function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Run the verification and removal
verifyAndRemoveMockPolls();
