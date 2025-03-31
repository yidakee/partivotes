/**
 * Poll creation functions
 */
import { POLL_STATUS } from '../../utils/constants';
import { createPoll as apiCreatePoll } from '../apiService';

/**
 * Create a new poll
 * @param {Object} pollData - Poll data
 * @returns {Promise<Object>} Promise resolving to created poll object
 */
export const createPoll = async (pollData) => {
  console.log('Creating poll with data:', pollData);
  
  try {
    // Prepare poll data
    const poll = {
      ...pollData,
      status: POLL_STATUS.ACTIVE.toUpperCase(), // API expects uppercase status
      createdAt: new Date().toISOString(),
    };
    
    // Create poll via API
    const createdPoll = await apiCreatePoll(poll);
    console.log('Poll created successfully:', createdPoll);
    
    return createdPoll;
  } catch (error) {
    console.error('Error creating poll:', error);
    throw error;
  }
};

/**
 * Get the cost of creating a poll with MPC
 * @returns {Promise<number>} Promise resolving to the cost in tokens
 */
export const getPollCreationCost = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return 100; // Fixed cost for now
};
