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
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { getPolls } from '../../services/pollService';
import { formatDate, getRelativeTime } from '../../utils/dateUtils';
import { POLL_STATUS } from '../../utils/constants';
import { WalletContext } from '../../contexts/WalletContext';

const statusColors = {
  [POLL_STATUS.ACTIVE]: 'success',
  [POLL_STATUS.ENDED]: 'error',
  [POLL_STATUS.PENDING]: 'warning',
  [POLL_STATUS.CANCELLED]: 'default'
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
          {polls.map((poll) => (
            <Grid item xs={12} key={poll.id}>
              <Card className="poll-card">
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
                  
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="body2" color="textSecondary">
                      Total votes: {poll.totalVotes}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Ends: {formatDate(poll.endDate)}
                    </Typography>
                  </Box>
                </CardContent>
                
                <Divider />
                
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary" 
                    startIcon={<HowToVoteIcon />}
                    component={RouterLink}
                    to={`/polls/${poll.id}`}
                  >
                    {poll.hasVoted ? 'View Results' : 'Vote Now'}
                  </Button>
                  <Box flexGrow={1} />
                  <Typography variant="caption" color="textSecondary">
                    Created {getRelativeTime(poll.createdAt)}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PollList;
