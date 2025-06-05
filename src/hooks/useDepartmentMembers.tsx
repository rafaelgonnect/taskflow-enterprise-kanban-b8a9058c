
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface DepartmentMember {
  id: string;
  department_id: string;
  user_id: string;
  added_by: string;
  added_at: string;
  is_active: boolean;
  user_name?: string;
  user_email?: string;
  department_name?: string;
}

export function useDepartmentMembers(departmentId?: string) {
  return useQuery({
    queryKey: ['department-members', departmentId],
    queryFn: async () => {
      if (!departmentId) return [];
      
      console.log('Buscando membros do departamento:', departmentId);
      
      const { data: members, error } = await supabase
        .from('department_members')
        .select('*')
        .eq('department_id', departmentId)
        .eq('is_active', true)
        .order('added_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar membros:', error);
        throw error;
      }

      if (!members || members.length === 0) {
        console.log('Nenhum membro encontrado');
        return [];
      }

      // Buscar informações dos usuários
      const userIds = [...new Set(members.map(m => m.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      const profilesMap = (profiles || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>);

      const result = members.map(member => ({
        ...member,
        user_name: profilesMap[member.user_id]?.full_name || 'Usuário desconhecido',
        user_email: profilesMap[member.user_id]?.email || ''
      })) as DepartmentMember[];
      
      console.log('Membros processados:', result);
      return result;
    },
    enabled: !!departmentId,
  });
}

// Nova função para buscar todos os departamentos de um usuário
export function useUserDepartments() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-departments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('Buscando departamentos do usuário:', user.id);
      
      const { data: departmentMembers, error } = await supabase
        .from('department_members')
        .select(`
          *,
          departments:department_id (
            id,
            name,
            description,
            company_id
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (error) {
        console.error('Erro ao buscar departamentos do usuário:', error);
        throw error;
      }
      
      console.log('Departamentos encontrados:', departmentMembers);
      
      return departmentMembers || [];
    },
    enabled: !!user?.id,
  });
}

export function useAddDepartmentMember() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ departmentId, userId }: { departmentId: string; userId: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Adicionando membro ao departamento:', { departmentId, userId });
      
      const { data, error } = await supabase
        .from('department_members')
        .insert({
          department_id: departmentId,
          user_id: userId,
          added_by: user.id,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao adicionar membro:', error);
        throw error;
      }
      
      console.log('Membro adicionado com sucesso:', data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['department-members', variables.departmentId] });
      queryClient.invalidateQueries({ queryKey: ['user-departments'] });
    },
  });
}

export function useRemoveDepartmentMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ memberId, departmentId }: { memberId: string; departmentId: string }) => {
      console.log('Removendo membro do departamento:', { memberId });
      
      const { error } = await supabase
        .from('department_members')
        .update({ is_active: false })
        .eq('id', memberId);
      
      if (error) {
        console.error('Erro ao remover membro:', error);
        throw error;
      }
      
      console.log('Membro removido com sucesso');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['department-members', variables.departmentId] });
      queryClient.invalidateQueries({ queryKey: ['user-departments'] });
    },
  });
}
