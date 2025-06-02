
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCompany } from '@/contexts/CompanyContext';
import { RoadmapStats } from '@/types/roadmap';

export function useRoadmapStats() {
  const { user } = useAuth();
  const { currentCompany } = useCompany();

  return useQuery({
    queryKey: ['roadmap-stats', currentCompany?.id],
    queryFn: async (): Promise<RoadmapStats> => {
      if (!user || !currentCompany?.id) {
        return {
          total: 0,
          by_status: {
            planned: 0,
            in_progress: 0,
            in_review: 0,
            completed: 0,
            cancelled: 0,
            paused: 0
          },
          by_category: {
            feature: 0,
            improvement: 0,
            bugfix: 0,
            breaking_change: 0
          },
          by_priority: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0
          },
          completion_rate: 0,
          avg_completion_time: 0
        };
      }

      const { data, error } = await supabase
        .from('roadmap_items')
        .select('status, category, priority, created_at, completed_date')
        .eq('company_id', currentCompany.id);

      if (error) throw error;

      const items = data || [];
      const total = items.length;

      // Contar por status
      const by_status = items.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Contar por categoria
      const by_category = items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Contar por prioridade
      const by_priority = items.reduce((acc, item) => {
        acc[item.priority] = (acc[item.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calcular taxa de conclusão
      const completed = by_status.completed || 0;
      const completion_rate = total > 0 ? (completed / total) * 100 : 0;

      // Calcular tempo médio de conclusão
      const completedItems = items.filter(item => 
        item.status === 'completed' && item.completed_date
      );
      
      const avg_completion_time = completedItems.length > 0
        ? completedItems.reduce((acc, item) => {
            const created = new Date(item.created_at);
            const completed = new Date(item.completed_date!);
            const days = Math.floor((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            return acc + days;
          }, 0) / completedItems.length
        : 0;

      return {
        total,
        by_status: {
          planned: by_status.planned || 0,
          in_progress: by_status.in_progress || 0,
          in_review: by_status.in_review || 0,
          completed: by_status.completed || 0,
          cancelled: by_status.cancelled || 0,
          paused: by_status.paused || 0
        },
        by_category: {
          feature: by_category.feature || 0,
          improvement: by_category.improvement || 0,
          bugfix: by_category.bugfix || 0,
          breaking_change: by_category.breaking_change || 0
        },
        by_priority: {
          critical: by_priority.critical || 0,
          high: by_priority.high || 0,
          medium: by_priority.medium || 0,
          low: by_priority.low || 0
        },
        completion_rate,
        avg_completion_time
      };
    },
    enabled: !!user && !!currentCompany?.id,
  });
}
