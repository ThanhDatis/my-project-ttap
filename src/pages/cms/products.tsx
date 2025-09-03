import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  Box,
  Typography,
  Button,
  Alert,
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
  // Card,
} from '@mui/material';
import React from 'react';

import { brand } from '../../common/color';
import theme from '../../common/theme/themes';
import CustomTable from '../../components/tables/customTable';
import { type Product } from '../../lib/product.repo';

import ProductFiltersComponent from './components/productFilters';
import ProductDetailDialog from './components/productsDetailDialog';
import ProductForm from './components/productsForm';
import useProducts from './hooks/useProducts';

const Products: React.FC = () => {
  const {
    products,
    pagination,
    productToDelete,

    isLoading,
    isDeleting,
    error,
    showDetail,
    showDeleteDialog,
    selectedProduct,

    anchorEl,

    columns,

    handleConfirmDelete,
    handleRefresh,
    handlePageChange,
    handleSortModelChange,

    handleMenuClose,
    handleMenuEdit,
    handleMenuDelete,
    handleMenuView,

    handleCloseDetail,
    handleCloseDeleteDialog,
    handleEditFromDetail,
    handleDeleteFromDetail,

    clearError,
  } = useProducts();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isLoading && (!products || products.length === 0)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading products...</Typography>
      </Box>
    );
  }

  const displayedProducts = products;

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography
          variant={isMobile ? 'h6' : 'h4'}
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          Products Management
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          Manage your product inventory, track stock levels, and update product
          information.
        </Typography>
      </Box>

      <ProductForm onRefresh={handleRefresh} isTableLoading={isLoading} />

      <ProductFiltersComponent />

      <Box sx={{ mt: 2, width: '100%', overflow: 'hidden' }}>
        <CustomTable<Product>
          rowHeight={isMobile ? 60 : 80}
          columnHeaders={columns}
          isLoading={isLoading}
          checkboxSelection={true}
          items={displayedProducts}
          totalCount={pagination?.total || 0}
          currentPage={pagination?.page || 0}
          maxPageSize={pagination?.limit || 10}
          onPageChange={handlePageChange}
          handleSortModelChange={handleSortModelChange}
          onRowClick={(params) => {
            console.log('Row clicked:', params.row);
          }}
          noDataMessage="No products found. Start by creating your first product."
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                fontSize: isMobile ? '0.75rem' : '0.875rem',
              },
              '& .MuiDataGrid-cell': {
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                padding: isMobile ? '4px 8px' : '8px 16px',
              },
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
            // FIX: Mobile scroll optimization
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

      <ProductDetailDialog
        open={showDetail}
        onClose={handleCloseDetail}
        product={selectedProduct}
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
        <DialogTitle id="delete-dialog-title">Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{productToDelete?.name}"? This
            action cannot be undone.
            {productToDelete?.stock && productToDelete.stock > 0 && (
              <Box
                component="span"
                sx={{ display: 'block', mt: 1, color: 'warning.main' }}
              >
                ⚠️ This product still has {productToDelete.stock} items in
                stock.
              </Box>
            )}
          </DialogContentText>
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
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
