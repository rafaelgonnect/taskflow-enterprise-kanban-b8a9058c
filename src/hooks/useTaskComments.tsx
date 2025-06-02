
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
      
      const { data: comments, error } = await supabase
        .from('task_comments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar comentários:', error);
        throw error;
      }

      if (!comments || comments.length === 0) {
        console.log('Nenhum comentário encontrado');
        return [];
      }

      // Buscar informações dos usuários separadamente
      const userIds = [...new Set(comments.map(c => c.created_by))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const profilesMap = (profiles || []).reduce((acc, profile) => {
        acc[profile.id] = profile.full_name;
        return acc;
      }, {} as Record<string, string>);

      const result = comments.map(comment => ({
        ...comment,
        user_name: profilesMap[comment.created_by] || 'Usuário desconhecido'
      })) as TaskComment[];
      
      console.log('Comentários processados:', result);
      return result;
    },
    enabled: !!taskId,
    refetchInterval: 5000, // Atualizar a cada 5 segundos
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ taskId, content }: { taskId: string; content: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Criando comentário:', { taskId, content, userId: user.id });
      
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

      console.log('Comentário criado:', data);

      // Criar entrada no histórico para o comentário
      const { error: historyError } = await supabase
        .from('task_history')
        .insert({
          task_id: taskId,
          action: 'comment_added',
          new_value: `Comentário adicionado: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
          changed_by: user.id,
        });

      if (historyError) {
        console.error('Erro ao criar histórico do comentário:', historyError);
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidar as queries para forçar atualização
      queryClient.invalidateQueries({ queryKey: ['task-comments', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-history', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['personal-tasks'] });
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
