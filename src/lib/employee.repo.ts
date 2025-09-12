/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axios';
import type { Pagination } from './base.repository';

export type Role = 'admin' | 'manager' | 'staff';
export type EmployeeStatus = 'active' | 'inactive' | 'suspended';
export type Gender = 'male' | 'female' | 'other';

export interface Employee {
  id: string;
  name: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  gender?: Gender;
  role: Role;

  address?: string;
  ward?: string;
  district?: string;
  city?: string;

  status: EmployeeStatus;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface EmployeeListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role | 'all';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: EmployeeStatus | 'all';
}
export interface EmployeePayload {
  name: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  gender?: Gender;
  role: Role;

  address?: string;
  ward?: string;
  district?: string;
  city?: string;

  status?: EmployeeStatus;
}

export interface EmployeeListPayload {
  items: Employee[];
  pagination: Pagination;
}

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const base = '/employees';

function extractEmployee(raw: any): Employee | null {
  if (!raw) return null;
  const d = raw.data ?? raw;
  const cand =
    d?.employee ?? d?.item ?? d?.data ?? raw.employee ?? raw.item ?? raw;
  if (cand && typeof cand === 'object' && (cand.id ?? cand._id)) {
    const id = (cand.id ?? cand._id)?.toString() ?? String(cand.id ?? cand._id);
    return { ...cand, id } as Employee;
  }
  return null;
}

function sanitizePayload(
  p: Partial<EmployeePayload>,
): Partial<EmployeePayload> {
  const out: Partial<EmployeePayload> = {};
  if (p.name) out.name = p.name.trim();
  if (p.role) out.role = p.role;
  if (p.email?.trim()) out.email = p.email.trim();
  if (p.phone?.trim()) out.phone = p.phone.trim();
  if (p.dateOfBirth?.trim()) out.dateOfBirth = p.dateOfBirth.trim();
  if (p.gender) out.gender = p.gender;
  if (p.address?.trim()) out.address = p.address.trim();
  if (p.ward?.trim()) out.ward = p.ward.trim();
  if (p.district?.trim()) out.district = p.district.trim();
  if (p.city?.trim()) out.city = p.city.trim();
  if (p.status) out.status = p.status;

  return out;
}

class EmployeeRepository {
  async getAllEmployees(
    params: EmployeeListParams,
  ): Promise<EmployeeListPayload> {
    const res = await axiosInstance.get(`${base}`, { params });
    const raw = res?.data;

    if (raw?.items && Array.isArray(raw.items)) {
      const pagination: Pagination = {
        total: raw.total ?? raw.pagination?.total ?? 0,
        page: raw.page ?? raw.pagination?.page ?? params.page ?? 1,
        limit: raw.limit ?? raw.pagination?.limit ?? params.limit ?? 10,
        totalPages: raw.totalPages ?? raw.pagination?.totalPages ?? 0,
        hasNextPage: raw.hasNextPage ?? raw.pagination?.hasNextPage,
        hasPreviousPage: raw.hasPreviousPage ?? raw.pagination?.hasPreviousPage,
      };
      return { items: raw.items as Employee[], pagination };
    }
    console.error('getAllEmployees: unexpected response shape', raw);
    throw new Error('Failed to fetch employees');
  }

  async getById(id: string): Promise<Employee> {
    const res = await axiosInstance.get(`${base}/${id}`);
    const emp = extractEmployee(res?.data);
    if (!emp || !emp.id) {
      console.error('Invalid response data:', res?.data);
      throw new Error('Invalid response from server');
    }
    return emp;
  }

  async create(payload: EmployeePayload): Promise<Employee> {
    try {
      const res = await axiosInstance.post(base, sanitizePayload(payload));
      const emp = extractEmployee(res?.data);
      if (!emp) {
        console.error('create: unexpected response shape', res?.data);
        throw new Error('Failed to create employee');
      }
      return emp;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to create employee';
      console.error('Error creating employee:', error?.response?.data || error);
      throw new Error(msg);
    }
  }

  async update(
    id: string,
    payload: Partial<EmployeePayload>,
  ): Promise<Employee> {
    try {
      const res = await axiosInstance.put(
        `${base}/${id}`,
        sanitizePayload(payload),
      );
      const emp = extractEmployee(res?.data);
      if (!emp) {
        console.error('update: unexpected response shape', res?.data);
        throw new Error('Failed to update employee');
      }
      return emp;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        error?.message ??
        'Failed to update employee';
      console.error('Error updating employee:', error?.response?.data || error);
      throw new Error(msg);
    }
  }

  async softDelete(id: string): Promise<void> {
    const res = await axiosInstance.delete(`${base}/${id}`);
    const raw = res?.data as
      | ApiEnvelope<unknown>
      | { success?: boolean; message?: string }
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
  }
}

export const employeeRepository = new EmployeeRepository();
export default employeeRepository;
