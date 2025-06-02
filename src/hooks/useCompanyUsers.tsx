
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CompanyUser {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
  user_companies: {
    is_active: boolean;
    joined_at: string;
  }[];
  user_roles: {
    roles: {
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
      
      // Primeiro, vamos verificar se existem user_companies para esta empresa
      const { data: userCompaniesData, error: userCompaniesError } = await supabase
        .from('user_companies')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true);
      
      console.log('user_companies encontrados:', userCompaniesData);
      if (userCompaniesError) {
        console.error('Erro ao buscar user_companies:', userCompaniesError);
      }
      
      // Query corrigida - especificando os relacionamentos corretamente
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
      
      console.log('Usuários encontrados:', data?.length || 0);
      return data || [];
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
      
      // Remover papel atual
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('company_id', companyId);
      
      // Adicionar novo papel
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          company_id: companyId,
          role_id: roleId,
        });
      
      if (error) throw error;
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
      
      const { error } = await supabase
        .from('user_companies')
        .update({ is_active: isActive })
        .eq('user_id', userId)
        .eq('company_id', companyId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company-users', variables.companyId] });
    },
  });
}
