/**
 * Database service for PartiVotes
 * Provides methods to interact with the MongoDB database
 */
import mongoose, { connectDB } from '../db/connection';
import Poll from '../db/models/Poll';
import Vote from '../db/models/Vote';

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// Check if we're in production browser environment
const isProduction = isBrowser && (
  window.location.hostname === 'partivotes.xyz' || 
  window.location.hostname === 'www.partivotes.xyz'
);

// Initialize database connection
export const initDatabase = async () => {
  try {
    const connected = await connectDB();
    console.log('Database initialization result:', connected ? 'Connected' : 'Using fallback');
    
    // Initialize localStorage as fallback in browser environments
    if (isBrowser) {
      initLocalStorage();
    }
    
    return connected;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Initialize localStorage with default structure
const initLocalStorage = () => {
  try {
    // Make sure we have the polls collection
    if (!localStorage.getItem('partivotes-polls')) {
      localStorage.setItem('partivotes-polls', '[]');
    }
    
    // Make sure we have the votes collection
    if (!localStorage.getItem('partivotes-votes')) {
      localStorage.setItem('partivotes-votes', '[]');
    }
    
    // Make sure we have the created polls collection
    if (!localStorage.getItem('partivotes_created_polls')) {
      localStorage.setItem('partivotes_created_polls', '[]');
    }
    
    console.log('LocalStorage initialized');
  } catch (error) {
    console.error('Error initializing localStorage:', error);
  }
};

// Helper to store data in localStorage
const storeInLocalStorage = (collection, data) => {
  try {
    // Get existing data
    const existingData = JSON.parse(localStorage.getItem(`partivotes-${collection}`) || '[]');
    
    // Check if this item already exists (by ID)
    const existingIndex = existingData.findIndex(item => 
      (item._id && data._id && item._id.toString() === data._id.toString()) || 
      (item.id && data.id && item.id === data.id)
    );
    
    if (existingIndex !== -1) {
      // Update existing item
      existingData[existingIndex] = { ...existingData[existingIndex], ...data };
      console.log(`Updated existing item in localStorage: ${collection}`);
    } else {
      // Add new data
      existingData.push(data);
      console.log(`Added new item to localStorage: ${collection}`);
    }
    
    // Save back to localStorage
    localStorage.setItem(`partivotes-${collection}`, JSON.stringify(existingData));
    
    // Also update created polls if this is a poll
    if (collection === 'polls') {
      try {
        const createdPolls = JSON.parse(localStorage.getItem('partivotes_created_polls') || '[]');
        const createdIndex = createdPolls.findIndex(item => 
          (item._id && data._id && item._id.toString() === data._id.toString()) || 
          (item.id && data.id && item.id === data.id)
        );
        
        if (createdIndex !== -1) {
          createdPolls[createdIndex] = { ...createdPolls[createdIndex], ...data };
        } else {
          createdPolls.push(data);
        }
        
        localStorage.setItem('partivotes_created_polls', JSON.stringify(createdPolls));
      } catch (error) {
        console.error('Error updating created polls:', error);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error storing in localStorage: ${collection}`, error);
    return false;
  }
};

// Helper to get all polls from all sources
const getAllPolls = () => {
  try {
    // Get polls from main collection
    const mainPolls = JSON.parse(localStorage.getItem('partivotes-polls') || '[]');
    
    // Get polls from created polls collection
    const createdPolls = JSON.parse(localStorage.getItem('partivotes_created_polls') || '[]');
    
    // Merge polls, avoiding duplicates
    const allPolls = [...mainPolls];
    
    // Add created polls that aren't already in the main collection
    createdPolls.forEach(createdPoll => {
      const exists = allPolls.some(poll => 
        (poll._id && createdPoll._id && poll._id.toString() === createdPoll._id.toString())
      );
      
      if (!exists) {
        allPolls.push(createdPoll);
      }
    });
    
    console.log(`Combined ${mainPolls.length} main polls and ${createdPolls.length} created polls into ${allPolls.length} total polls`);
    return allPolls;
  } catch (error) {
    console.error('Error getting all polls:', error);
    return [];
  }
};

// Database service
const pollService = {
  // Poll methods
  getPolls: async (filter = {}) => {
    console.log('pollService: Getting polls with filter:', filter);
    
    try {
      const isProduction = window.location.hostname === 'partivotes.xyz' || 
                          window.location.hostname === 'www.partivotes.xyz';
      
      if (isProduction) {
        console.log('Using API to fetch polls in production');
        try {
          // Build query string for filters
          const queryParams = new URLSearchParams();
          if (filter.status) queryParams.append('status', filter.status);
          if (filter.creator) queryParams.append('creator', filter.creator);
          if (filter.type) queryParams.append('type', filter.type);
          
          const queryString = queryParams.toString();
          const url = `/api/polls${queryString ? `?${queryString}` : ''}`;
          
          console.log('Fetching from API URL:', url);
          const response = await fetch(url);
          console.log('API response status:', response.status);
          
          if (!response.ok) {
            console.error('API response not OK:', response.status, response.statusText);
            throw new Error(`API responded with status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Received data from API:', data.length, 'polls');
          return data;
        } catch (error) {
          console.error('API error, falling back to mock data:', error.message);
          return getMockPolls(filter);
        }
      } else {
        // Local development
        console.log('Using mock polls as fallback');
        return getMockPolls(filter);
      }
    } catch (error) {
      console.error('Error in getPolls:', error);
      return getMockPolls(filter);
    }
  },
  
  // Get a single poll by ID
  getPoll: async (id) => {
    console.log(`Getting poll with ID: ${id}`);
    try {
      const isProduction = window.location.hostname === 'partivotes.xyz' || 
                          window.location.hostname === 'www.partivotes.xyz';
      
      if (isProduction) {
        try {
          // Try to fetch from API first
          const url = `/api/polls/${id}`;
          console.log('Fetching from API URL:', url);
          const response = await fetch(url);
          
          if (!response.ok) {
            console.error('API response not OK:', response.status, response.statusText);
            throw new Error(`API responded with status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Received poll from API:', data.title);
          return data;
        } catch (error) {
          console.error(`Error getting poll with ID ${id} from API:`, error);
          
          // If API fails, try to find in all polls
          console.log('Attempting to find poll in all polls as fallback');
          const allPolls = await getMockPolls();
          
          // Check for both id and _id fields
          const poll = allPolls.find(p => 
            p.id === id || 
            p._id === id || 
            (p._id && p._id.toString() === id)
          );
          
          if (poll) {
            console.log('Found poll in fallback data:', poll.title);
            return poll;
          }
          
          console.error('Poll not found in API or fallback data');
          return null;
        }
      } else {
        // Use mock data for local development
        const allPolls = getMockPolls();
        
        // Check for both id and _id fields
        const poll = allPolls.find(p => 
          p.id === id || 
          p._id === id || 
          (p._id && p._id.toString() === id)
        );
        
        if (poll) {
          console.log('Found poll in mock data:', poll.title);
          return poll;
        }
        
        console.log('Poll not found in mock data');
        return null;
      }
    } catch (error) {
      console.error(`Error getting poll with ID ${id}:`, error);
      return null;
    }
  },
  
  // Create a new poll
  createPoll: async (pollData) => {
    console.log('Creating new poll:', pollData);
    try {
      const isProduction = window.location.hostname === 'partivotes.xyz' || 
                          window.location.hostname === 'www.partivotes.xyz';
      
      if (isProduction) {
        try {
          const url = '/api/polls';
          console.log('Posting to API URL:', url);
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(pollData)
          });
          
          if (!response.ok) {
            console.error('API response not OK:', response.status, response.statusText);
            throw new Error(`API responded with status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('New poll created via API:', data.title);
          return data;
        } catch (error) {
          console.error('Error creating poll via API:', error);
          // Fall back to mock data
          const newPoll = {
            ...pollData,
            id: `poll-${Date.now()}`,
            createdAt: new Date()
          };
          return newPoll;
        }
      } else {
        // Use mock data for local development
        const newPoll = {
          ...pollData,
          id: `poll-${Date.now()}`,
          createdAt: new Date()
        };
        return newPoll;
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      throw error;
    }
  },
  
  // Update a poll
  updatePoll: async (id, pollData) => {
    try {
      // In browser, update localStorage
      if (isBrowser) {
        try {
          // Update in main polls collection
          const mainPolls = JSON.parse(localStorage.getItem('partivotes-polls') || '[]');
          const pollIndex = mainPolls.findIndex(p => p._id === id || p.id === id);
          
          if (pollIndex !== -1) {
            mainPolls[pollIndex] = {
              ...mainPolls[pollIndex],
              ...pollData,
              updatedAt: new Date()
            };
            
            localStorage.setItem('partivotes-polls', JSON.stringify(mainPolls));
            console.log('Poll updated in localStorage:', mainPolls[pollIndex]);
            
            // Also update in created polls if it exists there
            const createdPolls = JSON.parse(localStorage.getItem('partivotes_created_polls') || '[]');
            const createdIndex = createdPolls.findIndex(p => p._id === id || p.id === id);
            
            if (createdIndex !== -1) {
              createdPolls[createdIndex] = {
                ...createdPolls[createdIndex],
                ...pollData,
                updatedAt: new Date()
              };
              
              localStorage.setItem('partivotes_created_polls', JSON.stringify(createdPolls));
            }
            
            return mainPolls[pollIndex];
          }
          
          // If not found in main collection, try created polls
          const createdPolls = JSON.parse(localStorage.getItem('partivotes_created_polls') || '[]');
          const createdIndex = createdPolls.findIndex(p => p._id === id || p.id === id);
          
          if (createdIndex !== -1) {
            createdPolls[createdIndex] = {
              ...createdPolls[createdIndex],
              ...pollData,
              updatedAt: new Date()
            };
            
            localStorage.setItem('partivotes_created_polls', JSON.stringify(createdPolls));
            console.log('Poll updated in created polls:', createdPolls[createdIndex]);
            return createdPolls[createdIndex];
          }
          
          return null;
        } catch (localError) {
          console.error('Error updating in localStorage:', localError);
          return null;
        }
      }
      
      // In Node.js, use MongoDB
      return await Poll.findByIdAndUpdate(id, pollData, { new: true });
    } catch (error) {
      console.error(`Error updating poll ${id}:`, error);
      return null;
    }
  },
  
  // Delete a poll
  deletePoll: async (id) => {
    try {
      // In browser, delete from localStorage
      if (isBrowser) {
        try {
          // Delete from main polls collection
          const mainPolls = JSON.parse(localStorage.getItem('partivotes-polls') || '[]');
          const pollIndex = mainPolls.findIndex(p => p._id === id || p.id === id);
          
          let deletedPoll = null;
          
          if (pollIndex !== -1) {
            deletedPoll = mainPolls[pollIndex];
            mainPolls.splice(pollIndex, 1);
            localStorage.setItem('partivotes-polls', JSON.stringify(mainPolls));
            console.log('Poll deleted from localStorage:', deletedPoll);
          }
          
          // Also delete from created polls if it exists there
          const createdPolls = JSON.parse(localStorage.getItem('partivotes_created_polls') || '[]');
          const createdIndex = createdPolls.findIndex(p => p._id === id || p.id === id);
          
          if (createdIndex !== -1) {
            deletedPoll = createdPolls[createdIndex];
            createdPolls.splice(createdIndex, 1);
            localStorage.setItem('partivotes_created_polls', JSON.stringify(createdPolls));
          }
          
          return deletedPoll;
        } catch (localError) {
          console.error('Error deleting from localStorage:', localError);
          return null;
        }
      }
      
      // In Node.js, use MongoDB
      return await Poll.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting poll ${id}:`, error);
      return null;
    }
  }
};

// Helper function to filter polls
const filterPolls = (polls, filter) => {
  let filteredPolls = polls;
  
  if (filter.status) {
    console.log(`Filtering by status: ${filter.status}`);
    filteredPolls = filteredPolls.filter(poll => poll.status === filter.status);
  }
  
  if (filter.creator) {
    console.log(`Filtering by creator: ${filter.creator}`);
    filteredPolls = filteredPolls.filter(poll => poll.creator === filter.creator);
  }
  
  if (filter.type) {
    console.log(`Filtering by type: ${filter.type}`);
    filteredPolls = filteredPolls.filter(poll => poll.type === filter.type);
  }
  
  return filteredPolls;
};

// Helper function to get mock polls
const getMockPolls = (filter = {}) => {
  console.log('Using mock polls as fallback');
  
  // Create mock polls for demonstration
  const mockPolls = [
    { 
      _id: 'mock1', 
      title: 'Should we implement API-based architecture?', 
      status: 'ACTIVE',
      creator: '0xMockAddress1',
      options: ['Yes', 'No', 'Maybe'],
      startTime: new Date(),
      endTime: new Date(Date.now() + 86400000),
      description: 'This is a temporary mock poll while we fix the API connection'
    },
    { 
      _id: 'mock2', 
      title: 'When should we deploy the server API?', 
      status: 'PENDING',
      creator: '0xMockAddress2',
      options: ['This week', 'Next week', 'Next month'],
      startTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 86400000 * 2),
      description: 'Temporary mock poll for testing the pending tab'
    },
    { 
      _id: 'mock3', 
      title: 'Did you like the old architecture?', 
      status: 'ENDED',
      creator: '0xMockAddress3',
      options: ['Yes', 'No'],
      startTime: new Date(Date.now() - 86400000 * 2),
      endTime: new Date(Date.now() - 86400000),
      description: 'Temporary mock poll for testing the ended tab',
      results: [
        { option: 'Yes', votes: 5 },
        { option: 'No', votes: 3 }
      ]
    }
  ];
  
  // Filter mock polls by status if specified
  if (filter && filter.status) {
    const status = typeof filter.status === 'string' ? filter.status.toUpperCase() : filter.status;
    return mockPolls.filter(poll => poll.status === status);
  }
  
  // Filter by creator if specified
  if (filter && filter.creator) {
    return mockPolls.filter(poll => poll.creator === filter.creator);
  }
  
  return mockPolls;
};

// Vote methods
const voteService = {
  // Get all votes for a poll
  getVotesForPoll: async (pollId) => {
    console.log(`Getting votes for poll: ${pollId}`);
    // Implementation would go here
    return [];
  },
  
  // Add a vote to a poll
  addVote: async (voteData) => {
    console.log('Adding vote:', voteData);
    // Implementation would go here
    return { success: true, vote: voteData };
  }
};

// Export the services
export { pollService };
