// ============================================================
// HIVE GALAXY — js/systems/economy.js
// Produkcija, storage, energy, canAfford
// ============================================================

// ── CAN AFFORD ──
function canAfford(cost) {
  return R.metal   >= (cost.metal   || 0) &&
         R.crystal >= (cost.crystal || 0) &&
         R.he3     >= (cost.he3     || 0) &&
         R.energy  >= (cost.energy  || 0);
}

function spendResources(cost) {
  R.metal   -= (cost.metal   || 0);
  R.crystal -= (cost.crystal || 0);
  R.he3     -= (cost.he3     || 0);
  R.energy  -= (cost.energy  || 0);
  window._totalResourcesSpent = (window._totalResourcesSpent || 0)
    + (cost.metal || 0) + (cost.crystal || 0) + (cost.he3 || 0);
  // Tracker za misije (spend metal/crystal)
  if (typeof trackSpendResources === 'function') {
    trackSpendResources(cost.metal || 0, cost.crystal || 0);
  }
}

// ── ENERGY FUNKCIJE ──
function getEnergyGen() {
  const b = buildings;
  const solarLv   = b.solar?.level   || 0;
  const fusionLv  = b.fusion?.level  || 0;
  const batteryLv = b.battery?.level || 0;
  const gridLv    = b.grid?.level    || 0;

  // Solar milestone genBonus
  const solarM = typeof getBuildingMilestones === 'function' ? getBuildingMilestones('solar') : {};
  let solarMilestoneBonus = 0;
  Object.entries(solarM).forEach(([mlvl, data]) => {
    if (solarLv >= parseInt(mlvl) && data.genBonus) solarMilestoneBonus = Math.max(solarMilestoneBonus, data.genBonus);
  });

  // Fusion milestone genBonus
  const fusionM = typeof getBuildingMilestones === 'function' ? getBuildingMilestones('fusion') : {};
  let fusionMilestoneBonus = 0;
  Object.entries(fusionM).forEach(([mlvl, data]) => {
    if (fusionLv >= parseInt(mlvl) && data.genBonus) fusionMilestoneBonus = Math.max(fusionMilestoneBonus, data.genBonus);
  });

  // Synergy bonus (Solar Lv100 ili Fusion Lv100 → +15% svima)
  const solarSyn  = solarLv  >= 100 ? 1.15 : 1.0;
  const fusionSyn = fusionLv >= 100 ? 1.15 : 1.0;
  const synBonus  = Math.max(solarSyn, fusionSyn);

  const solarGen  = solarLv  * 4  * (1 + solarMilestoneBonus  / 100);
  const fusionGen = fusionLv * 12 * (1 + fusionMilestoneBonus / 100);

  return (0.005 + solarGen + fusionGen + batteryLv * 1 + gridLv * 1) * synBonus;
}

function getEnergyDrain() {
  const b = buildings;
  let drain = 2; // bazni drain

  // Metal Mine Lv100 → energyReduction: 50% drain rudnika
  const metalMineLv = b.metal_mine?.level || 0;
  const metalM = typeof getBuildingMilestones === 'function' ? getBuildingMilestones('metal_mine') : {};
  let metalEnergyRed = 0;
  Object.entries(metalM).forEach(([mlvl, data]) => {
    if (metalMineLv >= parseInt(mlvl) && data.energyReduction) metalEnergyRed = Math.max(metalEnergyRed, data.energyReduction);
  });
  drain += Math.floor(metalMineLv * 2 * (1 - metalEnergyRed / 100));

  drain += (b.crystal_mine?.level || 0) * 2;
  drain += (b.he3_refinery?.level || 0) * 3;
  drain += (b.ship_factory?.level || 0) * 4;
  drain += (b.hq?.level           || 0) * 1;
  drain += (b.depot?.level        || 0) * 1;
  drain += (b.turret?.level       || 0) * 2;
  drain += (b.missile_bat?.level  || 0) * 3;
  drain += (b.shield_gen?.level   || 0) * 4;
  drain += (b.sensor?.level       || 0) * 1;
  drain += (b.jump_gate?.level    || 0) * 5;
  drain += (b.laboratory?.level   || 0) * 4;
  drain += (b.recycler?.level     || 0) * 3;
  // Grid redukcija draina — 0.5% po levelu, max 50% na Lv100
  const gridLevel     = b.grid?.level || 0;
  const gridReduction = gridLevel * 0.5;
  return Math.floor(drain * (1 - gridReduction / 100));
}

