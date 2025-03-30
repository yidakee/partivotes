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

  // Effect to apply theme class to body/html and save to localStorage
  useEffect(() => {
    const applyThemeStyles = (theme) => {
      console.log(`Applying theme: ${theme}`);
      
      // CRITICAL: Force removal of ALL theme classes first
      document.body.classList.remove('standard-theme', 'futuristic-theme');
      document.documentElement.classList.remove('standard-theme', 'futuristic-theme');
      const root = document.getElementById('root');
      if (root) {
        root.classList.remove('standard-theme', 'futuristic-theme');
      }
      
      // Clear any inline styles that may interfere
      document.body.style.removeProperty('background');
      document.body.style.removeProperty('background-color');
      document.documentElement.style.removeProperty('background');
      document.documentElement.style.removeProperty('background-color');
      if (root) {
        root.style.removeProperty('background');
        root.style.removeProperty('background-color');
      }
      
      // Add current theme class - wait a tick to ensure removals take effect
      setTimeout(() => {
        const currentThemeClass = `${theme}-theme`;
        console.log(`Adding theme class: ${currentThemeClass}`);
        
        document.body.classList.add(currentThemeClass);
        document.documentElement.classList.add(currentThemeClass);
        if (root) {
          root.classList.add(currentThemeClass);
        }
        
        // Save to localStorage
        localStorage.setItem('partivotes-theme', theme);
        
        // Apply specific styles based on theme
        if (theme === 'futuristic') {
          document.body.style.background = 'transparent';
          document.documentElement.style.background = 'transparent';
          if (root) root.style.background = 'transparent';
        }
      }, 50);
    };

    applyThemeStyles(themeMode);

  }, [themeMode]);

  // Effect to toggle starfield based on themeMode
  useEffect(() => {
    if (typeof window.toggleStarfield === 'function') {
      console.log(`ThemeContext: Toggling starfield for ${themeMode} theme`);
      window.toggleStarfield(themeMode === 'futuristic');
    } else {
      console.warn('ThemeContext: window.toggleStarfield function not found.');
    }
    // No cleanup needed here as toggleStarfield handles its own state/cleanup
  }, [themeMode]);

  // Effect to play music when switching to futuristic theme
  useEffect(() => {
    if (themeMode === 'futuristic') {
      // Delay slightly to allow theme transition/DOM updates
      setTimeout(() => {
        console.log('ThemeContext: Attempting to play music for futuristic theme');
        
        // Method 1: Direct DOM access to music player audio
        const musicPlayerAudio = document.getElementById('music-player-audio');
        if (musicPlayerAudio) {
          const playPromise = musicPlayerAudio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => console.error("ThemeContext: Direct audio play failed:", error));
          }
        } else {
            console.log("ThemeContext: music-player-audio element not found, trying general audio")
        }

        // Method 2: Find all audio elements and try to play them
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            if(audio){
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => console.error("ThemeContext: General audio play failed:", error));
                }
            }
        });

        // Method 3: Dispatch custom event
        const playMusicEvent = new CustomEvent('playMusic', {
          detail: { triggered: true, theme: 'futuristic' }
        });
        document.dispatchEvent(playMusicEvent);
        console.log("ThemeContext: Dispatched playMusic event");

      }, 100); // Small delay might help ensure elements are ready after theme switch
    }
    // No specific cleanup needed here, assumes music stops separately or on theme change away
  }, [themeMode]);

  // Toggle between 'standard' and 'futuristic' themes
  const toggleTheme = () => {
    setThemeMode(prevTheme => {
      const newTheme = prevTheme === 'standard' ? 'futuristic' : 'standard';
      console.log(`ThemeContext: Toggling theme from ${prevTheme} to ${newTheme}`);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
