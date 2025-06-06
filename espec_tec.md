# Especificações Técnicas do Sistema

## Visão Geral

Esta aplicação é uma plataforma SaaS de gestão de tarefas e roadmap com suporte a múltiplas empresas. Utiliza **React + Vite + TypeScript** no front‑end, **Tailwind CSS** para estilização e **shadcn‑ui/Radix** para componentes visuais. O back‑end baseia‑se no **Supabase**, que fornece banco de dados Postgres, autenticação e funções edge escritas em Deno.

### Fluxo Básico
1. Usuário autentica via Supabase (`src/pages/Auth.tsx`).
2. Após login/criação de conta, seleciona ou cria uma empresa (`CompanyCreationModal`).
3. A partir daí, navega por páginas protegidas usando `ProtectedRoute`.
4. Operações de CRUD são feitas via hooks React Query que chamam a API do Supabase.
5. Políticas RLS garantem segurança em cada tabela.

## Páginas Principais

### Dashboard (`src/pages/Index.tsx`)
- Exibe visão geral com métricas (`DashboardStats`) e transferências pendentes de tarefas.

### Tarefas (`src/pages/Tasks.tsx`)
- Tabs para tarefas pessoais, de departamento e da empresa.
- Usa `TaskBoardUnified` para kanban com drag‑and‑drop.

### Tarefas Públicas (`src/pages/PublicTasks.tsx`)
- Mostra tarefas marcadas como públicas para qualquer usuário da empresa.

### Roadmap (`src/pages/Roadmap.tsx`)
- Abas: Kanban, Documentação, Análise IA e Seeder inicial.
- Kanban agrupa `roadmap_items` por status.
- Documentação usa `roadmap_documentation`.
- Painel de IA integra edge function `ai-roadmap-analysis`.

### Departamentos (`src/pages/DepartmentManagement.tsx`)
- Permite criar, listar e excluir departamentos.
- Dialog para gerenciar membros (`DepartmentMembersDialog`).

### Papéis e Permissões (`src/pages/RoleManagement.tsx`)
- Lista papéis de uma empresa e estatísticas rápidas.
- Diálogo de criação/edição (`RoleFormDialog`) e aplicação de templates (`RoleTemplateSelector`).

### Usuários da Empresa (`src/pages/UserManagement.tsx`)
- Lista membros ativos/inativos e convites pendentes.
- Possui filtros de busca e status.
- Envio de convites via email/WhatsApp e gestão de permissões individuais (`UserPermissionsDialog`).

### Configurações da Empresa (`src/pages/CompanySettings.tsx`)
- Formulário para atualizar nome e descrição.
- Acesso aos logs de auditoria (`AuditLogsDialog`).

### Perfil do Usuário (`src/pages/Profile.tsx`)
- Atualização de dados pessoais, habilidades, idiomas e experiência profissional.

### Aceite de Convites (`src/pages/InviteAccept.tsx`)
- Fluxo para aceitar convite através de código. Caso o usuário não exista, permite cadastro no mesmo fluxo.

### Reset da Base (`src/pages/DatabaseReset.tsx`)
- Página protegida que chama a função `reset-database` para apagar todas as tabelas mediante senha.

## Estrutura do Banco de Dados
As definições estão em `src/integrations/supabase/types.ts`. Abaixo estão as principais tabelas e campos (simplificados):

| Tabela | Campos Importantes |
|--------|-------------------|
| **profiles** | `id`, `email`, `full_name`, `user_type`, `skills`, `languages`, `experience`, `created_at` |
| **companies** | `id`, `name`, `description`, `owner_id`, `created_at` |
| **user_companies** | vincula usuários às empresas (`user_id`, `company_id`, `is_active`) |
| **roles** | `id`, `name`, `description`, `color`, `is_default`, `company_id` |
| **role_permissions** | `role_id`, `permission` |
| **user_roles** | atribui papéis aos usuários (`user_id`, `role_id`, `assigned_at`) |
| **departments** | `id`, `name`, `description`, `company_id`, `manager_id` |
| **department_members** | `department_id`, `user_id`, `is_active`, `added_by` |
| **tasks** | `id`, `title`, `description`, `company_id`, `department_id`, `assignee_id`, `status`, `priority`, `task_type`, `is_public`, `created_by`, `due_date`, `estimated_hours`, `total_time_minutes` |
| **task_comments** | comentários ligados a tarefas (`task_id`, `content`, `created_by`) |
| **task_attachments** | arquivos vinculados a tarefas (`task_id`, `file_url`, `uploaded_by`) |
| **task_time_logs** | controle de tempo das tarefas (`task_id`, `user_id`, `started_at`, `ended_at`, `duration_minutes`) |
| **task_transfers** | solicitações de transferência de tarefa entre usuários |
| **roadmap_items** | `id`, `title`, `description`, `status`, `priority`, `category`, `estimated_hours`, `assigned_to`, `company_id` |
| **roadmap_documentation** | documentos de suporte aos itens do roadmap (tipo, título, conteúdo, tags) |
| **roadmap_comments** | comentários no roadmap (`roadmap_item_id`, `comment`, `user_id`) |
| **ai_insights** | registros de análises geradas por IA sobre roadmap/tarefas |
| **audit_logs** | histórico de ações realizadas na plataforma (`action`, `user_id`, `company_id`, `target_id`) |

### Enums Relevantes
- `permission`: lista extensa de permissões (ex.: `manage_company`, `manage_users`, `view_audit_logs`, etc.).
- `roadmap_status`: `planned`, `in_progress`, `in_review`, `completed`, `cancelled`, `paused`.
- `roadmap_priority`: `critical`, `high`, `medium`, `low`.
- `roadmap_category`: `feature`, `improvement`, `bugfix`, `breaking_change`.
- `user_type`: `company_owner` ou `employee`.

## Funções e Automação
- Funções RPC como `accept_invitation_by_code`, `apply_role_template`, `calculate_total_time` auxiliam a lógica no banco.
- Edge Functions (`supabase/functions`) implementam recursos de IA (chat e geração automática de documentação) e a limpeza completa da base.
- Migrations em `supabase/migrations` definem políticas RLS para garantir que cada usuário acesse somente dados permitidos.

## Estilo e Tecnologias do Front‑end
- **React + Vite** com estrutura de componentes em `src/components`.
- **Tailwind CSS** configurado em `tailwind.config.ts` com temas claros/escuros.
- **shadcn-ui/Radix** para diálogos, abas, dropdowns e formulários.
- **React Router** para navegação e **React Query** para cache de dados.

## Fluxo de Dados
1. Hooks em `src/hooks` realizam consultas/mutações ao Supabase e atualizam caches (ex.: `useTasks`, `useDepartments`, `useRoles`).
2. Providers (`AuthProvider`, `CompanyProvider`) mantêm estado global do usuário e empresa selecionada.
3. Components consomem esses hooks para renderizar tabelas, quadros Kanban e formulários.
4. Qualquer alteração dispara invalidação de queries para manter a UI em sincronia.

