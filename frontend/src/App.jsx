import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Pages
import HomePage from './pages/HomePage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import JobUploadPage from './pages/JobUploadPage';
import MatchResultsPage from './pages/MatchResultsPage';
import HistoryPage from './pages/HistoryPage';
import InsightsPage from './pages/InsightsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/AuthPages/LoginPage';
import RegisterPage from './pages/AuthPages/RegisterPage';
import ResetPasswordPage from './pages/AuthPages/ResetPasswordPage';

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Routes */}
          <Route path="/resume-upload" element={user ? <ResumeUploadPage /> : <Navigate to="/login" />} />
          <Route path="/job-upload" element={user ? <JobUploadPage /> : <Navigate to="/login" />} />
          <Route path="/match-results" element={user ? <MatchResultsPage /> : <Navigate to="/login" />} />
          <Route path="/history" element={user ? <HistoryPage /> : <Navigate to="/login" />} />
          <Route path="/insights" element={user ? <InsightsPage /> : <Navigate to="/login" />} />
          <Route path="/admin-dashboard" element={user?.email === 'admin@example.com' ? <AdminDashboardPage /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;