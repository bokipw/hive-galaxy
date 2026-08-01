import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_KEY') || '';
const SUPA_URL    = Deno.env.get('SUPABASE_URL') || 'https://exmbmwukqssvgmhysamo.supabase.co';
const ADMIN_KEY   = Deno.env.get('ADMIN_KEY') || '';

if (!SERVICE_KEY) console.error('[game-save] SERVICE_KEY is missing!');
const supa = createClient(SUPA_URL, SERVICE_KEY);

const PLAYER_TABLES = [
  'player_resources','player_buildings','player_research','player_commander','player_fleet',
  'player_hangar','player_ship_designs','player_blueprints','player_blueprint_fragments',
  'player_commanders','player_deployed_commanders','player_colonies','player_instance_progress',
  'player_missions','player_achievements','player_artifacts','player_pvp','player_espionage',
  'player_formations','player_recycle_queue','player_build_queue','player_pack_pity',
  'player_conquered_planets','player_jump_gate_cooldowns','player_boss_cooldowns','player_drop_pity',
  'player_misc_state','player_defenses'
];

async function loadPlayerState(player_id: string): Promise<Record<string, any>> {
  const out: Record<string, any> = {};
  for (const tbl of PLAYER_TABLES) {
    try {
      const { data, error } = await supa.from(tbl).select('*').eq('player_id', player_id).maybeSingle();
      if (!error && data) out[tbl] = data;
    } catch (_) { /* ignore */ }
  }
  return out;
}

async function archiveState(player_id: string, state: Record<string, any>, reason: string): Promise<void> {
  if (!state || Object.keys(state).length === 0) return;
  try {
    await supa.from('player_save_history').insert({ player_id, snapshot: state, reason });
  } catch (ex) {
    console.error('[game-save] archive failed:', (ex as Error).message);
  }
}

// Dali postojeće stanje pokazuje stvarni napredak (nije "novi" igrač)?
function hasProgress(state: Record<string, any>): boolean {
  const buildings = state.player_buildings?.buildings || {};
  const research  = state.player_research?.research || {};
  const cmd       = state.player_commander || {};
  const bps       = state.player_blueprints?.owned || {};
  const res       = state.player_resources || {};
  const fleet     = state.player_fleet?.fleet || [];
  if (Object.values(buildings).some((b: any) => (b?.level || 1) > 1)) return true;
  if (Object.values(research).some((r: any) => (r?.level || 1) > 1)) return true;
  if ((cmd.level || 1) > 1) return true;
  if (Object.keys(bps).length > 0) return true;
  if (fleet.some((s: any) => s && (s.count || 0) > 0)) return true;
  if ((res.metal || 0) > 100000 && (res.crystal || 0) > 100000) return true;
  return false;
}

