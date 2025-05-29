
import { UserManagement as UserManagementComponent } from '@/components/UserManagement';

const UserManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto py-8 px-4">
        <UserManagementComponent />
      </div>
    </div>
  );
};

export default UserManagement;
