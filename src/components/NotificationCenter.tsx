
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  BellDot, 
  ArrowRight, 
  Users, 
  Building2, 
  CheckCircle2,
  Settings
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const NotificationCenter = () => {
  const { 
    notifications, 
    totalCount, 
    hasPermission, 
    requestNotificationPermission,
    markAsRead,
    markAllAsRead 
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_transfer':
        return <ArrowRight className="w-4 h-4 text-blue-600" />;
      case 'public_task':
        return <Users className="w-4 h-4 text-green-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'task_transfer':
        return 'border-l-blue-500';
      case 'public_task':
        return 'border-l-green-500';
      default:
        return 'border-l-slate-500';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {totalCount > 0 ? <BellDot className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
          {totalCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalCount > 99 ? '99+' : totalCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notificações</CardTitle>
              {totalCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Marcar todas como lidas
                </Button>
              )}
            </div>
            
            {!hasPermission && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Ativar Notificações Push
                  </span>
                </div>
                <p className="text-xs text-yellow-700 mb-2">
                  Receba notificações mesmo quando não estiver na aba
                </p>
                <Button 
                  size="sm" 
                  onClick={requestNotificationPermission}
                  className="text-xs"
                >
                  Ativar
                </Button>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm text-slate-600 mb-1">Nenhuma notificação</p>
                <p className="text-xs text-slate-500">
                  Você está em dia com suas tarefas!
                </p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-l-4 ${getNotificationColor(notification.type)} p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-slate-900 truncate">
                            {notification.title}
                          </h4>
                          {notification.count && notification.count > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              {notification.count}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDistanceToNow(notification.timestamp, { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
