
import { useState, useEffect } from 'react';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useRoadmap } from './useRoadmap';
import { useRoadmapDocumentation } from './useRoadmapDocumentation';
import { FileSync } from '@/utils/fileSync';
import { RoadmapConfigFile, DevelopmentContext } from '@/types/roadmap';

export function useFileSync() {
  const { selectedCompany } = useCompanyContext();
  const { data: roadmapItems = [] } = useRoadmap();
  const { data: documentation = [] } = useRoadmapDocumentation();
  
  const [config, setConfig] = useState<RoadmapConfigFile | null>(null);
  const [context, setContext] = useState<DevelopmentContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configurações iniciais
  useEffect(() => {
    if (!selectedCompany?.id) return;

    loadConfigs();
  }, [selectedCompany?.id]);

  const loadConfigs = async () => {
    if (!selectedCompany?.id) return;

    setIsLoading(true);
    try {
      const [configData, contextData] = await Promise.all([
        FileSync.loadFromSupabase(selectedCompany.id, 'roadmap-config.json'),
        FileSync.loadFromSupabase(selectedCompany.id, 'development-context.json'),
      ]);

      setConfig(configData);
      setContext(contextData);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async (newConfig: Partial<RoadmapConfigFile>) => {
    if (!selectedCompany?.id || !config) return;

    const updatedConfig = {
      ...config,
      ...newConfig,
      last_updated: new Date().toISOString(),
    };

    setConfig(updatedConfig);
    
    await Promise.all([
      FileSync.writeConfig('roadmap-config.json', updatedConfig),
      FileSync.syncToSupabase(selectedCompany.id, 'roadmap-config.json', updatedConfig),
    ]);
  };

  const updateContext = async (newContext: Partial<DevelopmentContext>) => {
    if (!selectedCompany?.id || !context) return;

    const updatedContext = {
      ...context,
      ...newContext,
    };

    setContext(updatedContext);
    
    await Promise.all([
      FileSync.writeConfig('development-context.json', updatedContext),
      FileSync.syncToSupabase(selectedCompany.id, 'development-context.json', updatedContext),
    ]);
  };

  const generateAIContext = () => {
    if (!context) return '';
    
    return FileSync.generateContextForAI(context, roadmapItems, documentation);
  };

  const exportData = () => {
    const exportData = {
      config,
      context,
      roadmapItems,
      documentation,
      aiContext: generateAIContext(),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roadmap-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    config,
    context,
    isLoading,
    updateConfig,
    updateContext,
    generateAIContext,
    exportData,
    refreshConfigs: loadConfigs,
  };
}
