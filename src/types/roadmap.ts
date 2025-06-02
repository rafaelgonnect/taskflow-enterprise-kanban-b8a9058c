
export type RoadmapCategory = 'feature' | 'improvement' | 'bugfix' | 'breaking_change';
export type RoadmapStatus = 'planned' | 'in_progress' | 'in_review' | 'completed' | 'cancelled' | 'paused';
export type RoadmapPriority = 'critical' | 'high' | 'medium' | 'low';
export type ValidationStatus = 'pending' | 'approved' | 'rejected';
export type RoadmapSource = 'manual' | 'ai_generated' | 'imported';
export type DocumentationType = 'specs' | 'notes' | 'sql' | 'config' | 'test' | 'context';
export type DocumentationFormat = 'markdown' | 'json' | 'sql' | 'text';
export type InsightType = 'suggestion' | 'analysis' | 'improvement' | 'risk' | 'dependency';
export type InsightStatus = 'pending' | 'reviewed' | 'implemented' | 'rejected';

export interface RoadmapItem {
  id: string;
  title: string;
  description?: string;
  category: RoadmapCategory;
  status: RoadmapStatus;
  priority: RoadmapPriority;
  version?: string;
  estimated_hours?: number;
  actual_hours?: number;
  assigned_to?: string;
  created_by: string;
  company_id: string;
  start_date?: string;
  target_date?: string;
  completed_date?: string;
  created_at: string;
  updated_at: string;
  // Novos campos
  technical_specs?: string;
  test_criteria?: string[];
  dependencies?: string[];
  ai_suggestions?: string;
  context_tags?: string[];
  validation_status?: ValidationStatus;
  source?: RoadmapSource;
  documentation_url?: string;
  test_results?: Record<string, any>;
}

export interface RoadmapDocumentation {
  id: string;
  roadmap_item_id?: string;
  doc_type: DocumentationType;
  title: string;
  content: string;
  format: DocumentationFormat;
  tags: string[];
  version: number;
  is_active: boolean;
  created_by: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface RoadmapConfig {
  id: string;
  company_id: string;
  config_key: string;
  config_value: any;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AIInsight {
  id: string;
  company_id: string;
  roadmap_item_id?: string;
  insight_type: InsightType;
  title: string;
  content: string;
  confidence_score: number;
  status: InsightStatus;
  metadata: Record<string, any>;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface RoadmapComment {
  id: string;
  roadmap_item_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

export interface RoadmapFilters {
  status?: RoadmapStatus[];
  category?: RoadmapCategory[];
  priority?: RoadmapPriority[];
  version?: string;
  assigned_to?: string;
  search?: string;
  validation_status?: ValidationStatus[];
  source?: RoadmapSource[];
}

export interface RoadmapStats {
  total: number;
  by_status: Record<RoadmapStatus, number>;
  by_category: Record<RoadmapCategory, number>;
  by_priority: Record<RoadmapPriority, number>;
  completion_rate: number;
  avg_completion_time: number;
}

// Tipos para arquivos JSON de controle
export interface RoadmapConfigFile {
  version: string;
  last_updated: string;
  templates: {
    default_categories: RoadmapCategory[];
    default_priorities: RoadmapPriority[];
    validation_rules: Record<string, any>;
  };
  ai_settings: {
    enabled: boolean;
    model: string;
    max_suggestions: number;
    confidence_threshold: number;
  };
  documentation_settings: {
    auto_generate: boolean;
    required_sections: string[];
    templates: Record<string, string>;
  };
}

export interface DevelopmentContext {
  project_name: string;
  version: string;
  architecture: {
    frontend: string[];
    backend: string[];
    database: string;
    deployment: string;
  };
  current_sprint: {
    name: string;
    start_date: string;
    end_date: string;
    goals: string[];
  };
  team: {
    developers: number;
    qa: number;
    designers: number;
  };
  tech_debt: {
    level: 'low' | 'medium' | 'high' | 'critical';
    priority_areas: string[];
  };
  recent_changes: {
    date: string;
    description: string;
    impact: string;
  }[];
}
