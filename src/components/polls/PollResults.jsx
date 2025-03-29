import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  LinearProgress,
  Tooltip,
  Chip,
  Grid,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { POLL_STATUS } from '../../utils/constants';

const PollResults = ({ poll }) => {
  // Sort options by votes (descending)
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
  
  // Find the winning option(s)
  const maxVotes = Math.max(...poll.options.map(option => option.votes));
  const winningOptions = poll.options.filter(option => option.votes === maxVotes);
  const hasWinner = poll.status === POLL_STATUS.ENDED && maxVotes > 0;
  
  // Calculate vote statistics
  const totalVotes = poll.totalVotes || 0;
  const publicVotes = poll.publicVotes || 0;
  const privateVotes = poll.privateVotes || 0;
  
  // Check if the user has voted for this option
  const isUserVote = (optionId) => {
    if (!poll.hasVoted || !poll.userVote) return false;
    
    if (poll.userVote.optionId) {
      return poll.userVote.optionId === optionId;
    }
    
    if (poll.userVote.optionIds) {
      return poll.userVote.optionIds.includes(optionId);
    }
    
    return false;
  };
  
  const VoteStatCard = ({ icon, title, count, color, percentage }) => (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          {icon}
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Stack>
        <Typography variant="h4" component="div" color={color} fontWeight="bold">
          {count}
        </Typography>
        {percentage !== undefined && (
          <Typography variant="body2" color="text.secondary">
            {percentage}% of total
          </Typography>
        )}
      </CardContent>
    </Card>
  );
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Poll Results
      </Typography>
      
      {/* Vote Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <VoteStatCard 
            icon={<HowToVoteIcon color="primary" />}
            title="Total Votes"
            count={totalVotes}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <VoteStatCard 
            icon={<PublicIcon color="info" />}
            title="Public Votes"
            count={publicVotes}
            color="info.main"
            percentage={totalVotes > 0 ? Math.round((publicVotes / totalVotes) * 100) : 0}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <VoteStatCard 
            icon={<LockIcon color="secondary" />}
            title="Private Votes"
            count={privateVotes}
            color="secondary.main"
            percentage={totalVotes > 0 ? Math.round((privateVotes / totalVotes) * 100) : 0}
          />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      {totalVotes === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 3 }}>
          No votes have been cast yet
        </Typography>
      ) : (
        <Box>
          {sortedOptions.map((option) => {
            const percentage = totalVotes > 0 
              ? Math.round((option.votes / totalVotes) * 100) 
              : 0;
            
            const publicPercentage = option.publicVotes && totalVotes > 0
              ? Math.round((option.publicVotes / totalVotes) * 100)
              : 0;
              
            const privatePercentage = option.privateVotes && totalVotes > 0
              ? Math.round((option.privateVotes / totalVotes) * 100)
              : 0;
            
            const isWinner = hasWinner && option.votes === maxVotes;
            
            return (
              <Box key={option.id} sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Box display="flex" alignItems="center">
                    <Typography 
                      variant="body1" 
                      fontWeight={isWinner ? 'bold' : 'normal'}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      {option.text}
                      {isUserVote(option.id) && (
                        <Chip 
                          label="Your Vote" 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ ml: 1, height: 20 }}
                        />
                      )}
                      {isWinner && (
                        <Tooltip title="Winning option">
                          <CheckCircleIcon 
                            color="success" 
                            fontSize="small" 
                            sx={{ ml: 1 }} 
                          />
                        </Tooltip>
                      )}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {option.votes} votes ({percentage}%)
                  </Typography>
                </Box>
                
                {/* Total votes progress bar */}
                <Box sx={{ position: 'relative', height: 10, mb: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={percentage} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: 'background.paper',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: isWinner 
                          ? 'success.main' 
                          : isUserVote(option.id) 
                            ? 'primary.main' 
                            : 'primary.light'
                      }
                    }} 
                  />
                </Box>
                
                {/* Vote type breakdown */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  {option.publicVotes > 0 && (
                    <Tooltip title={`${option.publicVotes} public votes`}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PublicIcon fontSize="small" color="info" />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          {option.publicVotes}
                        </Typography>
                      </Box>
                    </Tooltip>
                  )}
                  
                  {option.privateVotes > 0 && (
                    <Tooltip title={`${option.privateVotes} private votes`}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LockIcon fontSize="small" color="secondary" />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          {option.privateVotes}
                        </Typography>
                      </Box>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            );
          })}
          
          <Divider sx={{ my: 2 }} />
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Total votes: {totalVotes}
            </Typography>
            
            {hasWinner && winningOptions.length > 0 && (
              <Typography variant="body2" color="success.main" fontWeight="bold">
                Winner: {winningOptions.length > 1 
                  ? 'Tie between ' + winningOptions.map(o => o.text).join(' and ')
                  : winningOptions[0].text
                }
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PollResults;
