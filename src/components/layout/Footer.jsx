import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {currentYear}
          {' '}
          <Link color="inherit" href="https://partisiablockchain.com/" target="_blank" rel="noopener">
            PartiVotes
          </Link>
          {' - Built on Partisia Blockchain'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
