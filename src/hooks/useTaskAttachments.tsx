
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
  uploaded_at: string;
  created_at: string;
}

export function useTaskAttachments(taskId: string) {
  return useQuery({
    queryKey: ['task-attachments', taskId],
    queryFn: async () => {
      console.log('Buscando anexos da tarefa:', taskId);
      
      const { data, error } = await supabase
        .from('task_attachments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });
      
      console.log('Resultado dos anexos:', { data, error });
      
      if (error) {
        console.error('Erro ao buscar anexos:', error);
        throw error;
      }
      
      return data as TaskAttachment[];
    },
    enabled: !!taskId,
  });
}

export function useUploadAttachment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ taskId, file }: { taskId: string; file: File }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Fazendo upload do anexo:', { taskId, fileName: file.name });
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${taskId}/${Date.now()}.${fileExt}`;
      
      // Upload do arquivo para o storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('task-attachments')
        .upload(fileName, file);
      
      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }
      
      // Obter URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('task-attachments')
        .getPublicUrl(fileName);
      
      // Salvar informações do anexo no banco
      const { data, error } = await supabase
        .from('task_attachments')
        .insert({
          task_id: taskId,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
          file_type: file.type,
          uploaded_by: user.id,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao salvar anexo:', error);
        throw error;
      }

      // Remover criação manual de histórico - deixar apenas o trigger do banco
      console.log('Anexo salvo com sucesso:', data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task-attachments', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-history', variables.taskId] });
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, fileName, taskId }: { id: string; fileName: string; taskId: string }) => {
      console.log('Deletando anexo:', { id, fileName });
      
      // Deletar arquivo do storage
      const { error: storageError } = await supabase.storage
        .from('task-attachments')
        .remove([fileName]);
      
      if (storageError) console.warn('Erro ao deletar arquivo do storage:', storageError);
      
      // Deletar registro do banco
      const { error } = await supabase
        .from('task_attachments')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar anexo:', error);
        throw error;
      }
      
      console.log('Anexo deletado com sucesso');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task-attachments', variables.taskId] });
    },
  });
}
