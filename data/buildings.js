// ============================================================
// HIVE GALAXY — data/buildings.js
// Samo podaci o zgradama — nula logike
// ============================================================

const buildingsData = {

  // ── BAZA ──
  hq: {
    name:     'HQ',
    nameKey:  'building.hq.name',
    icon:     '🏛️',
    baseCost: 500,
    category: 'base',
    desc:     'Komandni centar. Određuje max nivo svih ostalih zgrada.',
    descKey:  'building.hq.desc',
    milestones: {
      25:  { label: 'Napredna komanda',   labelKey: 'building.hq.milestone.25.label',   bonus: 'Sve zgrade -10% cena nadogradnje',      bonusKey: 'building.hq.milestone.25.bonus',      cmdProdBonus: 10 },
      50:  { label: 'Strateški centar',   labelKey: 'building.hq.milestone.50.label',   bonus: 'Build timer -25% za sve zgrade',          bonusKey: 'building.hq.milestone.50.bonus',      buildSpeedBonus: 25 },
      75:  { label: 'Galaktički štab',    labelKey: 'building.hq.milestone.75.label',   bonus: 'Sve zgrade -20% cena nadogradnje',      bonusKey: 'building.hq.milestone.75.bonus',      cmdProdBonus: 20 },
      100: { label: 'LEGENDARNI KOMAND',  labelKey: 'building.hq.milestone.100.label',  bonus: 'Build timer -50%, sve zgrade -30% cena', bonusKey: 'building.hq.milestone.100.bonus',     buildSpeedBonus: 50, cmdProdBonus: 30 },
    },
  },

  metal_mine: {
    name:     'Metal Rudnik',
    nameKey:  'building.metal_mine.name',
    icon:     '⚙️',
    baseCost: 200,
    category: 'base',
    desc:     'Proizvodi metal. Svaki level +0.01/s.',
    descKey:  'building.metal_mine.desc',
    prodRate: 0.01,
    energyDrain: 2,
    milestones: {
      25:  { label: 'Duboko bušenje',      labelKey: 'building.metal_mine.milestone.25.label',      bonus: '+25% metal produkcija',       bonusKey: 'building.metal_mine.milestone.25.bonus',       metalBonus: 25 },
      50:  { label: 'Automatizovani rudnik',labelKey: 'building.metal_mine.milestone.50.label',    bonus: '+50% metal produkcija',       bonusKey: 'building.metal_mine.milestone.50.bonus',       metalBonus: 50 },
      75:  { label: 'Nano-ekstrakcija',    labelKey: 'building.metal_mine.milestone.75.label',    bonus: '+100% metal produkcija',      bonusKey: 'building.metal_mine.milestone.75.bonus',      metalBonus: 100 },
      100: { label: 'TITAN RUDNIK',        labelKey: 'building.metal_mine.milestone.100.label',   bonus: '+200% metal produkcija + -50% energija drain', bonusKey: 'building.metal_mine.milestone.100.bonus', metalBonus: 200, energyReduction: 50 },
    },
  },

  crystal_mine: {
    name:     'Crystal Rudnik',
    nameKey:  'building.crystal_mine.name',
    icon:     '💎',
    baseCost: 250,
    category: 'base',
    desc:     'Proizvodi crystal. Svaki level +0.007/s.',
    descKey:  'building.crystal_mine.desc',
    prodRate: 0.007,
    energyDrain: 2,
    milestones: {
      25:  { label: 'Kristalna rezonanca',  labelKey: 'building.crystal_mine.milestone.25.label',  bonus: '+25% crystal produkcija',      bonusKey: 'building.crystal_mine.milestone.25.bonus',      crystalBonus: 25 },
      50:  { label: 'Frekventni laserski rez', labelKey: 'building.crystal_mine.milestone.50.label', bonus: '+50% crystal produkcija',   bonusKey: 'building.crystal_mine.milestone.50.bonus',   crystalBonus: 50 },
      75:  { label: 'Kvantna ekstrakcija',  labelKey: 'building.crystal_mine.milestone.75.label',  bonus: '+100% crystal produkcija',     bonusKey: 'building.crystal_mine.milestone.75.bonus',      crystalBonus: 100 },
      100: { label: 'KRISTALNA MATRICA',    labelKey: 'building.crystal_mine.milestone.100.label', bonus: '+200% crystal produkcija + metal rudnik +10%', bonusKey: 'building.crystal_mine.milestone.100.bonus', crystalBonus: 200, metalSynergyBonus: 10 },
    },
  },

  he3_refinery: {
    name:     'He3 Rafinerija',
    nameKey:  'building.he3_refinery.name',
    icon:     '⛽',
    baseCost: 300,
    category: 'base',
    desc:     'Proizvodi He3. Svaki level +0.003/s.',
    descKey:  'building.he3_refinery.desc',
    prodRate: 0.003,
    energyDrain: 3,
    milestones: {
      25:  { label: 'Fuzijska filtracija',   labelKey: 'building.he3_refinery.milestone.25.label',   bonus: '+25% He3 produkcija',         bonusKey: 'building.he3_refinery.milestone.25.bonus',   he3Bonus: 25 },
      50:  { label: 'Plazmatski separator',  labelKey: 'building.he3_refinery.milestone.50.label',  bonus: '+50% He3 produkcija',         bonusKey: 'building.he3_refinery.milestone.50.bonus',  he3Bonus: 50 },
      75:  { label: 'Izotopska destilacija', labelKey: 'building.he3_refinery.milestone.75.label', bonus: '+100% He3 produkcija',        bonusKey: 'building.he3_refinery.milestone.75.bonus', he3Bonus: 100 },
      100: { label: 'SINGULARNA RAFINERIJA', labelKey: 'building.he3_refinery.milestone.100.label', bonus: '+200% He3 + energetske zgrade +10%', bonusKey: 'building.he3_refinery.milestone.100.bonus', he3Bonus: 200, energySynergyBonus: 10 },
    },
  },

  depot: {
    name:     'Depot',
    nameKey:  'building.depot.name',
    icon:     '📦',
    baseCost: 180,
    category: 'base',
    desc:     'Magacin resursa. Igrač mora pokupiti resurse. Ako je pun — produkcija staje.',
    descKey:  'building.depot.desc',
    energyDrain: 1,
    milestones: {
      25:  { label: 'Prošireni magacin',   labelKey: 'building.depot.milestone.25.label',   bonus: '+10% kapacitet',  bonusKey: 'building.depot.milestone.25.bonus',  capBonus: 10  },
      50:  { label: 'Industrijska pohrana',labelKey: 'building.depot.milestone.50.label',  bonus: '+25% kapacitet',  bonusKey: 'building.depot.milestone.50.bonus',  capBonus: 25  },
      75:  { label: 'Kvantni kontejneri',  labelKey: 'building.depot.milestone.75.label',  bonus: '+50% kapacitet',  bonusKey: 'building.depot.milestone.75.bonus',  capBonus: 50  },
      100: { label: 'MEGA DEPOT',          labelKey: 'building.depot.milestone.100.label', bonus: '+100% kapacitet', bonusKey: 'building.depot.milestone.100.bonus', capBonus: 100 },
    },
  },

  ship_factory: {
    name:     'Fabrika brodova',
    nameKey:  'building.ship_factory.name',
    icon:     '🏭',
    baseCost: 400,
    category: 'base',
    desc:     'Brodogradilište. Otključava klase brodova i ubrzava gradnju.',
    descKey:  'building.ship_factory.desc',
    energyDrain: 4,
    unlocks: {
      1:  ['scout'],
      2:  ['fighter'],
      3:  ['cruiser'],
      4:  ['battleship'],
      5:  ['carrier'],
      6:  ['special'],
    },
    milestones: {
      25:  { label: 'Automatizovana linija', labelKey: 'building.ship_factory.milestone.25.label', bonus: '+5% brzina gradnje, -5% cena',   bonusKey: 'building.ship_factory.milestone.25.bonus',   speedBonus: 5,  discountBonus: 5  },
      50:  { label: 'Napredno brodogradilište', labelKey: 'building.ship_factory.milestone.50.label', bonus: '+10% brzina, -10% cena',      bonusKey: 'building.ship_factory.milestone.50.bonus',  speedBonus: 10, discountBonus: 10 },
      75:  { label: 'Mega fabrika',          labelKey: 'building.ship_factory.milestone.75.label', bonus: '+15% brzina, -15% cena',         bonusKey: 'building.ship_factory.milestone.75.bonus',  speedBonus: 15, discountBonus: 15 },
      100: { label: 'GALAKTIČKI ARSENAL',    labelKey: 'building.ship_factory.milestone.100.label', bonus: '+25% brzina, -20% cena, svi brodovi +5% stats', bonusKey: 'building.ship_factory.milestone.100.bonus', speedBonus: 25, discountBonus: 20, shipStatBonus: 5 },
    },
  },

  // ── ENERGIJA ──
  solar: {
    name:     'Solarni Panel',
    nameKey:  'building.solar.name',
    icon:     '☀️',
    baseCost: 160,
    category: 'energy',
    desc:     'Generiše energiju. Svaki level +4 MWh/s.',
    descKey:  'building.solar.desc',
    genRate:  4,
    milestones: {
      25:  { label: 'Fotonaponska mreža',    labelKey: 'building.solar.milestone.25.label',    bonus: '+25% solarna generacija',     bonusKey: 'building.solar.milestone.25.bonus',     genBonus: 25 },
      50:  { label: 'Orbitalni kolektori',   labelKey: 'building.solar.milestone.50.label',   bonus: '+50% solarna generacija',     bonusKey: 'building.solar.milestone.50.bonus',    genBonus: 50 },
      75:  { label: 'Solarni prsten',        labelKey: 'building.solar.milestone.75.label',   bonus: '+100% solarna generacija',    bonusKey: 'building.solar.milestone.75.bonus',   genBonus: 100 },
      100: { label: 'DYSON SFERA',           labelKey: 'building.solar.milestone.100.label',  bonus: '+200% solarna + sve energetske zgrade +15%', bonusKey: 'building.solar.milestone.100.bonus', genBonus: 200, energySynergyBonus: 15 },
    },
  },

  fusion: {
    name:     'Fuzijski Reaktor',
    nameKey:  'building.fusion.name',
    icon:     '⚛️',
    baseCost: 500,
    category: 'energy',
    desc:     'Snažna energija. Svaki level +12 MWh/s, +1 MWh kapacitet.',
    descKey:  'building.fusion.desc',
    genRate:  12,
    capRate:  1,
    milestones: {
      25:  { label: 'Magnetna kavez',         labelKey: 'building.fusion.milestone.25.label',         bonus: '+25% fuzijska generacija',    bonusKey: 'building.fusion.milestone.25.bonus',    genBonus: 25 },
      50:  { label: 'Tokamak optimizacija',   labelKey: 'building.fusion.milestone.50.label',   bonus: '+50% fuzijska generacija',   bonusKey: 'building.fusion.milestone.50.bonus',   genBonus: 50 },
      75:  { label: 'Antimaterija boost',     labelKey: 'building.fusion.milestone.75.label',     bonus: '+100% fuzijska generacija',  bonusKey: 'building.fusion.milestone.75.bonus',  genBonus: 100 },
      100: { label: 'ZVJEZDANA SRCA',         labelKey: 'building.fusion.milestone.100.label',        bonus: '+200% fuzijska + kapacitet x3', bonusKey: 'building.fusion.milestone.100.bonus', genBonus: 200, capMultiplier: 3 },
    },
  },

  battery: {
    name:     'Baterijski Blok',
    nameKey:  'building.battery.name',
    icon:     '🔋',
    baseCost: 220,
    category: 'energy',
    desc:     'Skladišti energiju. Svaki level +1 MWh/s, +97 MWh kapacitet.',
    descKey:  'building.battery.desc',
    genRate:  1,
    capRate:  97,
    milestones: {
      25:  { label: 'Superkondenzator',       labelKey: 'building.battery.milestone.25.label',       bonus: '+25% kapacitet',             bonusKey: 'building.battery.milestone.25.bonus',      capBonus: 25 },
      50:  { label: 'Nano-ćelije',            labelKey: 'building.battery.milestone.50.label',       bonus: '+50% kapacitet',             bonusKey: 'building.battery.milestone.50.bonus',      capBonus: 50 },
      75:  { label: 'Kvantna baterija',       labelKey: 'building.battery.milestone.75.label',      bonus: '+100% kapacitet',            bonusKey: 'building.battery.milestone.75.bonus',     capBonus: 100 },
      100: { label: 'PERPETUUM MOBILE',       labelKey: 'building.battery.milestone.100.label',      bonus: '+200% kapacitet + ne može pasti ispod 20%', bonusKey: 'building.battery.milestone.100.bonus', capBonus: 200, minEnergyPct: 20 },
    },
  },

  grid: {
    name:     'Električna Mreža',
    nameKey:  'building.grid.name',
    icon:     '⚡',
    baseCost: 180,
    category: 'energy',
    desc:     'Optimizuje distribuciju energije. Svaki level -0.5% drain svih zgrada. Lv100 = -50% drain.',
    descKey:  'building.grid.desc',
    genRate:  1,
    capRate:  1,
    milestones: {
      25:  { label: 'Optimizovana mreža',    labelKey: 'building.grid.milestone.25.label',    bonus: '-12.5% drain svih zgrada', bonusKey: 'building.grid.milestone.25.bonus' },
      50:  { label: 'Supravodič',            labelKey: 'building.grid.milestone.50.label',    bonus: '-25% drain svih zgrada',   bonusKey: 'building.grid.milestone.50.bonus' },
      75:  { label: 'Kvantna distribucija',  labelKey: 'building.grid.milestone.75.label',  bonus: '-37.5% drain svih zgrada', bonusKey: 'building.grid.milestone.75.bonus' },
      100: { label: 'BESKONAČNA EFIKASNOST', labelKey: 'building.grid.milestone.100.label', bonus: '-50% drain svih zgrada',   bonusKey: 'building.grid.milestone.100.bonus' },
    },
  },

  // ── ODBRANA ──
  turret: {
    name:     'Laserski Top',
    nameKey:  'building.turret.name',
    icon:     '🔫',
    baseCost: 280,
    category: 'defense',
    desc:     'Osnovna odbrana baze. Svaki level +80 odbrana.',
    descKey:  'building.turret.desc',
    defRate:  80,
    energyDrain: 2,
    milestones: {
      25:  { label: 'Automatsko ciljanje',    labelKey: 'building.turret.milestone.25.label',    bonus: 'Flota: +10% napad',                         bonusKey: 'building.turret.milestone.25.bonus',    fleetAtkBonus: 10 },
      50:  { label: 'Plazmeni top',           labelKey: 'building.turret.milestone.50.label',   bonus: 'Flota: +20% napad, +5% kritični udarac',    bonusKey: 'building.turret.milestone.50.bonus',   fleetAtkBonus: 20, fleetCritBonus: 5 },
      75:  { label: 'Anti-capital oružje',    labelKey: 'building.turret.milestone.75.label',    bonus: 'Flota: +35% napad, +10% kritični udarac',   bonusKey: 'building.turret.milestone.75.bonus',   fleetAtkBonus: 35, fleetCritBonus: 10 },
      100: { label: 'ORBITALNI KANON',        labelKey: 'building.turret.milestone.100.label',        bonus: 'Flota: +50% napad, +20% kritični udarac',   bonusKey: 'building.turret.milestone.100.bonus',   fleetAtkBonus: 50, fleetCritBonus: 20 },
    },
  },

  missile_bat: {
    name:     'Raketna Baterija',
    nameKey:  'building.missile_bat.name',
    icon:     '🚀',
    baseCost: 350,
    category: 'defense',
    desc:     'Protivraketna odbrana. Svaki level +80 odbrana.',
    descKey:  'building.missile_bat.desc',
    defRate:  80,
    energyDrain: 3,
    milestones: {
      25:  { label: 'Višestepene rakete',     labelKey: 'building.missile_bat.milestone.25.label',     bonus: 'Blokira špijunažu na bazu',                              bonusKey: 'building.missile_bat.milestone.25.bonus',     blockEsp: true },
      50:  { label: 'Nuklearni bojevi',       labelKey: 'building.missile_bat.milestone.50.label',       bonus: 'Blokira špijunažu, flota: +5 izbjegavanje',              bonusKey: 'building.missile_bat.milestone.50.bonus',       blockEsp: true, fleetEvasionBonus: 5 },
      75:  { label: 'Orbitalni interceptor',  labelKey: 'building.missile_bat.milestone.75.label',  bonus: 'Blokira špijunažu, flota: +10 izbjegavanje, +1 brzina',  bonusKey: 'building.missile_bat.milestone.75.bonus',  blockEsp: true, fleetEvasionBonus: 10, fleetSpeedBonus: 1 },
      100: { label: 'APOKALIPSA',             labelKey: 'building.missile_bat.milestone.100.label',             bonus: 'Blokira špijunažu, flota: +15 izbjegavanje, +2 brzina',  bonusKey: 'building.missile_bat.milestone.100.bonus',             blockEsp: true, fleetEvasionBonus: 15, fleetSpeedBonus: 2 },
    },
  },

  shield_gen: {
    name:     'Generator štita',
    nameKey:  'building.shield_gen.name',
    icon:     '🛡️',
    baseCost: 420,
    category: 'defense',
    desc:     'Energetski štit baze. Svaki level +80 odbrana.',
    descKey:  'building.shield_gen.desc',
    defRate:  80,
    energyDrain: 4,
    milestones: {
      25:  { label: 'Fazni štit',             labelKey: 'building.shield_gen.milestone.25.label',             bonus: 'Flota: +10% shield',                                       bonusKey: 'building.shield_gen.milestone.25.bonus',             fleetShieldBonus: 10 },
      50:  { label: 'Harmonični štit',        labelKey: 'building.shield_gen.milestone.50.label',        bonus: 'Flota: +20% shield, +10% regeneracija shielda',            bonusKey: 'building.shield_gen.milestone.50.bonus',        fleetShieldBonus: 20, fleetShieldRegenBonus: 10 },
      75:  { label: 'Kvantni štit',           labelKey: 'building.shield_gen.milestone.75.label',       bonus: 'Flota: +35% shield, +20% regeneracija shielda',            bonusKey: 'building.shield_gen.milestone.75.bonus',       fleetShieldBonus: 35, fleetShieldRegenBonus: 20 },
      100: { label: 'NEPROBOJAN ŠTIT',        labelKey: 'building.shield_gen.milestone.100.label',        bonus: 'Flota: +50% shield, +30% regen, +5% redukcija štete',      bonusKey: 'building.shield_gen.milestone.100.bonus',        fleetShieldBonus: 50, fleetShieldRegenBonus: 30, fleetDmgReductionBonus: 5 },
    },
  },

  sensor: {
    name:     'Senzorski Toranj',
    nameKey:  'building.sensor.name',
    icon:     '📡',
    baseCost: 190,
    category: 'defense',
    desc:     'Detekcija neprijatelja. Svaki level +80 odbrana.',
    descKey:  'building.sensor.desc',
    defRate:  80,
    energyDrain: 1,
    milestones: {
      25:  { label: 'Dubok sken',             labelKey: 'building.sensor.milestone.25.label',             bonus: '+25% šansa špijunaže',                           bonusKey: 'building.sensor.milestone.25.bonus',           espBonus: 25 },
      50:  { label: 'Kvantni senzori',        labelKey: 'building.sensor.milestone.50.label',        bonus: '+50% šansa špijunaže, +1 nivo otkrivanja',       bonusKey: 'building.sensor.milestone.50.bonus',      espBonus: 50, espRevealBonus: 1 },
      75:  { label: 'Galaktički radar',       labelKey: 'building.sensor.milestone.75.label',       bonus: '+75% šansa špijunaže, +1 nivo otkrivanja',       bonusKey: 'building.sensor.milestone.75.bonus',     espBonus: 75, espRevealBonus: 1 },
      100: { label: 'SVEVIDEĆE OKO',          labelKey: 'building.sensor.milestone.100.label',          bonus: '+100% šansa špijunaže, +2 nivoa otkrivanja',     bonusKey: 'building.sensor.milestone.100.bonus',    espBonus: 100, espRevealBonus: 2 },
    },
  },

  // ── SPECIJALNE ZGRADE ──
  jump_gate: {
    name:     'Kapija skoka',
    nameKey:  'building.jump_gate.name',
    icon:     '🌀',
    baseCost: 800,
    category: 'special',
    desc:     'Prebacuje brodove na kolonije. Svaki level +1 sistem dometa.',
    descKey:  'building.jump_gate.desc',
    energyDrain: 5,
    milestones: {
      25:  { label: 'Stabilni koridor',       labelKey: 'building.jump_gate.milestone.25.label',       bonus: '+1 max kolonija, brži transit',    bonusKey: 'building.jump_gate.milestone.25.bonus',    extraColony: 1 },
      50:  { label: 'Wormhole mreža',         labelKey: 'building.jump_gate.milestone.50.label',         bonus: '+2 max kolonije, instant transit', bonusKey: 'building.jump_gate.milestone.50.bonus',  extraColony: 2 },
      75:  { label: 'Galaktički portali',     labelKey: 'building.jump_gate.milestone.75.label',     bonus: '+3 max kolonije',                  bonusKey: 'building.jump_gate.milestone.75.bonus',  extraColony: 3 },
      100: { label: 'BESKONAČNI SKOK',        labelKey: 'building.jump_gate.milestone.100.label',        bonus: '+5 max kolonija + teleport svuda', bonusKey: 'building.jump_gate.milestone.100.bonus', extraColony: 5 },
    },
  },

  laboratory: {
    name:     'Laboratorija',
    nameKey:  'building.laboratory.name',
    icon:     '🔬',
    baseCost: 600,
    category: 'special',
    desc:     'Limitira max nivo istraživanja. Lv1 = Istraživanje Lv1, Lv100 = Istraživanje Lv100.',
    descKey:  'building.laboratory.desc',
    energyDrain: 4,
    milestones: {
      25:  { label: 'Napredni lab',           labelKey: 'building.laboratory.milestone.25.label',      bonus: 'Istraživanje -20% cena',         bonusKey: 'building.laboratory.milestone.25.bonus',      researchDiscount: 20 },
      50:  { label: 'Kvantni lab',            labelKey: 'building.laboratory.milestone.50.label',       bonus: 'Istraživanje -35% cena',         bonusKey: 'building.laboratory.milestone.50.bonus',       researchDiscount: 35 },
      75:  { label: 'Xenotehnološki centar',  labelKey: 'building.laboratory.milestone.75.label', bonus: 'Istraživanje -50% cena',         bonusKey: 'building.laboratory.milestone.75.bonus', researchDiscount: 50 },
      100: { label: 'SINGULARNOST',           labelKey: 'building.laboratory.milestone.100.label',      bonus: 'Sva istraživanja instant + -75% cena', bonusKey: 'building.laboratory.milestone.100.bonus', researchDiscount: 75, researchInstant: true },
    },
  },

  recycler: {
    name:     'Recikler',
    nameKey:  'building.recycler.name',
    icon:     '♻️',
    baseCost: 450,
    category: 'special',
    desc:     'Reciklira brodove za resurse. Lv1=20%, Lv100=100% originalne cene.',
    descKey:  'building.recycler.desc',
    energyDrain: 3,
    milestones: {
      25:  { label: 'Napredna reciklaža',     labelKey: 'building.recycler.milestone.25.label',     bonus: 'Povrat +5% bonus (iznad osnovnog)',   bonusKey: 'building.recycler.milestone.25.bonus',   rateBonus: 5 },
      50:  { label: 'Nano-rastavljač',        labelKey: 'building.recycler.milestone.50.label',       bonus: 'Povrat +10% bonus + brza reciklaža',  bonusKey: 'building.recycler.milestone.50.bonus',  rateBonus: 10 },
      75:  { label: 'Atomski reprocessor',    labelKey: 'building.recycler.milestone.75.label',   bonus: 'Povrat +15% bonus',                   bonusKey: 'building.recycler.milestone.75.bonus',  rateBonus: 15 },
      100: { label: 'MATERIJA RECIKLER',      labelKey: 'building.recycler.milestone.100.label',     bonus: 'Povrat 100% + šansa za blueprint fragment', bonusKey: 'building.recycler.milestone.100.bonus', rateBonus: 20, bpFragmentChance: 10 },
    },
  },
};

