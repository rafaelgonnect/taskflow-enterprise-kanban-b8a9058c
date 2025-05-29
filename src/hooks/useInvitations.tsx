
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Invitation {
  id: string;
  email: string;
  company_id: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
  invite_code: string;
  whatsapp_link: string | null;
  accepted_at: string | null;
  companies?: {
    name: string;
    description?: string;
  };
  invited_by_profile?: {
    full_name: string;
  };
}

// Interface para o resultado da função RPC de busca pública
interface PublicInvitationResult {
  id: string;
  email: string;
  company_id: string;
  invited_by: string;
  status: string;
  created_at: string;
  expires_at: string;
  invite_code: string;
  whatsapp_link: string | null;
  accepted_at: string | null;
  companies: {
    name: string;
    description?: string;
  };
}

// Interface para o resultado da função RPC
interface AcceptInvitationResult {
  success: boolean;
  error?: string;
  company_id?: string;
  company_name?: string;
}

export function useInvitations(companyId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['invitations', companyId],
    queryFn: async () => {
      if (!user || !companyId) return [];
      
      const { data, error } = await supabase
        .from('invitations')
        .select(`
          *,
          companies!inner(name, description),
          invited_by_profile:profiles!invitations_invited_by_fkey(full_name)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!companyId,
  });
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ email, companyId }: { email: string; companyId: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('invitations')
        .insert({
          email: email.toLowerCase().trim(),
          company_id: companyId,
          invited_by: user.id,
          status: 'pending',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', variables.companyId] });
    },
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (invitationId: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      // Buscar o convite
      const { data: invitation, error: inviteError } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', invitationId)
        .eq('status', 'pending')
        .single();
      
      if (inviteError || !invitation) {
        throw new Error('Convite não encontrado ou já utilizado');
      }
      
      // Verificar se não expirou
      if (new Date(invitation.expires_at) < new Date()) {
        throw new Error('Convite expirado');
      }
      
      // Criar relacionamento usuário-empresa
      const { error: userCompanyError } = await supabase
        .from('user_companies')
        .insert({
          user_id: user.id,
          company_id: invitation.company_id,
          is_active: true
        });
      
      if (userCompanyError) throw userCompanyError;
      
      // Atualizar status do convite
      const { error: updateError } = await supabase
        .from('invitations')
        .update({ status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('id', invitationId);
      
      if (updateError) throw updateError;
      
      return invitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
}

export function useAcceptInvitationByCode() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (inviteCode: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase.rpc('accept_invitation_by_code', {
        invite_code: inviteCode,
        user_email: user.email
      });
      
      if (error) throw error;
      
      // Conversão segura do tipo Json para AcceptInvitationResult
      const result = data as unknown as AcceptInvitationResult;
      
      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
}

// Hook modificado para funcionar sem autenticação usando busca pública
export function useGetInvitationByCode(inviteCode?: string) {
  return useQuery({
    queryKey: ['invitation-by-code', inviteCode],
    queryFn: async (): Promise<PublicInvitationResult | null> => {
      if (!inviteCode) return null;
      
      // Busca pública do convite usando a função RPC que não requer autenticação
      const { data, error } = await supabase.rpc('get_invitation_by_code', {
        invite_code: inviteCode
      });
      
      if (error) {
        console.log('Erro ao buscar convite:', error);
        return null;
      }
      
      if (!data) return null;
      
      // Type assertion segura para converter o Json retornado para o tipo esperado
      return data as unknown as PublicInvitationResult;
    },
    enabled: !!inviteCode,
  });
}
