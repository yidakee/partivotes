#!/bin/bash

# PartiVotes MongoDB Setup Script
# This script sets up the initial database structure for PartiVotes

# Configuration
DB_NAME="partivotes"
DB_USER="yidakee"
DB_PASS="univox1978"
APP_DIR="/home/partivotes/partivotes"

# Print colored status messages
print_status() {
  echo -e "\e[1;34m[INFO]\e[0m $1"
}

print_success() {
  echo -e "\e[1;32m[SUCCESS]\e[0m $1"
}

print_error() {
  echo -e "\e[1;31m[ERROR]\e[0m $1"
}

print_warning() {
  echo -e "\e[1;33m[WARNING]\e[0m $1"
}

# Error handling
handle_error() {
  print_error "An error occurred at step: $1"
  print_error "Please check the logs and try again"
  exit 1
}

# Check if script is run as root
if [ "$EUID" -ne 0 ]; then
  print_error "Please run this script as root or with sudo"
  exit 1
fi

# Step 1: Install MongoDB manually
print_status "We will install MongoDB manually since the repository doesn't support Ubuntu 24.04 yet"

# Install MongoDB packages
print_status "Installing MongoDB..."
print_status "Please run the following commands manually to install MongoDB:"
print_status "1. wget https://repo.mongodb.org/apt/ubuntu/dists/jammy/mongodb-org/6.0/multiverse/binary-amd64/mongodb-org-server_6.0.12_amd64.deb"
print_status "2. sudo dpkg -i mongodb-org-server_6.0.12_amd64.deb"
print_status "3. sudo systemctl enable mongod && sudo systemctl start mongod"
print_status ""
print_status "After installing MongoDB, run this script again to continue with database setup."
print_status ""

# Check if MongoDB is running
if ! systemctl is-active --quiet mongod; then
  print_warning "MongoDB is not running. Please install MongoDB first."
  exit 0
fi

print_success "MongoDB is running. Continuing with database setup..."

# Step 2: Create MongoDB user and database
print_status "Creating MongoDB user and database..."

# Create admin user and application user
mongosh --eval "
  // Create application database and user
  db = db.getSiblingDB('${DB_NAME}');
  if (db.getUser('${DB_USER}') == null) {
    db.createUser({
      user: '${DB_USER}',
      pwd: '${DB_PASS}',
      roles: [ { role: 'readWrite', db: '${DB_NAME}' } ]
    });
    print('Application user created');
  } else {
    print('Application user already exists');
  }
" || handle_error "creating MongoDB users"

# Step 3: Create database schema
print_status "Setting up PartiVotes database schema..."

# MongoDB commands to create collections with validation schemas
mongosh --eval "
  // Connect to the partivotes database
  db = db.getSiblingDB('${DB_NAME}');
  
  // Create collections with validation schemas
  db.createCollection('polls', {
    validator: {
      \$jsonSchema: {
        bsonType: 'object',
        required: ['title', 'description', 'creator', 'options', 'startDate', 'endDate', 'type', 'status', 'network'],
        properties: {
          title: { bsonType: 'string' },
          description: { bsonType: 'string' },
          creator: { bsonType: 'string' },
          options: { bsonType: 'array' },
          startDate: { bsonType: 'date' },
          endDate: { bsonType: 'date' },
          type: { bsonType: 'string', enum: ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'RANKED_CHOICE'] },
          maxSelections: { bsonType: 'int' },
          status: { bsonType: 'string', enum: ['ACTIVE', 'PENDING', 'ENDED', 'CANCELLED'] },
          network: { bsonType: 'string', enum: ['mainnet', 'testnet'] },
          createdAt: { bsonType: 'date' },
          updatedAt: { bsonType: 'date' }
        }
      }
    }
  });
  
  db.createCollection('votes', {
    validator: {
      \$jsonSchema: {
        bsonType: 'object',
        required: ['pollId', 'timestamp', 'type', 'network'],
        properties: {
          pollId: { bsonType: 'objectId' },
          voter: { bsonType: 'string' },
          option: { bsonType: 'string' },
          options: { bsonType: 'array' },
          timestamp: { bsonType: 'date' },
          txId: { bsonType: 'string' },
          verificationHash: { bsonType: 'string' },
          type: { bsonType: 'string', enum: ['Public', 'Private'] },
          network: { bsonType: 'string', enum: ['mainnet', 'testnet'] }
        }
      }
    }
  });
  
  // Create indexes for better performance
  db.polls.createIndex({ creator: 1 });
  db.polls.createIndex({ status: 1 });
  db.polls.createIndex({ network: 1 });
  db.votes.createIndex({ pollId: 1 });
  db.votes.createIndex({ voter: 1 });
  
  print('Database schema created successfully');
" || handle_error "creating database schema"

# Step 4: Install MongoDB Node.js driver and Mongoose
print_status "Installing MongoDB Node.js dependencies..."
cd "${APP_DIR}" || handle_error "changing to app directory"
npm install --save mongoose dotenv || handle_error "installing Mongoose and dotenv"

# Step 5: Create .env file for database connection
print_status "Creating environment configuration..."

# Create .env file if it doesn't exist
if [ ! -f "${APP_DIR}/.env" ]; then
  cat > "${APP_DIR}/.env" << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/${DB_NAME}
MONGODB_USER=${DB_USER}
MONGODB_PASS=${DB_PASS}
EOF
  print_success "Created .env file with database configuration"
else
  # Append to existing .env file
  cat >> "${APP_DIR}/.env" << EOF

# MongoDB Configuration (added by setup script)
MONGODB_URI=mongodb://localhost:27017/${DB_NAME}
MONGODB_USER=${DB_USER}
MONGODB_PASS=${DB_PASS}
EOF
  print_success "Updated .env file with database configuration"
