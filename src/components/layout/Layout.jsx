import React, { useContext } from 'react';
import { Box, Container, Fab } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import ThemeSwitcher from '../common/ThemeSwitcher';
import ParticleBackground from '../common/ParticleBackground';
import RickRollEasterEgg from '../easter-egg/RickRollEasterEgg';
import { ThemeContext } from '../../contexts/ThemeContext';
import WalletConnect from '../wallet/WalletConnect';

const Layout = ({ children }) => {
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
        transition: 'all 0.5s ease',
      }}
    >
      <Header />
      <Box
        sx={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          transition: 'all 0.5s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px'
        }}
      >
        <WalletConnect />
        <ThemeSwitcher />
      </Box>
      {isFuturistic && (
        <>
          <div className="cyber-grid"></div>
          <ParticleBackground />
          <RickRollEasterEgg />
        </>
      )}
      <Container 
        component="main" 
        maxWidth="lg" 
        sx={{ 
          mt: 4, 
          mb: 4,
          flexGrow: 1,
          position: 'relative',
          zIndex: 1,
          '& .MuiPaper-root': {
            transition: 'all 0.5s ease',
          },
          '& .poll-card': {
            transition: 'all 0.5s ease',
            ...(isFuturistic && {
              animation: 'float 6s ease-in-out infinite',
              animationDelay: (theme) => theme.transitions.duration.complex,
            }),
          },
        }}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
