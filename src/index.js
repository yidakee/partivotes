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

// Add basic styling to ensure content is visible
const styleElement = document.createElement('style');
styleElement.textContent = `
  html, body, #root {
    background: transparent !important;
  }
  
  /* Ensure content is always visible above starfield */
  #root {
    position: relative;
    z-index: 10 !important;
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
