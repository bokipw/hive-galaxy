function _getPlayerId() {
  if (window._loginType === 'hive') return window._hiveUser;
  if (window._supaSession) return window._supaSession.user.id;
  return null;
}
function _getUsername() {
  if (window._hiveUser) return window._hiveUser;
  if (window._supaSession) {
    const meta = window._supaSession.user.user_metadata;
    return meta?.username || window._supaSession.user.email?.split('@')[0] || 'Unknown';
  }
  return 'Unknown';
}

async function _hiveSave(payload) {
  try {
    const cmdrs = payload.ownedCommanders || [];
    const total = cmdrs.reduce((s, c) => s + ((c.fleet||[]).reduce((a, b) => a + (b?.count||0), 0)), 0);
    console.log(`[hiveSave] brodova: ${total}, commanders: ${cmdrs.length}`);
    const resp = await fetch('https://exmbmwukqssvgmhysamo.supabase.co/functions/v1/game-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', player_id: window._hiveUser, data: payload })
    });
    const text = await resp.text();
    let result;
    try { result = JSON.parse(text); } catch(e) { result = { success: false, error: text }; }
    if (!result.success) console.error('[hiveSave] error:', JSON.stringify(result.errors || result.error || text));
    return result;
  } catch(e) { console.error('[hiveSave] exception:', e); }
}

async function _emailSave(payload) {
  if (!window._supa) return;
  const pid = _getPlayerId();
  const u = (table, data) => window._supa.from(table).upsert(data).then(r => { if(r.error) console.error(table, r.error); });
  try {
    const R = payload.R || {};
    await Promise.all([
      u('player_resources', { player_id: pid, metal: R.metal, crystal: R.crystal, he3: R.he3, energy: R.energy, score: R.score, bcm: payload.bcm, bocrypto: payload.bocrypto, spcard: payload.spcard, keys_cmd: payload.keys_cmd, keys_inst: payload.keys_inst, storage_buffer: payload.storageBuffer, total_metal_mined: payload.totalMetalMined, total_depot_pickups: payload.totalDepotPickups }),
      u('player_buildings', { player_id: pid, buildings: payload.buildings }),
      u('player_research', { player_id: pid, research: payload.research }),
      u('player_commander', { player_id: pid, level: payload.commander?.level, exp: payload.commander?.exp, next_exp: payload.commander?.nextExp, title: payload.commander?.title }),
      u('player_fleet', { player_id: pid, fleet: payload.fleet }),
      u('player_hangar', { player_id: pid, hangar: payload.hangar }),
      u('player_ship_designs', { player_id: pid, designs: payload.shipDesigns, extra_slots: payload.designExtraSlots, slots_bought: payload.designSlotsBought }),
      u('player_blueprints', { player_id: pid, owned: payload.ownedBlueprints }),
      u('player_blueprint_fragments', { player_id: pid, fragments: payload.blueprintFragments }),
      u('player_commanders', { player_id: pid, owned: payload.ownedCommanders, active_id: payload.activeCommander }),
      u('player_deployed_commanders', { player_id: pid, deployed: payload.deployedCommanders }),
      u('player_colonies', { player_id: pid, colonies: payload.colonies }),
      u('player_instance_progress', { player_id: pid, progress: payload.instProgress }),
      u('player_missions', { player_id: pid, mission_state: payload.missionState, mission_counters: payload.missionCounters, story_missions: payload.dynamicStoryMissions }),
      u('player_achievements', { player_id: pid, achieves: payload.ACHIEVES, state: payload.achievementState, tracking: payload.achievementTracking }),
      u('player_artifacts', { player_id: pid, fragments: payload.artifactFragments, state: payload.artifactState }),
      u('player_pvp', { player_id: pid, wins: payload.pvp?.wins, losses: payload.pvp?.losses, rating: payload.pvp?.rating, win_streak: payload.pvp?.winStreak, history: payload.pvp?.history, shield: payload.pvpShield }),
      u('player_espionage', { player_id: pid, drones: payload.espDrones, reports: payload.espReports }),
      u('player_formations', { player_id: pid, active_formation: payload.activeFormation, formation_slots: payload.formationSlots }),
      u('player_recycle_queue', { player_id: pid, queue: payload.recycleQueue }),
      u('player_build_queue', { player_id: pid, queue: payload.buildQueue }),
      u('player_pack_pity', { player_id: pid, pity: payload.packPity, pulls: payload.packPulls }),
      u('player_conquered_planets', { player_id: pid, planets: payload.conqueredPlanets, fleet_reward: payload.colonyFleetReward }),
      u('player_jump_gate_cooldowns', { player_id: pid, cooldowns: payload.jumpGateCooldowns }),
      u('player_boss_cooldowns', { player_id: pid, cooldowns: payload.bossCooldowns }),
      u('player_drop_pity', { player_id: pid, pity: payload.dropPity }),
      u('player_misc_state', { player_id: pid, starter_given: payload.starterGiven, fleet_position: payload.fleetPosition, viewing_cmd_id: payload.viewingCmdId, card_ability_cooldowns: payload.cardAbilityCooldowns, cmd_cooldowns: payload.cmdCooldowns }),
      u('player_defenses', { player_id: pid, defenses: payload.defenses }),
    ]);
  } catch(e) { console.error('[emailSave] exception:', e); }
}

