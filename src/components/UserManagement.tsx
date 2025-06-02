
import { useState } from 'react';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useCompanyUsers, useToggleUserStatus } from '@/hooks/useCompanyUsers';
import { useCreateInvitation, useInvitations } from '@/hooks/useInvitations';
import { AuditLogsDialog } from '@/components/AuditLogsDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Mail, CheckCircle, Clock, X, UserCog, Shield, FileText, MoreVertical, UserX, UserCheck } from 'lucide-react';
import { UserPermissionsDialog } from '@/components/UserPermissionsDialog';

export const UserManagement = () => {
  const { selectedCompany } = useCompanyContext();
  const { toast } = useToast();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);

  const { data: users = [], isLoading: usersLoading } = useCompanyUsers(selectedCompany?.id);
  const { data: invitations = [], isLoading: invitationsLoading } = useInvitations(selectedCompany?.id);
  const createInvitation = useCreateInvitation();
  const toggleUserStatus = useToggleUserStatus();

  const handleInviteUser = async () => {
    if (!selectedCompany || !inviteEmail.trim()) return;

    try {
      await createInvitation.mutateAsync({
        email: inviteEmail.trim(),
        companyId: selectedCompany.id,
      });

      toast({
        title: 'Convite enviado!',
        description: `Convite enviado para ${inviteEmail}`,
      });

      setInviteEmail('');
      setShowInviteDialog(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar convite',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleManagePermissions = (user: any) => {
    setSelectedUser(user);
    setShowPermissionsDialog(true);
  };

  const handleToggleUserStatus = async (user: any) => {
    if (!selectedCompany) return;

    try {
      await toggleUserStatus.mutateAsync({
        userId: user.id,
        companyId: selectedCompany.id,
        isActive: !user.is_active,
      });

      toast({
        title: 'Status atualizado!',
        description: `Usuário ${user.is_active ? 'desativado' : 'ativado'} com sucesso`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao alterar status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Aceito</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="w-3 h-3 mr-1" />Expirado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!selectedCompany) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Selecione uma empresa para gerenciar usuários</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciar Usuários</h1>
          <p className="text-slate-600">Gerencie os usuários e convites da empresa</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAuditLogs(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Logs de Auditoria
          </Button>
          
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Convidar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convidar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Envie um convite por email para um novo usuário se juntar à empresa
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Email do usuário</label>
                  <Input
                    type="email"
                    placeholder="usuario@empresa.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleInviteUser}
                    disabled={!inviteEmail.trim() || createInvitation.isPending}
                  >
                    {createInvitation.isPending ? 'Enviando...' : 'Enviar Convite'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuários Ativos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Usuários Ativos ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-slate-600">Carregando usuários...</p>
              </div>
            ) : users.length === 0 ? (
              <p className="text-center py-4 text-slate-500">Nenhum usuário encontrado</p>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.full_name || 'Nome não informado'}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                        {user.user_roles && user.user_roles[0] && (
                          <div className="flex items-center gap-1 mt-1">
                            <Shield className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-600">{user.user_roles[0].roles.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleManagePermissions(user)}>
                            <UserCog className="w-4 h-4 mr-2" />
                            Gerenciar Permissões
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleToggleUserStatus(user)}
                            className={user.is_active ? 'text-red-600' : 'text-green-600'}
                          >
                            {user.is_active ? (
                              <>
                                <UserX className="w-4 h-4 mr-2" />
                                Desativar Usuário
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Ativar Usuário
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Convites Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Convites ({invitations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invitationsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-slate-600">Carregando convites...</p>
              </div>
            ) : invitations.length === 0 ? (
              <p className="text-center py-4 text-slate-500">Nenhum convite encontrado</p>
            ) : (
              <div className="space-y-3">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{invitation.email}</p>
                      <p className="text-sm text-slate-500">
                        Convidado por {invitation.invited_by_profile?.full_name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(invitation.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(invitation.status)}
                      {invitation.status === 'pending' && (
                        <p className="text-xs text-slate-400 mt-1">
                          Expira em {new Date(invitation.expires_at).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Permissões */}
      {selectedUser && (
        <UserPermissionsDialog
          isOpen={showPermissionsDialog}
          onClose={() => {
            setShowPermissionsDialog(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          companyId={selectedCompany.id}
        />
      )}

      {/* Dialog de Logs de Auditoria */}
      <AuditLogsDialog
        isOpen={showAuditLogs}
        onClose={() => setShowAuditLogs(false)}
        companyId={selectedCompany.id}
      />
    </div>
  );
};
