
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetInvitationByCode, useAcceptInvitationByCode } from '@/hooks/useInvitations';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Building2, Mail, Calendar, Check, X, Loader2 } from 'lucide-react';

// Interface para o resultado da função RPC
interface AcceptInvitationResult {
  success: boolean;
  error?: string;
  company_id?: string;
  company_name?: string;
}

const InviteAccept = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const { user, signUp, signIn } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: invitation, isLoading } = useGetInvitationByCode(inviteCode);
  const acceptInvitation = useAcceptInvitationByCode();

  // Preencher email automaticamente quando o convite for carregado
  useEffect(() => {
    if (invitation?.email) {
      setEmail(invitation.email);
    }
  }, [invitation]);

  // Se o usuário já está logado e o email confere, aceitar automaticamente
  useEffect(() => {
    if (user && invitation && user.email === invitation.email) {
      handleAcceptInvitation();
    }
  }, [user, invitation]);

  const handleAcceptInvitation = async () => {
    if (!inviteCode) return;

    try {
      const result = await acceptInvitation.mutateAsync(inviteCode);
      
      // Type assertion para acessar as propriedades
      const acceptResult = result as AcceptInvitationResult;
      
      toast({
        title: 'Convite aceito!',
        description: `Você agora faz parte da empresa ${acceptResult.company_name}`,
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Erro ao aceitar convite',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation) return;

    // Verificar se o email informado confere com o do convite
    if (email !== invitation.email) {
      toast({
        title: 'Email inválido',
        description: 'O email deve ser o mesmo do convite recebido.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        
        toast({
          title: 'Conta criada!',
          description: 'Verifique seu email para confirmar a conta e depois aceite o convite.',
        });
      }
    } catch (error: any) {
      toast({
        title: isLogin ? 'Erro no login' : 'Erro no cadastro',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Verificando convite...</span>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Convite Inválido</h2>
            <p className="text-slate-600 mb-4">
              Este convite não existe, já foi utilizado ou expirou.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Ir para o Sistema
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Informações do Convite */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Convite para se juntar à empresa</CardTitle>
            <CardDescription>
              Você foi convidado para fazer parte da {invitation.companies?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="text-sm">{invitation.email}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-sm">
                Expira em {new Date(invitation.expires_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Autenticação */}
        {!user && (
          <Card>
            <CardHeader>
              <CardTitle>{isLogin ? 'Fazer Login' : 'Criar Conta'}</CardTitle>
              <CardDescription>
                {isLogin 
                  ? 'Entre com sua conta para aceitar o convite' 
                  : 'Crie uma conta para aceitar o convite'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                    title="Este email não pode ser alterado pois é o email do convite"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email do convite (não pode ser alterado)
                  </p>
                </div>
                
                {!isLogin && (
                  <div>
                    <label className="text-sm font-medium">Nome Completo</label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium">Senha</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isLogin ? 'Entrando...' : 'Criando conta...'}
                    </>
                  ) : (
                    isLogin ? 'Entrar' : 'Criar Conta'
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {isLogin 
                      ? 'Não tem conta? Criar uma nova' 
                      : 'Já tem conta? Fazer login'
                    }
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Aceitar Convite (usuário logado) */}
        {user && user.email === invitation.email && (
          <Card>
            <CardContent className="p-6 text-center">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pronto para aceitar!</h3>
              <p className="text-slate-600 mb-4">
                Você está logado como {user.email}. Clique para aceitar o convite.
              </p>
              <Button 
                onClick={handleAcceptInvitation} 
                className="w-full"
                disabled={acceptInvitation.isPending}
              >
                {acceptInvitation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Aceitando convite...
                  </>
                ) : (
                  'Aceitar Convite'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Email não confere */}
        {user && user.email !== invitation.email && (
          <Card>
            <CardContent className="p-6 text-center">
              <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email não confere</h3>
              <p className="text-slate-600 mb-4">
                Você está logado como {user.email}, mas o convite é para {invitation.email}.
              </p>
              <Button onClick={() => navigate('/auth')} className="w-full">
                Fazer login com outra conta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InviteAccept;
