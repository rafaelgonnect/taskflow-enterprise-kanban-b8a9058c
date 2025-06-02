
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskCard } from '../TaskCard';
import { Task, useUpdateTaskStatus } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';

interface TaskBoardUnifiedProps {
  tasks: Task[];
  companyId: string;
  onTaskDetails?: (task: Task) => void;
  showOriginBadges?: boolean;
  allowDragDrop?: boolean;
}

export const TaskBoardUnified = ({ 
  tasks, 
  companyId, 
  onTaskDetails, 
  showOriginBadges = false,
  allowDragDrop = true 
}: TaskBoardUnifiedProps) => {
  const { toast } = useToast();
  const updateTaskStatus = useUpdateTaskStatus();

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  const handleDragEnd = (result: any) => {
    if (!allowDragDrop) return;

    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
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
          description: `Tarefa movida para "${statusLabels[newStatus]}"`
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Erro ao atualizar status',
          description: error.message,
          variant: 'destructive'
        });
      }
    });
  };

  const TaskColumn = ({ title, tasks, status }: { title: string; tasks: Task[]; status: string }) => (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-700 flex items-center justify-between">
          {title}
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allowDragDrop ? (
          <Droppable droppableId={status}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard
                          task={task}
                          onStatusChange={() => {}}
                          onEdit={() => {}}
                          onDelete={() => {}}
                          onDetails={onTaskDetails}
                          showOriginBadge={showOriginBadges}
                          isDragging={snapshot.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {tasks.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-sm">Nenhuma tarefa</p>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
                onDetails={onTaskDetails}
                showOriginBadge={showOriginBadges}
              />
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">Nenhuma tarefa</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (allowDragDrop) {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn title="A Fazer" tasks={todoTasks} status="todo" />
          <TaskColumn title="Em Progresso" tasks={inProgressTasks} status="in_progress" />
          <TaskColumn title="Concluído" tasks={doneTasks} status="done" />
        </div>
      </DragDropContext>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TaskColumn title="A Fazer" tasks={todoTasks} status="todo" />
      <TaskColumn title="Em Progresso" tasks={inProgressTasks} status="in_progress" />
      <TaskColumn title="Concluído" tasks={doneTasks} status="done" />
    </div>
  );
};
