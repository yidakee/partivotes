/**
 * Poll retrieval functions
 */
import { POLL_STATUS } from '../../utils/constants';
import { getPolls as apiGetPolls, getPoll as apiGetPoll } from '../apiService';

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
    // Get polls from API
    const polls = await apiGetPolls(options);
    console.log(`Found ${polls.length} polls matching filter:`, options);
    
    if (polls.length === 0) {
      console.log('No polls found, returning empty array');
    }
    
    return polls;
  } catch (error) {
    console.error('Error getting polls:', error);
    // Return empty array on error
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
    // Get poll from API
    const poll = await apiGetPoll(id);
    
    if (poll) {
      console.log('Found poll:', poll.title);
      return poll;
    } else {
      console.log(`Poll with ID ${id} not found`);
      return null;
    }
  } catch (error) {
    console.error(`Error getting poll with ID ${id}:`, error);
    return null;
  }
};

/**
 * Format a poll from database to the expected format
 * @param {Object} poll - Poll from database
 * @returns {Object} Formatted poll
 */
export const formatPoll = (poll) => {
  if (!poll) return null;
  
  // Clone the poll to avoid modifying the original
  const formattedPoll = { ...poll };
  
  // Format dates if they exist
  if (formattedPoll.startDate) {
    formattedPoll.startDate = new Date(formattedPoll.startDate);
  }
  
  if (formattedPoll.endDate) {
    formattedPoll.endDate = new Date(formattedPoll.endDate);
  }
  
  return formattedPoll;
};
