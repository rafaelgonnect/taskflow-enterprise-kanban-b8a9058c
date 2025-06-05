
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskBoardUnified } from './TaskBoardUnified';
import { TaskFormDialog } from './TaskFormDialog';
import { TaskDetailsDialog } from '@/components/TaskDetailsDialog';
import { useDepartmentTasks, useAcceptPublicTask } from '@/hooks/usePublicTasks';
import { useDepartmentMembers } from '@/hooks/useDepartmentMembers';
import { useCreateTask, Task } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, CheckCircle2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DepartmentTasksTabProps {
  companyId: string;
}

export const DepartmentTasksTab = ({ companyId }: DepartmentTasksTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [acceptingTask, setAcceptingTask] = useState<string | null>(null);

  // Buscar departamentos do usuário
  const { data: allDepartmentMembers = [] } = useDepartmentMembers('');
  const userDepartments = allDepartmentMembers
    .filter(member => member.user_id === user?.id && member.is_active)
    .map(member => member.department_id);

  const { data: departmentTasks = [] } = useDepartmentTasks(userDepartments[0]);
  const createTask = useCreateTask();
  const acceptTask = useAcceptPublicTask();

  // Separar tarefas atribuídas e públicas
  const assignedTasks = departmentTasks.filter(task => task.assignee_id === user?.id);
  const publicTasks = departmentTasks.filter(task => task.is_public && !task.assignee_id);

  const handleCreateTask = async (formData: any) => {
    try {
      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        companyId: companyId,
        departmentId: userDepartments[0],
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

  const handleAcceptTask = async (taskId: string, taskTitle: string) => {
    setAcceptingTask(taskId);
    try {
      await acceptTask.mutateAsync(taskId);
      toast({
        title: 'Tarefa aceita!',
        description: `Você aceitou a tarefa "${taskTitle}" e ela foi movida para suas tarefas departamentais.`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao aceitar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setAcceptingTask(null);
    }
  };

  const handleTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setShowDetailsDialog(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Média';
    }
  };

  if (userDepartments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Sem departamento
          </h3>
          <p className="text-slate-600 text-center">
            Você não está em nenhum departamento. Entre em contato com seu administrador.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seção de tarefas públicas para aceitar */}
      {publicTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Tarefas Departamentais Disponíveis para Aceitar
          </h3>
          
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Tarefas Departamentais:</strong> Estas são tarefas criadas para o seu departamento 
              que estão disponíveis para qualquer membro aceitar. Ao aceitar uma tarefa, ela se torna 
              sua responsabilidade e aparecerá em suas tarefas pessoais.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {publicTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(task.priority)}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <Users className="w-3 h-3 mr-1" />
                      Departamental
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {task.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      {task.estimated_hours && `${task.estimated_hours}h estimadas`}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptTask(task.id, task.title)}
                      disabled={acceptingTask === task.id}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {acceptingTask === task.id ? 'Aceitando...' : 'Aceitar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Seção de tarefas atribuídas */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-slate-900">Minhas Tarefas Departamentais</h3>
          <p className="text-sm text-slate-600">
            Tarefas do departamento atribuídas a você
          </p>
        </div>
        
        <TaskFormDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateTask}
          taskType="department"
          companyId={companyId}
          departmentId={userDepartments[0]}
          trigger={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa Departamental
            </Button>
          }
        />
      </div>

      <TaskBoardUnified 
        tasks={assignedTasks}
        companyId={companyId}
        onTaskDetails={handleTaskDetails}
        allowDragDrop={true}
        showOriginBadge={true}
      />

      {selectedTask && (
        <TaskDetailsDialog
          task={selectedTask}
          isOpen={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)}
          companyId={companyId}
        />
      )}
    </div>
  );
};
