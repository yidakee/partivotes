# PartiVotes - Technical Design Document

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Smart Contract Design](#smart-contract-design)
4. [Frontend Implementation](#frontend-implementation)
5. [Wallet Integration](#wallet-integration)
6. [Voting Mechanisms](#voting-mechanisms)
7. [Deployment Process](#deployment-process)
8. [GitHub Workflow](#github-workflow)
9. [Future Roadmap](#future-roadmap)
10. [Appendices](#appendices)

## Project Overview

### Objective
Create a proof-of-concept private voting platform leveraging the Partisia Blockchain and its Multi-Party Computation (MPC) capabilities. The platform will allow users to create voting polls and participate in them either through free signature-based voting or private MPC-based voting.

### Scope
This document outlines the technical approach for developing PartiVotes with:
- Web-based frontend with minimal UI
- Partisia Blockchain integration for MPC-based privacy
- Wallet connection with Parti wallet (the official wallet)
- Poll creation functionality with 100 MPC payment
- Voting functionality with either signature verification or 100 MPC payment
- Deployment on Hetzner running Ubuntu 24.04 LTS

### Key Features
1. Create voting polls by paying 100 MPC
2. Vote in polls using signature verification (public) or by paying 100 MPC (private)
3. View poll results immediately after voting
4. Set expiration dates for polls
5. End polls early (for poll creators)
6. View polls the user has already voted on

## Technical Architecture

### System Components
The PartiVotes platform consists of three main components:

1. **Smart Contract (Backend)**
   - Written in Rust using Partisia Contract SDK
   - Deployed on Partisia Blockchain
   - Handles poll creation, voting logic, and MPC token transactions
   - Stores poll data and voting results

2. **Web Frontend**
   - Built with React and Material-UI 5
   - Minimal UI focused on functionality
   - Connects to Parti wallet for authentication and transactions
   - Interacts with the smart contract through Partisia SDK

3. **Blockchain Integration Layer**
   - Partisia SDK for wallet connection and contract interaction
   - Handles transaction signing and verification
   - Manages MPC token transfers

### System Architecture Diagram
```
┌─────────────────┐     ┌───────────────────┐     ┌─────────────────────┐
│                 │     │                   │     │                     │
│  Web Frontend   │◄───►│  Partisia SDK     │◄───►│  Partisia Blockchain │
│  (React + MUI)  │     │  Integration      │     │  (Smart Contract)   │
│                 │     │                   │     │                     │
└─────────────────┘     └───────────────────┘     └─────────────────────┘
        ▲                        ▲
        │                        │
        ▼                        ▼
┌─────────────────┐     ┌───────────────────┐
│                 │     │                   │
│  User Browser   │◄───►│  Parti Wallet     │
│                 │     │  Extension        │
│                 │     │                   │
└─────────────────┘     └───────────────────┘
```

### Data Flow
1. User connects Parti wallet to the application
2. User creates a poll by submitting details and paying 100 MPC
3. Smart contract stores poll data and manages MPC tokens
4. Other users view available polls
5. Users vote using signature verification (free) or by paying 100 MPC (private)
6. Smart contract records votes and updates results
7. Results are displayed to users immediately after voting

## Smart Contract Design

### State Structure
```rust
#[state]
pub struct PartiVotesState {
    // Contract owner
    pub owner: Address,
    
    // Polls storage
    pub polls: Vec<Poll>,
    
    // Poll ID counter
    pub poll_counter: u64,
    
    // Votes storage (poll_id -> voter -> vote_option)
    pub votes: Map<u64, Map<Address, u32>>,
    
    // Private votes count (poll_id -> option -> count)
    pub private_vote_counts: Map<u64, Map<u32, u32>>,
}

#[derive(ReadRPC, WriteRPC, CreateTypeSpec)]
pub struct Poll {
    // Unique identifier
    pub id: u64,
    
    // Poll creator
    pub creator: Address,
    
    // Poll title
    pub title: String,
    
    // Poll description
    pub description: String,
    
    // Poll options
    pub options: Vec<String>,
    
    // Creation timestamp
    pub created_at: u64,
    
    // Expiration timestamp
    pub expires_at: u64,
    
    // Whether the poll is active
    pub active: bool,
    
    // Public vote counts (option -> count)
    pub public_vote_counts: Map<u32, u32>,
}
```

### Function Definitions

#### Initialize Contract
```rust
#[init]
pub fn initialize(context: ContractContext) -> (PartiVotesState, Vec<EventGroup>) {
    let state = PartiVotesState {
        owner: context.sender,
        polls: Vec::new(),
        poll_counter: 0,
        votes: Map::new(),
        private_vote_counts: Map::new(),
    };
    
    (state, Vec::new())
}
```

#### Create Poll
```rust
#[action(shortname = 0x01)]
pub fn create_poll(
    context: ContractContext,
    mut state: PartiVotesState,
    params: CreatePollParams,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Verify MPC payment (100 MPC)
    assert!(context.amount >= 100, "Insufficient MPC payment");
    
    // Create new poll
    let poll_id = state.poll_counter;
    state.poll_counter += 1;
    
    let poll = Poll {
        id: poll_id,
        creator: context.sender,
        title: params.title,
        description: params.description,
        options: params.options,
        created_at: context.block_production_time,
        expires_at: params.expires_at,
        active: true,
        public_vote_counts: Map::new(),
    };
    
    // Initialize vote counts for each option
    for i in 0..poll.options.len() {
        poll.public_vote_counts.insert(i as u32, 0);
        
        let mut option_counts = Map::new();
        if !state.private_vote_counts.contains_key(&poll_id) {
            state.private_vote_counts.insert(poll_id, option_counts);
        } else {
            option_counts = state.private_vote_counts.get(&poll_id).unwrap();
        }
        option_counts.insert(i as u32, 0);
        state.private_vote_counts.insert(poll_id, option_counts);
    }
    
    // Store poll
    state.polls.push(poll);
    
    // Create event
    let event_group = EventGroup::builder()
        .with_type("PollCreated")
        .with_data("poll_id", &poll_id)
        .build();
    
    (state, vec![event_group])
}
```

#### Vote with Signature (Public)
```rust
#[action(shortname = 0x02)]
pub fn vote_with_signature(
    context: ContractContext,
    mut state: PartiVotesState,
    params: VoteParams,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Verify poll exists and is active
    let poll_index = state.polls.iter().position(|p| p.id == params.poll_id).unwrap();
    let mut poll = state.polls[poll_index].clone();
    
    assert!(poll.active, "Poll is not active");
    assert!(context.block_production_time < poll.expires_at, "Poll has expired");
    
    // Verify user hasn't voted already
    let mut poll_votes = Map::new();
    if state.votes.contains_key(&params.poll_id) {
        poll_votes = state.votes.get(&params.poll_id).unwrap();
    }
    assert!(!poll_votes.contains_key(&context.sender), "Already voted");
    
    // Record vote
    poll_votes.insert(context.sender, params.option_index);
    state.votes.insert(params.poll_id, poll_votes);
    
    // Update public vote count
    let current_count = poll.public_vote_counts.get(&params.option_index).unwrap_or(0);
    poll.public_vote_counts.insert(params.option_index, current_count + 1);
    
    // Update poll
    state.polls[poll_index] = poll;
    
    // Create event
    let event_group = EventGroup::builder()
        .with_type("PublicVoteCast")
        .with_data("poll_id", &params.poll_id)
        .with_data("voter", &context.sender)
        .with_data("option", &params.option_index)
        .build();
    
    (state, vec![event_group])
}
```

#### Vote with MPC (Private)
```rust
#[action(shortname = 0x03)]
pub fn vote_with_mpc(
    context: ContractContext,
    mut state: PartiVotesState,
    params: VoteParams,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Verify MPC payment (100 MPC)
    assert!(context.amount >= 100, "Insufficient MPC payment");
    
    // Verify poll exists and is active
    let poll_index = state.polls.iter().position(|p| p.id == params.poll_id).unwrap();
    let poll = state.polls[poll_index].clone();
    
    assert!(poll.active, "Poll is not active");
    assert!(context.block_production_time < poll.expires_at, "Poll has expired");
    
    // Verify user hasn't voted already
    let mut poll_votes = Map::new();
    if state.votes.contains_key(&params.poll_id) {
        poll_votes = state.votes.get(&params.poll_id).unwrap();
    }
    assert!(!poll_votes.contains_key(&context.sender), "Already voted");
    
    // Record vote (only record that user voted, not what they voted for)
    poll_votes.insert(context.sender, 0); // Use 0 as a placeholder
    state.votes.insert(params.poll_id, poll_votes);
    
    // Update private vote count
    let mut option_counts = state.private_vote_counts.get(&params.poll_id).unwrap();
    let current_count = option_counts.get(&params.option_index).unwrap_or(0);
    option_counts.insert(params.option_index, current_count + 1);
    state.private_vote_counts.insert(params.poll_id, option_counts);
    
    // Create event
    let event_group = EventGroup::builder()
        .with_type("PrivateVoteCast")
        .with_data("poll_id", &params.poll_id)
        .with_data("voter", &context.sender)
        .build();
    
    (state, vec![event_group])
}
```

#### End Poll
```rust
#[action(shortname = 0x04)]
pub fn end_poll(
    context: ContractContext,
    mut state: PartiVotesState,
    params: EndPollParams,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Verify poll exists
    let poll_index = state.polls.iter().position(|p| p.id == params.poll_id).unwrap();
    let mut poll = state.polls[poll_index].clone();
    
    // Verify sender is poll creator
    assert!(poll.creator == context.sender, "Only poll creator can end poll");
    
    // End poll
    poll.active = false;
    state.polls[poll_index] = poll;
    
    // Create event
    let event_group = EventGroup::builder()
        .with_type("PollEnded")
        .with_data("poll_id", &params.poll_id)
        .build();
    
    (state, vec![event_group])
}
```

#### Get Polls
```rust
#[action(shortname = 0x05)]
pub fn get_polls(
    context: ContractContext,
    state: PartiVotesState,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Return all polls
    let event_group = EventGroup::builder()
        .with_type("PollsList")
        .with_data("polls", &state.polls)
        .build();
    
    (state, vec![event_group])
}
```

#### Get Poll Results
```rust
#[action(shortname = 0x06)]
pub fn get_poll_results(
    context: ContractContext,
    state: PartiVotesState,
    params: GetPollResultsParams,
) -> (PartiVotesState, Vec<EventGroup>) {
    // Verify poll exists
    let poll_index = state.polls.iter().position(|p| p.id == params.poll_id).unwrap();
    let poll = state.polls[poll_index].clone();
    
    // Get public vote counts
    let public_votes = poll.public_vote_counts;
    
    // Get private vote counts
    let private_votes = state.private_vote_counts.get(&params.poll_id).unwrap();
    
    // Create event
    let event_group = EventGroup::builder()
        .with_type("PollResults")
        .with_data("poll_id", &params.poll_id)
        .with_data("public_votes", &public_votes)
        .with_data("private_votes", &private_votes)
        .build();
    
    (state, vec![event_group])
}
```

### Parameter Structures
```rust
#[derive(ReadRPC, WriteRPC, CreateTypeSpec)]
pub struct CreatePollParams {
    pub title: String,
    pub description: String,
    pub options: Vec<String>,
    pub expires_at: u64,
}

#[derive(ReadRPC, WriteRPC, CreateTypeSpec)]
pub struct VoteParams {
    pub poll_id: u64,
    pub option_index: u32,
}

#[derive(ReadRPC, WriteRPC, CreateTypeSpec)]
pub struct EndPollParams {
    pub poll_id: u64,
}

#[derive(ReadRPC, WriteRPC, CreateTypeSpec)]
pub struct GetPollResultsParams {
    pub poll_id: u64,
}
```

## Frontend Implementation

### Technology Stack
- React.js for UI framework
- Material-UI 5 for component library
- Partisia SDK for blockchain interaction
- Windsurf IDE for development

### Project Structure
```
partivotes/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── App.js
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── WalletConnect.js
│   │   ├── PollList.js
│   │   ├── PollItem.js
│   │   ├── PollCreate.js
│   │   ├── PollDetail.js
│   │   ├── VoteForm.js
│   │   └── PollResults.js
│   ├── contexts/
│   │   └── WalletContext.js
│   ├── services/
│   │   ├── contractService.js
│   │   └── walletService.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── dateUtils.js
│   ├── styles/
│   │   └── theme.js
│   ├── index.js
│   └── App.css
├── package.json
├── README.md
└── .gitignore
```

### Key Components

#### App Component
The main application component that handles routing and global state.

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { WalletProvider } from './contexts/WalletContext';
import theme from './styles/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import PollList from './components/PollList';
import PollCreate from './components/PollCreate';
import PollDetail from './components/PollDetail';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WalletProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<PollList />} />
            <Route path="/create" element={<PollCreate />} />
            <Route path="/poll/:id" element={<PollDetail />} />
          </Routes>
          <Footer />
        </Router>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;
```

#### WalletConnect Component
Handles wallet connection and displays wallet status.

```jsx
import React, { useContext } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { WalletContext } from '../contexts/WalletContext';

function WalletConnect() {
  const { connected, address, connect, disconnect } = useContext(WalletContext);

  return (
    <Box>
      {connected ? (
        <Box display="flex" alignItems="center">
          <Typography variant="body2" sx={{ mr: 2 }}>
            {address.substring(0, 6)}...{address.substring(address.length - 4)}
          </Typography>
          <Button variant="outlined" color="primary" onClick={disconnect}>
            Disconnect
          </Button>
        </Box>
      ) : (
        <Button variant="contained" color="primary" onClick={connect}>
          Connect Wallet
        </Button>
      )}
    </Box>
  );
}

export default WalletConnect;
```

#### PollCreate Component
Form for creating new polls.

```jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { WalletContext } from '../contexts/WalletContext';
import { createPoll } from '../services/contractService';

function PollCreate() {
  const navigate = useNavigate();
  const { connected, address } = useContext(WalletContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiresAt, setExpiresAt] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 1 week from now
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!connected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!title || !description || options.some(opt => !opt) || options.length < 2) {
      setError('Please fill in all fields and provide at least 2 options');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await createPoll({
        title,
        description,
        options: options.filter(opt => opt),
        expiresAt: Math.floor(expiresAt.getTime() / 1000),
      });
      
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create New Poll
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Poll Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Poll Options
          </Typography>
          
          {options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 1 }}>
              <TextField
                label={`Option ${index + 1}`}
                fullWidth
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              {options.length > 2 && (
                <IconButton 
                  color="error" 
                  onClick={() => handleRemoveOption(index)}
                  sx={{ ml: 1 }}
                >
                  <RemoveIcon />
                </IconButton>
              )}
            </Box>
          ))}
          
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddOption}
            sx={{ mt: 1 }}
          >
            Add Option
          </Button>
          
          <Box sx={{ mt: 3 }}>
            <DateTimePicker
              label="Expires At"
              value={expiresAt}
              onChange={setExpiresAt}
              minDateTime={new Date()}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Creating a poll requires a payment of 100 MPC tokens.
            </Typography>
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading || !connected}
          >
            {loading ? 'Creating...' : 'Create Poll (100 MPC)'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default PollCreate;
```

#### PollList Component
Displays a list of available polls.

```jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import { WalletContext } from '../contexts/WalletContext';
import { getPolls } from '../services/contractService';
import { formatDate } from '../utils/dateUtils';

function PollList() {
  const { connected } = useContext(WalletContext);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const pollsData = await getPolls();
        setPolls(pollsData);
      } catch (err) {
        setError('Failed to load polls');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const isPollActive = (poll) => {
    return poll.active && new Date(poll.expires_at * 1000) > new Date();
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Available Polls
        </Typography>
        
        <Button
          component={RouterLink}
          to="/create"
          variant="contained"
          color="primary"
          disabled={!connected}
        >
          Create Poll
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : polls.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No polls available. Create the first one!</Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {polls.map((poll, index) => (
              <React.Fragment key={poll.id}>
                {index > 0 && <Divider />}
                <ListItem
                  button
                  component={RouterLink}
                  to={`/poll/${poll.id}`}
                  alignItems="flex-start"
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">{poll.title}</Typography>
                        {isPollActive(poll) ? (
                          <Chip label="Active" color="success" size="small" />
                        ) : (
                          <Chip label="Ended" color="default" size="small" />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {poll.description.length > 100
                            ? `${poll.description.substring(0, 100)}...`
                            : poll.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Expires: {formatDate(poll.expires_at * 1000)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default PollList;
```

#### PollDetail Component
Displays poll details and voting interface.

```jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { WalletContext } from '../contexts/WalletContext';
import { getPoll, voteWithSignature, voteWithMPC, endPoll } from '../services/contractService';
import { formatDate } from '../utils/dateUtils';
import PollResults from './PollResults';

function PollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { connected, address } = useContext(WalletContext);
  
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const [showVoteDialog, setShowVoteDialog] = useState(false);
  
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const pollData = await getPoll(id);
        setPoll(pollData);
        
        // Check if user has voted
        if (connected && pollData.votes && pollData.votes[address]) {
          setHasVoted(true);
        }
      } catch (err) {
        setError('Failed to load poll');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id, connected, address]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleVoteWithSignature = async () => {
    if (!connected || !selectedOption) return;
    
    setVoting(true);
    setError('');
    
    try {
      await voteWithSignature(id, parseInt(selectedOption));
      setHasVoted(true);
      // Refresh poll data to get updated results
      const updatedPoll = await getPoll(id);
      setPoll(updatedPoll);
    } catch (err) {
      setError(err.message || 'Failed to vote');
    } finally {
      setVoting(false);
      setShowVoteDialog(false);
    }
  };

  const handleVoteWithMPC = async () => {
    if (!connected || !selectedOption) return;
    
    setVoting(true);
    setError('');
    
    try {
      await voteWithMPC(id, parseInt(selectedOption));
      setHasVoted(true);
      // Refresh poll data to get updated results
      const updatedPoll = await getPoll(id);
      setPoll(updatedPoll);
    } catch (err) {
      setError(err.message || 'Failed to vote');
    } finally {
      setVoting(false);
      setShowVoteDialog(false);
    }
  };

  const handleEndPoll = async () => {
    if (!connected) return;
    
    setLoading(true);
    setError('');
    
    try {
      await endPoll(id);
      // Refresh poll data
      const updatedPoll = await getPoll(id);
      setPoll(updatedPoll);
    } catch (err) {
      setError(err.message || 'Failed to end poll');
    } finally {
      setLoading(false);
    }
  };

  const isPollActive = () => {
    return poll.active && new Date(poll.expires_at * 1000) > new Date();
  };

  const isCreator = () => {
    return connected && poll.creator === address;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!poll) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert severity="error">Poll not found</Alert>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Polls
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1">
            {poll.title}
          </Typography>
          
          {isPollActive() ? (
            <Chip label="Active" color="success" />
          ) : (
            <Chip label="Ended" color="default" />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Expires: {formatDate(poll.expires_at * 1000)}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          {poll.description}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {hasVoted || !isPollActive() ? (
          <PollResults poll={poll} />
        ) : (
          <Box sx={{ mt: 3 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select an option:</FormLabel>
              <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                {poll.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index.toString()}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={!connected || !selectedOption || voting}
                onClick={() => setShowVoteDialog(true)}
              >
                {voting ? 'Voting...' : 'Vote'}
              </Button>
            </Box>
          </Box>
        )}
        
        {isCreator() && isPollActive() && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Creator Actions
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleEndPoll}
              disabled={loading}
            >
              End Poll Early
            </Button>
          </Box>
        )}
      </Paper>
      
      <Dialog open={showVoteDialog} onClose={() => setShowVoteDialog(false)}>
        <DialogTitle>Choose Voting Method</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            You can vote using one of the following methods:
          </Typography>
          <Typography variant="body2" paragraph>
            1. <strong>Public Vote (Free)</strong>: Your vote will be visible to everyone, but doesn't cost any MPC tokens.
          </Typography>
          <Typography variant="body2" paragraph>
            2. <strong>Private Vote (100 MPC)</strong>: Your vote will be kept private, but costs 100 MPC tokens.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVoteDialog(false)}>Cancel</Button>
          <Button onClick={handleVoteWithSignature} color="primary">
            Public Vote (Free)
          </Button>
          <Button onClick={handleVoteWithMPC} color="primary" variant="contained">
            Private Vote (100 MPC)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PollDetail;
```

#### PollResults Component
Displays poll results.

```jsx
import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Divider,
} from '@mui/material';

function PollResults({ poll }) {
  const calculateTotalVotes = () => {
    let publicTotal = 0;
    let privateTotal = 0;
    
    // Count public votes
    Object.values(poll.public_vote_counts || {}).forEach(count => {
      publicTotal += count;
    });
    
    // Count private votes
    Object.values(poll.private_vote_counts || {}).forEach(count => {
      privateTotal += count;
    });
    
    return { publicTotal, privateTotal, total: publicTotal + privateTotal };
  };
  
  const { publicTotal, privateTotal, total } = calculateTotalVotes();
  
  const getPercentage = (count) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Results
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Total Votes: {total} ({publicTotal} public, {privateTotal} private)
      </Typography>
      
      {poll.options.map((option, index) => {
        const publicCount = poll.public_vote_counts[index] || 0;
        const privateCount = poll.private_vote_counts[index] || 0;
        const totalCount = publicCount + privateCount;
        const percentage = getPercentage(totalCount);
        
        return (
          <Box key={index} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">{option}</Typography>
              <Typography variant="body2">
                {totalCount} votes ({percentage}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{ height: 10, borderRadius: 5, mt: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Public: {publicCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Private: {privateCount}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default PollResults;
```

### Wallet Context
Provides wallet connection state and functions to the application.

```jsx
import React, { createContext, useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, getWalletAddress } from '../services/walletService';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const isConnected = await getWalletAddress();
        if (isConnected) {
          setConnected(true);
          setAddress(isConnected);
        }
      } catch (error) {
        console.error('Wallet connection check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkWalletConnection();
  }, []);

  const connect = async () => {
    try {
      const walletAddress = await connectWallet();
      setConnected(true);
      setAddress(walletAddress);
      return true;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      return false;
    }
  };

  const disconnect = async () => {
    try {
      await disconnectWallet();
      setConnected(false);
      setAddress('');
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        loading,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
```

## Wallet Integration

### Wallet Service
Handles interaction with the Parti wallet.

```javascript
// src/services/walletService.js
import { PartisiaWalletSDK } from '@partisiablockchain/wallet-sdk';

let walletSDK;

const initializeWalletSDK = () => {
  if (!walletSDK) {
    walletSDK = new PartisiaWalletSDK({
      dAppName: 'PartiVotes',
      dAppVersion: '0.1.0',
      dAppDescription: 'A private voting platform on Partisia Blockchain',
    });
  }
  return walletSDK;
};

export const connectWallet = async () => {
  const sdk = initializeWalletSDK();
  
  try {
    // Request connection to wallet
    await sdk.connect();
    
    // Get account address
    const accounts = await sdk.getAccounts();
    if (accounts && accounts.length > 0) {
      return accounts[0];
    }
    throw new Error('No accounts found');
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
};

export const disconnectWallet = async () => {
  const sdk = initializeWalletSDK();
  
  try {
    await sdk.disconnect();
    return true;
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
    throw error;
  }
};

export const getWalletAddress = async () => {
  const sdk = initializeWalletSDK();
  
  try {
    // Check if already connected
    const isConnected = await sdk.isConnected();
    if (!isConnected) {
      return null;
    }
    
    // Get account address
    const accounts = await sdk.getAccounts();
    if (accounts && accounts.length > 0) {
      return accounts[0];
    }
    return null;
  } catch (error) {
    console.error('Failed to get wallet address:', error);
    return null;
  }
};

export const signTransaction = async (transaction) => {
  const sdk = initializeWalletSDK();
  
  try {
    const signedTransaction = await sdk.signTransaction(transaction);
    return signedTransaction;
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    throw error;
  }
};

export const sendTransaction = async (transaction) => {
  const sdk = initializeWalletSDK();
  
  try {
    const txHash = await sdk.sendTransaction(transaction);
    return txHash;
  } catch (error) {
    console.error('Failed to send transaction:', error);
    throw error;
  }
};
```

### Contract Service
Handles interaction with the smart contract.

```javascript
// src/services/contractService.js
import { signTransaction, sendTransaction } from './walletService';
import { CONTRACT_ADDRESS } from '../utils/constants';

// Helper function to create a transaction
const createTransaction = (action, params = {}, amount = 0) => {
  return {
    to: CONTRACT_ADDRESS,
    action,
    params,
    amount,
  };
};

// Create a new poll
export const createPoll = async (pollData) => {
  try {
    const transaction = createTransaction('create_poll', pollData, 100); // 100 MPC payment
    const signedTx = await signTransaction(transaction);
    const txHash = await sendTransaction(signedTx);
    
    // Wait for transaction confirmation
    await waitForConfirmation(txHash);
    
    return txHash;
  } catch (error) {
    console.error('Failed to create poll:', error);
    throw error;
  }
};

// Get all polls
export const getPolls = async () => {
  try {
    const transaction = createTransaction('get_polls');
    const signedTx = await signTransaction(transaction);
    const result = await sendTransaction(signedTx);
    
    return result.polls || [];
  } catch (error) {
    console.error('Failed to get polls:', error);
    throw error;
  }
};

// Get a specific poll
export const getPoll = async (pollId) => {
  try {
    const polls = await getPolls();
    return polls.find(poll => poll.id.toString() === pollId.toString());
  } catch (error) {
    console.error('Failed to get poll:', error);
    throw error;
  }
};

// Vote with signature (public)
export const voteWithSignature = async (pollId, optionIndex) => {
  try {
    const transaction = createTransaction('vote_with_signature', {
      poll_id: pollId,
      option_index: optionIndex,
    });
    const signedTx = await signTransaction(transaction);
    const txHash = await sendTransaction(signedTx);
    
    // Wait for transaction confirmation
    await waitForConfirmation(txHash);
    
    return txHash;
  } catch (error) {
    console.error('Failed to vote with signature:', error);
    throw error;
  }
};

// Vote with MPC (private)
export const voteWithMPC = async (pollId, optionIndex) => {
  try {
    const transaction = createTransaction('vote_with_mpc', {
      poll_id: pollId,
      option_index: optionIndex,
    }, 100); // 100 MPC payment
    const signedTx = await signTransaction(transaction);
    const txHash = await sendTransaction(signedTx);
    
    // Wait for transaction confirmation
    await waitForConfirmation(txHash);
    
    return txHash;
  } catch (error) {
    console.error('Failed to vote with MPC:', error);
    throw error;
  }
};

// End a poll early
export const endPoll = async (pollId) => {
  try {
    const transaction = createTransaction('end_poll', {
      poll_id: pollId,
    });
    const signedTx = await signTransaction(transaction);
    const txHash = await sendTransaction(signedTx);
    
    // Wait for transaction confirmation
    await waitForConfirmation(txHash);
    
    return txHash;
  } catch (error) {
    console.error('Failed to end poll:', error);
    throw error;
  }
};

// Get poll results
export const getPollResults = async (pollId) => {
  try {
    const transaction = createTransaction('get_poll_results', {
      poll_id: pollId,
    });
    const signedTx = await signTransaction(transaction);
    const result = await sendTransaction(signedTx);
    
    return {
      publicVotes: result.public_votes || {},
      privateVotes: result.private_votes || {},
    };
  } catch (error) {
    console.error('Failed to get poll results:', error);
    throw error;
  }
};

// Helper function to wait for transaction confirmation
const waitForConfirmation = async (txHash) => {
  // Implementation depends on Partisia SDK capabilities
  // This is a placeholder for transaction confirmation logic
  return new Promise((resolve) => {
    setTimeout(resolve, 2000); // Simulate waiting for confirmation
  });
};
```

## Voting Mechanisms

### Public Voting (Signature-Based)
- Free to use (no MPC payment required)
- User's address is recorded with their vote
- Vote choice is publicly visible
- Implemented through the `vote_with_signature` smart contract function

### Private Voting (MPC-Based)
- Requires payment of 100 MPC tokens
- User's address is recorded, but not associated with their vote choice
- Vote choice is kept private using MPC capabilities
- Implemented through the `vote_with_mpc` smart contract function

### Vote Counting
- Public votes are counted directly in the poll's `public_vote_counts` map
- Private votes are counted in a separate `private_vote_counts` map
- Results are displayed as a combination of both public and private votes

## Deployment Process

### Prerequisites
- Hetzner server running Ubuntu 24.04 LTS
- Domain name (optional)
- SSH access to the server
- Git installed on the server
- Node.js and npm installed on the server

### Server Setup

1. Update the system
```bash
sudo apt update && sudo apt upgrade -y
```

2. Install Node.js and npm (if not already installed)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Install Git (if not already installed)
```bash
sudo apt install git -y
```

4. Install PM2 for process management
```bash
sudo npm install -g pm2
```

5. Set up a firewall
```bash
sudo apt install ufw -y
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### Application Deployment

1. Clone the repository
```bash
git clone https://github.com/yourusername/partivotes.git
cd partivotes
```

2. Install dependencies
```bash
npm install
```

3. Build the application
```bash
npm run build
```

4. Set up environment variables
```bash
cat > .env << EOL
REACT_APP_CONTRACT_ADDRESS=your_contract_address
REACT_APP_NETWORK=mainnet
EOL
```

5. Install and configure Nginx
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/partivotes
```

6. Add the following Nginx configuration
```nginx
server {
    listen 80;
    server_name your_server_ip_or_domain;

    root /path/to/partivotes/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

7. Enable the site and restart Nginx
```bash
sudo ln -s /etc/nginx/sites-available/partivotes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. Set up PM2 to manage the application (if using a Node.js server)
```bash
pm2 start npm --name "partivotes" -- start
pm2 save
pm2 startup
```

### Smart Contract Deployment

1. Install Rust and required tools
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
rustup target add wasm32-unknown-unknown
sudo apt-get install -y build-essential libssl-dev pkg-config
cargo install cargo-partisia-contract
```

2. Build the smart contract
```bash
cd contract
cargo partisia-contract build --release
```

3. Deploy the contract using the Partisia Blockchain browser interface
   - Go to the Partisia Blockchain browser
   - Connect your wallet
   - Navigate to the contract deployment section
   - Upload the compiled WASM file
   - Initialize the contract with appropriate parameters
   - Record the deployed contract address for frontend configuration

## GitHub Workflow

### Repository Structure
```
partivotes/
├── contract/           # Smart contract code
├── frontend/           # React frontend application
├── docs/               # Documentation
└── README.md           # Project overview
```

### Development Workflow

1. **Direct Development**
   - Work directly on the main branch
   - Make changes and commit frequently
   - Push changes to GitHub
   - Pull changes before making new modifications

2. **Reset and Continue**
   - If something goes wrong, use Git reset to revert to a working state
   ```bash
   git reset --hard <commit_hash>
   # or
   git reset --hard origin/main
   ```

3. **Deployment**
   - SSH into the Hetzner server
   - Pull the latest changes
   ```bash
   cd /path/to/partivotes
   git pull
   ```
   - Rebuild the application
   ```bash
   npm install
   npm run build
   ```
   - Restart services if needed
   ```bash
   pm2 restart partivotes
   ```

## Future Roadmap

### Phase 1: Proof of Concept (Current)
- Basic wallet connection with Parti wallet
- Poll creation with 100 MPC payment
- Public (signature-based) and private (MPC-based) voting
- Simple results display
- Deployment on Hetzner

### Phase 2: Enhanced Features
- User profiles and voting history
- Advanced poll options (multiple choice, ranked choice)
- Poll categories and tags
- Search and filter functionality
- Email notifications for poll creators
- Mobile-responsive design improvements

### Phase 3: Advanced Functionality
- Delegate voting (allow users to delegate their vote to others)
- Weighted voting based on token holdings
- Time-locked polls (results revealed only after voting period)
- Integration with other blockchain platforms
- Advanced analytics and reporting
- API for third-party integrations

### Phase 4: Enterprise Features
- Organization accounts and private polls
- Custom branding options
- Advanced security features
- Multi-signature poll creation
- Compliance with regulatory requirements
- Premium subscription model

## Appendices

### Appendix A: Partisia Blockchain Resources
- [Partisia Blockchain Documentation](https://partisiablockchain.gitlab.io/documentation/)
- [Example Contracts](https://gitlab.com/partisiablockchain/language/example-contracts)
- [Wallet SDK Documentation](https://partisiablockchain.gitlab.io/partisia-wallet-sdk-docs/)

### Appendix B: Material-UI Resources
- [Material-UI Documentation](https://mui.com/material-ui/getting-started/overview/)
- [Material-UI Components](https://mui.com/material-ui/react-autocomplete/)
- [Material-UI Theming](https://mui.com/material-ui/customization/theming/)

### Appendix C: React Resources
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [React Router Documentation](https://reactrouter.com/en/main)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)

### Appendix D: Rust Resources
- [Rust Documentation](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rust and WebAssembly](https://rustwasm.github.io/docs/book/)
