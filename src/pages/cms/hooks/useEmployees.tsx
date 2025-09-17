import { type GridSortModel } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ToastMessage } from '../../../components/toastMessage';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  type Employee,
  type Role,
  type EmployeeStatus,
} from '../../../lib/employee.repo';
import useEmployeeStore from '../../../store/employee.store';
import { getEmployeeColumns } from '../tableColumns/employeesColumn';

export default function useEmployees() {
  const {
    employees,
    total,
    page,
    limit,
    search,
    role,
    status,
    sort,
    isLoading,
    isCreating,
    isDeleting,
    error,
    fetchEmployees,
    setSearch,
    setPage,
    setLimit,
    setRole,
    setStatus,
    setSort,
    deleteEmployee,
    // getEmployeeById,
    clearError,
  } = useEmployeeStore();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );

  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEmployeeForMenu, setSelectedEmployeeForMenu] =
    useState<string>('');

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (error) {
      ToastMessage('error', error);
      clearError();
    }
  }, [error, clearError]);

  const debouncedSearch = useDebounce(search, 350);
  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch, role, status, sort]);

  const safeEmployees = useMemo(
    () => employees.map((e) => ({ ...e, id: e.id?.toString() || '' })),
    [employees],
  );

  const mapById = useMemo(() => {
    const map = new Map<string, Employee>();
    for (const emp of employees) {
      if (emp?.id) map.set(emp.id.toString(), emp);
    }
    return map;
  }, [employees]);

  const handleViewEmployee = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetail(true);
  }, []);

  const handleCreateEmployee = useCallback(() => {
    setSelectedEmployee(null);
    setFormMode('create');
    setShowForm(true);
  }, []);

  const handleEditEmployee = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setFormMode('edit');
    setShowForm(true);
  }, []);

  const handleDeleteEmployee = useCallback((employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!employeeToDelete?.id) return;
    try {
      await deleteEmployee(employeeToDelete.id);
      ToastMessage('success', 'Employee deleted successfully!');
      setShowDeleteDialog(false);
      setEmployeeToDelete(null);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Failed to delete employee';
      ToastMessage('error', msg);
    }
  }, [deleteEmployee, employeeToDelete]);

  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, employeeId: string) => {
      setAnchorEl(event.currentTarget);
      setSelectedEmployeeForMenu(employeeId);
    },
    [],
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedEmployeeForMenu('');
  }, []);

  const findEmployeeById = useCallback(
    (id: string) => mapById.get(id),
    [mapById],
  );

  const handleMenuEdit = useCallback(() => {
    if (!selectedEmployeeForMenu) return handleMenuClose();
    const employee = findEmployeeById(selectedEmployeeForMenu);
    if (employee) {
      handleEditEmployee(employee);
    } else {
      ToastMessage('error', 'Employee not found');
    }
    handleMenuClose();
  }, [
    selectedEmployeeForMenu,
    findEmployeeById,
    handleEditEmployee,
    handleMenuClose,
  ]);

  const handleMenuDelete = useCallback(() => {
    if (!selectedEmployeeForMenu) return handleMenuClose();
    const employee = findEmployeeById(selectedEmployeeForMenu);
    if (employee) {
      handleDeleteEmployee(employee);
    } else {
      ToastMessage('error', 'Employee not found');
    }
    handleMenuClose();
  }, [
    selectedEmployeeForMenu,
    findEmployeeById,
    handleDeleteEmployee,
    handleMenuClose,
  ]);

  const handleMenuView = useCallback(() => {
    if (!selectedEmployeeForMenu) return handleMenuClose();
    const employee = findEmployeeById(selectedEmployeeForMenu);
    if (employee) {
      handleViewEmployee(employee);
    } else {
      ToastMessage('error', 'Employee not found');
    }
    handleMenuClose();
  }, [
    selectedEmployeeForMenu,
    findEmployeeById,
    handleViewEmployee,
    handleMenuClose,
  ]);

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
    },
    [setSearch],
  );

  const handleRoleChange = useCallback(
    (newRole: 'all' | Role) => {
      setRole(newRole);
    },
    [setRole],
  );

  const handleStatusChange = useCallback(
    (newStatus: 'all' | EmployeeStatus) => {
      setStatus(newStatus);
    },
    [setStatus],
  );

  const handleSortChange = useCallback(
    (newSort: string) => {
      setSort(newSort);
    },
    [setSort],
  );

  const handleSortModelChange = useCallback(
    (model: GridSortModel) => {
      if (!model?.length || !model[0].sort) {
        setSort('createdAt:desc');
        return;
      }
      const { field, sort } = model[0];
      setSort(`${field}:${sort}`);
    },
    [setSort],
  );

  const handleRefresh = useCallback(() => {
    fetchEmployees();
    // ToastMessage('success', 'Data refreshed successfully!');
  }, [fetchEmployees]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setSelectedEmployee(null);
    setFormMode('create');
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
    setSelectedEmployee(null);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
    setEmployeeToDelete(null);
  }, []);

  const handleEditFromDetail = useCallback(
    (employee: Employee) => {
      handleCloseDetail();
      handleEditEmployee(employee);
    },
    [handleCloseDetail, handleEditEmployee],
  );

  const handleDeleteFromDetail = useCallback(
    (employee: Employee) => {
      handleCloseDetail();
      handleDeleteEmployee(employee);
    },
    [handleCloseDetail, handleDeleteEmployee],
  );

  // Table columns
  const columns = useMemo(
    () =>
      getEmployeeColumns({
        onMenuClick: handleMenuClick,
      }),
    [handleMenuClick],
  );

  return {
    employees: safeEmployees,
    total,
    page,
    limit,
    search,
    role,
    status,
    sort,
    selectedEmployee,
    employeeToDelete,

    isLoading,
    isCreating,
    isDeleting,
    error,
    formMode,
    showForm,
    showDetail,
    showDeleteDialog,

    anchorEl,
    selectedEmployeeForMenu,
    columns,

    handleCreateEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    handleViewEmployee,
    handleConfirmDelete,
    // handleUpdateEmployeeSubmit,
    // handleCreateEmployeeSubmit,

    handleMenuClick,
    handleMenuClose,
    handleMenuEdit,
    handleMenuDelete,
    handleMenuView,

    handlePageChange,
    handleSearchChange,
    handleRoleChange,
    handleStatusChange,
    handleSortChange,
    handleSortModelChange,
    handleRefresh,

    handleCloseForm,
    handleCloseDetail,
    handleCloseDeleteDialog,
    handleEditFromDetail,
    handleDeleteFromDetail,

    findEmployeeById,
    clearError,
  };
}
