import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

// Ultra-simplified music player with native HTML5 audio controls
const MusicPlayer = () => {
  const [tracks] = useState([
    { id: 1, title: 'Bohemian Rap', file: '/music/bohemian_rap.mp3' },
    { id: 2, title: 'What Is Love', file: '/music/what_is_love.mp3' },
    { id: 3, title: 'Africa - Toto', file: '/music/africa_toto.mp3' },
    { id: 4, title: 'Take On Me', file: '/music/take_on_me.mp3' },
    { id: 5, title: 'Billie Jean', file: '/music/billie.mp3' }
  ]);
  
  const [currentTrack, setCurrentTrack] = useState(0);
  
  // Random track selection
  const playRandomTrack = () => {
    if (tracks.length <= 1) return;
    
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } while (nextIndex === currentTrack && tracks.length > 1);
    
    setCurrentTrack(nextIndex);
  };
  
  return (
    <Box
      sx={{
        padding: '12px',
        backgroundColor: 'rgba(10, 10, 30, 0.85)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)',
        color: '#fff',
        boxShadow: '0 0 15px rgba(0, 200, 255, 0.4)',
        border: '1px solid rgba(0, 255, 240, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <Typography variant="body1" sx={{ 
        color: '#00fff0', 
        fontWeight: 'bold',
        textShadow: '0 0 5px rgba(0, 255, 240, 0.5)',
        textAlign: 'center'
      }}>
        {tracks[currentTrack]?.title || 'No track selected'}
      </Typography>
      
      <audio 
        src={tracks[currentTrack]?.file} 
        controls 
        style={{ width: '100%' }}
      />
      
      <Button
        variant="contained"
        onClick={playRandomTrack}
        sx={{ 
          backgroundColor: 'rgba(0, 255, 240, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 240, 0.5)',
          }
        }}
      >
        Random Track
      </Button>
    </Box>
  );
};

export default MusicPlayer;
