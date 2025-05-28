
import { Building2, Users, User, BarChart3, Kanban } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  selectedView: string;
  setSelectedView: (view: string) => void;
  selectedCompany: string;
  setSelectedCompany: (companyId: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (departmentId: string) => void;
}

const mockCompanies = [
  { id: "1", name: "TechCorp Solutions", departments: ["Desenvolvimento", "Marketing", "Vendas"] },
  { id: "2", name: "Digital Agency", departments: ["Criação", "Atendimento", "Estratégia"] }
];

export const Sidebar = ({
  selectedView,
  setSelectedView,
  selectedCompany,
  setSelectedCompany,
  selectedDepartment,
  setSelectedDepartment
}: SidebarProps) => {
  const currentCompany = mockCompanies.find(c => c.id === selectedCompany);

  return (
    <div className="w-80 bg-white border-r border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TaskFlow SaaS
        </h1>
        <p className="text-slate-600 text-sm mt-1">Sistema de Gestão de Tarefas</p>
      </div>

      <div className="p-4">
        <div className="space-y-2 mb-6">
          <button
            onClick={() => setSelectedView("dashboard")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
              selectedView === "dashboard" 
                ? "bg-blue-50 text-blue-700 border border-blue-200" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <BarChart3 size={20} />
            Dashboard
          </button>
          
          <button
            onClick={() => setSelectedView("kanban")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
              selectedView === "kanban" 
                ? "bg-blue-50 text-blue-700 border border-blue-200" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Kanban size={20} />
            Kanban Board
          </button>

          <button
            onClick={() => setSelectedView("my-tasks")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
              selectedView === "my-tasks" 
                ? "bg-blue-50 text-blue-700 border border-blue-200" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <User size={20} />
            Minhas Tarefas
          </button>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-slate-700 mb-2 block">Empresa</label>
          <select
            value={selectedCompany}
            onChange={(e) => {
              setSelectedCompany(e.target.value);
              setSelectedDepartment("all");
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {mockCompanies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {currentCompany && (
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Departamento</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">Todos os Departamentos</option>
              {currentCompany.departments.map((dept) => (
                <option key={dept} value={dept.toLowerCase()}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
