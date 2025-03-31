/**
 * Production debugging script for PartiVotes 
 * 
 * Instructions:
 * 1. Add the code in <!-- DEBUG SCRIPT --> section to the bottom of your index.html
 * 2. Visit the site in a browser
 * 3. Check the console logs for detailed information
 */

/*
<!-- DEBUG SCRIPT -->
<script>
  (function() {
    console.log('==== PARTIVOTES PRODUCTION DEBUG ====');
    console.log('Environment Info:');
    console.log('- Hostname:', window.location.hostname);
    console.log('- Path:', window.location.pathname);
    console.log('- Search:', window.location.search);
    console.log('- Is Production:', ['partivotes.xyz', 'www.partivotes.xyz'].includes(window.location.hostname));
    
    // Wait for app to load
    window.addEventListener('load', function() {
      // Force MongoDB Detection
      if (['partivotes.xyz', 'www.partivotes.xyz'].includes(window.location.hostname)) {
        console.log('Production site detected - should use MongoDB');
        
        // Test URL path handling
        const path = window.location.pathname;
        console.log('URL Path Analysis:');
        console.log('- Current path:', path);
        console.log('- Lowercase:', path.toLowerCase());
        console.log('- Contains /polls/active:', path.toLowerCase().includes('/polls/active'));
        console.log('- Contains /polls/ACTIVE:', path.toLowerCase().includes('/polls/active'));
        
        // Override localStorage methods to track usage
        const originalGetItem = localStorage.getItem;
        localStorage.getItem = function(key) {
          console.log('localStorage.getItem called for key:', key);
          return originalGetItem.call(localStorage, key);
        };
        
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
          console.log('localStorage.setItem called for key:', key);
          return originalSetItem.call(localStorage, key, value);
        };
        
        // Add MongoDB connection check
        console.log('If you see MongoDB connection logs below, it means the app is trying to connect:');
      }
    });
    
    // Monitor errors
    window.addEventListener('error', function(event) {
      console.error('CAPTURED ERROR:', event.message);
      console.error('- File:', event.filename);
      console.error('- Line:', event.lineno);
      console.error('- Column:', event.colno);
      console.error('- Stack:', event.error && event.error.stack);
    });
  })();
</script>
<!-- END DEBUG SCRIPT -->
*/

// For node.js direct test (run with: node production-debug.js)
console.log('PartiVotes Production Debug - Server Test');

// Test MongoDB connection
async function testMongoDB() {
  try {
    const mongoose = require('mongoose');
    const dotenv = require('dotenv');
    
    // Load environment variables
    dotenv.config();
    
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
    
    console.log('Connecting to MongoDB at URI:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB connected successfully');
    
    // Check polls collection
    const db = mongoose.connection.db;
    const pollCount = await db.collection('polls').countDocuments();
    console.log('Total polls in database:', pollCount);
    
    // Check status values
    const statuses = await db.collection('polls').distinct('status');
    console.log('Status values in database:', statuses);
    
    // Count by status
    for (const status of statuses) {
      const count = await db.collection('polls').countDocuments({ status });
      console.log(`Polls with status ${status}:`, count);
    }
    
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return false;
  }
}

// Only run if executed directly
if (require.main === module) {
  testMongoDB().then(result => {
    console.log('MongoDB test completed:', result ? 'Success' : 'Failed');
  });
}
