
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useStartTimer() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ taskId, companyId }: { taskId: string; companyId: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Iniciando timer:', { taskId, userId: user.id });
      const now = new Date().toISOString();
      
      // Atualizar a tarefa para indicar que o timer está rodando
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          is_timer_running: true,
          current_timer_start: now,
        })
        .eq('id', taskId)
        .eq('company_id', companyId);
      
      if (taskError) {
        console.error('Erro ao atualizar tarefa:', taskError);
        throw taskError;
      }
      
      // Criar novo log de tempo
      const { data, error } = await supabase
        .from('task_time_logs')
        .insert({
          task_id: taskId,
          user_id: user.id,
          started_at: now,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar log de tempo:', error);
        throw error;
      }

      // Criar entrada no histórico para timer iniciado
      await supabase
        .from('task_history')
        .insert({
          task_id: taskId,
          action: 'timer_started',
          new_value: 'Timer iniciado',
          changed_by: user.id,
        });
      
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
    mutationFn: async ({ taskId, companyId, description }: { taskId: string; companyId: string; description?: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Parando timer:', { taskId, userId: user.id });
      const now = new Date().toISOString();
      
      // Buscar o log de tempo mais recente não finalizado
      const { data: timeLog, error: timeLogError } = await supabase
        .from('task_time_logs')
        .select('*')
        .eq('task_id', taskId)
        .eq('user_id', user.id)
        .is('ended_at', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();
      
      if (timeLogError) {
        console.error('Erro ao buscar log de tempo:', timeLogError);
        throw timeLogError;
      }
      
      // Calcular duração em minutos
      const startTime = new Date(timeLog.started_at);
      const endTime = new Date(now);
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      
      // Atualizar o log de tempo
      const { error: updateLogError } = await supabase
        .from('task_time_logs')
        .update({
          ended_at: now,
          duration_minutes: durationMinutes,
          description: description || null,
        })
        .eq('id', timeLog.id);
      
      if (updateLogError) {
        console.error('Erro ao atualizar log:', updateLogError);
        throw updateLogError;
      }
      
      // Calcular tempo total
      const { data: totalTimeResult } = await supabase
        .rpc('calculate_total_time', { task_id_param: taskId });
      
      // Atualizar a tarefa
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          is_timer_running: false,
          current_timer_start: null,
          total_time_minutes: totalTimeResult || 0,
        })
        .eq('id', taskId)
        .eq('company_id', companyId);
      
      if (taskError) {
        console.error('Erro ao atualizar tarefa:', taskError);
        throw taskError;
      }

      // Criar entrada no histórico para timer pausado
      await supabase
        .from('task_history')
        .insert({
          task_id: taskId,
          action: 'timer_stopped',
          new_value: `Timer pausado (${durationMinutes} min)${description ? ` - ${description}` : ''}`,
          changed_by: user.id,
        });
      
      console.log('Timer pausado com sucesso');
      return { durationMinutes, totalTime: totalTimeResult || 0 };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['personal-tasks', variables.companyId] });
      queryClient.invalidateQueries({ queryKey: ['task-history', variables.taskId] });
    },
  });
}
