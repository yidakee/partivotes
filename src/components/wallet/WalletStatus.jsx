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

  // Copy address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setSnackbarOpen(true);
  };

  // Open address in explorer
  const openInExplorer = () => {
    // Partisia Blockchain explorer URL - works for both mainnet and testnet
    const explorerUrl = `https://browser.partisiablockchain.com/account/${address}`;
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
          {balance?.balance || 0} {isTestnet ? 'TEST_COIN' : (balance?.token || 'MPC')}
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