// Dali dolazni save izgleda kao potpuno nov/prazan igrač?
function isFreshSave(data: Record<string, any>): boolean {
  const buildings = data.buildings || {};
  const research  = data.research || {};
  const bps       = data.ownedBlueprints || {};
  const fleet     = data.fleet || [];
  if (Object.values(buildings).some((b: any) => (b?.level || 1) > 1)) return false;
  if (Object.values(research).some((r: any) => (r?.level || 1) > 1)) return false;
  if ((data.commander?.level || 1) > 1) return false;
  if (Object.keys(bps).length > 0) return false;
  if (fleet.some((s: any) => s && (s.count || 0) > 0)) return false;
  return true;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });

  try {
    const body = await req.json();
    const { action, player_id, data } = body;
    if (!action || !player_id) return err('Nedostaje action ili player_id', 400);

    if (action === 'save') {
      if (!data) return err('Nedostaje data', 400);
      const errors: string[] = [];

      // ── 1) Učitaj postojeće stanje i arhiviraj ga (append-only) ──
      const existing = await loadPlayerState(player_id);
      await archiveState(player_id, existing, 'pre-save');

      // ── 2) ZAŠTITA: prazan/nov save nikad ne smije pregaziti napredak ──
      const hasPlayerState =
        data.buildings != null || data.research != null || data.commander != null ||
        data.ownedBlueprints != null || data.fleet != null;
      if (hasPlayerState && hasProgress(existing) && isFreshSave(data)) {
        console.warn(`[game-save] BLOKIRAN prazan save koji bi pregazio napredak: ${player_id}`);
        return err('Save blokiran: na serveru postoji napredak, a ovaj save je prazan (zaštita od brisanja). Osveži igru da učitaš cloud save.', 409);
      }

      // ── 3) MERGE bez regresije: nivo se NIKAD ne smanjuje ──
      const exBuildings = existing.player_buildings?.buildings || {};
      const inBuildings = data.buildings || {};
      const mergedBuildings: Record<string, { level: number }> = {};
      const allBKeys = new Set<string>([...Object.keys(exBuildings), ...Object.keys(inBuildings)]);
      for (const k of allBKeys) {
        const a = (exBuildings[k] as any)?.level || 1;
        const b = (inBuildings[k] as any)?.level || 1;
        mergedBuildings[k] = { level: Math.max(a, b) };
      }

      const exResearch = existing.player_research?.research || {};
      const inResearch = data.research || {};
      const mergedResearch: Record<string, { level: number }> = {};
      const allRKeys = new Set<string>([...Object.keys(exResearch), ...Object.keys(inResearch)]);
      for (const k of allRKeys) {
        const a = (exResearch[k] as any)?.level || 1;
        const b = (inResearch[k] as any)?.level || 1;
        mergedResearch[k] = { level: Math.max(a, b) };
      }

      const exCmd = existing.player_commander || {};
      const inCmd = data.commander || {};
      const mergedCommander = {
        level: Math.max((exCmd.level || 1), (inCmd.level || 1)),
        exp: Math.max((exCmd.exp || 0), (inCmd.exp || 0)),
        next_exp: inCmd.nextExp ?? exCmd.next_exp ?? 1000,
        title: inCmd.title || exCmd.title || 'Kadet',
      };

      const exBps = existing.player_blueprints?.owned || {};
      const mergedBlueprints = { ...exBps, ...(data.ownedBlueprints || {}) };

      const exFleet = existing.player_fleet?.fleet || [];
      const inFleet = data.fleet;
      let mergedFleet: any = inFleet;
      if (inFleet && Array.isArray(inFleet) && !inFleet.some((s: any) => s && (s.count || 0) > 0) &&
          exFleet.some((s: any) => s && (s.count || 0) > 0)) {
        mergedFleet = exFleet; // prazna flota ne briše postojeću
      }

      const exCmdrs = existing.player_commanders?.owned || [];
      const inCmdrs = data.ownedCommanders || [];
      const mergedCmdrs = [...exCmdrs];
      for (const c of inCmdrs) {
        if (!mergedCmdrs.some((e: any) => e?.id === c?.id)) mergedCmdrs.push(c);
      }

      // ── 4) Upsert (sa merged vrijednostima) ──
      const upserts: Promise<void>[] = [];
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
      try {
        const { error: pe } = await supa.from('players').upsert({ id: player_id, player_type: 'hive', username: player_id }, { onConflict: 'id' });
        if (pe) errors.push(`players: ${pe.message}`);
      } catch (pe) {
        errors.push(`players exception: ${(pe as Error).message}`);
      }
      uu('player_resources', { player_id, metal: R.metal, crystal: R.crystal, he3: R.he3, energy: R.energy, score: R.score, bcm: data.bcm ?? R.bcm, bocrypto: data.bocrypto ?? R.bocrypto, spcard: data.spCard ?? R.spCard, keys_cmd: data.keys_cmd ?? R.keys_cmd ?? R.keys, keys_inst: data.keys_inst ?? R.keys_inst ?? R.instanceKeys, storage_buffer: data.storageBuffer, total_metal_mined: data.totalMetalMined, total_depot_pickups: data.totalDepotPickups });
      uu('player_buildings', { player_id, buildings: data.buildings ? mergedBuildings : undefined });
      uu('player_research', { player_id, research: data.research ? mergedResearch : undefined });
      uu('player_commander', { player_id, level: data.commander ? mergedCommander.level : undefined, exp: data.commander ? mergedCommander.exp : undefined, next_exp: data.commander ? mergedCommander.next_exp : undefined, title: data.commander ? mergedCommander.title : undefined });
      uu('player_fleet', { player_id, fleet: data.fleet ? mergedFleet : undefined });
      uu('player_hangar', { player_id, hangar: data.hangar });
      uu('player_ship_designs', { player_id, designs: data.shipDesigns, extra_slots: data.designExtraSlots, slots_bought: data.designSlotsBought });
      uu('player_blueprints', { player_id, owned: data.ownedBlueprints ? mergedBlueprints : undefined });
      uu('player_blueprint_fragments', { player_id, fragments: data.blueprintFragments });
      uu('player_commanders', { player_id, owned: data.ownedCommanders ? mergedCmdrs : undefined, active_id: data.activeCommander });
      uu('player_deployed_commanders', { player_id, deployed: data.deployedCommanders });
      uu('player_colonies', { player_id, colonies: data.colonies });
      uu('player_instance_progress', { player_id, progress: data.instProgress });
      uu('player_missions', { player_id, mission_state: data.missionState, mission_counters: data.missionCounters, mission_targets: data.missionTargets, story_missions: data.dynamicStoryMissions });
      uu('player_achievements', { player_id, achieves: data.ACHIEVES, state: data.achievementState, tracking: data.achievementTracking });
      uu('player_artifacts', { player_id, fragments: data.artifactFragments, state: data.artifactState });
      uu('player_pvp', { player_id, wins: data.pvp?.wins, losses: data.pvp?.losses, rating: data.pvp?.rating, history: data.pvp?.history, shield: data.pvpShield });
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
        try { await supa.from('leaderboard').upsert({ player_id, ...data._leaderboard, updated_at: new Date().toISOString() }); }
        catch (ex: unknown) { errors.push(`leaderboard: ${(ex as Error).message}`); }
      }
      if (data._pvp_snapshot) {
        try { await supa.from('pvp_snapshots').upsert({ player_id, ...data._pvp_snapshot }); }
        catch (ex: unknown) { errors.push(`pvp_snapshots: ${(ex as Error).message}`); }
      }

      return new Response(JSON.stringify({ success: true, errors }), {
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      });
    }

    if (action === 'load') {
      const results: Record<string, unknown> = {};
      for (const tbl of PLAYER_TABLES) {
        const { data, error } = await supa.from(tbl).select('*').eq('player_id', player_id).maybeSingle();
        if (data) results[tbl] = data;
      }
      return new Response(JSON.stringify({ success: true, data: results }), {
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      });
    }

    if (action === 'reset') {
      const supplied = (body.admin_key as string) || req.headers.get('x-admin-key') || '';
      if (!ADMIN_KEY || supplied !== ADMIN_KEY) {
        return err('Reset zahtijeva ADMIN_KEY', 403);
      }
      const existing = await loadPlayerState(player_id);
      await archiveState(player_id, existing, 'pre-reset');
      const errors: string[] = [];
      for (const tbl of PLAYER_TABLES) {
        const { error } = await supa.from(tbl).delete().eq('player_id', player_id);
        if (error) errors.push(`${tbl}: ${error.message}`);
      }
      return new Response(JSON.stringify({ success: errors.length === 0, errors }), {
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      });
    }

    return err('Nepoznata akcija', 400);
  } catch (e) {
    const msg = (e as Error).message + ' | ' + ((e as Error).stack || '');
    console.error('[game-save] UNCAUGHT:', msg);
    return err('Server error: ' + msg, 500);
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
