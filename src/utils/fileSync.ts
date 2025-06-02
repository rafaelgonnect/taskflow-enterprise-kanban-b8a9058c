
import { RoadmapConfigFile, DevelopmentContext } from '@/types/roadmap';

// Configurações padrão para novos projetos
export const defaultRoadmapConfig: RoadmapConfigFile = {
  version: "1.0.0",
  last_updated: new Date().toISOString(),
  templates: {
    default_categories: ['feature', 'improvement', 'bugfix', 'breaking_change'],
    default_priorities: ['critical', 'high', 'medium', 'low'],
    validation_rules: {
      require_specs_for_features: true,
      require_tests_for_critical: true,
      auto_assign_version: true,
    }
  },
  ai_settings: {
    enabled: false,
    model: "gpt-4",
    max_suggestions: 5,
    confidence_threshold: 0.7,
  },
  documentation_settings: {
    auto_generate: false,
    required_sections: ['specs', 'test'],
    templates: {
      feature_spec: "# Feature Specification\n\n## Overview\n\n## Requirements\n\n## Acceptance Criteria",
      test_plan: "# Test Plan\n\n## Test Cases\n\n## Expected Results",
    }
  }
};

export const defaultDevelopmentContext: DevelopmentContext = {
  project_name: "Plataforma de Gestão",
  version: "1.0.0",
  architecture: {
    frontend: ["React", "TypeScript", "Tailwind CSS", "Shadcn/UI"],
    backend: ["Supabase", "PostgreSQL", "Edge Functions"],
    database: "PostgreSQL with Supabase",
    deployment: "Lovable Platform"
  },
  current_sprint: {
    name: "Sprint 1",
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    goals: [
      "Implementar sistema de roadmap avançado",
      "Integrar documentação técnica",
      "Preparar base para IA"
    ]
  },
  team: {
    developers: 2,
    qa: 1,
    designers: 1
  },
  tech_debt: {
    level: "low",
    priority_areas: []
  },
  recent_changes: [
    {
      date: new Date().toISOString().split('T')[0],
      description: "Implementação do sistema de documentação",
      impact: "Melhoria na organização e controle do desenvolvimento"
    }
  ]
};

// Simula leitura/escrita de arquivos JSON (em produção seria integrado com sistema de arquivos)
export class FileSync {
  private static configs = new Map<string, any>();

  static async readConfig(filename: string): Promise<any> {
    // Em produção, seria uma leitura real de arquivo
    const stored = localStorage.getItem(`roadmap_config_${filename}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Retorna configuração padrão se não existir
    switch (filename) {
      case 'roadmap-config.json':
        return defaultRoadmapConfig;
      case 'development-context.json':
        return defaultDevelopmentContext;
      default:
        return {};
    }
  }

  static async writeConfig(filename: string, data: any): Promise<void> {
    // Em produção, seria uma escrita real de arquivo
    localStorage.setItem(`roadmap_config_${filename}`, JSON.stringify(data, null, 2));
    this.configs.set(filename, data);
  }

  static async syncToSupabase(companyId: string, filename: string, data: any): Promise<void> {
    // Sincroniza com Supabase para backup e compartilhamento
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      await supabase
        .from('roadmap_configs')
        .upsert({
          company_id: companyId,
          config_key: filename,
          config_value: data,
          description: `Arquivo de configuração: ${filename}`,
        });
    } catch (error) {
      console.error('Erro ao sincronizar com Supabase:', error);
    }
  }

  static async loadFromSupabase(companyId: string, filename: string): Promise<any> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase
        .from('roadmap_configs')
        .select('config_value')
        .eq('company_id', companyId)
        .eq('config_key', filename)
        .single();

      if (error || !data) {
        return await this.readConfig(filename);
      }

      return data.config_value;
    } catch (error) {
      console.error('Erro ao carregar do Supabase:', error);
      return await this.readConfig(filename);
    }
  }

  static generateContextForAI(context: DevelopmentContext, roadmapItems: any[], documentation: any[]): string {
    return `# Contexto do Projeto para IA

## Informações do Projeto
- **Nome:** ${context.project_name}
- **Versão:** ${context.version}
- **Sprint Atual:** ${context.current_sprint.name}

## Arquitetura Técnica
- **Frontend:** ${context.architecture.frontend.join(', ')}
- **Backend:** ${context.architecture.backend.join(', ')}
- **Banco de Dados:** ${context.architecture.database}
- **Deploy:** ${context.architecture.deployment}

## Estado Atual
- **Total de Items no Roadmap:** ${roadmapItems.length}
- **Items Concluídos:** ${roadmapItems.filter(item => item.status === 'completed').length}
- **Items em Progresso:** ${roadmapItems.filter(item => item.status === 'in_progress').length}
- **Documentos Técnicos:** ${documentation.length}

## Objetivos do Sprint
${context.current_sprint.goals.map(goal => `- ${goal}`).join('\n')}

## Dívida Técnica
- **Nível:** ${context.tech_debt.level}
- **Áreas Prioritárias:** ${context.tech_debt.priority_areas.join(', ') || 'Nenhuma'}

## Mudanças Recentes
${context.recent_changes.map(change => 
  `- **${change.date}:** ${change.description} (${change.impact})`
).join('\n')}

## Instruções para IA
- Foque em funcionalidades que complementem o sistema atual
- Considere a arquitetura existente nas sugestões
- Priorize melhorias que reduzam dívida técnica
- Mantenha consistência com padrões já estabelecidos
- Sugira apenas funcionalidades viáveis com a stack atual
`;
  }
}
