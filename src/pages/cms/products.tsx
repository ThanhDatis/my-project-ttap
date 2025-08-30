import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
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
} from '@mui/material';
import React from 'react';

import { brand } from '../../common/color';
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
    formMode,
    showForm,
    showDetail,
    showDeleteDialog,
    selectedProduct,

    anchorEl,
    // selectedProductForMenu,

    columns,

    handleCreateProduct,
    handleConfirmDelete,
    handleRefresh,
    handlePageChange,
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

    clearError,
  } = useProducts();

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

  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Products Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your product inventory, track stock levels, and update product
          information.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          key="refresh"
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          onClick={handleRefresh}
          disabled={isLoading}
          size="small"
        >
          Refresh
        </Button>
        <Button
          key="create"
          variant="outlined"
          startIcon={<AddCircleOutlineRoundedIcon />}
          onClick={handleCreateProduct}
          disabled={isLoading}
        >
          Add Product
        </Button>
      </Box>

      <ProductFiltersComponent />

      <Box sx={{ mt: 2 }}>
        <CustomTable<Product>
          rowHeight={80}
          columnHeaders={columns}
          isLoading={isLoading}
          checkboxSelection={true}
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

      <ProductForm
        open={showForm}
        onClose={handleCloseForm}
        product={selectedProduct}
        mode={formMode}
      />

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
