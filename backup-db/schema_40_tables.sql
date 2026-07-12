-- ============================================================
-- HIVE GALAXY — Kompletna Supabase/Postgres šema
-- 40 tabela, sve FK referenciraju players(id) ON DELETE CASCADE
-- ============================================================

-- ============================================================
-- 1. CORE — IGRAČI
-- ============================================================

CREATE TABLE players (
  id          TEXT PRIMARY KEY,        -- UUID (email) ili 'hive_username' (hive)
  player_type TEXT NOT NULL CHECK (player_type IN ('email', 'hive')),
  username    TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  last_seen   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE profiles (
  id          TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  email       TEXT UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE hive_profiles (
  id          TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  is_premium  BOOLEAN DEFAULT false,
  boosters    JSONB DEFAULT '{}',
  last_seen   TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. PLAYER GAME STATE
-- ============================================================

CREATE TABLE player_resources (
  player_id     TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  metal         NUMERIC DEFAULT 0,
  crystal       NUMERIC DEFAULT 0,
  he3           NUMERIC DEFAULT 0,
  energy        NUMERIC DEFAULT 100,
  score         BIGINT  DEFAULT 0,
  bcm           NUMERIC DEFAULT 0,
  bocrypto      NUMERIC DEFAULT 0,
  spcard        NUMERIC DEFAULT 0,
  keys_cmd      INT     DEFAULT 0,
  keys_inst     INT     DEFAULT 0,
  storage_buffer JSONB  DEFAULT '{"metal":0,"crystal":0,"he3":0}',
  total_metal_mined    NUMERIC DEFAULT 0,
  total_depot_pickups  INT     DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_buildings (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  buildings   JSONB NOT NULL DEFAULT '{}',  -- { hq: {level:1}, metal_mine: {level:1}, ... }
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_research (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  research    JSONB NOT NULL DEFAULT '{}',  -- { mining_metal: {level:0}, ... }
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_commander (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  level       INT     DEFAULT 1,
  exp         NUMERIC DEFAULT 0,
  next_exp    NUMERIC DEFAULT 1000,
  title       TEXT    DEFAULT 'Kadet',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_fleet (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  fleet       JSONB NOT NULL DEFAULT '[null,null,null,null,null,null,null,null,null]',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_hangar (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  hangar      JSONB NOT NULL DEFAULT '[]',  -- [{ design_id, count }]
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_ship_designs (
  player_id    TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  designs      JSONB NOT NULL DEFAULT '[]',
  extra_slots  INT DEFAULT 0,
  slots_bought INT DEFAULT 0,
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_defenses (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  defenses    JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_blueprints (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  owned       JSONB NOT NULL DEFAULT '{}',  -- { item_id: true/false }
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_blueprint_fragments (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  fragments   JSONB NOT NULL DEFAULT '{}',  -- { item_id: count }
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_commanders (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  owned       JSONB NOT NULL DEFAULT '[]',  -- lista posjedovanih komandira
  active_id   TEXT,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_deployed_commanders (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  deployed    JSONB NOT NULL DEFAULT '[]',  -- komandiri raspoređeni po flotama
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_colonies (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  colonies    JSONB NOT NULL DEFAULT '[]',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_instance_progress (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  progress    JSONB NOT NULL DEFAULT '{}',  -- { [instanceId]: { completed, clear_count, ... } }
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_missions (
  player_id        TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  mission_state    JSONB NOT NULL DEFAULT '{}',
  mission_counters JSONB NOT NULL DEFAULT '{}',  -- dailyInst, dailyPvp, weeklyPvp, itd.
  mission_targets  JSONB NOT NULL DEFAULT '{}',  -- weekly mission target values
  story_missions   JSONB NOT NULL DEFAULT '[]',
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_achievements (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  achieves    JSONB NOT NULL DEFAULT '[]',
  state       JSONB NOT NULL DEFAULT '{}',
  tracking    JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_artifacts (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  fragments   JSONB NOT NULL DEFAULT '{}',  -- { art_1: 5, art_2: 3, ... } po vrsti artefakta
  state       JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_pvp (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  wins        INT DEFAULT 0,
  losses      INT DEFAULT 0,
  rating      INT DEFAULT 1000,
  win_streak  INT DEFAULT 0,
  history     JSONB NOT NULL DEFAULT '[]',
  shield      JSONB DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_espionage (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  drones      INT DEFAULT 0,
  reports     JSONB NOT NULL DEFAULT '[]',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_formations (
  player_id        TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  active_formation INT DEFAULT 0,
  formation_slots  JSONB NOT NULL DEFAULT '[null,null,null,null,null,null,null,null,null]',
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_recycle_queue (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  queue       JSONB NOT NULL DEFAULT '[]',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_build_queue (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  queue       JSONB NOT NULL DEFAULT '[]',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_pack_pity (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  pity        JSONB NOT NULL DEFAULT '{}',
  pulls       JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_conquered_planets (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  planets     JSONB NOT NULL DEFAULT '[]',
  fleet_reward JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_jump_gate_cooldowns (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  cooldowns   JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_boss_cooldowns (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  cooldowns   JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_drop_pity (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  pity        JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE player_misc_state (
  player_id        TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  starter_given    BOOLEAN DEFAULT false,
  fleet_position   JSONB,
  viewing_cmd_id   TEXT,
  card_ability_cooldowns JSONB DEFAULT '{}',
  cmd_cooldowns         JSONB DEFAULT '{}',
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. GLOBALNE / ZAJEDNIČKE TABELE
-- ============================================================

CREATE TABLE leaderboard (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  username    TEXT NOT NULL,
  score       BIGINT DEFAULT 0,
  level       INT DEFAULT 1,
  is_premium  BOOLEAN DEFAULT false,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pvp_snapshots (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  username    TEXT NOT NULL,
  rating      INT DEFAULT 1000,
  level       INT DEFAULT 1,
  power       BIGINT DEFAULT 0,
  fleet       JSONB,
  commanders  JSONB,
  resources   JSONB,
  is_premium  BOOLEAN DEFAULT false,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE premium_users (
  player_id   TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  expires_at  TIMESTAMPTZ,
  granted_by  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE withdrawals (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id     TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  username      TEXT NOT NULL,
  token         TEXT NOT NULL,
  amount        NUMERIC NOT NULL,
  gas_amount    NUMERIC DEFAULT 0,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','completed','rejected')),
  tx_id         TEXT,
  requested_at  TIMESTAMPTZ DEFAULT now(),
  processed_at  TIMESTAMPTZ
);

CREATE TABLE deposits (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id     TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  token         TEXT NOT NULL,
  amount        NUMERIC NOT NULL,
  tx_id         TEXT,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','rejected')),
  memo          TEXT,
  processed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE transactions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id   TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('deposit','withdraw','purchase','admin_grant')),
  token       TEXT NOT NULL,        -- 'BCM', 'BOCRYPTO', 'BPW'
  amount      NUMERIC NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE purchases (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id         TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  username          TEXT NOT NULL,
  item_type         TEXT NOT NULL,   -- 'premium', 'bcm_pack', 'commander_pack'
  amount_paid       NUMERIC,
  currency          TEXT,
  payment_provider  TEXT,
  payment_id        TEXT,
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE season_archives (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  season        INT NOT NULL,
  leaderboard   JSONB NOT NULL,
  archived_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE events_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id   TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  event_id    TEXT NOT NULL,
  event_type  TEXT NOT NULL,
  result      TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE battle_logs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attacker_id   TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  defender_id   TEXT REFERENCES players(id) ON DELETE CASCADE,  -- NULL ako je PvE (instanca)
  battle_type   TEXT NOT NULL,  -- 'pvp', 'instance', 'galaxy'
  status        TEXT NOT NULL,  -- 'victory', 'defeat', 'draw'
  log_data      JSONB,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE alliances (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT UNIQUE NOT NULL,
  owner_id    TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE alliance_members (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alliance_id   UUID NOT NULL REFERENCES alliances(id) ON DELETE CASCADE,
  player_id     TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  role          TEXT DEFAULT 'member' CHECK (role IN ('owner','officer','member')),
  joined_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE (alliance_id, player_id)
);

-- ============================================================
-- INDEKSI — za performanse na velikoj skali
-- ============================================================

CREATE INDEX idx_leaderboard_score       ON leaderboard (score DESC);
CREATE INDEX idx_pvp_snapshots_rating    ON pvp_snapshots (rating DESC);
CREATE INDEX idx_withdrawals_player      ON withdrawals (player_id);
CREATE INDEX idx_withdrawals_status      ON withdrawals (status);
CREATE INDEX idx_transactions_player     ON transactions (player_id);
CREATE INDEX idx_purchases_player        ON purchases (player_id);
CREATE INDEX idx_events_log_player       ON events_log (player_id);
CREATE INDEX idx_battle_logs_attacker    ON battle_logs (attacker_id);
CREATE INDEX idx_battle_logs_defender    ON battle_logs (defender_id);
CREATE INDEX idx_alliance_members_player ON alliance_members (player_id);
CREATE INDEX idx_alliance_members_alliance ON alliance_members (alliance_id);

-- ============================================================
-- RLS POLITIKE
-- NAPOMENA: hive_ igrači nemaju auth.uid() (nisu prošli Supabase Auth),
-- pa "svoj_id" provjera za njih NE radi sa standardnim auth.uid().
-- Za hive igrače sigurnost mora ići kroz Edge Function sa service_role
-- key-em (server-side), NE kroz anon key direktno iz browsera.
-- Politike ispod su ispravne za EMAIL igrače (auth.uid() = player_id).
-- Za hive igrače, ili koristi custom JWT claim, ili ruti sve njihove
-- write operacije kroz Edge Functions.
-- ============================================================

-- Helper: provjera da je trenutni korisnik vlasnik reda
-- (radi za email igrače; hive igrači idu kroz Edge Function)

-- ── PLAYERS ──
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
CREATE POLICY players_select_all ON players FOR SELECT USING (true);
CREATE POLICY players_update_own ON players FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY players_insert_own ON players FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = id);

-- ── PROFILES (email) ──
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY profiles_insert_own ON profiles FOR INSERT WITH CHECK (auth.uid()::text = id);

-- ── HIVE_PROFILES (service_role only za write — vidi napomenu gore) ──
ALTER TABLE hive_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY hive_profiles_select_all ON hive_profiles FOR SELECT USING (true);
CREATE POLICY hive_profiles_service_write ON hive_profiles FOR ALL TO service_role USING (true);

-- ── PLAYER GAME STATE TABELE (isti pattern za sve) ──
-- Email: auth.uid() = player_id.  Hive: service_role only.

ALTER TABLE player_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_resources_own ON player_resources FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_resources_service ON player_resources FOR ALL TO service_role USING (true);

ALTER TABLE player_buildings ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_buildings_own ON player_buildings FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_buildings_service ON player_buildings FOR ALL TO service_role USING (true);

ALTER TABLE player_research ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_research_own ON player_research FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_research_service ON player_research FOR ALL TO service_role USING (true);

ALTER TABLE player_commander ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_commander_own ON player_commander FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_commander_service ON player_commander FOR ALL TO service_role USING (true);

ALTER TABLE player_fleet ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_fleet_own ON player_fleet FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_fleet_service ON player_fleet FOR ALL TO service_role USING (true);

ALTER TABLE player_hangar ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_hangar_own ON player_hangar FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_hangar_service ON player_hangar FOR ALL TO service_role USING (true);

ALTER TABLE player_ship_designs ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_ship_designs_own ON player_ship_designs FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_ship_designs_service ON player_ship_designs FOR ALL TO service_role USING (true);

ALTER TABLE player_defenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_defenses_own ON player_defenses FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_defenses_service ON player_defenses FOR ALL TO service_role USING (true);

ALTER TABLE player_blueprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_blueprints_own ON player_blueprints FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_blueprints_service ON player_blueprints FOR ALL TO service_role USING (true);

ALTER TABLE player_blueprint_fragments ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_blueprint_fragments_own ON player_blueprint_fragments FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_blueprint_fragments_service ON player_blueprint_fragments FOR ALL TO service_role USING (true);

ALTER TABLE player_commanders ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_commanders_own ON player_commanders FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_commanders_service ON player_commanders FOR ALL TO service_role USING (true);

ALTER TABLE player_deployed_commanders ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_deployed_commanders_own ON player_deployed_commanders FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_deployed_commanders_service ON player_deployed_commanders FOR ALL TO service_role USING (true);

ALTER TABLE player_colonies ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_colonies_own ON player_colonies FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_colonies_service ON player_colonies FOR ALL TO service_role USING (true);

ALTER TABLE player_instance_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_instance_progress_own ON player_instance_progress FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_instance_progress_service ON player_instance_progress FOR ALL TO service_role USING (true);

ALTER TABLE player_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_missions_own ON player_missions FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_missions_service ON player_missions FOR ALL TO service_role USING (true);

ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_achievements_own ON player_achievements FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_achievements_service ON player_achievements FOR ALL TO service_role USING (true);

ALTER TABLE player_artifacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_artifacts_own ON player_artifacts FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_artifacts_service ON player_artifacts FOR ALL TO service_role USING (true);

ALTER TABLE player_pvp ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_pvp_own ON player_pvp FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_pvp_service ON player_pvp FOR ALL TO service_role USING (true);

ALTER TABLE player_espionage ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_espionage_own ON player_espionage FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_espionage_service ON player_espionage FOR ALL TO service_role USING (true);

ALTER TABLE player_formations ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_formations_own ON player_formations FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_formations_service ON player_formations FOR ALL TO service_role USING (true);

ALTER TABLE player_recycle_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_recycle_queue_own ON player_recycle_queue FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_recycle_queue_service ON player_recycle_queue FOR ALL TO service_role USING (true);

ALTER TABLE player_build_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_build_queue_own ON player_build_queue FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_build_queue_service ON player_build_queue FOR ALL TO service_role USING (true);

ALTER TABLE player_pack_pity ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_pack_pity_own ON player_pack_pity FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_pack_pity_service ON player_pack_pity FOR ALL TO service_role USING (true);

ALTER TABLE player_conquered_planets ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_conquered_planets_own ON player_conquered_planets FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_conquered_planets_service ON player_conquered_planets FOR ALL TO service_role USING (true);

ALTER TABLE player_jump_gate_cooldowns ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_jump_gate_cooldowns_own ON player_jump_gate_cooldowns FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_jump_gate_cooldowns_service ON player_jump_gate_cooldowns FOR ALL TO service_role USING (true);

ALTER TABLE player_boss_cooldowns ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_boss_cooldowns_own ON player_boss_cooldowns FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_boss_cooldowns_service ON player_boss_cooldowns FOR ALL TO service_role USING (true);

ALTER TABLE player_drop_pity ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_drop_pity_own ON player_drop_pity FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_drop_pity_service ON player_drop_pity FOR ALL TO service_role USING (true);

ALTER TABLE player_misc_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY player_misc_state_own ON player_misc_state FOR ALL USING (auth.uid()::text = player_id);
CREATE POLICY player_misc_state_service ON player_misc_state FOR ALL TO service_role USING (true);

-- ── GLOBALNE / ZAJEDNIČKE TABELE ──

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY leaderboard_select_all ON leaderboard FOR SELECT USING (true);
CREATE POLICY leaderboard_write_own  ON leaderboard FOR INSERT WITH CHECK (auth.uid()::text = player_id);
CREATE POLICY leaderboard_update_own ON leaderboard FOR UPDATE USING (auth.uid()::text = player_id);
CREATE POLICY leaderboard_service    ON leaderboard FOR ALL TO service_role USING (true);

ALTER TABLE pvp_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY pvp_snapshots_select_all ON pvp_snapshots FOR SELECT USING (true);
CREATE POLICY pvp_snapshots_write_own  ON pvp_snapshots FOR INSERT WITH CHECK (auth.uid()::text = player_id);
CREATE POLICY pvp_snapshots_update_own ON pvp_snapshots FOR UPDATE USING (auth.uid()::text = player_id);
CREATE POLICY pvp_snapshots_service    ON pvp_snapshots FOR ALL TO service_role USING (true);

-- premium_users — write SAMO service_role (admin), nikad anon/email user direktno!
ALTER TABLE premium_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY premium_users_select_own ON premium_users FOR SELECT USING (auth.uid()::text = player_id);
CREATE POLICY premium_users_service    ON premium_users FOR ALL TO service_role USING (true);

-- deposits — insert own, update only service_role
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
CREATE POLICY deposits_select_own ON deposits FOR SELECT USING (auth.uid()::text = player_id);
CREATE POLICY deposits_insert_own ON deposits FOR INSERT WITH CHECK (auth.uid()::text = player_id);
CREATE POLICY deposits_service    ON deposits FOR ALL TO service_role USING (true);

-- withdrawals — UPDATE (approve/reject) SAMO service_role!
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY withdrawals_select_own ON withdrawals FOR SELECT USING (auth.uid()::text = player_id);
CREATE POLICY withdrawals_insert_own ON withdrawals FOR INSERT WITH CHECK (auth.uid()::text = player_id);
CREATE POLICY withdrawals_service    ON withdrawals FOR ALL TO service_role USING (true);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY transactions_select_own ON transactions FOR SELECT USING (auth.uid()::text = player_id);
CREATE POLICY transactions_service    ON transactions FOR ALL TO service_role USING (true);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY purchases_select_own ON purchases FOR SELECT USING (auth.uid()::text = player_id);
CREATE POLICY purchases_service    ON purchases FOR ALL TO service_role USING (true);

-- season_archives — read za sve, write samo service_role
ALTER TABLE season_archives ENABLE ROW LEVEL SECURITY;
CREATE POLICY season_archives_select_all ON season_archives FOR SELECT USING (true);
CREATE POLICY season_archives_service    ON season_archives FOR ALL TO service_role USING (true);

ALTER TABLE events_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY events_log_select_own ON events_log FOR SELECT USING (auth.uid()::text = player_id);
CREATE POLICY events_log_insert_own ON events_log FOR INSERT WITH CHECK (auth.uid()::text = player_id);
CREATE POLICY events_log_service    ON events_log FOR ALL TO service_role USING (true);

-- battle_logs — oba učesnika mogu vidjeti svoju borbu
ALTER TABLE battle_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY battle_logs_select_participant ON battle_logs FOR SELECT
  USING (auth.uid()::text = attacker_id OR auth.uid()::text = defender_id);
CREATE POLICY battle_logs_service ON battle_logs FOR ALL TO service_role USING (true);

ALTER TABLE alliances ENABLE ROW LEVEL SECURITY;
CREATE POLICY alliances_select_all ON alliances FOR SELECT USING (true);
CREATE POLICY alliances_update_owner ON alliances FOR UPDATE USING (auth.uid()::text = owner_id);
CREATE POLICY alliances_service ON alliances FOR ALL TO service_role USING (true);

ALTER TABLE alliance_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY alliance_members_select_all ON alliance_members FOR SELECT USING (true);
CREATE POLICY alliance_members_service    ON alliance_members FOR ALL TO service_role USING (true);
