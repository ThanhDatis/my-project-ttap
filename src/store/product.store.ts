/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { productRepository, type Product } from './../lib/product.repo';

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'active' | 'inactive' | 'all';
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  categories: string[];

  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;

  filters: ProductFilters;
  pagination: ProductPagination;
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  setFilters: (filters: Partial<ProductFilters>) => void;
  setPagination: (page: number, limit?: number) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  setSelectedProduct: (product: Product | null) => void;
  clearError: () => void;
  clearFilters: () => void;
}

const initialFilters: ProductFilters = {
  search: '',
  category: 'all',
  status: 'all',
};

const initialPagination: ProductPagination = {
  page: 0,
  limit: 10,
  total: 0,
  totalPages: 0,
};

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      selectedProduct: null,
      categories: [],
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
      filters: initialFilters,
      pagination: initialPagination,
      sortBy: 'createAt',
      sortOrder: 'desc',

      fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          const { filters, pagination, sortBy, sortOrder } = get();

          const params = {
            page: pagination.page + 1,
            limit: pagination.limit,
            search: filters.search || undefined,
            category: filters.category === 'all' ? undefined : filters.category,
            sortBy,
            sortOrder,
            // ...filters,
          };

          const response = await productRepository.getAll(params);
          // Đảm bảo response.products là array
          set({
            products: Array.isArray(response.products) ? response.products : [],
          });
          set({
            pagination: {
              ...pagination,
              total: response.products.length,
              totalPages: 1,
            },
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Failed to fetch products',
            isLoading: false,
          });
        }
      },
      fetchProductById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const product = await productRepository.getById(id);
          set({
            selectedProduct: product,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Failed to fetch product',
            isLoading: false,
          });
        }
      },
      createProduct: async (productData: Omit<Product, 'id'>) => {
        set({ isCreating: true, error: null });
        try {
          const newProduct = await productRepository.create(productData);
          set((state) => ({
            products: [newProduct.product, ...state.products],
            isCreating: false,
          }));
          await get().fetchProducts();
        } catch (error: any) {
          set({
            error: error.message || 'Failed to create product',
            isCreating: false,
          });
          throw error;
        }
      },
      updateProduct: async (id: string, productData: Partial<Product>) => {
        set({ isUpdating: true, error: null });
        try {
          const updatedProduct = await productRepository.update(
            id,
            productData,
          );
          set((state) => ({
            products: state.products.map((product) =>
              product.id === updatedProduct.id ? updatedProduct : product,
            ),
            selectedProduct: updatedProduct.product,
            isUpdating: false,
          }));
        } catch (error: any) {
          set({
            error: error.message || 'Failed to update product',
            isUpdating: false,
          });
          throw error;
        }
      },
      deleteProduct: async (id: string) => {
        set({ isDeleting: true, error: null });
        try {
          await productRepository.delete(id);
          set((state) => ({
            products: state.products.filter((p) => String(p.id) !== id),
            selectedProduct:
              String(state.selectedProduct?.id) === id
                ? null
                : state.selectedProduct,
            isDeleting: false,
          }));
          await get().fetchProducts();
        } catch (error: any) {
          set({
            error: error.message || 'Failed to delete product',
            isDeleting: false,
          });
          throw error;
        }
      },
      setFilters: (newFilters: Partial<ProductFilters>) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...newFilters,
          },
          pagination: {
            ...state.pagination,
            page: 0,
          },
        }));
        setTimeout(() => get().fetchProducts(), 0);
      },
      setPagination: (page: number, limit?: number) => {
        set((state) => ({
          pagination: {
            ...state.pagination,
            page,
            limit: limit || state.pagination.limit,
          },
        }));
        setTimeout(() => get().fetchProducts(), 0);
      },
      setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => {
        set({ sortBy, sortOrder });
        setTimeout(() => get().fetchProducts(), 0);
      },
      setSelectedProduct: (product: Product | null) => {
        set({ selectedProduct: product });
      },
      clearError: () => {
        set({ error: null });
      },
      clearFilters: () => {
        set({
          filters: initialFilters,
          pagination: {
            ...initialPagination,
            limit: get().pagination.limit,
          },
        });
        setTimeout(() => get().fetchProducts(), 0);
      },
    }),
    {
      name: 'product-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // products: state.products,
        // selectedProduct: state.selectedProduct,
        // categories: state.categories,
        filters: state.filters,
        pagination: {
          ...state.pagination,
          total: 0,
          totalPages: 0,
        },
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    },
  ),
);
