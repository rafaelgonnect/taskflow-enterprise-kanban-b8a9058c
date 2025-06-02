
import { useState } from 'react';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { usePersonalTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { useDepartments } from '@/hooks/useDepartments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { TaskBoard } from './TaskBoard';
import { CheckSquare, Plus, MoreVertical, Edit, Trash2, Calendar, Clock, User } from 'lucide-react';

export const PersonalTasks = () => {
  const { selectedCompany } = useCompanyContext();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
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
  const { data: departments = [] } = useDepartments(selectedCompany?.id);
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
        departmentId: formData.taskType === 'department' ? formData.departmentId : undefined,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
        taskType: formData.taskType,
        isPublic: formData.isPublic,
      });

      toast({
        title: 'Tarefa criada!',
        description: `Tarefa ${formData.title} criada com sucesso`,
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
        departmentId: formData.taskType === 'department' ? formData.departmentId : undefined,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
        taskType: formData.taskType,
        isPublic: formData.isPublic,
      });

      toast({
        title: 'Tarefa atualizada!',
        description: `Tarefa ${formData.title} atualizada com sucesso`,
      });

      resetForm();
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (task: any) => {
    if (!selectedCompany) return;

    try {
      await deleteTask.mutateAsync({
        id: task.id,
        companyId: selectedCompany.id,
      });

      toast({
        title: 'Tarefa excluída!',
        description: `Tarefa ${task.title} excluída com sucesso`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (task: any) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      estimatedHours: task.estimated_hours?.toString() || '',
      taskType: task.task_type || 'personal',
      departmentId: task.department_id || '',
      isPublic: task.is_public || false,
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
          <p className="text-slate-600">Gerencie suas tarefas pessoais e atribuídas</p>
        </div>

        <Dialog open={showCreateDialog || !!editingTask} onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowCreateDialog(true)}>
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
                  : 'Crie uma nova tarefa para você ou para sua equipe'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Título da tarefa</label>
                <Input
                  placeholder="Digite o título da tarefa"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  placeholder="Descreva a tarefa..."
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
                  <label className="text-sm font-medium">Tipo de tarefa</label>
                  <Select value={formData.taskType} onValueChange={(value: 'personal' | 'department' | 'company') => setFormData({ ...formData, taskType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Pessoal</SelectItem>
                      <SelectItem value="department">Departamental</SelectItem>
                      <SelectItem value="company">Empresarial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.taskType === 'department' && (
                <div>
                  <label className="text-sm font-medium">Departamento</label>
                  <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept: any) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data de vencimento</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Horas estimadas</label>
                  <Input
                    type="number"
                    placeholder="Ex: 8"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  />
                </div>
              </div>

              {(formData.taskType === 'department' || formData.taskType === 'company') && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public-task"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                  />
                  <label htmlFor="public-task" className="text-sm font-medium">
                    Tarefa pública (outros podem aceitar)
                  </label>
                </div>
              )}

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
        <TaskBoard 
          tasks={tasks} 
          onEditTask={openEditDialog}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
};
