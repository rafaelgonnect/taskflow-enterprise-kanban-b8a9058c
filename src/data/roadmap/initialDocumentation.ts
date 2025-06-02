
import { RoadmapDocumentation } from '@/types/roadmap';

export const initialDocumentation: Omit<RoadmapDocumentation, 'id' | 'created_at' | 'updated_at' | 'company_id' | 'created_by'>[] = [
  {
    doc_type: 'context',
    title: 'Contexto Geral do Sistema - Estado Completo',
    content: 'Sistema de Gestão Empresarial com IA - Estado Atual v1.1.0\n\nVisão Geral do Projeto:\nSistema completo de gestão empresarial com foco em tarefas, roadmaps e integração de IA para desenvolvimento contínuo.\n\nCaracterísticas Principais:\n- Multi-tenant: Cada empresa tem seus próprios dados isolados\n- RBAC Completo: Sistema robusto de papéis e permissões\n- IA Integrada: Assistente especializado em desenvolvimento\n- Real-time Ready: Preparado para funcionalidades em tempo real\n- Audit Trail: Auditoria completa de todas as ações\n\nArquitetura Técnica Detalhada:\n\nFrontend Stack:\n- React 18.3.1 + TypeScript (tipagem estrita)\n- Tailwind CSS + shadcn/ui (design system)\n- React Router 6.26.2 (navegação)\n- TanStack Query 5.56.2 (estado servidor)\n- React Hook Form 7.53.0 (formulários)\n- Recharts 2.12.7 (gráficos)\n- Hello Pangea DnD (drag & drop Kanban)\n\nBackend & Infraestrutura:\n- Supabase (BaaS completo)\n  - PostgreSQL 15+ (database)\n  - Row Level Security (RLS)\n  - Edge Functions (Deno)\n  - Auth JWT\n- OpenAI GPT-4o-mini (IA)\n- Lovable Platform (deploy)\n\nIntegrações Externas:\n- WhatsApp Web (envio de convites)\n- OpenAI API (análise e chat)\n- Supabase Storage (anexos - preparado)\n\nEstado Atual das Funcionalidades:\n\n1. Autenticação e Perfis ✅ v1.0.0\n2. Gestão de Empresas ✅ v1.0.0\n3. RBAC - Sistema de Papéis ✅ v1.0.0\n4. Departamentos ✅ v1.0.0\n5. Sistema de Tarefas Unificado ✅ v1.0.0\n6. Roadmap e Documentação ✅ v1.1.0\n7. Integração IA ✅ v1.1.0\n\nBanco de Dados - 18 tabelas principais com RLS policies.\nFunções SQL customizadas para operações específicas.\n\nPróximos Desenvolvimentos:\n- Notificações Real-time\n- Dashboard Analytics\n- Integração Calendário\n- Relatórios Avançados\n- API Externa',
    format: 'markdown',
    tags: ['context', 'overview', 'architecture', 'complete', 'v1.1.0'],
    is_active: true,
    version: 1
  },
  {
    doc_type: 'sql',
    title: 'Scripts SQL - Schema Completo do Sistema',
    content: 'SCHEMA COMPLETO DO SISTEMA v1.1.0\nTodos os scripts SQL utilizados no desenvolvimento\n\n1. ENUMS E TIPOS CUSTOMIZADOS\n\nCREATE TYPE invite_status AS ENUM (pending, accepted, expired, cancelled);\nCREATE TYPE user_type AS ENUM (employee, manager, admin);\nCREATE TYPE permission AS ENUM (manage_users, manage_roles, manage_departments, manage_tasks, view_all_tasks, create_tasks, edit_tasks, assign_tasks, view_reports, manage_company_settings, view_audit_logs, manage_invitations, access_roadmap, manage_roadmap, ai_features);\n\n2. TABELAS PRINCIPAIS (18 total)\n\nprofiles, companies, user_companies, invitations, roles, role_permissions, user_roles, audit_logs, departments, department_members, tasks, task_history, task_comments, task_attachments, task_time_logs, roadmap_items, roadmap_documentation, roadmap_configs\n\n3. FUNÇÕES SQL CUSTOMIZADAS\n\nhandle_new_user() - Criação automática de perfis\ncreate_default_roles() - Papéis padrão por empresa\nuser_has_permission() - Verificação de permissões\naccept_invitation_by_code() - Aceitar convites\naccept_public_task() - Aceitar tarefas públicas\ngenerate_whatsapp_link() - Links WhatsApp\ncreate_task_history() - Triggers de histórico\n\n4. TRIGGERS\n\nTrigger para criar perfil automático\nTrigger para histórico de tarefas\nTrigger para links WhatsApp\nTriggers para updated_at\n\n5. ROW LEVEL SECURITY (RLS)\n\nTodas as tabelas têm RLS habilitado com políticas específicas por empresa e usuário.',
    format: 'sql',
    tags: ['sql', 'schema', 'complete', 'database', 'rls', 'triggers'],
    is_active: true,
    version: 1
  },
  {
    doc_type: 'config',
    title: 'Configurações Completas do Sistema',
    content: '{\n  "project": {\n    "name": "Sistema de Gestão Empresarial",\n    "version": "1.1.0",\n    "description": "Sistema completo de gestão empresarial com IA integrada"\n  },\n  "architecture": {\n    "frontend": {\n      "framework": "React 18.3.1",\n      "language": "TypeScript",\n      "styling": "Tailwind CSS + shadcn/ui",\n      "routing": "React Router 6.26.2",\n      "state": "TanStack Query 5.56.2"\n    },\n    "backend": {\n      "provider": "Supabase",\n      "database": "PostgreSQL 15+",\n      "auth": "Supabase Auth (JWT)",\n      "edge_functions": "Deno Runtime"\n    },\n    "ai": {\n      "provider": "OpenAI",\n      "model": "gpt-4o-mini",\n      "functions": 3\n    }\n  },\n  "features": {\n    "authentication": { "enabled": true },\n    "companies": { "enabled": true, "multi_tenant": true },\n    "rbac": { "enabled": true, "permissions": 15 },\n    "departments": { "enabled": true },\n    "tasks": { "enabled": true, "types": ["personal", "department", "company"] },\n    "roadmap": { "enabled": true },\n    "ai": { "enabled": true }\n  }\n}',
    format: 'json',
    tags: ['config', 'system', 'complete', 'architecture', 'features'],
    is_active: true,
    version: 1
  },
  {
    doc_type: 'notes',
    title: 'Notas de Desenvolvimento e Decisões Técnicas',
    content: 'Notas de Desenvolvimento - Sistema Completo v1.1.0\n\nDecisões Arquiteturais Importantes:\n\n1. Escolha do Supabase como Backend\nData: 2024-05-15\nRazão: Necessidade de backend robusto sem complexidade de setup\nBenefícios: PostgreSQL nativo, RLS para segurança multi-tenant, Edge Functions para IA\n\n2. Sistema Multi-Tenant com RLS\nData: 2024-05-20\nDecisão: Isolamento por empresa usando Row Level Security\nImplementação: Todas as tabelas têm company_id, Políticas RLS por empresa\n\n3. RBAC Granular vs Simples\nData: 2024-05-25\nDecisão: RBAC completo com 15+ permissões específicas\nJustificativa: Empresas precisam de flexibilidade, Templates para facilitar setup\n\n4. Sistema de Tarefas Unificado\nData: 2024-05-30\nDecisão: Uma tabela para todos os tipos de tarefa\nTipos: personal, department, company\n\n5. IA com GPT-4o-mini\nData: 2024-06-01\nDecisão: GPT-4o-mini em vez de GPT-4\nRazões: Velocidade 3x maior, Custo 10x menor, Qualidade suficiente\n\nPadrões de Desenvolvimento Estabelecidos:\n- Estrutura de componentes modular\n- Nomenclatura consistente de hooks\n- Tratamento de erros padronizado\n- Loading states unificados\n\nObservações Técnicas Importantes:\n- RLS Policies: Evitar policies recursivas\n- Triggers de Histórico: Automáticos para auditoria\n- JSON Arrays: Parse no frontend com fallback\n- Edge Functions: Rate limiting manual\n\nBugs Conhecidos e Workarounds:\n- WhatsApp Links: Base64 encoding implementado\n- Timer State: Verificação no mount\n- RLS Auth Reset: Invalidate queries após auth change\n\nMelhorias Futuras:\n- Performance: Query optimization\n- UX/UI: Dark mode, notificações real-time\n- Funcionalidades: Relatórios, integração calendário\n- DevOps: Monitoring, error tracking',
    format: 'markdown',
    tags: ['notes', 'development', 'decisions', 'patterns', 'learnings'],
    is_active: true,
    version: 1
  },
  {
    doc_type: 'context',
    title: 'Prompt e Instruções para Agente IA - Manutenção Contínua',
    content: 'INSTRUÇÕES PARA AGENTE IA - MANUTENÇÃO DO SISTEMA\n\nPROTOCOLO OBRIGATÓRIO PARA TODA ALTERAÇÃO:\n\nANTES DE QUALQUER MODIFICAÇÃO:\n1. LER CONTEXTO COMPLETO\n   - Acessar aba Documentação no roadmap\n   - Ler Contexto Geral do Sistema - Estado Completo\n   - Revisar Scripts SQL - Schema Completo do Sistema\n   - Consultar Notas de Desenvolvimento\n   - Verificar changelog atual\n\n2. ANALISAR IMPACTO\n   - Identificar módulos afetados\n   - Verificar dependências\n   - Avaliar se é nova feature, melhoria ou correção\n   - Verificar impacto em RLS policies\n\n3. VERIFICAR PERMISSÕES\n   - Consultar sistema RBAC atual\n   - Verificar se nova funcionalidade precisa de permissões\n\nDURANTE A IMPLEMENTAÇÃO:\n1. SEGUIR PADRÕES ESTABELECIDOS\n2. SEGURANÇA MULTI-TENANT\n3. SISTEMA RBAC\n\nAPÓS IMPLEMENTAR:\n1. ATUALIZAR ROADMAP\n2. ATUALIZAR CHANGELOG\n3. DOCUMENTAR TECNICAMENTE\n4. ATUALIZAR CONTEXTO GERAL\n\nVERSIONAMENTO SEMÂNTICO:\n- Major (X.0.0): Breaking changes\n- Minor (1.X.0): Novas funcionalidades\n- Patch (1.1.X): Correções\n\nVersão Atual: v1.1.0\n\nCHECKLIST DE QUALIDADE:\n- Funcional: Implementado, testado, permissões OK\n- Documentação: Roadmap, changelog, specs\n- Código: Padrões, error handling, types\n- Segurança: RLS, permissões, isolamento\n\nERROS COMUNS:\n- RLS Policy negando acesso\n- Permissão negada\n- Query vazia\n- Tipo TypeScript incorreto\n\nEste protocolo garante evolução consistente e documentada do sistema.',
    format: 'markdown',
    tags: ['ai-instructions', 'protocol', 'maintenance', 'standards', 'quality'],
    is_active: true,
    version: 1
  }
];
