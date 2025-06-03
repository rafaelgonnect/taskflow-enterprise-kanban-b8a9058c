
import { useState } from 'react';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useCompanyUsers, useToggleUserStatus } from '@/hooks/useCompanyUsers';
import { useCreateInvitation, useInvitations } from '@/hooks/useInvitations';
import { AuditLogsDialog } from '@/components/AuditLogsDialog';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Mail, CheckCircle, Clock, X, UserCog, Shield, FileText, MoreVertical, UserX, UserCheck, Filter, Search, Download, Settings, Eye, Copy, Share } from 'lucide-react';
import { UserPermissionsDialog } from '@/components/UserPermissionsDialog';

export const UserManagement = () => {
  const { selectedCompany } = useCompanyContext();
  const { toast } = useToast();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const { data: users = [], isLoading: usersLoading } = useCompanyUsers(selectedCompany?.id);
  const { data: invitations = [], isLoading: invitationsLoading } = useInvitations(selectedCompany?.id);
  const createInvitation = useCreateInvitation();
  const toggleUserStatus = useToggleUserStatus();

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active);
    return matchesSearch && matchesStatus;
  });

  const activeUsersCount = users.filter(u => u.is_active).length;
  const inactiveUsersCount = users.filter(u => !u.is_active).length;
  const pendingInvitesCount = invitations.filter(i => i.status === 'pending').length;

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

  const handleCopyInviteLink = async (invitation: any) => {
    const inviteUrl = `${window.location.origin}/invite/${invitation.invite_code}`;
    const inviteText = `🎉 Você foi convidado para fazer parte da equipe da ${selectedCompany?.name}!\n\n✨ Junte-se a nós e comece a colaborar em nossos projetos.\n\n🔗 Acesse o link abaixo para aceitar o convite:\n${inviteUrl}\n\n💼 Vamos trabalhar juntos!`;
    
    try {
      await navigator.clipboard.writeText(inviteText);
      toast({
        title: 'Link copiado!',
        description: 'O link do convite foi copiado para a área de transferência',
      });
    } catch (error) {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o link',
        variant: 'destructive',
      });
    }
  };

  const handleShareWhatsApp = (invitation: any) => {
    const inviteUrl = `${window.location.origin}/invite/${invitation.invite_code}`;
    const inviteText = `🎉 Olá! Você foi convidado para fazer parte da equipe da *${selectedCompany?.name}*!

✨ Estamos muito animados em tê-lo conosco e esperamos que possa contribuir com seus talentos em nossos projetos.

🔗 Para aceitar o convite e começar a trabalhar conosco, acesse o link abaixo:
${inviteUrl}

💼 Vamos construir algo incrível juntos!

Atenciosamente,
Equipe ${selectedCompany?.name}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(inviteText)}`;
    window.open(whatsappUrl, '_blank');
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
      {/* Header com estatísticas */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciar Usuários</h1>
          <p className="text-slate-600">Gerencie os usuários e convites da empresa</p>
        </div>

        <div className="flex gap-2">
          <PermissionGuard permission="view_audit_logs">
            <Button variant="outline" onClick={() => setShowAuditLogs(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Logs de Auditoria
            </Button>
          </PermissionGuard>
          
          <PermissionGuard permission="invite_users">
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
          </PermissionGuard>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeUsersCount}</p>
                <p className="text-sm text-slate-600">Usuários Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inactiveUsersCount}</p>
                <p className="text-sm text-slate-600">Usuários Inativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingInvitesCount}</p>
                <p className="text-sm text-slate-600">Convites Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-slate-600">Total de Usuários</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('active')}
              >
                Ativos
              </Button>
              <Button
                variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('inactive')}
              >
                Inativos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Usuários ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-slate-600">Carregando usuários...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center py-4 text-slate-500">
                {searchTerm ? 'Nenhum usuário encontrado para a busca' : 'Nenhum usuário encontrado'}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
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
                          <PermissionGuard permission="view_user_activity">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Perfil
                            </DropdownMenuItem>
                          </PermissionGuard>
                          
                          <PermissionGuard permission="manage_user_roles">
                            <DropdownMenuItem onClick={() => handleManagePermissions(user)}>
                              <UserCog className="w-4 h-4 mr-2" />
                              Gerenciar Permissões
                            </DropdownMenuItem>
                          </PermissionGuard>
                          
                          <DropdownMenuSeparator />
                          
                          <PermissionGuard permission="deactivate_users">
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
                          </PermissionGuard>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Convites */}
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
                  <div key={invitation.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
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
                    
                    {/* Botões de compartilhamento para convites pendentes */}
                    {invitation.status === 'pending' && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyInviteLink(invitation)}
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar Link
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareWhatsApp(invitation)}
                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                        >
                          <Share className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Button>
                      </div>
                    )}
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
