
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoadmapDocumentation, useDocumentationByType } from '@/hooks/useRoadmapDocumentation';
import { DocumentationEditor } from './DocumentationEditor';
import { DocumentationType } from '@/types/roadmap';
import { Plus, FileText, Database, Settings, TestTube, Code, BookOpen } from 'lucide-react';

export const DocumentationTab = () => {
  const [selectedType, setSelectedType] = useState<DocumentationType>('specs');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const { data: allDocs = [] } = useRoadmapDocumentation();
  const { data: typeDocs = [] } = useDocumentationByType(selectedType);

  const docTypeIcons = {
    specs: FileText,
    notes: BookOpen,
    sql: Database,
    config: Settings,
    test: TestTube,
    context: Code,
  };

  const docTypeLabels = {
    specs: 'Especificações Técnicas',
    notes: 'Notas e Observações',
    sql: 'Scripts SQL',
    config: 'Configurações',
    test: 'Testes',
    context: 'Contexto para IA',
  };

  const getDocTypeColor = (type: DocumentationType) => {
    const colors = {
      specs: 'bg-blue-500',
      notes: 'bg-green-500',
      sql: 'bg-purple-500',
      config: 'bg-orange-500',
      test: 'bg-red-500',
      context: 'bg-indigo-500',
    };
    return colors[type];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Documentação do Roadmap</h2>
          <p className="text-gray-600">
            Gerencie especificações, scripts e contexto para desenvolvimento
          </p>
        </div>
        <Button onClick={() => setIsEditorOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Documentação
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(docTypeLabels).map(([type, label]) => {
          const Icon = docTypeIcons[type as DocumentationType];
          const count = allDocs.filter(doc => doc.doc_type === type).length;
          
          return (
            <Card 
              key={type} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedType === type ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedType(type as DocumentationType)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${getDocTypeColor(type as DocumentationType)} text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{count}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Documentation List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const Icon = docTypeIcons[selectedType];
                return <Icon className="w-5 h-5" />;
              })()}
              {docTypeLabels[selectedType]}
            </CardTitle>
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as DocumentationType)}>
              <SelectTrigger className="w-48">
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
          <CardDescription>
            {typeDocs.length} documento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {typeDocs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma documentação encontrada</p>
              <p className="text-sm text-gray-400 mt-1">
                Clique em "Nova Documentação" para começar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {typeDocs.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{doc.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {doc.format}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          v{doc.version}
                        </Badge>
                        {doc.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Criado em {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // TODO: Abrir editor com este documento
                        console.log('Editando documento:', doc.id);
                      }}
                    >
                      Editar
                    </Button>
                  </div>
                  {doc.content && (
                    <div className="mt-3 p-3 bg-gray-100 rounded text-sm">
                      <p className="line-clamp-3">{doc.content.substring(0, 200)}...</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentation Editor Dialog */}
      <DocumentationEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        docType={selectedType}
      />
    </div>
  );
};
