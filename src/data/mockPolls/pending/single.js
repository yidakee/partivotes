import { POLL_STATUS, POLL_TYPE } from '../../../utils/constants';

// Helper function to create dates relative to now
const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
const nextWeek = new Date(now);
nextWeek.setDate(now.getDate() + 7);
const nextMonth = new Date(now);
nextMonth.setDate(now.getDate() + 30);

export const singleChoicePolls = [
  {
    id: '5',
    title: 'Favorite DeFi Protocol',
    description: 'Which DeFi protocol do you find most innovative and useful?',
    creator: '0xfedcba9876543210fedcba9876543210fedcba98',
    createdAt: now.toISOString(),
    startDate: nextWeek.toISOString(),
    endDate: nextMonth.toISOString(),
    status: POLL_STATUS.PENDING,
    type: POLL_TYPE.SINGLE_CHOICE,
    maxSelections: 1,
    options: [
      { id: '5a', text: 'Uniswap', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '5b', text: 'Aave', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '5c', text: 'Compound', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '5d', text: 'MakerDAO', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '5e', text: 'Partisia DeFi', votes: 0, publicVotes: 0, privateVotes: 0 }
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
    title: 'Most Important Crypto Feature',
    description: 'What feature do you value most in a cryptocurrency?',
    creator: '0x0123456789abcdef0123456789abcdef01234567',
    createdAt: now.toISOString(),
    startDate: tomorrow.toISOString(),
    endDate: new Date(nextMonth.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days after next month
    status: POLL_STATUS.PENDING,
    type: POLL_TYPE.SINGLE_CHOICE,
    maxSelections: 1,
    options: [
      { id: '6a', text: 'Privacy', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '6b', text: 'Scalability', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '6c', text: 'Decentralization', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '6d', text: 'Security', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '6e', text: 'Low Fees', votes: 0, publicVotes: 0, privateVotes: 0 }
    ],
    totalVotes: 0,
    publicVotes: 0,
    privateVotes: 0,
    hasVoted: false,
    yourVote: null,
    yourVoteTimestamp: null
  }
];
