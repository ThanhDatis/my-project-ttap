import axiosInstance from './axios';

export type Tier = 'vip' | 'normal';
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tier: Tier;
  totalOrders: number;
  lifetimeValue: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CustomerPayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  tier?: Tier;
  totalOrders?: number;
  lifetimeValue?: number;
  isActive?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  tier?: 'all' | Tier;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type CustomerListPayload = {
  items: Customer[];
  pagination: Pagination;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const base = '/customers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractCustomer(raw: any): Customer | null {
  if (!raw) return null;
  const d = raw.data ?? raw;
  const cand =
    d?.customer ?? d?.item ?? d?.data ?? raw.customer ?? raw.item ?? raw;
  if (cand && typeof cand === 'object' && (cand.id ?? cand._id)) {
    const id = (cand.id ?? cand._id)?.toString() ?? String(cand.id ?? cand._id);
    return { ...cand, id } as Customer;
  }
  return null;
}

function sanitizePayload(p: CustomerPayload): CustomerPayload {
  const out: CustomerPayload = {};
  if (p.name?.trim()) out.name = p.name.trim();
  if (p.email?.trim()) out.email = p.email.trim();
  if (p.phone?.trim()) out.phone = p.phone.trim();
  if (p.address?.trim()) out.address = p.address.trim();
  if (p.tier) out.tier = p.tier;
  if (typeof p.totalOrders === 'number') out.totalOrders = p.totalOrders;
  if (typeof p.lifetimeValue === 'number') out.lifetimeValue = p.lifetimeValue;
  if (typeof p.isActive === 'boolean') out.isActive = p.isActive;
  return out;
}
class CustomerRepository {
  async getAllCustomers(params: ListParams): Promise<CustomerListPayload> {
    const res = await axiosInstance.get(`${base}`, { params });
    const raw = res?.data;

    if (
      raw &&
      raw.data &&
      typeof raw.data === 'object' &&
      Array.isArray(raw.data.items)
    ) {
      const { items, pagination } = raw.data as {
        items: Customer[];
        pagination?: Partial<Pagination>;
      };
      return {
        items,
        pagination: {
          page: pagination?.page ?? params.page ?? 1,
          limit: pagination?.limit ?? params.limit ?? 10,
          total: pagination?.total ?? 0,
          totalPages: pagination?.totalPages ?? 0,
          hasNextPage: pagination?.hasNextPage ?? undefined,
          hasPreviousPage: pagination?.hasPreviousPage ?? undefined,
        },
      };
    }

    if (
      raw &&
      typeof raw === 'object' &&
      Array.isArray(raw.items) &&
      raw.pagination
    ) {
      const pg = raw.pagination as Partial<Pagination>;
      return {
        items: raw.items as Customer[],
        pagination: {
          page: pg.page ?? params.page ?? 1,
          limit: pg.limit ?? params.limit ?? 10,
          total: pg.total ?? 0,
          totalPages: pg.totalPages ?? 0,
          hasNextPage: pg.hasNextPage ?? undefined,
          hasPreviousPage: pg.hasPreviousPage ?? undefined,
        },
      };
    }

    if (raw && typeof raw === 'object' && Array.isArray(raw.items)) {
      const total = Number(raw.total ?? 0);
      const limit = Number(raw.limit ?? params.limit ?? 10);
      const page = Number(raw.page ?? params.page ?? 1);
      const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

      return {
        items: raw.items as Customer[],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: undefined,
          hasPreviousPage: undefined,
        },
      };
    }

    console.error('getAllCustomers: unexpected response shape', raw);
    throw new Error('Invalid response from server');
  }

  async getById(id: string): Promise<Customer> {
    const res = await axiosInstance.get(`${base}/${id}`);
    const raw = res?.data;
    const customer = extractCustomer(raw);
    if (!customer || !customer.id) {
      console.error('Invalid response data:', raw);
      throw new Error('Invalid response from server');
    }
    return customer;
  }

  async create(payload: CustomerPayload): Promise<Customer> {
    try {
      const res = await axiosInstance.post(base, sanitizePayload(payload));
      const raw = res?.data;
      const customer = extractCustomer(raw);
      if (!customer) {
        console.error('create: unexpected response shape', raw);
        throw new Error('Failed to create customer');
      }
      return customer;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Failed to create customer';

      console.error('create error:', e?.response?.data ?? e);
      throw new Error(msg);
    }
  }

  async update(id: string, payload: CustomerPayload): Promise<Customer> {
    try {
      const res = await axiosInstance.put(
        `${base}/${id}`,
        sanitizePayload(payload),
      );
      const raw = res?.data;
      const customer = extractCustomer(raw);
      if (!customer) {
        console.error('update: unexpected response shape', raw);
        throw new Error('Failed to update customer');
      }
      return customer;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Failed to update customer';
      console.error('update error:', e?.response?.data ?? e);
      throw new Error(msg);
    }
  }

  async softDelete(id: string): Promise<void> {
    const res = await axiosInstance.delete(`${base}/${id}`);
    const raw = res?.data as
      | ApiEnvelope<unknown>
      | { success?: boolean; message?: string }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | any;
    if (
      raw &&
      typeof raw === 'object' &&
      'success' in raw &&
      raw.success === false
    ) {
      console.error('Invalid response data:', raw?.data);
      throw new Error(raw?.message || 'Invalid response from server');
    }
    // return raw.data;
  }
}

export const customerRepository = new CustomerRepository();
export default customerRepository;