// ── RARITY BOJE PO NIVOU (svaka zgrada) ──
function getBuildingNameColor(level) {
  if (level >= 75) return '#ff6600';  // Legendary — narandžasta
  if (level >= 50) return '#cc33ff';  // Epic      — ljubičasta
  if (level >= 25) return '#3399ff';  // Rare      — plava
  return '#ffcc00';                   // Common    — žuta
}

// ── MILESTONE INFO ZA ZGRADU ──
function getBuildingMilestones(key) {
  return buildingsData[key]?.milestones || {};
}

// ── SLJEDEĆI MILESTONE ──
function getNextMilestone(key) {
  const level      = buildings[key]?.level || 0;
  const milestones = getBuildingMilestones(key);
  const levels     = Object.keys(milestones).map(Number).sort((a, b) => a - b);
  return levels.find(lvl => lvl > level) || null;
}

// ── PRETHODNI (aktivni) MILESTONE ──
function getActiveMilestone(key) {
  const level      = buildings[key]?.level || 0;
  const milestones = getBuildingMilestones(key);
  const levels     = Object.keys(milestones).map(Number).sort((a, b) => b - a);
  const reached    = levels.find(lvl => lvl <= level);
  return reached ? milestones[reached] : null;
}

// ── MILESTONE HTML ZA KARTICU ──
function renderMilestoneBar(key) {
  const level      = buildings[key]?.level || 0;
  const milestones = getBuildingMilestones(key);
  const mLevels    = Object.keys(milestones).map(Number).sort((a, b) => a - b);
  if (mLevels.length === 0) return '';

  const nextMlvl   = mLevels.find(lvl => lvl > level);
  const activeMlvl = [...mLevels].reverse().find(lvl => lvl <= level);

  let html = `<div style="margin:8px 0">`;

  // Progress do sljedećeg milestonea
  if (nextMlvl) {
    const prevMlvl = activeMlvl || 0;
    const pct      = ((level - prevMlvl) / (nextMlvl - prevMlvl)) * 100;
    const m        = milestones[nextMlvl];
    html += `
      <div style="display:flex;justify-content:space-between;font-size:0.58rem;
        color:#6a90b8;margin-bottom:3px">
        <span>🎯 ${dl(m)}</span>
        <span style="color:#ffcc44">Lv.${nextMlvl} (još ${nextMlvl - level})</span>
      </div>
      <div style="background:rgba(0,0,0,0.4);border-radius:3px;height:4px;overflow:hidden;margin-bottom:4px">
        <div style="height:100%;width:${Math.min(100,pct)}%;
          background:linear-gradient(90deg,#ffcc44aa,#ffcc44);transition:width 0.3s"></div>
      </div>
      <div style="font-size:0.55rem;color:#ffcc4488">${db(m)}</div>
      <div style="font-size:0.52rem;color:#00d4ff;margin-top:2px">${t('building.milestone.cmdKeyReward', {level: nextMlvl})}</div>`;
  }

  // Aktivni milestone badge
  if (activeMlvl) {
    const m = milestones[activeMlvl];
    html += `
      <div style="margin-top:5px;background:rgba(255,204,68,0.08);border:1px solid rgba(255,204,68,0.25);
        border-radius:4px;padding:3px 7px;display:inline-block;font-size:0.55rem;color:#ffcc44">
        ✨ ${dl(m)}: ${db(m)}
      </div>`;
  }

  // Milestone markeri (sve 4 tačke)
  html += `<div style="display:flex;gap:3px;margin-top:5px;align-items:center">`;
  mLevels.forEach(mlvl => {
    const reached = level >= mlvl;
    const isNext  = mlvl === nextMlvl;
    html += `
      <div title="Lv.${mlvl}: ${dl(milestones[mlvl])}" style="
        width:${isNext ? 10 : 8}px;height:${isNext ? 10 : 8}px;border-radius:50%;
        background:${reached ? '#ffcc44' : isNext ? '#ffcc4444' : '#1a2540'};
        border:1px solid ${reached ? '#ffcc44' : isNext ? '#ffcc44' : '#2a3a5a'};
        box-shadow:${reached ? '0 0 4px #ffcc4466' : 'none'};
        transition:all 0.3s;cursor:help;
      "></div>`;
  });
  html += `<span style="font-size:0.55rem;color:#6a90b8;margin-left:4px">${level}/100</span>`;
  html += `</div>`;

  html += `</div>`;
  return html;
}

