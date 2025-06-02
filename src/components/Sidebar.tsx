
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Building2, 
  Users, 
  Settings,
  Building,
  CheckSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCompany } = useCompanyContext();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/',
    },
    {
      title: 'Tarefas',
      icon: CheckSquare,
      path: '/tasks',
    },
    {
      title: 'Usuários',
      icon: Users,
      path: '/users',
    },
    {
      title: 'Departamentos',
      icon: Building,
      path: '/departments',
    },
    {
      title: 'Configurações',
      icon: Settings,
      path: '/company-settings',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn(
      "flex flex-col h-screen border-r bg-background transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-lg">TaskFlow</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {selectedCompany && !isCollapsed && (
        <div className="p-4 border-b">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Empresa Ativa</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {selectedCompany.name}
              </Badge>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="w-4 h-4" />
                {!isCollapsed && <span>{item.title}</span>}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
};
