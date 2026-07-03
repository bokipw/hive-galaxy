// ============================================================
// HIVE GALAXY — js/systems/achievements.js
// Dostignuća — NOVI SISTEM sa milestone nagradama
// ============================================================

// ============================================================
// 1. BAZA — 17 zgrada, svaka do 100 levela
// ============================================================

function generateBuildingAchievements() {
  const buildingsList = [
    'hq', 'metal_mine', 'crystal_mine', 'he3_refinery', 'depot', 'ship_factory',
    'solar', 'fusion', 'battery', 'grid',
    'turret', 'missile_bat', 'shield_gen', 'sensor',
    'jump_gate', 'laboratory', 'recycler'
  ];
  
  const achievements = [];
  
  buildingsList.forEach(buildingKey => {
    const building = buildingsData[buildingKey];
    if (!building) return;
    
    // Svakih 5 levela (5,10,15,20...100)
    for (let level = 5; level <= 100; level += 5) {
      let reward = { metal: level * 200, crystal: level * 100, he3: level * 50, xp: level * 10 };
      
      // Posebne nagrade na milestone levelima
      if (level === 25) {
        reward.art_fragment = 'C';
        reward.instanceKeys = 2;
      } else if (level === 50) {
        reward.art_fragment = 'R';
        reward.instanceKeys = 5;
        reward.bpw = 100;
      } else if (level === 75) {
        reward.art_fragment = 'E';
        reward.instanceKeys = 10;
        reward.bpw = 250;
      } else if (level === 100) {
        reward.fullBlueprint = true;
        reward.instanceKeys = 20;
        reward.bpw = 500;
        reward.art_fragment = 'L';
      } else if (level % 10 === 0) {
        reward.instanceKeys = 1;
      }
      
      achievements.push({
        category: 'base',
        id: `${buildingKey}_lvl_${level}`,
        tier: Math.ceil(level / 20),
        name: `${building.name} Lv.${level}`,
        icon: building.icon,
        desc: `Unapredi ${building.name} na Lv.${level}`,
        check: () => (buildings[buildingKey]?.level || 0) >= level,
        reward: reward,
        requires: level > 5 ? `${buildingKey}_lvl_${level-5}` : null
      });
    }
  });
  
  return achievements;
}

// ============================================================
// 2. BORBA — Instance, PvP, Fleet Power
// ============================================================

// Instance završene (ukupno)
const INSTANCE_COUNTS = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
// Instance milestone nagrade
const INSTANCE_MILESTONES = [
  { count: 1, reward: { metal: 2000, crystal: 1000, he3: 500, xp: 200, instanceKeys: 1 } },
  { count: 5, reward: { metal: 5000, crystal: 2500, he3: 1000, xp: 500, instanceKeys: 2 } },
  { count: 10, reward: { metal: 10000, crystal: 5000, he3: 2000, xp: 1000, instanceKeys: 3, bpw: 50 } },
  { count: 25, reward: { metal: 25000, crystal: 12000, he3: 5000, xp: 2500, instanceKeys: 5, art_fragment: 'C' } },
  { count: 50, reward: { metal: 50000, crystal: 25000, he3: 10000, xp: 5000, instanceKeys: 10, bpw: 150, art_fragment: 'R' } },
  { count: 100, reward: { metal: 100000, crystal: 50000, he3: 20000, xp: 10000, instanceKeys: 15, bpw: 300, art_fragment: 'E' } },
  { count: 250, reward: { metal: 250000, crystal: 125000, he3: 50000, xp: 25000, instanceKeys: 25, bpw: 750, art_fragment: 'E' } },
  { count: 500, reward: { metal: 500000, crystal: 250000, he3: 100000, xp: 50000, instanceKeys: 40, bpw: 1500, art_fragment: 'L' } },
  { count: 1000, reward: { metal: 1000000, crystal: 500000, he3: 200000, xp: 100000, instanceKeys: 75, bpw: 3000, art_fragment: 'L' } }
];

// Boss instance završene
const BOSS_INSTANCES = [
  { id: 'inst_30', name: 'Instanca 30', reward: { metal: 200000, crystal: 100000, he3: 50000, xp: 20000, instanceKeys: 10, bpw: 500, fullBlueprint: true } },
  { id: 'rest_10', name: 'Restricted 10', reward: { metal: 500000, crystal: 250000, he3: 125000, xp: 50000, instanceKeys: 20, bpw: 1000, fullBlueprint: true } },
  { id: 'trial_10', name: 'Trial 10', reward: { metal: 1000000, crystal: 500000, he3: 250000, xp: 100000, instanceKeys: 30, bpw: 2000, fullBlueprint: true, art_fragment: 'L' } },
  { id: 'const_3', name: 'Constellation 3', reward: { metal: 2000000, crystal: 1000000, he3: 500000, xp: 200000, instanceKeys: 50, bpw: 5000, fullBlueprint: true, art_fragment: 'L' } }
];

// PvP pobede
const PVP_WINS = [1, 5, 10, 25, 50, 100, 250, 500];
// PvP rating
const PVP_RATINGS = [1100, 1200, 1300, 1400, 1500, 1750, 2000, 2500];

// Fleet Power
const FLEET_POWERS = [10000, 25000, 50000, 100000, 250000, 500000, 1000000, 5000000, 10000000];

// ============================================================
// 3. ISTRAŽIVANJE — 8 grana, svaka do 100 levela
// ============================================================

const RESEARCH_BRANCHES_ACH = [
  'mining_metal', 'mining_crystal', 'mining_he3', 'weapons', 'shields', 'armor', 'espionage', 'energy'
];

function generateResearchAchievements() {
  const achievements = [];
  
  RESEARCH_BRANCHES_ACH.forEach(branch => {
    const branchName = RESEARCH_BRANCHES[branch]?.name || branch;
    const branchIcon = RESEARCH_BRANCHES[branch]?.icon || '🔬';
    
    // Svakih 10 levela
    for (let level = 10; level <= 100; level += 10) {
      let reward = { metal: level * 500, crystal: level * 300, he3: level * 150, xp: level * 50 };
      
      if (level === 25) reward.art_fragment = 'C';
      else if (level === 50) { reward.art_fragment = 'R'; reward.bpw = 100; }
      else if (level === 75) { reward.art_fragment = 'E'; reward.bpw = 250; }
      else if (level === 100) { reward.fullBlueprint = true; reward.bpw = 500; reward.art_fragment = 'L'; }
      
      achievements.push({
        category: 'research',
        id: `${branch}_lvl_${level}`,
        tier: Math.ceil(level / 25),
        name: `${branchName} Lv.${level}`,
        icon: branchIcon,
        desc: `Istraži ${branchName} na Lv.${level}`,
        check: () => (research[branch]?.level || 0) >= level,
        reward: reward,
        requires: level > 10 ? `${branch}_lvl_${level-10}` : null
      });
    }
  });
  
  return achievements;
}

// ============================================================
// 4. KOLEKCIJA — Skupljanje blueprinta po klasama i rarity
// ============================================================

function getBlueprintsByClassAndRarity(shipClass, rarity) {
  const ships = SHIPS[shipClass] || [];
  return ships.filter(s => s.rarity === rarity).map(s => s.id);
}

const COLLECTION_MILESTONES = {
  scout: { C: 10, R: 10, E: 8, L: 4 },
  fighter: { C: 12, R: 12, E: 9, L: 5 },
  cruiser: { C: 10, R: 14, E: 12, L: 6 },
  battleship: { C: 9, R: 9, E: 9, L: 6 },
  carrier: { C: 8, R: 8, E: 8, L: 6 },
  special: { C: 0, R: 0, E: 2, L: 8 }
};

function generateCollectionAchievements() {
  const achievements = [];
  
  // Po klasama i rarity
  Object.entries(COLLECTION_MILESTONES).forEach(([className, rarities]) => {
    Object.entries(rarities).forEach(([rarity, totalCount]) => {
      if (totalCount === 0) return;
      
      const milestones = [Math.floor(totalCount * 0.25), Math.floor(totalCount * 0.5), Math.floor(totalCount * 0.75), totalCount].filter(m => m > 0);
      
      milestones.forEach((count, idx) => {
        const percent = idx === 0 ? 25 : idx === 1 ? 50 : idx === 2 ? 75 : 100;
        achievements.push({
          category: 'collection',
          id: `${className}_${rarity}_${percent}`,
          tier: idx + 1,
          name: `${dn(SHIP_CLASSES[className]) || className} ${rarity} kolekcija`,
          icon: SHIP_CLASSES[className]?.icon || '🚀',
          desc: `Skupi ${percent}% ${rarity} ${dn(SHIP_CLASSES[className]) || className} brodova (${count}/${totalCount})`,
          check: () => {
            const ships = SHIPS[className] || [];
            const owned = ships.filter(s => s.rarity === rarity && ownedBlueprints[s.id]).length;
            return owned >= count;
          },
          reward: percent === 100 ? { art_fragment: rarity === 'C' ? 'C' : rarity === 'R' ? 'R' : rarity === 'E' ? 'E' : 'L', bpw: rarity === 'L' ? 500 : 100, fullBlueprint: true }
                               : { art_fragment: rarity === 'C' ? 'C' : rarity === 'R' ? 'R' : rarity === 'E' ? 'E' : 'L', bpw: 50 }
        });
      });
    });
  });
  
  return achievements;
}

