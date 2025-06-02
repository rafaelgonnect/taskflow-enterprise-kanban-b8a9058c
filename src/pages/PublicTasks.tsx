
import { useCompanyContext } from '@/contexts/CompanyContext';
import { PublicTasksBoard } from '@/components/PublicTasksBoard';

const PublicTasks = () => {
  const { selectedCompany } = useCompanyContext();

  if (!selectedCompany) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Tarefas Públicas</h2>
          <p className="text-slate-600">Selecione uma empresa para ver as tarefas disponíveis</p>
        </div>
      </div>
    );
  }

  return <PublicTasksBoard companyId={selectedCompany.id} />;
};

export default PublicTasks;
