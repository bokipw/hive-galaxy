import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Signature, PublicKey } from 'npm:hive-tx@7.2.0';

const SUPA_URL = Deno.env.get('SUPABASE_URL') || 'https://exmbmwukqssvgmhysamo.supabase.co';
const SERVICE_KEY = Deno.env.get('SERVICE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
// Browser-safe service credential: legacy service_role JWT (sb_secret_ keys are
// rejected by Supabase when used from a browser, so we hand out the legacy JWT).
const BROWSER_KEY = Deno.env.get('ADMIN_BROWSER_KEY') || '';
// Posting public key of the admin HIVE account (bokica80).
const ADMIN_PUBKEY = Deno.env.get('ADMIN_PUBKEY') || 'STM51Puc8uPtDdWFx5TeeJcKngAkYufoqyqJKu6j7tHdfG74JrHTa';
const NONCE_TTL_MS = 5 * 60 * 1000;

const supa = createClient(SUPA_URL, SERVICE_KEY);

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

async function sha256(data: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', data));
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors(), 'Content-Type': 'application/json' }
  });
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors() });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { action } = body || {};

  // 1) Issue a one-time nonce that the browser must sign with the admin HIVE account.
  if (action === 'nonce') {
    const nonce = crypto.randomUUID().replaceAll('-', '') + Date.now().toString(36);
    const { error } = await supa.from('admin_challenges').insert({ nonce });
    if (error) return json({ error: 'DB error: ' + error.message }, 500);
    return json({ nonce, expiresIn: NONCE_TTL_MS });
  }

  // 2) Exchange a signed nonce for the admin service key.
  if (action === 'login') {
    const { nonce, signature, publicKey } = body;
    if (typeof nonce !== 'string' || typeof signature !== 'string') {
      return json({ error: 'Nedostaje nonce ili signature' }, 400);
    }

    const { data: row, error: fetchErr } = await supa
      .from('admin_challenges').select('*').eq('nonce', nonce).single();
    if (fetchErr || !row) return json({ error: 'Neispravan ili istekao nonce' }, 401);
    if (row.used) return json({ error: 'Nonce vec iskoriscen' }, 401);
    if (Date.now() - new Date(row.created_at).getTime() > NONCE_TTL_MS) {
      await supa.from('admin_challenges').delete().eq('nonce', nonce);
      return json({ error: 'Nonce istekao' }, 401);
    }

    // Digest = sha256(utf8(nonce)) — matches Hive Keychain requestSignBuffer.
    const digest = await sha256(new TextEncoder().encode(nonce));

    let recovered: PublicKey;
    try {
      recovered = Signature.from(signature).getPublicKey(digest);
    } catch {
      return json({ error: 'Neispravan potpis' }, 401);
    }

    const expected = PublicKey.fromString(ADMIN_PUBKEY);
    if (!bytesEqual(recovered.key, expected.key)) {
      return json({ error: 'Potpis nije od admin naloga' }, 401);
    }
    if (typeof publicKey === 'string' && publicKey !== ADMIN_PUBKEY) {
      return json({ error: 'Public key se ne poklapa' }, 401);
    }

    // One-time: consume the nonce, then hand out the admin credential.
    await supa.from('admin_challenges').delete().eq('nonce', nonce);

    if (!BROWSER_KEY) return json({ error: 'Admin browser kljuc nije konfigurisan' }, 500);
    return json({ key: BROWSER_KEY });
  }

  return json({ error: 'Nepoznata akcija' }, 400);
});
