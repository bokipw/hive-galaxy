import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { authenticate } from '../_shared/auth.ts';

const GAME_ACCOUNT  = 'bokica80';
const REQUIRED_AMOUNT = 1.0;
const REQUIRED_SYMBOL = 'BCM';
const HE_API = 'https://api.hive-engine.com/rpc/blockchain';

const supa = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SERVICE_KEY')!
);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) });
  if (req.method !== 'POST') return err(req, 'Method not allowed', 405);

  try {
    const caller = await authenticate(req, supa);
    if (!caller) return err(req, 'Neautorizovan zahtjev', 401);

    const { txid } = await req.json();
    if (!txid || typeof txid !== 'string') return err(req, 'Nedostaje txid', 400);
    const username = caller.playerId;

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

    if (!tx) return err(req, 'Transakcija nije pronađena na Hive-Engine', 404);

    // Parsiraj logs da nađemo token transfer
    let logs: Array<Record<string, any>> = [];
    try { logs = JSON.parse(tx.logs || '{}').events || []; } catch { /* ignore */ }

    const transferEvent = logs.find((e) =>
      e.contract === 'tokens' &&
      e.event === 'transfer' &&
      e.data?.from?.toLowerCase() === username.toLowerCase() &&
      e.data?.to?.toLowerCase() === GAME_ACCOUNT.toLowerCase() &&
      e.data?.symbol === REQUIRED_SYMBOL &&
      parseFloat(e.data?.quantity || '0') >= REQUIRED_AMOUNT
    );

    if (!transferEvent) {
      return err(req, 'Transakcija nije validna (pogrešan iznos, token ili primalac)', 403);
    }

    const { error } = await supa
      .from('hive_profiles')
      .update({ is_premium: true })
      .eq('id', username);

    if (error) return err(req, 'Greška pri ažuriranju baze', 500);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders(req), 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error('[verify-premium] UNCAUGHT:', (e as Error).message);
    return err(req, 'Server greška', 500);
  }
});

function err(req: Request, msg: string, status: number) {
  return new Response(JSON.stringify({ success: false, error: msg }), {
    status,
    headers: { ...corsHeaders(req), 'Content-Type': 'application/json' }
  });
}
