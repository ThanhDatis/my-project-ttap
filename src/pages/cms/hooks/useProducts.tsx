/* eslint-disable @typescript-eslint/no-explicit-any */
import { type GridSortModel } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';

import { ToastMessage } from '../../../components/toastMessage';
import { type Product } from '../../../lib/product.repo';
import { useProductStore } from '../../../store/product.store';
import { getProductColumns } from '../tableColumns/productsColumn';

export default function useProducts() {
  const {
    products,
    pagination,

    isLoading,
    isDeleting,
    error,

    fetchProducts,
    deleteProduct,
    setPagination,
    setSorting,
    clearError,
  } = useProductStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProductForMenu, setSelectedProductForMenu] =
    useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id.toString());
        ToastMessage('success', 'Product deleted successfully!');
        handleCloseDeleteDialog();
      } catch (error: any) {
        ToastMessage('error', error.message || 'Failed to delete product');
      }
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    productId: string,
  ): void => {
    setAnchorEl(event.currentTarget);
    setSelectedProductForMenu(productId);
  };

  const handleMenuClose = (event: React.MouseEvent<HTMLElement, MouseEvent>, p0: string): void => {
    setAnchorEl(null);
    setSelectedProductForMenu('');
  };

  const handleMenuEdit = (): void => {
    const product = products.find(
      (p) => p.id.toString() === selectedProductForMenu,
    );
    if (product) {
      handleEditProduct(product);
    }
    handleMenuClose();
  };

  const handleMenuDelete = (): void => {
    const product = products.find(
      (p) => p.id.toString() === selectedProductForMenu,
    );
    if (product) {
      handleDeleteProduct(product);
    }
    handleMenuClose();
  };

  const handleMenuView = (): void => {
    const product = products.find(
      (p) => p.id.toString() === selectedProductForMenu,
    );
    if (product) {
      handleViewProduct(product);
    }
    handleMenuClose();
  };

  // === TABLE ACTIONS ===

  // Handle Pagination
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination(page, pageSize);
  };

  // Handle Sorting
  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length > 0) {
      const { field, sort } = model[0];
      setSorting(field, sort as 'asc' | 'desc');
    }
  };

  // Handle Refresh
  const handleRefresh = () => {
    fetchProducts();
  };

  // === DIALOG ACTIONS ===

  // Close Forms
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedProduct(null);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };

  // Handle Edit from Detail Dialog
  const handleEditFromDetail = (product: Product) => {
    handleCloseDetail();
    handleEditProduct(product);
  };

  // Handle Delete from Detail Dialog
  const handleDeleteFromDetail = (product: Product) => {
    handleCloseDetail();
    handleDeleteProduct(product);
  };

  // === TABLE COLUMNS ===
  const columns = getProductColumns({
    // onView: handleViewProduct,
    // onEdit: handleEditProduct,
    // onDelete: handleDeleteProduct,
    onMenuClick: handleMenuClick,
  });

  return {
    products,
    pagination,
    selectedProduct,
    productToDelete,

    isLoading,
    isDeleting,
    error,
    formMode,
    showForm,
    showDetail,
    showDeleteDialog,

    anchorEl,
    selectedProductForMenu,

    columns,

    handleCreateProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleViewProduct,
    handleConfirmDelete,

    handleMenuClick,
    handleMenuClose,
    handleMenuEdit,
    handleMenuDelete,
    handleMenuView,

    handlePageChange,
    handleSortModelChange,
    handleRefresh,

    handleCloseForm,
    handleCloseDetail,
    handleCloseDeleteDialog,
    handleEditFromDetail,
    handleDeleteFromDetail,

    clearError,
  };
}
