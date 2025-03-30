/**
 * Poll creation functions
 */
import { POLL_STATUS, POLL_TYPE } from '../../utils/constants';
import { addCreatedPoll } from './storage';

/**
 * Create a new poll
 * @param {Object} pollData - Poll data
 * @returns {Promise<Object>} Promise resolving to created poll object
 */
export const createPoll = async (pollData) => {
  console.log('Creating poll with data:', pollData);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const now = new Date();
  
  // Generate a unique ID
  const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Create the poll object
  const newPoll = {
    id,
    ...pollData,
    creator: pollData.creator || '0x1234567890123456789012345678901234567890',
    createdAt: now.toISOString(),
    status: POLL_STATUS.PENDING,
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
  
  // Update the status based on dates
  if (new Date(newPoll.startDate) <= now && new Date(newPoll.endDate) > now) {
    newPoll.status = POLL_STATUS.ACTIVE;
  } else if (new Date(newPoll.endDate) <= now) {
    newPoll.status = POLL_STATUS.ENDED;
  }
  
  // Add to our created polls store
  addCreatedPoll(newPoll);
  
  console.log('Created poll:', newPoll);
  
  return newPoll;
};

/**
 * Get the cost of creating a poll with MPC
 * @returns {Promise<number>} Promise resolving to the cost in tokens
 */
export const getPollCreationCost = async () => {
  return 10; // Mock cost in tokens
};