// ── CIJENA NADOGRADNJE ──
function getBuildingCost(key) {
  const b = buildingsData[key];
  if (!b) return { metal: 0, crystal: 0, he3: 0 };
  const level = buildings[key]?.level || 1;
  let metal = Math.floor(b.baseCost * Math.pow(1.15, level));

  // HQ milestone cost reduction
  const hqLevel = buildings.hq?.level || 0;
  const hqM     = getBuildingMilestones('hq');
  let costReduction = 0;
  Object.entries(hqM).forEach(([mlvl, data]) => {
    if (hqLevel >= parseInt(mlvl) && data.cmdProdBonus) {
      costReduction = Math.max(costReduction, data.cmdProdBonus);
    }
  });
  if (costReduction > 0) metal = Math.floor(metal * (1 - costReduction / 100));

  return {
    metal:   metal,
    crystal: Math.floor(metal * 0.6),
    he3:     Math.floor(metal * 0.35),
  };
}

// ── DEPOT KAPACITET ──
function getDepotCapacity() {
  const level    = buildings.depot?.level || 1;
  const base     = Math.floor(220 + (level - 1) * (22000 - 220) / 99);
  const milestoneM = getBuildingMilestones('depot');
  // Saberi sve dostignute capBonus vrijednosti
  let capBonus   = 0;
  Object.entries(milestoneM).forEach(([mlvl, data]) => {
    if (level >= parseInt(mlvl) && data.capBonus) {
      capBonus += data.capBonus;
    }
  });
  return Math.floor(base * (1 + capBonus / 100));
}

