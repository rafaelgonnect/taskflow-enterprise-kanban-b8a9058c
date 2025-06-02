
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUpdateUserRole } from '@/hooks/useCompanyUsers';
import { useRoles, Role } from '@/hooks/useRoles';
import { useAuth } from '@/hooks/useAuth';
import { Shield, User, Save, X, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UserPermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    email: string;
    full_name: string;
    user_roles: {
      roles: {
        name: string;
        description: string;
      };
    }[];
  };
  companyId: string;
}

const PERMISSION_LABELS: Record<string, string> = {
  'manage_company': 'Gerenciar Empresa',
  'manage_users': 'Gerenciar Usuários',
  'manage_departments': 'Gerenciar Departamentos',
  'manage_tasks': 'Gerenciar Tarefas',
  'view_all_tasks': 'Ver Todas as Tarefas',
  'create_tasks': 'Criar Tarefas',
  'edit_tasks': 'Editar Tarefas',
  'delete_tasks': 'Deletar Tarefas',
  'assign_tasks': 'Atribuir Tarefas',
  'view_reports': 'Ver Relatórios',
  'manage_permissions': 'Gerenciar Permissões'
};

export const UserPermissionsDialog = ({ isOpen, onClose, user, companyId }: UserPermissionsDialogProps) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  
  const { data: roles = [], isLoading: rolesLoading } = useRoles(companyId);
  const updateUserRole = useUpdateUserRole();

  const currentRole = user.user_roles[0]?.roles;
  const selectedRole = roles.find(role => role.id === selectedRoleId);

  // Verificar se o usuário atual pode alterar permissões
  const canManagePermissions = currentUser?.id !== user.id; // Não pode alterar próprias permissões
  
  // Verificar se é administrador (em uma implementação real, verificaria as permissões)
  const isCurrentUserAdmin = true; // Placeholder - implementar verificação real

  const handleSave = async () => {
    if (!canManagePermissions) {
      toast({
        title: 'Erro',
        description: 'Você não pode alterar suas próprias permissões',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedRoleId) {
      toast({
        title: 'Erro',
        description: 'Selecione um papel para o usuário',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateUserRole.mutateAsync({
        userId: user.id,
        companyId,
        roleId: selectedRoleId,
      });

      toast({
        title: 'Sucesso',
        description: 'Papel do usuário atualizado com sucesso',
      });

      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar papel',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Gerenciar Permissões - {user.full_name}
          </DialogTitle>
          <DialogDescription>
            Gerencie o papel e permissões do usuário {user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Aviso se tentando alterar próprias permissões */}
          {!canManagePermissions && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <p className="text-orange-800 font-medium">
                    Você não pode alterar suas próprias permissões por questões de segurança.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Papel Atual */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Papel Atual</CardTitle>
            </CardHeader>
            <CardContent>
              {currentRole ? (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    <Shield className="w-3 h-3 mr-1" />
                    {currentRole.name}
                  </Badge>
                  <span className="text-sm text-slate-600">{currentRole.description}</span>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Nenhum papel atribuído</p>
              )}
            </CardContent>
          </Card>

          {/* Seleção de Novo Papel */}
          {canManagePermissions && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alterar Papel</CardTitle>
                <CardDescription>
                  Selecione um novo papel para o usuário
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um papel" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesLoading ? (
                      <SelectItem value="loading" disabled>Carregando...</SelectItem>
                    ) : (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>{role.name}</span>
                            {role.is_default && (
                              <Badge variant="outline" className="ml-2">Padrão</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                {/* Preview das Permissões */}
                {selectedRole && (
                  <div className="border rounded-lg p-4 bg-slate-50">
                    <h4 className="font-medium mb-3">Permissões deste papel:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRole.role_permissions.map((rp, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {PERMISSION_LABELS[rp.permission] || rp.permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            {canManagePermissions && (
              <Button 
                onClick={handleSave}
                disabled={!selectedRoleId || updateUserRole.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {updateUserRole.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
