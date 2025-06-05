import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, Users, Settings, Trash2 } from 'lucide-react';
import { useDepartments, useCreateDepartment, useDeleteDepartment } from '@/hooks/useDepartments';
import { useDepartmentMembers } from '@/hooks/useDepartmentMembers';
import { useToast } from '@/hooks/use-toast';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useAuth } from '@/hooks/useAuth';
import { canCreateDepartments } from '@/utils/userPermissions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DepartmentMembersDialog } from './DepartmentMembersDialog';

export const DepartmentManagement = () => {
  const { selectedCompany } = useCompanyContext();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const canCreate = canCreateDepartments(profile);

  const { data: departments, isLoading, refetch } = useDepartments(selectedCompany?.id || '');
  const createDepartment = useCreateDepartment();
  const deleteDepartment = useDeleteDepartment();
  const { data: members, refetch: refetchMembers } = useDepartmentMembers(selectedDepartmentId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async () => {
    if (!selectedCompany) {
      toast({
        title: 'Erro',
        description: 'Selecione uma empresa antes de criar um departamento.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createDepartment.mutateAsync({
        companyId: selectedCompany.id,
        name: formData.name,
        description: formData.description,
      });

      toast({
        title: 'Departamento criado!',
        description: `Departamento "${formData.name}" criado com sucesso.`,
      });

      setFormData({ name: '', description: '' });
      setShowCreateDialog(false);
      await refetch();
    } catch (error: any) {
      toast({
        title: 'Erro ao criar departamento',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (departmentId: string, departmentName: string) => {
    try {
      await deleteDepartment.mutateAsync({
        companyId: selectedCompany?.id || '',
        departmentId: departmentId,
      });

      toast({
        title: 'Departamento excluído!',
        description: `Departamento "${departmentName}" excluído com sucesso.`,
      });

      await refetch();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir departamento',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleOpenMembersDialog = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setShowMembersDialog(true);
    refetchMembers();
  };

  const handleCloseMembersDialog = () => {
    setShowMembersDialog(false);
    setSelectedDepartmentId('');
  };

  if (!selectedCompany) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Nenhuma empresa selecionada
          </h3>
          <p className="text-slate-600 text-center">
            Selecione uma empresa para gerenciar os departamentos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Gerenciamento de Departamentos
          </h2>
          <p className="text-slate-600">
            Crie, edite e gerencie os departamentos da sua empresa
          </p>
        </div>

        {canCreate && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Departamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Criar Departamento</DialogTitle>
                <DialogDescription>
                  Crie um novo departamento para sua empresa.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Nome
                  </label>
                  <div className="col-span-3">
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nome do departamento"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="description" className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Descrição
                  </label>
                  <div className="col-span-3">
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Descrição do departamento"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleCreate} disabled={createDepartment.isLoading}>
                  {createDepartment.isLoading ? 'Criando...' : 'Criar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600">Carregando departamentos...</p>
          </CardContent>
        </Card>
      ) : departments?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nenhum departamento encontrado
            </h3>
            <p className="text-slate-600 text-center">
              Crie o primeiro departamento da sua empresa.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {departments?.map((department) => (
            <Card key={department.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {department.name}
                  <Badge variant="secondary">
                    <Users className="w-3 h-3 mr-1" />
                    {department.members_count || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 line-clamp-3">
                  {department.description || 'Sem descrição'}
                </p>
                <div className="flex items-center justify-end mt-4 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenMembersDialog(department.id)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Gerenciar Membros
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Tem certeza?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação é irreversível. Tem certeza de que deseja
                          excluir este departamento?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(department.id, department.name)}
                          disabled={deleteDepartment.isLoading}
                        >
                          {deleteDepartment.isLoading ? 'Excluindo...' : 'Excluir'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DepartmentMembersDialog
        isOpen={showMembersDialog}
        onClose={handleCloseMembersDialog}
        departmentId={selectedDepartmentId}
        companyId={selectedCompany.id}
        members={members}
        refetchMembers={refetchMembers}
      />
    </div>
  );
};
