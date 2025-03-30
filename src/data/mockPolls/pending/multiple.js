import { POLL_STATUS, POLL_TYPE } from '../../../utils/constants';

// Helper function to create dates relative to now
const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
const nextWeek = new Date(now);
nextWeek.setDate(now.getDate() + 7);
const nextMonth = new Date(now);
nextMonth.setDate(now.getDate() + 30);

export const multipleChoicePolls = [
  {
    id: '7',
    title: 'Blockchain Use Cases',
    description: 'Which blockchain use cases do you believe will gain the most adoption in the next 5 years?',
    creator: '08f8efdfcff7f8fdf8bfc89b9bfdf6aff9fff5f',
    createdAt: now.toISOString(),
    startDate: nextWeek.toISOString(),
    endDate: new Date(nextMonth.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days after next month
    status: POLL_STATUS.PENDING,
    type: POLL_TYPE.MULTIPLE_CHOICE,
    maxSelections: 3,
    options: [
      { id: '7a', text: 'Supply Chain Management', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '7b', text: 'Digital Identity', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '7c', text: 'Healthcare Records', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '7d', text: 'Voting Systems', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '7e', text: 'Financial Services', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '7f', text: 'Gaming & NFTs', votes: 0, publicVotes: 0, privateVotes: 0 }
    ],
    totalVotes: 0,
    publicVotes: 0,
    privateVotes: 0,
    hasVoted: false,
    yourVote: null,
    yourVoteTimestamp: null
  },
  {
    id: '8',
    title: 'Crypto Investment Strategies',
    description: 'Which crypto investment strategies do you currently employ?',
    creator: '09f9ffefdfff8f9fef9cfd9acafef7bffafff6f',
    createdAt: now.toISOString(),
    startDate: tomorrow.toISOString(),
    endDate: nextMonth.toISOString(),
    status: POLL_STATUS.PENDING,
    type: POLL_TYPE.MULTIPLE_CHOICE,
    maxSelections: 4,
    options: [
      { id: '8a', text: 'HODLing', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '8b', text: 'Day Trading', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '8c', text: 'DCA (Dollar Cost Averaging)', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '8d', text: 'Yield Farming', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '8e', text: 'Staking', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '8f', text: 'Liquidity Providing', votes: 0, publicVotes: 0, privateVotes: 0 },
      { id: '8g', text: 'NFT Collecting', votes: 0, publicVotes: 0, privateVotes: 0 }
    ],
    totalVotes: 0,
    publicVotes: 0,
    privateVotes: 0,
    hasVoted: false,
    yourVote: null,
    yourVoteTimestamp: null
  }
];
