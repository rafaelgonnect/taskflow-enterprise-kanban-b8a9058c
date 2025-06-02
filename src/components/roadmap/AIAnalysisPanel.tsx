
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoadmap } from '@/hooks/useRoadmap';
import { useAIAnalysis, useAIInsights } from '@/hooks/useAIAnalysis';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Clock } from 'lucide-react';

export const AIAnalysisPanel = () => {
  const [analysisType, setAnalysisType] = useState('analyze_items');
  const { data: roadmapItems = [] } = useRoadmap();
  const { data: insights = [] } = useAIInsights();
  const { analyzeRoadmap } = useAIAnalysis();

  const handleAnalysis = () => {
    analyzeRoadmap.mutate({
      items: roadmapItems,
      type: analysisType
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'risk': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'improvement': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'dependency': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'estimate': return <Clock className="w-4 h-4 text-green-500" />;
      default: return <Brain className="w-4 h-4 text-purple-500" />;
    }
  };

  const getInsightColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header e Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Análise IA do Roadmap
          </CardTitle>
          <CardDescription>
            Use IA para analisar seu roadmap e obter insights automatizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Tipo de Análise</label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analyze_items">Análise Geral</SelectItem>
                  <SelectItem value="suggest_improvements">Sugestões de Melhoria</SelectItem>
                  <SelectItem value="generate_specs">Gerar Especificações</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAnalysis}
              disabled={analyzeRoadmap.isPending || roadmapItems.length === 0}
            >
              {analyzeRoadmap.isPending ? 'Analisando...' : 'Analisar Roadmap'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Insights Gerados */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Recentes</CardTitle>
          <CardDescription>
            {insights.length} insight(s) gerado(s) pela IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum insight gerado ainda</p>
              <p className="text-sm">Execute uma análise para ver insights da IA</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.slice(0, 10).map((insight) => (
                <div key={insight.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.insight_type)}
                      <h4 className="font-medium">{insight.title}</h4>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={getInsightColor(insight.confidence_score)}
                    >
                      {Math.round(insight.confidence_score * 100)}% confiança
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{insight.content}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {insight.insight_type}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {new Date(insight.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
