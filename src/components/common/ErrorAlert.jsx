import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

const ErrorAlert = ({ title = 'Error', message, onClose }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Alert 
        severity="error" 
        onClose={onClose}
        sx={{ 
          '& .MuiAlert-message': { 
            width: '100%' 
          } 
        }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
