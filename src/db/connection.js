/**
 * MongoDB database connection for PartiVotes
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// More reliable browser environment detection
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// Check if we're in production - we'll use this to allow browser connections in production
const isProduction = isBrowser && (
  window.location.hostname === 'partivotes.xyz' || 
  window.location.hostname === 'www.partivotes.xyz'
);

// Create a mock mongoose implementation for browser environments
// This will be used as a fallback if direct MongoDB connection fails in browser
const createBrowserMongoose = () => {
  console.log('Creating mock mongoose for browser fallback');
  return {
    connect: () => Promise.resolve(false),
    disconnect: () => Promise.resolve(false),
    connection: {
      on: () => {}
    }
  };
};

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

// Use real mongoose in Node.js or in production browser, mock in development browser
const mongooseImpl = (isBrowser && !isProduction) ? createBrowserMongoose() : mongoose;

// Connect to MongoDB
export const connectDB = async () => {
  try {
    // In browser but not production, use the mock implementation
    if (isBrowser && !isProduction) {
      console.log('Development browser environment detected, using mock MongoDB connection');
      return false;
    }
    
    // In production browser or Node.js environment, try to connect
    console.log('Attempting MongoDB connection in', isBrowser ? 'production browser' : 'Node.js', 'environment');
    await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Disconnect from MongoDB
export const disconnectDB = async () => {
  try {
    if (isBrowser && !isProduction) {
      console.log('Development browser environment detected, skipping MongoDB disconnection');
      return false;
    }
    
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    return false;
  }
};

// MongoDB connection events - only attach if we have a valid connection object
if (mongooseImpl && mongooseImpl.connection) {
  mongooseImpl.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
  });

  mongooseImpl.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  mongooseImpl.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  mongooseImpl.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
  });
}

// Export mongoose instance
export default mongooseImpl;
