
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company, UserCompany } from '@/types/database';
import { useAuth } from './useAuth';

export function useCompanies() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['companies', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_companies')
        .select(`
          *,
          companies (*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (error) throw error;
      
      return data?.map((uc: any) => uc.companies) || [];
    },
    enabled: !!user,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      // Criar a empresa
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name,
          description,
          owner_id: user.id,
        })
        .select()
        .single();
      
      if (companyError) throw companyError;
      
      // Criar relacionamento usuário-empresa
      const { error: userCompanyError } = await supabase
        .from('user_companies')
        .insert({
          user_id: user.id,
          company_id: company.id,
        });
      
      if (userCompanyError) throw userCompanyError;
      
      // Criar papéis padrão para a empresa
      const { error: rolesError } = await supabase.rpc('create_default_roles', {
        _company_id: company.id
      });
      
      if (rolesError) throw rolesError;
      
      // Atribuir papel de Admin ao criador da empresa
      const { data: adminRole } = await supabase
        .from('roles')
        .select('id')
        .eq('company_id', company.id)
        .eq('name', 'Admin')
        .single();
      
      if (adminRole) {
        await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            company_id: company.id,
            role_id: adminRole.id,
          });
      }
      
      // Atualizar tipo do usuário para company_owner
      await supabase
        .from('profiles')
        .update({ user_type: 'company_owner' })
        .eq('id', user.id);
      
      return company;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}
