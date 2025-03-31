/**
 * API Service for PartiVotes
 * Provides methods to interact with the backend API
 */

// API base URL - automatically detects production vs development
const API_BASE_URL = window.location.hostname.includes('partivotes.xyz') 
  ? '/api' // Use relative URL in production to avoid mixed content issues
  : 'http://localhost:4000/api';

console.log('API Service initialized with base URL:', API_BASE_URL);

/**
 * Get all polls with optional filtering
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} Promise resolving to array of polls
 */
export const getPolls = async (options = {}) => {
  try {
    console.log('API Service: Getting polls with options:', options);
    
    // Build query string from options
    const queryParams = new URLSearchParams();
    if (options.status) queryParams.append('status', options.status);
    if (options.creator) queryParams.append('creator', options.creator);
    if (options.type) queryParams.append('type', options.type);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/polls${queryString ? `?${queryString}` : ''}`;
    
    console.log('API Service: Fetching from URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const polls = await response.json();
    console.log(`API Service: Received ${polls.length} polls`);
    return polls;
  } catch (error) {
    console.error('API Service Error:', error);
    throw error;
  }
};

/**
 * Get a single poll by ID
 * @param {string} id - ID of the poll to get
 * @returns {Promise<Object>} Promise resolving to poll object
 */
export const getPoll = async (id) => {
  try {
    console.log(`API Service: Getting poll with ID: ${id}`);
    
    const url = `${API_BASE_URL}/polls/${id}`;
    console.log('API Service: Fetching from URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const poll = await response.json();
    console.log('API Service: Poll retrieved successfully:', poll);
    return poll;
  } catch (error) {
    console.error('API Service Error:', error);
    throw error;
  }
};

/**
 * Create a new poll
 * @param {Object} pollData - Data for the new poll
 * @returns {Promise<Object>} Created poll
 */
export const createPoll = async (pollData) => {
  try {
    console.log('API Service: Creating poll with data:', pollData);
    
    const url = `${API_BASE_URL}/polls`;
    console.log('API Service: Posting to URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pollData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const createdPoll = await response.json();
    console.log('API Service: Poll created successfully:', createdPoll);
    return createdPoll;
  } catch (error) {
    console.error('API Service Error:', error);
    throw error;
  }
};

/**
 * Add a vote to a poll
 * @param {Object} voteData - Vote data
 * @returns {Promise<Object>} Promise resolving to updated poll object
 */
export const addVote = async (voteData) => {
  try {
    console.log('API Service: Adding vote with data:', voteData);
    
    const url = `${API_BASE_URL}/votes`;
    console.log('API Service: Posting to URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(voteData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('API Service: Vote added successfully:', result);
    return result;
  } catch (error) {
    console.error('API Service Error:', error);
    throw error;
  }
};
