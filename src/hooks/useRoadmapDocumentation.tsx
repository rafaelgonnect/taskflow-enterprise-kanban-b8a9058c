
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { RoadmapDocumentation, DocumentationType } from '@/types/roadmap';
import { useToast } from '@/hooks/use-toast';

export function useRoadmapDocumentation(itemId?: string) {
  const { user } = useAuth();
  const { selectedCompany } = useCompanyContext();

  return useQuery({
    queryKey: ['roadmap-documentation', selectedCompany?.id, itemId],
    queryFn: async () => {
      if (!user || !selectedCompany?.id) {
        return [];
      }

      let query = supabase
        .from('roadmap_documentation')
        .select('*')
        .eq('company_id', selectedCompany.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (itemId) {
        query = query.eq('roadmap_item_id', itemId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!selectedCompany?.id,
  });
}

export function useCreateDocumentation() {
  const queryClient = useQueryClient();
  const { selectedCompany } = useCompanyContext();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (docData: Omit<RoadmapDocumentation, 'id' | 'created_at' | 'updated_at' | 'company_id' | 'created_by' | 'version'>) => {
      if (!user || !selectedCompany?.id) {
        throw new Error('Usuário ou empresa não encontrados');
      }

      const { data, error } = await supabase
        .from('roadmap_documentation')
        .insert({
          ...docData,
          company_id: selectedCompany.id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap-documentation'] });
      toast({
        title: 'Documentação criada',
        description: 'Documentação criada com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar documentação',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateDocumentation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RoadmapDocumentation> & { id: string }) => {
      const { data, error } = await supabase
        .from('roadmap_documentation')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap-documentation'] });
      toast({
        title: 'Documentação atualizada',
        description: 'Documentação atualizada com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar documentação',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDocumentationByType(docType: DocumentationType) {
  const { user } = useAuth();
  const { selectedCompany } = useCompanyContext();

  return useQuery({
    queryKey: ['roadmap-documentation-by-type', selectedCompany?.id, docType],
    queryFn: async () => {
      if (!user || !selectedCompany?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('roadmap_documentation')
        .select('*')
        .eq('company_id', selectedCompany.id)
        .eq('doc_type', docType)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!selectedCompany?.id,
  });
}
