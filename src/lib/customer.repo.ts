import axiosInstance from './axios';
import { BaseRepository } from './base.repository';
import { Customer } from './customer.repo';
export type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  tier: Tier;
  order: number;
  lifetimeValue?: number;
  status: CustomerStatus;
  createdAt: string;
  updatedAt?: string;
};

export interface CustomerPayload {
  name: string;
  email: string;
  phone?: string;
  tier: Tier;
  status: CustomerStatus;
}

export interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  tier?: 'all' | Tier;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

const base = '/api/customers';

class CustomerRepository extends BaseRepository<Customer> {
  constructor() {
    super('/customers');
  }
}

export const customerRepository = new CustomerRepository();
