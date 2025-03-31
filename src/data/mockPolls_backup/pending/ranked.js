import { POLL_STATUS, POLL_TYPE } from '../../../utils/constants';

// Helper function to create dates relative to now
const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
const nextWeek = new Date(now);
nextWeek.setDate(now.getDate() + 7);
const nextMonth = new Date(now);
nextMonth.setDate(now.getDate() + 30);

export const rankedChoicePolls = [
  {
    id: '9',
    title: 'Top Crypto Influencers',
    description: 'Rank these crypto influencers based on their knowledge, credibility, and impact.',
    creator: '10a0a0f0e0f0f9a0f0d0e0abdbf0f8c0fb0ff7f',
    createdAt: now.toISOString(),
    startDate: nextWeek.toISOString(),
    endDate: new Date(nextMonth.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days after next month
    status: POLL_STATUS.PENDING,
    type: POLL_TYPE.RANKED_CHOICE,
    maxSelections: 5,
    options: [
      { id: '9a', text: 'Vitalik Buterin', votes: 0, publicVotes: 0, privateVotes: 0, rankPoints: 0 },
      { id: '9b', text: 'Charles Hoskinson', votes: 0, publicVotes: 0, privateVotes: 0, rankPoints: 0 },
      { id: '9c', text: 'Andreas Antonopoulos', votes: 0, publicVotes: 0, privateVotes: 0, rankPoints: 0 },
      { id: '9d', text: 'Michael Saylor', votes: 0, publicVotes: 0, privateVotes: 0, rankPoints: 0 },
      { id: '9e', text: 'Kurt Nielsen', votes: 0, publicVotes: 0, privateVotes: 0, rankPoints: 0 },
      { id: '9f', text: 'Brian Armstrong', votes: 0, publicVotes: 0, privateVotes: 0, rankPoints: 0 }
    ],
    totalVotes: 0,
    publicVotes: 0,
    privateVotes: 0,
    hasVoted: false,
    yourVote: null,
    yourVoteTimestamp: null
  },
  {
    id: '15',
    title: 'Blockchain Development Languages',
    description: 'Rank these programming languages based on their usefulness for blockchain development.',
    creator: '11a1a1f1e1f1f9a1f1d1e1acdbf1f8c1fb1ff8f',
    createdAt: now.toISOString(),
    startDate: tomorrow.toISOString(),
    endDate: nextMonth.toISOString(),
    status: POLL_STATUS.PENDING,
    type: POLL_TYPE.RANKED_CHOICE,
    maxSelections: 4,
    options: [
      { id: '15a', text: 'Solidity', votes: 0, publicVotes: 0, privateVotes: 0, rankPoints: 0 },
      { id: '15b', text: 'Rust', votes: 0, publicVotes: 0, privateVotes: 0, rankPoints: 0 },
      { id: '15c', text: 'Go', votes: 0, publicVotes: 0, privateVotes: 0, rankPoints: 0 },
      { id: '15d', text: 'JavaScript', votes: 0, publicVotes: 0, privateVotes: 0, rankPoints: 0 },
      { id: '15e', text: 'Python', votes: 0, publicVotes: 0, privateVotes: 0, rankPoints: 0 },
      { id: '15f', text: 'C++', votes: 0, publicVotes: 0, privateVotes: 0, rankPoints: 0 }
    ],
    totalVotes: 0,
    publicVotes: 0,
    privateVotes: 0,
    hasVoted: false,
    yourVote: null,
    yourVoteTimestamp: null
  }
];
