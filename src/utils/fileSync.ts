
import { supabase } from '@/integrations/supabase/client';
import { RoadmapItem, RoadmapDocumentation, DevelopmentContext, RoadmapCategory, RoadmapStatus, RoadmapPriority, ValidationStatus, RoadmapSource, DocumentationType, DocumentationFormat } from '@/types/roadmap';

export class FileSync {
  // Salvar configuração local (simulação)
  static async writeConfig(filename: string, data: any): Promise<void> {
    try {
      // Em uma implementação real, salvaria em localStorage ou IndexedDB
      localStorage.setItem(`roadmap_${filename}`, JSON.stringify(data));
      console.log(`Configuração ${filename} salva localmente`);
    } catch (error) {
      console.error(`Erro ao salvar ${filename}:`, error);
      throw error;
    }
  }

  // Sincronizar com Supabase
  static async syncToSupabase(companyId: string, configKey: string, data: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('roadmap_configs')
        .upsert({
          company_id: companyId,
          config_key: configKey,
          config_value: data,
          description: `Configuração do ${configKey}`,
          created_by: (await supabase.auth.getUser()).data.user?.id || '',
        });

      if (error) throw error;
      console.log(`Dados sincronizados para Supabase: ${configKey}`);
    } catch (error) {
      console.error(`Erro ao sincronizar ${configKey}:`, error);
      throw error;
    }
  }

  // Carregar do Supabase
  static async loadFromSupabase(companyId: string, configKey: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('roadmap_configs')
        .select('config_value')
        .eq('company_id', companyId)
        .eq('config_key', configKey)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data?.config_value || null;
    } catch (error) {
      console.error(`Erro ao carregar ${configKey}:`, error);
      return null;
    }
  }

  // Exportar dados para arquivo
  static async exportToFile(
    companyId: string,
    roadmapItems: any[],
    documentation: any[]
  ): Promise<void> {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        company_id: companyId,
        roadmap_items: roadmapItems,
        documentation: documentation,
        version: '1.0',
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roadmap-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  }

  // Importar dados de arquivo
  static async importFromFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          resolve(data);
        } catch (error) {
          reject(new Error('Arquivo inválido'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  }

  // Gerar contexto para IA
  static generateContextForAI(
    context: DevelopmentContext,
    roadmapItems: RoadmapItem[],
    documentation: RoadmapDocumentation[]
  ): string {
    // Transform roadmap items with proper type casting
    const transformedItems: RoadmapItem[] = roadmapItems.map(item => ({
      ...item,
      category: item.category as RoadmapCategory,
      status: item.status as RoadmapStatus,
      priority: item.priority as RoadmapPriority,
      validation_status: (item.validation_status as ValidationStatus) || 'pending',
      source: (item.source as RoadmapSource) || 'manual',
      test_criteria: Array.isArray(item.test_criteria) ? item.test_criteria : 
                    typeof item.test_criteria === 'string' ? JSON.parse(item.test_criteria) : [],
      dependencies: Array.isArray(item.dependencies) ? item.dependencies : 
                   typeof item.dependencies === 'string' ? JSON.parse(item.dependencies) : [],
      context_tags: Array.isArray(item.context_tags) ? item.context_tags : 
                   typeof item.context_tags === 'string' ? JSON.parse(item.context_tags) : [],
      test_results: typeof item.test_results === 'object' ? item.test_results : {}
    }));

    const aiContext = {
      project_overview: {
        name: context.project_name,
        version: context.version,
        architecture: context.architecture,
        team_size: context.team,
        tech_debt_level: context.tech_debt.level,
      },
      current_status: {
        active_items: transformedItems.filter(item => ['in_progress', 'in_review'].includes(item.status)),
        planned_items: transformedItems.filter(item => item.status === 'planned'),
        completed_items: transformedItems.filter(item => item.status === 'completed'),
        high_priority: transformedItems.filter(item => ['critical', 'high'].includes(item.priority)),
      },
      development_context: {
        current_sprint: context.current_sprint,
        recent_changes: context.recent_changes,
        priority_areas: context.tech_debt.priority_areas,
      },
      technical_documentation: documentation.filter(doc => 
        ['specs', 'config', 'context'].includes(doc.doc_type)
      ),
      dependencies_and_risks: {
        blocked_items: transformedItems.filter(item => 
          item.dependencies && item.dependencies.length > 0
        ),
        validation_pending: transformedItems.filter(item => 
          item.validation_status === 'pending'
        ),
      },
    };

    return JSON.stringify(aiContext, null, 2);
  }

  // Criar backup automático
  static async createBackup(companyId: string): Promise<void> {
    try {
      // Buscar todos os dados
      const [roadmapData, configData, docData] = await Promise.all([
        supabase.from('roadmap_items').select('*').eq('company_id', companyId),
        supabase.from('roadmap_configs').select('*').eq('company_id', companyId),
        supabase.from('roadmap_documentation').select('*').eq('company_id', companyId),
      ]);

      const backup = {
        timestamp: new Date().toISOString(),
        company_id: companyId,
        roadmap_items: roadmapData.data || [],
        configs: configData.data || [],
        documentation: docData.data || [],
      };

      // Salvar no localStorage como backup
      localStorage.setItem(
        `roadmap_backup_${companyId}`,
        JSON.stringify(backup)
      );

      console.log('Backup criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      throw error;
    }
  }
}
