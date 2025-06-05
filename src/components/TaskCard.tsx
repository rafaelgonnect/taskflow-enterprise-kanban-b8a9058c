
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Task } from '@/hooks/useTasks';
import { TaskTransferDialog } from './tasks/TaskTransferDialog';
import { 
  Calendar, 
  Clock, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2, 
  Play, 
  Pause,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDetails?: (task: Task) => void;
  onTimerToggle?: (task: Task) => void;
  showOriginBadge?: boolean;
  isDragging?: boolean;
}

export const TaskCard = ({ 
  task, 
  onStatusChange, 
  onEdit, 
  onDelete, 
  onDetails,
  onTimerToggle,
  showOriginBadge = false,
  isDragging = false
}: TaskCardProps) => {
  const [showTransferDialog, setShowTransferDialog] = useState(false);

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

  const getOriginBadge = (task: Task) => {
    if (task.delegated_by) {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Delegada</Badge>;
    }
    if (task.previous_assignee_id) {
      return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Transferida</Badge>;
    }
    if (task.task_type === 'department') {
      return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Departamental</Badge>;
    }
    if (task.task_type === 'company') {
      return <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">Empresarial</Badge>;
    }
    return null;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <>
      <Card className={`transition-all duration-200 hover:shadow-md ${isDragging ? 'rotate-2 scale-105 shadow-lg' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-slate-900 truncate mb-2">{task.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getPriorityColor(task.priority)}>
                  {getPriorityLabel(task.priority)}
                </Badge>
                {showOriginBadge && getOriginBadge(task)}
                {task.is_timer_running && (
                  <Badge className="bg-green-100 text-green-700 border-green-200 animate-pulse">
                    Timer
                  </Badge>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onDetails && (
                  <DropdownMenuItem onClick={() => onDetails(task)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalhes
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                {onTimerToggle && (
                  <DropdownMenuItem onClick={() => onTimerToggle(task)}>
                    {task.is_timer_running ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pausar timer
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Iniciar timer
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowTransferDialog(true)}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Delegar/Transferir
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="space-y-2">
            {task.due_date && (
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {formatDistanceToNow(new Date(task.due_date), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </span>
              </div>
            )}
            
            {(task.total_time_minutes && task.total_time_minutes > 0) && (
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{formatTime(task.total_time_minutes)}</span>
              </div>
            )}

            {task.delegated_by && (
              <div className="flex items-center text-sm text-blue-600">
                <UserCheck className="w-4 h-4 mr-2" />
                <span>Delegada por você</span>
              </div>
            )}

            {task.previous_assignee_id && (
              <div className="flex items-center text-sm text-purple-600">
                <UserCheck className="w-4 h-4 mr-2" />
                <span>Transferida para você</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TaskTransferDialog
        task={task}
        isOpen={showTransferDialog}
        onClose={() => setShowTransferDialog(false)}
        companyId={task.company_id}
      />
    </>
  );
};
