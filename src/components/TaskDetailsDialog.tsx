
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  Clock, 
  Calendar, 
  Upload, 
  FileText, 
  MessageSquare, 
  History,
  Download,
  Trash2,
  Edit,
  Send,
  X
} from 'lucide-react';
import { Task, useUpdateTask } from '@/hooks/useTasks';
import { useTaskAttachments, useUploadAttachment, useDeleteAttachment } from '@/hooks/useTaskAttachments';
import { useTaskComments, useCreateComment, useUpdateComment, useDeleteComment } from '@/hooks/useTaskComments';
import { useTaskHistory } from '@/hooks/useTaskHistory';
import { useStartTimer, useStopTimer } from '@/hooks/useTaskTimer';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskDetailsDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

export const TaskDetailsDialog = ({ task, isOpen, onClose, companyId }: TaskDetailsDialogProps) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [timerDescription, setTimerDescription] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
    estimatedHours: '',
  });

  const updateTask = useUpdateTask();
  const { data: attachments = [], refetch: refetchAttachments } = useTaskAttachments(task?.id || '');
  const { data: comments = [], refetch: refetchComments } = useTaskComments(task?.id || '');
  const { data: history = [], refetch: refetchHistory } = useTaskHistory(task?.id || '');
  const uploadAttachment = useUploadAttachment();
  const deleteAttachment = useDeleteAttachment();
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const startTimer = useStartTimer();
  const stopTimer = useStopTimer();

  // Atualizar formData quando task mudar
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.due_date ? task.due_date.split('T')[0] : '',
        estimatedHours: task.estimated_hours?.toString() || '',
      });
    }
  }, [task]);

  // Recarregar dados quando necessário
  useEffect(() => {
    if (task?.id && isOpen) {
      console.log('Recarregando dados do modal para task:', task.id);
      refetchAttachments();
      refetchComments();
      refetchHistory();
    }
  }, [task?.id, isOpen, refetchAttachments, refetchComments, refetchHistory]);

  if (!task) return null;

  const handleSaveTask = async () => {
    try {
      await updateTask.mutateAsync({
        id: task.id,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        companyId,
        status: task.status,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      });

      toast({
        title: 'Tarefa atualizada!',
        description: 'As alterações foram salvas com sucesso.',
      });

      setEditMode(false);
      
      // Forçar atualização dos dados
      setTimeout(() => {
        refetchAttachments();
        refetchComments();
        refetchHistory();
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar tarefa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O arquivo deve ter no máximo 10MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await uploadAttachment.mutateAsync({ taskId: task.id, file });
      toast({
        title: 'Anexo enviado!',
        description: `${file.name} foi anexado à tarefa.`,
      });
      
      // Forçar atualização
      setTimeout(() => {
        refetchAttachments();
        refetchHistory();
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar anexo',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;

    try {
      console.log('Criando comentário no modal:', { taskId: task.id, content: newComment });
      await createComment.mutateAsync({ taskId: task.id, content: newComment });
      setNewComment('');
      toast({
        title: 'Comentário adicionado!',
      });
      
      // Forçar atualização
      setTimeout(() => {
        refetchComments();
        refetchHistory();
      }, 1000);
    } catch (error: any) {
      console.error('Erro ao criar comentário no modal:', error);
      toast({
        title: 'Erro ao adicionar comentário',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editCommentText.trim()) return;

    try {
      await updateComment.mutateAsync({ 
        id: commentId, 
        content: editCommentText, 
        taskId: task.id 
      });
      setEditingComment(null);
      setEditCommentText('');
      toast({
        title: 'Comentário atualizado!',
      });
      
      // Forçar atualização
      setTimeout(() => {
        refetchComments();
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar comentário',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleTimerToggle = async () => {
    try {
      console.log('Timer toggle no modal - estado atual:', task.is_timer_running);
      
      if (task.is_timer_running) {
        await stopTimer.mutateAsync({ 
          taskId: task.id, 
          companyId,
          description: timerDescription 
        });
        setTimerDescription('');
        toast({
          title: 'Timer pausado!',
          description: 'O tempo foi registrado com sucesso.',
        });
      } else {
        await startTimer.mutateAsync({ taskId: task.id, companyId });
        toast({
          title: 'Timer iniciado!',
          description: 'O cronômetro está rodando.',
        });
      }
      
      // Forçar atualização de todos os dados
      setTimeout(() => {
        refetchAttachments();
        refetchComments(); 
        refetchHistory();
      }, 1000);
    } catch (error: any) {
      console.error('Erro no timer toggle:', error);
      toast({
        title: 'Erro no timer',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'done': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getHistoryIcon = (action: string) => {
    switch (action) {
      case 'created': return '🎯';
      case 'status_changed': return '🔄';
      case 'priority_changed': return '⚡';
      case 'title_changed': return '✏️';
      case 'timer_started': return '▶️';
      case 'timer_stopped': return '⏸️';
      case 'comment_added': return '💬';
      case 'attachment_added': return '📎';
      default: return '📝';
    }
  };

  console.log('Modal renderizando com task:', {
    id: task.id,
    is_timer_running: task.is_timer_running,
    comments_count: comments.length,
    history_count: history.length
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            {editMode ? (
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-lg font-semibold"
                placeholder="Título da tarefa"
              />
            ) : (
              <DialogTitle className="text-xl">{task.title}</DialogTitle>
            )}
            <div className="flex items-center gap-2">
              {editMode ? (
                <>
                  <Button onClick={handleSaveTask} size="sm" disabled={updateTask.isPending}>
                    {updateTask.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button variant="outline" onClick={() => setEditMode(false)} size="sm">
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setEditMode(true)} size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status === 'todo' ? 'A Fazer' : task.status === 'in_progress' ? 'Em Progresso' : 'Concluído'}
              </Badge>
              {task.is_timer_running && (
                <Badge className="bg-green-100 text-green-700 border-green-200 animate-pulse">
                  Timer Ativo
                </Badge>
              )}
            </div>
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(task.due_date).toLocaleDateString('pt-BR')}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(task.total_time_minutes || 0)}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="details" className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="attachments">
                Anexos ({attachments.length})
              </TabsTrigger>
              <TabsTrigger value="comments">
                Comentários ({comments.length})
              </TabsTrigger>
              <TabsTrigger value="history">
                Histórico ({history.length})
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 h-[60vh] overflow-y-auto">
              <TabsContent value="details" className="space-y-6">
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Descrição</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descrição da tarefa..."
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
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
                        <label className="text-sm font-medium">Data de entrega</label>
                        <Input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tempo estimado (horas)</label>
                        <Input
                          type="number"
                          value={formData.estimatedHours}
                          onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                          placeholder="Ex: 8"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {task.description && (
                      <div>
                        <h4 className="font-medium mb-2">Descrição</h4>
                        <p className="text-slate-600 whitespace-pre-wrap">{task.description}</p>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Tempo estimado</h4>
                        <p className="text-slate-600">
                          {task.estimated_hours ? `${task.estimated_hours}h` : 'Não definido'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Tempo gasto</h4>
                        <p className="text-slate-600">
                          {formatTime(task.total_time_minutes || 0)}
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Controle de Tempo</h4>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={handleTimerToggle}
                          variant={task.is_timer_running ? "destructive" : "default"}
                          disabled={startTimer.isPending || stopTimer.isPending}
                          className={task.is_timer_running ? "animate-pulse" : ""}
                        >
                          {task.is_timer_running ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pausar Timer
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Iniciar Timer
                            </>
                          )}
                        </Button>
                        
                        {task.is_timer_running && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-green-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium">Timer ativo</span>
                            </div>
                            <Input
                              placeholder="Descrição do trabalho..."
                              value={timerDescription}
                              onChange={(e) => setTimerDescription(e.target.value)}
                              className="w-48"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="attachments" className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={uploadAttachment.isPending}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadAttachment.isPending ? 'Enviando...' : 'Adicionar Anexo'}
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="*/*"
                  />
                </div>

                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium">{attachment.file_name}</p>
                          <p className="text-sm text-slate-500">
                            {(attachment.file_size / 1024 / 1024).toFixed(2)} MB • {' '}
                            {formatDistanceToNow(new Date(attachment.uploaded_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(attachment.file_url, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAttachment.mutate({
                            id: attachment.id,
                            fileName: attachment.file_url.split('/').pop() || '',
                            taskId: task.id
                          })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {attachments.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum anexo encontrado</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Adicionar um comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <Button 
                    onClick={handleCreateComment}
                    disabled={!newComment.trim() || createComment.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {comment.user_name?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{comment.user_name}</span>
                          <span className="text-xs text-slate-500">
                            {formatDistanceToNow(new Date(comment.created_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditCommentText(comment.content);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteComment.mutate({ id: comment.id, taskId: task.id })}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {editingComment === comment.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateComment(comment.id)}
                              disabled={!editCommentText.trim()}
                            >
                              Salvar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingComment(null);
                                setEditCommentText('');
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-700 whitespace-pre-wrap">{comment.content}</p>
                      )}
                    </div>
                  ))}
                  
                  {comments.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum comentário encontrado</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-3">
                {history.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <span className="text-lg">{getHistoryIcon(entry.action)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{entry.user_name}</span>
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(new Date(entry.changed_at), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {entry.action === 'created' && 'Criou a tarefa'}
                        {entry.action === 'status_changed' && 
                          `Alterou o status de "${entry.old_value}" para "${entry.new_value}"`}
                        {entry.action === 'priority_changed' && 
                          `Alterou a prioridade de "${entry.old_value}" para "${entry.new_value}"`}
                        {entry.action === 'title_changed' && 
                          `Alterou o título para "${entry.new_value}"`}
                        {entry.action === 'timer_started' && 'Iniciou o cronômetro'}
                        {entry.action === 'timer_stopped' && 'Pausou o cronômetro'}
                        {entry.action === 'comment_added' && entry.new_value}
                        {entry.action === 'attachment_added' && entry.new_value}
                      </div>
                    </div>
                  </div>
                ))}
                
                {history.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum histórico encontrado</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
