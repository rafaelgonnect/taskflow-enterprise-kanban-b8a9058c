
import { Badge } from '@/components/ui/badge';
import { Building, Users, User } from 'lucide-react';
import { Task } from '@/hooks/useTasks';

interface TaskOriginBadgeProps {
  task: Task;
  size?: 'sm' | 'md';
}

export const TaskOriginBadge = ({ task, size = 'sm' }: TaskOriginBadgeProps) => {
  const getOriginInfo = () => {
    if (task.task_type === 'personal') {
      return {
        label: 'Pessoal',
        icon: User,
        className: 'bg-blue-100 text-blue-700 border-blue-200'
      };
    }
    
    if (task.task_type === 'department') {
      return {
        label: 'Departamental',
        icon: Users,
        className: 'bg-purple-100 text-purple-700 border-purple-200'
      };
    }
    
    return {
      label: 'Empresarial',
      icon: Building,
      className: 'bg-orange-100 text-orange-700 border-orange-200'
    };
  };

  const { label, icon: Icon, className } = getOriginInfo();
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <Badge className={`${className} ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
      <Icon className={`${iconSize} mr-1`} />
      {label}
    </Badge>
  );
};
