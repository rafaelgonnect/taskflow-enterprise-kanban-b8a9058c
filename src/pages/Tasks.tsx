
import { Layout } from '@/components/Layout';
import { TaskTabs } from '@/components/tasks/TaskTabs';

export default function Tasks() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tarefas</h1>
          <p className="text-slate-600">
            Gerencie suas tarefas pessoais, departamentais e da empresa
          </p>
        </div>
        
        <TaskTabs />
      </div>
    </Layout>
  );
}
