-- Prethodno pokretano preko javne `migrate` edge funkcije (uklonjena — izvršavala je
-- proizvoljan DDL bez autentifikacije). Migracije idu kroz supabase CLI.

-- SAVES: ne dozvoli prazan save
ALTER TABLE saves DROP CONSTRAINT IF EXISTS saves_data_check;
ALTER TABLE saves ADD CONSTRAINT saves_data_check
  CHECK (
    data IS NOT NULL
    AND data->'commander' IS NOT NULL
    AND data->'commander'->>'level' IS NOT NULL
    AND (data->'commander'->>'level')::int > 0
    AND data->'R' IS NOT NULL
    AND data->'buildings' IS NOT NULL
  );

-- HIVE_PROFILES: dodaj kolone ako fale
ALTER TABLE hive_profiles ADD COLUMN IF NOT EXISTS keys_cmd  INTEGER DEFAULT 0;
ALTER TABLE hive_profiles ADD COLUMN IF NOT EXISTS keys_inst INTEGER DEFAULT 0;
ALTER TABLE hive_profiles ADD COLUMN IF NOT EXISTS bcm       NUMERIC DEFAULT 0;
ALTER TABLE hive_profiles ADD COLUMN IF NOT EXISTS bocrypto  NUMERIC DEFAULT 0;
ALTER TABLE hive_profiles ADD COLUMN IF NOT EXISTS spcard    NUMERIC DEFAULT 0;
ALTER TABLE hive_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- HIVE_PROFILES: default boosters objekat
ALTER TABLE hive_profiles ALTER COLUMN boosters SET DEFAULT '{}';

-- SAVES: trigger koji blokira prazan upsert
CREATE OR REPLACE FUNCTION prevent_empty_save()
RETURNS TRIGGER AS $$ BEGIN
  IF NEW.data IS NULL THEN
    RAISE EXCEPTION 'Cannot save NULL data';
  END IF;
  IF NEW.data->'commander' IS NULL
     OR NEW.data->'commander'->>'level' IS NULL
     OR (NEW.data->'commander'->>'level')::int < 1 THEN
    RAISE EXCEPTION 'Cannot save: commander.level is 0 or missing';
  END IF;
  IF NEW.data->'R' IS NULL
     OR NEW.data->'R'->>'metal' IS NULL
     OR (NEW.data->'R'->>'metal')::int <= 0 THEN
    RAISE EXCEPTION 'Cannot save: R.metal is 0 or missing';
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_empty_save ON saves;
CREATE TRIGGER trg_prevent_empty_save
  BEFORE INSERT OR UPDATE ON saves
  FOR EACH ROW EXECUTE FUNCTION prevent_empty_save();

-- DELETE politike
DROP POLICY IF EXISTS "saves_delete_own" ON saves;
CREATE POLICY "saves_delete_own" ON saves FOR DELETE USING (auth.uid() = id);
DROP POLICY IF EXISTS "lb_delete_own" ON leaderboard;
CREATE POLICY "lb_delete_own" ON leaderboard FOR DELETE USING (auth.uid() = id);
