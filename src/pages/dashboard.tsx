import { Typography, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        THIS IS DASHBOARD
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome to the sales management system dashboard. Here you can view
        overview statistics, recent activities, and quick access to main features.
      </Typography>
    </Box>
  );
};

export default Dashboard;
