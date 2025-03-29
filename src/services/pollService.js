import { POLL_STATUS, POLL_TYPE } from '../utils/constants';

// Flag to use mock data for development
const USE_MOCK_DATA = true; // Force to true to ensure mock data is used

// Initialize in-memory store from localStorage if available
let createdPolls = [];
try {
  const storedPolls = localStorage.getItem('createdPolls');
  if (storedPolls) {
    createdPolls = JSON.parse(storedPolls);
  }
} catch (error) {
  console.error('Error loading polls from localStorage:', error);
}

// Helper function to save polls to localStorage
const saveCreatedPolls = () => {
  try {
    localStorage.setItem('createdPolls', JSON.stringify(createdPolls));
  } catch (error) {
    console.error('Error saving polls to localStorage:', error);
  }
};

// Helper function to update a poll in the createdPolls array
const updateCreatedPoll = (updatedPoll) => {
  const index = createdPolls.findIndex(p => p.id === updatedPoll.id);
  if (index !== -1) {
    createdPolls[index] = updatedPoll;
    saveCreatedPolls();
  }
};

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
      title: 'Favorite Programming Language',
      description: 'What is your favorite programming language for blockchain development?',
      creator: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.SINGLE_CHOICE,
      maxSelections: 1,
      options: [
        { id: '1a', text: 'JavaScript', votes: 42, publicVotes: 30, privateVotes: 12 },
        { id: '1b', text: 'Rust', votes: 38, publicVotes: 25, privateVotes: 13 },
        { id: '1c', text: 'Solidity', votes: 65, publicVotes: 40, privateVotes: 25 },
        { id: '1d', text: 'Go', votes: 27, publicVotes: 15, privateVotes: 12 }
      ],
      totalVotes: 172,
      publicVotes: 110,
      privateVotes: 62,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    {
      id: '2',
      title: 'Best Blockchain for DApps',
      description: 'Which blockchain platform do you prefer for developing decentralized applications?',
      creator: '0x8fD00f170FDf3772C5ebdCD90bF257316c69BA45',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.MULTIPLE_CHOICE,
      maxSelections: 2,
      options: [
        { id: '2a', text: 'Ethereum', votes: 78, publicVotes: 50, privateVotes: 28 },
        { id: '2b', text: 'Polkadot', votes: 45, publicVotes: 30, privateVotes: 15 },
        { id: '2c', text: 'Solana', votes: 62, publicVotes: 40, privateVotes: 22 },
        { id: '2d', text: 'Partisia Blockchain', votes: 93, publicVotes: 60, privateVotes: 33 },
        { id: '2e', text: 'Cardano', votes: 41, publicVotes: 25, privateVotes: 16 }
      ],
      totalVotes: 319,
      publicVotes: 205,
      privateVotes: 114,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    {
      id: '3',
      title: 'Consensus Mechanism Preference',
      description: 'Which consensus mechanism do you believe is most secure and efficient?',
      creator: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.RANKED_CHOICE,
      maxSelections: 1,
      options: [
        { id: '3a', text: 'Proof of Work (PoW)', votes: 31, publicVotes: 20, privateVotes: 11 },
        { id: '3b', text: 'Proof of Stake (PoS)', votes: 58, publicVotes: 35, privateVotes: 23 },
        { id: '3c', text: 'Delegated Proof of Stake (DPoS)', votes: 27, publicVotes: 15, privateVotes: 12 },
        { id: '3d', text: 'Practical Byzantine Fault Tolerance (PBFT)', votes: 19, publicVotes: 10, privateVotes: 9 },
        { id: '3e', text: 'Proof of Authority (PoA)', votes: 25, publicVotes: 15, privateVotes: 10 }
      ],
      totalVotes: 160,
      publicVotes: 95,
      privateVotes: 65,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    {
      id: '4',
      title: 'Privacy Features in Blockchain',
      description: 'Which privacy feature do you consider most important for blockchain applications?',
      creator: '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.SINGLE_CHOICE,
      maxSelections: 1,
      options: [
        { id: '4a', text: 'Zero-Knowledge Proofs', votes: 87, publicVotes: 50, privateVotes: 37 },
        { id: '4b', text: 'Secure Multi-Party Computation (MPC)', votes: 73, publicVotes: 40, privateVotes: 33 },
        { id: '4c', text: 'Ring Signatures', votes: 42, publicVotes: 25, privateVotes: 17 },
        { id: '4d', text: 'Stealth Addresses', votes: 38, publicVotes: 20, privateVotes: 18 },
        { id: '4e', text: 'Confidential Transactions', votes: 56, publicVotes: 30, privateVotes: 26 }
      ],
      totalVotes: 296,
      publicVotes: 165,
      privateVotes: 131,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    {
      id: '5',
      title: 'Future of DeFi',
      description: 'Which DeFi application do you think will see the most growth in the next year?',
      creator: '0x6Bc8FE27D0c7cEF686c9Db7D7CFBcFB56b919805',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.MULTIPLE_CHOICE,
      maxSelections: 3,
      options: [
        { id: '5a', text: 'Decentralized Exchanges (DEX)', votes: 112, publicVotes: 70, privateVotes: 42 },
        { id: '5b', text: 'Lending Platforms', votes: 89, publicVotes: 55, privateVotes: 34 },
        { id: '5c', text: 'Yield Farming', votes: 76, publicVotes: 45, privateVotes: 31 },
        { id: '5d', text: 'Insurance Protocols', votes: 53, publicVotes: 30, privateVotes: 23 },
        { id: '5e', text: 'Synthetic Assets', votes: 67, publicVotes: 40, privateVotes: 27 },
        { id: '5f', text: 'Cross-Chain Bridges', votes: 94, publicVotes: 60, privateVotes: 34 }
      ],
      totalVotes: 491,
      publicVotes: 300,
      privateVotes: 191,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
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
  console.log('Using mock poll data');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let polls = getMockPolls();
  
  // Add any created polls to the list
  polls = [...polls, ...createdPolls];
  
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
  
  console.log('Returning polls:', polls);
  return polls;
};

/**
 * Get a specific poll by ID
 * @param {string} pollId - ID of the poll to retrieve
 * @returns {Promise<Object>} Promise resolving to poll object
 */
export const getPoll = async (pollId) => {
  console.log(`Getting poll ${pollId}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // First check our in-memory store of created polls
  const createdPoll = createdPolls.find(p => p.id === pollId);
  if (createdPoll) {
    console.log(`Found poll ${pollId} in created polls store`);
    return { ...createdPoll };
  }
  
  // Then check mock polls
  const mockPolls = getMockPolls();
  const mockPoll = mockPolls.find(p => p.id === pollId);
  
  if (mockPoll) {
    console.log(`Found poll ${pollId} in mock polls`);
    return { ...mockPoll };
  }
  
  console.log(`Poll ${pollId} not found`);
  return null;
};

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
      privateVotes: 0
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
  
  // Add to our in-memory store
  createdPolls.push(newPoll);
  saveCreatedPolls();
  
  console.log('Created poll:', newPoll);
  
  return newPoll;
};

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
  
  // Update in our stores
  if (updatedPoll.id in createdPolls) {
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
  
  // Update in our stores
  if (updatedPoll.id in createdPolls) {
    updateCreatedPoll(updatedPoll);
  }
  
  console.log('Updated poll after vote:', updatedPoll);
  
  return updatedPoll;
};

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
  
  // Update in our stores
  if (updatedPoll.id in createdPolls) {
    updateCreatedPoll(updatedPoll);
  }
  
  console.log('Updated poll after ending:', updatedPoll);
  
  return updatedPoll;
};

/**
 * Get the cost of creating a poll with MPC
 * @returns {Promise<number>} Promise resolving to the cost in tokens
 */
export const getPollCreationCost = async () => {
  return 10; // Mock cost in tokens
};

/**
 * Get the cost of voting with MPC
 * @returns {Promise<number>} Promise resolving to the cost in tokens
 */
export const getMPCVoteCost = async () => {
  return 1; // Mock cost in tokens
};
