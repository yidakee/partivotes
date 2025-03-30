import React, { useContext } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  useTheme,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../../contexts/ThemeContext';

const HowItWorksSection = () => {
  const theme = useTheme();
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';

  const steps = [
    {
      label: "Connect Your Wallet",
      description: "Use your favorite Web3 wallet to easily connect to the platform. Your wallet acts as your secure identity.",
    },
    {
      label: "Create or Join a Poll",
      description: "Create your own customized poll or participate in existing ones from our active polls section.",
    },
    {
      label: "Cast Your Vote Securely",
      description: "Vote with complete privacy. Your choice is encrypted and secured by blockchain technology.",
    },
    {
      label: "View Real-time Results",
      description: "Watch as results update in real-time. All votes are verified and tamper-proof on the blockchain.",
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: isFuturistic
          ? 'linear-gradient(180deg, rgba(0,30,45,1) 0%, rgba(0,15,30,1) 100%)'
          : theme.palette.background.paper,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements for futuristic theme */}
      {isFuturistic && (
        <>
          <Box
            component={motion.div}
            animate={{
              x: ['10%', '-10%'],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 15,
              ease: "easeInOut",
            }}
            sx={{
              position: 'absolute',
              width: '60%',
              height: '80%',
              background: 'radial-gradient(ellipse at center, rgba(255,0,240,0.1) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(80px)',
              zIndex: 0,
              top: '10%',
              right: '-20%',
            }}
          />
        </>
      )}

      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="overline"
                component="div"
                sx={{
                  mb: 2,
                  color: isFuturistic ? '#ff00ff' : theme.palette.secondary.main,
                  fontWeight: 'bold',
                  letterSpacing: 2,
                  ...(isFuturistic && {
                    textShadow: '0 0 10px rgba(255, 0, 240, 0.5)',
                  }),
                }}
              >
                SIMPLE PROCESS
              </Typography>
              
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  ...(isFuturistic && {
                    backgroundImage: 'linear-gradient(90deg, #ff00ff, #ff0088)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 20px rgba(255, 0, 240, 0.2)',
                  }),
                }}
              >
                How PartiVotes Works
              </Typography>
              
              <Typography
                variant="h6"
                color="textSecondary"
                paragraph
                sx={{
                  mb: 4,
                  ...(isFuturistic && {
                    color: 'rgba(255, 255, 255, 0.8)',
                  }),
                }}
              >
                We've simplified the voting process while maintaining maximum security. Follow these easy steps to start participating in decentralized decision-making.
              </Typography>

              {/* Mobile device mockup for larger screens */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                sx={{
                  position: 'relative',
                  display: { xs: 'none', md: 'block' },
                  mt: 6,
                }}
              >
                <Box
                  sx={{
                    width: '280px',
                    height: '550px',
                    borderRadius: '40px',
                    border: isFuturistic ? '8px solid #001428' : '8px solid #333',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: isFuturistic 
                      ? '0 0 30px rgba(255, 0, 240, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.8)'
                      : '0 20px 40px rgba(0, 0, 0, 0.2)',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '30px',
                      background: isFuturistic ? '#001428' : '#333',
                      borderRadius: '32px 32px 0 0',
                      zIndex: 2,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="/images/mobile-app-screen.png"
                    alt="PartiVotes Mobile App"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '32px',
                      background: isFuturistic ? '#001020' : '#f5f5f5',
                    }}
                  />
                  
                  {/* Glowing animation for futuristic theme */}
                  {isFuturistic && (
                    <Box
                      component={motion.div}
                      animate={{
                        opacity: [0.4, 0.8, 0.4],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                      }}
                      sx={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '120px',
                        height: '5px',
                        borderRadius: '3px',
                        background: 'linear-gradient(90deg, #ff00ff, #00fff0)',
                        filter: 'blur(2px)',
                      }}
                    />
                  )}
                </Box>
              </Box>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Stepper 
                orientation="vertical" 
                sx={{
                  '& .MuiStepConnector-line': {
                    ...(isFuturistic && {
                      borderColor: 'rgba(0, 255, 240, 0.3)',
                      minHeight: '40px',
                    }),
                  },
                  '& .MuiStepLabel-iconContainer': {
                    ...(isFuturistic && {
                      '& .MuiStepIcon-root': {
                        color: '#00fff0',
                        filter: 'drop-shadow(0 0 5px rgba(0, 255, 240, 0.7))',
                      },
                      '& .MuiStepIcon-text': {
                        fill: '#001428',
                        fontWeight: 'bold',
                      },
                    }),
                  },
                }}
              >
                {steps.map((step, index) => (
                  <Step key={step.label} active={true}>
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                    >
                      <StepLabel
                        sx={{
                          '& .MuiStepLabel-label': {
                            typography: 'h6',
                            fontWeight: 'bold',
                            ...(isFuturistic && {
                              color: '#ffffff',
                            }),
                          },
                        }}
                      >
                        {step.label}
                      </StepLabel>
                      <StepContent
                        sx={{
                          borderLeft: isFuturistic ? '1px solid rgba(0, 255, 240, 0.3)' : undefined,
                          pb: 4,
                          pr: 4,
                        }}
                      >
                        <Typography
                          sx={{
                            ...(isFuturistic && {
                              color: 'rgba(255, 255, 255, 0.8)',
                            }),
                          }}
                        >
                          {step.description}
                        </Typography>
                        
                        {/* Number indicator */}
                        <Box
                          component={motion.div}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          sx={{
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: isFuturistic 
                              ? 'linear-gradient(45deg, #ff00ff, #00fff0)'
                              : theme.palette.primary.main,
                            color: '#fff',
                            fontWeight: 'bold',
                            mt: 2,
                            boxShadow: isFuturistic 
                              ? '0 0 15px rgba(255, 0, 240, 0.5)'
                              : '0 4px 8px rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          {index + 1}
                        </Box>
                      </StepContent>
                    </motion.div>
                  </Step>
                ))}
              </Stepper>
            </Box>
            
            {/* Mobile device mockup for small screens */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              sx={{
                position: 'relative',
                display: { xs: 'flex', md: 'none' },
                justifyContent: 'center',
                mt: 6,
              }}
            >
              <Box
                sx={{
                  width: '220px',
                  height: '440px',
                  borderRadius: '30px',
                  border: isFuturistic ? '6px solid #001428' : '6px solid #333',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isFuturistic 
                    ? '0 0 30px rgba(255, 0, 240, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.8)'
                    : '0 20px 40px rgba(0, 0, 0, 0.2)',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '24px',
                    background: isFuturistic ? '#001428' : '#333',
                    borderRadius: '24px 24px 0 0',
                    zIndex: 2,
                  },
                }}
              >
                <Box
                  component="img"
                  src="/images/mobile-app-screen.png"
                  alt="PartiVotes Mobile App"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '24px',
                    background: isFuturistic ? '#001020' : '#f5f5f5',
                  }}
                />
                
                {/* Glowing animation for futuristic theme */}
                {isFuturistic && (
                  <Box
                    component={motion.div}
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                    }}
                    sx={{
                      position: 'absolute',
                      bottom: '30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '90px',
                      height: '4px',
                      borderRadius: '2px',
                      background: 'linear-gradient(90deg, #ff00ff, #00fff0)',
                      filter: 'blur(2px)',
                    }}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;
