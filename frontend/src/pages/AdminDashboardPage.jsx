import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  PeopleAlt as UsersIcon,
  Description as ResumeIcon,
  Work as JobIcon,
  Assessment as StatsIcon
} from '@mui/icons-material';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import PageHeader from '../components/common/PageHeader';
import ErrorAlert from '../components/common/ErrorAlert';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResumes: 0,
    totalJobMatches: 0,
    averageMatchScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const db = getFirestore();

        // Get collections
        const usersCollection = collection(db, 'users');
        const resumesCollection = collection(db, 'resumeSubmissions');
        const jobMatchesCollection = collection(db, 'jobMatches');

        // Get counts
        const [usersSnapshot, resumesSnapshot, jobMatchesSnapshot] = await Promise.all([
          getDocs(usersCollection),
          getDocs(resumesCollection),
          getDocs(jobMatchesCollection)
        ]);

        // Calculate average match score
        let totalScore = 0;
        let matchCount = 0;

        jobMatchesSnapshot.forEach(doc => {
          const score = doc.data().matchScore;
          if (score) {
            totalScore += score;
            matchCount++;
          }
        });

        const averageScore = matchCount > 0 ? Math.round(totalScore / matchCount) : 0;

        setStats({
          totalUsers: usersSnapshot.size,
          totalResumes: resumesSnapshot.size,
          totalJobMatches: jobMatchesSnapshot.size,
          averageMatchScore: averageScore
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to load admin dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: `${color}.dark`,
                color: 'white'
              }}
            >
              {icon}
            </Box>
          </Grid>
          <Grid item xs>
            <Typography variant="h6" component="div" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      py: 8,
      background: 'linear-gradient(to bottom, rgba(18,18,18,0.95), rgba(30,30,30,0.95))'
    }}>
      <Container maxWidth="lg">
        <PageHeader
          title="Admin Dashboard"
          subtitle="System statistics and management"
          gradientTitle
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <ErrorAlert message={error} />
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<UsersIcon fontSize="large" />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Resume Uploads"
                value={stats.totalResumes}
                icon={<ResumeIcon fontSize="large" />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Job Matches"
                value={stats.totalJobMatches}
                icon={<JobIcon fontSize="large" />}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Avg. Match Score"
                value={`${stats.averageMatchScore}%`}
                icon={<StatsIcon fontSize="large" />}
                color="success"
              />
            </Grid>

            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 2,
                  mt: 2
                }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  User Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  This section will contain user management features such as viewing, editing, and deleting user accounts.
                </Typography>
                {/* You can add a UsersList component here */}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 2
                }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  System Statistics
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  This section will contain detailed system statistics and analytics.
                </Typography>
                {/* You can add a SystemStats component here */}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboardPage;