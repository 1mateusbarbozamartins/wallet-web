# Wallet Web

Frontend web para o sistema de controle financeiro pessoal desenvolvido com React, TypeScript e Tailwind CSS.

## Tecnologias Utilizadas

### Core
- **React 18** - Biblioteca UI
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool moderno e rápido

### Estado e Dados
- **React Router v6** - Roteamento
- **React Query (TanStack Query)** - Cache e sincronização de dados do servidor
- **Context API** - Estado global (autenticação)

### Formulários e Validação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### UI e Estilização
- **Tailwind CSS** - Framework CSS utility-first
- **React Hot Toast** - Notificações
- **Recharts** - Gráficos e visualizações

### HTTP e API
- **Axios** - Cliente HTTP com interceptors

### Utilitários
- **date-fns** - Manipulação de datas
- **clsx** + **tailwind-merge** - Merge de classes CSS

### Qualidade de Código
- **ESLint** - Linter
- **Prettier** - Formatador de código
- **Husky** - Git hooks
- **Lint-staged** - Lint em arquivos staged

### Testes
- **Vitest** - Framework de testes
- **React Testing Library** - Testes de componentes

## Funcionalidades

### Autenticação
- Login
- Registro de usuários
- Refresh automático de tokens
- Logout
- Rotas protegidas

### Dashboard
- Visão geral financeira
- Saldo total
- Resumo de receitas e despesas
- Breakdown por categoria

### Transações
- Listar transações
- Criar nova transação
- Editar transação
- Deletar transação
- Filtrar por data e tipo

### Perfil
- Visualizar perfil
- Editar informações
- Alterar senha

## Estrutura do Projeto

```
wallet-web/
├── public/               # Assets estáticos
├── src/
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes UI base
│   │   ├── layout/      # Layout components
│   │   └── forms/       # Form components
│   ├── pages/           # Páginas
│   │   ├── auth/        # Login, Register
│   │   ├── dashboard/   # Dashboard
│   │   ├── transactions/ # Transações
│   │   └── profile/     # Perfil
│   ├── services/        # API services (Axios)
│   ├── contexts/        # React Contexts
│   ├── hooks/           # Custom hooks
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilitários
│   ├── config/          # Configurações
│   ├── routes/          # Rotas
│   ├── styles/          # Estilos globais
│   ├── App.tsx          # App principal
│   └── main.tsx         # Entry point
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## Instalação

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Backend rodando em `http://localhost:3000`

### Passo a passo

1. **Entre na pasta do projeto**
```bash
cd wallet-web
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

O app estará rodando em `http://localhost:3000`

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Compila para produção
npm run preview          # Preview da build de produção

# Qualidade de código
npm run lint             # Executa o linter
npm run lint:fix         # Corrige problemas do linter
npm run format           # Formata código com Prettier

# Testes
npm test                 # Executa testes
npm run test:ui          # Executa testes com UI
npm run test:coverage    # Executa testes com coverage
```

## Páginas

### Públicas
- `/login` - Login
- `/register` - Registro

### Privadas (requer autenticação)
- `/dashboard` - Dashboard principal
- `/transactions` - Lista de transações
- `/transactions/new` - Nova transação
- `/profile` - Perfil do usuário

## Componentes Principais

### UI Components
- `Button` - Botão customizável
- `Input` - Input com label e erro
- `Card` - Card container
- `Badge` - Badge de status

### Layout Components
- `Header` - Cabeçalho com navegação
- `Layout` - Layout wrapper

### Pages
- `LoginPage` - Página de login
- `RegisterPage` - Página de registro
- `DashboardPage` - Dashboard
- `TransactionsPage` - Lista de transações

## Autenticação

O sistema usa JWT para autenticação:

1. User faz login → recebe `token` e `refreshToken`
2. Token é armazenado no `localStorage`
3. Axios interceptor adiciona token em todas as requests
4. Quando token expira, refresh automático é feito
5. Se refresh falhar, usuário é redirecionado para login

```typescript
// Uso
const { user, login, logout, isAuthenticated } = useAuth();

