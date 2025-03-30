import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Chip,
  Alert,
  AlertTitle
} from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import InfoIcon from '@mui/icons-material/Info';

// Mock data for individual votes (this would come from the API in a real implementation)
const mockVotes = [
  { 
    id: 'vote1', 
    voter: '00b06f5b47f9b085803f401313b58823a73a7bae7c', 
    option: 'Ethereum', 
    timestamp: new Date('2025-03-25T10:30:00Z'),
    txId: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    type: 'Public'
  },
  { 
    id: 'vote2', 
    voter: '01c17f6c58f0c196914f512424c69934b84b8cbf8d', 
    option: 'Solana', 
    timestamp: new Date('2025-03-26T14:20:00Z'),
    txId: 'bcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890a',
    type: 'Public'
  },
  { 
    id: 'vote3', 
    voter: '02d28f7d69f1d2a7a25f623535d7a045c95c9dcf9e', 
    option: 'Partisia Blockchain', 
    timestamp: new Date('2025-03-27T09:15:00Z'),
    txId: 'cdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    type: 'Public'
  },
  { 
    id: 'vote4', 
    option: 'Ethereum',
    verificationHash: 'def1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc', 
    timestamp: new Date('2025-03-28T11:45:00Z'),
    type: 'Private'
  },
  { 
    id: 'vote5', 
    option: 'Solana',
    verificationHash: 'ef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd', 
    timestamp: new Date('2025-03-29T16:30:00Z'),
    type: 'Private'
  },
  { 
    id: 'vote6', 
    voter: '03e39f8e7af2e3b8b36f734646e8b156da6aedf0f', 
    option: 'Ethereum', 
    timestamp: new Date('2025-03-21T08:15:00Z'),
    txId: 'def1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    type: 'Public'
  },
  { 
    id: 'vote7', 
    option: 'Partisia Blockchain',
    verificationHash: 'f1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcde', 
    timestamp: new Date('2025-03-22T13:45:00Z'),
    type: 'Private'
  },
  { 
    id: 'vote8', 
    voter: '04f4af9f8bf3f4c9c47f845757f9c267eb7beef1f', 
    option: 'Solana', 
    timestamp: new Date('2025-03-23T15:20:00Z'),
    txId: 'ef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcde',
    type: 'Public'
  },
  { 
    id: 'vote9', 
    option: 'Ethereum',
    verificationHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 
    timestamp: new Date('2025-03-24T09:30:00Z'),
    type: 'Private'
  },
  { 
    id: 'vote10', 
    voter: '05f5bfaf9cf4f5dad58f956868fad378fc8cff2f', 
    option: 'Partisia Blockchain', 
    timestamp: new Date('2025-03-20T11:10:00Z'),
    txId: 'f1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    type: 'Public'
  },
  { 
    id: 'vote11', 
    option: 'Solana',
    verificationHash: '123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0', 
    timestamp: new Date('2025-03-19T14:25:00Z'),
    type: 'Private'
  },
  { 
    id: 'vote12', 
    voter: '06f6cfbfadf5f6ebe69fa67979fbe489fd9dff3f', 
    option: 'Ethereum', 
    timestamp: new Date('2025-03-18T16:40:00Z'),
    txId: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    type: 'Public'
  },
  { 
    id: 'vote13', 
    option: 'Partisia Blockchain',
    verificationHash: '23456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01', 
    timestamp: new Date('2025-03-17T10:15:00Z'),
    type: 'Private'
  },
  { 
    id: 'vote14', 
    voter: '07f7dfcfbef6f7fcf7afb78a8afcf59afe9eff4f', 
    option: 'Solana', 
    timestamp: new Date('2025-03-16T12:30:00Z'),
    txId: '123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0',
    type: 'Public'
  }
];

// Helper function to truncate wallet addresses and transaction IDs
const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const truncateTxId = (txId) => {
  if (!txId) return '';
  return `${txId.substring(0, 8)}...${txId.substring(txId.length - 8)}`;
};

// Helper function to format dates
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

const VoteList = ({ poll }) => {
  // In a real implementation, we would fetch individual votes based on the poll ID
  // For now, we'll use mock data
  
  // Check if the poll has any votes
  const hasVotes = poll && poll.totalVotes > 0;
  
  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <HowToVoteIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          Individual Votes
        </Typography>
      </Box>
      
      {!hasVotes ? (
        <Alert severity="info">
          <AlertTitle>No Votes</AlertTitle>
          This poll has not received any votes yet.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Voter</TableCell>
                <TableCell>Vote</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Transaction ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockVotes.map((vote) => (
                <TableRow key={vote.id}>
                  <TableCell>{vote.type}</TableCell>
                  <TableCell>
                    {vote.type === 'Public' ? (
                      <Link 
                        href={`https://browser.partisiablockchain.com/account/${vote.voter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {truncateAddress(vote.voter)}
                      </Link>
                    ) : (
                      'Hidden (MPC)'
                    )}
                  </TableCell>
                  <TableCell>{vote.option}</TableCell>
                  <TableCell>{formatDate(vote.timestamp)}</TableCell>
                  <TableCell>
                    {vote.type === 'Public' ? (
                      <Link 
                        href={`https://browser.partisiablockchain.com/transaction/${vote.txId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {truncateTxId(vote.txId)}
                      </Link>
                    ) : (
                      <Link 
                        href={`https://browser.partisiablockchain.com/transaction/${vote.verificationHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {truncateTxId(vote.verificationHash)}
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2" color="text.secondary">
          <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
          All votes are recorded on the Partisia blockchain and can be verified by anyone. Private votes use Multi-Party Computation (MPC) to keep your choice confidential while ensuring the integrity of the vote.
        </Typography>
      </Box>
    </Box>
  );
};

export default VoteList;
