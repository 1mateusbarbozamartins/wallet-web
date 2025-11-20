import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Link } from 'react-router-dom';

export const TransactionsPage = () => {
  const { data: transactions, isLoading } = useTransactions();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Transações</h1>
            <p className="text-secondary-600">Gerencie suas receitas e despesas</p>
          </div>
          <Link to="/transactions/new">
            <Button>+ Nova Transação</Button>
          </Link>
        </div>

        {!transactions || transactions.length === 0 ? (
          <Card className="py-12 text-center">
            <p className="text-secondary-600">Nenhuma transação encontrada</p>
            <Link to="/transactions/new">
              <Button className="mt-4">Criar primeira transação</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {transactions.map(transaction => (
              <Card key={transaction.id} className="transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-block h-3 w-3 rounded-full ${
                          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <div>
                        <h3 className="font-medium text-secondary-900">
                          {transaction.description}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          <span className="inline-flex items-center gap-1">
                            <span>{transaction.category.icon}</span>
                            <span>{transaction.category.name}</span>
                          </span>
                          {' • '}
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}{' '}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
