
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Department {
  id: string;
  name: string;
  description: string | null;
  company_id: string;
  manager_id: string | null;
  created_at: string;
  updated_at: string;
  manager?: {
    id: string;
    full_name: string;
    email: string;
  } | null;
}

export function useDepartments(companyId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['departments', companyId],
    queryFn: async () => {
      if (!user || !companyId) {
        console.log('useDepartments: user ou companyId não definidos');
        return [];
      }
      
      console.log('Buscando departamentos da empresa:', companyId);
      
      const { data, error } = await supabase
        .from('departments')
        .select(`
          id,
          name,
          description,
          company_id,
          manager_id,
          created_at,
          updated_at,
          manager:profiles!departments_manager_id_fkey(
            id,
            full_name,
            email
          )
        `)
        .eq('company_id', companyId)
        .order('name');
      
      if (error) {
        console.error('Erro ao buscar departamentos:', error);
        throw error;
      }
      
      console.log('Departamentos encontrados:', data?.length || 0);
      return data || [];
    },
    enabled: !!user && !!companyId,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      name, 
      description, 
      companyId,
      managerId
    }: { 
      name: string; 
      description?: string; 
      companyId: string; 
      managerId?: string;
    }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('departments')
        .insert({
          name,
          description,
          company_id: companyId,
          manager_id: managerId || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments', variables.companyId] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      id,
      name, 
      description, 
      companyId,
      managerId
    }: { 
      id: string;
      name: string; 
      description?: string; 
      companyId: string; 
      managerId?: string;
    }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('departments')
        .update({
          name,
          description,
          manager_id: managerId || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments', variables.companyId] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      companyId 
    }: { 
      id: string; 
      companyId: string; 
    }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments', variables.companyId] });
    },
  });
}

export function useAssignUserToDepartment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      departmentId, 
      companyId 
    }: { 
      userId: string; 
      departmentId: string; 
      companyId: string; 
    }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('user_departments')
        .upsert({
          user_id: userId,
          department_id: departmentId,
          company_id: companyId,
        }, {
          onConflict: 'user_id,company_id'
        });
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments', variables.companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-users', variables.companyId] });
    },
  });
}
