import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SERVICE_KEY = Deno.env.get('SERVICE_KEY');
const SUPA_URL    = Deno.env.get('SUPABASE_URL') || 'https://exmbmwukqssvgmhysamo.supabase.co';

const supa = createClient(SUPA_URL, SERVICE_KEY);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });

  try {
    const body = await req.json();
    const { action, player_id, data } = body;
    if (!action || !player_id) return err('Nedostaje action ili player_id', 400);

    if (action === 'save') {
      if (!data) return err('Nedostaje data', 400);
      const errors: string[] = [];
      const u = async (table: string, payload: Record<string, unknown>) => {
        const { error } = await supa.from(table).upsert(payload);
        if (error) errors.push(`${table}: ${error.message}`);
      };

      const R = data.R || {};
      await supa.from('players').upsert({ id: player_id, player_type: 'hive', username: player_id }, { onConflict: 'id' });
      await Promise.all([
        u('player_resources', { player_id, metal: R.metal, crystal: R.crystal, he3: R.he3, energy: R.energy, score: R.score, bcm: data.bcm, bocrypto: data.bocrypto, spcard: data.spCard, keys_cmd: data.keys_cmd, keys_inst: data.keys_inst, storage_buffer: data.storageBuffer, total_metal_mined: data.totalMetalMined, total_depot_pickups: data.totalDepotPickups }),
        u('player_buildings', { player_id, buildings: data.buildings }),
        u('player_research', { player_id, research: data.research }),
        u('player_commander', { player_id, level: data.commander?.level, exp: data.commander?.exp, next_exp: data.commander?.nextExp, title: data.commander?.title }),
        u('player_fleet', { player_id, fleet: data.fleet }),
        u('player_hangar', { player_id, hangar: data.hangar }),
        u('player_ship_designs', { player_id, designs: data.shipDesigns, extra_slots: data.designExtraSlots, slots_bought: data.designSlotsBought }),
        u('player_blueprints', { player_id, owned: data.ownedBlueprints }),
        u('player_blueprint_fragments', { player_id, fragments: data.blueprintFragments }),
        u('player_commanders', { player_id, owned: data.ownedCommanders, active_id: data.activeCommander }),
        u('player_deployed_commanders', { player_id, deployed: data.deployedCommanders }),
        u('player_colonies', { player_id, colonies: data.colonies }),
        u('player_instance_progress', { player_id, progress: data.instProgress }),
        u('player_missions', { player_id, mission_state: data.missionState, mission_counters: data.missionCounters, story_missions: data.dynamicStoryMissions }),
        u('player_achievements', { player_id, achieves: data.ACHIEVES, state: data.achievementState }),
        u('player_artifacts', { player_id, fragments: data.artifactFragments, state: data.artifactState }),
        u('player_pvp', { player_id, wins: data.pvp?.wins, losses: data.pvp?.losses, rating: data.pvp?.rating, history: data.pvp?.history, shield: data.pvpShield }),
        u('player_espionage', { player_id, drones: data.espDrones, reports: data.espReports }),
        u('player_formations', { player_id, active_formation: data.activeFormation, formation_slots: data.formationSlots }),
        u('player_recycle_queue', { player_id, queue: data.recycleQueue }),
        u('player_build_queue', { player_id, queue: data.buildQueue }),
        u('player_pack_pity', { player_id, pity: data.packPity, pulls: data.packPulls }),
        u('player_conquered_planets', { player_id, planets: data.conqueredPlanets, fleet_reward: data.colonyFleetReward }),
        u('player_jump_gate_cooldowns', { player_id, cooldowns: data.jumpGateCooldowns }),
        u('player_boss_cooldowns', { player_id, cooldowns: data.bossCooldowns }),
        u('player_drop_pity', { player_id, pity: data.dropPity }),
        u('player_misc_state', { player_id, starter_given: data.starterGiven, fleet_position: data.fleetPosition, viewing_cmd_id: data.viewingCmdId, card_ability_cooldowns: data.cardAbilityCooldowns }),
        u('player_defenses', { player_id, defenses: data.defenses }),
      ]);

      if (data._clear_boosters) {
        await supa.from('hive_profiles').update({ boosters: {} }).eq('id', player_id);
      }
      if (data._leaderboard) {
        await supa.from('leaderboard').upsert({ player_id, ...data._leaderboard, updated_at: new Date().toISOString() });
      }

      return new Response(JSON.stringify({ success: true, errors }), {
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
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
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
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
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      });
    }

    return err('Nepoznata akcija', 400);
  } catch (e) {
    return err('Server error: ' + (e as Error).message, 500);
  }
});

function err(msg: string, status: number) {
  return new Response(JSON.stringify({ success: false, error: msg }), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
  };
}
