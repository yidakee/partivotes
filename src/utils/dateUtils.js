import { format, formatDistance, isValid } from 'date-fns';

/**
 * Format a date string or timestamp into a human-readable format
 * @param {Date|string|number} date - The date to format
 * @param {string} formatStr - The format string to use (default: 'PPP')
 * @returns {string} The formatted date string
 * 
 * Format strings reference:
 * - 'PPP': March 29, 2025
 * - 'Pp': Mar 29, 2025, 12:00 AM
 * - 'pp': 12:00 AM
 * - 'P': 03/29/2025
 */
export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  if (!isValid(dateObj)) return 'Invalid date';
  
  try {
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error formatting date';
  }
};

/**
 * Get the relative time from now (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string|number} date - The date to compare with now
 * @returns {string} The relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  if (!isValid(dateObj)) return 'Invalid date';
  
  try {
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error getting relative time:', error);
    return 'Error getting relative time';
  }
};

/**
 * Check if a date is in the past
 * @param {Date|string|number} date - The date to check
 * @returns {boolean} True if the date is in the past
 */
export const isPastDate = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  if (!isValid(dateObj)) return false;
  
  return dateObj < new Date();
};
