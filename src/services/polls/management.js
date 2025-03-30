/**
 * Poll management functions
 */
import { POLL_STATUS } from '../../utils/constants';
import { getPoll } from './retrieval';
import { updateCreatedPoll } from './storage';

/**
 * End a poll early
 * @param {string} pollId - ID of the poll to end
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
export const endPoll = async (pollId) => {
  console.log(`Ending poll ${pollId}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get the poll
  const poll = await getPoll(pollId);
  
  if (!poll) {
    throw new Error('Poll not found');
  }
  
  if (poll.status !== POLL_STATUS.ACTIVE) {
    throw new Error('Poll is not active');
  }
  
  // Update the poll
  const updatedPoll = { ...poll, status: POLL_STATUS.ENDED };
  
  // Update in our stores if it's a created poll
  const createdPolls = await getPoll(pollId);
  if (createdPolls) {
    updateCreatedPoll(updatedPoll);
  }
  
  console.log('Updated poll after ending:', updatedPoll);
  
  return updatedPoll;
};
