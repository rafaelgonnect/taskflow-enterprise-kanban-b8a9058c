
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePublicDepartmentTasks, usePublicCompanyTasks, useAcceptPublicTask } from '@/hooks/usePublicTasks';
import { useDepartments } from '@/hooks/useDepartments';
import { useToast } from '@/hooks/use-toast';
import { Building, Users, Calendar, Clock, CheckCircle, User } from 'lucide-react';
import { Task } from '@/hooks/useTasks';

interface PublicTasksDashboardProps {
  companyId: string;
}

export const PublicTasksDashboard = ({ companyId }: PublicTasksDashboardProps) => {
  const { toast } = useToast();
  const { data: departments = [] } = useDepartments(companyId);
  const { data: companyTasks = [] } = usePublicCompanyTasks(companyId);
  const acceptTask = useAcceptPublicTask();

  // Sempre chamar hooks da mesma forma - buscar tarefas de todos os departamentos
  const allDepartmentTasksQueries = departments.map(dept => ({
    departmentId: dept.id,
    query: usePublicDepartmentTasks(dept.id)
  }));
  
  // Combinar todas as tarefas departamentais
  const allDepartmentTasks = allDepartmentTasksQueries.reduce((acc, { query }) => {
    if (query.data) {
      return [...acc, ...query.data];
    }
    return acc;
  }, [] as Task[]);

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

  const handleAcceptTask = async (task: Task) => {
    try {
      await acceptTask.mutateAsync(task.id);
      
      toast({
        title: 'Tarefa aceita!',
        description: `Você aceitou a tarefa "${task.title}" e ela foi movida para suas tarefas pessoais`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao aceitar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const TaskCard = ({ task, type }: { task: Task; type: 'department' | 'company' }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-slate-900 line-clamp-2">{task.title}</h4>
            <Badge variant="outline" className={`text-xs ml-2 ${getPriorityColor(task.priority)}`}>
              {getPriorityLabel(task.priority)}
            </Badge>
          </div>
          
          {task.description && (
            <p className="text-sm text-slate-600 line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <div className="flex items-center gap-1">
              {type === 'department' ? <Users className="w-3 h-3" /> : <Building className="w-3 h-3" />}
              <span>{type === 'department' ? 'Departamental' : 'Empresarial'}</span>
            </div>
            
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
            
            {task.estimated_hours && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{task.estimated_hours}h</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-sm text-blue-600">
              <User className="w-4 h-4" />
              <span>Disponível</span>
            </div>
            
            <Button 
              size="sm" 
              onClick={() => handleAcceptTask(task)}
              disabled={acceptTask.isPending}
            >
              {acceptTask.isPending ? 'Aceitando...' : 'Aceitar'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const hasPublicTasks = companyTasks.length > 0 || allDepartmentTasks.length > 0;

  if (!hasPublicTasks) {
    return null;
  }

  return (
    <div className="space-y-6">
      {companyTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Tarefas Empresariais Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {companyTasks.slice(0, 6).map((task) => (
                <TaskCard key={task.id} task={task} type="company" />
              ))}
            </div>
            {companyTasks.length > 6 && (
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  Ver todas ({companyTasks.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {allDepartmentTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Tarefas Departamentais Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allDepartmentTasks.slice(0, 6).map((task) => (
                <TaskCard key={task.id} task={task} type="department" />
              ))}
            </div>
            {allDepartmentTasks.length > 6 && (
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  Ver todas ({allDepartmentTasks.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
