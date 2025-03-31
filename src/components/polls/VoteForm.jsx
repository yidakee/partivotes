import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  FormControl, 
  FormControlLabel, 
  FormGroup,
  Radio, 
  RadioGroup,
  Checkbox,
  CircularProgress,
  Paper,
  Alert,
  styled
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import { voteWithSignature, voteWithMPC } from '../../services/polls/voting';
import { WalletContext } from '../../contexts/WalletContext';
import { POLL_TYPE } from '../../utils/constants';

// Custom styled round checkbox
const RoundCheckbox = styled(Checkbox)({
  '& .MuiSvgIcon-root': {
    borderRadius: '50%',
  },
  '&.MuiCheckbox-root': {
    color: '#aaaaaa',
    '&.Mui-checked': {
      color: '#6200ee',
    }
  }
});

// Styled radio button
const StyledRadio = styled(Radio)({
  '&.MuiRadio-root': {
    color: '#aaaaaa',
    '&.Mui-checked': {
      color: '#6200ee',
    }
  }
});

/**
 * VoteForm component for casting votes on polls
 */
const VoteForm = ({ poll, onVoteSubmitted }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [voteMethod, setVoteMethod] = useState('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { wallet } = useContext(WalletContext);
  const { connected, address } = wallet || { connected: false, address: null };
  
  const isSingleChoice = poll.type === POLL_TYPE.SINGLE_CHOICE;
  
  // Reset selected options when poll changes
  useEffect(() => {
    setSelectedOptions([]);
    setError(null);
    setSuccess(false);
  }, [poll._id]);
  
  // Handle checkbox/radio change
  const handleOptionChange = (event) => {
    const optionIndex = event.target.value;
    
    if (isSingleChoice) {
      // Single choice - just set the selected option
      setSelectedOptions([optionIndex]);
    } else {
      // Multiple choice - add or remove from array
      const currentSelections = [...selectedOptions];
      
      if (currentSelections.includes(optionIndex)) {
        // Remove if already selected
        setSelectedOptions(currentSelections.filter(opt => opt !== optionIndex));
      } else {
        // Add if not selected
        if (currentSelections.length < poll.maxSelections) {
          setSelectedOptions([...currentSelections, optionIndex]);
        } else {
          setError(`Maximum ${poll.maxSelections} selections allowed`);
        }
      }
    }
  };
  
  // Handle vote method change
  const handleVoteMethodChange = (event) => {
    setVoteMethod(event.target.value);
  };
  
  // Submit vote
  const handleVote = async () => {
    if (selectedOptions.length === 0) {
      setError('Please select at least one option');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Selected options before processing:', selectedOptions);
      
      // Convert selected option indices to option text values
      const selectedOptionTexts = selectedOptions.map(index => {
        const optionIndex = parseInt(index, 10);
        // Extract just the text from the option object
        return poll.options[optionIndex].text;
      });
      
      console.log('Sending option texts to server:', selectedOptionTexts);

      // Use the appropriate voting method based on user selection
      let updatedPoll;
      if (voteMethod === 'public') {
        // Public vote with signature
        updatedPoll = await voteWithSignature(
          poll._id,
          selectedOptionTexts,
          `${address || 'anonymous'}:${Date.now()}`
        );
      } else {
        // Private vote with MPC
        updatedPoll = await voteWithMPC(
          poll._id,
          selectedOptionTexts
        );
      }

      console.log('Vote submitted successfully:', updatedPoll);
      
      // Show success message
      setSuccess(true);
      
      // Notify parent component that vote was submitted
      if (onVoteSubmitted) {
        onVoteSubmitted(updatedPoll);
      }
    } catch (err) {
      console.error('Error submitting vote:', err);
      // Display a more user-friendly error message
      if (err.message && err.message.includes('Failed to fetch')) {
        setError('Could not connect to the voting server. Please check your connection and try again.');
      } else {
        setError(err.message || 'Failed to submit vote. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If already voted, show message
  if (poll.hasVoted) {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Alert severity="success">
          You have already voted on this poll.
        </Alert>
      </Box>
    );
  }
  
  // If success, show message
  if (success) {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Alert severity="success">
          Your vote has been recorded successfully!
        </Alert>
      </Box>
    );
  }
  
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cast Your Vote
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {isSingleChoice 
            ? 'Select 1 option:' 
            : `Select up to ${poll.maxSelections} options:`}
        </Typography>
        
        <FormControl component="fieldset" fullWidth>
          {isSingleChoice ? (
            <RadioGroup value={selectedOptions[0] || ''} onChange={handleOptionChange}>
              {poll.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index.toString()}
                  control={<StyledRadio />}
                  label={option.text}
                />
              ))}
            </RadioGroup>
          ) : (
            <FormGroup>
              {poll.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <RoundCheckbox
                      checked={selectedOptions.includes(index.toString())}
                      onChange={handleOptionChange}
                      value={index.toString()}
                    />
                  }
                  label={option.text}
                />
              ))}
            </FormGroup>
          )}
        </FormControl>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Vote method:
        </Typography>
        
        <RadioGroup
          row
          value={voteMethod}
          onChange={handleVoteMethodChange}
        >
          <FormControlLabel 
            value="public" 
            control={<StyledRadio />} 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PublicIcon fontSize="small" sx={{ mr: 0.5 }} />
                Public (Signature)
              </Box>
            }
          />
          <FormControlLabel 
            value="private" 
            control={<StyledRadio />} 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LockIcon fontSize="small" sx={{ mr: 0.5 }} />
                Private (MPC)
              </Box>
            }
          />
        </RadioGroup>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleVote}
        disabled={isSubmitting || selectedOptions.length === 0}
        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
        fullWidth
      >
        {isSubmitting ? 'Submitting...' : 'Cast Vote'}
      </Button>
    </Paper>
  );
};

export default VoteForm;