function getEnergyMax() {
  const b = buildings;
  const resBonus = typeof getEnergyCapBonus === 'function' ? getEnergyCapBonus() : 0;
  const artBonus = typeof getArtifactEnergyBonus === 'function' ? getArtifactEnergyBonus() : 0;
  const batteryLv = b.battery?.level || 0;

  // Battery milestone capBonus
  const battM = typeof getBuildingMilestones === 'function' ? getBuildingMilestones('battery') : {};
  let battCapBonus = 0;
  Object.entries(battM).forEach(([mlvl, data]) => {
    if (batteryLv >= parseInt(mlvl) && data.capBonus) battCapBonus = Math.max(battCapBonus, data.capBonus);
  });

  const batteryBase = batteryLv * 97 * (1 + battCapBonus / 100);
  const base = 100 + batteryBase
    + (b.grid?.level   || 0) * 1
    + (b.fusion?.level || 0) * 1
    + resBonus + artBonus;
  // Fusion Lv100 → capMultiplier x3
  const fusionMult = (b.fusion?.level || 0) >= 100 ? 3 : 1;
  return Math.floor(base * fusionMult);
}

// Battery Lv100 → energija ne može pasti ispod 20%
function getEnergyMinPct() {
  return (buildings.battery?.level || 0) >= 100 ? 20 : 0;
}

function getEnergyNet() {
  return getEnergyGen() - getEnergyDrain();
}

function getEnergyPenalty() {
  const energy = R.energy;
  const net    = getEnergyNet();
  if (energy > 10 || net >= 0) return 1.0;
  if (energy > 0)              return 0.5;
  return 0.2;
}

// ── PRODUKCIJA ──
function getBaseProd() {
  const b  = buildings;
  const ep = getEnergyPenalty();
  // Research bonusi
  const metalBonus   = typeof getMetalProdBonus   === 'function' ? (1 + getMetalProdBonus()   / 100) : 1;
  const crystalBonus = typeof getCrystalProdBonus === 'function' ? (1 + getCrystalProdBonus() / 100) : 1;
  const he3Bonus     = typeof getHe3ProdBonus     === 'function' ? (1 + getHe3ProdBonus()     / 100) : 1;
  // Milestone bonusi rudnika
  const metalMilestone   = typeof getMetalMilestoneBonus   === 'function' ? (1 + getMetalMilestoneBonus()   / 100) : 1;
  const crystalMilestone = typeof getCrystalMilestoneBonus === 'function' ? (1 + getCrystalMilestoneBonus() / 100) : 1;
  const he3Milestone     = typeof getHe3MilestoneBonus     === 'function' ? (1 + getHe3MilestoneBonus()     / 100) : 1;
  // Commander bonus
  const cmdBonus = typeof getCmdProdBonus === 'function' ? (1 + getCmdProdBonus() / 100) : 1;
  // Crystal Mine Lv100 → metalSynergyBonus (+10% metal)
  const crystalLv = b.crystal_mine?.level || 0;
  const metalSynergy = crystalLv >= 100 ? 1.10 : 1.0;

  // He3 Lv100 → energySynergyBonus za he3 (+10%)
  // Solar Lv100 → energySynergyBonus (+15% svi energy gen — primijenjeno u getEnergyGen)
  // He3 synergia ide na he3 produkciju
  const he3Lv = b.he3_refinery?.level || 0;
  const he3Synergy = he3Lv >= 100 ? 1.10 : 1.0;

  // Artifact produkcijski bonusi
  const artMetalBonus   = typeof getArtifactMetalBonus   === 'function' ? (1 + getArtifactMetalBonus()   / 100) : 1;
  const artCrystalBonus = typeof getArtifactCrystalBonus === 'function' ? (1 + getArtifactCrystalBonus() / 100) : 1;
  const artHe3Bonus     = typeof getArtifactHe3Bonus     === 'function' ? (1 + getArtifactHe3Bonus()     / 100) : 1;
  // Event boost multiplikatori
  const mBoost  = window._metalBoost   || 1.0;
  const cBoost  = window._crystalBoost || 1.0;
  const hBoost  = window._he3Boost     || 1.0;
  // Equipment failure penalty (event: kvar opreme)
  const prodPenalty = window._prodPenalty || 1.0;
  return {
    metal:   (b.metal_mine?.level   || 1) * 0.01  * ep * metalBonus   * metalMilestone   * cmdBonus * mBoost * metalSynergy * artMetalBonus * prodPenalty,
    crystal: (b.crystal_mine?.level || 1) * 0.007 * ep * crystalBonus * crystalMilestone * cmdBonus * cBoost * artCrystalBonus * prodPenalty,
    he3:     (b.he3_refinery?.level || 1) * 0.003 * ep * he3Bonus     * he3Milestone     * cmdBonus * hBoost * he3Synergy   * artHe3Bonus * prodPenalty,
  };
}

