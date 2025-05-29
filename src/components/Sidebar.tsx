
import { Building2, Users, User, BarChart3, Kanban, Settings, ChevronDown, Check, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  selectedView: string;
  setSelectedView: (view: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (departmentId: string) => void;
}

export const Sidebar = ({
  selectedView,
  setSelectedView,
  selectedDepartment,
  setSelectedDepartment,
}: SidebarProps) => {
  const { selectedCompany, companies, switchCompany } = useCompanyContext();
  const navigate = useNavigate();

  return (
    <div className="w-80 bg-white border-r border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TaskFlow SaaS
        </h1>
        <p className="text-slate-600 text-sm mt-1">Sistema de Gestão de Tarefas</p>
      </div>

      <div className="p-4">
        {/* Seletor de Empresa */}
        <div className="mb-6">
          <label className="text-sm font-medium text-slate-700 mb-2 block">Empresa Ativa</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                disabled={companies.length === 0}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">
                    {selectedCompany?.name || 'Selecione uma empresa'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
              <DropdownMenuLabel>Suas Empresas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {companies.map((company) => (
                <DropdownMenuItem
                  key={company.id}
                  onClick={() => switchCompany(company.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{company.name}</span>
                    {company.description && (
                      <span className="text-xs text-slate-500 truncate">
                        {company.description}
                      </span>
                    )}
                  </div>
                  {selectedCompany?.id === company.id && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Menu de Navegação */}
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

          <button
            onClick={() => setSelectedView("users")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
              selectedView === "users" 
                ? "bg-blue-50 text-blue-700 border border-blue-200" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <UserCog size={20} />
            Gestão de Usuários
          </button>

          <button
            onClick={() => navigate('/company-settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings size={20} />
            Configurações
          </button>
        </div>

        {/* Filtro por Departamento */}
        {selectedCompany && (
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Departamento</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">Todos os Departamentos</option>
              {/* TODO: Carregar departamentos da empresa */}
            </select>
          </div>
        )}

        {/* Informações da Empresa */}
        {selectedCompany && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Empresa Atual</h3>
            <p className="text-sm text-slate-900 font-medium">{selectedCompany.name}</p>
            {selectedCompany.description && (
              <p className="text-xs text-slate-600 mt-1">{selectedCompany.description}</p>
            )}
            <p className="text-xs text-slate-500 mt-2">
              Criada em {new Date(selectedCompany.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
