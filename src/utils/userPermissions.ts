
import { Profile } from '@/types/database';

export const canCreateDepartments = (profile: Profile | null): boolean => {
  return profile?.user_type === 'admin' || profile?.user_type === 'manager';
};

export const canManageUsers = (profile: Profile | null): boolean => {
  return profile?.user_type === 'admin';
};

export const canManageRoles = (profile: Profile | null): boolean => {
  return profile?.user_type === 'admin';
};

export const canManageCompany = (profile: Profile | null): boolean => {
  return profile?.user_type === 'admin';
};

export const getUserTypeDisplay = (userType: string) => {
  switch (userType) {
    case 'admin':
      return 'Administrador';
    case 'manager':
      return 'Gerente';
    case 'employee':
    default:
      return 'Funcionário';
  }
};
