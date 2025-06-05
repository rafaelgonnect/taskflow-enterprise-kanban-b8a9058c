
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { usePendingTransfers } from './useTaskTransfers';
import { usePublicDepartmentTasks, usePublicCompanyTasks } from './usePublicTasks';
import { useDepartmentMembers } from './useDepartmentMembers';
import { useCompanyContext } from '@/contexts/CompanyContext';

export interface Notification {
  id: string;
  type: 'task_transfer' | 'public_task' | 'task_update';
  title: string;
  message: string;
  count?: number;
  timestamp: Date;
  read: boolean;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const { selectedCompany } = useCompanyContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  // Hooks para dados
  const { data: pendingTransfers = [] } = usePendingTransfers();
  const { data: allDepartmentMembers = [] } = useDepartmentMembers('');
  
  // Departamentos do usuário
  const userDepartments = allDepartmentMembers
    .filter(member => member.user_id === user?.id && member.is_active)
    .map(member => member.department_id);

  const { data: publicDepartmentTasks = [] } = usePublicDepartmentTasks(userDepartments[0]);
  const { data: publicCompanyTasks = [] } = usePublicCompanyTasks(selectedCompany?.id);

  // Solicitar permissão para notificações
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === 'granted');
      return permission === 'granted';
    }
    return false;
  }, []);

  // Enviar notificação push
  const sendPushNotification = useCallback((title: string, message: string) => {
    if (hasPermission && 'Notification' in window) {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    }
  }, [hasPermission]);

  // Atualizar notificações
  useEffect(() => {
    const newNotifications: Notification[] = [];

    // Transferências pendentes
    if (pendingTransfers.length > 0) {
      newNotifications.push({
        id: 'pending_transfers',
        type: 'task_transfer',
        title: 'Transferências Pendentes',
        message: `Você tem ${pendingTransfers.length} transferência(s) de tarefa pendente(s)`,
        count: pendingTransfers.length,
        timestamp: new Date(),
        read: false,
      });
    }

    // Tarefas departamentais públicas
    if (publicDepartmentTasks.length > 0) {
      newNotifications.push({
        id: 'public_department_tasks',
        type: 'public_task',
        title: 'Tarefas Departamentais Disponíveis',
        message: `${publicDepartmentTasks.length} tarefa(s) departamental(is) disponível(is) para aceitar`,
        count: publicDepartmentTasks.length,
        timestamp: new Date(),
        read: false,
      });
    }

    // Tarefas empresariais públicas
    if (publicCompanyTasks.length > 0) {
      newNotifications.push({
        id: 'public_company_tasks',
        type: 'public_task',
        title: 'Tarefas Empresariais Disponíveis',
        message: `${publicCompanyTasks.length} tarefa(s) empresarial(is) disponível(is) para aceitar`,
        count: publicCompanyTasks.length,
        timestamp: new Date(),
        read: false,
      });
    }

    // Verificar se houve mudanças para enviar push notifications
    const oldCount = notifications.reduce((sum, n) => sum + (n.count || 0), 0);
    const newCount = newNotifications.reduce((sum, n) => sum + (n.count || 0), 0);

    if (newCount > oldCount && hasPermission) {
      const diff = newCount - oldCount;
      sendPushNotification(
        'TaskFlow - Novas Notificações',
        `Você tem ${diff} nova(s) notificação(ões)`
      );
    }

    setNotifications(newNotifications);
  }, [pendingTransfers, publicDepartmentTasks, publicCompanyTasks, notifications, hasPermission, sendPushNotification]);

  // Solicitar permissão na inicialização
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const totalCount = notifications.reduce((sum, notification) => sum + (notification.count || 0), 0);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  return {
    notifications,
    totalCount,
    hasPermission,
    requestNotificationPermission,
    markAsRead,
    markAllAsRead,
  };
};
