export interface User {
  id: string;
  email: string;
  name: string;
  cpf?: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionCategory {
  SALARY = 'salary',
  FREELANCE = 'freelance',
  INVESTMENT = 'investment',
  FOOD = 'food',
  TRANSPORT = 'transport',
  HEALTH = 'health',
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
  BILLS = 'bills',
  OTHER = 'other',
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  categoryId: string;
  description: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  cpf?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
}

export interface TransactionSummary {
  income: number;
  expense: number;
  balance: number;
  categoryBreakdown: Record<string, number>;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  isDefault: boolean;
  isActive: boolean;
  userId: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
}

export interface UpdateCategoryData {
  name?: string;
  color?: string;
  icon?: string;
}
