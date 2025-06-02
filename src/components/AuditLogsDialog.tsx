
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuditLogs, AuditLog } from '@/hooks/useAuditLogs';
import { FileText, User, Shield, Clock } from 'lucide-react';

interface AuditLogsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

const ACTION_LABELS: Record<string, string> = {
  'role_assigned': 'Papel Atribuído',
  'role_updated': 'Papel Atualizado',
  'role_removed': 'Papel Removido',
  'user_created': 'Usuário Criado',
  'user_updated': 'Usuário Atualizado',
  'user_deactivated': 'Usuário Desativado',
};

const ACTION_COLORS: Record<string, string> = {
  'role_assigned': 'bg-green-100 text-green-700 border-green-200',
  'role_updated': 'bg-blue-100 text-blue-700 border-blue-200',
  'role_removed': 'bg-red-100 text-red-700 border-red-200',
  'user_created': 'bg-purple-100 text-purple-700 border-purple-200',
  'user_updated': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'user_deactivated': 'bg-gray-100 text-gray-700 border-gray-200',
};

export const AuditLogsDialog = ({ isOpen, onClose, companyId }: AuditLogsDialogProps) => {
  const { data: logs = [], isLoading } = useAuditLogs(companyId);

  const formatLogDetails = (log: AuditLog) => {
    if (log.action.includes('role')) {
      const values = log.new_values || log.old_values;
      return `Usuário: ${values?.user_id} | Papel: ${values?.role_id}`;
    }
    return 'Detalhes não disponíveis';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Logs de Auditoria
          </DialogTitle>
          <DialogDescription>
            Histórico de alterações e ações realizadas na empresa
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-slate-600">Carregando logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Nenhum log de auditoria encontrado</p>
            </div>
          ) : (
            logs.map((log) => (
              <Card key={log.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-700'}>
                        <Shield className="w-3 h-3 mr-1" />
                        {ACTION_LABELS[log.action] || log.action}
                      </Badge>
                      <span className="text-sm text-slate-500">
                        Tipo: {log.target_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </div>
                  </div>

                  <div className="text-sm text-slate-600 mb-2">
                    {formatLogDetails(log)}
                  </div>

                  {(log.old_values || log.new_values) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {log.old_values && (
                        <div>
                          <span className="font-medium text-red-600">Valores Anteriores:</span>
                          <pre className="bg-red-50 p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(log.old_values, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.new_values && (
                        <div>
                          <span className="font-medium text-green-600">Novos Valores:</span>
                          <pre className="bg-green-50 p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(log.new_values, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
