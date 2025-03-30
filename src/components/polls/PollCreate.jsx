import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  Chip
} from '@mui/material';
import {
  DateTimePicker
} from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { WalletContext } from '../../contexts/WalletContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { createPoll } from '../../services/pollService';
import { POLL_TYPE, MPC_COST_PER_OPTION } from '../../utils/constants';
import { playSuccessSound, playErrorSound, playSound } from '../../utils/soundEffects';

const PollCreate = () => {
  const navigate = useNavigate();
  const { connected, address, balance, refreshBalance } = useContext(WalletContext);
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mpcCost, setMpcCost] = useState(0);
  
  const [pollData, setPollData] = useState({
    title: '',
    description: '',
    type: POLL_TYPE.SINGLE_CHOICE,
    options: ['', ''],
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    maxSelections: 1
  });
  
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    options: ['', ''],
    startDate: '',
    endDate: ''
  });
  
  // Calculate MPC cost based on number of options
  useEffect(() => {
    const cost = pollData.options.length * MPC_COST_PER_OPTION;
    setMpcCost(cost);
  }, [pollData.options]);

  // Refresh wallet balance when component mounts
  useEffect(() => {
    if (connected) {
      refreshBalance();
    }
  }, [connected, refreshBalance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPollData({
      ...pollData,
      [name]: value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleDateChange = (name, value) => {
    setPollData({
      ...pollData,
      [name]: value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...pollData.options];
    newOptions[index] = value;
    
    setPollData({
      ...pollData,
      options: newOptions
    });
    
    // Clear error for this option
    const newOptionErrors = [...formErrors.options];
    newOptionErrors[index] = '';
    setFormErrors({
      ...formErrors,
      options: newOptionErrors
    });
  };
  
  const addOption = () => {
    setPollData({
      ...pollData,
      options: [...pollData.options, '']
    });
    
    setFormErrors({
      ...formErrors,
      options: [...formErrors.options, '']
    });
    
    // Play sound when adding an option
    playSound('notification');
  };
  
  const removeOption = (index) => {
    if (pollData.options.length <= 2) {
      playErrorSound();
      return; // Minimum 2 options required
    }
    
    const newOptions = [...pollData.options];
    newOptions.splice(index, 1);
    
    setPollData({
      ...pollData,
      options: newOptions
    });
    
    const newOptionErrors = [...formErrors.options];
    newOptionErrors.splice(index, 1);
    
    setFormErrors({
      ...formErrors,
      options: newOptionErrors
    });
    
    // Play sound when removing an option
    playSound('notification');
  };
  
  const validateStep = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    if (activeStep === 0) {
      // Validate basic info
      if (!pollData.title.trim()) {
        newErrors.title = 'Title is required';
        valid = false;
      }
      
      if (!pollData.description.trim()) {
        newErrors.description = 'Description is required';
        valid = false;
      }
      
      if (pollData.type === POLL_TYPE.MULTIPLE_CHOICE && 
          (pollData.maxSelections < 1 || pollData.maxSelections > pollData.options.length)) {
        newErrors.maxSelections = `Max selections must be between 1 and ${pollData.options.length}`;
        valid = false;
      }
    } else if (activeStep === 1) {
      // Validate options
      const newOptionErrors = pollData.options.map(option => 
        option.trim() ? '' : 'Option text is required'
      );
      
      if (newOptionErrors.some(error => error)) {
        newErrors.options = newOptionErrors;
        valid = false;
      }
      
      // Check for duplicate options
      const uniqueOptions = new Set(pollData.options.map(opt => opt.trim()));
      if (uniqueOptions.size !== pollData.options.length) {
        newErrors.optionsDuplicate = 'Duplicate options are not allowed';
        valid = false;
      }
    } else if (activeStep === 2) {
      // Validate dates
      const now = new Date();
      
      if (!pollData.startDate) {
        newErrors.startDate = 'Start date is required';
        valid = false;
      } else if (pollData.startDate < now) {
        newErrors.startDate = 'Start date cannot be in the past';
        valid = false;
      }
      
      if (!pollData.endDate) {
        newErrors.endDate = 'End date is required';
        valid = false;
      } else if (pollData.endDate <= pollData.startDate) {
        newErrors.endDate = 'End date must be after start date';
        valid = false;
      }
    }
    
    setFormErrors(newErrors);
    return valid;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === 3) {
        handleSubmit();
      } else {
        setActiveStep(activeStep + 1);
        playSound('notification');
      }
    } else {
      playErrorSound();
    }
  };
  
  const handleBack = () => {
    setActiveStep(activeStep - 1);
    playSound('notification');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!connected) {
      setError('Please connect your wallet to create a poll');
      playErrorSound();
      return;
    }
    
    if (balance < mpcCost) {
      setError(`Insufficient balance. You need at least ${mpcCost} tokens to create this poll.`);
      playErrorSound();
      return;
    }
    
    if (!validateStep()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Format the poll data for submission
      const formattedPollData = {
        title: pollData.title,
        description: pollData.description,
        type: pollData.type,
        options: pollData.options,
        startDate: pollData.startDate,
        endDate: pollData.endDate,
        maxSelections: pollData.maxSelections || 1
      };
      
      console.log('Creating poll with data:', formattedPollData);
      
      // Call the createPoll function from pollService
      const result = await createPoll(formattedPollData);
      
      console.log('Poll created successfully:', result);
      
      // Show success message and store created poll
      setSuccess(true);
      playSuccessSound();
      
      // Store the created poll ID in localStorage
      localStorage.setItem('lastCreatedPoll', JSON.stringify({
        id: result.id,
        title: result.title,
        createdAt: new Date().toISOString()
      }));
      
      // Refresh wallet balance after poll creation
      if (connected) {
        refreshBalance();
      }
    } catch (err) {
      console.error('Error creating poll:', err);
      setError('Failed to create poll. Please try again.');
      playErrorSound();
    } finally {
      setLoading(false);
    }
  };
  
  const steps = ['Basic Info', 'Poll Options', 'Schedule', 'Review'];
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/polls')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Create New Poll
        </Typography>
      </Box>
      
      {!connected && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You need to connect your wallet to create a poll
        </Alert>
      )}
      
      {connected && balance < mpcCost && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Insufficient balance. You need at least {mpcCost} tokens to create this poll.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            Poll created successfully!
          </Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/polls')}
              sx={{ mr: 2 }}
            >
              View All Polls
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate(`/poll/${JSON.parse(localStorage.getItem('lastCreatedPoll')).id}`)}
            >
              View Created Poll
            </Button>
          </Box>
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Stepper activeStep={activeStep} sx={{ flex: 1, mr: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {connected && (
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Typography variant="body2" color="textSecondary">
                Wallet Balance: {balance} tokens
              </Typography>
              <Typography variant="body2" color={balance < mpcCost ? "error" : "textSecondary"}>
                Required: {mpcCost} tokens
              </Typography>
            </Box>
          )}
        </Box>
        
        <form onSubmit={handleSubmit}>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Poll Title"
                    name="title"
                    value={pollData.title}
                    onChange={handleChange}
                    error={!!formErrors.title}
                    helperText={formErrors.title}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={pollData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    error={!!formErrors.description}
                    helperText={formErrors.description}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Poll Type</InputLabel>
                    <Select
                      name="type"
                      value={pollData.type}
                      onChange={handleChange}
                      label="Poll Type"
                    >
                      <MenuItem value={POLL_TYPE.SINGLE_CHOICE}>Single Choice</MenuItem>
                      <MenuItem value={POLL_TYPE.MULTIPLE_CHOICE}>Multiple Choice</MenuItem>
                      <MenuItem value={POLL_TYPE.RANKED_CHOICE}>Ranked Choice</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                {pollData.type === POLL_TYPE.MULTIPLE_CHOICE && pollData.options.length > 1 && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Maximum Selections"
                      name="maxSelections"
                      value={pollData.maxSelections}
                      onChange={handleChange}
                      inputProps={{ min: 1, max: pollData.options.length }}
                      error={!!formErrors.maxSelections}
                      helperText={formErrors.maxSelections || `Voters can select up to ${pollData.maxSelections} options`}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
          
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Poll Options
              </Typography>
              
              {formErrors.optionsDuplicate && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formErrors.optionsDuplicate}
                </Alert>
              )}
              
              {pollData.options.map((option, index) => (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                  <TextField
                    fullWidth
                    label={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    error={!!formErrors.options[index]}
                    helperText={formErrors.options[index]}
                    required
                  />
                  <IconButton 
                    color="error" 
                    onClick={() => removeOption(index)}
                    disabled={pollData.options.length <= 2}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              
              <Button
                startIcon={<AddIcon />}
                onClick={addOption}
                sx={{ mt: 1 }}
              >
                Add Option
              </Button>
            </Box>
          )}
          
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Poll Schedule
              </Typography>
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <DateTimePicker
                      label="Start Date"
                      value={pollData.startDate}
                      onChange={(newValue) => handleDateChange('startDate', newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!formErrors.startDate,
                          helperText: formErrors.startDate
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <DateTimePicker
                      label="End Date"
                      value={pollData.endDate}
                      onChange={(newValue) => handleDateChange('endDate', newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!formErrors.endDate,
                          helperText: formErrors.endDate
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Box>
          )}
          
          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review Poll Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Title</Typography>
                  <Typography variant="body1" gutterBottom>{pollData.title}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Description</Typography>
                  <Typography variant="body1" gutterBottom>{pollData.description}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Poll Type</Typography>
                  <Typography variant="body1" gutterBottom>
                    {pollData.type === POLL_TYPE.SINGLE_CHOICE && 'Single Choice'}
                    {pollData.type === POLL_TYPE.MULTIPLE_CHOICE && `Multiple Choice (Max: ${pollData.maxSelections})`}
                    {pollData.type === POLL_TYPE.RANKED_CHOICE && 'Ranked Choice'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Options</Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {pollData.options.map((option, index) => (
                      <Typography component="li" key={index} gutterBottom>
                        {option}
                      </Typography>
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">Start Date</Typography>
                  <Typography variant="body1" gutterBottom>
                    {pollData.startDate.toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">End Date</Typography>
                  <Typography variant="body1" gutterBottom>
                    {pollData.endDate.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Box display="flex" justifyContent="space-between">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            
            <Box>
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  color={isFuturistic ? "inherit" : "primary"}
                  onClick={handleNext}
                  disabled={!connected}
                  sx={{
                    ...(isFuturistic && {
                      background: 'linear-gradient(45deg, #ff00cc, #ff0055)', // Neon magenta gradient
                      color: '#000', // Dark text
                      fontWeight: 'bold',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 0 15px rgba(255, 0, 204, 0.5)', // Magenta glow
                      '&:hover': {
                        background: 'linear-gradient(45deg, #ff33cc, #ff3377)',
                        boxShadow: '0 0 20px rgba(255, 0, 204, 0.8)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(255, 0, 204, 0.3)',
                        color: 'rgba(0, 0, 0, 0.4)'
                      }
                    })
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color={isFuturistic ? "inherit" : "primary"}
                  disabled={loading || !connected || balance < mpcCost}
                  sx={{
                    ...(isFuturistic && {
                      background: 'linear-gradient(45deg, #ff00cc, #ff0055)', // Neon magenta gradient
                      color: '#000', // Dark text
                      fontWeight: 'bold',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 0 15px rgba(255, 0, 204, 0.5)', // Magenta glow
                      '&:hover': {
                        background: 'linear-gradient(45deg, #ff33cc, #ff3377)',
                        boxShadow: '0 0 20px rgba(255, 0, 204, 0.8)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(255, 0, 204, 0.3)',
                        color: 'rgba(0, 0, 0, 0.4)'
                      }
                    })
                  }}
                >
                  {loading ? 'Creating...' : 'Create Poll'}
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default PollCreate;
