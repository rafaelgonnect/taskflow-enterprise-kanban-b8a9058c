
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateRole, useUpdateRole } from '@/hooks/useRoleManagement';
import { useToast } from '@/hooks/use-toast';
import { Permission } from '@/types/database';
import { Shield, Users, Crown, Briefcase, UserCheck, GraduationCap, Save, X } from 'lucide-react';

interface RoleFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  role?: any;
  companyId: string;
}

const PERMISSION_GROUPS = {
  'Empresa': [
    'manage_company',
    'view_audit_logs',
  ],
  'Usuários': [
    'manage_users',
    'invite_users',
    'manage_user_roles',
    'deactivate_users',
    'view_user_activity',
  ],
  'Departamentos': [
    'manage_departments',
    'create_departments',
    'manage_department_members',
    'view_department_analytics',
  ],
  'Tarefas': [
    'manage_tasks',
    'view_all_tasks',
    'create_tasks',
    'edit_tasks',
    'delete_tasks',
    'assign_tasks',
    'create_personal_tasks',
    'create_department_tasks',
    'create_company_tasks',
    'accept_public_tasks',
    'view_task_analytics',
  ],
  'Relatórios': [
    'view_reports',
  ],
  'Permissões': [
    'manage_permissions',
  ],
};

const PERMISSION_LABELS: Record<string, string> = {
  'manage_company': 'Gerenciar Empresa',
  'manage_users': 'Gerenciar Usuários',
  'invite_users': 'Convidar Usuários',
  'manage_user_roles': 'Gerenciar Papéis de Usuários',
  'deactivate_users': 'Desativar Usuários',
  'view_user_activity': 'Ver Atividade dos Usuários',
  'manage_departments': 'Gerenciar Departamentos',
  'create_departments': 'Criar Departamentos',
  'manage_department_members': 'Gerenciar Membros do Departamento',
  'view_department_analytics': 'Ver Analytics do Departamento',
  'manage_tasks': 'Gerenciar Tarefas',
  'view_all_tasks': 'Ver Todas as Tarefas',
  'create_tasks': 'Criar Tarefas',
  'edit_tasks': 'Editar Tarefas',
  'delete_tasks': 'Deletar Tarefas',
  'assign_tasks': 'Atribuir Tarefas',
  'create_personal_tasks': 'Criar Tarefas Pessoais',
  'create_department_tasks': 'Criar Tarefas do Departamento',
  'create_company_tasks': 'Criar Tarefas da Empresa',
  'accept_public_tasks': 'Aceitar Tarefas Públicas',
  'view_task_analytics': 'Ver Analytics de Tarefas',
  'view_reports': 'Ver Relatórios',
  'manage_permissions': 'Gerenciar Permissões',
  'view_audit_logs': 'Ver Logs de Auditoria',
};

const ICON_OPTIONS = [
  { value: 'shield', label: 'Escudo', icon: Shield },
  { value: 'users', label: 'Usuários', icon: Users },
  { value: 'crown', label: 'Coroa', icon: Crown },
  { value: 'briefcase', label: 'Maleta', icon: Briefcase },
  { value: 'user-check', label: 'Usuário Verificado', icon: UserCheck },
  { value: 'graduation-cap', label: 'Formatura', icon: GraduationCap },
];

const COLOR_OPTIONS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b',
  '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6'
];

export const RoleFormDialog = ({ isOpen, onClose, role, companyId }: RoleFormDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'shield',
    color: '#6366f1',
    maxUsers: '',
    permissions: [] as Permission[],
  });

  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        icon: role.icon || 'shield',
        color: role.color || '#6366f1',
        maxUsers: role.max_users ? role.max_users.toString() : '',
        permissions: role.role_permissions?.map((rp: any) => rp.permission) || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: 'shield',
        color: '#6366f1',
        maxUsers: '',
        permissions: [],
      });
    }
  }, [role]);

  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

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
      if (role) {
        // Atualizar papel existente
        await updateRole.mutateAsync({
          roleId: role.id,
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          permissions: formData.permissions,
          companyId,
          color: formData.color,
          icon: formData.icon,
          maxUsers: formData.maxUsers ? parseInt(formData.maxUsers) : undefined,
        });

        toast({
          title: 'Papel atualizado!',
          description: `O papel "${formData.name}" foi atualizado com sucesso`,
        });
      } else {
        // Criar novo papel
        await createRole.mutateAsync({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          permissions: formData.permissions,
          companyId,
          color: formData.color,
          icon: formData.icon,
          maxUsers: formData.maxUsers ? parseInt(formData.maxUsers) : undefined,
        });

        toast({
          title: 'Papel criado!',
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

  const selectedIcon = ICON_OPTIONS.find(option => option.value === formData.icon);
  const IconComponent = selectedIcon?.icon || Shield;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {role ? 'Editar Papel' : 'Criar Novo Papel'}
          </DialogTitle>
          <DialogDescription>
            {role ? 'Edite as informações e permissões do papel' : 'Configure as informações e permissões do novo papel'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Papel *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Gerente de Vendas"
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxUsers">Máximo de Usuários</Label>
                  <Input
                    id="maxUsers"
                    type="number"
                    value={formData.maxUsers}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxUsers: e.target.value }))}
                    placeholder="Deixe vazio para ilimitado"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva as responsabilidades deste papel..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Ícone</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {selectedIcon?.label}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cor</Label>
                  <div className="flex gap-2 flex-wrap">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? 'border-slate-400' : 'border-slate-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="border rounded-lg p-3 bg-slate-50">
                <Label className="text-sm text-slate-600 mb-2 block">Preview:</Label>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: formData.color }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{formData.name || 'Nome do Papel'}</p>
                    <p className="text-sm text-slate-600">{formData.description || 'Descrição do papel'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissões */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Permissões</CardTitle>
              <CardDescription>
                Selecione as permissões que este papel terá
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(PERMISSION_GROUPS).map(([group, permissions]) => (
                  <div key={group}>
                    <h4 className="font-medium text-slate-900 mb-2">{group}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {permissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission}
                            checked={formData.permissions.includes(permission as Permission)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission as Permission, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={permission}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {PERMISSION_LABELS[permission] || permission}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-3 justify-end pt-4 border-t">
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
                : role ? 'Atualizar Papel' : 'Criar Papel'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
