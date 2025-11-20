import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { CategoryModal } from '@/components/modals/CategoryModal';
import { Category } from '@/types';

export const CategoriesPage = () => {
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [customFilter, setCustomFilter] = useState<'all' | 'custom' | 'default'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: incomeCategories, isLoading: incomeLoading } = useCategories('income');
  const { data: expenseCategories, isLoading: expenseLoading } = useCategories('expense');

  const isLoading = incomeLoading || expenseLoading;

  const allCategories = [...(incomeCategories || []), ...(expenseCategories || [])];

  // Apply type filter first
  let filteredByType =
    typeFilter === 'all'
      ? allCategories
      : typeFilter === 'income'
        ? incomeCategories || []
        : expenseCategories || [];

  // Then apply custom/default filter
  const filteredCategories =
    customFilter === 'all'
      ? filteredByType
      : customFilter === 'custom'
        ? filteredByType.filter((cat) => !cat.isDefault)
        : filteredByType.filter((cat) => cat.isDefault);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const allCustomCategories = allCategories.filter((cat) => !cat.isDefault);
  const categoryCount = allCustomCategories.length;
  const categoryLimit = 50;

  return (
    <Layout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Categorias</h1>
          <p className="mt-1 text-sm text-secondary-600">
            Gerencie suas categorias de transações ({categoryCount}/{categoryLimit} personalizadas)
          </p>
        </div>
        <Button
          onClick={handleCreate}
          disabled={categoryCount >= categoryLimit}
          title={categoryCount >= categoryLimit ? 'Limite de categorias atingido' : 'Criar nova categoria'}
        >
          + Nova Categoria
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Type Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-secondary-700">Tipo</label>
          <div className="flex gap-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                typeFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              Todas ({allCategories.length})
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                typeFilter === 'income'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              Receitas ({incomeCategories?.length || 0})
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                typeFilter === 'expense'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Despesas ({expenseCategories?.length || 0})
            </button>
          </div>
        </div>

        {/* Custom/Default Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-secondary-700">Origem</label>
          <div className="flex gap-2">
            <button
              onClick={() => setCustomFilter('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                customFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setCustomFilter('custom')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                customFilter === 'custom'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              Personalizadas ({allCustomCategories.length})
            </button>
            <button
              onClick={() => setCustomFilter('default')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                customFilter === 'default'
                  ? 'bg-secondary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              Padrão ({allCategories.filter(cat => cat.isDefault).length})
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-secondary-300 p-12 text-center">
          <p className="text-secondary-600">Nenhuma categoria encontrada</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={() => handleEdit(category)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <CategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} category={editingCategory} />
      </div>
    </Layout>
  );
};

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
}

const CategoryCard = ({ category, onEdit }: CategoryCardProps) => {
  const isCustom = !category.isDefault;

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        isCustom ? 'border-purple-200 ring-2 ring-purple-100' : 'border-secondary-200'
      }`}
      style={{ borderLeftWidth: '4px', borderLeftColor: category.color }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`relative ${isCustom ? 'rounded-lg bg-purple-50 p-1' : ''}`}>
            <span className="text-3xl">{category.icon}</span>
            {isCustom && (
              <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-secondary-900">{category.name}</h3>
              {isCustom && (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                  Personalizada
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  category.type === 'income'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {category.type === 'income' ? 'Receita' : 'Despesa'}
              </span>
              {!category.isActive && (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                  Inativa
                </span>
              )}
            </div>
          </div>
        </div>

        {isCustom && (
          <button
            onClick={onEdit}
            className="opacity-0 transition-opacity group-hover:opacity-100"
            title="Editar categoria"
          >
            <svg
              className="h-5 w-5 text-purple-600 hover:text-purple-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
