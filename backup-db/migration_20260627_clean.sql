-- =====================================================
-- HIVE GALAXY — POTPUNO BRISANJE + NOVA SEMA (v3)
-- Pokreni u Supabase Dashboard -> SQL Editor
-- =====================================================

-- =====================================================
-- 1. BRISANJE SVIH TABELA
-- =====================================================
DROP TABLE IF EXISTS saves CASCADE;
DROP TABLE IF EXISTS leaderboard CASCADE;
DROP TABLE IF EXISTS pvp_snapshots CASCADE;
DROP TABLE IF EXISTS saves_email CASCADE;
DROP TABLE IF EXISTS saves_hive CASCADE;
DROP TABLE IF EXISTS hive_profiles CASCADE;

DROP FUNCTION IF EXISTS prevent_empty_save CASCADE;

-- =====================================================
-- 2. SAVES_EMAIL - Email igraci (auth.users UUID)
-- =====================================================
CREATE TABLE saves_email (
  id          UUID PRIMARY KEY,
  data        JSONB NOT NULL,
  version     INTEGER DEFAULT 1,
  saved_at    TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT saves_email_data_check CHECK (
    data IS NOT NULL
    AND data->'commander' IS NOT NULL
    AND data->'commander'->>'level' IS NOT NULL
    AND (data->'commander'->>'level')::int > 0
    AND data->'R' IS NOT NULL
    AND data->'buildings' IS NOT NULL
  )
);

ALTER TABLE saves_email ENABLE ROW LEVEL SECURITY;

CREATE POLICY "s_email_own" ON saves_email
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 3. SAVES_HIVE - HIVE igraci (hive_username)
-- =====================================================
CREATE TABLE saves_hive (
  id          TEXT PRIMARY KEY,
  hive_user   TEXT NOT NULL UNIQUE,
  data        JSONB NOT NULL,
  version     INTEGER DEFAULT 1,
  saved_at    TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT saves_hive_data_check CHECK (
    data IS NOT NULL
    AND data->'commander' IS NOT NULL
    AND data->'commander'->>'level' IS NOT NULL
    AND (data->'commander'->>'level')::int > 0
    AND data->'R' IS NOT NULL
    AND data->'buildings' IS NOT NULL
  )
);

ALTER TABLE saves_hive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "s_hive_own" ON saves_hive
  USING (auth.jwt()->'user_metadata'->>'hive_username' = hive_user)
  WITH CHECK (auth.jwt()->'user_metadata'->>'hive_username' = hive_user);

-- =====================================================
-- 4. TRIGGER - sprecava prazan save (dupla zastita)
-- =====================================================
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

CREATE TRIGGER trg_prevent_empty_save_email
  BEFORE INSERT OR UPDATE ON saves_email
  FOR EACH ROW EXECUTE FUNCTION prevent_empty_save();

CREATE TRIGGER trg_prevent_empty_save_hive
  BEFORE INSERT OR UPDATE ON saves_hive
  FOR EACH ROW EXECUTE FUNCTION prevent_empty_save();

-- =====================================================
-- 5. HIVE_PROFILES - HIVE specificni podaci
-- =====================================================
CREATE TABLE hive_profiles (
  hive_user     TEXT PRIMARY KEY,
  is_premium    BOOLEAN DEFAULT FALSE,
  premium_since TIMESTAMPTZ,
  keys          INTEGER DEFAULT 0,
  ikeys         INTEGER DEFAULT 0,
  keys_cmd      INTEGER DEFAULT 0,
  keys_inst     INTEGER DEFAULT 0,
  bcm           NUMERIC DEFAULT 0,
  bocrypto      NUMERIC DEFAULT 0,
  spcard        NUMERIC DEFAULT 0,
  boosters      JSONB DEFAULT '{}',
  last_seen     TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hive_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hp_read_all"  ON hive_profiles FOR SELECT USING (true);
CREATE POLICY "hp_write_all" ON hive_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "hp_update_all" ON hive_profiles FOR UPDATE USING (true);
CREATE POLICY "hp_delete_all" ON hive_profiles FOR DELETE USING (true);

-- =====================================================
-- 6. LEADERBOARD - Rang lista (svi pisu, zaštita je u CHECK constraintima)
-- =====================================================
CREATE TABLE leaderboard (
  id          TEXT PRIMARY KEY,
  username    TEXT NOT NULL,
  score       BIGINT DEFAULT 0,
  level       INTEGER DEFAULT 1,
  is_premium  BOOLEAN DEFAULT FALSE,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lb_read_all"   ON leaderboard FOR SELECT USING (true);
CREATE POLICY "lb_write_all"  ON leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "lb_update_all" ON leaderboard FOR UPDATE USING (true);
CREATE POLICY "lb_delete_all" ON leaderboard FOR DELETE USING (true);

-- =====================================================
-- 7. PVP_SNAPSHOTS - PvP stanje (svi pisu)
-- =====================================================
CREATE TABLE pvp_snapshots (
  id          TEXT PRIMARY KEY,
  username    TEXT NOT NULL,
  rating      INTEGER DEFAULT 1000,
  level       INTEGER DEFAULT 1,
  power       BIGINT DEFAULT 0,
  fleet       JSONB DEFAULT '[]',
  commanders  JSONB DEFAULT '[]',
  is_premium  BOOLEAN DEFAULT FALSE,
  resources   JSONB DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pvp_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pvp_read_all"   ON pvp_snapshots FOR SELECT USING (true);
CREATE POLICY "pvp_write_all"  ON pvp_snapshots FOR INSERT WITH CHECK (true);
CREATE POLICY "pvp_update_all" ON pvp_snapshots FOR UPDATE USING (true);
CREATE POLICY "pvp_delete_all" ON pvp_snapshots FOR DELETE USING (true);

-- =====================================================
-- 8. INDEXI
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_pvp_rating   ON pvp_snapshots(rating DESC);
CREATE INDEX IF NOT EXISTS idx_pvp_updated  ON pvp_snapshots(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_lb_score     ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_hive_premium ON hive_profiles(is_premium);
CREATE INDEX IF NOT EXISTS idx_sh_user      ON saves_hive(hive_user);

-- =====================================================
-- GOTOVO - baza je prazna i spremna
-- =====================================================
