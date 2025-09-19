/* eslint-disable @typescript-eslint/no-explicit-any */
import { type GridSortModel } from '@mui/x-data-grid';
import type { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { ToastMessage } from '../../../components/toastMessage';
import { useDebounce } from '../../../hooks/useDebounce';
import { type Order, type OrderPayload } from '../../../lib/order.repo';
import useOrderStore from '../../../store/order.store';
import { getOrderColumns } from '../tableColumns/ordersColumn';

type OrderStoreState = ReturnType<typeof useOrderStore.getState>;

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

export default function useOrders() {
  const selector = useShallow((state: OrderStoreState) => ({
    orders: state.orders,
    total: state.total,
    page: state.page,
    limit: state.limit,
    search: state.search,
    status: state.status,
    paymentMethod: state.paymentMethod,
    sort: state.sort,
    isLoading: state.isLoading,
    isCreating: state.isCreating,
    isDeleting: state.isDeleting,
    error: state.error,
    customers: state.customers,
    products: state.products,
    isLoadingCustomers: state.isLoadingCustomers,
    isLoadingProducts: state.isLoadingProducts,

    fetchOrders: state.fetchOrders,
    setSearch: state.setSearch,
    setPage: state.setPage,
    setLimit: state.setLimit,
    setStatus: state.setStatus,
    setPaymentMethod: state.setPaymentMethod,
    setSort: state.setSort,
    createOrder: state.createOrder,
    updateOrder: state.updateOrder,
    deleteOrder: state.deleteOrder,
    fetchCustomers: state.fetchCustomers,
    fetchProducts: state.fetchProducts,
    clearError: state.clearError,
  }));

  const {
    orders,
    total,
    page,
    limit,
    search,
    status,
    paymentMethod,
    sort,
    isLoading,
    isCreating,
    isDeleting,
    error,
    customers,
    products,
    isLoadingCustomers,
    isLoadingProducts,

    fetchOrders,
    setSearch,
    setPage,
    setLimit,
    setStatus,
    setPaymentMethod,
    setSort,
    createOrder,
    updateOrder,
    deleteOrder,
    fetchCustomers,
    fetchProducts,
    clearError,
  } = useOrderStore(selector);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrderForMenu, setSelectedOrderForMenu] = useState<string>('');

  const safeOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    return orders.map((order) => ({
      ...order,
      id: order.id?.toString(),
    }));
  }, [orders]);

  const ordersMap = useMemo(() => {
    const map = new Map<string, Order>();
    for (const order of safeOrders) {
      if (order?.id) map.set(order.id.toString(), order);
    }
    return map;
  }, [safeOrders]);

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    void fetchOrders();
  }, [page, limit, debouncedSearch, status, paymentMethod, sort, fetchOrders]);

  useEffect(() => {
    if (error) {
      ToastMessage('error', error);
      clearError();
    }
  }, [error, clearError]);

  const handleViewOrder = useCallback((order: Order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  }, []);

  const handleCreateOrder = useCallback(() => {
    setSelectedOrder(null);
    setFormMode('create');
    setShowForm(true);
  }, []);

  const handleEditOrder = useCallback((order: Order) => {
    setSelectedOrder(order);
    setFormMode('edit');
    setShowForm(true);
  }, []);

  const handleDeleteOrder = useCallback((order: Order) => {
    setOrderToDelete(order);
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!orderToDelete?.id) return;

    try {
      const id = orderToDelete.id.toString();
      await deleteOrder(id);
      ToastMessage('success', 'Order deleted successfully!');
      setShowDeleteDialog(false);
      setOrderToDelete(null);
      void fetchOrders();
    } catch (error: unknown) {
      let msg = 'Failed to delete order';
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string };
        msg = data.message || msg;
      } else if (error instanceof Error) {
        msg = error.message || msg;
      }
      ToastMessage('error', msg);
    }
  }, [orderToDelete, deleteOrder, fetchOrders]);

  const handleOrderSubmit = useCallback(
    async (orderData: OrderPayload) => {
      try {
        if (formMode === 'edit' && selectedOrder) {
          const updateData = {
            ...orderData,
            status: orderData.paymentMethod
              ? 'processing'
              : selectedOrder.status,
          };
          console.log('updateData', updateData);
          await updateOrder(selectedOrder.id, updateData);
          ToastMessage('success', 'Order updated successfully!');
        } else {
          await createOrder(orderData);
          ToastMessage('success', 'Order created successfully!');
        }

        setShowForm(false);
        setSelectedOrder(null);
        setFormMode('create');
        void fetchOrders();
        return { success: true };
      } catch (error: unknown) {
        let msg =
          formMode === 'edit'
            ? 'Failed to update order'
            : 'Failed to create order';
        if (isAxiosError(error)) {
          const data = error.response?.data as { message?: string };
          msg = data.message || msg;
        } else if (error instanceof Error) {
          msg = error.message || msg;
        }
        ToastMessage('error', msg);
        return { success: false, message: msg };
      }
    },
    [formMode, selectedOrder, createOrder, updateOrder, fetchOrders],
  );

  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, orderId: string) => {
      setAnchorEl(event.currentTarget);
      setSelectedOrderForMenu(orderId);
    },
    [],
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedOrderForMenu('');
  }, []);

  const findOrderById = useCallback(
    (id: string) => ordersMap.get(id),
    [ordersMap],
  );

  const handleMenuEdit = useCallback(() => {
    if (!selectedOrderForMenu) return handleMenuClose();
    const order = findOrderById(selectedOrderForMenu);
    if (order) {
      handleEditOrder(order);
    } else {
      ToastMessage('error', 'Order not found');
    }
    handleMenuClose();
  }, [selectedOrderForMenu, findOrderById, handleEditOrder, handleMenuClose]);

  const handleMenuDelete = useCallback(() => {
    if (!selectedOrderForMenu) return handleMenuClose();
    const order = findOrderById(selectedOrderForMenu);
    if (order) {
      handleDeleteOrder(order);
    } else {
      ToastMessage('error', 'Order not found');
    }
    handleMenuClose();
  }, [selectedOrderForMenu, findOrderById, handleDeleteOrder, handleMenuClose]);

  const handleMenuView = useCallback(() => {
    if (!selectedOrderForMenu) return handleMenuClose();
    const order = findOrderById(selectedOrderForMenu);
    if (order) {
      handleViewOrder(order);
    } else {
      ToastMessage('error', 'Order not found');
    }
    handleMenuClose();
  }, [selectedOrderForMenu, findOrderById, handleViewOrder, handleMenuClose]);

  const handlePageChange = useCallback(
    (newPage: number, pageSize: number) => {
      setPage(newPage + 1);
      if (pageSize !== limit) {
        setLimit(pageSize);
      }
    },
    [limit, setLimit, setPage],
  );

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      setSearch(searchTerm);
      setPage(1);
    },
    [setPage, setSearch],
  );

  const handleSortChange = useCallback(
    (sortValue: string) => {
      setSort(sortValue);
      setPage(1);
    },
    [setPage, setSort],
  );

  const handleStatusChange = useCallback(
    (statusValue: string) => {
      setStatus(statusValue as any);
      setPage(1);
    },
    [setPage, setStatus],
  );

  const handlePaymentMethodChange = useCallback(
    (paymentValue: string) => {
      setPaymentMethod(paymentValue as any);
      setPage(1);
    },
    [setPage, setPaymentMethod],
  );

  const handleSortModelChange = useCallback(
    (model: GridSortModel) => {
      if (!model?.length || !model[0].sort) {
        setSort('createdAt:desc');
        setPage(1);
        return;
      }
      const { field, sort } = model[0];
      setSort(`${field}:${sort}`);
      setPage(1);
    },
    [setSort, setPage],
  );

  const handleFilterChange = useCallback(
    (filters: any) => {
      const { search, status, paymentMethod, sortBy, sortOrder } = filters;

      if (search !== undefined) {
        handleSearchChange(search);
      }
      if (status !== undefined) {
        handleStatusChange(status);
      }
      if (paymentMethod !== undefined) {
        handlePaymentMethodChange(paymentMethod);
      }
      if (sortBy && sortOrder) {
        handleSortChange(`${sortBy}:${sortOrder}`);
      }
    },
    [
      handleSearchChange,
      handleStatusChange,
      handlePaymentMethodChange,
      handleSortChange,
    ],
  );

  const handleRefresh = useCallback(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setSelectedOrder(null);
    setFormMode('create');
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
    setSelectedOrder(null);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
    setOrderToDelete(null);
  }, []);

  const handleEditFromDetail = useCallback(
    (order: Order) => {
      handleCloseDetail();
      handleEditOrder(order);
    },
    [handleCloseDetail, handleEditOrder],
  );

  const handleDeleteFromDetail = useCallback(
    (order: Order) => {
      handleCloseDetail();
      handleDeleteOrder(order);
    },
    [handleCloseDetail, handleDeleteOrder],
  );

  const columns = useMemo(
    () =>
      getOrderColumns({
        onMenuClick: handleMenuClick,
        onView: handleViewOrder,
        onEdit: handleEditOrder,
        onDelete: handleDeleteOrder,
      }),
    [handleMenuClick, handleViewOrder, handleEditOrder, handleDeleteOrder],
  );

  const hasOrders = safeOrders.length > 0;
  const isEmpty = !isLoading && safeOrders.length === 0;
  const currentPageZeroBased = Math.max(0, page - 1);

  return {
    orders: safeOrders,
    total,
    page: currentPageZeroBased,
    limit,
    search,
    status,
    paymentMethod,
    sort,
    isLoading,
    isCreating,
    isDeleting,
    error,

    customers,
    products,
    isLoadingCustomers,
    isLoadingProducts,

    selectedOrder,
    orderToDelete,
    formMode,
    showForm,
    showDetail,
    showDeleteDialog,
    anchorEl,
    selectedOrderForMenu,

    hasOrders,
    isEmpty,
    columns,

    handleCreateOrder,
    handleEditOrder,
    handleDeleteOrder,
    handleViewOrder,
    handleConfirmDelete,
    handleOrderSubmit,

    handleMenuClick,
    handleMenuClose,
    handleMenuEdit,
    handleMenuDelete,
    handleMenuView,

    handlePageChange,
    handleSearchChange,
    handleStatusChange,
    handlePaymentMethodChange,
    handleSortChange,
    handleSortModelChange,
    handleFilterChange,
    handleRefresh,

    handleCloseForm,
    handleCloseDetail,
    handleCloseDeleteDialog,
    handleEditFromDetail,
    handleDeleteFromDetail,

    loadCustomers: fetchCustomers,
    loadProducts: fetchProducts,

    clearError,
  };
}
