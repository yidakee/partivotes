import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Button,
  Alert,
  AlertTitle,
  Paper,
  Divider,
  Chip,
  Fade,
  useTheme,
  CircularProgress
} from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { voteWithSignature, voteWithMPC } from '../../services/pollService';
import { WalletContext } from '../../contexts/WalletContext';
import { POLL_TYPE } from '../../utils/constants';

const VoteForm = ({ poll, setPoll }) => {
  console.log('=== VoteForm RENDERING ===', {
    poll,
    hasVoted: poll?.hasVoted
  });
  
  const { connected, balance, address } = useContext(WalletContext);
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [voteMethod, setVoteMethod] = useState('signature');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const isSingleChoice = poll.type === POLL_TYPE.SINGLE_CHOICE;
  const isMultipleChoice = poll.type === POLL_TYPE.MULTIPLE_CHOICE;
  
  const maxSelections = poll.maxSelections || 1;
  
  useEffect(() => {
    // Reset form state when poll changes
    setSelectedOptions([]);
    setVoteMethod('signature');
    setSuccess(false);
    setError(null);
  }, [poll.id]);
  
  const handleSingleChoiceChange = (event) => {
    setSelectedOptions([event.target.value]);
  };
  
  const handleMultipleChoiceChange = (event) => {
    const { value, checked } = event.target;
    
    if (checked) {
      // Add to selected options, but respect maxSelections
      if (selectedOptions.length < maxSelections) {
        setSelectedOptions([...selectedOptions, value]);
      }
    } else {
      // Remove from selected options
      setSelectedOptions(selectedOptions.filter(option => option !== value));
    }
  };
  
  const handleVoteMethodChange = (event) => {
    setVoteMethod(event.target.value);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (selectedOptions.length === 0) {
      setError('Please select at least one option');
      return;
    }
    
    if (!connected) {
      setError('Please connect your wallet to vote');
      return;
    }

    console.log('=== VoteForm SUBMITTING ===', {
      selectedOptions,
      voteMethod
    });
    
    if (isMultipleChoice && selectedOptions.length > maxSelections) {
      setError(`You can only select up to ${maxSelections} options`);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // This would be a real blockchain transaction in a production app
      let updatedPoll;
      
      if (voteMethod === 'signature') {
        const votePayload = isSingleChoice ? selectedOptions[0] : selectedOptions;
        updatedPoll = await voteWithSignature(
          poll.id, 
          votePayload, 
          address
        );
      } else {
        // MPC voting (private)
        const votePayload = isSingleChoice ? selectedOptions[0] : selectedOptions;
        updatedPoll = await voteWithMPC(
          poll.id, 
          votePayload, 
          address
        );
      }
      
      if (updatedPoll) {
        console.log('=== VoteForm VOTE SUCCESS ===', {
          updatedPoll,
          hasVoted: updatedPoll.hasVoted
        });
        
        // Store the original poll object for comparison
        const originalPoll = { ...poll };
        
        // FIX: Update the poll with hasVoted immediately instead of using setTimeout
        // This prevents race conditions between state updates
        const updatedPollWithVoteStatus = {
          ...updatedPoll,
          hasVoted: true
        };
        
        console.log('=== VoteForm SETTING POLL WITH hasVoted TRUE ===', {
          originalPoll,
          updatedPollWithVoteStatus
        });
        
        setSuccess(true);
        setPoll(updatedPollWithVoteStatus);
        
        console.log('=== VoteForm SET POLL COMPARISON ===', {
          before: originalPoll,
          after: updatedPollWithVoteStatus,
          differences: Object.keys(updatedPollWithVoteStatus).filter(key => 
            JSON.stringify(updatedPollWithVoteStatus[key]) !== JSON.stringify(originalPoll[key])
          )
        });
      } else {
        setError('Failed to submit vote. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting vote:', err);
      setError('Failed to submit vote: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewResults = () => {
    console.log('=== VoteForm VIEW RESULTS BUTTON CLICKED ===');
    // Navigate to the correct poll URL using the singular "poll" path
    navigate(`/poll/${poll.id}`);
  };
  
  // Format balance for display
  const formatBalance = () => {
    if (!balance) return 0;
    
    // Handle balance as object with balance and token properties
    if (typeof balance === 'object' && balance !== null) {
      return balance.balance || 0;
    }
    
    // Handle balance as number or string
    return balance;
  };

  // Get formatted balance value for comparisons
  const balanceValue = formatBalance();
  
  if (success) {
    return (
      <Fade in={success}>
        <Box>
          <Alert severity="success" sx={{ mb: 3 }}>
            Your vote has been submitted successfully!
          </Alert>
          <Typography variant="body1" paragraph>
            Thank you for participating in this poll. Your vote has been recorded and is now part of the results.
          </Typography>
          <Box textAlign="center">
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleViewResults}
            >
              View Results
            </Button>
          </Box>
        </Box>
      </Fade>
    );
  }
  
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        <HowToVoteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Cast Your Vote
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <FormControl component="fieldset" fullWidth error={!!error}>
          {isSingleChoice && (
            <RadioGroup
              value={selectedOptions[0] || ''}
              onChange={handleSingleChoiceChange}
            >
              {poll.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio />}
                  label={option.text}
                />
              ))}
            </RadioGroup>
          )}
          
          {isMultipleChoice && (
            <FormGroup>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Select up to {maxSelections} options
              </Typography>
              
              {poll.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  control={
                    <Checkbox 
                      checked={selectedOptions.includes(option.id)}
                      onChange={handleMultipleChoiceChange}
                      value={option.id}
                      disabled={!selectedOptions.includes(option.id) && selectedOptions.length >= maxSelections}
                    />
                  }
                  label={option.text}
                />
              ))}
            </FormGroup>
          )}
        </FormControl>
      </Paper>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Voting Method
        </Typography>
        
        <RadioGroup
          row
          value={voteMethod}
          onChange={handleVoteMethodChange}
        >
          <FormControlLabel 
            value="signature" 
            control={<Radio />} 
            label={
              <Box display="flex" alignItems="center">
                <PublicIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                Public Vote
              </Box>
            }
          />
          <FormControlLabel 
            value="mpc" 
            control={<Radio />} 
            label={
              <Box display="flex" alignItems="center">
                <LockIcon color="secondary" fontSize="small" sx={{ mr: 0.5 }} />
                Private Vote
                <Chip 
                  label={`${poll.mpcCost || 5} tokens`} 
                  size="small" 
                  color="secondary" 
                  sx={{ ml: 1 }} 
                />
              </Box>
            }
            disabled={balanceValue < (poll.mpcCost || 5)}
          />
        </RadioGroup>
        
        {voteMethod === 'mpc' && (
          <Alert severity="info" sx={{ mt: 1 }}>
            <AlertTitle>Private Voting</AlertTitle>
            Your vote will be kept private using secure multi-party computation (MPC).
            This requires {poll.mpcCost || 5} tokens.
          </Alert>
        )}
        
        {voteMethod === 'signature' && (
          <Alert severity="info" sx={{ mt: 1 }}>
            <AlertTitle>Public Voting</AlertTitle>
            Your vote will be publicly visible on the blockchain. This method is free.
          </Alert>
        )}
      </Paper>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box textAlign="right">
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={selectedOptions.length === 0 || loading || !connected}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleOutlineIcon />}
        >
          {loading ? 'Submitting...' : 'Submit Vote'}
        </Button>
      </Box>
    </Box>
  );
};

export default VoteForm;
