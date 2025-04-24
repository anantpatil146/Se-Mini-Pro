import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  action,
  gradientTitle = false
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <MuiLink
            component={RouterLink}
            to="/"
            underline="hover"
            color="inherit"
          >
            Home
          </MuiLink>

          {breadcrumbs.map((crumb, index) => (
            index === breadcrumbs.length - 1 ? (
              <Typography key={index} color="text.primary">
                {crumb.label}
              </Typography>
            ) : (
              <MuiLink
                key={index}
                component={RouterLink}
                to={crumb.path}
                underline="hover"
                color="inherit"
              >
                {crumb.label}
              </MuiLink>
            )
          ))}
        </Breadcrumbs>
      )}

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: subtitle ? 1 : 0
      }}>
        <Typography
          variant="h4"
          component="h1"
          sx={gradientTitle ? {
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          } : {}}
        >
          {title}
        </Typography>

        {action && action}
      </Box>

      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;