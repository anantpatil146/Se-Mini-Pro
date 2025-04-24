import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';
import {
  Upload as UploadIcon,
  Assignment as AssignmentIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const JobUploadPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const [inputMethod, setInputMethod] = useState('manual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please upload a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (inputMethod === 'manual' && (!jobTitle || !jobDescription)) {
      setError('Please enter both job title and description');
      return;
    }
    
    if (inputMethod === 'upload' && !file) {
      setError('Please upload a job description PDF');
      return;
    }
    
    try {
      setLoading(true);
      
      // Here you would typically:
      // 1. Upload the file if using file upload method
      // 2. Process the job description
      // 3. Store the job data in your database
      
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setSuccess(true);
      
      // Simulate redirection after successful upload
      setTimeout(() => {
        navigate('/match-results', { 
          state: { 
            jobTitle: inputMethod === 'manual' ? jobTitle : file?.name.replace('.pdf', '')
          } 
        });
      }, 1500);
      
    } catch (err) {
      console.error('Error uploading job description:', err);
      setError('Failed to upload job description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const gradientText = {
    fontWeight: 700,
    background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing(2)
  };

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
      <Container maxWidth="md">
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
            Job Description Upload
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Upload a job description to match with your resume and find the perfect fit
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
            borderRadius: theme.shape.borderRadius * 2
          }}
        >
          {success ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Job description successfully uploaded! Redirecting to match results...
              </Alert>
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
                <FormLabel component="legend" sx={{ mb: 2, fontWeight: 500 }}>
                  Choose input method:
                </FormLabel>
                <RadioGroup
                  row
                  value={inputMethod}
                  onChange={(e) => {
                    setInputMethod(e.target.value);
                    setError('');
                  }}
                >
                  <FormControlLabel 
                    value="manual" 
                    control={<Radio />} 
                    label="Enter manually" 
                  />
                  <FormControlLabel 
                    value="upload" 
                    control={<Radio />} 
                    label="Upload PDF" 
                  />
                </RadioGroup>
              </FormControl>

              {inputMethod === 'manual' ? (
                <>
                  <TextField
                    label="Job Title"
                    fullWidth
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    label="Job Description"
                    fullWidth
                    multiline
                    rows={10}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    placeholder="Paste the full job description here..."
                    sx={{ mb: 4 }}
                  />
                </>
              ) : (
                <Box
                  sx={{
                    border: `2px dashed ${theme.palette.primary.main}`,
                    borderRadius: theme.shape.borderRadius,
                    p: 3,
                    textAlign: 'center',
                    mb: 4,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }}
                >
                  <input
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    id="job-description-file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="job-description-file">
                    <Button
                      component="span"
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      sx={{ mb: 2 }}
                    >
                      Select PDF File
                    </Button>
                  </label>
                  <Typography variant="body2" color="text.secondary">
                    {file ? `Selected file: ${file.name}` : 'Upload a PDF file containing the job description'}
                  </Typography>
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ textAlign: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
                  sx={{
                    background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
                    boxShadow: '0 3px 5px 2px rgba(144, 202, 249, .3)',
                    borderRadius: theme.shape.borderRadius * 2,
                    padding: theme.spacing(1.5, 4),
                    '&:hover': {
                      boxShadow: '0 6px 10px 4px rgba(144, 202, 249, .4)',
                    }
                  }}
                >
                  {loading ? 'Processing...' : 'Match with Resume'}
                </Button>
              </Box>
            </form>
          )}
        </Paper>

        <Box sx={{ mt: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  backdropFilter: 'blur(10px)',
                  borderRadius: theme.shape.borderRadius
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    color: theme.palette.primary.main
                  }}
                >
                  <AssignmentIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    Tips for Better Matching
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Include complete job requirements and qualifications
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    List both technical and soft skills needed for the role
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Mention specific tools, technologies, or frameworks
                  </Typography>
                  <Typography component="li" variant="body2">
                    Include information about job level and experience required
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  backdropFilter: 'blur(10px)',
                  borderRadius: theme.shape.borderRadius
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    color: theme.palette.secondary.main
                  }}
                >
                  <AssignmentIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    What Happens Next?
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" paragraph>
                  After submitting, our AI will analyze the job description and compare it with your resume to:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Calculate your match percentage based on skills and experience
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Highlight matching and missing skills
                  </Typography>
                  <Typography component="li" variant="body2">
                    Provide suggestions to improve your resume for this specific role
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default JobUploadPage;