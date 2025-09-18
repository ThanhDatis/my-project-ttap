import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  Box,
  Typography,
  Button,
  Card,
  Collapse,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  CircularProgress,
  DialogContentText,
} from '@mui/material';

import { brand } from '../../common/color';
import theme from '../../common/theme/themes';
import CustomTable from '../../components/tables/customTable';
import type { Order } from '../../lib/order.repo';

import OrderDetailDialog from './components/orderDetailDialog';
import OrderFilter from './components/orderFilter';
import OrderForm from './components/orderForm';
import useOrders from './hooks/useOrders';

const Orders = () => {
  const {
    search,
    status,
    paymentMethod,
    sort,
    orders,
    total,
    page,
    limit,
    isLoading,
    isCreating,
    isDeleting,

    selectedOrder,
    orderToDelete,
    showForm,
    showDetail,
    showDeleteDialog,
    anchorEl,
    columns,

    handleCreateOrder,
    // handleEditOrder,
    // handleDeleteOrder,
    handleViewOrder,
    handleConfirmDelete,
    handleOrderSubmit,

    // handleMenuClick,
    handleMenuClose,
    handleMenuEdit,
    handleMenuDelete,
    handleMenuView,

    handlePageChange,
    // handleFilterChange,
    handleSearchChange,
    handleStatusChange,
    handlePaymentMethodChange,
    handleSortChange,
    handleSortModelChange,
    // handleRefresh,

    handleCloseForm,
    handleCloseDetail,
    handleCloseDeleteDialog,
    handleEditFromDetail,
    handleDeleteFromDetail,

    // clearError,
  } = useOrders();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isLoading && (!orders || orders.length === 0)) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading orders...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Typography
        variant={isMobile ? 'h6' : 'h3'}
        sx={{ fontWeight: 'bold', mb: 3, letterSpacing: 1 }}
      >
        ORDER MANAGEMENT
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateOrder}
          disabled={isCreating}
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

      <Collapse in={showForm} timeout={300} unmountOnExit>
        <Card sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 2,
            }}
          >
            <IconButton onClick={handleCloseForm} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <OrderForm
            onSubmit={handleOrderSubmit}
            onCancel={handleCloseForm}
            initialData={
              selectedOrder
                ? {
                    orderId: selectedOrder.orderId,
                    customerId: selectedOrder.customerId,
                    customerName: selectedOrder.customerName,
                    customerEmail: selectedOrder.customerEmail || '',
                    customerPhone: selectedOrder.customerPhone || '',
                    paymentMethod: selectedOrder.paymentMethod,
                    shippingAddress: selectedOrder.shippingAddress || {
                      street: '',
                      ward: '',
                      district: '',
                      city: '',
                      note: '',
                    },

                    // tax: selectedOrder.tax || 0,
                    // notes: selectedOrder.notes || '',
                  }
                : undefined
            }
          />
        </Card>
      </Collapse>

      <OrderFilter
        search={search}
        status={status}
        paymentMethod={paymentMethod}
        sort={sort}
        totalCount={total}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPaymentMethodChange={handlePaymentMethodChange}
        onSortChange={handleSortChange}
      />

      <Box
        sx={{
          flex: 1,
          px: { xs: 1, md: 2 },
          width: '100%',
          maxWidth: '100vw',
          overflow: 'hidden',
          pb: 2,
        }}
      >
        <CustomTable<Order>
          rowHeight={isMobile ? 60 : 90}
          columnHeaders={columns}
          isLoading={isLoading}
          checkboxSelection={true}
          items={orders}
          totalCount={total}
          currentPage={page}
          maxPageSize={limit}
          onPageChange={handlePageChange}
          handleSortModelChange={handleSortModelChange}
          onRowClick={(params) => {
            handleViewOrder(params.row);
          }}
          noDataMessage="No orders found. Create your first order by clicking 'New Order' button."
          sx={{
            width: '100%',
            height: '100%',
            '& .MuiDataGrid-root': {
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                fontSize: isMobile ? '0.75rem' : '0.875rem',
              },
              '& .MuiDataGrid-cell': {
                fontSize: isMobile ? '0.75rem' : '0.875rem',
              },
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'action.hover' },
            },
            ...(isMobile && {
              '& .MuiDataGrid-virtualScroller': { overflow: 'auto !important' },
            }),
          }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            minWidth: 150,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            ...(!isMobile && {
              minWidth: 120,
            }),
          },
        }}
      >
        <MenuItem onClick={handleMenuView}>
          <ListItemIcon>
            <VisibilityRoundedIcon
              fontSize="small"
              sx={{ color: brand[500] }}
            />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleMenuEdit}>
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleMenuDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteRoundedIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <OrderDetailDialog
        open={showDetail}
        onClose={handleCloseDetail}
        order={selectedOrder}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />

      <Dialog
        open={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: { ...(isMobile && { margin: 0, borderRadius: 0 }) },
        }}
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete Order</DialogTitle>

        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete order "#{orderToDelete?.orderId}"?
            This action cannot be undone.
            {orderToDelete && (
              <Box
                component="span"
                sx={{ display: 'block', mt: 1, color: 'warning.main' }}
              >
                ⚠️ This will permanently remove all order data and cannot be
                recovered.
              </Box>
            )}
          </DialogContentText>
          {orderToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Customer:</strong> {orderToDelete.customerName}
              </Typography>
              <Typography variant="body2">
                <strong>Total:</strong>{' '}
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(orderToDelete.total)}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {orderToDelete.status}
              </Typography>
              <Typography variant="body2">
                <strong>Items:</strong> {orderToDelete.items?.length || 0} items
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={isDeleting}
            fullWidth={isMobile}
            variant={isMobile ? 'text' : 'outlined'}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            autoFocus={isMobile}
            fullWidth={isMobile}
          >
            {isDeleting ? 'Deleting...' : 'Delete Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;
