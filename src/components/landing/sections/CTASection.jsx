import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme 
} from '@mui/material';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../../contexts/ThemeContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const CTASection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';

  const benefits = [
    "Create unlimited polls with various voting types",
    "Secure blockchain-based voting system",
    "Real-time results and analytics",
    "Mobile-friendly interface",
    "Community support and updates"
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: isFuturistic
          ? 'linear-gradient(180deg, rgba(0,30,45,1) 0%, rgba(0,10,20,1) 100%)'
          : theme.palette.background.paper,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements for futuristic theme */}
      {isFuturistic && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 360],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 30,
              ease: "linear",
            }}
            style={{
              position: 'absolute',
              width: '120%',
              height: '120%',
              top: '-10%',
              left: '-10%',
              background: 'radial-gradient(ellipse at center, rgba(0,255,240,0.05) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(40px)',
              zIndex: 0,
            }}
          />
        </>
      )}

      <Container maxWidth="lg">
        <Grid 
          container 
          spacing={4} 
          alignItems="center" 
          justifyContent="center"
          sx={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Grid item xs={12} md={10}>
            <Paper
              elevation={isFuturistic ? 0 : 8}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                ...(isFuturistic && {
                  background: 'rgba(0, 20, 40, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 255, 240, 0.2)',
                  boxShadow: '0 0 40px rgba(0, 255, 240, 0.15)',
                }),
              }}
            >
              {/* Background gradient for futuristic theme */}
              {isFuturistic && (
                <Box
                  component={motion.div}
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 8,
                    ease: "easeInOut",
                  }}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0,255,240,0.1) 0%, rgba(255,0,240,0.1) 100%)',
                    borderRadius: '20px',
                    zIndex: -1,
                  }}
                />
              )}
              
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={7}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Typography
                      variant="h2"
                      component="h2"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        ...(isFuturistic && {
                          backgroundImage: 'linear-gradient(90deg, #00fff0, #ff00ff)',
                          backgroundClip: 'text',
                          textFillColor: 'transparent',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          textShadow: '0 0 20px rgba(0, 255, 240, 0.2)',
                        }),
                      }}
                    >
                      Ready to Transform Your Decision Making?
                    </Typography>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 4,
                        ...(isFuturistic && {
                          color: 'rgba(255, 255, 255, 0.8)',
                        }),
                      }}
                    >
                      Join thousands of communities and organizations using PartiVotes to make better decisions together.
                    </Typography>
                    
                    <List sx={{ mb: 4 }}>
                      {benefits.map((benefit, index) => (
                        <ListItem 
                          key={index} 
                          disableGutters 
                          sx={{ py: 1 }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <CheckCircleIcon 
                              color={isFuturistic ? "inherit" : "primary"} 
                              sx={{ 
                                ...(isFuturistic && {
                                  color: '#00fff0',
                                  filter: 'drop-shadow(0 0 5px rgba(0, 255, 240, 0.5))',
                                }),
                              }} 
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={benefit} 
                            sx={{
                              '& .MuiListItemText-primary': {
                                ...(isFuturistic && {
                                  color: 'rgba(255, 255, 255, 0.9)',
                                }),
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Box 
                      component={motion.div}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2 
                      }}
                    >
                      <Button
                        variant={isFuturistic ? "outlined" : "contained"}
                        size="large"
                        onClick={() => navigate('/polls')}
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          py: 1.5,
                          px: 4,
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
                        Get Started Now
                      </Button>
                      
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/polls/create')}
                        startIcon={<RocketLaunchIcon />}
                        sx={{
                          py: 1.5,
                          px: 4,
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
                        Create Your First Poll
                      </Button>
                    </Box>
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={5}>
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    sx={{
                      position: 'relative',
                      textAlign: 'center',
                    }}
                  >
                    {/* Dashboard mockup image */}
                    <Box
                      component="img"
                      src="/images/dashboard-mockup.png"
                      alt="PartiVotes Dashboard"
                      sx={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                        boxShadow: isFuturistic 
                          ? '0 0 30px rgba(255, 0, 240, 0.3)'
                          : '0 20px 40px rgba(0, 0, 0, 0.2)',
                        transform: 'perspective(1000px) rotateY(-10deg)',
                        transition: 'all 0.5s ease',
                        '&:hover': {
                          transform: 'perspective(1000px) rotateY(-5deg) translateY(-10px)',
                          boxShadow: isFuturistic 
                            ? '0 0 40px rgba(255, 0, 240, 0.5)'
                            : '0 25px 50px rgba(0, 0, 0, 0.25)',
                        },
                      }}
                    />
                    
                    {/* Floating element */}
                    <Box
                      component={motion.div}
                      animate={{
                        y: ['-5px', '5px', '-5px'],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut",
                      }}
                      sx={{
                        position: 'absolute',
                        bottom: { xs: '-20px', md: '-40px' },
                        right: { xs: '10px', md: '-20px' },
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        p: 2,
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                        zIndex: 2,
                        maxWidth: '180px',
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
                        Real-time Analytics
                      </Typography>
                      <Typography variant="body2" color={isFuturistic ? 'white' : 'text.secondary'}>
                        Track participation and results as they happen
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        
        <Box 
          component="footer"
          sx={{ 
            mt: 10, 
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography 
            variant="body2" 
            color={isFuturistic ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'}
            sx={{ mb: 1 }}
          >
            © {new Date().getFullYear()} PartiVotes. All rights reserved.
          </Typography>
          <Typography 
            variant="caption" 
            color={isFuturistic ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary'}
          >
            Blockchain voting for a decentralized future
          </Typography>
          
          {/* Logo glow effect for futuristic theme */}
          {isFuturistic && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
              }}
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src="/logo192.png"
                alt="PartiVotes Logo"
                sx={{
                  height: '40px',
                  width: 'auto',
                  filter: 'drop-shadow(0 0 10px rgba(0, 255, 240, 0.7))',
                }}
              />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default CTASection;
