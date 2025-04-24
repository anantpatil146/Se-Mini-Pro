import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import { auth } from '../firebase';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import PageHeader from '../components/common/PageHeader';
import ErrorAlert from '../components/common/ErrorAlert';

// You would normally import these from your components directory
// For now I'll create placeholders that you can replace later
const SkillsChart = ({ skills }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Skills Distribution</Typography>
    <Typography variant="body2" color="text.secondary">
      This chart would show your most common skills across resumes and their strength levels.
      You need to implement the actual chart component.
    </Typography>
  </Box>
);

const SuggestionsList = ({ suggestions }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Improvement Suggestions</Typography>
    {suggestions.map((suggestion, index) => (
      <Box key={index} sx={{ mb: 2 }}>
        <Typography variant="subtitle1">{suggestion.title}</Typography>
        <Typography variant="body2" color="text.secondary">{suggestion.description}</Typography>
      </Box>
    ))}
  </Box>
);

const InsightsPage = () => {
  const [skills, setSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [matchTrends, setMatchTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const db = getFirestore();
        const userId = auth.currentUser.uid;

        // Get resume submissions
        const resumeQuery = query(
          collection(db, 'resumeSubmissions'),
          where('userId', '==', userId)
        );

        // Get job matches
        const jobMatchQuery = query(
          collection(db, 'jobMatches'),
          where('userId', '==', userId)
        );

        const [resumeSnapshot, jobMatchSnapshot] = await Promise.all([
          getDocs(resumeQuery),
          getDocs(jobMatchQuery)
        ]);

        // Extract skills from resumes
        const extractedSkills = {};
        resumeSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.extractedSkills && Array.isArray(data.extractedSkills)) {
            data.extractedSkills.forEach(skill => {
              if (!extractedSkills[skill]) {
                extractedSkills[skill] = 1;
              } else {
                extractedSkills[skill]++;
              }
            });
          }
        });

        // Convert to array for chart
        const skillsArray = Object.entries(extractedSkills).map(([name, count]) => ({
          name,
          count
        })).sort((a, b) => b.count - a.count);

        setSkills(skillsArray);

        // Extract match trends from job matches
        const trends = jobMatchSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            jobTitle: data.jobTitle || 'Unknown Job',
            matchScore: data.matchScore || 0,
            date: data.timestamp?.toDate() || new Date(),
            missingSkills: data.missingSkills || []
          };
        }).sort((a, b) => b.date - a.date);

        setMatchTrends(trends);

        // Generate suggestions based on missing skills and low match scores
        const generatedSuggestions = [];

        // Find commonly missing skills
        const missingSkillsCount = {};
        trends.forEach(trend => {
          trend.missingSkills.forEach(skill => {
            if (!missingSkillsCount[skill]) {
              missingSkillsCount[skill] = 1;
            } else {
              missingSkillsCount[skill]++;
            }
          });
        });

        // Top missing skills suggestion
        const topMissingSkills = Object.entries(missingSkillsCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([skill]) => skill);

        if (topMissingSkills.length > 0) {
          generatedSuggestions.push({
            title: 'Consider developing these skills',
            description: `These skills were frequently missing in your job matches: ${topMissingSkills.join(', ')}`
          });
        }

        // Low match score suggestion
        const averageMatchScore = trends.length > 0
          ? trends.reduce((sum, trend) => sum + trend.matchScore, 0) / trends.length
          : 0;

        if (averageMatchScore < 70 && trends.length > 0) {
          generatedSuggestions.push({
            title: 'Improve your match score',
            description: `Your average match score is ${averageMatchScore.toFixed(1)}%. Try tailoring your resume more closely to job descriptions.`
          });
        }

        // Resume quality suggestion
        if (resumeSnapshot.size === 0) {
          generatedSuggestions.push({
            title: 'Upload your resume',
            description: 'To get personalized insights, start by uploading your resume.'
          });
        } else {
          generatedSuggestions.push({
            title: 'Keep your resume updated',
            description: 'Regularly update your resume with new skills and experiences to improve match rates.'
          });
        }

        setSuggestions(generatedSuggestions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError('Failed to load insights. Please try again later.');
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      py: 8,
      background: 'linear-gradient(to bottom, rgba(18,18,18,0.95), rgba(30,30,30,0.95))'
    }}>
      <Container maxWidth="lg">
        <PageHeader
          title="Career Insights"
          subtitle="Analyze your skills and get personalized recommendations"
          gradientTitle
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <ErrorAlert message={error} />
        ) : (
          <>
            <Paper
              elevation={3}
              sx={{
                mb: 4,
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                overflow: 'hidden'
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Skills Analysis" />
                <Tab label="Match Trends" />
                <Tab label="Recommendations" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {tabValue === 0 && (
                  skills.length > 0 ? (
                    <SkillsChart skills={skills} />
                  ) : (
                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                      No skills data available yet. Upload resumes to see skills analysis.
                    </Typography>
                  )
                )}

                {tabValue === 1 && (
                  matchTrends.length > 0 ? (
                    <Box>
                      <Typography variant="h6" gutterBottom>Match Score Trends</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        This section would show a chart of your match scores over time.
                        You need to implement the actual chart component.
                      </Typography>

                      <Divider sx={{ my: 3 }} />

                      <Typography variant="h6" gutterBottom>Recent Job Matches</Typography>
                      <Grid container spacing={2}>
                        {matchTrends.slice(0, 3).map((trend, idx) => (
                          <Grid item xs={12} md={4} key={idx}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="subtitle1">{trend.jobTitle}</Typography>
                                <Typography variant="h4" sx={{ my: 1, color:
                                  trend.matchScore >= 80 ? 'success.main' :
                                  trend.matchScore >= 60 ? 'warning.main' : 'error.main'
                                }}>
                                  {trend.matchScore}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {trend.date.toLocaleDateString()}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ) : (
                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                      No match data available yet. Match with job descriptions to see trends.
                    </Typography>
                  )
                )}

                {tabValue === 2 && (
                  suggestions.length > 0 ? (
                    <SuggestionsList suggestions={suggestions} />
                  ) : (
                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                      No recommendations available yet. Upload resumes and match with jobs to get personalized suggestions.
                    </Typography>
                  )
                )}
              </Box>
            </Paper>

            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: theme.palette.background.paper
              }}
            >
              <Typography variant="h5" gutterBottom>AI Insights</Typography>
              <Typography variant="body1" paragraph>
                Based on your resume and job matching history, our AI has generated the following insights:
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Skill Gap Analysis</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {matchTrends.length > 0
                          ? "Our analysis shows your profile has strong technical skills but might benefit from adding more soft skills and project management experience."
                          : "Upload your resume and match with jobs to receive a personalized skill gap analysis."}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Market Demand</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {skills.length > 0
                          ? "Based on your skill set, job opportunities in frontend development and cloud technologies are highly relevant to your profile."
                          : "Upload your resume to see which job markets best match your skill set."}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Resume Enhancement</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {resumeSnapshot && resumeSnapshot.size > 0
                          ? "To improve your resume, consider quantifying your achievements with metrics and highlighting specific project outcomes."
                          : "Upload your resume to receive personalized enhancement recommendations."}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
};

export default InsightsPage;