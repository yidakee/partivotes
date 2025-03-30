import React, { useContext } from 'react';
import { Box, Container, Fab, Typography } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import ThemeSwitcher from '../common/ThemeSwitcher';
import RickRollEasterEgg from '../easter-egg/RickRollEasterEgg';
import { ThemeContext } from '../../contexts/ThemeContext';
import styled from 'styled-components';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Import StarfieldBackground instead of ParticleBackground
import StarfieldBackground from '../background/StarfieldBackground';

const Layout = ({ children }) => {
  const { themeMode, toggleTheme } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();

  // Use custom styles with styled-components
  const MainContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    // Remove properties that create a stacking context
    // position: relative; 
    // z-index: 1;
  `;

  const Content = styled.main`
    flex: 1;
    padding: 20px;
    padding-top: 84px; /* Add extra padding at the top for the fixed header (64px header height + 20px) */
    padding-bottom: 70px; /* Add extra padding at the bottom for the fixed footer */
    position: relative;
    z-index: 1;
    background: transparent;
  `;

  return (
    <MainContainer>
      <Header />
      
      {/* Theme Switcher with proper fixed position wrapper */}
      <Box
        sx={{
          position: 'fixed',
          top: '90px', 
          right: 0, 
          zIndex: 9999, 
          // Removed background and display for simplicity
        }}
      >
        <ThemeSwitcher />
      </Box>
      
      {/* Get Free $MPC Button - Only shown in dark mode, fixed at bottom right */}
      {isFuturistic && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1500,
          }}
        >
          <RickRollEasterEgg />
        </Box>
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
