
import { useState } from 'react';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useCompanyUsers, useUpdateUserRole, CompanyUser } from '@/hooks/useCompanyUsers';
import { useRoles } from '@/hooks/useRoles';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Edit, MoreVertical, UserCheck, Clock } from 'lucide-react';

export const UserManagement = () => {
  const { selectedCompany } = useCompanyContext();
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<CompanyUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('');

  const { data: users = [], isLoading: usersLoading } = useCompanyUsers(selectedCompany?.id);
  const { data: roles = [], isLoading: rolesLoading } = useRoles(selectedCompany?.id);
  const updateUserRole = useUpdateUserRole();

  const handleUpdateUserRole = async () => {
    if (!selectedCompany || !editingUser || !selectedRole) return;

    try {
      await updateUserRole.mutateAsync({
        userId: editingUser.id,
        companyId: selectedCompany.id,
        roleId: selectedRole,
      });

      toast({
        title: 'Papel atualizado!',
        description: `Papel do usuário ${editingUser.full_name} atualizado com sucesso`,
      });

      setEditingUser(null);
      setSelectedRole('');
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar papel',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (user: CompanyUser) => {
    setEditingUser(user);
    const userRole = user.user_roles?.[0]?.roles;
    if (userRole) {
      const role = roles.find(r => r.name === userRole.name);
      setSelectedRole(role?.id || '');
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setSelectedRole('');
  };

  if (!selectedCompany) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Selecione uma empresa para gerenciar usuários</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Usuários</h1>
          <p className="text-slate-600">Gerencie usuários da empresa {selectedCompany.name}</p>
        </div>

        <Button disabled className="opacity-50 cursor-not-allowed">
          <Plus className="w-4 h-4 mr-2" />
          Convidar Usuário <span className="ml-1 text-xs">(em breve)</span>
        </Button>
      </div>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Usuário</DialogTitle>
            <DialogDescription>
              Edite as permissões e papel do usuário na empresa
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Usuário</label>
                <div className="p-3 bg-slate-50 rounded-md">
                  <p className="font-medium">{editingUser.full_name}</p>
                  <p className="text-sm text-slate-600">{editingUser.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Papel na empresa</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um papel" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesLoading ? (
                      <SelectItem value="loading" disabled>Carregando papéis...</SelectItem>
                    ) : (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                          {role.description && (
                            <span className="text-slate-500 ml-2">- {role.description}</span>
                          )}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleUpdateUserRole}
                  disabled={!selectedRole || updateUserRole.isPending}
                >
                  {updateUserRole.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {usersLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-slate-600">Carregando usuários...</p>
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">Nenhum usuário encontrado</p>
            <p className="text-sm text-slate-500">Convide usuários para começar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-slate-900">{user.full_name}</h3>
                      <Badge variant="outline">{user.email}</Badge>
                      {user.user_roles?.[0]?.roles && (
                        <Badge variant="secondary">
                          {user.user_roles[0].roles.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-4 h-4" />
                        <span>Tipo: {user.user_type === 'company_owner' ? 'Proprietário' : 'Funcionário'}</span>
                      </div>
                      {user.user_companies?.[0]?.joined_at && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Desde {new Date(user.user_companies[0].joined_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(user)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Gerenciar
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                        <Users className="w-4 h-4 mr-2" />
                        Desativar (em breve)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
