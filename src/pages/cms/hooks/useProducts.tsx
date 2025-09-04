/* eslint-disable @typescript-eslint/no-explicit-any */
import { type GridSortModel } from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';

import { ToastMessage } from '../../../components/toastMessage';
import { type Product } from '../../../lib/product.repo';
import { default as useProductStore } from '../../../store/product.store';
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

  const safeProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.map((product) => ({
      ...product,
      id: product.id?.toString(),
    }));
  }, [products]);

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
        const productId = productToDelete.id.toString();

        if (productId.startsWith('temp-')) {
          console.warn('Attempting to delete temp product:', productToDelete);
          ToastMessage(
            'error',
            'Cannot delete temporary product. Please refresh the page.',
          );
          handleCloseDeleteDialog();
          return;
        }

        if (!productId || productId === 'undefined' || productId === 'null') {
          console.error('Invalid product ID:', productId);
          ToastMessage('error', 'Invalid product ID');
          handleCloseDeleteDialog();
          return;
        }

        console.log('Deleting product with ID:', productId);
        console.log('Product details:', {
          id: productToDelete.id,
          name: productToDelete.name,
          sku: productToDelete.sku,
        });

        await deleteProduct(productId);
        ToastMessage('success', 'Product deleted successfully!');
        handleCloseDeleteDialog();

        handleRefresh();
      } catch (error: any) {
        console.error('Delete error details:', error);

        let errorMessage = 'Failed to delete product';

        if (error.response?.status === 404) {
          errorMessage = 'Product not found';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message) {
          errorMessage = error.message;
        }

        ToastMessage('error', errorMessage);
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

  const handleMenuClose = (): void => {
    setAnchorEl(null);
    setSelectedProductForMenu('');
  };

  const findProductById = (displayId: string): Product | undefined => {
    if (!Array.isArray(safeProducts) || safeProducts.length === 0) {
      console.warn('No products available to find');
      return undefined;
    }
    let product = safeProducts.find((p) => {
      if (!p || !p.id) return false;
      return p.id.toString() === displayId;
    });

    if (!product && displayId.startsWith('temp-')) {
      const parts = displayId.split('-');
      if (parts.length >= 3) {
        const index = parseInt(parts[1]);
        const name = parts.slice(2).join('-').replace(/-/g, ' ');
        product = safeProducts.find(
          (p, idx) =>
            idx === index ||
            p.name?.toLowerCase().replace(/\s+/g, ' ') === name,
        );
      }
    }
    if (!product && products) {
      const originalProduct = products.find(
        (p) => p.id?.toString() === displayId,
      );
      if (originalProduct) {
        product = safeProducts.find(
          (p) =>
            p.name === originalProduct.name && p.sku === originalProduct.sku,
        );
      }
    }

    return product;
  };

  const handleMenuEdit = (): void => {
    if (!selectedProductForMenu) {
      console.warn(`No product selected for menu actions`);
      handleMenuClose();
      return;
    }
    const product = findProductById(selectedProductForMenu);
    if (product) {
      handleEditProduct(product);
    } else {
      console.error(`Product not found for editing: ${selectedProductForMenu}`);
      ToastMessage('error', 'Product not found');
    }
    handleMenuClose();
  };

  const handleMenuDelete = (): void => {
    if (!selectedProductForMenu) {
      console.warn(`No product selected for menu actions`);
      return handleMenuClose();
    }
    const product = findProductById(selectedProductForMenu);
    if (product) {
      handleDeleteProduct(product);
    } else {
      console.error(
        `Product not found for deleting: ${selectedProductForMenu}`,
      );
      ToastMessage('error', 'Product not found');
    }
    handleMenuClose();
  };

  const handleMenuView = (): void => {
    if (!selectedProductForMenu) {
      console.warn(`No product selected for menu actions`);
      return handleMenuClose();
    }
    const product = findProductById(selectedProductForMenu);
    if (product) {
      handleViewProduct(product);
    } else {
      console.warn(`Product not found for id: ${selectedProductForMenu}`);
      // ToastMessage('error', 'Product not found');
      console.warn(
        'Available products:',
        safeProducts.map((p) => ({ id: p.id, name: p.name })),
      );
    }
    handleMenuClose();
  };

  // === TABLE ACTIONS ===

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination(page, pageSize);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length > 0) {
      const { field, sort } = model[0];
      setSorting(field, sort as 'asc' | 'desc');
    }
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  // === DIALOG ACTIONS ===

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
    setFormMode('create');
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedProduct(null);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleEditFromDetail = (product: Product) => {
    handleCloseDetail();
    handleEditProduct(product);
  };

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
    products: safeProducts,
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
