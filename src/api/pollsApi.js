/**
 * Poll API service
 * Provides a fetch-based API to access polls in the production environment
 */

// Base API URL - will use the same domain as the website
const API_BASE_URL = `/api`;

/**
 * Get polls based on filter criteria
 * @param {Object} filter Filter criteria (status, creator, type)
 * @returns {Promise<Array>} Array of poll objects
 */
export const fetchPolls = async (filter = {}) => {
  try {
    // Build query string from filter
    const queryParams = new URLSearchParams();
    
    if (filter.status) {
      queryParams.append('status', filter.status);
    }
    
    if (filter.creator) {
      queryParams.append('creator', filter.creator);
    }
    
    if (filter.type) {
      queryParams.append('type', filter.type);
    }
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/polls${queryString ? `?${queryString}` : ''}`;
    
    console.log(`Fetching polls from API: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching polls from API:', error);
    throw error;
  }
};

/**
 * Get a single poll by ID
 * @param {string} id Poll ID
 * @returns {Promise<Object>} Poll object
 */
export const fetchPoll = async (id) => {
  try {
    const url = `${API_BASE_URL}/polls/${id}`;
    console.log(`Fetching poll from API: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching poll from API:', error);
    throw error;
  }
};

/**
 * Create a new poll
 * @param {Object} pollData Poll data object
 * @returns {Promise<Object>} Created poll object
 */
export const createPoll = async (pollData) => {
  try {
    const url = `${API_BASE_URL}/polls`;
    console.log(`Creating poll via API: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pollData)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating poll via API:', error);
    throw error;
  }
};

// Export additional API functions as needed
export default {
  fetchPolls,
  fetchPoll,
  createPoll
};
