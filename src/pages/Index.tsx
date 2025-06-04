
import { Layout } from '@/components/Layout';
import { DashboardStats } from '@/components/DashboardStats';
import { TasksPublicWidgets } from '@/components/tasks/TasksPublicWidgets';
import { SimplePendingTransfers } from '@/components/tasks/SimplePendingTransfers';

export default function Index() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">
            Visão geral do seu workspace e atividades recentes
          </p>
        </div>
        
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimplePendingTransfers />
          <TasksPublicWidgets />
        </div>
      </div>
    </Layout>
  );
}
