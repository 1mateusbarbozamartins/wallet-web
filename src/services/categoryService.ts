import { api } from './api';
import type { Category, CreateCategoryData, UpdateCategoryData, ApiResponse } from '@/types';

export const categoryService = {
  async getAll(type?: 'income' | 'expense'): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>('/categories', {
      params: { type },
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  },

  async create(data: CreateCategoryData): Promise<Category> {
    const response = await api.post<ApiResponse<Category>>('/categories', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },

  async deactivate(id: string): Promise<void> {
    await api.patch(`/categories/${id}/deactivate`);
  },

  async activate(id: string): Promise<void> {
    await api.patch(`/categories/${id}/activate`);
  },

  async reorder(categoryIds: string[]): Promise<void> {
    await api.put('/categories/reorder', { categoryIds });
  },
};
