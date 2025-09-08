export type Role = 'admin' | 'manager' | 'staff';
export type EmployeeStatus = 'active' | 'inactive' | 'suspended';

export interface Employee {
  id: string;
  name: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  address?: string;
  role: Role;
  status: EmployeeStatus;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface EmployeeCreatePayload {
  name: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  address?: string;
  role: Role;
  status?: EmployeeStatus;
}
