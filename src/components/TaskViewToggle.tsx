
import { Button } from '@/components/ui/button';
import { Kanban, List } from 'lucide-react';

interface TaskViewToggleProps {
  view: 'kanban' | 'list';
  onViewChange: (view: 'kanban' | 'list') => void;
}

export const TaskViewToggle = ({ view, onViewChange }: TaskViewToggleProps) => {
  return (
    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
      <Button
        variant={view === 'kanban' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('kanban')}
        className="gap-2"
      >
        <Kanban className="w-4 h-4" />
        Kanban
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="gap-2"
      >
        <List className="w-4 h-4" />
        Lista
      </Button>
    </div>
  );
};
