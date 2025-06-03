import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TaskTransfer {
  id: string;
  task_id: string;
  from_user_id?: string;
  to_user_id?: string;
  transfer_type: 'delegation' | 'transfer';
  reason?: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_by: string;
  requested_at: string;
  responded_at?: string;
  response_reason?: string;
  created_at: string;
  from_user_name?: string;
  to_user_name?: string;
  task_title?: string;
}

export interface CreateTransferData {
  taskId: string;
  toUserId: string;
  transferType: 'delegation' | 'transfer';
  reason?: string;
}

// Hook para buscar transferências pendentes para o usuário
export function usePendingTransfers() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['pending-transfers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Buscando transferências pendentes para:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('task_transfers')
          .select(`
            *,
            tasks!inner(title)
          `)
          .eq('to_user_id', user.id)
          .eq('status', 'pending')
          .order('requested_at', { ascending: false });
        
        if (error) {
          console.error('Erro ao buscar transferências pendentes:', error);
          return [];
        }
        
        if (!data || data.length === 0) {
          console.log('Nenhuma transferência pendente encontrada');
          return [];
        }
        
        // Buscar nomes dos usuários separadamente de forma segura
        const transfersWithNames = await Promise.all(data.map(async (transfer) => {
          try {
            const [fromUserResponse, toUserResponse] = await Promise.all([
              transfer.from_user_id ? supabase
                .from('profiles')
                .select('full_name')
                .eq('id', transfer.from_user_id)
                .maybeSingle() : Promise.resolve({ data: null, error: null }),
              transfer.to_user_id ? supabase
                .from('profiles')
                .select('full_name')
                .eq('id', transfer.to_user_id)
                .maybeSingle() : Promise.resolve({ data: null, error: null })
            ]);

            return {
              ...transfer,
              transfer_type: transfer.transfer_type as 'delegation' | 'transfer',
              status: transfer.status as 'pending' | 'accepted' | 'rejected',
              from_user_name: fromUserResponse.data?.full_name || 'Usuário desconhecido',
              to_user_name: toUserResponse.data?.full_name || 'Usuário desconhecido',
              task_title: transfer.tasks?.title || 'Tarefa sem título'
            };
          } catch (err) {
            console.error('Erro ao buscar dados do usuário:', err);
            return {
              ...transfer,
              transfer_type: transfer.transfer_type as 'delegation' | 'transfer',
              status: transfer.status as 'pending' | 'accepted' | 'rejected',
              from_user_name: 'Usuário desconhecido',
              to_user_name: 'Usuário desconhecido',
              task_title: transfer.tasks?.title || 'Tarefa sem título'
            };
          }
        }));
        
        console.log('Transferências pendentes encontradas:', transfersWithNames);
        return transfersWithNames;
      } catch (error) {
        console.error('Erro geral ao buscar transferências:', error);
        return [];
      }
    },
    enabled: !!user,
    refetchInterval: 30000,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar histórico de transferências
export function useTransferHistory(companyId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['transfer-history', companyId, user?.id],
    queryFn: async () => {
      if (!user || !companyId) return [];
      
      console.log('Buscando histórico de transferências:', { companyId, userId: user.id });
      
      try {
        const { data, error } = await supabase
          .from('task_transfers')
          .select(`
            *,
            tasks!inner(title, company_id)
          `)
          .eq('tasks.company_id', companyId)
          .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id},requested_by.eq.${user.id}`)
          .order('requested_at', { ascending: false });
        
        if (error) {
          console.error('Erro ao buscar histórico de transferências:', error);
          return [];
        }
        
        if (!data) return [];
        
        // Buscar nomes dos usuários separadamente de forma segura
        const transfersWithNames = await Promise.all(data.map(async (transfer) => {
          try {
            const [fromUserResponse, toUserResponse] = await Promise.all([
              transfer.from_user_id ? supabase
                .from('profiles')
                .select('full_name')
                .eq('id', transfer.from_user_id)
                .maybeSingle() : Promise.resolve({ data: null, error: null }),
              transfer.to_user_id ? supabase
                .from('profiles')
                .select('full_name')
                .eq('id', transfer.to_user_id)
                .maybeSingle() : Promise.resolve({ data: null, error: null })
            ]);

            return {
              ...transfer,
              transfer_type: transfer.transfer_type as 'delegation' | 'transfer',
              status: transfer.status as 'pending' | 'accepted' | 'rejected',
              from_user_name: fromUserResponse.data?.full_name || 'Usuário desconhecido',
              to_user_name: toUserResponse.data?.full_name || 'Usuário desconhecido',
              task_title: transfer.tasks?.title || 'Tarefa sem título'
            };
          } catch (err) {
            console.error('Erro ao buscar dados do usuário no histórico:', err);
            return {
              ...transfer,
              transfer_type: transfer.transfer_type as 'delegation' | 'transfer',
              status: transfer.status as 'pending' | 'accepted' | 'rejected',
              from_user_name: 'Usuário desconhecido',
              to_user_name: 'Usuário desconhecido',
              task_title: transfer.tasks?.title || 'Tarefa sem título'
            };
          }
        }));
        
        console.log('Histórico de transferências encontrado:', transfersWithNames);
        return transfersWithNames;
      } catch (error) {
        console.error('Erro geral ao buscar histórico:', error);
        return [];
      }
    },
    enabled: !!user && !!companyId,
    retry: 1,
  });
}

// Hook para criar uma transferência/delegação
export function useCreateTransfer() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (transferData: CreateTransferData) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Criando transferência:', transferData);
      
      // Primeiro, buscar informações da tarefa
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('assignee_id, created_by')
        .eq('id', transferData.taskId)
        .single();
      
      if (taskError || !task) {
        throw new Error('Tarefa não encontrada');
      }
      
      const { data, error } = await supabase
        .from('task_transfers')
        .insert({
          task_id: transferData.taskId,
          from_user_id: task.assignee_id || task.created_by,
          to_user_id: transferData.toUserId,
          transfer_type: transferData.transferType,
          reason: transferData.reason,
          requested_by: user.id,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar transferência:', error);
        throw error;
      }
      
      console.log('Transferência criada com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-transfers'] });
      queryClient.invalidateQueries({ queryKey: ['transfer-history'] });
    },
  });
}

// Hook para responder a uma transferência
export function useRespondToTransfer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      transferId, 
      action, 
      responseReason 
    }: { 
      transferId: string; 
      action: 'accept' | 'reject'; 
      responseReason?: string; 
    }) => {
      console.log('Respondendo à transferência:', { transferId, action, responseReason });
      
      const { data, error } = await supabase.rpc('process_task_transfer', {
        transfer_id_param: transferId,
        action_param: action,
        response_reason_param: responseReason || null
      });
      
      if (error || !data) {
        console.error('Erro ao processar transferência:', error);
        throw new Error('Não foi possível processar a transferência');
      }
      
      console.log('Transferência processada com sucesso');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-transfers'] });
      queryClient.invalidateQueries({ queryKey: ['transfer-history'] });
      queryClient.invalidateQueries({ queryKey: ['personal-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['department-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['company-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-history'] });
    },
  });
}
