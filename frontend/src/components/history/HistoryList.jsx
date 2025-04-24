import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  useTheme
} from '@mui/material';
import {
  Description as ResumeIcon,
  Work as JobIcon,
  ArrowForward as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const HistoryList = ({ historyItems }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Format date function - can be used if needed
  const formatDate = (timestamp) => {
    return timestamp ? new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) : 'Unknown date';
  };

  const getItemDetails = (item) => {
    if (item.type === 'resume') {
      return {
        icon: <ResumeIcon />,
        title: item.resumeName || 'Resume Submission',
        subtitle: `Skills extracted: ${item.extractedSkills?.slice(0, 3).join(', ')}${item.extractedSkills?.length > 3 ? '...' : ''}`,
        chipLabel: 'Resume',
        chipColor: 'primary',
        action: () => navigate(`/resume-upload?id=${item.id}`)
      };
    } else {
      return {
        icon: <JobIcon />,
        title: item.jobTitle || 'Job Match',
        subtitle: `Match score: ${item.matchScore}% - ${item.companyName || 'Unknown company'}`,
        chipLabel: 'Job Match',
        chipColor: 'secondary',
        action: () => navigate(`/match-results?id=${item.id}`)
      };
    }
  };

  return (
    <List sx={{ width: '100%' }}>
      {historyItems.map((item, index) => {
        const itemDetails = getItemDetails(item);

        return (
          <React.Fragment key={item.id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                py: 2,
                px: 1,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 1
                }
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{
                  bgcolor: item.type === 'resume' ? 'primary.dark' : 'secondary.dark',
                  color: 'white'
                }}>
                  {itemDetails.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ mr: 2 }}>
                      {itemDetails.title}
                    </Typography>
                    <Chip
                      label={itemDetails.chipLabel}
                      color={itemDetails.chipColor}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {itemDetails.subtitle}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {item.timestamp ? format(item.timestamp, 'MMM d, yyyy - h:mm a') : 'Unknown date'}
                    </Typography>
                  </Box>
                }
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ViewIcon />}
                  onClick={itemDetails.action}
                  sx={{
                    borderRadius: 2,
                    color: item.type === 'resume' ? theme.palette.primary.main : theme.palette.secondary.main,
                    borderColor: item.type === 'resume' ? theme.palette.primary.main : theme.palette.secondary.main,
                  }}
                >
                  View
                </Button>
              </Box>
            </ListItem>
            {index < historyItems.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default HistoryList;