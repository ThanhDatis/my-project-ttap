import { Typography, Box } from '@mui/material';

const Setting = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        THIS IS SETTING
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Configure system settings, user preferences, and application parameters.
      </Typography>
    </Box>
  );
};

export default Setting;
