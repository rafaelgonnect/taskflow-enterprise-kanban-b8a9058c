
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Users, Building2, Info } from 'lucide-react';
import { usePublicDepartmentTasks, usePublicCompanyTasks, useAcceptPublicTask } from '@/hooks/usePublicTasks';
import { useDepartmentMembers } from '@/hooks/useDepartmentMembers';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Task } from '@/hooks/useTasks';

interface PublicTasksSectionProps {
  companyId: string;
  userDepartments?: string[];
}

export const PublicTasksSection = ({ companyId, userDepartments = [] }: PublicTasksSectionProps) => {
  const { toast } = useToast();
  const [acceptingTask, setAcceptingTask] = useState<string | null>(null);
  
  const { data: publicDepartmentTasks = [] } = usePublicDepartmentTasks(userDepartments[0]);
  const { data: publicCompanyTasks = [] } = usePublicCompanyTasks(companyId);
  const acceptTask = useAcceptPublicTask();

  const handleAcceptTask = async (taskId: string, taskTitle: string) => {
    setAcceptingTask(taskId);
    try {
      await acceptTask.mutateAsync(taskId);
      toast({
        title: 'Tarefa aceita!',
        description: `Você aceitou a tarefa "${taskTitle}" e ela foi movida para suas tarefas pessoais.`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao aceitar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setAcceptingTask(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Média';
    }
  };

  if (publicDepartmentTasks.length === 0 && publicCompanyTasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Tarefas Disponíveis para Aceitar</h2>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Como funciona:</strong> Tarefas departamentais e empresariais podem ser criadas como "públicas" 
            para que qualquer membro do departamento ou empresa possa aceitá-las. Ao aceitar uma tarefa, 
            ela se torna sua responsabilidade e aparecerá em suas tarefas pessoais.
          </AlertDescription>
        </Alert>
      </div>

      {publicDepartmentTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Tarefas Departamentais Disponíveis
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publicDepartmentTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(task.priority)}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <Users className="w-3 h-3 mr-1" />
                      Departamental
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {task.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      {task.estimated_hours && `${task.estimated_hours}h estimadas`}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptTask(task.id, task.title)}
                      disabled={acceptingTask === task.id}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {acceptingTask === task.id ? 'Aceitando...' : 'Aceitar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {publicCompanyTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Tarefas Empresariais Disponíveis
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publicCompanyTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(task.priority)}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <Building2 className="w-3 h-3 mr-1" />
                      Empresarial
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {task.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      {task.estimated_hours && `${task.estimated_hours}h estimadas`}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptTask(task.id, task.title)}
                      disabled={acceptingTask === task.id}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {acceptingTask === task.id ? 'Aceitando...' : 'Aceitar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
