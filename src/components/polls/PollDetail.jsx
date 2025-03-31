import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Chip,
  Divider,
  Alert,
  AlertTitle,
  Skeleton,
  Grid,
  LinearProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatDate } from '../../utils/dateUtils';
import { POLL_STATUS } from '../../utils/constants';
import VoteForm from './VoteForm';
import PollResults from './PollResults';
import { getPoll } from '../../services/pollService';
import { WalletContext } from '../../contexts/WalletContext';

const statusColors = {
  [POLL_STATUS.ACTIVE]: 'success',
  [POLL_STATUS.ENDED]: 'error',
  [POLL_STATUS.PENDING]: 'warning',
  [POLL_STATUS.CANCELLED]: 'default'
};

const PollDetail = () => {
  console.log('=== PollDetail RENDERING ===');
  
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { connected, address } = useContext(WalletContext);
  
  // Check if the URL has a view=vote query parameter
  const searchParams = new URLSearchParams(location.search);
  const viewParam = searchParams.get('view');
  
  console.log('=== URL PARAMETERS ===', {
    fullUrl: location.pathname + location.search,
    search: location.search,
    viewParam: viewParam
  });
  
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [userPreference, setUserPreference] = useState(null);
  
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const pollData = await getPoll(id);
        console.log('=== POLL DATA FETCHED ===', {
          id,
          pollData,
          hasVoted: pollData?.hasVoted,
          status: pollData?.status
        });
        
        if (!pollData) {
          setError('Poll not found');
          setLoading(false);
          return;
        }
        
        setPoll(pollData);
        
        // Determine initial view based on URL parameter and poll status
        if (pollData.status === POLL_STATUS.ENDED) {
          // Always show results for ended polls
          console.log('=== SETTING showResults to TRUE because poll ended ===');
          setShowResults(true);
        } else if (userPreference !== null) {
          // Respect user's explicit preference if they've toggled the view
          setShowResults(userPreference === 'results');
        } else {
          // Default to showing results first for consistency
          console.log('=== SETTING showResults to TRUE to show results first ===');
          setShowResults(true);
        }
      } catch (err) {
        console.error('Error fetching poll:', err);
        setError('Failed to load poll. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPoll();
  }, [id, viewParam, userPreference]);
  
  // This effect runs when the poll is updated after voting
  useEffect(() => {
    // If the user has voted and we haven't recorded their preference yet
    if (poll && poll.hasVoted && userPreference === null) {
      console.log('=== User has voted, showing results ===');
      setShowResults(true);
    }
  }, [poll, userPreference]);
  
  const handleBack = () => {
    navigate('/polls');
  };
  
  const toggleView = () => {
    console.log('=== TOGGLE VIEW called ===', {
      currentShowResults: showResults,
      willBe: !showResults
    });
    
    // Record user's explicit preference
    setUserPreference(showResults ? 'vote' : 'results');
    setShowResults(!showResults);
  };

  // Log before each render decision
  console.log('=== PollDetail RENDER DECISION ===', {
    showResults,
    hasVoted: poll?.hasVoted,
    status: poll?.status,
    userPreference,
    viewParam,
    isComponentReady: !loading && !error && poll
  });
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h5" component="h1">
            Loading Poll...
          </Typography>
        </Box>
        
        <LinearProgress sx={{ mb: 2 }} />
        
        <Paper sx={{ p: 3 }}>
          <Box mb={2}>
            <Skeleton variant="text" height={40} width="70%" />
            <Skeleton variant="text" height={20} width="40%" />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={100} />
          </Box>
        </Paper>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h5" component="h1">
            Poll Details
          </Typography>
        </Box>
        
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleBack}
        >
          Return to Polls
        </Button>
      </Container>
    );
  }
  
  if (!poll) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h5" component="h1">
            Poll Not Found
          </Typography>
        </Box>
        
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Poll Not Found</AlertTitle>
          The poll you're looking for doesn't exist or has been removed.
        </Alert>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleBack}
        >
          Return to Polls
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" component="h1">
          {poll.title}
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="body1" paragraph>
              {poll.description}
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              <Chip 
                label={poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
                color={statusColors[poll.status]}
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
              
              <Chip 
                label={`Type: ${poll.type.replace(/_/g, ' ').toLowerCase()}`}
                variant="outlined"
                size="small" 
              />
              
              {poll.maxSelections > 1 && (
                <Chip 
                  label={`Select up to ${poll.maxSelections}`}
                  variant="outlined"
                  size="small" 
                />
              )}
            </Box>
            
            <Typography variant="body2" color="textSecondary">
              Created: {formatDate(poll.createdAt)}
            </Typography>
            
            <Typography variant="body2" color="textSecondary">
              Ends: {formatDate(poll.endDate)}
            </Typography>
            
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Created by: {poll.creator.substring(0, 6)}...{poll.creator.substring(poll.creator.length - 4)}
            </Typography>
          </Box>
          
          {poll.status !== POLL_STATUS.PENDING && (
            <Button 
              variant="outlined"
              onClick={toggleView}
              disabled={poll.status === POLL_STATUS.PENDING}
            >
              {showResults ? 'Vote Form' : 'View Results'}
            </Button>
          )}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {poll.status === POLL_STATUS.PENDING ? (
          <Alert severity="info">
            <AlertTitle>Poll Not Yet Started</AlertTitle>
            This poll has not started yet. Voting will be available once the poll becomes active.
          </Alert>
        ) : showResults ? (
          <PollResults poll={poll} />
        ) : (
          <VoteForm poll={poll} setPoll={setPoll} />
        )}
      </Paper>
    </Container>
  );
};

export default PollDetail;
