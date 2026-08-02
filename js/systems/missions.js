// ============================================================
// HIVE GALAXY — js/systems/missions.js
// Misije — Dnevne (10), Sedmične (3), Storyline (permanentne)
// ============================================================

// ── MISSION STATE ──
if (!window.missionState) {
  window.missionState = {
    daily: {
      date:         null,
      missions:     [],
      claimed:      [],
      bonusClaimed: false,
      rerolled:     [],
    },
    weekly: {
      week:     null,
      missions: [],
      claimed:  [],
    },
    storyline: {
      completed: [],
      claimed:   [],
    },
  };
}

// ── HELPER: DATUM/SEDMICA — BUGFIX ──
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; // BUGFIX: +1
}

function getWeekStr() {
  const d    = new Date();
  const day  = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon  = new Date(d.getFullYear(), d.getMonth(), diff); // BUGFIX: novi Date, ne mutira d
  return `${mon.getFullYear()}-${mon.getMonth() + 1}-${mon.getDate()}`; // BUGFIX: +1
}

// ── DNEVNE MISIJE ──
// ── DAILY POOL — svaki dan se random biraju 10 od ovih ──
// 'pinned: true' = uvijek uključeno (login misija)
const DAILY_MISSION_POOL = [
  // ── PINNED (uvijek tu) ──
  {
    id:     'login',
    pinned: true,
    diff:   'easy',
    name:   'Dnevna prijava',
    icon:   '📅',
    desc:   'Uloguji se u igru',
    check:  () => true,
    reward: { metal: 300, crystal: 200, he3: 100, xp: 50, instanceKeys: 1 },
  },

  // ── INSTANCE ──
  {
    id: 'instances', diff: 'easy',
    name: 'Galaktički Ratnik', icon: '⚔️',
    desc:   () => `Pređi ${window._dailyInstTarget || 1} instanc${(window._dailyInstTarget||1)===1?'u':'i'}`,
    target: () => { window._dailyInstTarget = Math.floor(Math.random() * 2) + 1; return window._dailyInstTarget; },
    check:  () => (window._dailyInstCount || 0) >= (window._dailyInstTarget || 1),
    curr:   () => window._dailyInstCount || 0,
    tgt:    () => window._dailyInstTarget || 1,
    reward: { metal: 1000, crystal: 600, he3: 300, xp: 150, instanceKeys: 1 },
  },
  {
    id: 'instances_3', diff: 'normal',
    name: 'Pustošilac Zona', icon: '🌌',
    desc:  'Pređi 3 instance danas',
    check: () => (window._dailyInstCount || 0) >= 3,
    curr:  () => window._dailyInstCount || 0,
    tgt:   () => 3,
    reward: { metal: 3500, crystal: 2200, he3: 1100, xp: 600, instanceKeys: 2 },
  },
  {
    id: 'instances_5', diff: 'nightmare',
    name: 'Džangrizavac Galaksije', icon: '🌠',
    desc:  'Pređi 5 instanci danas',
    check: () => (window._dailyInstCount || 0) >= 5,
    curr:  () => window._dailyInstCount || 0,
    tgt:   () => 5,
    reward: { metal: 8000, crystal: 5000, he3: 2500, xp: 1200, instanceKeys: 4, bpw: 30 },
  },
  {
    id: 'instances_10', diff: 'hell',
    name: 'Apokalipsa Zona', icon: '💀',
    desc:  'Pređi 10 instanci danas',
    check: () => (window._dailyInstCount || 0) >= 10,
    curr:  () => window._dailyInstCount || 0,
    tgt:   () => 10,
    reward: { metal: 20000, crystal: 12000, he3: 6000, xp: 3000, instanceKeys: 8, bpw: 80 },
  },

  // ── DEPOT ──
  {
    id: 'depot', diff: 'easy',
    name: 'Logističar', icon: '📦',
    desc:   () => `Pokupi resurse iz Depota ${window._dailyDepotTarget || 2} puta`,
    target: () => { window._dailyDepotTarget = Math.floor(Math.random() * 2) + 2; return window._dailyDepotTarget; },
    check:  () => (window._dailyDepotCount || 0) >= (window._dailyDepotTarget || 2),
    curr:   () => window._dailyDepotCount || 0,
    tgt:    () => window._dailyDepotTarget || 2,
    reward: { metal: 800, crystal: 400, he3: 200, xp: 100, instanceKeys: 1 },
  },
  {
    id: 'depot_5', diff: 'normal',
    name: 'Skladištar', icon: '🏪',
    desc:  'Pokupi resurse iz Depota 5 puta danas',
    check: () => (window._dailyDepotCount || 0) >= 5,
    curr:  () => window._dailyDepotCount || 0,
    tgt:   () => 5,
    reward: { metal: 2200, crystal: 1200, he3: 600, xp: 300, instanceKeys: 1 },
  },

  // ── ISTRAŽIVANJE ──
  {
    id: 'research', diff: 'easy',
    name: 'Naučnik Dana', icon: '🔬',
    desc:   () => `Istraži ${window._dailyResTarget || 1} puta`,
    target: () => { window._dailyResTarget = Math.floor(Math.random() * 2) + 1; return window._dailyResTarget; },
    check:  () => (window._dailyResCount || 0) >= (window._dailyResTarget || 1),
    curr:   () => window._dailyResCount || 0,
    tgt:    () => window._dailyResTarget || 1,
    reward: { metal: 600, crystal: 500, he3: 250, xp: 120, instanceKeys: 1 },
  },
  {
    id: 'research_5', diff: 'normal',
    name: 'Marljivi Naučnik', icon: '🧪',
    desc:  'Završi 5 istraživanja danas',
    check: () => (window._dailyResCount || 0) >= 5,
    curr:  () => window._dailyResCount || 0,
    tgt:   () => 5,
    reward: { metal: 3000, crystal: 2200, he3: 1200, xp: 520, instanceKeys: 2 },
  },
  {
    id: 'research_10', diff: 'nightmare',
    name: 'Naučni Fanatik', icon: '🧬',
    desc:  'Završi 10 istraživanja danas',
    check: () => (window._dailyResCount || 0) >= 10,
    curr:  () => window._dailyResCount || 0,
    tgt:   () => 10,
    reward: { metal: 7000, crystal: 5500, he3: 2800, xp: 1200, instanceKeys: 3, bpw: 25 },
  },

  // ── BRODOVI ──
  {
    id: 'build_ships', diff: 'easy',
    name: 'Brodograditelj', icon: '🚀',
    desc:   () => `Izgradi ${window._dailyShipTarget || 50} brodova`,
    target: () => { window._dailyShipTarget = [50, 100][Math.floor(Math.random()*2)]; return window._dailyShipTarget; },
    check:  () => (window._dailyShipCount || 0) >= (window._dailyShipTarget || 50),
    curr:   () => window._dailyShipCount || 0,
    tgt:    () => window._dailyShipTarget || 50,
    reward: { metal: 1200, crystal: 700, he3: 350, xp: 180, instanceKeys: 1 },
  },
  {
    id: 'build_ships_500', diff: 'normal',
    name: 'Kapetan Flote', icon: '🛰️',
    desc:  'Izgradi 500 brodova danas',
    check: () => (window._dailyShipCount || 0) >= 500,
    curr:  () => window._dailyShipCount || 0,
    tgt:   () => 500,
    reward: { metal: 3500, crystal: 2000, he3: 1000, xp: 520, instanceKeys: 2 },
  },
  {
    id: 'build_ships_2000', diff: 'nightmare',
    name: 'Admiral Rata', icon: '⚓',
    desc:  'Izgradi 2000 brodova danas',
    check: () => (window._dailyShipCount || 0) >= 2000,
    curr:  () => window._dailyShipCount || 0,
    tgt:   () => 2000,
    reward: { metal: 9000, crystal: 5500, he3: 2800, xp: 1300, instanceKeys: 4, bpw: 40 },
  },
  {
    id: 'build_ships_5000', diff: 'hell',
    name: 'Tvornica Apokalipse', icon: '💀',
    desc:  'Izgradi 5000 brodova danas',
    check: () => (window._dailyShipCount || 0) >= 5000,
    curr:  () => window._dailyShipCount || 0,
    tgt:   () => 5000,
    reward: { metal: 25000, crystal: 15000, he3: 8000, xp: 3500, instanceKeys: 8, bpw: 100 },
  },

  // ── PVP ──
  {
    id: 'pvp_battle', diff: 'normal',
    name: 'Arena Borac', icon: '🏟️',
    desc:  'Odigraj 1 PvP borbu',
    check: () => (window._dailyPvpCount || 0) >= 1,
    curr:  () => window._dailyPvpCount || 0,
    tgt:   () => 1,
    reward: { metal: 900, crystal: 500, he3: 250, xp: 150, instanceKeys: 1, bpw: 15 },
  },
  {
    id: 'pvp_win', diff: 'normal',
    name: 'Osvajač Arene', icon: '🥇',
    desc:  'Pobijedi u 1 PvP borbi danas',
    check: () => (window._dailyPvpWinCount || 0) >= 1,
    curr:  () => window._dailyPvpWinCount || 0,
    tgt:   () => 1,
    reward: { metal: 2200, crystal: 1500, he3: 750, xp: 450, instanceKeys: 2, bpw: 30 },
  },
  {
    id: 'pvp_3', diff: 'nightmare',
    name: 'Neporaženi', icon: '🏆',
    desc:  'Pobijedi u 3 PvP borbe danas',
    check: () => (window._dailyPvpWinCount || 0) >= 3,
    curr:  () => window._dailyPvpWinCount || 0,
    tgt:   () => 3,
    reward: { metal: 6000, crystal: 4000, he3: 2000, xp: 1100, instanceKeys: 4, bpw: 70 },
  },
  {
    id: 'pvp_5', diff: 'hell',
    name: 'Krvavi Šampion', icon: '⚔️',
    desc:  'Pobijedi u 5 PvP borbi danas',
    check: () => (window._dailyPvpWinCount || 0) >= 5,
    curr:  () => window._dailyPvpWinCount || 0,
    tgt:   () => 5,
    reward: { metal: 15000, crystal: 10000, he3: 5000, xp: 2800, instanceKeys: 7, bpw: 150 },
  },

  // ── ŠPIJUNAŽA ──
  {
    id: 'espionage', diff: 'normal',
    name: 'Špijun Dana', icon: '🕵️',
    desc:  'Uspješno špijuniraj 1 protivnika',
    check: () => (window._dailyEspCount || 0) >= 1,
    curr:  () => window._dailyEspCount || 0,
    tgt:   () => 1,
    reward: { metal: 1100, crystal: 900, he3: 300, xp: 180, instanceKeys: 1 },
  },
  {
    id: 'espionage_3', diff: 'nightmare',
    name: 'Majstor Sjene', icon: '🌑',
    desc:  'Uspješno špijuniraj 3 protivnika danas',
    check: () => (window._dailyEspCount || 0) >= 3,
    curr:  () => window._dailyEspCount || 0,
    tgt:   () => 3,
    reward: { metal: 5000, crystal: 4500, he3: 1800, xp: 950, instanceKeys: 3, bpw: 35 },
  },
  {
    id: 'espionage_7', diff: 'hell',
    name: 'Sjena Galaksije', icon: '🌒',
    desc:  'Uspješno špijuniraj 7 protivnika danas',
    check: () => (window._dailyEspCount || 0) >= 7,
    curr:  () => window._dailyEspCount || 0,
    tgt:   () => 7,
    reward: { metal: 13000, crystal: 11000, he3: 4500, xp: 2500, instanceKeys: 6, bpw: 90 },
  },

  // ── ZGRADE ──
  {
    id: 'upgrade_building', diff: 'easy',
    name: 'Graditelj', icon: '🏗️',
    desc:  'Unapredi 1 zgradu',
    check: () => (window._dailyBuildCount || 0) >= 1,
    curr:  () => window._dailyBuildCount || 0,
    tgt:   () => 1,
    reward: { metal: 1500, crystal: 800, he3: 400, xp: 200, instanceKeys: 1 },
  },
  {
    id: 'upgrade_3_buildings', diff: 'normal',
    name: 'Majstor Gradnje', icon: '🏛️',
    desc:  'Unapredi 3 zgrade danas',
    check: () => (window._dailyBuildCount || 0) >= 3,
    curr:  () => window._dailyBuildCount || 0,
    tgt:   () => 3,
    reward: { metal: 5500, crystal: 3000, he3: 1500, xp: 750, instanceKeys: 2 },
  },
  {
    id: 'upgrade_7_buildings', diff: 'nightmare',
    name: 'Arhitekta Rata', icon: '🏙️',
    desc:  'Unapredi 7 zgrada danas',
    check: () => (window._dailyBuildCount || 0) >= 7,
    curr:  () => window._dailyBuildCount || 0,
    tgt:   () => 7,
    reward: { metal: 12000, crystal: 7000, he3: 3500, xp: 1700, instanceKeys: 4, bpw: 40 },
  },

  // ── ARTEFAKTI ──
  {
    id: 'collect_artifacts', diff: 'normal',
    name: 'Tragač za Artefaktima', icon: '💠',
    desc:  'Dobij 1 artifact fragment',
    check: () => (window._dailyArtCount || 0) >= 1,
    curr:  () => window._dailyArtCount || 0,
    tgt:   () => 1,
    reward: { metal: 1200, crystal: 900, he3: 450, xp: 220, instanceKeys: 1 },
  },
  {
    id: 'collect_3_artifacts', diff: 'nightmare',
    name: 'Kolekcionar Fragmenata', icon: '🔮',
    desc:  'Skupi 3 artifact fragmenta danas',
    check: () => (window._dailyArtCount || 0) >= 3,
    curr:  () => window._dailyArtCount || 0,
    tgt:   () => 3,
    reward: { metal: 7000, crystal: 5500, he3: 2800, xp: 1100, instanceKeys: 3, bpw: 50 },
  },

  // ── FLEET POWER ──
  {
    id: 'fleet_power', diff: 'normal',
    name: 'Komandant Galaksije', icon: '💫',
    desc:   () => `Dostign ${fmt(window._dailyPowerTarget || 1000)} Fleet Power`,
    target: () => {
      if (!window._dailyPowerTarget) {
        const cur = calcFleetTotalPower();
        window._dailyPowerTarget = Math.max(1000, Math.floor(cur * 1.1));
      }
      return window._dailyPowerTarget;
    },
    check:  () => calcFleetTotalPower() >= (window._dailyPowerTarget || 1000),
    curr:   () => Math.min(calcFleetTotalPower(), window._dailyPowerTarget || 1000),
    tgt:    () => window._dailyPowerTarget || 1000,
    reward: { metal: 2800, crystal: 1500, he3: 750, xp: 450, instanceKeys: 1 },
  },

  // ── RESURSI ──
  {
    id: 'spend_metal', diff: 'normal',
    name: 'Potrošač Metala', icon: '🔩',
    desc:   () => `Potroši ${fmt(window._dailySpendMetalTarget || 50000)} metala danas`,
    target: () => { window._dailySpendMetalTarget = [50000, 100000][Math.floor(Math.random()*2)]; return window._dailySpendMetalTarget; },
    check:  () => (window._dailySpendMetalCount || 0) >= (window._dailySpendMetalTarget || 50000),
    curr:   () => window._dailySpendMetalCount || 0,
    tgt:    () => window._dailySpendMetalTarget || 50000,
    reward: { metal: 3500, crystal: 1200, he3: 600, xp: 300, instanceKeys: 1 },
  },
  {
    id: 'spend_metal_hell', diff: 'hell',
    name: 'Metalni Titan', icon: '🔧',
    desc:  () => `Potroši ${fmt(window._dailySpendMetalHellTarget || 500000)} metala danas`,
    target: () => { window._dailySpendMetalHellTarget = 500000; return 500000; },
    check:  () => (window._dailySpendMetalCount || 0) >= (window._dailySpendMetalHellTarget || 500000),
    curr:   () => window._dailySpendMetalCount || 0,
    tgt:    () => window._dailySpendMetalHellTarget || 500000,
    reward: { metal: 18000, crystal: 7000, he3: 3500, xp: 2000, instanceKeys: 5, bpw: 80 },
  },
  {
    id: 'spend_crystal', diff: 'normal',
    name: 'Kristalni Potrošač', icon: '💎',
    desc:   () => `Potroši ${fmt(window._dailySpendCrystalTarget || 30000)} kristala danas`,
    target: () => { window._dailySpendCrystalTarget = [30000, 60000][Math.floor(Math.random()*2)]; return window._dailySpendCrystalTarget; },
    check:  () => (window._dailySpendCrystalCount || 0) >= (window._dailySpendCrystalTarget || 30000),
    curr:   () => window._dailySpendCrystalCount || 0,
    tgt:    () => window._dailySpendCrystalTarget || 30000,
    reward: { metal: 1200, crystal: 3500, he3: 600, xp: 300, instanceKeys: 1 },
  },
];

