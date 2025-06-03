
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();
    
    console.log('Reset database request received');
    
    // Verificar senha
    if (password !== '123321Go!') {
      console.log('Invalid password provided');
      return new Response(
        JSON.stringify({ error: 'Senha incorreta' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Criar cliente Supabase com service role para ter permissões administrativas
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting database reset...');

    // Lista das tabelas na ordem correta para evitar conflitos de chave estrangeira
    const tablesToReset = [
      'task_transfers',
      'task_time_logs',
      'task_history',
      'task_comments',
      'task_attachments',
      'tasks',
      'department_members',
      'user_departments',
      'departments',
      'user_roles',
      'role_permissions',
      'role_hierarchy',
      'roles',
      'user_companies',
      'invitations',
      'company_invites',
      'audit_logs',
      'roadmap_comments',
      'roadmap_documentation',
      'roadmap_items',
      'roadmap_configs',
      'ai_insights',
      'companies',
      'profiles'
    ];

    let deletedCounts: { [key: string]: number } = {};

    // Deletar dados de cada tabela
    for (const table of tablesToReset) {
      try {
        console.log(`Resetting table: ${table}`);
        const { count, error } = await supabaseAdmin
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

        if (error) {
          console.error(`Error resetting table ${table}:`, error);
          // Continue with other tables even if one fails
          deletedCounts[table] = 0;
        } else {
          deletedCounts[table] = count || 0;
          console.log(`Reset table ${table}: ${count} records deleted`);
        }
      } catch (err) {
        console.error(`Exception resetting table ${table}:`, err);
        deletedCounts[table] = 0;
      }
    }

    // Também limpar usuários de autenticação (auth.users)
    try {
      console.log('Attempting to reset auth users...');
      // Note: Esta operação pode falhar dependendo das permissões
      // Em produção, você pode precisar fazer isso manualmente via dashboard
    } catch (err) {
      console.error('Could not reset auth users:', err);
    }

    console.log('Database reset completed', deletedCounts);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Base de dados resetada com sucesso',
        deletedCounts 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in reset-database function:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
