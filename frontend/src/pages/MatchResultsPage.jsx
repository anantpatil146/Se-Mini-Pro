import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Error as ErrorIcon,
  ArrowForward as ArrowForwardIcon,
  Download as DownloadIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

const MatchResultsPage = () => {
  const theme = useTheme();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [matchScore, setMatchScore] = useState(0);
  const [jobTitle, setJobTitle] = useState(location.state?.jobTitle || 'Software Engineer');

  // Simulated data - in a real app, this would come from your backend
  const [matchData, setMatchData] = useState({
    overallMatch: 0,
    matchingSkills: [],
    missingSkills: [],
    skillsBreakdown: {},
    improvementSuggestions: []
  });

  useEffect(() => {
    // Simulate API call to get match results
    const fetchMatchResults = async () => {
      try {
        // Simulated delay for API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Dummy data - replace with actual API call in your implementation
        const data = {
          overallMatch: 78,
          matchingSkills: [
            'React', 'JavaScript', 'CSS', 'HTML5', 'REST APIs',
            'Git', 'Material UI', 'Responsive Design', 'Testing'
          ],
          missingSkills: [
            'GraphQL', 'TypeScript', 'Redux', 'CI/CD'
          ],
          skillsBreakdown: {
            'Technical Skills': 82,
            'Experience': 73,
            'Education': 90,
            'Soft Skills': 65
          },
          improvementSuggestions: [
            'Consider adding more details about your REST API experience',
            'Highlight any TypeScript or GraphQL related projects or learning',
            'Add metrics and outcomes to your project descriptions',
            'Include more examples of collaborative work'
          ]
        };

        setMatchData(data);
        setMatchScore(data.overallMatch);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching match results:', error);
        setLoading(false);
      }
    };

    fetchMatchResults();
  }, []);

  const gradientText = {
    fontWeight: 700,
    background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing(2)
  };

  const getScoreColor = (score) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh'
        }}
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Analyzing match results...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg,
          ${alpha(theme.palette.background.default, 0.95)} 0%,
          ${alpha(theme.palette.background.paper, 0.85)} 100%)`,
        pt: { xs: 4, md: 8 },
        pb: { xs: 6, md: 10 }
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 4, md: 6 }
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={gradientText}
          >
            Resume-Job Match Results
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Detailed analysis of how your resume matches with <strong>"{jobTitle}"</strong> position
          </Typography>
        </Box>

        {/* Main Results Card */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
            borderRadius: theme.shape.borderRadius * 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-start' },
              justifyContent: 'space-between',
              mb: 4
            }}
          >
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 4, md: 0 } }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Overall Match Score
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Based on skills, experience, education, and job requirements
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                width: 150,
                height: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CircularProgress
                variant="determinate"
                value={100}
                size={150}
                thickness={4}
                sx={{ color: alpha(theme.palette.divider, 0.2), position: 'absolute' }}
              />
              <CircularProgress
                variant="determinate"
                value={matchScore}
                size={150}
                thickness={4}
                sx={{ color: getScoreColor(matchScore), position: 'absolute' }}
              />
              <Typography
                variant="h3"
                component="div"
                color={getScoreColor(matchScore)}
                sx={{ fontWeight: 'bold' }}
              >
                {`${matchScore}%`}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Categories Breakdown */}
          <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 3 }}>
            Match Breakdown by Category
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {Object.entries(matchData.skillsBreakdown).map(([category, score]) => (
              <Grid item xs={12} sm={6} md={3} key={category}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {category}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ mr: 1, color: getScoreColor(score) }}>
                        {score}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={score}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: alpha(theme.palette.divider, 0.2),
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getScoreColor(score),
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Skills Matching */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                Matching Skills ({matchData.matchingSkills.length})
              </Typography>
              <Box sx={{ mt: 2 }}>
                {matchData.matchingSkills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    color="primary"
                    variant="outlined"
                    icon={<CheckCircleIcon />}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CancelIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
                Missing Skills ({matchData.missingSkills.length})
              </Typography>
              <Box sx={{ mt: 2 }}>
                {matchData.missingSkills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    color="error"
                    variant="outlined"
                    icon={<CancelIcon />}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Suggestions and Next Steps */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 4 },
                height: '100%',
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
                borderRadius: theme.shape.borderRadius * 2
              }}
            >
              <Typography variant="h5" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                Improvement Suggestions
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <List>
                {matchData.improvementSuggestions.map((suggestion, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <StarIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 4 },
                height: '100%',
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
                borderRadius: theme.shape.borderRadius * 2
              }}
            >
              <Typography variant="h5" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ArrowForwardIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                Next Steps
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Alert severity="info" sx={{ mb: 3 }}>
                Here are some recommended actions based on your match results
              </Alert>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TimelineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="View detailed analytics"
                    secondary="See a deeper breakdown of your skills match"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DownloadIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Download match report"
                    secondary="Get a PDF with all match details and suggestions"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ErrorIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Update your resume"
                    secondary="Apply our suggestions to improve your match"
                  />
                </ListItem>
              </List>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ArrowForwardIcon />}
                  sx={{
                    background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
                    boxShadow: '0 3px 5px 2px rgba(144, 202, 249, .3)',
                    borderRadius: theme.shape.borderRadius * 2,
                    padding: theme.spacing(1.5, 4)
                  }}
                >
                  Go to Insights
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MatchResultsPage;