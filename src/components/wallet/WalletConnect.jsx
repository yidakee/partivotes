import React, { useState, useContext } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { WalletContext } from '../../contexts/WalletContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import WalletStatus from './WalletStatus';

const WalletConnect = () => {
  const { connected, address, balance, loading, error, connect, disconnect } = useContext(WalletContext);
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Format address for display (first 6 and last 4 characters)
  // Partisia addresses are 42 characters (21 bytes) in hex format without 0x prefix
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Handle opening the menu
  const handleClick = (event) => {
    if (connected) {
      setAnchorEl(event.currentTarget);
    }
  };

  // Handle closing the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle connecting the wallet
  const handleConnect = async () => {
    try {
      console.log('WalletConnect: Connect button clicked');
      await connect();
    } catch (err) {
      console.error('Error in handleConnect:', err);
    }
  };

  // Handle disconnecting the wallet
  const handleDisconnect = async () => {
    try {
      await disconnect();
      handleClose();
    } catch (err) {
      console.error('Error in handleDisconnect:', err);
    }
  };

  return (
    <>
      <Button
        variant={connected ? "outlined" : "contained"}
        color={connected ? "secondary" : "primary"}
        onClick={connected ? handleClick : handleConnect}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWalletIcon />}
        disabled={loading}
        sx={{ 
          borderRadius: '20px',
          px: 2,
          py: 0,
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...(isFuturistic && {
            background: connected ? 'transparent' : 'linear-gradient(90deg, #4c00ff, #00a3ff)',
            border: connected ? '1px solid #00a3ff' : 'none',
            boxShadow: '0 0 10px rgba(0, 163, 255, 0.5)',
            '&:hover': {
              boxShadow: '0 0 15px rgba(0, 163, 255, 0.7)',
              background: connected ? 'transparent' : 'linear-gradient(90deg, #5c10ff, #10b3ff)',
            }
          })
        }}
      >
        {loading ? (
          'Loading...'
        ) : connected ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {formatAddress(address)}
            </Typography>
            <Typography variant="body2" color={isFuturistic ? "#00ffea" : "primary.main"} fontWeight="bold">
              {balance?.balance || balance || 0} TEST_COIN
            </Typography>
          </Box>
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
          sx: {
            ...(isFuturistic && {
              background: 'rgba(10, 10, 30, 0.95)',
              border: '1px solid rgba(0, 255, 240, 0.3)',
              boxShadow: '0 0 10px rgba(0, 255, 240, 0.3)',
              color: 'white',
            })
          }
        }}
      >
        <Box sx={{ px: 2, py: 1, width: 300 }}>
          <WalletStatus address={address} balance={balance} />
        </Box>
        <Divider />
        <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
      </Menu>
    </>
  );
};

export default WalletConnect;
