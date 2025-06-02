
import { useState } from "react";
import { TaskColumn } from "@/components/TaskColumn";
import { usePersonalTasks, useUpdateTaskStatus, Task } from '@/hooks/useTasks';
import { useDepartmentTasks, useCompanyTasks } from '@/hooks/usePublicTasks';
import { useCompanyContext } from '@/contexts/CompanyContext';

interface TaskBoardProps {
  companyId: string;
  departmentId?: string;
  userId?: string;
  taskType?: 'personal' | 'department' | 'company';
}

export const TaskBoard = ({ companyId, departmentId, userId, taskType = 'personal' }: TaskBoardProps) => {
  const { selectedCompany } = useCompanyContext();
  
  // Usar o hook apropriado baseado no tipo de tarefa
  const { data: personalTasks = [], isLoading: personalLoading } = usePersonalTasks(
    taskType === 'personal' ? companyId : undefined
  );
  const { data: departmentTasks = [], isLoading: departmentLoading } = useDepartmentTasks(
    taskType === 'department' ? departmentId : undefined
  );
  const { data: companyTasks = [], isLoading: companyLoading } = useCompanyTasks(
    taskType === 'company' ? companyId : undefined
  );
  
  const updateTaskStatus = useUpdateTaskStatus();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  // Determinar quais tarefas usar
  let tasks: Task[] = [];
  let isLoading = false;
  
  if (taskType === 'personal') {
    tasks = personalTasks;
    isLoading = personalLoading;
  } else if (taskType === 'department') {
    tasks = departmentTasks;
    isLoading = departmentLoading;
  } else if (taskType === 'company') {
    tasks = companyTasks;
    isLoading = companyLoading;
  }

  const columns = [
    { id: "todo", title: "A Fazer", color: "border-slate-300" },
    { id: "in_progress", title: "Em Progresso", color: "border-blue-300" },
    { id: "done", title: "Concluído", color: "border-green-300" }
  ];

  const getTasksByStatus = (status: 'todo' | 'in_progress' | 'done') => {
    return tasks.filter(task => task.status === status);
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

  const getTitle = () => {
    if (taskType === 'personal') return "Minhas Tarefas Pessoais";
    if (taskType === 'department') return "Tarefas Departamentais";
    if (taskType === 'company') return "Tarefas Empresariais";
    return "Kanban Board";
  };

  const getDescription = () => {
    if (taskType === 'personal') return "Suas tarefas pessoais";
    if (taskType === 'department') return "Tarefas do departamento";
    if (taskType === 'company') return "Tarefas da empresa";
    return "Visualize e gerencie suas tarefas";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {getTitle()}
          </h2>
          <p className="text-slate-600">
            {getDescription()}
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
