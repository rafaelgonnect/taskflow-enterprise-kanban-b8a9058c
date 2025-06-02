
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRoleTemplates, useApplyRoleTemplate } from '@/hooks/useRoleTemplates';
import { Palette, Shield, Users, Settings, Crown, Check, X } from 'lucide-react';

interface RoleTemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
  roleName: string;
}

export const RoleTemplateSelector = ({ isOpen, onClose, roleId, roleName }: RoleTemplateSelectorProps) => {
  const { toast } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  const { data: templates = [], isLoading } = useRoleTemplates();
  const applyTemplate = useApplyRoleTemplate();

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'crown': return Crown;
      case 'users': return Users;
      case 'settings': return Settings;
      default: return Shield;
    }
  };

  const handleApplyTemplate = async () => {
    if (!selectedTemplateId) return;

    try {
      await applyTemplate.mutateAsync({
        roleId,
        templateId: selectedTemplateId
      });

      toast({
        title: 'Template aplicado',
        description: `Template aplicado ao papel "${roleName}" com sucesso`,
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Aplicar Template ao Papel: {roleName}
          </DialogTitle>
          <DialogDescription>
            Selecione um template para aplicar permissões e configurações pré-definidas ao papel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-slate-600">Carregando templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <Palette className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Nenhum template disponível</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => {
                const IconComponent = getTemplateIcon(template.icon);
                const isSelected = selectedTemplateId === template.id;
                
                return (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-blue-500 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedTemplateId(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: template.color }}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            {isSelected && (
                              <div className="flex items-center gap-1 mt-1">
                                <Check className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-600">Selecionado</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {template.description && (
                        <CardDescription className="mt-2">
                          {template.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">
                          Permissões ({template.permissions.length})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.permissions.slice(0, 4).map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                          {template.permissions.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.permissions.length - 4} mais...
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

          {/* Ações */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={handleApplyTemplate}
              disabled={!selectedTemplateId || applyTemplate.isPending}
            >
              <Palette className="w-4 h-4 mr-2" />
              {applyTemplate.isPending ? 'Aplicando...' : 'Aplicar Template'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
