
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoleTemplates, useApplyRoleTemplate } from '@/hooks/useRoleTemplates';
import { useToast } from '@/hooks/use-toast';
import { Crown, Users, Briefcase, UserCheck, GraduationCap, Palette, Sparkles } from 'lucide-react';

interface RoleTemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
  roleName: string;
}

const TEMPLATE_ICONS = {
  'crown': Crown,
  'users': Users,
  'briefcase': Briefcase,
  'user-check': UserCheck,
  'graduation-cap': GraduationCap,
  'shield': Sparkles,
};

const PERMISSION_LABELS: Record<string, string> = {
  'manage_company': 'Gerenciar Empresa',
  'manage_users': 'Gerenciar Usuários',
  'invite_users': 'Convidar Usuários',
  'manage_user_roles': 'Gerenciar Papéis',
  'deactivate_users': 'Desativar Usuários',
  'view_user_activity': 'Ver Atividades',
  'manage_departments': 'Gerenciar Departamentos',
  'create_departments': 'Criar Departamentos',
  'manage_department_members': 'Gerenciar Membros',
  'view_department_analytics': 'Relatórios Departamentais',
  'manage_tasks': 'Gerenciar Tarefas',
  'view_all_tasks': 'Ver Todas Tarefas',
  'create_tasks': 'Criar Tarefas',
  'create_personal_tasks': 'Tarefas Pessoais',
  'create_department_tasks': 'Tarefas Departamentais',
  'create_company_tasks': 'Tarefas Empresariais',
  'edit_tasks': 'Editar Tarefas',
  'delete_tasks': 'Deletar Tarefas',
  'assign_tasks': 'Atribuir Tarefas',
  'accept_public_tasks': 'Aceitar Tarefas Públicas',
  'view_task_analytics': 'Relatórios de Tarefas',
  'view_reports': 'Ver Relatórios',
  'manage_permissions': 'Gerenciar Permissões',
  'view_audit_logs': 'Logs de Auditoria',
};

export const RoleTemplateSelector = ({ isOpen, onClose, roleId, roleName }: RoleTemplateSelectorProps) => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const { data: templates = [], isLoading } = useRoleTemplates();
  const applyTemplate = useApplyRoleTemplate();

  const handleApplyTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      await applyTemplate.mutateAsync({
        roleId,
        templateId: selectedTemplate,
      });

      toast({
        title: 'Template aplicado!',
        description: `O template foi aplicado ao papel ${roleName} com sucesso`,
      });

      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro ao aplicar template',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Aplicar Template ao Papel "{roleName}"
          </DialogTitle>
          <DialogDescription>
            Escolha um template pré-configurado para aplicar permissões ao papel selecionado
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-slate-600">Carregando templates...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => {
                const IconComponent = TEMPLATE_ICONS[template.icon as keyof typeof TEMPLATE_ICONS] || Sparkles;
                const isSelected = selectedTemplate === template.id;
                
                return (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: template.color }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        {template.name}
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-700">
                          Permissões incluídas ({template.permissions.length}):
                        </p>
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                          {template.permissions.slice(0, 8).map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {PERMISSION_LABELS[permission] || permission}
                            </Badge>
                          ))}
                          {template.permissions.length > 8 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.permissions.length - 8} mais...
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleApplyTemplate}
            disabled={!selectedTemplate || applyTemplate.isPending}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {applyTemplate.isPending ? 'Aplicando...' : 'Aplicar Template'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
