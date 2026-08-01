-- ============================================================
-- HIVE GALAXY â€” APSOLUTNA ZASTITA SAVE-OVA
-- 1) players + player_*: anon/auth = SAMO SELECT (pisanje iskljucivo
--    preko service role => edge funkcija game-save i admin alat
-- 2) player_save_history: append-only arhiva svakog stanja prije
--    overwrite-a (vrati se na bilo koju prethodnu verziju)
-- ============================================================

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_players ON public.players;
DROP POLICY IF EXISTS anon_update_players ON public.players;
DROP POLICY IF EXISTS anon_delete_players ON public.players;
DROP POLICY IF EXISTS authenticated_insert_players ON public.players;
DROP POLICY IF EXISTS authenticated_update_players ON public.players;
DROP POLICY IF EXISTS authenticated_delete_players ON public.players;
CREATE POLICY anon_select_players ON public.players FOR SELECT USING (true);

ALTER TABLE public.player_resources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_resources ON public.player_resources;
DROP POLICY IF EXISTS anon_update_player_resources ON public.player_resources;
DROP POLICY IF EXISTS anon_delete_player_resources ON public.player_resources;
DROP POLICY IF EXISTS authenticated_insert_player_resources ON public.player_resources;
DROP POLICY IF EXISTS authenticated_update_player_resources ON public.player_resources;
DROP POLICY IF EXISTS authenticated_delete_player_resources ON public.player_resources;
CREATE POLICY anon_select_player_resources ON public.player_resources FOR SELECT USING (true);

ALTER TABLE public.player_buildings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_buildings ON public.player_buildings;
DROP POLICY IF EXISTS anon_update_player_buildings ON public.player_buildings;
DROP POLICY IF EXISTS anon_delete_player_buildings ON public.player_buildings;
DROP POLICY IF EXISTS authenticated_insert_player_buildings ON public.player_buildings;
DROP POLICY IF EXISTS authenticated_update_player_buildings ON public.player_buildings;
DROP POLICY IF EXISTS authenticated_delete_player_buildings ON public.player_buildings;
CREATE POLICY anon_select_player_buildings ON public.player_buildings FOR SELECT USING (true);

ALTER TABLE public.player_research ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_research ON public.player_research;
DROP POLICY IF EXISTS anon_update_player_research ON public.player_research;
DROP POLICY IF EXISTS anon_delete_player_research ON public.player_research;
DROP POLICY IF EXISTS authenticated_insert_player_research ON public.player_research;
DROP POLICY IF EXISTS authenticated_update_player_research ON public.player_research;
DROP POLICY IF EXISTS authenticated_delete_player_research ON public.player_research;
CREATE POLICY anon_select_player_research ON public.player_research FOR SELECT USING (true);

ALTER TABLE public.player_commander ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_commander ON public.player_commander;
DROP POLICY IF EXISTS anon_update_player_commander ON public.player_commander;
DROP POLICY IF EXISTS anon_delete_player_commander ON public.player_commander;
DROP POLICY IF EXISTS authenticated_insert_player_commander ON public.player_commander;
DROP POLICY IF EXISTS authenticated_update_player_commander ON public.player_commander;
DROP POLICY IF EXISTS authenticated_delete_player_commander ON public.player_commander;
CREATE POLICY anon_select_player_commander ON public.player_commander FOR SELECT USING (true);

ALTER TABLE public.player_fleet ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_fleet ON public.player_fleet;
DROP POLICY IF EXISTS anon_update_player_fleet ON public.player_fleet;
DROP POLICY IF EXISTS anon_delete_player_fleet ON public.player_fleet;
DROP POLICY IF EXISTS authenticated_insert_player_fleet ON public.player_fleet;
DROP POLICY IF EXISTS authenticated_update_player_fleet ON public.player_fleet;
DROP POLICY IF EXISTS authenticated_delete_player_fleet ON public.player_fleet;
CREATE POLICY anon_select_player_fleet ON public.player_fleet FOR SELECT USING (true);

ALTER TABLE public.player_hangar ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_hangar ON public.player_hangar;
DROP POLICY IF EXISTS anon_update_player_hangar ON public.player_hangar;
DROP POLICY IF EXISTS anon_delete_player_hangar ON public.player_hangar;
DROP POLICY IF EXISTS authenticated_insert_player_hangar ON public.player_hangar;
DROP POLICY IF EXISTS authenticated_update_player_hangar ON public.player_hangar;
DROP POLICY IF EXISTS authenticated_delete_player_hangar ON public.player_hangar;
CREATE POLICY anon_select_player_hangar ON public.player_hangar FOR SELECT USING (true);

