import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Work as WorkIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Common styles
  const gradientText = {
    fontWeight: 700,
    background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing(2)
  };

  const gradientButton = {
    background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
    boxShadow: '0 3px 5px 2px rgba(144, 202, 249, .3)',
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(1.5, 4),
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 10px 4px rgba(144, 202, 249, .4)',
    }
  };

  const sectionHeading = {
    fontWeight: 600,
    marginBottom: theme.spacing(4),
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -10,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 60,
      height: 4,
      borderRadius: 2,
      background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
    }
  };

  const featureCard = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
    }
  };

  return (
    <Box
      sx={{
        // Remove minHeight constraint to allow content to determine height
        // and enable scrolling
        background: `linear-gradient(135deg,
          ${alpha(theme.palette.background.default, 0.95)} 0%,
          ${alpha(theme.palette.background.paper, 0.85)} 100%)`,
        pt: { xs: 6, md: 10 },
        pb: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'visible', // Changed from 'hidden' to allow scrolling
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%' // Ensure full width
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#90caf9', 0.1)} 0%, rgba(0,0,0,0) 70%)`,
          zIndex: 0,
          animation: 'pulse 15s infinite ease-in-out',
          '@keyframes pulse': {
            '0%': { opacity: 0.3, transform: 'scale(1)' },
            '50%': { opacity: 0.6, transform: 'scale(1.05)' },
            '100%': { opacity: 0.3, transform: 'scale(1)' },
          },
          pointerEvents: 'none' // Prevent interaction with background elements
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '5%',
          left: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#f48fb1', 0.1)} 0%, rgba(0,0,0,0) 70%)`,
          zIndex: 0,
          animation: 'float 20s infinite ease-in-out',
          '@keyframes float': {
            '0%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-30px)' },
            '100%': { transform: 'translateY(0)' },
          },
          pointerEvents: 'none' // Prevent interaction with background elements
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 4, lg: 4 },
          mx: 'auto',
          width: '100%'
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 10 },
            px: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography
            variant={isMobile ? "h3" : "h2"}
            component="h1"
            sx={gradientText}
          >
            SE-Recruitment-Platform
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h5"}
            color="text.secondary"
            paragraph
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              mb: 4,
              textAlign: 'center'
            }}
          >
            Revolutionizing tech recruitment with AI-powered resume analysis and job matching
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              ...gradientButton,
              display: 'block',
              mx: 'auto',
              mb: 4
            }}
            onClick={() => navigate(user ? '/resume-upload' : '/login')}
          >
            {user ? 'Upload Resume' : 'Get Started'}
          </Button>
        </Box>

        {/* Features Section */}
        <Box
          sx={{
            mb: { xs: 6, md: 10 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            align="center"
            sx={sectionHeading}
          >
            Key Features
          </Typography>
          <Grid
            container
            spacing={{ xs: 3, md: 4 }}
            justifyContent="center"
            alignItems="stretch"
            sx={{ mt: 2 }}
          >
            {[
              {
                icon: <CloudUploadIcon />,
                title: "Resume Analysis",
                description: "Upload your resume for AI-powered analysis that extracts key skills, experiences, and qualifications.",
                color: "#90caf9",
                bgColor: "rgba(144, 202, 249, 0.15)",
                path: "/resume-upload"
              },
              {
                icon: <WorkIcon />,
                title: "Job Matching",
                description: "Match your profile against job descriptions to find the perfect fit for your skills and experience.",
                color: "#f48fb1",
                bgColor: "rgba(244, 143, 177, 0.15)",
                path: "/job-upload"
              },
              {
                icon: <AssessmentIcon />,
                title: "AI Insights",
                description: "Get personalized feedback and suggestions to improve your resume and increase your chances of landing the job.",
                color: "#90caf9",
                bgColor: "rgba(144, 202, 249, 0.15)",
                path: "/insights"
              },
              {
                icon: <HistoryIcon />,
                title: "History Tracking",
                description: "Keep track of your past job applications and resume versions to monitor your progress over time.",
                color: "#f48fb1",
                bgColor: "rgba(244, 143, 177, 0.15)",
                path: "/history"
              }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={featureCard}>
                  <CardMedia
                    component="div"
                    sx={{
                      position: 'relative',
                      height: 140,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: feature.bgColor,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: 80,
                        color: feature.color,
                        transform: 'scale(1)',
                        transition: 'transform 0.3s ease',
                        '.MuiCard-root:hover &': {
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      {feature.icon}
                    </Box>
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1, p: 3, textAlign: 'center' }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h3"
                      fontWeight={600}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
                    <Button
                      size="small"
                      color="primary"
                      sx={{
                        fontWeight: 500,
                        '&:hover': { backgroundColor: alpha(feature.color, 0.1) }
                      }}
                      onClick={() => navigate(feature.path)}
                    >
                      Try Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* How it Works Section */}
        <Box
          sx={{
            mb: { xs: 6, md: 10 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            align="center"
            sx={sectionHeading}
          >
            How It Works
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 5 },
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              backdropFilter: 'blur(10px)',
              borderRadius: theme.shape.borderRadius * 2,
              overflow: 'hidden',
              width: '100%'
            }}
          >
            <Grid container spacing={4} justifyContent="center">
              {[
                {
                  step: "1",
                  title: "Upload Your Resume",
                  description: "Upload your resume in PDF format. Our AI will process and analyze the content."
                },
                {
                  step: "2",
                  title: "Enter Job Description",
                  description: "Enter a job description or upload a job posting to match against your resume."
                },
                {
                  step: "3",
                  title: "Get Personalized Results",
                  description: "Receive detailed analysis, match percentage, and suggestions for improvement."
                }
              ].map((step, index) => (
                <Grid item xs={12} md={4} key={index} sx={{ position: 'relative' }}>
                  {index > 0 && (
                    <>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                          display: { xs: 'none', md: 'block' },
                          position: 'absolute',
                          left: 0,
                          height: '70%',
                          top: '15%'
                        }}
                      />
                      <Divider
                        sx={{
                          display: { xs: 'block', md: 'none' },
                          my: 2,
                          width: '50%',
                          mx: 'auto'
                        }}
                      />
                    </>
                  )}
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: { xs: 2, md: 3 },
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        mx: 'auto',
                        fontWeight: 'bold',
                        color: theme.palette.primary.contrastText
                      }}
                    >
                      {step.step}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      fontWeight={600}
                    >
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {step.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        {/* Call to Action */}
        <Box
          sx={{
            textAlign: 'center',
            mt: { xs: 8, md: 10 },
            p: { xs: 3, md: 5 },
            borderRadius: theme.shape.borderRadius * 2,
            background: `linear-gradient(45deg, ${alpha(theme.palette.primary.dark, 0.4)} 0%, ${alpha(theme.palette.secondary.dark, 0.4)} 100%)`,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h2"
            gutterBottom
            fontWeight={600}
          >
            Ready to elevate your job search?
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              ...gradientButton,
              mt: 3,
              backgroundColor: theme.palette.common.white,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.9),
                transform: 'translateY(-2px)',
              }
            }}
            onClick={() => user ? navigate('/resume-upload') : navigate('/login')}
          >
            {user ? 'Get Started Now' : 'Create an Account'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;