
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Permission } from '@/types/database';

export interface UserPermission {
  permission: Permission;
  role_name: string;
  role_id: string;
}

export function usePermissions(companyId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-permissions', user?.id, companyId],
    queryFn: async () => {
      if (!user || !companyId) {
        console.log('usePermissions: user ou companyId não definidos');
        return [];
      }
      
      console.log('Buscando permissões do usuário:', user.id, 'na empresa:', companyId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles!user_roles_role_id_fkey(
            name,
            role_permissions(
              permission
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('company_id', companyId);
      
      if (error) {
        console.error('Erro ao buscar permissões:', error);
        throw error;
      }
      
      // Transformar os dados para lista de permissões
      const permissions: UserPermission[] = [];
      
      data?.forEach(userRole => {
        if (userRole.roles) {
          userRole.roles.role_permissions.forEach(rp => {
            permissions.push({
              permission: rp.permission as Permission,
              role_name: userRole.roles.name,
              role_id: userRole.role_id,
            });
          });
        }
      });
      
      console.log('Permissões encontradas:', permissions);
      return permissions;
    },
    enabled: !!user && !!companyId,
  });
}

export function useHasPermission(permission: Permission, companyId?: string) {
  const { data: permissions = [] } = usePermissions(companyId);
  
  return permissions.some(p => p.permission === permission);
}

export function useHasAnyPermission(permissionList: Permission[], companyId?: string) {
  const { data: permissions = [] } = usePermissions(companyId);
  
  return permissionList.some(permission => 
    permissions.some(p => p.permission === permission)
  );
}

export function useHasAllPermissions(permissionList: Permission[], companyId?: string) {
  const { data: permissions = [] } = usePermissions(companyId);
  
  return permissionList.every(permission => 
    permissions.some(p => p.permission === permission)
  );
}
