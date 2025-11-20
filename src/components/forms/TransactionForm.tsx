import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { TransactionType } from '@/types';
import { useCreateTransaction } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/utils/cn';

const schema = z.object({
  type: z.enum(['income', 'expense'] as const),
  amount: z.string().min(1, 'Valor é obrigatório'),
  category: z.string().min(1, 'Selecione uma categoria'),
  description: z.string().min(3, 'Descrição deve ter no mínimo 3 caracteres'),
  date: z.string().min(1, 'Selecione uma data'),
});

type FormData = z.infer<typeof schema>;

interface TransactionFormProps {
  onSuccess?: () => void;
}

export const TransactionForm = ({ onSuccess }: TransactionFormProps) => {
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.EXPENSE);
  const { mutate: createTransaction, isPending } = useCreateTransaction();
  const { data: categories, isLoading: categoriesLoading } = useCategories(transactionType);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: TransactionType.EXPENSE,
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const handleTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    setValue('type', type);
    setValue('category', ''); // Reset category when type changes
  };

  // Format currency input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value === '') {
      setValue('amount', '');
      return;
    }

    // Convert to number and divide by 100 to get decimal
    const numberValue = parseInt(value) / 100;

    // Format as Brazilian currency
    const formatted = numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setValue('amount', formatted);
  };

  const onSubmit = (data: FormData) => {
    // Convert formatted amount back to number
    const amount = parseFloat(data.amount.replace(/\./g, '').replace(',', '.'));

    createTransaction(
      {
        type: data.type as TransactionType,
        amount,
        categoryId: data.category,
        description: data.description,
        date: data.date,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  // Map categories to Select options
  const categoryOptions = categories?.map((cat) => ({
    value: cat.id,
    label: `${cat.icon} ${cat.name}`,
  })) || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Type Toggle */}
      <div>
        <label className="mb-2 block text-sm font-medium text-secondary-700">
          Tipo de Transação
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleTypeChange(TransactionType.INCOME)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-medium transition-all',
              transactionType === TransactionType.INCOME
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-secondary-300 bg-white text-secondary-700 hover:border-green-300',
            )}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
            Receita
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange(TransactionType.EXPENSE)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-medium transition-all',
              transactionType === TransactionType.EXPENSE
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-secondary-300 bg-white text-secondary-700 hover:border-red-300',
            )}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 13l-5 5m0 0l-5-5m5 5V6"
              />
            </svg>
            Despesa
          </button>
        </div>
        <input type="hidden" {...register('type')} />
      </div>

      {/* Amount */}
      <div>
        <label className="mb-1 block text-sm font-medium text-secondary-700">Valor</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-600">R$</span>
          <input
            type="text"
            placeholder="0,00"
            {...register('amount')}
            onChange={handleAmountChange}
            className={cn(
              'w-full rounded-lg border border-secondary-300 py-2 pl-12 pr-4 text-secondary-900 transition-colors',
              'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50',
              errors.amount && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            )}
          />
        </div>
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
      </div>

      {/* Category */}
      <Select
        label="Categoria"
        {...register('category')}
        options={categoryOptions}
        error={errors.category?.message}
        disabled={categoriesLoading}
      />

      {/* Description */}
      <Textarea
        label="Descrição"
        {...register('description')}
        placeholder="Ex: Compras no supermercado, Salário do mês..."
        error={errors.description?.message}
        rows={3}
      />

      {/* Date */}
      <Input
        label="Data"
        type="date"
        {...register('date')}
        error={errors.date?.message}
      />

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1" isLoading={isPending}>
          Criar Transação
        </Button>
      </div>
    </form>
  );
};
