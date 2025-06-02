
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoadmap } from '@/hooks/useRoadmap';
import { RoadmapKanban } from '@/components/roadmap/RoadmapKanban';
import { RoadmapStats } from '@/components/roadmap/RoadmapStats';
import { RoadmapItemDialog } from '@/components/roadmap/RoadmapItemDialog';
import { RoadmapFilters } from '@/types/roadmap';
import { Plus, Search, Filter, Download, GitBranch } from 'lucide-react';

const Roadmap = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<RoadmapFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Aplicar filtros incluindo busca
  const appliedFilters = {
    ...filters,
    search: searchTerm || undefined
  };

  const { data: items = [], isLoading } = useRoadmap(appliedFilters);

  const handleFilterChange = (key: keyof RoadmapFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  // Agrupar itens por versão para o changelog
  const itemsByVersion = items.reduce((acc, item) => {
    const version = item.version || 'Sem versão';
    if (!acc[version]) acc[version] = [];
    acc[version].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const completedItems = items.filter(item => item.status === 'completed');

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <GitBranch className="w-8 h-8" />
            Roadmap & Changelog
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie funcionalidades e acompanhe o progresso do desenvolvimento
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar itens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.status?.[0] || 'all'} onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : [value])}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="planned">📋 Planejado</SelectItem>
                <SelectItem value="in_progress">🔄 Em Progresso</SelectItem>
                <SelectItem value="in_review">👀 Em Revisão</SelectItem>
                <SelectItem value="completed">✅ Concluído</SelectItem>
                <SelectItem value="cancelled">❌ Cancelado</SelectItem>
                <SelectItem value="paused">⏸️ Pausado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category?.[0] || 'all'} onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : [value])}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="feature">🆕 Funcionalidade</SelectItem>
                <SelectItem value="improvement">⚡ Melhoria</SelectItem>
                <SelectItem value="bugfix">🐛 Correção</SelectItem>
                <SelectItem value="breaking_change">⚠️ Mudança Crítica</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority?.[0] || 'all'} onValueChange={(value) => handleFilterChange('priority', value === 'all' ? undefined : [value])}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="critical">🚨 Crítica</SelectItem>
                <SelectItem value="high">🔴 Alta</SelectItem>
                <SelectItem value="medium">🟡 Média</SelectItem>
                <SelectItem value="low">🟢 Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(Object.keys(filters).length > 0 || searchTerm) && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex gap-2">
                <span className="text-sm text-gray-600">Filtros ativos:</span>
                {searchTerm && (
                  <Badge variant="secondary">Busca: "{searchTerm}"</Badge>
                )}
                {Object.entries(filters).map(([key, value]) => 
                  value && (
                    <Badge key={key} variant="secondary">
                      {key}: {Array.isArray(value) ? value.join(', ') : value}
                    </Badge>
                  )
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs de Visualização */}
      <Tabs defaultValue="kanban" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="changelog">Changelog</TabsTrigger>
          <TabsTrigger value="stats">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-6">
          <RoadmapKanban items={items} />
        </TabsContent>

        <TabsContent value="changelog" className="space-y-6">
          <div className="space-y-6">
            {Object.entries(itemsByVersion)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([version, versionItems]) => {
                const versionCompletedItems = versionItems.filter(item => item.status === 'completed');
                
                if (versionCompletedItems.length === 0) return null;

                return (
                  <Card key={version}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant="outline" className="text-base px-3 py-1">
                          {version}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          ({versionCompletedItems.length} itens concluídos)
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {versionCompletedItems.map((item) => (
                          <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-lg">
                              {item.category === 'feature' && '🆕'}
                              {item.category === 'improvement' && '⚡'}
                              {item.category === 'bugfix' && '🐛'}
                              {item.category === 'breaking_change' && '⚠️'}
                            </span>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.title}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              )}
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                                {item.completed_date && (
                                  <Badge variant="outline" className="text-xs">
                                    Concluído em {new Date(item.completed_date).toLocaleDateString('pt-BR')}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

            {completedItems.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">Nenhum item concluído ainda</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Items concluídos aparecerão aqui organizados por versão
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <RoadmapStats />
        </TabsContent>
      </Tabs>

      {/* Dialog para criar/editar itens */}
      <RoadmapItemDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default Roadmap;
