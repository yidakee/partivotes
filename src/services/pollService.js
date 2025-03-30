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
    // Additional Multiple Choice Polls - Active
    {
      id: '5',
      title: 'Top DeFi Protocols',
      description: 'Which DeFi protocols do you believe have the most potential for long-term success?',
      creator: '0x9A8b2E53F7d5677C1F93a6A3b3CE6F3d58c1E2F3',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.MULTIPLE_CHOICE,
      maxSelections: 3,
      options: [
        { id: '5a', text: 'Uniswap', votes: 112, publicVotes: 70, privateVotes: 42 },
        { id: '5b', text: 'Aave', votes: 95, publicVotes: 60, privateVotes: 35 },
        { id: '5c', text: 'Compound', votes: 83, publicVotes: 50, privateVotes: 33 },
        { id: '5d', text: 'MakerDAO', votes: 76, publicVotes: 45, privateVotes: 31 },
        { id: '5e', text: 'Curve Finance', votes: 68, publicVotes: 40, privateVotes: 28 },
        { id: '5f', text: 'Partisia DeFi', votes: 105, publicVotes: 65, privateVotes: 40 }
      ],
      totalVotes: 539,
      publicVotes: 330,
      privateVotes: 209,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    {
      id: '6',
      title: 'Web3 Development Tools',
      description: 'Which Web3 development tools and frameworks do you find most useful?',
      creator: '0x7D2E8D3F5C4B6A1E9F8C7D6B5A4E3C2D1B0F9E8D',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.MULTIPLE_CHOICE,
      maxSelections: 4,
      options: [
        { id: '6a', text: 'Hardhat', votes: 87, publicVotes: 55, privateVotes: 32 },
        { id: '6b', text: 'Truffle', votes: 72, publicVotes: 45, privateVotes: 27 },
        { id: '6c', text: 'Web3.js', votes: 95, publicVotes: 60, privateVotes: 35 },
        { id: '6d', text: 'Ethers.js', votes: 103, publicVotes: 65, privateVotes: 38 },
        { id: '6e', text: 'Remix IDE', votes: 68, publicVotes: 40, privateVotes: 28 },
        { id: '6f', text: 'Foundry', votes: 79, publicVotes: 50, privateVotes: 29 },
        { id: '6g', text: 'Partisia SDK', votes: 91, publicVotes: 58, privateVotes: 33 }
      ],
      totalVotes: 595,
      publicVotes: 373,
      privateVotes: 222,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    // Ranked Choice Polls - Active
    {
      id: '7',
      title: 'Best Layer 2 Solutions',
      description: 'Rank the following Layer 2 scaling solutions based on their technical merit and adoption potential.',
      creator: '0x3F2D1B5C4E6A7D8F9G0H1I2J3K4L5M6N7O8P9Q0',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
      startDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.RANKED_CHOICE,
      maxSelections: 5,
      options: [
        { id: '7a', text: 'Optimistic Rollups', votes: 128, publicVotes: 80, privateVotes: 48, rankPoints: 520 },
        { id: '7b', text: 'ZK-Rollups', votes: 142, publicVotes: 90, privateVotes: 52, rankPoints: 595 },
        { id: '7c', text: 'Plasma', votes: 87, publicVotes: 55, privateVotes: 32, rankPoints: 310 },
        { id: '7d', text: 'State Channels', votes: 95, publicVotes: 60, privateVotes: 35, rankPoints: 380 },
        { id: '7e', text: 'Sidechains', votes: 112, publicVotes: 70, privateVotes: 42, rankPoints: 450 }
      ],
      totalVotes: 564,
      publicVotes: 355,
      privateVotes: 209,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    {
      id: '8',
      title: 'Crypto Investment Priorities',
      description: 'Rank your investment priorities in the cryptocurrency ecosystem.',
      creator: '0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
      startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.RANKED_CHOICE,
      maxSelections: 6,
      options: [
        { id: '8a', text: 'Bitcoin', votes: 156, publicVotes: 100, privateVotes: 56, rankPoints: 780 },
        { id: '8b', text: 'Ethereum', votes: 142, publicVotes: 90, privateVotes: 52, rankPoints: 710 },
        { id: '8c', text: 'DeFi Tokens', votes: 128, publicVotes: 80, privateVotes: 48, rankPoints: 640 },
        { id: '8d', text: 'NFTs', votes: 95, publicVotes: 60, privateVotes: 35, rankPoints: 475 },
        { id: '8e', text: 'GameFi', votes: 87, publicVotes: 55, privateVotes: 32, rankPoints: 435 },
        { id: '8f', text: 'Privacy Coins', votes: 112, publicVotes: 70, privateVotes: 42, rankPoints: 560 }
      ],
      totalVotes: 720,
      publicVotes: 455,
      privateVotes: 265,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    {
      id: '9',
      title: 'DAO Governance Models',
      description: 'Rank the following DAO governance models based on their effectiveness and fairness.',
      creator: '0x9S8R7Q6P5O4N3M2L1K0J9I8H7G6F5E4D3C2B1A',
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
      startDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.RANKED_CHOICE,
      maxSelections: 4,
      options: [
        { id: '9a', text: 'Token-Based Voting', votes: 118, publicVotes: 75, privateVotes: 43, rankPoints: 430 },
        { id: '9b', text: 'Quadratic Voting', votes: 132, publicVotes: 85, privateVotes: 47, rankPoints: 490 },
        { id: '9c', text: 'Conviction Voting', votes: 95, publicVotes: 60, privateVotes: 35, rankPoints: 340 },
        { id: '9d', text: 'Holacracy', votes: 82, publicVotes: 50, privateVotes: 32, rankPoints: 280 },
        { id: '9e', text: 'Liquid Democracy', votes: 105, publicVotes: 65, privateVotes: 40, rankPoints: 380 }
      ],
      totalVotes: 532,
      publicVotes: 335,
      privateVotes: 197,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    {
      id: '1',
      title: 'Best Layer 1 Blockchain',
      description: 'Which Layer 1 blockchain do you think has the most promising future?',
      creator: '0x1234567890123456789012345678901234567890',
      createdAt: lastWeek.toISOString(),
      startDate: lastWeek.toISOString(),
      endDate: nextMonth.toISOString(),
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.SINGLE_CHOICE,
      maxSelections: 1,
      options: [
        { id: '1a', text: 'Ethereum', votes: 120, publicVotes: 75, privateVotes: 45 },
        { id: '1b', text: 'Solana', votes: 85, publicVotes: 50, privateVotes: 35 },
        { id: '1c', text: 'Avalanche', votes: 65, publicVotes: 40, privateVotes: 25 },
        { id: '1d', text: 'Polkadot', votes: 50, publicVotes: 30, privateVotes: 20 },
        { id: '1e', text: 'Partisia Blockchain', votes: 95, publicVotes: 60, privateVotes: 35 }
      ],
      totalVotes: 415,
      publicVotes: 255,
      privateVotes: 160,
      hasVoted: true,
      yourVote: ['1e'],
      yourVoteTimestamp: lastWeek.toISOString()
    },
    {
      id: '2',
      title: 'Crypto Regulation Sentiment',
      description: 'How do you feel about the current regulatory landscape for cryptocurrencies?',
      creator: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      createdAt: yesterday.toISOString(),
      startDate: yesterday.toISOString(),
      endDate: nextWeek.toISOString(),
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.SINGLE_CHOICE,
      maxSelections: 1,
      options: [
        { id: '2a', text: 'Too restrictive', votes: 45, publicVotes: 25, privateVotes: 20 },
        { id: '2b', text: 'Balanced approach', votes: 30, publicVotes: 18, privateVotes: 12 },
        { id: '2c', text: 'Not enough regulation', votes: 25, publicVotes: 15, privateVotes: 10 },
        { id: '2d', text: 'Needs complete overhaul', votes: 35, publicVotes: 20, privateVotes: 15 }
      ],
      totalVotes: 135,
      publicVotes: 78,
      privateVotes: 57,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    // Additional Multiple Choice Polls - Active
    {
      id: '21',
      title: 'Blockchain Development Priorities',
      description: 'Which aspects of blockchain technology should developers prioritize?',
      creator: '0x3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2',
      createdAt: lastWeek.toISOString(),
      startDate: lastWeek.toISOString(),
      endDate: new Date(nextWeek.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days after next week
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.MULTIPLE_CHOICE,
      maxSelections: 3,
      options: [
        { id: '21a', text: 'Scalability', votes: 87, publicVotes: 55, privateVotes: 32 },
        { id: '21b', text: 'Security', votes: 95, publicVotes: 60, privateVotes: 35 },
        { id: '21c', text: 'Interoperability', votes: 78, publicVotes: 48, privateVotes: 30 },
        { id: '21d', text: 'User Experience', votes: 82, publicVotes: 52, privateVotes: 30 },
        { id: '21e', text: 'Privacy', votes: 90, publicVotes: 56, privateVotes: 34 },
        { id: '21f', text: 'Energy Efficiency', votes: 75, publicVotes: 45, privateVotes: 30 }
      ],
      totalVotes: 507,
      publicVotes: 316,
      privateVotes: 191,
      hasVoted: true,
      yourVote: ['21b', '21e', '21a'],
      yourVoteTimestamp: yesterday.toISOString()
    },
    {
      id: '22',
      title: 'DeFi Protocol Features',
      description: 'Which features do you value most in DeFi protocols?',
      creator: '0x4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.MULTIPLE_CHOICE,
      maxSelections: 4,
      options: [
        { id: '22a', text: 'High Yields', votes: 112, publicVotes: 70, privateVotes: 42 },
        { id: '22b', text: 'Security Audits', votes: 128, publicVotes: 80, privateVotes: 48 },
        { id: '22c', text: 'Insurance Options', votes: 95, publicVotes: 60, privateVotes: 35 },
        { id: '22d', text: 'User Interface', votes: 87, publicVotes: 55, privateVotes: 32 },
        { id: '22e', text: 'Low Fees', votes: 103, publicVotes: 65, privateVotes: 38 },
        { id: '22f', text: 'Decentralization Level', votes: 118, publicVotes: 75, privateVotes: 43 },
        { id: '22g', text: 'Privacy Features', votes: 92, publicVotes: 58, privateVotes: 34 }
      ],
      totalVotes: 735,
      publicVotes: 463,
      privateVotes: 272,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    // Ranked Choice Polls - Active
    {
      id: '23',
      title: 'Crypto Wallet Features',
      description: 'Rank these cryptocurrency wallet features in order of importance to you.',
      creator: '0x5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.RANKED_CHOICE,
      maxSelections: 5,
      options: [
        { id: '23a', text: 'Security Features', votes: 95, publicVotes: 60, privateVotes: 35, rankPoints: 450 },
        { id: '23b', text: 'User Interface', votes: 87, publicVotes: 55, privateVotes: 32, rankPoints: 390 },
        { id: '23c', text: 'Multi-Chain Support', votes: 92, publicVotes: 58, privateVotes: 34, rankPoints: 420 },
        { id: '23d', text: 'Hardware Wallet Integration', votes: 78, publicVotes: 48, privateVotes: 30, rankPoints: 350 },
        { id: '23e', text: 'DApp Browser', votes: 65, publicVotes: 40, privateVotes: 25, rankPoints: 280 },
        { id: '23f', text: 'Privacy Features', votes: 82, publicVotes: 52, privateVotes: 30, rankPoints: 370 }
      ],
      totalVotes: 499,
      publicVotes: 313,
      privateVotes: 186,
      hasVoted: true,
      yourVote: ['23a', '23c', '23f', '23b', '23d'],
      yourVoteTimestamp: yesterday.toISOString()
    },
    {
      id: '24',
      title: 'Blockchain Governance Models',
      description: 'Rank these blockchain governance models based on effectiveness and fairness.',
      creator: '0x6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(), // 23 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.RANKED_CHOICE,
      maxSelections: 4,
      options: [
        { id: '24a', text: 'On-Chain Voting', votes: 112, publicVotes: 70, privateVotes: 42, rankPoints: 420 },
        { id: '24b', text: 'Quadratic Voting', votes: 95, publicVotes: 60, privateVotes: 35, rankPoints: 350 },
        { id: '24c', text: 'Delegated Voting', votes: 87, publicVotes: 55, privateVotes: 32, rankPoints: 320 },
        { id: '24d', text: 'Futarchy', votes: 65, publicVotes: 40, privateVotes: 25, rankPoints: 230 },
        { id: '24e', text: 'Holacracy', votes: 72, publicVotes: 45, privateVotes: 27, rankPoints: 260 }
      ],
      totalVotes: 431,
      publicVotes: 270,
      privateVotes: 161,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    {
      id: '25',
      title: 'Crypto Investment Strategies',
      description: 'Rank these cryptocurrency investment strategies based on their risk-reward profile.',
      creator: '0x7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(), // 27 days from now
      status: POLL_STATUS.ACTIVE,
      type: POLL_TYPE.RANKED_CHOICE,
      maxSelections: 5,
      options: [
        { id: '25a', text: 'Dollar-Cost Averaging', votes: 128, publicVotes: 80, privateVotes: 48, rankPoints: 600 },
        { id: '25b', text: 'Value Investing', votes: 112, publicVotes: 70, privateVotes: 42, rankPoints: 520 },
        { id: '25c', text: 'Yield Farming', votes: 95, publicVotes: 60, privateVotes: 35, rankPoints: 430 },
        { id: '25d', text: 'Token Staking', votes: 103, publicVotes: 65, privateVotes: 38, rankPoints: 480 },
        { id: '25e', text: 'NFT Flipping', votes: 87, publicVotes: 55, privateVotes: 32, rankPoints: 390 },
        { id: '25f', text: 'Liquidity Providing', votes: 92, publicVotes: 58, privateVotes: 34, rankPoints: 420 }
      ],
      totalVotes: 617,
      publicVotes: 388,
      privateVotes: 229,
      hasVoted: true,
      yourVote: ['25a', '25d', '25b', '25f', '25c'],
      yourVoteTimestamp: yesterday.toISOString()
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
    // Additional Multiple Choice Polls - Ended
    {
      id: '10',
      title: 'Favorite Crypto News Sources',
      description: 'Which crypto news sources do you find most reliable and informative?',
      creator: '0x5E4D3C2B1A9F8E7D6C5B4A3F2E1D0C9B8A7F6E5',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
      startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      status: POLL_STATUS.ENDED,
      type: POLL_TYPE.MULTIPLE_CHOICE,
      maxSelections: 3,
      options: [
        { id: '10a', text: 'CoinDesk', votes: 128, publicVotes: 80, privateVotes: 48 },
        { id: '10b', text: 'CoinTelegraph', votes: 112, publicVotes: 70, privateVotes: 42 },
        { id: '10c', text: 'The Block', votes: 95, publicVotes: 60, privateVotes: 35 },
        { id: '10d', text: 'Decrypt', votes: 87, publicVotes: 55, privateVotes: 32 },
        { id: '10e', text: 'Partisia Blog', votes: 103, publicVotes: 65, privateVotes: 38 }
      ],
      totalVotes: 525,
      publicVotes: 330,
      privateVotes: 195,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null,
      winner: 'CoinDesk'
    },
    {
      id: '11',
      title: 'Blockchain Use Cases',
      description: 'Which blockchain use cases do you believe will have the biggest real-world impact?',
      creator: '0x1F2E3D4C5B6A7F8E9D0C1B2A3F4E5D6C7B8A9F0',
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
      startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      status: POLL_STATUS.ENDED,
      type: POLL_TYPE.MULTIPLE_CHOICE,
      maxSelections: 4,
      options: [
        { id: '11a', text: 'Supply Chain Tracking', votes: 142, publicVotes: 90, privateVotes: 52 },
        { id: '11b', text: 'Digital Identity', votes: 156, publicVotes: 100, privateVotes: 56 },
        { id: '11c', text: 'Healthcare Records', votes: 128, publicVotes: 80, privateVotes: 48 },
        { id: '11d', text: 'Voting Systems', votes: 172, publicVotes: 110, privateVotes: 62 },
        { id: '11e', text: 'Financial Services', votes: 187, publicVotes: 120, privateVotes: 67 },
        { id: '11f', text: 'Real Estate', votes: 112, publicVotes: 70, privateVotes: 42 }
      ],
      totalVotes: 897,
      publicVotes: 570,
      privateVotes: 327,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null,
      winner: 'Financial Services'
    },
    // Ranked Choice Polls - Ended
    {
      id: '12',
      title: 'Crypto Exchange Rankings',
      description: 'Rank the following cryptocurrency exchanges based on security, fees, and user experience.',
      creator: '0x9A8B7C6D5E4F3G2H1I0J9K8L7M6N5O4P3Q2R1S0',
      createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
      startDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      status: POLL_STATUS.ENDED,
      type: POLL_TYPE.RANKED_CHOICE,
      maxSelections: 5,
      options: [
        { id: '12a', text: 'Binance', votes: 156, publicVotes: 100, privateVotes: 56, rankPoints: 720 },
        { id: '12b', text: 'Coinbase', votes: 142, publicVotes: 90, privateVotes: 52, rankPoints: 650 },
        { id: '12c', text: 'Kraken', votes: 128, publicVotes: 80, privateVotes: 48, rankPoints: 580 },
        { id: '12d', text: 'FTX', votes: 95, publicVotes: 60, privateVotes: 35, rankPoints: 410 },
        { id: '12e', text: 'Partisia Exchange', votes: 112, publicVotes: 70, privateVotes: 42, rankPoints: 490 }
      ],
      totalVotes: 633,
      publicVotes: 400,
      privateVotes: 233,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null,
      winner: 'Binance'
    },
    {
      id: '13',
      title: 'Smart Contract Platforms',
      description: 'Rank these smart contract platforms based on developer experience and ecosystem.',
      creator: '0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0',
      createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(), // 22 days ago
      startDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
      status: POLL_STATUS.ENDED,
      type: POLL_TYPE.RANKED_CHOICE,
      maxSelections: 4,
      options: [
        { id: '13a', text: 'Ethereum', votes: 172, publicVotes: 110, privateVotes: 62, rankPoints: 650 },
        { id: '13b', text: 'Solana', votes: 142, publicVotes: 90, privateVotes: 52, rankPoints: 520 },
        { id: '13c', text: 'Avalanche', votes: 128, publicVotes: 80, privateVotes: 48, rankPoints: 460 },
        { id: '13d', text: 'Polkadot', votes: 112, publicVotes: 70, privateVotes: 42, rankPoints: 390 },
        { id: '13e', text: 'Partisia Blockchain', votes: 156, publicVotes: 100, privateVotes: 56, rankPoints: 580 }
      ],
      totalVotes: 710,
      publicVotes: 450,
      privateVotes: 260,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null,
      winner: 'Ethereum'
    },
    {
      id: '14',
      title: 'Blockchain Consensus Mechanisms',
      description: 'Rank these consensus mechanisms based on security, scalability, and energy efficiency.',
      creator: '0x0F1E2D3C4B5A6F7E8D9C0B1A2F3E4D5C6B7A8F9',
      createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days ago
      startDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      status: POLL_STATUS.ENDED,
      type: POLL_TYPE.RANKED_CHOICE,
      maxSelections: 5,
      options: [
        { id: '14a', text: 'Proof of Work', votes: 128, publicVotes: 80, privateVotes: 48, rankPoints: 480 },
        { id: '14b', text: 'Proof of Stake', votes: 156, publicVotes: 100, privateVotes: 56, rankPoints: 620 },
        { id: '14c', text: 'Delegated Proof of Stake', votes: 112, publicVotes: 70, privateVotes: 42, rankPoints: 420 },
        { id: '14d', text: 'Proof of Authority', votes: 95, publicVotes: 60, privateVotes: 35, rankPoints: 350 },
        { id: '14e', text: 'Proof of History', votes: 87, publicVotes: 55, privateVotes: 32, rankPoints: 320 },
        { id: '14f', text: 'MPC Consensus', votes: 142, publicVotes: 90, privateVotes: 52, rankPoints: 550 }
      ],
      totalVotes: 720,
      publicVotes: 455,
      privateVotes: 265,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null,
      winner: 'Proof of Stake'
    },
    // PENDING POLLS
    {
      id: '15',
      title: 'Future of DeFi',
      description: 'What do you think will be the most important development in DeFi over the next year?',
      creator: '0x6F5E4D3C2B1A0F9E8D7C6B5A4F3E2D1C0B9A8F7',
      createdAt: now.toISOString(),
      startDate: tomorrow.toISOString(),
      endDate: nextMonth.toISOString(),
      status: POLL_STATUS.PENDING,
      type: POLL_TYPE.SINGLE_CHOICE,
      maxSelections: 1,
      options: [
        { id: '15a', text: 'Cross-chain interoperability', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '15b', text: 'Institutional adoption', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '15c', text: 'Regulatory clarity', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '15d', text: 'Improved user experience', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '15e', text: 'Scalability solutions', votes: 0, publicVotes: 0, privateVotes: 0 }
      ],
      totalVotes: 0,
      publicVotes: 0,
      privateVotes: 0,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    // Additional Multiple Choice Polls - Pending
    {
      id: '16',
      title: 'Web3 Gaming Features',
      description: 'Which features do you consider most important for successful Web3 games?',
      creator: '0x2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S',
      createdAt: now.toISOString(),
      startDate: nextWeek.toISOString(),
      endDate: new Date(nextWeek.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days after next week
      status: POLL_STATUS.PENDING,
      type: POLL_TYPE.MULTIPLE_CHOICE,
      maxSelections: 3,
      options: [
        { id: '16a', text: 'Play-to-earn mechanics', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '16b', text: 'True ownership of assets', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '16c', text: 'Cross-game interoperability', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '16d', text: 'Engaging gameplay', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '16e', text: 'Community governance', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '16f', text: 'Low transaction fees', votes: 0, publicVotes: 0, privateVotes: 0 }
      ],
      totalVotes: 0,
      publicVotes: 0,
      privateVotes: 0,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    {
      id: '17',
      title: 'Crypto Education Topics',
      description: 'Which cryptocurrency education topics do you think need more attention?',
      creator: '0x5F4E3D2C1B0A9F8E7D6C5B4A3F2E1D0C9B8A7F6',
      createdAt: now.toISOString(),
      startDate: tomorrow.toISOString(),
      endDate: new Date(tomorrow.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days after tomorrow
      status: POLL_STATUS.PENDING,
      type: POLL_TYPE.MULTIPLE_CHOICE,
      maxSelections: 4,
      options: [
        { id: '17a', text: 'Security best practices', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '17b', text: 'Blockchain fundamentals', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '17c', text: 'DeFi protocols', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '17d', text: 'Tokenomics', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '17e', text: 'Regulatory compliance', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '17f', text: 'Technical analysis', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '17g', text: 'Privacy technologies', votes: 0, publicVotes: 0, privateVotes: 0 }
      ],
      totalVotes: 0,
      publicVotes: 0,
      privateVotes: 0,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    // Ranked Choice Polls - Pending
    {
      id: '18',
      title: 'Privacy Solutions Ranking',
      description: 'Rank these privacy-enhancing technologies based on their effectiveness and usability.',
      creator: '0x1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0',
      createdAt: now.toISOString(),
      startDate: nextWeek.toISOString(),
      endDate: new Date(nextWeek.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days after next week
      status: POLL_STATUS.PENDING,
      type: POLL_TYPE.RANKED_CHOICE,
      maxSelections: 5,
      options: [
        { id: '18a', text: 'Zero-Knowledge Proofs', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '18b', text: 'Secure Multi-Party Computation', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '18c', text: 'Ring Signatures', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '18d', text: 'Stealth Addresses', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '18e', text: 'Confidential Transactions', votes: 0, publicVotes: 0, privateVotes: 0 }
      ],
      totalVotes: 0,
      publicVotes: 0,
      privateVotes: 0,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    {
      id: '19',
      title: 'NFT Use Cases',
      description: 'Rank these NFT use cases based on their long-term potential and utility.',
      creator: '0x0T9S8R7Q6P5O4N3M2L1K0J9I8H7G6F5E4D3C2B',
      createdAt: now.toISOString(),
      startDate: tomorrow.toISOString(),
      endDate: new Date(tomorrow.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days after tomorrow
      status: POLL_STATUS.PENDING,
      type: POLL_TYPE.RANKED_CHOICE,
      maxSelections: 4,
      options: [
        { id: '19a', text: 'Digital Art', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '19b', text: 'Gaming Assets', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '19c', text: 'Event Tickets', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '19d', text: 'Identity Verification', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '19e', text: 'Real Estate Tokenization', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '19f', text: 'Intellectual Property Rights', votes: 0, publicVotes: 0, privateVotes: 0 }
      ],
      totalVotes: 0,
      publicVotes: 0,
      privateVotes: 0,
      hasVoted: false,
      yourVote: null,
      yourVoteTimestamp: null
    },
    {
      id: '20',
      title: 'Blockchain Scalability Solutions',
      description: 'Rank these blockchain scalability solutions based on their effectiveness and decentralization.',
      creator: '0x2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1',
      createdAt: now.toISOString(),
      startDate: nextWeek.toISOString(),
      endDate: new Date(nextWeek.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days after next week
      status: POLL_STATUS.PENDING,
      type: POLL_TYPE.RANKED_CHOICE,
      maxSelections: 5,
      options: [
        { id: '20a', text: 'Layer 2 Rollups', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '20b', text: 'Sharding', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '20c', text: 'Sidechains', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '20d', text: 'State Channels', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '20e', text: 'Plasma', votes: 0, publicVotes: 0, privateVotes: 0 },
        { id: '20f', text: 'Alternative Consensus Mechanisms', votes: 0, publicVotes: 0, privateVotes: 0 }
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
