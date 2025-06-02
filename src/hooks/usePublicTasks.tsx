
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Task } from './useTasks';

export function useDepartmentTasks(departmentId?: string) {
  return useQuery({
    queryKey: ['department-tasks', departmentId],
    queryFn: async () => {
      if (!departmentId) return [];
      
      console.log('Buscando tarefas departamentais:', departmentId);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('department_id', departmentId)
        .eq('task_type', 'department')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar tarefas departamentais:', error);
        throw error;
      }
      
      const tasks: Task[] = (data || []).map(task => ({
        ...task,
        status: task.status as 'todo' | 'in_progress' | 'done',
        priority: task.priority as 'high' | 'medium' | 'low',
        task_type: task.task_type as 'personal' | 'department' | 'company'
      }));
      
      console.log('Tarefas departamentais encontradas:', tasks);
      return tasks;
    },
    enabled: !!departmentId,
  });
}

export function useCompanyTasks(companyId?: string) {
  return useQuery({
    queryKey: ['company-tasks', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      console.log('Buscando tarefas empresariais:', companyId);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('company_id', companyId)
        .eq('task_type', 'company')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar tarefas empresariais:', error);
        throw error;
      }
      
      const tasks: Task[] = (data || []).map(task => ({
        ...task,
        status: task.status as 'todo' | 'in_progress' | 'done',
        priority: task.priority as 'high' | 'medium' | 'low',
        task_type: task.task_type as 'personal' | 'department' | 'company'
      }));
      
      console.log('Tarefas empresariais encontradas:', tasks);
      return tasks;
    },
    enabled: !!companyId,
  });
}

export function usePublicDepartmentTasks(departmentId?: string) {
  return useQuery({
    queryKey: ['public-department-tasks', departmentId],
    queryFn: async () => {
      if (!departmentId) return [];
      
      console.log('Buscando tarefas departamentais públicas:', departmentId);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('department_id', departmentId)
        .eq('task_type', 'department')
        .eq('is_public', true)
        .is('assignee_id', null)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar tarefas departamentais públicas:', error);
        throw error;
      }
      
      const tasks: Task[] = (data || []).map(task => ({
        ...task,
        status: task.status as 'todo' | 'in_progress' | 'done',
        priority: task.priority as 'high' | 'medium' | 'low',
        task_type: task.task_type as 'personal' | 'department' | 'company'
      }));
      
      console.log('Tarefas departamentais públicas encontradas:', tasks);
      return tasks;
    },
    enabled: !!departmentId,
  });
}

export function usePublicCompanyTasks(companyId?: string) {
  return useQuery({
    queryKey: ['public-company-tasks', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      console.log('Buscando tarefas empresariais públicas:', companyId);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('company_id', companyId)
        .eq('task_type', 'company')
        .eq('is_public', true)
        .is('assignee_id', null)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar tarefas empresariais públicas:', error);
        throw error;
      }
      
      const tasks: Task[] = (data || []).map(task => ({
        ...task,
        status: task.status as 'todo' | 'in_progress' | 'done',
        priority: task.priority as 'high' | 'medium' | 'low',
        task_type: task.task_type as 'personal' | 'department' | 'company'
      }));
      
      console.log('Tarefas empresariais públicas encontradas:', tasks);
      return tasks;
    },
    enabled: !!companyId,
  });
}

export function useAcceptPublicTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskId: string) => {
      console.log('Aceitando tarefa pública:', taskId);
      
      const { data, error } = await supabase.rpc('accept_public_task', {
        task_id_param: taskId
      });
      
      if (error || !data) {
        console.error('Erro ao aceitar tarefa:', error);
        throw new Error('Não foi possível aceitar a tarefa');
      }
      
      console.log('Tarefa aceita com sucesso');
      return data;
    },
    onSuccess: () => {
      // Invalidar múltiplas queries
      queryClient.invalidateQueries({ queryKey: ['personal-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['department-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['company-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['public-department-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['public-company-tasks'] });
    },
  });
}
