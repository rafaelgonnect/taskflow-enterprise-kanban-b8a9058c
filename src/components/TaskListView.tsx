
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePersonalTasks, useUpdateTaskStatus } from '@/hooks/useTasks';
import { useDepartmentTasks, useCompanyTasks } from '@/hooks/usePublicTasks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Eye, Calendar, Clock } from 'lucide-react';

interface TaskListViewProps {
  companyId: string;
  userId?: string;
  departmentId?: string;
  taskType?: 'personal' | 'department' | 'company';
}

export const TaskListView = ({ companyId, userId, departmentId, taskType = 'personal' }: TaskListViewProps) => {
  // Usar o hook apropriado baseado no tipo de tarefa
  const { data: personalTasks = [], isLoading: personalLoading } = usePersonalTasks(
    taskType === 'personal' ? companyId : undefined
  );
  const { data: departmentTasks = [], isLoading: departmentLoading } = useDepartmentTasks(
    taskType === 'department' ? departmentId : undefined
  );
  const { data: companyTasks = [], isLoading: companyLoading } = useCompanyTasks(
    taskType === 'company' ? companyId : undefined
  );
  
  const updateTaskStatus = useUpdateTaskStatus();

  // Determinar quais tarefas usar
  let tasks = [];
  let isLoading = false;
  
  if (taskType === 'personal') {
    tasks = personalTasks;
    isLoading = personalLoading;
  } else if (taskType === 'department') {
    tasks = departmentTasks;
    isLoading = departmentLoading;
  } else if (taskType === 'company') {
    tasks = companyTasks;
    isLoading = companyLoading;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-slate-100 text-slate-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'A Fazer';
      case 'in_progress': return 'Em Progresso';
      case 'done': return 'Concluído';
      default: return status;
    }
  };

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    updateTaskStatus.mutate({
      taskId,
      newStatus,
      companyId
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-slate-600">Carregando tarefas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-slate-600">Nenhuma tarefa encontrada</p>
          </CardContent>
        </Card>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900 mb-2">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                  )}
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    <Select
                      value={task.status}
                      onValueChange={(value) => handleStatusChange(task.id, value as 'todo' | 'in_progress' | 'done')}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">A Fazer</SelectItem>
                        <SelectItem value="in_progress">Em Progresso</SelectItem>
                        <SelectItem value="done">Concluído</SelectItem>
                      </SelectContent>
                    </Select>

                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>

                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {getStatusLabel(task.status)}
                    </Badge>

                    {task.due_date && (
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(task.due_date).toLocaleDateString('pt-BR')}
                      </div>
                    )}

                    {task.estimated_hours && (
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        {task.estimated_hours}h estimado
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  );
};
