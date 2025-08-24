import { BaseRepository } from './base.repository';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

class CustomerRepository extends BaseRepository<Customer> {
  constructor() {
    super('/customers');
  }
}

export const customerRepository = new CustomerRepository();
