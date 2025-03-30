import React, { useContext } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  useTheme 
} from '@mui/material';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../../contexts/ThemeContext';

// Import icons
import LockIcon from '@mui/icons-material/Lock';
import SpeedIcon from '@mui/icons-material/Speed';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PublicIcon from '@mui/icons-material/Public';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PieChartIcon from '@mui/icons-material/PieChart';

const FeatureSection = () => {
  const theme = useTheme();
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';

  const features = [
    {
      icon: <LockIcon fontSize="large" />,
      title: "Secure Voting",
      description: "End-to-end encrypted voting ensures your vote remains confidential while maintaining transparency of results."
    },
    {
      icon: <SpeedIcon fontSize="large" />,
      title: "Lightning Fast",
      description: "Experience real-time results with our optimized blockchain infrastructure. No more waiting for manual counts."
    },
    {
      icon: <AccountBalanceWalletIcon fontSize="large" />,
      title: "Wallet Integration",
      description: "Connect your crypto wallet for seamless authentication and secure voting without sharing personal details."
    },
    {
      icon: <PublicIcon fontSize="large" />,
      title: "Global Accessibility",
      description: "Vote from anywhere in the world. All you need is internet access and a connected wallet."
    },
    {
      icon: <VerifiedUserIcon fontSize="large" />,
      title: "Tamper-Proof",
      description: "Blockchain technology ensures that once your vote is recorded, it cannot be altered or removed."
    },
    {
      icon: <PieChartIcon fontSize="large" />,
      title: "Advanced Analytics",
      description: "Get detailed insights and visualizations of voting patterns and participation statistics."
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: isFuturistic
          ? 'linear-gradient(180deg, rgba(0,15,30,1) 0%, rgba(0,30,45,1) 100%)'
          : theme.palette.background.default,
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
              x: ['-20%', '20%'],
              y: ['0%', '10%'],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 20,
              ease: "easeInOut",
            }}
            sx={{
              position: 'absolute',
              width: '70%',
              height: '70%',
              background: 'radial-gradient(ellipse at center, rgba(0,255,240,0.1) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(60px)',
              zIndex: 0,
              top: '10%',
              left: '15%',
            }}
          />
        </>
      )}

      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
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
              POWERFUL FEATURES
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                ...(isFuturistic && {
                  backgroundImage: 'linear-gradient(90deg, #00fff0, #0088ff)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 20px rgba(0, 255, 240, 0.2)',
                }),
              }}
            >
              Why Choose PartiVotes
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{
                maxWidth: '800px',
                mx: 'auto',
                ...(isFuturistic && {
                  color: 'rgba(255, 255, 255, 0.8)',
                }),
              }}
            >
              Our platform combines cutting-edge blockchain technology with intuitive design to create the most secure and efficient voting experience.
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    ...(isFuturistic && {
                      background: 'rgba(0, 20, 40, 0.5)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 255, 240, 0.1)',
                      boxShadow: '0 0 20px rgba(0, 255, 240, 0.1)',
                    }),
                  }}
                >
                  <CardContent
                    sx={{
                      p: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        color: isFuturistic ? '#00fff0' : theme.palette.primary.main,
                        ...(isFuturistic && {
                          filter: 'drop-shadow(0 0 8px rgba(0, 255, 240, 0.5))',
                        }),
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      fontWeight="bold"
                      sx={{
                        ...(isFuturistic && {
                          color: '#ffffff',
                        }),
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color={isFuturistic ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeatureSection;
