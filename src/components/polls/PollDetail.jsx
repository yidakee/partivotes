import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { WalletContext } from '../../contexts/WalletContext';
import { getPoll, endPoll } from '../../services/pollService';
import { formatDate, getRelativeTime, isPastDate } from '../../utils/dateUtils';
import { POLL_STATUS } from '../../utils/constants';
import VoteForm from './VoteForm';
import PollResults from './PollResults';

const statusColors = {
  [POLL_STATUS.ACTIVE]: 'success',
  [POLL_STATUS.ENDED]: 'error',
  [POLL_STATUS.PENDING]: 'warning',
  [POLL_STATUS.CANCELLED]: 'default'
};

const PollDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { connected, address } = useContext(WalletContext);
  
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [endingPoll, setEndingPoll] = useState(false);
  const [confirmEndDialogOpen, setConfirmEndDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const data = await getPoll(id);
        
        // Check if current user is the creator
        if (connected && address) {
          data.isCreator = data.creator === address;
        }
        
        // Check if current user has voted
        if (connected && address) {
          // In a real app, this would check the blockchain for votes
          // For mock data, we'll use the hasVoted flag from the poll
          data.hasVoted = data.hasVoted || false;
        }
        
        setPoll(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching poll:', err);
        setError('Failed to load poll. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPoll();
  }, [id, connected, address]);
  
  const handleOpenEndDialog = () => {
    if (!connected || !poll.isCreator) {
      return;
    }
    setConfirmEndDialogOpen(true);
  };
  
  const handleCloseEndDialog = () => {
    setConfirmEndDialogOpen(false);
  };
  
  const handleEndPoll = async () => {
    if (!connected || !poll.isCreator) {
      return;
    }
    
    setConfirmEndDialogOpen(false);
    
    try {
      setEndingPoll(true);
      console.log(`Ending poll ${id}...`);
      
      const updatedPoll = await endPoll(id);
      console.log('Poll ended successfully:', updatedPoll);
      
      setPoll(updatedPoll);
    } catch (err) {
      console.error('Error ending poll:', err);
      setError('Failed to end poll. Please try again.');
    } finally {
      setEndingPoll(false);
    }
  };
  
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
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="outlined" onClick={() => navigate('/polls')}>
            Back to Polls
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!poll) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h6" align="center">
          Poll not found
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="outlined" onClick={() => navigate('/polls')}>
            Back to Polls
          </Button>
        </Box>
      </Container>
    );
  }
  
  const isActive = poll.status === POLL_STATUS.ACTIVE;
  const isEnded = poll.status === POLL_STATUS.ENDED;
  const isPending = poll.status === POLL_STATUS.PENDING;
  
  // Can vote if:
  // 1. Poll is active
  // 2. User is connected
  // 3. User has not voted yet
  const canVote = isActive && connected && !poll.hasVoted;
  
  // Can end poll if:
  // 1. Poll is active
  // 2. User is connected
  // 3. User is the creator
  const canEndPoll = isActive && connected && poll.isCreator;
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/polls')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Poll Details
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h5" component="h2" gutterBottom>
            {poll.title}
          </Typography>
          <Chip 
            label={poll.status} 
            color={statusColors[poll.status]} 
            variant="outlined" 
          />
        </Box>
        
        <Typography variant="body1" paragraph>
          {poll.description}
        </Typography>
        
        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          <Box display="flex" alignItems="center">
            <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Created by: {poll.creator.substr(0, 6)}...{poll.creator.substr(-4)}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center">
            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {isEnded ? 'Ended' : 'Ends'}: {formatDate(poll.endDate, 'Pp')} ({getRelativeTime(poll.endDate)})
            </Typography>
          </Box>
        </Box>
        
        {isPending && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            This poll has not started yet. Voting will begin on {formatDate(poll.startDate, 'Pp')}.
          </Alert>
        )}
        
        {isEnded && (
          <Alert severity="info" sx={{ mb: 3 }}>
            This poll has ended. Voting closed on {formatDate(poll.endDate, 'Pp')}.
          </Alert>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        {canVote ? (
          <VoteForm poll={poll} setPoll={setPoll} />
        ) : (
          <PollResults poll={poll} />
        )}
        
        {canEndPoll && (
          <Box mt={4} display="flex" justifyContent="center">
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleOpenEndDialog}
              disabled={endingPoll}
            >
              {endingPoll ? 'Ending Poll...' : 'End Poll Now'}
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* End Poll Confirmation Dialog */}
      <Dialog
        open={confirmEndDialogOpen}
        onClose={handleCloseEndDialog}
        aria-labelledby="end-poll-dialog-title"
      >
        <DialogTitle id="end-poll-dialog-title">
          End Poll Early?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to end this poll early? This action cannot be undone.
            All current votes will be counted and no new votes will be accepted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEndDialog}>Cancel</Button>
          <Button onClick={handleEndPoll} color="error" autoFocus>
            End Poll
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PollDetail;
