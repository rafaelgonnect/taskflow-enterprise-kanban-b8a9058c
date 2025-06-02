
import { DepartmentManagement as DepartmentManagementComponent } from '@/components/DepartmentManagement';

const DepartmentManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto py-8 px-4">
        <DepartmentManagementComponent />
      </div>
    </div>
  );
};

export default DepartmentManagement;
