
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskCard } from './TaskCard';
import { Task, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { useState } from 'react';
import { TaskFormDialog } from './tasks/TaskFormDialog';
import { useToast } from '@/hooks/use-toast';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: 'todo' | 'in_progress' | 'done';
  companyId: string;
  onTaskDetails?: (task: Task) => void;
}

export const TaskColumn = ({ title, tasks, status, companyId, onTaskDetails }: TaskColumnProps) => {
  const { toast } = useToast();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowEditDialog(true);
  };

  const handleDelete = async (task: Task) => {
    if (window.confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
      try {
        await deleteTask.mutateAsync({ id: task.id, companyId });
        toast({
          title: 'Tarefa excluída!',
          description: `A tarefa "${task.title}" foi excluída com sucesso.`,
        });
      } catch (error: any) {
        toast({
          title: 'Erro ao excluir tarefa',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const handleUpdateTask = async (formData: any) => {
    if (!editingTask) return;

    try {
      await updateTask.mutateAsync({
        id: editingTask.id,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        companyId,
        status: editingTask.status,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      });

      toast({
        title: 'Tarefa atualizada!',
        description: `A tarefa "${formData.title}" foi atualizada com sucesso.`,
      });

      setShowEditDialog(false);
      setEditingTask(null);
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'todo': return 'border-slate-200';
      case 'in_progress': return 'border-blue-200';
      case 'done': return 'border-green-200';
      default: return 'border-slate-200';
    }
  };

  return (
    <>
      <Card className={`h-fit ${getStatusColor()}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-700 flex items-center justify-between">
            {title}
            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
              {tasks.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={() => {}}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDetails={onTaskDetails}
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm">Nenhuma tarefa</p>
            </div>
          )}
        </CardContent>
      </Card>

      {editingTask && (
        <TaskFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSubmit={handleUpdateTask}
          taskType="personal"
          companyId={companyId}
          trigger={<div />}
        />
      )}
    </>
  );
};
