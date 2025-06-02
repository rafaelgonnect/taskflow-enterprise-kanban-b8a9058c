
import React from "react";
import { TaskCard } from "@/components/TaskCard";
import { Task } from '@/hooks/useTasks';

interface TaskColumnProps {
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  borderColor: string;
  draggedTaskId?: string;
}

export const TaskColumn = ({ 
  title, 
  status,
  tasks, 
  onStatusChange,
  onEdit,
  onDelete,
  borderColor,
  draggedTaskId
}: TaskColumnProps) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && taskId !== draggedTaskId) {
      onStatusChange(taskId, status);
    }
  };

  return (
    <div
      className={`bg-slate-50 rounded-xl p-4 border-2 border-dashed min-h-96 transition-all duration-200 ${
        isDragOver 
          ? `${borderColor.replace('border-', 'border-2 border-')} bg-slate-100` 
          : borderColor
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
            isDragging={draggedTaskId === task.id}
          />
        ))}
        
        {isDragOver && tasks.length === 0 && (
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center text-blue-600">
            Solte a tarefa aqui
          </div>
        )}
      </div>
    </div>
  );
};
