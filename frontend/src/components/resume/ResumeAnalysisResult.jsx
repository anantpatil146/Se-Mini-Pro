import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Source as SourceIcon,
  Send as SendIcon
} from '@mui/icons-material';

// Import the correct API function from your services
// This should match your Flask endpoint: /analyze
const analyzeResume = async (question) => {
  const res = await fetch("http://127.0.0.1:5000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return await res.json();
};

const ResumeAnalysisResult = () => {
  const theme = useTheme();
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  // Example questions the user can ask
  const exampleQuestions = [
    "What are the candidate's key skills?",
    "How many years of experience does the candidate have?",
    "What programming languages does the candidate know?",
    "What is the candidate's educational background?",
    "What were the candidate's previous job roles?"
  ];

  const handleAskQuestion = async (event) => {
    event.preventDefault();

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    try {
      setAsking(true);
      setError(null);

      // Call the resume analysis endpoint
      const response = await analyzeResume(question);

      if (response.error) {
        throw new Error(response.error);
      }

      // Add the new result to the results array
      setResults([
        {
          question,
          answer: response.answer,
          sources: response.sources || [],
          timestamp: new Date().toISOString()
        },
        ...results
      ]);

      // Clear the question input
      setQuestion('');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError(error.message || 'Failed to analyze resume');
    } finally {
      setAsking(false);
    }
  };

  const handleExampleQuestionClick = (exampleQuestion) => {
    setQuestion(exampleQuestion);
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
        Resume Analysis
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        paragraph
        sx={{ mb: 3 }}
      >
        Ask questions about the uploaded resume to get AI-powered insights
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
          Example questions you can ask:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {exampleQuestions.map((q, index) => (
            <Chip
              key={index}
              label={q}
              onClick={() => handleExampleQuestionClick(q)}
              clickable
              variant="outlined"
              color="primary"
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      </Box>

      <form onSubmit={handleAskQuestion}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            label="Ask a question about the resume"
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What are the candidate's key skills?"
            disabled={asking}
            error={!!error}
            helperText={error}
            sx={{
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: theme.shape.borderRadius,
              '& .MuiOutlinedInput-root': {
                borderRadius: theme.shape.borderRadius,
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={asking || !question.trim()}
            sx={{
              borderRadius: theme.shape.borderRadius * 1.5,
              minWidth: '120px',
              background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
              boxShadow: '0 3px 5px 2px rgba(144, 202, 249, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #82b1e0 30%, #e57da3 90%)',
              }
            }}
            startIcon={asking ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
            endIcon={!asking && <SendIcon />}
          >
            {asking ? 'Asking...' : 'Ask'}
          </Button>
        </Box>
      </form>

      {results.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>

          <List>
            {results.map((result, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  mb: 3,
                  p: 3,
                  borderRadius: theme.shape.borderRadius * 1.5,
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main
                  }}
                >
                  Q: {result.question}
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ whiteSpace: 'pre-line' }}
                >
                  {result.answer}
                </Typography>

                {result.sources && result.sources.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <SourceIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Sources:
                    </Typography>
                    {result.sources.map((source, i) => (
                      <Chip
                        key={i}
                        label={source}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                )}

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', textAlign: 'right', mt: 1 }}
                >
                  {new Date(result.timestamp).toLocaleString()}
                </Typography>
              </Paper>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default ResumeAnalysisResult;