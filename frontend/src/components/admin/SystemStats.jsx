// SystemStats.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Divider,
  useTheme
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import {
  People as PeopleIcon,
  Description as DescriptionIcon,
  Work as WorkIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';

const SystemStats = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResumes: 0,
    totalJobs: 0,
    storageUsed: 0,
    userActivity: [],
    matchDistribution: [],
    resumesBySkill: [],
    weeklyActivity: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch user count
        const usersSnapshot = await getDocs(collection(db, "users"));
        const totalUsers = usersSnapshot.size;

        // Fetch resume count
        const resumesSnapshot = await getDocs(collection(db, "resumes"));
        const totalResumes = resumesSnapshot.size;

        // Fetch job count
        const jobsSnapshot = await getDocs(collection(db, "jobs"));
        const totalJobs = jobsSnapshot.size;

        // Calculate storage used (mock data - in real app would come from Firebase Storage API)
        const storageUsed = (totalResumes * 0.5) + (totalJobs * 0.1); // in MB (mock calculation)

        // Get recent user activity
        const activityQuery = query(
          collection(db, "activity"),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        const activitySnapshot = await getDocs(activityQuery);
        const userActivity = activitySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Create mock match distribution data
        const matchDistribution = [
          { name: '90-100%', value: Math.floor(Math.random() * 20) + 5 },
          { name: '70-89%', value: Math.floor(Math.random() * 30) + 15 },
          { name: '50-69%', value: Math.floor(Math.random() * 40) + 25 },
          { name: '30-49%', value: Math.floor(Math.random() * 30) + 15 },
          { name: '0-29%', value: Math.floor(Math.random() * 20) + 5 },
        ];

        // Create mock skills data
        const resumesBySkill = [
          { name: 'JavaScript', count: Math.floor(Math.random() * 50) + 30 },
          { name: 'Python', count: Math.floor(Math.random() * 50) + 25 },
          { name: 'React', count: Math.floor(Math.random() * 40) + 20 },
          { name: 'Java', count: Math.floor(Math.random() * 30) + 15 },
          { name: 'SQL', count: Math.floor(Math.random() * 35) + 20 },
          { name: 'AWS', count: Math.floor(Math.random() * 25) + 10 },
        ];

        // Create mock weekly activity data
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weeklyActivity = days.map(day => ({
          name: day,
          resumeUploads: Math.floor(Math.random() * 10) + 1,
          jobMatches: Math.floor(Math.random() * 15) + 1,
        }));

        setStats({
          totalUsers,
          totalResumes,
          totalJobs,
          storageUsed,
          userActivity,
          matchDistribution,
          resumesBySkill,
          weeklyActivity
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load system statistics. Please try again later.");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.info.main,
    theme.palette.warning.main,
    theme.palette.error.main
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        System Statistics
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="textSecondary">Users</Typography>
              </Box>
              <Typography variant="h4">{stats.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <DescriptionIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="textSecondary">Resumes</Typography>
              </Box>
              <Typography variant="h4">{stats.totalResumes}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WorkIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" color="textSecondary">Jobs</Typography>
              </Box>
              <Typography variant="h4">{stats.totalJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StorageIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" color="textSecondary">Storage</Typography>
              </Box>
              <Typography variant="h4">{stats.storageUsed.toFixed(1)} MB</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Match Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>Match Distribution</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.matchDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.matchDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} matches`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Skills Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>Top Skills in Resumes</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.resumesBySkill}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Count" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Weekly Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>Weekly Activity</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="resumeUploads"
                    name="Resume Uploads"
                    stroke={theme.palette.primary.main}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="jobMatches"
                    name="Job Matches"
                    stroke={theme.palette.secondary.main}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <Box>
              {stats.userActivity.length > 0 ? (
                stats.userActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <Box sx={{ py: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">
                          {activity.action} by {activity.userId}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(activity.timestamp?.toDate()).toLocaleString()}
                        </Typography>
                      </Box>
                      {activity.details && (
                        <Typography variant="body2" color="textSecondary">
                          {activity.details}
                        </Typography>
                      )}
                    </Box>
                    {index < stats.userActivity.length - 1 && (
                      <Divider />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2">No recent activity found</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemStats;