import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { authenticate } from '../_shared/auth.ts';

const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_KEY') || '';
const SUPA_URL    = Deno.env.get('SUPABASE_URL') || 'https://exmbmwukqssvgmhysamo.supabase.co';

if (!SERVICE_KEY) console.error('[game-save] SERVICE_KEY is missing!');
const supa = createClient(SUPA_URL, SERVICE_KEY);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) });
  if (req.method !== 'POST') return err(req, 'Method not allowed', 405);

  try {
    const caller = await authenticate(req, supa);
    if (!caller) return err(req, 'Neautorizovan zahtjev', 401);

    const body = await req.json();
    const { action, data } = body;
    if (!action) return err(req, 'Nedostaje action', 400);
    // The player is always taken from the verified token, never from the request body.
    const player_id = caller.playerId;

    if (action === 'save') {
      if (!data) return err(req, 'Nedostaje data', 400);
      const errors: string[] = [];
      const u = async (table: string, payload: Record<string, unknown>) => {
        try {
          const { error } = await supa.from(table).upsert(payload);
          if (error) errors.push(`${table}: ${error.message}`);
        } catch (ex) {
          errors.push(`${table} exception: ${(ex as Error).message}`);
        }
      };
      const uu = (table: string, payload: Record<string, unknown>) => {
        const hasData = Object.entries(payload).some(([k, v]) => k !== 'player_id' && v !== undefined && v !== null);
        if (hasData) upserts.push(u(table, payload));
      };

      const R = data.R || {};
      const upserts: Promise<void>[] = [];
      try {
        const { error: pe } = await supa.from('players').upsert({ id: player_id, player_type: 'hive', username: player_id }, { onConflict: 'id' });
        if (pe) errors.push(`players: ${pe.message}`);
      } catch(pe) {
        errors.push(`players exception: ${(pe as Error).message}`);
      }
      uu('player_resources', { player_id, metal: R.metal, crystal: R.crystal, he3: R.he3, energy: R.energy, score: R.score, bcm: data.bcm, bocrypto: data.bocrypto, spcard: data.spCard, keys_cmd: data.keys_cmd, keys_inst: data.keys_inst, storage_buffer: data.storageBuffer, total_metal_mined: data.totalMetalMined, total_depot_pickups: data.totalDepotPickups });
      uu('player_buildings', { player_id, buildings: data.buildings });
      uu('player_research', { player_id, research: data.research });
      uu('player_commander', { player_id, level: data.commander?.level, exp: data.commander?.exp, next_exp: data.commander?.nextExp, title: data.commander?.title });
      uu('player_fleet', { player_id, fleet: data.fleet });
      uu('player_hangar', { player_id, hangar: data.hangar });
      uu('player_ship_designs', { player_id, designs: data.shipDesigns, extra_slots: data.designExtraSlots, slots_bought: data.designSlotsBought });
      uu('player_blueprints', { player_id, owned: data.ownedBlueprints });
      uu('player_blueprint_fragments', { player_id, fragments: data.blueprintFragments });
      uu('player_commanders', { player_id, owned: data.ownedCommanders, active_id: data.activeCommander });
      uu('player_deployed_commanders', { player_id, deployed: data.deployedCommanders });
      uu('player_colonies', { player_id, colonies: data.colonies });
      uu('player_instance_progress', { player_id, progress: data.instProgress });
      uu('player_missions', { player_id, mission_state: data.missionState, mission_counters: data.missionCounters, mission_targets: data.missionTargets, story_missions: data.dynamicStoryMissions });
      uu('player_achievements', { player_id, achieves: data.ACHIEVES, state: data.achievementState, tracking: data.achievementTracking });
      uu('player_artifacts', { player_id, fragments: data.artifactFragments, state: data.artifactState });
      uu('player_pvp', { player_id, wins: data.pvp?.wins, losses: data.pvp?.losses, rating: data.pvp?.rating, win_streak: data.pvp?.winStreak, history: data.pvp?.history, shield: data.pvpShield });
      uu('player_espionage', { player_id, drones: data.espDrones, reports: data.espReports });
      uu('player_formations', { player_id, active_formation: data.activeFormation, formation_slots: data.formationSlots });
      uu('player_recycle_queue', { player_id, queue: data.recycleQueue });
      uu('player_build_queue', { player_id, queue: data.buildQueue });
      uu('player_pack_pity', { player_id, pity: data.packPity, pulls: data.packPulls });
      uu('player_conquered_planets', { player_id, planets: data.conqueredPlanets, fleet_reward: data.colonyFleetReward });
      uu('player_jump_gate_cooldowns', { player_id, cooldowns: data.jumpGateCooldowns });
      uu('player_boss_cooldowns', { player_id, cooldowns: data.bossCooldowns });
      uu('player_drop_pity', { player_id, pity: data.dropPity });
      uu('player_misc_state', { player_id, starter_given: data.starterGiven, fleet_position: data.fleetPosition, viewing_cmd_id: data.viewingCmdId, card_ability_cooldowns: data.cardAbilityCooldowns, cmd_cooldowns: data.cmdCooldowns });
      uu('player_defenses', { player_id, defenses: data.defenses });
      await Promise.all(upserts);

      if (data._clear_boosters) {
        try { await supa.from('hive_profiles').update({ boosters: {} }).eq('id', player_id); }
        catch (ex: unknown) { errors.push(`hive_profiles: ${(ex as Error).message}`); }
      }
      if (data._leaderboard) {
        try { await supa.from('leaderboard').upsert({ ...data._leaderboard, player_id, updated_at: new Date().toISOString() }); }
        catch (ex: unknown) { errors.push(`leaderboard: ${(ex as Error).message}`); }
      }
      if (data._pvp_snapshot) {
        try { await supa.from('pvp_snapshots').upsert({ ...data._pvp_snapshot, player_id }); }
        catch (ex: unknown) { errors.push(`pvp_snapshots: ${(ex as Error).message}`); }
      }

      return new Response(JSON.stringify({ success: true, errors }), {
        headers: { ...corsHeaders(req), 'Content-Type': 'application/json' }
      });
    }

    if (action === 'load') {
      const tables = ['player_resources','player_buildings','player_research','player_commander','player_fleet','player_hangar','player_ship_designs','player_blueprints','player_blueprint_fragments','player_commanders','player_deployed_commanders','player_colonies','player_instance_progress','player_missions','player_achievements','player_artifacts','player_pvp','player_espionage','player_formations','player_recycle_queue','player_build_queue','player_pack_pity','player_conquered_planets','player_jump_gate_cooldowns','player_boss_cooldowns','player_drop_pity','player_misc_state','player_defenses'];
      const results: Record<string, unknown> = {};
      for (const tbl of tables) {
        const { data, error } = await supa.from(tbl).select('*').eq('player_id', player_id).maybeSingle();
        if (data) results[tbl] = data;
      }
      return new Response(JSON.stringify({ success: true, data: results }), {
        headers: { ...corsHeaders(req), 'Content-Type': 'application/json' }
      });
    }

    if (action === 'reset') {
      const tables = ['player_resources','player_buildings','player_research','player_commander','player_fleet','player_hangar','player_ship_designs','player_blueprints','player_blueprint_fragments','player_commanders','player_deployed_commanders','player_colonies','player_instance_progress','player_missions','player_achievements','player_artifacts','player_pvp','player_espionage','player_formations','player_recycle_queue','player_build_queue','player_pack_pity','player_conquered_planets','player_jump_gate_cooldowns','player_boss_cooldowns','player_drop_pity','player_misc_state','player_defenses'];
      const errors: string[] = [];
      for (const tbl of tables) {
        const { error } = await supa.from(tbl).delete().eq('player_id', player_id);
        if (error) errors.push(`${tbl}: ${error.message}`);
      }
      return new Response(JSON.stringify({ success: errors.length === 0, errors }), {
        headers: { ...corsHeaders(req), 'Content-Type': 'application/json' }
      });
    }

    return err(req, 'Nepoznata akcija', 400);
  } catch (e) {
    console.error('[game-save] UNCAUGHT:', (e as Error).message, (e as Error).stack || '');
    return err(req, 'Server error', 500);
  }
});

function err(req: Request, msg: string, status: number) {
  return new Response(JSON.stringify({ success: false, error: msg }), {
    status,
    headers: { ...corsHeaders(req), 'Content-Type': 'application/json' }
  });
}
