import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import main CSS file which handles all imports in correct order
import './styles/main.css';

// Create React root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
