
export type RoadmapCategory = 'feature' | 'improvement' | 'bugfix' | 'breaking_change';
export type RoadmapStatus = 'planned' | 'in_progress' | 'in_review' | 'completed' | 'cancelled' | 'paused';
export type RoadmapPriority = 'critical' | 'high' | 'medium' | 'low';

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
}

export interface RoadmapStats {
  total: number;
  by_status: Record<RoadmapStatus, number>;
  by_category: Record<RoadmapCategory, number>;
  by_priority: Record<RoadmapPriority, number>;
  completion_rate: number;
  avg_completion_time: number;
}
