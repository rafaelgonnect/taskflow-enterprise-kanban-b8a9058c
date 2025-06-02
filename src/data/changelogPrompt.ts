
export const CHANGELOG_PROMPT = `
# PROMPT PARA MANUTENÇÃO DO CHANGELOG E DOCUMENTAÇÃO

## INSTRUÇÕES PARA O ASSISTENTE IA

### ANTES DE QUALQUER ALTERAÇÃO NO SISTEMA:

1. **LER CONTEXTO ATUAL**:
   - Consulte a aba "Documentação" no roadmap
   - Leia o documento "Contexto Geral do Sistema" 
   - Revise as especificações técnicas existentes
   - Verifique o changelog atual na aba "Changelog"

2. **ANALISAR IMPACTO**:
   - Identifique quais módulos serão afetados
   - Verifique dependências entre funcionalidades
   - Avalie se é uma nova feature, melhoria ou correção

3. **ATUALIZAR DOCUMENTAÇÃO**:
   - Crie/atualize especificações técnicas
   - Documente decisões arquiteturais
   - Atualize o contexto geral se necessário

### APÓS IMPLEMENTAR QUALQUER ALTERAÇÃO:

1. **CRIAR ITEM NO ROADMAP**:
   - Adicione novo item com categoria apropriada (feature/improvement/bugfix)
   - Defina versão seguindo padrão semântico
   - Marque como "completed" com data atual
   - Inclua estimativa vs tempo real

2. **ATUALIZAR CHANGELOG**:
   - Adicione entrada na versão correspondente
   - Use emojis apropriados (🆕 🐛 ⚡ ⚠️)
   - Descreva impacto para usuários
   - Mencione breaking changes se houver

3. **DOCUMENTAR TECNICAMENTE**:
   - Crie specs se for funcionalidade complexa
   - Documente APIs/hooks criados
   - Atualize contexto da IA se necessário

### FORMATO PADRÃO PARA CHANGELOG:

\`\`\`
## v1.X.X - YYYY-MM-DD

### 🆕 Novas Funcionalidades
- **Nome da Feature**: Descrição do que foi adicionado

### ⚡ Melhorias  
- **Nome do Módulo**: O que foi melhorado

### 🐛 Correções
- **Área**: O que foi corrigido

### ⚠️ Breaking Changes
- **Módulo**: O que mudou e requer atenção
\`\`\`

### VERSIONAMENTO SEMÂNTICO:
- **Major (X.0.0)**: Breaking changes ou refatorações grandes
- **Minor (1.X.0)**: Novas funcionalidades compatíveis  
- **Patch (1.1.X)**: Correções e melhorias menores

### EXEMPLO DE USO:
"Implemente autenticação via Google OAuth"

**RESPOSTA ESPERADA:**
1. Ler contexto atual do sistema de auth
2. Implementar OAuth Google
3. Criar item roadmap "Autenticação Google OAuth" (v1.2.0)
4. Atualizar changelog com nova funcionalidade
5. Documentar especificação técnica da integração
6. Atualizar contexto geral se necessário

---

**IMPORTANTE**: Sempre siga este processo para manter a documentação sincronizada e o histórico completo do projeto.
`;

export const SYSTEM_OVERVIEW = `
# VISÃO GERAL DO SISTEMA - ESTADO ATUAL

## Arquitetura
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **IA**: OpenAI GPT-4o-mini
- **Deploy**: Lovable Platform

## Módulos Implementados (v1.1.0)

### 1. Sistema de Autenticação ✅
- Supabase Auth (email/password)
- Perfis de usuário
- Proteção de rotas
- RLS policies

### 2. Gestão de Empresas ✅  
- Criação de empresas
- Sistema de convites (email + WhatsApp)
- Gestão de membros
- Códigos únicos de convite

### 3. RBAC - Papéis e Permissões ✅
- Sistema completo de papéis
- Templates pré-definidos
- Hierarquia de papéis
- Auditoria completa
- 15+ permissões específicas

### 4. Gestão de Departamentos ✅
- Criação/edição de departamentos
- Atribuição de gerentes
- Gestão de membros
- Integração com tarefas

### 5. Sistema de Tarefas ✅
- Tarefas pessoais/departamentais/empresariais
- Interface Kanban
- Timer integrado
- Histórico de mudanças
- Sistema de comentários
- Anexos de arquivos
- Tarefas públicas com aceitação

### 6. Roadmap e Documentação ✅
- Gestão de itens do roadmap
- Sistema de documentação integrado
- Versionamento
- Changelog automático
- Múltiplos formatos (Markdown, JSON, SQL)

### 7. Integração IA ✅
- Chat especializado em desenvolvimento  
- Análise automática de roadmap
- Geração automática de documentação
- 3 Edge Functions especializadas

## Tecnologias e Integrações
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth
- **Realtime**: Supabase Realtime (preparado)
- **Storage**: Supabase Storage (preparado)
- **IA**: OpenAI API
- **Comunicação**: WhatsApp Web (convites)

## Estado das Tabelas
- 18 tabelas principais
- RLS policies ativas
- Triggers para auditoria
- Functions personalizadas
- Políticas de segurança robustas

## Próximos Desenvolvimentos Planejados
- Notificações em tempo real
- Dashboard analytics avançado
- Integração com calendário
- Sistema de relatórios
- API externa para integrações
`;
