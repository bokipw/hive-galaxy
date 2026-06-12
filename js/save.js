// ============================================================
// HIVE GALAXY — js/save.js
// Save / Load — localStorage + Supabase cloud save
// ============================================================

// ── Helper: dohvati user ID za cloud save ──
function _getSaveId() {
  if(window._supaSession) return window._supaSession.user.id;
  if(window._hiveUser)    return 'hive_' + window._hiveUser;
  return null;
}

async function _cloudSave(saveData) {
  if(!window._supa) return;

  const isEmail = !!window._supaSession;
  const isHive  = !!window._hiveUser;
  if(!isEmail && !isHive) return;

  const uid      = isEmail ? window._supaSession.user.id : 'hive_' + window._hiveUser;
  const username = isEmail
    ? (window._supaSession.user.user_metadata?.username || window._supaSession.user.email?.split('@')[0] || 'Unknown')
    : window._hiveUser;
  const score = (saveData.commander && saveData.commander.score) || 0;
  const level = (saveData.commander && saveData.commander.level) || 1;

  // Upsert save (samo email igrači)
  if(isEmail) {
    await window._supa.from('saves').upsert({
      id: uid,
      data: saveData,
      version: (saveData._version || 0) + 1,
      saved_at: new Date().toISOString()
    });
  }

  // Upsert leaderboard (samo email igrači jer leaderboard.id = auth.users uuid)
  if (isEmail) {
    await window._supa.from('leaderboard').upsert({
      id: window._supaSession.user.id,
      username,
      score,
      level,
      is_premium: window._playerPremium || false,
      updated_at: new Date().toISOString()
    });
  }

  // Upsert PvP snapshot — koristimo buildPvpFleetLocal() koji računa SVE bonuse
  const deployedFleet = typeof buildPvpFleetLocal === 'function' ? buildPvpFleetLocal().map(u => ({
    ship_id:        u.ship_id,
    name:           u.name,
    count:          u.count,
    hp:             u.hp,
    dps:            u.dps,
    shield:         u.shield,
    shield_regen:   u.shieldRegen,
    agility:        u.agility,
    speed:          u.speed,
    armor:          u.armor,
    dmg_reduction:  u.dmgReduction || 0,
    crit_bonus:     u.critBonus    || 0,
    engine_special: u.engineSpecial || null,
  })) : [];

  const commanders    = (saveData.deployedCommanders || []).map(c => ({
    id: c.id, name: c.name, rarity: c.rarity, faction: c.faction
  }));

  await window._supa.from('pvp_snapshots').upsert({
    id:         uid,
    username,
    rating:     (saveData.pvp && saveData.pvp.rating) || 1000,
    level,
    power:      typeof calcFleetTotalPower === 'function' ? calcFleetTotalPower() : 0,
    fleet:      deployedFleet,
    commanders,
    is_premium: window._playerPremium || false,
    updated_at: new Date().toISOString()
  });
}

async function _cloudLoad() {
  if(!window._supa || !window._supaSession) return null;
  const uid = window._supaSession.user.id;
  const { data, error } = await window._supa.from('saves').select('data').eq('id', uid).single();
  if(error || !data) return null;
  return data.data;
}

function saveGame() {
  try {
    const saveData = {
      R,
      buildings,
      commander,
      research,
      fleet,
      ownedBlueprints,
      blueprintFragments,
      colonies,
      pvp,
      espDrones,
      espReports,
      artifactFragments,
      activeFormation,
      starterGiven,
      shipDesigns,
      hangar,
      instProgress: window._instProgress,
      pvpShield: window.pvpShield,
      artifactState: window.artifactState,
      achievementState: window.achievementState,
      missionState: window.missionState,
      missionCounters: {
        dailyInst: window._dailyInstCount||0,
        dailyDepot: window._dailyDepotCount||0,
        dailyRes: window._dailyResCount||0,
        dailyShip: window._dailyShipCount||0,
        dailyPvp: window._dailyPvpCount||0,
        dailyEsp: window._dailyEspCount||0,
        dailyBuild: window._dailyBuildCount||0,
        dailyArt: window._dailyArtCount||0,
        weeklyInst: window._weeklyInstCount||0,
        weeklyPvp: window._weeklyPvpCount||0,
        weeklyRes: window._weeklyResCount||0,
      },
      totalMetalMined: window._totalMetalMined,
      totalDepotPickups: window._totalDepotPickups,
      storageBuffer,
      buildQueue,
      recycleQueue,
      ACHIEVES,
      // Karte komandira + flote komandira (fleet je unutar ownedCommanders[i].fleet)
      ownedCommanders:    window.ownedCommanders    || [],
      activeCommander:    window._activeCommander    || null,
      deployedCommanders:  window._deployedCommanders  || [],
      designExtraSlots:    window._designExtraSlots    || 0,
      designSlotsBought:   window._designSlotsBought   || 0,
      formationSlots:     window._formationSlots     || Array(9).fill(null),
      conqueredPlanets:     window._conqueredPlanets     || [],
      colonyFleetReward:    window._colonyFleetReward    || {},
      jumpGateCooldowns:    window._jumpGateCooldowns    || {},
      fleetPosition:        window._fleetPosition        || null,
      dropPity:             window._dropPity             || {},
      dynamicStoryMissions: window._dynamicStoryMissions || [],
      viewingCmdId:       window._viewingCmdId       || null,
      packPity:           window._packPity           || {},
      packPulls:          window._packPulls          || {},
      cardAbilityCooldowns: Object.keys(window).filter(k=>k.startsWith('_cardAbility_'))
        .reduce((acc,k)=>{ acc[k]=window[k]; return acc; }, {}),
    };
    localStorage.setItem('hive_save', JSON.stringify(saveData));
    _cloudSave(saveData); // async, ne blokira
    const btn = document.getElementById('saveBtn');
    if (btn) { btn.textContent = '✅ Sačuvano'; setTimeout(() => btn.textContent = '💾 Sačuvaj', 1500); }
  } catch(e) {
    console.error('Save error:', e);
  }
}

