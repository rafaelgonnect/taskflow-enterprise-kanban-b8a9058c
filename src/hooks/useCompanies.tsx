
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
      
      console.log('=== INICIANDO CRIAÇÃO DE EMPRESA ===');
      console.log('Dados:', { name, description, owner_id: user.id });
      console.log('Usuário atual:', user);
      
      try {
        // Verificar se o usuário está autenticado corretamente
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Erro ao verificar sessão:', sessionError);
          throw new Error('Erro de autenticação');
        }
        
        if (!session) {
          console.error('Sessão não encontrada');
          throw new Error('Usuário não está logado');
        }
        
        console.log('Sessão válida encontrada:', session.user.id);
        
        // Verificar/criar perfil do usuário primeiro
        console.log('1. Verificando perfil do usuário...');
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Erro ao verificar perfil:', profileError);
          throw new Error('Erro ao verificar perfil do usuário');
        }
        
        if (!existingProfile) {
          console.log('Perfil não encontrado, criando perfil...');
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || 'Usuário',
              user_type: 'company_owner'
            });
          
          if (createProfileError) {
            console.error('Erro ao criar perfil:', createProfileError);
            throw new Error('Erro ao criar perfil do usuário: ' + createProfileError.message);
          }
          
          console.log('✅ Perfil criado com sucesso');
        } else {
          console.log('✅ Perfil já existe:', existingProfile);
        }
        
        // Criar a empresa
        console.log('2. Criando empresa...');
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: name.trim(),
            description: description?.trim() || null,
            owner_id: user.id,
          })
          .select()
          .single();
        
        if (companyError) {
          console.error('Erro detalhado ao criar empresa:', companyError);
          throw new Error('Erro ao criar empresa: ' + companyError.message);
        }
        
        console.log('✅ Empresa criada:', company);
        
        // Criar relacionamento usuário-empresa
        console.log('3. Criando relacionamento usuário-empresa...');
        const { error: userCompanyError } = await supabase
          .from('user_companies')
          .insert({
            user_id: user.id,
            company_id: company.id,
            is_active: true
          });
        
        if (userCompanyError) {
          console.error('Erro ao criar relacionamento usuário-empresa:', userCompanyError);
          throw new Error('Erro ao associar usuário à empresa: ' + userCompanyError.message);
        }
        
        console.log('✅ Relacionamento usuário-empresa criado');
        
        // Criar papéis padrão para a empresa
        console.log('4. Criando papéis padrão...');
        const { error: rolesError } = await supabase.rpc('create_default_roles', {
          _company_id: company.id
        });
        
        if (rolesError) {
          console.error('Erro ao criar papéis padrão:', rolesError);
          // Não falhar aqui, apenas avisar
          console.warn('Papéis padrão não foram criados, mas empresa foi criada com sucesso');
        } else {
          console.log('✅ Papéis padrão criados');
        }
        
        // Buscar e atribuir papel de Admin
        console.log('5. Buscando papel de Admin...');
        const { data: adminRole, error: adminRoleError } = await supabase
          .from('roles')
          .select('id')
          .eq('company_id', company.id)
          .eq('name', 'Admin')
          .maybeSingle();
        
        if (adminRoleError) {
          console.error('Erro ao buscar papel de admin:', adminRoleError);
          console.warn('Papel de admin não encontrado, mas empresa foi criada');
        } else if (adminRole) {
          console.log('Papel de Admin encontrado:', adminRole.id);
          
          // Atribuir papel de Admin
          console.log('6. Atribuindo papel de Admin...');
          const { error: userRoleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: user.id,
              company_id: company.id,
              role_id: adminRole.id,
            });
          
          if (userRoleError) {
            console.error('Erro ao atribuir papel de admin:', userRoleError);
            console.warn('Papel de admin não foi atribuído, mas empresa foi criada');
          } else {
            console.log('✅ Papel de admin atribuído');
          }
        }
        
        // Atualizar tipo do usuário para company_owner
        console.log('7. Atualizando tipo do usuário...');
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ user_type: 'company_owner' })
          .eq('id', user.id);
        
        if (profileUpdateError) {
          console.error('Aviso: Erro ao atualizar tipo do usuário:', profileUpdateError);
          // Não falhar aqui, pois não é crítico
        } else {
          console.log('✅ Tipo do usuário atualizado para company_owner');
        }
        
        console.log('=== EMPRESA CRIADA COM SUCESSO! ===');
        console.log('Empresa final:', company);
        
        return company;
        
      } catch (error: any) {
        console.error('=== ERRO DURANTE CRIAÇÃO DA EMPRESA ===');
        console.error('Erro completo:', error);
        console.error('Stack trace:', error.stack);
        
        // Re-throw com mensagem mais clara
        if (error.message?.includes('row-level security')) {
          throw new Error('Erro de permissão: Verifique se você está logado corretamente');
        }
        
        throw error;
      }
    },
    onSuccess: (company) => {
      console.log('✅ Mutação bem-sucedida, invalidando queries...');
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error: any) => {
      console.error('❌ Erro na mutação de criação de empresa:', error);
    },
  });
}
