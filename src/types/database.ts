
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
  color?: string;
  icon?: string;
  is_system_role?: boolean;
  max_users?: number;
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
  'view_audit_logs' |
  'invite_users' |
  'manage_user_roles' |
  'deactivate_users' |
  'view_user_activity' |
  'create_personal_tasks' |
  'create_department_tasks' |
  'create_company_tasks' |
  'accept_public_tasks' |
  'view_task_analytics' |
  'create_departments' |
  'manage_department_members' |
  'view_department_analytics' |
  'delegate_tasks' |
  'transfer_tasks' |
  'accept_task_transfers';

export interface UserRole {
  id: string;
  user_id: string;
  company_id: string;
  role_id: string;
  assigned_by?: string;
  assigned_at: string;
}

export interface RoleHierarchy {
  id: string;
  parent_role_id?: string;
  child_role_id?: string;
  company_id: string;
  created_at: string;
}

export interface RoleTemplate {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  permissions: Permission[];
  is_active: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  target_type: string;
  target_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: any;
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
  delegated_by?: string;
  delegated_at?: string;
  transfer_requested_by?: string;
  transfer_requested_at?: string;
  transfer_reason?: string;
  previous_assignee_id?: string;
}

export interface TaskTransfer {
  id: string;
  task_id: string;
  from_user_id?: string;
  to_user_id?: string;
  transfer_type: 'delegation' | 'transfer';
  reason?: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_by: string;
  requested_at: string;
  responded_at?: string;
  response_reason?: string;
  created_at: string;
}