// NOVO: getProd sada vraća BAZA + KOLONIJE za UI
function getProd() {
  const base = getBaseProd();
  const col = typeof getTotalColonyProduction === 'function' ? getTotalColonyProduction() : {metal:0,crystal:0,he3:0};
  return {
    metal: base.metal + col.metal,
    crystal: base.crystal + col.crystal,
    he3: base.he3 + col.he3
  };
}

// ── DEPOT / STORAGE ──
function addToStorage(prod) {
  const capacity    = getDepotCapacity();
  const currentTotal = storageBuffer.metal + storageBuffer.crystal + storageBuffer.he3;
  const incoming     = prod.metal + prod.crystal + prod.he3;
  const newTotal     = currentTotal + incoming;

  if (newTotal > capacity) {
    if (currentTotal >= capacity) return false; // pun, ništa ne prima
    const space = capacity - currentTotal;
    const ratio = space / incoming;
    storageBuffer.metal   += prod.metal   * ratio;
    storageBuffer.crystal += prod.crystal * ratio;
    storageBuffer.he3     += prod.he3     * ratio;
    return false; // pun
  }

  storageBuffer.metal   += prod.metal;
  storageBuffer.crystal += prod.crystal;
  storageBuffer.he3     += prod.he3;
  return true;
}

function pickupResources() {
  const gained = {
    metal:   Math.floor(storageBuffer.metal),
    crystal: Math.floor(storageBuffer.crystal),
    he3:     Math.floor(storageBuffer.he3),
  };

  if (gained.metal === 0 && gained.crystal === 0 && gained.he3 === 0) {
    toast('📦 Depot je prazan!', 'warn');
    return;
  }

  R.metal   += gained.metal;
  R.crystal += gained.crystal;
  R.he3     += gained.he3;

  storageBuffer = { metal: 0, crystal: 0, he3: 0 };
  window._totalDepotPickups = (window._totalDepotPickups || 0) + 1;
  if (typeof trackDailyDepot === 'function') trackDailyDepot();

  updateResUI();
  if (typeof renderDepot === 'function') renderDepot();
  toast(`📦 Pokupljeno: 🔩${fmt(gained.metal)} 💎${fmt(gained.crystal)} ⛽${fmt(gained.he3)}`, 'ok');
  addLog(`📦 Resursi pokupljeni iz Depota.`);
  saveGame();
}

// ── TICK FUNKCIJE (poziva main.js) ──
function tickProduction() {
  const baseProd = getBaseProd(); // SAMO baza ide u Depot
  const hasSpace = addToStorage(baseProd);

  if (!hasSpace && !window._storageWarned) {
    toast('📦 Depot je pun! Pokupi resurse da nastaviš produkciju.', 'warn');
    window._storageWarned = true;
    setTimeout(() => { window._storageWarned = false; }, 60000);
  }

  // Kolonije — direktno u R, bypass Depot
  if (typeof tickColonyProduction === 'function') tickColonyProduction();

  // Track ukupno metala za achievements (samo baza)
  window._totalMetalMined   = (window._totalMetalMined   || 0) + baseProd.metal;
  window._totalCrystalMined = (window._totalCrystalMined || 0) + baseProd.crystal;
  window._totalHe3Mined     = (window._totalHe3Mined     || 0) + baseProd.he3;

  // Produkcija po satu (za achievement check) — tick je svake 1s = 3600 tickova/h
  const prod = getProd();
  window._metalPerHour   = Math.floor((prod.metal   || 0) * 3600);
  window._crystalPerHour = Math.floor((prod.crystal || 0) * 3600);
  window._he3PerHour     = Math.floor((prod.he3     || 0) * 3600);

  updateResUI();
}

function tickEnergy() {
  const net = getEnergyNet();
  const max = getEnergyMax();
  const minEnergy = Math.floor(max * (getEnergyMinPct() / 100));
  R.energy  = Math.max(minEnergy, Math.min(max, R.energy + net));

  // Energetski surplus za achievements
  window._energySurplus = Math.floor(getEnergyGen() - getEnergyDrain());

  updateResUI();
  if (typeof updateEnergyBalanceCard === 'function') updateEnergyBalanceCard();
}

// ── KOMANDIR XP — formula: 120 × level^2.5 ──
function getExpForLevel(level) {
  return Math.floor(120 * Math.pow(level, 2.5));
}

function addExp(amount) {
  commander.exp += amount;
  while (commander.exp >= getExpForLevel(commander.level) && commander.level < 100) {
    commander.exp    -= getExpForLevel(commander.level);
    commander.level  += 1;
    commander.nextExp = getExpForLevel(commander.level);
    toast(`⭐ Komandir Level Up! Lv.${commander.level}`, 'ok');
    addLog(`⭐ Komandir napredovao na Lv.${commander.level}`);
  }
  // Osiguraj da nextExp uvijek odražava trenutni level
  commander.nextExp = getExpForLevel(commander.level);
  updateResUI();
}