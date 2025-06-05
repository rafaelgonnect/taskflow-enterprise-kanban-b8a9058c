
import { Layout } from '@/components/Layout';
import { DashboardStats } from '@/components/DashboardStats';
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
        
        <SimplePendingTransfers />
      </div>
    </Layout>
  );
}
