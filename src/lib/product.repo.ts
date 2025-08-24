import { BaseRepository } from './base.repository';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('/products');
  }
}

export const productRepository = new ProductRepository();
