/**
 * Poll voting functions
 */
import { POLL_STATUS } from '../../utils/constants';
import { getPoll } from './retrieval';
import { updateCreatedPoll } from './storage';
import { addVote as apiAddVote } from '../apiService';
import Poll from '../../db/models/Poll';
import Vote from '../../db/models/Vote';

/**
 * Vote on a poll with a signature (public voting)
 * @param {string} pollId - ID of the poll to vote on
 * @param {string|Array} optionId - ID of the option to vote for, or array of option IDs for multiple choice
 * @param {string} signature - Signature from the wallet
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
export const voteWithSignature = async (pollId, optionId, signature) => {
  console.log(`Voting on poll ${pollId} with option ${JSON.stringify(optionId)} and signature ${signature}`);
  
  try {
    // Get the poll from MongoDB
    const dbPoll = await Poll.findById(pollId);
    
    if (!dbPoll) {
      console.error(`Poll ${pollId} not found in database, falling back to local storage`);
      // Fallback to local storage
      return await voteWithSignatureLocal(pollId, optionId, signature);
    }
    
    if (dbPoll.status !== POLL_STATUS.ACTIVE) {
      throw new Error('Poll is not active');
    }
    
    // For multiple choice polls
    const optionIds = Array.isArray(optionId) ? optionId : [optionId];
    
    // Check if we have too many selections
    if (optionIds.length > dbPoll.maxSelections) {
      throw new Error(`Maximum ${dbPoll.maxSelections} selections allowed`);
    }
    
    // Extract voter address from signature (in a real app, this would verify the signature)
    const voterAddress = signature.split(':')[0] || 'anonymous';
    
    // Create vote object
    const voteData = {
      pollId: dbPoll._id,
      voter: voterAddress,
      options: optionIds,
      voteMethod: 'signature',
      timestamp: new Date()
    };
    
    // Submit vote via API
    const result = await apiAddVote(voteData);
    console.log('Vote recorded successfully:', result);
    
    // Get updated poll after voting
    const updatedDbPoll = await Poll.findById(pollId);
    
    // Also update local storage for compatibility
    try {
      const localPoll = await getPoll(pollId);
      if (localPoll) {
        // Update the poll in local storage
        const updatedLocalPoll = { ...localPoll };
        
        // Mark as voted
        updatedLocalPoll.hasVoted = true;
        
        // Store user's vote
        updatedLocalPoll.userVote = {
          optionId: Array.isArray(optionId) ? null : optionId,
          optionIds: Array.isArray(optionId) ? optionId : null,
          voteMethod: 'signature'
        };
        
        // Update vote counts to match database
        updatedLocalPoll.options.forEach(option => {
          const dbOption = updatedDbPoll.options.find(o => o.text === option.text);
          if (dbOption) {
            option.votes = dbOption.votes;
          }
        });
        
        updatedLocalPoll.totalVotes = updatedDbPoll.totalVotes;
        
        // Update local storage
        updateCreatedPoll(updatedLocalPoll);
      }
    } catch (localError) {
      console.error('Error updating local storage:', localError);
    }
    
    // Convert MongoDB document to expected format
    return {
      ...updatedDbPoll.toObject(),
      id: updatedDbPoll._id.toString(),
      hasVoted: true,
      userVote: {
        optionId: Array.isArray(optionId) ? null : optionId,
        optionIds: Array.isArray(optionId) ? optionId : null,
        voteMethod: 'signature'
      }
    };
  } catch (error) {
    console.error('Error voting with signature:', error);
    // Fallback to local storage if database fails
    return await voteWithSignatureLocal(pollId, optionId, signature);
  }
};

/**
 * Fallback function for voting with signature using local storage
 * @param {string} pollId - ID of the poll to vote on
 * @param {string|Array} optionId - ID of the option to vote for, or array of option IDs for multiple choice
 * @param {string} signature - Signature from the wallet
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
async function voteWithSignatureLocal(pollId, optionId, signature) {
  console.log(`Falling back to local storage for voting on poll ${pollId}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get the poll from local storage
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
      option.publicVotes += 1;
    }
  });
  
  // Update total votes
  updatedPoll.totalVotes += 1;
  updatedPoll.publicVotes += 1;
  
  // Update in local storage
  updateCreatedPoll(updatedPoll);
  
  console.log('Updated poll in local storage:', updatedPoll);
  
  return updatedPoll;
}

/**
 * Vote on a poll with MPC (private voting)
 * @param {string} pollId - ID of the poll to vote on
 * @param {string|Array} optionId - ID of the option to vote for, or array of option IDs for multiple choice
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
export const voteWithMPC = async (pollId, optionId) => {
  console.log(`Voting on poll ${pollId} with option ${JSON.stringify(optionId)} using MPC`);
  
  try {
    // Get the poll from MongoDB
    const dbPoll = await Poll.findById(pollId);
    
    if (!dbPoll) {
      console.error(`Poll ${pollId} not found in database, falling back to local storage`);
      // Fallback to local storage
      return await voteWithMPCLocal(pollId, optionId);
    }
    
    if (dbPoll.status !== POLL_STATUS.ACTIVE) {
      throw new Error('Poll is not active');
    }
    
    // For multiple choice polls
    const optionIds = Array.isArray(optionId) ? optionId : [optionId];
    
    // Check if we have too many selections
    if (optionIds.length > dbPoll.maxSelections) {
      throw new Error(`Maximum ${dbPoll.maxSelections} selections allowed`);
    }
    
    // Create vote object (anonymous for MPC)
    const voteData = {
      pollId: dbPoll._id,
      voter: 'anonymous', // MPC votes are anonymous
      options: optionIds,
      voteMethod: 'mpc',
      timestamp: new Date()
    };
    
    // Submit vote via API
    const result = await apiAddVote(voteData);
    console.log('MPC Vote recorded successfully:', result);
    
    // Get updated poll after voting
    const updatedDbPoll = await Poll.findById(pollId);
    
    // Also update local storage for compatibility
    try {
      const localPoll = await getPoll(pollId);
      if (localPoll) {
        // Update the poll in local storage
        const updatedLocalPoll = { ...localPoll };
        
        // Mark as voted
        updatedLocalPoll.hasVoted = true;
        
        // Store user's vote
        updatedLocalPoll.userVote = {
          optionId: Array.isArray(optionId) ? null : optionId,
          optionIds: Array.isArray(optionId) ? optionId : null,
          voteMethod: 'mpc'
        };
        
        // Update vote counts to match database
        updatedLocalPoll.options.forEach(option => {
          const dbOption = updatedDbPoll.options.find(o => o.text === option.text);
          if (dbOption) {
            option.votes = dbOption.votes;
          }
        });
        
        updatedLocalPoll.totalVotes = updatedDbPoll.totalVotes;
        
        // Update local storage
        updateCreatedPoll(updatedLocalPoll);
      }
    } catch (localError) {
      console.error('Error updating local storage:', localError);
    }
    
    // Convert MongoDB document to expected format
    return {
      ...updatedDbPoll.toObject(),
      id: updatedDbPoll._id.toString(),
      hasVoted: true,
      userVote: {
        optionId: Array.isArray(optionId) ? null : optionId,
        optionIds: Array.isArray(optionId) ? optionId : null,
        voteMethod: 'mpc'
      }
    };
  } catch (error) {
    console.error('Error voting with MPC:', error);
    // Fallback to local storage if database fails
    return await voteWithMPCLocal(pollId, optionId);
  }
};

/**
 * Fallback function for voting with MPC using local storage
 * @param {string} pollId - ID of the poll to vote on
 * @param {string|Array} optionId - ID of the option to vote for, or array of option IDs for multiple choice
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
async function voteWithMPCLocal(pollId, optionId) {
  console.log(`Falling back to local storage for MPC voting on poll ${pollId}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get the poll from local storage
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
      option.privateVotes += 1;
    }
  });
  
  // Update total votes
  updatedPoll.totalVotes += 1;
  updatedPoll.privateVotes += 1;
  
  // Update in local storage
  updateCreatedPoll(updatedPoll);
  
  console.log('Updated poll in local storage:', updatedPoll);
  
  return updatedPoll;
}

/**
 * Get the cost of voting with MPC
 * @returns {Promise<number>} Promise resolving to the cost in tokens
 */
export const getMPCVoteCost = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return 5; // Fixed cost for now
};
