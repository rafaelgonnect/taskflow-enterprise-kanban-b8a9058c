
import { supabase } from '@/integrations/supabase/client';
import { RoadmapConfigFile, DevelopmentContext, RoadmapItem, RoadmapDocumentation } from '@/types/roadmap';

export class FileSync {
  // Simular sistema de arquivos local para desenvolvimento
  private static localStorage = {
    'roadmap-config.json': null as RoadmapConfigFile | null,
    'development-context.json': null as DevelopmentContext | null,
  };

  static async writeConfig(filename: string, data: any): Promise<void> {
    // Em produção, isso seria salvo em arquivo
    // Por agora, usar localStorage para simular
    localStorage.setItem(`filesync_${filename}`, JSON.stringify(data));
    console.log(`Arquivo ${filename} salvo localmente`);
  }

  static async readConfig(filename: string): Promise<any> {
    // Em produção, isso leria do arquivo
    // Por agora, usar localStorage
    const data = localStorage.getItem(`filesync_${filename}`);
    return data ? JSON.parse(data) : null;
  }

  static async syncToSupabase(companyId: string, filename: string, data: any): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      await supabase
        .from('roadmap_configs')
        .upsert({
          company_id: companyId,
          config_key: filename,
          config_value: data,
          description: `Arquivo de configuração: ${filename}`,
          created_by: user.user.id,
        });

      console.log(`Dados sincronizados com Supabase: ${filename}`);
    } catch (error) {
      console.error('Erro ao sincronizar com Supabase:', error);
      throw error;
    }
  }

  static async loadFromSupabase(companyId: string, filename: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('roadmap_configs')
        .select('config_value')
        .eq('company_id', companyId)
        .eq('config_key', filename)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 é "no rows returned"
        throw error;
      }

      return data?.config_value || null;
    } catch (error) {
      console.error('Erro ao carregar do Supabase:', error);
      return null;
    }
  }

  static generateContextForAI(
    context: DevelopmentContext,
    roadmapItems: RoadmapItem[],
    documentation: RoadmapDocumentation[]
  ): string {
    const aiContext = {
      project_overview: {
        name: context.project_name,
        version: context.version,
        architecture: context.architecture,
        current_sprint: context.current_sprint,
        team_size: context.team,
        tech_debt_level: context.tech_debt.level,
      },
      development_status: {
        total_features: roadmapItems.length,
        completed_features: roadmapItems.filter(item => item.status === 'completed').length,
        in_progress_features: roadmapItems.filter(item => item.status === 'in_progress').length,
        planned_features: roadmapItems.filter(item => item.status === 'planned').length,
      },
      priority_items: roadmapItems
        .filter(item => item.priority === 'critical' || item.priority === 'high')
        .map(item => ({
          title: item.title,
          description: item.description,
          status: item.status,
          priority: item.priority,
          technical_specs: item.technical_specs,
          dependencies: item.dependencies,
        })),
      documentation_summary: {
        total_docs: documentation.length,
        by_type: documentation.reduce((acc, doc) => {
          acc[doc.doc_type] = (acc[doc.doc_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
      recent_changes: context.recent_changes,
      tech_debt_areas: context.tech_debt.priority_areas,
    };

    return `
# Contexto de Desenvolvimento - ${context.project_name}

## Estado Atual do Projeto
- **Versão:** ${context.version}
- **Sprint Atual:** ${context.current_sprint.name} (${context.current_sprint.start_date} - ${context.current_sprint.end_date})
- **Nível de Débito Técnico:** ${context.tech_debt.level}

## Arquitetura
- **Frontend:** ${context.architecture.frontend.join(', ')}
- **Backend:** ${context.architecture.backend.join(', ')}
- **Banco de Dados:** ${context.architecture.database}
- **Deploy:** ${context.architecture.deployment}

## Status de Desenvolvimento
- **Total de Funcionalidades:** ${aiContext.development_status.total_features}
- **Concluídas:** ${aiContext.development_status.completed_features}
- **Em Progresso:** ${aiContext.development_status.in_progress_features}
- **Planejadas:** ${aiContext.development_status.planned_features}

## Itens Prioritários
${aiContext.priority_items.map(item => `
### ${item.title} (${item.priority})
- **Status:** ${item.status}
- **Descrição:** ${item.description}
- **Especificações:** ${item.technical_specs || 'Não definidas'}
- **Dependências:** ${item.dependencies?.join(', ') || 'Nenhuma'}
`).join('\n')}

## Documentação Disponível
- **Total:** ${aiContext.documentation_summary.total_docs} documentos
- **Por Tipo:** ${Object.entries(aiContext.documentation_summary.by_type).map(([type, count]) => `${type}: ${count}`).join(', ')}

## Mudanças Recentes
${context.recent_changes.map(change => `
- **${change.date}:** ${change.description} (Impacto: ${change.impact})
`).join('\n')}

## Áreas de Débito Técnico
${context.tech_debt.priority_areas.map(area => `- ${area}`).join('\n')}

---
*Este contexto foi gerado automaticamente para auxiliar agentes de IA no desenvolvimento.*
    `.trim();
  }

  static async exportForAgent(companyId: string): Promise<string> {
    try {
      // Carregar todos os dados necessários
      const [configData, contextData] = await Promise.all([
        this.loadFromSupabase(companyId, 'roadmap-config.json'),
        this.loadFromSupabase(companyId, 'development-context.json'),
      ]);

      // Buscar roadmap items
      const { data: roadmapItems } = await supabase
        .from('roadmap_items')
        .select('*')
        .eq('company_id', companyId);

      // Buscar documentação
      const { data: documentation } = await supabase
        .from('roadmap_documentation')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true);

      const exportPackage = {
        config: configData,
        context: contextData,
        roadmap_items: roadmapItems || [],
        documentation: documentation || [],
        ai_context: contextData ? this.generateContextForAI(contextData, roadmapItems || [], documentation || []) : null,
        export_timestamp: new Date().toISOString(),
        company_id: companyId,
      };

      return JSON.stringify(exportPackage, null, 2);
    } catch (error) {
      console.error('Erro ao exportar dados para agente:', error);
      throw error;
    }
  }
}
