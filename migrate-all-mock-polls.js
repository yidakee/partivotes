/**
 * Script to migrate all mock polls to MongoDB
 * This ensures we're using a consistent data source
 */
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { connectDB } = require('./src/db/connection');
const { POLL_STATUS, POLL_TYPE } = require('./src/utils/constants');

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

// Function to extract all mock polls
async function extractMockPolls() {
  console.log('Extracting mock polls...');
  
  // Set all polls to have this owner
  const WALLET_ADDRESS = '00b06f5b47f9b085803f401313b58823a73a7bae7c';
  
  try {
    // Define the directories to check for mock polls
    const mockPollDirs = [
      {
        path: path.join(__dirname, 'src/data/mockPolls/active'),
        files: ['single.js', 'multiple.js', 'ranked.js']
      },
      {
        path: path.join(__dirname, 'src/data/mockPolls/pending'),
        files: ['single.js', 'multiple.js', 'ranked.js']
      },
      {
        path: path.join(__dirname, 'src/data/mockPolls/ended'),
        files: ['single.js', 'multiple.js', 'ranked.js']
      }
    ];
    
    // Extract all mock polls
    const allMockPolls = [];
    
    for (const dir of mockPollDirs) {
      for (const file of dir.files) {
        const filePath = path.join(dir.path, file);
        
        try {
          if (fs.existsSync(filePath)) {
            console.log(`Processing file: ${filePath}`);
            
            // Read the file content
            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            // Extract the poll array variable name
            const pollArrayMatch = fileContent.match(/export const (\w+) = \[/);
            if (pollArrayMatch && pollArrayMatch[1]) {
              const pollArrayName = pollArrayMatch[1];
              
              // Extract the polls
              const pollsMatch = fileContent.match(/export const \w+ = \[([\s\S]*?)\];/);
              if (pollsMatch && pollsMatch[1]) {
                const pollsContent = pollsMatch[1];
                
                // Extract individual poll objects
                const pollRegex = /{\s*id:\s*['"]([^'"]+)['"]/g;
                let pollMatch;
                let pollCount = 0;
                
                while ((pollMatch = pollRegex.exec(pollsContent)) !== null) {
                  const pollId = pollMatch[1];
                  const pollStartIndex = pollMatch.index;
                  
                  // Find the end of this poll object
                  let bracketCount = 1;
                  let endIndex = pollStartIndex + 1;
                  
                  while (bracketCount > 0 && endIndex < pollsContent.length) {
                    if (pollsContent[endIndex] === '{') bracketCount++;
                    if (pollsContent[endIndex] === '}') bracketCount--;
                    endIndex++;
                  }
                  
                  if (bracketCount === 0) {
                    const pollObjectContent = pollsContent.substring(pollStartIndex, endIndex);
                    
                    // Extract poll properties
                    const titleMatch = pollObjectContent.match(/title:\s*['"]([^'"]+)['"]/);
                    const descriptionMatch = pollObjectContent.match(/description:\s*['"]([^'"]+)['"]/);
                    const typeMatch = pollObjectContent.match(/type:\s*([^,\n]+)/);
                    const statusMatch = pollObjectContent.match(/status:\s*([^,\n]+)/);
                    const maxSelectionsMatch = pollObjectContent.match(/maxSelections:\s*(\d+)/);
                    const totalVotesMatch = pollObjectContent.match(/totalVotes:\s*(\d+)/);
                    
                    // Extract options
                    const optionsMatch = pollObjectContent.match(/options:\s*\[([\s\S]*?)\]/);
                    const options = [];
                    
                    if (optionsMatch && optionsMatch[1]) {
                      const optionsContent = optionsMatch[1];
                      const optionRegex = /{\s*id:\s*['"]([^'"]+)['"],\s*text:\s*['"]([^'"]+)['"],\s*votes:\s*(\d+)/g;
                      let optionMatch;
                      
                      while ((optionMatch = optionRegex.exec(optionsContent)) !== null) {
                        options.push({
                          text: optionMatch[2],
                          votes: parseInt(optionMatch[3], 10)
                        });
                      }
                    }
                    
                    if (titleMatch && descriptionMatch && typeMatch && statusMatch && options.length > 0) {
                      // Create a mock poll object
                      const mockPoll = {
                        title: titleMatch[1],
                        description: descriptionMatch[1],
                        creator: WALLET_ADDRESS,
                        options: options,
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                        status: statusMatch[1].includes('POLL_STATUS') ? statusMatch[1].split('.')[1] : statusMatch[1],
                        type: typeMatch[1].includes('POLL_TYPE') ? typeMatch[1].split('.')[1] : typeMatch[1],
                        maxSelections: maxSelectionsMatch ? parseInt(maxSelectionsMatch[1], 10) : 1,
                        totalVotes: totalVotesMatch ? parseInt(totalVotesMatch[1], 10) : 0,
                        network: 'mainnet'
                      };
                      
                      allMockPolls.push(mockPoll);
                      pollCount++;
                    }
                  }
                }
                
                console.log(`Found ${pollCount} polls in ${filePath}`);
              }
            }
          }
        } catch (error) {
          console.error(`Error processing file ${filePath}:`, error);
        }
      }
    }
    
    console.log(`Total mock polls extracted: ${allMockPolls.length}`);
    return allMockPolls;
    
  } catch (error) {
    console.error('Error extracting mock polls:', error);
    return [];
  }
}

// Function to migrate all mock polls to MongoDB
async function migrateAllMockPolls() {
  console.log('Starting migration of all mock polls to MongoDB...');
  
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Extract all mock polls
    const mockPolls = await extractMockPolls();
    
    if (mockPolls.length === 0) {
      console.log('No mock polls found to migrate');
      await mongoose.connection.close();
      return;
    }
    
    // Get existing polls to avoid duplicates
    const existingPolls = await Poll.find({});
    console.log(`Found ${existingPolls.length} existing polls in MongoDB`);
    
    // Filter out polls that already exist (by title)
    const newPolls = mockPolls.filter(newPoll => {
      return !existingPolls.some(existingPoll => 
        existingPoll.title === newPoll.title
      );
    });
    
    console.log(`Found ${newPolls.length} new polls to migrate`);
    
    if (newPolls.length === 0) {
      console.log('No new polls to migrate. All mock polls are already in MongoDB.');
      await mongoose.connection.close();
      return;
    }
    
    // Insert new polls into MongoDB
    const result = await Poll.insertMany(newPolls);
    console.log(`Successfully migrated ${result.length} mock polls to MongoDB`);
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('Error migrating mock polls to MongoDB:', error);
    
    try {
      await mongoose.connection.close();
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
}

// Run the migration
migrateAllMockPolls();
