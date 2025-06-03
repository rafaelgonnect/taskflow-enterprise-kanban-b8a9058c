
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useStartTimer() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ taskId, companyId }: { taskId: string; companyId: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Iniciando timer para tarefa:', taskId);
      
      const { data, error } = await supabase
        .from('tasks')
        .update({
          is_timer_running: true,
          current_timer_start: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .eq('company_id', companyId)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao iniciar timer:', error);
        throw error;
      }
      
      console.log('Timer iniciado com sucesso:', data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['personal-tasks', variables.companyId] });
      queryClient.invalidateQueries({ queryKey: ['task-history', variables.taskId] });
    },
  });
}

export function useStopTimer() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      taskId, 
      companyId, 
      description 
    }: { 
      taskId: string; 
      companyId: string; 
      description?: string;
    }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Parando timer para tarefa:', taskId);
      
      // Buscar dados atuais da tarefa
      const { data: currentTask } = await supabase
        .from('tasks')
        .select('current_timer_start, total_time_minutes')
        .eq('id', taskId)
        .eq('company_id', companyId)
        .single();
      
      if (!currentTask?.current_timer_start) {
        throw new Error('Timer não está rodando');
      }
      
      // Calcular tempo decorrido
      const startTime = new Date(currentTask.current_timer_start);
      const endTime = new Date();
      const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      
      // Atualizar tarefa
      const newTotalTime = (currentTask.total_time_minutes || 0) + durationMinutes;
      
      const { data, error } = await supabase
        .from('tasks')
        .update({
          is_timer_running: false,
          current_timer_start: null,
          total_time_minutes: newTotalTime,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .eq('company_id', companyId)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao parar timer:', error);
        throw error;
      }
      
      // Criar log de tempo
      const { error: logError } = await supabase
        .from('task_time_logs')
        .insert({
          task_id: taskId,
          user_id: user.id,
          started_at: startTime.toISOString(),
          ended_at: endTime.toISOString(),
          duration_minutes: durationMinutes,
          description: description || 'Sessão de trabalho',
        });
      
      if (logError) {
        console.error('Erro ao criar log de tempo:', logError);
      }
      
      console.log('Timer parado com sucesso:', data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['personal-tasks', variables.companyId] });
      queryClient.invalidateQueries({ queryKey: ['task-history', variables.taskId] });
    },
  });
}
