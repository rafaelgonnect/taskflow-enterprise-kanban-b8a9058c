
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
  companies?: {
    name: string;
  };
  invited_by_profile?: {
    full_name: string;
  };
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
          companies!inner(name),
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
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
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
        .update({ status: 'accepted' })
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
