import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SERVICE_KEY = Deno.env.get('SERVICE_KEY');
const SUPA_URL = Deno.env.get('SUPABASE_URL');

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });

  try {
    const { username } = await req.json();
    if (!username) return err('Nedostaje username', 400);

    const supa = createClient(SUPA_URL, SERVICE_KEY);
    const email = `${username}@hive.local`;
    const password = Array.from({ length: 24 }, () => Math.random().toString(36)[2]).join('');

    const { data: users } = await supa.auth.admin.listUsers();
    let user = users?.users?.find((u: any) => u.email === email);

    if (!user) {
      const { data, error } = await supa.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { hive_user: username }
      });
      if (error) return err(error.message, 500);
      user = data.user;
    }

    await supa.from('hive_profiles').upsert({
      id: username,
      last_seen: new Date().toISOString()
    }, { onConflict: 'id' });

    return new Response(JSON.stringify({ email, password }), {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return err((e as Error).message, 500);
  }
});

function err(msg: string, status: number) {
  return new Response(JSON.stringify({ error: msg }), {
    status, headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
  };
}
