
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, CheckCircle } from 'lucide-react';
import { Task } from '@/hooks/useTasks';

interface TaskProgressIndicatorProps {
  task: Task;
}

export const TaskProgressIndicator = ({ task }: TaskProgressIndicatorProps) => {
  const getStatusInfo = () => {
    if (task.status === 'done') {
      return {
        label: 'Concluída',
        icon: CheckCircle,
        className: 'bg-green-100 text-green-700 border-green-200'
      };
    }
    
    if (task.status === 'in_progress') {
      return {
        label: 'Em Progresso',
        icon: Clock,
        className: 'bg-blue-100 text-blue-700 border-blue-200'
      };
    }
    
    return {
      label: 'Aguardando',
      icon: Clock,
      className: 'bg-gray-100 text-gray-700 border-gray-200'
    };
  };

  const { label, icon: Icon, className } = getStatusInfo();

  // Se a tarefa foi aceita por alguém, mostrar informações do responsável
  if (task.accepted_by && task.assignee_id) {
    return (
      <div className="flex items-center gap-2">
        <Badge className={className}>
          <Icon className="w-3 h-3 mr-1" />
          {label}
        </Badge>
        <div className="flex items-center gap-1">
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-xs">
              {task.assignee_id.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-slate-600">
            {task.accepted_at ? 
              `Aceita em ${new Date(task.accepted_at).toLocaleDateString('pt-BR')}` : 
              'Atribuída'
            }
          </span>
        </div>
      </div>
    );
  }

  // Tarefa não aceita ainda
  return (
    <Badge className="bg-slate-100 text-slate-600 border-slate-200">
      Disponível para aceitar
    </Badge>
  );
};
