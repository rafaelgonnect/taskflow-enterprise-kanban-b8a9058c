
import { Calendar, User, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  assignee: string;
  dueDate: string;
  department: string;
}

interface TaskCardProps {
  task: Task;
  onDragStart: () => void;
}

export const TaskCard = ({ task, onDragStart }: TaskCardProps) => {
  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200"
  };

  const priorityLabels = {
    high: "Alta",
    medium: "Média",
    low: "Baixa"
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
          {task.title}
        </h4>
        <span className={`text-xs px-2 py-1 rounded border ${priorityColors[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>
      </div>
      
      <p className="text-sm text-slate-600 mb-3">{task.description}</p>
      
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <User size={12} />
          <span>{task.assignee}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-500 capitalize">
          {task.department}
        </span>
      </div>
    </div>
  );
};
