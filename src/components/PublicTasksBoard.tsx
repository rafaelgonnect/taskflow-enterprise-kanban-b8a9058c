
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDepartmentTasks, useCompanyTasks, useAcceptPublicTask } from '@/hooks/usePublicTasks';
import { useDepartments } from '@/hooks/useDepartments';
import { useToast } from '@/hooks/use-toast';
import { Building, Users, Calendar, Clock, CheckCircle, User } from 'lucide-react';
import { Task } from '@/hooks/useTasks';

interface PublicTasksBoardProps {
  companyId: string;
}

export const PublicTasksBoard = ({ companyId }: PublicTasksBoardProps) => {
  const { toast } = useToast();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const { data: departments = [] } = useDepartments(companyId);
  const { data: departmentTasks = [] } = useDepartmentTasks(selectedDepartment);
  const { data: companyTasks = [] } = useCompanyTasks(companyId);
  const acceptTask = useAcceptPublicTask();

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
            <p className="text-sm text-slate-600 line-clamp-3">{task.description}</p>
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
                <span>{task.estimated_hours}h estimado</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {task.assignee_id ? (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Aceita</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <User className="w-4 h-4" />
                  <span>Disponível</span>
                </div>
              )}
            </div>
            
            {!task.assignee_id && (
              <Button 
                size="sm" 
                onClick={() => handleAcceptTask(task)}
                disabled={acceptTask.isPending}
              >
                {acceptTask.isPending ? 'Aceitando...' : 'Aceitar'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Tarefas Públicas</h2>
        <p className="text-slate-600">
          Tarefas disponíveis para toda a empresa ou departamento que você pode aceitar
        </p>
      </div>

      <Tabs defaultValue="department" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="department">Tarefas Departamentais</TabsTrigger>
          <TabsTrigger value="company">Tarefas Empresariais</TabsTrigger>
        </TabsList>

        <TabsContent value="department" className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecione um departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDepartment ? (
            departmentTasks.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">Nenhuma tarefa departamental disponível</p>
                  <p className="text-sm text-slate-500">
                    Não há tarefas públicas neste departamento no momento
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {departmentTasks.map((task) => (
                  <TaskCard key={task.id} task={task} type="department" />
                ))}
              </div>
            )
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Selecione um departamento para ver as tarefas disponíveis</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          {companyTasks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">Nenhuma tarefa empresarial disponível</p>
                <p className="text-sm text-slate-500">
                  Não há tarefas públicas da empresa no momento
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {companyTasks.map((task) => (
                <TaskCard key={task.id} task={task} type="company" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
