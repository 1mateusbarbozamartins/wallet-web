import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    cpf: user?.cpf || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingProfile(true);

    try {
      const updatedUser = await userService.updateProfile(profileData);
      updateUser(updatedUser);
      setIsEditingProfile(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('A nova senha deve ter no mínimo 6 caracteres');
      return;
    }

    setIsLoadingPassword(true);

    try {
      await userService.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setIsEditingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Senha atualizada com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar senha');
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Perfil</h1>
          <p className="text-secondary-600">Gerencie suas informações pessoais</p>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 text-3xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-semibold text-secondary-900">{user?.name}</p>
                <p className="text-secondary-600">{user?.email}</p>
                <p className="mt-1 text-sm font-medium text-primary-600">
                  Saldo: {formatCurrency(user?.balance || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Dados Pessoais</CardTitle>
              {!isEditingProfile && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditingProfile(true)}>
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingProfile ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input
                  label="Nome completo"
                  value={profileData.name}
                  onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
                <Input
                  label="CPF"
                  value={profileData.cpf}
                  onChange={e => setProfileData({ ...profileData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                />
                <div className="flex gap-3">
                  <Button type="submit" isLoading={isLoadingProfile}>
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setProfileData({ name: user?.name || '', cpf: user?.cpf || '' });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-secondary-600">Nome</p>
                  <p className="font-medium text-secondary-900">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-600">CPF</p>
                  <p className="font-medium text-secondary-900">{user?.cpf || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Email</p>
                  <p className="font-medium text-secondary-900">{user?.email}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Alterar Senha</CardTitle>
              {!isEditingPassword && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditingPassword(true)}>
                  Alterar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingPassword ? (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <Input
                  label="Senha atual"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={e =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  required
                />
                <Input
                  label="Nova senha"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
                <Input
                  label="Confirmar nova senha"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={e =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                />
                <div className="flex gap-3">
                  <Button type="submit" isLoading={isLoadingPassword}>
                    Salvar senha
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsEditingPassword(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-secondary-600">
                Clique em "Alterar" para modificar sua senha de acesso.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-secondary-600">
              Desativar sua conta irá remover o acesso ao sistema. Esta ação pode ser revertida
              entrando em contato com o suporte.
            </p>
            <Button variant="danger" size="sm">
              Desativar conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