// Aktivne dnevne misije (selected IDs) — za render
function getActiveDailyMissions() {
  const ids = window.missionState.daily.missions || [];
  return ids.map(id => DAILY_MISSION_POOL.find(m => m.id === id)).filter(Boolean);
}

// Randomni pick: 1 pinned + 9 random iz ostatka (bez ponavljanja)
function pickDailyMissions() {
  const pinned   = DAILY_MISSION_POOL.filter(m => m.pinned).map(m => m.id);
  const optional = DAILY_MISSION_POOL.filter(m => !m.pinned && !isMissionImpossible(m));
  const shuffled = optional.slice().sort(() => Math.random() - 0.5);
  const picked   = shuffled.slice(0, 10 - pinned.length).map(m => m.id);
  return [...pinned, ...picked];
}

// Backward compat alias
const DAILY_MISSION_TYPES = DAILY_MISSION_POOL;

// ── WEEKLY POOL — svake sedmice se random biraju 7 od ovih ──
const WEEKLY_MISSION_POOL = [
  // ── INSTANCE ──
  {
    id: 'weekly_instances', diff: 'normal',
    name:  'Sedmični Osvajač',
    icon:  '🌌',
    desc:  () => `Pređi ${window._weeklyInstTarget || 5} instanci ove sedmice`,
    target: () => { window._weeklyInstTarget = Math.floor(Math.random() * 6) + 5; return window._weeklyInstTarget; },
    check: () => (window._weeklyInstCount || 0) >= (window._weeklyInstTarget || 5),
    curr:  () => window._weeklyInstCount || 0,
    tgt:   () => window._weeklyInstTarget || 5,
    reward: { metal: 10000, crystal: 5000, he3: 2500, xp: 1000, instanceKeys: 5, bpw: 50 },
  },
  {
    id: 'weekly_instances_hard', diff: 'nightmare',
    name:  'Osvajač Galaksije',
    icon:  '🌠',
    desc:  () => `Pređi ${window._weeklyInstHardTarget || 15} instanci ove sedmice`,
    target: () => { window._weeklyInstHardTarget = Math.floor(Math.random() * 6) + 15; return window._weeklyInstHardTarget; },
    check: () => (window._weeklyInstCount || 0) >= (window._weeklyInstHardTarget || 15),
    curr:  () => window._weeklyInstCount || 0,
    tgt:   () => window._weeklyInstHardTarget || 15,
    reward: { metal: 20000, crystal: 10000, he3: 5000, xp: 2500, instanceKeys: 10, bpw: 150 },
  },

  // ── PVP ──
  {
    id: 'weekly_pvp', diff: 'normal',
    name:  'Arena Šampion',
    icon:  '⚔️',
    desc:  () => `Pobijedi u ${window._weeklyPvpTarget || 2} PvP borbi ove sedmice`,
    target: () => { window._weeklyPvpTarget = Math.floor(Math.random() * 4) + 2; return window._weeklyPvpTarget; },
    check: () => (window._weeklyPvpCount || 0) >= (window._weeklyPvpTarget || 2),
    curr:  () => window._weeklyPvpCount || 0,
    tgt:   () => window._weeklyPvpTarget || 2,
    reward: { metal: 8000, crystal: 6000, he3: 3000, xp: 1500, bpw: 100, instanceKeys: 3 },
  },
  {
    id: 'weekly_pvp_hard', diff: 'hell',
    name:  'Neporaženi Šampion',
    icon:  '🏅',
    desc:  () => `Pobijedi u ${window._weeklyPvpHardTarget || 7} PvP borbi ove sedmice`,
    target: () => { window._weeklyPvpHardTarget = Math.floor(Math.random() * 4) + 7; return window._weeklyPvpHardTarget; },
    check: () => (window._weeklyPvpCount || 0) >= (window._weeklyPvpHardTarget || 7),
    curr:  () => window._weeklyPvpCount || 0,
    tgt:   () => window._weeklyPvpHardTarget || 7,
    reward: { metal: 18000, crystal: 14000, he3: 7000, xp: 4000, bpw: 300, instanceKeys: 8, art_fragment: 'R' },
  },

  // ── ISTRAŽIVANJE ──
  {
    id: 'weekly_research', diff: 'normal',
    name:  'Sedmični Istraživač',
    icon:  '🔬',
    desc:  () => `Istraži ${window._weeklyResTarget || 10} puta ove sedmice`,
    target: () => { window._weeklyResTarget = Math.floor(Math.random() * 10) + 10; return window._weeklyResTarget; },
    check: () => (window._weeklyResCount || 0) >= (window._weeklyResTarget || 10),
    curr:  () => window._weeklyResCount || 0,
    tgt:   () => window._weeklyResTarget || 10,
    reward: { metal: 12000, crystal: 8000, he3: 4000, xp: 2000, art_fragment: 'R', instanceKeys: 5 },
  },
  {
    id: 'weekly_research_hard', diff: 'nightmare',
    name:  'Naučna Ekspedicija',
    icon:  '🧬',
    desc:  () => `Istraži ${window._weeklyResHardTarget || 30} puta ove sedmice`,
    target: () => { window._weeklyResHardTarget = Math.floor(Math.random() * 10) + 30; return window._weeklyResHardTarget; },
    check: () => (window._weeklyResCount || 0) >= (window._weeklyResHardTarget || 30),
    curr:  () => window._weeklyResCount || 0,
    tgt:   () => window._weeklyResHardTarget || 30,
    reward: { metal: 25000, crystal: 18000, he3: 9000, xp: 5000, instanceKeys: 8, bpw: 200, art_fragment: 'R' },
  },

  // ── ZGRADE ──
  {
    id: 'weekly_buildings', diff: 'normal',
    name:  'Arhitekta Galaksije',
    icon:  '🏗️',
    desc:  () => `Unapredi ${window._weeklyBuildTarget || 5} zgrada ove sedmice`,
    target: () => { window._weeklyBuildTarget = Math.floor(Math.random() * 6) + 5; return window._weeklyBuildTarget; },
    check: () => (window._weeklyBuildCount || 0) >= (window._weeklyBuildTarget || 5),
    curr:  () => window._weeklyBuildCount || 0,
    tgt:   () => window._weeklyBuildTarget || 5,
    reward: { metal: 15000, crystal: 10000, he3: 5000, xp: 1800, instanceKeys: 4, bpw: 80 },
  },
  {
    id: 'weekly_buildings_hard', diff: 'nightmare',
    name:  'Urbanista Svemira',
    icon:  '🏙️',
    desc:  () => `Unapredi ${window._weeklyBuildHardTarget || 15} zgrada ove sedmice`,
    target: () => { window._weeklyBuildHardTarget = Math.floor(Math.random() * 6) + 15; return window._weeklyBuildHardTarget; },
    check: () => (window._weeklyBuildCount || 0) >= (window._weeklyBuildHardTarget || 15),
    curr:  () => window._weeklyBuildCount || 0,
    tgt:   () => window._weeklyBuildHardTarget || 15,
    reward: { metal: 30000, crystal: 20000, he3: 10000, xp: 4500, instanceKeys: 7, bpw: 200 },
  },

  // ── BRODOVI ──
  {
    id: 'weekly_ships', diff: 'normal',
    name:  'Sedmični Brodograditelj',
    icon:  '🚀',
    desc:  () => `Izgradi ${window._weeklyShipTarget || 200} brodova ove sedmice`,
    target: () => { window._weeklyShipTarget = [200, 500, 1000][Math.floor(Math.random() * 3)]; return window._weeklyShipTarget; },
    check: () => (window._weeklyShipCount || 0) >= (window._weeklyShipTarget || 200),
    curr:  () => window._weeklyShipCount || 0,
    tgt:   () => window._weeklyShipTarget || 200,
    reward: { metal: 20000, crystal: 10000, he3: 5000, xp: 2000, instanceKeys: 5, bpw: 60 },
  },
  {
    id: 'weekly_ships_hard', diff: 'hell',
    name:  'Admiral Flote',
    icon:  '⚓',
    desc:  () => `Izgradi ${window._weeklyShipHardTarget || 5000} brodova ove sedmice`,
    target: () => { window._weeklyShipHardTarget = [5000, 10000, 20000][Math.floor(Math.random() * 3)]; return window._weeklyShipHardTarget; },
    check: () => (window._weeklyShipCount || 0) >= (window._weeklyShipHardTarget || 5000),
    curr:  () => window._weeklyShipCount || 0,
    tgt:   () => window._weeklyShipHardTarget || 5000,
    reward: { metal: 40000, crystal: 20000, he3: 10000, xp: 5000, instanceKeys: 10, bpw: 150 },
  },

  // ── ŠPIJUNAŽA ──
  {
    id: 'weekly_espionage', diff: 'normal',
    name:  'Meštarstvo Sjene',
    icon:  '🕵️',
    desc:  () => `Uspješno špijuniraj ${window._weeklyEspTarget || 3} puta ove sedmice`,
    target: () => { window._weeklyEspTarget = Math.floor(Math.random() * 4) + 3; return window._weeklyEspTarget; },
    check: () => (window._weeklyEspCount || 0) >= (window._weeklyEspTarget || 3),
    curr:  () => window._weeklyEspCount || 0,
    tgt:   () => window._weeklyEspTarget || 3,
    reward: { metal: 10000, crystal: 12000, he3: 6000, xp: 2000, instanceKeys: 4, bpw: 120 },
  },
  {
    id: 'weekly_espionage_hard', diff: 'nightmare',
    name:  'Poglavica Obavještajaca',
    icon:  '🌑',
    desc:  () => `Uspješno špijuniraj ${window._weeklyEspHardTarget || 10} puta ove sedmice`,
    target: () => { window._weeklyEspHardTarget = Math.floor(Math.random() * 5) + 10; return window._weeklyEspHardTarget; },
    check: () => (window._weeklyEspCount || 0) >= (window._weeklyEspHardTarget || 10),
    curr:  () => window._weeklyEspCount || 0,
    tgt:   () => window._weeklyEspHardTarget || 10,
    reward: { metal: 22000, crystal: 25000, he3: 12000, xp: 5000, instanceKeys: 8, bpw: 300, art_fragment: 'R' },
  },

  // ── FLEET POWER ──
  {
    id: 'weekly_fleet_power', diff: 'nightmare',
    name:  'Dominacija Flote',
    icon:  '💫',
    desc:  () => `Dostign ${fmt(window._weeklyPowerTarget || 50000)} Fleet Power`,
    target: () => {
      if (!window._weeklyPowerTarget) {
        const cur = calcFleetTotalPower();
        window._weeklyPowerTarget = Math.max(50000, Math.floor(cur * 1.25));
      }
      return window._weeklyPowerTarget;
    },
    check: () => calcFleetTotalPower() >= (window._weeklyPowerTarget || 50000),
    curr:  () => Math.min(calcFleetTotalPower(), window._weeklyPowerTarget || 50000),
    tgt:   () => window._weeklyPowerTarget || 50000,
    reward: { metal: 25000, crystal: 15000, he3: 8000, xp: 3000, instanceKeys: 6, bpw: 200, art_fragment: 'R' },
  },
];