ALTER TABLE public.player_ship_designs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_ship_designs ON public.player_ship_designs;
DROP POLICY IF EXISTS anon_update_player_ship_designs ON public.player_ship_designs;
DROP POLICY IF EXISTS anon_delete_player_ship_designs ON public.player_ship_designs;
DROP POLICY IF EXISTS authenticated_insert_player_ship_designs ON public.player_ship_designs;
DROP POLICY IF EXISTS authenticated_update_player_ship_designs ON public.player_ship_designs;
DROP POLICY IF EXISTS authenticated_delete_player_ship_designs ON public.player_ship_designs;
CREATE POLICY anon_select_player_ship_designs ON public.player_ship_designs FOR SELECT USING (true);

ALTER TABLE public.player_blueprints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_blueprints ON public.player_blueprints;
DROP POLICY IF EXISTS anon_update_player_blueprints ON public.player_blueprints;
DROP POLICY IF EXISTS anon_delete_player_blueprints ON public.player_blueprints;
DROP POLICY IF EXISTS authenticated_insert_player_blueprints ON public.player_blueprints;
DROP POLICY IF EXISTS authenticated_update_player_blueprints ON public.player_blueprints;
DROP POLICY IF EXISTS authenticated_delete_player_blueprints ON public.player_blueprints;
CREATE POLICY anon_select_player_blueprints ON public.player_blueprints FOR SELECT USING (true);

ALTER TABLE public.player_blueprint_fragments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_blueprint_fragments ON public.player_blueprint_fragments;
DROP POLICY IF EXISTS anon_update_player_blueprint_fragments ON public.player_blueprint_fragments;
DROP POLICY IF EXISTS anon_delete_player_blueprint_fragments ON public.player_blueprint_fragments;
DROP POLICY IF EXISTS authenticated_insert_player_blueprint_fragments ON public.player_blueprint_fragments;
DROP POLICY IF EXISTS authenticated_update_player_blueprint_fragments ON public.player_blueprint_fragments;
DROP POLICY IF EXISTS authenticated_delete_player_blueprint_fragments ON public.player_blueprint_fragments;
CREATE POLICY anon_select_player_blueprint_fragments ON public.player_blueprint_fragments FOR SELECT USING (true);

ALTER TABLE public.player_commanders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_commanders ON public.player_commanders;
DROP POLICY IF EXISTS anon_update_player_commanders ON public.player_commanders;
DROP POLICY IF EXISTS anon_delete_player_commanders ON public.player_commanders;
DROP POLICY IF EXISTS authenticated_insert_player_commanders ON public.player_commanders;
DROP POLICY IF EXISTS authenticated_update_player_commanders ON public.player_commanders;
DROP POLICY IF EXISTS authenticated_delete_player_commanders ON public.player_commanders;
CREATE POLICY anon_select_player_commanders ON public.player_commanders FOR SELECT USING (true);

ALTER TABLE public.player_deployed_commanders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_deployed_commanders ON public.player_deployed_commanders;
DROP POLICY IF EXISTS anon_update_player_deployed_commanders ON public.player_deployed_commanders;
DROP POLICY IF EXISTS anon_delete_player_deployed_commanders ON public.player_deployed_commanders;
DROP POLICY IF EXISTS authenticated_insert_player_deployed_commanders ON public.player_deployed_commanders;
DROP POLICY IF EXISTS authenticated_update_player_deployed_commanders ON public.player_deployed_commanders;
DROP POLICY IF EXISTS authenticated_delete_player_deployed_commanders ON public.player_deployed_commanders;
CREATE POLICY anon_select_player_deployed_commanders ON public.player_deployed_commanders FOR SELECT USING (true);

ALTER TABLE public.player_colonies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_colonies ON public.player_colonies;
DROP POLICY IF EXISTS anon_update_player_colonies ON public.player_colonies;
DROP POLICY IF EXISTS anon_delete_player_colonies ON public.player_colonies;
DROP POLICY IF EXISTS authenticated_insert_player_colonies ON public.player_colonies;
DROP POLICY IF EXISTS authenticated_update_player_colonies ON public.player_colonies;
DROP POLICY IF EXISTS authenticated_delete_player_colonies ON public.player_colonies;
CREATE POLICY anon_select_player_colonies ON public.player_colonies FOR SELECT USING (true);

