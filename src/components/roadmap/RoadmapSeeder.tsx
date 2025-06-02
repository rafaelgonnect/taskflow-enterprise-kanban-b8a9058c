
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoadmapSeeder } from '@/hooks/useRoadmapSeeder';
import { Database, FileText, Zap } from 'lucide-react';

export const RoadmapSeeder = () => {
  const { seedRoadmapData, isLoading } = useRoadmapSeeder();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Inicializar Roadmap
        </CardTitle>
        <CardDescription>
          Preencher o roadmap com a documentação técnica de tudo que foi desenvolvido no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Zap className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-sm">8 Funcionalidades</p>
                <p className="text-xs text-gray-600">Todas implementadas</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <FileText className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">4 Documentos</p>
                <p className="text-xs text-gray-600">Specs técnicas</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <Database className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-sm">v1.1.0</p>
                <p className="text-xs text-gray-600">Versão atual</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-2">Este processo irá criar:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Itens do roadmap para todas as funcionalidades implementadas</li>
              <li>Documentação técnica completa do sistema</li>
              <li>Changelog organizado por versões</li>
              <li>Contexto para IA com arquitetura atual</li>
            </ul>
          </div>

          <Button 
            onClick={seedRoadmapData}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Criando...' : 'Inicializar Roadmap Completo'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
