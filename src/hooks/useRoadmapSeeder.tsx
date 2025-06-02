
import { useCreateRoadmapItem } from '@/hooks/useRoadmap';
import { useCreateDocumentation } from '@/hooks/useRoadmapDocumentation';
import { useAuth } from '@/hooks/useAuth';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/use-toast';
import { initialRoadmapItems, initialDocumentation } from '@/data/roadmap';

export function useRoadmapSeeder() {
  const { user } = useAuth();
  const { selectedCompany } = useCompanyContext();
  const { toast } = useToast();
  const createRoadmapItem = useCreateRoadmapItem();
  const createDocumentation = useCreateDocumentation();

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

  const syncDocumentation = async () => {
    if (!user || !selectedCompany?.id) {
      toast({
        title: 'Erro',
        description: 'Usuário ou empresa não encontrados',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Sincronizando documentação...', initialDocumentation);
      
      // Criar/atualizar apenas a documentação
      for (const doc of initialDocumentation) {
        await createDocumentation.mutateAsync(doc);
      }

      toast({
        title: 'Sucesso',
        description: 'Documentação sincronizada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao sincronizar documentação:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao sincronizar documentação',
        variant: 'destructive',
      });
    }
  };

  return {
    seedRoadmapData,
    syncDocumentation,
    isLoading: createRoadmapItem.isPending || createDocumentation.isPending,
  };
}
