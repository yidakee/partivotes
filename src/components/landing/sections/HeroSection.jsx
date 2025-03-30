import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  useTheme 
} from '@mui/material';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../../contexts/ThemeContext';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const HeroSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 12, sm: 15 },
        pb: { xs: 8, sm: 12 },
      }}
    >
      {/* Animated background elements for futuristic theme */}
      {isFuturistic && (
        <>
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2 }}
            sx={{
              position: 'absolute',
              top: '20%',
              left: '5%',
              width: '40vw',
              height: '40vw',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,255,240,0.3) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(40px)',
              zIndex: 0,
            }}
          />
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2, delay: 0.5 }}
            sx={{
              position: 'absolute',
              bottom: '10%',
              right: '5%',
              width: '30vw',
              height: '30vw',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,0,240,0.3) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(40px)',
              zIndex: 0,
            }}
          />
        </>
      )}
      
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Typography 
                  variant="overline" 
                  component="div"
                  sx={{ 
                    mb: 2, 
                    color: isFuturistic ? '#00fff0' : theme.palette.primary.main,
                    fontWeight: 'bold',
                    letterSpacing: 2,
                    ...(isFuturistic && {
                      textShadow: '0 0 10px rgba(0, 255, 240, 0.5)',
                    }),
                  }}
                >
                  NEXT GENERATION VOTING PLATFORM
                </Typography>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Typography 
                  variant="h1" 
                  component="h1"
                  sx={{ 
                    fontWeight: 900, 
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    backgroundImage: isFuturistic ? 'linear-gradient(90deg, #00fff0, #ff00ff)' : 'none',
                    backgroundClip: isFuturistic ? 'text' : 'none',
                    textFillColor: isFuturistic ? 'transparent' : 'inherit',
                    WebkitBackgroundClip: isFuturistic ? 'text' : 'none',
                    WebkitTextFillColor: isFuturistic ? 'transparent' : 'inherit',
                    ...(isFuturistic && {
                      textShadow: '0 0 20px rgba(0, 255, 240, 0.3)',
                    }),
                  }}
                >
                  Decentralize Your Decision Making
                </Typography>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Typography 
                  variant="h5" 
                  color="textSecondary"
                  sx={{ 
                    mb: 4, 
                    maxWidth: '90%',
                    ...(isFuturistic && {
                      color: 'rgba(255, 255, 255, 0.8)',
                    }),
                  }}
                >
                  Create, vote, and manage polls with complete transparency and security. 
                  PartiVotes brings blockchain-based voting to communities, organizations, and teams.
                </Typography>
              </motion.div>
              
              <Box 
                component={motion.div} 
                variants={itemVariants}
                sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexWrap: { xs: 'wrap', sm: 'nowrap' } 
                }}
              >
                <Button
                  variant={isFuturistic ? "outlined" : "contained"}
                  size="large"
                  onClick={() => navigate('/polls')}
                  startIcon={<HowToVoteIcon />}
                  sx={{
                    py: 1.5,
                    px: 3,
                    fontWeight: 'bold',
                    ...(isFuturistic && {
                      background: 'linear-gradient(45deg, #00fff0, #0088ff)',
                      color: '#fff',
                      border: '1px solid rgba(0, 255, 240, 0.5)',
                      boxShadow: '0 0 15px rgba(0, 255, 240, 0.5)',
                      textShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #00f0e6, #0080ff)',
                        boxShadow: '0 0 20px rgba(0, 255, 240, 0.7)',
                        transform: 'translateY(-2px)',
                      },
                    }),
                  }}
                >
                  Explore Active Polls
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/polls/create')}
                  sx={{
                    py: 1.5,
                    px: 3,
                    ...(isFuturistic && {
                      borderColor: 'rgba(255, 0, 240, 0.5)',
                      color: '#ff00ff',
                      textShadow: '0 0 5px rgba(255, 0, 240, 0.3)',
                      '&:hover': {
                        borderColor: '#ff00ff',
                        boxShadow: '0 0 10px rgba(255, 0, 240, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                    }),
                  }}
                >
                  Create Your Poll
                </Button>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box 
              component={motion.div}
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              sx={{ 
                position: 'relative',
                textAlign: 'center',
              }}
            >
              {/* Hero image with animated shadow effect */}
              <Box
                component="img"
                src="/images/hero-voting-platform.png"
                alt="PartiVotes Platform"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: isFuturistic 
                    ? '0 0 30px rgba(0, 255, 240, 0.4)'
                    : '0 10px 40px rgba(0, 0, 0, 0.1)',
                  transform: 'perspective(1500px) rotateY(10deg)',
                  transition: 'all 0.5s ease',
                  '&:hover': {
                    transform: 'perspective(1500px) rotateY(0deg)',
                    boxShadow: isFuturistic 
                      ? '0 0 40px rgba(0, 255, 240, 0.6)'
                      : '0 15px 50px rgba(0, 0, 0, 0.15)',
                  },
                }}
              />
              
              {/* Floating badge elements */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                sx={{
                  position: 'absolute',
                  top: '10%',
                  right: { xs: '0%', md: '-10%' },
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  p: 2,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  maxWidth: '180px',
                  zIndex: 2,
                  display: { xs: 'none', sm: 'block' },
                  ...(isFuturistic && {
                    background: 'rgba(0, 20, 40, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 255, 240, 0.3)',
                    boxShadow: '0 0 20px rgba(0, 255, 240, 0.3)',
                  }),
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  fontWeight="bold"
                  sx={{
                    color: isFuturistic ? '#00fff0' : theme.palette.primary.main,
                  }}
                >
                  100% Transparent
                </Typography>
                <Typography variant="body2" color={isFuturistic ? 'white' : 'text.secondary'}>
                  All votes are recorded on the blockchain
                </Typography>
              </Box>
              
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                sx={{
                  position: 'absolute',
                  bottom: '10%',
                  left: { xs: '0%', md: '-5%' },
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  p: 2,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  maxWidth: '180px',
                  zIndex: 2,
                  display: { xs: 'none', sm: 'block' },
                  ...(isFuturistic && {
                    background: 'rgba(0, 20, 40, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 0, 240, 0.3)',
                    boxShadow: '0 0 20px rgba(255, 0, 240, 0.3)',
                  }),
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  fontWeight="bold"
                  sx={{
                    color: isFuturistic ? '#ff00ff' : theme.palette.secondary.main,
                  }}
                >
                  Secure Voting
                </Typography>
                <Typography variant="body2" color={isFuturistic ? 'white' : 'text.secondary'}>
                  Your vote is private and tamper-proof
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Down arrow animation for scroll indicator */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1,
          delay: 2,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.2
        }}
        sx={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            mb: 1,
            color: isFuturistic ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
          }}
        >
          Discover More
        </Typography>
        <Box 
          sx={{ 
            width: '30px',
            height: '30px',
            borderBottom: `2px solid ${isFuturistic ? '#00fff0' : theme.palette.primary.main}`,
            borderRight: `2px solid ${isFuturistic ? '#00fff0' : theme.palette.primary.main}`,
            transform: 'rotate(45deg)',
          }} 
        />
      </Box>
    </Box>
  );
};

export default HeroSection;
