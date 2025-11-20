import { api } from './api';
import type {
  Transaction,
  TransactionType,
  TransactionFilters,
  TransactionSummary,
  ApiResponse,
} from '@/types';

export interface CreateTransactionData {
  amount: number;
  type: TransactionType;
  categoryId: string;
  description: string;
  date: string;
}

export interface UpdateTransactionData {
  amount?: number;
  type?: TransactionType;
  categoryId?: string;
  description?: string;
  date?: string;
}

export const transactionService = {
  async getAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const response = await api.get<ApiResponse<Transaction[]>>('/transactions', {
      params: filters,
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Transaction> {
    const response = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return response.data.data;
  },

  async create(data: CreateTransactionData): Promise<Transaction> {
    const response = await api.post<ApiResponse<Transaction>>('/transactions', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateTransactionData): Promise<Transaction> {
    const response = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },

  async getBalance(): Promise<{ balance: number }> {
    const response = await api.get<ApiResponse<{ balance: number }>>('/transactions/balance');
    return response.data.data;
  },

  async getSummary(startDate?: string, endDate?: string): Promise<TransactionSummary> {
    const response = await api.get<ApiResponse<TransactionSummary>>('/transactions/summary', {
      params: { startDate, endDate },
    });
    return response.data.data;
  },
};
