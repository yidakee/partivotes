// Import React and other dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './styles/theme';

// Import theme styles including our fixes - ORDER MATTERS
import './styles/standard-theme.css'; // Light theme first
import './styles/futuristic-theme.css'; // Dark theme second
import './styles/fixes.css'; // Fixes third
import './styles/z-final-critical-overrides.css'; // FINAL overrides last

// Force load the starfield script first, before any React code
import './forceStarfield';

// Add comprehensive polyfills for Partisia SDK
// These need to be defined before any SDK code runs
if (typeof window !== 'undefined') {
  // Buffer polyfill
  window.Buffer = window.Buffer || require('buffer').Buffer;
  
  // Process polyfill
  window.process = window.process || { 
    env: {}, 
    version: '',
    nextTick: function(cb) { setTimeout(cb, 0); }
  };
  
  // Handle crypto module (use native Web Crypto API when available)
  if (!window.crypto) {
    console.warn('Web Crypto API not available, using polyfill');
    try {
      window.crypto = require('crypto-browserify');
    } catch (e) {
      console.error('Failed to load crypto polyfill:', e);
    }
  }
}

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
    min-height: 100vh;
    display: flex;
    flex-direction: column;
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
