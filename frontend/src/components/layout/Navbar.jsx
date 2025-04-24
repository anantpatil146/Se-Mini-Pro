// Navbar Component
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, useTheme, alpha } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = ({ currentUser }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <AppBar 
      position="static" 
      sx={{
        background: `linear-gradient(90deg, ${alpha(theme.palette.primary.dark, 0.95)} 0%, ${alpha(theme.palette.secondary.dark, 0.95)} 100%)`,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SE-Recruitment-Platform
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              sx={{ mx: 1 }}
            >
              Home
            </Button>
            {currentUser && (
              <Button 
                color="inherit" 
                component={Link} 
                to="/upload-resume"
                sx={{ mx: 1 }}
              >
                Upload Resume
              </Button>
            )}
          </Box>
          
          <Box>
            {currentUser ? (
              <Button 
                color="inherit" 
                onClick={handleLogout}
                sx={{
                  borderRadius: theme.shape.borderRadius * 2,
                  px: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1)
                  }
                }}
              >
                Logout
              </Button>
            ) : (
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{
                  borderRadius: theme.shape.borderRadius * 2,
                  px: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1)
                  }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;