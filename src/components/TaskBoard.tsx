
import { useState } from "react";
import { TaskColumn } from "@/components/TaskColumn";
import { Plus } from "lucide-react";
import { Task } from '@/hooks/useTasks';

interface TaskBoardProps {
  companyId: string;
  departmentId?: string;
  userId?: string;
}

// Mock tasks that conform to the Task interface
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Implementar autenticação",
    description: "Desenvolver sistema de login e cadastro",
    status: "todo" as const,
    priority: "high" as const,
    company_id: "mock-company-id",
    created_by: "mock-user-id",
    assignee_id: "joão-silva-id",
    due_date: "2024-01-15T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    estimated_hours: 8
  },
  {
    id: "2",
    title: "Criar landing page",
    description: "Design e desenvolvimento da página inicial",
    status: "in_progress" as const,
    priority: "medium" as const,
    company_id: "mock-company-id",
    created_by: "mock-user-id",
    assignee_id: "maria-santos-id",
    due_date: "2024-01-20T00:00:00Z",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    estimated_hours: 16
  },
  {
    id: "3",
    title: "Revisar proposta comercial",
    description: "Análise e ajustes na proposta para cliente",
    status: "done" as const,
    priority: "high" as const,
    company_id: "mock-company-id",
    created_by: "mock-user-id",
    assignee_id: "pedro-lima-id",
    due_date: "2024-01-12T00:00:00Z",
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
    estimated_hours: 4
  },
  {
    id: "4",
    title: "Configurar servidor",
    description: "Setup do ambiente de produção",
    status: "todo" as const,
    priority: "medium" as const,
    company_id: "mock-company-id",
    created_by: "mock-user-id",
    assignee_id: "ana-costa-id",
    due_date: "2024-01-25T00:00:00Z",
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
    estimated_hours: 12
  }
];

export const TaskBoard = ({ companyId, departmentId, userId }: TaskBoardProps) => {
  const [tasks, setTasks] = useState(mockTasks);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const columns = [
    { id: "todo", title: "A Fazer", color: "border-slate-300" },
    { id: "in_progress", title: "Em Progresso", color: "border-blue-300" },
    { id: "done", title: "Concluído", color: "border-green-300" }
  ];

  const getTasksByStatus = (status: 'todo' | 'in_progress' | 'done') => {
    let filteredTasks = tasks;
    
    if (departmentId && departmentId !== "all" && departmentId !== "user") {
      // In a real implementation, you would filter by department
      filteredTasks = tasks;
    }
    
    if (userId === "current") {
      // In a real implementation, you would filter by current user
      filteredTasks = tasks;
    }

    return filteredTasks.filter(task => task.status === status);
  };

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updated_at: new Date().toISOString() }
          : task
      )
    );
    setDraggedTask(null);
  };

  const handleEdit = (task: Task) => {
    console.log('Editing task:', task);
    // In real implementation, this would open an edit dialog
  };

  const handleDelete = (task: Task) => {
    console.log('Deleting task:', task);
    setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
  };

  const handleDetails = (task: Task) => {
    console.log('Viewing task details:', task);
    // In real implementation, this would open the details dialog
  };

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
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          <Plus size={20} />
          Nova Tarefa
        </button>
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
