
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/use-toast';
import { RoadmapItem } from '@/types/roadmap';

export function useAIAnalysis() {
  const { selectedCompany } = useCompanyContext();
  const { toast } = useToast();

  const analyzeRoadmap = useMutation({
    mutationFn: async ({ items, type }: { items: RoadmapItem[], type: string }) => {
      if (!selectedCompany?.id) {
        throw new Error('Empresa não selecionada');
      }

      const { data, error } = await supabase.functions.invoke('ai-roadmap-analysis', {
        body: {
          roadmapItems: items,
          type,
          companyId: selectedCompany.id
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Análise concluída',
        description: 'A IA analisou o roadmap com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro na análise',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const generateDocumentation = useMutation({
    mutationFn: async ({ item, type, userId }: { item: RoadmapItem, type: string, userId: string }) => {
      if (!selectedCompany?.id) {
        throw new Error('Empresa não selecionada');
      }

      const { data, error } = await supabase.functions.invoke('ai-auto-generation', {
        body: {
          roadmapItem: item,
          type,
          companyId: selectedCompany.id,
          userId
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Documentação gerada',
        description: 'A IA gerou a documentação com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro na geração',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    analyzeRoadmap,
    generateDocumentation,
  };
}

export function useAIInsights() {
  const { selectedCompany } = useCompanyContext();

  return useQuery({
    queryKey: ['ai-insights', selectedCompany?.id],
    queryFn: async () => {
      if (!selectedCompany?.id) return [];

      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('company_id', selectedCompany.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompany?.id,
  });
}
