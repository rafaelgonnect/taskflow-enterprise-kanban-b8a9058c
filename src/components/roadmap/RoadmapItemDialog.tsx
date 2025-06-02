
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCreateRoadmapItem, useUpdateRoadmapItem } from '@/hooks/useRoadmap';
import { RoadmapItem, RoadmapCategory, RoadmapStatus, RoadmapPriority } from '@/types/roadmap';
import { cn } from '@/lib/utils';

interface RoadmapItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item?: RoadmapItem | null;
}

const CATEGORY_LABELS: Record<RoadmapCategory, string> = {
  feature: '🆕 Nova Funcionalidade',
  improvement: '⚡ Melhoria',
  bugfix: '🐛 Correção de Bug',
  breaking_change: '⚠️ Mudança Crítica'
};

const STATUS_LABELS: Record<RoadmapStatus, string> = {
  planned: '📋 Planejado',
  in_progress: '🔄 Em Progresso',
  in_review: '👀 Em Revisão',
  completed: '✅ Concluído',
  cancelled: '❌ Cancelado',
  paused: '⏸️ Pausado'
};

const PRIORITY_LABELS: Record<RoadmapPriority, string> = {
  critical: '🚨 Crítica',
  high: '🔴 Alta',
  medium: '🟡 Média',
  low: '🟢 Baixa'
};

export const RoadmapItemDialog = ({ isOpen, onClose, item }: RoadmapItemDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'feature' as RoadmapCategory,
    status: 'planned' as RoadmapStatus,
    priority: 'medium' as RoadmapPriority,
    version: '',
    estimated_hours: '',
    start_date: undefined as Date | undefined,
    target_date: undefined as Date | undefined
  });

  const createItem = useCreateRoadmapItem();
  const updateItem = useUpdateRoadmapItem();

  const isEdit = !!item;

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description || '',
        category: item.category,
        status: item.status,
        priority: item.priority,
        version: item.version || '',
        estimated_hours: item.estimated_hours?.toString() || '',
        start_date: item.start_date ? new Date(item.start_date) : undefined,
        target_date: item.target_date ? new Date(item.target_date) : undefined
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'feature',
        status: 'planned',
        priority: 'medium',
        version: '',
        estimated_hours: '',
        start_date: undefined,
        target_date: undefined
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    const itemData = {
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      status: formData.status,
      priority: formData.priority,
      version: formData.version || undefined,
      estimated_hours: formData.estimated_hours ? parseInt(formData.estimated_hours) : undefined,
      start_date: formData.start_date ? formData.start_date.toISOString().split('T')[0] : undefined,
      target_date: formData.target_date ? formData.target_date.toISOString().split('T')[0] : undefined,
    };

    try {
      if (isEdit && item) {
        await updateItem.mutateAsync({
          id: item.id,
          ...itemData
        });
      } else {
        await createItem.mutateAsync(itemData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Item do Roadmap' : 'Novo Item do Roadmap'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifique as informações do item' : 'Adicione um novo item ao roadmap'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Implementar sistema de notificações"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva os detalhes da funcionalidade..."
                rows={3}
              />
            </div>

            <div>
              <Label>Categoria</Label>
              <Select value={formData.category} onValueChange={(value: RoadmapCategory) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: RoadmapStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value: RoadmapPriority) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="version">Versão</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                placeholder="Ex: v1.2.0"
              />
            </div>

            <div>
              <Label htmlFor="estimated_hours">Estimativa (horas)</Label>
              <Input
                id="estimated_hours"
                type="number"
                value={formData.estimated_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: e.target.value }))}
                placeholder="Ex: 40"
                min="1"
              />
            </div>

            <div>
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.start_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? format(formData.start_date, "PPP", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, start_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Data Prevista</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.target_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.target_date ? format(formData.target_date, "PPP", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.target_date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, target_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createItem.isPending || updateItem.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {createItem.isPending || updateItem.isPending 
                ? 'Salvando...' 
                : isEdit ? 'Atualizar' : 'Criar Item'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
