import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  useTheme,
  alpha
} from '@mui/material';
import {
  Work as WorkIcon,
  Send as SendIcon
} from '@mui/icons-material';

// Import the correct API function from your services
// This should match your Flask endpoint: /job-match
const matchJobWithResume = async (jobDescription) => {
  const res = await fetch("http://127.0.0.1:5000/job-match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobDescription }),
  });
  return await res.json();
};

const JobDescriptionForm = ({ onMatchComplete }) => {
  const theme = useTheme();
  const [jobDescription, setJobDescription] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Call the job matching endpoint
      const response = await matchJobWithResume(jobDescription);

      if (response.error) {
        throw new Error(response.error);
      }

      // Pass the response to the parent component
      if (onMatchComplete) {
        onMatchComplete(response);
      }
    } catch (error) {
      console.error('Error matching job description:', error);
      setError(error.message || 'Failed to process job matching');
    } finally {
      setProcessing(false);
    }
  };

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
        Job Description Matching
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        paragraph
        sx={{ mb: 4 }}
      >
        Paste a job description below to see how well your resume matches the requirements
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: theme.shape.borderRadius }}
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={10}
          label="Job Description"
          variant="outlined"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          disabled={processing}
          sx={{
            mb: 3,
            backgroundColor: alpha(theme.palette.background.paper, 0.5),
            borderRadius: theme.shape.borderRadius,
            '& .MuiOutlinedInput-root': {
              borderRadius: theme.shape.borderRadius,
            }
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={processing || !jobDescription.trim()}
            startIcon={processing ? <CircularProgress size={24} color="inherit" /> : <WorkIcon />}
            endIcon={!processing && <SendIcon />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: theme.shape.borderRadius * 1.5,
              background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
              boxShadow: '0 3px 5px 2px rgba(144, 202, 249, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #82b1e0 30%, #e57da3 90%)',
              }
            }}
          >
            {processing ? 'Processing...' : 'Match with Resume'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default JobDescriptionForm;