import React, { useState, useContext } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
  Divider,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { WalletContext } from '../../contexts/WalletContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import WalletStatus from './WalletStatus';

const WalletConnect = () => {
  const { connected, address, balance, loading, error, connect, disconnect, isTestnet, toggleNetwork } = useContext(WalletContext);
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Format address for display (first 6 and last 4 characters)
  // Partisia addresses are 42 characters (21 bytes) in hex format without 0x prefix
  const formatAddress = (addr) => {
    if (!addr) return '';
    
    // Ensure addr is a string
    const addrStr = String(addr);
    
    // Check if the address is valid before formatting
    if (addrStr.length < 10) return addrStr;
    
    return `${addrStr.substring(0, 6)}...${addrStr.substring(addrStr.length - 4)}`;
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

  // Handle network toggle
  const handleNetworkToggle = () => {
    // Only allow network switching when not connected
    if (!connected) {
      toggleNetwork();
    } else {
      console.log('Cannot switch networks while wallet is connected. Please disconnect first.');
      // You could add a notification here if you want to inform the user
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Switch
              checked={!isTestnet}
              onChange={handleNetworkToggle}
              size="small"
              color="primary"
              disabled={connected}
            />
          }
          label={
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
              {isTestnet ? 'Testnet' : 'Mainnet'}
            </Typography>
          }
          sx={{ mr: 1, '.MuiFormControlLabel-label': { fontSize: '0.7rem' } }}
        />
        {connected && (
          <Chip 
            size="small" 
            label="Disconnect wallet to switch networks" 
            color="warning" 
            variant="outlined" 
            sx={{ ml: 2, display: connected ? 'flex' : 'none' }}
          />
        )}
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
                {typeof balance === 'object' 
                  ? `${balance?.balance || 0} ${isTestnet ? 'TEST_COIN' : (balance?.token || 'MPC')}` 
                  : `${balance || 0} ${isTestnet ? 'TEST_COIN' : 'MPC'}`}
              </Typography>
            </Box>
          ) : (
            'Connect Wallet'
          )}
        </Button>
      </Box>

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
          <WalletStatus address={address} balance={balance} isTestnet={isTestnet} />
        </Box>
        <Divider />
        <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
      </Menu>
    </>
  );
};

export default WalletConnect;
