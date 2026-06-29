-- =====================================================
-- HIVE GALAXY — Database Schema
-- PostgreSQL / Supabase kompatibilan
-- =====================================================

-- Ekstenzija za UUID (Supabase ima automatski, na vanilla Postgres trebaš ovo)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. SAVES — Cloud saveovi za email igrače
-- =====================================================
CREATE TABLE IF NOT EXISTS saves (
  id          UUID PRIMARY KEY,         -- auth.users uuid
  data        JSONB NOT NULL,           -- cijeli game state kao JSON
  version     INTEGER DEFAULT 1,
  saved_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. LEADERBOARD — Rang lista igrača
-- =====================================================
CREATE TABLE IF NOT EXISTS leaderboard (
  id          UUID PRIMARY KEY,         -- auth.users uuid
  username    TEXT NOT NULL,
  score       BIGINT DEFAULT 0,
  level       INTEGER DEFAULT 1,
  is_premium  BOOLEAN DEFAULT FALSE,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. HIVE_PROFILES — HIVE Keychain igrači
-- =====================================================
CREATE TABLE IF NOT EXISTS hive_profiles (
  hive_user     TEXT PRIMARY KEY,       -- HIVE username (npr. "bokica80")
  is_premium    BOOLEAN DEFAULT FALSE,
  premium_since TIMESTAMPTZ,
  keys          INTEGER DEFAULT 0,      -- commander card ključevi (pending)
  ikeys         INTEGER DEFAULT 0,      -- instance ključevi (pending)
  boosters      JSONB DEFAULT '[]',
  last_seen     TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. PVP_SNAPSHOTS — PvP stanje svakog igrača
-- =====================================================
CREATE TABLE IF NOT EXISTS pvp_snapshots (
  id          TEXT PRIMARY KEY,         -- UUID za email, "hive_username" za HIVE
  username    TEXT NOT NULL,
  rating      INTEGER DEFAULT 1000,
  level       INTEGER DEFAULT 1,
  power       BIGINT DEFAULT 0,
  fleet       JSONB DEFAULT '[]',       -- battle-ready brodovi sa svim statsima
  commanders  JSONB DEFAULT '[]',       -- deployani komandiri
  is_premium  BOOLEAN DEFAULT FALSE,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXI za performanse
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_pvp_rating    ON pvp_snapshots(rating DESC);
CREATE INDEX IF NOT EXISTS idx_pvp_updated   ON pvp_snapshots(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_lb_score      ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_hive_premium  ON hive_profiles(is_premium);

-- =====================================================
-- ROW LEVEL SECURITY (ako koristiš Supabase auth)
-- =====================================================

-- saves: igrač čita/piše samo svoj save
ALTER TABLE saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saves_own" ON saves
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- leaderboard: svi čitaju, svako piše samo svoje
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lb_read_all"  ON leaderboard FOR SELECT USING (true);
CREATE POLICY "lb_write_own" ON leaderboard FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "lb_update_own" ON leaderboard FOR UPDATE USING (auth.uid() = id);

-- pvp_snapshots: svi čitaju, svako piše samo svoje
ALTER TABLE pvp_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pvp_read_all"   ON pvp_snapshots FOR SELECT USING (true);
CREATE POLICY "pvp_write_own"  ON pvp_snapshots FOR INSERT WITH CHECK (true);
CREATE POLICY "pvp_update_own" ON pvp_snapshots FOR UPDATE USING (true);

-- hive_profiles: anon može upsert (HIVE login nema auth.uid)
ALTER TABLE hive_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hive_read_all"  ON hive_profiles FOR SELECT USING (true);
CREATE POLICY "hive_write_all" ON hive_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "hive_update_all" ON hive_profiles FOR UPDATE USING (true);

-- =====================================================
-- GOTOVO — baza je spremna
-- =====================================================
