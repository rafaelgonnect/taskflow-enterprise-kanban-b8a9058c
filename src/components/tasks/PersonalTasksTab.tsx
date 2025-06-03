
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskFormDialog } from './TaskFormDialog';
import { TaskDetailsDialog } from '../TaskDetailsDialog';
import { TaskBoardUnified } from './TaskBoardUnified';
import { TaskFiltersComponent } from './TaskFilters';
import { useCreateTask, usePersonalTasks, Task } from '@/hooks/useTasks';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface PersonalTasksTabProps {
  companyId: string;
}

export const PersonalTasksTab = ({ companyId }: PersonalTasksTabProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  const { data: personalTasks = [] } = usePersonalTasks(companyId);
  
  const { filters, setFilters, filteredTasks } = useTaskFilters(personalTasks, user?.id);
  
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
        taskType: 'personal',
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

  const handleTaskDetails = (task: Task) => {
    console.log('Abrindo detalhes da tarefa:', task);
    setSelectedTask(task);
    setShowDetailsDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Tarefas Pessoais</h2>
          <p className="text-slate-600">Suas tarefas pessoais e tarefas aceitas</p>
        </div>
        
        <TaskFormDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateTask}
          taskType="personal"
          companyId={companyId}
          trigger={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          }
        />
      </div>

      <TaskFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        showTaskTypeFilter={true}
        availableTaskTypes={[
          { value: 'personal', label: 'Pessoais' },
          { value: 'department', label: 'Departamentais aceitas' },
          { value: 'company', label: 'Empresariais aceitas' }
        ]}
      />

      <TaskBoardUnified 
        tasks={filteredTasks}
        companyId={companyId}
        onTaskDetails={handleTaskDetails}
        showOriginBadges={true}
        allowDragDrop={true}
      />

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
