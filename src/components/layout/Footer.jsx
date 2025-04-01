import React, { useContext } from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { ThemeContext } from '../../contexts/ThemeContext';

const Footer = () => {
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      className="app-footer" 
      sx={{
        py: 3,
        px: 2,
        position: 'fixed !important', 
        bottom: '0 !important',
        left: '0 !important',
        width: '100% !important',
        zIndex: '1000 !important', 
        backgroundColor: isFuturistic 
          ? 'rgba(0, 0, 20, 0.8) !important' 
          : 'rgba(255, 255, 255, 0.9) !important',
        backdropFilter: 'blur(5px) !important', 
        borderTop: isFuturistic
          ? '1px solid rgba(0, 255, 240, 0.3) !important'
          : '1px solid rgba(0, 0, 0, 0.1) !important',
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="body2" 
          color={isFuturistic ? 'primary' : 'text.secondary'} 
          align="center"
          sx={{ textShadow: isFuturistic ? '0 0 5px #00fff0' : 'none' }}
        >
          {'© '}
          <Link 
            color="inherit" 
            href="https://partivotes.xyz/"
            sx={{ 
              textDecoration: 'none',
              fontWeight: 'bold',
              color: isFuturistic ? '#00fff0' : 'primary.main',
              '&:hover': {
                textDecoration: 'underline',
                textShadow: isFuturistic ? '0 0 8px #00fff0' : 'none',
              }
            }}
          >
            PartiVotes
          </Link>{' '}
          {currentYear}
          {' - Decentralized Voting Platform'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
