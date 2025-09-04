import axiosInstance from './axios';

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  images?: string[];
  category: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  } | null;
};
export type ProductsListPayload = {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  category?: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

class ProductRepository {
  async getAllProducts(params: PaginationParams): Promise<ProductsListPayload> {
    const res = await axiosInstance.get('/products', { params });
    const api = res.data as ApiEnvelope<ProductsListPayload>;
    if (!api.success || !api.data || !Array.isArray(api.data.items)) {
      console.error('Invalid response data:', api?.data);
      throw new Error('Invalid response from server');
    }
    return api.data;
  }

  async getById(id: string): Promise<Product> {
    const res = await axiosInstance.get(`/products/${id}`);
    const api = res.data as ApiEnvelope<Product>;
    if (!api.success || !api.data) {
      console.error('Invalid response data:', api?.data);
      throw new Error(api?.message || 'Invalid response from server');
    }
    return api.data;
  }

  async create(
    payload: Omit<
      Product,
      'id' | 'isActive' | 'createdAt' | 'createdBy' | 'updatedAt'
    >,
  ): Promise<{ product: Product }> {
    const res = await axiosInstance.post('/products', payload);
    const api = res.data as ApiEnvelope<{ product: Product }>;
    if (!api?.success || !api.data) {
      console.error('Invalid response data:', api?.data);
      throw new Error(api?.message || 'Invalid response from server');
    }
    return api.data;
  }

  async update(
    id: string,
    payload: Partial<Product>,
  ): Promise<{ product: Product }> {
    const res = await axiosInstance.put(`/products/${id}`, payload);
    const api = res.data as ApiEnvelope<{ product: Product }>;
    if (!api?.success || !api.data) {
      console.error('Invalid response data:', api?.data);
      throw new Error(api?.message || 'Invalid response from server');
    }
    return api.data;
  }

  async softDelete(id: string): Promise<{ id: string; name: string }> {
    const res = await axiosInstance.delete(`/products/${id}`);
    const api = res.data as ApiEnvelope<{ id: string; name: string }>;
    if (!api?.success || !api.data) {
      console.error('Invalid response data:', api?.data);
      throw new Error(api?.message || 'Invalid response from server');
    }
    return api.data;
  }

  async getCategories(): Promise<string[]> {
    const res = await axiosInstance.get(`/products/categories`);
    const api = res.data as ApiEnvelope<{ categories: string[] }>;
    if (!api?.success || !api.data?.categories) {
      console.error('Invalid response data:', api?.data);
      throw new Error('Invalid response from server');
    }
    return api.data.categories;
  }
}

export const productRepository = new ProductRepository();
export default productRepository;
