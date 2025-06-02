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

  return null; // Este componente não é mais usado diretamente
};
