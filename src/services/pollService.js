import { POLL_STATUS, POLL_TYPE } from '../utils/constants';

// Flag to use mock data for development
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true';

/**
 * Generate mock poll data
 * @returns {Array} Array of mock poll objects
 */
export const getMockPolls = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  return [
    {
      id: '1',
      title: 'Best Blockchain Platform',
      description: 'Vote for the best blockchain platform for building decentralized applications',
      creator: '0x1234567890123456789012345678901234567890',
      createdAt: lastWeek.toISOString(),
      startDate: lastWeek.toISOString(),
      endDate: tomorrow.toISOString(),
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.SINGLE_CHOICE,
      options: [
        { id: '1', text: 'Partisia Blockchain', votes: 42 },
        { id: '2', text: 'Ethereum', votes: 28 },
        { id: '3', text: 'Solana', votes: 15 },
        { id: '4', text: 'Polkadot', votes: 7 }
      ],
      totalVotes: 92,
      hasVoted: false,
      isCreator: false
    },
    {
      id: '2',
      title: 'Favorite Programming Language',
      description: 'What is your favorite programming language for blockchain development?',
      creator: '0x1234567890123456789012345678901234567890',
      createdAt: lastWeek.toISOString(),
      startDate: lastWeek.toISOString(),
      endDate: lastWeek.toISOString(),
      status: POLL_STATUS.ENDED,
      type: POLL_TYPE.SINGLE_CHOICE,
      options: [
        { id: '1', text: 'Rust', votes: 35 },
        { id: '2', text: 'JavaScript/TypeScript', votes: 30 },
        { id: '3', text: 'Solidity', votes: 25 },
        { id: '4', text: 'Go', votes: 10 }
      ],
      totalVotes: 100,
      hasVoted: true,
      userVote: { optionId: '2' },
      isCreator: true
    },
    {
      id: '3',
      title: 'Next Features for PartiVotes',
      description: 'Which features should we prioritize next for the PartiVotes platform?',
      creator: '0x9876543210987654321098765432109876543210',
      createdAt: now.toISOString(),
      startDate: tomorrow.toISOString(),
      endDate: nextWeek.toISOString(),
      status: POLL_STATUS.PENDING,
      type: POLL_TYPE.MULTIPLE_CHOICE,
      options: [
        { id: '1', text: 'Delegation voting', votes: 0 },
        { id: '2', text: 'Token-weighted voting', votes: 0 },
        { id: '3', text: 'Quadratic voting', votes: 0 },
        { id: '4', text: 'Mobile app', votes: 0 },
        { id: '5', text: 'Integration with other blockchains', votes: 0 }
      ],
      totalVotes: 0,
      hasVoted: false,
      isCreator: false,
      maxSelections: 3
    }
  ];
};

/**
 * Mock function to simulate blockchain transaction confirmation
 * @param {string} txHash - Transaction hash
 * @returns {Promise} Promise that resolves when the transaction is confirmed
 */
export const waitForConfirmation = async (txHash) => {
  console.log(`Waiting for confirmation of transaction: ${txHash}`);
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Transaction ${txHash} confirmed!`);
      resolve({
        status: 'confirmed',
        txHash,
        blockNumber: Math.floor(Math.random() * 1000000) + 10000000
      });
    }, 2000);
  });
};

/**
 * Get all polls
 * @param {Object} filters - Optional filters for polls
 * @returns {Promise<Array>} Promise resolving to array of polls
 */
export const getPolls = async (filters = {}) => {
  if (USE_MOCK_DATA) {
    console.log('Using mock poll data');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let polls = getMockPolls();
    
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
    
    return polls;
  }
  
  try {
    // In a real implementation, this would call the blockchain API
    // const response = await fetch(`${API_BASE_URL}/polls`);
    // return await response.json();
    return [];
  } catch (error) {
    console.error('Failed to fetch polls:', error);
    throw error;
  }
};

/**
 * Get a specific poll by ID
 * @param {string} pollId - ID of the poll to retrieve
 * @returns {Promise<Object>} Promise resolving to poll object
 */
export const getPoll = async (pollId) => {
  if (USE_MOCK_DATA) {
    console.log(`Using mock data for poll ${pollId}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const polls = getMockPolls();
    const poll = polls.find(p => p.id === pollId);
    
    if (!poll) {
      throw new Error(`Poll with ID ${pollId} not found`);
    }
    
    return poll;
  }
  
  try {
    // In a real implementation, this would call the blockchain API
    // const response = await fetch(`${API_BASE_URL}/polls/${pollId}`);
    // return await response.json();
    return null;
  } catch (error) {
    console.error(`Failed to fetch poll ${pollId}:`, error);
    throw error;
  }
};

/**
 * Create a new poll
 * @param {Object} pollData - Poll data
 * @returns {Promise<Object>} Promise resolving to created poll object
 */
