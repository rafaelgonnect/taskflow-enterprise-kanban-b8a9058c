
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Building } from 'lucide-react';
import { TaskFormDialog } from './TaskFormDialog';
import { TaskDetailsDialog } from '../TaskDetailsDialog';
import { TaskBoardUnified } from './TaskBoardUnified';
import { TaskFiltersComponent } from './TaskFilters';
import { AcceptableTasksSection } from './AcceptableTasksSection';
import { useCreateTask, Task } from '@/hooks/useTasks';
import { useCompanyTasks, usePublicCompanyTasks } from '@/hooks/usePublicTasks';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface CompanyTasksTabProps {
  companyId: string;
}

export const CompanyTasksTab = ({ companyId }: CompanyTasksTabProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  const { data: companyTasks = [] } = useCompanyTasks(companyId);
  const { data: publicCompanyTasks = [] } = usePublicCompanyTasks(companyId);
  
  const { filters, setFilters, filteredTasks } = useTaskFilters(companyTasks, user?.id);
  
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

      <TaskFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        showTaskTypeFilter={false}
        showAssigneeFilter={true}
      />

      <TaskBoardUnified 
        tasks={filteredTasks}
        companyId={companyId}
        onTaskDetails={handleTaskDetails}
        showOriginBadges={false}
        allowDragDrop={true}
      />

      {publicCompanyTasks.length > 0 && (
        <AcceptableTasksSection
          tasks={publicCompanyTasks}
          title="Tarefas Empresariais Públicas"
          emptyMessage="Nenhuma tarefa pública disponível"
        />
      )}

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