// ============================================================
// 5. EKONOMIJA — Resursi i Depot
// ============================================================

const RESOURCE_MILESTONES = {
  metal: [1000000, 5000000, 10000000, 25000000, 50000000, 100000000, 500000000, 1000000000],
  crystal: [500000, 2000000, 5000000, 10000000, 25000000, 50000000, 250000000, 500000000],
  he3: [250000, 1000000, 2500000, 5000000, 10000000, 25000000, 100000000, 250000000]
};

const DEPOT_PICKUPS = [10, 50, 100, 250, 500, 1000];

// ============================================================
// 6. ŠPIJUNAŽA
// ============================================================

const ESPIONAGE_MILESTONES = [1, 5, 10, 25, 50, 100];
const ESP_RESEARCH_MILESTONES = [25, 50, 75, 100];

// ============================================================
// GENERIŠI SVE ACHIEVEMENTE
// ============================================================

let ACHIEVEMENTS = [];

// Baza
ACHIEVEMENTS.push(...generateBuildingAchievements());

// Instance ukupno
INSTANCE_MILESTONES.forEach(m => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `inst_total_${m.count}`, tier: m.count <= 10 ? 1 : m.count <= 50 ? 2 : m.count <= 250 ? 3 : 4,
    name: `Osvajač Instanci`, icon: '⚔️', desc: `Pređi ${m.count} instanci ukupno`,
    check: () => { const prog = window._instProgress; return prog && Object.values(prog).reduce((a, p) => a + (p?.clear_count || 0), 0) >= m.count; },
    reward: m.reward, requires: m.count > 1 ? `inst_total_${INSTANCE_MILESTONES[INSTANCE_MILESTONES.findIndex(x => x.count === m.count) - 1]?.count}` : null
  });
});

// Boss instance
BOSS_INSTANCES.forEach(boss => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `boss_${boss.id}`, tier: 5,
    name: `${boss.name} Osvajač`, icon: '👹', desc: `Završi ${boss.name}`,
    check: () => window._instProgress?.[boss.id]?.completed,
    reward: boss.reward
  });
});

// PvP pobede
PVP_WINS.forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `pvp_wins_${count}`, tier: count <= 10 ? 1 : count <= 50 ? 2 : count <= 250 ? 3 : 4,
    name: `Arena Borac`, icon: '🏟️', desc: `Pobijedi u ${count} PvP borbi`,
    check: () => pvp.wins >= count,
    reward: { metal: count * 500, crystal: count * 250, he3: count * 100, xp: count * 50, bpw: count <= 10 ? 10 : count <= 50 ? 50 : count <= 250 ? 150 : 300 },
    requires: idx > 0 ? `pvp_wins_${PVP_WINS[idx-1]}` : null
  });
});

// PvP rating
PVP_RATINGS.forEach((rating, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `pvp_rating_${rating}`, tier: rating <= 1200 ? 1 : rating <= 1500 ? 2 : rating <= 2000 ? 3 : 4,
    name: `Rating ${rating}`, icon: '📈', desc: `Dostigni PvP rating ${rating}`,
    check: () => pvp.rating >= rating,
    reward: { bpw: rating === 2500 ? 1000 : rating === 2000 ? 500 : rating === 1500 ? 200 : 100, instanceKeys: rating === 2500 ? 20 : rating === 2000 ? 10 : rating === 1500 ? 5 : 2 }
  });
});

// Fleet Power
FLEET_POWERS.forEach((power, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `fleet_power_${power}`, tier: power <= 100000 ? 1 : power <= 500000 ? 2 : power <= 2000000 ? 3 : 4,
    name: `Flota Moć ${typeof fmt === 'function' ? fmt(power) : power}`, icon: '💫', desc: `Dostigni ${typeof fmt === 'function' ? fmt(power) : power} Fleet Power`,
    check: () => (typeof calcFleetTotalPower === 'function' ? calcFleetTotalPower() : 0) >= power,
    reward: { metal: power / 10, crystal: power / 20, he3: power / 40, xp: power / 100, instanceKeys: power <= 100000 ? 2 : power <= 500000 ? 5 : power <= 2000000 ? 10 : 20 }
  });
});

// Istraživanje
ACHIEVEMENTS.push(...generateResearchAchievements());

// Kolekcija
ACHIEVEMENTS.push(...generateCollectionAchievements());

// Ekonomija — Metal
RESOURCE_MILESTONES.metal.forEach((amount, idx) => {
  ACHIEVEMENTS.push({
    category: 'economy', id: `metal_${amount}`, tier: amount <= 10000000 ? 1 : amount <= 100000000 ? 2 : 3,
    name: `Rudar Metala`, icon: '🔩', desc: `Skupi ukupno ${typeof fmt === 'function' ? fmt(amount) : amount} metala`,
    check: () => (window._totalMetalMined || 0) >= amount,
    reward: { metal: amount * 0.1, crystal: amount * 0.05, he3: amount * 0.02, xp: amount / 1000, bpw: amount <= 10000000 ? 50 : amount <= 100000000 ? 200 : 500 }
  });
});

// Ekonomija — Crystal
RESOURCE_MILESTONES.crystal.forEach((amount, idx) => {
  ACHIEVEMENTS.push({
    category: 'economy', id: `crystal_${amount}`, tier: amount <= 5000000 ? 1 : amount <= 50000000 ? 2 : 3,
    name: `Rudar Crystala`, icon: '💎', desc: `Skupi ukupno ${typeof fmt === 'function' ? fmt(amount) : amount} crystala`,
    check: () => (window._totalCrystalMined || 0) >= amount,
    reward: { metal: amount * 0.05, crystal: amount * 0.1, he3: amount * 0.02, xp: amount / 1000, bpw: amount <= 5000000 ? 50 : amount <= 50000000 ? 200 : 500 }
  });
});

// Ekonomija — He3
RESOURCE_MILESTONES.he3.forEach((amount, idx) => {
  ACHIEVEMENTS.push({
    category: 'economy', id: `he3_${amount}`, tier: amount <= 2500000 ? 1 : amount <= 25000000 ? 2 : 3,
    name: `Rudar He3`, icon: '⛽', desc: `Skupi ukupno ${typeof fmt === 'function' ? fmt(amount) : amount} He3`,
    check: () => (window._totalHe3Mined || 0) >= amount,
    reward: { metal: amount * 0.05, crystal: amount * 0.02, he3: amount * 0.1, xp: amount / 1000, bpw: amount <= 2500000 ? 50 : amount <= 25000000 ? 200 : 500 }
  });
});

// Recikliranje brodova
[10, 100, 250, 500, 1000, 1500, 3000].forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'economy', id: `recycled_ships_${count}`, tier: count <= 100 ? 1 : count <= 500 ? 2 : count <= 1500 ? 3 : 4,
    name: `Recikler ${count}`, icon: '♻️',
    desc: `Recikliraj ${count.toLocaleString()} brodova`,
    check: () => (window._totalShipsRecycled || 0) >= count,
    reward: { metal: count * 500, crystal: count * 250, he3: count * 100, xp: count * 20,
              bpw: count <= 100 ? 20 : count <= 500 ? 75 : count <= 1500 ? 200 : 500,
              ...(count >= 1000 ? { art_fragment: count >= 3000 ? 'E' : 'R', instanceKeys: Math.floor(count / 300) } : {}) },
    requires: idx > 0 ? `recycled_ships_${[10,100,250,500,1000,1500,3000][idx-1]}` : null
  });
});

// Depot pickups
DEPOT_PICKUPS.forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'economy', id: `depot_${count}`, tier: count <= 100 ? 1 : count <= 500 ? 2 : 3,
    name: `Sakupljač Resursa`, icon: '📦', desc: `Pokupi resurse iz Depota ${count} puta`,
    check: () => (window._totalDepotPickups || 0) >= count,
    reward: { metal: count * 100, crystal: count * 50, he3: count * 25, xp: count * 10, instanceKeys: count <= 100 ? 1 : count <= 500 ? 3 : 5 }
  });
});

// Špijunaža — uspješne
ESPIONAGE_MILESTONES.forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'espionage', id: `esp_success_${count}`, tier: count <= 10 ? 1 : count <= 50 ? 2 : 3,
    name: `Špijun`, icon: '🕵️', desc: `Uspješno špijuniraj ${count} puta`,
    check: () => (typeof espReports !== 'undefined' ? espReports.filter(r => r.success).length : 0) >= count,
    reward: { metal: count * 500, crystal: count * 400, he3: count * 200, xp: count * 50, bpw: count <= 10 ? 25 : count <= 50 ? 100 : 250 }
  });
});

