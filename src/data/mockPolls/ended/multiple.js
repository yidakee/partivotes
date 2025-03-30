import { POLL_STATUS, POLL_TYPE } from '../../../utils/constants';

// Helper function to create dates relative to now
const now = new Date();

export const multipleChoicePolls = [
  {
    id: '10',
    title: 'Favorite Crypto News Sources',
    description: 'Which crypto news sources do you find most reliable and informative?',
    creator: '14a4a4f4e4f4f9a4f4d4e4afdbf4f8c4fb4ffbf',
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
    creator: '15a5a5f5e5f5f9a5f5d5e5b0dbf5f8c5fb5ffcf',
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
  }
];
