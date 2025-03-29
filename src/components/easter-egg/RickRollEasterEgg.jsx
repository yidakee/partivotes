import React, { useState } from 'react';
import { Box, Button, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

const RickRollEasterEgg = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    // Dispatch custom event to mute music player
    document.dispatchEvent(new CustomEvent('freeMPCClick'));
    
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
          left: '20px',
          zIndex: 1000,
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
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: 'pulse 2s infinite, scale 3s infinite, sinewave-glow 4s infinite',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 5px rgba(0, 255, 240, 0.3)' },
              '50%': { boxShadow: '0 0 15px rgba(0, 255, 240, 0.6)' },
              '100%': { boxShadow: '0 0 5px rgba(0, 255, 240, 0.3)' },
            },
            '@keyframes scale': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.05)' },
              '100%': { transform: 'scale(1)' },
            },
            '@keyframes sinewave-glow': {
              '0%': { filter: 'brightness(1)' },
              '25%': { filter: 'brightness(1.2)' },
              '50%': { filter: 'brightness(1)' },
              '75%': { filter: 'brightness(0.9)' },
              '100%': { filter: 'brightness(1)' },
            },
            '&:hover': {
              background: 'linear-gradient(45deg, #00ff9d, #00a3ff)',
              boxShadow: '0 0 20px rgba(0, 255, 240, 0.7)',
              transform: 'translateY(-2px)',
            },
            fontSize: '1.1rem',
            padding: '8px 16px',
            borderRadius: '24px',
            letterSpacing: '0.5px',
            textShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
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
