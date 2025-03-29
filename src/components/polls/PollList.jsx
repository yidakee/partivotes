import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
  Chip, 
  Divider,
  CircularProgress,
  Tooltip,
  LinearProgress,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import BarChartIcon from '@mui/icons-material/BarChart';
import { getPolls } from '../../services/pollService';
import { formatDate } from '../../utils/dateUtils';
import { POLL_STATUS, POLL_TYPE } from '../../utils/constants';
import { WalletContext } from '../../contexts/WalletContext';

const statusColors = {
  [POLL_STATUS.ACTIVE]: 'success',
  [POLL_STATUS.ENDED]: 'error',
  [POLL_STATUS.PENDING]: 'warning',
  [POLL_STATUS.CANCELLED]: 'default'
};

const pollTypeLabels = {
  [POLL_TYPE.SINGLE_CHOICE]: 'Single Choice',
  [POLL_TYPE.MULTIPLE_CHOICE]: 'Multiple Choice',
  [POLL_TYPE.RANKED_CHOICE]: 'Ranked Choice'
};

const PollList = () => {
  const { connected } = useContext(WalletContext);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const data = await getPolls();
        console.log("Fetched polls:", data); // Debug log
        setPolls(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching polls:', err);
        setError('Failed to load polls. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Active Polls
        </Typography>
        <Tooltip title={!connected ? "Connect your wallet to create a poll" : "Create a new poll"}>
          <span>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/polls/create"
              disabled={!connected}
            >
              Create Poll
            </Button>
          </span>
        </Tooltip>
      </Box>

      {polls.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No polls available
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Be the first to create a poll!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {polls.map((poll) => {
            // Get top 3 options by votes for mini chart
            const topOptions = [...poll.options]
              .sort((a, b) => b.votes - a.votes)
              .slice(0, 3);
            
            const totalVotes = poll.totalVotes || 0;
            
            return (
              <Grid item xs={12} key={poll.id}>
                <Card className="poll-card" sx={{ overflow: 'visible' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" component="h2" gutterBottom>
                        {poll.title}
                      </Typography>
                      <Chip 
                        label={poll.status.charAt(0).toUpperCase() + poll.status.slice(1)} 
                        color={statusColors[poll.status]} 
                        size="small" 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {poll.description}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <Box display="flex" alignItems="center">
                            <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="textSecondary">
                              Creator: {poll.creator.substring(0, 6)}...{poll.creator.substring(poll.creator.length - 4)}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center">
                            <FormatListBulletedIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="textSecondary">
                              Type: {pollTypeLabels[poll.type]}
                              {poll.maxSelections > 1 && ` (Select up to ${poll.maxSelections})`}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center">
                            <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="textSecondary">
                              Created: {formatDate(poll.createdAt)}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center">
                            <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="textSecondary">
                              Ends: {formatDate(poll.endDate)}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <BarChartIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="textSecondary">
                            Total votes: {totalVotes}
                          </Typography>
                        </Box>
                        
                        {totalVotes > 0 ? (
                          <Box sx={{ mt: 1 }}>
                            {topOptions.map((option) => {
                              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                              return (
                                <Box key={option.id} sx={{ mb: 1 }}>
                                  <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="caption" color="textSecondary" noWrap sx={{ maxWidth: '70%' }}>
                                      {option.text}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                      {option.votes} ({Math.round(percentage)}%)
                                    </Typography>
                                  </Box>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={percentage} 
                                    sx={{ 
                                      height: 6, 
                                      borderRadius: 3,
                                      mt: 0.5
                                    }} 
                                  />
                                </Box>
                              );
                            })}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', mt: 2 }}>
                            No votes yet
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary" 
                      startIcon={<HowToVoteIcon />}
                      component={RouterLink}
                      to={`/poll/${poll.id}`}
                    >
                      {poll.hasVoted ? 'View Results' : 'Vote Now'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default PollList;