// Aktivne sedmične misije
function getActiveWeeklyMissions() {
  const ids = window.missionState.weekly.missions || [];
  return ids.map(id => WEEKLY_MISSION_POOL.find(m => m.id === id)).filter(Boolean);
}

// Random pick: iz svakog para (normal+hard) bira SE JEDAN — tako nema duplikata
// Parovi su definirani sufiksom '_hard'
function pickWeeklyMissions() {
  // Grupiraj u parove: base + hard verzija
  const baseTypes = WEEKLY_MISSION_POOL.filter(m => !m.id.endsWith('_hard') && !isMissionImpossible(m));
  const shuffled  = baseTypes.slice().sort(() => Math.random() - 0.5);
  const picked    = [];

  for (const base of shuffled) {
    if (picked.length >= 7) break;
    const hardId   = base.id + '_hard';
    const hard     = WEEKLY_MISSION_POOL.find(m => m.id === hardId);
    // 40% šansa za hard verziju ako postoji
    const useHard  = hard && Math.random() < 0.4;
    picked.push(useHard ? hard.id : base.id);
  }

  return picked;
}

// ── NEMOGUĆE MISIJE ──
// Misije se ne smiju generisati ako se radnja više ne može izvesti
// (npr. sva istraživanja / zgrade su na MAX nivou).
function isAllResearchMaxed() {
  return Object.values(research).every(b => b && (b.level || 0) >= 100);
}
function isAllBuildingsMaxed() {
  return Object.values(buildings).every(b => b && (b.level || 0) >= 100);
}
function isMissionImpossible(m) {
  if (!m) return false;
  const id = m.id;
  if (id.startsWith('research') || id.startsWith('weekly_research')) return isAllResearchMaxed();
  if (id.startsWith('upgrade') || id.startsWith('weekly_buildings')) return isAllBuildingsMaxed();
  return false;
}

