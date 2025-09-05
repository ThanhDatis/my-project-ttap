import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  customerRepository,
  type Customer,
  type CustomerPayload,
  type ListParams,
} from '../lib/customer.repo';

type State = {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search: string;
  tier: 'all' | 'vip' | 'normal';
  isLoading: boolean;
  error?: string | null;
};

type Actions = {
  fetch: (override?: Partial<ListParams>) => Promise<void>;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  setTier: (tier: 'all' | 'vip' | 'normal') => void;
  create: (payload: CustomerPayload) => Promise<Customer>;
  update: (id: string, payload: CustomerPayload) => Promise<Customer>;
  remove: (id: string) => Promise<void>;
};

const initial: State = {
  customers: [],
  total: 0,
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  search: '',
  tier: 'all',
  isLoading: false,
  error: null,
};

export const useCustomerStore = create<State & Actions>()(
  devtools((set, get) => ({
    ...initial,
    fetch: async (override) => {
      set({ isLoading: true, error: null });
      try {
        const { page, limit, search, tier, sortBy, sortOrder } = {
          ...get(),
          ...override,
        };
        const data = await customerRepository.list({
          page,
          limit,
          search,
          tier,
          sortBy,
          sortOrder,
        });
        set({
          customers: data.items,
          total: data.total,
          page: data.page,
          limit: data.limit,
          isLoading: false,
        });
      } catch (error) {
        set({
          isLoading: false,
          error: error?.message ?? 'Failed to fetch customers',
        });
      }
    },

    setPage: (page) => set({ page }),
    setLimit: (limit) => set({ limit }),
    setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
    setSearch: (search) => set({ search }),
    setTier: (tier) => set({ tier }),

    create: async (payload) => {
      const created = await customerRepository.create(payload);
      await get().fetch();
      return created;
    },

    update: async (id, payload) => {
      const updated = await customerRepository.update(id, payload);
      await get().fetch();
      return updated;
    },

    remove: async (id) => {
      await customerRepository.delete(id);
      await get().fetch();
    },
  })),
);
