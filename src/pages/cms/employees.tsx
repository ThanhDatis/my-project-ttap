import { Typography, Box } from '@mui/material';

const Orders = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        THIS IS EMPLOYEES
      </Typography>
      <Typography variant="body1" color="text.secondary">
        View and manage all employees here. Track employee status, process new
        employees, and manage employee fulfillment.
      </Typography>
    </Box>
  );
};

export default Orders;