// ── PRODUKCIJA BONUS IZ MILESTONA ──
function getMetalMilestoneBonus() {
  const level = buildings.metal_mine?.level || 0;
  const m     = getBuildingMilestones('metal_mine');
  let bonus   = 0;
  Object.entries(m).forEach(([mlvl, data]) => {
    if (level >= parseInt(mlvl) && data.metalBonus) bonus = Math.max(bonus, data.metalBonus);
  });
  return bonus; // u %
}

function getCrystalMilestoneBonus() {
  const level = buildings.crystal_mine?.level || 0;
  const m     = getBuildingMilestones('crystal_mine');
  let bonus   = 0;
  Object.entries(m).forEach(([mlvl, data]) => {
    if (level >= parseInt(mlvl) && data.crystalBonus) bonus = Math.max(bonus, data.crystalBonus);
  });
  return bonus;
}

function getHe3MilestoneBonus() {
  const level = buildings.he3_refinery?.level || 0;
  const m     = getBuildingMilestones('he3_refinery');
  let bonus   = 0;
  Object.entries(m).forEach(([mlvl, data]) => {
    if (level >= parseInt(mlvl) && data.he3Bonus) bonus = Math.max(bonus, data.he3Bonus);
  });
  return bonus;
}

// ── SHIP FACTORY BONUSI ──
function getShipFactorySpeedBonus() {
  const level = buildings.ship_factory?.level || 1;
  let bonus   = level * 1;
  const m     = buildingsData.ship_factory.milestones;
  Object.entries(m).forEach(([lvl, data]) => {
    if (level >= parseInt(lvl)) bonus += data.speedBonus;
  });
  return bonus;
}

