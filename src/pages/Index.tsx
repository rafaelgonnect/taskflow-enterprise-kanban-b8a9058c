
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TaskBoard } from "@/components/TaskBoard";
import { Header } from "@/components/Header";
import { DashboardStats } from "@/components/DashboardStats";

const Index = () => {
  const [selectedView, setSelectedView] = useState("dashboard");
  const [selectedCompany, setSelectedCompany] = useState("1");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex">
        <Sidebar 
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
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
  );
};

export default Index;
