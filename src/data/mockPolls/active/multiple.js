import { POLL_STATUS, POLL_TYPE } from '../../../utils/constants';

// Helper function to create dates relative to now
const now = new Date();
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const lastWeek = new Date(now);
lastWeek.setDate(now.getDate() - 7);
const nextWeek = new Date(now);
nextWeek.setDate(now.getDate() + 7);

export const multipleChoicePolls = [
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
  }
];
