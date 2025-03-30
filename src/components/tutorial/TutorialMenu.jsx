import React, { useState } from 'react';
import {
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Collapse
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PollIcon from '@mui/icons-material/Poll';
import BallotIcon from '@mui/icons-material/Ballot';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

const TutorialMenu = () => {
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const theme = useTheme();
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };

  const handleSectionClick = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const tutorialSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <InfoIcon />,
      content: (
        <>
          <Typography variant="body2" paragraph>
            Welcome to PartiVotes, a decentralized voting platform built on the Partisia Blockchain!
          </Typography>
          <Typography variant="body2" paragraph>
            PartiVotes allows you to participate in polls and create your own polls with complete privacy and security.
          </Typography>
        </>
      )
    },
    {
      id: 'connect-wallet',
      title: 'Connecting Your Wallet',
      icon: <AccountBalanceWalletIcon />,
      content: (
        <>
          <Typography variant="body2" paragraph>
            1. Click the "Connect Wallet" button in the top right corner.
          </Typography>
          <Typography variant="body2" paragraph>
            2. Select your preferred wallet provider.
          </Typography>
          <Typography variant="body2" paragraph>
            3. Follow the prompts to connect your wallet.
          </Typography>
          <Typography variant="body2" paragraph>
            4. Once connected, your wallet address will appear in the header.
          </Typography>
        </>
      )
    },
    {
      id: 'voting',
      title: 'How to Vote',
      icon: <HowToVoteIcon />,
      content: (
        <>
          <Typography variant="body2" paragraph>
            1. Browse the active polls on the home page.
          </Typography>
          <Typography variant="body2" paragraph>
            2. Click on a poll to view details.
          </Typography>
          <Typography variant="body2" paragraph>
            3. Select your preferred option.
          </Typography>
          <Typography variant="body2" paragraph>
            4. Click "Submit Vote" to cast your vote.
          </Typography>
          <Typography variant="body2" paragraph>
            5. Confirm the transaction in your wallet.
          </Typography>
          <Typography variant="body2" paragraph>
            6. View results after voting.
          </Typography>
        </>
      )
    },
    {
      id: 'voting-methods',
      title: 'Voting Methods',
      icon: <BallotIcon />,
      content: (
        <>
          <Typography variant="body2" paragraph>
            PartiVotes supports multiple voting methods to suit different types of decisions:
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>
            Single Choice Voting
          </Typography>
          <Typography variant="body2" paragraph>
            The simplest form of voting where each voter selects exactly one option. Best for straightforward decisions with mutually exclusive options.
          </Typography>
          
          <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>
            Multiple Choice Voting
          </Typography>
          <Typography variant="body2" paragraph>
            Allows voters to select multiple options up to a specified limit. Ideal for decisions where multiple selections make sense, such as selecting features for a product.
          </Typography>
          
          <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>
            Ranked Choice Voting
          </Typography>
          <Typography variant="body2" paragraph>
            Voters rank options in order of preference. If no option receives a majority, the lowest-ranked option is eliminated and its votes redistributed until a winner emerges.
          </Typography>
          
          <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 'bold' }}>
            Coming Soon:
          </Typography>
          <Typography variant="body2" paragraph>
            • Delegated Voting: Allow voters to delegate their voting power to trusted representatives.
          </Typography>
          <Typography variant="body2" paragraph>
            • Quadratic Voting: Voters receive voting credits they can allocate across options, with costs increasing quadratically.
          </Typography>
          <Typography variant="body2" paragraph>
            • Weighted Voting: Votes are weighted based on predefined criteria such as token holdings.
          </Typography>
        </>
      )
    },
    {
      id: 'creating-polls',
      title: 'Creating Polls',
      icon: <PollIcon />,
      content: (
        <>
          <Typography variant="body2" paragraph>
            1. Click the "+" button on the home page.
          </Typography>
          <Typography variant="body2" paragraph>
            2. Fill in the poll details: title, description, options, and end date.
          </Typography>
          <Typography variant="body2" paragraph>
            3. Select one of the Vote Methods.
          </Typography>
          <Typography variant="body2" paragraph>
            4. Click "Create Poll" to publish your poll.
          </Typography>
          <Typography variant="body2" paragraph>
            5. Confirm the transaction in your wallet.
          </Typography>
        </>
      )
    },
    {
      id: 'privacy-security',
      title: 'Privacy & Security',
      icon: <SecurityIcon />,
      content: (
        <>
          <Typography variant="body2" paragraph>
            PartiVotes leverages the Partisia Blockchain's Multi-Party Computation (MPC) technology to ensure:
          </Typography>
          <Typography variant="body2" paragraph>
            • Complete vote privacy - no one can see your individual vote
          </Typography>
          <Typography variant="body2" paragraph>
            • Tamper-proof results - votes cannot be altered once cast
          </Typography>
          <Typography variant="body2" paragraph>
            • Transparent counting - results are verifiable without revealing individual votes
          </Typography>
          <Typography variant="body2" paragraph>
            • Decentralized infrastructure - no single point of failure
          </Typography>
        </>
      )
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      icon: <WarningAmberIcon />,
      content: (
        <>
          <Typography variant="body2" paragraph>
            <strong>Important Notice:</strong> PartiVotes is currently a proof of concept application designed to demonstrate the capabilities of blockchain-based voting systems.
          </Typography>
          <Typography variant="body2" paragraph>
            This application is:
          </Typography>
          <Typography variant="body2" paragraph>
            • <strong>Not intended for critical or high-stakes voting</strong> - While we implement strong security measures, this platform is still in development.
          </Typography>
          <Typography variant="body2" paragraph>
            • <strong>For demonstration and educational purposes</strong> - The primary goal is to showcase the potential of decentralized voting technology.
          </Typography>
          <Typography variant="body2" paragraph>
            • <strong>Subject to ongoing development</strong> - Features, security, and performance improvements are continuously being implemented.
          </Typography>
          <Typography variant="body2" paragraph>
            By using PartiVotes, you acknowledge that:
          </Typography>
          <Typography variant="body2" paragraph>
            • The application may contain bugs or vulnerabilities.
          </Typography>
          <Typography variant="body2" paragraph>
            • Data persistence is not guaranteed across all versions.
          </Typography>
          <Typography variant="body2" paragraph>
            • The development team is not liable for any losses or damages resulting from the use of this application.
          </Typography>
          <Typography variant="body2" paragraph>
            We welcome feedback and contributions to improve PartiVotes as we work toward a production-ready decentralized voting platform.
          </Typography>
        </>
      )
    }
  ];

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="tutorial"
        onClick={toggleDrawer(true)}
        sx={{
          mr: 2,
          transition: 'all 0.3s ease',
          ...(isFuturistic && {
            '&:hover': {
              color: '#00fff0',
              transform: 'scale(1.1)',
            },
          }),
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 320,
            bgcolor: theme.palette.background.paper,
            ...(isFuturistic && {
              borderRight: '1px solid #00fff0',
              boxShadow: '0 0 10px #00fff0',
            }),
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              ...(isFuturistic && {
                color: '#00fff0',
                textShadow: '0 0 5px #00fff0',
              }),
            }}
          >
            PartiVotes Tutorial
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Learn how to use the PartiVotes platform with this step-by-step guide.
          </Typography>
        </Box>
        <Divider />
        <List>
          {tutorialSections.map((section) => (
            <React.Fragment key={section.id}>
              <ListItem 
                button 
                onClick={() => handleSectionClick(section.id)}
                sx={{
                  ...(isFuturistic && {
                    '&:hover': {
                      bgcolor: 'rgba(0, 255, 240, 0.1)',
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    ...(isFuturistic && {
                      color: '#00fff0',
                    }),
                  }}
                >
                  {section.icon}
                </ListItemIcon>
                <ListItemText primary={section.title} />
                {expandedSection === section.id ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={expandedSection === section.id} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2, pl: 6, pr: 3 }}>
                  {section.content}
                </Box>
              </Collapse>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default TutorialMenu;
