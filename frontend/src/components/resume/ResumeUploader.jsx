import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

// Import the correct API function from your services
// This should match your Flask endpoint: /upload
const uploadResume = async (formData) => {
  const res = await fetch("http://127.0.0.1:5000/upload", {
    method: "POST",
    body: formData,
  });
  return await res.json();
};

const ResumeUploader = ({ onUploadSuccess }) => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Simulate upload progress
  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 95) {
        clearInterval(interval);
        setUploadProgress(95);
      } else {
        setUploadProgress(progress);
      }
    }, 300);
    return interval;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setUploadError(null);
      setUploadSuccess(false);
    } else {
      setUploadError('Please upload a PDF file');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setUploadError('Please select a resume file');
      return;
    }

    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are supported');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      const progressInterval = simulateProgress();

      // Create form data for file upload
      const formData = new FormData();
      formData.append('resume', file);

      // Call the upload endpoint
      const response = await uploadResume(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.error) {
        throw new Error(response.error);
      }

      setUploadSuccess(true);

      // Call callback function from parent component
      if (onUploadSuccess) {
        onUploadSuccess(response);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      setUploadError(error.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const dropzoneStyles = {
    border: `2px dashed ${uploadError ? theme.palette.error.main : theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(6),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    backdropFilter: 'blur(10px)',
    position: 'relative',
    '&:hover': {
      borderColor: theme.palette.primary.light,
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
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
        Upload Your Resume
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        paragraph
        sx={{ mb: 4 }}
      >
        Upload your resume in PDF format to get AI-powered analysis and job matching
      </Typography>

      {uploadError && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: theme.shape.borderRadius }}
        >
          <AlertTitle>Error</AlertTitle>
          {uploadError}
        </Alert>
      )}

      {uploadSuccess && (
        <Alert
          severity="success"
          sx={{ mb: 3, borderRadius: theme.shape.borderRadius }}
        >
          <AlertTitle>Success</AlertTitle>
          Resume uploaded successfully! You can now analyze it or match with job descriptions.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box
          sx={dropzoneStyles}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('resume-upload').click()}
        >
          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={uploading}
          />

          <CloudUploadIcon
            sx={{
              fontSize: 60,
              mb: 2,
              color: theme.palette.primary.main
            }}
          />

          <Typography variant="h6" gutterBottom>
            {file ? file.name : 'Drag & Drop your PDF here'}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'or click to browse files'}
          </Typography>

          {uploading && (
            <Box sx={{ width: '100%', mt: 3 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Uploading: {Math.round(uploadProgress)}%
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!file || uploading}
            startIcon={uploading ? <CircularProgress size={24} color="inherit" /> : <CloudUploadIcon />}
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
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ResumeUploader;