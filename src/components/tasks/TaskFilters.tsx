
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

export interface TaskFilters {
  search: string;
  priority: string;
  status: string;
  taskType: string;
  assignee: string;
}

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  availableTaskTypes?: { value: string; label: string; }[];
  showTaskTypeFilter?: boolean;
  showAssigneeFilter?: boolean;
}

export const TaskFiltersComponent = ({ 
  filters, 
  onFiltersChange,
  availableTaskTypes = [
    { value: 'personal', label: 'Pessoais' },
    { value: 'department', label: 'Departamentais' },
    { value: 'company', label: 'Empresariais' }
  ],
  showTaskTypeFilter = true,
  showAssigneeFilter = false
}: TaskFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof TaskFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      priority: 'all',
      status: 'all',
      taskType: 'all',
      assignee: 'all'
    });
  };

  const hasActiveFilters = filters.search || 
    (filters.priority !== 'all') || 
    (filters.status !== 'all') || 
    (filters.taskType !== 'all') ||
    (filters.assignee !== 'all');

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.priority !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.taskType !== 'all') count++;
    if (filters.assignee !== 'all') count++;
    return count;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Buscar tarefas..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-slate-600"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Prioridade
            </label>
            <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Status
            </label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="todo">A Fazer</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="done">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showTaskTypeFilter && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Tipo
              </label>
              <Select value={filters.taskType} onValueChange={(value) => updateFilter('taskType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {availableTaskTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {showAssigneeFilter && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Responsável
              </label>
              <Select value={filters.assignee} onValueChange={(value) => updateFilter('assignee', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="me">Minhas tarefas</SelectItem>
                  <SelectItem value="unassigned">Não atribuídas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
