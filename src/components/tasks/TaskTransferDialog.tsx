
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCreateTransfer } from '@/hooks/useTaskTransfers';
import { useCompanyUsers } from '@/hooks/useCompanyUsers';
import { Task } from '@/hooks/useTasks';
import { UserCheck, ArrowRight } from 'lucide-react';

interface TaskTransferDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

export const TaskTransferDialog = ({ task, isOpen, onClose, companyId }: TaskTransferDialogProps) => {
  const { toast } = useToast();
  const [transferType, setTransferType] = useState<'delegation' | 'transfer'>('delegation');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [reason, setReason] = useState('');
  
  const { data: companyUsers = [] } = useCompanyUsers(companyId);
  const createTransfer = useCreateTransfer();

  const handleSubmit = async () => {
    if (!task || !selectedUserId) {
      toast({
        title: 'Erro',
        description: 'Selecione um usuário para a transferência',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createTransfer.mutateAsync({
        taskId: task.id,
        toUserId: selectedUserId,
        transferType,
        reason: reason || undefined,
      });

      const actionLabel = transferType === 'delegation' ? 'delegação' : 'transferência';
      toast({
        title: `Solicitação de ${actionLabel} enviada!`,
        description: `A ${actionLabel} da tarefa "${task.title}" foi solicitada com sucesso`,
      });

      onClose();
      setSelectedUserId('');
      setReason('');
      setTransferType('delegation');
    } catch (error: any) {
      toast({
        title: 'Erro ao solicitar transferência',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (!task) return null;

  // Filtrar usuários para não incluir o usuário atual
  const availableUsers = companyUsers.filter(user => 
    user.user_id !== task.assignee_id && user.user_id !== task.created_by
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-blue-600" />
            {transferType === 'delegation' ? 'Delegar Tarefa' : 'Transferir Tarefa'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Tarefa</h4>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="font-medium">{task.title}</p>
              {task.description && (
                <p className="text-sm text-slate-600 mt-1">{task.description}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tipo de Ação</label>
            <Select value={transferType} onValueChange={(value: 'delegation' | 'transfer') => setTransferType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delegation">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">Delegação</Badge>
                    <span>Manter responsabilidade original</span>
                  </div>
                </SelectItem>
                <SelectItem value="transfer">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">Transferência</Badge>
                    <span>Transferir responsabilidade total</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              {transferType === 'delegation' 
                ? 'A tarefa será delegada mas você mantém a responsabilidade principal'
                : 'A responsabilidade da tarefa será completamente transferida'
              }
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Usuário Destinatário</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.user_id} value={user.user_id}>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      {user.profiles?.full_name || user.profiles?.email}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Motivo {transferType === 'delegation' ? 'da delegação' : 'da transferência'} (opcional)
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Descreva o motivo da ${transferType === 'delegation' ? 'delegação' : 'transferência'}...`}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!selectedUserId || createTransfer.isPending}
              className="flex-1"
            >
              {createTransfer.isPending 
                ? 'Enviando...' 
                : `Solicitar ${transferType === 'delegation' ? 'Delegação' : 'Transferência'}`
              }
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