ALTER TABLE public.player_instance_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_instance_progress ON public.player_instance_progress;
DROP POLICY IF EXISTS anon_update_player_instance_progress ON public.player_instance_progress;
DROP POLICY IF EXISTS anon_delete_player_instance_progress ON public.player_instance_progress;
DROP POLICY IF EXISTS authenticated_insert_player_instance_progress ON public.player_instance_progress;
DROP POLICY IF EXISTS authenticated_update_player_instance_progress ON public.player_instance_progress;
DROP POLICY IF EXISTS authenticated_delete_player_instance_progress ON public.player_instance_progress;
CREATE POLICY anon_select_player_instance_progress ON public.player_instance_progress FOR SELECT USING (true);

ALTER TABLE public.player_missions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_missions ON public.player_missions;
DROP POLICY IF EXISTS anon_update_player_missions ON public.player_missions;
DROP POLICY IF EXISTS anon_delete_player_missions ON public.player_missions;
DROP POLICY IF EXISTS authenticated_insert_player_missions ON public.player_missions;
DROP POLICY IF EXISTS authenticated_update_player_missions ON public.player_missions;
DROP POLICY IF EXISTS authenticated_delete_player_missions ON public.player_missions;
CREATE POLICY anon_select_player_missions ON public.player_missions FOR SELECT USING (true);

ALTER TABLE public.player_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_achievements ON public.player_achievements;
DROP POLICY IF EXISTS anon_update_player_achievements ON public.player_achievements;
DROP POLICY IF EXISTS anon_delete_player_achievements ON public.player_achievements;
DROP POLICY IF EXISTS authenticated_insert_player_achievements ON public.player_achievements;
DROP POLICY IF EXISTS authenticated_update_player_achievements ON public.player_achievements;
DROP POLICY IF EXISTS authenticated_delete_player_achievements ON public.player_achievements;
CREATE POLICY anon_select_player_achievements ON public.player_achievements FOR SELECT USING (true);

ALTER TABLE public.player_artifacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_artifacts ON public.player_artifacts;
DROP POLICY IF EXISTS anon_update_player_artifacts ON public.player_artifacts;
DROP POLICY IF EXISTS anon_delete_player_artifacts ON public.player_artifacts;
DROP POLICY IF EXISTS authenticated_insert_player_artifacts ON public.player_artifacts;
DROP POLICY IF EXISTS authenticated_update_player_artifacts ON public.player_artifacts;
DROP POLICY IF EXISTS authenticated_delete_player_artifacts ON public.player_artifacts;
CREATE POLICY anon_select_player_artifacts ON public.player_artifacts FOR SELECT USING (true);

ALTER TABLE public.player_pvp ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_pvp ON public.player_pvp;
DROP POLICY IF EXISTS anon_update_player_pvp ON public.player_pvp;
DROP POLICY IF EXISTS anon_delete_player_pvp ON public.player_pvp;
DROP POLICY IF EXISTS authenticated_insert_player_pvp ON public.player_pvp;
DROP POLICY IF EXISTS authenticated_update_player_pvp ON public.player_pvp;
DROP POLICY IF EXISTS authenticated_delete_player_pvp ON public.player_pvp;
CREATE POLICY anon_select_player_pvp ON public.player_pvp FOR SELECT USING (true);

ALTER TABLE public.player_espionage ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_espionage ON public.player_espionage;
DROP POLICY IF EXISTS anon_update_player_espionage ON public.player_espionage;
DROP POLICY IF EXISTS anon_delete_player_espionage ON public.player_espionage;
DROP POLICY IF EXISTS authenticated_insert_player_espionage ON public.player_espionage;
DROP POLICY IF EXISTS authenticated_update_player_espionage ON public.player_espionage;
DROP POLICY IF EXISTS authenticated_delete_player_espionage ON public.player_espionage;
CREATE POLICY anon_select_player_espionage ON public.player_espionage FOR SELECT USING (true);

ALTER TABLE public.player_formations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_formations ON public.player_formations;
DROP POLICY IF EXISTS anon_update_player_formations ON public.player_formations;
DROP POLICY IF EXISTS anon_delete_player_formations ON public.player_formations;
DROP POLICY IF EXISTS authenticated_insert_player_formations ON public.player_formations;
DROP POLICY IF EXISTS authenticated_update_player_formations ON public.player_formations;
DROP POLICY IF EXISTS authenticated_delete_player_formations ON public.player_formations;
CREATE POLICY anon_select_player_formations ON public.player_formations FOR SELECT USING (true);

