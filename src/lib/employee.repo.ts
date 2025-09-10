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
