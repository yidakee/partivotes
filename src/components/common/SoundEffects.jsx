import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Fab } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { ThemeContext } from '../../contexts/ThemeContext';

// Sound URLs - can be replaced with actual sound files later
const SOUNDS = {
  click: 'https://assets.codepen.io/154065/click.mp3',
  hover: 'https://assets.codepen.io/154065/hover.mp3',
  success: 'https://assets.codepen.io/154065/success.mp3',
  error: 'https://assets.codepen.io/154065/error.mp3',
  notification: 'https://assets.codepen.io/154065/notification.mp3',
  toggle: 'https://assets.codepen.io/154065/toggle.mp3'
};

// Preload sounds
const audioElements = {};
Object.entries(SOUNDS).forEach(([key, url]) => {
  audioElements[key] = new Audio(url);
  audioElements[key].volume = 0.5;
  audioElements[key].load();
});

const SoundEffects = () => {
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('partivotes-sound-enabled') === 'true';
  });

  // Save sound preference to localStorage
  useEffect(() => {
    localStorage.setItem('partivotes-sound-enabled', soundEnabled);
  }, [soundEnabled]);

  // Function to play a sound
  const playSound = useCallback((soundName) => {
    if (soundEnabled && isFuturistic && audioElements[soundName]) {
      // Clone the audio to allow multiple sounds to play simultaneously
      const sound = audioElements[soundName].cloneNode();
      sound.volume = 0.3; // Lower volume for better UX
      sound.play().catch(e => console.error("Error playing sound:", e));
    }
  }, [soundEnabled, isFuturistic]);

  // Expose the playSound function globally for other components to use
  useEffect(() => {
    window.playSound = playSound;
    
    return () => {
      delete window.playSound;
    };
  }, [playSound]);

  // Add event listeners for common interactions
  useEffect(() => {
    if (!isFuturistic) return;

    const handleButtonClick = () => playSound('click');
    const handleButtonHover = () => playSound('hover');
    const handleSuccess = () => playSound('success');
    
    // Add event listeners to buttons and links
    document.querySelectorAll('button, a, .MuiButtonBase-root').forEach(el => {
      el.addEventListener('click', handleButtonClick);
      el.addEventListener('mouseenter', handleButtonHover);
    });
    
    // Custom event listeners for success/error events
    document.addEventListener('partivotes-success', handleSuccess);
    document.addEventListener('partivotes-error', () => playSound('error'));
    document.addEventListener('partivotes-notification', () => playSound('notification'));

    // Cleanup
    return () => {
      document.querySelectorAll('button, a, .MuiButtonBase-root').forEach(el => {
        el.removeEventListener('click', handleButtonClick);
        el.removeEventListener('mouseenter', handleButtonHover);
      });
      document.removeEventListener('partivotes-success', handleSuccess);
      document.removeEventListener('partivotes-error', () => playSound('error'));
      document.removeEventListener('partivotes-notification', () => playSound('notification'));
    };
  }, [isFuturistic, playSound]);

  // Only show the toggle button in futuristic mode
  if (!isFuturistic) return null;

  return (
    <Fab 
      size="small" 
      className="sound-toggle"
      onClick={() => {
        setSoundEnabled(!soundEnabled);
        playSound('toggle');
      }}
      aria-label={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
    >
      {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
    </Fab>
  );
};

export default SoundEffects;