// Špijunaža — research level
ESP_RESEARCH_MILESTONES.forEach(level => {
  ACHIEVEMENTS.push({
    category: 'espionage', id: `esp_research_${level}`, tier: level === 100 ? 4 : level === 75 ? 3 : level === 50 ? 2 : 1,
    name: `Špijunski Majstor`, icon: '🔬', desc: `Dostigni Espionage research Lv.${level}`,
    check: () => (research.espionage?.level || 0) >= level,
    reward: level === 100 ? { art_fragment: 'L', bpw: 1000 } : level === 75 ? { art_fragment: 'E', bpw: 500 } : level === 50 ? { art_fragment: 'R', bpw: 200 } : { art_fragment: 'C', bpw: 50 }
  });
});

// ============================================================
// 7. KOMANDIR — leveli svakih 2 (2-100)
// ============================================================

for (let lvl = 2; lvl <= 100; lvl += 2) {
  let reward = { xp: lvl * 50, metal: lvl * 300, crystal: lvl * 150, he3: lvl * 75 };
  if (lvl === 10)  { reward.bpw = 50;  reward.instanceKeys = 1; }
  if (lvl === 20)  { reward.bpw = 100; reward.instanceKeys = 2; reward.art_fragment = 'C'; }
  if (lvl === 30)  { reward.bpw = 150; reward.instanceKeys = 3; }
  if (lvl === 40)  { reward.bpw = 200; reward.instanceKeys = 5; reward.art_fragment = 'R'; }
  if (lvl === 50)  { reward.bpw = 300; reward.instanceKeys = 8; reward.art_fragment = 'R'; reward.fullBlueprint = true; }
  if (lvl === 60)  { reward.bpw = 400; reward.instanceKeys = 10; reward.art_fragment = 'E'; }
  if (lvl === 70)  { reward.bpw = 500; reward.instanceKeys = 12; reward.art_fragment = 'E'; }
  if (lvl === 80)  { reward.bpw = 700; reward.instanceKeys = 15; reward.art_fragment = 'E'; reward.fullBlueprint = true; }
  if (lvl === 90)  { reward.bpw = 900; reward.instanceKeys = 20; reward.art_fragment = 'L'; }
  if (lvl === 100) { reward.bpw = 2000; reward.instanceKeys = 30; reward.art_fragment = 'L'; reward.fullBlueprint = true; }
  ACHIEVEMENTS.push({
    category: 'commander', id: `cmd_lvl_${lvl}`, tier: Math.ceil(lvl / 25),
    name: `Komandir Lv.${lvl}`, icon: '👑',
    desc: `Dostigni Komandir nivo ${lvl}`,
    check: () => (typeof playerLevel !== 'undefined' ? playerLevel : (window.playerLevel || 0)) >= lvl,
    reward,
    requires: lvl > 2 ? `cmd_lvl_${lvl - 2}` : null
  });
}

// ── Rang titule komandira ──
const CMD_RANKS = [
  { lvl: 1,  name: 'Regrut',          icon: '🪖' },
  { lvl: 5,  name: 'Vojnik',          icon: '🪖' },
  { lvl: 10, name: 'Kaplar',          icon: '⭐' },
  { lvl: 20, name: 'Narednik',        icon: '⭐' },
  { lvl: 30, name: 'Poručnik',        icon: '🌟' },
  { lvl: 40, name: 'Kapetan',         icon: '🌟' },
  { lvl: 50, name: 'Major',           icon: '💫' },
  { lvl: 60, name: 'Pukovnik',        icon: '💫' },
  { lvl: 70, name: 'General',         icon: '🔱' },
  { lvl: 80, name: 'Admiral',         icon: '🔱' },
  { lvl: 90, name: 'Maršal',          icon: '👑' },
  { lvl: 100,'name': 'Vrhovni Komandant', icon: '✨' },
];
CMD_RANKS.forEach((rank, idx) => {
  ACHIEVEMENTS.push({
    category: 'commander', id: `cmd_rank_${rank.lvl}`, tier: Math.ceil(rank.lvl / 25) || 1,
    name: `Rang: ${rank.name}`, icon: rank.icon,
    desc: `Dostigni rang ${rank.name} (Lv.${rank.lvl})`,
    check: () => (typeof playerLevel !== 'undefined' ? playerLevel : (window.playerLevel || 0)) >= rank.lvl,
    reward: { bpw: rank.lvl * 10, instanceKeys: Math.floor(rank.lvl / 10), xp: rank.lvl * 100,
              ...(rank.lvl >= 50 ? { art_fragment: rank.lvl >= 90 ? 'L' : rank.lvl >= 70 ? 'E' : 'R' } : {}) }
  });
});

// ============================================================
// 8. INSTANCE — first clear po instanci
// ============================================================

// Instanca 1-30
for (let i = 1; i <= 30; i++) {
  const isBoss = i === 30;
  ACHIEVEMENTS.push({
    category: 'combat', id: `first_inst_${i}`, tier: i <= 10 ? 1 : i <= 20 ? 2 : 3,
    name: `Instanca ${i} — Prva Pobjeda`, icon: '⚔️',
    desc: `Završi Instancu ${i} prvi put`,
    check: () => !!(window._instProgress?.[`inst_${i}`]?.completed),
    reward: { metal: i * 5000, crystal: i * 2500, he3: i * 1000, xp: i * 500,
              instanceKeys: Math.ceil(i / 5),
              ...(i % 10 === 0 ? { bpw: i * 20, art_fragment: i >= 25 ? 'R' : 'C' } : {}),
              ...(isBoss ? { fullBlueprint: true, bpw: 500, art_fragment: 'E' } : {}) }
  });
}

// Restricted 1-10
for (let i = 1; i <= 10; i++) {
  ACHIEVEMENTS.push({
    category: 'combat', id: `first_rest_${i}`, tier: i <= 5 ? 3 : 4,
    name: `Restricted ${i} — Prva Pobjeda`, icon: '🔴',
    desc: `Završi Restricted instancu ${i} prvi put`,
    check: () => !!(window._instProgress?.[`rest_${i}`]?.completed),
    reward: { metal: i * 15000, crystal: i * 7500, he3: i * 3000, xp: i * 1500,
              instanceKeys: i * 2, bpw: i * 50,
              ...(i % 5 === 0 ? { art_fragment: i === 10 ? 'E' : 'R', fullBlueprint: i === 10 } : {}) }
  });
}

// Trial 1-10
for (let i = 1; i <= 10; i++) {
  ACHIEVEMENTS.push({
    category: 'combat', id: `first_trial_${i}`, tier: 4,
    name: `Trial ${i} — Prva Pobjeda`, icon: '💀',
    desc: `Završi Trial instancu ${i} prvi put`,
    check: () => !!(window._instProgress?.[`trial_${i}`]?.completed),
    reward: { metal: i * 30000, crystal: i * 15000, he3: i * 6000, xp: i * 3000,
              instanceKeys: i * 3, bpw: i * 100,
              ...(i % 5 === 0 ? { art_fragment: i === 10 ? 'L' : 'E', fullBlueprint: true } : {}) }
  });
}

// ============================================================
// 9. KOLEKCIJA OPREME — Blueprinti po tipu itema
// ============================================================

// Oružja (375 ukupno)
[25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375].forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'collection', id: `weapons_own_${count}`, tier: count <= 100 ? 1 : count <= 200 ? 2 : count <= 300 ? 3 : 4,
    name: `Arsenal ${count}`, icon: '⚔️',
    desc: `Otključaj ${count} blueprinta oružja`,
    check: () => (typeof WEAPONS !== 'undefined' ? WEAPONS.filter(w => ownedBlueprints[w.id]).length : 0) >= count,
    reward: { bpw: count * 2, metal: count * 1000, crystal: count * 500, he3: count * 200,
              xp: count * 100, ...(count % 75 === 0 ? { art_fragment: count === 375 ? 'L' : count >= 225 ? 'E' : 'R' } : {}),
              ...(count === 375 ? { fullBlueprint: true, instanceKeys: 20 } : {}) }
  });
});

// Štitovi (135 ukupno)
[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 135].forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'collection', id: `shields_own_${count}`, tier: count <= 45 ? 1 : count <= 90 ? 2 : 3,
    name: `Štitovi x${count}`, icon: '🛡️',
    desc: `Otključaj ${count} blueprinta štitova`,
    check: () => (typeof SHIELDS !== 'undefined' ? SHIELDS.filter(s => ownedBlueprints[s.id]).length : 0) >= count,
    reward: { bpw: count * 3, metal: count * 800, crystal: count * 400, he3: count * 160,
              xp: count * 80, ...(count % 45 === 0 ? { art_fragment: count >= 135 ? 'L' : count >= 90 ? 'E' : 'R' } : {}),
              ...(count === 135 ? { fullBlueprint: true, instanceKeys: 15 } : {}) }
  });
});

