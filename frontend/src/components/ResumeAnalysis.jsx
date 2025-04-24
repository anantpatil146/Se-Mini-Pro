import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';

const ResumeAnalysis = () => {
    const [answer, setAnswer] = useState('');
    const [sources, setSources] = useState([]);
    const [error, setError] = useState(null);
    const [questionText, setQuestionText] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        if (!questionText.trim() || !uploadedFileName) return;

        try {
            setIsAnalyzing(true);
            setAnswer('');
            setSources([]);
            
            const response = await fetch('http://localhost:5000/analyze', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    question: questionText,
                    filename: uploadedFileName,
                    // Add a unique identifier to ensure we're analyzing the correct file
                    fileId: Date.now().toString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setAnswer(data.answer);
                setSources(data.sources);
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to analyze resume');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(`Error analyzing resume: ${error.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('resume', selectedFile);
        // Add a unique identifier to the form data
        formData.append('fileId', Date.now().toString());

        try {
            setIsLoading(true);
            // Clear previous results when uploading a new file
            setAnswer('');
            setSources([]);
            
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setIsUploaded(true);
                setUploadedFileName(data.filename || selectedFile.name);
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to upload resume');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(`Error uploading resume: ${error.message}`);
            setIsUploaded(false);
            setUploadedFileName(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setSelectedFile(file);
                            setIsUploaded(false);
                            setUploadedFileName(null);
                            // Clear previous results when selecting a new file
                            setAnswer('');
                            setSources([]);
                        }
                    }}
                    style={{ marginBottom: '1rem' }}
                />
                <Button
                    variant="contained"
                    onClick={handleFileUpload}
                    disabled={!selectedFile || isLoading}
                    sx={{ ml: 2 }}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Upload Resume'}
                </Button>
            </Box>

            {isUploaded && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Resume "{uploadedFileName}" uploaded successfully!
                </Alert>
            )}

            <Box component="form" onSubmit={handleQuestionSubmit} sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Ask a question about the resume"
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={!questionText.trim() || !isUploaded || isAnalyzing}
                >
                    {isAnalyzing ? <CircularProgress size={24} /> : 'Ask Question'}
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            {answer && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {answer}
                    </Typography>
                    {sources && sources.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Sources:
                            </Typography>
                            {sources.map((source, index) => (
                                <Typography key={index} variant="body2" color="text.secondary">
                                    {source}
                                </Typography>
                            ))}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default ResumeAnalysis;