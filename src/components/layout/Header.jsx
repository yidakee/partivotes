import React, { useContext, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  ButtonGroup,
} from '@mui/material';
import { ThemeContext } from '../../contexts/ThemeContext';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HomeIcon from '@mui/icons-material/Home';
import WalletConnect from '../wallet/WalletConnect';
import TutorialMenu from '../tutorial/TutorialMenu';
import { POLL_STATUS } from '../../utils/constants';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const Header = () => {
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  const navigate = useNavigate();
  const location = useLocation();
  
  // Add debugging console logs
  useEffect(() => {
    console.log('Header: Current pathname:', location.pathname);
    console.log('Header: Current filter:', getCurrentFilter());
  }, [location]);

  // Handle filter button click
  const handleFilterClick = (status) => {
    // Always use lowercase URL paths for navigation
    // This ensures consistent navigation regardless of constant values
    switch(status) {
      case POLL_STATUS.ACTIVE:
        navigate(`/polls/active`);
        break;
      case POLL_STATUS.PENDING:
        navigate(`/polls/pending`);
        break;
      case POLL_STATUS.ENDED:
        navigate(`/polls/finished`);
        break;
      default:
        navigate(`/polls/active`);
    }
  };
  
  // Get current filter from URL
  const getCurrentFilter = () => {
    const path = location.pathname.toLowerCase();
    
    // Check for standard lowercase URL paths
    if (path.includes('/polls/active')) return POLL_STATUS.ACTIVE;
    if (path.includes('/polls/pending')) return POLL_STATUS.PENDING;
    if (path.includes('/polls/finished') || path.includes('/polls/ended')) return POLL_STATUS.ENDED;
    
    // Also check for uppercase URL paths as seen in production
    if (path.includes('/polls/' + POLL_STATUS.ACTIVE.toLowerCase())) return POLL_STATUS.ACTIVE;
    if (path.includes('/polls/' + POLL_STATUS.PENDING.toLowerCase())) return POLL_STATUS.PENDING;
    if (path.includes('/polls/' + POLL_STATUS.ENDED.toLowerCase())) return POLL_STATUS.ENDED;
    
    // Check URL parameters (backward compatibility)
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    
    if (status) {
      // Normalize status to match our constants (case insensitive matching)
      const normalizedStatus = status.toUpperCase();
      if (normalizedStatus === POLL_STATUS.ACTIVE) return POLL_STATUS.ACTIVE;
      if (normalizedStatus === POLL_STATUS.PENDING) return POLL_STATUS.PENDING;
      if (normalizedStatus === POLL_STATUS.ENDED) return POLL_STATUS.ENDED;
    }
    
    // Default to active
    return POLL_STATUS.ACTIVE;
  };
  
  const currentFilter = getCurrentFilter();

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
              animation: 'cyberpunk-color-cycle 8s infinite linear, title-pulsate 3s infinite ease-in-out',
              '@keyframes cyberpunk-color-cycle': {
                '0%': { color: '#00fff0', textShadow: '0 0 15px #00fff0' }, // Cyan
                '20%': { color: '#ff00ff', textShadow: '0 0 15px #ff00ff' }, // Magenta
                '40%': { color: '#ff0055', textShadow: '0 0 15px #ff0055' }, // Hot pink
                '60%': { color: '#00ffaa', textShadow: '0 0 15px #00ffaa' }, // Neon green
                '80%': { color: '#ff9500', textShadow: '0 0 15px #ff9500' }, // Neon orange
                '100%': { color: '#00fff0', textShadow: '0 0 15px #00fff0' }, // Back to cyan
              },
              '@keyframes title-pulsate': {
                '0%': { transform: 'scale(1)', letterSpacing: '1px' },
                '50%': { transform: 'scale(1.3)', letterSpacing: '3px' },
                '100%': { transform: 'scale(1)', letterSpacing: '1px' },
              },
              fontWeight: 'bold',
              letterSpacing: '1px',
              fontFamily: '"Orbitron", sans-serif',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 240, 0.1)',
                transform: 'scale(1.5)',
              },
            }),
          }}
        >
          {isFuturistic && (
            <AutoAwesomeIcon 
              sx={{ 
                mr: 1,
                animation: 'icon-pulse 2s infinite',
                '@keyframes icon-pulse': {
                  '0%': { opacity: 0.5, transform: 'scale(1) rotate(0deg)' },
                  '50%': { opacity: 1, transform: 'scale(1.5) rotate(180deg)' },
                  '100%': { opacity: 0.5, transform: 'scale(1) rotate(360deg)' },
                },
              }} 
            />
          )}
          {isFuturistic ? 'PARTI-VOTES 3000' : 'PartiVotes'}
        </Typography>
        
        {/* Poll Filter Buttons - Centered in the navbar */}
        <Box sx={{ 
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <ButtonGroup 
            variant={isFuturistic ? "outlined" : "contained"} 
            aria-label="poll filter button group"
            sx={{
              ...(isFuturistic && {
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '20px',
                padding: '3px',
                border: '1px solid rgba(0, 255, 240, 0.3)',
                boxShadow: '0 0 10px rgba(0, 255, 240, 0.2)',
              }),
            }}
          >
            <Button 
              onClick={() => handleFilterClick(POLL_STATUS.ACTIVE)}
              startIcon={<CheckCircleOutlineIcon />}
              sx={{
                ...(isFuturistic && {
                  color: currentFilter === POLL_STATUS.ACTIVE ? '#00fff0' : 'white',
                  backgroundColor: currentFilter === POLL_STATUS.ACTIVE ? 'rgba(0, 255, 240, 0.2)' : 'transparent',
                  borderColor: 'rgba(0, 255, 240, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 240, 0.3)',
                    borderColor: '#00fff0',
                  },
                }),
                ...(currentFilter === POLL_STATUS.ACTIVE && !isFuturistic && {
                  backgroundColor: 'primary.main',
                  color: 'white',
                }),
              }}
            >
              Active
            </Button>
            <Button 
              onClick={() => handleFilterClick(POLL_STATUS.PENDING)}
              startIcon={<HourglassEmptyIcon />}
              sx={{
                ...(isFuturistic && {
                  color: currentFilter === POLL_STATUS.PENDING ? '#00fff0' : 'white',
                  backgroundColor: currentFilter === POLL_STATUS.PENDING ? 'rgba(0, 255, 240, 0.2)' : 'transparent',
                  borderColor: 'rgba(0, 255, 240, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 240, 0.3)',
                    borderColor: '#00fff0',
                  },
                }),
                ...(currentFilter === POLL_STATUS.PENDING && !isFuturistic && {
                  backgroundColor: 'primary.main',
                  color: 'white',
                }),
              }}
            >
              Pending
            </Button>
            <Button 
              onClick={() => handleFilterClick(POLL_STATUS.ENDED)}
              startIcon={<AssignmentTurnedInIcon />}
              sx={{
                ...(isFuturistic && {
                  color: currentFilter === POLL_STATUS.ENDED ? '#00fff0' : 'white',
                  backgroundColor: currentFilter === POLL_STATUS.ENDED ? 'rgba(0, 255, 240, 0.2)' : 'transparent',
                  borderColor: 'rgba(0, 255, 240, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 240, 0.3)',
                    borderColor: '#00fff0',
                  },
                }),
                ...(currentFilter === POLL_STATUS.ENDED && !isFuturistic && {
                  backgroundColor: 'primary.main',
                  color: 'white',
                }),
              }}
            >
              Finished
            </Button>
          </ButtonGroup>
        </Box>
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
