// Contract addresses
export const CONTRACT_ADDRESS = 'mock_contract_address';

// API endpoints
export const API_BASE_URL = 'https://api.partisiablockchain.com/v1';

// Application constants
export const APP_NAME = 'PartiVotes';
export const COPYRIGHT_YEAR = new Date().getFullYear();

// Poll statuses
export const POLL_STATUS = {
  ACTIVE: 'active',
  ENDED: 'ended',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
};

// Poll types
export const POLL_TYPE = {
  SINGLE_CHOICE: 'single_choice',
  MULTIPLE_CHOICE: 'multiple_choice',
  RANKED_CHOICE: 'ranked_choice',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'partivotes_auth_token',
  USER_PREFERENCES: 'partivotes_user_preferences',
};

// Routes
export const ROUTES = {
  HOME: '/',
  POLLS: '/polls',
  POLL_DETAILS: '/polls/:id',
  CREATE_POLL: '/polls/create',
  MY_POLLS: '/my-polls',
  PROFILE: '/profile',
};

// Default pagination
export const DEFAULT_PAGE_SIZE = 10;

// MPC costs
export const MPC_COST_PER_OPTION = 5; // Cost in tokens per option for MPC voting
export const MPC_COST_PER_VOTE = 2; // Cost in tokens per vote for MPC voting