ALTER TABLE public.player_recycle_queue ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_recycle_queue ON public.player_recycle_queue;
DROP POLICY IF EXISTS anon_update_player_recycle_queue ON public.player_recycle_queue;
DROP POLICY IF EXISTS anon_delete_player_recycle_queue ON public.player_recycle_queue;
DROP POLICY IF EXISTS authenticated_insert_player_recycle_queue ON public.player_recycle_queue;
DROP POLICY IF EXISTS authenticated_update_player_recycle_queue ON public.player_recycle_queue;
DROP POLICY IF EXISTS authenticated_delete_player_recycle_queue ON public.player_recycle_queue;
CREATE POLICY anon_select_player_recycle_queue ON public.player_recycle_queue FOR SELECT USING (true);

ALTER TABLE public.player_build_queue ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_build_queue ON public.player_build_queue;
DROP POLICY IF EXISTS anon_update_player_build_queue ON public.player_build_queue;
DROP POLICY IF EXISTS anon_delete_player_build_queue ON public.player_build_queue;
DROP POLICY IF EXISTS authenticated_insert_player_build_queue ON public.player_build_queue;
DROP POLICY IF EXISTS authenticated_update_player_build_queue ON public.player_build_queue;
DROP POLICY IF EXISTS authenticated_delete_player_build_queue ON public.player_build_queue;
CREATE POLICY anon_select_player_build_queue ON public.player_build_queue FOR SELECT USING (true);

ALTER TABLE public.player_pack_pity ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_pack_pity ON public.player_pack_pity;
DROP POLICY IF EXISTS anon_update_player_pack_pity ON public.player_pack_pity;
DROP POLICY IF EXISTS anon_delete_player_pack_pity ON public.player_pack_pity;
DROP POLICY IF EXISTS authenticated_insert_player_pack_pity ON public.player_pack_pity;
DROP POLICY IF EXISTS authenticated_update_player_pack_pity ON public.player_pack_pity;
DROP POLICY IF EXISTS authenticated_delete_player_pack_pity ON public.player_pack_pity;
CREATE POLICY anon_select_player_pack_pity ON public.player_pack_pity FOR SELECT USING (true);

ALTER TABLE public.player_conquered_planets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_conquered_planets ON public.player_conquered_planets;
DROP POLICY IF EXISTS anon_update_player_conquered_planets ON public.player_conquered_planets;
DROP POLICY IF EXISTS anon_delete_player_conquered_planets ON public.player_conquered_planets;
DROP POLICY IF EXISTS authenticated_insert_player_conquered_planets ON public.player_conquered_planets;
DROP POLICY IF EXISTS authenticated_update_player_conquered_planets ON public.player_conquered_planets;
DROP POLICY IF EXISTS authenticated_delete_player_conquered_planets ON public.player_conquered_planets;
CREATE POLICY anon_select_player_conquered_planets ON public.player_conquered_planets FOR SELECT USING (true);

ALTER TABLE public.player_jump_gate_cooldowns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_jump_gate_cooldowns ON public.player_jump_gate_cooldowns;
DROP POLICY IF EXISTS anon_update_player_jump_gate_cooldowns ON public.player_jump_gate_cooldowns;
DROP POLICY IF EXISTS anon_delete_player_jump_gate_cooldowns ON public.player_jump_gate_cooldowns;
DROP POLICY IF EXISTS authenticated_insert_player_jump_gate_cooldowns ON public.player_jump_gate_cooldowns;
DROP POLICY IF EXISTS authenticated_update_player_jump_gate_cooldowns ON public.player_jump_gate_cooldowns;
DROP POLICY IF EXISTS authenticated_delete_player_jump_gate_cooldowns ON public.player_jump_gate_cooldowns;
CREATE POLICY anon_select_player_jump_gate_cooldowns ON public.player_jump_gate_cooldowns FOR SELECT USING (true);

ALTER TABLE public.player_boss_cooldowns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_boss_cooldowns ON public.player_boss_cooldowns;
DROP POLICY IF EXISTS anon_update_player_boss_cooldowns ON public.player_boss_cooldowns;
DROP POLICY IF EXISTS anon_delete_player_boss_cooldowns ON public.player_boss_cooldowns;
DROP POLICY IF EXISTS authenticated_insert_player_boss_cooldowns ON public.player_boss_cooldowns;
DROP POLICY IF EXISTS authenticated_update_player_boss_cooldowns ON public.player_boss_cooldowns;
DROP POLICY IF EXISTS authenticated_delete_player_boss_cooldowns ON public.player_boss_cooldowns;
CREATE POLICY anon_select_player_boss_cooldowns ON public.player_boss_cooldowns FOR SELECT USING (true);

