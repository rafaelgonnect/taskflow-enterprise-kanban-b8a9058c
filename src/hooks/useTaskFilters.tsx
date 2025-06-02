
import { useState, useMemo } from 'react';
import { Task } from './useTasks';

export interface TaskFilters {
  search: string;
  priority: string;
  status: string;
  taskType: string;
  assignee: string;
}

export const useTaskFilters = (tasks: Task[], userId?: string) => {
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    priority: 'all',
    status: 'all',
    taskType: 'all',
    assignee: 'all'
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filtro de busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(searchLower) ||
          (task.description && task.description.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Filtro de prioridade
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      // Filtro de status
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }

      // Filtro de tipo de tarefa
      if (filters.taskType !== 'all' && task.task_type !== filters.taskType) {
        return false;
      }

      // Filtro de responsável
      if (filters.assignee !== 'all') {
        if (filters.assignee === 'me' && task.assignee_id !== userId) {
          return false;
        }
        if (filters.assignee === 'unassigned' && task.assignee_id) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, filters, userId]);

  return {
    filters,
    setFilters,
    filteredTasks
  };
};
