
import { useState } from "react";
import { TaskColumn } from "@/components/TaskColumn";
import { Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  assignee: string;
  dueDate: string;
  department: string;
}

interface TaskBoardProps {
  companyId: string;
  departmentId?: string;
  userId?: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Implementar autenticação",
    description: "Desenvolver sistema de login e cadastro",
    priority: "high",
    assignee: "João Silva",
    dueDate: "2024-01-15",
    department: "desenvolvimento"
  },
  {
    id: "2",
    title: "Criar landing page",
    description: "Design e desenvolvimento da página inicial",
    priority: "medium",
    assignee: "Maria Santos",
    dueDate: "2024-01-20",
    department: "marketing"
  },
  {
    id: "3",
    title: "Revisar proposta comercial",
    description: "Análise e ajustes na proposta para cliente",
    priority: "high",
    assignee: "Pedro Lima",
    dueDate: "2024-01-12",
    department: "vendas"
  },
  {
    id: "4",
    title: "Configurar servidor",
    description: "Setup do ambiente de produção",
    priority: "medium",
    assignee: "Ana Costa",
    dueDate: "2024-01-25",
    department: "desenvolvimento"
  }
];

export const TaskBoard = ({ companyId, departmentId, userId }: TaskBoardProps) => {
  const [tasks, setTasks] = useState(mockTasks);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const columns = [
    { id: "todo", title: "A Fazer", color: "border-slate-300" },
    { id: "progress", title: "Em Progresso", color: "border-blue-300" },
    { id: "done", title: "Concluído", color: "border-green-300" }
  ];

  const getTasksByStatus = (status: string) => {
    let filteredTasks = tasks;
    
    if (departmentId && departmentId !== "all" && departmentId !== "user") {
      filteredTasks = tasks.filter(task => task.department === departmentId);
    }
    
    if (userId === "current") {
      filteredTasks = tasks.filter(task => task.assignee === "João Silva");
    }

    // Mock status - in real app this would come from database
    const statusMap: { [key: string]: string[] } = {
      todo: ["1", "4"],
      progress: ["2"],
      done: ["3"]
    };

    return filteredTasks.filter(task => statusMap[status]?.includes(task.id) || false);
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (draggedTask) {
      // In real app, this would update the database
      console.log(`Moving task ${draggedTask} to ${status}`);
      setDraggedTask(null);
    }
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
            tasks={getTasksByStatus(column.id)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
            onDragStart={handleDragStart}
            borderColor={column.color}
          />
        ))}
      </div>
    </div>
  );
};
