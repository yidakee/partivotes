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

  // Direct force activation of starfield
  useEffect(() => {
    // Activate starfield once when the component mounts
    const activateStarfield = () => {
      if (typeof window.toggleStarfield === 'function') {
        console.log('Activating starfield from ThemeContext mount');
        window.toggleStarfield(themeMode === 'futuristic');
      }
    };

    // Try immediately
    activateStarfield();
    
    // Also try a few times with delay in case script loads late
    const attempts = [100, 300, 600, 1000, 2000];
    attempts.forEach(delay => {
      setTimeout(activateStarfield, delay);
    });

    // Set up an interval to ensure starfield stays active
    const starfieldKeepAlive = setInterval(() => {
      if (themeMode === 'futuristic' && typeof window.toggleStarfield === 'function') {
        console.log('Starfield keep-alive check');
        window.toggleStarfield(true);
      }
    }, 3000);

    // Clean up interval on unmount
    return () => clearInterval(starfieldKeepAlive);
  }, [themeMode]);

  // Apply theme class to body and html elements
  useEffect(() => {
    // Remove any existing theme classes
    document.body.classList.remove('standard-theme', 'futuristic-theme');
    document.documentElement.classList.remove('standard-theme', 'futuristic-theme');
    document.getElementById('root').classList.remove('standard-theme', 'futuristic-theme');
    
    // Add current theme class
    document.body.classList.add(`${themeMode}-theme`);
    document.documentElement.classList.add(`${themeMode}-theme`);
    document.getElementById('root').classList.add(`${themeMode}-theme`);
    
    // Save to localStorage
    localStorage.setItem('partivotes-theme', themeMode);
    
    // Force background to be transparent with futuristic theme
    if (themeMode === 'futuristic') {
      document.body.style.background = 'transparent';
      document.documentElement.style.background = 'transparent';
    } else {
      document.body.style.background = '';
      document.documentElement.style.background = '';
    }
    
    // Dispatch custom event to notify other components
    themeChangeEvent.detail.theme = themeMode;
    document.dispatchEvent(themeChangeEvent);
  }, [themeMode]);

  // Toggle between 'standard' and 'futuristic' themes
  const toggleTheme = () => {
    setThemeMode(prevTheme => {
      const newTheme = prevTheme === 'standard' ? 'futuristic' : 'standard';
      
      // Toggle starfield if function exists
      if (typeof window.toggleStarfield === 'function') {
        console.log(`Toggling starfield for ${newTheme} theme`);
        
        // The delay helps with animation timing
        setTimeout(() => {
          window.toggleStarfield(newTheme === 'futuristic');
        }, 100);
      }
      
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <div className={`${themeMode}-theme`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
