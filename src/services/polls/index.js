/**
 * Polls service index file
 * Re-exports all poll-related functions from their respective modules
 */

// Re-export all functions from the storage module
export {
  loadCreatedPolls,
  saveCreatedPolls,
  updateCreatedPoll,
  getCreatedPolls,
  addCreatedPoll
} from './storage';

// Re-export all functions from the retrieval module
export {
  getPolls,
  getPoll
} from './retrieval';

// Re-export all functions from the creation module
export {
  createPoll,
  getPollCreationCost
} from './creation';

// Re-export all functions from the voting module
export {
  voteWithSignature,
  voteWithMPC,
  getMPCVoteCost
} from './voting';

// Re-export all functions from the management module
export {
  endPoll
} from './management';

// Re-export all functions from the utils module
export {
  waitForConfirmation
} from './utils';
