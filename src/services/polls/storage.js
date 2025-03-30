/**
 * Storage utilities for polls
 */

// In-memory store for created polls
let createdPolls = [];

/**
 * Try to load any previously created polls from localStorage
 */
export const loadCreatedPolls = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('partivotes_created_polls');
      if (saved) {
        createdPolls = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading created polls from localStorage:', error);
    }
  }
};

/**
 * Save created polls to localStorage
 */
export const saveCreatedPolls = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('partivotes_created_polls', JSON.stringify(createdPolls));
    } catch (error) {
      console.error('Error saving created polls to localStorage:', error);
    }
  }
};

/**
 * Update a created poll
 * @param {Object} updatedPoll - The updated poll object
 */
export const updateCreatedPoll = (updatedPoll) => {
  const index = createdPolls.findIndex(p => p.id === updatedPoll.id);
  if (index !== -1) {
    createdPolls[index] = updatedPoll;
    saveCreatedPolls();
  }
};

/**
 * Get all created polls
 * @returns {Array} Array of created polls
 */
export const getCreatedPolls = () => {
  return [...createdPolls];
};

/**
 * Add a poll to the created polls store
 * @param {Object} poll - The poll to add
 */
export const addCreatedPoll = (poll) => {
  createdPolls.push(poll);
  saveCreatedPolls();
};

// Initialize by loading created polls
loadCreatedPolls();
