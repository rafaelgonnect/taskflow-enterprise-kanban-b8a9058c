
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TaskHistory {
  id: string;
  task_id: string;
  action: string;
  old_value?: string;
  new_value?: string;
  field_changed?: string;
  changed_by: string;
  changed_at: string;
  user_name?: string;
}

export function useTaskHistory(taskId: string) {
  return useQuery({
    queryKey: ['task-history', taskId],
    queryFn: async () => {
      console.log('Buscando histórico da tarefa:', taskId);
      
      const { data: history, error } = await supabase
        .from('task_history')
        .select('*')
        .eq('task_id', taskId)
        .order('changed_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar histórico:', error);
        throw error;
      }

      if (!history || history.length === 0) {
        console.log('Nenhum histórico encontrado');
        return [];
      }

      // Buscar informações dos usuários separadamente
      const userIds = [...new Set(history.map(h => h.changed_by))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const profilesMap = (profiles || []).reduce((acc, profile) => {
        acc[profile.id] = profile.full_name;
        return acc;
      }, {} as Record<string, string>);

      const result = history.map(entry => ({
        ...entry,
        user_name: profilesMap[entry.changed_by] || 'Sistema'
      })) as TaskHistory[];
      
      console.log('Histórico processado:', result);
      return result;
    },
    enabled: !!taskId,
    refetchInterval: 5000, // Atualizar a cada 5 segundos
  });
}
