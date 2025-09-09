import { type GridSortModel } from '@mui/x-data-grid';
import type { AxiosError } from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { ToastMessage } from '../../../components/toastMessage';
import { type Customer } from '../../../lib/customer.repo';
import useCustomerStore from '../../../store/customer.store';
import { getCustomerColumns } from '../tableColumns/customersColumn';

type CustomerStoreState = ReturnType<typeof useCustomerStore.getState>;

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

export default function useCustomers() {
  const selector = useShallow((state: CustomerStoreState) => ({
    customers: state.customers,
    total: state.total,
    page: state.page,
    limit: state.limit,
    search: state.search,
    // tier: state.tier,
    sort: state.sort,
    isLoading: state.isLoading,
    error: state.error,
    fetchCustomers: state.fetchCustomers,
    setSearch: state.setSearch,
    setPage: state.setPage,
    setLimit: state.setLimit,
    // setTier: state.setTier,
    setSort: state.setSort,
    deleteCustomer: state.deleteCustomer,
    clearError: state.clearError,
  }));
  const {
    customers,
    total,
    page,
    limit,
    search,
    // tier,
    sort,
    isLoading,
    error,
    fetchCustomers,
    setSearch,
    setPage,
    setLimit,
    // setTier,
    setSort,
    deleteCustomer,
    clearError,
  } = useCustomerStore(selector);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCustomerForMenu, setSelectedCustomerForMenu] =
    useState<string>('');

  const safeCustomers = useMemo(() => {
    if (!Array.isArray(customers)) return [];
    return customers.map((c) => ({
      ...c,
      id: c.id?.toString(),
    }));
  }, [customers]);

  const customersMap = useMemo(() => {
    const map = new Map<string, Customer>();
    for (const c of safeCustomers) {
      if (c?.id) map.set(c.id.toString(), c);
    }
    return map;
  }, [safeCustomers]);

  const debouncedSearch = useDebounced(search, 350);

  useEffect(() => {
    void fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch, sort]);

  useEffect(() => {
    if (error) {
      ToastMessage('error', error);
      clearError();
    }
  }, [error, clearError]);

  const handleViewCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetail(true);
  }, []);

  const handleCreateCustomer = useCallback(() => {
    setSelectedCustomer(null);
    setFormMode('create');
    setShowForm(true);
  }, []);

  const handleEditCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setFormMode('edit');
    setShowForm(true);
  }, []);

  const handleDeleteCustomer = useCallback((customer: Customer) => {
    setCustomerToDelete(customer);
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!customerToDelete?.id) return;
    try {
      const id = customerToDelete.id.toString();
      await deleteCustomer(id);
      ToastMessage('success', 'Customer deleted successfully!');
      setShowDeleteDialog(false);
      setCustomerToDelete(null);
      void fetchCustomers();
    } catch (error: unknown) {
      let msg = 'Failed to delete customer';
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string };
        msg = data.message || msg;
      } else if (error instanceof Error) {
        msg = error.message || msg;
      }
      ToastMessage('error', msg);
    }
  }, [customerToDelete, deleteCustomer, fetchCustomers]);

  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, customerId: string) => {
      setAnchorEl(event.currentTarget);
      setSelectedCustomerForMenu(customerId);
    },
    [],
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedCustomerForMenu('');
  }, []);

  const findCustomerById = useCallback(
    (id: string) => customersMap.get(id),
    [customersMap],
  );

  const handleMenuEdit = useCallback(() => {
    if (!selectedCustomerForMenu) return handleMenuClose();
    const customer = findCustomerById(selectedCustomerForMenu);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    customer
      ? handleEditCustomer(customer)
      : ToastMessage('error', 'Customer not found');
    handleMenuClose();
  }, [
    selectedCustomerForMenu,
    findCustomerById,
    handleEditCustomer,
    handleMenuClose,
  ]);

  const handleMenuDelete = useCallback(() => {
    if (!selectedCustomerForMenu) return handleMenuClose();
    const customer = findCustomerById(selectedCustomerForMenu);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    customer
      ? handleDeleteCustomer(customer)
      : ToastMessage('error', 'Customer not found');
    handleMenuClose();
  }, [
    selectedCustomerForMenu,
    findCustomerById,
    handleDeleteCustomer,
    handleMenuClose,
  ]);

  const handleMenuView = useCallback(() => {
    if (!selectedCustomerForMenu) return handleMenuClose();
    const customer = findCustomerById(selectedCustomerForMenu);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    customer
      ? handleViewCustomer(customer)
      : ToastMessage('error', 'Customer not found');
    handleMenuClose();
  }, [
    selectedCustomerForMenu,
    findCustomerById,
    handleViewCustomer,
    handleMenuClose,
  ]);

  // === FILTERS & PAGINATION ===

  const handlePageChange = useCallback(
    (page: number, pageSize: number) => {
      setPage(page + 1);
      if (pageSize !== limit) {
        setLimit(pageSize);
      }
    },
    [limit, setLimit, setPage],
  );

  const handleSearchChange = useCallback(
    (v: string) => {
      setSearch(v);
      setPage(1);
    },
    [setPage, setSearch],
  );

  // const handleTierChange = useCallback(
  //   (newTier: 'all' | 'vip' | 'normal') => {
  //     setTier(newTier);
  //     setPage(1);
  //   },
  //   [setPage, setTier],
  // );

  const handleSortChange = useCallback(
    (newSort: string) => {
      setSort(newSort);
      setPage(1);
    },
    [setPage, setSort],
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

  const handleRefresh = useCallback(() => {
    void fetchCustomers();
  }, [fetchCustomers]);

  // === DIALOG ACTIONS ===

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setSelectedCustomer(null);
    setFormMode('create');
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
    setSelectedCustomer(null);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
    setCustomerToDelete(null);
  }, []);

  const handleEditFromDetail = useCallback(
    (customer: Customer) => {
      handleCloseDetail();
      handleEditCustomer(customer);
    },
    [handleCloseDetail, handleEditCustomer],
  );

  const handleDeleteFromDetail = useCallback(
    (customer: Customer) => {
      handleCloseDetail();
      handleDeleteCustomer(customer);
    },
    [handleCloseDetail, handleDeleteCustomer],
  );

  // === TABLE COLUMNS ===
  const columns = useMemo(
    () =>
      getCustomerColumns({
        onMenuClick: handleMenuClick,
      }),
    [handleMenuClick],
  );

  return {
    customers: safeCustomers,
    total,
    page,
    limit,
    search,
    // tier,
    sort,
    selectedCustomer,
    customerToDelete,

    isLoading,
    error,
    formMode,
    showForm,
    showDetail,
    showDeleteDialog,

    anchorEl,
    selectedCustomerForMenu,

    columns,

    handleCreateCustomer,
    handleEditCustomer,
    handleDeleteCustomer,
    handleViewCustomer,
    handleConfirmDelete,

    handleMenuClick,
    handleMenuClose,
    handleMenuEdit,
    handleMenuDelete,
    handleMenuView,

    handlePageChange,
    handleSearchChange,
    // handleTierChange,
    handleSortChange,
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
