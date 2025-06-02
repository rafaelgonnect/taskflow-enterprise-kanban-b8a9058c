
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useRoadmapStats } from '@/hooks/useRoadmapStats';
import { BarChart3, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';

export const RoadmapStats = () => {
  const { data: stats, isLoading } = useRoadmapStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              No roadmap atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completion_rate.toFixed(1)}%</div>
            <Progress value={stats.completion_rate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.avg_completion_time)}</div>
            <p className="text-xs text-muted-foreground">
              dias para conclusão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.by_status.in_progress}</div>
            <p className="text-xs text-muted-foreground">
              itens ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status dos Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.by_status).map(([status, count]) => {
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                const statusLabels = {
                  planned: '📋 Planejado',
                  in_progress: '🔄 Em Progresso',
                  in_review: '👀 Em Revisão',
                  completed: '✅ Concluído',
                  cancelled: '❌ Cancelado',
                  paused: '⏸️ Pausado'
                };
                
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{statusLabels[status as keyof typeof statusLabels]}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.by_category).map(([category, count]) => {
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                const categoryLabels = {
                  feature: '🆕 Funcionalidades',
                  improvement: '⚡ Melhorias',
                  bugfix: '🐛 Correções',
                  breaking_change: '⚠️ Mudanças Críticas'
                };
                
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{categoryLabels[category as keyof typeof categoryLabels]}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
