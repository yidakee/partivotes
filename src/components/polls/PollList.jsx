import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
import { ThemeContext } from '../../contexts/ThemeContext';

const statusColors = {
  [POLL_STATUS.ACTIVE]: 'success',
  [POLL_STATUS.ENDED]: 'error',
  [POLL_STATUS.PENDING]: 'warning',
  [POLL_STATUS.CANCELLED]: 'default'
};

const pollTypeLabels = {
  [POLL_TYPE.SINGLE_CHOICE]: 'Simple Choice',
  [POLL_TYPE.MULTIPLE_CHOICE]: 'Multiple Choice',
  [POLL_TYPE.RANKED_CHOICE]: 'Ranked Choice'
};

const pollTypeColors = {
  [POLL_TYPE.SINGLE_CHOICE]: '#3f51b5', // Indigo blue
  [POLL_TYPE.MULTIPLE_CHOICE]: '#9c27b0', // Purple
  [POLL_TYPE.RANKED_CHOICE]: '#00bcd4'  // Cyan (changed from pink to avoid overlap with error/ended)
};

const PollList = () => {
  const { connected } = useContext(WalletContext);
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Get current filter from URL
  const getCurrentFilter = () => {
    const params = new URLSearchParams(location.search);
    return params.get('status') || POLL_STATUS.ACTIVE;
  };

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

  // Filter polls based on the status in the URL
  useEffect(() => {
    const currentFilter = getCurrentFilter();
    const filtered = polls.filter(poll => poll.status === currentFilter);
    setFilteredPolls(filtered);
  }, [polls, location.search]);

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

  const currentFilter = getCurrentFilter();
  const statusTitles = {
    [POLL_STATUS.ACTIVE]: 'Active Polls',
    [POLL_STATUS.PENDING]: 'Pending Polls',
    [POLL_STATUS.ENDED]: 'Finished Polls'
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {statusTitles[currentFilter]}
        </Typography>
        <Tooltip title={!connected ? "Connect your wallet to create a poll" : "Create a new poll"}>
          <span>
            <Button 
              variant={isFuturistic ? "outlined" : "contained"}
              color="primary"
              startIcon={<AddIcon sx={{ color: isFuturistic ? '#fff' : undefined }} />}
              component={RouterLink}
              to="/polls/create"
              disabled={!connected}
              sx={{
                ...(isFuturistic && {
                  background: 'linear-gradient(45deg, #ff00cc, #ff0055)', // Neon magenta gradient
                  color: '#ffffff !important', // Pure white with !important
                  fontWeight: 'bold',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 0 15px rgba(255, 0, 204, 0.5)', // Magenta glow
                  textShadow: '0 0 2px rgba(255, 255, 255, 0.5)',
                  '& .MuiSvgIcon-root': {
                    color: '#ffffff !important', // Force white icon
                  },
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ff33cc, #ff3377)',
                    boxShadow: '0 0 20px rgba(255, 0, 204, 0.8)',
                    transform: 'translateY(-2px)',
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(255, 0, 204, 0.3)',
                    color: 'rgba(255, 255, 255, 0.7) !important'
                  }
                })
              }}
            >
              <span style={{ color: isFuturistic ? '#ffffff' : undefined }}>Create Poll</span>
            </Button>
          </span>
        </Tooltip>
      </Box>

      {filteredPolls.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No {currentFilter.toLowerCase()} polls available
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {currentFilter === POLL_STATUS.ACTIVE && "Be the first to create an active poll!"}
            {currentFilter === POLL_STATUS.PENDING && "No pending polls at the moment."}
            {currentFilter === POLL_STATUS.ENDED && "No finished polls yet."}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPolls.map((poll) => {
            // Get top 3 options by votes for mini chart
            const topOptions = [...poll.options]
              .sort((a, b) => b.votes - a.votes)
              .slice(0, 3);
            
            const totalVotes = poll.totalVotes || 0;
            
            return (
              <Grid item xs={12} sm={6} key={poll.id}>
                <Card className="poll-card" sx={{ 
                  overflow: 'visible', 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => `0 8px 16px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.1)'}`
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" component="h2" gutterBottom noWrap sx={{ maxWidth: '70%' }}>
                        {poll.title}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Chip 
                          label="Mock Poll"
                          color="secondary"
                          size="small"
                          sx={{ 
                            backgroundColor: '#ff9800', 
                            color: '#fff',
                            fontWeight: 'bold'
                          }}
                        />
                        <Chip 
                          label={poll.status.charAt(0).toUpperCase() + poll.status.slice(1)} 
                          color={statusColors[poll.status]} 
                          size="small" 
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          backgroundColor: pollTypeColors[poll.type],
                          color: 'white',
                          borderRadius: '16px',
                          px: 1.5,
                          py: 0.5,
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                        }}
                      >
                        {pollTypeLabels[poll.type]}
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="textSecondary" 
                      paragraph 
                      sx={{ 
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        height: '40px'
                      }}
                    >
                      {poll.description}
                    </Typography>
                    
                    <Box sx={{ mt: 1, mb: 1 }}>
                      <Box display="flex" alignItems="center">
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="textSecondary">
                          Started: {formatDate(poll.startDate)}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mt={1}>
                        <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="textSecondary">
                          Ends: {formatDate(poll.endDate)}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mt={1}>
                        <BarChartIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="textSecondary">
                          Total votes: {totalVotes}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {totalVotes > 0 && topOptions.length > 0 ? (
                      <Box sx={{ mt: 1 }}>
                        {topOptions.slice(0, 2).map((option) => {
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
                      <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', mt: 1, mb: 1 }}>
                        No votes yet
                      </Typography>
                    )}
                  </CardContent>
                  
                  <Box 
                    component={RouterLink} 
                    to={`/poll/${poll.id}`}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mt: 'auto',
                      backgroundColor: '#556cd6',
                      color: 'white',
                      padding: '10px 0',
                      textDecoration: 'none',
                      borderRadius: '0 0 20px 20px',
                      transition: 'background-color 0.3s',
                      '&:hover': {
                        backgroundColor: '#4559b5',
                      }
                    }}
                  >
                    <Typography variant="button" sx={{ fontWeight: 'bold' }}>
                      View Details
                    </Typography>
                  </Box>
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
