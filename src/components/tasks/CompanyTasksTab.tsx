
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Building } from 'lucide-react';
import { TaskFormDialog } from './TaskFormDialog';
import { TaskDetailsDialog } from '../TaskDetailsDialog';
import { TaskBoard } from '../TaskBoard';
import { PublicTasksDashboard } from '../PublicTasksDashboard';
import { useCreateTask, Task } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';

interface CompanyTasksTabProps {
  companyId: string;
}

export const CompanyTasksTab = ({ companyId }: CompanyTasksTabProps) => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  const createTask = useCreateTask();

  const handleCreateTask = async (formData: any) => {
    try {
      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        companyId: companyId,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
        taskType: 'company',
        isPublic: formData.isPublic,
      });

      toast({
        title: 'Tarefa empresarial criada!',
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
    console.log('Abrindo detalhes da tarefa empresarial:', task);
    setSelectedTask(task);
    setShowDetailsDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Tarefas Empresariais</h2>
          <p className="text-slate-600">Gerencie tarefas de toda a empresa</p>
        </div>
        
        <TaskFormDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateTask}
          taskType="company"
          companyId={companyId}
          trigger={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa Empresarial
            </Button>
          }
        />
      </div>

      <TaskBoard 
        companyId={companyId}
        onTaskDetails={handleTaskDetails}
      />

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
