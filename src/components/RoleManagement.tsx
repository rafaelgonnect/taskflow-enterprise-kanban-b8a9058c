
import { useState } from 'react';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useRoles } from '@/hooks/useRoles';
import { useCreateRole, useUpdateRole, useDeleteRole } from '@/hooks/useRoleManagement';
import { RoleFormDialog } from '@/components/RoleFormDialog';
import { RoleTemplateSelector } from '@/components/RoleTemplateSelector';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus, Users, Settings, Edit, Trash2, MoreVertical, Palette, Crown } from 'lucide-react';

export const RoleManagement = () => {
  const { selectedCompany } = useCompanyContext();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedRoleForTemplate, setSelectedRoleForTemplate] = useState(null);

  const { data: roles = [], isLoading } = useRoles(selectedCompany?.id);
  const deleteRole = useDeleteRole();

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setShowCreateDialog(true);
  };

  const handleApplyTemplate = (role: any) => {
    setSelectedRoleForTemplate(role);
    setShowTemplateSelector(true);
  };

  const handleDeleteRole = async (role: any) => {
    if (role.is_default || role.is_system_role) {
      toast({
        title: 'Erro',
        description: 'Não é possível deletar papéis padrão ou do sistema',
        variant: 'destructive',
      });
      return;
    }

    if (window.confirm(`Tem certeza que deseja deletar o papel "${role.name}"?`)) {
      try {
        await deleteRole.mutateAsync({
          roleId: role.id,
          companyId: selectedCompany!.id,
        });

        toast({
          title: 'Papel deletado',
          description: `O papel "${role.name}" foi deletado com sucesso`,
        });
      } catch (error: any) {
        toast({
          title: 'Erro ao deletar papel',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const getRoleIcon = (iconName: string) => {
    switch (iconName) {
      case 'crown': return Crown;
      case 'users': return Users;
      case 'settings': return Settings;
      default: return Shield;
    }
  };

  if (!selectedCompany) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Selecione uma empresa para gerenciar papéis</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Papéis</h1>
          <p className="text-slate-600">Gerencie papéis, permissões e hierarquias da empresa</p>
        </div>

        <PermissionGuard permission="manage_permissions">
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Papel
          </Button>
        </PermissionGuard>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{roles.length}</p>
                <p className="text-sm text-slate-600">Total de Papéis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{roles.filter(r => r.is_default).length}</p>
                <p className="text-sm text-slate-600">Papéis Padrão</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{roles.filter(r => !r.is_system_role).length}</p>
                <p className="text-sm text-slate-600">Papéis Customizados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Papéis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Papéis da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-slate-600">Carregando papéis...</p>
            </div>
          ) : roles.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Nenhum papel encontrado</p>
              <p className="text-sm text-slate-400">Crie o primeiro papel para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {roles.map((role) => {
                const IconComponent = getRoleIcon(role.icon || 'shield');
                
                return (
                  <div key={role.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: role.color || '#6366f1' }}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{role.name}</h3>
                            {role.is_default && (
                              <Badge variant="outline" className="text-xs">Padrão</Badge>
                            )}
                            {role.is_system_role && (
                              <Badge variant="secondary" className="text-xs">Sistema</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            {role.description || 'Sem descrição'}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                              {role.role_permissions.length} permissões
                            </span>
                            {role.max_users && (
                              <span className="text-xs text-slate-500">
                                • Máx. {role.max_users} usuários
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <PermissionGuard permission="manage_permissions">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditRole(role)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar Papel
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => handleApplyTemplate(role)}>
                              <Palette className="w-4 h-4 mr-2" />
                              Aplicar Template
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            {!role.is_default && !role.is_system_role && (
                              <DropdownMenuItem 
                                onClick={() => handleDeleteRole(role)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Deletar Papel
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </PermissionGuard>
                    </div>

                    {/* Preview das Permissões */}
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex flex-wrap gap-1">
                        {role.role_permissions.slice(0, 3).map((rp, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {rp.permission}
                          </Badge>
                        ))}
                        {role.role_permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.role_permissions.length - 3} mais...
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <RoleFormDialog
        isOpen={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
          setEditingRole(null);
        }}
        role={editingRole}
        companyId={selectedCompany.id}
      />

      {selectedRoleForTemplate && (
        <RoleTemplateSelector
          isOpen={showTemplateSelector}
          onClose={() => {
            setShowTemplateSelector(false);
            setSelectedRoleForTemplate(null);
          }}
          roleId={selectedRoleForTemplate.id}
          roleName={selectedRoleForTemplate.name}
        />
      )}
    </div>
  );
};
