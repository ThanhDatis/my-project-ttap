import { Typography, Box } from '@mui/material';

const Profile = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        THIS IS PROFILE
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Manage your user profile, update personal information, and change account settings.
      </Typography>
    </Box>
  );
};

export default Profile;