// Zamijeni već aktivne misije koje su postale nemoguće (npr. max research usred dana)
function replaceImpossibleMissions() {
  if (!window.missionState) return;
  let changed = false;

  const replaceIn = (state, pool, exclude) => {
    const ids = state.missions || [];
    for (let i = 0; i < ids.length; i++) {
      const m = pool.find(x => x.id === ids[i]);
      if (!m || !isMissionImpossible(m)) continue;
      const available = pool.filter(x =>
        !exclude(x) && !ids.includes(x.id) && !isMissionImpossible(x));
      if (available.length === 0) continue;
      const nm = available[Math.floor(Math.random() * available.length)];
      if (nm.target) nm.target();
      ids[i] = nm.id;
      changed = true;
    }
  };

  if (window.missionState.daily) {
    replaceIn(window.missionState.daily, DAILY_MISSION_POOL, x => x.pinned);
  }
  if (window.missionState.weekly) {
    replaceIn(window.missionState.weekly, WEEKLY_MISSION_POOL, x => x.id.endsWith('_hard'));
  }
  if (changed) saveGame();
}

// Backward compat alias
const WEEKLY_MISSION_TYPES = WEEKLY_MISSION_POOL;

// ── STORYLINE MISIJE ──
// Narativ: Kolaps Imperije → Preživljavanje → Ekspanzija → Dominacija → Legenda
const STORYLINE_MISSIONS = [

  // ═══════════════════════════════════════
  // POGLAVLJE I — KOLAPS (Tier 1-3)
  // Imperija se raspala. Ti si jedan od preostalih komandanata.
  // ═══════════════════════════════════════
  {
    id: 'story_1', tier: 1,
    chapter: 'Poglavlje I: Kolaps',
    name: 'Iz Ruševina', icon: '🚀',
    desc: 'Imperija Hive pala je u jednoj noći. Tvoja baza je jedino što je ostalo. Unapredi HQ na Lv.2 i pokreni obnovu.',
    check: () => (buildings.hq?.level || 0) >= 2,
    reward: { metal: 5000, crystal: 2000, he3: 1000, xp: 300, instanceKeys: 2 },
  },
  {
    id: 'story_2', tier: 1,
    name: 'Prva Odbrana', icon: '⚙️',
    desc: 'Pirati iskorišćavaju haos. Pokreni produkciju — unapredi Metalnu Minu i Crystal Rudnik na Lv.5.',
    check: () => (buildings.metal_mine?.level || 0) >= 5 && (buildings.crystal_mine?.level || 0) >= 5,
    reward: { metal: 8000, crystal: 4000, he3: 2000, xp: 400, instanceKeys: 2 },
    requires: 'story_1',
  },
  {
    id: 'story_3', tier: 2,
    name: 'Brodogradnja', icon: '🏭',
    desc: 'Bez flote nema preživljavanja. Napravi prve brodove i rasporedi ih u flotu.',
    check: () => {
      const globalHas = fleet.some(s => s !== null);
      if (globalHas) return true;
      const deployed = window._deployedCommanders || [];
      return deployed.some(cmdId => {
        const cFleet = getCmdFleet(cmdId);
        return cFleet.some(s => s !== null);
      });
    },
    reward: { metal: 10000, crystal: 5000, he3: 2500, xp: 500, instanceKeys: 3 },
    requires: 'story_2',
  },
  {
    id: 'story_4', tier: 2,
    name: 'Krstarina', icon: '⚔️',
    desc: 'Tvoja flota je spremna. Pređi prvu instancu i dokaži da Hive nije mrtav.',
    check: () => Object.values(window._instProgress || {}).some(p => p.completed),
    reward: { metal: 15000, crystal: 8000, he3: 4000, xp: 1000, instanceKeys: 5, bpw: 50 },
    requires: 'story_3',
  },
  {
    id: 'story_5', tier: 3,
    name: 'Znanje je Oružje', icon: '🔬',
    desc: 'Stari laboratoriji su obnovljeni. Istraži prvu granu do Lv.10 i otkrij tajne Imperije.',
    check: () => Object.values(research).some(r => (r.level||0) >= 10),
    reward: { metal: 20000, crystal: 10000, he3: 5000, xp: 1500, instanceKeys: 5, bpw: 100 },
    requires: 'story_4',
  },

  // ═══════════════════════════════════════
  // POGLAVLJE II — KONSOLIDACIJA (Tier 4-6)
  // Baza raste. Drugi prebjegzi primjećuju tvoj uspjeh.
  // ═══════════════════════════════════════
  {
    id: 'story_6', tier: 4,
    chapter: 'Poglavlje II: Konsolidacija',
    name: 'Rivalstvo', icon: '🏟️',
    desc: 'Drugi komandant izaziva tebe na dvoboj. Odigraj prvu PvP borbu i odbrani svoje ime.',
    check: () => (pvp.wins + pvp.losses) >= 1,
    reward: { metal: 25000, crystal: 12000, he3: 6000, xp: 2000, instanceKeys: 8, bpw: 150 },
    requires: 'story_5',
  },
  {
    id: 'story_7', tier: 4,
    name: 'Inteligencija', icon: '🕵️',
    desc: 'Neprijatelji se okupljaju. Pošalji špijune — uspešno špijuniraj prvog protivnika.',
    check: () => espReports.some(r => r.success),
    reward: { metal: 30000, crystal: 15000, he3: 7500, xp: 2000, instanceKeys: 5, bpw: 150 },
    requires: 'story_6',
  },
  {
    id: 'story_8', tier: 5,
    name: 'Ekspanzija', icon: '🌍',
    desc: 'Hive raste. Unapredi HQ na Lv.10 i otvori nove mogućnosti za svoju bazu.',
    check: () => (buildings.hq?.level || 0) >= 10,
    reward: { metal: 35000, crystal: 18000, he3: 9000, xp: 2500, instanceKeys: 8, bpw: 200 },
    requires: 'story_7',
  },
  {
    id: 'story_9', tier: 5,
    name: 'Moć Artefakata', icon: '💠',
    desc: 'Drevni artefakti skrivaju neverovatnu moć. Otključaj prvi artefakt i proučavaj ga.',
    check: () => (window.artifactState?.unlocked?.length || 0) >= 1,
    reward: { metal: 40000, crystal: 20000, he3: 10000, xp: 3000, instanceKeys: 10, bpw: 300, art_fragment: 'R' },
    requires: 'story_8',
  },
  {
    id: 'story_10', tier: 6,
    name: 'Blokada', icon: '🛡️',
    desc: 'Neprijatelji su zaokružili sektor. Pobijedi u 3 PvP borbe i probij blokadu.',
    check: () => (pvp.wins || 0) >= 3,
    reward: { metal: 50000, crystal: 25000, he3: 12000, xp: 3500, instanceKeys: 10, bpw: 350 },
    requires: 'story_9',
  },

  // ═══════════════════════════════════════
  // POGLAVLJE III — DOMINACIJA (Tier 7-9)
  // Hive postaje sila koja se ne smije ignorisati.
  // ═══════════════════════════════════════
  {
    id: 'story_11', tier: 7,
    chapter: 'Poglavlje III: Dominacija',
    name: 'Gospodar Baze', icon: '🏛️',
    desc: 'Tvoja baza mora biti neosvojiva. Dostign HQ Lv.25 i postani jedan od moćnijih komandanata galaksije.',
    check: () => (buildings.hq?.level || 0) >= 25,
    reward: { metal: 80000, crystal: 40000, he3: 20000, xp: 5000, instanceKeys: 15, bpw: 500, art_fragment: 'E' },
    requires: 'story_10',
  },
  {
    id: 'story_12', tier: 7,
    name: 'Flota Sile', icon: '💫',
    desc: 'Skupi moćnu flotu. Dostign 100.000 Fleet Power.',
    check: () => calcFleetTotalPower() >= 100000,
    reward: { metal: 60000, crystal: 30000, he3: 15000, xp: 4000, instanceKeys: 12, bpw: 400 },
    requires: 'story_11',
  },
  {
    id: 'story_13', tier: 8,
    name: 'Zabranjena Zona', icon: '🔒',
    desc: 'Restricted instance su zabranjene od Imperije — upravo zato vrijede. Pređi prvu Restricted instancu.',
    check: () => Object.keys(window._instProgress || {}).some(k => k.startsWith('rest_') && window._instProgress[k].completed),
    reward: { metal: 100000, crystal: 50000, he3: 25000, xp: 8000, instanceKeys: 20, bpw: 1000, art_fragment: 'E' },
    requires: 'story_12',
  },
  {
    id: 'story_14', tier: 8,
    name: 'Naučna Revolucija', icon: '🧬',
    desc: 'Tvoji naučnici su postigli proboj. Dostign Lv.50 u bilo kojoj grani istraživanja.',
    check: () => Object.values(research).some(r => (r.level||0) >= 50),
    reward: { metal: 120000, crystal: 60000, he3: 30000, xp: 10000, instanceKeys: 20, bpw: 800, art_fragment: 'E' },
    requires: 'story_13',
  },

  // ═══════════════════════════════════════
  // POGLAVLJE IV — LEGENDA (Tier 10)
  // ═══════════════════════════════════════
  {
    id: 'story_15', tier: 10,
    chapter: 'Poglavlje IV: Legenda',
    name: 'Legenda Galaksije', icon: '👑',
    desc: 'Iz ruševina Imperije, izgradio si nešto što galaksija nikad nije vidjela. Dostign Fleet Power 1.000.000 i zauzmi svoje mjesto u historiji.',
    check: () => calcFleetTotalPower() >= 1000000,
    reward: { metal: 500000, crystal: 250000, he3: 125000, xp: 20000, instanceKeys: 50, bpw: 5000, art_fragment: 'L' },
    requires: 'story_14',
  },
];

