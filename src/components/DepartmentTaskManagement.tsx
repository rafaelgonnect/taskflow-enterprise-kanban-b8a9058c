import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDepartmentTasks } from '@/hooks/usePublicTasks';
import { useCreateTask, useUpdateTaskStatus, Task } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';
import { TaskFormDialog } from './tasks/TaskFormDialog';
import { TaskDetailsDialog } from './TaskDetailsDialog';
import { Plus, Eye, Calendar, Clock, Users } from 'lucide-react';

interface DepartmentTaskManagementProps {
  departmentId: string;
  companyId: string;
  isManager: boolean;
  onTaskDetails?: (task: Task) => void;
}

export const DepartmentTaskManagement = ({ 
  departmentId, 
  companyId, 
  isManager, 
  onTaskDetails 
}: DepartmentTaskManagementProps) => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  const { data: tasks = [], isLoading } = useDepartmentTasks(departmentId);
  const createTask = useCreateTask();
  const updateTaskStatus = useUpdateTaskStatus();

  const handleCreateTask = async (formData: any) => {
    try {
      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        companyId: companyId,
        departmentId: departmentId,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
        taskType: 'department',
        isPublic: formData.isPublic,
      });

      toast({
        title: 'Tarefa criada!',
        description: `Tarefa "${formData.title}" criada com sucesso`,
      });

      setShowCreateDialog(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao criar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    updateTaskStatus.mutate({
      taskId,
      newStatus,
      companyId
    });
  };

  const handleViewDetails = (task: any) => {
    if (onTaskDetails) {
      onTaskDetails(task);
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

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-slate-600">Carregando tarefas do departamento...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Tarefas do Departamento
          </CardTitle>
          {isManager && (
            <TaskFormDialog
              open={showCreateDialog}
              onOpenChange={setShowCreateDialog}
              onSubmit={handleCreateTask}
              taskType="department"
              companyId={companyId}
              departmentId={departmentId}
              trigger={
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              }
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">Nenhuma tarefa encontrada</p>
            <p className="text-sm text-slate-500">
              {isManager ? 'Crie a primeira tarefa do departamento' : 'Aguarde tarefas serem criadas'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 
                        className="font-medium text-slate-900 mb-2 cursor-pointer hover:text-blue-600"
                        onClick={() => handleViewDetails(task)}
                      >
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <Select
                          value={task.status}
                          onValueChange={(value) => handleStatusChange(task.id, value as 'todo' | 'in_progress' | 'done')}
                          disabled={!isManager}
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

                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>

                        <Badge variant="outline" className="bg-slate-100 text-slate-800">
                          {task.status === 'todo' ? 'A Fazer' : task.status === 'in_progress' ? 'Em Progresso' : 'Concluído'}
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

                        {task.is_public && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            Pública
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(task)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTask && (
          <TaskDetailsDialog
            task={selectedTask}
            isOpen={showDetailsDialog}
            onClose={() => setShowDetailsDialog(false)}
            companyId={companyId}
          />
        )}
      </CardContent>
    </Card>
  );
};
