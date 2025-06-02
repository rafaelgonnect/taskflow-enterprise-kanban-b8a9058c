import { useState } from 'react';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { usePersonalTasks, useCreateTask, useUpdateTask, useDeleteTask, useUpdateTaskStatus, Task } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare, Plus, Clock, Timer, Play, Pause } from 'lucide-react';
import { TaskColumn } from '@/components/TaskColumn';
import { TaskDetailsDialog } from '@/components/TaskDetailsDialog';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreVertical, AlertCircle, Calendar, Eye } from 'lucide-react';
import { useStartTimer, useStopTimer } from '@/hooks/useTaskTimer';
import { useDepartments } from '@/hooks/useDepartments';

export const PersonalTasks = () => {
  const { selectedCompany } = useCompanyContext();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
    estimatedHours: '',
    taskType: 'personal' as 'personal' | 'department' | 'company',
    departmentId: '',
    isPublic: false,
  });

  const { data: tasks = [], isLoading: tasksLoading } = usePersonalTasks(selectedCompany?.id);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const updateTaskStatus = useUpdateTaskStatus();
  const startTimer = useStartTimer();
  const stopTimer = useStopTimer();
  const { data: departments = [] } = useDepartments(selectedCompany?.id);

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
        taskType: formData.taskType,
        departmentId: formData.departmentId || undefined,
        isPublic: formData.isPublic,
      });

      const taskTypeLabel = {
        'personal': 'pessoal',
        'department': 'departamental',
        'company': 'empresarial'
      };

      toast({
        title: 'Tarefa criada!',
        description: `Tarefa ${taskTypeLabel[formData.taskType]} "${formData.title}" criada com sucesso`,
      });

      setFormData({ 
        title: '', 
        description: '', 
        priority: 'medium', 
        dueDate: '', 
        estimatedHours: '',
        taskType: 'personal',
        departmentId: '',
        isPublic: false,
      });
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

  const handleStatusChange = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    if (!selectedCompany) return;

    try {
      await updateTaskStatus.mutateAsync({
        taskId,
        newStatus,
        companyId: selectedCompany.id,
      });

      const statusLabels = {
        'todo': 'A Fazer',
        'in_progress': 'Em Progresso', 
        'done': 'Concluído'
      };

      toast({
        title: 'Status atualizado!',
        description: `Tarefa movida para ${statusLabels[newStatus]}`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleTimerToggle = async (task: Task) => {
    if (!selectedCompany) return;

    try {
      if (task.is_timer_running) {
        await stopTimer.mutateAsync({ 
          taskId: task.id, 
          companyId: selectedCompany.id 
        });
        toast({
          title: 'Timer pausado!',
          description: 'O tempo foi registrado com sucesso.',
        });
      } else {
        await startTimer.mutateAsync({ 
          taskId: task.id, 
          companyId: selectedCompany.id 
        });
        toast({
          title: 'Timer iniciado!',
          description: 'O cronômetro está rodando.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro no timer',
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
      taskType: task.task_type,
      departmentId: task.department_id || '',
      isPublic: task.is_public,
    });
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      priority: 'medium', 
      dueDate: '', 
      estimatedHours: '',
      taskType: 'personal',
      departmentId: '',
      isPublic: false,
    });
    setEditingTask(null);
    setShowCreateDialog(false);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
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
          <p className="text-slate-600">Gerencie suas tarefas pessoais com drag & drop, timer e muito mais</p>
        </div>

        <Dialog open={showCreateDialog || !!editingTask} onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowCreateDialog(true)} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
              </DialogTitle>
              <DialogDescription>
                {editingTask 
                  ? 'Edite as informações da tarefa'
                  : 'Crie uma nova tarefa'
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
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  placeholder="Descrição detalhada da tarefa..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              {!editingTask && (
                <div>
                  <label className="text-sm font-medium">Tipo de tarefa</label>
                  <Select value={formData.taskType} onValueChange={(value: 'personal' | 'department' | 'company') => 
                    setFormData({ ...formData, taskType: value, departmentId: '', isPublic: false })
                  }>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Pessoal</SelectItem>
                      <SelectItem value="department">Departamental</SelectItem>
                      <SelectItem value="company">Empresarial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.taskType === 'department' && (
                <div>
                  <label className="text-sm font-medium">Departamento</label>
                  <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
                    <SelectTrigger className="mt-1">
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
              )}

              {(formData.taskType === 'department' || formData.taskType === 'company') && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium">
                    Tarefa pública (outros membros podem aceitar)
                  </label>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Prioridade</label>
                  <Select value={formData.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger className="mt-1">
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
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Data de entrega</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
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

      <Tabs defaultValue="kanban" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="personal">Lista Pessoal</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-6">
          {tasksLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-slate-600">Carregando tarefas...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TaskColumn
                title="A Fazer"
                status="todo"
                tasks={getTasksByStatus('todo')}
                onStatusChange={handleStatusChange}
                onEdit={openEditDialog}
                onDelete={handleDeleteTask}
                onDetails={setSelectedTask}
                borderColor="border-slate-300"
                draggedTaskId={draggedTaskId}
              />
              <TaskColumn
                title="Em Progresso"
                status="in_progress"
                tasks={getTasksByStatus('in_progress')}
                onStatusChange={handleStatusChange}
                onEdit={openEditDialog}
                onDelete={handleDeleteTask}
                onDetails={setSelectedTask}
                borderColor="border-blue-300"
                draggedTaskId={draggedTaskId}
              />
              <TaskColumn
                title="Concluído"
                status="done"
                tasks={getTasksByStatus('done')}
                onStatusChange={handleStatusChange}
                onEdit={openEditDialog}
                onDelete={handleDeleteTask}
                onDetails={setSelectedTask}
                borderColor="border-green-300"
                draggedTaskId={draggedTaskId}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Tarefas Pessoais ({tasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-slate-600">Carregando tarefas...</p>
                  </div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-2">Nenhuma tarefa encontrada</p>
                  <p className="text-sm text-slate-400">Crie sua primeira tarefa para começar!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className="border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-slate-900 hover:text-blue-600 transition-colors">
                                {task.title}
                              </h4>
                              {task.is_timer_running && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  <Timer className="w-3 h-3" />
                                  <span className="font-medium">Ativo</span>
                                </div>
                              )}
                            </div>
                            {task.description && (
                              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
                            )}
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                                {getPriorityLabel(task.priority)}
                              </Badge>
                              {task.due_date && (
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock className="w-3 h-3" />
                                <span>{Math.floor((task.total_time_minutes || 0) / 60)}h {(task.total_time_minutes || 0) % 60}m</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTimerToggle(task);
                              }}
                              className={task.is_timer_running ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                            >
                              {task.is_timer_running ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTask(task);
                                }}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  openEditDialog(task);
                                }}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTask(task);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Detalhes da Tarefa */}
      <TaskDetailsDialog
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        companyId={selectedCompany.id}
      />
    </div>
  );
};
