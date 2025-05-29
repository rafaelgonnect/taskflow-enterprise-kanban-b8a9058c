
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCompanies } from "@/hooks/useCompanies";
import { Sidebar } from "@/components/Sidebar";
import { TaskBoard } from "@/components/TaskBoard";
import { Header } from "@/components/Header";
import { DashboardStats } from "@/components/DashboardStats";
import { CompanyCreationModal } from "@/components/CompanyCreationModal";

const Index = () => {
  const [selectedView, setSelectedView] = useState("dashboard");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const { user, loading } = useAuth();
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (companies && companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0].id);
    }
  }, [companies, selectedCompany]);

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
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            companies={companies || []}
          />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              {selectedView === "dashboard" && <DashboardStats />}
              {selectedView === "kanban" && (
                <TaskBoard 
                  companyId={selectedCompany}
                  departmentId={selectedDepartment}
                />
              )}
              {selectedView === "my-tasks" && (
                <TaskBoard 
                  companyId={selectedCompany}
                  departmentId="user"
                  userId="current"
                />
              )}
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
