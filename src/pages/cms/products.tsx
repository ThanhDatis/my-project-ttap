// src/pages/cms/products.tsx - Fixed version with safe guards
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
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
  Grid as Grid,
  CircularProgress,
} from '@mui/material';
import React from 'react';

import BreadcrumbPage from '../../components/breadcrumbPage';
import CustomTable from '../../components/tables/customTable';
import { type Product } from '../../lib/product.repo';

import ProductFiltersComponent from './components/productFilters';
import ProductDetailDialog from './components/productsDetailDialog';
import ProductForm from './components/productsForm';
import useProducts from './hooks/useProducts';

const Products: React.FC = () => {
  const {
    // Data
    products,
    pagination,
    productToDelete,

    // UI State
    isLoading,
    isDeleting,
    error,
    formMode,
    showForm,
    showDetail,
    showDeleteDialog,
    selectedProduct,

    // Menu state
    anchorEl,
    // selectedProductForMenu,

    // Table
    columns,

    handleCreateProduct,
    handleConfirmDelete,
    handleRefresh,
    handlePageChange,
    handleSortModelChange,

    // Menu Actions
    handleMenuClose,
    handleMenuEdit,
    handleMenuDelete,
    handleMenuView,

    handleCloseForm,
    handleCloseDetail,
    handleCloseDeleteDialog,
    handleEditFromDetail,
    handleDeleteFromDetail,

    // Error handling
    clearError,
  } = useProducts();

  // Debug logging
  React.useEffect(() => {
    console.log('Products Debug:', {
      products,
      productsType: typeof products,
      isArray: Array.isArray(products),
      length: products?.length,
      pagination,
      isLoading,
      error,
    });
  }, [products, pagination, isLoading, error]);

  // Loading state
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

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <Box>
      {/* Breadcrumb with Actions */}
      <BreadcrumbPage
        actionComponents={[
          <Button
            key="refresh"
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
            size="small"
          >
            Refresh
          </Button>,
          <Button
            key="create"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProduct}
            disabled={isLoading}
          >
            Add Product
          </Button>,
        ]}
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Page Header */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Products Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your product inventory, track stock levels, and update
            product information.
          </Typography>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ mt: 3 }}>
        <ProductFiltersComponent />
      </Box>

      {/* Products Table */}
      <Box sx={{ mt: 2 }}>
        <CustomTable<Product>
          rowHeight={80}
          columnHeaders={columns}
          isLoading={isLoading}
          checkboxSelection={false}
          items={safeProducts.map((product) => ({
            ...product,
            id: product.id || Math.random().toString(),
          }))}
          totalCount={pagination?.total || 0}
          currentPage={pagination?.page || 0}
          maxPageSize={pagination?.limit || 10}
          onPageChange={handlePageChange}
          handleSortModelChange={handleSortModelChange}
          onRowClick={(params) => {
            console.log('Row clicked:', params.row);
            // Simple row click to view details (remove the complex logic)
            // We'll handle this through the menu instead
          }}
          noDataMessage="No products found. Start by creating your first product."
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
          }}
        />
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 150,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <MenuItem onClick={handleMenuView}>
          <ListItemIcon>
            <ViewIcon fontSize="small" sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleMenuEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleMenuDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#f44336' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Product Form Dialog */}
      <ProductForm
        open={showForm}
        onClose={handleCloseForm}
        product={selectedProduct}
        mode={formMode}
      />

      {/* Product Detail Dialog */}
      <ProductDetailDialog
        open={showDetail}
        onClose={handleCloseDetail}
        product={selectedProduct}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
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
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
