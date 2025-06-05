
import { Profile } from '@/types/database';

export const canCreateDepartments = (profile: Profile | null): boolean => {
  return profile?.user_type === 'company_owner';
};

export const canManageUsers = (profile: Profile | null): boolean => {
  return profile?.user_type === 'company_owner';
};

export const canManageRoles = (profile: Profile | null): boolean => {
  return profile?.user_type === 'company_owner';
};

export const canManageCompany = (profile: Profile | null): boolean => {
  return profile?.user_type === 'company_owner';
};

export const getUserTypeDisplay = (userType: string) => {
  switch (userType) {
    case 'company_owner':
      return 'Proprietário';
    case 'employee':
    default:
      return 'Funcionário';
  }
};
