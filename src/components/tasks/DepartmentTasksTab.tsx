
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { TaskFormDialog } from './TaskFormDialog';
import { TaskDetailsDialog } from '../TaskDetailsDialog';
import { TaskBoardUnified } from './TaskBoardUnified';
import { TaskFiltersComponent } from './TaskFilters';
import { useCreateTask, Task } from '@/hooks/useTasks';
import { useDepartmentTasks } from '@/hooks/usePublicTasks';
import { useDepartments } from '@/hooks/useDepartments';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DepartmentTasksTabProps {
  companyId: string;
}

export const DepartmentTasksTab = ({ companyId }: DepartmentTasksTabProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  
  const { data: departments = [] } = useDepartments(companyId);
  const { data: departmentTasks = [] } = useDepartmentTasks(selectedDepartment);
  
  const { filters, setFilters, filteredTasks } = useTaskFilters(departmentTasks, user?.id);
  
  const createTask = useCreateTask();

  const handleCreateTask = async (formData: any) => {
    try {
      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        companyId: companyId,
        departmentId: selectedDepartment,
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
        
        {selectedDepartment && (
          <TaskFormDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onSubmit={handleCreateTask}
            taskType="department"
            companyId={companyId}
            departmentId={selectedDepartment}
            trigger={
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Tarefa Departamental
              </Button>
            }
          />
        )}
      </div>

      <Tabs value={selectedDepartment} onValueChange={setSelectedDepartment}>
        <TabsList className="grid w-full grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {departments.map((department) => (
            <TabsTrigger key={department.id} value={department.id} className="text-sm">
              {department.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {departments.map((department) => (
          <TabsContent key={department.id} value={department.id} className="space-y-6">
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
          </TabsContent>
        ))}
      </Tabs>

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
