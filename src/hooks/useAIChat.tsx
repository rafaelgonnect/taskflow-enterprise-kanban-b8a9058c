
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export function useAIChat() {
  const { selectedCompany } = useCompanyContext();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Olá! Sou seu assistente especializado em desenvolvimento. Como posso ajudar com seu roadmap hoje?',
      isUser: false,
      timestamp: new Date().toISOString(),
    }
  ]);

  const sendMessage = useMutation({
    mutationFn: async ({ message, context }: { message: string, context?: any }) => {
      if (!selectedCompany?.id) {
        throw new Error('Empresa não selecionada');
      }

      const { data, error } = await supabase.functions.invoke('ai-development-chat', {
        body: {
          message,
          companyId: selectedCompany.id,
          context
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Adicionar mensagem do usuário
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: variables.message,
        isUser: true,
        timestamp: new Date().toISOString(),
      };

      // Adicionar resposta da IA
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        isUser: false,
        timestamp: data.timestamp,
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
    },
    onError: (error: any) => {
      toast({
        title: 'Erro no chat',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: 'Olá! Sou seu assistente especializado em desenvolvimento. Como posso ajudar com seu roadmap hoje?',
        isUser: false,
        timestamp: new Date().toISOString(),
      }
    ]);
  };

  return {
    messages,
    sendMessage,
    clearChat,
    isLoading: sendMessage.isPending,
  };
}
