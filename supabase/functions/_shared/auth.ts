import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface Caller {
  userId: string;
  /** Identifier used in the player_* tables: hive username, or auth uid for email players. */
  playerId: string;
}

/**
 * Resolves the caller from the `Authorization: Bearer <access_token>` header.
 * Returns null when the token is missing, expired or not a user token.
 */
export async function authenticate(req: Request, supa: SupabaseClient): Promise<Caller | null> {
  const header = req.headers.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  if (!token) return null;

  const { data, error } = await supa.auth.getUser(token);
  if (error || !data?.user) return null;

  const hiveUser = data.user.user_metadata?.hive_user;
  return {
    userId: data.user.id,
    playerId: typeof hiveUser === 'string' && hiveUser ? hiveUser : data.user.id,
  };
}