// Motori (90 ukupno)
[10, 20, 30, 40, 50, 60, 70, 80, 90].forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'collection', id: `engines_own_${count}`, tier: count <= 30 ? 1 : count <= 60 ? 2 : 3,
    name: `Motori x${count}`, icon: '🔩',
    desc: `Otključaj ${count} blueprinta motora`,
    check: () => (typeof ENGINES !== 'undefined' ? ENGINES.filter(e => ownedBlueprints[e.id]).length : 0) >= count,
    reward: { bpw: count * 4, metal: count * 700, crystal: count * 350, he3: count * 140,
              xp: count * 70, ...(count % 30 === 0 ? { art_fragment: count >= 90 ? 'L' : count >= 60 ? 'E' : 'R' } : {}),
              ...(count === 90 ? { fullBlueprint: true, instanceKeys: 10 } : {}) }
  });
});

// Moduli (do ~200 modula)
[10, 25, 50, 75, 100, 125, 150, 175, 200].forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'collection', id: `modules_own_${count}`, tier: count <= 50 ? 1 : count <= 100 ? 2 : count <= 150 ? 3 : 4,
    name: `Moduli x${count}`, icon: '⚙️',
    desc: `Otključaj ${count} blueprinta modula`,
    check: () => {
      const mods = [
        ...(typeof RECON_MODULES   !== 'undefined' ? RECON_MODULES   : []),
        ...(typeof SPECIAL_MODULES !== 'undefined' ? SPECIAL_MODULES : []),
      ];
      return mods.filter(m => ownedBlueprints[m.id]).length >= count;
    },
    reward: { bpw: count * 3, metal: count * 600, crystal: count * 300, he3: count * 120,
              xp: count * 60, ...(count % 50 === 0 ? { art_fragment: count >= 200 ? 'L' : count >= 100 ? 'E' : 'R' } : {}),
              ...(count === 200 ? { fullBlueprint: true, instanceKeys: 12 } : {}) }
  });
});

// ============================================================
// 10. BRODOVI PO KLASI — broj posjedovanih brodova
// ============================================================

const SHIP_CLASS_MILESTONES = {
  scout:      [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
  fighter:    [3, 6, 9, 12, 15, 18, 21, 24, 27],
  cruiser:    [3, 6, 9, 12, 15, 18, 21, 24],
  battleship: [3, 6, 9, 12, 15, 18, 21],
  carrier:    [2, 4, 6, 8, 10, 12],
  special:    [1, 2, 3, 4, 5],
};

Object.entries(SHIP_CLASS_MILESTONES).forEach(([cls, milestones]) => {
  const clsData = (typeof SHIP_CLASSES !== 'undefined' && SHIP_CLASSES[cls]) || { name: cls, icon: '🚀' };
  milestones.forEach((count, idx) => {
    ACHIEVEMENTS.push({
      category: 'collection', id: `ships_${cls}_own_${count}`, tier: idx <= 2 ? 1 : idx <= 5 ? 2 : idx <= 7 ? 3 : 4,
      name: `${clsData.icon} ${clsData.name || cls} x${count}`, icon: clsData.icon || '🚀',
      desc: `Posjeduj ${count} blueprinta klase ${clsData.name || cls}`,
      check: () => {
        const ships = (typeof SHIPS !== 'undefined' && SHIPS[cls]) || [];
        return ships.filter(s => ownedBlueprints[s.id]).length >= count;
      },
      reward: { bpw: count * 10, xp: count * 200, metal: count * 2000, crystal: count * 1000, he3: count * 400,
                ...(idx === milestones.length - 1 ? { art_fragment: 'E', fullBlueprint: true, instanceKeys: 10 } : {}) },
      requires: idx > 0 ? `ships_${cls}_own_${milestones[idx-1]}` : null
    });
  });
});

// ============================================================
// 11. MILITARNI STATS — uništeni brodovi, nanesena šteta
// ============================================================

// Uništeni brodovi
[50, 100, 500, 1000, 5000, 10000, 50000].forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `ships_destroyed_${count}`, tier: count <= 500 ? 1 : count <= 5000 ? 2 : count <= 20000 ? 3 : 4,
    name: `Uništač Brodova`, icon: '💥',
    desc: `Uništi ${count.toLocaleString()} neprijateljskih brodova`,
    check: () => (window._totalShipsDestroyed || 0) >= count,
    reward: { metal: count * 10, crystal: count * 5, he3: count * 2, xp: count * 2,
              bpw: count <= 500 ? 25 : count <= 5000 ? 100 : count <= 20000 ? 300 : 750,
              ...(count >= 10000 ? { art_fragment: 'E', instanceKeys: 10 } : {}) }
  });
});

// Nanesena šteta
[100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000].forEach((dmg, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `damage_dealt_${dmg}`, tier: dmg <= 1000000 ? 1 : dmg <= 10000000 ? 2 : dmg <= 50000000 ? 3 : 4,
    name: `Razarač`, icon: '☄️',
    desc: `Nanese ukupno ${(dmg/1000000).toFixed(1)}M štete u borbama`,
    check: () => (window._totalDamageDealt || 0) >= dmg,
    reward: { metal: dmg / 100, crystal: dmg / 200, he3: dmg / 400, xp: dmg / 1000,
              bpw: dmg <= 1000000 ? 30 : dmg <= 10000000 ? 150 : dmg <= 50000000 ? 400 : 1000,
              ...(dmg >= 50000000 ? { art_fragment: 'L', instanceKeys: 15 } : {}) }
  });
});

// Izgrađeni brodovi
[10, 50, 100, 500, 1000, 5000, 10000, 50000].forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `ships_built_${count}`, tier: count <= 100 ? 1 : count <= 1000 ? 2 : count <= 10000 ? 3 : 4,
    name: `Brodogradilac`, icon: '🏭',
    desc: `Izgradi ${count.toLocaleString()} brodova ukupno`,
    check: () => (window._totalShipsBuilt || 0) >= count,
    reward: { metal: count * 50, crystal: count * 25, he3: count * 10, xp: count * 5,
              bpw: count <= 100 ? 20 : count <= 1000 ? 80 : count <= 10000 ? 200 : 500,
              ...(count >= 10000 ? { art_fragment: 'E', instanceKeys: 8 } : {}) }
  });
});

// ============================================================
// 12. UKUPNO LEVELA ZGRADA — suma svih levela
// ============================================================

[100, 250, 500, 750, 1000, 1200, 1500, 1700].forEach((total, idx) => {
  ACHIEVEMENTS.push({
    category: 'base', id: `total_bld_lvl_${total}`, tier: total <= 500 ? 1 : total <= 1000 ? 2 : total <= 1400 ? 3 : 4,
    name: `Mega Baza Lv.${total}`, icon: '🏙️',
    desc: `Dostigni ukupno ${total} levela svih zgrada zajedno`,
    check: () => {
      const bldKeys = ['hq','metal_mine','crystal_mine','he3_refinery','depot','ship_factory',
        'solar','fusion','battery','grid','turret','missile_bat','shield_gen','sensor','jump_gate','laboratory','recycler'];
      return bldKeys.reduce((sum, k) => sum + (buildings[k]?.level || 0), 0) >= total;
    },
    reward: { bpw: total * 2, metal: total * 2000, crystal: total * 1000, he3: total * 500, xp: total * 200,
              instanceKeys: total <= 500 ? 3 : total <= 1000 ? 8 : total <= 1400 ? 15 : 30,
              ...(total >= 1000 ? { art_fragment: total >= 1700 ? 'L' : 'E' } : {}),
              ...(total === 1700 ? { fullBlueprint: true } : {}) }
  });
});

// ============================================================
// 13. RESEARCH UKUPNO — suma svih research levela
// ============================================================

[50, 100, 150, 200, 300, 400, 500, 600, 700, 800].forEach((total, idx) => {
  ACHIEVEMENTS.push({
    category: 'research', id: `total_research_${total}`, tier: total <= 200 ? 1 : total <= 400 ? 2 : total <= 600 ? 3 : 4,
    name: `Naučni Um ${total}`, icon: '🔬',
    desc: `Dostigni ${total} ukupnih research levela`,
    check: () => {
      const branches = ['mining_metal','mining_crystal','mining_he3','weapons','shields','armor','espionage','energy'];
      return branches.reduce((sum, b) => sum + (research[b]?.level || 0), 0) >= total;
    },
    reward: { bpw: total * 3, xp: total * 300, metal: total * 1000, crystal: total * 600, he3: total * 300,
              ...(total >= 300 ? { art_fragment: total >= 700 ? 'L' : total >= 500 ? 'E' : 'R' } : {}),
              ...(total === 800 ? { fullBlueprint: true, instanceKeys: 25 } : {}) }
  });
});

// ============================================================
// 14. FLEET VELIČINA — ukupno brodova u floti
// ============================================================