// ── GENERIŠI DNEVNE MISIJE ──
function generateDailyMissions() {
  if (!window.missionState || !window.missionState.daily) window.missionState = { daily: { date: '', missions: [], claimed: [], bonusClaimed: false, rerolled: [] }, weekly: { week: null, missions: [], claimed: [] }, storyline: { completed: [], claimed: [] } };
  const today = getTodayStr();
  if (window.missionState.daily.date === today) return;

  // Reset svih countera
  window._dailyInstCount         = 0;
  window._dailyDepotCount        = 0;
  window._dailyResCount          = 0;
  window._dailyShipCount         = 0;
  window._dailyPvpCount          = 0;
  window._dailyPvpWinCount       = 0;
  window._dailyEspCount          = 0;
  window._dailyBuildCount        = 0;
  window._dailyArtCount          = 0;
  window._dailyPowerTarget       = null;
  window._dailySpendMetalTarget     = null;
  window._dailySpendMetalCount      = 0;
  window._dailySpendMetalHellTarget = null;
  window._dailySpendCrystalTarget   = null;
  window._dailySpendCrystalCount    = 0;

  // Izaberi 10 misija iz poola
  const selectedIds = pickDailyMissions();

  // Generiši targete za odabrane
  selectedIds.forEach(id => {
    const m = DAILY_MISSION_POOL.find(x => x.id === id);
    if (m?.target) m.target();
  });

  window.missionState.daily = {
    date:         today,
    missions:     selectedIds,
    claimed:      [],
    bonusClaimed: false,
    rerolled:     [],
  };

  addLog('📅 Nove dnevne misije dostupne!');
  toast('📅 Nove dnevne misije! Možeš zaraditi do 20 🗝️ danas.', 'inf');
  saveGame();
}

// ── GENERIŠI SEDMIČNE MISIJE ──
function generateWeeklyMissions() {
  if (!window.missionState || !window.missionState.weekly) window.missionState = { daily: { date: '', missions: [], claimed: [], bonusClaimed: false }, weekly: { week: null, missions: [], claimed: [] }, storyline: { completed: [], claimed: [] } };
  const week = getWeekStr();
  const existing = window.missionState.weekly;
  // Regeneriši ako je novi tjedan ILI ako ima premalo misija (stari save)
  if (existing.week === week && (existing.missions?.length || 0) >= 7) {
    // Stara save migracija: generiši target-e ako nedostaju (prije prvog save-a sa missionTargets)
    if (window._weeklyInstTarget == null && window._weeklyPvpTarget == null &&
        window._weeklyResTarget == null && window._weeklyBuildTarget == null &&
        window._weeklyShipTarget == null && window._weeklyEspTarget == null &&
        window._weeklyPowerTarget == null) {
      existing.missions.forEach(id => {
        const m = WEEKLY_MISSION_POOL.find(x => x.id === id);
        if (m?.target) m.target();
      });
      saveGame();
    }
    return;
  }
  // Zadrži bonusClaimed ako je ista sedmica (samo dopunjavanje misija)
  const keepBonus = existing.week === week;

  window._weeklyInstCount      = 0;
  window._weeklyPvpCount       = 0;
  window._weeklyResCount       = 0;
  window._weeklyBuildCount     = 0;
  window._weeklyShipCount      = 0;
  window._weeklyEspCount       = 0;
  window._weeklyPowerTarget    = null;
  window._weeklyInstTarget     = null;
  window._weeklyInstHardTarget = null;
  window._weeklyPvpTarget      = null;
  window._weeklyPvpHardTarget  = null;
  window._weeklyResTarget      = null;
  window._weeklyResHardTarget  = null;
  window._weeklyBuildTarget    = null;
  window._weeklyBuildHardTarget = null;
  window._weeklyShipTarget     = null;
  window._weeklyShipHardTarget = null;
  window._weeklyEspTarget      = null;
  window._weeklyEspHardTarget  = null;

  // Izaberi 7 misija iz poola
  const selectedIds = pickWeeklyMissions();

  // Generiši targete za odabrane
  selectedIds.forEach(id => {
    const m = WEEKLY_MISSION_POOL.find(x => x.id === id);
    if (m?.target) m.target();
  });

  window.missionState.weekly = {
    week:         week,
    missions:     selectedIds,
    claimed:      [],
    bonusClaimed: keepBonus ? (existing.bonusClaimed || false) : false,
  };

  if (!keepBonus) {
    addLog('📅 Nove sedmične misije dostupne!');
    toast('📆 Nova sedmica — 7 novih misija čeka te!', 'inf');
  }
  saveGame();
}

// ── PREUZMI NAGRADU ──
function claimMissionReward(missionId, type) {
  const state = type === 'daily'
    ? window.missionState.daily
    : type === 'weekly'
      ? window.missionState.weekly
      : window.missionState.storyline;

  if (state.claimed.includes(missionId)) return;

  const mission = type === 'storyline'
    ? STORYLINE_MISSIONS.find(m => m.id === missionId)
    : type === 'daily'
      ? DAILY_MISSION_POOL.find(m => m.id === missionId)
      : WEEKLY_MISSION_POOL.find(m => m.id === missionId);

  if (!mission) return;

  // Validacija: provjeri da je misija zaista završena
  let isComplete = false;
  try { isComplete = mission.check(); } catch(e) {}
  if (!isComplete) { toast('⚠️ Misija još nije završena!', 'warn'); return; }

  const r = mission.reward;
  if (r.metal)        R.metal        += r.metal;
  if (r.crystal)      R.crystal      += r.crystal;
  if (r.he3)          R.he3          += r.he3;
  if (r.xp)           addExp(r.xp);
  if (r.bpw)          R.spCard        = (R.spCard || 0) + r.bpw;
  if (r.instanceKeys) R.instanceKeys  = (R.instanceKeys || 0) + r.instanceKeys;
  // Komandir XP se daje automatski kroz addExp() hook u commander.js
  if (r.art_fragment && typeof addArtifactFragment === 'function') {
    if (window.ARTIFACTS_DATA) {
      const pool = ARTIFACTS_DATA.filter(a => a.rarity === r.art_fragment &&
        !window.artifactState?.unlocked?.includes(a.id));
      if (pool.length > 0) {
        const art = pool[Math.floor(Math.random() * pool.length)];
        addArtifactFragment(art.id, 1);
      }
    }
  }

  state.claimed.push(missionId);
  if (type === 'storyline') {
    window.missionState.storyline.completed.push(missionId);
  }

  updateResUI();
  saveGame();
  renderMissions();
  toast(`🎁 ${mission.icon} ${mission.name}: +${r.instanceKeys ? r.instanceKeys + '🗝️ ' : ''}nagrada preuzeta!`, 'ok');
  addLog(`🎁 Misija završena: ${mission.name}`);
}

// ── BONUS NAGRADA (10/10) ──
function claimDailyBonus() {
  if (window.missionState.daily.bonusClaimed) return;
  const activeMissions = getActiveDailyMissions();
  const completed = activeMissions.filter(m => {
    if (window.missionState.daily.claimed.includes(m.id)) return true;
    try { return m.check(); } catch(e) { return false; }
  }).length;
  if (completed < activeMissions.length) { toast(`⚠️ Završi svih ${activeMissions.length} dnevnih misija!`, 'warn'); return; }

  // AŽURIRANE NAGRADE
  R.metal        += 10000;
  R.crystal      += 10000;
  R.he3          += 10000;
  R.instanceKeys  = (R.instanceKeys || 0) + 10;
  R.spCard        = (R.spCard || 0) + 100;
  addExp(1000);

  window.missionState.daily.bonusClaimed = true;

  updateResUI();
  saveGame();
  renderMissions();
  toast('🎉 BONUS 10/10! +10k metal, +10k crystal, +10k he3, +10🗝️, +100 BPW!', 'ok');
  addLog('🎉 Dnevni bonus 10/10 preuzet!');
}

