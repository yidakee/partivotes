import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
} from '@mui/material';
import { ThemeContext } from '../../contexts/ThemeContext';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MusicPlayer from '../music/MusicPlayer';
import WalletConnect from '../wallet/WalletConnect';

const Header = () => {
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';

  return (
    <AppBar 
      position="static"
      sx={{
        transition: 'all 0.5s ease',
        ...(isFuturistic && {
          boxShadow: '0 0 15px #00fff0',
        }),
        borderTop: 'none', // Remove any top border
        position: 'relative', // Added to support absolute positioning
      }}
    >
      {/* Title and left side content */}
      <Container maxWidth="lg" sx={{ padding: 0 }}>
        <Toolbar disableGutters sx={{ 
          display: 'flex', 
          justifyContent: 'flex-start', // Changed from space-between
          width: '100%',
          padding: '0 16px',
          minHeight: '64px',
          position: 'relative',
        }}>
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
              ...(isFuturistic && {
                textShadow: '0 0 10px #00fff0',
                letterSpacing: '1px',
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
      </Container>
      
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
