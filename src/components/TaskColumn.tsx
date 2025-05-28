
import { TaskCard } from "@/components/TaskCard";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  assignee: string;
  dueDate: string;
  department: string;
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragStart: (taskId: string) => void;
  borderColor: string;
}

export const TaskColumn = ({ 
  title, 
  tasks, 
  onDragOver, 
  onDrop, 
  onDragStart,
  borderColor 
}: TaskColumnProps) => {
  return (
    <div
      className={`bg-slate-50 rounded-xl p-4 border-2 border-dashed ${borderColor} min-h-96`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={() => onDragStart(task.id)}
          />
        ))}
      </div>
    </div>
  );
};
