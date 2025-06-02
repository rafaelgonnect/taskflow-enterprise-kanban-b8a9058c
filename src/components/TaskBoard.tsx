
import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { TaskColumn } from './TaskColumn';
import { usePersonalTasks, useUpdateTaskStatus, Task } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';

interface TaskBoardProps {
  companyId: string;
  departmentId?: string;
  userId?: string;
  onTaskDetails?: (task: Task) => void;
}

export const TaskBoard = ({ companyId, departmentId, userId, onTaskDetails }: TaskBoardProps) => {
  const { toast } = useToast();
  const { data: tasks = [], isLoading } = usePersonalTasks(companyId);
  const updateTaskStatus = useUpdateTaskStatus();

  // Filtrar tarefas baseado nos parâmetros
  const filteredTasks = tasks.filter(task => {
    if (departmentId && departmentId !== 'all' && departmentId !== 'user') {
      return task.department_id === departmentId;
    }
    if (userId === 'current') {
      return true; // Já filtrado pelo hook usePersonalTasks
    }
    return true;
  });

  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in_progress');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as 'todo' | 'in_progress' | 'done';
    
    updateTaskStatus.mutate({
      taskId: draggableId,
      newStatus,
      companyId
    }, {
      onSuccess: () => {
        const statusLabels = {
          'todo': 'A Fazer',
          'in_progress': 'Em Progresso',
          'done': 'Concluído'
        };
        
        toast({
          title: 'Status atualizado!',
          description: `Tarefa movida para "${statusLabels[newStatus]}"`,
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Erro ao atualizar status',
          description: error.message,
          variant: 'destructive',
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-slate-600">Carregando tarefas...</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Droppable droppableId="todo">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <TaskColumn
                title="A Fazer"
                tasks={todoTasks}
                status="todo"
                companyId={companyId}
                onTaskDetails={onTaskDetails}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="in_progress">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <TaskColumn
                title="Em Progresso"
                tasks={inProgressTasks}
                status="in_progress"
                companyId={companyId}
                onTaskDetails={onTaskDetails}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="done">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <TaskColumn
                title="Concluído"
                tasks={doneTasks}
                status="done"
                companyId={companyId}
                onTaskDetails={onTaskDetails}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};
