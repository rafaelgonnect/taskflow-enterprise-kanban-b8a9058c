
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Edit, Trash2, Calendar, Clock, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Task } from '@/hooks/useTasks';
import { TaskDetailsDialog } from "./TaskDetailsDialog";
import { TaskOriginBadge } from "./tasks/TaskOriginBadge";
import { TaskProgressIndicator } from "./tasks/TaskProgressIndicator";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDetails?: (task: Task) => void;
  showOriginBadge?: boolean;
  showProgressIndicator?: boolean;
  isDragging?: boolean;
}

export const TaskCard = ({ 
  task, 
  onStatusChange,
  onEdit,
  onDelete,
  onDetails,
  showOriginBadge = false,
  showProgressIndicator = false,
  isDragging = false
}: TaskCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDetailsClick = () => {
    if (onDetails) {
      onDetails(task);
    } else {
      setShowDetails(true);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  return (
    <>
      <Card
        className={`cursor-move hover:shadow-md transition-all duration-200 ${
          isDragging ? 'opacity-50 rotate-2 scale-105' : ''
        }`}
        draggable
        onDragStart={handleDragStart}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h4 
                className="font-medium text-slate-900 line-clamp-2 flex-1 cursor-pointer hover:text-blue-600"
                onClick={handleDetailsClick}
              >
                {task.title}
              </h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDetailsClick}>
                    <Eye className="mr-2 h-4 w-4" />
                    Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(task)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {task.description && (
              <p className="text-sm text-slate-600 line-clamp-2">{task.description}</p>
            )}

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {showOriginBadge && <TaskOriginBadge task={task} />}
                <Badge className={getPriorityColor(task.priority)}>
                  {getPriorityLabel(task.priority)}
                </Badge>
              </div>
              
              {showProgressIndicator && <TaskProgressIndicator task={task} />}
            </div>

            <div className="space-y-2 text-xs text-slate-500">
              {task.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              
              {task.estimated_hours && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{task.estimated_hours}h estimado</span>
                </div>
              )}

              {task.assignee_id && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>Atribuída</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showDetails && (
        <TaskDetailsDialog
          task={task}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          companyId={task.company_id}
        />
      )}
    </>
  );
};
