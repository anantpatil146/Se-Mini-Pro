// Footer Component
import React from 'react';
import { Box, Typography, Container, useTheme, alpha, Divider } from '@mui/material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 3,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SE-Recruitment-Platform
          </Typography>
          
          <Divider 
            sx={{ 
              width: '50%', 
              mb: 2,
              opacity: 0.2
            }} 
          />
          
          <Typography variant="body2" color="text.secondary">
            © {currentYear} AI Recruitment Platform. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;