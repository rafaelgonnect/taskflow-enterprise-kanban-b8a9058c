
import { useCreateRoadmapItem, useCreateDocumentation } from '@/hooks/useRoadmap';
import { useCreateDocumentation as useCreateRoadmapDocumentation } from '@/hooks/useRoadmapDocumentation';
import { useAuth } from '@/hooks/useAuth';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/use-toast';
import { initialRoadmapItems, initialDocumentation } from '@/data/initialRoadmapData';

export function useRoadmapSeeder() {
  const { user } = useAuth();
  const { selectedCompany } = useCompanyContext();
  const { toast } = useToast();
  const createRoadmapItem = useCreateRoadmapItem();
  const createDocumentation = useCreateRoadmapDocumentation();

  const seedRoadmapData = async () => {
    if (!user || !selectedCompany?.id) {
      toast({
        title: 'Erro',
        description: 'Usuário ou empresa não encontrados',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Criar itens do roadmap
      for (const item of initialRoadmapItems) {
        await createRoadmapItem.mutateAsync(item);
      }

      // Criar documentação
      for (const doc of initialDocumentation) {
        await createDocumentation.mutateAsync(doc);
      }

      toast({
        title: 'Sucesso',
        description: 'Roadmap e documentação iniciais criados com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao criar dados iniciais:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar dados iniciais',
        variant: 'destructive',
      });
    }
  };

  return {
    seedRoadmapData,
    isLoading: createRoadmapItem.isPending || createDocumentation.isPending,
  };
}
