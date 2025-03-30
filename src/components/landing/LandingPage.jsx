import React, { useEffect, useContext } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../contexts/ThemeContext';

// Import all section components
import HeroSection from './sections/HeroSection';
import FeatureSection from './sections/FeatureSection';
import HowItWorksSection from './sections/HowItWorksSection';
import TestimonialSection from './sections/TestimonialSection';
import CTASection from './sections/CTASection';

const LandingPage = () => {
  const theme = useTheme();
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        overflowX: 'hidden',
        background: isFuturistic 
          ? 'linear-gradient(180deg, rgba(0,0,15,1) 0%, rgba(0,15,30,1) 100%)' 
          : theme.palette.background.default,
      }}
    >
      {/* Hero Section - First fold */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <HeroSection />
      </motion.div>
      
      {/* Features Section - Second fold */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <FeatureSection />
      </motion.div>
      
      {/* How It Works - Third fold */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <HowItWorksSection />
      </motion.div>
      
      {/* Testimonials - Fourth fold */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <TestimonialSection />
      </motion.div>
      
      {/* CTA Section - Fifth fold */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <CTASection />
      </motion.div>
    </Box>
  );
};

export default LandingPage;
