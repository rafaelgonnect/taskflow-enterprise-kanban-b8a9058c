
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
      const { data, error } = await supabase
        .from('task_history')
        .select(`
          *,
          profiles!task_history_changed_by_fkey(full_name)
        `)
        .eq('task_id', taskId)
        .order('changed_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(history => ({
        ...history,
        user_name: history.profiles?.full_name || 'Sistema'
      })) as TaskHistory[];
    },
    enabled: !!taskId,
  });
}
