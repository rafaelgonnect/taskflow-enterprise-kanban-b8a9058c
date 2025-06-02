
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type: 'company_owner' | 'employee';
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserCompany {
  id: string;
  user_id: string;
  company_id: string;
  is_active: boolean;
  joined_at: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  company_id: string;
  is_default: boolean;
  created_at: string;
}

export type Permission = 
  'manage_company' |
  'manage_users' | 
  'manage_departments' |
  'manage_tasks' |
  'view_all_tasks' |
  'create_tasks' |
  'edit_tasks' |
  'delete_tasks' |
  'assign_tasks' |
  'view_reports' |
  'manage_permissions' |
  'view_audit_logs';

export interface UserRole {
  id: string;
  user_id: string;
  company_id: string;
  role_id: string;
  assigned_by?: string;
  assigned_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  target_type: string;
  target_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  company_id: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'high' | 'medium' | 'low';
  company_id: string;
  department_id?: string;
  assignee_id?: string;
  created_by: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  estimated_hours?: number;
  actual_hours?: number;
}
