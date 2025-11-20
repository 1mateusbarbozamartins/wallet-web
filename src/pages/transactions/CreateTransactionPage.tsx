import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TransactionForm } from '@/components/forms/TransactionForm';

export const CreateTransactionPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/transactions');
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/transactions')}
            className="flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar
          </Button>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Nova Transação</h1>
          <p className="text-secondary-600">Registre uma nova receita ou despesa</p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Transação</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
