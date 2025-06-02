import { useState } from 'react';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment, Department } from '@/hooks/useDepartments';
import { useCompanyUsers } from '@/hooks/useCompanyUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Building, Users, Plus, Edit, Trash2, MoreVertical, UserCheck } from 'lucide-react';

export const DepartmentManagement = () => {
  const { selectedCompany } = useCompanyContext();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: '',
  });

  const { data: departments = [], isLoading: departmentsLoading } = useDepartments(selectedCompany?.id);
  const { data: users = [], isLoading: usersLoading } = useCompanyUsers(selectedCompany?.id);
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const handleCreateDepartment = async () => {
    if (!selectedCompany || !formData.name.trim()) return;

    try {
      await createDepartment.mutateAsync({
        name: formData.name,
        description: formData.description,
        companyId: selectedCompany.id,
        managerId: formData.managerId === 'no-manager' ? undefined : formData.managerId || undefined,
      });

      toast({
        title: 'Departamento criado!',
        description: `Departamento ${formData.name} criado com sucesso`,
      });

      setFormData({ name: '', description: '', managerId: '' });
      setShowCreateDialog(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao criar departamento',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateDepartment = async () => {
    if (!selectedCompany || !editingDepartment || !formData.name.trim()) return;

    try {
      await updateDepartment.mutateAsync({
        id: editingDepartment.id,
        name: formData.name,
        description: formData.description,
        companyId: selectedCompany.id,
        managerId: formData.managerId === 'no-manager' ? undefined : formData.managerId || undefined,
      });

      toast({
        title: 'Departamento atualizado!',
        description: `Departamento ${formData.name} atualizado com sucesso`,
      });

      setFormData({ name: '', description: '', managerId: '' });
      setEditingDepartment(null);
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar departamento',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDepartment = async (department: Department) => {
    if (!selectedCompany) return;

    try {
      await deleteDepartment.mutateAsync({
        id: department.id,
        companyId: selectedCompany.id,
      });

      toast({
        title: 'Departamento excluído!',
        description: `Departamento ${department.name} excluído com sucesso`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir departamento',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || '',
      managerId: department.manager_id || 'no-manager',
    });
  };

  const openMembersDialog = (department: Department) => {
    setSelectedDepartment(department);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', managerId: '' });
    setEditingDepartment(null);
    setShowCreateDialog(false);
  };

  if (!selectedCompany) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Selecione uma empresa para gerenciar departamentos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Departamentos</h1>
          <p className="text-slate-600">Gerencie departamentos da empresa {selectedCompany.name}</p>
        </div>

        <Dialog open={showCreateDialog || !!editingDepartment} onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Departamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? 'Editar Departamento' : 'Criar Novo Departamento'}
              </DialogTitle>
              <DialogDescription>
                {editingDepartment 
                  ? 'Edite as informações do departamento'
                  : 'Crie um novo departamento para a empresa'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Nome do departamento</label>
                <Input
                  placeholder="Ex: Vendas, Marketing, TI..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  placeholder="Descrição do departamento..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Gerente do departamento</label>
                <Select value={formData.managerId} onValueChange={(value) => setFormData({ ...formData, managerId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um gerente (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-manager">Nenhum gerente</SelectItem>
                    {usersLoading ? (
                      <SelectItem value="loading" disabled>Carregando usuários...</SelectItem>
                    ) : (
                      users.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name} ({user.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button 
                  onClick={editingDepartment ? handleUpdateDepartment : handleCreateDepartment}
                  disabled={!formData.name.trim() || createDepartment.isPending || updateDepartment.isPending}
                >
                  {createDepartment.isPending || updateDepartment.isPending ? 'Salvando...' : 
                   editingDepartment ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {departmentsLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-slate-600">Carregando departamentos...</p>
        </div>
      ) : departments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">Nenhum departamento encontrado</p>
            <p className="text-sm text-slate-500">Crie o primeiro departamento para começar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {departments.map((department) => (
            <Card key={department.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-slate-900">{department.name}</h3>
                      {department.manager && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          Gerente: {department.manager.full_name}
                        </Badge>
                      )}
                    </div>
                    {department.description && (
                      <p className="text-sm text-slate-600 mb-3">{department.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Users className="w-4 h-4" />
                      <span>Criado em {new Date(department.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openMembersDialog(department)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Membros
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(department)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteDepartment(department)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de Membros do Departamento */}
      {selectedDepartment && (
        <DepartmentMembersDialog
          isOpen={!!selectedDepartment}
          onClose={() => setSelectedDepartment(null)}
          departmentId={selectedDepartment.id}
          departmentName={selectedDepartment.name}
          companyId={selectedCompany.id}
        />
      )}
    </div>
  );
};
