import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Alert,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import { WalletContext } from '../../contexts/WalletContext';
import { voteWithMPC, voteWithSignature } from '../../services/pollService';
import { POLL_TYPE, MPC_COST_PER_VOTE } from '../../utils/constants';
import { playSuccessSound, playErrorSound } from '../../utils/soundEffects';

const VoteForm = ({ poll, setPoll }) => {
  const { connected, balance } = useContext(WalletContext);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  
  const isSingleChoice = poll.type === POLL_TYPE.SINGLE_CHOICE;
  const isMultipleChoice = poll.type === POLL_TYPE.MULTIPLE_CHOICE;
  const isRankedChoice = poll.type === POLL_TYPE.RANKED_CHOICE;
  
  const handleSingleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setError('');
  };
  
  const handleMultipleOptionChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    
    if (isChecked) {
      // Add to selected options if not already selected
      if (!selectedOptions.includes(value)) {
        // Check if we're at the max selections
        if (selectedOptions.length >= poll.maxSelections) {
          setError(`You can only select up to ${poll.maxSelections} options`);
          playErrorSound();
          return;
        }
        
        setSelectedOptions([...selectedOptions, value]);
      }
    } else {
      // Remove from selected options
      setSelectedOptions(selectedOptions.filter(option => option !== value));
    }
    
    setError('');
  };
  
  const handleVoteClick = (e) => {
    e.preventDefault();
    
    if (!connected) {
      setError('Please connect your wallet to vote');
      playErrorSound();
      return;
    }
    
    if (isSingleChoice && !selectedOption) {
      setError('Please select an option');
      playErrorSound();
      return;
    }
    
    if (isMultipleChoice && selectedOptions.length === 0) {
      setError('Please select at least one option');
      playErrorSound();
      return;
    }
    
    if (isMultipleChoice && selectedOptions.length > poll.maxSelections) {
      setError(`You can only select up to ${poll.maxSelections} options`);
      playErrorSound();
      return;
    }
    
    // Open the vote method dialog
    setVoteDialogOpen(true);
  };
  
  const handleCloseVoteDialog = () => {
    setVoteDialogOpen(false);
  };
  
  const handleVoteWithSignature = async () => {
    try {
      setLoading(true);
      setError('');
      setVoteDialogOpen(false);
      
      console.log(`Voting with signature in poll ${poll.id} for option ${isSingleChoice ? selectedOption : selectedOptions}`);
      
      let updatedPoll;
      
      if (isSingleChoice) {
        updatedPoll = await voteWithSignature(poll.id, selectedOption);
      } else if (isMultipleChoice) {
        updatedPoll = await voteWithSignature(poll.id, selectedOptions);
      }
      
      console.log('Vote with signature successful:', updatedPoll);
      
      // Update the poll state with the returned data
      updatedPoll.hasVoted = true; // Ensure hasVoted is set
      setPoll(updatedPoll);
      setSuccess(true);
      
      // Play success sound
      playSuccessSound();
      
      // Store the vote in localStorage to persist across refreshes
      localStorage.setItem(`voted_poll_${poll.id}`, 'true');
    } catch (err) {
      console.error('Error voting with signature:', err);
      setError('Failed to submit your vote. Please try again.');
      playErrorSound();
    } finally {
      setLoading(false);
    }
  };
  
  const handleVoteWithMPC = async () => {
    try {
      setLoading(true);
      setError('');
      setVoteDialogOpen(false);
      
      if (balance < MPC_COST_PER_VOTE) {
        setError(`Insufficient balance. You need at least ${MPC_COST_PER_VOTE} tokens for a private vote.`);
        playErrorSound();
        return;
      }
      
      console.log(`Voting with MPC in poll ${poll.id} for option ${isSingleChoice ? selectedOption : selectedOptions}`);
      
      let updatedPoll;
      
      if (isSingleChoice) {
        updatedPoll = await voteWithMPC(poll.id, selectedOption);
      } else if (isMultipleChoice) {
        updatedPoll = await voteWithMPC(poll.id, selectedOptions);
      }
      
      console.log('Vote with MPC successful:', updatedPoll);
      
      // Update the poll state with the returned data
      updatedPoll.hasVoted = true; // Ensure hasVoted is set
      setPoll(updatedPoll);
      setSuccess(true);
      
      // Play success sound
      playSuccessSound();
      
      // Store the vote in localStorage to persist across refreshes
      localStorage.setItem(`voted_poll_${poll.id}`, 'true');
    } catch (err) {
      console.error('Error voting with MPC:', err);
      setError('Failed to submit your vote. Please try again.');
      playErrorSound();
    } finally {
      setLoading(false);
    }
  };
  
  // Check if the user has already voted when the poll changes
  useEffect(() => {
    if (poll && poll.hasVoted) {
      setSuccess(true);
    }
  }, [poll]);
  
  if (success) {
    return (
      <Box>
        <Alert severity="success" sx={{ mb: 3 }}>
          Your vote has been successfully recorded!
        </Alert>
        <Typography variant="h6" gutterBottom>
          Poll Results
        </Typography>
        <Box>
          {poll.options.map((option) => (
            <Box key={option.id} sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1">
                  {option.text}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.votes} votes
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  height: 10, 
                  bgcolor: 'background.paper', 
                  borderRadius: 5, 
                  mt: 1, 
                  position: 'relative', 
                  overflow: 'hidden' 
                }}
              >
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    height: '100%', 
                    bgcolor: 'primary.main', 
                    width: `${poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0}%`, 
                    borderRadius: 5 
                  }} 
                />
              </Box>
            </Box>
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Total votes: {poll.totalVotes}
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Cast Your Vote
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <FormControl component="fieldset" error={!!error} fullWidth>
        <FormLabel component="legend">
          {isSingleChoice && 'Select one option:'}
          {isMultipleChoice && `Select up to ${poll.maxSelections} options:`}
          {isRankedChoice && 'Rank the options in order of preference:'}
        </FormLabel>
        
        {isSingleChoice && (
          <RadioGroup value={selectedOption} onChange={handleSingleOptionChange}>
            {poll.options.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.text}
                sx={{ mb: 1 }}
              />
            ))}
          </RadioGroup>
        )}
        
        {isMultipleChoice && (
          <Box>
            {poll.options.map((option) => (
              <FormControlLabel
                key={option.id}
                control={
                  <Checkbox
                    checked={selectedOptions.includes(option.id)}
                    onChange={handleMultipleOptionChange}
                    value={option.id}
                    disabled={!selectedOptions.includes(option.id) && selectedOptions.length >= poll.maxSelections}
                  />
                }
                label={option.text}
                sx={{ mb: 1, display: 'block' }}
              />
            ))}
            <FormHelperText>
              {selectedOptions.length} of {poll.maxSelections} options selected
            </FormHelperText>
          </Box>
        )}
        
        {isRankedChoice && (
          <Typography color="text.secondary" sx={{ my: 2 }}>
            Ranked choice voting is not yet implemented
          </Typography>
        )}
      </FormControl>
      
      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HowToVoteIcon />}
          onClick={handleVoteClick}
          disabled={loading || !connected}
        >
          {loading ? 'Submitting...' : 'Submit Vote'}
        </Button>
      </Box>
      
      {/* Vote Method Dialog */}
      <Dialog
        open={voteDialogOpen}
        onClose={handleCloseVoteDialog}
        aria-labelledby="vote-method-dialog-title"
      >
        <DialogTitle id="vote-method-dialog-title">
          Choose Voting Method
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select how you would like to cast your vote:
          </DialogContentText>
          <List>
            <ListItem 
              button 
              onClick={handleVoteWithSignature}
              sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}
            >
              <ListItemIcon>
                <PublicIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Public Vote (Signature)" 
                secondary="Your vote will be publicly visible and linked to your wallet address. No token cost." 
              />
            </ListItem>
            <ListItem 
              button 
              onClick={handleVoteWithMPC}
              disabled={balance < MPC_COST_PER_VOTE}
              sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
            >
              <ListItemIcon>
                <LockIcon color="secondary" />
              </ListItemIcon>
              <ListItemText 
                primary="Private Vote (MPC)" 
                secondary={`Your vote will be private and anonymous. Costs ${MPC_COST_PER_VOTE} tokens.${balance < MPC_COST_PER_VOTE ? ' Insufficient balance.' : ''}`} 
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVoteDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VoteForm;
