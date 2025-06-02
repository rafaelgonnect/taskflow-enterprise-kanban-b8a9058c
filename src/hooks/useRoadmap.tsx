
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { RoadmapItem, RoadmapFilters } from '@/types/roadmap';
import { useToast } from '@/hooks/use-toast';

export function useRoadmap(filters?: RoadmapFilters) {
  const { user } = useAuth();
  const { selectedCompany } = useCompanyContext();

  return useQuery({
    queryKey: ['roadmap', selectedCompany?.id, filters],
    queryFn: async () => {
      if (!user || !selectedCompany?.id) {
        return [];
      }

      console.log('Buscando itens do roadmap para empresa:', selectedCompany.id);

      let query = supabase
        .from('roadmap_items')
        .select('*')
        .eq('company_id', selectedCompany.id)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }

      if (filters?.category?.length) {
        query = query.in('category', filters.category);
      }

      if (filters?.priority?.length) {
        query = query.in('priority', filters.priority);
      }

      if (filters?.version) {
        query = query.eq('version', filters.version);
      }

      if (filters?.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }

      if (filters?.validation_status?.length) {
        query = query.in('validation_status', filters.validation_status);
      }

      if (filters?.source?.length) {
        query = query.in('source', filters.source);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar itens do roadmap:', error);
        throw error;
      }

      console.log('Itens do roadmap encontrados:', data?.length || 0);

      // Transform data to match RoadmapItem interface
      const transformedData: RoadmapItem[] = (data || []).map(item => ({
        ...item,
        test_criteria: Array.isArray(item.test_criteria) ? item.test_criteria : 
                      typeof item.test_criteria === 'string' ? JSON.parse(item.test_criteria) : [],
        dependencies: Array.isArray(item.dependencies) ? item.dependencies : 
                     typeof item.dependencies === 'string' ? JSON.parse(item.dependencies) : [],
        context_tags: Array.isArray(item.context_tags) ? item.context_tags : 
                     typeof item.context_tags === 'string' ? JSON.parse(item.context_tags) : [],
        test_results: typeof item.test_results === 'object' ? item.test_results : {}
      }));

      return transformedData;
    },
    enabled: !!user && !!selectedCompany?.id,
  });
}

export function useCreateRoadmapItem() {
  const queryClient = useQueryClient();
  const { selectedCompany } = useCompanyContext();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (itemData: Omit<RoadmapItem, 'id' | 'created_at' | 'updated_at' | 'company_id' | 'created_by'>) => {
      if (!user || !selectedCompany?.id) {
        throw new Error('Usuário ou empresa não encontrados');
      }

      const { data, error } = await supabase
        .from('roadmap_items')
        .insert({
          ...itemData,
          company_id: selectedCompany.id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      toast({
        title: 'Item criado',
        description: 'Item do roadmap criado com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateRoadmapItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RoadmapItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('roadmap_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      toast({
        title: 'Item atualizado',
        description: 'Item do roadmap atualizado com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteRoadmapItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('roadmap_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      toast({
        title: 'Item removido',
        description: 'Item do roadmap removido com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao remover item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