fi

# Step 6: Create database connection file
print_status "Creating database connection file..."

mkdir -p "${APP_DIR}/src/db"

cat > "${APP_DIR}/src/db/connection.js" << 'EOF'
/**
 * MongoDB database connection for PartiVotes
 */
const mongoose = require('mongoose');
require('dotenv').config();

// Get connection details from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/partivotes';
const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PASS = process.env.MONGODB_PASS;

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Add authentication if credentials are provided
if (MONGODB_USER && MONGODB_PASS) {
  options.auth = {
    username: MONGODB_USER,
    password: MONGODB_PASS
  };
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Disconnect from MongoDB
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    return false;
  }
};

// MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = { connectDB, disconnectDB };
EOF

# Step 7: Create Poll model
mkdir -p "${APP_DIR}/src/db/models"

cat > "${APP_DIR}/src/db/models/Poll.js" << 'EOF'
/**
 * Poll model for PartiVotes
 */
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: String, required: true }, // Wallet address
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
  timestamps: true // Adds createdAt and updatedAt fields
});

// Add index for faster queries
pollSchema.index({ status: 1 });
pollSchema.index({ creator: 1 });
pollSchema.index({ network: 1 });

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
EOF

# Step 8: Create Vote model
cat > "${APP_DIR}/src/db/models/Vote.js" << 'EOF'
/**
 * Vote model for PartiVotes
 */
const mongoose = require('mongoose');

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
    default: 'mainnet'
  }
});

// Add indexes for faster queries
voteSchema.index({ pollId: 1 });
voteSchema.index({ voter: 1 });
voteSchema.index({ type: 1 });

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
EOF

# Step 9: Create database service file
mkdir -p "${APP_DIR}/src/services"

cat > "${APP_DIR}/src/services/dbService.js" << 'EOF'
/**
 * Database service for PartiVotes
 * Provides methods to interact with the MongoDB database
 */
const { connectDB } = require('../db/connection');
const Poll = require('../db/models/Poll');
const Vote = require('../db/models/Vote');

// Initialize database connection
const initDatabase = async () => {
  return await connectDB();
};

// Poll methods
const pollService = {
  // Get all polls
  getPolls: async (filter = {}) => {
    try {
      return await Poll.find(filter).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching polls:', error);
      throw error;
    }
  },
  
  // Get a single poll by ID
  getPoll: async (id) => {
    try {
      return await Poll.findById(id);
    } catch (error) {
      console.error(`Error fetching poll ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new poll
  createPoll: async (pollData) => {
    try {
      const poll = new Poll(pollData);
      return await poll.save();
    } catch (error) {
      console.error('Error creating poll:', error);
      throw error;
    }
  },
  
  // Update a poll
  updatePoll: async (id, pollData) => {
    try {
      return await Poll.findByIdAndUpdate(id, pollData, { new: true });
    } catch (error) {
      console.error(`Error updating poll ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a poll
  deletePoll: async (id) => {
    try {
      await Vote.deleteMany({ pollId: id }); // Delete associated votes
      return await Poll.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting poll ${id}:`, error);
      throw error;
    }
  }
};

// Vote methods
const voteService = {
  // Get all votes for a poll
  getVotes: async (pollId) => {
    try {
      return await Vote.find({ pollId });
    } catch (error) {
      console.error(`Error fetching votes for poll ${pollId}:`, error);
      throw error;
    }
  },
  
  // Get a user's vote on a poll
  getUserVote: async (pollId, voter) => {
    try {
      return await Vote.findOne({ pollId, voter });
    } catch (error) {
      console.error(`Error fetching user vote for poll ${pollId}:`, error);
      throw error;
    }
  },
  
  // Create a new vote
  createVote: async (voteData) => {
    try {
      // Start a session for transaction
      const session = await Vote.startSession();
      session.startTransaction();
      
      try {
        // Create the vote
        const vote = new Vote(voteData);
        await vote.save({ session });
        
        // Update poll vote count
        await Poll.findByIdAndUpdate(
          voteData.pollId, 
          { $inc: { totalVotes: 1 } },
          { session }
        );
        
        // If it's a single choice vote, increment the option's vote count
        if (voteData.option) {
          await Poll.updateOne(
            { 
              _id: voteData.pollId,
              'options.text': voteData.option 
            },
            { 
              $inc: { 'options.$.votes': 1 } 
            },
            { session }
          );
        }
        
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
        
        return vote;
      } catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } catch (error) {
      console.error('Error creating vote:', error);
      throw error;
    }
  }
};

module.exports = {
  initDatabase,
  pollService,
  voteService
};
EOF

# Make script executable
chmod +x "${APP_DIR}/scripts/db_setup.sh"

# Print success message
print_success "MongoDB setup completed successfully!"
print_success "Database: ${DB_NAME}"
print_success "User: ${DB_USER}"
print_success "Password: ${DB_PASS}"

print_status "Next steps:"
print_status "1. Update your application to use the database service"
print_status "2. Restart your application: pm2 restart partivotes"

# Save credentials to a secure file for reference
cat > "${APP_DIR}/scripts/mongodb_credentials.txt" << EOF
MongoDB Credentials for PartiVotes
----------------------------------
Database: ${DB_NAME}
Username: ${DB_USER}
Password: ${DB_PASS}
Connection URI: mongodb://${DB_USER}:${DB_PASS}@localhost:27017/${DB_NAME}

IMPORTANT: Keep this information secure!
EOF

chmod 600 "${APP_DIR}/scripts/mongodb_credentials.txt"
print_warning "Credentials saved to scripts/mongodb_credentials.txt"
