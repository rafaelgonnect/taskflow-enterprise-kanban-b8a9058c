
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/database';
import { useAuth } from './useAuth';

interface UpdateCompanyData {
  id: string;
  name?: string;
  description?: string;
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, name, description }: UpdateCompanyData) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log('Atualizando empresa:', { id, name, description });
      
      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description?.trim() || null;
      
      const { data: company, error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', id)
        .eq('owner_id', user.id) // Só o owner pode atualizar
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar empresa:', error);
        throw new Error('Erro ao atualizar empresa: ' + error.message);
      }
      
      console.log('Empresa atualizada com sucesso:', company);
      return company;
    },
    onSuccess: (company) => {
      console.log('Invalidando queries após atualização...');
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.setQueryData(['companies'], (old: Company[] | undefined) => {
        if (!old) return [company];
        return old.map(c => c.id === company.id ? company : c);
      });
    },
    onError: (error: any) => {
      console.error('Erro na mutação de atualização de empresa:', error);
    },
  });
}