export const createPoll = async (pollData) => {
  if (USE_MOCK_DATA) {
    console.log('Creating mock poll:', pollData);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
    await waitForConfirmation(mockTxHash);
    
    const newPoll = {
      id: Math.random().toString(36).substr(2, 9),
      creator: '0x1234567890123456789012345678901234567890', // Mock creator address
      createdAt: new Date().toISOString(),
      status: pollData.startDate > new Date() ? POLL_STATUS.PENDING : POLL_STATUS.ACTIVE,
      totalVotes: 0,
      hasVoted: false,
      isCreator: true,
      ...pollData,
      options: pollData.options.map((option, index) => ({
        id: (index + 1).toString(),
        text: option,
        votes: 0
      }))
    };
    
    return newPoll;
  }
  
  try {
    // In a real implementation, this would call the blockchain API
    // const response = await fetch(`${API_BASE_URL}/polls`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(pollData)
    // });
    // return await response.json();
    return null;
  } catch (error) {
    console.error('Failed to create poll:', error);
    throw error;
  }
};

/**
 * Vote in a poll with signature
 * @param {string} pollId - ID of the poll
 * @param {string|Array} optionId - ID(s) of the selected option(s)
 * @param {string} signature - Signature for the vote
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
export const voteWithSignature = async (pollId, optionId, signature) => {
  if (USE_MOCK_DATA) {
    console.log(`Voting in poll ${pollId} for option ${optionId} with signature ${signature}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
    await waitForConfirmation(mockTxHash);
    
    const poll = await getPoll(pollId);
    
    // Update the poll with the vote
    if (Array.isArray(optionId)) {
      // Multiple choice vote
      optionId.forEach(id => {
        const option = poll.options.find(o => o.id === id);
        if (option) {
          option.votes += 1;
          poll.totalVotes += 1;
        }
      });
      poll.hasVoted = true;
      poll.userVote = { optionIds: optionId };
    } else {
      // Single choice vote
      const option = poll.options.find(o => o.id === optionId);
      if (option) {
        option.votes += 1;
        poll.totalVotes += 1;
      }
      poll.hasVoted = true;
      poll.userVote = { optionId };
    }
    
    return poll;
  }
  
  try {
    // In a real implementation, this would call the blockchain API
    // const response = await fetch(`${API_BASE_URL}/polls/${pollId}/vote`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ optionId, signature })
    // });
    // return await response.json();
    return null;
  } catch (error) {
    console.error(`Failed to vote in poll ${pollId}:`, error);
    throw error;
  }
};

/**
 * Vote in a poll with MPC
 * @param {string} pollId - ID of the poll
 * @param {string|Array} optionId - ID(s) of the selected option(s)
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
export const voteWithMPC = async (pollId, optionId) => {
  if (USE_MOCK_DATA) {
    console.log(`Voting in poll ${pollId} for option ${optionId} with MPC`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
    await waitForConfirmation(mockTxHash);
    
    const poll = await getPoll(pollId);
    
    // Update the poll with the vote
    if (Array.isArray(optionId)) {
      // Multiple choice vote
      optionId.forEach(id => {
        const option = poll.options.find(o => o.id === id);
        if (option) {
          option.votes += 1;
          poll.totalVotes += 1;
        }
      });
      poll.hasVoted = true;
      poll.userVote = { optionIds: optionId };
    } else {
      // Single choice vote
      const option = poll.options.find(o => o.id === optionId);
      if (option) {
        option.votes += 1;
        poll.totalVotes += 1;
      }
      poll.hasVoted = true;
      poll.userVote = { optionId };
    }
    
    return poll;
  }
  
  try {
    // In a real implementation, this would call the blockchain API
    // const response = await fetch(`${API_BASE_URL}/polls/${pollId}/vote-mpc`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ optionId })
    // });
    // return await response.json();
    return null;
  } catch (error) {
    console.error(`Failed to vote in poll ${pollId} with MPC:`, error);
    throw error;
  }
};

/**
 * End a poll
 * @param {string} pollId - ID of the poll to end
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
export const endPoll = async (pollId) => {
  if (USE_MOCK_DATA) {
    console.log(`Ending poll ${pollId}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
    await waitForConfirmation(mockTxHash);
    
    const poll = await getPoll(pollId);
    poll.status = POLL_STATUS.ENDED;
    poll.endDate = new Date().toISOString();
    
    return poll;
  }
  
  try {
    // In a real implementation, this would call the blockchain API
    // const response = await fetch(`${API_BASE_URL}/polls/${pollId}/end`, {
    //   method: 'POST'
    // });
    // return await response.json();
    return null;
  } catch (error) {
    console.error(`Failed to end poll ${pollId}:`, error);
    throw error;
  }
};
