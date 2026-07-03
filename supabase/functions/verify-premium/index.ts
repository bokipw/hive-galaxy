import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GAME_ACCOUNT  = 'bokica80';
const REQUIRED_AMOUNT = 1.0;
const REQUIRED_SYMBOL = 'BCM';
const HE_API = 'https://api.hive-engine.com/rpc/blockchain';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  try {
    const { username, txid } = await req.json();
    if (!username || !txid) {
      return err('Nedostaje username ili txid', 400);
    }

    // Verifikuj transakciju na Hive-Engine
    const heRes = await fetch(HE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'getTransactionInfo',
        params: { txid },
        id: 1
      })
    });
    const heData = await heRes.json();
    const tx = heData?.result;

    if (!tx) return err('Transakcija nije pronađena na Hive-Engine', 404);

    // Parsiraj logs da nađemo token transfer
    let logs: any[] = [];
    try { logs = JSON.parse(tx.logs || '{}').events || []; } catch {}

    const transferEvent = logs.find((e: any) =>
      e.contract === 'tokens' &&
      e.event === 'transfer' &&
      e.data?.from?.toLowerCase() === username.toLowerCase() &&
      e.data?.to?.toLowerCase() === GAME_ACCOUNT.toLowerCase() &&
      e.data?.symbol === REQUIRED_SYMBOL &&
      parseFloat(e.data?.quantity || '0') >= REQUIRED_AMOUNT
    );

    if (!transferEvent) {
      return err('Transakcija nije validna (pogrešan iznos, token ili primalac)', 403);
    }

    // Setuj is_premium = true u hive_profiles
    const supa = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SERVICE_KEY')!
    );

    const { error } = await supa
      .from('hive_profiles')
      .update({ is_premium: true })
      .eq('id', username);

    if (error) return err('Greška pri ažuriranju baze: ' + error.message, 500);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
    });

  } catch (e) {
    return err('Server greška: ' + (e as Error).message, 500);
  }
});

function err(msg: string, status: number) {
  return new Response(JSON.stringify({ success: false, error: msg }), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
  };
}
