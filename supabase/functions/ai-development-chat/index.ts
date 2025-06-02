
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, companyId, context } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar contexto do roadmap
    const { data: roadmapItems } = await supabase
      .from('roadmap_items')
      .select('*')
      .eq('company_id', companyId);

    const { data: documentation } = await supabase
      .from('roadmap_documentation')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true);

    const systemPrompt = `Você é um assistente especializado em desenvolvimento de software com foco em roadmaps e gestão de produtos.

    CONTEXTO DO PROJETO:
    - Roadmap atual: ${JSON.stringify(roadmapItems?.slice(0, 10) || [], null, 2)}
    - Documentação disponível: ${JSON.stringify(documentation?.slice(0, 5) || [], null, 2)}
    - Contexto adicional: ${context || 'Nenhum contexto adicional fornecido'}

    SUAS ESPECIALIDADES:
    - Análise de roadmaps e priorização
    - Estimativas de desenvolvimento
    - Identificação de dependências e riscos
    - Sugestões de arquitetura e implementação
    - Geração de especificações técnicas
    - Otimização de processos de desenvolvimento

    INSTRUÇÕES:
    - Sempre considere o contexto do roadmap atual
    - Forneça respostas práticas e acionáveis
    - Sugira melhorias baseadas em boas práticas
    - Seja específico em suas recomendações
    - Responda de forma clara e objetiva em português`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-development-chat:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
