import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  CircularProgress,
  useTheme
} from '@mui/material';
import { auth } from '../firebase';
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import HistoryList from '../components/history/HistoryList';
import ErrorAlert from '../components/common/ErrorAlert';
import PageHeader from '../components/common/PageHeader';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const db = getFirestore();
        const userId = auth.currentUser.uid;

        // Get resume submissions
        const resumeQuery = query(
          collection(db, 'resumeSubmissions'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );

        // Get job matches
        const jobMatchQuery = query(
          collection(db, 'jobMatches'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );

        const [resumeSnapshot, jobMatchSnapshot] = await Promise.all([
          getDocs(resumeQuery),
          getDocs(jobMatchQuery)
        ]);

        const resumeHistory = resumeSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'resume',
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }));

        const jobMatchHistory = jobMatchSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'jobMatch',
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }));

        // Combine and sort by timestamp
        const combinedHistory = [...resumeHistory, ...jobMatchHistory]
          .sort((a, b) => b.timestamp - a.timestamp);

        setHistory(combinedHistory);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load history. Please try again later.');
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      py: 8,
      background: 'linear-gradient(to bottom, rgba(18,18,18,0.95), rgba(30,30,30,0.95))'
    }}>
      <Container maxWidth="lg">
        <PageHeader
          title="Activity History"
          subtitle="Track your resume submissions and job matches"
        />

        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            bgcolor: theme.palette.background.paper,
            borderRadius: 2
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <ErrorAlert message={error} />
          ) : history.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
              No history found. Upload a resume or match with a job to get started.
            </Typography>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Your recent activity
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <HistoryList historyItems={history} />
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default HistoryPage;