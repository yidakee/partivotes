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

  // Simple container with normalized styles - no position:relative to avoid stacking issues
  const MainContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  `;

  // Content area with proper padding for fixed header/footer
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
      {/* Fixed position header */}
      <Header />
      
      {/* Theme Switcher - repositioned below navbar */}
      <Box
        sx={{
          position: 'fixed',
          top: '75px', // Position below the navbar
          right: '20px',
          zIndex: 1200,
        }}
      >
        <ThemeSwitcher />
      </Box>
      
      {/* Main content with proper padding */}
      <Content>
        <Container 
          component="main" 
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Mobile theme toggle - when using small screens */}
          {isMobile && (
            <Fab
              size="small"
              onClick={toggleTheme}
              sx={{
                position: 'fixed',
                bottom: 80,
                right: 20,
                zIndex: 100,
                background: isFuturistic ? 'linear-gradient(45deg, #0d47a1, #00bcd4)' : undefined,
                boxShadow: isFuturistic ? '0 0 10px #00fff0' : undefined,
              }}
            >
              <AutoAwesomeIcon color={isFuturistic ? 'inherit' : 'primary'} />
            </Fab>
          )}
          {children}
        </Container>
      </Content>
      
      {/* Fixed position footer */}
      <Footer />
    </MainContainer>
  );
};

export default Layout;