function getShipFactoryDiscount() {
  const level    = buildings.ship_factory?.level || 1;
  let discount   = 0;
  const m        = buildingsData.ship_factory.milestones;
  Object.entries(m).forEach(([lvl, data]) => {
    if (level >= parseInt(lvl)) discount += data.discountBonus;
  });
  return discount;
}

function getUnlockedShipClasses() {
  const level   = buildings.ship_factory?.level || 1;
  const unlocked = [];
  Object.entries(buildingsData.ship_factory.unlocks).forEach(([lvl, classes]) => {
    if (level >= parseInt(lvl)) unlocked.push(...classes);
  });
  return unlocked;
}

// ── JUMP GATE ──
function getJumpGateRange() {
  return buildings.jump_gate?.level || 0;
}

function getMaxColonies() {
  const jgLevel = buildings.jump_gate?.level || 0;
  if (jgLevel === 0) return 0;
  let base = Math.min(9, Math.floor(jgLevel / 10) + 1);
  // Milestone bonus
  const m  = getBuildingMilestones('jump_gate');
  let extra = 0;
  Object.entries(m).forEach(([mlvl, data]) => {
    if (jgLevel >= parseInt(mlvl) && data.extraColony) extra = Math.max(extra, data.extraColony);
  });
  return Math.min(12, base + extra);
}

