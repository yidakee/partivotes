/**
 * Poll voting functions
 */
import { POLL_STATUS } from '../../utils/constants';
import { getPoll } from './retrieval';
import { updateCreatedPoll } from './storage';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

/**
 * Submit vote via API
 */
const apiAddVote = async (voteData) => {
  try {
    // Make sure options is always an array of strings
    if (voteData.options && !Array.isArray(voteData.options)) {
      voteData.options = [String(voteData.options)];
    } else if (voteData.options) {
      voteData.options = voteData.options.map(opt => String(opt));
    }
    
    console.log('Submitting vote to API:', voteData);
    
    // Add timestamp if not provided
    if (!voteData.timestamp) {
      voteData.timestamp = new Date().toISOString();
    }
    
    const response = await fetch(`${API_BASE_URL}/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(voteData),
      mode: 'cors',
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || 'Failed to submit vote');
      } catch (e) {
        throw new Error('Failed to submit vote: ' + errorText);
      }
    }
    
    // Get the updated poll after voting
    const savedVote = await response.json();
    
    // Fetch the updated poll
    const pollResponse = await fetch(`${API_BASE_URL}/polls/${voteData.pollId}`, {
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'same-origin'
    });
    
    if (!pollResponse.ok) {
      throw new Error('Failed to get updated poll');
    }
    
    const updatedPoll = await pollResponse.json();
    return updatedPoll;
  } catch (error) {
    console.error('Error submitting vote to API:', error);
    throw error;
  }
};

/**
 * Vote on a poll with a signature (public voting)
 * @param {string} pollId - ID of the poll to vote on
 * @param {string|Array} optionId - ID of the option to vote for, or array of option IDs for multiple choice
 * @param {string} signature - Signature from the wallet
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
export const voteWithSignature = async (pollId, optionId, signature) => {
  try {
    console.log('Voting with signature for poll:', pollId);
    console.log('Option ID:', optionId);
    
    // Get poll from API
    const pollResponse = await fetch(`${API_BASE_URL}/polls/${pollId}`);
    if (!pollResponse.ok) {
      console.error('Poll not found:', pollId);
      throw new Error('Poll not found');
    }
    
    const dbPoll = await pollResponse.json();
    
    // Handle both single option and multiple options
    const optionIds = Array.isArray(optionId) ? optionId : [optionId];
    
    // Extract voter address from signature (in a real app, this would verify the signature)
    const voterAddress = signature.split(':')[0] || 'anonymous';
    
    // Process option objects to extract text values for the API
    const processedOptions = optionIds.map(option => {
      // If option is an object with text property, use that
      if (option && typeof option === 'object' && option.text) {
        return option.text;
      }
      return String(option);
    });
    
    console.log('Processed options for API:', processedOptions);
    
    // Create vote object
    const voteData = {
      pollId: dbPoll._id,
      voter: voterAddress,
      options: processedOptions,
      voteMethod: 'signature',
      timestamp: new Date().toISOString()
    };
    
    // Submit vote via API
    const result = await apiAddVote(voteData);
    console.log('Vote recorded successfully:', result);
    
    // Return the updated poll
    return result;
  } catch (error) {
    console.error('Error voting with signature:', error);
    throw error;
  }
};

/**
 * Vote on a poll with MPC (private voting)
 * @param {string} pollId - ID of the poll to vote on
 * @param {string|Array} optionId - ID of the option to vote for, or array of option IDs for multiple choice
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
export const voteWithMPC = async (pollId, optionId) => {
  try {
    console.log('Voting with MPC for poll:', pollId);
    console.log('Option ID:', optionId);
    
    // Get poll from API
    const pollResponse = await fetch(`${API_BASE_URL}/polls/${pollId}`);
    if (!pollResponse.ok) {
      console.error('Poll not found:', pollId);
      throw new Error('Poll not found');
    }
    
    const dbPoll = await pollResponse.json();
    
    // Handle both single option and multiple options
    const optionIds = Array.isArray(optionId) ? optionId : [optionId];
    
    // Extract voter address from signature (in a real app, this would verify the signature)
    const voterAddress = 'anonymous'; // MPC voting is always anonymous
    
    // Process option objects to extract text values for the API
    const processedOptions = optionIds.map(option => {
      // If option is an object with text property, use that
      if (option && typeof option === 'object' && option.text) {
        return option.text;
      }
      return String(option);
    });
    
    console.log('Processed options for API:', processedOptions);
    
    // Create vote object
    const voteData = {
      pollId: dbPoll._id,
      voter: voterAddress,
      options: processedOptions,
      voteMethod: 'mpc',
      timestamp: new Date().toISOString()
    };
    
    // Submit vote via API
    const result = await apiAddVote(voteData);
    console.log('Vote recorded successfully:', result);
    
    // Return the updated poll
    return result;
  } catch (error) {
    console.error('Error voting with MPC:', error);
    throw error;
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
