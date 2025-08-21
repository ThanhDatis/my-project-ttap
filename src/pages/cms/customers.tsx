import { Typography, Box } from '@mui/material';

const Customers = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        THIS IS CUSTOMERS
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Manage your customers here. You can view customer information, add new
        customers, edit existing records, and track customer activities.
      </Typography>
    </Box>
  );
};

export default Customers;
