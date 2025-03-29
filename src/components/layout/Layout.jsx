import React, { useContext } from 'react';
import { Box, Container, Fab } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import ThemeSwitcher from '../common/ThemeSwitcher';
import RickRollEasterEgg from '../easter-egg/RickRollEasterEgg';
import { ThemeContext } from '../../contexts/ThemeContext';
import styled from 'styled-components';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Import StarfieldBackground instead of ParticleBackground
import StarfieldBackground from '../background/StarfieldBackground';

const Layout = ({ children }) => {
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();

  // Use custom styles with styled-components
  const MainContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
  `;

  const Content = styled.main`
    flex: 1;
    padding: 20px;
    position: relative;
    z-index: 1;
    background: transparent;
  `;

  return (
    <MainContainer>
      <Header />
      <Box
        sx={{
          position: 'fixed',
          top: '90px', 
          right: '0px',
          zIndex: 1000,
          transition: 'all 0.5s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px'
        }}
      >
        <ThemeSwitcher />
      </Box>
      {isFuturistic && (
        <>
          {/* Removed cyber-grid div that was blocking the starfield */}
          <RickRollEasterEgg />
        </>
      )}
      <Content>
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
      </Content>
      <Footer />
    </MainContainer>
  );
};

export default Layout;
