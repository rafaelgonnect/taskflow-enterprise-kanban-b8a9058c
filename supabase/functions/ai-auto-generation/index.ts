
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
    const { roadmapItem, type, companyId, userId } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let prompt = '';
    let docType = 'specs';
    let title = '';

    switch (type) {
      case 'technical_specs':
        docType = 'specs';
        title = `Especificação Técnica: ${roadmapItem.title}`;
        prompt = `Gere uma especificação técnica completa para a seguinte funcionalidade:

        ITEM DO ROADMAP:
        - Título: ${roadmapItem.title}
        - Descrição: ${roadmapItem.description}
        - Categoria: ${roadmapItem.category}
        - Prioridade: ${roadmapItem.priority}

        GERE UMA ESPECIFICAÇÃO TÉCNICA INCLUINDO:
        1. Objetivo e Escopo
        2. Requisitos Funcionais (lista detalhada)
        3. Requisitos Não-Funcionais
        4. Arquitetura e Design
        5. Implementação (tecnologias, componentes)
        6. Critérios de Aceitação
        7. Testes Necessários
        8. Considerações de Performance
        9. Riscos e Mitigações
        10. Estimativa de Esforço

        Use formato Markdown estruturado e seja específico e detalhado.`;
        break;

      case 'test_plan':
        docType = 'test';
        title = `Plano de Testes: ${roadmapItem.title}`;
        prompt = `Gere um plano de testes completo para:

        FUNCIONALIDADE: ${roadmapItem.title}
        DESCRIÇÃO: ${roadmapItem.description}

        INCLUA:
        1. Estratégia de Testes
        2. Cenários de Teste (casos de sucesso e falha)
        3. Testes Unitários necessários
        4. Testes de Integração
        5. Testes de Performance
        6. Testes de Usabilidade
        7. Critérios de Aceitação testáveis
        8. Dados de teste necessários
        9. Ambiente de teste
        10. Checklist de validação

        Use formato Markdown com checkboxes para itens acionáveis.`;
        break;

      case 'implementation_notes':
        docType = 'notes';
        title = `Notas de Implementação: ${roadmapItem.title}`;
        prompt = `Gere notas detalhadas de implementação para:

        ITEM: ${roadmapItem.title}
        DESCRIÇÃO: ${roadmapItem.description}
        DEPENDÊNCIAS: ${JSON.stringify(roadmapItem.dependencies || [])}

        INCLUA:
        1. Análise técnica inicial
        2. Decisões de arquitetura
        3. Padrões e convenções a seguir
        4. Componentes/módulos a criar ou modificar
        5. APIs necessárias
        6. Considerações de segurança
        7. Pontos de atenção
        8. Recursos e referências úteis
        9. Próximos passos
        10. Perguntas para resolver

        Seja prático e orientado à implementação.`;
        break;
    }

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
            content: 'Você é um especialista em documentação técnica e desenvolvimento de software. Gere conteúdo detalhado, estruturado e acionável.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 3000,
      }),
    });

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Salvar documentação gerada
    const { data: savedDoc, error } = await supabase
      .from('roadmap_documentation')
      .insert({
        company_id: companyId,
        roadmap_item_id: roadmapItem.id,
        doc_type: docType,
        title: title,
        content: generatedContent,
        format: 'markdown',
        tags: ['ai-generated', roadmapItem.category, type],
        is_active: true,
        created_by: userId
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ 
      documentation: savedDoc,
      content: generatedContent 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-auto-generation:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
