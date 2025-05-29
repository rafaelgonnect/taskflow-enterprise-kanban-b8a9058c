
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetInvitationByCode, useAcceptInvitationByCode } from '@/hooks/useInvitations';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { InviteInfo } from '@/components/invite/InviteInfo';
import { AuthForm } from '@/components/invite/AuthForm';
import { AcceptInviteCard } from '@/components/invite/AcceptInviteCard';
import { EmailMismatchCard } from '@/components/invite/EmailMismatchCard';
import { LoadingState } from '@/components/invite/LoadingState';
import { InvalidInviteCard } from '@/components/invite/InvalidInviteCard';

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

  const { data: invitation, isLoading } = useGetInvitationByCode(inviteCode);
  const acceptInvitation = useAcceptInvitationByCode();

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

  const handleAuth = async (email: string, password: string, fullName?: string, isLogin?: boolean) => {
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

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password, fullName || '');
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
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!invitation) {
    return <InvalidInviteCard onGoToSystem={() => navigate('/')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Informações do Convite */}
        <InviteInfo 
          companyName={invitation.companies?.name || ''}
          email={invitation.email}
          expiresAt={invitation.expires_at}
        />

        {/* Formulário de Autenticação */}
        {!user && (
          <AuthForm 
            email={invitation.email}
            onSubmit={handleAuth}
            isSubmitting={false}
          />
        )}

        {/* Aceitar Convite (usuário logado) */}
        {user && user.email === invitation.email && (
          <AcceptInviteCard 
            userEmail={user.email}
            onAccept={handleAcceptInvitation}
            isAccepting={acceptInvitation.isPending}
          />
        )}

        {/* Email não confere */}
        {user && user.email !== invitation.email && (
          <EmailMismatchCard 
            userEmail={user.email}
            inviteEmail={invitation.email}
            onLoginWithOtherAccount={() => navigate('/auth')}
          />
        )}
      </div>
    </div>
  );
};

export default InviteAccept;
