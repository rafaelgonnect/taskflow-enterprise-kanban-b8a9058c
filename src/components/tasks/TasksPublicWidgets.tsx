
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { PublicDepartmentTasksWidget } from '../PublicDepartmentTasksWidget';
import { PublicTasksDashboard } from '../PublicTasksDashboard';
import { useCompanyContext } from '@/contexts/CompanyContext';

export const TasksPublicWidgets = () => {
  const { selectedCompany } = useCompanyContext();
  const [isVisible, setIsVisible] = useState(true);

  if (!selectedCompany) {
    return null;
  }

  if (!isVisible) {
    return (
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => setIsVisible(true)}
          className="w-full"
        >
          <Eye className="w-4 h-4 mr-2" />
          Mostrar Tarefas Públicas Disponíveis
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Tarefas Públicas Disponíveis
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
          >
            <EyeOff className="w-4 h-4 mr-2" />
            Esconder
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PublicDepartmentTasksWidget companyId={selectedCompany.id} />
          <PublicTasksDashboard companyId={selectedCompany.id} />
        </div>
      </CardContent>
    </Card>
  );
};
