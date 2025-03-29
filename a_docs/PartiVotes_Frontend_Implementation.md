# PartiVotes - Frontend Implementation Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Material-UI Setup](#material-ui-setup)
4. [Theme Configuration](#theme-configuration)
5. [Core Components](#core-components)
6. [Wallet Connection Implementation](#wallet-connection-implementation)
7. [Poll Management Components](#poll-management-components)
8. [Routing Configuration](#routing-configuration)
9. [State Management](#state-management)
10. [Testing and Debugging](#testing-and-debugging)

## Introduction

This guide provides detailed instructions for implementing the frontend of the PartiVotes platform using React and Material-UI 5, with a focus on wallet connection integration. The implementation follows a component-based architecture and emphasizes clean, maintainable code.

## Project Structure

The frontend project follows this structure:

```
partivotes/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── wallet/
│   │   │   ├── WalletConnect.jsx
│   │   │   └── WalletStatus.jsx
│   │   ├── polls/
│   │   │   ├── PollList.jsx
│   │   │   ├── PollItem.jsx
│   │   │   ├── PollCreate.jsx
│   │   │   ├── PollDetail.jsx
│   │   │   ├── VoteForm.jsx
│   │   │   └── PollResults.jsx
│   │   └── common/
│   │       ├── LoadingSpinner.jsx
│   │       ├── ErrorAlert.jsx
│   │       └── ConfirmationDialog.jsx
│   ├── contexts/
│   │   ├── WalletContext.jsx
│   │   └── PollContext.jsx
│   ├── services/
│   │   ├── walletService.js
│   │   └── pollService.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── dateUtils.js
│   ├── styles/
│   │   └── theme.js
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css
├── package.json
└── README.md
```

## Material-UI Setup

### Installation

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @mui/x-date-pickers date-fns
```

### Basic Setup in index.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from './styles/theme';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
```

## Theme Configuration

### Creating a Custom Theme (src/styles/theme.js)

```jsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Indigo
      light: '#757de8',
      dark: '#002984',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057', // Pink
      light: '#ff5983',
      dark: '#bb002f',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 2.66,
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0.07), 0px 1px 10px 0px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          overflow: 'hidden',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0.07), 0px 1px 10px 0px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
```

## Core Components

### Layout Components

#### Layout.jsx

```jsx
import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Container 
        component="main" 
        sx={{ 
          mt: 4, 
          mb: 4, 
          flex: 1,
          maxWidth: {
            xs: '100%',
            sm: '600px',
            md: '900px',
            lg: '1200px',
          },
          px: {
            xs: 2,
            sm: 3,
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
```

#### Header.jsx

```jsx
import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import WalletConnect from '../wallet/WalletConnect';
import { useState } from 'react';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Create Poll', path: '/create' },
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            PartiVotes
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                {menuItems.map((item) => (
                  <MenuItem 
                    key={item.text} 
                    component={RouterLink} 
                    to={item.path}
                    onClick={handleClose}
                  >
                    {item.text}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  sx={{ mx: 1 }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <WalletConnect />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
```

#### Footer.jsx

```jsx
import React from 'react';
import { Box, Typography, Container, Link, Divider } from '@mui/material';

const Footer = () => {
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
      <Divider sx={{ mb: 3 }} />
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}{' '}
          <Link color="inherit" href="#">
            PartiVotes
          </Link>{' '}
          - A private voting platform on Partisia Blockchain
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
          Powered by Multi-Party Computation (MPC) technology
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
```

### Common Components

#### LoadingSpinner.jsx

```jsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <CircularProgress size={40} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
```

#### ErrorAlert.jsx

```jsx
import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

const ErrorAlert = ({ title = 'Error', message, severity = 'error' }) => {
  if (!message) return null;
  
  return (
    <Box sx={{ mb: 3 }}>
      <Alert severity={severity}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
```

#### ConfirmationDialog.jsx

```jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

const ConfirmationDialog = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmColor = 'primary',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
```

## Wallet Connection Implementation

### Wallet Context (src/contexts/WalletContext.jsx)

```jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  connectWallet, 
  disconnectWallet, 
  getWalletAddress,
  getWalletBalance,
} from '../services/walletService';

// Create context
export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);
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
          
          // Get wallet balance
          const walletBalance = await getWalletBalance(walletAddress);
          setBalance(walletBalance);
        }
      } catch (err) {
        console.error('Failed to check wallet connection:', err);
      } finally {
        setLoading(false);
      }
    };

    checkWalletConnection();
  }, []);

  // Update balance periodically when connected
  useEffect(() => {
    let intervalId;
    
    if (connected && address) {
      intervalId = setInterval(async () => {
        try {
          const walletBalance = await getWalletBalance(address);
          setBalance(walletBalance);
        } catch (err) {
          console.error('Failed to update wallet balance:', err);
        }
      }, 30000); // Update every 30 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [connected, address]);

  const connect = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const walletAddress = await connectWallet();
      setConnected(true);
      setAddress(walletAddress);
      
      // Get wallet balance
      const walletBalance = await getWalletBalance(walletAddress);
      setBalance(walletBalance);
      
      return true;
    } catch (err) {
      setError('Failed to connect wallet: ' + (err.message || 'Unknown error'));
      console.error('Wallet connection error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setLoading(true);
    
    try {
      await disconnectWallet();
      setConnected(false);
      setAddress('');
      setBalance(null);
      return true;
    } catch (err) {
      console.error('Wallet disconnection error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!connected || !address) return;
    
    try {
      const walletBalance = await getWalletBalance(address);
      setBalance(walletBalance);
    } catch (err) {
      console.error('Failed to refresh wallet balance:', err);
    }
  }, [connected, address]);

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        balance,
        loading,
        error,
        connect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
```

### Wallet Service (src/services/walletService.js)

```javascript
import { PartisiaWalletSDK } from '@partisiablockchain/wallet-sdk';

// Initialize SDK
let walletSDK;

const initializeWalletSDK = () => {
  if (!walletSDK) {
    walletSDK = new PartisiaWalletSDK({
      dAppName: 'PartiVotes',
      dAppVersion: '0.1.0',
      dAppDescription: 'A private voting platform on Partisia Blockchain',
    });
  }
  return walletSDK;
};

// Connect to wallet
export const connectWallet = async () => {
  try {
    const sdk = initializeWalletSDK();
    
    // Request connection to wallet
    await sdk.connect();
    
    // Get account address
    const accounts = await sdk.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in wallet');
    }
    
    return accounts[0];
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
};

// Disconnect from wallet
export const disconnectWallet = async () => {
  try {
    const sdk = initializeWalletSDK();
    await sdk.disconnect();
    return true;
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
    throw error;
  }
};

// Get wallet address
export const getWalletAddress = async () => {
  try {
    const sdk = initializeWalletSDK();
    
    // Check if already connected
    const isConnected = await sdk.isConnected();
    if (!isConnected) {
      return null;
    }
    
    // Get account address
    const accounts = await sdk.getAccounts();
    if (!accounts || accounts.length === 0) {
      return null;
    }
    
    return accounts[0];
  } catch (error) {
    console.error('Failed to get wallet address:', error);
    return null;
  }
};

// Get wallet balance
export const getWalletBalance = async (address) => {
  try {
    const sdk = initializeWalletSDK();
    
    // Get balance
    const balance = await sdk.getBalance(address);
    return balance;
  } catch (error) {
    console.error('Failed to get wallet balance:', error);
    throw error;
  }
};

// Sign transaction
export const signTransaction = async (transaction) => {
  try {
    const sdk = initializeWalletSDK();
    const signedTransaction = await sdk.signTransaction(transaction);
    return signedTransaction;
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    throw error;
  }
};

// Send transaction
export const sendTransaction = async (transaction) => {
  try {
    const sdk = initializeWalletSDK();
    const txHash = await sdk.sendTransaction(transaction);
    return txHash;
  } catch (error) {
    console.error('Failed to send transaction:', error);
    throw error;
  }
};

// Sign message (for signature-based voting)
export const signMessage = async (message) => {
  try {
    const sdk = initializeWalletSDK();
    const signature = await sdk.signMessage(message);
    return signature;
  } catch (error) {
    console.error('Failed to sign message:', error);
    throw error;
  }
};

// Verify signature
export const verifySignature = async (message, signature, address) => {
  try {
    const sdk = initializeWalletSDK();
    const isValid = await sdk.verifySignature(message, signature, address);
    return isValid;
  } catch (error) {
    console.error('Failed to verify signature:', error);
    throw error;
  }
};
```

### Wallet Connect Component (src/components/wallet/WalletConnect.jsx)

```jsx
import React, { useContext, useState } from 'react';
import { 
  Button, 
  Box, 
  CircularProgress, 
  Menu, 
  MenuItem, 
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { WalletContext } from '../../contexts/WalletContext';
import WalletStatus from './WalletStatus';

const WalletConnect = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { connected, address, balance, loading, connect, disconnect } = useContext(WalletContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (connected) {
      setAnchorEl(event.currentTarget);
    } else {
      handleConnect();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = async () => {
    await disconnect();
    handleClose();
  };

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const formatBalance = (bal) => {
    if (bal === null || bal === undefined) return 'Unknown';
    return `${bal} MPC`;
  };

  return (
    <Box>
      <Button
        variant={connected ? "outlined" : "contained"}
        color={connected ? "inherit" : "secondary"}
        onClick={handleClick}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWalletIcon />}
        sx={{
          borderColor: connected ? 'rgba(255, 255, 255, 0.5)' : undefined,
          '&:hover': {
            borderColor: connected ? 'rgba(255, 255, 255, 0.8)' : undefined,
          },
        }}
      >
        {loading ? (
          'Connecting...'
        ) : connected ? (
          isMobile ? truncateAddress(address) : `${truncateAddress(address)}`
        ) : (
          'Connect Wallet'
        )}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'wallet-button',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 250,
            borderRadius: 2,
            mt: 1,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Wallet
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ px: 2, py: 1 }}>
          <WalletStatus address={address} balance={balance} />
        </Box>
        <Divider />
        <MenuItem onClick={handleDisconnect} sx={{ color: 'error.main' }}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Disconnect
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WalletConnect;
```

### Wallet Status Component (src/components/wallet/WalletStatus.jsx)

```jsx
import React from 'react';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const WalletStatus = ({ address, balance }) => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  const handleOpenExplorer = () => {
    // Replace with actual Partisia explorer URL
    window.open(`https://explorer.partisiablockchain.com/address/${address}`, '_blank');
  };

  const formatBalance = (bal) => {
    if (bal === null || bal === undefined) return 'Unknown';
    return `${bal} MPC`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Address
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Copy Address">
            <IconButton size="small" onClick={handleCopyAddress}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View in Explorer">
            <IconButton size="small" onClick={handleOpenExplorer}>
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Typography variant="body2" sx={{ wordBreak: 'break-all', mb: 2 }}>
        {address}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          Balance
        </Typography>
      </Box>
      <Typography variant="body1" fontWeight="bold">
        {formatBalance(balance)}
      </Typography>
    </Box>
  );
};

export default WalletStatus;
```

## Poll Management Components

### Poll List Component (src/components/polls/PollList.jsx)

```jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Button,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { WalletContext } from '../../contexts/WalletContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { formatDate } from '../../utils/dateUtils';
import { getPolls } from '../../services/pollService';

const PollList = () => {
  const theme = useTheme();
  const { connected } = useContext(WalletContext);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const pollsData = await getPolls();
        setPolls(pollsData);
        setError('');
      } catch (err) {
        setError('Failed to load polls: ' + (err.message || 'Unknown error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const isPollActive = (poll) => {
    return poll.active && new Date(poll.expires_at) > new Date();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Available Polls
        </Typography>
        
        <Button
          component={RouterLink}
          to="/create"
          variant="contained"
          color="primary"
          disabled={!connected}
          startIcon={<AddIcon />}
        >
          Create Poll
        </Button>
      </Box>
      
      <ErrorAlert message={error} />
      
      {loading ? (
        <LoadingSpinner message="Loading polls..." />
      ) : polls.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No polls available
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Be the first to create a poll!
          </Typography>
          <Button
            component={RouterLink}
            to="/create"
            variant="contained"
            color="primary"
            disabled={!connected}
            startIcon={<AddIcon />}
          >
            Create Poll
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {polls.map((poll) => (
            <Grid item xs={12} sm={6} md={4} key={poll.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardActionArea 
                  component={RouterLink} 
                  to={`/poll/${poll.id}`}
                  sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom noWrap sx={{ flexGrow: 1 }}>
                        {poll.title}
                      </Typography>
                      {isPollActive(poll) ? (
                        <Chip 
                          label="Active" 
                          color="success" 
                          size="small" 
                          sx={{ ml: 1, flexShrink: 0 }}
                        />
                      ) : (
                        <Chip 
                          label="Ended" 
                          color="default" 
                          size="small" 
                          sx={{ ml: 1, flexShrink: 0 }}
                        />
                      )}
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        flexGrow: 1,
                      }}
                    >
                      {poll.description}
                    </Typography>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Options: {poll.options.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Expires: {formatDate(poll.expires_at)}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PollList;
```

### Poll Create Component (src/components/polls/PollCreate.jsx)

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
  Stack,
  Tooltip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Add as AddIcon, Remove as RemoveIcon, Info as InfoIcon } from '@mui/icons-material';
import { WalletContext } from '../../contexts/WalletContext';
import ErrorAlert from '../common/ErrorAlert';
import { createPoll } from '../../services/pollService';

const PollCreate = () => {
  const navigate = useNavigate();
  const { connected, balance } = useContext(WalletContext);
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

  const validateForm = () => {
    if (!connected) {
      setError('Please connect your wallet first');
      return false;
    }
    
    if (!title.trim()) {
      setError('Please enter a poll title');
      return false;
    }
    
    if (!description.trim()) {
      setError('Please enter a poll description');
      return false;
    }
    
    if (options.some(opt => !opt.trim()) || options.length < 2) {
      setError('Please provide at least 2 non-empty options');
      return false;
    }
    
    if (!expiresAt || expiresAt <= new Date()) {
      setError('Please set a future expiration date');
      return false;
    }
    
    if (balance < 100) {
      setError('Insufficient MPC balance. You need at least 100 MPC to create a poll.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await createPoll({
        title: title.trim(),
        description: description.trim(),
        options: options.map(opt => opt.trim()).filter(opt => opt),
        expires_at: Math.floor(expiresAt.getTime() / 1000),
      });
      
      navigate('/');
    } catch (err) {
      setError('Failed to create poll: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Poll
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <ErrorAlert message={error} />
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Poll Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            inputProps={{ maxLength: 100 }}
            helperText={`${title.length}/100 characters`}
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
            inputProps={{ maxLength: 500 }}
            helperText={`${description.length}/500 characters`}
          />
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
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
                  inputProps={{ maxLength: 100 }}
                  sx={{ mr: 1 }}
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
              disabled={options.length >= 10}
            >
              Add Option
            </Button>
            {options.length >= 10 && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                Maximum 10 options allowed
              </Typography>
            )}
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <DateTimePicker
              label="Expires At"
              value={expiresAt}
              onChange={setExpiresAt}
              minDateTime={new Date(Date.now() + 60 * 60 * 1000)} // Minimum 1 hour from now
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
          
          <Box sx={{ mt: 4, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <InfoIcon color="info" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                Creating a poll requires a payment of 100 MPC tokens.
              </Typography>
            </Stack>
            
            {connected && balance !== null && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Your current balance: <strong>{balance} MPC</strong>
              </Typography>
            )}
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
};

export default PollCreate;
```

### Poll Detail Component (src/components/polls/PollDetail.jsx)

```jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { WalletContext } from '../../contexts/WalletContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import ConfirmationDialog from '../common/ConfirmationDialog';
import VoteForm from './VoteForm';
import PollResults from './PollResults';
import { getPoll, endPoll } from '../../services/pollService';
import { formatDate } from '../../utils/dateUtils';

const PollDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { connected, address } = useContext(WalletContext);
  
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEndDialog, setShowEndDialog] = useState(false);
  
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const pollData = await getPoll(id);
        setPoll(pollData);
        
        // Check if user has voted
        if (connected && pollData.votes && pollData.votes[address]) {
          setHasVoted(true);
        }
        
        setError('');
      } catch (err) {
        setError('Failed to load poll: ' + (err.message || 'Unknown error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id, connected, address]);

  const handleEndPoll = async () => {
    if (!connected) return;
    
    setActionLoading(true);
    setError('');
    
    try {
      await endPoll(id);
      
      // Update poll data
      setPoll(prev => ({
        ...prev,
        active: false,
      }));
      
      setShowEndDialog(false);
    } catch (err) {
      setError('Failed to end poll: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleVoteSuccess = (updatedPoll) => {
    setPoll(updatedPoll);
    setHasVoted(true);
  };

  const isPollActive = () => {
    return poll.active && new Date(poll.expires_at) > new Date();
  };

  const isCreator = () => {
    return connected && poll.creator === address;
  };

  if (loading) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Polls
        </Button>
        <LoadingSpinner message="Loading poll details..." />
      </Box>
    );
  }

  if (!poll) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Polls
        </Button>
        <ErrorAlert 
          title="Poll Not Found" 
          message="The poll you're looking for doesn't exist or has been removed." 
        />
      </Box>
    );
  }

  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Polls
      </Button>
      
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
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ mt: 2 }}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Created by: {poll.creator === address ? 'You' : poll.creator.substring(0, 6) + '...' + poll.creator.substring(poll.creator.length - 4)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Expires: {formatDate(poll.expires_at)}
            </Typography>
          </Box>
        </Stack>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          {poll.description}
        </Typography>
        
        <ErrorAlert message={error} />
        
        {hasVoted || !isPollActive() ? (
          <PollResults poll={poll} />
        ) : (
          <VoteForm 
            poll={poll} 
            onVoteSuccess={handleVoteSuccess} 
          />
        )}
        
        {isCreator() && isPollActive() && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Creator Actions
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowEndDialog(true)}
              disabled={actionLoading}
            >
              End Poll Early
            </Button>
          </Box>
        )}
      </Paper>
      
      <ConfirmationDialog
        open={showEndDialog}
        title="End Poll Early"
        message="Are you sure you want to end this poll early? This action cannot be undone."
        confirmText="End Poll"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleEndPoll}
        onCancel={() => setShowEndDialog(false)}
      />
    </Box>
  );
};

export default PollDetail;
```

### Vote Form Component (src/components/polls/VoteForm.jsx)

```jsx
import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
  Paper,
} from '@mui/material';
import { WalletContext } from '../../contexts/WalletContext';
import ErrorAlert from '../common/ErrorAlert';
import { voteWithSignature, voteWithMPC } from '../../services/pollService';

const VoteForm = ({ poll, onVoteSuccess }) => {
  const { connected, balance } = useContext(WalletContext);
  const [selectedOption, setSelectedOption] = useState('');
  const [showVoteDialog, setShowVoteDialog] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleVoteClick = () => {
    if (!connected || !selectedOption) return;
    setShowVoteDialog(true);
  };

  const handleVoteWithSignature = async () => {
    if (!connected || !selectedOption) return;
    
    setVoting(true);
    setError('');
    
    try {
      const updatedPoll = await voteWithSignature(poll.id, parseInt(selectedOption));
      onVoteSuccess(updatedPoll);
    } catch (err) {
      setError('Failed to vote: ' + (err.message || 'Unknown error'));
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
      if (balance < 100) {
        throw new Error('Insufficient MPC balance. You need at least 100 MPC for a private vote.');
      }
      
      const updatedPoll = await voteWithMPC(poll.id, parseInt(selectedOption));
      onVoteSuccess(updatedPoll);
    } catch (err) {
      setError('Failed to vote: ' + (err.message || 'Unknown error'));
    } finally {
      setVoting(false);
      setShowVoteDialog(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cast Your Vote
        </Typography>
        
        <ErrorAlert message={error} />
        
        <FormControl component="fieldset" sx={{ width: '100%' }}>
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
        
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!connected || !selectedOption || voting}
            onClick={handleVoteClick}
          >
            {voting ? 'Voting...' : 'Vote'}
          </Button>
        </Box>
      </Paper>
      
      <Dialog open={showVoteDialog} onClose={() => !voting && setShowVoteDialog(false)}>
        <DialogTitle>Choose Voting Method</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            You can vote using one of the following methods:
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Public Vote (Free)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your vote will be visible to everyone, but doesn't cost any MPC tokens.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Private Vote (100 MPC)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your vote will be kept private, but costs 100 MPC tokens.
            </Typography>
            {connected && balance !== null && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Your current balance: <strong>{balance} MPC</strong>
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVoteDialog(false)} disabled={voting}>
            Cancel
          </Button>
          <Button 
            onClick={handleVoteWithSignature} 
            color="primary"
            disabled={voting}
          >
            {voting ? <CircularProgress size={24} /> : 'Public Vote (Free)'}
          </Button>
          <Button 
            onClick={handleVoteWithMPC} 
            color="primary" 
            variant="contained"
            disabled={voting || balance < 100}
          >
            {voting ? <CircularProgress size={24} /> : 'Private Vote (100 MPC)'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoteForm;
```

### Poll Results Component (src/components/polls/PollResults.jsx)

```jsx
import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Divider,
  Grid,
} from '@mui/material';

const PollResults = ({ poll }) => {
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
    <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Results
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="h4" color="primary">
              {total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Votes
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="h4" color="info.main">
              {publicTotal}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Public Votes
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="h4" color="secondary">
              {privateTotal}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Private Votes
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      {poll.options.map((option, index) => {
        const publicCount = poll.public_vote_counts[index] || 0;
        const privateCount = poll.private_vote_counts[index] || 0;
        const totalCount = publicCount + privateCount;
        const percentage = getPercentage(totalCount);
        
        return (
          <Box key={index} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body1" fontWeight={500}>
                {option}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {percentage}%
              </Typography>
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{ 
                height: 10, 
                borderRadius: 5,
                mb: 0.5,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                {totalCount} vote{totalCount !== 1 ? 's' : ''}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="caption" color="info.main" sx={{ mr: 1 }}>
                  Public: {publicCount}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Private: {privateCount}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      })}
      
      {total === 0 && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1" color="text.secondary">
            No votes have been cast yet.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PollResults;
```

## Routing Configuration

### App.jsx

```jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Layout from './components/layout/Layout';
import PollList from './components/polls/PollList';
import PollCreate from './components/polls/PollCreate';
import PollDetail from './components/polls/PollDetail';
import NotFound from './components/common/NotFound';

const App = () => {
  return (
    <WalletProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<PollList />} />
          <Route path="/create" element={<PollCreate />} />
          <Route path="/poll/:id" element={<PollDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </WalletProvider>
  );
};

export default App;
```

### NotFound.jsx

```jsx
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
        >
          Go to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
```

## State Management

### Poll Service (src/services/pollService.js)

```javascript
import { signTransaction, sendTransaction, signMessage } from './walletService';
import { CONTRACT_ADDRESS } from '../utils/constants';

// Helper function to create a transaction
const createTransaction = (action, params = {}, amount = 0) => {
  return {
    to: CONTRACT_ADDRESS,
    action,
    params,
    amount,
  };
};

// Create a new poll
export const createPoll = async (pollData) => {
  try {
    const transaction = createTransaction('create_poll', pollData, 100); // 100 MPC payment
    const signedTx = await signTransaction(transaction);
    const txHash = await sendTransaction(signedTx);
    
    // Wait for transaction confirmation
    await waitForConfirmation(txHash);
    
    return txHash;
  } catch (error) {
    console.error('Failed to create poll:', error);
    throw error;
  }
};

// Get all polls
export const getPolls = async () => {
  try {
    // For development/testing, return mock data
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return getMockPolls();
    }
    
    const transaction = createTransaction('get_polls');
    const signedTx = await signTransaction(transaction);
    const result = await sendTransaction(signedTx);
    
    return result.polls || [];
  } catch (error) {
    console.error('Failed to get polls:', error);
    throw error;
  }
};

// Get a specific poll
export const getPoll = async (pollId) => {
  try {
    // For development/testing, return mock data
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const mockPolls = getMockPolls();
      const poll = mockPolls.find(p => p.id.toString() === pollId.toString());
      if (!poll) throw new Error('Poll not found');
      return poll;
    }
    
    const polls = await getPolls();
    const poll = polls.find(p => p.id.toString() === pollId.toString());
    if (!poll) throw new Error('Poll not found');
    return poll;
  } catch (error) {
    console.error('Failed to get poll:', error);
    throw error;
  }
};

// Vote with signature (public)
export const voteWithSignature = async (pollId, optionIndex) => {
  try {
    // Create message to sign
    const message = `Vote for option ${optionIndex} in poll ${pollId}`;
    const signature = await signMessage(message);
    
    const transaction = createTransaction('vote_with_signature', {
      poll_id: pollId,
      option_index: optionIndex,
      signature,
    });
    
    const signedTx = await signTransaction(transaction);
    const txHash = await sendTransaction(signedTx);
    
    // Wait for transaction confirmation
    await waitForConfirmation(txHash);
    
    // Get updated poll data
    return await getPoll(pollId);
  } catch (error) {
    console.error('Failed to vote with signature:', error);
    throw error;
  }
};

// Vote with MPC (private)
export const voteWithMPC = async (pollId, optionIndex) => {
  try {
    const transaction = createTransaction('vote_with_mpc', {
      poll_id: pollId,
      option_index: optionIndex,
    }, 100); // 100 MPC payment
    
    const signedTx = await signTransaction(transaction);
    const txHash = await sendTransaction(signedTx);
    
    // Wait for transaction confirmation
    await waitForConfirmation(txHash);
    
    // Get updated poll data
    return await getPoll(pollId);
  } catch (error) {
    console.error('Failed to vote with MPC:', error);
    throw error;
  }
};

// End a poll early
export const endPoll = async (pollId) => {
  try {
    const transaction = createTransaction('end_poll', {
      poll_id: pollId,
    });
    
    const signedTx = await signTransaction(transaction);
    const txHash = await sendTransaction(signedTx);
    
    // Wait for transaction confirmation
    await waitForConfirmation(txHash);
    
    return txHash;
  } catch (error) {
    console.error('Failed to end poll:', error);
    throw error;
  }
};

// Helper function to wait for transaction confirmation
const waitForConfirmation = async (txHash) => {
  // Implementation depends on Partisia SDK capabilities
  // This is a placeholder for transaction confirmation logic
  return new Promise((resolve) => {
    setTimeout(resolve, 2000); // Simulate waiting for confirmation
  });
};

// Mock data for development/testing
const getMockPolls = () => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  
  return [
    {
      id: '1',
      title: 'Favorite Programming Language',
      description: 'What is your favorite programming language for blockchain development?',
      options: ['Rust', 'Solidity', 'JavaScript', 'Python'],
      created_at: now - 7 * day,
      expires_at: now + 7 * day,
      active: true,
      creator: '0x1234567890abcdef1234567890abcdef12345678',
      public_vote_counts: {0: 5, 1: 3, 2: 8, 3: 2},
      private_vote_counts: {0: 2, 1: 1, 2: 3, 3: 1},
      votes: {},
    },
    {
      id: '2',
      title: 'Best Blockchain Platform',
      description: 'Which blockchain platform do you prefer for dApp development?',
      options: ['Ethereum', 'Partisia', 'Solana', 'Polkadot'],
      created_at: now - 14 * day,
      expires_at: now + 3 * day,
      active: true,
      creator: '0x1234567890abcdef1234567890abcdef12345678',
      public_vote_counts: {0: 12, 1: 15, 2: 7, 3: 5},
      private_vote_counts: {0: 3, 1: 8, 2: 2, 3: 1},
      votes: {},
    },
    {
      id: '3',
      title: 'Web3 Future',
      description: 'What aspect of Web3 will have the biggest impact in the next 5 years?',
      options: ['DeFi', 'NFTs', 'DAOs', 'Privacy Tech'],
      created_at: now - 30 * day,
      expires_at: now - 1 * day,
      active: false,
      creator: '0x1234567890abcdef1234567890abcdef12345678',
      public_vote_counts: {0: 20, 1: 15, 2: 10, 3: 25},
      private_vote_counts: {0: 5, 1: 3, 2: 7, 3: 12},
      votes: {},
    },
  ];
};
```

## Testing and Debugging

### Setting Up Environment Variables

Create a `.env` file in the project root:

```
REACT_APP_CONTRACT_ADDRESS=your_contract_address
REACT_APP_NETWORK=mainnet
REACT_APP_USE_MOCK_DATA=true
```

### Testing Wallet Connection

To test the wallet connection without an actual wallet, you can modify the `walletService.js` file to use mock data during development:

```javascript
// Add this at the top of walletService.js
const USE_MOCK_WALLET = process.env.REACT_APP_USE_MOCK_DATA === 'true';

// Then modify each function to use mock data when USE_MOCK_WALLET is true
export const connectWallet = async () => {
  if (USE_MOCK_WALLET) {
    return '0x1234567890abcdef1234567890abcdef12345678';
  }
  
  // Real implementation...
};

export const getWalletBalance = async (address) => {
  if (USE_MOCK_WALLET) {
    return 500; // Mock balance of 500 MPC
  }
  
  // Real implementation...
};
```

### Browser Console Debugging

Add these console logs to help with debugging:

```javascript
// In WalletContext.jsx
useEffect(() => {
  console.log('Wallet state:', { connected, address, balance });
}, [connected, address, balance]);

// In pollService.js
console.log('Creating poll with data:', pollData);
console.log('Transaction result:', txHash);
```

### React Developer Tools

Install the React Developer Tools browser extension to inspect component props and state during development.

This comprehensive frontend implementation guide provides detailed code examples and explanations for implementing the PartiVotes platform using React and Material-UI, with a focus on wallet connection integration. The implementation follows best practices for component structure, state management, and user experience.
