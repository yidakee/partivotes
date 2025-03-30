import React, { useContext, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Avatar,
  Card,
  CardContent,
  Rating,
  IconButton,
  useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../../contexts/ThemeContext';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const TestimonialSection = () => {
  const theme = useTheme();
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Community Manager at TechDAO",
      image: "/images/testimonial1.jpg",
      quote: "PartiVotes transformed how our community makes decisions. The transparency and security give everyone confidence in the process. We've seen participation increase by 60% since switching!",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "University Student Association",
      image: "/images/testimonial2.jpg",
      quote: "Our student elections have never been more secure or engaging. The real-time results keep everyone excited, and the blockchain verification eliminated disputes about vote counts.",
      rating: 5
    },
    {
      name: "Jennifer Wei",
      role: "Product Manager at BlockFin",
      image: "/images/testimonial3.jpg",
      quote: "We've tried several voting platforms, but PartiVotes offers the best combination of security and user experience. The ability to create different poll types gives us flexibility for various decisions.",
      rating: 5
    },
    {
      name: "David Okereke",
      role: "Local Governance Advocate",
      image: "/images/testimonial4.jpg",
      quote: "PartiVotes has made community decision-making accessible to everyone. The intuitive interface means even non-technical people can participate confidently in blockchain voting.",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const cardVariants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => {
      return {
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    nextTestimonial();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevTestimonial();
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
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 10,
              ease: "easeInOut",
            }}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at 30% 50%, rgba(0,255,240,0.1) 0%, rgba(0,0,0,0) 60%)',
              filter: 'blur(60px)',
              zIndex: 0,
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
              SUCCESS STORIES
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
              What Our Users Say
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
              Discover how PartiVotes is empowering communities and organizations around the world to make better decisions together.
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ position: 'relative', minHeight: '400px' }}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              style={{
                position: 'absolute',
                width: '100%'
              }}
            >
              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={8}>
                  <Card
                    sx={{
                      position: 'relative',
                      borderRadius: '16px',
                      overflow: 'visible',
                      p: 2,
                      ...(isFuturistic && {
                        background: 'rgba(0, 20, 40, 0.5)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0, 255, 240, 0.1)',
                        boxShadow: '0 0 30px rgba(0, 255, 240, 0.15)',
                      }),
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '-30px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 3,
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isFuturistic 
                            ? 'linear-gradient(135deg, #00fff0, #0088ff)'
                            : theme.palette.primary.main,
                          boxShadow: isFuturistic 
                            ? '0 0 20px rgba(0, 255, 240, 0.5)'
                            : '0 8px 16px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <FormatQuoteIcon 
                          sx={{ 
                            color: '#fff', 
                            fontSize: '28px',
                            transform: 'rotate(180deg)'
                          }} 
                        />
                      </Box>
                      
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: '1.125rem',
                          fontStyle: 'italic',
                          textAlign: 'center',
                          mb: 4,
                          mt: 3,
                          ...(isFuturistic && {
                            color: 'rgba(255, 255, 255, 0.9)',
                          }),
                        }}
                      >
                        "{testimonials[activeIndex].quote}"
                      </Typography>
                      
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Avatar
                          src={testimonials[activeIndex].image}
                          alt={testimonials[activeIndex].name}
                          sx={{
                            width: 80,
                            height: 80,
                            mb: 2,
                            border: isFuturistic 
                              ? '3px solid #00fff0'
                              : `3px solid ${theme.palette.primary.main}`,
                            boxShadow: isFuturistic 
                              ? '0 0 15px rgba(0, 255, 240, 0.5)'
                              : '0 4px 10px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                        
                        <Typography
                          variant="h6"
                          component="h3"
                          fontWeight="bold"
                          sx={{
                            mb: 0.5,
                            ...(isFuturistic && {
                              color: '#ffffff',
                            }),
                          }}
                        >
                          {testimonials[activeIndex].name}
                        </Typography>
                        
                        <Typography
                          variant="body2"
                          color={isFuturistic ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'}
                          mb={2}
                        >
                          {testimonials[activeIndex].role}
                        </Typography>
                        
                        <Rating
                          value={testimonials[activeIndex].rating}
                          readOnly
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: isFuturistic ? '#00fff0' : undefined,
                            },
                            ...(isFuturistic && {
                              '& .MuiRating-icon': {
                                filter: 'drop-shadow(0 0 3px rgba(0, 255, 240, 0.5))',
                              },
                            }),
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          </AnimatePresence>
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              transform: 'translateY(-50%)',
              px: 2,
              zIndex: 5,
            }}
          >
            <IconButton
              onClick={handlePrev}
              sx={{
                backgroundColor: isFuturistic ? 'rgba(0, 255, 240, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: isFuturistic ? 'rgba(0, 255, 240, 0.2)' : 'rgba(255, 255, 255, 0.95)',
                },
                ...(isFuturistic && {
                  border: '1px solid rgba(0, 255, 240, 0.3)',
                  color: '#00fff0',
                }),
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            
            <IconButton
              onClick={handleNext}
              sx={{
                backgroundColor: isFuturistic ? 'rgba(0, 255, 240, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: isFuturistic ? 'rgba(0, 255, 240, 0.2)' : 'rgba(255, 255, 255, 0.95)',
                },
                ...(isFuturistic && {
                  border: '1px solid rgba(0, 255, 240, 0.3)',
                  color: '#00fff0',
                }),
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        {/* Testimonial indicators */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
          }}
        >
          {testimonials.map((_, index) => (
            <Box
              key={index}
              component={motion.div}
              whileHover={{ scale: 1.2 }}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              sx={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                mx: 1,
                cursor: 'pointer',
                background: index === activeIndex
                  ? (isFuturistic ? '#00fff0' : theme.palette.primary.main)
                  : (isFuturistic ? 'rgba(0, 255, 240, 0.3)' : 'rgba(0, 0, 0, 0.2)'),
                transition: 'all 0.3s ease',
                ...(isFuturistic && index === activeIndex && {
                  boxShadow: '0 0 10px rgba(0, 255, 240, 0.7)',
                }),
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialSection;
