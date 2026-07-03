-- =====================================================
-- HIVE GALAXY — MIGRACIJA: ZAŠTITA PODATAKA U BAZI
-- Pokreni u Supabase SQL Editor (dashboard)
-- =====================================================

-- 1. SAVES — CHECK CONSTRAINT da se prazan save ne može snimiti
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

-- 2. HIVE_PROFILES — dodaj kolone koje app koristi (ako ne postoje)
ALTER TABLE hive_profiles ADD COLUMN IF NOT EXISTS keys_cmd  INTEGER DEFAULT 0;
ALTER TABLE hive_profiles ADD COLUMN IF NOT EXISTS keys_inst INTEGER DEFAULT 0;
ALTER TABLE hive_profiles ADD COLUMN IF NOT EXISTS bcm       NUMERIC DEFAULT 0;
ALTER TABLE hive_profiles ADD COLUMN IF NOT EXISTS bocrypto  NUMERIC DEFAULT 0;
ALTER TABLE hive_profiles ADD COLUMN IF NOT EXISTS spcard    NUMERIC DEFAULT 0;
ALTER TABLE hive_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 3. HIVE_PROFILES — promijeni default boosters na objekt (bio array)
ALTER TABLE hive_profiles ALTER COLUMN boosters SET DEFAULT '{}';

-- 4. RLS — saves: dozvoli UPDATE/DELETE samo sa auth.uid() (već postoji)
--    ali dodaj eksplicitan DELETE policy (nedostajao je u starom schema.sql)
DROP POLICY IF EXISTS "saves_delete_own" ON saves;
CREATE POLICY "saves_delete_own" ON saves FOR DELETE
  USING (auth.uid() = id);

-- 5. RLS — hive_profiles: dodaj DELETE policy (treba adminu za brisanje igrača)
DROP POLICY IF EXISTS "hive_delete_all" ON hive_profiles;
CREATE POLICY "hive_delete_all" ON hive_profiles FOR DELETE
  USING (true);

-- 6. SAVES — TRIGGER koji sprječava overwrite praznim podacima
--    Ovo je dodatna sigurnost uz CHECK constraint
CREATE OR REPLACE FUNCTION prevent_empty_save()
RETURNS TRIGGER AS $$
BEGIN
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
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_empty_save ON saves;
CREATE TRIGGER trg_prevent_empty_save
  BEFORE INSERT OR UPDATE ON saves
  FOR EACH ROW EXECUTE FUNCTION prevent_empty_save();

-- 7. RLS — pvp_snapshots: dodaj DELETE policy
DROP POLICY IF EXISTS "pvp_delete_own" ON pvp_snapshots;
CREATE POLICY "pvp_delete_own" ON pvp_snapshots FOR DELETE
  USING (true);

-- 8. LEADERBOARD — dodaj DELETE policy
DROP POLICY IF EXISTS "lb_delete_own" ON leaderboard;
CREATE POLICY "lb_delete_own" ON leaderboard FOR DELETE
  USING (auth.uid() = id);

-- =====================================================
-- GOTOVO
-- =====================================================
