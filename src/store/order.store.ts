/* eslint-disable no-unused-vars */
import { create } from 'zustand';

import orderRepository, {
  type Order,
  type OrderListParams,
  type OrderPayload,
  type OrderStatus,
  type PaymentMethod,
  type CustomerAutocomplete,
  type ProductForOrder,
} from '../lib/order.repo';

type State = {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  search: string;
  status: OrderStatus | 'all';
  paymentMethod: PaymentMethod | 'all';
  sort: string;
  isCreating: boolean;
  isLoading: boolean;
  isDeleting: boolean;
  error: string | null;

  customers: CustomerAutocomplete[];
  products: ProductForOrder[];
  isLoadingCustomers: boolean;
  isLoadingProducts: boolean;
};

type Actions = {
  fetchOrders: () => Promise<void>;

  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setStatus: (status: OrderStatus | 'all') => void;
  setPaymentMethod: (paymentMethod: PaymentMethod | 'all') => void;
  setSort: (sort: string) => void;

  createOrder: (payload: OrderPayload) => Promise<Order>;
  updateOrder: (id: string, payload: Partial<Order>) => Promise<Order>;
  deleteOrder: (id: string) => Promise<void>;

  fetchCustomers: (search?: string) => Promise<void>;
  fetchProducts: (search?: string) => Promise<void>;

  clearError: () => void;
};

export const useOrderStore = create<State & Actions>((set, get) => ({
  orders: [],
  total: 0,
  page: 1,
  limit: 10,

  search: '',
  status: 'all',
  paymentMethod: 'all',
  sort: 'createdAt:desc',

  isCreating: false,
  isLoading: false,
  isDeleting: false,
  error: null,

  customers: [],
  products: [],
  isLoadingCustomers: false,
  isLoadingProducts: false,

  clearError: () => set({ error: null }),

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit, search, status, paymentMethod, sort } = get();

      const params: OrderListParams = {
        page,
        limit,
        search: search || undefined,
        status: status !== 'all' ? status : undefined,
        paymentMethod: paymentMethod !== 'all' ? paymentMethod : undefined,
        sortBy: sort.split(':')[0],
        sortOrder: sort.split(':')[1] as 'asc' | 'desc',
      };

      const result = await orderRepository.getAllOrders(params);
      set({
        orders: Array.isArray(result.items) ? result.items : [],
        total: result.pagination.total ?? 0,
        page: result.pagination.page ?? page,
        limit: result.pagination.limit ?? limit,
        isLoading: false,
      });
    } catch (error: unknown) {
      let msg = 'Failed to fetch orders';
      if (typeof error === 'object' && error !== null) {
        const e = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        msg = e.response?.data?.message || e.message || msg;
      }
      set({
        error: msg,
        isLoading: false,
      });
    }
  },

  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchOrders();
  },

  setPage: (page) => {
    set({ page });
    get().fetchOrders();
  },

  setLimit: (limit) => {
    set({ limit, page: 1 });
    get().fetchOrders();
  },

  setStatus: (status) => {
    set({ status, page: 1 });
    get().fetchOrders();
  },

  setPaymentMethod: (paymentMethod) => {
    set({ paymentMethod, page: 1 });
    get().fetchOrders();
  },

  setSort: (sort) => {
    set({ sort, page: 1 });
    get().fetchOrders();
  },

  createOrder: async (payload: OrderPayload) => {
    set({ isCreating: true, error: null });
    try {
      const newOrder = await orderRepository.create(payload);
      await get().fetchOrders();
      return newOrder;
    } catch (error: unknown) {
      let msg = 'Failed to create order';
      if (typeof error === 'object' && error !== null) {
        const e = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        msg = e.response?.data?.message || e.message || msg;
      }
      set({ error: msg });
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },

  updateOrder: async (id: string, payload) => {
    set({ isCreating: true, error: null });
    try {
      const updatedOrder = await orderRepository.update(id, payload);
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        ),
      }));
      return updatedOrder;
    } catch (error: unknown) {
      let msg = 'Failed to update order';
      if (typeof error === 'object' && error !== null) {
        const e = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        msg = e.response?.data?.message || e.message || msg;
      }
      set({ error: msg });
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },

  deleteOrder: async (id: string) => {
    set({ isDeleting: true, error: null });
    try {
      await orderRepository.softDelete(id);
      await get().fetchOrders(); // Refresh list
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  },

  // Autocomplete actions
  fetchCustomers: async (search?: string) => {
    set({ isLoadingCustomers: true });
    try {
      const customers =
        await orderRepository.getCustomersForAutocomplete(search);
      set({ customers, isLoadingCustomers: false });
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      set({ isLoadingCustomers: false });
    }
  },

  fetchProducts: async (search?: string) => {
    set({ isLoadingProducts: true });
    try {
      const products = await orderRepository.getProductsForOrder(search);
      set({ products, isLoadingProducts: false });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ isLoadingProducts: false });
    }
  },
}));

export default useOrderStore;
