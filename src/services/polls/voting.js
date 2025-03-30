/**
 * Poll voting functions
 */
import { POLL_STATUS } from '../../utils/constants';
import { getPoll } from './retrieval';
import { updateCreatedPoll } from './storage';

/**
 * Vote on a poll with a signature (public voting)
 * @param {string} pollId - ID of the poll to vote on
 * @param {string|Array} optionId - ID of the option to vote for, or array of option IDs for multiple choice
 * @param {string} signature - Signature from the wallet
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
export const voteWithSignature = async (pollId, optionId, signature) => {
  console.log(`Voting on poll ${pollId} with option ${JSON.stringify(optionId)} and signature ${signature}`);
  
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
  
  // For multiple choice polls
  const optionIds = Array.isArray(optionId) ? optionId : [optionId];
  
  // Update the poll
  const updatedPoll = { ...poll };
  
  // Mark as voted
  updatedPoll.hasVoted = true;
  
  // Store user's vote
  updatedPoll.userVote = {
    optionId: Array.isArray(optionId) ? null : optionId,
    optionIds: Array.isArray(optionId) ? optionId : null,
    voteMethod: 'signature'
  };
  
  // Update vote counts
  optionIds.forEach(id => {
    const option = updatedPoll.options.find(o => o.id === id);
    if (option) {
      option.votes += 1;
      option.publicVotes = (option.publicVotes || 0) + 1;
    }
  });
  
  // Update total votes
  updatedPoll.totalVotes += 1;
  updatedPoll.publicVotes = (updatedPoll.publicVotes || 0) + 1;
  
  // Update in our stores if it's a created poll
  const createdPolls = await getPoll(pollId);
  if (createdPolls) {
    updateCreatedPoll(updatedPoll);
  }
  
  console.log('Updated poll after vote:', updatedPoll);
  
  return updatedPoll;
};

/**
 * Vote on a poll with MPC (private voting)
 * @param {string} pollId - ID of the poll to vote on
 * @param {string|Array} optionId - ID of the option to vote for, or array of option IDs for multiple choice
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
export const voteWithMPC = async (pollId, optionId) => {
  console.log(`Voting on poll ${pollId} with option ${JSON.stringify(optionId)} using MPC`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Get the poll
  const poll = await getPoll(pollId);
  
  if (!poll) {
    throw new Error('Poll not found');
  }
  
  if (poll.status !== POLL_STATUS.ACTIVE) {
    throw new Error('Poll is not active');
  }
  
  // For multiple choice polls
  const optionIds = Array.isArray(optionId) ? optionId : [optionId];
  
  // Update the poll
  const updatedPoll = { ...poll };
  
  // Mark as voted
  updatedPoll.hasVoted = true;
  
  // Store user's vote
  updatedPoll.userVote = {
    optionId: Array.isArray(optionId) ? null : optionId,
    optionIds: Array.isArray(optionId) ? optionId : null,
    voteMethod: 'mpc'
  };
  
  // Update vote counts
  optionIds.forEach(id => {
    const option = updatedPoll.options.find(o => o.id === id);
    if (option) {
      option.votes += 1;
      option.privateVotes = (option.privateVotes || 0) + 1;
    }
  });
  
  // Update total votes
  updatedPoll.totalVotes += 1;
  updatedPoll.privateVotes = (updatedPoll.privateVotes || 0) + 1;
  
  // Update in our stores if it's a created poll
  const createdPolls = await getPoll(pollId);
  if (createdPolls) {
    updateCreatedPoll(updatedPoll);
  }
  
  console.log('Updated poll after vote:', updatedPoll);
  
  return updatedPoll;
};

/**
 * Get the cost of voting with MPC
 * @returns {Promise<number>} Promise resolving to the cost in tokens
 */
export const getMPCVoteCost = async () => {
  return 1; // Mock cost in tokens
};
