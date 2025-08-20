import { Typography, Box } from '@mui/material';

const Orders = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        THIS IS ORDERS
      </Typography>
      <Typography variant="body1" color="text.secondary">
        View and manage all orders here. Track order status, process new orders, and manage order fulfillment.
      </Typography>
    </Box>
  );
};

export default Orders;
