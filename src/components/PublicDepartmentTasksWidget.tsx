
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, CheckCircle2 } from 'lucide-react';
import { usePublicDepartmentTasks, useAcceptPublicTask } from '@/hooks/usePublicTasks';
import { useDepartments } from '@/hooks/useDepartments';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PublicDepartmentTasksWidgetProps {
  companyId: string;
}

export const PublicDepartmentTasksWidget = ({ companyId }: PublicDepartmentTasksWidgetProps) => {
  const { toast } = useToast();
  const { data: departments = [] } = useDepartments(companyId);
  const acceptTask = useAcceptPublicTask();

  // Buscar tarefas públicas de todos os departamentos
  const departmentTasksQueries = departments.map(dept => 
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePublicDepartmentTasks(dept.id)
  );

  // Combinar todas as tarefas departamentais públicas
  const allPublicDepartmentTasks = departmentTasksQueries
    .flatMap(query => query.data || [])
    .slice(0, 5); // Mostrar apenas as 5 mais recentes

  const handleAcceptTask = async (taskId: string) => {
    try {
      await acceptTask.mutateAsync(taskId);
      toast({
        title: 'Tarefa aceita!',
        description: 'A tarefa foi adicionada às suas tarefas pessoais.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao aceitar tarefa',
        description: error.message,
        variant: 'destructive',
      });
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

  if (allPublicDepartmentTasks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Tarefas Departamentais Disponíveis
          <Badge variant="secondary" className="ml-auto">
            {allPublicDepartmentTasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {allPublicDepartmentTasks.map((task) => {
            const department = departments.find(d => d.id === task.department_id);
            
            return (
              <div key={task.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-slate-900 truncate">{task.title}</h4>
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {department?.name || 'Departamento'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(task.created_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleAcceptTask(task.id)}
                    disabled={acceptTask.isPending}
                    className="ml-3 shrink-0"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {acceptTask.isPending ? 'Aceitando...' : 'Aceitar'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        {allPublicDepartmentTasks.length === 5 && (
          <div className="text-center mt-4">
            <Button variant="outline" size="sm">
              Ver todas as tarefas departamentais
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
