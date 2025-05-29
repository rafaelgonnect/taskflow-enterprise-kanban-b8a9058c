
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/database';
import { useAuth } from './useAuth';

export function useCompanies() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['companies', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('Usuário não autenticado para buscar empresas');
        return [];
      }
      
      console.log('Buscando empresas para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('user_companies')
        .select(`
          *,
          companies (*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (error) {
        console.error('Erro ao buscar empresas:', error);
        throw error;
      }
      
      const companies = data?.map((uc: any) => uc.companies).filter(Boolean) || [];
      console.log('Empresas encontradas:', companies.length);
      
      return companies;
    },
    enabled: !!user,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log('Criando empresa:', { name, description, owner_id: user.id });
      
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
      
      if (companyError) {
        console.error('Erro ao criar empresa:', companyError);
        throw companyError;
      }
      
      console.log('Empresa criada:', company);
      
      // Criar relacionamento usuário-empresa
      const { error: userCompanyError } = await supabase
        .from('user_companies')
        .insert({
          user_id: user.id,
          company_id: company.id,
        });
      
      if (userCompanyError) {
        console.error('Erro ao criar relacionamento usuário-empresa:', userCompanyError);
        throw userCompanyError;
      }
      
      console.log('Relacionamento usuário-empresa criado');
      
      // Criar papéis padrão para a empresa
      const { error: rolesError } = await supabase.rpc('create_default_roles', {
        _company_id: company.id
      });
      
      if (rolesError) {
        console.error('Erro ao criar papéis padrão:', rolesError);
        throw rolesError;
      }
      
      console.log('Papéis padrão criados');
      
      // Atribuir papel de Admin ao criador da empresa
      const { data: adminRole, error: adminRoleError } = await supabase
        .from('roles')
        .select('id')
        .eq('company_id', company.id)
        .eq('name', 'Admin')
        .single();
      
      if (adminRoleError) {
        console.error('Erro ao buscar papel de admin:', adminRoleError);
        throw adminRoleError;
      }
      
      if (adminRole) {
        const { error: userRoleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            company_id: company.id,
            role_id: adminRole.id,
          });
        
        if (userRoleError) {
          console.error('Erro ao atribuir papel de admin:', userRoleError);
          throw userRoleError;
        }
        
        console.log('Papel de admin atribuído');
      }
      
      // Atualizar tipo do usuário para company_owner
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ user_type: 'company_owner' })
        .eq('id', user.id);
      
      if (profileUpdateError) {
        console.error('Erro ao atualizar tipo do usuário:', profileUpdateError);
        // Não fazer throw aqui, pois não é crítico
      } else {
        console.log('Tipo do usuário atualizado para company_owner');
      }
      
      return company;
    },
    onSuccess: () => {
      console.log('Empresa criada com sucesso, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error) => {
      console.error('Erro na mutação de criação de empresa:', error);
    },
  });
}
