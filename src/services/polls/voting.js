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
    
    // Process option objects to extract text values for the API
    // ENHANCED: More robust option processing to handle all possible formats
    const processedOptions = optionIds.map(option => {
      // If option is an object with text property, use that
      if (option && typeof option === 'object') {
        if (option.text) {
          return option.text;
        } else if (option.value) {
          return option.value;
        } else if (option.label) {
          return option.label;
        }
      }
      
      // If option is already a string, use it directly
      if (typeof option === 'string') {
        return option;
      }
      
      // If option is a number, try to get the corresponding option text from the poll
      if (typeof option === 'number' || !isNaN(parseInt(option, 10))) {
        const index = parseInt(option, 10);
        if (dbPoll.options && dbPoll.options[index] && dbPoll.options[index].text) {
          return dbPoll.options[index].text;
        }
      }
      
      // Last resort: stringify the option
      return String(option);
    });
    
    console.log('Processed options for API:', processedOptions);
    
    // Create vote object
    const voteData = {
      pollId: dbPoll._id,
      voter: voterAddress,
      options: processedOptions,
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
 * Vote on a poll with MPC (private voting)
 * @param {string} pollId - ID of the poll to vote on
 * @param {string|Array} optionId - ID of the option to vote for, or array of option IDs for multiple choice
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
export const voteWithMPC = async (pollId, optionId) => {
  console.log(`Voting on poll ${pollId} with MPC and option ${JSON.stringify(optionId)}`);
  
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
    
    // Extract voter address from signature (in a real app, this would verify the signature)
    const voterAddress = 'anonymous'; // MPC voting is always anonymous
    
    // Process option objects to extract text values for the API
    // ENHANCED: More robust option processing to handle all possible formats
    const processedOptions = optionIds.map(option => {
      // If option is an object with text property, use that
      if (option && typeof option === 'object') {
        if (option.text) {
          return option.text;
        } else if (option.value) {
          return option.value;
        } else if (option.label) {
          return option.label;
        }
      }
      
      // If option is already a string, use it directly
      if (typeof option === 'string') {
        return option;
      }
      
      // If option is a number, try to get the corresponding option text from the poll
      if (typeof option === 'number' || !isNaN(parseInt(option, 10))) {
        const index = parseInt(option, 10);
        if (dbPoll.options && dbPoll.options[index] && dbPoll.options[index].text) {
          return dbPoll.options[index].text;
        }
      }
      
      // Last resort: stringify the option
      return String(option);
    });
    
    console.log('Processed options for API:', processedOptions);
    
    // Create vote object
    const voteData = {
      pollId: dbPoll._id,
      voter: voterAddress,
      options: processedOptions,
      voteMethod: 'mpc',
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
 * Local fallback for signature voting
 */
const voteWithSignatureLocal = async (pollId, optionId, signature) => {
  console.log(`Voting on poll ${pollId} with signature locally`);
  
  try {
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
    
    // Process options to ensure they are in the correct format
    const processedOptionIds = optionIds.map(option => {
      if (option && typeof option === 'object' && option.text) {
        return option.text;
      }
      return option;
    });
    
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
    let updatedAnyOption = false;
    
    for (const option of processedOptionIds) {
      // Find the option in the poll
      const optionIndex = updatedPoll.options.findIndex(o => 
        o.text === option || 
        o.id === option || 
        o._id === option
      );
      
      if (optionIndex !== -1) {
        // Increment votes for this option
        if (!updatedPoll.options[optionIndex].votes) {
          updatedPoll.options[optionIndex].votes = 0;
        }
        updatedPoll.options[optionIndex].votes += 1;
        updatedAnyOption = true;
      }
    }
    
    // Only increment total votes once per submission
    if (updatedAnyOption) {
      // Increment total votes
      if (!updatedPoll.totalVotes) {
        updatedPoll.totalVotes = 0;
      }
      updatedPoll.totalVotes += 1;
    }
    
    // Update local storage
    updateCreatedPoll(updatedPoll);
    
    return updatedPoll;
  } catch (error) {
    console.error('Error voting with signature locally:', error);
    throw error;
  }
};

/**
 * Local fallback for MPC voting
 */
const voteWithMPCLocal = async (pollId, optionId) => {
  console.log(`Voting on poll ${pollId} with MPC locally`);
  
  try {
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
    
    // Process options to ensure they are in the correct format
    const processedOptionIds = optionIds.map(option => {
      if (option && typeof option === 'object' && option.text) {
        return option.text;
      }
      return option;
    });
    
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
    let updatedAnyOption = false;
    
    for (const option of processedOptionIds) {
      // Find the option in the poll
      const optionIndex = updatedPoll.options.findIndex(o => 
        o.text === option || 
        o.id === option || 
        o._id === option
      );
      
      if (optionIndex !== -1) {
        // Increment votes for this option
        if (!updatedPoll.options[optionIndex].votes) {
          updatedPoll.options[optionIndex].votes = 0;
        }
        updatedPoll.options[optionIndex].votes += 1;
        updatedAnyOption = true;
      }
    }
    
    // Only increment total votes once per submission
    if (updatedAnyOption) {
      // Increment total votes
      if (!updatedPoll.totalVotes) {
        updatedPoll.totalVotes = 0;
      }
      updatedPoll.totalVotes += 1;
    }
    
    // Update local storage
    updateCreatedPoll(updatedPoll);
    
    return updatedPoll;
  } catch (error) {
    console.error('Error voting with MPC locally:', error);
    throw error;
  }
};
