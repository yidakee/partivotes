import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const ThemeContext = createContext();

// Create the theme provider component
export const ThemeProvider = ({ children }) => {
  // Check localStorage for saved theme preference, default to 'standard'
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('partivotes-theme');
    return savedTheme || 'standard';
  });

  // Effect to apply theme class to body/html/root and save to localStorage
  useEffect(() => {
    // Clear all theme classes and add the current one
    const applyTheme = (theme) => {
      console.log(`Applying theme: ${theme}`);
      
      // Target all key elements
      const elements = [
        document.documentElement, 
        document.body, 
        document.getElementById('root')
      ].filter(Boolean);
      
      // Remove all theme classes
      elements.forEach(element => {
        element.classList.remove('standard-theme', 'futuristic-theme');
        
        // Clear any inline background styles
        element.style.removeProperty('background');
        element.style.removeProperty('background-color');
      });
      
      // Add current theme class to all elements
      const themeClass = `${theme}-theme`;
      elements.forEach(element => {
        element.classList.add(themeClass);
      });
      
      // Save to localStorage
      localStorage.setItem('partivotes-theme', theme);
    };
    
    applyTheme(themeMode);
    
    // Toggle starfield based on theme
    if (typeof window.toggleStarfield === 'function') {
      window.toggleStarfield(themeMode === 'futuristic');
    }
    
    // Play music if futuristic theme
    if (themeMode === 'futuristic') {
      setTimeout(() => {
        // Try to find and play music
        const musicPlayer = document.getElementById('music-player-audio');
        if (musicPlayer) {
          const playPromise = musicPlayer.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => console.log('Music play failed:', e));
          }
        }
        
        // Dispatch custom event for any other listeners
        document.dispatchEvent(new CustomEvent('playMusic'));
      }, 100);
    }
  }, [themeMode]);

  // Toggle between themes
  const toggleTheme = () => {
    setThemeMode(prevTheme => 
      prevTheme === 'standard' ? 'futuristic' : 'standard'
    );
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
