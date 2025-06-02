
import { ReactNode } from 'react';
import { useHasPermission, useHasAnyPermission, useHasAllPermissions } from '@/hooks/usePermissions';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { Permission } from '@/types/database';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: Permission;
  anyPermissions?: Permission[];
  allPermissions?: Permission[];
  fallback?: ReactNode;
  showFallback?: boolean;
}

export const PermissionGuard = ({ 
  children, 
  permission,
  anyPermissions,
  allPermissions,
  fallback,
  showFallback = true
}: PermissionGuardProps) => {
  const { selectedCompany } = useCompanyContext();
  
  const hasSinglePermission = useHasPermission(permission!, selectedCompany?.id);
  const hasAnyPermissions = useHasAnyPermission(anyPermissions || [], selectedCompany?.id);
  const hasAllPermissions = useHasAllPermissions(allPermissions || [], selectedCompany?.id);
  
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasSinglePermission;
  } else if (anyPermissions && anyPermissions.length > 0) {
    hasAccess = hasAnyPermissions;
  } else if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAllPermissions;
  }
  
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showFallback) {
      return (
        <Alert className="border-orange-200 bg-orange-50">
          <Lock className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Você não tem permissão para acessar esta funcionalidade.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  }
  
  return <>{children}</>;
};
