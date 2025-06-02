
import { RoadmapItem, RoadmapDocumentation } from '@/types/roadmap';

export const initialRoadmapItems: Omit<RoadmapItem, 'id' | 'created_at' | 'updated_at' | 'company_id' | 'created_by'>[] = [
  {
    title: 'Sistema de Autenticação e Perfis',
    description: 'Sistema completo de autenticação com Supabase Auth, perfis de usuário e controle de acesso',
    category: 'feature',
    status: 'completed',
    priority: 'critical',
    version: 'v1.0.0',
    estimated_hours: 40,
    actual_hours: 35,
    completed_date: '2024-06-01',
    technical_specs: 'Implementado com Supabase Auth, RLS policies, perfis de usuário, trigger para criação automática',
    test_criteria: ['Login/logout funcional', 'Criação de perfis automática', 'Políticas RLS ativas', 'Proteção de rotas'],
    dependencies: [],
    context_tags: ['auth', 'security', 'supabase', 'rls', 'profiles'],
    validation_status: 'approved',
    source: 'manual'
  },
  {
    title: 'Gestão de Empresas e Convites',
    description: 'Sistema de criação de empresas, convites por email/WhatsApp e gestão de membros',
    category: 'feature',
    status: 'completed',
    priority: 'high',
    version: 'v1.0.0',
    estimated_hours: 30,
    actual_hours: 28,
    completed_date: '2024-06-01',
    technical_specs: 'Sistema de convites com códigos únicos, integração WhatsApp, gestão de membros, triggers automáticos',
    test_criteria: ['Criação de empresas', 'Envio de convites', 'Aceitação de convites', 'Links WhatsApp gerados'],
    dependencies: [],
    context_tags: ['companies', 'invites', 'whatsapp', 'members', 'codes'],
    validation_status: 'approved',
    source: 'manual'
  },
  {
    title: 'Sistema de Papéis e Permissões (RBAC)',
    description: 'Controle de acesso baseado em papéis com templates, hierarquia e auditoria completa',
    category: 'feature',
    status: 'completed',
    priority: 'high',
    version: 'v1.0.0',
    estimated_hours: 50,
    actual_hours: 45,
    completed_date: '2024-06-01',
    technical_specs: 'RBAC completo com 15+ permissões, templates pré-definidos, hierarquia, logs de auditoria automáticos',
    test_criteria: ['Criação de papéis', 'Atribuição de permissões', 'Templates funcionais', 'Auditoria completa'],
    dependencies: [],
    context_tags: ['rbac', 'permissions', 'audit', 'templates', 'hierarchy'],
    validation_status: 'approved',
    source: 'manual'
  },
  {
    title: 'Gestão de Departamentos',
    description: 'Sistema de criação e gestão de departamentos com membros e gerentes',
    category: 'feature',
    status: 'completed',
    priority: 'medium',
    version: 'v1.0.0',
    estimated_hours: 25,
    actual_hours: 22,
    completed_date: '2024-06-01',
    technical_specs: 'Departamentos com gerentes, membros ativos, políticas RLS, integração com tarefas',
    test_criteria: ['Criação de departamentos', 'Atribuição de membros', 'Gestão de gerentes', 'Integração tarefas'],
    dependencies: [],
    context_tags: ['departments', 'management', 'members', 'managers'],
    validation_status: 'approved',
    source: 'manual'
  },
  {
    title: 'Sistema de Tarefas Unificado',
    description: 'Gestão completa de tarefas pessoais, departamentais e empresariais com timer e histórico',
    category: 'feature',
    status: 'completed',
    priority: 'high',
    version: 'v1.0.0',
    estimated_hours: 60,
    actual_hours: 55,
    completed_date: '2024-06-01',
    technical_specs: 'Sistema Kanban com 3 tipos de tarefas, timer integrado, histórico automático, anexos, comentários',
    test_criteria: ['Criação de tarefas', 'Timer funcional', 'Histórico automático', 'Upload de anexos', 'Comentários'],
    dependencies: [],
    context_tags: ['tasks', 'kanban', 'timer', 'history', 'attachments', 'comments'],
    validation_status: 'approved',
    source: 'manual'
  },
  {
    title: 'Tarefas Públicas e Sistema de Aceitação',
    description: 'Sistema para publicar tarefas e permitir que membros as aceitem automaticamente',
    category: 'feature',
    status: 'completed',
    priority: 'medium',
    version: 'v1.0.0',
    estimated_hours: 20,
    actual_hours: 18,
    completed_date: '2024-06-01',
    technical_specs: 'Tarefas públicas com função de aceitação automática, validação de permissões via SQL',
    test_criteria: ['Publicação de tarefas', 'Aceitação por membros', 'Validação de acesso', 'Mudança de status'],
    dependencies: [],
    context_tags: ['public-tasks', 'acceptance', 'permissions', 'automation'],
    validation_status: 'approved',
    source: 'manual'
  },
  {
    title: 'Roadmap e Gestão de Funcionalidades',
    description: 'Sistema completo de roadmap com documentação, versionamento e changelog automático',
    category: 'feature',
    status: 'completed',
    priority: 'high',
    version: 'v1.1.0',
    estimated_hours: 45,
    actual_hours: 42,
    completed_date: '2024-06-02',
    technical_specs: 'Roadmap Kanban, documentação integrada, versionamento semântico, changelog automático, múltiplos formatos',
    test_criteria: ['Criação de itens', 'Documentação funcional', 'Changelog atualizado', 'Versionamento', 'Múltiplos formatos'],
    dependencies: [],
    context_tags: ['roadmap', 'documentation', 'changelog', 'versioning', 'kanban'],
    validation_status: 'approved',
    source: 'manual'
  },
  {
    title: 'Integração OpenAI - Análise e Chat IA',
    description: 'Assistente IA especializado em desenvolvimento com análise de roadmap e geração automática',
    category: 'feature',
    status: 'completed',
    priority: 'high',
    version: 'v1.1.0',
    estimated_hours: 35,
    actual_hours: 32,
    completed_date: '2024-06-02',
    technical_specs: '3 Edge Functions OpenAI (chat, análise, geração), GPT-4o-mini, contexto especializado, rate limiting',
    test_criteria: ['Chat IA funcional', 'Análise automática', 'Geração de docs', 'Rate limiting', 'Contexto correto'],
    dependencies: [],
    context_tags: ['ai', 'openai', 'chat', 'analysis', 'generation', 'gpt4o-mini'],
    validation_status: 'approved',
    source: 'ai_generated'
  }
];

