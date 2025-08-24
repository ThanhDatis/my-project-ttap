/* eslint-disable @typescript-eslint/no-explicit-any */
// import { create } from 'zustand';
import axiosInstance from './axios';

export class BaseRepository<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll<P = any>(params?: P): Promise<T[]> {
    const res = await axiosInstance.get(this.endpoint, { params });
    return res.data;
  }

  async getById(id: string | number): Promise<T> {
    const res = await axiosInstance.get(`${this.endpoint}/${id}`);
    return res.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const res = await axiosInstance.post(this.endpoint, data);
    return res.data;
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    const res = await axiosInstance.put(`${this.endpoint}/${id}`, data);
    return res.data;
  }

  async delete(id: string | number): Promise<void> {
    await axiosInstance.delete(`${this.endpoint}/${id}`);
  }
}