async function _saveLeaderboard(score, level) {
  const pid = _getPlayerId();
  const username = _getUsername();
  if (!pid || !window._supa) return;
  const isHive = window._loginType === 'hive';
  const isPremium = window._playerPremium || false;
  if (isHive) {
    try {
      await fetch('https://exmbmwukqssvgmhysamo.supabase.co/functions/v1/game-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', player_id: pid, data: { _leaderboard: { username, score, level, is_premium: isPremium } } })
      });
    } catch(e) { console.error('[lbSave]', e); }
  } else {
    try {
      await window._supa.from('leaderboard').upsert({ player_id: pid, username, score, level, is_premium: isPremium, updated_at: new Date().toISOString() });
    } catch(e) { console.error('[lbSave]', e); }
  }
}

async function _savePvpSnapshot(saveData) {
  const pid = _getPlayerId();
  const username = _getUsername();
  if (!pid || !window._supa) return;
  try {
    let deployedFleet = [];
    try {
      if (typeof buildPvpFleetLocal === 'function') {
        deployedFleet = buildPvpFleetLocal().map(u => ({
          ship_id: u.ship_id, name: u.name, count: u.count, hp: u.hp, dps: u.dps,
          shield: u.shield, shield_regen: u.shieldRegen, agility: u.agility,
          speed: u.speed, armor: u.armor, dmg_reduction: u.dmgReduction || 0,
          crit_bonus: u.critBonus || 0, engine_special: u.engineSpecial || null,
        }));
      }
    } catch(_) {}
    const commanders = (saveData.deployedCommanders || []).map(c => ({
      id: c.id, name: c.name, rarity: c.rarity, faction: c.faction
    }));
    const level = (saveData.commander && saveData.commander.level) || 1;
    const payload = {
      player_id: pid, username,
      rating: (saveData.pvp && saveData.pvp.rating) || 1000,
      level, power: typeof calcFleetTotalPower === 'function' ? calcFleetTotalPower() : 0,
      fleet: deployedFleet, commanders,
      is_premium: window._playerPremium || false,
      resources: {
        metal: typeof R !== 'undefined' ? (R.metal || 0) : 0,
        crystal: typeof R !== 'undefined' ? (R.crystal || 0) : 0,
        he3: typeof R !== 'undefined' ? (R.he3 || 0) : 0,
      },
      updated_at: new Date().toISOString()
    };
    const { error } = await window._supa.from('pvp_snapshots').upsert(payload);
    if (error && (error.status === 401 || error.status === 403)) {
      await fetch('https://exmbmwukqssvgmhysamo.supabase.co/functions/v1/game-save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', player_id: pid, data: { _pvp_snapshot: payload } })
      });
    }
  } catch(e) { console.error('[pvpSave] exception:', e); }
}

