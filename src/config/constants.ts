export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AUTH_TOKEN_KEY = '@wallet:token';
export const AUTH_REFRESH_TOKEN_KEY = '@wallet:refreshToken';
export const AUTH_USER_KEY = '@wallet:user';

export const TRANSACTION_CATEGORIES = {
  income: [
    { value: 'salary', label: 'Salário' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investment', label: 'Investimento' },
  ],
  expense: [
    { value: 'food', label: 'Alimentação' },
    { value: 'transport', label: 'Transporte' },
    { value: 'health', label: 'Saúde' },
    { value: 'education', label: 'Educação' },
    { value: 'entertainment', label: 'Entretenimento' },
    { value: 'bills', label: 'Contas' },
    { value: 'other', label: 'Outros' },
  ],
};

export const CATEGORY_COLORS: Record<string, string> = {
  salary: '#22c55e',
  freelance: '#10b981',
  investment: '#14b8a6',
  food: '#f59e0b',
  transport: '#3b82f6',
  health: '#ef4444',
  education: '#8b5cf6',
  entertainment: '#ec4899',
  bills: '#f97316',
  other: '#6b7280',
};
