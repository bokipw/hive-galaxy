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
    const resp = await fetch('https://exmbmwukqssvgmhysamo.supabase.co/functions/v1/game-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', player_id: window._hiveUser, data: payload })
    });
    const result = await resp.json();
    if (!result.success) console.error('[hiveSave] error:', result.errors);
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
      u('player_achievements', { player_id: pid, achieves: payload.ACHIEVES, state: payload.achievementState }),
      u('player_artifacts', { player_id: pid, fragments: payload.artifactFragments, state: payload.artifactState }),
      u('player_pvp', { player_id: pid, wins: payload.pvp?.wins, losses: payload.pvp?.losses, rating: payload.pvp?.rating, history: payload.pvp?.history, shield: payload.pvpShield }),
      u('player_espionage', { player_id: pid, drones: payload.espDrones, reports: payload.espReports }),
      u('player_formations', { player_id: pid, active_formation: payload.activeFormation, formation_slots: payload.formationSlots }),
      u('player_recycle_queue', { player_id: pid, queue: payload.recycleQueue }),
      u('player_build_queue', { player_id: pid, queue: payload.buildQueue }),
      u('player_pack_pity', { player_id: pid, pity: payload.packPity, pulls: payload.packPulls }),
      u('player_conquered_planets', { player_id: pid, planets: payload.conqueredPlanets, fleet_reward: payload.colonyFleetReward }),
      u('player_jump_gate_cooldowns', { player_id: pid, cooldowns: payload.jumpGateCooldowns }),
      u('player_boss_cooldowns', { player_id: pid, cooldowns: payload.bossCooldowns }),
      u('player_drop_pity', { player_id: pid, pity: payload.dropPity }),
      u('player_misc_state', { player_id: pid, starter_given: payload.starterGiven, fleet_position: payload.fleetPosition, viewing_cmd_id: payload.viewingCmdId, card_ability_cooldowns: payload.cardAbilityCooldowns }),
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
  const isHive = window._loginType === 'hive';
  try {
    const deployedFleet = typeof buildPvpFleetLocal === 'function' ? buildPvpFleetLocal().map(u => ({
      ship_id: u.ship_id, name: u.name, count: u.count, hp: u.hp, dps: u.dps,
      shield: u.shield, shield_regen: u.shieldRegen, agility: u.agility,
      speed: u.speed, armor: u.armor, dmg_reduction: u.dmgReduction || 0,
      crit_bonus: u.critBonus || 0, engine_special: u.engineSpecial || null,
    })) : [];
    const commanders = (saveData.deployedCommanders || []).map(c => ({
      id: c.id, name: c.name, rarity: c.rarity, faction: c.faction
    }));
    const score = (saveData.R && saveData.R.score) || 0;
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
    if (isHive) {
      await fetch('https://exmbmwukqssvgmhysamo.supabase.co/functions/v1/game-save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', player_id: pid, data: { _pvp_snapshot: payload } })
      });
    } else {
      await window._supa.from('pvp_snapshots').upsert(payload);
    }
  } catch(e) { console.error('[pvpSave] exception:', e); }
}

async function _cloudSave(saveData) {
  if (!window._supa) return;
  if (!saveData || !saveData.R || typeof saveData.R.metal !== 'number' || saveData.R.metal <= 0) return;
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
    if (s.achievementState)        window.achievementState = s.achievementState;
    if (s.missionState)            window.missionState = s.missionState;
    if (s.missionCounters) {
      const mc = s.missionCounters;
      window._dailyInstCount  = mc.dailyInst  || 0;
      window._dailyDepotCount = mc.dailyDepot || 0;
      window._dailyResCount   = mc.dailyRes   || 0;
      window._dailyShipCount  = mc.dailyShip  || 0;
      window._dailyPvpCount   = mc.dailyPvp   || 0;
      window._dailyEspCount   = mc.dailyEsp   || 0;
      window._dailyBuildCount = mc.dailyBuild || 0;
      window._dailyArtCount   = mc.dailyArt   || 0;
      window._weeklyInstCount = mc.weeklyInst || 0;
      window._weeklyPvpCount  = mc.weeklyPvp  || 0;
      window._weeklyResCount  = mc.weeklyRes  || 0;
    }
    if (s.totalMetalMined != null) window._totalMetalMined = s.totalMetalMined;
    if (s.totalDepotPickups != null) window._totalDepotPickups = s.totalDepotPickups;
    if (s.ACHIEVES)                ACHIEVES = s.ACHIEVES;
    if (s.ownedCommanders)    window.ownedCommanders    = s.ownedCommanders;
    if (s.activeCommander)    window._activeCommander   = s.activeCommander;
    if (s.deployedCommanders)        window._deployedCommanders = s.deployedCommanders;
    if (s.designExtraSlots  != null) window._designExtraSlots   = s.designExtraSlots;
    if (s.designSlotsBought != null) window._designSlotsBought  = s.designSlotsBought;
    if (s.formationSlots)     window._formationSlots     = s.formationSlots;
    if (s.viewingCmdId)       window._viewingCmdId      = s.viewingCmdId;
    if (s.packPity)           window._packPity          = s.packPity;
    if (s.packPulls)          window._packPulls         = s.packPulls;
    if (s.cardAbilityCooldowns) Object.assign(window, s.cardAbilityCooldowns);
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
      D: pdef.defenses || {},
    },
    buildings: pb.buildings || {},
    commander: { level: pc.level || 1, exp: pc.exp || 0, nextExp: pc.next_exp || 1000, title: pc.title || 'Kadet' },
    research: pres.research || {},
    fleet: pf.fleet || [null,null,null,null,null,null,null,null,null],
    ownedBlueprints: pbl.owned || {},
    blueprintFragments: pbf.fragments || {},
    colonies: pcol.colonies || [],
    pvp: { wins: ppvp.wins || 0, losses: ppvp.losses || 0, rating: ppvp.rating || 1000, history: ppvp.history || [] },
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
    totalMetalMined: pr.total_metal_mined || 0,
    totalDepotPickups: pr.total_depot_pickups || 0,
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
        dailyPvp: window._dailyPvpCount||0, dailyEsp: window._dailyEspCount||0,
        dailyBuild: window._dailyBuildCount||0, dailyArt: window._dailyArtCount||0,
        weeklyInst: window._weeklyInstCount||0, weeklyPvp: window._weeklyPvpCount||0,
        weeklyRes: window._weeklyResCount||0,
      },
      totalMetalMined: window._totalMetalMined,
      totalDepotPickups: window._totalDepotPickups,
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
    if (pid && window._supa) {
      const tables = ['player_resources','player_buildings','player_research','player_commander','player_fleet','player_hangar','player_ship_designs','player_blueprints','player_blueprint_fragments','player_commanders','player_deployed_commanders','player_colonies','player_instance_progress','player_missions','player_achievements','player_artifacts','player_pvp','player_espionage','player_formations','player_recycle_queue','player_build_queue','player_pack_pity','player_conquered_planets','player_jump_gate_cooldowns','player_boss_cooldowns','player_drop_pity','player_misc_state','player_defenses'];
      Promise.all(tables.map(t => window._supa.from(t).delete().eq('player_id', pid))).then(() => location.reload());
    } else {
      location.reload();
    }
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