async function loadGameCloud() {
  const cloudData = await _cloudLoad();
  if(cloudData) {
    localStorage.setItem('hive_save', JSON.stringify(cloudData));
  }
  return loadGame();
}

function loadGame() {
  const raw = localStorage.getItem('hive_save');
  if (!raw) return false;
  try {
    const s = JSON.parse(raw);

    if (s.R)               Object.assign(R, s.R);
    if (s.storageBuffer)   Object.assign(storageBuffer, s.storageBuffer);
    if (s.buildQueue)      buildQueue = s.buildQueue;
    if (s.recycleQueue)    recycleQueue = s.recycleQueue;
    if (s.buildings)       Object.keys(s.buildings).forEach(k => { if (buildings[k]) buildings[k].level = s.buildings[k].level; });
    if (s.commander)       Object.assign(commander, s.commander);
    // Migracija: nextExp se sad računa iz formule, ne sprema se statično
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

    // Karte komandira + flote komandira
    if (s.ownedCommanders)    window.ownedCommanders    = s.ownedCommanders;
    if (s.activeCommander)    window._activeCommander   = s.activeCommander;
    if (s.deployedCommanders)              window._deployedCommanders = s.deployedCommanders;
    if (s.designExtraSlots  != null)       window._designExtraSlots   = s.designExtraSlots;
    if (s.designSlotsBought != null)       window._designSlotsBought  = s.designSlotsBought;
    if (s.formationSlots)     window._formationSlots     = s.formationSlots;
    if (s.viewingCmdId)       window._viewingCmdId      = s.viewingCmdId;
    if (s.packPity)           window._packPity          = s.packPity;
    if (s.packPulls)          window._packPulls         = s.packPulls;
    if (s.cardAbilityCooldowns) Object.assign(window, s.cardAbilityCooldowns);
    // Legacy migration: stari cmdFleet se ignorira (flota je sada unutar ownedCommanders)
    if (!window._deployedCommanders) window._deployedCommanders = [];
    if (!window._formationSlots) window._formationSlots = Array(9).fill(null);
    if (s.conqueredPlanets)     window._conqueredPlanets     = s.conqueredPlanets;
    if (!window._conqueredPlanets) window._conqueredPlanets  = [];
    if (s.colonyFleetReward)    window._colonyFleetReward    = s.colonyFleetReward;
    if (!window._colonyFleetReward) window._colonyFleetReward = {};
    if (s.jumpGateCooldowns)    window._jumpGateCooldowns    = s.jumpGateCooldowns;
    if (!window._jumpGateCooldowns) window._jumpGateCooldowns = {};
    if (s.dropPity)             window._dropPity             = s.dropPity;
    if (!window._dropPity)      window._dropPity             = {};
    window._fleetPosition = s.fleetPosition || null;
    if (s.dynamicStoryMissions) window._dynamicStoryMissions = s.dynamicStoryMissions;
    if (!window._dynamicStoryMissions) window._dynamicStoryMissions = [];

    return true;
  } catch(e) {
    console.error('Load error:', e);
    return false;
  }
}

function resetGame() {
  if (confirm('⚠️ SIGURNO? Ovo će obrisati SAV napredak!')) {
    localStorage.removeItem('hive_save');
    location.reload();
  }
}

function addTestResources() {
  R.metal   += 10055555500;
  R.crystal += 200555555500;
  R.he3     += 1055555000;
  R.energy   = getEnergyMax();
  R.instanceKeys = (R.instanceKeys || 0) + 100;
  R.keys = (R.keys || 0) + 500; // +500 ključeva za pull karte
  if (typeof updateResUI === 'function') updateResUI();
  if (typeof toast === 'function') toast('➕ Test resursi + 100 inst. ključeva + 500 🗝️ za karte!', 'ok');
  saveGame();
}