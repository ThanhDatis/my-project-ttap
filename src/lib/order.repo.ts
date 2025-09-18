/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axios';
import type { Pagination } from './base.repository';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
export type PaymentMethod =
  | 'cash'
  | 'credit_card'
  | 'bank_transfer'
  | 'e_wallet';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface ShippingAddress {
  street: string;
  ward: string;
  district: string;
  city: string;
  note?: string;
}
export interface Order {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  // tax?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  // notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface OrderPayload {
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress: ShippingAddress;
  subtotal: number;
  total: number;
  items: Omit<OrderItem, 'id' | 'lineTotal'>[];
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus | 'all';
  paymentMethod?: PaymentMethod | 'all';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderListPayload {
  items: Order[];
  pagination: Pagination;
}

export interface CustomerAutocomplete {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
  };
}

export interface ProductForOrder {
  _id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  items?: T;
  item?: T;
};

const base = '/orders';

function extractOrder(raw: any): Order | null {
  if (!raw) return null;
  const d = raw.data ?? raw;
  const cand = d?.order ?? d?.item ?? d?.data ?? raw.order ?? raw.item ?? raw;
  if (cand && typeof cand === 'object' && (cand.id ?? cand._id)) {
    const id = (cand.id ?? cand._id)?.toString() ?? String(cand.id ?? cand._id);
    return { ...cand, id } as Order;
  }
  return null;
}

function sanitizePayload(p: OrderPayload): OrderPayload {
  const out: OrderPayload = {
    orderId: p.orderId.trim(),
    customerId: p.customerId,
    customerName: p.customerName.trim(),
    paymentMethod: p.paymentMethod,
    shippingAddress: {
      street: p.shippingAddress.street.trim(),
      ward: p.shippingAddress.ward.trim(),
      district: p.shippingAddress.district.trim(),
      city: p.shippingAddress.city.trim(),
      note: p.shippingAddress.note?.trim() || '',
    },
    subtotal: Number(p.subtotal),
    total: Number(p.total),
    items: p.items.map((item) => ({
      productId: item.productId,
      productName: item.productName.trim(),
      sku: item.sku.trim(),
      quantity: Number(item.quantity),
      price: Number(item.price),
    })),
  };

  if (p.customerEmail?.trim()) out.customerEmail = p.customerEmail.trim();
  if (p.customerPhone?.trim()) out.customerPhone = p.customerPhone.trim();
  if (p.notes?.trim()) out.notes = p.notes.trim();

  return out;
}

class OrderRepository {
  async getAllOrders(params: OrderListParams): Promise<OrderListPayload> {
    const res = await axiosInstance.get(`${base}`, { params });
    const raw = res?.data;

    if (raw?.items && Array.isArray(raw.items)) {
      const pagination: Pagination = {
        total: raw.total ?? 0,
        page: raw.page ?? params.page ?? 1,
        limit: raw.limit ?? params.limit ?? 10,
        totalPages: raw.totalPages ?? 0,
        hasNextPage: raw.hasNextPage,
        hasPreviousPage: raw.hasPrevPage,
      };
      return { items: raw.items as Order[], pagination };
    }
    console.error('getAllOrders: unexpected response shape', raw);
    throw new Error('Failed to fetch orders');
  }

  async getById(id: string): Promise<Order> {
    const res = await axiosInstance.get(`${base}/${id}`);
    const order = extractOrder(res?.data);
    if (!order || !order.id) {
      console.error('Invalid response data:', res?.data);
      throw new Error('Invalid response from server');
    }
    return order;
  }

  async create(payload: OrderPayload): Promise<Order> {
    // console.log('Creating order with payload:', payload);
    try {
      const res = await axiosInstance.post(base, sanitizePayload(payload));
      const order = extractOrder(res?.data);
      if (!order) {
        console.error('create: unexpected response shape', res?.data);
        throw new Error('Failed to create order');
      }
      return order;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to create order';
      console.error('Error creating order:', error?.response?.data || error);
      throw new Error(msg);
    }
  }

  async update(
    id: string,
    payload: Partial<Pick<Order, 'status' | 'paymentStatus'>>,
  ): Promise<Order> {
    try {
      const res = await axiosInstance.put(`${base}/${id}`, payload);
      const order = extractOrder(res?.data);
      if (!order) {
        console.error('update: unexpected response shape', res?.data);
        throw new Error('Failed to update order');
      }
      return order;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        error?.message ??
        'Failed to update order';
      console.error('Error updating order:', error?.response?.data || error);
      throw new Error(msg);
    }
  }

  async softDelete(id: string): Promise<void> {
    const res = await axiosInstance.delete(`${base}/${id}`);
    const raw = res?.data as ApiEnvelope<unknown> | any;
    if (
      raw &&
      typeof raw === 'object' &&
      'success' in raw &&
      raw.success === false
    ) {
      console.error('Invalid response data:', raw?.data);
      throw new Error(raw?.message || 'Invalid response from server');
    }
  }

  async getCustomersForAutocomplete(
    search?: string,
  ): Promise<CustomerAutocomplete[]> {
    const res = await axiosInstance.get(`${base}/customers/autocomplete`, {
      params: { search },
    });
    return res.data.items || [];
  }

  async getProductsForOrder(search?: string): Promise<ProductForOrder[]> {
    const res = await axiosInstance.get(`${base}/products`, {
      params: { search },
    });
    return res.data.items || [];
  }
}

export const orderRepository = new OrderRepository();
export default orderRepository;
