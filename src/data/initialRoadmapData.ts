
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
    technical_specs: 'Implementado com Supabase Auth, RLS policies, perfis de usuário',
    test_criteria: ['Login/logout funcional', 'Criação de perfis', 'Políticas RLS ativas'],
    dependencies: [],
    context_tags: ['auth', 'security', 'supabase'],
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
    technical_specs: 'Sistema de convites com códigos únicos, integração WhatsApp, gestão de membros',
    test_criteria: ['Criação de empresas', 'Envio de convites', 'Aceitação de convites'],
    dependencies: [],
    context_tags: ['companies', 'invites', 'whatsapp'],
    validation_status: 'approved',
    source: 'manual'
  },
  {
    title: 'Sistema de Papéis e Permissões (RBAC)',
    description: 'Controle de acesso baseado em papéis com templates, hierarquia e auditoria',
    category: 'feature',
    status: 'completed',
    priority: 'high',
    version: 'v1.0.0',
    estimated_hours: 50,
    actual_hours: 45,
    completed_date: '2024-06-01',
    technical_specs: 'RBAC completo com templates, hierarquia, logs de auditoria',
    test_criteria: ['Criação de papéis', 'Atribuição de permissões', 'Auditoria funcional'],
    dependencies: [],
    context_tags: ['rbac', 'permissions', 'audit'],
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
    technical_specs: 'Departamentos com gerentes, membros ativos, políticas RLS',
    test_criteria: ['Criação de departamentos', 'Atribuição de membros', 'Gestão de gerentes'],
    dependencies: [],
    context_tags: ['departments', 'management'],
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
    technical_specs: 'Sistema Kanban, timer integrado, histórico de mudanças, anexos',
    test_criteria: ['Criação de tarefas', 'Timer funcional', 'Histórico completo'],
    dependencies: [],
    context_tags: ['tasks', 'kanban', 'timer', 'history'],
    validation_status: 'approved',
    source: 'manual'
  },
  {
    title: 'Tarefas Públicas e Sistema de Aceitação',
    description: 'Sistema para publicar tarefas e permitir que membros as aceitem',
    category: 'feature',
    status: 'completed',
    priority: 'medium',
    version: 'v1.0.0',
    estimated_hours: 20,
    actual_hours: 18,
    completed_date: '2024-06-01',
    technical_specs: 'Tarefas públicas com aceitação automática e validação de permissões',
    test_criteria: ['Publicação de tarefas', 'Aceitação por membros', 'Validação de acesso'],
    dependencies: [],
    context_tags: ['public-tasks', 'acceptance'],
    validation_status: 'approved',
    source: 'manual'
  },
  {
    title: 'Roadmap e Gestão de Funcionalidades',
    description: 'Sistema completo de roadmap com documentação, versionamento e changelog',
    category: 'feature',
    status: 'completed',
    priority: 'high',
    version: 'v1.1.0',
    estimated_hours: 45,
    actual_hours: 42,
    completed_date: '2024-06-02',
    technical_specs: 'Roadmap Kanban, documentação integrada, changelog automático',
    test_criteria: ['Criação de itens', 'Documentação funcional', 'Changelog atualizado'],
    dependencies: [],
    context_tags: ['roadmap', 'documentation', 'changelog'],
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
    technical_specs: 'Edge Functions OpenAI, chat especializado, análise automática, geração de docs',
    test_criteria: ['Chat IA funcional', 'Análise de itens', 'Geração automática'],
    dependencies: [],
    context_tags: ['ai', 'openai', 'chat', 'analysis', 'generation'],
    validation_status: 'approved',
    source: 'ai_generated'
  }
];

export const initialDocumentation: Omit<RoadmapDocumentation, 'id' | 'created_at' | 'updated_at' | 'company_id' | 'created_by'>[] = [
  {
    doc_type: 'context',
    title: 'Contexto Geral do Sistema',
    content: `# Sistema de Gestão Empresarial com IA

## Visão Geral
Sistema completo de gestão empresarial com foco em tarefas, roadmaps e integração de IA.

## Arquitetura Técnica
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **IA**: OpenAI GPT-4o-mini
- **Deploy**: Lovable Platform

## Módulos Principais
1. **Autenticação**: Supabase Auth com perfis
2. **Empresas**: Gestão com convites e membros
3. **RBAC**: Sistema completo de papéis e permissões
4. **Departamentos**: Organização hierárquica
5. **Tarefas**: Sistema Kanban com timer
6. **Roadmap**: Gestão de funcionalidades
7. **IA**: Assistente especializado

## Integrações
- WhatsApp (convites)
- OpenAI (análise e chat)
- Supabase (backend completo)

## Estado Atual
- v1.1.0 em produção
- Todas as funcionalidades core implementadas
- IA integrada e funcional`,
    format: 'markdown',
    tags: ['context', 'overview', 'architecture'],
    is_active: true,
    version: 1
  },
  {
    doc_type: 'specs',
    title: 'Especificação Técnica - Sistema de Autenticação',
    content: `# Especificação Técnica - Autenticação

## Objetivo
Implementar sistema seguro de autenticação com perfis de usuário.

## Implementação
- Supabase Auth para login/logout
- Tabela profiles para dados adicionais
- RLS policies para segurança
- Hooks customizados (useAuth)

## Segurança
- Row Level Security ativo
- Políticas por usuário
- Validação de email obrigatória

## Componentes
- Auth.tsx (página de login)
- ProtectedRoute.tsx (proteção de rotas)
- useAuth.tsx (hook principal)`,
    format: 'markdown',
    tags: ['auth', 'security', 'specs'],
    is_active: true,
    version: 1
  },
  {
    doc_type: 'specs',
    title: 'Especificação Técnica - Sistema RBAC',
    content: `# Especificação Técnica - RBAC

## Objetivo
Controle de acesso baseado em papéis com hierarquia e auditoria.

## Estrutura
- roles: Papéis da empresa
- role_permissions: Permissões por papel
- user_roles: Usuários e seus papéis
- audit_logs: Log de mudanças

## Funcionalidades
- Templates de papéis pré-definidos
- Hierarquia de papéis
- Auditoria completa
- Validação de permissões

## Permissões Disponíveis
- manage_users, manage_roles, manage_departments
- manage_tasks, view_all_tasks, create_tasks
- edit_tasks, assign_tasks, view_reports`,
    format: 'markdown',
    tags: ['rbac', 'permissions', 'security'],
    is_active: true,
    version: 1
  },
  {
    doc_type: 'specs',
    title: 'Especificação Técnica - Sistema de IA',
    content: `# Especificação Técnica - Integração IA

## Objetivo
Assistente IA especializado em desenvolvimento com análise automática.

## Edge Functions
1. **ai-development-chat**: Chat especializado
2. **ai-roadmap-analysis**: Análise de itens
3. **ai-auto-generation**: Geração automática

## Funcionalidades
- Chat contextual sobre desenvolvimento
- Análise automática de roadmap
- Geração de especificações
- Sugestões de melhorias

## Modelo
- GPT-4o-mini da OpenAI
- Contexto específico do projeto
- Prompts especializados

## Segurança
- API Key em Supabase Secrets
- Verificação JWT ativa
- Rate limiting implementado`,
    format: 'markdown',
    tags: ['ai', 'openai', 'specs'],
    is_active: true,
    version: 1
  }
];
