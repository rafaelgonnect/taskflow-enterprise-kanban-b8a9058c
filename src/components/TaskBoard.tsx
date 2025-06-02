
import { useState } from "react";
import { TaskColumn } from "@/components/TaskColumn";
import { Plus } from "lucide-react";
import { usePersonalTasks, useUpdateTaskStatus, Task } from '@/hooks/useTasks';

interface TaskBoardProps {
  companyId: string;
  departmentId?: string;
  userId?: string;
}

export const TaskBoard = ({ companyId, departmentId, userId }: TaskBoardProps) => {
  const { data: tasks = [], isLoading } = usePersonalTasks(companyId);
  const updateTaskStatus = useUpdateTaskStatus();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const columns = [
    { id: "todo", title: "A Fazer", color: "border-slate-300" },
    { id: "in_progress", title: "Em Progresso", color: "border-blue-300" },
    { id: "done", title: "Concluído", color: "border-green-300" }
  ];

  const getTasksByStatus = (status: 'todo' | 'in_progress' | 'done') => {
    let filteredTasks = tasks;
    
    if (departmentId && departmentId !== "all" && departmentId !== "user") {
      // Em uma implementação real, filtraria por departamento
      filteredTasks = tasks.filter(task => task.department_id === departmentId);
    }
    
    if (userId === "current") {
      // Em uma implementação real, filtraria pelo usuário atual
      filteredTasks = tasks;
    }

    return filteredTasks.filter(task => task.status === status);
  };

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    updateTaskStatus.mutate({
      taskId,
      newStatus,
      companyId
    });
    setDraggedTask(null);
  };

  const handleEdit = (task: Task) => {
    console.log('Editing task:', task);
    // Em uma implementação real, abriria um diálogo de edição
  };

  const handleDelete = (task: Task) => {
    console.log('Deleting task:', task);
    // Em uma implementação real, deletaria a tarefa
  };

  const handleDetails = (task: Task) => {
    console.log('Viewing task details:', task);
    // Em uma implementação real, abriria o diálogo de detalhes
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {departmentId === "user" ? "Minhas Tarefas" : "Kanban Board"}
          </h2>
          <p className="text-slate-600">
            {departmentId === "all" ? "Todas as tarefas da empresa" : 
             departmentId === "user" ? "Suas tarefas pessoais" :
             `Tarefas do departamento de ${departmentId}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            title={column.title}
            status={column.id as 'todo' | 'in_progress' | 'done'}
            tasks={getTasksByStatus(column.id as 'todo' | 'in_progress' | 'done')}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDetails={handleDetails}
            borderColor={column.color}
            draggedTaskId={draggedTask}
          />
        ))}
      </div>
    </div>
  );
};
