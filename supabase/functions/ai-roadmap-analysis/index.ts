
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
    const { roadmapItems, type, companyId } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let prompt = '';
    
    switch (type) {
      case 'analyze_items':
        prompt = `Analise os seguintes itens do roadmap e forneça insights sobre:
        1. Dependências entre itens
        2. Riscos potenciais
        3. Sugestões de melhoria
        4. Estimativas de tempo mais precisas
        
        Itens: ${JSON.stringify(roadmapItems, null, 2)}
        
        Responda em JSON com a estrutura:
        {
          "insights": [
            {
              "item_id": "id",
              "type": "dependency|risk|improvement|estimate",
              "title": "título do insight",
              "content": "descrição detalhada",
              "confidence_score": 0.8,
              "metadata": {}
            }
          ]
        }`;
        break;
        
      case 'suggest_improvements':
        prompt = `Com base no roadmap atual, sugira melhorias para otimização do desenvolvimento:
        
        Roadmap: ${JSON.stringify(roadmapItems, null, 2)}
        
        Foque em:
        - Reordenação de prioridades
        - Identificação de gargalos
        - Oportunidades de paralelização
        - Redução de complexidade
        
        Responda em JSON estruturado.`;
        break;
        
      case 'generate_specs':
        prompt = `Gere especificações técnicas detalhadas para os itens do roadmap que ainda não possuem:
        
        Itens: ${JSON.stringify(roadmapItems, null, 2)}
        
        Para cada item sem specs, inclua:
        - Requisitos funcionais
        - Requisitos técnicos
        - Critérios de aceitação
        - Considerações de implementação
        
        Responda em JSON com especificações detalhadas.`;
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
            content: 'Você é um especialista em gestão de produtos e desenvolvimento de software. Sempre responda em JSON válido e estruturado.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    // Salvar insights no banco se for análise
    if (type === 'analyze_items' && result.insights) {
      for (const insight of result.insights) {
        await supabase
          .from('ai_insights')
          .insert({
            company_id: companyId,
            roadmap_item_id: insight.item_id,
            insight_type: insight.type,
            title: insight.title,
            content: insight.content,
            confidence_score: insight.confidence_score,
            metadata: insight.metadata || {},
            status: 'pending'
          });
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-roadmap-analysis:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
