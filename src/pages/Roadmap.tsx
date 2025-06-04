
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoadmapKanban } from "@/components/roadmap/RoadmapKanban";
import { DocumentationTab } from "@/components/roadmap/DocumentationTab";
import { AIAnalysisPanel } from "@/components/roadmap/AIAnalysisPanel";
import { RoadmapSeeder } from "@/components/roadmap/RoadmapSeeder";
import { RoadmapStats } from "@/components/roadmap/RoadmapStats";
import { useRoadmap } from "@/hooks/useRoadmap";

export default function Roadmap() {
  const { data: roadmapItems = [] } = useRoadmap();

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Roadmap do Produto</h1>
          <p className="text-muted-foreground">
            Gerencie o roadmap, documentação e análises do seu produto
          </p>
        </div>

        <div className="mb-6">
          <RoadmapStats />
        </div>

        <Tabs defaultValue="kanban" className="space-y-6">
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="documentation">Documentação</TabsTrigger>
            <TabsTrigger value="analysis">Análise IA</TabsTrigger>
            <TabsTrigger value="seeder">Dados Iniciais</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban">
            <RoadmapKanban items={roadmapItems} />
          </TabsContent>

          <TabsContent value="documentation">
            <DocumentationTab />
          </TabsContent>

          <TabsContent value="analysis">
            <AIAnalysisPanel />
          </TabsContent>

          <TabsContent value="seeder">
            <RoadmapSeeder />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
