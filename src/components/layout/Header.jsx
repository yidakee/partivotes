import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { ThemeContext } from '../../contexts/ThemeContext';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HomeIcon from '@mui/icons-material/Home';
import MusicPlayer from '../music/MusicPlayer';
import WalletConnect from '../wallet/WalletConnect';
import TutorialMenu from '../tutorial/TutorialMenu';

const Header = () => {
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';

  return (
    <AppBar 
      position="fixed"
      className="app-header"
      sx={{
        transition: 'all 0.5s ease',
        ...(isFuturistic && {
          boxShadow: '0 0 15px #00fff0',
        }),
        borderTop: 'none', // Remove any top border
        zIndex: 1100, // Higher z-index to stay above content
        width: '100%',
        top: 0,
        left: 0,
      }}
    >
      <Toolbar disableGutters sx={{ 
        display: 'flex', 
        justifyContent: 'flex-start',
        width: '100%',
        padding: 0,
        minHeight: '64px',
        position: 'relative',
      }}>
        {/* Tutorial Menu (Hamburger) - Flush against left edge */}
        <Box sx={{ 
          paddingLeft: '20px',
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <TutorialMenu />
        </Box>
        
        {/* Home Button - After hamburger menu */}
        <Button
          component={RouterLink}
          to="/"
          startIcon={<HomeIcon />}
          color="inherit"
          sx={{
            ml: 2,
            textTransform: 'none',
            transition: 'all 0.3s ease',
            ...(isFuturistic && {
              '&:hover': {
                color: '#00fff0',
                transform: 'scale(1.05)',
              },
            }),
          }}
        >
          Home
        </Button>
        
        {/* PartiVotes Title - After home button */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            padding: '6px 12px',
            marginLeft: '20px',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'scale(1.05)',
            },
            ...(isFuturistic && {
              textShadow: '0 0 10px #00fff0',
              letterSpacing: '1px',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 240, 0.1)',
                textShadow: '0 0 15px #00fff0',
                transform: 'scale(1.05)',
              },
            }),
          }}
        >
          {isFuturistic && (
            <AutoAwesomeIcon 
              sx={{ 
                mr: 1,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 0.5, transform: 'scale(1)' },
                  '50%': { opacity: 1, transform: 'scale(1.2)' },
                  '100%': { opacity: 0.5, transform: 'scale(1)' },
                },
              }} 
            />
          )}
          {isFuturistic ? 'PARTI-VOTES 3000' : 'PartiVotes'}
        </Typography>
        
        {/* Centered Music Player */}
        {isFuturistic && (
          <Box sx={{ 
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            zIndex: 10,
          }}>
            <MusicPlayer />
          </Box>
        )}
      </Toolbar>
      
      {/* Wallet Connect - absolute positioned at the far right edge */}
      <Box sx={{ 
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        display: 'flex', 
        alignItems: 'center',
        zIndex: 1100,
        paddingRight: '12px'
      }}>
        <WalletConnect />
      </Box>
    </AppBar>
  );
};

export default Header;
