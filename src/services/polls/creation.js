/**
 * Poll creation functions
 */
import { POLL_STATUS, POLL_TYPE } from '../../utils/constants';
import { addCreatedPoll } from './storage';
import { pollService } from '../dbService';

/**
 * Create a new poll
 * @param {Object} pollData - Poll data
 * @returns {Promise<Object>} Promise resolving to created poll object
 */
export const createPoll = async (pollData) => {
  console.log('Creating poll with data:', pollData);
  
  try {
    const now = new Date();
    
    // Create the poll object with MongoDB schema format
    const newPoll = {
      title: pollData.title,
      description: pollData.description,
      creator: pollData.creator || '0x1234567890123456789012345678901234567890',
      options: pollData.options.map(option => ({
        text: option,
        votes: 0
      })),
      startDate: new Date(pollData.startDate),
      endDate: new Date(pollData.endDate),
      type: pollData.type,
      maxSelections: pollData.maxSelections || 1,
      network: pollData.network || 'mainnet',
      totalVotes: 0
    };
    
    // Update the status based on dates
    if (new Date(newPoll.startDate) <= now && new Date(newPoll.endDate) > now) {
      newPoll.status = POLL_STATUS.ACTIVE;
    } else if (new Date(newPoll.endDate) <= now) {
      newPoll.status = POLL_STATUS.ENDED;
    } else {
      newPoll.status = POLL_STATUS.PENDING;
    }
    
    // Save to MongoDB
    try {
      console.log('Attempting to save poll to MongoDB:', newPoll);
      const savedPoll = await pollService.createPoll(newPoll);
      console.log('Poll saved to database successfully:', savedPoll);
      
      if (!savedPoll || !savedPoll._id) {
        throw new Error('Failed to save poll to database - no ID returned');
      }
      
      // Also save to local storage during transition period
      const localPoll = {
        id: savedPoll._id.toString(),
        ...pollData,
        creator: pollData.creator || '0x1234567890123456789012345678901234567890',
        createdAt: now.toISOString(),
        status: newPoll.status,
        options: pollData.options.map((option, index) => ({
          id: `${savedPoll._id}-${index}`,
          text: option,
          votes: 0,
          publicVotes: 0,
          privateVotes: 0,
          ...(pollData.type === POLL_TYPE.RANKED_CHOICE ? { rankPoints: 0 } : {})
        })),
        totalVotes: 0,
        publicVotes: 0,
        privateVotes: 0,
        hasVoted: false,
        isCreator: true
      };
      
      addCreatedPoll(localPoll);
      console.log('Poll also saved to local storage:', localPoll);
      
      return {
        ...localPoll,
        _id: savedPoll._id
      };
    } catch (dbError) {
      console.error('Error saving poll to database:', dbError);
      
      // Fallback to local storage if database fails
      console.log('Falling back to local storage');
      
      // Generate a unique ID for local storage
      const id = `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create the poll object for local storage
      const localPoll = {
        id,
        ...pollData,
        creator: pollData.creator || '0x1234567890123456789012345678901234567890',
        createdAt: now.toISOString(),
        status: newPoll.status,
        options: pollData.options.map((option, index) => ({
          id: `${id}-${index}`,
          text: option,
          votes: 0,
          publicVotes: 0,
          privateVotes: 0,
          ...(pollData.type === POLL_TYPE.RANKED_CHOICE ? { rankPoints: 0 } : {})
        })),
        totalVotes: 0,
        publicVotes: 0,
        privateVotes: 0,
        hasVoted: false,
        isCreator: true
      };
      
      addCreatedPoll(localPoll);
      console.log('Poll saved to local storage only:', localPoll);
      
      return localPoll;
    }
  } catch (error) {
    console.error('Error in poll creation process:', error);
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
