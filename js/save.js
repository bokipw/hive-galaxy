// ============================================================
// HIVE GALAXY — js/save.js
// Save / Load — Supabase only (no localStorage)
// ============================================================

function _getSaveId() {
  if(window._supaSession) {
    const meta = window._supaSession.user.user_metadata;
    if (meta && meta.hive_username) return 'hive_' + meta.hive_username;
    return window._supaSession.user.id;
  }
  if(window._hiveUser)    return 'hive_' + window._hiveUser;
  return null;
}

async function _cloudSave(saveData) {
  if(!window._supa) return;

  // Ako je HIVE igrac bez auth sesije, sacekaj da se auth zavrsi
  var _authDone = false;
  if (window._hiveUser && !window._supaSession) {
    for (var _i = 0; _i < 30; _i++) {
      await new Promise(function(r) { setTimeout(r, 200); });
      if (window._supaSession) { _authDone = true; break; }
    }
  }
  console.log('[cloudSave] Auth:', _authDone, 'isEmail:', !!window._supaSession, 'uid:', _getSaveId ? _getSaveId() : 'N/A');

  const isEmail = !!window._supaSession;
  const isHive  = !!window._hiveUser;
  if(!isEmail && !isHive) return;

  const uid      = _getSaveId();
  const username = isEmail
    ? (window._supaSession.user.user_metadata?.username || window._supaSession.user.email?.split('@')[0] || 'Unknown')
    : window._hiveUser;
  const score = (saveData.R && saveData.R.score) || 0;
  const level = (saveData.commander && saveData.commander.level) || 1;

  try {
    await window._supa.from('saves').upsert({
      id: uid,
      data: saveData,
      version: (saveData._version || 0) + 1,
      saved_at: new Date().toISOString()
    });
  } catch(e) { console.error('cloudSave saves:', e); }

  try {
    await window._supa.from('leaderboard').upsert({
      id: uid, username, score, level,
      is_premium: window._playerPremium || false,
      updated_at: new Date().toISOString()
    });
  } catch(e) { console.error('cloudSave leaderboard:', e); }

  try {
    if (window._hiveUser) {
      await window._supa.from('hive_profiles').upsert({
        hive_user: window._hiveUser,
        bcm:       typeof R !== 'undefined' ? (R.bcm         || 0) : 0,
        bocrypto:  typeof R !== 'undefined' ? (R.bocrypto     || 0) : 0,
        spcard:    typeof R !== 'undefined' ? (R.spCard       || 0) : 0,
        keys_cmd:  typeof R !== 'undefined' ? (R.keys         || 0) : 0,
        keys_inst: typeof R !== 'undefined' ? (R.instanceKeys || 0) : 0,
      }, { onConflict: 'hive_user' });
    }
  } catch(e) { console.error('cloudSave tokens:', e); }

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
    const { error } = await window._supa.from('pvp_snapshots').upsert({
      id: uid, username,
      rating:     (saveData.pvp && saveData.pvp.rating) || 1000,
      level, power: typeof calcFleetTotalPower === 'function' ? calcFleetTotalPower() : 0,
      fleet: deployedFleet, commanders,
      is_premium: window._playerPremium || false,
      resources: {
        metal:   typeof R !== 'undefined' ? (R.metal   || 0) : 0,
        crystal: typeof R !== 'undefined' ? (R.crystal || 0) : 0,
        he3:     typeof R !== 'undefined' ? (R.he3     || 0) : 0,
      },
      updated_at: new Date().toISOString()
    });
    if (error) console.error('cloudSave pvp_snapshots:', error);
  } catch(e) { console.error('cloudSave pvp_snapshots exception:', e); }
}

function _applyGameState(s) {
  if (!s) return false;
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
    if (s.artifactState)           window.artifactState = s.artifactState;
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

function saveGame() {
  try {
    if (typeof commander === 'undefined' || !commander.level) return;
    const { bcm: _bcm, bocrypto: _boc, spCard: _sp, keys: _keys, instanceKeys: _ikeys, ...RWithoutTokens } = R;
    const saveData = {
      _savedAt: new Date().toISOString(),
      _season: window._serverSeason || 1,
      R: RWithoutTokens,
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
      ownedCommanders:    window.ownedCommanders    || [],
      activeCommander:    window._activeCommander    || null,
      deployedCommanders: window._deployedCommanders || [],
      designExtraSlots:   window._designExtraSlots   || 0,
      designSlotsBought:  window._designSlotsBought  || 0,
      formationSlots:     window._formationSlots     || Array(9).fill(null),
      conqueredPlanets:   window._conqueredPlanets   || [],
      colonyFleetReward:  window._colonyFleetReward  || {},
      jumpGateCooldowns:  window._jumpGateCooldowns  || {},
      bossCooldowns:      window._bossCooldowns      || {},
      fleetPosition:      window._fleetPosition      || null,
      dropPity:           window._dropPity           || {},
      dynamicStoryMissions: window._dynamicStoryMissions || [],
      viewingCmdId:       window._viewingCmdId       || null,
      packPity:           window._packPity           || {},
      packPulls:          window._packPulls          || {},
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
  // Ako je HIVE igrac bez auth sesije, sacekaj da se auth zavrsi
  var authWaited = false;
  if (window._hiveUser && !window._supaSession) {
    console.log('[loadGameCloud] Cekam HIVE auth...');
    for (var i = 0; i < 30; i++) {
      await new Promise(function(r) { setTimeout(r, 200); });
      if (window._supaSession) { authWaited = true; break; }
    }
    console.log('[loadGameCloud] Auth completed:', authWaited, !!window._supaSession);
  }

  // Provjeri sezonu
  var serverSeason = 1;
  try {
    const { data: sys } = await window._supa.from('hive_profiles').select('keys').eq('hive_user', '__system__').single();
    if (sys && sys.keys != null) serverSeason = sys.keys;
    window._serverSeason = serverSeason;
  } catch(e) {} 

  // Ucitaj iz Supabase
  const uid = _getSaveId();
  console.log('[loadGameCloud] uid:', uid, 'supaSession:', !!window._supaSession);
  if (!uid) return false;

  try {
    const { data, error } = await window._supa.from('saves').select('data').eq('id', uid).single();
    if (error || !data || !data.data) return false;
    const s = data.data;
    // Ne odbacujemo save zbog stare sezone — season reset resetuje samo rank/leaderboard
    return _applyGameState(s);
  } catch(e) {
    console.error('loadGameCloud error:', e);
    return false;
  }
}

// Ostavljena za kompatibilnost — čita iz Supabase ako nema lokalnog
function loadGame() {
  return false;
}

function resetGame() {
  if (confirm(t('confirm.resetGame'))) {
    const uid = _getSaveId();
    if (uid && window._supa) {
      window._supa.from('saves').delete().eq('id', uid).then(() => location.reload());
    } else {
      location.reload();
    }
  }
}

function addTestResources() {
  if (!window._devMode) {
    if (typeof toast === 'function') toast('❌ Nije dostupno u produkciji!', 'err');
    return;
  }
  R.metal   += 1000;
  R.crystal += 2005;
  R.he3     += 1055;
  R.energy   = getEnergyMax();
  R.instanceKeys = (R.instanceKeys || 0) + 10;
  R.keys = (R.keys || 0) + 50;
  if (typeof updateResUI === 'function') updateResUI();
  if (typeof toast === 'function') toast('➕ Test resursi + 10 inst. ključeva + 50 🗝️ za karte!', 'ok');
  saveGame();
}