import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { cryptoUtils, PublicKey, Signature } from 'https://esm.sh/@hiveio/dhive@1.3.2';
import { corsHeaders } from '../_shared/cors.ts';

const SERVICE_KEY = Deno.env.get('SERVICE_KEY');
const SUPA_URL = Deno.env.get('SUPABASE_URL');
const HIVE_API = Deno.env.get('HIVE_API') || 'https://api.hive.blog';

/** Max age of the signed login challenge. */
const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const CHALLENGE_PREFIX = 'HIVEGALAXY_LOGIN';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) });
  if (req.method !== 'POST') return err(req, 'Method not allowed', 405);

  try {
    const { username, message, signature } = await req.json();
    if (!username || !message || !signature) return err(req, 'Nedostaje username, message ili signature', 400);
    if (!/^[a-z0-9.-]{3,16}$/.test(username)) return err(req, 'Neispravan HIVE username', 400);

    const challenge = parseChallenge(message);
    if (!challenge) return err(req, 'Neispravan format poruke', 400);
    if (challenge.username !== username) return err(req, 'Poruka ne odgovara username-u', 400);
    if (Math.abs(Date.now() - challenge.timestamp) > CHALLENGE_TTL_MS) return err(req, 'Poruka je istekla, pokušaj ponovo', 401);

    if (!(await verifyHiveSignature(username, message, signature))) {
      return err(req, 'Potpis nije validan za ovaj HIVE nalog', 401);
    }

    const supa = createClient(SUPA_URL!, SERVICE_KEY!);
    const email = `${username}@hive.local`;
    const password = randomPassword();

    const { data: users } = await supa.auth.admin.listUsers();
    const user = users?.users?.find((u: { email?: string }) => u.email === email);

    if (user) {
      // Rotate the password so only the holder of the HIVE key can sign in with it.
      const { error } = await supa.auth.admin.updateUserById(user.id, {
        password,
        user_metadata: { hive_user: username }
      });
      if (error) return err(req, error.message, 500);
    } else {
      const { error } = await supa.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { hive_user: username }
      });
      if (error) return err(req, error.message, 500);
    }

    await supa.from('players').upsert({ id: username, player_type: 'hive', username }, { onConflict: 'id' });
    await supa.from('hive_profiles').upsert({
      id: username,
      last_seen: new Date().toISOString()
    }, { onConflict: 'id' });

    return new Response(JSON.stringify({ email, password }), {
      headers: { ...corsHeaders(req), 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('[hive-auth] UNCAUGHT:', (e as Error).message);
    return err(req, 'Server greška', 500);
  }
});

function parseChallenge(message: unknown): { username: string; timestamp: number } | null {
  if (typeof message !== 'string') return null;
  const parts = message.split(':');
  if (parts.length !== 3 || parts[0] !== CHALLENGE_PREFIX) return null;
  const timestamp = Number(parts[2]);
  if (!Number.isFinite(timestamp)) return null;
  return { username: parts[1], timestamp };
}

/** Checks that `signature` over `message` was produced by a posting/active key of `username`. */
async function verifyHiveSignature(username: string, message: string, signature: string): Promise<boolean> {
  const res = await fetch(HIVE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'condenser_api.get_accounts', params: [[username]] })
  });
  const account = (await res.json())?.result?.[0];
  if (!account) return false;

  const authorized: string[] = [
    ...(account.posting?.key_auths || []),
    ...(account.active?.key_auths || [])
  ].map((ka: [string, number]) => ka[0]);
  if (authorized.length === 0) return false;

  let recovered: string;
  try {
    const hash = cryptoUtils.sha256(message);
    recovered = Signature.fromString(signature).recover(hash).toString();
  } catch {
    return false;
  }

  return authorized.some((key) => {
    try {
      return PublicKey.fromString(key).toString() === recovered;
    } catch {
      return false;
    }
  });
}

function randomPassword(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function err(req: Request, msg: string, status: number) {
  return new Response(JSON.stringify({ error: msg }), {
    status, headers: { ...corsHeaders(req), 'Content-Type': 'application/json' }
  });
}
