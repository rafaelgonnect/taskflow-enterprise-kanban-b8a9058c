
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'high' | 'medium' | 'low';
  company_id: string;
  department_id?: string;
  assignee_id?: string;
  created_by: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  estimated_hours?: number;
  actual_hours?: number;
  is_timer_running?: boolean;
  current_timer_start?: string;
  total_time_minutes?: number;
  // Relacionamentos
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  history?: TaskHistory[];
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  content: string;
  created_by: string;
  created_at: string;
  user_name?: string;
}

export interface TaskHistory {
  id: string;
  task_id: string;
  action: string;
  old_value?: string;
  new_value?: string;
  changed_by: string;
  changed_at: string;
  user_name?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  companyId: string;
  departmentId?: string;
  assigneeId?: string;
  dueDate?: string;
  estimatedHours?: number;
}

export interface UpdateTaskData extends CreateTaskData {
  id: string;
  status?: 'todo' | 'in_progress' | 'done';
  actualHours?: number;
}

// Hook para buscar tarefas pessoais do usuário
export function usePersonalTasks(companyId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['personal-tasks', companyId, user?.id],
    queryFn: async () => {
      if (!user || !companyId) {
        console.log('usePersonalTasks: user ou companyId não definidos');
        return [];
      }
      
      console.log('Buscando tarefas pessoais:', { companyId, userId: user.id });
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('company_id', companyId)
        .eq('assignee_id', user.id)
        .order('created_at', { ascending: false });
      
      console.log('Resultado da query de tarefas pessoais:', { data, error });
      
      if (error) {
        console.error('Erro na query de tarefas pessoais:', error);
        throw error;
      }
      
      // Garantir que os dados estão no tipo correto
      const tasks: Task[] = (data || []).map(task => ({
        ...task,
        status: task.status as 'todo' | 'in_progress' | 'done',
        priority: task.priority as 'high' | 'medium' | 'low'
      }));
      
      return tasks;
    },
    enabled: !!user && !!companyId,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });
}

// Hook para criar tarefa
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (taskData: CreateTaskData) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Criando tarefa:', taskData);
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          company_id: taskData.companyId,
          department_id: taskData.departmentId,
          assignee_id: taskData.assigneeId || user.id,
          created_by: user.id,
          due_date: taskData.dueDate,
          estimated_hours: taskData.estimatedHours,
          status: 'todo',
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar tarefa:', error);
        throw error;
      }
      
      console.log('Tarefa criada com sucesso:', data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['personal-tasks', variables.companyId] });
    },
  });
}

// Hook para atualizar tarefa
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (taskData: UpdateTaskData) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Atualizando tarefa:', taskData);
      
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          status: taskData.status,
          department_id: taskData.departmentId,
          assignee_id: taskData.assigneeId,
          due_date: taskData.dueDate,
          estimated_hours: taskData.estimatedHours,
          actual_hours: taskData.actualHours,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskData.id)
        .eq('company_id', taskData.companyId)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar tarefa:', error);
        throw error;
      }
      
      console.log('Tarefa atualizada com sucesso:', data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['personal-tasks', variables.companyId] });
      queryClient.invalidateQueries({ queryKey: ['task-history', variables.id] });
    },
  });
}

// Hook para deletar tarefa
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, companyId }: { id: string; companyId: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Deletando tarefa:', { id, companyId });
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('company_id', companyId);
      
      if (error) {
        console.error('Erro ao deletar tarefa:', error);
        throw error;
      }
      
      console.log('Tarefa deletada com sucesso');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['personal-tasks', variables.companyId] });
    },
  });
}

// Hook para atualizar status via drag and drop
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ taskId, newStatus, companyId }: { 
      taskId: string; 
      newStatus: 'todo' | 'in_progress' | 'done';
      companyId: string;
    }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Atualizando status da tarefa:', { taskId, newStatus });
      
      const { data, error } = await supabase
        .from('tasks')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .eq('company_id', companyId)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar status:', error);
        throw error;
      }
      
      console.log('Status atualizado com sucesso:', data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['personal-tasks', variables.companyId] });
      queryClient.invalidateQueries({ queryKey: ['task-history', variables.taskId] });
    },
  });
}
