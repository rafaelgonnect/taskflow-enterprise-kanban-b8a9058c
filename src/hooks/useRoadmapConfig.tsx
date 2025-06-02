
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { RoadmapConfig } from '@/types/roadmap';
import { useToast } from '@/hooks/use-toast';

export function useRoadmapConfig() {
  const { user } = useAuth();
  const { selectedCompany } = useCompanyContext();

  return useQuery({
    queryKey: ['roadmap-config', selectedCompany?.id],
    queryFn: async () => {
      if (!user || !selectedCompany?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('roadmap_configs')
        .select('*')
        .eq('company_id', selectedCompany.id)
        .order('config_key');

      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!selectedCompany?.id,
  });
}

export function useSetRoadmapConfig() {
  const queryClient = useQueryClient();
  const { selectedCompany } = useCompanyContext();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ key, value, description }: { key: string; value: any; description?: string }) => {
      if (!user || !selectedCompany?.id) {
        throw new Error('Usuário ou empresa não encontrados');
      }

      const { data, error } = await supabase
        .from('roadmap_configs')
        .upsert({
          company_id: selectedCompany.id,
          config_key: key,
          config_value: value,
          description,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap-config'] });
      toast({
        title: 'Configuração salva',
        description: 'Configuração salva com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao salvar configuração',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useGetConfigValue(key: string) {
  const { data: configs } = useRoadmapConfig();
  
  const config = configs?.find(c => c.config_key === key);
  return config?.config_value;
}
