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

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const nextMonth = new Date(now);
  nextMonth.setDate(nextMonth.getDate() + 30);
  
  return [
    // ACTIVE POLLS
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
    
    // ENDED POLLS
    {
      id: '3',
      title: 'Best NFT Marketplace',
      description: 'Which NFT marketplace provides the best overall experience for creators and collectors?',
      creator: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
      createdAt: lastWeek.toISOString(),
      startDate: lastWeek.toISOString(),
      endDate: yesterday.toISOString(),
      status: POLL_STATUS.ENDED,
      type: POLL_TYPE.SINGLE_CHOICE,
      maxSelections: 1,
      options: [
        { id: '3a', text: 'OpenSea', votes: 134, publicVotes: 80, privateVotes: 54 },
        { id: '3b', text: 'Rarible', votes: 87, publicVotes: 50, privateVotes: 37 },
        { id: '3c', text: 'SuperRare', votes: 62, publicVotes: 35, privateVotes: 27 },
        { id: '3d', text: 'Foundation', votes: 91, publicVotes: 55, privateVotes: 36 },
        { id: '3e', text: 'Partisia NFT Market', votes: 112, publicVotes: 70, privateVotes: 42 }
      ],
      totalVotes: 486,
      publicVotes: 290,
      privateVotes: 196,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null,
      winner: 'OpenSea'
    },
    {
      id: '4',
      title: 'Crypto Wallet Preference',
      description: 'Which cryptocurrency wallet do you use most frequently?',
      creator: '0x912cE8c60d10f32Bc54A479C42a48970aF86727D',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      status: POLL_STATUS.ENDED,
      type: POLL_TYPE.SINGLE_CHOICE,
      maxSelections: 1,
      options: [
        { id: '4a', text: 'MetaMask', votes: 187, publicVotes: 110, privateVotes: 77 },
        { id: '4b', text: 'Trust Wallet', votes: 112, publicVotes: 70, privateVotes: 42 },
        { id: '4c', text: 'Ledger Live', votes: 93, publicVotes: 55, privateVotes: 38 },
        { id: '4d', text: 'Partisia Wallet', votes: 145, publicVotes: 85, privateVotes: 60 },
        { id: '4e', text: 'Exodus', votes: 78, publicVotes: 45, privateVotes: 33 },
        { id: '4f', text: 'Trezor Suite', votes: 65, publicVotes: 40, privateVotes: 25 }
      ],
      totalVotes: 680,
      publicVotes: 405,
      privateVotes: 275,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null,
      winner: 'MetaMask'
    },
    
    // PENDING POLLS
    {
      id: '5',
      title: 'Future of DAO Governance',
      description: 'What governance model do you think will be most effective for DAOs in the future?',
      creator: '0x631B32E15b7A4b6108385985Bb2C723F0B448E42',
      createdAt: now.toISOString(),
      startDate: nextWeek.toISOString(), // Starts next week
      endDate: nextMonth.toISOString(), // Ends in a month
      status: POLL_STATUS.PENDING,
      type: POLL_TYPE.SINGLE_CHOICE,
      maxSelections: 1,
      options: [
        { id: '5a', text: 'Token-weighted Voting', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '5b', text: 'Quadratic Voting', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '5c', text: 'Conviction Voting', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '5d', text: 'Holacracy', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '5e', text: 'Liquid Democracy', votes: 0, publicVotes: 0, privateVotes: 0 }
      ],
      totalVotes: 0,
      publicVotes: 0,
      privateVotes: 0,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    {
      id: '6',
      title: 'Metaverse Platform Preference',
      description: 'Which metaverse platform do you believe has the best potential for growth?',
      creator: '0x8aD3eC2ed9a488B8882e09aa592DEeF25b5b78cE',
      createdAt: now.toISOString(),
      startDate: tomorrow.toISOString(), // Starts tomorrow
      endDate: nextMonth.toISOString(), // Ends in a month
      status: POLL_STATUS.PENDING,
      type: POLL_TYPE.MULTIPLE_CHOICE,
      maxSelections: 2,
      options: [
        { id: '6a', text: 'Decentraland', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '6b', text: 'The Sandbox', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '6c', text: 'Horizon Worlds', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '6d', text: 'Roblox', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '6e', text: 'Partisia Metaverse', votes: 0, publicVotes: 0, privateVotes: 0 }
      ],
      totalVotes: 0,
      publicVotes: 0,
      privateVotes: 0,
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
