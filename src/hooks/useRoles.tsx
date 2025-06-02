
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Role {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  is_system_role?: boolean;
  company_id: string;
  created_at: string;
  color?: string;
  icon?: string;
  max_users?: number;
  role_permissions: {
    permission: string;
  }[];
}

export function useRoles(companyId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['roles', companyId],
    queryFn: async () => {
      if (!user || !companyId) {
        console.log('useRoles: user ou companyId não definidos');
        return [];
      }
      
      console.log('Buscando papéis da empresa:', companyId);
      
      const { data, error } = await supabase
        .from('roles')
        .select(`
          id,
          name,
          description,
          is_default,
          is_system_role,
          company_id,
          created_at,
          color,
          icon,
          max_users,
          role_permissions(
            permission
          )
        `)
        .eq('company_id', companyId)
        .order('name');
      
      if (error) {
        console.error('Erro ao buscar papéis:', error);
        throw error;
      }
      
      console.log('Papéis encontrados:', data?.length || 0);
      return data || [];
    },
    enabled: !!user && !!companyId,
  });
}
