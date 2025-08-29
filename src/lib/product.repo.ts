import { BaseRepository } from './base.repository';

export interface Product {
  product: Product;
  id: number | string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku?: string;
  category: string;
  status?: 'active' | 'inactive' | 'out_of_stock';
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
  product: Product[];
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
class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('/products');
  }

  async getAllProducts(
    params?: ProductParams,
  ): Promise<ProductResponse | null> {
    const res = await this.axiosInstance.get(this.endpoint, { params });
    return res.data;
  }

  async getCategories(): Promise<{ category: string[] }> {
    const res = await this.axiosInstance.get(`${this.endpoint}/categories`);
    return res.data;
  }
}

export const productRepository = new ProductRepository();