async function _cloudSave(saveData) {
  if (!window._supa) return;
  if (!saveData || !saveData.R || typeof saveData.R.metal !== 'number') return;
  if (!saveData.commander || !saveData.commander.level || saveData.commander.level < 1) return;

  const pid = _getPlayerId();
  if (!pid) return;
  const isHive = window._loginType === 'hive';

  const score = (saveData.R && saveData.R.score) || 0;
  const level = (saveData.commander && saveData.commander.level) || 1;

  if (isHive) {
    await _hiveSave(saveData);
  } else {
    await _emailSave(saveData);
  }

  await _saveLeaderboard(score, level);
  await _savePvpSnapshot(saveData);
}

function _applyGameState(s) {
  if (!s) return false;
  if (!s.R || typeof s.R.metal !== 'number') return false;
  if (!s.commander || !s.commander.level) return false;
  if (!s.buildings) return false;
  try {
    if (s.R) {
      const { bcm, bocrypto, spCard, keys, instanceKeys, ...rest } = s.R;
      Object.assign(R, rest);
    }
    if (s.storageBuffer)   Object.assign(storageBuffer, s.storageBuffer);
    if (s.buildQueue)      buildQueue = s.buildQueue;
    if (s.recycleQueue)    recycleQueue = s.recycleQueue;
    if (s.buildings)       Object.keys(s.buildings).forEach(k => { if (buildings[k]) buildings[k].level = s.buildings[k].level; });
    if (s.commander)       Object.assign(commander, s.commander);
    if (typeof getExpForLevel === 'function') commander.nextExp = getExpForLevel(commander.level || 1);
    if (s.research)        Object.keys(s.research).forEach(k => { if (research[k]) research[k].level = s.research[k].level; });
    if (s.fleet)           fleet = s.fleet;
    if (s.ownedBlueprints)     Object.assign(ownedBlueprints, s.ownedBlueprints);
    if (s.blueprintFragments) Object.assign(blueprintFragments, s.blueprintFragments);
    if (s.colonies)        colonies = s.colonies;
    if (s.pvp)             Object.assign(pvp, s.pvp);
    if (s.espDrones != null)       espDrones = s.espDrones;
    if (s.espReports)              espReports = s.espReports;
    if (s.artifactFragments != null) artifactFragments = s.artifactFragments;
    if (s.activeFormation != null) activeFormation = s.activeFormation;
    if (s.starterGiven != null)    starterGiven = s.starterGiven;
    if (s.shipDesigns)             shipDesigns = s.shipDesigns;
    if (s.hangar)                  hangar = s.hangar;
    if (s.instProgress)            window._instProgress = s.instProgress;
    if (s.pvpShield)               window.pvpShield = s.pvpShield;
    if (s.artifactState) {
      if (!window.artifactState) window.artifactState = { fragments: {}, unlocked: [], equipped: [null, null, null] };
      Object.assign(window.artifactState, s.artifactState);
    }
    if (s.achievementState) {
      if (!window.achievementState) window.achievementState = {};
      Object.assign(window.achievementState, s.achievementState);
    }
    if (s.missionState) {
      if (!window.missionState) window.missionState = { daily: { date: '' } };
      Object.assign(window.missionState, s.missionState);
    }
    if (s.missionCounters) {
      const mc = s.missionCounters;
      window._dailyInstCount    = mc.dailyInst    || 0;
      window._dailyDepotCount   = mc.dailyDepot   || 0;
      window._dailyResCount     = mc.dailyRes     || 0;
      window._dailyShipCount    = mc.dailyShip    || 0;
      window._dailyPvpCount     = mc.dailyPvp     || 0;
      window._dailyPvpWinCount  = mc.dailyPvpWin  || 0;
      window._dailyEspCount     = mc.dailyEsp     || 0;
      window._dailyBuildCount   = mc.dailyBuild   || 0;
      window._dailyArtCount     = mc.dailyArt     || 0;
      window._weeklyInstCount   = mc.weeklyInst   || 0;
      window._weeklyPvpCount    = mc.weeklyPvp    || 0;
      window._weeklyResCount    = mc.weeklyRes    || 0;
      window._weeklyBuildCount  = mc.weeklyBuild  || 0;
      window._weeklyShipCount   = mc.weeklyShip   || 0;
      window._weeklyEspCount    = mc.weeklyEsp    || 0;
    }
    if (s.missionTargets) {
      const mt = s.missionTargets;
      if (mt.weeklyInstTarget     != null) window._weeklyInstTarget     = mt.weeklyInstTarget;
      if (mt.weeklyInstHardTarget != null) window._weeklyInstHardTarget = mt.weeklyInstHardTarget;
      if (mt.weeklyPvpTarget      != null) window._weeklyPvpTarget      = mt.weeklyPvpTarget;
      if (mt.weeklyPvpHardTarget  != null) window._weeklyPvpHardTarget  = mt.weeklyPvpHardTarget;
      if (mt.weeklyResTarget      != null) window._weeklyResTarget      = mt.weeklyResTarget;
      if (mt.weeklyResHardTarget  != null) window._weeklyResHardTarget  = mt.weeklyResHardTarget;
      if (mt.weeklyBuildTarget    != null) window._weeklyBuildTarget    = mt.weeklyBuildTarget;
      if (mt.weeklyBuildHardTarget != null) window._weeklyBuildHardTarget = mt.weeklyBuildHardTarget;
      if (mt.weeklyShipTarget     != null) window._weeklyShipTarget     = mt.weeklyShipTarget;
      if (mt.weeklyShipHardTarget != null) window._weeklyShipHardTarget = mt.weeklyShipHardTarget;
      if (mt.weeklyEspTarget      != null) window._weeklyEspTarget      = mt.weeklyEspTarget;
      if (mt.weeklyEspHardTarget  != null) window._weeklyEspHardTarget  = mt.weeklyEspHardTarget;
      if (mt.weeklyPowerTarget    != null) window._weeklyPowerTarget    = mt.weeklyPowerTarget;
    }
    if (s.totalMetalMined != null) window._totalMetalMined = s.totalMetalMined;
    if (s.totalDepotPickups != null) window._totalDepotPickups = s.totalDepotPickups;
    if (s.ACHIEVES)                ACHIEVES = s.ACHIEVES;
    if (s.achievementTracking) {
      const at = s.achievementTracking;
      if (at.totalCrystalMined   != null) window._totalCrystalMined   = at.totalCrystalMined;
      if (at.totalHe3Mined       != null) window._totalHe3Mined       = at.totalHe3Mined;
      if (at.totalShipsBuilt     != null) window._totalShipsBuilt     = at.totalShipsBuilt;
      if (at.totalShipsDestroyed != null) window._totalShipsDestroyed = at.totalShipsDestroyed;
      if (at.totalShipsRecycled  != null) window._totalShipsRecycled  = at.totalShipsRecycled;
      if (at.totalDamageDealt    != null) window._totalDamageDealt    = at.totalDamageDealt;
      if (at.totalResourcesSpent != null) window._totalResourcesSpent = at.totalResourcesSpent;
      if (at.totalBpCrafted      != null) window._totalBpCrafted      = at.totalBpCrafted;
      if (at.flawlessWins        != null) window._flawlessWins        = at.flawlessWins;
      if (at.instanceStreak      != null) window._instanceStreak      = at.instanceStreak;
      if (at.winsEasy            != null) window._wins_easy           = at.winsEasy;
      if (at.winsNormal          != null) window._wins_normal         = at.winsNormal;
      if (at.winsNightmare       != null) window._wins_nightmare      = at.winsNightmare;
      if (at.winsHell            != null) window._wins_hell           = at.winsHell;
      if (at.energySurplus       != null) window._energySurplus       = at.energySurplus;
      if (at.metalPerHour          != null) window._metalPerHour          = at.metalPerHour;
      if (at.crystalPerHour        != null) window._crystalPerHour        = at.crystalPerHour;
      if (at.he3PerHour            != null) window._he3PerHour            = at.he3PerHour;
      if (at.espSuccessfulMissions != null) window._espSuccessfulMissions = at.espSuccessfulMissions;
      if (at.espStealMissions      != null) window._espStealMissions      = at.espStealMissions;
    }
    if (s.ownedCommanders) {
      const _oldTotal = (window.ownedCommanders || []).reduce((s, c) => s + ((c.fleet||[]).reduce((a, b) => a + (b?.count||0), 0)), 0);
      window.ownedCommanders    = s.ownedCommanders;
      const _newTotal = (window.ownedCommanders || []).reduce((s, c) => s + ((c.fleet||[]).reduce((a, b) => a + (b?.count||0), 0)), 0);
      console.log(`[load] ownedCommanders: ${_oldTotal} → ${_newTotal} brodova`, JSON.stringify((window.ownedCommanders||[]).map(c => ({ id: c.id, fleet: (c.fleet||[]).map(s => s ? { id: s.ship_id, count: s.count } : null) }))));
    }
    if (s.activeCommander)    window._activeCommander   = s.activeCommander;
    if (s.deployedCommanders)        window._deployedCommanders = s.deployedCommanders;
    if (s.designExtraSlots  != null) window._designExtraSlots   = s.designExtraSlots;
    if (s.designSlotsBought != null) window._designSlotsBought  = s.designSlotsBought;
    if (s.formationSlots)     window._formationSlots     = s.formationSlots;
    if (s.viewingCmdId)       window._viewingCmdId      = s.viewingCmdId;
    if (s.packPity)           window._packPity          = s.packPity;
    if (s.packPulls)          window._packPulls         = s.packPulls;
    if (s.cardAbilityCooldowns) Object.assign(window, s.cardAbilityCooldowns);
    if (s.cmdCooldowns)         window._cmdCooldowns         = s.cmdCooldowns;
    if (!window._deployedCommanders) window._deployedCommanders = [];
    if (!window._formationSlots) window._formationSlots = Array(9).fill(null);
    if (s.conqueredPlanets)      window._conqueredPlanets     = s.conqueredPlanets;
    if (!window._conqueredPlanets) window._conqueredPlanets   = [];
    if (s.colonyFleetReward)     window._colonyFleetReward    = s.colonyFleetReward;
    if (!window._colonyFleetReward) window._colonyFleetReward = {};
    if (s.jumpGateCooldowns)     window._jumpGateCooldowns    = s.jumpGateCooldowns;
    if (!window._jumpGateCooldowns) window._jumpGateCooldowns = {};
    if (s.dropPity)              window._dropPity             = s.dropPity;
    if (!window._dropPity)       window._dropPity             = {};
    if (s.bossCooldowns)         window._bossCooldowns        = s.bossCooldowns;
    if (!window._bossCooldowns)  window._bossCooldowns        = {};
    // Očisti stare ključeve bez sufiksa težine (pre fix-a)
    const _modes = ['easy','normal','nightmare','hell'];
    Object.keys(window._bossCooldowns).forEach(k => {
      if (!_modes.some(m => k.endsWith('_' + m))) delete window._bossCooldowns[k];
    });
    window._fleetPosition = s.fleetPosition || null;
    if (s.dynamicStoryMissions) window._dynamicStoryMissions = s.dynamicStoryMissions;
    if (!window._dynamicStoryMissions) window._dynamicStoryMissions = [];
    return true;
  } catch(e) {
    console.error('applyGameState error:', e);
    return false;
  }
}

