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
    ],
    totalVotes: 615,
    publicVotes: 365,
    privateVotes: 250,
    hasVoted: false,
    yourVote: null,
    yourVoteTimestamp: null,
    winner: 'MetaMask'
  }
];
