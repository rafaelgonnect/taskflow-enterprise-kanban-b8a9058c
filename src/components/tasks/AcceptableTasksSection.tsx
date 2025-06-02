
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar } from 'lucide-react';
import { Task } from '@/hooks/useTasks';
import { useAcceptPublicTask } from '@/hooks/usePublicTasks';
import { useToast } from '@/hooks/use-toast';
import { TaskOriginBadge } from './TaskOriginBadge';

interface AcceptableTasksSectionProps {
  tasks: Task[];
  title: string;
  emptyMessage?: string;
}

export const AcceptableTasksSection = ({ 
  tasks, 
  title, 
  emptyMessage = "Nenhuma tarefa disponível" 
}: AcceptableTasksSectionProps) => {
  const { toast } = useToast();
  const acceptTask = useAcceptPublicTask();

  const handleAcceptTask = async (taskId: string, taskTitle: string) => {
    try {
      await acceptTask.mutateAsync(taskId);
      toast({
        title: 'Tarefa aceita!',
        description: `Você aceitou a tarefa "${taskTitle}"`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao aceitar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

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

  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            <p>{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {title}
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-sm">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 mb-2">{task.title}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <TaskOriginBadge task={task} />
                        <Badge className={getPriorityColor(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAcceptTask(task.id, task.title)}
                      disabled={acceptTask.isPending}
                      size="sm"
                    >
                      {acceptTask.isPending ? 'Aceitando...' : 'Aceitar'}
                    </Button>
                  </div>

                  {task.description && (
                    <p className="text-sm text-slate-600">{task.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    
                    {task.estimated_hours && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{task.estimated_hours}h estimado</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>Público</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
