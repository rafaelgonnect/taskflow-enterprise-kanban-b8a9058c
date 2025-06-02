
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  old_values: any;
  new_values: any;
  ip_address: unknown | null;
  user_agent: string | null;
  company_id: string;
  created_at: string;
}

export function useAuditLogs(companyId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['audit-logs', companyId],
    queryFn: async () => {
      if (!user || !companyId) {
        console.log('useAuditLogs: user ou companyId não definidos');
        return [];
      }
      
      console.log('Buscando logs de auditoria da empresa:', companyId);
      
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('Erro ao buscar logs de auditoria:', error);
        throw error;
      }
      
      console.log('Logs de auditoria encontrados:', data?.length || 0);
      return data || [];
    },
    enabled: !!user && !!companyId,
  });
}
