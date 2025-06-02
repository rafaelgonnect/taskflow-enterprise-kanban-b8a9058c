
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDepartmentMembers, useAddDepartmentMember, useRemoveDepartmentMember } from '@/hooks/useDepartmentMembers';
import { useCompanyUsers } from '@/hooks/useCompanyUsers';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, MoreVertical, Trash2, UserMinus } from 'lucide-react';

interface DepartmentMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
  departmentName: string;
  companyId: string;
}

export const DepartmentMembersDialog = ({ 
  isOpen, 
  onClose, 
  departmentId, 
  departmentName, 
  companyId 
}: DepartmentMembersDialogProps) => {
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState('');

  const { data: members = [], isLoading: membersLoading } = useDepartmentMembers(departmentId);
  const { data: companyUsers = [], isLoading: usersLoading } = useCompanyUsers(companyId);
  const addMember = useAddDepartmentMember();
  const removeMember = useRemoveDepartmentMember();

  // Filtrar usuários que não são membros do departamento
  const availableUsers = companyUsers.filter(user => 
    !members.some(member => member.user_id === user.id)
  );

  const handleAddMember = async () => {
    if (!selectedUserId) return;

    try {
      await addMember.mutateAsync({
        departmentId,
        userId: selectedUserId,
      });

      const userName = companyUsers.find(u => u.id === selectedUserId)?.full_name;
      toast({
        title: 'Membro adicionado!',
        description: `${userName} foi adicionado ao departamento`,
      });

      setSelectedUserId('');
    } catch (error: any) {
      toast({
        title: 'Erro ao adicionar membro',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMember = async (memberId: string, userName: string) => {
    try {
      await removeMember.mutateAsync({
        memberId,
        departmentId,
      });

      toast({
        title: 'Membro removido!',
        description: `${userName} foi removido do departamento`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover membro',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Membros do Departamento: {departmentName}
          </DialogTitle>
          <DialogDescription>
            Gerencie os colaboradores que fazem parte deste departamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Adicionar Novo Membro */}
          <div className="flex gap-2">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um colaborador para adicionar" />
              </SelectTrigger>
              <SelectContent>
                {usersLoading ? (
                  <SelectItem value="loading" disabled>Carregando usuários...</SelectItem>
                ) : availableUsers.length === 0 ? (
                  <SelectItem value="empty" disabled>Todos os usuários já são membros</SelectItem>
                ) : (
                  availableUsers.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name} ({user.email})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleAddMember}
              disabled={!selectedUserId || addMember.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {/* Lista de Membros */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                Membros Atuais ({members.length})
              </h4>
            </div>

            {membersLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-slate-600">Carregando membros...</p>
              </div>
            ) : members.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <UserMinus className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">Nenhum membro encontrado</p>
                  <p className="text-sm text-slate-500">Adicione colaboradores a este departamento</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-slate-900">{member.user_name}</h5>
                            <Badge variant="outline" className="text-xs">
                              Membro
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">{member.user_email}</p>
                          <p className="text-xs text-slate-500">
                            Adicionado em {new Date(member.added_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleRemoveMember(member.id, member.user_name)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