async function _loadFromTables() {
  const pid = _getPlayerId();
  if (!pid || !window._supa) return null;
  const isHive = window._loginType === 'hive';

  if (isHive) {
    try {
      const resp = await fetch('https://exmbmwukqssvgmhysamo.supabase.co/functions/v1/game-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'load', player_id: pid })
      });
      const result = await resp.json();
      if (!result.success || !result.data) return null;
      return _buildSaveFromTables(result.data);
    } catch(e) { console.error('[hiveLoad]', e); return null; }
  } else {
    try {
      const tables = ['player_resources','player_buildings','player_research','player_commander','player_fleet','player_hangar','player_ship_designs','player_blueprints','player_blueprint_fragments','player_commanders','player_deployed_commanders','player_colonies','player_instance_progress','player_missions','player_achievements','player_artifacts','player_pvp','player_espionage','player_formations','player_recycle_queue','player_build_queue','player_pack_pity','player_conquered_planets','player_jump_gate_cooldowns','player_boss_cooldowns','player_drop_pity','player_misc_state','player_defenses'];
      const results = {};
      for (const tbl of tables) {
        const { data } = await window._supa.from(tbl).select('*').eq('player_id', pid).maybeSingle();
        if (data) results[tbl] = data;
      }
      return _buildSaveFromTables(results);
    } catch(e) { console.error('[emailLoad]', e); return null; }
  }
}

