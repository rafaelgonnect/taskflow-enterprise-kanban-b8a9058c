import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateRole, useUpdateRole } from '@/hooks/useRoleManagement';
import { Role } from '@/hooks/useRoles';
import { Permission } from '@/types/database';
import { Shield, Save, X, Users, Palette } from 'lucide-react';

interface RoleFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
  companyId: string;
}

const AVAILABLE_PERMISSIONS: Permission[] = [
  'manage_company',
  'manage_users',
  'manage_departments',
  'manage_tasks',
  'view_all_tasks',
  'create_tasks',
  'edit_tasks',
  'delete_tasks',
  'assign_tasks',
  'view_reports',
  'manage_permissions',
  'invite_users',
  'deactivate_users',
  'manage_user_roles',
  'view_user_activity',
  'view_audit_logs',
  'create_personal_tasks',
  'create_department_tasks',
  'create_company_tasks',
  'accept_public_tasks',
  'view_task_analytics',
  'create_departments',
  'manage_department_members',
  'view_department_analytics',
  'delegate_tasks',
  'transfer_tasks',
  'accept_task_transfers'
];

const PERMISSION_LABELS: Record<Permission, string> = {
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
  'manage_permissions': 'Gerenciar Permissões',
  'invite_users': 'Convidar Usuários',
  'deactivate_users': 'Desativar Usuários',
  'manage_user_roles': 'Gerenciar Papéis de Usuários',
  'view_user_activity': 'Ver Atividade de Usuários',
  'view_audit_logs': 'Ver Logs de Auditoria',
  'create_personal_tasks': 'Criar Tarefas Pessoais',
  'create_department_tasks': 'Criar Tarefas do Departamento',
  'create_company_tasks': 'Criar Tarefas da Empresa',
  'accept_public_tasks': 'Aceitar Tarefas Públicas',
  'view_task_analytics': 'Ver Análises de Tarefas',
  'create_departments': 'Criar Departamentos',
  'manage_department_members': 'Gerenciar Membros do Departamento',
  'view_department_analytics': 'Ver Análises do Departamento',
  'delegate_tasks': 'Delegar Tarefas',
  'transfer_tasks': 'Transferir Tarefas',
  'accept_task_transfers': 'Aceitar Transferências de Tarefas'
};

const ROLE_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#10b981', '#06b6d4', '#3b82f6'
];

const ROLE_ICONS = [
  { value: 'shield', label: 'Escudo' },
  { value: 'crown', label: 'Coroa' },
  { value: 'users', label: 'Usuários' },
  { value: 'settings', label: 'Configurações' }
];

export const RoleFormDialog = ({ isOpen, onClose, role, companyId }: RoleFormDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as Permission[],
    color: '#6366f1',
    icon: 'shield',
    maxUsers: undefined as number | undefined
  });

  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const isEdit = !!role;

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || '',
        permissions: role.role_permissions.map(rp => rp.permission as Permission),
        color: role.color || '#6366f1',
        icon: role.icon || 'shield',
        maxUsers: role.max_users || undefined
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: [],
        color: '#6366f1',
        icon: 'shield',
        maxUsers: undefined
      });
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome do papel é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isEdit && role) {
        await updateRole.mutateAsync({
          roleId: role.id,
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
          companyId,
          color: formData.color,
          icon: formData.icon,
          maxUsers: formData.maxUsers
        });

        toast({
          title: 'Papel atualizado',
          description: `O papel "${formData.name}" foi atualizado com sucesso`,
        });
      } else {
        await createRole.mutateAsync({
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
          companyId,
          color: formData.color,
          icon: formData.icon,
          maxUsers: formData.maxUsers
        });

        toast({
          title: 'Papel criado',
          description: `O papel "${formData.name}" foi criado com sucesso`,
        });
      }

      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar papel',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {isEdit ? 'Editar Papel' : 'Criar Novo Papel'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique as informações do papel' : 'Defina as informações e permissões do novo papel'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Papel *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Gerente de Vendas"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do papel e responsabilidades"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon">Ícone</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_ICONS.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxUsers">Máximo de Usuários</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  value={formData.maxUsers || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    maxUsers: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  placeholder="Sem limite"
                  min="1"
                />
              </div>
            </div>

            <div>
              <Label>Cor do Papel</Label>
              <div className="flex gap-2 mt-2">
                {ROLE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? 'border-slate-900' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Permissões */}
          <div>
            <Label className="text-lg">Permissões</Label>
            <p className="text-sm text-slate-600 mb-4">
              Selecione as permissões que este papel terá no sistema
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission}
                    checked={formData.permissions.includes(permission)}
                    onCheckedChange={(checked) => handlePermissionChange(permission, !!checked)}
                  />
                  <Label htmlFor={permission} className="text-sm cursor-pointer">
                    {PERMISSION_LABELS[permission]}
                  </Label>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 mt-2">
              {formData.permissions.length} permissões selecionadas
            </p>
          </div>

          {/* Ações */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createRole.isPending || updateRole.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {createRole.isPending || updateRole.isPending 
                ? 'Salvando...' 
                : isEdit ? 'Atualizar Papel' : 'Criar Papel'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
