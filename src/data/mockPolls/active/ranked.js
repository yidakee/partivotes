import { POLL_STATUS, POLL_TYPE } from '../../../utils/constants';

// Helper function to create dates relative to now
const now = new Date();
const lastWeek = new Date(now);
lastWeek.setDate(now.getDate() - 7);
const nextWeek = new Date(now);
nextWeek.setDate(now.getDate() + 7);
const nextMonth = new Date(now);
nextMonth.setDate(now.getDate() + 30);

export const rankedChoicePolls = [
  {
    id: '31',
    title: 'Top Privacy Coins',
    description: 'Rank these privacy-focused cryptocurrencies based on their technology and adoption.',
    creator: '0x5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    status: POLL_STATUS.ACTIVE,
    type: POLL_TYPE.RANKED_CHOICE,
    maxSelections: 5,
    options: [
      { id: '31a', text: 'Monero', votes: 95, publicVotes: 60, privateVotes: 35, rankPoints: 420 },
      { id: '31b', text: 'Zcash', votes: 87, publicVotes: 55, privateVotes: 32, rankPoints: 380 },
      { id: '31c', text: 'Dash', votes: 78, publicVotes: 48, privateVotes: 30, rankPoints: 340 },
      { id: '31d', text: 'Grin', votes: 65, publicVotes: 40, privateVotes: 25, rankPoints: 280 },
      { id: '31e', text: 'Partisia Privacy Token', votes: 103, publicVotes: 65, privateVotes: 38, rankPoints: 450 }
    ],
    totalVotes: 428,
    publicVotes: 268,
    privateVotes: 160,
    hasVoted: true,
    yourVote: ['31e', '31a', '31b', '31c', '31d'],
    yourVoteTimestamp: lastWeek.toISOString()
  },
  {
    id: '32',
    title: 'Blockchain Governance Models',
    description: 'Rank these blockchain governance models based on effectiveness and fairness.',
    creator: '0x6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    startDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(), // 22 days from now
    status: POLL_STATUS.ACTIVE,
    type: POLL_TYPE.RANKED_CHOICE,
    maxSelections: 4,
    options: [
      { id: '32a', text: 'On-Chain Voting', votes: 112, publicVotes: 70, privateVotes: 42, rankPoints: 410 },
      { id: '32b', text: 'Delegated Governance', votes: 95, publicVotes: 60, privateVotes: 35, rankPoints: 350 },
      { id: '32c', text: 'Quadratic Voting', votes: 87, publicVotes: 55, privateVotes: 32, rankPoints: 320 },
      { id: '32d', text: 'Futarchy', votes: 65, publicVotes: 40, privateVotes: 25, rankPoints: 230 },
      { id: '32e', text: 'MPC Governance', votes: 103, publicVotes: 65, privateVotes: 38, rankPoints: 380 }
    ],
    totalVotes: 462,
    publicVotes: 290,
    privateVotes: 172,
    hasVoted: false,
    yourVote: null,
    yourVoteTimestamp: null
  }
];
