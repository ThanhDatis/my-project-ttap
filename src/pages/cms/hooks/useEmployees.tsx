import { type GridSortModel } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ToastMessage } from '../../../components/toastMessage';
import {
  type Employee,
  type Role,
  type EmployeeStatus,
} from '../../../lib/employee.repo';
import { getEmployeeColumns } from '../tableColumns/employeesColumn';

// Mock data for demo purposes
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@company.com',
    phone: '0123456789',
    dateOfBirth: '1990-05-15',
    address: '123 Lê Lợi, Quận 1, TP.HCM',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    createdBy: {
      _id: 'user1',
      name: 'System Admin',
      email: 'admin@company.com',
    },
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    email: 'binh.tran@company.com',
    phone: '0987654321',
    dateOfBirth: '1985-08-22',
    address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
    role: 'manager',
    status: 'active',
    createdAt: '2023-02-20T09:30:00Z',
    updatedAt: '2024-02-20T09:30:00Z',
    createdBy: {
      _id: 'user1',
      name: 'System Admin',
      email: 'admin@company.com',
    },
  },
  {
    id: '3',
    name: 'Lê Minh Cường',
    email: 'cuong.le@company.com',
    phone: '0369852147',
    dateOfBirth: '1992-12-03',
    address: '789 Pasteur, Quận 3, TP.HCM',
    role: 'staff',
    status: 'suspended',
    createdAt: '2023-03-10T10:15:00Z',
    updatedAt: '2024-03-10T10:15:00Z',
    createdBy: {
      _id: 'user2',
      name: 'HR Manager',
      email: 'hr@company.com',
    },
  },
  {
    id: '4',
    name: 'Phạm Thu Dung',
    email: 'dung.pham@company.com',
    phone: '0741852963',
    dateOfBirth: '1988-07-18',
    address: '321 Cách Mạng Tháng 8, Quận 10, TP.HCM',
    role: 'staff',
    status: 'active',
    createdAt: '2023-04-05T11:00:00Z',
    updatedAt: '2024-04-05T11:00:00Z',
    createdBy: {
      _id: 'user2',
      name: 'HR Manager',
      email: 'hr@company.com',
    },
  },
  {
    id: '5',
    name: 'Hoàng Văn Em',
    email: 'em.hoang@company.com',
    phone: '0159753486',
    dateOfBirth: '1993-11-25',
    address: '654 Võ Văn Tần, Quận 3, TP.HCM',
    role: 'staff',
    status: 'inactive',
    createdAt: '2023-05-12T14:20:00Z',
    updatedAt: '2024-05-12T14:20:00Z',
    createdBy: {
      _id: 'user2',
      name: 'HR Manager',
      email: 'hr@company.com',
    },
  },
];

function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEmployeeForMenu, setSelectedEmployeeForMenu] =
    useState<string>('');

  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'all' | Role>('all');
  const [status, setStatus] = useState<'all' | EmployeeStatus>('all');
  const [sort, setSort] = useState('createdAt:desc');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounced(search, 350);

  const filteredEmployees = useMemo(() => {
    let filtered = [...employees];
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(searchLower) ||
          emp.email?.toLowerCase().includes(searchLower) ||
          emp.phone?.includes(searchLower),
      );
    }

    if (role !== 'all') {
      filtered = filtered.filter((emp) => emp.role === role);
    }

    if (status !== 'all') {
      filtered = filtered.filter((emp) => emp.status === status);
    }

    if (sort) {
      const [field, direction] = sort.split(':') as [
        keyof Employee,
        'asc' | 'desc',
      ];
      filtered.sort((a, b) => {
        const aVal = a[field ?? ''] as string;
        const bVal = b[field ?? ''] as string;

        if (direction === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      });
    }
    return filtered;
  }, [employees, debouncedSearch, role, status, sort]);

  // Pagination
  const total = filteredEmployees.length;
  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredEmployees.slice(start, start + limit);
  }, [filteredEmployees, page, limit]);

  const safeEmployees = useMemo(
    () => paginated.map((e) => ({ ...e, id: e.id?.toString() })),
    [paginated],
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
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Remove from mock data
      setEmployees((prev) =>
        prev.filter((emp) => emp.id !== employeeToDelete.id),
      );
      ToastMessage('success', 'Employee deleted successfully!');
      setShowDeleteDialog(false);
      setEmployeeToDelete(null);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Failed to delete employee';
      ToastMessage('error', msg);
    } finally {
      setIsLoading(false);
    }
  }, [employeeToDelete]);

  // Menu actions
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

  // Filter and pagination handlers
  const handlePageChange = useCallback(
    (page: number, pageSize: number) => {
      setPage(page + 1);
      if (pageSize !== limit) {
        setLimit(pageSize);
      }
    },
    [limit],
  );

  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  const handleRoleChange = useCallback((newRole: 'all' | Role) => {
    setRole(newRole);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback(
    (newStatus: 'all' | EmployeeStatus) => {
      setStatus(newStatus);
      setPage(1);
    },
    [],
  );

  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort);
    setPage(1);
  }, []);

  const handleSortModelChange = useCallback((model: GridSortModel) => {
    if (!model?.length || !model[0].sort) {
      setSort('createdAt:desc');
      setPage(1);
      return;
    }
    const { field, sort } = model[0];
    setSort(`${field}:${sort}`);
    setPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      ToastMessage('success', 'Data refreshed successfully!');
    }, 800);
  }, []);

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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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

    clearError,
  };
}
