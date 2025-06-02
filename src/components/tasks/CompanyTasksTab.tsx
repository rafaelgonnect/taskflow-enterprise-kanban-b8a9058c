
import { useState } from 'react';
import { useCompanyTasks } from '@/hooks/usePublicTasks';
import { useCreateTask } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TaskBoard } from '@/components/TaskBoard';
import { TaskFormDialog } from './TaskFormDialog';
import { useToast } from '@/hooks/use-toast';
import { Building, Plus } from 'lucide-react';

interface CompanyTasksTabProps {
  companyId: string;
}

export const CompanyTasksTab = ({ companyId }: CompanyTasksTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { data: tasks = [], isLoading } = useCompanyTasks(companyId);
  const createTask = useCreateTask();

  // Em uma implementação real, verificaríamos se o usuário tem permissão de admin
  // Por ora, assumindo que qualquer usuário pode criar tarefas empresariais
  const canCreateCompanyTasks = true;

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
        <p className="mt-2 text-slate-600">Carregando tarefas empresariais...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Tarefas Empresariais</h2>
          <p className="text-slate-600">Tarefas para toda a empresa</p>
        </div>

        {canCreateCompanyTasks && (
          <TaskFormDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onSubmit={handleCreateTask}
            taskType="company"
            companyId={companyId}
            trigger={
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Tarefa Empresarial
              </Button>
            }
          />
        )}
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">Nenhuma tarefa empresarial encontrada</p>
            <p className="text-sm text-slate-500">
              {canCreateCompanyTasks ? 'Crie a primeira tarefa empresarial' : 'Aguarde tarefas serem criadas'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <TaskBoard 
          companyId={companyId}
        />
      )}
    </div>
  );
};
