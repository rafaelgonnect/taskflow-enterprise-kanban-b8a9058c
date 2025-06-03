
import { useState } from "react";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { DashboardStats } from "@/components/DashboardStats";
import { TaskBoard } from "@/components/TaskBoard";
import { CompanyCreationModal } from "@/components/CompanyCreationModal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDepartments } from "@/hooks/useDepartments";
import { Building2 } from "lucide-react";

const Index = () => {
  const { selectedCompany, companies, isLoading } = useCompanyContext();
  const [selectedView, setSelectedView] = useState("dashboard");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { data: departments = [] } = useDepartments(selectedCompany?.id);

  // Se ainda está carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não tem empresas, mostrar modal de criação automaticamente
  if (!isLoading && companies.length === 0) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="text-center">
            <div className="relative mb-6">
              <Building2 className="h-16 w-16 text-blue-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Bem-vindo ao TaskFlow!</h2>
            <p className="text-slate-600 mb-6">Você precisa criar uma empresa para começar a usar o sistema.</p>
            <Button onClick={() => setShowCreateModal(true)} size="lg">
              <Building2 className="h-5 w-5 mr-2" />
              Criar Minha Empresa
            </Button>
          </div>
        </div>
        
        <CompanyCreationModal 
          isOpen={true} 
          onClose={() => {}} 
        />
      </>
    );
  }

  // Se não tem empresa selecionada mas tem empresas disponíveis
  if (!selectedCompany && companies.length > 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Selecione uma empresa</h2>
          <p className="text-slate-600">Use o seletor no cabeçalho para escolher uma empresa</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {selectedView === "dashboard" ? "Dashboard" : "Kanban Board"}
          </h1>
          <p className="text-slate-600">
            {selectedView === "dashboard" 
              ? "Visão geral das suas tarefas e equipe" 
              : "Gerencie suas tarefas de forma visual"}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dashboard">Dashboard</SelectItem>
              <SelectItem value="kanban">Kanban Board</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedView === "kanban" && (
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                <SelectItem value="user">Minhas Tarefas</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {selectedView === "dashboard" ? (
        <DashboardStats />
      ) : (
        <TaskBoard 
          companyId={selectedCompany.id}
          departmentId={selectedDepartment}
          userId={selectedDepartment === "user" ? "current" : undefined}
        />
      )}
    </div>
  );
};

export default Index;