// ── LABORATORY ──
function getMaxResearchLevel() {
  return buildings.laboratory?.level || 0;
}

function canResearch(branch) {
  const labLevel = getMaxResearchLevel();
  if (labLevel === 0) return false;
  return (research[branch]?.level || 0) < labLevel;
}

function getResearchDiscount() {
  const level = buildings.laboratory?.level || 0;
  const m     = getBuildingMilestones('laboratory');
  let discount = 0;
  Object.entries(m).forEach(([mlvl, data]) => {
    if (level >= parseInt(mlvl) && data.researchDiscount) discount = Math.max(discount, data.researchDiscount);
  });
  return discount;
}

// ── RECYCLER ──
function getRecycleRate() {
  const level = buildings.recycler?.level || 0;
  if (level === 0) return 0;
  let rate    = Math.min(100, 20 + (level - 1) * 0.8081);
  // Milestone bonus
  const m     = getBuildingMilestones('recycler');
  let bonus   = 0;
  Object.entries(m).forEach(([mlvl, data]) => {
    if (level >= parseInt(mlvl) && data.rateBonus) bonus = Math.max(bonus, data.rateBonus);
  });
  return Math.min(100, rate + bonus);
}

function getRecycleResources(ship, count) {
  const cost = getShipBuildCost(ship);
  const rate = getRecycleRate() / 100;
  return {
    metal:   Math.floor(cost.metal   * count * rate),
    crystal: Math.floor(cost.crystal * count * rate),
    he3:     Math.floor(cost.he3     * count * rate),
  };
}

// ── TIMER — GRADNJA ZGRADA ──
function getBuildingTimerSec(key) {
  const currentLevel = buildings[key]?.level || 0;
  // 30 * 1.12^level → lv1≈34s, lv10≈93s(~1.5m), lv25≈960s(~16m), lv50≈8200s(~2.3h), lv75≈70000s(~19h), lv100≈600000s(~7d)
  let secs = Math.round(30 * Math.pow(1.12, currentLevel));
  // HQ milestone speedBonus
  const hqLevel = buildings.hq?.level || 0;
  const hqM     = getBuildingMilestones('hq');
  let speedBonus = 0;
  Object.entries(hqM).forEach(([mlvl, data]) => {
    if (hqLevel >= parseInt(mlvl) && data.buildSpeedBonus) speedBonus = Math.max(speedBonus, data.buildSpeedBonus);
  });
  if (speedBonus > 0) secs = Math.floor(secs * (1 - speedBonus / 100));
  return Math.max(5, secs);
}

function getBuildingBoostCost(key) {
  const currentLevel = buildings[key]?.level || 0;
  return (currentLevel + 1) * 10;
}
