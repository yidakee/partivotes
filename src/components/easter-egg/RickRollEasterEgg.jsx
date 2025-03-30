import React, { useState } from 'react';
import { Box, Button, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

const RickRollEasterEgg = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    // Dispatch custom event to mute music player
    document.dispatchEvent(new CustomEvent('freeMPCClick'));
    
    // Get the audio element and pause it
    const audioElement = document.getElementById('music-player-audio');
    if (audioElement) {
      console.log('Pausing music player from Easter Egg click');
      audioElement.pause();
    }
    
    // Open the dialog
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            background: 'linear-gradient(45deg, #00ff9d, #00a3ff)',
            color: '#000',
            fontWeight: 'bold',
            border: '2px solid rgba(255, 255, 255, 0.5)', // Thicker, more visible border
            boxShadow: '0 0 20px rgba(0, 255, 240, 0.7)', // Permanent glow
            animation: 'pulse 1.2s infinite ease-in-out, scale 2s infinite ease-in-out, breathe 3s infinite ease-in-out',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 10px rgba(0, 255, 240, 0.5)' },
              '50%': { boxShadow: '0 0 30px rgba(0, 255, 240, 1)' },
              '100%': { boxShadow: '0 0 10px rgba(0, 255, 240, 0.5)' },
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
              background: 'linear-gradient(45deg, #00ff9d, #00a3ff)',
              boxShadow: '0 0 35px rgba(0, 255, 240, 1)',
              transform: 'translateY(-3px) scale(1.05)',
              transition: 'all 0.2s ease',
            },
            fontSize: '1.1rem',
            padding: '10px 20px', // Larger button
            borderRadius: '24px',
            letterSpacing: '0.5px',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
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
