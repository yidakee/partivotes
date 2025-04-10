import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const WalletStatus = ({ address, balance, isTestnet }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  // Format balance for display
  const formatBalance = () => {
    if (!balance) return '0 MPC';
    
    // Handle balance as object with balance and token properties
    if (typeof balance === 'object' && balance !== null) {
      const balanceValue = balance.balance || 0;
      const tokenSymbol = isTestnet ? 'TEST_COIN' : (balance.token || 'MPC');
      return `${balanceValue} ${tokenSymbol}`;
    }
    
    // Handle balance as number or string
    return `${balance} ${isTestnet ? 'TEST_COIN' : 'MPC'}`;
  };

  // Copy address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setSnackbarOpen(true);
  };

  // Open address in explorer
  const openInExplorer = () => {
    // Generate explorer URL based on network
    const explorerUrl = isTestnet 
      ? `https://browser.testnet.partisiablockchain.com/accounts/${address}`
      : `https://browser.partisiablockchain.com/accounts/${address}`;
    window.open(explorerUrl, '_blank');
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">
          Wallet Status
        </Typography>
        <Chip 
          label={isTestnet ? "Testnet" : "Mainnet"} 
          color={isTestnet ? "warning" : "success"} 
          size="small" 
          variant="outlined"
        />
      </Box>
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Address
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 1 }}>
            {formatAddress(address)}
          </Typography>
          <Tooltip title="Copy Address">
            <IconButton size="small" onClick={copyToClipboard}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View in Explorer">
            <IconButton size="small" onClick={openInExplorer}>
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Balance
        </Typography>
        <Typography variant="body1">
          {formatBalance()}
        </Typography>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Address copied to clipboard!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default WalletStatus;
