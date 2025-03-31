import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Chip,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import PollIcon from '@mui/icons-material/Poll';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import VoteList from './VoteList';

// Define the colors outside the component to avoid recreation on each render
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#6B66FF', '#A0FF6B'];

// Define styled components outside of render method to avoid warnings
const ResultsContainer = ({ children, ...props }) => (
  <Box sx={{ position: 'relative', zIndex: 2 }} {...props}>
    {children}
  </Box>
);

const PollResults = ({ poll }) => {
  console.log('=== PollResults RENDERING ===', {
    poll,
    hasOptions: poll?.options?.length > 0,
    totalVotes: poll?.totalVotes,
    optionsStructure: poll?.options?.[0]
  });
  
  const [sortedOptions, setSortedOptions] = useState([]);
  const [leadingOption, setLeadingOption] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    try {
      if (poll && poll.options && Array.isArray(poll.options)) {
        console.log('=== PollResults PROCESSING OPTIONS ===', { 
          pollOptions: poll.options,
          optionsLength: poll.options.length
        });
        
        // Ensure all options have votes property (default to 0)
        const processedOptions = poll.options.map(option => ({
          ...option,
          id: option._id || option.id || `option-${Math.random().toString(36).substr(2, 9)}`,
          votes: typeof option.votes === 'number' ? option.votes : 0,
          text: option.text || 'Unnamed Option'
        }));
        
        // Sort options by votes (descending)
        const sorted = [...processedOptions].sort((a, b) => b.votes - a.votes);
        setSortedOptions(sorted);
        
        // Set the leading option
        if (sorted.length > 0) {
          setLeadingOption(sorted[0]);
          console.log('=== PollResults LEADING OPTION ===', sorted[0]);
        } else {
          console.log('=== PollResults NO OPTIONS FOUND ===');
          setLeadingOption(null);
        }
        
        // Prepare data for pie chart
        const chartData = sorted.map(option => ({
          name: option.text,
          value: option.votes
        }));
        console.log('=== PollResults CHART DATA ===', chartData);
        setPieChartData(chartData);
      } else {
        console.log('=== PollResults MISSING POLL DATA ===', {
          pollExists: !!poll,
          optionsExist: !!poll?.options,
          isArray: Array.isArray(poll?.options)
        });
        
        // Reset states if no valid data
        setSortedOptions([]);
        setLeadingOption(null);
        setPieChartData([]);
      }
    } catch (err) {
      console.error('Error processing poll results:', err);
      setError(`Error processing results: ${err.message}`);
    }
  }, [poll]);
  
  // Before the early return for no poll
  if (!poll) {
    console.log('=== PollResults EARLY RETURN - No poll data ===');
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading results...</Typography>
      </Box>
    );
  }
  
  // If no options or they're not in the expected format
  if (!poll.options || !Array.isArray(poll.options) || poll.options.length === 0) {
    console.log('=== PollResults NO OPTIONS TO DISPLAY ===');
    return (
      <Alert severity="info">
        No voting options found for this poll.
      </Alert>
    );
  }
  
  // Show error if something went wrong
  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }
  
  return (
    <ResultsContainer>
      <Typography variant="h6" gutterBottom>
        <PollIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Poll Results
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2, mb: 3, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Vote Distribution
            </Typography>
            
            {poll.totalVotes > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1">No votes yet</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Results Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Total Votes: {poll.totalVotes || 0}
              </Typography>
              
              {leadingOption && poll.totalVotes > 0 ? (
                <Typography variant="body2" color="textSecondary">
                  Leading Option: {leadingOption.text} 
                  ({Math.round((leadingOption.votes / poll.totalVotes) * 100)}%)
                </Typography>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No votes have been cast yet. Be the first to vote!
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List disablePadding>
              {sortedOptions.map((option, index) => {
                const percentage = poll.totalVotes ? (option.votes / poll.totalVotes) * 100 : 0;
                return (
                  <ListItem key={option.id || index} disablePadding sx={{ mb: 2 }}>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1">{option.text}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {option.votes || 0} votes ({percentage.toFixed(0)}%)
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <LinearProgress 
                          variant="determinate" 
                          value={percentage} 
                          sx={{ 
                            mt: 1, 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: COLORS[index % COLORS.length]
                            }
                          }} 
                        />
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Individual Votes Section */}
      <VoteList poll={poll} />
    </ResultsContainer>
  );
};

export default PollResults;
