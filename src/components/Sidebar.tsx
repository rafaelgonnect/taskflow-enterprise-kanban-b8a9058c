
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
  Shield,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCompany } = useCompanyContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

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
      title: 'Configurações',
      icon: Settings,
      path: '/company-settings',
    },
  ];

  const adminItems = [
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
      title: 'Funções',
      icon: Shield,
      path: '/roles',
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

          <Separator />

          <Button
            variant={adminItems.some((i) => i.path === location.pathname) ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start gap-3',
              isCollapsed && 'justify-center px-2'
            )}
            onClick={() => setIsAdminOpen(!isAdminOpen)}
          >
            <Shield className="w-4 h-4" />
            {!isCollapsed && <span>Administração</span>}
            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  'ml-auto w-4 h-4 transition-transform',
                  isAdminOpen && 'rotate-180'
                )}
              />
            )}
          </Button>
          {!isCollapsed && isAdminOpen && (
            <div className="ml-6 space-y-1">
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3"
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </Button>
                );
              })}
            </div>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={adminItems.some((i) => i.path === location.pathname) ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isCollapsed && 'justify-center px-2'
                )}
              >
                <Shield className="w-4 h-4" />
                {!isCollapsed && (
                  <>
                    <span>Administração</span>
                    <ChevronDown className="ml-auto w-4 h-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.path}
                    onSelect={() => handleNavigation(item.path)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

        </nav>
      </ScrollArea>
    </div>
  );
};
