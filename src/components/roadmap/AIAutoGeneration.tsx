
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useRoadmap } from '@/hooks/useRoadmap';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { useAuth } from '@/hooks/useAuth';
import { Wand2, FileText, TestTube, StickyNote } from 'lucide-react';
import { RoadmapItem } from '@/types/roadmap';

export const AIAutoGeneration = () => {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [generationType, setGenerationType] = useState('technical_specs');
  const { data: roadmapItems = [] } = useRoadmap();
  const { generateDocumentation } = useAIAnalysis();
  const { user } = useAuth();

  const handleGenerate = () => {
    const item = roadmapItems.find(item => item.id === selectedItem);
    if (!item || !user) return;

    generateDocumentation.mutate({
      item,
      type: generationType,
      userId: user.id
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technical_specs': return <FileText className="w-4 h-4" />;
      case 'test_plan': return <TestTube className="w-4 h-4" />;
      case 'implementation_notes': return <StickyNote className="w-4 h-4" />;
      default: return <Wand2 className="w-4 h-4" />;
    }
  };

  const selectedItemData = roadmapItems.find(item => item.id === selectedItem);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Geração Automática de Documentação
          </CardTitle>
          <CardDescription>
            Use IA para gerar especificações, planos de teste e notas automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Item do Roadmap</label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um item" />
                </SelectTrigger>
                <SelectContent>
                  {roadmapItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        {item.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Documentação</label>
              <Select value={generationType} onValueChange={setGenerationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical_specs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Especificação Técnica
                    </div>
                  </SelectItem>
                  <SelectItem value="test_plan">
                    <div className="flex items-center gap-2">
                      <TestTube className="w-4 h-4" />
                      Plano de Testes
                    </div>
                  </SelectItem>
                  <SelectItem value="implementation_notes">
                    <div className="flex items-center gap-2">
                      <StickyNote className="w-4 h-4" />
                      Notas de Implementação
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedItemData && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Preview do Item Selecionado:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedItemData.category}</Badge>
                  <Badge 
                    variant={selectedItemData.priority === 'high' ? 'destructive' : 'outline'}
                  >
                    {selectedItemData.priority}
                  </Badge>
                </div>
                <h5 className="font-medium">{selectedItemData.title}</h5>
                {selectedItemData.description && (
                  <p className="text-sm text-gray-600">{selectedItemData.description}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleGenerate}
              disabled={!selectedItem || generateDocumentation.isPending}
              className="flex items-center gap-2"
            >
              {getTypeIcon(generationType)}
              {generateDocumentation.isPending ? 'Gerando...' : 'Gerar Documentação'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Documentação Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium">Especificação Técnica</h4>
            </div>
            <p className="text-sm text-gray-600">
              Documentação completa com requisitos funcionais, arquitetura e critérios de aceitação.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TestTube className="w-5 h-5 text-green-500" />
              <h4 className="font-medium">Plano de Testes</h4>
            </div>
            <p className="text-sm text-gray-600">
              Estratégia de testes completa com cenários, casos de uso e critérios de validação.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="w-5 h-5 text-orange-500" />
              <h4 className="font-medium">Notas de Implementação</h4>
            </div>
            <p className="text-sm text-gray-600">
              Notas práticas com decisões técnicas, padrões e próximos passos para desenvolvimento.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