[50, 100, 500, 1000, 5000, 10000, 25000].forEach((size, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `fleet_size_${size}`, tier: size <= 500 ? 1 : size <= 5000 ? 2 : size <= 15000 ? 3 : 4,
    name: `Flota ${size.toLocaleString()}`, icon: '🚀',
    desc: `Imaj ukupno ${size.toLocaleString()} brodova u floti`,
    check: () => {
      if (typeof fleet === 'undefined') return false;
      return fleet.filter(s => s).reduce((sum, s) => sum + (s.count || 0), 0) >= size;
    },
    reward: { metal: size * 20, crystal: size * 10, he3: size * 4, xp: size * 2,
              bpw: size <= 500 ? 50 : size <= 5000 ? 200 : 600,
              ...(size >= 10000 ? { art_fragment: 'E', instanceKeys: 15 } : {}) }
  });
});

// ============================================================
// 15. POBJEDE PO TEŽINI
// ============================================================

const DIFFICULTY_WINS = {
  easy:      { counts: [10, 50, 100, 500, 1000], icon: '😊', label: 'Easy' },
  normal:    { counts: [10, 50, 100, 500, 1000], icon: '⚔️', label: 'Normal' },
  nightmare: { counts: [5,  25, 50,  100, 500 ], icon: '💀', label: 'Nightmare' },
  hell:      { counts: [1,  5,  10,  25,  50  ], icon: '🔥', label: 'Hell' },
};

Object.entries(DIFFICULTY_WINS).forEach(([diff, data]) => {
  data.counts.forEach((count, idx) => {
    ACHIEVEMENTS.push({
      category: 'combat', id: `wins_${diff}_${count}`, tier: idx + 1,
      name: `${data.icon} ${data.label} x${count}`, icon: data.icon,
      desc: `Pobijedi u ${count} ${data.label} instanci`,
      check: () => (window[`_wins_${diff}`] || 0) >= count,
      reward: { metal: count * 1000, crystal: count * 500, he3: count * 200, xp: count * 100,
                bpw: count * (diff === 'hell' ? 50 : diff === 'nightmare' ? 20 : diff === 'normal' ? 10 : 5),
                ...(idx >= 3 ? { art_fragment: diff === 'hell' ? 'L' : 'E', instanceKeys: Math.floor(count / 10) } : {}) },
      requires: idx > 0 ? `wins_${diff}_${data.counts[idx-1]}` : null
    });
  });
});

// ============================================================
// 16. PvP STREAK
// ============================================================

[2, 3, 5, 7, 10, 15, 20].forEach((streak, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `pvp_streak_${streak}`, tier: streak <= 5 ? 1 : streak <= 10 ? 2 : 3,
    name: `PvP Serija ${streak}`, icon: '🔥',
    desc: `Pobijedi ${streak} PvP borbi uzastopno`,
    check: () => (pvp.winStreak || 0) >= streak,
    reward: { bpw: streak * 50, xp: streak * 500, metal: streak * 5000, crystal: streak * 2500, he3: streak * 1000,
              ...(streak >= 10 ? { art_fragment: streak >= 15 ? 'E' : 'R', instanceKeys: streak } : {}) },
    requires: idx > 0 ? `pvp_streak_${[2,3,5,7,10,15,20][idx-1]}` : null
  });
});

// ============================================================
// 17. TIP ORUŽJA KOLEKCIJA
// ============================================================

const WEAPON_TYPE_MILESTONES = {
  Ballistic:  { counts: [5, 10, 20, 30, 40, 60, 80, 100, 120], icon: '🔩', label: 'Balističkih' },
  Directional:{ counts: [5, 10, 20, 30, 40, 60, 80, 100, 120], icon: '🔦', label: 'Direktivnih' },
  Missile:    { counts: [5, 10, 20, 30, 40, 60, 80, 100, 120], icon: '🚀', label: 'Raketnih' },
  FighterBay: { counts: [1, 3, 5, 9, 12, 15],                  icon: '✈️', label: 'FighterBay' },
};

Object.entries(WEAPON_TYPE_MILESTONES).forEach(([wtype, data]) => {
  data.counts.forEach((count, idx) => {
    ACHIEVEMENTS.push({
      category: 'collection', id: `weapon_type_${wtype}_${count}`, tier: idx <= 2 ? 1 : idx <= 5 ? 2 : 3,
      name: `${data.icon} ${data.label} x${count}`, icon: data.icon,
      desc: `Otključaj ${count} blueprinta ${data.label.toLowerCase()} oružja (${wtype})`,
      check: () => (typeof WEAPONS !== 'undefined' ? WEAPONS.filter(w => w.type === wtype && ownedBlueprints[w.id]).length : 0) >= count,
      reward: { bpw: count * 3, xp: count * 150, metal: count * 800, crystal: count * 400,
                ...(idx >= 6 ? { art_fragment: wtype === 'FighterBay' ? 'L' : 'E', instanceKeys: 5 } : {}) },
      requires: idx > 0 ? `weapon_type_${wtype}_${data.counts[idx-1]}` : null
    });
  });
});

// ============================================================
// 18. LEGENDARY ITEMI
// ============================================================

[1, 3, 5, 10, 15, 20, 30, 50].forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'collection', id: `legendary_own_${count}`, tier: count <= 5 ? 1 : count <= 15 ? 2 : count <= 30 ? 3 : 4,
    name: `Legendarni Kolekcionar x${count}`, icon: '⭐',
    desc: `Posjeduj ${count} legendary blueprinta (bilo koji tip)`,
    check: () => {
      const allItems = [];
      Object.values(typeof SHIPS !== 'undefined' ? SHIPS : {}).forEach(arr => arr.forEach(s => { if (s.rarity === 'L') allItems.push(s.id); }));
      [WEAPONS, SHIELDS, ENGINES,
        ...(typeof RECON_MODULES   !== 'undefined' ? [RECON_MODULES]   : []),
        ...(typeof SPECIAL_MODULES !== 'undefined' ? [SPECIAL_MODULES] : []),
      ].forEach(arr => {
        if (arr) arr.forEach(i => { if ((i.rarity || 'C') === 'L') allItems.push(i.id); });
      });
      return allItems.filter(id => ownedBlueprints[id]).length >= count;
    },
    reward: { bpw: count * 30, xp: count * 500, metal: count * 10000, crystal: count * 5000, he3: count * 2000,
              instanceKeys: count <= 5 ? 3 : count <= 15 ? 8 : 15,
              ...(count >= 20 ? { art_fragment: count >= 50 ? 'L' : 'E' } : {}),
              ...(count === 50 ? { fullBlueprint: true } : {}) },
    requires: idx > 0 ? `legendary_own_${[1,3,5,10,15,20,30,50][idx-1]}` : null
  });
});

// ============================================================
// 19. ARTEFAKTI
// ============================================================

[1, 5, 10, 25, 50, 100, 200, 500, 1000].forEach((frags, idx) => {
  ACHIEVEMENTS.push({
    category: 'collection', id: `art_frags_${frags}`, tier: frags <= 10 ? 1 : frags <= 100 ? 2 : frags <= 500 ? 3 : 4,
    name: `Artefakt Skupljač ${frags}`, icon: '🧩',
    desc: `Skupi ukupno ${frags} artefakt fragmenata`,
    check: () => {
      const totalFrags = Object.values(window.artifactState?.fragments || {}).reduce((s, v) => s + v, 0);
      return totalFrags >= frags;
    },
    reward: { bpw: frags * 2, xp: frags * 50, metal: frags * 500, crystal: frags * 250, he3: frags * 100,
              ...(frags >= 50 ? { art_fragment: frags >= 500 ? 'L' : frags >= 100 ? 'E' : 'R' } : {}) }
  });
});

// ============================================================
// 20. BLUEPRINT CRAFTING
// ============================================================

[1, 5, 10, 25, 50, 100].forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'collection', id: `bp_crafted_${count}`, tier: count <= 5 ? 1 : count <= 25 ? 2 : 3,
    name: `Blueprint Majstor x${count}`, icon: '🔨',
    desc: `Craftaj ${count} blueprinta`,
    check: () => (window._totalBpCrafted || 0) >= count,
    reward: { bpw: count * 10, xp: count * 200, metal: count * 2000, crystal: count * 1000, he3: count * 400,
              ...(count >= 25 ? { art_fragment: count >= 100 ? 'E' : 'R', instanceKeys: Math.floor(count / 5) } : {}) }
  });
});

// ============================================================
// 21. PRODUKCIJA RESURSA (po satu)
// ============================================================

const PRODUCTION_MILESTONES = {
  metal:   { rates: [1000, 5000, 10000, 25000, 50000, 100000], icon: '🔩', field: '_metalPerHour' },
  crystal: { rates: [500,  2000, 5000,  10000, 25000, 50000 ], icon: '💎', field: '_crystalPerHour' },
  he3:     { rates: [250,  1000, 2500,  5000,  10000, 25000 ], icon: '⛽', field: '_he3PerHour' },
};

