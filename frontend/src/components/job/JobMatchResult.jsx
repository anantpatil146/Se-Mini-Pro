import React from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  Lightbulb as LightbulbIcon,
  Warning as WarningIcon,
  Save as SaveIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const JobMatchResult = ({ matchResult, loading, error, onSaveResult }) => {
  const theme = useTheme();

  // Function to extract match percentage from the analysis text
  const extractMatchPercentage = (matchAnalysis) => {
    const percentageMatch = matchAnalysis.match(/(\d+)%/);
    return percentageMatch ? parseInt(percentageMatch[1], 10) : null;
  };

  // Function to extract pros and cons from the analysis text (simplified parsing)
  const extractInsights = (matchAnalysis) => {
    // Simple regex-based parsing - in a real app, you'd want more robust parsing
    const strengths = [];
    const improvements = [];

    // Look for common phrases that might indicate strengths/weaknesses
    const lines = matchAnalysis.split('. ');

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();

      // Detect strengths
      if (
        lowerLine.includes('strong') ||
        lowerLine.includes('excellent') ||
        lowerLine.includes('good match') ||
        lowerLine.includes('experience in') ||
        lowerLine.includes('proficient')
      ) {
        strengths.push(line.trim());
      }

      // Detect areas for improvement
      if (
        lowerLine.includes('lack') ||
        lowerLine.includes('missing') ||
        lowerLine.includes('could improve') ||
        lowerLine.includes('no mention of') ||
        lowerLine.includes('should') ||
        lowerLine.includes('need')
      ) {
        improvements.push(line.trim());
      }
    });

    return { strengths, improvements };
  };

  if (loading) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: theme.shape.borderRadius * 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px'
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Analyzing match between resume and job description...
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: theme.shape.borderRadius * 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px'
        }}
      >
        <WarningIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          Error Processing Match
        </Typography>
        <Typography color="text.secondary" align="center">
          {error}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Paper>
    );
  }

  if (!matchResult || !matchResult.match_analysis) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: theme.shape.borderRadius * 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px'
        }}
      >
        <AssignmentIcon color="action" sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
        <Typography variant="h6" color="text.secondary" align="center">
          No match analysis available. Please submit a job description to get started.
        </Typography>
      </Paper>
    );
  }

  // Extract match percentage and insights
  const matchPercentage = extractMatchPercentage(matchResult.match_analysis) || 0;
  const { strengths, improvements } = extractInsights(matchResult.match_analysis);

  // Determine color based on match percentage
  const getMatchColor = (percentage) => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const matchColor = getMatchColor(matchPercentage);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: theme.shape.borderRadius * 2,
        backgroundColor: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom fontWeight={600} align="center">
        Job Match Results
      </Typography>

      {/* Match Score */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
          mt: 2
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
          <CircularProgress
            variant="determinate"
            value={matchPercentage}
            size={120}
            thickness={4}
            sx={{
              color: matchColor,
              circle: {
                strokeLinecap: 'round',
              }
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h4"
              component="div"
              color="text.primary"
              fontWeight="bold"
            >
              {`${matchPercentage}%`}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: matchColor,
            fontWeight: 600
          }}
        >
          {matchPercentage >= 80 ? 'Excellent Match' :
           matchPercentage >= 60 ? 'Good Match' : 'Needs Improvement'}
        </Typography>
      </Box>

      {/* Full Analysis */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: theme.shape.borderRadius,
          backgroundColor: alpha(theme.palette.background.default, 0.4),
        }}
      >
        <Typography variant="h6" gutterBottom>
          <AssignmentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Complete Analysis
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {matchResult.match_analysis}
        </Typography>
      </Paper>

      <Divider sx={{ mb: 4 }} />

      {/* Strengths and Improvements */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          <LightbulbIcon sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.warning.main }} />
          Key Insights
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Strengths */}
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: theme.shape.borderRadius,
              backgroundColor: alpha(theme.palette.success.main, 0.05),
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              flex: 1
            }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                color: theme.palette.success.main,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <CheckCircleIcon sx={{ mr: 1 }} /> Strengths
            </Typography>

            <List dense disablePadding>
              {strengths.length > 0 ? (
                strengths.slice(0, 5).map((strength, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: '28px' }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText primary={strength} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No specific strengths identified in the analysis.
                </Typography>
              )}
            </List>
          </Paper>

          {/* Areas for Improvement */}
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: theme.shape.borderRadius,
              backgroundColor: alpha(theme.palette.error.main, 0.05),
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              flex: 1
            }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                color: theme.palette.error.main,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <CancelIcon sx={{ mr: 1 }} /> Areas for Improvement
            </Typography>

            <List dense disablePadding>
              {improvements.length > 0 ? (
                improvements.slice(0, 5).map((improvement, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: '28px' }}>
                      <CancelIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary={improvement} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No specific areas for improvement identified in the analysis.
                </Typography>
              )}
            </List>
          </Paper>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={onSaveResult}
          color="primary"
          sx={{
            px: 3,
            py: 1,
            borderRadius: theme.shape.borderRadius * 1.5,
            boxShadow: theme.shadows[2]
          }}
        >
          Save Results
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          color="secondary"
          sx={{
            px: 3,
            py: 1,
            borderRadius: theme.shape.borderRadius * 1.5
          }}
        >
          Download Report
        </Button>
      </Box>

      {/* Skills Match Tags */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Skills Match
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {matchResult.matching_skills?.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              color="primary"
              variant="outlined"
              size="small"
              icon={<CheckCircleIcon />}
              sx={{ borderRadius: theme.shape.borderRadius }}
            />
          ))}
          {matchResult.missing_skills?.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              color="error"
              variant="outlined"
              size="small"
              icon={<CancelIcon />}
              sx={{ borderRadius: theme.shape.borderRadius }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default JobMatchResult;