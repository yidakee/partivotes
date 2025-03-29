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
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const WalletStatus = ({ address, balance }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Format address for display (first 6 and last 4 characters)
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Copy address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setSnackbarOpen(true);
  };

  // Open address in explorer
  const openInExplorer = () => {
    // This would be a real explorer URL in production
    const explorerUrl = `https://explorer.partisiablockchain.com/address/${address}`;
    window.open(explorerUrl, '_blank');
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Wallet Status
      </Typography>
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
          {balance} MPC
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
