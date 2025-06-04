export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_insights: {
        Row: {
          company_id: string
          confidence_score: number | null
          content: string
          created_at: string
          id: string
          insight_type: string
          metadata: Json | null
          reviewed_at: string | null
          reviewed_by: string | null
          roadmap_item_id: string | null
          status: string | null
          title: string
        }
        Insert: {
          company_id: string
          confidence_score?: number | null
          content: string
          created_at?: string
          id?: string
          insight_type: string
          metadata?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          roadmap_item_id?: string | null
          status?: string | null
          title: string
        }
        Update: {
          company_id?: string
          confidence_score?: number | null
          content?: string
          created_at?: string
          id?: string
          insight_type?: string
          metadata?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          roadmap_item_id?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_roadmap_item_id_fkey"
            columns: ["roadmap_item_id"]
            isOneToOne: false
            referencedRelation: "roadmap_items"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          company_id: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          target_id: string | null
          target_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          company_id: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          company_id?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_invites: {
        Row: {
          accepted_at: string | null
          company_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          role_id: string
          status: Database["public"]["Enums"]["invite_status"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          company_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          role_id: string
          status?: Database["public"]["Enums"]["invite_status"]
          token: string
        }
        Update: {
          accepted_at?: string | null
          company_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role_id?: string
          status?: Database["public"]["Enums"]["invite_status"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_invites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_invites_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      department_members: {
        Row: {
          added_at: string
          added_by: string
          department_id: string
          id: string
          is_active: boolean
          user_id: string
        }
        Insert: {
          added_at?: string
          added_by: string
          department_id: string
          id?: string
          is_active?: boolean
          user_id: string
        }
        Update: {
          added_at?: string
          added_by?: string
          department_id?: string
          id?: string
          is_active?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_members_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_members_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          manager_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          company_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          invite_code: string
          invited_by: string
          status: string
          whatsapp_link: string | null
        }
        Insert: {
          accepted_at?: string | null
          company_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invite_code?: string
          invited_by: string
          status?: string
          whatsapp_link?: string | null
        }
        Update: {
          accepted_at?: string | null
          company_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invite_code?: string
          invited_by?: string
          status?: string
          whatsapp_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          experience: string | null
          full_name: string
          id: string
          languages: Json | null
          skills: Json | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string
          email: string
          experience?: string | null
          full_name: string
          id: string
          languages?: Json | null
          skills?: Json | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string
          email?: string
          experience?: string | null
          full_name?: string
          id?: string
          languages?: Json | null
          skills?: Json | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      roadmap_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          roadmap_item_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          roadmap_item_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          roadmap_item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_comments_roadmap_item_id_fkey"
            columns: ["roadmap_item_id"]
            isOneToOne: false
            referencedRelation: "roadmap_items"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_configs: {
        Row: {
          company_id: string
          config_key: string
          config_value: Json
          created_at: string
          created_by: string
          description: string | null
          id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          config_key: string
          config_value: Json
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          config_key?: string
          config_value?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      roadmap_documentation: {
        Row: {
          company_id: string
          content: string
          created_at: string
          created_by: string
          doc_type: string
          format: string
          id: string
          is_active: boolean | null
          roadmap_item_id: string | null
          tags: Json | null
          title: string
          updated_at: string
          version: number | null
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string
          created_by: string
          doc_type: string
          format?: string
          id?: string
          is_active?: boolean | null
          roadmap_item_id?: string | null
          tags?: Json | null
          title: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string
          created_by?: string
          doc_type?: string
          format?: string
          id?: string
          is_active?: boolean | null
          roadmap_item_id?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_documentation_roadmap_item_id_fkey"
            columns: ["roadmap_item_id"]
            isOneToOne: false
            referencedRelation: "roadmap_items"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_items: {
        Row: {
          actual_hours: number | null
          ai_suggestions: string | null
          assigned_to: string | null
          category: Database["public"]["Enums"]["roadmap_category"]
          company_id: string
          completed_date: string | null
          context_tags: Json | null
          created_at: string
          created_by: string
          dependencies: Json | null
          description: string | null
          documentation_url: string | null
          estimated_hours: number | null
          id: string
          priority: Database["public"]["Enums"]["roadmap_priority"]
          source: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["roadmap_status"]
          target_date: string | null
          technical_specs: string | null
          test_criteria: Json | null
          test_results: Json | null
          title: string
          updated_at: string
          validation_status: string | null
          version: string | null
        }
        Insert: {
          actual_hours?: number | null
          ai_suggestions?: string | null
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["roadmap_category"]
          company_id: string
          completed_date?: string | null
          context_tags?: Json | null
          created_at?: string
          created_by: string
          dependencies?: Json | null
          description?: string | null
          documentation_url?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: Database["public"]["Enums"]["roadmap_priority"]
          source?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["roadmap_status"]
          target_date?: string | null
          technical_specs?: string | null
          test_criteria?: Json | null
          test_results?: Json | null
          title: string
          updated_at?: string
          validation_status?: string | null
          version?: string | null
        }
        Update: {
          actual_hours?: number | null
          ai_suggestions?: string | null
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["roadmap_category"]
          company_id?: string
          completed_date?: string | null
          context_tags?: Json | null
          created_at?: string
          created_by?: string
          dependencies?: Json | null
          description?: string | null
          documentation_url?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: Database["public"]["Enums"]["roadmap_priority"]
          source?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["roadmap_status"]
          target_date?: string | null
          technical_specs?: string | null
          test_criteria?: Json | null
          test_results?: Json | null
          title?: string
          updated_at?: string
          validation_status?: string | null
          version?: string | null
        }
        Relationships: []
      }
      role_hierarchy: {
        Row: {
          child_role_id: string | null
          company_id: string
          created_at: string
          id: string
          parent_role_id: string | null
        }
        Insert: {
          child_role_id?: string | null
          company_id: string
          created_at?: string
          id?: string
          parent_role_id?: string | null
        }
        Update: {
          child_role_id?: string | null
          company_id?: string
          created_at?: string
          id?: string
          parent_role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_hierarchy_child_role_id_fkey"
            columns: ["child_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_hierarchy_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_hierarchy_parent_role_id_fkey"
            columns: ["parent_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: string
          permission: Database["public"]["Enums"]["permission"]
          role_id: string
        }
        Insert: {
          id?: string
          permission: Database["public"]["Enums"]["permission"]
          role_id: string
        }
        Update: {
          id?: string
          permission?: Database["public"]["Enums"]["permission"]
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_templates: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          permissions: Json
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          permissions?: Json
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          permissions?: Json
        }
        Relationships: []
      }
      roles: {
        Row: {
          color: string | null
          company_id: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_default: boolean
          is_system_role: boolean | null
          max_users: number | null
          name: string
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean
          is_system_role?: boolean | null
          max_users?: number | null
          name: string
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean
          is_system_role?: boolean | null
          max_users?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      task_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          task_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          task_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          task_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          task_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          task_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_history: {
        Row: {
          action: string
          changed_at: string
          changed_by: string
          field_changed: string | null
          id: string
          new_value: string | null
          old_value: string | null
          task_id: string
        }
        Insert: {
          action: string
          changed_at?: string
          changed_by: string
          field_changed?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          task_id: string
        }
        Update: {
          action?: string
          changed_at?: string
          changed_by?: string
          field_changed?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_history_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_time_logs: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          ended_at: string | null
          id: string
          started_at: string
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_time_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_transfers: {
        Row: {
          created_at: string
          from_user_id: string | null
          id: string
          reason: string | null
          requested_at: string
          requested_by: string
          responded_at: string | null
          response_reason: string | null
          status: string
          task_id: string
          to_user_id: string | null
          transfer_type: string
        }
        Insert: {
          created_at?: string
          from_user_id?: string | null
          id?: string
          reason?: string | null
          requested_at?: string
          requested_by: string
          responded_at?: string | null
          response_reason?: string | null
          status?: string
          task_id: string
          to_user_id?: string | null
          transfer_type: string
        }
        Update: {
          created_at?: string
          from_user_id?: string | null
          id?: string
          reason?: string | null
          requested_at?: string
          requested_by?: string
          responded_at?: string | null
          response_reason?: string | null
          status?: string
          task_id?: string
          to_user_id?: string | null
          transfer_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_transfers_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          actual_hours: number | null
          assignee_id: string | null
          company_id: string
          created_at: string
          created_by: string
          current_timer_start: string | null
          delegated_at: string | null
          delegated_by: string | null
          department_id: string | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          is_public: boolean | null
          is_timer_running: boolean | null
          previous_assignee_id: string | null
          priority: string
          status: string
          task_type: string
          title: string
          total_time_minutes: number | null
          transfer_reason: string | null
          transfer_requested_at: string | null
          transfer_requested_by: string | null
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          actual_hours?: number | null
          assignee_id?: string | null
          company_id: string
          created_at?: string
          created_by: string
          current_timer_start?: string | null
          delegated_at?: string | null
          delegated_by?: string | null
          department_id?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_public?: boolean | null
          is_timer_running?: boolean | null
          previous_assignee_id?: string | null
          priority?: string
          status?: string
          task_type?: string
          title: string
          total_time_minutes?: number | null
          transfer_reason?: string | null
          transfer_requested_at?: string | null
          transfer_requested_by?: string | null
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          actual_hours?: number | null
          assignee_id?: string | null
          company_id?: string
          created_at?: string
          created_by?: string
          current_timer_start?: string | null
          delegated_at?: string | null
          delegated_by?: string | null
          department_id?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_public?: boolean | null
          is_timer_running?: boolean | null
          previous_assignee_id?: string | null
          priority?: string
          status?: string
          task_type?: string
          title?: string
          total_time_minutes?: number | null
          transfer_reason?: string | null
          transfer_requested_at?: string | null
          transfer_requested_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_companies: {
        Row: {
          company_id: string
          id: string
          is_active: boolean
          joined_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          id?: string
          is_active?: boolean
          joined_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          id?: string
          is_active?: boolean
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_departments: {
        Row: {
          assigned_at: string
          company_id: string
          department_id: string
          id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          company_id: string
          department_id: string
          id?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          company_id?: string
          department_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_departments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_departments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          company_id: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          company_id: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          company_id?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation_by_code: {
        Args: { invite_code: string; user_email: string }
        Returns: Json
      }
      accept_public_task: {
        Args: { task_id_param: string }
        Returns: boolean
      }
      apply_role_template: {
        Args: { _role_id: string; _template_id: string }
        Returns: boolean
      }
      calculate_total_time: {
        Args: { task_id_param: string }
        Returns: number
      }
      create_default_roles: {
        Args: { _company_id: string }
        Returns: undefined
      }
      generate_whatsapp_link: {
        Args: { invite_code: string; company_name: string }
        Returns: string
      }
      get_invitation_by_code: {
        Args: { invite_code: string }
        Returns: Json
      }
      process_task_transfer: {
        Args: {
          transfer_id_param: string
          action_param: string
          response_reason_param?: string
        }
        Returns: boolean
      }
      user_has_permission: {
        Args: {
          _user_id: string
          _company_id: string
          _permission: Database["public"]["Enums"]["permission"]
        }
        Returns: boolean
      }
    }
    Enums: {
      invite_status: "pending" | "accepted" | "declined" | "expired"
      permission:
        | "manage_company"
        | "manage_users"
        | "manage_departments"
        | "manage_tasks"
        | "view_all_tasks"
        | "create_tasks"
        | "edit_tasks"
        | "delete_tasks"
        | "assign_tasks"
        | "view_reports"
        | "manage_permissions"
        | "view_audit_logs"
        | "invite_users"
        | "manage_user_roles"
        | "deactivate_users"
        | "view_user_activity"
        | "create_personal_tasks"
        | "create_department_tasks"
        | "create_company_tasks"
        | "accept_public_tasks"
        | "view_task_analytics"
        | "create_departments"
        | "manage_department_members"
        | "view_department_analytics"
      roadmap_category: "feature" | "improvement" | "bugfix" | "breaking_change"
      roadmap_priority: "critical" | "high" | "medium" | "low"
      roadmap_status:
        | "planned"
        | "in_progress"
        | "in_review"
        | "completed"
        | "cancelled"
        | "paused"
      user_type: "company_owner" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      invite_status: ["pending", "accepted", "declined", "expired"],
      permission: [
        "manage_company",
        "manage_users",
        "manage_departments",
        "manage_tasks",
        "view_all_tasks",
        "create_tasks",
        "edit_tasks",
        "delete_tasks",
        "assign_tasks",
        "view_reports",
        "manage_permissions",
        "view_audit_logs",
        "invite_users",
        "manage_user_roles",
        "deactivate_users",
        "view_user_activity",
        "create_personal_tasks",
        "create_department_tasks",
        "create_company_tasks",
        "accept_public_tasks",
        "view_task_analytics",
        "create_departments",
        "manage_department_members",
        "view_department_analytics",
      ],
      roadmap_category: ["feature", "improvement", "bugfix", "breaking_change"],
      roadmap_priority: ["critical", "high", "medium", "low"],
      roadmap_status: [
        "planned",
        "in_progress",
        "in_review",
        "completed",
        "cancelled",
        "paused",
      ],
      user_type: ["company_owner", "employee"],
    },
  },
} as const
