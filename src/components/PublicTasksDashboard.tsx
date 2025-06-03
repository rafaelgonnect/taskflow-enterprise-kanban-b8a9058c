
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePublicCompanyTasks, useAcceptPublicTask } from '@/hooks/usePublicTasks';
import { useToast } from '@/hooks/use-toast';
import { Building, Calendar, Clock, User } from 'lucide-react';
import { Task } from '@/hooks/useTasks';

interface PublicTasksDashboardProps {
  companyId: string;
}

export const PublicTasksDashboard = ({ companyId }: PublicTasksDashboardProps) => {
  const { toast } = useToast();
  const { data: companyTasks = [] } = usePublicCompanyTasks(companyId);
  const acceptTask = useAcceptPublicTask();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const handleAcceptTask = async (task: Task) => {
    try {
      await acceptTask.mutateAsync(task.id);
      
      toast({
        title: 'Tarefa aceita!',
        description: `Você aceitou a tarefa "${task.title}" e ela foi movida para suas tarefas pessoais`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao aceitar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (companyTasks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Building className="w-5 h-5 text-purple-600" />
          Tarefas Empresariais Disponíveis
          <Badge variant="secondary" className="ml-auto">
            {companyTasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {companyTasks.slice(0, 5).map((task) => (
            <div key={task.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-slate-900 truncate">{task.title}</h4>
                    <Badge className={getPriorityColor(task.priority)}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      Empresarial
                    </span>
                    {task.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.due_date).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    {task.estimated_hours && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.estimated_hours}h
                      </span>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-1 text-sm text-purple-600 mb-2">
                    <User className="w-4 h-4" />
                    <span>Disponível</span>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => handleAcceptTask(task)}
                  disabled={acceptTask.isPending}
                  className="ml-3 shrink-0"
                >
                  {acceptTask.isPending ? 'Aceitando...' : 'Aceitar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {companyTasks.length === 5 && (
          <div className="text-center mt-4">
            <Button variant="outline" size="sm">
              Ver todas as tarefas empresariais
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
