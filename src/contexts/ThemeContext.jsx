import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const ThemeContext = createContext();

// Create a custom event for theme changes
export const themeChangeEvent = new CustomEvent('themeChange', {
  detail: { theme: 'standard' }
});

// Create the theme provider component
export const ThemeProvider = ({ children }) => {
  // Check localStorage for saved theme preference, default to 'standard'
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('partivotes-theme');
    return savedTheme || 'standard';
  });

  // Toggle between 'standard' and 'futuristic' themes
  const toggleTheme = () => {
    const newTheme = themeMode === 'standard' ? 'futuristic' : 'standard';
    setThemeMode(newTheme);
    localStorage.setItem('partivotes-theme', newTheme);
    
    // Dispatch the theme change event
    const event = new CustomEvent('themeChange', {
      detail: { theme: newTheme }
    });
    document.dispatchEvent(event);
  };

  // Apply theme-specific CSS classes to the body element
  useEffect(() => {
    document.body.classList.remove('standard-theme', 'futuristic-theme');
    document.body.classList.add(`${themeMode}-theme`);
    
    // Add meta theme-color for browser UI
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        themeMode === 'standard' ? '#1976d2' : '#6200ea'
      );
    }
  }, [themeMode]);

  // Provide the theme context to children
  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
