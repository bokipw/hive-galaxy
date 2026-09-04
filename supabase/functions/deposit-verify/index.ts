import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GAME_ACCOUNT = 'bokica80';
const HE_API = 'https://api.hive-engine.com/rpc/blockchain';

// minimalni iznos (u sirovim jedinicama) i kako čuvamo balans u igri
const SYMBOLS: Record<string, { min: number; mult: number }> = {
  BCM:      { min: 1,     mult: 1 },
  BOCRYPTO: { min: 1000,  mult: 1 },
  BPW:      { min: 10000000, mult: 100000000 }, // BPW -> satoshi (spCard)
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });

  try {
    const { username, symbol, txid } = await req.json();
    if (!username || !symbol || !txid) return err('Nedostaje username, symbol ili txid', 400);
    const cfg = SYMBOLS[symbol];
    if (!cfg) return err('Nepoznat simbol', 400);

    const supa = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SERVICE_KEY')!
    );

    // ── 1) Anti-double-credit: već obrađen tx? ──
    const { data: existing } = await supa
      .from('deposits')
      .select('tx_id, status')
      .eq('tx_id', txid)
      .maybeSingle();
    if (existing) return err('Transakcija je već obrađena', 409);

    // ── 2) Verifikuj na HIVE-Engine blockchainu ──
    const heRes = await fetch(HE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getTransactionInfo', params: { txid } }),
    });
    const heData = await heRes.json();
    const tx = heData?.result;
    if (!tx) return err('Transakcija nije pronađena na Hive-Engine', 404);

    let payload: any = {};
    try { payload = JSON.parse(tx.payload || '{}'); } catch { /* ignore */ }

    const from = (payload.from || tx.sender || '').toLowerCase();
    const to   = String(payload.to || '').toLowerCase();
    const sym  = payload.symbol;
    const qty  = parseFloat(String(payload.quantity || '0'));
    const memo = String(payload.memo || '');

    if (!from || from !== username.toLowerCase()) return err('Transakcija nije poslata sa tvog HIVE naloga', 403);
    if (to !== GAME_ACCOUNT) return err('Primalac transakcije nije ispravan', 403);
    if (sym !== symbol) return err('Pogrešan token u transakciji', 403);
    if (!qty || qty < cfg.min) return err('Iznos ispod minimalnog', 403);
    const expectedPrefix = `HIVEGALAXY_deposit_${symbol}_`.toUpperCase();
    const memoUpper = memo.toUpperCase();
    if (!memoUpper.startsWith(expectedPrefix) || !memoUpper.includes(username.toUpperCase())) {
      return err('Memo transakcije nije ispravan za depozit', 403);
    }

    // ── 3) ATOMIČNO zapiši depozit + kredituj player_resources ──
    // credit_deposit() radi u jednoj SQL transakciji:
    //   insert deposits (UNIQUE(tx_id) štiti od duplog kreditiranja)
    //   + player_resources.bcm/bocrypto/spcard += iznos
    //   + transactions (audit)
    // Server je sada jedini izvor istine — kredit preživi i ako klijent
    // nikad ne savlada stanje (mreža, zatvoren tab, blokiran cloud save).
    const baseAmount = symbol === 'BOCRYPTO' ? Math.round(qty * 1000) / 1000 : Math.floor(qty * cfg.mult);
    const { data: credit, error: creditErr } = await supa.rpc('credit_deposit', {
      p_player_id: username,
      p_token: symbol,
      p_amount: baseAmount,
      p_tx_id: txid,
      p_memo: memo,
    });
    if (creditErr || !credit || !credit.success) {
      const code = credit?.code;
      if (code === 'ALREADY_PROCESSED' || (creditErr && /duplicate/.test(creditErr.message))) {
        return err('Transakcija je već obrađena', 409);
      }
      return err('Greška pri upisu depozita: ' + (creditErr?.message || credit?.error || 'nepoznata'), 500);
    }

    return new Response(JSON.stringify({ success: true, symbol, amount: credit.amount ?? baseAmount }), {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return err('Server greška: ' + (e as Error).message, 500);
  }
});

function err(msg: string, status: number) {
  return new Response(JSON.stringify({ success: false, error: msg }), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}