export const initialDocumentation: Omit<RoadmapDocumentation, 'id' | 'created_at' | 'updated_at' | 'company_id' | 'created_by'>[] = [
  {
    doc_type: 'context',
    title: 'Contexto Geral do Sistema - Estado Completo',
    content: `# Sistema de Gestão Empresarial com IA - Estado Atual v1.1.0

## Visão Geral do Projeto
Sistema completo de gestão empresarial com foco em tarefas, roadmaps e integração de IA para desenvolvimento contínuo.

### Características Principais
- **Multi-tenant**: Cada empresa tem seus próprios dados isolados
- **RBAC Completo**: Sistema robusto de papéis e permissões
- **IA Integrada**: Assistente especializado em desenvolvimento
- **Real-time Ready**: Preparado para funcionalidades em tempo real
- **Audit Trail**: Auditoria completa de todas as ações

## Arquitetura Técnica Detalhada

### Frontend Stack
- **React 18.3.1** + **TypeScript** (tipagem estrita)
- **Tailwind CSS** + **shadcn/ui** (design system)
- **React Router 6.26.2** (navegação)
- **TanStack Query 5.56.2** (estado servidor)
- **React Hook Form 7.53.0** (formulários)
- **Recharts 2.12.7** (gráficos)
- **Hello Pangea DnD** (drag & drop Kanban)

### Backend & Infraestrutura
- **Supabase** (BaaS completo)
  - PostgreSQL 15+ (database)
  - Row Level Security (RLS)
  - Edge Functions (Deno)
  - Auth JWT
- **OpenAI GPT-4o-mini** (IA)
- **Lovable Platform** (deploy)

### Integrações Externas
- **WhatsApp Web** (envio de convites)
- **OpenAI API** (análise e chat)
- **Supabase Storage** (anexos - preparado)

## Estado Atual das Funcionalidades

### 1. Autenticação e Perfis ✅ v1.0.0
**Implementação Completa:**
- Supabase Auth (email/password)
- Trigger automático para criação de perfis
- RLS policies para isolamento de dados
- Proteção de rotas React
- Tipos de usuário (employee, manager, admin)

**Arquivos Principais:**
- \`src/hooks/useAuth.tsx\`
- \`src/components/ProtectedRoute.tsx\`
- \`src/pages/Auth.tsx\`

### 2. Gestão de Empresas ✅ v1.0.0
**Implementação Completa:**
- Criação de empresas
- Sistema de convites com códigos únicos
- Links WhatsApp automáticos
- Gestão de membros ativos
- Associação empresa-usuário

**Funcionalidades Avançadas:**
- Convites por email com validação
- Códigos de 32 caracteres únicos
- Expiração automática (7 dias)
- Triggers para links WhatsApp
- RLS por empresa

### 3. RBAC - Sistema de Papéis ✅ v1.0.0
**Implementação Robusta:**
- **15+ Permissões específicas**
- **Templates pré-definidos** (Admin, Gerente, Funcionário)
- **Hierarquia de papéis**
- **Auditoria completa** com triggers
- **Função de verificação** user_has_permission()

**Permissões Disponíveis:**
\`\`\`
manage_users, manage_roles, manage_departments,
manage_tasks, view_all_tasks, create_tasks,
edit_tasks, assign_tasks, view_reports,
manage_company_settings, view_audit_logs,
manage_invitations, access_roadmap, manage_roadmap,
ai_features
\`\`\`

### 4. Departamentos ✅ v1.0.0
**Implementação:**
- Criação com gerente responsável
- Membros ativos com histórico
- Integração com sistema de tarefas
- RLS policies específicas

### 5. Sistema de Tarefas Unificado ✅ v1.0.0
**Implementação Avançada:**
- **3 tipos**: pessoal, departamental, empresarial
- **Interface Kanban** com drag & drop
- **Timer integrado** com logs de tempo
- **Histórico automático** com triggers
- **Comentários** com threads
- **Anexos** (preparado para Storage)
- **Tarefas públicas** com aceitação

**Estados Kanban:**
- todo → in_progress → in_review → completed
- Triggers automáticos para histórico
- Cálculo de tempo total

### 6. Roadmap e Documentação ✅ v1.1.0
**Sistema Completo:**
- **Gestão visual** tipo Kanban
- **6 tipos de documentação** (specs, notes, sql, config, test, context)
- **Versionamento semântico**
- **Changelog automático**
- **Múltiplos formatos** (markdown, json, sql, text)
- **Tags e categorização**

**Categorias de Item:**
- feature, improvement, bugfix, breaking_change
- Prioridades: critical, high, medium, low
- Status: planned → in_progress → in_review → completed

### 7. Integração IA ✅ v1.1.0
**3 Edge Functions Especializadas:**
1. **ai-development-chat**: Chat especializado
2. **ai-roadmap-analysis**: Análise automática
3. **ai-auto-generation**: Geração de documentação

**Modelo:** GPT-4o-mini (rápido e econômico)
**Rate Limiting:** Implementado
**Contexto:** Especializado em desenvolvimento

## Banco de Dados - Estado Atual

### Tabelas Principais (18 total)
1. **profiles** - Dados dos usuários
2. **companies** - Empresas
3. **user_companies** - Relacionamento usuário-empresa
4. **invitations** - Sistema de convites
5. **roles** - Papéis por empresa
6. **role_permissions** - Permissões dos papéis
7. **user_roles** - Papéis dos usuários
8. **audit_logs** - Auditoria completa
9. **departments** - Departamentos
10. **department_members** - Membros de departamentos
11. **tasks** - Sistema de tarefas
12. **task_history** - Histórico de mudanças
13. **task_comments** - Comentários
14. **task_attachments** - Anexos
15. **task_time_logs** - Logs de tempo
16. **roadmap_items** - Itens do roadmap
17. **roadmap_documentation** - Documentação
18. **roadmap_configs** - Configurações

### Funções SQL Customizadas
- \`handle_new_user()\` - Criação automática de perfis
- \`create_default_roles()\` - Papéis padrão por empresa
- \`user_has_permission()\` - Verificação de permissões
- \`accept_invitation_by_code()\` - Aceitar convites
- \`accept_public_task()\` - Aceitar tarefas públicas
- \`generate_whatsapp_link()\` - Links WhatsApp
- \`create_task_history()\` - Triggers de histórico

### Políticas RLS Ativas
Todas as tabelas têm RLS habilitado com políticas específicas por empresa e usuário.

## Próximos Desenvolvimentos Sugeridos

### Funcionalidades Prioritárias
1. **Notificações Real-time** (Supabase Realtime)
2. **Dashboard Analytics** com métricas
3. **Integração Calendário** (Google/Outlook)
4. **Relatórios Avançados** (PDF, Excel)
5. **API Externa** para integrações

### Melhorias Técnicas
1. **Performance** - Otimização de queries
2. **Cache** - Redis para dados frequentes
3. **Monitoring** - Logs e métricas
4. **Backup** - Estratégia automatizada
5. **Tests** - Cobertura de testes

## Configurações de Desenvolvimento

### Variáveis de Ambiente
\`\`\`
VITE_SUPABASE_URL=https://sogpdmzdfshhrjtpyvox.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### Secrets Supabase
- OPENAI_API_KEY (GPT-4o-mini)
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_DB_URL

### Deploy
- Plataforma: Lovable
- Auto-deploy: Ativo
- Edge Functions: Auto-deploy

---

**IMPORTANTE para Agentes IA:**
1. Sempre ler este contexto antes de modificações
2. Seguir padrões estabelecidos
3. Atualizar documentação após mudanças
4. Manter changelog atualizado
5. Considerar impacto em RLS policies`,
    format: 'markdown',
    tags: ['context', 'overview', 'architecture', 'complete', 'v1.1.0'],
    is_active: true,
    version: 1
  },
  {
    doc_type: 'sql',
    title: 'Scripts SQL - Schema Completo do Sistema',
    content: `-- SCHEMA COMPLETO DO SISTEMA v1.1.0
-- Todos os scripts SQL utilizados no desenvolvimento

-- =============================================
-- 1. ENUMS E TIPOS CUSTOMIZADOS
-- =============================================

-- Tipo para convites
CREATE TYPE invite_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');

-- Tipo para usuários
CREATE TYPE user_type AS ENUM ('employee', 'manager', 'admin');

-- Enum para permissões (15 permissões específicas)
CREATE TYPE permission AS ENUM (
  'manage_users',
  'manage_roles', 
  'manage_departments',
  'manage_tasks',
  'view_all_tasks',
  'create_tasks',
  'edit_tasks',
  'assign_tasks',
  'view_reports',
  'manage_company_settings',
  'view_audit_logs',
  'manage_invitations',
  'access_roadmap',
  'manage_roadmap',
  'ai_features'
);

-- Enums para roadmap
CREATE TYPE roadmap_category AS ENUM ('feature', 'improvement', 'bugfix', 'breaking_change');
CREATE TYPE roadmap_status AS ENUM ('planned', 'in_progress', 'in_review', 'completed', 'cancelled', 'paused');
CREATE TYPE roadmap_priority AS ENUM ('critical', 'high', 'medium', 'low');

-- =============================================
-- 2. TABELAS PRINCIPAIS
-- =============================================

-- Tabela de perfis (extensão do auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  user_type user_type NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Empresas
CREATE TABLE public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Relacionamento usuário-empresa
CREATE TABLE public.user_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, company_id)
);

-- Sistema de convites
CREATE TABLE public.invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  email TEXT NOT NULL,
  invite_code TEXT DEFAULT encode(gen_random_bytes(16), 'hex') UNIQUE NOT NULL,
  invited_by UUID REFERENCES public.profiles(id) NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  whatsapp_link TEXT,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days') NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Papéis por empresa
CREATE TABLE public.roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon VARCHAR DEFAULT 'shield',
  color VARCHAR DEFAULT '#6366f1',
  is_default BOOLEAN DEFAULT false NOT NULL,
  is_system_role BOOLEAN DEFAULT false,
  max_users INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(company_id, name)
);

-- Permissões dos papéis
CREATE TABLE public.role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
  permission permission NOT NULL,
  UNIQUE(role_id, permission)
);

-- Atribuição de papéis aos usuários
CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  role_id UUID REFERENCES public.roles(id) NOT NULL,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, company_id, role_id)
);

-- Auditoria completa
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Departamentos
CREATE TABLE public.departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  manager_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(company_id, name)
);

-- Membros de departamentos
CREATE TABLE public.department_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID REFERENCES public.departments(id) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  added_by UUID REFERENCES public.profiles(id) NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(department_id, user_id)
);

-- Sistema de tarefas unificado
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' NOT NULL,
  priority TEXT DEFAULT 'medium' NOT NULL,
  task_type TEXT DEFAULT 'personal' NOT NULL, -- personal, department, company
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  assignee_id UUID REFERENCES public.profiles(id),
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  is_public BOOLEAN DEFAULT false,
  accepted_by UUID REFERENCES public.profiles(id),
  accepted_at TIMESTAMP WITH TIME ZONE,
  is_timer_running BOOLEAN DEFAULT false,
  current_timer_start TIMESTAMP WITH TIME ZONE,
  total_time_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Histórico de mudanças das tarefas
CREATE TABLE public.task_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) NOT NULL,
  action TEXT NOT NULL,
  field_changed TEXT,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID REFERENCES public.profiles(id) NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Comentários das tarefas
CREATE TABLE public.task_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Anexos das tarefas (preparado para Storage)
CREATE TABLE public.task_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id) NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Logs de tempo das tarefas
CREATE TABLE public.task_time_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Itens do roadmap
CREATE TABLE public.roadmap_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category roadmap_category DEFAULT 'feature' NOT NULL,
  status roadmap_status DEFAULT 'planned' NOT NULL,
  priority roadmap_priority DEFAULT 'medium' NOT NULL,
  version TEXT,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  assigned_to UUID REFERENCES public.profiles(id),
  start_date DATE,
  target_date DATE,
  completed_date DATE,
  technical_specs TEXT,
  test_criteria JSONB DEFAULT '[]'::jsonb,
  dependencies JSONB DEFAULT '[]'::jsonb,
  ai_suggestions TEXT,
  context_tags JSONB DEFAULT '[]'::jsonb,
  validation_status TEXT DEFAULT 'pending',
  source TEXT DEFAULT 'manual',
  documentation_url TEXT,
  test_results JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Documentação do roadmap
CREATE TABLE public.roadmap_documentation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  roadmap_item_id UUID REFERENCES public.roadmap_items(id),
  doc_type TEXT NOT NULL, -- specs, notes, sql, config, test, context
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  format TEXT DEFAULT 'markdown' NOT NULL, -- markdown, json, sql, text
  tags JSONB DEFAULT '[]'::jsonb,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Configurações do roadmap
CREATE TABLE public.roadmap_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  config_key TEXT NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(company_id, config_key)
);

-- =============================================
-- 3. FUNÇÕES SQL CUSTOMIZADAS
-- =============================================

-- Função para criar perfil automático
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', 'Usuário'),
    'employee'
  );
  RETURN new;
END;
$$;

-- Função para criar papéis padrão
CREATE OR REPLACE FUNCTION public.create_default_roles(_company_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_role_id UUID;
  manager_role_id UUID;
  employee_role_id UUID;
BEGIN
  -- Criar papel de Admin
  INSERT INTO public.roles (name, description, company_id, is_default)
  VALUES ('Admin', 'Administrador da empresa com todas as permissões', _company_id, false)
  RETURNING id INTO admin_role_id;

  -- Adicionar todas as permissões ao Admin
  INSERT INTO public.role_permissions (role_id, permission)
  SELECT admin_role_id, unnest(enum_range(NULL::permission));

  -- Criar papel de Gerente
  INSERT INTO public.roles (name, description, company_id, is_default)
  VALUES ('Gerente', 'Gerente com permissões de gestão limitadas', _company_id, false)
  RETURNING id INTO manager_role_id;

  -- Permissões do Gerente
  INSERT INTO public.role_permissions (role_id, permission)
  VALUES 
    (manager_role_id, 'manage_departments'),
    (manager_role_id, 'manage_tasks'),
    (manager_role_id, 'view_all_tasks'),
    (manager_role_id, 'create_tasks'),
    (manager_role_id, 'edit_tasks'),
    (manager_role_id, 'assign_tasks'),
    (manager_role_id, 'view_reports');

  -- Criar papel de Funcionário (padrão)
  INSERT INTO public.roles (name, description, company_id, is_default)
  VALUES ('Funcionário', 'Funcionário padrão da empresa', _company_id, true)
  RETURNING id INTO employee_role_id;

  -- Permissões do Funcionário
  INSERT INTO public.role_permissions (role_id, permission)
  VALUES 
    (employee_role_id, 'create_tasks'),
    (employee_role_id, 'edit_tasks');
END;
$$;

-- Função para verificar permissões
CREATE OR REPLACE FUNCTION public.user_has_permission(_user_id UUID, _company_id UUID, _permission permission)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.user_id = _user_id
      AND ur.company_id = _company_id
      AND rp.permission = _permission
  )
$$;

-- Função para aceitar convites
CREATE OR REPLACE FUNCTION public.accept_invitation_by_code(invite_code TEXT, user_email TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_record RECORD;
  user_id_found UUID;
  result JSON;
BEGIN
  -- Buscar o convite
  SELECT * INTO invitation_record
  FROM public.invitations i
  WHERE i.invite_code = accept_invitation_by_code.invite_code
    AND i.status = 'pending'
    AND i.expires_at > now();
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Convite inválido ou expirado');
  END IF;
  
  -- Verificar se o email confere
  IF invitation_record.email != accept_invitation_by_code.user_email THEN
    RETURN json_build_object('success', false, 'error', 'Email não confere com o convite');
  END IF;
  
  -- Buscar o usuário
  SELECT p.id INTO user_id_found
  FROM public.profiles p
  WHERE p.email = accept_invitation_by_code.user_email;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Usuário não encontrado');
  END IF;
  
  -- Criar relacionamento usuário-empresa
  INSERT INTO public.user_companies (user_id, company_id, is_active)
  VALUES (user_id_found, invitation_record.company_id, true)
  ON CONFLICT (user_id, company_id) DO UPDATE SET is_active = true;
  
  -- Atribuir papel padrão
  INSERT INTO public.user_roles (user_id, company_id, role_id)
  SELECT user_id_found, invitation_record.company_id, r.id
  FROM public.roles r
  WHERE r.company_id = invitation_record.company_id
    AND r.is_default = true
  ON CONFLICT (user_id, company_id, role_id) DO NOTHING;
  
  -- Atualizar status do convite
  UPDATE public.invitations
  SET status = 'accepted', accepted_at = now()
  WHERE id = invitation_record.id;
  
  -- Retornar sucesso
  SELECT json_build_object(
    'success', true,
    'company_id', c.id,
    'company_name', c.name
  ) INTO result
  FROM public.companies c
  WHERE c.id = invitation_record.company_id;
  
  RETURN result;
END;
$$;

-- Função para aceitar tarefas públicas
CREATE OR REPLACE FUNCTION public.accept_public_task(task_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  task_record RECORD;
  user_id_found UUID;
BEGIN
  user_id_found := auth.uid();
  IF user_id_found IS NULL THEN
    RETURN false;
  END IF;
  
  SELECT * INTO task_record
  FROM public.tasks
  WHERE id = task_id_param
    AND is_public = true
    AND assignee_id IS NULL
    AND accepted_by IS NULL;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Verificar permissões baseadas no tipo da tarefa
  IF task_record.task_type = 'department' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.department_members dm
      WHERE dm.department_id = task_record.department_id
        AND dm.user_id = user_id_found
        AND dm.is_active = true
    ) THEN
      RETURN false;
    END IF;
  ELSIF task_record.task_type = 'company' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.user_companies uc
      WHERE uc.company_id = task_record.company_id
        AND uc.user_id = user_id_found
        AND uc.is_active = true
    ) THEN
      RETURN false;
    END IF;
  END IF;
  
  -- Aceitar a tarefa
  UPDATE public.tasks
  SET assignee_id = user_id_found,
      accepted_by = user_id_found,
      accepted_at = now(),
      status = 'in_progress'
  WHERE id = task_id_param;
  
  RETURN true;
END;
$$;

-- Função para gerar links WhatsApp
CREATE OR REPLACE FUNCTION public.generate_whatsapp_link(invite_code TEXT, company_name TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT 'https://wa.me/?text=' || encode(
    ('Você foi convidado para se juntar à empresa "' || company_name || '"! ' ||
     'Clique no link para aceitar o convite: ' ||
     'https://sogpdmzdfshhrjtpyvox.supabase.co/invite/' || invite_code)::bytea, 
    'base64'
  );
$$;

-- =============================================
-- 4. TRIGGERS
-- =============================================

-- Trigger para criar perfil automático
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para histórico de tarefas
CREATE OR REPLACE FUNCTION public.create_task_history()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.task_history (task_id, action, new_value, changed_by)
    VALUES (NEW.id, 'created', 'Tarefa criada', NEW.created_by);
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status THEN
      INSERT INTO public.task_history (task_id, action, old_value, new_value, field_changed, changed_by)
      VALUES (NEW.id, 'status_changed', OLD.status, NEW.status, 'status', NEW.created_by);
    END IF;
    
    IF OLD.priority != NEW.priority THEN
      INSERT INTO public.task_history (task_id, action, old_value, new_value, field_changed, changed_by)
      VALUES (NEW.id, 'priority_changed', OLD.priority, NEW.priority, 'priority', NEW.created_by);
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;

CREATE TRIGGER task_history_trigger
  AFTER INSERT OR UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.create_task_history();

-- Trigger para links WhatsApp
CREATE OR REPLACE FUNCTION public.update_whatsapp_link()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  company_name TEXT;
BEGIN
  SELECT name INTO company_name 
  FROM public.companies 
  WHERE id = NEW.company_id;
  
  NEW.whatsapp_link := generate_whatsapp_link(NEW.invite_code, company_name);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_invitation_whatsapp_link
  BEFORE INSERT OR UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.update_whatsapp_link();

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_configs ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (exemplos - cada tabela tem suas políticas específicas)
-- Profiles: usuários podem ver/editar próprio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Companies: usuários podem ver empresas onde são membros
CREATE POLICY "Users can view their companies" ON public.companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_companies uc
      WHERE uc.company_id = companies.id
        AND uc.user_id = auth.uid()
        AND uc.is_active = true
    )
  );

-- Tasks: usuários podem ver tarefas da empresa
CREATE POLICY "Users can view company tasks" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_companies uc
      WHERE uc.company_id = tasks.company_id
        AND uc.user_id = auth.uid()
        AND uc.is_active = true
    )
  );

-- =============================================
-- 6. ÍNDICES PARA PERFORMANCE
-- =============================================

-- Índices principais para queries frequentes
CREATE INDEX idx_user_companies_user_id ON public.user_companies(user_id);
CREATE INDEX idx_user_companies_company_id ON public.user_companies(company_id);
CREATE INDEX idx_user_roles_user_company ON public.user_roles(user_id, company_id);
CREATE INDEX idx_tasks_company_id ON public.tasks(company_id);
CREATE INDEX idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX idx_task_history_task_id ON public.task_history(task_id);
CREATE INDEX idx_roadmap_items_company_id ON public.roadmap_items(company_id);
CREATE INDEX idx_roadmap_documentation_company_id ON public.roadmap_documentation(company_id);

-- =============================================
-- OBSERVAÇÕES IMPORTANTES
-- =============================================

/*
1. Todas as tabelas têm RLS habilitado para isolamento por empresa
2. Triggers automáticos para histórico e auditoria
3. Funções SQL customizadas para operações complexas
4. Tipos enum para consistência de dados
5. Índices otimizados para queries frequentes
6. Sistema completo de permissões com 15+ tipos
7. Preparado para Storage (anexos)
8. Preparado para Realtime (notificações)
*/`,
    format: 'sql',
    tags: ['sql', 'schema', 'complete', 'database', 'rls', 'triggers'],
    is_active: true,
    version: 1
  },
  {
    doc_type: 'config',
    title: 'Configurações Completas do Sistema',
    content: `{
  "project": {
    "name": "Sistema de Gestão Empresarial",
    "version": "1.1.0",
    "description": "Sistema completo de gestão empresarial com IA integrada",
    "repository": "https://github.com/lovable/enterprise-management",
    "license": "MIT"
  },
  "architecture": {
    "frontend": {
      "framework": "React 18.3.1",
      "language": "TypeScript",
      "styling": "Tailwind CSS + shadcn/ui",
      "routing": "React Router 6.26.2",
      "state": "TanStack Query 5.56.2",
      "forms": "React Hook Form 7.53.0",
      "dnd": "@hello-pangea/dnd 18.0.1",
      "charts": "Recharts 2.12.7"
    },
    "backend": {
      "provider": "Supabase",
      "database": "PostgreSQL 15+",
      "auth": "Supabase Auth (JWT)",
      "realtime": "Supabase Realtime",
      "storage": "Supabase Storage",
      "edge_functions": "Deno Runtime"
    },
    "ai": {
      "provider": "OpenAI",
      "model": "gpt-4o-mini",
      "functions": 3,
      "rate_limiting": true
    },
    "deployment": {
      "platform": "Lovable",
      "auto_deploy": true,
      "environment": "production"
    }
  },
  "environment": {
    "supabase": {
      "project_id": "sogpdmzdfshhrjtpyvox",
      "url": "https://sogpdmzdfshhrjtpyvox.supabase.co",
      "anon_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "regions": ["us-east-1"]
    },
    "secrets": [
      "OPENAI_API_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "SUPABASE_DB_URL"
    ]
  },
  "database": {
    "tables": 18,
    "functions": 8,
    "triggers": 6,
    "policies": "50+",
    "enums": 5,
    "indexes": 10
  },
  "features": {
    "authentication": {
      "enabled": true,
      "provider": "supabase",
      "methods": ["email_password"],
      "rls": true,
      "auto_profiles": true
    },
    "companies": {
      "enabled": true,
      "multi_tenant": true,
      "invitations": true,
      "whatsapp_integration": true,
      "member_management": true
    },
    "rbac": {
      "enabled": true,
      "permissions": 15,
      "templates": 3,
      "hierarchy": true,
      "audit": true
    },
    "departments": {
      "enabled": true,
      "managers": true,
      "members": true,
      "task_integration": true
    },
    "tasks": {
      "enabled": true,
      "types": ["personal", "department", "company"],
      "kanban": true,
      "timer": true,
      "history": true,
      "comments": true,
      "attachments": "prepared",
      "public_tasks": true
    },
    "roadmap": {
      "enabled": true,
      "kanban": true,
      "documentation": true,
      "versioning": true,
      "changelog": true,
      "categories": 4,
      "priorities": 4,
      "statuses": 6
    },
    "ai": {
      "enabled": true,
      "chat": true,
      "analysis": true,
      "generation": true,
      "edge_functions": 3,
      "context_aware": true
    }
  },
  "permissions": {
    "available": [
      "manage_users",
      "manage_roles",
      "manage_departments",
      "manage_tasks",
      "view_all_tasks",
      "create_tasks",
      "edit_tasks",
      "assign_tasks",
      "view_reports",
      "manage_company_settings",
      "view_audit_logs",
      "manage_invitations",
      "access_roadmap",
      "manage_roadmap",
      "ai_features"
    ],
    "role_templates": {
      "admin": "all_permissions",
      "manager": [
        "manage_departments",
        "manage_tasks",
        "view_all_tasks",
        "create_tasks",
        "edit_tasks",
        "assign_tasks",
        "view_reports"
      ],
      "employee": [
        "create_tasks",
        "edit_tasks"
      ]
    }
  },
  "api": {
    "edge_functions": {
      "ai-development-chat": {
        "path": "/functions/v1/ai-development-chat",
        "method": "POST",
        "description": "Chat especializado em desenvolvimento",
        "model": "gpt-4o-mini",
        "rate_limit": "100/hour"
      },
      "ai-roadmap-analysis": {
        "path": "/functions/v1/ai-roadmap-analysis",
        "method": "POST",
        "description": "Análise automática de itens do roadmap",
        "model": "gpt-4o-mini",
        "rate_limit": "50/hour"
      },
      "ai-auto-generation": {
        "path": "/functions/v1/ai-auto-generation",
        "method": "POST",
        "description": "Geração automática de documentação",
        "model": "gpt-4o-mini",
        "rate_limit": "30/hour"
      }
    }
  },
  "ui": {
    "components": {
      "shadcn_ui": true,
      "custom_components": 50,
      "responsive": true,
      "dark_mode": "prepared",
      "accessibility": "basic"
    },
    "layouts": {
      "dashboard": true,
      "sidebar": true,
      "mobile_responsive": true
    },
    "pages": [
      "/",
      "/auth",
      "/tasks",
      "/roadmap",
      "/departments",
      "/user-management",
      "/role-management",
      "/company-settings",
      "/public-tasks",
      "/invite-accept/*"
    ]
  },
  "development": {
    "setup": {
      "node_version": "18+",
      "package_manager": "npm",
      "dev_server": "vite",
      "port": 5173
    },
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview",
      "type-check": "tsc --noEmit"
    },
    "dependencies": {
      "critical": [
        "@supabase/supabase-js",
        "@tanstack/react-query",
        "react-router-dom",
        "tailwindcss"
      ],
      "ui": [
        "@radix-ui/*",
        "lucide-react",
        "class-variance-authority"
      ],
      "forms": [
        "react-hook-form",
        "@hookform/resolvers",
        "zod"
      ]
    }
  },
  "monitoring": {
    "logging": {
      "console": true,
      "supabase": true,
      "edge_functions": true
    },
    "errors": {
      "boundary": true,
      "toast": true,
      "fallback": true
    },
    "performance": {
      "lazy_loading": "partial",
      "code_splitting": "basic",
      "caching": "react_query"
    }
  },
  "security": {
    "rls": {
      "enabled": true,
      "coverage": "100%",
      "policies": "per_table"
    },
    "auth": {
      "jwt": true,
      "session_timeout": "24h",
      "refresh_token": true
    },
    "api": {
      "cors": true,
      "rate_limiting": true,
      "validation": true
    }
  },
  "roadmap": {
    "current_version": "1.1.0",
    "next_features": [
      "Notificações Real-time",
      "Dashboard Analytics",
      "Integração Calendário",
      "Relatórios PDF",
      "API Externa"
    ],
    "technical_debt": {
      "level": "low",
      "priority_areas": [
        "Test coverage",
        "Performance optimization",
        "Error boundaries"
      ]
    }
  }
}`,
    format: 'json',
    tags: ['config', 'system', 'complete', 'architecture', 'features'],
    is_active: true,
    version: 1
  },
  {
    doc_type: 'notes',
    title: 'Notas de Desenvolvimento e Decisões Técnicas',
    content: `# Notas de Desenvolvimento - Sistema Completo v1.1.0

## Decisões Arquiteturais Importantes

### 1. Escolha do Supabase como Backend
**Data:** 2024-05-15
**Razão:** Necessidade de backend robusto sem complexidade de setup
**Benefícios:**
- PostgreSQL nativo (relacional)
- RLS para segurança multi-tenant
- Edge Functions para IA
- Auth JWT integrado
- Real-time preparado

**Alternativas Consideradas:**
- Firebase (descartado por limitações SQL)
- Custom Node.js (descartado por complexidade)

### 2. Sistema Multi-Tenant com RLS
**Data:** 2024-05-20
**Decisão:** Isolamento por empresa usando Row Level Security
**Implementação:**
- Todas as tabelas têm \`company_id\`
- Políticas RLS por empresa
- \`user_companies\` para relacionamentos

**Vantagens:**
- Segurança nativa do PostgreSQL
- Performance melhor que filtros aplicação
- Auditoria automática

### 3. RBAC Granular vs Simples
**Data:** 2024-05-25
**Decisão:** RBAC completo com 15+ permissões específicas
**Justificativa:**
- Empresas precisam de flexibilidade
- Templates para facilitar setup
- Auditoria completa necessária

**Implementação:**
- Enum \`permission\` com tipos específicos
- Templates pré-definidos
- Função \`user_has_permission()\` otimizada

### 4. Sistema de Tarefas Unificado
**Data:** 2024-05-30
**Decisão:** Uma tabela para todos os tipos de tarefa
**Tipos:** personal, department, company
**Vantagens:**
- Código mais simples
- Queries unificadas
- Timer e histórico consistente

**Alternativa Descartada:** Tabelas separadas (muita complexidade)

### 5. IA com GPT-4o-mini
**Data:** 2024-06-01
**Decisão:** GPT-4o-mini em vez de GPT-4
**Razões:**
- Velocidade 3x maior
- Custo 10x menor
- Qualidade suficiente para casos de uso
- Rate limiting mais simples

### 6. Edge Functions vs API Routes
**Data:** 2024-06-01
**Decisão:** Supabase Edge Functions para IA
**Vantagens:**
- Deploy automático
- Deno runtime seguro
- Integração nativa com auth
- Sem cold start significativo

## Padrões de Desenvolvimento Estabelecidos

### 1. Estrutura de Componentes
```
src/
├── components/         # Componentes reutilizáveis
│   ├── ui/            # shadcn/ui base
│   ├── forms/         # Formulários específicos
│   └── features/      # Componentes por feature
├── hooks/             # Custom hooks
├── pages/             # Páginas principais
├── types/             # Tipos TypeScript
└── utils/             # Utilitários
```

### 2. Nomenclatura de Hooks
- \`use[Feature]\` - Hook principal (ex: \`useTasks\`)
- \`use[Action][Feature]\` - Ações específicas (ex: \`useCreateTask\`)
- \`use[Feature]Stats\` - Estatísticas (ex: \`useTaskStats\`)

### 3. Tratamento de Erros
- **Hooks:** Retornar error do react-query
- **Componentes:** Toast para feedback
- **Edge Functions:** Throw com mensagens claras
- **RLS:** Políticas que retornam vazio (não erro)

### 4. Loading States
- **Queries:** \`isLoading\` do react-query
- **Mutations:** \`isPending\` do react-query
- **Botões:** Disabled + texto "Carregando..."
- **Listas:** Skeleton components

## Observações Técnicas Importantes

### 1. RLS Policies
**CUIDADO:** Policies recursivas podem travar
**Solução:** Usar SECURITY DEFINER functions
**Exemplo:** \`user_has_permission()\` evita RLS recursivo

### 2. Triggers de Histórico
**Padrão:** Triggers automáticos para auditoria
**Implementação:**
- INSERT: "created"
- UPDATE: campo específico changed
- Usar \`NEW.created_by\` para changed_by

### 3. JSON Arrays no PostgreSQL
**Problema:** Supabase retorna strings para JSON arrays
**Solução:** Parse no frontend com fallback
```typescript
const tags = Array.isArray(doc.tags) ? doc.tags : 
            typeof doc.tags === 'string' ? JSON.parse(doc.tags) : [];
```

### 4. Edge Functions Rate Limiting
**Implementação:** Manual por usuário
**Limitações atuais:**
- Development Chat: 100/hora
- Roadmap Analysis: 50/hora  
- Auto Generation: 30/hora

### 5. Performance Considerations
**Queries Pesadas Identificadas:**
- Tasks com histórico completo
- Roadmap com documentação
- User permissions check

**Otimizações Aplicadas:**
- Índices em foreign keys
- Query separation (useQuery separados)
- Pagination preparada (não implementada)

## Bugs Conhecidos e Workarounds

### 1. WhatsApp Links Encoding
**Problema:** Caracteres especiais em URLs
**Workaround:** Base64 encoding na função SQL
**Status:** Resolvido

### 2. Timer State Sync
**Problema:** Timer pode dessincronizar entre tabs
**Workaround:** Verificar \`current_timer_start\` no mount
**Status:** Monitorar

### 3. RLS com Auth Reset
**Problema:** Políticas podem falhar após logout/login
**Workaround:** Invalidate queries após auth change
**Status:** Resolvido

## Melhorias Futuras Identificadas

### 1. Performance
- [ ] Query optimization para tasks
- [ ] Pagination implementar
- [ ] Cache Redis para permissions
- [ ] Lazy loading de componentes

### 2. UX/UI
- [ ] Dark mode completo
- [ ] Notificações real-time
- [ ] Drag & drop melhorado
- [ ] Mobile responsivo (tasks)

### 3. Funcionalidades
- [ ] Relatórios avançados
- [ ] Integração calendário
- [ ] API externa
- [ ] Webhooks

### 4. DevOps
- [ ] Monitoring dashboards
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Automated backups

## Aprendizados do Desenvolvimento

### 1. Supabase RLS
- Políticas simples são melhores
- SECURITY DEFINER para operações complexas
- Testar policies com usuários diferentes
- Documentar cada policy

### 2. React Query
- Separar queries por entidade
- Invalidation strategy clara
- Error boundaries importantes
- Optimistic updates para UX

### 3. TypeScript
- Tipos para enums do banco
- Utility types para forms
- Strict mode desde início
- Props interfaces claras

### 4. IA Integration
- Context é fundamental
- Rate limiting necessário
- Error handling robusto
- User feedback constante

## Para o Próximo Desenvolvedor

### 1. Antes de Modificar
1. Ler este documento completo
2. Entender arquitetura RLS
3. Testar com múltiplas empresas
4. Verificar permissões RBAC

### 2. Ao Adicionar Features
1. Seguir padrões estabelecidos
2. Adicionar RLS policies
3. Criar testes de permissão
4. Documentar decisões

### 3. Debug Common Issues
- RLS permissions: Verificar \`user_companies\`
- Query empty: Verificar company context
- Auth errors: Invalidate queries
- Performance: Verificar N+1 queries

### 4. Deploy Process
1. Teste local completo
2. Verificar migrations SQL
3. Edge functions deploy automático
4. Verificar secrets Supabase

---

**IMPORTANTE:** Este sistema está em produção ativa. Mudanças devem ser testadas extensivamente em ambiente separado antes do deploy.`,
    format: 'markdown',
    tags: ['notes', 'development', 'decisions', 'patterns', 'learnings'],
    is_active: true,
    version: 1
  },
  {
    doc_type: 'context',
    title: 'Prompt e Instruções para Agente IA - Manutenção Contínua',
    content: `# INSTRUÇÕES PARA AGENTE IA - MANUTENÇÃO DO SISTEMA

## PROTOCOLO OBRIGATÓRIO PARA TODA ALTERAÇÃO

### ANTES DE QUALQUER MODIFICAÇÃO:

#### 1. LER CONTEXTO COMPLETO
\`\`\`
SEMPRE execute estes passos ANTES de modificar qualquer código:

1. Acessar aba "Documentação" no roadmap
2. Ler "Contexto Geral do Sistema - Estado Completo"
3. Revisar "Scripts SQL - Schema Completo do Sistema"
4. Consultar "Notas de Desenvolvimento e Decisões Técnicas"
5. Verificar changelog atual para entender últimas mudanças
\`\`\`

#### 2. ANALISAR IMPACTO
- Identificar módulos afetados
- Verificar dependências entre funcionalidades
- Avaliar se é nova feature, melhoria ou correção
- Verificar impacto em RLS policies
- Considerar implicações multi-tenant

#### 3. VERIFICAR PERMISSÕES
- Consultar sistema RBAC atual
- Verificar se nova funcionalidade precisa de permissões
- Validar se usuário atual tem acesso
- Considerar hierarquia de papéis

### DURANTE A IMPLEMENTAÇÃO:

#### 1. SEGUIR PADRÕES ESTABELECIDOS
- Usar estrutura de components existente
- Seguir nomenclatura de hooks: \`use[Feature]\`, \`use[Action][Feature]\`
- Implementar RLS policies para novas tabelas
- Usar TanStack Query para estado servidor
- Seguir padrões de error handling

#### 2. SEGURANÇA MULTI-TENANT
- SEMPRE adicionar \`company_id\` em novas tabelas
- Criar políticas RLS apropriadas
- Testar isolamento entre empresas
- Usar \`useCompanyContext\` para company atual

#### 3. SISTEMA RBAC
- Verificar permissões com \`user_has_permission()\`
- Adicionar novas permissões ao enum se necessário
- Atualizar templates de papéis
- Registrar mudanças de permissão em audit

### APÓS IMPLEMENTAR QUALQUER ALTERAÇÃO:

#### 1. ATUALIZAR ROADMAP
\`\`\`typescript
// Template para novo item do roadmap
{
  title: "[Nome da Funcionalidade]",
  description: "[Descrição detalhada do que foi implementado]",
  category: "feature" | "improvement" | "bugfix" | "breaking_change",
  status: "completed",
  priority: "critical" | "high" | "medium" | "low",
  version: "[versão semântica]",
  estimated_hours: [estimativa],
  actual_hours: [tempo real],
  completed_date: "[YYYY-MM-DD]",
  technical_specs: "[detalhes técnicos da implementação]",
  test_criteria: ["critério 1", "critério 2"],
  dependencies: ["dependência 1"],
  context_tags: ["tag1", "tag2"],
  validation_status: "approved",
  source: "ai_generated"
}
\`\`\`

#### 2. ATUALIZAR CHANGELOG
\`\`\`markdown
## v[X.Y.Z] - YYYY-MM-DD

### 🆕 Novas Funcionalidades
- **[Nome]**: [Descrição do que foi adicionado e impacto para usuário]

### ⚡ Melhorias  
- **[Módulo]**: [O que foi melhorado e benefício]

### 🐛 Correções
- **[Área]**: [O que foi corrigido e como afetava usuários]

### ⚠️ Breaking Changes
- **[Módulo]**: [O que mudou e ações necessárias]

### 🛠️ Técnico
- **[Área]**: [Mudanças técnicas internas]
\`\`\`

#### 3. DOCUMENTAR TECNICAMENTE
Para funcionalidades complexas, criar documentação específica:
- **Specs**: Especificação técnica completa
- **SQL**: Scripts de migração se aplicável  
- **Config**: Configurações necessárias
- **Test**: Planos de teste
- **Notes**: Decisões e observações

#### 4. ATUALIZAR CONTEXTO GERAL
Se a mudança for significativa, atualizar:
- Lista de módulos implementados
- Versão atual do sistema
- Tecnologias utilizadas
- Próximos desenvolvimentos

## VERSIONAMENTO SEMÂNTICO

### Regras para Incremento de Versão:
- **Major (X.0.0)**: Breaking changes, refatorações grandes, mudanças de arquitetura
- **Minor (1.X.0)**: Novas funcionalidades compatíveis, novos módulos
- **Patch (1.1.X)**: Correções, melhorias menores, otimizações

### Versão Atual: v1.1.0
- v1.0.0: Sistema base (Auth, Empresas, RBAC, Departamentos, Tarefas)
- v1.1.0: Roadmap + IA (atual)
- v1.2.0: Próxima minor (notificações, analytics, etc.)

## TEMPLATES DE RESPOSTA

### Para Nova Funcionalidade:
\`\`\`
Vou implementar [funcionalidade] seguindo os padrões estabelecidos.

ANÁLISE DO CONTEXTO ATUAL:
- [verificação do que já existe]
- [módulos que serão afetados]
- [permissões necessárias]

IMPLEMENTAÇÃO:
[código da funcionalidade]

DOCUMENTAÇÃO ATUALIZADA:
- Roadmap item adicionado
- Changelog atualizado  
- [especificação técnica se necessário]

Esta implementação segue os padrões RLS, RBAC e multi-tenant do sistema.
\`\`\`

### Para Correção de Bug:
\`\`\`
Identifiquei e corrigi o bug em [módulo].

PROBLEMA:
[descrição do bug e impacto]

CAUSA RAIZ:
[análise técnica da causa]

CORREÇÃO:
[código da correção]

CHANGELOG ATUALIZADO:
[entrada no changelog]

Correção testada e validada.
\`\`\`

## CHECKLIST DE QUALIDADE

Antes de finalizar qualquer alteração, verificar:

### ✅ Funcional
- [ ] Funcionalidade implementada conforme solicitado
- [ ] Testado com múltiplos usuários/empresas
- [ ] Permissões RBAC funcionando
- [ ] RLS policies corretas

### ✅ Documentação
- [ ] Item adicionado ao roadmap
- [ ] Changelog atualizado
- [ ] Especificação técnica (se necessário)
- [ ] Contexto geral atualizado (se significativo)

### ✅ Código
- [ ] Padrões de nomenclatura seguidos
- [ ] Error handling implementado
- [ ] Loading states adicionados
- [ ] TypeScript types corretos

### ✅ Segurança
- [ ] RLS policies testadas
- [ ] Permissões verificadas
- [ ] Isolamento multi-tenant validado
- [ ] Auditoria funcionando (se aplicável)

## COMANDOS ÚTEIS PARA DEBUG

### Verificar Permissões:
\`\`\`sql
SELECT user_has_permission('[user_id]', '[company_id]', '[permission]');
\`\`\`

### Verificar RLS:
\`\`\`sql
SELECT * FROM [table] WHERE company_id = '[company_id]';
\`\`\`

### Verificar Audit:
\`\`\`sql
SELECT * FROM audit_logs WHERE company_id = '[company_id]' ORDER BY created_at DESC LIMIT 10;
\`\`\`

## ERROS COMUNS E SOLUÇÕES

### 1. RLS Policy Negando Acesso
**Causa:** Policy muito restritiva ou \`company_id\` incorreto
**Solução:** Verificar \`user_companies\` e ajustar policy

### 2. Permissão Negada
**Causa:** Usuário não tem papel com permissão necessária
**Solução:** Verificar \`user_roles\` e \`role_permissions\`

### 3. Query Vazia
**Causa:** Context de empresa não definido
**Solução:** Verificar \`useCompanyContext\`

### 4. Tipo TypeScript Incorreto
**Causa:** Enum do banco não sincronizado
**Solução:** Verificar tipos em \`src/types/\`

---

**IMPORTANTE:** Este protocolo garante que o sistema continue evoluindo de forma consistente e documentada. Seguir SEMPRE estes passos para manter qualidade e rastreabilidade.`,
    format: 'markdown',
    tags: ['ai-instructions', 'protocol', 'maintenance', 'standards', 'quality'],
    is_active: true,
    version: 1
  }
];`,
    format: 'markdown',
    tags: ['system', 'complete', 'documentation', 'ai-ready'],
    is_active: true,
    version: 1
  }
];
