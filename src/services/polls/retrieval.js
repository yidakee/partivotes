/**
 * Poll retrieval functions
 */
import { POLL_STATUS } from '../../utils/constants';
import { pollService } from '../dbService';

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

/**
 * Get all polls
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} Promise resolving to array of polls
 */
export const getPolls = async (options = {}) => {
  console.log('Getting polls with options:', options);
  
  try {
    // Build filter
    const filter = {};
    
    // Filter by status
    if (options.status) {
      // Convert status to uppercase to match MongoDB values
      // MongoDB stores status in uppercase, while our constants are lowercase
      filter.status = options.status.toUpperCase();
      console.log(`Filtering polls by status: ${options.status} (converted to ${filter.status} for MongoDB)`);
    }
    
    // Filter by creator
    if (options.creator) {
      filter.creator = options.creator;
      console.log(`Filtering polls by creator: ${options.creator}`);
    }
    
    // Filter by poll type
    if (options.type) {
      filter.type = options.type;
      console.log(`Filtering polls by type: ${options.type}`);
    }
    
    // Get polls from database or localStorage (handled by pollService)
    const polls = await pollService.getPolls(filter);
    console.log(`Found ${polls.length} polls matching filter:`, filter);
    
    if (polls.length === 0) {
      console.log('No polls found matching the criteria');
      return [];
    }
    
    // Map polls to expected format (formatPoll will convert statuses to lowercase)
    const formattedPolls = polls.map(poll => formatPoll(poll));
    console.log(`Returning ${formattedPolls.length} formatted polls`);
    return formattedPolls;
  } catch (error) {
    console.error('Error fetching polls:', error);
    return [];
  }
};

/**
 * Get a single poll by ID
 * @param {string} id - ID of the poll to get
 * @returns {Promise<Object>} Promise resolving to poll object
 */
export const getPoll = async (id) => {
  console.log(`Getting poll with ID: ${id}`);
  
  try {
    // Get poll from database or localStorage (handled by pollService)
    const poll = await pollService.getPoll(id);
    
    if (poll) {
      console.log('Found poll:', poll.title);
      return formatPoll(poll);
    }
    
    console.log('Poll not found');
    return null;
  } catch (error) {
    console.error(`Error fetching poll ${id}:`, error);
    return null;
  }
};

/**
 * Format a poll from database to the expected format
 * @param {Object} poll - Poll from database
 * @returns {Object} Formatted poll
 */
const formatPoll = (poll) => {
  // If it's already in the expected format, return as is
  if (poll.options && poll.options.length > 0 && typeof poll.options[0] === 'object' && poll.options[0].id) {
    return poll;
  }
  
  // MongoDB ObjectId to string if needed
  const pollId = poll._id ? poll._id.toString() : poll.id;
  
  // Normalize status to lowercase to match our constants
  let normalizedStatus = poll.status;
  if (normalizedStatus && typeof normalizedStatus === 'string') {
    // Convert uppercase status (from MongoDB) to lowercase (for our app)
    normalizedStatus = normalizedStatus.toLowerCase();
  }
  
  return {
    id: pollId,
    title: poll.title,
    description: poll.description,
    creator: poll.creator,
    options: Array.isArray(poll.options) 
      ? poll.options.map((option, index) => {
          // Handle both formats of options (object or string)
          if (typeof option === 'object') {
            return {
              id: `${pollId}-${index}`,
              text: option.text,
              votes: option.votes || 0
            };
          } else {
            return {
              id: `${pollId}-${index}`,
              text: option,
              votes: 0
            };
          }
        })
      : [],
    startDate: poll.startDate,
    endDate: poll.endDate,
    createdAt: poll.createdAt || new Date().toISOString(),
    status: normalizedStatus,
    type: poll.type,
    maxSelections: poll.maxSelections || 1,
    totalVotes: poll.totalVotes || 0,
    network: poll.network || 'mainnet',
    hasVoted: false,
    isCreator: false
  };
};
