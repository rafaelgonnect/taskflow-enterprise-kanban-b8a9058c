
import { TaskBoardUnified } from './tasks/TaskBoardUnified';
import { usePersonalTasks } from '@/hooks/useTasks';

interface TaskBoardProps {
  companyId: string;
  departmentId?: string;
  userId?: string;
  onTaskDetails?: (task: any) => void;
}

export const TaskBoard = ({ companyId, departmentId, userId, onTaskDetails }: TaskBoardProps) => {
  const { data: tasks = [], isLoading } = usePersonalTasks(companyId);

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

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-slate-600">Carregando tarefas...</p>
      </div>
    );
  }

  return (
    <TaskBoardUnified 
      tasks={filteredTasks}
      companyId={companyId}
      onTaskDetails={onTaskDetails}
      allowDragDrop={true}
    />
  );
};
