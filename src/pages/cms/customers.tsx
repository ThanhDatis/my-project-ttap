import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import React from 'react';

import { brand } from '../../common/color';
import theme from '../../common/theme/themes';
import CustomTable from '../../components/tables/customTable';
import { type Customer } from '../../lib/customer.repo';

import CustomerDetailDialog from './components/customersDetailDialog';
import CustomerFilters from './components/customersFilters';
import CustomerForm from './components/customersForm';
import useCustomers from './hooks/useCustomers';

const Customers: React.FC = () => {
  const {
    customers,
    total,
    page,
    limit,
    selectedCustomer,
    customerToDelete,

    isLoading,
    formMode,
    showDetail,
    showDeleteDialog,

    anchorEl,

    columns,

    handleConfirmDelete,
    handleRefresh,
    handlePageChange,
    handleSearchChange,
    handleSortChange,
    handleSortModelChange,

    handleMenuClose,
    handleMenuEdit,
    handleMenuDelete,
    handleMenuView,

    handleCloseForm,
    handleCloseDetail,
    handleCloseDeleteDialog,
    handleEditFromDetail,
    handleDeleteFromDetail,

    search,
    sort,
  } = useCustomers();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isLoading && (!customers || customers.length === 0)) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100%',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading customers...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )} */}

      <Box sx={{ mb: 2 }}>
        <Typography
          variant={isMobile ? 'h6' : 'h3'}
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          Customers Management
        </Typography>
      </Box>

      <CustomerForm
        mode={formMode}
        customer={selectedCustomer ?? undefined}
        onRefresh={handleRefresh}
        isTableLoading={isLoading}
        onClose={handleCloseForm}
      />

      <CustomerFilters
        search={search}
        sort={sort}
        totalCount={total}
        onSearchChange={handleSearchChange}
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
        <CustomTable<Customer>
          rowHeight={isMobile ? 60 : 90}
          columnHeaders={columns}
          isLoading={isLoading}
          checkboxSelection={true}
          items={customers}
          totalCount={total}
          currentPage={page - 1}
          maxPageSize={limit}
          onPageChange={handlePageChange}
          handleSortModelChange={handleSortModelChange}
          onRowClick={(params) => {
            console.log('Row clicked:', params.row);
          }}
          noDataMessage="No customers found. Start by adding your first customer."
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
                // padding: isMobile ? '4px 8px' : '8px 16px',
              },
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
            ...(isMobile && {
              '& .MuiDataGrid-virtualScroller': {
                overflow: 'auto !important',
              },
            }),
          }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
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

        <MenuItem onClick={handleMenuDelete}>
          <ListItemIcon>
            <DeleteRoundedIcon fontSize="small" sx={{ color: '#f44336' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <CustomerDetailDialog
        open={showDetail}
        onClose={handleCloseDetail}
        customer={selectedCustomer}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />

      <Dialog
        open={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: { ...(isMobile && { margin: 0, borderRadius: 0 }) },
        }}
      >
        <DialogTitle id="delete-dialog-title">Delete Customer</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete customer "{customerToDelete?.name}"?
            This action cannot be undone.
            {customerToDelete && (
              <Box
                component="span"
                sx={{ display: 'block', mt: 1, color: 'warning.main' }}
              >
                ⚠️ This will permanently remove all customer data including
                order history.
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={isLoading}
            fullWidth={isMobile}
            variant={isMobile ? 'text' : 'outlined'}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isLoading}
            autoFocus={isMobile}
            fullWidth={isMobile}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
