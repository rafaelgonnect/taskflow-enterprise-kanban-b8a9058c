
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { Sidebar } from "@/components/Sidebar";
import { TaskBoard } from "@/components/TaskBoard";
import { Header } from "@/components/Header";
import { DashboardStats } from "@/components/DashboardStats";
import { UserManagement } from "@/components/UserManagement";
import { CompanyCreationModal } from "@/components/CompanyCreationModal";

const Index = () => {
  const [selectedView, setSelectedView] = useState("dashboard");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const { user, loading } = useAuth();
  const { selectedCompany, companies, isLoading: companiesLoading } = useCompanyContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Verificar se usuário não tem empresa e mostrar modal
  useEffect(() => {
    if (!companiesLoading && companies && companies.length === 0 && user) {
      setShowCompanyModal(true);
    }
  }, [companiesLoading, companies, user]);

  if (loading || companiesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex">
          <Sidebar 
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
          />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              {selectedView === "dashboard" && <DashboardStats />}
              {selectedView === "kanban" && selectedCompany && (
                <TaskBoard 
                  companyId={selectedCompany.id}
                  departmentId={selectedDepartment}
                />
              )}
              {selectedView === "my-tasks" && selectedCompany && (
                <TaskBoard 
                  companyId={selectedCompany.id}
                  departmentId="user"
                  userId="current"
                />
              )}
              {selectedView === "users" && <UserManagement />}
            </main>
          </div>
        </div>
      </div>

      <CompanyCreationModal 
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
      />
    </>
  );
};

export default Index;
