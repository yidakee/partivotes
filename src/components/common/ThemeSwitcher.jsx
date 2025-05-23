import React, { useContext } from 'react';
import { Box, Switch, Typography, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ThemeContext } from '../../contexts/ThemeContext';

// Futuristic switch styling
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
      '& .MuiSwitch-thumb': {
        backgroundColor: '#00a3ff', // Match Connect Wallet button color
        background: 'linear-gradient(90deg, #4c00ff, #00a3ff)', // Match Connect Wallet gradient
        boxShadow: '0 0 10px rgba(0, 163, 255, 0.7)',
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#00a3ff', // Match Connect Wallet button color in standard mode too
    background: 'linear-gradient(90deg, #4c00ff, #00a3ff)', // Match Connect Wallet gradient
    width: 32,
    height: 32,
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const ThemeSwitcher = () => {
  const { themeMode, toggleTheme } = useContext(ThemeContext);

  const handleToggle = () => {
    toggleTheme();
  };

  const isFuturistic = themeMode === 'futuristic';

  return (
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
      }}
    >
      {isFuturistic && (
        <AutoAwesomeIcon
          sx={{
            color: '#00fff0',
            filter: 'drop-shadow(0 0 2px #00fff0)',
            animation: 'pulse 2s infinite ease-in-out',
            marginRight: 1,
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
        {isFuturistic ? 'Moon Mode' : 'Standard Mode'}
      </Typography>
      <Tooltip title={isFuturistic ? "Return to reality" : "Activate futuristic mode!"}>
        <FuturisticSwitch checked={isFuturistic} onChange={handleToggle} />
      </Tooltip>
      {!isFuturistic && <RocketLaunchIcon color="primary" />}
    </Box>
  );
};

export default ThemeSwitcher;