function _buildSaveFromTables(tables) {
  if (!tables || Object.keys(tables).length === 0) return null;
  const pr = tables.player_resources || {};
  const pb = tables.player_buildings || {};
  const pres = tables.player_research || {};
  const pc = tables.player_commander || {};
  const pf = tables.player_fleet || {};
  const ph = tables.player_hangar || {};
  const psd = tables.player_ship_designs || {};
  const pbl = tables.player_blueprints || {};
  const pbf = tables.player_blueprint_fragments || {};
  const pcmdrs = tables.player_commanders || {};
  const pdc = tables.player_deployed_commanders || {};
  const pcol = tables.player_colonies || {};
  const pip = tables.player_instance_progress || {};
  const pm = tables.player_missions || {};
  const pach = tables.player_achievements || {};
  const part = tables.player_artifacts || {};
  const ppvp = tables.player_pvp || {};
  const pe = tables.player_espionage || {};
  const pform = tables.player_formations || {};
  const prq = tables.player_recycle_queue || {};
  const pbq = tables.player_build_queue || {};
  const ppp = tables.player_pack_pity || {};
  const pcp = tables.player_conquered_planets || {};
  const pjg = tables.player_jump_gate_cooldowns || {};
  const pbc = tables.player_boss_cooldowns || {};
  const pdp = tables.player_drop_pity || {};
  const pdef = tables.player_defenses || {};
  const pms = tables.player_misc_state || {};

  const saveData = {
    _savedAt: new Date().toISOString(),
    _season: window._serverSeason || 1,
    R: {
      metal: pr.metal || 0, crystal: pr.crystal || 0, he3: pr.he3 || 0,
      energy: pr.energy || 100, score: pr.score || 0,
      keys: pr.keys_cmd || 0, instanceKeys: pr.keys_inst || 0,
      bcm: pr.bcm || 0, bocrypto: pr.bocrypto || 0, spCard: pr.spcard || 0,
      D: pdef.defenses || {},
    },
    buildings: pb.buildings || {},
    commander: { level: pc.level || 1, exp: pc.exp || 0, nextExp: pc.next_exp || 1000, title: pc.title || 'Kadet' },
    research: pres.research || {},
    fleet: pf.fleet || [null,null,null,null,null,null,null,null,null],
    ownedBlueprints: pbl.owned || {},
    blueprintFragments: pbf.fragments || {},
    colonies: pcol.colonies || [],
    pvp: { wins: ppvp.wins || 0, losses: ppvp.losses || 0, rating: ppvp.rating || 1000, winStreak: ppvp.win_streak || 0, history: ppvp.history || [] },
    espDrones: pe.drones || 0,
    espReports: pe.reports || [],
    artifactFragments: part.fragments || {},
    activeFormation: pform.active_formation || 0,
    starterGiven: pms.starter_given || false,
    shipDesigns: psd.designs || [],
    hangar: ph.hangar || [],
    instProgress: pip.progress || {},
    pvpShield: ppvp.shield || {},
    artifactState: part.state || {},
    achievementState: pach.state || {},
    missionState: pm.mission_state || {},
    missionCounters: pm.mission_counters || {},
    missionTargets: pm.mission_targets || {},
    totalMetalMined: pr.total_metal_mined || 0,
    totalDepotPickups: pr.total_depot_pickups || 0,
    achievementTracking: pach.tracking || {},
    storageBuffer: pr.storage_buffer || {metal:0,crystal:0,he3:0},
    buildQueue: pbq.queue || [],
    recycleQueue: prq.queue || [],
    ACHIEVES: pach.achieves || [],
    ownedCommanders: pcmdrs.owned || [],
    activeCommander: pcmdrs.active_id || null,
    deployedCommanders: pdc.deployed || [],
    designExtraSlots: psd.extra_slots || 0,
    designSlotsBought: psd.slots_bought || 0,
    formationSlots: pform.formation_slots || [null,null,null,null,null,null,null,null,null],
    conqueredPlanets: pcp.planets || [],
    colonyFleetReward: pcp.fleet_reward || {},
    jumpGateCooldowns: pjg.cooldowns || {},
    bossCooldowns: pbc.cooldowns || {},
    fleetPosition: pms.fleet_position || null,
    dropPity: pdp.pity || {},
    dynamicStoryMissions: pm.story_missions || [],
    viewingCmdId: pms.viewing_cmd_id || null,
    packPity: ppp.pity || {},
    packPulls: ppp.pulls || {},
    cardAbilityCooldowns: pms.card_ability_cooldowns || {},
    cmdCooldowns:         pms.cmd_cooldowns         || {},
  };
  return saveData;
}