// ── SEDMIČNI BONUS (7/7) ──
function claimWeeklyBonus() {
  if (window.missionState.weekly.bonusClaimed) return;
  const activeMissions = getActiveWeeklyMissions();
  const completed = activeMissions.filter(m => {
    if (window.missionState.weekly.claimed.includes(m.id)) return true;
    try { return m.check(); } catch(e) { return false; }
  }).length;
  if (completed < activeMissions.length) {
    toast(`⚠️ Završi svih ${activeMissions.length} sedmičnih misija!`, 'warn'); return;
  }

  R.metal        += 100000;
  R.crystal      += 100000;
  R.he3          += 100000;
  R.keys          = (R.keys || 0) + 5;   // 5 komandir ključeva
  R.instanceKeys  = (R.instanceKeys || 0) + 20;
  R.spCard        = (R.spCard || 0) + 500;
  addExp(5000);

  window.missionState.weekly.bonusClaimed = true;

  updateResUI();
  saveGame();
  renderMissions();
  toast('🎉 SEDMIČNI BONUS 7/7! +100k svakog resursa, +5🃏 komandir ključeva, +20🗝️!', 'ok');
  addLog('🎉 Sedmični bonus 7/7 preuzet!');
}

// ── TRACKER FUNKCIJE ──
function trackDailyInstance()   {
  window._dailyInstCount  = (window._dailyInstCount  || 0) + 1;
  window._weeklyInstCount = (window._weeklyInstCount || 0) + 1;
}
function trackDailyDepot()      { window._dailyDepotCount = (window._dailyDepotCount || 0) + 1; }
function trackDailyResearch()   {
  window._dailyResCount  = (window._dailyResCount   || 0) + 1;
  window._weeklyResCount = (window._weeklyResCount  || 0) + 1;
}
function trackDailyShips(n)     {
  window._dailyShipCount  = (window._dailyShipCount  || 0) + (n || 1);
  window._weeklyShipCount = (window._weeklyShipCount || 0) + (n || 1);
}
function trackDailyPvp(win)     {
  window._dailyPvpCount  = (window._dailyPvpCount  || 0) + 1;
  if (win) {
    window._weeklyPvpCount  = (window._weeklyPvpCount  || 0) + 1;
    window._dailyPvpWinCount  = (window._dailyPvpWinCount  || 0) + 1;
  }
}
function trackDailyEsp()        {
  window._dailyEspCount  = (window._dailyEspCount  || 0) + 1;
  window._weeklyEspCount = (window._weeklyEspCount || 0) + 1;
}
function trackDailyBuild()      {
  window._dailyBuildCount  = (window._dailyBuildCount  || 0) + 1;
  window._weeklyBuildCount = (window._weeklyBuildCount || 0) + 1;
}
function trackDailyArt()        { window._dailyArtCount = (window._dailyArtCount || 0) + 1; }
function trackSpendResources(metal, crystal) {
  if (metal   > 0) window._dailySpendMetalCount   = (window._dailySpendMetalCount   || 0) + metal;
  if (crystal > 0) window._dailySpendCrystalCount = (window._dailySpendCrystalCount || 0) + crystal;
}

// ── DIFFICULTY CONFIG ──
const MISSION_DIFF = {
  easy:      { label: 'EASY',      color: '#00ff88', bg: 'rgba(0,255,136,0.12)',  rerollCost: 50  },
  normal:    { label: 'NORMAL',    color: '#00d4ff', bg: 'rgba(0,212,255,0.12)',  rerollCost: 100 },
  nightmare: { label: 'NIGHTMARE', color: '#aa44ff', bg: 'rgba(170,68,255,0.12)', rerollCost: 200 },
  hell:      { label: 'HELL',      color: '#ff3355', bg: 'rgba(255,51,85,0.12)',  rerollCost: 350 },
};

function _diffBadge(diff) {
  const d = MISSION_DIFF[diff] || MISSION_DIFF.normal;
  return `<span style="font-size:0.55rem;font-weight:800;letter-spacing:0.5px;
    padding:1px 6px;border-radius:4px;background:${d.bg};border:1px solid ${d.color}44;
    color:${d.color}">${d.label}</span>`;
}

// ── COUNTDOWN HELPERS ──
function _timeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = Math.floor((midnight - now) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function _timeUntilMonday() {
  const now = new Date();
  const day = now.getDay();
  const daysLeft = day === 0 ? 1 : 8 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysLeft);
  monday.setHours(0, 0, 0, 0);
  const diff = Math.floor((monday - now) / 1000);
  const d = Math.floor(diff / 86400);
  const h = Math.floor((diff % 86400) / 3600);
  return d > 0 ? `${d}d ${h}h` : `${h}h`;
}

// ── REROLL ──
function rerollDailyMission(missionId) {
  const m = DAILY_MISSION_POOL.find(x => x.id === missionId);
  if (!m || m.pinned) { toast('⚠️ Ova misija se ne može zamijeniti!', 'warn'); return; }
  if (window.missionState.daily.claimed.includes(missionId)) return;

  const activeMissions = window.missionState.daily.missions;
  const idx = activeMissions.indexOf(missionId);
  if (idx === -1) return;

  const rerolled   = window.missionState.daily.rerolled || (window.missionState.daily.rerolled = []);
  const isFirst    = !rerolled.includes(idx);
  const energyCost = 1000;
  const bpwCost    = (MISSION_DIFF[m.diff] || MISSION_DIFF.normal).rerollCost;

  if (isFirst) {
    if ((R.energy || 0) < energyCost) {
      toast(`⚠️ Prvi swap košta ${energyCost}⚡! Imaš ${Math.floor(R.energy)}⚡.`, 'warn'); return;
    }
  } else {
    if ((R.spCard || 0) < bpwCost) {
      toast(`⚠️ Trebaš ${bpwCost} BPW za swap! Imaš ${R.spCard || 0}.`, 'warn'); return;
    }
  }

  // Pool iz iste težine ili random — isključi već aktivne
  const available = DAILY_MISSION_POOL.filter(x =>
    !x.pinned && !activeMissions.includes(x.id) && x.id !== missionId && !isMissionImpossible(x)
  );
  if (available.length === 0) { toast('⚠️ Nema dostupnih misija za zamjenu!', 'warn'); return; }

  const newM = available[Math.floor(Math.random() * available.length)];
  if (newM.target) newM.target();

  if (isFirst) {
    R.energy -= energyCost;
    rerolled.push(idx);
  } else {
    R.spCard -= bpwCost;
  }
  activeMissions[idx] = newM.id;

  updateResUI();
  saveGame();
  renderMissions();
  const diffLabel = (MISSION_DIFF[newM.diff] || MISSION_DIFF.normal).label;
  const costStr   = isFirst ? `${energyCost}⚡` : `${bpwCost}🐝`;
  toast(`🎲 Swap: ${m.name} → ${newM.icon} ${newM.name} [${diffLabel}] (-${costStr})`, 'ok');
  addLog(`🎲 Misija zamijenjena: ${m.name} → ${newM.name}`);
}

