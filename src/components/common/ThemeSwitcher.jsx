import React, { useContext, useEffect, useState } from 'react';
import { Box, Switch, Typography, Tooltip, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ThemeContext } from '../../contexts/ThemeContext';

// Custom styled switch with futuristic design
const FuturisticSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#6200ea',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#1976d2',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
  },
}));

// Particle animation component for futuristic mode
const Particles = () => {
  return (
    <div className="particles-container">
      {Array.from({ length: 50 }).map((_, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: Math.random() * 5 + 1 + 'px',
            height: Math.random() * 5 + 1 + 'px',
            backgroundColor: `rgba(0, ${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, ${Math.random() * 0.5 + 0.1})`,
            borderRadius: '50%',
            top: Math.random() * 100 + 'vh',
            left: Math.random() * 100 + 'vw',
            boxShadow: '0 0 10px rgba(0, 255, 240, 0.7)',
            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            opacity: Math.random() * 0.5 + 0.1,
            transform: `scale(${Math.random() * 0.8 + 0.2})`,
          }}
        />
      ))}
    </div>
  );
};

// Cyber grid background for futuristic mode
const CyberGrid = () => {
  return <div className="cyber-grid"></div>;
};

const ThemeSwitcher = () => {
  const { themeMode, toggleTheme } = useContext(ThemeContext);
  const [switchingToDark, setSwitchingToDark] = useState(false);
  
  // Function to handle theme toggle with direct music control
  const handleToggle = () => {
    const isSwitchingToDark = themeMode === 'standard';
    
    // Set flag for switching to dark for the useEffect to catch
    setSwitchingToDark(isSwitchingToDark);
    
    // Toggle the theme first
    toggleTheme();
  };
  
  // Use effect to handle music playback after theme toggle
  useEffect(() => {
    // Only trigger playback when we detect a switch to dark
    if (switchingToDark && themeMode === 'futuristic') {
      console.log('Switched to cyberpunk theme, attempting to play music');
      
      // Try multiple methods to start the music
      
      // Method 1: Direct DOM access to music player audio
      setTimeout(() => {
        const musicPlayerAudio = document.getElementById('music-player-audio');
        if (musicPlayerAudio) {
          console.log('Found music player audio, trying to play');
          const playPromise = musicPlayerAudio.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Direct audio play failed:", error);
            });
          }
        } else {
          console.log('Music player audio element not found, trying general audio');
        }
        
        // Method 2: Find all audio elements and try to play them
        const audioElements = document.querySelectorAll('audio');
        console.log(`Found ${audioElements.length} audio elements`);
        
        audioElements.forEach(audio => {
          if (audio) {
            console.log('Attempting to play audio:', audio);
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error("Audio play failed:", error);
              });
            }
          }
        });
        
        // Method 3: Create and dispatch a custom event for the MusicPlayer to catch
        console.log('Dispatching playMusicEvent');
        const playMusicEvent = new CustomEvent('playMusic', {
          detail: { triggered: true, theme: 'futuristic' }
        });
        document.dispatchEvent(playMusicEvent);
        
        // Directly toggle starfield
        if (window.toggleStarfield) {
          console.log('Directly toggling starfield ON via global function');
          window.toggleStarfield(true);
        }
        
        // Reset the flag
        setSwitchingToDark(false);
      }, 500); // Increased timeout for better reliability
    } else if (themeMode === 'standard' && window.toggleStarfield) {
      // Turn off starfield when switching to standard theme
      window.toggleStarfield(false);
    }
  }, [themeMode, switchingToDark]);
  
  const isFuturistic = themeMode === 'futuristic';

  return (
    <>
      {isFuturistic && (
        <>
          <Particles />
          <CyberGrid />
        </>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          padding: '8px 16px',
          borderRadius: 2,
          backgroundColor: isFuturistic ? 'rgba(16, 20, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: isFuturistic ? '0 0 10px #00fff0' : '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.5s ease',
          border: isFuturistic ? '1px solid rgba(0, 255, 240, 0.3)' : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isFuturistic && (
          <AutoAwesomeIcon
            sx={{
              color: '#00fff0',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 0.5, transform: 'scale(1)' },
                '50%': { opacity: 1, transform: 'scale(1.2)' },
                '100%': { opacity: 0.5, transform: 'scale(1)' },
              },
            }}
          />
        )}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            color: isFuturistic ? '#00fff0' : 'inherit',
            textShadow: isFuturistic ? '0 0 5px #00fff0' : 'none',
          }}
        >
          {isFuturistic ? 'FUTURE MODE' : 'Standard Mode'}
        </Typography>
        <Tooltip title={isFuturistic ? "Return to reality" : "Activate futuristic mode!"}>
          <FuturisticSwitch checked={isFuturistic} onChange={handleToggle} />
        </Tooltip>
        {!isFuturistic && <RocketLaunchIcon color="primary" />}
      </Box>
    </>
  );
};

export default ThemeSwitcher;
