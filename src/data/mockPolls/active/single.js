import { POLL_STATUS, POLL_TYPE } from '../../../utils/constants';

// Helper function to create dates relative to now
const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const lastWeek = new Date(now);
lastWeek.setDate(now.getDate() - 7);
const nextWeek = new Date(now);
nextWeek.setDate(now.getDate() + 7);
const nextMonth = new Date(now);
nextMonth.setDate(now.getDate() + 30);

export const singleChoicePolls = [
  {
    id: '1',
    title: 'Best Layer 1 Blockchain',
    description: 'Which Layer 1 blockchain do you think has the most promising future?',
    creator: '00b06f5b47f9b085803f401313b58823a73a7bae7c',
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
    creator: '01c17f6c58f0c196914f512424c69934b84b8cbf8d',
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
  }
];
