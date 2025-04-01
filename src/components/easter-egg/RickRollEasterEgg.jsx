import React, { useState, useContext } from 'react';
import { Box, Button, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { ThemeContext } from '../../contexts/ThemeContext';

const RickRollEasterEgg = () => {
  const [open, setOpen] = useState(false);
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';

  // Only show the button in futuristic (dark) mode
  if (themeMode !== 'futuristic') {
    return null;
  }

  const handleOpen = () => {
    // Toggle a class on the container to trigger the stars animation
    const container = document.getElementById('app-container');
    if (container) {
      container.classList.add('animate-stars');
      
      // Remove the class after a delay
      setTimeout(() => {
        container.classList.remove('animate-stars');
      }, 1000);
    }
    
    // Pause music playback when opening the dialog if in futuristic mode
    if (isFuturistic) {
      const audioElement = document.getElementById('music-player-audio');
      if (audioElement && !audioElement.paused) {
        console.log('Pausing music player for Easter Egg video');
        audioElement.pause();
      }
    }
    
    // Open the dialog
    setOpen(true);
  };

  const handleClose = () => {
    // Close the dialog
    setOpen(false);
    
    // Resume music playback when closing the dialog if in futuristic mode
    if (isFuturistic) {
      // Get the audio element
      const audioElement = document.getElementById('music-player-audio');
      if (audioElement) {
        console.log('Resuming music player from Easter Egg close');
        
        // Small delay to ensure dialog closing animation completes
        setTimeout(() => {
          audioElement.play()
            .then(() => {
              console.log('Music resumed successfully after closing popup');
              // Dispatch an event to notify the music player component
              document.dispatchEvent(new CustomEvent('resumeMusicPlayback'));
            })
            .catch(err => {
              console.error('Failed to resume music playback:', err);
            });
        }, 300);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1500, // Increased z-index to ensure visibility
        }}
      >
        <Button
          variant="contained"
          startIcon={<LocalAtmIcon />}
          onClick={handleOpen}
          sx={{
            background: isFuturistic 
              ? 'linear-gradient(45deg, #ff00cc, #ff0055)' // Neon magenta gradient in dark mode
              : 'linear-gradient(45deg, #ff00cc, #ff0055)', // Same gradient in light mode for consistency
            color: '#fff', // White text always for better visibility
            fontWeight: 'bold',
            border: isFuturistic 
              ? '2px solid rgba(255, 255, 255, 0.5)' // Visible border in dark mode
              : '2px solid rgba(255, 255, 255, 0.7)', // Slightly more visible in light mode
            boxShadow: isFuturistic
              ? '0 0 20px rgba(255, 0, 204, 0.7)' // Stronger glow in dark mode
              : '0 0 15px rgba(255, 0, 204, 0.5)', // Subtle glow in light mode
            animation: isFuturistic
              ? 'pulse 1.2s infinite ease-in-out, scale 2s infinite ease-in-out, breathe 3s infinite ease-in-out'
              : 'pulse 2s infinite ease-in-out', // Simpler animation in light mode
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 10px rgba(255, 0, 204, 0.5)' },
              '50%': { boxShadow: '0 0 30px rgba(255, 0, 204, 1)' },
              '100%': { boxShadow: '0 0 10px rgba(255, 0, 204, 0.5)' },
            },
            '@keyframes scale': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' },
            },
            '@keyframes breathe': {
              '0%': { filter: 'brightness(1) contrast(1.1)' },
              '50%': { filter: 'brightness(1.4) contrast(1.3)' },
              '100%': { filter: 'brightness(1) contrast(1.1)' },
            },
            '&:hover': {
              background: 'linear-gradient(45deg, #ff00cc, #ff0055)',
              boxShadow: '0 0 35px rgba(255, 0, 204, 1)',
              transform: 'translateY(-3px) scale(1.05)',
              transition: 'all 0.2s ease',
            },
            fontSize: '1.1rem',
            padding: '10px 20px', // Larger button
            borderRadius: '24px',
            letterSpacing: '0.5px',
            textShadow: isFuturistic 
              ? '0 0 10px rgba(255, 0, 255, 0.8)' 
              : '0 0 5px rgba(255, 255, 255, 0.6)',
          }}
        >
          Get Free $MPC
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        fullScreen
        PaperProps={{
          sx: {
            background: '#000',
            boxShadow: 'none',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 20,
            top: 20,
            color: 'white',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10,
            padding: '12px',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
        <Box sx={{ 
          width: '90vw', 
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <video
            autoPlay
            controls
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              maxHeight: '90vh',
            }}
          >
            <source src="/videos/rickroll.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      </Dialog>
    </>
  );
};

export default RickRollEasterEgg;
