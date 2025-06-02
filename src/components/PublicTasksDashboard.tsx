
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePublicCompanyTasks, useAcceptPublicTask } from '@/hooks/usePublicTasks';
import { useDepartments } from '@/hooks/useDepartments';
import { useToast } from '@/hooks/use-toast';
import { Building, Users, Calendar, Clock, User } from 'lucide-react';
import { Task } from '@/hooks/useTasks';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PublicTasksDashboardProps {
  companyId: string;
}

export const PublicTasksDashboard = ({ companyId }: PublicTasksDashboardProps) => {
  const { toast } = useToast();
  const { data: departments = [] } = useDepartments(companyId);
  const { data: companyTasks = [] } = usePublicCompanyTasks(companyId);
  const acceptTask = useAcceptPublicTask();

  // Buscar todas as tarefas departamentais públicas de uma vez
  const { data: allDepartmentTasks = [] } = useQuery({
    queryKey: ['all-public-department-tasks', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      console.log('Buscando todas as tarefas departamentais públicas da empresa:', companyId);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('company_id', companyId)
        .eq('task_type', 'department')
        .eq('is_public', true)
        .is('assignee_id', null)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar tarefas departamentais públicas:', error);
        throw error;
      }
      
      const tasks: Task[] = (data || []).map(task => ({
        ...task,
        status: task.status as 'todo' | 'in_progress' | 'done',
        priority: task.priority as 'high' | 'medium' | 'low',
        task_type: task.task_type as 'personal' | 'department' | 'company'
      }));
      
      console.log('Todas as tarefas departamentais públicas encontradas:', tasks);
      return tasks;
    },
    enabled: !!companyId,
  });

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