Object.entries(PRODUCTION_MILESTONES).forEach(([res, data]) => {
  data.rates.forEach((rate, idx) => {
    ACHIEVEMENTS.push({
      category: 'economy', id: `prod_${res}_${rate}`, tier: idx <= 1 ? 1 : idx <= 3 ? 2 : 3,
      name: `Produkcija ${data.icon} ${(rate >= 1000 ? rate/1000 + 'K' : rate)}/h`, icon: data.icon,
      desc: `Dostigni produkciju ${rate.toLocaleString()} ${res} na sat`,
      check: () => (window[data.field] || 0) >= rate,
      reward: { metal: rate * 2, crystal: rate, he3: rate / 2, xp: rate / 10,
                bpw: idx <= 1 ? 30 : idx <= 3 ? 100 : 300,
                ...(idx >= 4 ? { art_fragment: 'R', instanceKeys: 5 } : {}) },
      requires: idx > 0 ? `prod_${res}_${data.rates[idx-1]}` : null
    });
  });
});

// ============================================================
// 22. POSEBNA DOSTIGNUĆA — milestones i first-time
// ============================================================

const SPECIAL_ACHS = [
  { id: 'first_pvp_win',       name: 'Prva PvP Pobjeda',         icon: '🏟️', desc: 'Pobijedi prvu PvP borbu',
    check: () => (pvp.wins || 0) >= 1,
    reward: { bpw: 100, xp: 1000, instanceKeys: 2 } },
  { id: 'first_blueprint',     name: 'Prva Kolekcija',            icon: '📋', desc: 'Otključaj prvi blueprint',
    check: () => Object.values(ownedBlueprints).some(v => v),
    reward: { bpw: 25, xp: 200, metal: 1000 } },
  { id: 'first_legendary',     name: 'Prva Legenda',              icon: '⭐', desc: 'Otključaj prvi Legendary blueprint',
    check: () => {
      const allL = [];
      [WEAPONS, SHIELDS, ENGINES,
        ...(typeof RECON_MODULES   !== 'undefined' ? [RECON_MODULES]   : []),
        ...(typeof SPECIAL_MODULES !== 'undefined' ? [SPECIAL_MODULES] : []),
      ].forEach(arr => { if (arr) arr.forEach(i => { if (i.rarity === 'L') allL.push(i.id); }); });
      Object.values(SHIPS || {}).forEach(arr => arr.forEach(s => { if (s.rarity === 'L') allL.push(s.id); }));
      return allL.some(id => ownedBlueprints[id]);
    },
    reward: { bpw: 500, xp: 5000, instanceKeys: 5, art_fragment: 'R' } },
  { id: 'all_building_types',  name: 'Gradonačelnik',             icon: '🏙️', desc: 'Izgradi sve vrste zgrada',
    check: () => ['hq','metal_mine','crystal_mine','he3_refinery','depot','ship_factory',
      'solar','fusion','battery','grid','turret','missile_bat','shield_gen','sensor','jump_gate','laboratory','recycler'
    ].every(k => (buildings[k]?.level || 0) >= 1),
    reward: { bpw: 200, xp: 2000, instanceKeys: 3, metal: 10000 } },
  { id: 'all_ship_classes',    name: 'Admiralitet',               icon: '👑', desc: 'Posjeduj brod svake klase',
    check: () => ['scout','fighter','cruiser','battleship','carrier','special'].every(cls =>
      ((typeof SHIPS !== 'undefined' && SHIPS[cls]) || []).some(s => ownedBlueprints[s.id])
    ),
    reward: { bpw: 500, xp: 5000, instanceKeys: 5, art_fragment: 'R' } },
  { id: 'all_research_started',name: 'Polaznik',                  icon: '🔬', desc: 'Pokreni sva istraživanja',
    check: () => ['mining_metal','mining_crystal','mining_he3','weapons','shields','armor','espionage','energy'
    ].every(b => (research[b]?.level || 0) >= 1),
    reward: { bpw: 100, xp: 1000, metal: 5000, crystal: 2500 } },
  { id: 'max_hq',              name: 'Galaktički Centar',         icon: '🏰', desc: 'Dostigni HQ Lv.100',
    check: () => (buildings.hq?.level || 0) >= 100,
    reward: { bpw: 2000, xp: 50000, instanceKeys: 20, art_fragment: 'L', fullBlueprint: true } },
  { id: 'all_bld_lv50',        name: 'Solidna Baza',              icon: '🏗️', desc: 'Digni sve zgrade na Lv.50',
    check: () => ['hq','metal_mine','crystal_mine','he3_refinery','depot','ship_factory',
      'solar','fusion','battery','grid','turret','missile_bat','shield_gen','sensor','jump_gate','laboratory','recycler'
    ].every(k => (buildings[k]?.level || 0) >= 50),
    reward: { bpw: 1000, xp: 20000, instanceKeys: 15, art_fragment: 'E', fullBlueprint: true } },
  { id: 'all_bld_lv100',       name: 'Nepobediva Baza',          icon: '🌆', desc: 'Digni SVE zgrade na Lv.100',
    check: () => ['hq','metal_mine','crystal_mine','he3_refinery','depot','ship_factory',
      'solar','fusion','battery','grid','turret','missile_bat','shield_gen','sensor','jump_gate','laboratory','recycler'
    ].every(k => (buildings[k]?.level || 0) >= 100),
    reward: { bpw: 5000, xp: 100000, instanceKeys: 50, art_fragment: 'L', fullBlueprint: true } },
  { id: 'all_research_max',    name: 'Doktor Svemira',            icon: '🎓', desc: 'Maksimiziraj sva istraživanja na Lv.100',
    check: () => ['mining_metal','mining_crystal','mining_he3','weapons','shields','armor','espionage','energy'
    ].every(b => (research[b]?.level || 0) >= 100),
    reward: { bpw: 5000, xp: 100000, instanceKeys: 30, art_fragment: 'L', fullBlueprint: true } },
];

SPECIAL_ACHS.forEach(a => {
  ACHIEVEMENTS.push({ category: 'special', tier: 4, ...a });
});

// ============================================================
// 23. FLEET SLOTS — popunjeni slotovi flote
// ============================================================

[2, 4, 6, 8, 10, 15, 20, 25].forEach((slots, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `fleet_slots_${slots}`, tier: slots <= 8 ? 1 : slots <= 15 ? 2 : 3,
    name: `Flota Slotovi ${slots}`, icon: '🧩',
    desc: `Popuni ${slots} slotova flote brodovima`,
    check: () => {
      if (typeof fleetSlots === 'undefined') return false;
      return Object.values(fleetSlots).filter(s => s && s.shipId).length >= slots;
    },
    reward: { metal: slots * 3000, crystal: slots * 1500, he3: slots * 600, xp: slots * 300,
              bpw: slots * 15, instanceKeys: Math.floor(slots / 5),
              ...(slots >= 20 ? { art_fragment: 'R' } : {}) },
    requires: idx > 0 ? `fleet_slots_${[2,4,6,8,10,15,20,25][idx-1]}` : null
  });
});

// ============================================================
// 24. NAPREDNA ŠPIJUNAŽA
// ============================================================

[5, 10, 25, 50, 100, 200].forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'espionage', id: `spy_success_${count}`, tier: idx <= 1 ? 1 : idx <= 3 ? 2 : 3,
    name: `Špijun ${count}`, icon: '🕵️',
    desc: `Uspješno izvedi ${count} špijunskih misija`,
    check: () => (espionage?.successfulMissions || 0) >= count,
    reward: { bpw: count * 5, xp: count * 100, crystal: count * 300, he3: count * 200,
              ...(count >= 50 ? { art_fragment: count >= 100 ? 'E' : 'R', instanceKeys: Math.floor(count / 20) } : {}) },
    requires: idx > 0 ? `spy_success_${[5,10,25,50,100,200][idx-1]}` : null
  });
});

[1, 5, 10, 25, 50, 100].forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'espionage', id: `spy_stolen_count_${count}`, tier: idx <= 1 ? 1 : idx <= 3 ? 2 : 3,
    name: `Lopov ${count}`, icon: '💰',
    desc: `Ukradi resurse u ${count} misijama`,
    check: () => (espionage?.stealMissions || 0) >= count,
    reward: { bpw: count * 8, xp: count * 150, metal: count * 500, crystal: count * 250, he3: count * 100,
              ...(count >= 25 ? { art_fragment: count >= 100 ? 'E' : 'R' } : {}) },
    requires: idx > 0 ? `spy_stolen_count_${[1,5,10,25,50,100][idx-1]}` : null
  });
});

// ============================================================
// 25. UKUPNO UTROŠENIH RESURSA
// ============================================================