function saveGame() {
  try {
    if (typeof commander === 'undefined' || !commander.level) return;
    const { bcm: _bcm, bocrypto: _boc, spCard: _sp, keys: _keys, instanceKeys: _ikeys, D: _defenses, ...RWithoutTokens } = R;
    const saveData = {
      _savedAt: new Date().toISOString(),
      _season: window._serverSeason || 1,
      R: RWithoutTokens,
      bcm: _bcm || 0, bocrypto: _boc || 0, spCard: _sp || 0, keys_cmd: _keys || 0, keys_inst: _ikeys || 0,
      defenses: _defenses || {},
      buildings, commander, research, fleet,
      ownedBlueprints, blueprintFragments, colonies, pvp,
      espDrones, espReports, artifactFragments, activeFormation,
      starterGiven, shipDesigns, hangar,
      instProgress: window._instProgress,
      pvpShield: window.pvpShield,
      artifactState: window.artifactState,
      achievementState: window.achievementState,
      missionState: window.missionState,
      missionCounters: {
        dailyInst: window._dailyInstCount||0, dailyDepot: window._dailyDepotCount||0,
        dailyRes: window._dailyResCount||0, dailyShip: window._dailyShipCount||0,
        dailyPvp: window._dailyPvpCount||0, dailyPvpWin: window._dailyPvpWinCount||0,
        dailyEsp: window._dailyEspCount||0, dailyBuild: window._dailyBuildCount||0,
        dailyArt: window._dailyArtCount||0,
        weeklyInst: window._weeklyInstCount||0, weeklyPvp: window._weeklyPvpCount||0,
        weeklyRes: window._weeklyResCount||0, weeklyBuild: window._weeklyBuildCount||0,
        weeklyShip: window._weeklyShipCount||0, weeklyEsp: window._weeklyEspCount||0,
      },
      missionTargets: {
        weeklyInstTarget: window._weeklyInstTarget || null,
        weeklyInstHardTarget: window._weeklyInstHardTarget || null,
        weeklyPvpTarget: window._weeklyPvpTarget || null,
        weeklyPvpHardTarget: window._weeklyPvpHardTarget || null,
        weeklyResTarget: window._weeklyResTarget || null,
        weeklyResHardTarget: window._weeklyResHardTarget || null,
        weeklyBuildTarget: window._weeklyBuildTarget || null,
        weeklyBuildHardTarget: window._weeklyBuildHardTarget || null,
        weeklyShipTarget: window._weeklyShipTarget || null,
        weeklyShipHardTarget: window._weeklyShipHardTarget || null,
        weeklyEspTarget: window._weeklyEspTarget || null,
        weeklyEspHardTarget: window._weeklyEspHardTarget || null,
        weeklyPowerTarget: window._weeklyPowerTarget || null,
      },
      totalMetalMined: window._totalMetalMined,
      totalDepotPickups: window._totalDepotPickups,
      achievementTracking: {
        totalCrystalMined:   window._totalCrystalMined   || 0,
        totalHe3Mined:       window._totalHe3Mined       || 0,
        totalShipsBuilt:     window._totalShipsBuilt     || 0,
        totalShipsDestroyed: window._totalShipsDestroyed || 0,
        totalShipsRecycled:  window._totalShipsRecycled  || 0,
        totalDamageDealt:    window._totalDamageDealt    || 0,
        totalResourcesSpent: window._totalResourcesSpent || 0,
        totalBpCrafted:      window._totalBpCrafted      || 0,
        flawlessWins:        window._flawlessWins        || 0,
        instanceStreak:      window._instanceStreak      || 0,
        winsEasy:            window._wins_easy           || 0,
        winsNormal:          window._wins_normal         || 0,
        winsNightmare:       window._wins_nightmare      || 0,
        winsHell:            window._wins_hell           || 0,
        energySurplus:       window._energySurplus       || 0,
        metalPerHour:        window._metalPerHour        || 0,
        crystalPerHour:      window._crystalPerHour      || 0,
        he3PerHour:            window._he3PerHour            || 0,
        espSuccessfulMissions: window._espSuccessfulMissions || 0,
        espStealMissions:      window._espStealMissions      || 0,
      },
      storageBuffer, buildQueue, recycleQueue, ACHIEVES,
      ownedCommanders: window.ownedCommanders || [],
      activeCommander: window._activeCommander || null,
      deployedCommanders: window._deployedCommanders || [],
      designExtraSlots: window._designExtraSlots || 0,
      designSlotsBought: window._designSlotsBought || 0,
      formationSlots: window._formationSlots || Array(9).fill(null),
      conqueredPlanets: window._conqueredPlanets || [],
      colonyFleetReward: window._colonyFleetReward || {},
      jumpGateCooldowns: window._jumpGateCooldowns || {},
      bossCooldowns: window._bossCooldowns || {},
      fleetPosition: window._fleetPosition || null,
      dropPity: window._dropPity || {},
      dynamicStoryMissions: window._dynamicStoryMissions || [],
      viewingCmdId: window._viewingCmdId || null,
      packPity: window._packPity || {},
      packPulls: window._packPulls || {},
      cardAbilityCooldowns: Object.keys(window).filter(k=>k.startsWith('_cardAbility_'))
        .reduce((acc,k)=>{ acc[k]=window[k]; return acc; }, {}),
      cmdCooldowns: window._cmdCooldowns || {},
    };
    _cloudSave(saveData);
    const btn = document.getElementById('saveBtn');
    if (btn) { btn.textContent = t('btn.saved'); setTimeout(() => btn.textContent = t('btn.save'), 1500); }
  } catch(e) {
    console.error('Save error:', e);
  }
}

