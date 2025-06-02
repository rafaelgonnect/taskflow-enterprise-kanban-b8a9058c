
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCreateDocumentation } from '@/hooks/useRoadmapDocumentation';
import { DocumentationType, DocumentationFormat, RoadmapDocumentation } from '@/types/roadmap';
import { X } from 'lucide-react';

interface DocumentationEditorProps {
  isOpen: boolean;
  onClose: () => void;
  docType?: DocumentationType;
  document?: RoadmapDocumentation;
  roadmapItemId?: string;
}

export const DocumentationEditor = ({ 
  isOpen, 
  onClose, 
  docType = 'specs',
  document,
  roadmapItemId 
}: DocumentationEditorProps) => {
  const [title, setTitle] = useState(document?.title || '');
  const [content, setContent] = useState(document?.content || '');
  const [format, setFormat] = useState<DocumentationFormat>(document?.format || 'markdown');
  const [selectedDocType, setSelectedDocType] = useState<DocumentationType>(docType);
  const [tags, setTags] = useState<string[]>(document?.tags || []);
  const [newTag, setNewTag] = useState('');

  const createDocumentation = useCreateDocumentation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return;
    }

    try {
      await createDocumentation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        doc_type: selectedDocType,
        format,
        tags,
        roadmap_item_id: roadmapItemId,
        is_active: true,
      });

      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao criar documentação:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setFormat('markdown');
    setTags([]);
    setNewTag('');
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getTemplateForType = (type: DocumentationType) => {
    const templates = {
      specs: `# Especificação Técnica

## Objetivo
Descreva o objetivo desta funcionalidade.

## Requisitos Funcionais
- [ ] Requisito 1
- [ ] Requisito 2

## Requisitos Técnicos
- Stack: 
- Database: 
- APIs necessárias:

## Critérios de Aceitação
- [ ] Critério 1
- [ ] Critério 2

## Notas de Implementação
Adicione observações técnicas importantes.`,

      sql: `-- Migração: [NOME_DA_MIGRAÇÃO]
-- Data: ${new Date().toISOString().split('T')[0]}
-- Descrição: 

-- Verificar estado atual
-- SELECT ...

-- Executar mudanças
-- CREATE TABLE ...
-- ALTER TABLE ...

-- Validar resultado
-- SELECT ...`,

      config: `{
  "feature_name": {
    "enabled": true,
    "settings": {
      "max_items": 100,
      "auto_sync": true
    }
  }
}`,

      test: `# Plano de Testes

## Cenários de Teste

### Teste 1: [Nome do Teste]
**Objetivo:** 
**Passos:**
1. 
2. 
3. 

**Resultado Esperado:**

**Status:** ⏳ Pendente

### Resultados
- [ ] Todos os testes passaram
- [ ] Performance adequada
- [ ] Sem regressões`,

      context: `# Contexto para IA

## Estado Atual do Projeto
- Versão atual:
- Última funcionalidade implementada:
- Tecnologias principais:

## Objetivos Atuais
- Funcionalidade em desenvolvimento:
- Próximos passos:
- Prioridades:

## Informações Técnicas
- Arquitetura:
- Padrões seguidos:
- Limitações conhecidas:

## Para o Agente IA
- Foque em:
- Evite:
- Considere:`,

      notes: `# Notas de Desenvolvimento

## Data: ${new Date().toLocaleDateString('pt-BR')}

## Observações
Adicione suas observações aqui.

## Decisões Tomadas
- Decisão 1: Justificativa
- Decisão 2: Justificativa

## Aprendizados
- Aprendizado 1
- Aprendizado 2

## Próximos Passos
- [ ] Tarefa 1
- [ ] Tarefa 2`
    };

    return templates[type];
  };

  const docTypeLabels = {
    specs: 'Especificação Técnica',
    notes: 'Notas e Observações',
    sql: 'Script SQL',
    config: 'Configuração',
    test: 'Plano de Testes',
    context: 'Contexto para IA',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {document ? 'Editar Documentação' : 'Nova Documentação'}
          </DialogTitle>
          <DialogDescription>
            Crie ou edite documentação técnica, scripts e observações
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doc-type">Tipo de Documentação</Label>
              <Select value={selectedDocType} onValueChange={(value) => setSelectedDocType(value as DocumentationType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(docTypeLabels).map(([type, label]) => (
                    <SelectItem key={type} value={type}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="format">Formato</Label>
              <Select value={format} onValueChange={(value) => setFormat(value as DocumentationFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                  <SelectItem value="text">Texto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da documentação"
              required
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setContent(getTemplateForType(selectedDocType))}
              >
                Usar Template
              </Button>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite o conteúdo da documentação"
              rows={20}
              className="font-mono text-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createDocumentation.isPending}>
              {createDocumentation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
