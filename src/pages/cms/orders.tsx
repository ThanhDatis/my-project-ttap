import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Typography,
  Button,
  Card,
  Collapse,
  IconButton,
  // Divider,
} from '@mui/material';
import { useState, useEffect } from 'react';

import { brand } from '../../common/color';
import CustomTable from '../../components/tables/customTable';

import OrderFilter from './components/orderFilter';
import OrderForm from './components/orderForm';
import { orderColumns } from './tableColumns/ordersColumn';

const Orders = () => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    total: 0,
  });

  // Mock data for demonstration (replace with real API calls later)
  const mockOrders = [];

  useEffect(() => {
    // TODO: Fetch orders from API
    setOrders(mockOrders);
  }, []);

  const handleNewOrder = () => {
    setShowOrderForm(true);
  };

  const handleCloseForm = () => {
    setShowOrderForm(false);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, pageSize }));
    // TODO: Fetch data with new pagination
  };

  const handleOrderSubmit = async (orderData: any) => {
    try {
      // TODO: Create order via API
      console.log('Creating order:', orderData);

      // Close form after successful creation
      setShowOrderForm(false);

      // Refresh orders list
      // TODO: Refresh data from API
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        ORDER MANAGEMENT
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewOrder}
          sx={{
            bgcolor: brand[450],
            '&:hover': { bgcolor: brand[600] },
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          New Order
        </Button>
      </Box>

      <Collapse in={showOrderForm} timeout={300}>
        <Card sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              // mb: 3,
            }}
          >
            <IconButton onClick={handleCloseForm} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <OrderForm onSubmit={handleOrderSubmit} onCancel={handleCloseForm} />
        </Card>
      </Collapse>

      <OrderFilter
        onFilterChange={(filters) => console.log('Filters:', filters)}
      />

      <Card sx={{ p: 0, overflow: 'hidden' }}>
        <CustomTable
          items={orders}
          columnHeaders={orderColumns}
          totalCount={pagination.total}
          currentPage={pagination.page}
          maxPageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          noDataMessage="No orders found. Create your first order by clicking 'New Order' button."
        />
      </Card>
    </Box>
  );
};

export default Orders;
