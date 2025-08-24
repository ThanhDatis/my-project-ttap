import { BaseRepository } from './base.repository';

export interface Order {
  id: number;
  productId: number;
  quantity: number;
}

class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super('/orders');
  }
}

export const orderRepository = new OrderRepository();
