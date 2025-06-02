
import { useState } from 'react';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { usePersonalTasks, useCreateTask, useUpdateTask, useDeleteTask, Task } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare, Plus, Edit, Trash2, MoreVertical, Clock, AlertCircle, Calendar, Timer } from 'lucide-react';

export const PersonalTasks = () => {
  const { selectedCompany } = useCompanyContext();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
    estimatedHours: '',
  });

  const { data: tasks = [], isLoading: tasksLoading } = usePersonalTasks(selectedCompany?.id);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleCreateTask = async () => {
    if (!selectedCompany || !formData.title.trim()) return;

    try {
      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        companyId: selectedCompany.id,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      });

      toast({
        title: 'Tarefa criada!',
        description: `Tarefa "${formData.title}" criada com sucesso`,
      });

      setFormData({ title: '', description: '', priority: 'medium', dueDate: '', estimatedHours: '' });
      setShowCreateDialog(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao criar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedCompany || !editingTask || !formData.title.trim()) return;

    try {
      await updateTask.mutateAsync({
        id: editingTask.id,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        companyId: selectedCompany.id,
        status: editingTask.status,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      });

      toast({
        title: 'Tarefa atualizada!',
        description: `Tarefa "${formData.title}" atualizada com sucesso`,
      });

      setFormData({ title: '', description: '', priority: 'medium', dueDate: '', estimatedHours: '' });
      setEditingTask(null);
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!selectedCompany) return;

    try {
      await deleteTask.mutateAsync({
        id: task.id,
        companyId: selectedCompany.id,
      });

      toast({
        title: 'Tarefa excluída!',
        description: `Tarefa "${task.title}" excluída com sucesso`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (task: Task, newStatus: 'todo' | 'in_progress' | 'done') => {
    if (!selectedCompany) return;

    try {
      await updateTask.mutateAsync({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        companyId: selectedCompany.id,
        status: newStatus,
        dueDate: task.due_date || undefined,
        estimatedHours: task.estimated_hours,
      });

      toast({
        title: 'Status atualizado!',
        description: `Tarefa movida para ${getStatusLabel(newStatus)}`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.due_date ? task.due_date.split('T')[0] : '',
      estimatedHours: task.estimated_hours?.toString() || '',
    });
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', priority: 'medium', dueDate: '', estimatedHours: '' });
    setEditingTask(null);
    setShowCreateDialog(false);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'A Fazer';
      case 'in_progress': return 'Em Progresso';
      case 'done': return 'Concluído';
      default: return status;
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

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  if (!selectedCompany) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Selecione uma empresa para gerenciar suas tarefas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Minhas Tarefas</h1>
          <p className="text-slate-600">Gerencie suas tarefas pessoais e controle o tempo</p>
        </div>

        <Dialog open={showCreateDialog || !!editingTask} onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
              </DialogTitle>
              <DialogDescription>
                {editingTask 
                  ? 'Edite as informações da tarefa'
                  : 'Crie uma nova tarefa pessoal'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Título da tarefa</label>
                <Input
                  placeholder="Ex: Revisar relatório mensal..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  placeholder="Descrição detalhada da tarefa..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Prioridade</label>
                  <Select value={formData.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tempo estimado (horas)</label>
                  <Input
                    type="number"
                    placeholder="Ex: 2"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Data de entrega</label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button 
                  onClick={editingTask ? handleUpdateTask : handleCreateTask}
                  disabled={!formData.title.trim() || createTask.isPending || updateTask.isPending}
                >
                  {createTask.isPending || updateTask.isPending ? 'Salvando...' : 
                   editingTask ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Tarefas Pessoais</TabsTrigger>
          <TabsTrigger value="department" disabled className="opacity-50">
            Departamentais <span className="ml-1 text-xs">(em breve)</span>
          </TabsTrigger>
          <TabsTrigger value="company" disabled className="opacity-50">
            Empresariais <span className="ml-1 text-xs">(em breve)</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          {tasksLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-slate-600">Carregando tarefas...</p>
            </div>
          ) : tasks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">Nenhuma tarefa encontrada</p>
                <p className="text-sm text-slate-500">Crie sua primeira tarefa para começar</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Coluna A Fazer */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                    A Fazer ({getTasksByStatus('todo').length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getTasksByStatus('todo').map((task) => (
                    <Card key={task.id} className="border-l-4 border-l-slate-400">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(task, 'in_progress')}>
                                <Clock className="w-4 h-4 mr-2" />
                                Iniciar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(task)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTask(task)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {task.description && (
                          <p className="text-xs text-slate-600 mb-3">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                          {task.estimated_hours && (
                            <Badge variant="outline" className="text-xs">
                              <Timer className="w-3 h-3 mr-1" />
                              {task.estimated_hours}h
                            </Badge>
                          )}
                        </div>
                        {task.due_date && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Coluna Em Progresso */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    Em Progresso ({getTasksByStatus('in_progress').length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getTasksByStatus('in_progress').map((task) => (
                    <Card key={task.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(task, 'done')}>
                                <CheckSquare className="w-4 h-4 mr-2" />
                                Concluir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(task, 'todo')}>
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Voltar para A Fazer
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(task)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTask(task)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {task.description && (
                          <p className="text-xs text-slate-600 mb-3">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                          {task.estimated_hours && (
                            <Badge variant="outline" className="text-xs">
                              <Timer className="w-3 h-3 mr-1" />
                              {task.estimated_hours}h
                            </Badge>
                          )}
                        </div>
                        {task.due_date && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Coluna Concluído */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Concluído ({getTasksByStatus('done').length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getTasksByStatus('done').map((task) => (
                    <Card key={task.id} className="border-l-4 border-l-green-500 opacity-80">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm line-through">{task.title}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(task, 'in_progress')}>
                                <Clock className="w-4 h-4 mr-2" />
                                Reabrir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(task)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTask(task)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {task.description && (
                          <p className="text-xs text-slate-600 mb-3">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                          {task.estimated_hours && (
                            <Badge variant="outline" className="text-xs">
                              <Timer className="w-3 h-3 mr-1" />
                              {task.estimated_hours}h
                            </Badge>
                          )}
                        </div>
                        {task.due_date && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="department">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Tarefas Departamentais</p>
              <p className="text-sm text-slate-500">Esta funcionalidade estará disponível em breve</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Tarefas Empresariais</p>
              <p className="text-sm text-slate-500">Esta funcionalidade estará disponível em breve</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
