// Force load the starfield script first, before any React code
import './forceStarfield';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './styles/theme';

// Import theme styles including our fixes
import './styles/fixes.css'; // Add our emergency fixes CSS
import './styles/z-final-critical-overrides.css'; // Critical overrides - MUST be last import

// Add basic styling to ensure content is visible
const styleElement = document.createElement('style');
styleElement.textContent = `
  html, body, #root {
    background: transparent !important;
  }
  
  /* Ensure content is always visible but don't create a new stacking context */
  #root {
    /* position: relative creates a stacking context that breaks fixed positioning */
    /* z-index values only create stacking contexts when position is not static */
    z-index: 10; 
  }

  /* Starfield behind content */
  #space-travel-effect {
    z-index: -1 !important;
  }
`;
document.head.appendChild(styleElement);

// Immediately apply theme class to body if futuristic
const currentTheme = localStorage.getItem('partivotes-theme');
if (currentTheme === 'futuristic') {
  document.body.classList.add('futuristic-theme');
  document.documentElement.classList.add('futuristic-theme');
  setTimeout(() => {
    if (window.toggleStarfield) window.toggleStarfield(true);
  }, 100);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <App />
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
