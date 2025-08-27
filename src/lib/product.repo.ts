import { BaseRepository } from './base.repository';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  category: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('/products');
  }
}

export const productRepository = new ProductRepository();
