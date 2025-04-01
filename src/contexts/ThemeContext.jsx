import React, { createContext, useState, useEffect } from 'react';

/**
 * Theme Context
 * 
 * Manages theme switching between standard and futuristic modes.
 * Applies appropriate CSS classes and handles side effects like
 * music playback.
 */
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
    
    // Handle music playback for futuristic theme
    if (themeMode === 'futuristic') {
      // Dispatch custom event for theme change
      document.dispatchEvent(new CustomEvent('themeChange', { 
        detail: { theme: 'futuristic' } 
      }));
      
      // Try to trigger music playback with a delay
      setTimeout(() => {
        // Dispatch custom event for music playback
        document.dispatchEvent(new CustomEvent('playMusic'));
        
        // Try to find and play music directly
        const musicPlayer = document.getElementById('music-player-audio');
        if (musicPlayer) {
          console.log('Found music player, attempting to play...');
          
          // Set volume to avoid startling the user
          musicPlayer.volume = 0.5;
          
          const playPromise = musicPlayer.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Music autoplay successful');
              })
              .catch(e => {
                console.log('Music autoplay failed, likely due to browser policy:', e);
                // Create a notification for the user that they need to interact
                const notification = document.createElement('div');
                notification.id = 'music-autoplay-notification';
                notification.style.position = 'fixed';
                notification.style.bottom = '80px';
                notification.style.left = '20px';
                notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                notification.style.color = '#00fff0';
                notification.style.padding = '10px';
                notification.style.borderRadius = '5px';
                notification.style.zIndex = '9999';
                notification.style.boxShadow = '0 0 10px #00fff0';
                notification.style.fontFamily = 'Orbitron, sans-serif';
                notification.style.fontSize = '12px';
                notification.innerHTML = 'Click to enable music <button id="enable-music-btn" style="background: #00fff0; color: black; border: none; padding: 5px 10px; margin-left: 10px; cursor: pointer; border-radius: 3px;">Play</button>';
                document.body.appendChild(notification);
                
                // Add click handler to the button
                document.getElementById('enable-music-btn').addEventListener('click', () => {
                  musicPlayer.play()
                    .then(() => {
                      console.log('Music playing after user interaction');
                      notification.remove();
                    })
                    .catch(err => console.error('Still failed to play:', err));
                });
                
                // Remove notification after 10 seconds
                setTimeout(() => {
                  if (document.getElementById('music-autoplay-notification')) {
                    document.getElementById('music-autoplay-notification').remove();
                  }
                }, 10000);
              });
          }
        }
      }, 300);
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
