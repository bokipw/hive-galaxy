// Backup kopija deployed edge funkcije (premium verifikacija preko Hive-Engine transakcije).
// Standalone verzija — nema ../_shared importa, pa su CORS i auth helperi inline.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GAME_ACCOUNT  = 'bokica80';
const REQUIRED_AMOUNT = 1.0;
const REQUIRED_SYMBOL = 'BCM';
const HE_API = 'https://api.hive-engine.com/rpc/blockchain';

const DEFAULT_ORIGINS = ['https://bokipw.github.io', 'http://localhost:8000', 'http://127.0.0.1:8000'];
const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') || '')
  .split(',').map((o) => o.trim()).filter(Boolean);

const supa = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SERVICE_KEY')!
);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) });
  if (req.method !== 'POST') return err(req, 'Method not allowed', 405);

  try {
    const username = await callerHiveUser(req);
    if (!username) return err(req, 'Neautorizovan zahtjev', 401);

    const { txid } = await req.json();
    if (!txid || typeof txid !== 'string') return err(req, 'Nedostaje txid', 400);

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
      .update({ is_premium: true, premium_since: new Date().toISOString() })
      .eq('hive_user', username);

    if (error) return err(req, 'Greška pri ažuriranju baze', 500);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders(req), 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error('[bright-handler] UNCAUGHT:', (e as Error).message);
    return err(req, 'Server greška', 500);
  }
});

async function callerHiveUser(req: Request): Promise<string | null> {
  const header = req.headers.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) return null;
  const { data, error } = await supa.auth.getUser(header.slice(7).trim());
  if (error || !data?.user) return null;
  const hiveUser = data.user.user_metadata?.hive_user;
  return typeof hiveUser === 'string' && hiveUser ? hiveUser : null;
}

function err(req: Request, msg: string, status: number) {
  return new Response(JSON.stringify({ success: false, error: msg }), {
    status,
    headers: { ...corsHeaders(req), 'Content-Type': 'application/json' }
  });
}

function corsHeaders(req: Request): Record<string, string> {
  const list = ALLOWED_ORIGINS.length ? ALLOWED_ORIGINS : DEFAULT_ORIGINS;
  const origin = req.headers.get('origin') || '';
  const headers: Record<string, string> = {
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
  };
  if (list.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}
