
import { useState } from "react";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { DashboardStats } from "@/components/DashboardStats";
import { TaskBoard } from "@/components/TaskBoard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDepartments } from "@/hooks/useDepartments";

const Index = () => {
  const { selectedCompany } = useCompanyContext();
  const [selectedView, setSelectedView] = useState("dashboard");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  
  const { data: departments = [] } = useDepartments(selectedCompany?.id);

  if (!selectedCompany) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Bem-vindo ao TaskFlow</h2>
          <p className="text-slate-600">Selecione uma empresa para começar</p>
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
