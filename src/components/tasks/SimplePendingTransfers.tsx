
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePendingTransfers, useRespondToTransfer } from '@/hooks/useTaskTransfers';
import { useToast } from '@/hooks/use-toast';
import { Clock, ArrowRight, Check, X, UserCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const SimplePendingTransfers = () => {
  const { toast } = useToast();
  const respondToTransfer = useRespondToTransfer();
  
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [responseReason, setResponseReason] = useState('');
  const [actionType, setActionType] = useState<'accept' | 'reject'>('accept');

  // Sempre chama o hook, sem condições
  const { data: pendingTransfers = [], isLoading, error } = usePendingTransfers();

  console.log('SimplePendingTransfers render:', {
    isLoading,
    error: error?.message,
    transfersCount: pendingTransfers.length
  });

  const handleResponse = async () => {
    if (!selectedTransfer) return;

    try {
      await respondToTransfer.mutateAsync({
        transferId: selectedTransfer.id,
        action: actionType,
        responseReason: responseReason || undefined,
      });

      const actionLabel = actionType === 'accept' ? 'aceita' : 'rejeitada';
      toast({
        title: `Transferência ${actionLabel}!`,
        description: `A ${selectedTransfer.transfer_type === 'delegation' ? 'delegação' : 'transferência'} foi ${actionLabel} com sucesso`,
      });

      setShowResponseDialog(false);
      setSelectedTransfer(null);
      setResponseReason('');
    } catch (error: any) {
      console.error('Erro ao responder transferência:', error);
      toast({
        title: 'Erro ao responder transferência',
        description: error.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const openResponseDialog = (transfer: any, action: 'accept' | 'reject') => {
    setSelectedTransfer(transfer);
    setActionType(action);
    setShowResponseDialog(true);
  };

  // Se não há transferências pendentes, não renderizar nada
  if (!isLoading && !error && pendingTransfers.length === 0) {
    return null;
  }

  // Se houver erro, mostrar estado de erro
  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            Transferências Pendentes - Erro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-red-600">Erro ao carregar transferências</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Se carregando, mostrar loader
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Transferências Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-slate-500">Carregando transferências...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Transferências Pendentes
            <Badge variant="secondary" className="ml-auto">
              {pendingTransfers.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingTransfers.slice(0, 3).map((transfer) => (
              <div key={transfer.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={
                        transfer.transfer_type === 'delegation'
                          ? 'bg-blue-100 text-blue-700 border-blue-200'
                          : 'bg-purple-100 text-purple-700 border-purple-200'
                      }>
                        {transfer.transfer_type === 'delegation' ? 'Delegação' : 'Transferência'}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                    
                    <h4 className="font-medium text-slate-900 mb-1">{transfer.task_title}</h4>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <UserCheck className="w-3 h-3" />
                      <span>De: {transfer.from_user_name}</span>
                    </div>
                    
                    {transfer.reason && (
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        "{transfer.reason}"
                      </p>
                    )}
                    
                    <p className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(transfer.requested_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-3">
                    <Button
                      size="sm"
                      onClick={() => openResponseDialog(transfer, 'accept')}
                      disabled={respondToTransfer.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Aceitar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openResponseDialog(transfer, 'reject')}
                      disabled={respondToTransfer.isPending}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {pendingTransfers.length > 3 && (
            <div className="text-center mt-4">
              <Button variant="outline" size="sm">
                Ver todas as transferências ({pendingTransfers.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showResponseDialog && selectedTransfer && (
        <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {actionType === 'accept' ? 'Aceitar' : 'Rejeitar'} {' '}
                {selectedTransfer.transfer_type === 'delegation' ? 'Delegação' : 'Transferência'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Tarefa</h4>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium">{selectedTransfer.task_title}</p>
                  <p className="text-sm text-slate-600">
                    De: {selectedTransfer.from_user_name}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Motivo {actionType === 'accept' ? '(opcional)' : '(obrigatório)'}
                </label>
                <Textarea
                  value={responseReason}
                  onChange={(e) => setResponseReason(e.target.value)}
                  placeholder={`Descreva o motivo ${actionType === 'accept' ? 'para aceitar' : 'para rejeitar'}...`}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleResponse}
                  disabled={
                    respondToTransfer.isPending || 
                    (actionType === 'reject' && !responseReason.trim())
                  }
                  className={
                    actionType === 'accept' 
                      ? 'bg-green-600 hover:bg-green-700 flex-1' 
                      : 'bg-red-600 hover:bg-red-700 flex-1'
                  }
                >
                  {respondToTransfer.isPending 
                    ? 'Processando...' 
                    : (actionType === 'accept' ? 'Aceitar' : 'Rejeitar')
                  }
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowResponseDialog(false)} 
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