ALTER TABLE public.player_drop_pity ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_drop_pity ON public.player_drop_pity;
DROP POLICY IF EXISTS anon_update_player_drop_pity ON public.player_drop_pity;
DROP POLICY IF EXISTS anon_delete_player_drop_pity ON public.player_drop_pity;
DROP POLICY IF EXISTS authenticated_insert_player_drop_pity ON public.player_drop_pity;
DROP POLICY IF EXISTS authenticated_update_player_drop_pity ON public.player_drop_pity;
DROP POLICY IF EXISTS authenticated_delete_player_drop_pity ON public.player_drop_pity;
CREATE POLICY anon_select_player_drop_pity ON public.player_drop_pity FOR SELECT USING (true);

ALTER TABLE public.player_misc_state ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_misc_state ON public.player_misc_state;
DROP POLICY IF EXISTS anon_update_player_misc_state ON public.player_misc_state;
DROP POLICY IF EXISTS anon_delete_player_misc_state ON public.player_misc_state;
DROP POLICY IF EXISTS authenticated_insert_player_misc_state ON public.player_misc_state;
DROP POLICY IF EXISTS authenticated_update_player_misc_state ON public.player_misc_state;
DROP POLICY IF EXISTS authenticated_delete_player_misc_state ON public.player_misc_state;
CREATE POLICY anon_select_player_misc_state ON public.player_misc_state FOR SELECT USING (true);

ALTER TABLE public.player_defenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_player_defenses ON public.player_defenses;
DROP POLICY IF EXISTS anon_update_player_defenses ON public.player_defenses;
DROP POLICY IF EXISTS anon_delete_player_defenses ON public.player_defenses;
DROP POLICY IF EXISTS authenticated_insert_player_defenses ON public.player_defenses;
DROP POLICY IF EXISTS authenticated_update_player_defenses ON public.player_defenses;
DROP POLICY IF EXISTS authenticated_delete_player_defenses ON public.player_defenses;
CREATE POLICY anon_select_player_defenses ON public.player_defenses FOR SELECT USING (true);

ALTER TABLE public.hive_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_hive_profiles ON public.hive_profiles;
DROP POLICY IF EXISTS anon_update_hive_profiles ON public.hive_profiles;
DROP POLICY IF EXISTS anon_delete_hive_profiles ON public.hive_profiles;
DROP POLICY IF EXISTS anon_select_hive_profiles ON public.hive_profiles;
CREATE POLICY anon_select_hive_profiles ON public.hive_profiles FOR SELECT USING (true);

ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_leaderboard ON public.leaderboard;
DROP POLICY IF EXISTS anon_update_leaderboard ON public.leaderboard;
DROP POLICY IF EXISTS anon_delete_leaderboard ON public.leaderboard;
DROP POLICY IF EXISTS anon_select_leaderboard ON public.leaderboard;
CREATE POLICY anon_select_leaderboard ON public.leaderboard FOR SELECT USING (true);

ALTER TABLE public.pvp_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_pvp_snapshots ON public.pvp_snapshots;
DROP POLICY IF EXISTS anon_update_pvp_snapshots ON public.pvp_snapshots;
DROP POLICY IF EXISTS anon_delete_pvp_snapshots ON public.pvp_snapshots;
DROP POLICY IF EXISTS anon_select_pvp_snapshots ON public.pvp_snapshots;
CREATE POLICY anon_select_pvp_snapshots ON public.pvp_snapshots FOR SELECT USING (true);

ALTER TABLE public.premium_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_insert_premium_users ON public.premium_users;
DROP POLICY IF EXISTS anon_update_premium_users ON public.premium_users;
DROP POLICY IF EXISTS anon_delete_premium_users ON public.premium_users;
DROP POLICY IF EXISTS anon_select_premium_users ON public.premium_users;
CREATE POLICY anon_select_premium_users ON public.premium_users FOR SELECT USING (true);

ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_all_withdrawals ON public.withdrawals;
DROP POLICY IF EXISTS anon_delete_withdrawals ON public.withdrawals;
DROP POLICY IF EXISTS anon_update_withdrawals ON public.withdrawals;
CREATE POLICY anon_select_withdrawals ON public.withdrawals FOR SELECT USING (true);
CREATE POLICY anon_insert_withdrawals ON public.withdrawals FOR INSERT WITH CHECK (true);

ALTER TABLE public.season_archives ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.player_save_history (
  player_id text NOT NULL,
  saved_at timestamptz NOT NULL DEFAULT now(),
  snapshot jsonb NOT NULL,
  reason text,
  PRIMARY KEY (player_id, saved_at)
);
ALTER TABLE public.player_save_history ENABLE ROW LEVEL SECURITY;
