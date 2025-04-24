// src/services/api.js
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for Flask sessions
});

// Resume API functions
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const analyzeResume = async (question) => {
  return api.post('/analyze', { question });
};

export const matchJobDescription = async (jobDescription) => {
  return api.post('/job-match', { jobDescription });
};

export const clearSession = async () => {
  return api.post('/clear');
};

export default api;