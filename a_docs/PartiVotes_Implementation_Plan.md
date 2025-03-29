# PartiVotes - Implementation Plan

## Table of Contents
1. [Overview](#overview)
2. [Implementation Phases](#implementation-phases)
3. [Phase 1: Project Setup](#phase-1-project-setup)
4. [Phase 2: Frontend Development](#phase-2-frontend-development)
5. [Phase 3: Wallet Connection](#phase-3-wallet-connection)
6. [Phase 4: UI Components](#phase-4-ui-components)
7. [Phase 5: VPS Configuration](#phase-5-vps-configuration)
8. [Phase 6: Deployment](#phase-6-deployment)
9. [Phase 7: Smart Contract Development](#phase-7-smart-contract-development)
10. [Phase 8: Integration](#phase-8-integration)
11. [Testing Procedures](#testing-procedures)
12. [Troubleshooting Guide](#troubleshooting-guide)

## Overview

This implementation plan provides a step-by-step guide for developing the PartiVotes platform, a private voting application using Partisia Blockchain. As requested, we'll prioritize frontend development with wallet connection first, leaving the smart contract implementation for later stages.

The plan is designed to be accessible for non-coders, with detailed instructions for each step. We'll focus on creating a functional UI with wallet connection before implementing the blockchain interactions.

## Implementation Phases

### Phase 1: Project Setup
### Phase 2: Frontend Development
### Phase 3: Wallet Connection
### Phase 4: UI Components
### Phase 5: VPS Configuration
### Phase 6: Deployment
### Phase 7: Smart Contract Development
### Phase 8: Integration

## Phase 1: Project Setup

### 1.1 Create Project Directory Structure

```bash
# Create project directory
mkdir -p PartiVotes/src/components
mkdir -p PartiVotes/src/contexts
mkdir -p PartiVotes/src/services
mkdir -p PartiVotes/src/utils
mkdir -p PartiVotes/src/styles
mkdir -p PartiVotes/public
cd PartiVotes
```

### 1.2 Initialize React Project

```bash
# Initialize a new React project
npx create-react-app .
```

### 1.3 Install Required Dependencies

```bash
# Install Material-UI and other dependencies
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @mui/x-date-pickers
npm install date-fns
npm install react-router-dom
npm install @partisiablockchain/wallet-sdk
```

### 1.4 Create Basic Project Files

#### package.json (update)
```json
{
  "name": "partivotes",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.11.16",
    "@mui/material": "^5.13.0",
    "@mui/x-date-pickers": "^6.5.0",
    "@partisiablockchain/wallet-sdk": "^0.1.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "date-fns": "^2.30.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.11.1",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

#### public/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="PartiVotes - A private voting platform on Partisia Blockchain"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <title>PartiVotes</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

#### public/manifest.json
```json
{
  "short_name": "PartiVotes",
  "name": "PartiVotes - Private Voting Platform",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

### 1.5 Create Basic Utility Files

#### src/utils/constants.js
```javascript
// Contract address will be updated after smart contract deployment
export const CONTRACT_ADDRESS = "placeholder_contract_address";

// Network configuration
export const NETWORK = "mainnet"; // or "testnet" for testing

// Application constants
export const APP_NAME = "PartiVotes";
export const APP_VERSION = "0.1.0";
```

#### src/utils/helpers.js
```javascript
// Format date for display
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Truncate address for display
export const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Format MPC amount
export const formatMPC = (amount) => {
  return `${amount} MPC`;
};
```

## Phase 2: Frontend Development

### 2.1 Create Theme Configuration

#### src/styles/theme.js
```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
```

### 2.2 Create Basic Layout Components

#### src/components/Header.js
```jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WalletConnect from './WalletConnect';

function Header() {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              flexGrow: 1,
              fontWeight: 'bold',
            }}
          >
            PartiVotes
          </Typography>
          <Box>
            <WalletConnect />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
```

#### src/components/Footer.js
```jsx
import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}{' '}
          <Link color="inherit" href="#">
            PartiVotes
          </Link>{' '}
          - A private voting platform on Partisia Blockchain
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
```

### 2.3 Create Main App Component

#### src/App.js
```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import theme from './styles/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
// These components will be created later
// import PollCreate from './components/PollCreate';
// import PollDetail from './components/PollDetail';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Router>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Header />
            <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* These routes will be added later */}
                {/* <Route path="/create" element={<PollCreate />} /> */}
                {/* <Route path="/poll/:id" element={<PollDetail />} /> */}
              </Routes>
            </Container>
            <Footer />
          </Box>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
```

#### src/index.js
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
```

#### src/components/Home.js
```jsx
import React from 'react';
import { Typography, Button, Paper, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to PartiVotes
        </Typography>
        <Typography variant="body1" paragraph>
          A private voting platform powered by Partisia Blockchain.
        </Typography>
        <Typography variant="body1" paragraph>
          Create polls and vote with privacy protection using Multi-Party Computation (MPC) technology.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/create"
            sx={{ mx: 1 }}
          >
            Create Poll
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={RouterLink}
            to="/"
            sx={{ mx: 1 }}
          >
            View Polls
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Home;
```

### 2.4 Create Placeholder WalletConnect Component

#### src/components/WalletConnect.js (Placeholder)
```jsx
import React from 'react';
import { Button } from '@mui/material';

function WalletConnect() {
  // This is a placeholder that will be replaced with actual wallet connection logic
  return (
    <Button variant="contained" color="secondary">
      Connect Wallet
    </Button>
  );
}

export default WalletConnect;
```

### 2.5 Test Basic Frontend

```bash
# Start the development server
npm start
```

Visit http://localhost:3000 to see the basic application structure.

## Phase 3: Wallet Connection

### 3.1 Create Wallet Context

#### src/contexts/WalletContext.js
```jsx
import React, { createContext, useState, useEffect } from 'react';

// Create context
export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // This is a placeholder for actual wallet connection
  // We'll implement the real connection in the next steps
  const connect = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate wallet connection
      setTimeout(() => {
        setConnected(true);
        setAddress('0x1234567890abcdef1234567890abcdef12345678');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to connect wallet');
      setLoading(false);
    }
  };

  const disconnect = () => {
    setConnected(false);
    setAddress('');
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        loading,
        error,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
```

### 3.2 Update App Component to Use Wallet Context

#### src/App.js (Updated)
```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { WalletProvider } from './contexts/WalletContext';
import theme from './styles/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
// These components will be created later
// import PollCreate from './components/PollCreate';
// import PollDetail from './components/PollDetail';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <WalletProvider>
          <Router>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              <Header />
              <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  {/* These routes will be added later */}
                  {/* <Route path="/create" element={<PollCreate />} /> */}
                  {/* <Route path="/poll/:id" element={<PollDetail />} /> */}
                </Routes>
              </Container>
              <Footer />
            </Box>
          </Router>
        </WalletProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
```

### 3.3 Update WalletConnect Component

#### src/components/WalletConnect.js (Updated)
```jsx
import React, { useContext } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import { WalletContext } from '../contexts/WalletContext';
import { truncateAddress } from '../utils/helpers';

function WalletConnect() {
  const { connected, address, loading, connect, disconnect } = useContext(WalletContext);

  return (
    <Box>
      {connected ? (
        <Box display="flex" alignItems="center">
          <Typography variant="body2" sx={{ mr: 2, color: 'white' }}>
            {truncateAddress(address)}
          </Typography>
          <Button variant="outlined" color="inherit" onClick={disconnect}>
            Disconnect
          </Button>
        </Box>
      ) : (
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={connect}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </Box>
  );
}

export default WalletConnect;
```

### 3.4 Create Wallet Service

#### src/services/walletService.js
```javascript
// This is a placeholder for the actual wallet service
// We'll implement the real service in the integration phase

// Simulate wallet connection
export const connectWallet = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('0x1234567890abcdef1234567890abcdef12345678');
    }, 1000);
  });
};

// Simulate wallet disconnection
export const disconnectWallet = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

// Simulate getting wallet address
export const getWalletAddress = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a 50% chance of being connected
      if (Math.random() > 0.5) {
        resolve('0x1234567890abcdef1234567890abcdef12345678');
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Simulate transaction signing
export const signTransaction = async (transaction) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...transaction,
        signature: 'simulated_signature',
      });
    }, 1000);
  });
};

// Simulate transaction sending
export const sendTransaction = async (signedTransaction) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('0xabcdef1234567890abcdef1234567890abcdef1234567890');
    }, 1500);
  });
};
```

### 3.5 Update Wallet Context to Use Wallet Service

#### src/contexts/WalletContext.js (Updated)
```jsx
import React, { createContext, useState, useEffect } from 'react';
import { 
  connectWallet, 
  disconnectWallet, 
  getWalletAddress 
} from '../services/walletService';

// Create context
export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const walletAddress = await getWalletAddress();
        if (walletAddress) {
          setConnected(true);
          setAddress(walletAddress);
        }
      } catch (err) {
        console.error('Failed to check wallet connection:', err);
      } finally {
        setLoading(false);
      }
    };

    checkWalletConnection();
  }, []);

  const connect = async () => {
    setLoading(true);
    setError('');
    
    try {
      const walletAddress = await connectWallet();
      setConnected(true);
      setAddress(walletAddress);
    } catch (err) {
      setError('Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    setLoading(true);
    
    try {
      await disconnectWallet();
      setConnected(false);
      setAddress('');
    } catch (err) {
      console.error('Wallet disconnection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        loading,
        error,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
```

### 3.6 Test Wallet Connection UI

```bash
# Start the development server (if not already running)
npm start
```

Visit http://localhost:3000 and test the wallet connection UI.

## Phase 4: UI Components

### 4.1 Create Poll List Component

#### src/components/PollList.js
```jsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Button,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import { formatDate } from '../utils/helpers';

function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching polls from API
    const fetchPolls = async () => {
      // This is a placeholder for actual API call
      setTimeout(() => {
        const mockPolls = [
          {
            id: '1',
            title: 'Favorite Programming Language',
            description: 'What is your favorite programming language for blockchain development?',
            options: ['Rust', 'Solidity', 'JavaScript', 'Python'],
            created_at: Date.now() - 7 * 24 * 60 * 60 * 1000,
            expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000,
            active: true,
            creator: '0x1234567890abcdef1234567890abcdef12345678',
          },
          {
            id: '2',
            title: 'Best Blockchain Platform',
            description: 'Which blockchain platform do you prefer for dApp development?',
            options: ['Ethereum', 'Partisia', 'Solana', 'Polkadot'],
            created_at: Date.now() - 14 * 24 * 60 * 60 * 1000,
            expires_at: Date.now() + 3 * 24 * 60 * 60 * 1000,
            active: true,
            creator: '0x1234567890abcdef1234567890abcdef12345678',
          },
          {
            id: '3',
            title: 'Web3 Future',
            description: 'What aspect of Web3 will have the biggest impact in the next 5 years?',
            options: ['DeFi', 'NFTs', 'DAOs', 'Privacy Tech'],
            created_at: Date.now() - 30 * 24 * 60 * 60 * 1000,
            expires_at: Date.now() - 1 * 24 * 60 * 60 * 1000,
            active: false,
            creator: '0x1234567890abcdef1234567890abcdef12345678',
          },
        ];
        
        setPolls(mockPolls);
        setLoading(false);
      }, 1000);
    };

    fetchPolls();
  }, []);

  const isPollActive = (poll) => {
    return poll.active && new Date(poll.expires_at) > new Date();
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Available Polls
        </Typography>
        
        <Button
          component={RouterLink}
          to="/create"
          variant="contained"
          color="primary"
        >
          Create Poll
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : polls.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No polls available. Create the first one!</Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {polls.map((poll, index) => (
              <React.Fragment key={poll.id}>
                {index > 0 && <Divider />}
                <ListItem
                  button
                  component={RouterLink}
                  to={`/poll/${poll.id}`}
                  alignItems="flex-start"
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">{poll.title}</Typography>
                        {isPollActive(poll) ? (
                          <Chip label="Active" color="success" size="small" />
                        ) : (
                          <Chip label="Ended" color="default" size="small" />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {poll.description.length > 100
                            ? `${poll.description.substring(0, 100)}...`
                            : poll.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Expires: {formatDate(poll.expires_at)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default PollList;
```

### 4.2 Create Poll Create Component

#### src/components/PollCreate.js
```jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { WalletContext } from '../contexts/WalletContext';

function PollCreate() {
  const navigate = useNavigate();
  const { connected } = useContext(WalletContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiresAt, setExpiresAt] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 1 week from now
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!connected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!title || !description || options.some(opt => !opt) || options.length < 2) {
      setError('Please fill in all fields and provide at least 2 options');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate creating a poll
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to home page after successful creation
      navigate('/');
    } catch (err) {
      setError('Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Poll
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Poll Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Poll Options
          </Typography>
          
          {options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 1 }}>
              <TextField
                label={`Option ${index + 1}`}
                fullWidth
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              {options.length > 2 && (
                <IconButton 
                  color="error" 
                  onClick={() => handleRemoveOption(index)}
                  sx={{ ml: 1 }}
                >
                  <RemoveIcon />
                </IconButton>
              )}
            </Box>
          ))}
          
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddOption}
            sx={{ mt: 1 }}
          >
            Add Option
          </Button>
          
          <Box sx={{ mt: 3 }}>
            <DateTimePicker
              label="Expires At"
              value={expiresAt}
              onChange={setExpiresAt}
              minDateTime={new Date()}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Creating a poll requires a payment of 100 MPC tokens.
            </Typography>
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading || !connected}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
          >
            {loading ? 'Creating...' : 'Create Poll (100 MPC)'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default PollCreate;
```

### 4.3 Create Poll Detail Component

#### src/components/PollDetail.js
```jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { WalletContext } from '../contexts/WalletContext';
import { formatDate } from '../utils/helpers';
import PollResults from './PollResults';

function PollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { connected, address } = useContext(WalletContext);
  
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const [showVoteDialog, setShowVoteDialog] = useState(false);
  
  useEffect(() => {
    // Simulate fetching poll data
    const fetchPoll = async () => {
      setTimeout(() => {
        // Mock poll data
        const mockPoll = {
          id: id,
          title: 'Favorite Programming Language',
          description: 'What is your favorite programming language for blockchain development?',
          options: ['Rust', 'Solidity', 'JavaScript', 'Python'],
          created_at: Date.now() - 7 * 24 * 60 * 60 * 1000,
          expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000,
          active: true,
          creator: '0x1234567890abcdef1234567890abcdef12345678',
          public_vote_counts: {0: 5, 1: 3, 2: 8, 3: 2},
          private_vote_counts: {0: 2, 1: 1, 2: 3, 3: 1},
          votes: {},
        };
        
        // Simulate whether user has voted
        if (connected) {
          mockPoll.votes[address] = Math.random() > 0.5 ? 2 : null;
          setHasVoted(!!mockPoll.votes[address]);
        }
        
        setPoll(mockPoll);
        setLoading(false);
      }, 1000);
    };

    fetchPoll();
  }, [id, connected, address]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleVoteWithSignature = async () => {
    if (!connected || !selectedOption) return;
    
    setVoting(true);
    setError('');
    
    try {
      // Simulate voting
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHasVoted(true);
      
      // Update poll data to reflect vote
      setPoll(prev => {
        const optionIndex = parseInt(selectedOption);
        const updatedPoll = {...prev};
        updatedPoll.public_vote_counts[optionIndex] = (updatedPoll.public_vote_counts[optionIndex] || 0) + 1;
        updatedPoll.votes[address] = optionIndex;
        return updatedPoll;
      });
    } catch (err) {
      setError('Failed to vote');
    } finally {
      setVoting(false);
      setShowVoteDialog(false);
    }
  };

  const handleVoteWithMPC = async () => {
    if (!connected || !selectedOption) return;
    
    setVoting(true);
    setError('');
    
    try {
      // Simulate voting
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHasVoted(true);
      
      // Update poll data to reflect vote
      setPoll(prev => {
        const optionIndex = parseInt(selectedOption);
        const updatedPoll = {...prev};
        updatedPoll.private_vote_counts[optionIndex] = (updatedPoll.private_vote_counts[optionIndex] || 0) + 1;
        updatedPoll.votes[address] = null; // Private vote doesn't show the choice
        return updatedPoll;
      });
    } catch (err) {
      setError('Failed to vote');
    } finally {
      setVoting(false);
      setShowVoteDialog(false);
    }
  };

  const handleEndPoll = async () => {
    if (!connected) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate ending poll
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update poll data
      setPoll(prev => ({
        ...prev,
        active: false,
      }));
    } catch (err) {
      setError('Failed to end poll');
    } finally {
      setLoading(false);
    }
  };

  const isPollActive = () => {
    return poll.active && new Date(poll.expires_at) > new Date();
  };

  const isCreator = () => {
    return connected && poll.creator === address;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!poll) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Alert severity="error">Poll not found</Alert>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Polls
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {poll.title}
          </Typography>
          
          {isPollActive() ? (
            <Chip label="Active" color="success" />
          ) : (
            <Chip label="Ended" color="default" />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Expires: {formatDate(poll.expires_at)}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          {poll.description}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {hasVoted || !isPollActive() ? (
          <PollResults poll={poll} />
        ) : (
          <Box sx={{ mt: 3 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select an option:</FormLabel>
              <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                {poll.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index.toString()}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={!connected || !selectedOption || voting}
                onClick={() => setShowVoteDialog(true)}
              >
                {voting ? 'Voting...' : 'Vote'}
              </Button>
            </Box>
          </Box>
        )}
        
        {isCreator() && isPollActive() && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Creator Actions
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleEndPoll}
              disabled={loading}
            >
              End Poll Early
            </Button>
          </Box>
        )}
      </Paper>
      
      <Dialog open={showVoteDialog} onClose={() => setShowVoteDialog(false)}>
        <DialogTitle>Choose Voting Method</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            You can vote using one of the following methods:
          </Typography>
          <Typography variant="body2" paragraph>
            1. <strong>Public Vote (Free)</strong>: Your vote will be visible to everyone, but doesn't cost any MPC tokens.
          </Typography>
          <Typography variant="body2" paragraph>
            2. <strong>Private Vote (100 MPC)</strong>: Your vote will be kept private, but costs 100 MPC tokens.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVoteDialog(false)}>Cancel</Button>
          <Button onClick={handleVoteWithSignature} color="primary">
            Public Vote (Free)
          </Button>
          <Button onClick={handleVoteWithMPC} color="primary" variant="contained">
            Private Vote (100 MPC)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PollDetail;
```

### 4.4 Create Poll Results Component

#### src/components/PollResults.js
```jsx
import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
} from '@mui/material';

function PollResults({ poll }) {
  const calculateTotalVotes = () => {
    let publicTotal = 0;
    let privateTotal = 0;
    
    // Count public votes
    Object.values(poll.public_vote_counts || {}).forEach(count => {
      publicTotal += count;
    });
    
    // Count private votes
    Object.values(poll.private_vote_counts || {}).forEach(count => {
      privateTotal += count;
    });
    
    return { publicTotal, privateTotal, total: publicTotal + privateTotal };
  };
  
  const { publicTotal, privateTotal, total } = calculateTotalVotes();
  
  const getPercentage = (count) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Results
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Total Votes: {total} ({publicTotal} public, {privateTotal} private)
      </Typography>
      
      {poll.options.map((option, index) => {
        const publicCount = poll.public_vote_counts[index] || 0;
        const privateCount = poll.private_vote_counts[index] || 0;
        const totalCount = publicCount + privateCount;
        const percentage = getPercentage(totalCount);
        
        return (
          <Box key={index} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">{option}</Typography>
              <Typography variant="body2">
                {totalCount} votes ({percentage}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{ height: 10, borderRadius: 5, mt: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Public: {publicCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Private: {privateCount}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default PollResults;
```

### 4.5 Update App.js to Include New Routes

#### src/App.js (Updated with Routes)
```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { WalletProvider } from './contexts/WalletContext';
import theme from './styles/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import PollList from './components/PollList';
import PollCreate from './components/PollCreate';
import PollDetail from './components/PollDetail';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <WalletProvider>
          <Router>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              <Header />
              <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
                <Routes>
                  <Route path="/" element={<PollList />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/create" element={<PollCreate />} />
                  <Route path="/poll/:id" element={<PollDetail />} />
                </Routes>
              </Container>
              <Footer />
            </Box>
          </Router>
        </WalletProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
```

### 4.6 Test Complete UI

```bash
# Start the development server (if not already running)
npm start
```

Visit http://localhost:3000 and test the complete UI flow:
1. Connect wallet
2. View polls
3. Create a poll
4. View poll details
5. Vote on a poll

## Phase 5: VPS Configuration

### 5.1 Initial Server Setup

#### Connect to your Hetzner VPS
```bash
ssh root@your_server_ip
```

#### Create a non-root user
```bash
# Create a new user
adduser partivotes

# Add user to sudo group
usermod -aG sudo partivotes

# Switch to the new user
su - partivotes
```

#### Update the system
```bash
sudo apt update && sudo apt upgrade -y
```

### 5.2 Install Required Software

#### Install Node.js and npm
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node -v
npm -v
```

#### Install Git
```bash
sudo apt install git -y
```

#### Install build essentials
```bash
sudo apt install build-essential -y
```

#### Install Nginx
```bash
sudo apt install nginx -y
```

#### Install PM2 for process management
```bash
sudo npm install -g pm2
```

### 5.3 Configure Firewall

```bash
# Install UFW if not already installed
sudo apt install ufw -y

# Allow SSH connections
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow http
sudo ufw allow https

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 5.4 Set Up Project Directory

```bash
# Create project directory
mkdir -p ~/partivotes
cd ~/partivotes

# Initialize Git repository
git init
```

## Phase 6: Deployment

### 6.1 Prepare for Deployment

#### Create a production build
```bash
# On your local development machine
npm run build
```

### 6.2 Deploy to VPS

#### Option 1: Using Git

```bash
# On your VPS
cd ~/partivotes

# Add remote repository
git remote add origin https://github.com/yourusername/partivotes.git

# Pull the latest code
git pull origin main

# Install dependencies
npm install

# Build the application
npm run build
```

#### Option 2: Using SCP

```bash
# On your local development machine
# Compress the build folder
tar -czvf build.tar.gz build

# Copy to VPS
scp build.tar.gz partivotes@your_server_ip:~/partivotes/

# On your VPS
cd ~/partivotes
tar -xzvf build.tar.gz
rm build.tar.gz
```

### 6.3 Configure Nginx

```bash
# Create Nginx configuration file
sudo nano /etc/nginx/sites-available/partivotes
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your_server_ip;

    root /home/partivotes/partivotes/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/partivotes /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 6.4 Set Up PM2 (if using a Node.js server)

```bash
# Navigate to project directory
cd ~/partivotes

# Start the application with PM2
pm2 start npm --name "partivotes" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

### 6.5 Test Deployment

Visit your server's IP address in a web browser to verify that the application is running correctly.

## Phase 7: Smart Contract Development

### 7.1 Set Up Rust Development Environment

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"

# Add WebAssembly target
rustup target add wasm32-unknown-unknown

# Install build dependencies
sudo apt-get install -y build-essential libssl-dev pkg-config

# Install Partisia contract compiler
cargo install cargo-partisia-contract
```

### 7.2 Create Smart Contract Project

```bash
# Create a new directory for the contract
mkdir -p ~/partivotes-contract
cd ~/partivotes-contract

# Initialize a new Rust project
cargo init --lib
```

### 7.3 Configure Cargo.toml

```toml
[package]
name = "partivotes-contract"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ['rlib', 'cdylib']

[dependencies]
pbc_contract_common = { git = "https://gitlab.com/partisiablockchain/language/contract-sdk.git" }
pbc_traits = { git = "https://gitlab.com/partisiablockchain/language/contract-sdk.git" }
pbc_lib = { git = "https://gitlab.com/partisiablockchain/language/contract-sdk.git" }
read_write_rpc_derive = { git = "https://gitlab.com/partisiablockchain/language/contract-sdk.git" }
read_write_state_derive = { git = "https://gitlab.com/partisiablockchain/language/contract-sdk.git" }
create_type_spec_derive = { git = "https://gitlab.com/partisiablockchain/language/contract-sdk.git" }
pbc_contract_codegen = { git = "https://gitlab.com/partisiablockchain/language/contract-sdk.git" }
pbc_zk = { git = "https://gitlab.com/partisiablockchain/language/contract-sdk.git" }

[features]
abi = ["pbc_contract_common/abi", "pbc_contract_codegen/abi", "pbc_traits/abi", "create_type_spec_derive/abi"]
```

### 7.4 Implement Smart Contract

Create the smart contract implementation in `src/lib.rs` based on the design in the Technical Design Document.

### 7.5 Build Smart Contract

```bash
# Build the contract
cargo partisia-contract build --release
```

### 7.6 Deploy Smart Contract

Deploy the compiled contract to the Partisia Blockchain using the Partisia Blockchain browser interface.

## Phase 8: Integration

### 8.1 Update Frontend to Use Real Wallet SDK

Update the wallet service to use the actual Partisia Wallet SDK.

### 8.2 Update Contract Service

Update the contract service to interact with the deployed smart contract.

### 8.3 Test Integration

Test the complete integration between the frontend and the smart contract.

## Testing Procedures

### Frontend Testing

1. **Wallet Connection**
   - Test connecting to wallet
   - Test disconnecting from wallet
   - Verify wallet address display

2. **Poll Creation**
   - Test form validation
   - Test option adding/removing
   - Test date picker
   - Verify poll creation process

3. **Poll Listing**
   - Verify polls are displayed correctly
   - Test active/ended status display
   - Test navigation to poll details

4. **Poll Voting**
   - Test option selection
   - Test public voting
   - Test private voting
   - Verify vote recording

5. **Poll Results**
   - Verify results display correctly
   - Test percentage calculations
   - Verify public/private vote counts

### Smart Contract Testing

1. **Deployment**
   - Verify contract deploys successfully
   - Test initialization parameters

2. **Poll Creation**
   - Test MPC payment requirement
   - Verify poll data storage
   - Test event emission

3. **Voting**
   - Test signature-based voting
   - Test MPC-based voting
   - Verify vote counting
   - Test duplicate vote prevention

4. **Poll Management**
   - Test poll expiration
   - Test early ending by creator
   - Verify state updates

## Troubleshooting Guide

### Frontend Issues

1. **Wallet Connection Failures**
   - Verify Parti wallet extension is installed
   - Check browser console for errors
   - Ensure wallet is on the correct network

2. **UI Rendering Issues**
   - Clear browser cache
   - Check for JavaScript errors in console
   - Verify all dependencies are installed

3. **Form Submission Errors**
   - Validate all required fields are filled
   - Check network connectivity
   - Verify wallet connection status

### Smart Contract Issues

1. **Deployment Failures**
   - Check Rust compiler errors
   - Verify contract size is within limits
   - Ensure correct Partisia SDK version

2. **Transaction Failures**
   - Verify sufficient MPC balance
   - Check transaction parameters
   - Ensure correct contract address

3. **State Inconsistencies**
   - Verify transaction confirmation
   - Check event logs for errors
   - Test with smaller data payloads

### Server Issues

1. **Nginx Configuration**
   - Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
   - Verify file permissions: `sudo chmod -R 755 /home/partivotes/partivotes/build`
   - Test configuration: `sudo nginx -t`

2. **Node.js/npm Issues**
   - Check Node.js version: `node -v`
   - Verify npm dependencies: `npm list`
   - Check for package conflicts: `npm audit`

3. **PM2 Issues**
   - Check process status: `pm2 status`
   - View logs: `pm2 logs partivotes`
   - Restart process: `pm2 restart partivotes`
