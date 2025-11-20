import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  useCreateCategory,
  useUpdateCategory,
  useDeactivateCategory,
  useActivateCategory,
  useDeleteCategory,
} from '@/hooks/useCategories';
import type { Category } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(50, 'Nome deve ter no máximo 50 caracteres'),
  type: z.enum(['income', 'expense'] as const),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  icon: z.string().min(1, 'Selecione um ícone'),
});

type FormData = z.infer<typeof schema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

const EMOJI_OPTIONS = [
  '💰', '💵', '💴', '💶', '💷', '💸', '💳', '💼', '🏦',
  '🍔', '🍕', '🍱', '🍜', '🍺', '☕', '🛒', '🍎',
  '🚗', '🚕', '🚌', '🚎', '🚙', '🚐', '✈️', '🚆',
  '🏥', '💊', '🩺', '⚕️',
  '📚', '🎓', '📖', '✏️', '🖊️',
  '🎮', '🎬', '🎵', '🎸', '🎨', '⚽', '🏀',
  '🏠', '🔌', '💡', '🌐', '📱', '💻',
  '👕', '👔', '👗', '👠', '🛍️',
  '🎁', '🎉', '🎊', '❤️',
  '📂', '📁', '📋', '📌', '📍',
];

const COLOR_OPTIONS = [
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e', '#ef4444',
  '#f97316', '#f59e0b', '#eab308', '#84cc16',
];

export const CategoryModal = ({ isOpen, onClose, category }: CategoryModalProps) => {
  const isEditing = !!category;
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deactivateCategory, isPending: isDeactivating } = useDeactivateCategory();
  const { mutate: activateCategory, isPending: isActivating } = useActivateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      type: 'expense',
      color: '#6b7280',
      icon: '📂',
    },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
      });
    } else {
      reset({
        name: '',
        type: 'expense',
        color: '#6b7280',
        icon: '📂',
      });
    }
  }, [category, reset]);

  const onSubmit = (data: FormData) => {
    if (isEditing) {
      updateCategory(
        { id: category.id, data },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      createCategory(data, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const handleToggleActive = () => {
    if (!category) return;

    if (category.isActive) {
      deactivateCategory(category.id, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      activateCategory(category.id, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const handleDelete = () => {
    if (!category) return;
    if (!confirm('Tem certeza que deseja deletar esta categoria? Esta ação não pode ser desfeita.')) return;

    deleteCategory(category.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isPending = isCreating || isUpdating || isDeactivating || isActivating || isDeleting;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-secondary-900">
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
            disabled={isPending}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <Input label="Nome" {...register('name')} error={errors.name?.message} />

          {/* Type */}
          <Select
            label="Tipo"
            {...register('type')}
            options={[
              { value: 'income', label: 'Receita' },
              { value: 'expense', label: 'Despesa' },
            ]}
            error={errors.type?.message}
            disabled={isEditing}
          />

          {/* Icon */}
          <div>
            <label className="mb-2 block text-sm font-medium text-secondary-700">Ícone</label>
            <div className="grid grid-cols-9 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setValue('icon', emoji)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 text-xl transition-all hover:scale-110 ${
                    selectedIcon === emoji
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-300 bg-white hover:border-primary-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>}
          </div>

          {/* Color */}
          <div>
            <label className="mb-2 block text-sm font-medium text-secondary-700">Cor</label>
            <div className="grid grid-cols-8 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className={`h-10 w-10 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedColor === color ? 'border-secondary-900 ring-2 ring-secondary-300' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1" disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" isLoading={isCreating || isUpdating}>
                {isEditing ? 'Salvar' : 'Criar'}
              </Button>
            </div>

            {isEditing && !category.isDefault && (
              <div className="flex gap-3 border-t border-secondary-200 pt-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleToggleActive}
                  className="flex-1"
                  isLoading={isDeactivating || isActivating}
                >
                  {category.isActive ? 'Desativar' : 'Ativar'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDelete}
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  isLoading={isDeleting}
                >
                  Deletar
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
