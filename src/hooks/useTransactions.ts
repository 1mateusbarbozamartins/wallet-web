import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService, CreateTransactionData, UpdateTransactionData } from '@/services/transactionService';
import type { TransactionFilters } from '@/types';
import toast from 'react-hot-toast';

export const useTransactions = (filters?: TransactionFilters) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionService.getAll(filters),
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionData) => transactionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      toast.success('Transação criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar transação');
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionData }) =>
      transactionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      toast.success('Transação atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar transação');
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      toast.success('Transação deletada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao deletar transação');
    },
  });
};

export const useBalance = () => {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => transactionService.getBalance(),
  });
};

export const useSummary = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['summary', startDate, endDate],
    queryFn: () => transactionService.getSummary(startDate, endDate),
  });
};