await login({ email, password });
```

## React Query

Gerenciamento de estado do servidor:

```typescript
// Buscar dados
const { data, isLoading, error } = useTransactions();

// Mutações
const { mutate } = useCreateTransaction();

mutate(transactionData, {
  onSuccess: () => {
    // Invalida cache e refetch
  }
});
```

## Tailwind CSS

Exemplos de uso:

```typescript
// Classes básicas
<div className="flex items-center justify-between p-4 bg-white rounded-lg">

// Responsividade
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Classes condicionais
<button
  className={cn(
    'px-4 py-2 rounded',
    isPrimary && 'bg-blue-600',
    isDisabled && 'opacity-50'
  )}
/>
```

## Formatação

Utilitários de formatação disponíveis:

```typescript
import { formatCurrency, formatDate, formatCPF } from '@/utils/formatters';

formatCurrency(1234.56)  // "R$ 1.234,56"
formatDate(new Date())   // "20/11/2025"
formatCPF("12345678900") // "123.456.789-00"
```

## Validação de Formulários

Usando React Hook Form + Zod:

```typescript
const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});

<form onSubmit={handleSubmit(onSubmit)}>
  <Input
    {...register('email')}
    error={errors.email?.message}
  />
</form>
```

## Boas Práticas

### Componentes
- Mantenha componentes pequenos (< 150 linhas)
- Um componente, uma responsabilidade
- Props sempre tipadas
- Use functional components + hooks

### Estado
- useState para estado local UI
- React Query para dados da API
- Context API para estado global (auth)

### Performance
- Use React.memo para componentes pesados
- useMemo para cálculos complexos
- useCallback para funções passadas como props
- Lazy loading de rotas

### TypeScript
- Sempre tipar props
- Evitar `any`
- Usar tipos do React (`ReactNode`, `FC`, etc.)

## Estrutura de Arquivos

### Criando um novo componente
```
components/
  ui/
    MyComponent.tsx       # Componente
    MyComponent.test.tsx  # Testes (opcional)
```

### Criando uma nova página
```
pages/
  myfeature/
    MyFeaturePage.tsx     # Página principal
```

### Criando um novo service
```
services/
  myService.ts            # Funções de API
```

### Criando um novo hook
```
hooks/
  useMyHook.ts            # Custom hook
```

## Testes

```bash
# Executar testes
npm test

# Com coverage
npm run test:coverage

# Com UI
npm run test:ui
```

Exemplo de teste:

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## Deploy

### Build de Produção
```bash
npm run build
```

Arquivos gerados em `dist/`

### Variáveis de Ambiente

Produção:
```env
VITE_API_URL=https://api.meudominio.com
```

## Próximos Passos

- [ ] Adicionar testes para componentes críticos
- [ ] Implementar lazy loading de rotas
- [ ] Adicionar página de relatórios com gráficos
- [ ] Implementar dark mode
- [ ] Adicionar filtros avançados nas transações
- [ ] Implementar paginação
- [ ] Adicionar categorias customizadas
- [ ] Exportar relatórios (PDF, Excel)
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)

## Troubleshooting

### Erro de CORS
Certifique-se que o backend está configurado para aceitar requests do frontend:
```typescript
// Backend: wallet-api/src/config/env.ts
cors: {
  origin: 'http://localhost:3000'
}
```

### Token expirado
O refresh é automático. Se continuar falhando, faça logout e login novamente.

### Build falha
```bash
# Limpe cache e reinstale
rm -rf node_modules dist
npm install
npm run build
```

## Suporte

Para reportar bugs ou solicitar features, abra uma issue no repositório.

## Licença

ISC

---

**Desenvolvido com ❤️ usando React + TypeScript + Tailwind**
