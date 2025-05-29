
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetInvitationByCode, useAcceptInvitationByCode } from '@/hooks/useInvitations';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { InviteInfo } from '@/components/invite/InviteInfo';
import { InviteSignupForm } from '@/components/invite/InviteSignupForm';
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
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  const [isSigningUp, setIsSigningUp] = useState(false);

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

  const handleInviteSignup = async (email: string, password: string, fullName: string) => {
    if (!invitation) return;

    setIsSigningUp(true);
    try {
      const { error } = await signUp(email, password, fullName);
      if (error) throw error;
      
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Verificando seu email e processando o convite...',
      });

      // Após o cadastro bem-sucedido, o useEffect detectará o usuário logado
      // e tentará aceitar o convite automaticamente
    } catch (error: any) {
      toast({
        title: 'Erro ao criar conta',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSigningUp(false);
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

        {/* Fluxo para usuário não logado - Cadastro específico para convite */}
        {!user && (
          <InviteSignupForm 
            email={invitation.email}
            companyName={invitation.companies?.name || ''}
            onSubmit={handleInviteSignup}
            isSubmitting={isSigningUp}
          />
        )}

        {/* Aceitar Convite (usuário logado com email correto) */}
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
