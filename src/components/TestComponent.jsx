import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const TestComponent = () => {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Test Component
      </Typography>
      <Typography variant="body1" paragraph>
        This is a test component to verify routing is working correctly.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button 
          component={Link} 
          to="/polls" 
          variant="contained" 
          color="primary"
          sx={{ mr: 2 }}
        >
          Go to Polls
        </Button>
        <Button 
          component={Link} 
          to="/polls/create" 
          variant="outlined"
        >
          Create Poll
        </Button>
      </Box>
    </Box>
  );
};

export default TestComponent;
