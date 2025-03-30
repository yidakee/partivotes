import React, { createContext, useState, useContext, useCallback } from 'react';
import { POLL_STATUS } from '../utils/constants';

// Create the context
export const PollFilterContext = createContext();

// Create a custom hook to use the context
export const usePollFilter = () => useContext(PollFilterContext);

// Context provider component
export const PollFilterProvider = ({ children }) => {
  const [activeFilter, setActiveFilter] = useState(POLL_STATUS.ACTIVE); // Default to active polls

  // Function to change the filter with more verbosity for debugging
  const setFilter = useCallback((filter) => {
    console.log(`Setting filter in context from '${activeFilter}' to '${filter}'`);
    
    // For extra safety, ensure we're setting a valid filter value
    if (Object.values(POLL_STATUS).includes(filter)) {
      setActiveFilter(filter);
    } else {
      console.error(`Invalid filter value: ${filter}. Using default ACTIVE instead.`);
      setActiveFilter(POLL_STATUS.ACTIVE);
    }
  }, [activeFilter]);

  // Value provided by the context
  const value = {
    activeFilter,
    setFilter,
  };

  return (
    <PollFilterContext.Provider value={value}>
      {children}
    </PollFilterContext.Provider>
  );
};
