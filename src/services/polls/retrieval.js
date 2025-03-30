/**
 * Poll retrieval functions
 */
import { mockPolls } from '../../data/mockPolls';
import { getCreatedPolls } from './storage';

// Flag to use mock data for development
const USE_MOCK_DATA = true; // Force to true to ensure mock data is used

/**
 * Get all polls
 * @param {Object} filters - Optional filters for polls
 * @returns {Promise<Array>} Promise resolving to array of polls
 */
export const getPolls = async (filters = {}) => {
  console.log('Using mock poll data');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let polls = mockPolls;
  
  // Add any created polls to the list
  polls = [...polls, ...getCreatedPolls()];
  
  // Apply filters if provided
  if (filters.status) {
    polls = polls.filter(poll => poll.status === filters.status);
  }
  
  if (filters.creator) {
    polls = polls.filter(poll => poll.creator === filters.creator);
  }
  
  if (filters.type) {
    polls = polls.filter(poll => poll.type === filters.type);
  }
  
  console.log('Returning polls:', polls);
  return polls;
};

/**
 * Get a specific poll by ID
 * @param {string} pollId - ID of the poll to retrieve
 * @returns {Promise<Object>} Promise resolving to poll object
 */
export const getPoll = async (pollId) => {
  console.log(`Getting poll ${pollId}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // First check our created polls
  const createdPoll = getCreatedPolls().find(p => p.id === pollId);
  if (createdPoll) {
    console.log(`Found poll ${pollId} in created polls store`);
    return { ...createdPoll };
  }
  
  // Then check mock polls
  const mockPoll = mockPolls.find(p => p.id === pollId);
  
  if (mockPoll) {
    console.log(`Found poll ${pollId} in mock polls`);
    return { ...mockPoll };
  }
  
  console.log(`Poll ${pollId} not found`);
  return null;
};
