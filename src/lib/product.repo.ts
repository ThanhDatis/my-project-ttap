import { BaseRepository } from './base.repository';

export interface Product {
  // product: Product;
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku?: string;
  category: string;
  // status?: 'active' | 'inactive' | 'out_of_stock';
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}
export interface ProductResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ProductParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sku?: string;
  // status?: 'active' | 'inactive' | 'out_of_stock';
  images?: string[];
}
class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('/products');
  }

  async getAllProducts(params?: ProductParams): Promise<ProductResponse> {
    try {
      const res = await this.axiosInstance.get(this.endpoint, { params });
      if (!res.data || !Array.isArray(res.data.products)) {
        console.error('Invalid response data:', res.data);
        throw new Error('Invalid response from server');
      }
      return {
        products: res.data.products || [],
        pagination: res.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: res.data.products.length,
          itemsPerPage: res.data.products.length,
        },
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async createProduct(
    data: CreateProductData,
  ): Promise<{ product: Product; message: string }> {
    try {
      const res = await this.axiosInstance.post(this.endpoint, data);
      return res.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(
    id: string | number,
    data: Partial<Product>,
  ): Promise<{ product: Product; message: string }> {
    try {
      const res = await this.axiosInstance.put(`${this.endpoint}/${id}`, data);
      return res.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(
    id: string | number,
  ): Promise<{ message: string; product: { id: string; name: string } }> {
    try {
      const res = await this.axiosInstance.delete(`${this.endpoint}/${id}`);
      return res.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async getCategories(): Promise<{ categories: string[] }> {
    try {
      const res = await this.axiosInstance.get(`${this.endpoint}/categories`);
      return res.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}

export const productRepository = new ProductRepository();
