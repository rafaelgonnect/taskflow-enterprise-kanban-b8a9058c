
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PersonalTasksTab } from './PersonalTasksTab';
import { DepartmentTasksTab } from './DepartmentTasksTab';
import { CompanyTasksTab } from './CompanyTasksTab';
import { PublicTasksSection } from './PublicTasksSection';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useDepartmentMembers } from '@/hooks/useDepartmentMembers';
import { useAuth } from '@/hooks/useAuth';

export const TaskTabs = () => {
  const { selectedCompany } = useCompanyContext();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  // Buscar departamentos do usuário
  const { data: allDepartmentMembers = [] } = useDepartmentMembers('');
  const userDepartments = allDepartmentMembers
    .filter(member => member.user_id === user?.id && member.is_active)
    .map(member => member.department_id);

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

      {/* Seção de tarefas públicas para aceitar */}
      <PublicTasksSection 
        companyId={selectedCompany.id} 
        userDepartments={userDepartments}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger value="personal">Pessoais</TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>Tarefas atribuídas somente a você</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger value="department">Departamentais</TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>Tarefas do seu departamento</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger value="company">Empresariais</TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>Tarefas válidas para toda a empresa</TooltipContent>
          </Tooltip>
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
