import { POLL_STATUS, POLL_TYPE } from '../../../utils/constants';

// Helper function to create dates relative to now
const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const lastWeek = new Date(now);
lastWeek.setDate(now.getDate() - 7);

export const rankedChoicePolls = [
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
  }
];
