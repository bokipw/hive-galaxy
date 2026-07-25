import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SERVICE_KEY = Deno.env.get('SERVICE_KEY');
const SUPA_URL = Deno.env.get('SUPABASE_URL');

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });

  try {
    const { username } = await req.json();
    if (!username) return err('Nedostaje username', 400);

    if (!SUPA_URL || !SERVICE_KEY) {
      console.error('[hive-auth] SUPABASE_URL ili SERVICE_KEY nije postavljen');
      return err('Server nije konfigurisan', 500);
    }

    const supa = createClient(SUPA_URL, SERVICE_KEY);
    const email = `${username}@hive.local`;
    const password = Array.from({ length: 24 }, () => Math.random().toString(36)[2]).join('');

    const { data: users, error: listErr } = await supa.auth.admin.listUsers();
    if (listErr) return err(listErr.message, 500);
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

    const { error: playersErr } = await supa.from('players').upsert({ id: username, player_type: 'hive', username }, { onConflict: 'id' });
    if (playersErr) return err('players: ' + playersErr.message, 500);
    const { error: profileErr } = await supa.from('hive_profiles').upsert({
      id: username,
      last_seen: new Date().toISOString()
    }, { onConflict: 'id' });
    if (profileErr) return err('hive_profiles: ' + profileErr.message, 500);

    return new Response(JSON.stringify({ email, password }), {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('[hive-auth] UNCAUGHT:', e);
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
