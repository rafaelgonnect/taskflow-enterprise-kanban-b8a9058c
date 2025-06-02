
import { useState } from 'react';
import { usePersonalTasks, useCreateTask } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TaskBoard } from '@/components/TaskBoard';
import { TaskFormDialog } from './TaskFormDialog';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare, Plus } from 'lucide-react';

interface PersonalTasksTabProps {
  companyId: string;
}

export const PersonalTasksTab = ({ companyId }: PersonalTasksTabProps) => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: tasks = [], isLoading } = usePersonalTasks(companyId);
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
        isPublic: false,
      });

      toast({
        title: 'Tarefa criada!',
        description: `Tarefa ${formData.title} criada com sucesso`,
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

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-slate-600">Carregando tarefas pessoais...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Tarefas Pessoais</h2>
          <p className="text-slate-600">Suas tarefas individuais</p>
        </div>

        <TaskFormDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateTask}
          taskType="personal"
          companyId={companyId}
          trigger={
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa Pessoal
            </Button>
          }
        />
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <CheckSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">Nenhuma tarefa pessoal encontrada</p>
            <p className="text-sm text-slate-500">Crie sua primeira tarefa pessoal</p>
          </CardContent>
        </Card>
      ) : (
        <TaskBoard 
          companyId={companyId}
          userId="current"
        />
      )}
    </div>
  );
};