[1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1000000000].forEach((total, idx) => {
  const label = total >= 1000000000 ? '1B' : (total / 1000000).toFixed(0) + 'M';
  ACHIEVEMENTS.push({
    category: 'economy', id: `resources_spent_${total}`, tier: idx <= 1 ? 1 : idx <= 3 ? 2 : idx <= 5 ? 3 : 4,
    name: `Trošadžija ${label}`, icon: '💸',
    desc: `Utroši ukupno ${total.toLocaleString()} resursa (metal+kristal+he3)`,
    check: () => (window._totalResourcesSpent || 0) >= total,
    reward: { bpw: idx <= 1 ? 100 : idx <= 3 ? 400 : 1000, xp: Math.floor(total / 10000), instanceKeys: idx + 1,
              ...(idx >= 4 ? { art_fragment: idx >= 6 ? 'L' : idx >= 5 ? 'E' : 'R' } : {}) },
    requires: idx > 0 ? `resources_spent_${[1000000,5000000,10000000,50000000,100000000,500000000,1000000000][idx-1]}` : null
  });
});

// ============================================================
// 26. ENERGIJA — viškovi i produkcija
// ============================================================

[100, 500, 1000, 2000, 5000, 10000].forEach((surplus, idx) => {
  ACHIEVEMENTS.push({
    category: 'base', id: `energy_surplus_${surplus}`, tier: idx <= 1 ? 1 : idx <= 3 ? 2 : 3,
    name: `Energetska Dominacija ${surplus}`, icon: '⚡',
    desc: `Dostigni višak energije od ${surplus.toLocaleString()} MW`,
    check: () => (window._energySurplus || 0) >= surplus,
    reward: { metal: surplus * 5, crystal: surplus * 2, he3: surplus, xp: surplus * 3, bpw: Math.floor(surplus / 10),
              ...(surplus >= 2000 ? { art_fragment: surplus >= 5000 ? 'E' : 'R' } : {}) }
  });
});

// ============================================================
// 27. INSTANCE STREAK — kombo (bez gubitaka)
// ============================================================

[3, 5, 10, 20, 30].forEach((streak, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `inst_streak_${streak}`, tier: streak <= 5 ? 1 : streak <= 15 ? 2 : 3,
    name: `Instanca Serija ${streak}`, icon: '🔥',
    desc: `Završi ${streak} instanci uzastopno bez gubitka broda`,
    check: () => (window._instanceStreak || 0) >= streak,
    reward: { bpw: streak * 30, xp: streak * 800, instanceKeys: streak * 2,
              metal: streak * 10000, crystal: streak * 5000, he3: streak * 2000,
              ...(streak >= 10 ? { art_fragment: streak >= 20 ? 'E' : 'R' } : {}) },
    requires: idx > 0 ? `inst_streak_${[3,5,10,20,30][idx-1]}` : null
  });
});

// ============================================================
// 28. POSLJEDNJA DEVETKA — do 1000
// ============================================================

// Bez gubitaka (pobjede bez izgubljenog broda)
[1, 10, 25, 50].forEach((count, idx) => {
  ACHIEVEMENTS.push({
    category: 'combat', id: `flawless_wins_${count}`, tier: count <= 1 ? 1 : count <= 10 ? 2 : count <= 25 ? 3 : 4,
    name: `Savršena Pobjeda x${count}`, icon: '🏆',
    desc: `Pobijedi instancu bez ijednog izgubljenog broda ${count} puta`,
    check: () => (window._flawlessWins || 0) >= count,
    reward: { bpw: count * 25, xp: count * 500, instanceKeys: count <= 10 ? count : count * 2,
              metal: count * 5000, crystal: count * 2500, he3: count * 1000,
              ...(count >= 25 ? { art_fragment: count >= 50 ? 'E' : 'R' } : {}) },
    requires: idx > 0 ? `flawless_wins_${[1,10,25,50][idx-1]}` : null
  });
});

// Raritet — prvi brod otključan po rarity
[
  { rarity: 'C', name: 'Prva Kolekcija',    icon: '⚪', desc: 'Otključaj prvi Common brod blueprint',    tier: 1 },
  { rarity: 'R', name: 'Rijetki Pronalazak', icon: '🔵', desc: 'Otključaj prvi Rare brod blueprint',      tier: 2 },
  { rarity: 'E', name: 'Epski Pronalazak',   icon: '🟣', desc: 'Otključaj prvi Epic brod blueprint',      tier: 3 },
  { rarity: 'L', name: 'Legendarni Pronalazak', icon: '🟡', desc: 'Otključaj prvi Legendary brod blueprint', tier: 4 },
].forEach(({ rarity, name, icon, desc, tier }) => {
  ACHIEVEMENTS.push({
    category: 'collection', id: `first_ship_${rarity}`, tier,
    name, icon, desc,
    check: () => Object.values(SHIPS || {}).some(arr => arr.some(s => s.rarity === rarity && ownedBlueprints[s.id])),
    reward: { bpw: rarity === 'L' ? 500 : rarity === 'E' ? 200 : rarity === 'R' ? 75 : 25,
              xp: rarity === 'L' ? 5000 : rarity === 'E' ? 2000 : rarity === 'R' ? 500 : 100,
              ...(rarity === 'L' ? { art_fragment: 'R', instanceKeys: 5 } : {}),
              ...(rarity === 'E' ? { art_fragment: 'C', instanceKeys: 2 } : {}) }
  });
});

// Energetska stabilnost — nula deficita
ACHIEVEMENTS.push({
  category: 'base', id: 'energy_no_deficit', tier: 2,
  name: 'Energetska Stabilnost', icon: '⚡',
  desc: 'Dostigni pozitivan energetski balans (nema deficita)',
  check: () => (window._energySurplus || 0) >= 0 && (typeof buildings !== 'undefined'),
  reward: { bpw: 50, xp: 500, metal: 5000, crystal: 2500, he3: 1000, instanceKeys: 1 }
});

// Inicijalizacija novih tracking varijabli
if (typeof window !== 'undefined') {
  if (window._totalShipsRecycled   === undefined) window._totalShipsRecycled   = 0;
  if (window._flawlessWins         === undefined) window._flawlessWins         = 0;
  if (window._totalShipsDestroyed  === undefined) window._totalShipsDestroyed  = 0;
  if (window._totalDamageDealt     === undefined) window._totalDamageDealt     = 0;
  if (window._totalShipsBuilt      === undefined) window._totalShipsBuilt      = 0;
  if (window._totalBpCrafted       === undefined) window._totalBpCrafted       = 0;
  if (window._totalResourcesSpent  === undefined) window._totalResourcesSpent  = 0;
  if (window._metalPerHour         === undefined) window._metalPerHour         = 0;
  if (window._crystalPerHour       === undefined) window._crystalPerHour       = 0;
  if (window._he3PerHour           === undefined) window._he3PerHour           = 0;
  if (window._energySurplus        === undefined) window._energySurplus        = 0;
  if (window._instanceStreak       === undefined) window._instanceStreak       = 0;
  if (window._wins_easy            === undefined) window._wins_easy            = 0;
  if (window._wins_normal          === undefined) window._wins_normal          = 0;
  if (window._wins_nightmare       === undefined) window._wins_nightmare       = 0;
  if (window._wins_hell            === undefined) window._wins_hell            = 0;
}

// ============================================================
// KATEGORIJE
// ============================================================

const ACHIEVEMENT_CATEGORIES = {
  base:       { name: 'Baza',       icon: '🏗️', color: '#ffcc44' },
  combat:     { name: 'Borba',      icon: '⚔️', color: '#ff4444' },
  research:   { name: 'Research',   icon: '🔬', color: '#aa44ff' },
  collection: { name: 'Kolekcija',  icon: '💎', color: '#4488ff' },
  economy:    { name: 'Ekonomija',  icon: '💰', color: '#00ff88' },
  espionage:  { name: 'Špijunaža',  icon: '🕵️', color: '#ff8833' },
  commander:  { name: 'Komandir',   icon: '👑', color: '#ffaa00' },
  special:    { name: 'Posebna',    icon: '✨', color: '#00d4ff' }
};

// ============================================================
// STATE
// ============================================================

if (typeof window !== 'undefined' && !window.achievementState) {
  window.achievementState = { completed: [], claimed: [] };
}

if (typeof window !== 'undefined') {
  if (window._totalMetalMined === undefined) window._totalMetalMined = 0;
  if (window._totalCrystalMined === undefined) window._totalCrystalMined = 0;
  if (window._totalHe3Mined === undefined) window._totalHe3Mined = 0;
  if (window._totalDepotPickups === undefined) window._totalDepotPickups = 0;
}

// ============================================================
// FUNKCIJE
// ============================================================

function checkAchievements() {
  let anyNew = false;
  ACHIEVEMENTS.forEach(ach => {
    if (typeof window === 'undefined') return;
    if (window.achievementState.completed.includes(ach.id)) return;
    if (ach.requires && !window.achievementState.completed.includes(ach.requires)) return;
    try {
      if (ach.check()) {
        window.achievementState.completed.push(ach.id);
        if (typeof toast === 'function') toast(`🏆 Dostignuće: ${ach.icon} ${ach.name}!`, 'ok');
        if (typeof addLog === 'function') addLog(`🏆 Dostignuće otključano: ${ach.name}`);
        anyNew = true;
      }
    } catch(e) {}
  });
  if (anyNew && typeof saveGame === 'function') saveGame();
}

