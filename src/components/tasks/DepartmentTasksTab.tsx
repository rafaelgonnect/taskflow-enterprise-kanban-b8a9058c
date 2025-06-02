
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { TaskFormDialog } from './TaskFormDialog';
import { TaskDetailsDialog } from '../TaskDetailsDialog';
import { DepartmentTaskManagement } from '../DepartmentTaskManagement';
import { PublicTasksDashboard } from '../PublicTasksDashboard';
import { useCreateTask, Task } from '@/hooks/useTasks';
import { useDepartments } from '@/hooks/useDepartments';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DepartmentTasksTabProps {
  companyId: string;
}

export const DepartmentTasksTab = ({ companyId }: DepartmentTasksTabProps) => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  const { data: departments = [] } = useDepartments(companyId);
  const createTask = useCreateTask();

  const handleCreateTask = async (formData: any) => {
    try {
      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        companyId: companyId,
        departmentId: formData.departmentId,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
        taskType: 'department',
        isPublic: formData.isPublic,
      });

      toast({
        title: 'Tarefa departamental criada!',
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

  const handleTaskDetails = (task: Task) => {
    console.log('Abrindo detalhes da tarefa departamental:', task);
    setSelectedTask(task);
    setShowDetailsDialog(true);
  };

  if (departments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Nenhum departamento encontrado
          </h3>
          <p className="text-slate-600 text-center mb-4">
            Você precisa criar departamentos antes de gerenciar tarefas departamentais.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Tarefas Departamentais</h2>
          <p className="text-slate-600">Gerencie tarefas dos departamentos</p>
        </div>
        
        <TaskFormDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateTask}
          taskType="department"
          companyId={companyId}
          trigger={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa Departamental
            </Button>
          }
        />
      </div>

      <div className="space-y-6">
        {departments.map((department) => (
          <DepartmentTaskManagement
            key={department.id}
            departmentId={department.id}
            companyId={companyId}
            isManager={true}
            onTaskDetails={handleTaskDetails}
          />
        ))}
      </div>

      <PublicTasksDashboard companyId={companyId} />

      {selectedTask && (
        <TaskDetailsDialog
          task={selectedTask}
          isOpen={showDetailsDialog}
          onClose={() => {
            setShowDetailsDialog(false);
            setSelectedTask(null);
          }}
          companyId={companyId}
        />
      )}
    </div>
  );
};
