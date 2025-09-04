/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { create } from 'zustand';

import productRepository, {
  type Product,
  type PaginationParams,
  type ProductsListPayload,
} from './../lib/product.repo';

type PaginationState = ProductsListPayload['pagination'];

export type ProductFilters = {
  search?: string;
  category?: string;
  status?: 'all' | 'active' | 'inactive' | 'out_of_stock';
  minPrice?: number;
  maxPrice?: number;
};

type ProductStore = {
  products: Product[];
  pagination: PaginationState;

  isLoading: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  error: string | null;
  // isUpdating: boolean;

  params: Required<PaginationParams>;
  filters: ProductFilters;

  setParams: (p: Partial<PaginationParams>) => void;
  setPagination: (page: number, limit: number) => void;
  setSorting: (field: string, order: 'asc' | 'desc') => void;

  setFilters: (p: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  clearError: () => void;

  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<Product>;
  createProduct: (
    payload: Omit<
      Product,
      'id' | 'isActive' | 'createdAt' | 'updatedAt' | 'createdBy'
    >,
  ) => Promise<Product>;
  updateProduct: (id: string, payload: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;

  categories: string[];
  fetchCategories: () => Promise<void>;
};

const DEFAULT_PAGINATION: PaginationState = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const DEFAULT_PARAMS: Required<PaginationParams> = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  search: '',
  category: 'all',
};

const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  category: 'all',
  status: 'all',
  minPrice: undefined,
  maxPrice: undefined,
};

const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  pagination: DEFAULT_PAGINATION,

  isLoading: false,
  isCreating: false,
  isDeleting: false,
  error: null,

  params: DEFAULT_PARAMS,
  filters: DEFAULT_FILTERS,

  setParams: (p) =>
    set((state) => ({
      params: { ...state.params, ...p },
    })),
  setPagination: (page, limit) =>
    set((state) => ({
      params: { ...state.params, page, limit },
    })),

  setSorting: (field, sort) =>
    set((state) => ({
      params: { ...state.params, sortBy: field, sortOrder: sort },
    })),

  setFilters: (p) =>
    set((state) => ({
      filters: { ...state.filters, ...p },
      params: { ...state.params, page: 1 },
    })),

  clearFilters: () =>
    set((state) => ({
      filters: { ...DEFAULT_FILTERS },
      params: { ...state.params, page: 1, search: '', category: 'all' },
    })),

  clearError: () => set({ error: null }),

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { params } = get();
      const { items, pagination } =
        await productRepository.getAllProducts(params);
      set({
        products: items,
        pagination,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err?.message || 'Failed to fetch products',
      });
    }
  },

  getProductById: async (id: string) => {
    return productRepository.getById(id);
  },

  createProduct: async (payload) => {
    const created = await productRepository.create(payload);
    await get().fetchProducts();
    return created.product;
  },

  updateProduct: async (id, payload) => {
    const updated = await productRepository.update(id, payload);
    await get().fetchProducts();
    return updated.product;
  },

  deleteProduct: async (id: string) => {
    await productRepository.softDelete(id);
    await get().fetchProducts();
  },

  categories: [],
  fetchCategories: async () => {
    try {
      const categories = await productRepository.getCategories();
      set({ categories });
    } catch {
      // ignore nhẹ
    }
  },
}));

export default useProductStore;