function claimAchievement(id) {
  if (typeof window === 'undefined') return;
  if (window.achievementState.claimed.includes(id)) return;
  if (!window.achievementState.completed.includes(id)) return;

  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;

  const r = ach.reward;
  if (r.metal && typeof R !== 'undefined') R.metal += r.metal;
  if (r.crystal && typeof R !== 'undefined') R.crystal += r.crystal;
  if (r.he3 && typeof R !== 'undefined') R.he3 += r.he3;
  if (r.xp && typeof addExp === 'function') addExp(r.xp);
  if (r.bpw && typeof R !== 'undefined') R.spCard = (R.spCard || 0) + r.bpw;
  if (r.instanceKeys && typeof R !== 'undefined') R.instanceKeys = (R.instanceKeys || 0) + r.instanceKeys;
  if (r.art_fragment && typeof ARTIFACTS_DATA !== 'undefined' && typeof addArtifactFragment === 'function') {
    const pool = ARTIFACTS_DATA.filter(a => a.rarity === r.art_fragment && !window.artifactState?.unlocked?.includes(a.id));
    if (pool.length > 0) {
      const art = pool[Math.floor(Math.random() * pool.length)];
      addArtifactFragment(art.id, 1);
    }
  }
  if (r.fullBlueprint) {
    // Daj nasumični blueprint koji igrač nema
    const allBlueprints = [];
    Object.values(SHIPS || {}).forEach(arr => arr.forEach(s => allBlueprints.push(s.id)));
    if (typeof WEAPONS !== 'undefined') WEAPONS.forEach(w => allBlueprints.push(w.id));
    if (typeof SHIELDS !== 'undefined') SHIELDS.forEach(s => allBlueprints.push(s.id));
    if (typeof ENGINES !== 'undefined') ENGINES.forEach(e => allBlueprints.push(e.id));
    if (typeof RECON_MODULES   !== 'undefined') RECON_MODULES.forEach(m => allBlueprints.push(m.id));
    if (typeof SPECIAL_MODULES !== 'undefined') SPECIAL_MODULES.forEach(m => allBlueprints.push(m.id));
    
    const missing = allBlueprints.filter(id => !ownedBlueprints[id]);
    if (missing.length > 0) {
      const randomBp = missing[Math.floor(Math.random() * missing.length)];
      if (typeof unlockBlueprint === 'function') unlockBlueprint(randomBp);
    }
  }

  window.achievementState.claimed.push(id);
  if (typeof updateResUI === 'function') updateResUI();
  if (typeof saveGame === 'function') saveGame();
  if (typeof renderAchievements === 'function') renderAchievements();
  if (typeof toast === 'function') toast(`🎁 Nagrada preuzeta: ${ach.icon} ${ach.name}!`, 'ok');
}

// ── RENDER ──
let _achCat = 'all';

function renderAchievements() {
  const el = document.getElementById('achievementsContent');
  if (!el) return;

  if (typeof window === 'undefined') return;
  checkAchievements();

  const completed = window.achievementState.completed.length;
  const total = ACHIEVEMENTS.length;
  const unclaimed = window.achievementState.completed.filter(id => !window.achievementState.claimed.includes(id)).length;

  el.innerHTML = `
    <div class="card" style="margin-bottom:16px;display:flex;gap:20px;align-items:center">
      <div style="text-align:center"><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:2px">ZAVRŠENO</div><div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#ffcc44">${completed}/${total}</div></div>
      <div style="flex:1"><div class="pbar" style="height:8px"><div class="pbar-fill" style="width:${(completed / total * 100).toFixed(1)}%;background:#ffcc44"></div></div><div style="font-size:0.62rem;color:#6a90b8;margin-top:4px">${(completed / total * 100).toFixed(1)}% završeno</div></div>
      ${unclaimed > 0 ? `<div style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);padding:6px 14px;border-radius:6px;color:#00ff88;font-size:0.78rem">🎁 ${unclaimed} nagrada čeka!</div>` : ''}
    </div>
    <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
      <button class="btn ${_achCat === 'all' ? 'btn-gold' : ''}" style="font-size:0.72rem" onclick="_achCat='all';renderAchievements()">Sve</button>
      ${Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, cat]) => `<button class="btn ${_achCat === key ? 'btn-gold' : ''}" style="font-size:0.72rem;${_achCat === key ? 'border-color:' + cat.color + ';color:' + cat.color : ''}" onclick="_achCat='${key}';renderAchievements()">${cat.icon} ${cat.name}</button>`).join('')}
    </div>
    <div class="grid-3">${getFilteredAchievements().map(ach => renderAchievementCard(ach)).join('')}</div>
  `;
}

function getFilteredAchievements() {
  const list = _achCat === 'all' ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.category === _achCat);
  const completed = window.achievementState?.completed || [];
  const claimed   = window.achievementState?.claimed   || [];
  return [...list].sort((a, b) => {
    const aReady = completed.includes(a.id) && !claimed.includes(a.id);
    const bReady = completed.includes(b.id) && !claimed.includes(b.id);
    if (aReady && !bReady) return -1;
    if (!aReady && bReady) return  1;
    return 0;
  });
}

function renderAchievementCard(ach) {
  if (typeof window === 'undefined') return '';
  const completed = window.achievementState.completed.includes(ach.id);
  const claimed = window.achievementState.claimed.includes(ach.id);
  const locked = ach.requires && !window.achievementState.completed.includes(ach.requires);
  const cat = ACHIEVEMENT_CATEGORIES[ach.category] || { name: ach.category, icon: '🏅', color: '#aaaaaa' };
  const tierColor = ach.tier === 1 ? '#ffdd00' : ach.tier === 2 ? '#4488ff' : ach.tier === 3 ? '#aa44ff' : '#ffaa00';

  return `<div class="card" style="border-color:${completed ? cat.color + '55' : locked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)'};opacity:${locked ? 0.4 : 1};position:relative">
    ${completed && !claimed ? `<div style="position:absolute;top:0;right:0;background:#00ff88;color:#000;font-size:0.6rem;padding:2px 6px;border-radius:0 8px 0 4px;font-weight:700">🎁 PREUZMI</div>` : ''}
    ${claimed ? `<div style="position:absolute;top:0;right:0;background:rgba(255,204,68,0.2);color:#ffcc44;font-size:0.6rem;padding:2px 6px;border-radius:0 8px 0 4px">✅ Preuzeto</div>` : ''}
    <div style="display:flex;align-items:start;gap:10px;margin-bottom:8px">
      <div style="font-size:1.5rem">${locked ? '🔒' : ach.icon}</div>
      <div style="flex:1"><div style="font-size:0.78rem;font-weight:700;color:${completed ? cat.color : locked ? '#6a90b8' : 'white'}">${ach.name}</div><div style="font-size:0.6rem;color:#6a90b8;margin-top:2px">${ach.desc}</div></div>
      <span style="font-size:0.6rem;padding:1px 5px;border-radius:3px;background:${tierColor}22;border:1px solid ${tierColor}44;color:${tierColor}">T${ach.tier}</span>
    </div>
    <div style="font-size:0.6rem;color:#6a90b8;background:rgba(0,0,0,0.3);padding:5px 8px;border-radius:4px;margin-bottom:8px;line-height:1.7">
      ${ach.reward.metal ? `🔩${typeof fmt === 'function' ? fmt(ach.reward.metal) : ach.reward.metal} ` : ''}
      ${ach.reward.crystal ? `💎${typeof fmt === 'function' ? fmt(ach.reward.crystal) : ach.reward.crystal} ` : ''}
      ${ach.reward.he3 ? `⛽${typeof fmt === 'function' ? fmt(ach.reward.he3) : ach.reward.he3} ` : ''}
      ${ach.reward.xp ? `⭐${typeof fmt === 'function' ? fmt(ach.reward.xp) : ach.reward.xp}XP ` : ''}
      ${ach.reward.bpw ? `<span style="color:#ffcc44">🐝${ach.reward.bpw} BPW</span> ` : ''}
      ${ach.reward.instanceKeys ? `🗝️${ach.reward.instanceKeys} ` : ''}
      ${ach.reward.art_fragment ? `<span style="color:${ART_RARITY_COLOR?.[ach.reward.art_fragment] || '#ffcc44'}">🧩${ach.reward.art_fragment} frag</span>` : ''}
      ${ach.reward.fullBlueprint ? `<span style="color:#00ff88">📋 Ceo Blueprint!</span>` : ''}
    </div>
    ${completed && !claimed ? `<button class="btn btn-g" style="width:100%;font-size:0.72rem" onclick="claimAchievement('${ach.id}')">🎁 Preuzmi nagradu</button>` : locked ? `<div style="font-size:0.6rem;color:#6a90b8;text-align:center">🔒 Završi prethodno dostignuće</div>` : !completed ? `<div style="font-size:0.6rem;color:#6a90b8;text-align:center">⏳ U toku...</div>` : `<div style="font-size:0.6rem;color:#ffcc44;text-align:center">✅ Završeno</div>`}
  </div>`;
}
