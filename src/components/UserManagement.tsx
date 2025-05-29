
import { useState } from 'react';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useInvitations, useCreateInvitation, Invitation } from '@/hooks/useInvitations';
import { useCompanyUsers, useUpdateUserRole, useToggleUserStatus } from '@/hooks/useCompanyUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Mail, Users, UserPlus, Shield, Clock, Check, X, Copy, MessageCircle } from 'lucide-react';

export const UserManagement = () => {
  const { selectedCompany } = useCompanyContext();
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const { data: invitations = [], isLoading: invitationsLoading } = useInvitations(selectedCompany?.id);
  const { data: users = [], isLoading: usersLoading } = useCompanyUsers(selectedCompany?.id);
  const createInvitation = useCreateInvitation();
  const updateUserRole = useUpdateUserRole();
  const toggleUserStatus = useToggleUserStatus();

  const handleInviteUser = async () => {
    if (!selectedCompany || !inviteEmail.trim()) return;

    try {
      const invitation = await createInvitation.mutateAsync({
        email: inviteEmail,
        companyId: selectedCompany.id,
      });

      toast({
        title: 'Convite criado!',
        description: `Convite criado para ${inviteEmail}. Código: ${invitation.invite_code}`,
      });

      setInviteEmail('');
      setShowInviteDialog(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao criar convite',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (!selectedCompany) return;

    try {
      await toggleUserStatus.mutateAsync({
        userId,
        companyId: selectedCompany.id,
        isActive: !currentStatus,
      });

      toast({
        title: 'Status atualizado',
        description: `Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado!',
      description: `${type} copiado para a área de transferência`,
    });
  };

  const openWhatsApp = (whatsappLink: string) => {
    window.open(whatsappLink, '_blank');
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
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Usuários</h1>
          <p className="text-slate-600">Gerencie usuários e convites da empresa {selectedCompany.name}</p>
        </div>

        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Convidar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Novo Usuário</DialogTitle>
              <DialogDescription>
                Crie um convite para um novo usuário se juntar à empresa.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Email do usuário</label>
                <Input
                  type="email"
                  placeholder="usuario@exemplo.com"
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
                  {createInvitation.isPending ? 'Criando...' : 'Criar Convite'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários Ativos
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Convites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {usersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-slate-600">Carregando usuários...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {users.map((user: any) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-slate-900">{user.full_name}</h3>
                        <p className="text-sm text-slate-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {user.user_roles.map((ur: any, index: number) => (
                            <Badge key={index} variant="secondary">
                              <Shield className="w-3 h-3 mr-1" />
                              {ur.roles.name}
                            </Badge>
                          ))}
                          <Badge variant={user.user_companies[0]?.is_active ? 'default' : 'destructive'}>
                            {user.user_companies[0]?.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id, user.user_companies[0]?.is_active)}
                        >
                          {user.user_companies[0]?.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          {invitationsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-slate-600">Carregando convites...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {invitations.map((invitation: Invitation) => (
                <Card key={invitation.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-slate-900">{invitation.email}</h3>
                          <p className="text-sm text-slate-600">
                            Convidado por {invitation.invited_by_profile?.full_name}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant={
                                invitation.status === 'pending' ? 'default' :
                                invitation.status === 'accepted' ? 'secondary' : 'destructive'
                              }
                            >
                              {invitation.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                              {invitation.status === 'accepted' && <Check className="w-3 h-3 mr-1" />}
                              {invitation.status === 'expired' && <X className="w-3 h-3 mr-1" />}
                              {invitation.status === 'pending' ? 'Pendente' :
                               invitation.status === 'accepted' ? 'Aceito' : 'Expirado'}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              Expira em {new Date(invitation.expires_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {invitation.status === 'pending' && (
                        <div className="border-t pt-4 space-y-3">
                          <div>
                            <label className="text-sm font-medium text-slate-700">Código do Convite:</label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">
                                {invitation.invite_code}
                              </code>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => copyToClipboard(invitation.invite_code, 'Código do convite')}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-slate-700">Link de Convite:</label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input
                                readOnly
                                value={`${window.location.origin}/invite/${invitation.invite_code}`}
                                className="text-xs"
                              />
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => copyToClipboard(
                                  `${window.location.origin}/invite/${invitation.invite_code}`, 
                                  'Link do convite'
                                )}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {invitation.whatsapp_link && (
                            <div>
                              <label className="text-sm font-medium text-slate-700">Compartilhar no WhatsApp:</label>
                              <div className="flex items-center gap-2 mt-1">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-green-600"
                                  onClick={() => openWhatsApp(invitation.whatsapp_link!)}
                                >
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  Abrir WhatsApp
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => copyToClipboard(invitation.whatsapp_link!, 'Link do WhatsApp')}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {invitations.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-slate-600">Nenhum convite encontrado</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
