import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Mini chart component to display top poll options
 * Used in the poll card to show leading options
 */
const PollOptionMiniChart = ({ options, isFuturistic }) => {
  if (!options || options.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        No votes yet
      </Typography>
    );
  }

  // Calculate total votes for percentage
  const totalVotes = options.reduce((sum, option) => sum + (option.votes || 0), 0);
  
  return (
    <Box>
      <Typography 
        variant="subtitle2" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          ...(isFuturistic && {
            color: '#00fff0',
          })
        }}
      >
        Leading Options
      </Typography>
      
      {options.map((option, index) => {
        const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
        
        return (
          <Box key={index} mb={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography 
                variant="body2"
                sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '70%',
                  ...(isFuturistic && {
                    color: 'rgba(255, 255, 255, 0.9)'
                  })
                }}
              >
                {option.text || `Option ${index + 1}`}
              </Typography>
              <Typography 
                variant="body2"
                sx={{ 
                  fontWeight: 'bold',
                  ...(isFuturistic && {
                    color: '#00ffaa'
                  })
                }}
              >
                {percentage}%
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                height: '6px',
                borderRadius: '3px',
                width: '100%',
                backgroundColor: isFuturistic ? 'rgba(0, 255, 240, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${percentage}%`,
                  borderRadius: '3px',
                  background: isFuturistic 
                    ? 'linear-gradient(90deg, #00fff0, #00ffaa)' 
                    : 'linear-gradient(90deg, #1976d2, #64b5f6)',
                  transition: 'width 1s ease-in-out',
                  ...(isFuturistic && {
                    boxShadow: '0 0 5px rgba(0, 255, 240, 0.7)'
                  })
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default PollOptionMiniChart;
