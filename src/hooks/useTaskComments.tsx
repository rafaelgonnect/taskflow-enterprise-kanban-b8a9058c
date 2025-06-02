
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TaskComment {
  id: string;
  task_id: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
}

export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: ['task-comments', taskId],
    queryFn: async () => {
      console.log('Buscando comentários da tarefa:', taskId);
      
      const { data, error } = await supabase
        .from('task_comments')
        .select(`
          *,
          profiles:created_by(full_name)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });
      
      console.log('Resultado dos comentários:', { data, error });
      
      if (error) {
        console.error('Erro ao buscar comentários:', error);
        throw error;
      }
      
      return (data || []).map(comment => ({
        ...comment,
        user_name: comment.profiles?.full_name || 'Usuário desconhecido'
      })) as TaskComment[];
    },
    enabled: !!taskId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ taskId, content }: { taskId: string; content: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Criando comentário:', { taskId, content });
      
      const { data, error } = await supabase
        .from('task_comments')
        .insert({
          task_id: taskId,
          content,
          created_by: user.id,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar comentário:', error);
        throw error;
      }

      // Criar entrada no histórico para o comentário
      await supabase
        .from('task_history')
        .insert({
          task_id: taskId,
          action: 'comment_added',
          new_value: `Comentário adicionado: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
          changed_by: user.id,
        });
      
      console.log('Comentário criado com sucesso:', data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-history', variables.taskId] });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, content, taskId }: { id: string; content: string; taskId: string }) => {
      console.log('Atualizando comentário:', { id, content });
      
      const { data, error } = await supabase
        .from('task_comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar comentário:', error);
        throw error;
      }
      
      console.log('Comentário atualizado com sucesso:', data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', variables.taskId] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, taskId }: { id: string; taskId: string }) => {
      console.log('Deletando comentário:', { id });
      
      const { error } = await supabase
        .from('task_comments')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar comentário:', error);
        throw error;
      }
      
      console.log('Comentário deletado com sucesso');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', variables.taskId] });
    },
  });
}