async function loadGameCloud() {
  var serverSeason = 1;
  try {
    const { data: sys } = await window._supa.from('hive_profiles').select('boosters').eq('id', '__system__').maybeSingle();
    if (sys && sys.boosters && sys.boosters.season != null) serverSeason = sys.boosters.season;
    window._serverSeason = serverSeason;
  } catch(e) {}

  const pid = _getPlayerId();
  if (!pid) return false;

  try {
    const s = await _loadFromTables();
    if (!s) return false;
    return _applyGameState(s);
  } catch(e) {
    console.error('loadGameCloud error:', e);
    return false;
  }
}

function loadGame() {
  return false;
}

function resetGame() {
  if (confirm(t('confirm.resetGame'))) {
    const pid = _getPlayerId();
    if (pid) {
      if (window._loginType === 'hive') {
        fetch('https://exmbmwukqssvgmhysamo.supabase.co/functions/v1/game-save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'reset', player_id: pid })
        }).then(() => location.reload()).catch(() => location.reload());
      } else if (window._supa) {
        const tables = ['player_resources','player_buildings','player_research','player_commander','player_fleet','player_hangar','player_ship_designs','player_blueprints','player_blueprint_fragments','player_commanders','player_deployed_commanders','player_colonies','player_instance_progress','player_missions','player_achievements','player_artifacts','player_pvp','player_espionage','player_formations','player_recycle_queue','player_build_queue','player_pack_pity','player_conquered_planets','player_jump_gate_cooldowns','player_boss_cooldowns','player_drop_pity','player_misc_state','player_defenses'];
        Promise.all(tables.map(t => window._supa.from(t).delete().eq('player_id', pid))).then(() => location.reload());
      } else { location.reload(); }
    } else { location.reload(); }
  }
}

function addTestResources() {
  if (!window._devMode) {
    if (typeof toast === 'function') toast('Nije dostupno u produkciji!', 'err');
    return;
  }
  R.metal   += 1000;
  R.crystal += 2005;
  R.he3     += 1055;
  R.energy   = getEnergyMax();
  R.instanceKeys = (R.instanceKeys || 0) + 10;
  R.keys = (R.keys || 0) + 50;
  if (typeof updateResUI === 'function') updateResUI();
  if (typeof toast === 'function') toast('Test resursi + 10 inst. kljuceva + 50  za karte!', 'ok');
  saveGame();
}
