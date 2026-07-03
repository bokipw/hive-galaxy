=====================================================
  HIVE GALAXY — Backup baze podataka
=====================================================

Ovaj folder sadrži sve što trebaš ako:
  - Migruješ sa Supabase na drugi server
  - Supabase ugasi projekat ili naplati previše
  - Neko ti ponudi besplatan server
  - Bilo šta pođe naopako sa cloud bazom

-----------------------------------------------------
FAJLOVI U OVOM FOLDERU:
-----------------------------------------------------

1. schema.sql
   - Kreira sve tabele od nule na bilo kom PostgreSQL serveru
   - Pokreni ovo PRVO na novom serveru

2. edge-functions/
   - Kopija svih Supabase Edge Functions (TypeScript kod)
   - bright-handler = verifikacija BCM premium kupovine

-----------------------------------------------------
KAKO MIGRIRATI NA NOVI SERVER:
-----------------------------------------------------

1. Instaliraj PostgreSQL na novi server
2. Kreiraj novu bazu: CREATE DATABASE hivegalaxy;
3. Pokreni: psql -d hivegalaxy -f schema.sql
4. Ažuriraj u game.html:
     window._supa = supabase.createClient('NOVI_URL', 'NOVI_ANON_KEY')
5. Edge funkcije redeploy na novom provideru (Deno Deploy, Cloudflare Workers...)

-----------------------------------------------------
PODACI (rows u tabelama):
-----------------------------------------------------

Podatke (stvarne igrače, saveove) moraš eksportovati
ručno iz Supabase Dashboard:
  Table Editor → Export as CSV (za svaku tabelu)

Ili koristi Supabase CLI:
  supabase db dump --data-only > data_backup.sql

=====================================================
