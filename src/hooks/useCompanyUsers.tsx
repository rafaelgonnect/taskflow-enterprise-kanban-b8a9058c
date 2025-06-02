
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CompanyUser {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
  is_active: boolean;
  user_companies: {
    is_active: boolean;
    joined_at: string;
  }[];
  user_roles: {
    role_id: string;
    roles: {
      name: string;
      description: string;
    };
  }[];
  user_departments: {
    departments: {
      name: string;
      description: string;
    };
  }[];
}

export function useCompanyUsers(companyId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['company-users', companyId],
    queryFn: async () => {
      if (!user || !companyId) {
        console.log('useCompanyUsers: user ou companyId não definidos', { user: !!user, companyId });
        return [];
      }
      
      console.log('Buscando usuários da empresa:', companyId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          user_type,
          user_companies!user_companies_user_id_fkey(
            is_active,
            joined_at
          ),
          user_roles!user_roles_user_id_fkey(
            role_id,
            roles!user_roles_role_id_fkey(
              name,
              description
            )
          ),
          user_departments!user_departments_user_id_fkey(
            departments!user_departments_department_id_fkey(
              name,
              description
            )
          )
        `)
        .eq('user_companies.company_id', companyId)
        .eq('user_companies.is_active', true)
        .eq('user_roles.company_id', companyId);
      
      console.log('Resultado da query de usuários:', { data, error });
      
      if (error) {
        console.error('Erro na query de usuários:', error);
        throw error;
      }
      
      // Transformar os dados para o formato esperado
      const users: CompanyUser[] = (data || []).map(user => ({
        ...user,
        is_active: user.user_companies[0]?.is_active || false
      }));
      
      console.log('Usuários encontrados:', users.length);
      return users;
    },
    enabled: !!user && !!companyId,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      companyId, 
      roleId 
    }: { 
      userId: string; 
      companyId: string; 
      roleId: string; 
    }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Atualizando papel do usuário:', { userId, companyId, roleId });
      
      // Com a nova constraint única, fazemos um upsert
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          company_id: companyId,
          role_id: roleId,
          assigned_by: user.id,
        }, {
          onConflict: 'user_id,company_id'
        });
      
      if (error) {
        console.error('Erro ao atualizar papel:', error);
        throw error;
      }
      
      console.log('Papel atualizado com sucesso');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company-users', variables.companyId] });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      companyId, 
      isActive 
    }: { 
      userId: string; 
      companyId: string; 
      isActive: boolean; 
    }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Alterando status do usuário:', { userId, companyId, isActive });
      
      const { error } = await supabase
        .from('user_companies')
        .update({ is_active: isActive })
        .eq('user_id', userId)
        .eq('company_id', companyId);
      
      if (error) {
        console.error('Erro ao alterar status:', error);
        throw error;
      }
      
      console.log('Status alterado com sucesso');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company-users', variables.companyId] });
    },
  });
}
