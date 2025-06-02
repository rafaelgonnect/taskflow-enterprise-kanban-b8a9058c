
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCompany } from '@/contexts/CompanyContext';
import { RoadmapItem, RoadmapFilters } from '@/types/roadmap';
import { useToast } from '@/hooks/use-toast';

export function useRoadmap(filters?: RoadmapFilters) {
  const { user } = useAuth();
  const { currentCompany } = useCompany();

  return useQuery({
    queryKey: ['roadmap', currentCompany?.id, filters],
    queryFn: async () => {
      if (!user || !currentCompany?.id) {
        console.log('useRoadmap: user ou company não definidos');
        return [];
      }

      console.log('Buscando itens do roadmap para empresa:', currentCompany.id);

      let query = supabase
        .from('roadmap_items')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      // Aplicar filtros
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
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar roadmap:', error);
        throw error;
      }

      console.log('Itens do roadmap encontrados:', data?.length || 0);
      return data || [];
    },
    enabled: !!user && !!currentCompany?.id,
  });
}

export function useCreateRoadmapItem() {
  const queryClient = useQueryClient();
  const { currentCompany } = useCompany();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (itemData: Omit<RoadmapItem, 'id' | 'created_at' | 'updated_at' | 'company_id' | 'created_by'>) => {
      const { data, error } = await supabase
        .from('roadmap_items')
        .insert([{
          ...itemData,
          company_id: currentCompany?.id,
        }])
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
        title: 'Item excluído',
        description: 'Item do roadmap excluído com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