// ── BADGE UPDATE ──
function updateMissionsBadge() {
  const el = document.getElementById('missionsBadge');
  if (!el) return;
  const activeDailyList  = getActiveDailyMissions();
  const activeWeeklyList = getActiveWeeklyMissions();
  let count = 0;
  activeDailyList.forEach(m => {
    if (window.missionState.daily.claimed.includes(m.id)) return;
    try { if (m.check()) count++; } catch(e) {}
  });
  activeWeeklyList.forEach(m => {
    if (window.missionState.weekly.claimed.includes(m.id)) return;
    try { if (m.check()) count++; } catch(e) {}
  });
  STORYLINE_MISSIONS.forEach(m => {
    if (window.missionState.storyline.claimed.includes(m.id)) return;
    const locked = m.requires && !window.missionState.storyline.completed.includes(m.requires);
    if (locked) return;
    try { if (m.check()) count++; } catch(e) {}
  });
  if (count > 0) {
    el.textContent = count;
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

// ── HELPER: mini progress bar za misije ──
function _missionProgress(m, completed) {
  if (completed) return '';
  if (!m.curr || !m.tgt) return '';
  let curr, tgt;
  try { curr = m.curr(); tgt = m.tgt(); } catch(e) { return ''; }
  if (!tgt || tgt <= 1) return '';
  const pct = Math.min(100, Math.floor((curr / tgt) * 100));
  const currFmt = typeof fmt === 'function' ? fmt(curr) : curr;
  const tgtFmt  = typeof fmt === 'function' ? fmt(tgt)  : tgt;
  return `
    <div style="margin:4px 0 2px">
      <div style="display:flex;justify-content:space-between;font-size:0.58rem;color:#6a90b8;margin-bottom:2px">
        <span>${currFmt} / ${tgtFmt}</span><span>${pct}%</span>
      </div>
      <div style="height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#00d4ff,#00ff88);border-radius:2px;transition:width 0.3s"></div>
      </div>
    </div>`;
}

// ── RENDER ──
let _missionTab = 'daily';

function renderMissions() {
  const el = document.getElementById('missionsContent');
  if (!el) return;

  generateDailyMissions();
  generateWeeklyMissions();
  replaceImpossibleMissions();
  updateMissionsBadge();

  const activeDailyList  = getActiveDailyMissions();
  const activeWeeklyList = getActiveWeeklyMissions();
  const dailyCompleted   = activeDailyList.filter(m => { try { if (window.missionState.daily.claimed.includes(m.id)) return true; return m.check(); } catch(e){ return false; } }).length;
  const weeklyCompleted  = activeWeeklyList.filter(m => { try { return m.check(); } catch(e){ return false; } }).length;
  const storyCompleted   = window.missionState.storyline.completed.length;

  el.innerHTML = `
    <!-- Tabs -->
    <div style="display:flex;gap:6px;margin-bottom:16px">
      ${[
        { key:'daily',     label:`📅 Dnevne (${dailyCompleted}/${activeDailyList.length})`,    color:'#00d4ff' },
        { key:'weekly',    label:`📆 Sedmične (${weeklyCompleted}/${activeWeeklyList.length})`, color:'#ffcc44' },
        { key:'storyline', label:`📖 Priča (${storyCompleted}/${STORYLINE_MISSIONS.length})`, color:'#aa44ff' },
      ].map(t => `
        <button class="btn ${_missionTab===t.key?'btn-gold':''}"
          style="font-size:0.78rem;${_missionTab===t.key?'border-color:'+t.color+';color:'+t.color:''}"
          onclick="_missionTab='${t.key}';renderMissions()">
          ${t.label}
        </button>`).join('')}
    </div>

    ${_missionTab === 'daily'     ? renderDailyMissions(dailyCompleted, activeDailyList)    : ''}
    ${_missionTab === 'weekly'    ? renderWeeklyMissions(activeWeeklyList)                  : ''}
    ${_missionTab === 'storyline' ? renderStorylineMissions()                               : ''}
  `;
}

function renderDailyMissions(completedCount, activeMissions) {
  activeMissions = activeMissions || getActiveDailyMissions();
  const total      = activeMissions.length;
  const bonusReady   = completedCount >= total;
  const bonusClaimed = window.missionState.daily.bonusClaimed;

  return `
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div>
          <div style="font-size:0.82rem;font-weight:700;color:#00d4ff">DNEVNE MISIJE</div>
          <div style="font-size:0.62rem;color:#6a90b8;margin-top:2px">
            Max danas: <span style="color:#ffcc44">20🗝️ + 30k resursa</span>
            (${total} misija + bonus) · <span style="color:#4488ff">Rotiraju svaki dan</span>
          </div>
        </div>
        <div style="font-size:0.72rem;color:#6a90b8">Reset: ponoć</div>
      </div>
      <div class="pbar" style="height:10px;margin-bottom:8px">
        <div class="pbar-fill" style="width:${(completedCount/total)*100}%;background:#00d4ff"></div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:0.72rem;color:#6a90b8">${completedCount}/${total} završeno
          <span style="color:#ff6644;margin-left:8px">⏱ Reset: ${_timeUntilMidnight()}</span>
        </span>
        <button class="btn ${bonusReady && !bonusClaimed ? 'btn-g' : ''}"
          style="font-size:0.72rem" onclick="claimDailyBonus()"
          ${!bonusReady || bonusClaimed ? 'disabled' : ''}>
          ${bonusClaimed ? '✅ Bonus preuzet' : bonusReady ? '🎉 Preuzmi bonus!' : `🎁 Bonus (${completedCount}/${total})`}
        </button>
      </div>
      ${bonusReady && !bonusClaimed ? `
        <div style="font-size:0.65rem;color:#00ff88;margin-top:6px;line-height:1.8">
          🎁 Bonus za sve misije:
          🔩+10k · 💎+10k · ⛽+10k · <span style="color:#ffcc44">🗝️+10 · 🐝+100 BPW</span> · ⭐+1000XP
        </div>` : ''}
    </div>

    <div style="font-size:0.62rem;color:#6a90b8;margin-bottom:10px;padding:4px 8px;
      background:rgba(255,255,255,0.04);border-radius:4px;line-height:1.8">
      🎲 <span style="color:white">Swap misije:</span>
      <span style="color:#ffcc44">Prvi swap svake misije = 1.000⚡</span> ·
      <span style="color:#00ff88">EASY=50🐝</span> ·
      <span style="color:#00d4ff">NORMAL=100🐝</span> ·
      <span style="color:#aa44ff">NIGHTMARE=200🐝</span> ·
      <span style="color:#ff3355">HELL=350🐝</span>
      · Imaš: <span style="color:#ffcc44">${fmt(R.spCard || 0)} BPW</span> ·
      <span style="color:#ffcc44">${fmt(Math.floor(R.energy || 0))}⚡</span>
    </div>

    <div class="grid-2">
      ${activeMissions.map(m => {
        let completed = false;
        try { completed = m.check(); } catch(e){}
        const claimed  = window.missionState.daily.claimed.includes(m.id);
        const desc     = typeof m.desc === 'function' ? m.desc() : m.desc;
        const r        = m.reward;
        const diff     = m.diff || 'normal';
        const dc       = MISSION_DIFF[diff] || MISSION_DIFF.normal;
        const canReroll = !m.pinned && !claimed;
        const slotIdx   = (window.missionState.daily.missions || []).indexOf(m.id);
        const firstRoll = !(window.missionState.daily.rerolled || []).includes(slotIdx);
        const bdrColor = claimed ? 'rgba(255,204,68,0.2)' : completed ? 'rgba(0,255,136,0.3)' : `${dc.color}22`;

        return `
          <div class="card" style="border-color:${bdrColor};background:${completed&&!claimed?'rgba(0,255,136,0.04)':''}">
            <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:5px">
              <div style="font-size:1.3rem;margin-top:2px">${completed && !claimed ? '🔔' : claimed ? '✅' : m.icon}</div>
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:2px">
                  <span style="font-size:0.76rem;font-weight:700;
                    color:${claimed?'#ffcc44':completed?'#00ff88':'white'}">${m.name}</span>
                  ${_diffBadge(diff)}
                </div>
                <div style="font-size:0.6rem;color:#6a90b8;line-height:1.4">${desc}</div>
              </div>
            </div>
            <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:3px;line-height:1.6">
              ${r.metal        ? `🔩${fmt(r.metal)} `         : ''}
              ${r.crystal      ? `💎${fmt(r.crystal)} `       : ''}
              ${r.he3          ? `⛽${fmt(r.he3)} `           : ''}
              ${r.xp           ? `⭐${fmt(r.xp)}XP `         : ''}
              ${r.instanceKeys ? `<span style="color:#ffcc44">🗝️${r.instanceKeys}</span> ` : ''}
              ${r.bpw          ? `<span style="color:#ffcc44">🐝${r.bpw}BPW</span>`        : ''}
            </div>
            ${_missionProgress(m, completed)}
            ${completed && !claimed ? `
              <button class="btn btn-g" style="width:100%;font-size:0.66rem;margin-top:5px"
                onclick="claimMissionReward('${m.id}','daily')">🎁 Preuzmi nagradu</button>
            ` : claimed ? `
              <div style="font-size:0.63rem;color:#ffcc44;text-align:center;padding:4px">✅ Preuzeto</div>
            ` : `
              <div style="display:flex;gap:4px;margin-top:5px;align-items:center">
                <div style="font-size:0.62rem;color:#6a90b8;flex:1">⏳ U toku...</div>
                ${canReroll ? `
                  <button class="btn" style="font-size:0.58rem;padding:2px 7px;color:${dc.color};
                    border-color:${dc.color}44;background:${dc.bg}"
                    onclick="rerollDailyMission('${m.id}')">🎲 Swap (${firstRoll ? '1k⚡' : dc.rerollCost + '🐝'})</button>` : ''}
              </div>
            `}
          </div>`;
      }).join('')}
    </div>`;
}

function renderWeeklyMissions(activeMissions) {
  activeMissions = activeMissions || getActiveWeeklyMissions();
  const total          = activeMissions.length;
  const weeklyCompleted = activeMissions.filter(m => {
    if (window.missionState.weekly.claimed.includes(m.id)) return true;
    try { return m.check(); } catch(e){ return false; }
  }).length;
  const bonusReady     = weeklyCompleted >= total;
  const bonusClaimed   = window.missionState.weekly.bonusClaimed;
  return `
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div>
          <div style="font-size:0.82rem;font-weight:700;color:#ffcc44">SEDMIČNE MISIJE</div>
          <div style="font-size:0.62rem;color:#6a90b8;margin-top:2px">
            Bonus: <span style="color:#ffcc44">+100k resursa · +5🃏 · +20🗝️</span>
            · <span style="color:#4488ff">Rotiraju svake sedmice</span>
          </div>
        </div>
        <div style="font-size:0.72rem;color:#6a90b8">Reset: ponedjeljak</div>
      </div>
      <div class="pbar" style="height:10px;margin-bottom:8px">
        <div class="pbar-fill" style="width:${(weeklyCompleted/total)*100}%;background:#ffcc44"></div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:0.72rem;color:#6a90b8">${weeklyCompleted}/${total} završeno
          <span style="color:#ff6644;margin-left:8px">⏱ Reset: ${_timeUntilMonday()}</span>
        </span>
        <button class="btn ${bonusReady && !bonusClaimed ? 'btn-g' : ''}"
          style="font-size:0.72rem" onclick="claimWeeklyBonus()"
          ${!bonusReady || bonusClaimed ? 'disabled' : ''}>
          ${bonusClaimed ? '✅ Bonus preuzet' : bonusReady ? '🎉 Preuzmi bonus!' : `🎁 Bonus (${weeklyCompleted}/${total})`}
        </button>
      </div>
      ${bonusReady && !bonusClaimed ? `
        <div style="font-size:0.65rem;color:#00ff88;margin-top:6px;line-height:1.8">
          🎁 Sedmični bonus: 🔩+100k · 💎+100k · ⛽+100k · <span style="color:#ffcc44">🃏+5 komandir · 🗝️+20 · 🐝+500 BPW</span> · ⭐+5000XP
        </div>` : ''}
    </div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${activeMissions.map(m => {
        let completed = false;
        try { completed = m.check(); } catch(e){}
        const claimed = window.missionState.weekly.claimed.includes(m.id);
        const desc    = typeof m.desc === 'function' ? m.desc() : m.desc;
        const r       = m.reward;
        const diff    = m.diff || 'normal';
        const dc      = MISSION_DIFF[diff] || MISSION_DIFF.normal;

        return `
          <div class="card" style="border-color:${claimed?'rgba(255,204,68,0.2)':completed?'rgba(0,255,136,0.3)':`${dc.color}22`}">
            <div style="display:flex;align-items:center;gap:12px">
              <div style="font-size:1.8rem">${completed&&!claimed?'🔔':claimed?'✅':m.icon}</div>
              <div style="flex:1">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:3px">
                  <span style="font-size:0.82rem;font-weight:700;
                    color:${claimed?'#ffcc44':completed?'#00ff88':'white'}">${m.name}</span>
                  ${_diffBadge(diff)}
                </div>
                <div style="font-size:0.68rem;color:#6a90b8;margin-top:2px">${desc}</div>
                <div style="font-size:0.6rem;color:#6a90b8;margin-top:6px;line-height:1.8">
                  ${r.metal        ? `🔩${fmt(r.metal)} `         : ''}
                  ${r.crystal      ? `💎${fmt(r.crystal)} `       : ''}
                  ${r.he3          ? `⛽${fmt(r.he3)} `           : ''}
                  ${r.xp           ? `⭐${fmt(r.xp)}XP `         : ''}
                  ${r.instanceKeys ? `<span style="color:#ffcc44">🗝️${r.instanceKeys}</span> ` : ''}
                  ${r.bpw          ? `<span style="color:#ffcc44">🐝${r.bpw}BPW</span> `       : ''}
                  ${r.art_fragment ? `<span style="color:#4488ff">🧩${r.art_fragment}</span>`  : ''}
                </div>
                ${_missionProgress(m, completed)}
              </div>
              <div style="min-width:76px;text-align:right">
                ${completed && !claimed ? `
                  <button class="btn btn-g" style="font-size:0.68rem"
                    onclick="claimMissionReward('${m.id}','weekly')">🎁 Preuzmi</button>
                ` : claimed ? `
                  <div style="color:#ffcc44;font-size:0.68rem">✅ Preuzeto</div>
                ` : `
                  <div style="color:#6a90b8;font-size:0.68rem">⏳ U toku</div>
                `}
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

function renderStorylineMissions() {
  const storyCompleted = window.missionState.storyline.completed.length;
  let lastChapter = null;
  return `
    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <div>
          <div style="font-size:0.82rem;font-weight:700;color:#aa44ff">📖 PRIČA GALAKSIJE</div>
          <div style="font-size:0.62rem;color:#6a90b8;margin-top:2px">Permanentne misije — ne resetuju se</div>
        </div>
        <div style="font-size:0.72rem;color:#aa44ff">${storyCompleted}/${STORYLINE_MISSIONS.length} završeno</div>
      </div>
      <div class="pbar" style="height:8px">
        <div class="pbar-fill" style="width:${(storyCompleted/STORYLINE_MISSIONS.length)*100}%;background:linear-gradient(90deg,#aa44ff,#ff44aa)"></div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${STORYLINE_MISSIONS.map(m => {
        const locked   = m.requires && !window.missionState.storyline.completed.includes(m.requires);
        let completed  = false;
        try { completed = !locked && m.check(); } catch(e){}
        const claimed  = window.missionState.storyline.claimed.includes(m.id);
        const r        = m.reward;
        const tierColor = m.tier <= 3 ? '#ffdd00' : m.tier <= 6 ? '#4488ff' : m.tier <= 8 ? '#aa44ff' : '#ffaa00';

        // Chapter header
        let chapterHtml = '';
        if (m.chapter && m.chapter !== lastChapter) {
          lastChapter = m.chapter;
          const chColors = {
            'Poglavlje I: Kolaps':        '#ff6644',
            'Poglavlje II: Konsolidacija': '#4488ff',
            'Poglavlje III: Dominacija':   '#aa44ff',
            'Poglavlje IV: Legenda':       '#ffcc44',
          };
          const chColor = chColors[m.chapter] || '#6a90b8';
          chapterHtml = `
            <div style="margin:8px 0 4px;padding:6px 10px;background:${chColor}18;
              border-left:3px solid ${chColor};border-radius:4px">
              <div style="font-size:0.72rem;font-weight:700;color:${chColor}">${m.chapter}</div>
            </div>`;
        }

        return chapterHtml + `
          <div class="card" style="
            border-color:${claimed?'rgba(255,204,68,0.2)':completed?'rgba(170,68,255,0.3)':locked?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.1)'};
            opacity:${locked?0.45:1}">
            <div style="display:flex;align-items:flex-start;gap:10px">
              <div style="font-size:1.5rem;margin-top:2px">${claimed?'✅':locked?'🔒':m.icon}</div>
              <div style="flex:1">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
                  <span style="font-size:0.78rem;font-weight:700;
                    color:${claimed?'#ffcc44':completed?'#aa44ff':locked?'#6a90b8':'white'}">${m.name}</span>
                  <span style="font-size:0.58rem;padding:1px 5px;border-radius:3px;
                    background:${tierColor}22;border:1px solid ${tierColor}44;color:${tierColor}">T${m.tier}</span>
                </div>
                <div style="font-size:0.65rem;color:${locked?'#4a6a88':'#8ab0c8'};margin-bottom:6px;line-height:1.5">${m.desc}</div>
                <div style="font-size:0.6rem;color:#6a90b8;line-height:1.6">
                  ${r.metal        ? `🔩${fmt(r.metal)} `         : ''}
                  ${r.crystal      ? `💎${fmt(r.crystal)} `       : ''}
                  ${r.he3          ? `⛽${fmt(r.he3)} `           : ''}
                  ${r.xp           ? `⭐${fmt(r.xp)}XP `         : ''}
                  ${r.instanceKeys ? `<span style="color:#ffcc44">🗝️${r.instanceKeys}</span> ` : ''}
                  ${r.bpw          ? `<span style="color:#ffcc44">🐝${r.bpw}BPW</span> `       : ''}
                  ${r.art_fragment ? `<span style="color:#4488ff">🧩${r.art_fragment}</span>`  : ''}
                </div>
              </div>
              <div style="min-width:80px;text-align:right">
                ${completed && !claimed ? `
                  <button class="btn btn-g" style="font-size:0.65rem;padding:4px 8px"
                    onclick="claimMissionReward('${m.id}','storyline')">🎁 Preuzmi</button>
                ` : claimed ? `
                  <div style="font-size:0.65rem;color:#ffcc44">✅ Završeno</div>
                ` : locked ? `
                  <div style="font-size:0.62rem;color:#6a90b8">🔒 Zaključano</div>
                ` : `
                  <div style="font-size:0.65rem;color:#6a90b8">⏳ U toku</div>
                `}
              </div>
            </div>
          </div>`;
      }).join('')}
      ${typeof renderRecoveryMissions === 'function' ? renderRecoveryMissions() : ''}
    </div>`;
}

// ── DYNAMIC RECOVERY MISIJE — render se dodaje u renderStorylineMissions pozivom ──
function renderRecoveryMissions() {
  return (window._dynamicStoryMissions || []).map(m => {
    const claimed = window.missionState.storyline.claimed.includes(m.id);
    const r = m.reward;
    return `
      <div style="margin:8px 0 4px;padding:6px 10px;background:#ff883318;
        border-left:3px solid #ff8833;border-radius:4px">
        <div style="font-size:0.72rem;font-weight:700;color:#ff8833">${m.chapter}</div>
      </div>
      <div class="card" style="border-color:${claimed?'rgba(255,204,68,0.2)':'rgba(255,136,51,0.3)'}">
        <div style="display:flex;align-items:flex-start;gap:10px">
          <div style="font-size:1.5rem;margin-top:2px">${claimed?'✅':m.icon}</div>
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <span style="font-size:0.78rem;font-weight:700;color:${claimed?'#ffcc44':'#ff8833'}">${m.name}</span>
              <span style="font-size:0.58rem;padding:1px 5px;border-radius:3px;
                background:#ff883322;border:1px solid #ff883344;color:#ff8833">${m._pct}% povraćaj</span>
            </div>
            <div style="font-size:0.65rem;color:#8ab0c8;margin-bottom:6px;line-height:1.5">${m.desc}</div>
            <div style="font-size:0.6rem;color:#6a90b8;line-height:1.6">
              ${r.metal   ? `🔩${fmt(r.metal)} `   : ''}
              ${r.crystal ? `💎${fmt(r.crystal)} ` : ''}
              ${r.he3     ? `⛽${fmt(r.he3)} `     : ''}
            </div>
          </div>
          <div style="min-width:80px;text-align:right">
            ${!claimed ? `
              <button class="btn btn-g" style="font-size:0.65rem;padding:4px 8px"
                onclick="claimRecoveryMission('${m.id}')">🎁 Preuzmi</button>
            ` : `<div style="font-size:0.65rem;color:#ffcc44">✅ Preuzeto</div>`}
          </div>
        </div>
      </div>`;
  }).join('');
}

// ── CLAIM RECOVERY MISIJE ──
function claimRecoveryMission(missionId) {
  if (!window._dynamicStoryMissions) return;
  const m = window._dynamicStoryMissions.find(x => x.id === missionId);
  if (!m) return;
  if (window.missionState.storyline.claimed.includes(missionId)) return;
  const r = m.reward;
  if (r.metal)   R.metal   += r.metal;
  if (r.crystal) R.crystal += r.crystal;
  if (r.he3)     R.he3     += r.he3;
  window.missionState.storyline.claimed.push(missionId);
  updateResUI();
  saveGame();
  renderMissions();
  toast(`🚑 ${m.name}: +${fmt(r.metal)} Metal, +${fmt(r.crystal)} Crystal, +${fmt(r.he3)} He3 preuzeto!`, 'ok');
  addLog(`🚑 Fleet recovery preuzet: ${m.name}`);
}
