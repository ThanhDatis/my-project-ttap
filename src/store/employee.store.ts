import { create } from 'zustand';

import employeeRepository, {
  type Employee,
  type EmployeeListParams,
  type EmployeePayload,
  type EmployeeStatus,
  type Role,
} from '../lib/employee.repo';

type State = {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
  search: string;
  role: Role | 'all';
  status: EmployeeStatus | 'all';
  sort: string;
  isCreating: boolean;
  isLoading: boolean;
  isDeleting: boolean;
  error: string | null;
};

type Actions = {
  fetchEmployees: () => Promise<void>;

  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setRole: (role: Role | 'all') => void;
  setStatus: (status: EmployeeStatus | 'all') => void;
  setSort: (sort: string) => void;

  createEmployee: (payload: EmployeePayload) => Promise<Employee>;
  updateEmployee: (
    id: string,
    payload: Partial<EmployeePayload>,
  ) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
  getEmployeeById: (id: string) => Promise<Employee>;

  clearError: () => void;
  resetFilters: () => void;
};

export const useEmployeeStore = create<State & Actions>((set, get) => ({
  employees: [],
  total: 0,
  page: 1,
  limit: 10,

  search: '',
  role: 'all',
  status: 'all',
  sort: 'createdAt:desc',

  isCreating: false,
  isLoading: false,
  isDeleting: false,
  error: null,

  clearError: () => set({ error: null }),
  resetFilters: () =>
    set({
      search: '',
      role: 'all',
      status: 'all',
      page: 1,
      sort: 'createdAt:desc',
    }),

  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit, search, role, status, sort } = get();

      const params: EmployeeListParams = {
        page,
        limit,
        search: search || undefined,
        role: role !== 'all' ? role : undefined,
        status: status !== 'all' ? status : undefined,
        sort,
      };

      const result = await employeeRepository.getAllEmployees(params);
      set({
        employees: Array.isArray(result.items) ? result.items : [],
        total: result.total ?? 0,
        page: result.page ?? page,
        limit: result.limit ?? limit,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch employees',
        isLoading: false,
      });
    }
  },

  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchEmployees();
  },

  setPage: (page) => {
    set({ page });
    get().fetchEmployees();
  },

  setLimit: (limit) => {
    set({ limit, page: 1 });
    get().fetchEmployees();
  },

  setRole: (role) => {
    set({ role, page: 1 });
    get().fetchEmployees();
  },

  setStatus: (status) => {
    set({ status, page: 1 });
    get().fetchEmployees();
  },

  setSort: (sort) => {
    set({ sort, page: 1 });
    get().fetchEmployees();
  },

  getEmployeeById: async (id: string) => {
    return employeeRepository.getById(id);
  },

  createEmployee: async (payload: EmployeePayload) => {
    set({ isCreating: true, error: null });
    try {
      const emp = await employeeRepository.create(payload);
      await get().fetchEmployees();
      return emp;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },

  updateEmployee: async (id: string, payload: Partial<EmployeePayload>) => {
    set({ isCreating: true, error: null });
    try {
      const emp = await employeeRepository.update(id, payload);
      await get().fetchEmployees();
      return emp;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },

  deleteEmployee: async (id: string) => {
    set({ isDeleting: true, error: null });
    try {
      await employeeRepository.softDelete(id);
      await get().fetchEmployees();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  },
}));

export default useEmployeeStore;
