
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Permission } from '@/types/database';

export interface CreateRoleData {
  name: string;
  description?: string;
  permissions: Permission[];
  companyId: string;
  color?: string;
  icon?: string;
  maxUsers?: number;
}

export interface UpdateRoleData {
  roleId: string;
  name?: string;
  description?: string;
  permissions?: Permission[];
  companyId: string;
  color?: string;
  icon?: string;
  maxUsers?: number;
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: CreateRoleData) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Criando novo papel:', data);
      
      // Criar o papel
      const { data: role, error: roleError } = await supabase
        .from('roles')
        .insert({
          name: data.name,
          description: data.description,
          company_id: data.companyId,
          color: data.color,
          icon: data.icon,
          max_users: data.maxUsers,
          is_default: false,
          is_system_role: false,
        })
        .select()
        .single();
      
      if (roleError) {
        console.error('Erro ao criar papel:', roleError);
        throw roleError;
      }
      
      // Adicionar permissões
      if (data.permissions.length > 0) {
        const { error: permissionsError } = await supabase
          .from('role_permissions')
          .insert(
            data.permissions.map(permission => ({
              role_id: role.id,
              permission: permission as any, // Type assertion para contornar incompatibilidade temporária
            }))
          );
        
        if (permissionsError) {
          console.error('Erro ao adicionar permissões:', permissionsError);
          throw permissionsError;
        }
      }
      
      console.log('Papel criado com sucesso:', role);
      return role;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles', variables.companyId] });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: UpdateRoleData) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Atualizando papel:', data);
      
      // Atualizar informações do papel
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.color !== undefined) updateData.color = data.color;
      if (data.icon !== undefined) updateData.icon = data.icon;
      if (data.maxUsers !== undefined) updateData.max_users = data.maxUsers;
      
      if (Object.keys(updateData).length > 0) {
        const { error: roleError } = await supabase
          .from('roles')
          .update(updateData)
          .eq('id', data.roleId);
        
        if (roleError) {
          console.error('Erro ao atualizar papel:', roleError);
          throw roleError;
        }
      }
      
      // Atualizar permissões se fornecidas
      if (data.permissions !== undefined) {
        // Remover permissões existentes
        const { error: deleteError } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', data.roleId);
        
        if (deleteError) {
          console.error('Erro ao remover permissões:', deleteError);
          throw deleteError;
        }
        
        // Adicionar novas permissões
        if (data.permissions.length > 0) {
          const { error: permissionsError } = await supabase
            .from('role_permissions')
            .insert(
              data.permissions.map(permission => ({
                role_id: data.roleId,
                permission: permission as any, // Type assertion para contornar incompatibilidade temporária
              }))
            );
          
          if (permissionsError) {
            console.error('Erro ao adicionar permissões:', permissionsError);
            throw permissionsError;
          }
        }
      }
      
      console.log('Papel atualizado com sucesso');
      return data.roleId;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles', variables.companyId] });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ roleId, companyId }: { roleId: string; companyId: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Deletando papel:', roleId);
      
      // Verificar se o papel pode ser deletado
      const { data: role } = await supabase
        .from('roles')
        .select('is_default, is_system_role')
        .eq('id', roleId)
        .single();
      
      if (role?.is_default || role?.is_system_role) {
        throw new Error('Não é possível deletar papéis padrão ou do sistema');
      }
      
      // Verificar se há usuários com este papel
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role_id', roleId)
        .limit(1);
      
      if (userRoles && userRoles.length > 0) {
        throw new Error('Não é possível deletar um papel que está sendo usado por usuários');
      }
      
      // Deletar permissões do papel
      const { error: permissionsError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);
      
      if (permissionsError) {
        console.error('Erro ao deletar permissões:', permissionsError);
        throw permissionsError;
      }
      
      // Deletar o papel
      const { error: roleError } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);
      
      if (roleError) {
        console.error('Erro ao deletar papel:', roleError);
        throw roleError;
      }
      
      console.log('Papel deletado com sucesso');
      return roleId;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles', variables.companyId] });
    },
  });
}
