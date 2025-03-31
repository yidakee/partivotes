/**
 * Poll creation functions
 */
import { createPoll as apiCreatePoll } from '../apiService';

/**
 * Creates a new poll
 * @param {Object} pollData - Data for the new poll
 * @returns {Promise<Object>} - The created poll
 */
export const createPoll = async (pollData) => {
  try {
    console.log('Creation Service: Creating poll with data:', pollData);
    
    // Format poll data for API
    const formattedPoll = {
      title: pollData.title,
      description: pollData.description || '',
      options: pollData.options || [],
      startDate: pollData.startDate || new Date(),
      endDate: pollData.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      type: pollData.type || 'single',
      status: (pollData.status || 'ACTIVE').toUpperCase(),
      creator: pollData.creator || 'anonymous',
      network: pollData.network || 'testnet'
    };
    
    console.log('Creation Service: Formatted poll data:', formattedPoll);
    
    // Create poll via API
    const createdPoll = await apiCreatePoll(formattedPoll);
    console.log('Creation Service: Poll created successfully:', createdPoll);
    
    return createdPoll;
  } catch (error) {
    console.error('Creation Service Error:', error);
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
