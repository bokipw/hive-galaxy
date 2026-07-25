# Security

## Kredencijali koje TREBA rotirati (hitno)

Ovi tajni podaci su bili u repozitorijumu i ostaju u git istoriji, pa ih treba smatrati kompromitovanim:

| Tajna | Gdje je bila | Akcija |
| --- | --- | --- |
| Supabase `service_role` ključ (`sb_secret_…`) | `admin.html` i `supabase/functions/game-save/index.ts` (commit `d15b6dc`) | Rotiraj u Supabase Dashboard → Settings → API, pa postavi novi `SERVICE_KEY` secret za edge funkcije |
| Postgres lozinka baze | `_run_sql.js` (uklonjeno), takođe kao admin lozinka u `admin.html` | Rotiraj u Supabase Dashboard → Settings → Database |

Uklanjanje fajla iz `HEAD` ne briše tajnu iz istorije — rotacija je jedini pouzdan način.

## Konfiguracija edge funkcija

Funkcije očekuju sljedeće secrete (`supabase secrets set …`):

- `SERVICE_KEY` — Supabase service_role ključ
- `SUPABASE_URL` — URL projekta
- `ALLOWED_ORIGINS` — lista dozvoljenih origin-a za CORS, npr. `https://bokipw.github.io`
  (bez nje se koristi default lista u `supabase/functions/_shared/cors.ts`)
- `HIVE_API` (opciono) — Hive RPC node za verifikaciju potpisa, default `https://api.hive.blog`

## Model autentifikacije

- HIVE login: klijent traži Keychain potpis poruke `HIVEGALAXY_LOGIN:<username>:<timestamp>`.
  `hive-auth` verifikuje potpis protiv posting/active ključeva naloga sa Hive blockchaina i tek
  tada izdaje Supabase kredencijale za nalog `<username>@hive.local`. Potpis vrijedi 5 minuta.
- Sve edge funkcije zahtijevaju `Authorization: Bearer <supabase access token>`; identitet igrača
  se izvodi iz tokena (`user_metadata.hive_user`, ili `auth.uid()` za email igrače), a NIKAD iz
  tijela zahtjeva.

## Poznata preostala ograničenja

- Challenge za HIVE login je timestamp, ne server-side nonce — replay je moguć samo unutar 5 minuta
  i samo za onoga ko već vidi potpis.
- Premium verifikacija ne pamti iskorišćene `txid`-jeve; ista transakcija se može poslati više puta,
  ali samo za nalog koji je i poslao tokene, pa je efekat idempotentan.
- `player_*` tabele imaju `SELECT USING (true)` politike (vidi `backup-db/rls_select_all.sql`), tj.
  stanje svih igrača je javno čitljivo preko anon ključa. Suziti kad se riješi mapiranje
  `auth.uid()` ↔ hive username.
- Sve klijentske ekonomske provjere (resursi, cijene, nagrade) rade se u browseru; server prihvata
  save kakav klijent pošalje. Za sprječavanje čitanja/pisanja tuđih podataka to je riješeno, ali
  igrač i dalje može falsifikovati svoj napredak.
