
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoadmapItem, RoadmapStatus } from '@/types/roadmap';
import { useUpdateRoadmapItem } from '@/hooks/useRoadmap';
import { RoadmapItemDialog } from './RoadmapItemDialog';
import { Calendar, Clock, Edit, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RoadmapKanbanProps {
  items: RoadmapItem[];
}

const STATUS_COLUMNS: { status: RoadmapStatus; title: string; color: string }[] = [
  { status: 'planned', title: '📋 Planejado', color: 'bg-blue-50 border-blue-200' },
  { status: 'in_progress', title: '🔄 Em Progresso', color: 'bg-yellow-50 border-yellow-200' },
  { status: 'in_review', title: '👀 Em Revisão', color: 'bg-purple-50 border-purple-200' },
  { status: 'completed', title: '✅ Concluído', color: 'bg-green-50 border-green-200' },
];

const PRIORITY_COLORS = {
  critical: 'bg-red-100 text-red-800 border-red-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-green-100 text-green-800 border-green-300'
};

const CATEGORY_ICONS = {
  feature: '🆕',
  improvement: '⚡',
  bugfix: '🐛',
  breaking_change: '⚠️'
};

export const RoadmapKanban = ({ items }: RoadmapKanbanProps) => {
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const updateItem = useUpdateRoadmapItem();

  const handleStatusChange = async (item: RoadmapItem, newStatus: RoadmapStatus) => {
    const updates: Partial<RoadmapItem> = { status: newStatus };
    
    // Se mudou para concluído, definir data de conclusão
    if (newStatus === 'completed' && item.status !== 'completed') {
      updates.completed_date = new Date().toISOString().split('T')[0];
    }
    
    await updateItem.mutateAsync({
      id: item.id,
      ...updates
    });
  };

  const handleEditItem = (item: RoadmapItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATUS_COLUMNS.map((column) => {
          const columnItems = items.filter(item => item.status === column.status);
          
          return (
            <div key={column.status} className={`rounded-lg border-2 ${column.color} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{column.title}</h3>
                <Badge variant="secondary" className="ml-2">
                  {columnItems.length}
                </Badge>
              </div>
              
              <div className="space-y-3">
                {columnItems.map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span>{CATEGORY_ICONS[item.category]}</span>
                          <CardTitle className="text-sm font-medium">
                            {item.title}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {item.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${PRIORITY_COLORS[item.priority]}`}
                        >
                          {item.priority}
                        </Badge>
                        
                        {item.version && (
                          <Badge variant="outline" className="text-xs">
                            {item.version}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-500">
                        {item.estimated_hours && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.estimated_hours}h estimadas</span>
                          </div>
                        )}
                        
                        {item.target_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(new Date(item.target_date), 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                          </div>
                        )}
                        
                        {item.assigned_to && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>Atribuído</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Botões de mudança de status */}
                      {column.status !== item.status && (
                        <div className="mt-3 flex gap-1">
                          {STATUS_COLUMNS
                            .filter(col => col.status !== item.status)
                            .slice(0, 2)
                            .map((targetColumn) => (
                              <Button
                                key={targetColumn.status}
                                variant="outline"
                                size="sm"
                                className="text-xs h-6"
                                onClick={() => handleStatusChange(item, targetColumn.status)}
                              >
                                {targetColumn.title.split(' ')[0]}
                              </Button>
                            ))
                          }
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {columnItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Nenhum item neste status</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <RoadmapItemDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        item={selectedItem}
      />
    </>
  );
};
