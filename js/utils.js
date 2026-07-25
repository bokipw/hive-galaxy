// ============================================================
// HIVE GALAXY — js/utils.js
// Zajednički helperi koji se koriste u više sistema
// ============================================================

// ── RARITY BOJE ──
const RARITY_COLORS       = { C: '#ffdd00', R: '#4488ff', E: '#aa44ff', L: '#ffaa00' };
const ENEMY_RARITY_COLORS = { C: '#ffdd00', R: '#4488ff', E: '#aa44ff', L: '#ff8800' };

function enemyRarityHexColor(r) { return ENEMY_RARITY_COLORS[r] || '#aaa'; }

// ── KOMANDIRI (sve serije) ──
function getAllCommanders() {
  return [
    ...(typeof COMMANDERS        !== 'undefined' ? COMMANDERS        : []),
    ...(typeof COMMANDERS_XENOS  !== 'undefined' ? COMMANDERS_XENOS  : []),
    ...(typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  ];
}

function getCommanderDef(cmdId) {
  return getAllCommanders().find(c => c.id === cmdId) || null;
}

// ── FRAKCIJE (sve serije) ──
function getAllFactions() {
  return {
    ...(typeof FACTIONS        !== 'undefined' ? FACTIONS        : {}),
    ...(typeof XENOS_FACTIONS  !== 'undefined' ? XENOS_FACTIONS  : {}),
    ...(typeof UNDEAD_FACTIONS !== 'undefined' ? UNDEAD_FACTIONS : {}),
  };
}

function getFactionInfo(faction) {
  return getAllFactions()[faction] || { name: faction, icon: '?' };
}

// ── NAGRADE PO DISTANCI PLANETE ──
const PLANET_REWARDS = {
  1: { metal: 10000,  crystal: 10000,  he3: 10000,  instKeys: 10,  cmdKeys: 1  },
  2: { metal: 20000,  crystal: 20000,  he3: 20000,  instKeys: 15,  cmdKeys: 2  },
  3: { metal: 50000,  crystal: 50000,  he3: 50000,  instKeys: 20,  cmdKeys: 5  },
  4: { metal: 100000, crystal: 100000, he3: 100000, instKeys: 50,  cmdKeys: 10 },
  5: { metal: 500000, crystal: 500000, he3: 500000, instKeys: 100, cmdKeys: 50 },
};

function getPlanetRewards(distance) {
  return PLANET_REWARDS[distance] || PLANET_REWARDS[1];
}

// ── HE3 POTROŠNJA FLOTE ──
// Svaki brod troši he3_cost svog motora (fallback 0.005)
function calcFleetHe3Cost(fleetSlots) {
  return (fleetSlots || []).reduce((sum, ship) => {
    let cost = 0.005;
    if (ship && ship.engine) {
      const engDef = (typeof ENGINES !== 'undefined' ? ENGINES : []).find(e => e.id === ship.engine);
      if (engDef && engDef.he3_cost != null) cost = engDef.he3_cost;
    }
    return sum + cost;
  }, 0);
}

// ── ORUŽJA IZ SLOTA ──
const WEAPON_SLOT_KEYS = ['weapon_1', 'weapon_2', 'weapon_3', 'weapon_4'];

function getSlotWeapons(slot) {
  if (!slot) return [];
  return WEAPON_SLOT_KEYS
    .map(key => slot[key])
    .filter(Boolean)
    .map(wid => (typeof getWeaponById === 'function' ? getWeaponById(wid) : null))
    .filter(Boolean);
}

// Najveći bonus među oružjima sa datim special tipom
function getMaxWeaponSpecialBonus(slot, specialType) {
  return getSlotWeapons(slot).reduce(
    (best, wpn) => (wpn.special?.type === specialType ? Math.max(best, wpn.special.bonus || 0) : best),
    0
  );
}

// ── BROJANJE BRODOVA KOMANDIRA ──
function countCommanderShips(commanders) {
  return (commanders || []).reduce(
    (sum, c) => sum + (c.fleet || []).reduce((a, s) => a + (s?.count || 0), 0),
    0
  );
}

// ── WINDOW STATE MAPIRANJE (load) ──
// map: { izvorniKljuc: 'windowKljuc' }
function assignWindowValues(src, map, defaultValue) {
  if (!src) return;
  Object.entries(map).forEach(([srcKey, winKey]) => {
    const val = src[srcKey];
    if (defaultValue === undefined) {
      if (val != null) window[winKey] = val;
    } else {
      window[winKey] = val != null ? val : defaultValue;
    }
  });
}
