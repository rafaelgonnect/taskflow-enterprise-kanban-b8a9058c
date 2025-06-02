
import { CheckCircle, Clock, AlertCircle, Users } from "lucide-react";
import { usePersonalTasks } from '@/hooks/useTasks';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { PublicTasksDashboard } from './PublicTasksDashboard';

export const DashboardStats = () => {
  const { selectedCompany } = useCompanyContext();
  const { data: tasks = [] } = usePersonalTasks(selectedCompany?.id);

  // Calcular estatísticas reais
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  const totalTime = tasks.reduce((acc, task) => acc + (task.total_time_minutes || 0), 0);
  const totalHours = Math.floor(totalTime / 60);

  const stats = [
    { 
      title: "Tarefas Concluídas", 
      value: completedTasks.toString(), 
      icon: CheckCircle, 
      color: "text-green-600", 
      bg: "bg-green-50" 
    },
    { 
      title: "Em Progresso", 
      value: inProgressTasks.toString(), 
      icon: Clock, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      title: "Pendentes", 
      value: todoTasks.toString(), 
      icon: AlertCircle, 
      color: "text-orange-600", 
      bg: "bg-orange-50" 
    },
    { 
      title: "Horas Trabalhadas", 
      value: `${totalHours}h`, 
      icon: Users, 
      color: "text-purple-600", 
      bg: "bg-purple-50" 
    }
  ];

  // Atividades recentes baseadas nas tarefas
  const recentActivities = tasks
    .filter(task => task.status === 'done')
    .slice(0, 3)
    .map(task => ({
      user: "Você",
      action: "concluiu",
      task: task.title,
      time: new Date(task.updated_at).toLocaleDateString('pt-BR')
    }));

  // Progresso por status
  const totalTasks = tasks.length;
  const progressData = [
    { 
      dept: "Concluídas", 
      completed: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0, 
      total: 100 
    },
    { 
      dept: "Em Progresso", 
      completed: totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0, 
      total: 100 
    },
    { 
      dept: "Pendentes", 
      completed: totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0, 
      total: 100 
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h2>
        <p className="text-slate-600">Visão geral das suas tarefas e produtividade</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Seção de Tarefas Públicas Disponíveis */}
      {selectedCompany && (
        <PublicTasksDashboard companyId={selectedCompany.id} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">V</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">
                    <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">"{activity.task}"</span>
                  </p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-4 text-slate-500">
                <p className="text-sm">Nenhuma atividade recente</p>
                <p className="text-xs">Complete algumas tarefas para ver o histórico aqui</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Distribuição de Tarefas</h3>
          <div className="space-y-4">
            {progressData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{item.dept}</span>
                  <span className="text-slate-500">{item.completed}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.completed}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
