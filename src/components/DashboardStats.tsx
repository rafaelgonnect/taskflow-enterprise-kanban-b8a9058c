
import { CheckCircle, Clock, AlertCircle, Users } from "lucide-react";

export const DashboardStats = () => {
  const stats = [
    { title: "Tarefas Concluídas", value: "24", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { title: "Em Progresso", value: "12", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Pendentes", value: "8", icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Total de Usuários", value: "15", icon: Users, color: "text-purple-600", bg: "bg-purple-50" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h2>
        <p className="text-slate-600">Visão geral das suas tarefas e equipe</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {[
              { user: "Maria Santos", action: "concluiu", task: "Revisar proposta comercial", time: "2h atrás" },
              { user: "Pedro Lima", action: "criou", task: "Desenvolver novo módulo", time: "4h atrás" },
              { user: "Ana Costa", action: "comentou em", task: "Campanha de marketing", time: "6h atrás" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">
                    <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">"{activity.task}"</span>
                  </p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Progresso por Departamento</h3>
          <div className="space-y-4">
            {[
              { dept: "Desenvolvimento", completed: 85, total: 100 },
              { dept: "Marketing", completed: 60, total: 80 },
              { dept: "Vendas", completed: 90, total: 100 }
            ].map((dept, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{dept.dept}</span>
                  <span className="text-slate-500">{dept.completed}% concluído</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dept.completed}%` }}
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
