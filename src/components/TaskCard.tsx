
import React from 'react';
import { Calendar, User, AlertCircle, GripVertical, Paperclip, MessageSquare, History, Play, Pause, Clock } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Task } from '@/hooks/useTasks';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDetails: (task: Task) => void;
  isDragging?: boolean;
}

export const TaskCard = ({ task, onStatusChange, onEdit, onDelete, onDetails, isDragging }: TaskCardProps) => {
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

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group ${
        isDragging ? 'opacity-50 rotate-2' : ''
      } ${task.is_timer_running ? 'ring-2 ring-green-200 bg-green-50' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2 flex-1">
          <GripVertical className="w-4 h-4 text-slate-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h4 
            className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors flex-1 cursor-pointer"
            onClick={() => onDetails(task)}
          >
            {task.title}
          </h4>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-xs px-2 py-1 rounded border ${priorityColors[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <AlertCircle className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
              {task.status === 'todo' && (
                <DropdownMenuItem onClick={() => onStatusChange(task.id, 'in_progress')}>
                  Iniciar Tarefa
                </DropdownMenuItem>
              )}
              {task.status === 'in_progress' && (
                <>
                  <DropdownMenuItem onClick={() => onStatusChange(task.id, 'done')}>
                    Concluir Tarefa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(task.id, 'todo')}>
                    Voltar para A Fazer
                  </DropdownMenuItem>
                </>
              )}
              {task.status === 'done' && (
                <DropdownMenuItem onClick={() => onStatusChange(task.id, 'in_progress')}>
                  Reabrir Tarefa
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDetails(task)}>
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(task)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task)} className="text-red-600">
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {task.description && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
        <div className="flex items-center gap-3">
          {task.estimated_hours && (
            <div className="flex items-center gap-1">
              <AlertCircle size={12} />
              <span>{task.estimated_hours}h est.</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{formatTime(task.total_time_minutes || 0)}</span>
          </div>
        </div>
        {task.due_date && (
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </div>

      {/* Timer Status */}
      {task.is_timer_running && (
        <div className="flex items-center gap-1 mb-3 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Timer ativo</span>
        </div>
      )}

      {/* Indicadores de anexos, comentários e histórico */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Paperclip size={12} />
            <span>{task.attachments?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <MessageSquare size={12} />
            <span>{task.comments?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <History size={12} />
            <span>{task.history?.length || 0}</span>
          </div>
        </div>
        
        {task.is_timer_running ? (
          <Pause className="w-4 h-4 text-green-600" />
        ) : (
          <Play className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  );
};
