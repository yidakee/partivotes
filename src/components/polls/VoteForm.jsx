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
import { voteWithSignature, voteWithMPC } from '../../services/polls/voting';
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
    
    // Log poll options for debugging
    console.log('Poll options in VoteForm:', poll.options);
  }, [poll._id]);
  
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
      voteMethod,
      pollOptions: poll.options
    });
    
    if (isMultipleChoice && selectedOptions.length > maxSelections) {
      setError(`You can only select up to ${maxSelections} options`);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Convert selected option indices to option text values (not objects)
      // This is the critical fix - we need to send text values, not objects
      const selectedOptionTexts = selectedOptions.map(index => {
        const optionIndex = parseInt(index, 10);
        // Extract just the text from the option object
        return poll.options[optionIndex].text;
      });
      
      console.log('Selected option texts for API:', selectedOptionTexts);
      
      // This would be a real blockchain transaction in a production app
      let updatedPoll;
      
      if (voteMethod === 'signature') {
        // Send option text values directly, not objects
        const votePayload = isSingleChoice ? selectedOptionTexts[0] : selectedOptionTexts;
        updatedPoll = await voteWithSignature(
          poll._id, 
          votePayload, 
          address
        );
      } else {
        // MPC voting (private)
        // Send option text values directly, not objects
        const votePayload = isSingleChoice ? selectedOptionTexts[0] : selectedOptionTexts;
        updatedPoll = await voteWithMPC(
          poll._id, 
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
  
  // If the user has already voted, show a success message
  if (poll.hasVoted) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Thank you for voting!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your vote has been recorded successfully.
          </Typography>
        </Box>
      </Paper>
    );
  }
  
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cast Your Vote
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <form onSubmit={handleSubmit}>
        {/* Poll options */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            {isSingleChoice ? 'Select one option:' : `Select up to ${maxSelections} options:`}
          </Typography>
          
          {isSingleChoice ? (
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedOptions[0] || ''}
                onChange={handleSingleChoiceChange}
              >
                {poll.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index.toString()}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Typography>{option.text}</Typography>
                        <Chip 
                          label={`${option.votes || 0} votes`} 
                          size="small" 
                          variant="outlined"
                          sx={{ ml: 2 }}
                        />
                      </Box>
                    }
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ) : (
            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                {poll.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox 
                        checked={selectedOptions.includes(index.toString())}
                        onChange={handleMultipleChoiceChange}
                        value={index.toString()}
                        disabled={selectedOptions.length >= maxSelections && !selectedOptions.includes(index.toString())}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Typography>{option.text}</Typography>
                        <Chip 
                          label={`${option.votes || 0} votes`} 
                          size="small" 
                          variant="outlined"
                          sx={{ ml: 2 }}
                        />
                      </Box>
                    }
                    sx={{ mb: 1 }}
                  />
                ))}
              </FormGroup>
            </FormControl>
          )}
        </Box>
        
        {/* Vote method selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Vote method:
          </Typography>
          
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={voteMethod}
              onChange={handleVoteMethodChange}
            >
              <FormControlLabel 
                value="signature" 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PublicIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography>Public (Signature)</Typography>
                  </Box>
                }
              />
              <FormControlLabel 
                value="mpc" 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LockIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography>Private (MPC)</Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>
        
        {/* Error message */}
        {error && (
          <Fade in={!!error}>
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          </Fade>
        )}
        
        {/* Success message */}
        {success && (
          <Fade in={success}>
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Success</AlertTitle>
              Your vote has been recorded successfully!
            </Alert>
          </Fade>
        )}
        
        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading || selectedOptions.length === 0 || !connected}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <HowToVoteIcon />}
          fullWidth
        >
          {loading ? 'Submitting...' : 'Cast Vote'}
        </Button>
      </form>
    </Paper>
  );
};

export default VoteForm;
