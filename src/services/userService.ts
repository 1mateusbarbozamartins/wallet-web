import { api } from './api';
import type { User, ApiResponse } from '@/types';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/users/profile');
    return response.data.data;
  },

  async updateProfile(data: { name?: string; cpf?: string }): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/users/profile', data);
    return response.data.data;
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/users/password', { currentPassword, newPassword });
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/users/account');
  },
};
