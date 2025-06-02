
import { useState } from 'react';
import { useDepartmentTasks } from '@/hooks/usePublicTasks';
import { useDepartments } from '@/hooks/useDepartments';
import { useCreateTask } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskBoard } from '@/components/TaskBoard';
import { TaskListView } from '@/components/TaskListView';
import { TaskViewToggle } from '@/components/TaskViewToggle';
import { TaskFormDialog } from './TaskFormDialog';
import { useToast } from '@/hooks/use-toast';
import { Building2, Plus } from 'lucide-react';

interface DepartmentTasksTabProps {
  companyId: string;
}

export const DepartmentTasksTab = ({ companyId }: DepartmentTasksTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  
  const { data: departments = [] } = useDepartments(companyId);
  const { data: tasks = [], isLoading } = useDepartmentTasks(selectedDepartmentId);
  const createTask = useCreateTask();

  // Filtrar apenas departamentos onde o usuário é membro ou gerente
  const userDepartments = departments.filter(dept => 
    dept.manager_id === user?.id // É gerente
    // Em uma implementação real, verificaríamos se é membro via department_members
  );

  // Verificar se pode criar tarefas departamentais (gerente do departamento selecionado)
  const canCreateDepartmentTasks = selectedDepartmentId && departments.some(dept => 
    dept.id === selectedDepartmentId && dept.manager_id === user?.id
  );

  const handleCreateTask = async (formData: any) => {
    if (!selectedDepartmentId) {
      toast({
        title: 'Erro',
        description: 'Selecione um departamento primeiro',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Criando tarefa departamental:', {
        ...formData,
        departmentId: selectedDepartmentId,
        taskType: 'department'
      });

      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        companyId: companyId,
        departmentId: selectedDepartmentId,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
        taskType: 'department',
        isPublic: formData.isPublic,
      });

      toast({
        title: 'Tarefa departamental criada!',
        description: `Tarefa ${formData.title} criada com sucesso`,
      });

      setShowCreateDialog(false);
    } catch (error: any) {
      console.error('Erro ao criar tarefa departamental:', error);
      toast({
        title: 'Erro ao criar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Tarefas Departamentais</h2>
          <p className="text-slate-600">Tarefas do seu departamento</p>
        </div>

        <div className="flex items-center gap-4">
          {selectedDepartmentId && tasks.length > 0 && (
            <TaskViewToggle view={viewMode} onViewChange={setViewMode} />
          )}
          
          {canCreateDepartmentTasks && (
            <TaskFormDialog
              open={showCreateDialog}
              onOpenChange={setShowCreateDialog}
              onSubmit={handleCreateTask}
              taskType="department"
              companyId={companyId}
              departmentId={selectedDepartmentId}
              trigger={
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa Departamental
                </Button>
              }
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Selecionar Departamento</label>
          <Select value={selectedDepartmentId} onValueChange={setSelectedDepartmentId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um departamento" />
            </SelectTrigger>
            <SelectContent>
              {userDepartments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                  {dept.manager_id === user?.id && ' (Gerente)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!selectedDepartmentId ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Selecione um departamento</p>
              <p className="text-sm text-slate-500">Escolha um departamento para ver suas tarefas</p>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Carregando tarefas departamentais...</p>
          </div>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Nenhuma tarefa departamental encontrada</p>
              <p className="text-sm text-slate-500">
                {canCreateDepartmentTasks ? 'Crie a primeira tarefa do departamento' : 'Aguarde tarefas serem criadas'}
              </p>
            </CardContent>
          </Card>
        ) : (
          viewMode === 'kanban' ? (
            <TaskBoard 
              companyId={companyId}
              departmentId={selectedDepartmentId}
              taskType="department"
            />
          ) : (
            <TaskListView 
              companyId={companyId}
              departmentId={selectedDepartmentId}
              taskType="department"
            />
          )
        )}
      </div>
    </div>
  );
};
