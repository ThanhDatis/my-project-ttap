/* eslint-disable no-unused-vars */
import { create } from 'zustand';

import customerRepository, {
  type Customer,
  type CustomerListPayload,
  type ListParams,
} from '../lib/customer.repo';

type State = {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  search: string;
  sort: string;
  tier: 'all' | 'vip' | 'normal';
  isLoading: boolean;
  isDeleting: boolean;
  error: string | null;
};

type Actions = {
  fetchCustomers: () => Promise<void>;

  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sort: string) => void;
  setTier: (tier: 'all' | 'vip' | 'normal') => void;

  createCustomer: (payload: Partial<Customer>) => Promise<Customer>;
  updateCustomer: (id: string, payload: Partial<Customer>) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;

  clearError: () => void;
};

export const useCustomerStore = create<State & Actions>((set, get) => ({
  customers: [],
  total: 0,
  page: 1,
  limit: 10,

  search: '',
  sort: 'createdAt:desc',
  tier: 'all',

  isLoading: false,
  // isCreating: false,
  isDeleting: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit, search, tier, sort } = get();
      const [sortByRaw, sortOrderRaw] = (sort || 'createdAt:desc').split(':');
      const sortBy = sortByRaw || 'createdAt';
      const sortOrder = (sortOrderRaw === 'asc' ? 'asc' : 'desc') as
        | 'asc'
        | 'desc';

      const params: ListParams = {
        page,
        limit,
        search: search || undefined,
        sortBy,
        sortOrder,
        ...(tier !== 'all' ? { tier } : {}),
      };

      const { items, pagination } = (await customerRepository.getAllCustomers(
        params,
      )) as CustomerListPayload;

      set({
        customers: Array.isArray(items) ? items : [],
        total: pagination?.total ?? 0,
        page: pagination?.page ?? page,
        limit: pagination?.limit ?? limit,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error:
          err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch customers',
      });
    }
  },

  setSearch: (v) => set({ search: v }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setTier: (tier) => set({ tier }),
  setSort: (sort) => set({ sort }),

  createCustomer: async (payload) => {
    const customer = await customerRepository.create(payload);
    await get().fetchCustomers();
    return customer;
  },

  updateCustomer: async (id, payload) => {
    const customer = await customerRepository.update(id, payload);
    await get().fetchCustomers();
    return customer;
  },

  deleteCustomer: async (id) => {
    set({ isDeleting: true });
    try {
      await customerRepository.softDelete(id);
      await get().fetchCustomers();
    } finally {
      set({ isDeleting: false });
    }
  },
}));

export default useCustomerStore;
