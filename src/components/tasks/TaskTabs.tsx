
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalTasksTab } from './PersonalTasksTab';
import { DepartmentTasksTab } from './DepartmentTasksTab';
import { CompanyTasksTab } from './CompanyTasksTab';
import { useCompanyContext } from '@/contexts/CompanyContext';

export const TaskTabs = () => {
  const { selectedCompany } = useCompanyContext();
  const [activeTab, setActiveTab] = useState('personal');

  if (!selectedCompany) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Selecione uma empresa para gerenciar suas tarefas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Minhas Tarefas</h1>
        <p className="text-slate-600">Gerencie suas tarefas por categoria</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Pessoais</TabsTrigger>
          <TabsTrigger value="department">Departamentais</TabsTrigger>
          <TabsTrigger value="company">Empresariais</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <PersonalTasksTab companyId={selectedCompany.id} />
        </TabsContent>

        <TabsContent value="department" className="space-y-4">
          <DepartmentTasksTab companyId={selectedCompany.id} />
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <CompanyTasksTab companyId={selectedCompany.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
