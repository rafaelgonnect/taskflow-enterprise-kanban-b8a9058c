
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface RoleTemplate {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  permissions: string[];
  is_active: boolean;
  created_at: string;
}

export function useRoleTemplates() {
  return useQuery({
    queryKey: ['role-templates'],
    queryFn: async () => {
      console.log('Buscando templates de papéis');
      
      const { data, error } = await supabase
        .from('role_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        console.error('Erro ao buscar templates:', error);
        throw error;
      }
      
      // Converter permissions de JSON para array
      const templates: RoleTemplate[] = (data || []).map(template => ({
        ...template,
        permissions: Array.isArray(template.permissions) ? template.permissions : [],
      }));
      
      console.log('Templates encontrados:', templates.length);
      return templates;
    },
  });
}

export function useApplyRoleTemplate() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      roleId, 
      templateId 
    }: { 
      roleId: string; 
      templateId: string; 
    }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Aplicando template ao papel:', { roleId, templateId });
      
      const { data, error } = await supabase.rpc('apply_role_template', {
        _role_id: roleId,
        _template_id: templateId,
      });
      
      if (error) {
        console.error('Erro ao aplicar template:', error);
        throw error;
      }
      
      console.log('Template aplicado com sucesso');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
    },
  });
}
