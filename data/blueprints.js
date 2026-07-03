// ============================================================
// HIVE GALAXY — data/blueprints.js
// Blueprinti brodova — kombinacije opreme po klasi i moći
// Blueprint = preporučeni build za određeni stil igre
// ============================================================

// ── BLUEPRINT KATEGORIJE ──
const BLUEPRINT_ROLES = {
  glass_cannon:  { name: 'Glass Cannon',  nameKey: 'bp_role.glass_cannon.name',  icon: '💥', desc: 'Maksimalni DPS, minimalna odbrana.', descKey: 'bp_role.glass_cannon.desc' },
  tank:          { name: 'Tank',          nameKey: 'bp_role.tank.name',          icon: '🛡️', desc: 'Maksimalna odbrana, žrtvuje napad.', descKey: 'bp_role.tank.desc' },
  balanced:      { name: 'Balanced',      nameKey: 'bp_role.balanced.name',      icon: '⚖️', desc: 'Balans između napada i odbrane.', descKey: 'bp_role.balanced.desc' },
  stealth:       { name: 'Stealth',       nameKey: 'bp_role.stealth.name',       icon: '👻', desc: 'Izbjegavanje i iznenađenje.', descKey: 'bp_role.stealth.desc' },
  support:       { name: 'Support',       nameKey: 'bp_role.support.name',       icon: '🌐', desc: 'Podrška floti, buffe i debuffs.', descKey: 'bp_role.support.desc' },
  speed:         { name: 'Speed',         nameKey: 'bp_role.speed.name',         icon: '💨', desc: 'Maksimalna brzina i inicijativa.', descKey: 'bp_role.speed.desc' },
};

// ── BLUEPRINT TIERS ──
// starter = F2P prijatno, mid = Restricted content, endgame = Trial/Constellation
const BLUEPRINT_TIERS = {
  starter:  { name: 'Starter',  nameKey: 'bp_tier.starter.name',  color: '#ffdd00', desc: 'Dostupno svim igračima od početka.',   descKey: 'bp_tier.starter.desc' },
  mid:      { name: 'Mid Game', nameKey: 'bp_tier.mid.name',      color: '#4488ff', desc: 'Zahtijeva Restricted instance.',       descKey: 'bp_tier.mid.desc' },
  endgame:  { name: 'Endgame',  nameKey: 'bp_tier.endgame.name',  color: '#aa44ff', desc: 'Zahtijeva Trial ili Constellation.',   descKey: 'bp_tier.endgame.desc' },
  ultimate: { name: 'Ultimate', nameKey: 'bp_tier.ultimate.name', color: '#ffaa00', desc: 'Potrebni Legendary drop i Boss Event.', descKey: 'bp_tier.ultimate.desc' },
};

const BLUEPRINTS = [

  // ════════════════════════════════════════════
  // 🛸 IZVIĐAČ BLUEPRINTI
  // ════════════════════════════════════════════

  {
    id: 'bp_scout_starter',
    name: 'Scout — Starter Build',
    nameKey: 'blueprint.bp_scout_starter.name',
    shipClass: 'scout',
    role: 'balanced',
    tier: 'starter',
    icon: '🛸',
    ship: 'scout_Phantom_I',
    loadout: {
      weapons: ['w_kinetic_railgun_I', 'w_heat_inferno_I'],
      shield:  'sh_nano_veil_I',
      engine:  'eng_tactical_I',
      modules: ['mod_targeting_I', 'mod_cargo_I'],
    },
    stats_estimate: { dps: 155, ehp: 1200, speed: 1, evasion: 3 },
    tips: 'Idealan za prve misije i farming Common instanci. Fokusiraj se na detekciju.',
    tipsKey: 'blueprint.bp_scout_starter.tips',
    source_req: 'Instanca 5',
    sourceKey: 'blueprint.bp_scout_starter.source',
  },

  {
    id: 'bp_scout_stealth',
    name: 'Scout — Ghost Runner',
    nameKey: 'blueprint.bp_scout_stealth.name',
    shipClass: 'scout',
    role: 'stealth',
    tier: 'mid',
    icon: '👻',
    ship: 'scout_Shadow_II',
    loadout: {
      weapons: ['w_magnetic_pulsar_II', 'w_kinetic_railgun_beam_II'],
      shield:  'sh_phase_curtain_II',
      engine:  'eng_phantom_III',
      modules: ['mod_scanner_II', 'mod_warp_jammer_I'],
    },
    stats_estimate: { dps: 260, ehp: 3500, speed: 1, evasion: 27 },
    tips: 'Stealth runner. -45% detekcija. Idealan za izviđanje Restricted zona.',
    tipsKey: 'blueprint.bp_scout_stealth.tips',
    source_req: 'Instanca 13',
    sourceKey: 'blueprint.bp_scout_stealth.source',
  },

  {
    id: 'bp_scout_speed',
    name: 'Scout — Lightning Strike',
    nameKey: 'blueprint.bp_scout_speed.name',
    shipClass: 'scout',
    role: 'speed',
    tier: 'mid',
    icon: '⚡',
    ship: 'scout_Specter_II',
    loadout: {
      weapons: ['w_kinetic_railgun_II', 'w_heat_inferno_II'],
      shield:  'sh_particle_veil_II',
      engine:  'eng_sprint_III',
      modules: ['mod_crit_amp_II', 'mod_targeting_II'],
    },
    stats_estimate: { dps: 300, ehp: 2800, speed: 2, evasion: 17 },
    tips: 'Uvijek napada prvi. Ubijaš prije nego što te pogode.',
    tipsKey: 'blueprint.bp_scout_speed.tips',
    source_req: 'Instanca 13, Restricted 3',
    sourceKey: 'blueprint.bp_scout_speed.source',
  },

  {
    id: 'bp_scout_endgame',
    name: 'Scout — Phantom Elite',
    nameKey: 'blueprint.bp_scout_endgame.name',
    shipClass: 'scout',
    role: 'glass_cannon',
    tier: 'endgame',
    icon: '💥',
    ship: 'scout_Phantom_III',
    loadout: {
      weapons: ['w_kinetic_annihilator_beam_III', 'w_heat_hellfire_beam_III'],
      shield:  'sh_aegis_prime_II',
      engine:  'eng_quantum_III',
      modules: ['mod_crit_amp_III', 'mod_emp_burst_II'],
    },
    stats_estimate: { dps: 680, ehp: 7500, speed: 2, evasion: 40 },
    tips: 'Endgame izviđač. Teleport izbjegavanje + enorman DPS. Trial 5+ sadržaj.',
    tipsKey: 'blueprint.bp_scout_endgame.tips',
    source_req: 'Instanca 23',
    sourceKey: 'blueprint.bp_scout_endgame.source',
  },

  // ════════════════════════════════════════════
  // ⚔️ LOVAC BLUEPRINTI
  // ════════════════════════════════════════════

  {
    id: 'bp_fighter_endgame',
    name: 'Fighter — Apex Predator',
    nameKey: 'blueprint.bp_fighter_endgame.name',
    shipClass: 'fighter',
    role: 'glass_cannon',
    tier: 'endgame',
    icon: '💀',
    ship: 'fighter_Tempest_III',
    loadout: {
      weapons: ['w_kinetic_annihilator_beam_III', 'w_heat_hellfire_beam_III', 'w_magnetic_pulsar_III'],
      shield:  'sh_aegis_prime_II',
      engine:  'eng_hyperdrive_II',
      modules: ['mod_annihilator_II', 'mod_chrono_matrix_I'],
    },
    stats_estimate: { dps: 980, ehp: 9500, speed: 3, evasion: 38 },
    tips: 'Apex endgame lovac. Chrono matrix smanjuje cooldown. Execute + double move.',
    tipsKey: 'blueprint.bp_fighter_endgame.tips',
    source_req: 'Instanca 26, Restricted 7',
    sourceKey: 'blueprint.bp_fighter_endgame.source',
  },

  // ════════════════════════════════════════════
  // 🛡️ KRSTARICA BLUEPRINTI
  // ════════════════════════════════════════════

  {
    id: 'bp_cruiser_starter',
    name: 'Cruiser — Shield Wall',
    nameKey: 'blueprint.bp_cruiser_starter.name',
    shipClass: 'cruiser',
    role: 'tank',
    tier: 'starter',
    icon: '🛡️',
    ship: 'cruiser_Bastion_I',
    loadout: {
      weapons: ['w_kinetic_railgun_I', 'w_heat_inferno_I', 'w_kinetic_railgun_I'],
      shield:  'sh_alloy_plate_I',
      engine:  'eng_heavy_I',
      modules: ['mod_armor_plating_II', 'mod_structure_reinf_II', 'mod_repair_nano_I'],
    },
    stats_estimate: { dps: 230, ehp: 7500, speed: 1, evasion: 0 },
    tips: 'Tank krstarica. Drži liniju i apsorbuje štetu umjesto slabijih brodova.',
    tipsKey: 'blueprint.bp_cruiser_starter.tips',
    source_req: 'Instanca 26-28',
    sourceKey: 'blueprint.bp_cruiser_starter.source',
  },

  {
    id: 'bp_cruiser_endgame',
    name: 'Cruiser — Immortal Bastion',
    nameKey: 'blueprint.bp_cruiser_endgame.name',
    shipClass: 'cruiser',
    role: 'tank',
    tier: 'endgame',
    icon: '🏰',
    ship: 'cruiser_Citadel_III',
    loadout: {
      weapons: ['w_magnetic_pulsar_III', 'w_heat_hellfire_beam_III', 'w_kinetic_annihilator_beam_II'],
      shield:  'sh_omega_absorber_II',
      engine:  'eng_sentinel_III',
      modules: ['mod_fortress_core_III', 'mod_repair_nano_III', 'mod_countermeasure_III'],
    },
    stats_estimate: { dps: 560, ehp: 28000, speed: 1, evasion: 14 },
    tips: 'Gotovo neunišitv. -35% štete + void shield + nano repair. Endgame tanking.',
    tipsKey: 'blueprint.bp_cruiser_endgame.tips',
    source_req: 'Trial 8 (Hell), Hell boss drop',
    sourceKey: 'blueprint.bp_cruiser_endgame.source',
  },

  // ════════════════════════════════════════════
  // 💥 BOJNI BROD BLUEPRINTI
  // ════════════════════════════════════════════

  {
    id: 'bp_battleship_starter',
    name: 'Battleship — Iron Hammer',
    nameKey: 'blueprint.bp_battleship_starter.name',
    shipClass: 'battleship',
    role: 'balanced',
    tier: 'starter',
    icon: '💥',
    ship: 'battleship_Colossus_I',
    loadout: {
      weapons: ['w_kinetic_railgun_I', 'w_heat_inferno_I', 'w_explosive_devastator_I', 'w_kinetic_railgun_I'],
      shield:  'sh_alloy_plate_I',
      engine:  'eng_heavy_I',
      modules: ['mod_armor_plating_II', 'mod_targeting_I'],
    },
    stats_estimate: { dps: 320, ehp: 9000, speed: 1, evasion: 0 },
    tips: 'Solidan starter bojni brod. Četiri oružna slota daju odlični DPS od prvog dana.',
    tipsKey: 'blueprint.bp_battleship_starter.tips',
    source_req: 'Instanca 15 (Nightmare/Hell)',
    sourceKey: 'blueprint.bp_battleship_starter.source',
  },

  {
    id: 'bp_battleship_endgame',
    name: 'Battleship — Armageddon',
    nameKey: 'blueprint.bp_battleship_endgame.name',
    shipClass: 'battleship',
    role: 'glass_cannon',
    tier: 'endgame',
    icon: '☄️',
    ship: 'battleship_Obliterator_III',
    loadout: {
      weapons: ['w_kinetic_annihilator_beam_III', 'w_heat_hellfire_beam_III', 'w_heat_inferno_III', 'w_magnetic_pulsar_III'],
      shield:  'sh_phoenix_core_II',
      engine:  'eng_hyperdrive_III',
      modules: ['mod_annihilator_III', 'mod_chrono_matrix_II', 'mod_emp_burst_III'],
    },
    stats_estimate: { dps: 1800, ehp: 20000, speed: 3, evasion: 45 },
    tips: 'Endgame boss brod. Chrono matrix + quantum lance = razara sve u 1-2 runde.',
    tipsKey: 'blueprint.bp_battleship_endgame.tips',
    source_req: 'Restricted 5 (Nightmare/Hell)',
    sourceKey: 'blueprint.bp_battleship_endgame.source',
  },

  // ════════════════════════════════════════════
  // 🌌 NOSAČ BLUEPRINTI
  // ════════════════════════════════════════════

  {
    id: 'bp_carrier_starter',
    name: 'Carrier — Hangar Bay',
    nameKey: 'blueprint.bp_carrier_starter.name',
    shipClass: 'carrier',
    role: 'support',
    tier: 'mid',
    icon: '🌌',
    ship: 'carrier_Atlas_I',
    loadout: {
      weapons: ['w_light_fighters_I', 'w_heavy_fighters_I'],
      shield:  'sh_eternal_fortress_I',
      engine:  'eng_heavy_II',
      modules: ['mod_armor_plating_II', 'mod_structure_reinf_II', 'mod_repair_nano_I'],
    },
    stats_estimate: { dps: 200, ehp: 22000, speed: 1, evasion: 3 },
    tips: 'Starter nosač. Drži se nazad, leti Fighter Bay. Tanki po prirodi.',
    tipsKey: 'blueprint.bp_carrier_starter.tips',
    source_req: 'Instanca 6, 30',
    sourceKey: 'blueprint.bp_carrier_starter.source',
  },

  {
    id: 'bp_carrier_balanced',
    name: 'Carrier — Strike Carrier',
    nameKey: 'blueprint.bp_carrier_balanced.name',
    shipClass: 'carrier',
    role: 'balanced',
    tier: 'endgame',
    icon: '⚔️',
    ship: 'carrier_Dominion_II',
    loadout: {
      weapons: ['w_heavy_fighters_II', 'w_bomber_squadron_I'],
      shield:  'sh_omega_absorber_I',
      engine:  'eng_heavy_III',
      modules: ['mod_countermeasure_II', 'mod_fortress_core_II', 'mod_warp_jammer_II'],
    },
    stats_estimate: { dps: 480, ehp: 35000, speed: 1, evasion: 6 },
    tips: 'Strike carrier. Bomber squadron pogađa više meta odjednom. Zaključava neprijatelje.',
    tipsKey: 'blueprint.bp_carrier_balanced.tips',
    source_req: 'Trial 3 (Nightmare/Hell)',
    sourceKey: 'blueprint.bp_carrier_balanced.source',
  },

  {
    id: 'bp_carrier_endgame',
    name: 'Carrier — Galactic Overlord',
    nameKey: 'blueprint.bp_carrier_endgame.name',
    shipClass: 'carrier',
    role: 'support',
    tier: 'ultimate',
    icon: '🌠',
    ship: 'carrier_Sanctuary_III',
    loadout: {
      weapons: ['w_elite_squadron_III', 'w_bomber_squadron_III'],
      shield:  'sh_aegis_prime_III',
      engine:  'eng_celestial_II',
      modules: ['mod_fortress_core_III', 'mod_fleet_commander_II', 'mod_chrono_matrix_I'],
    },
    stats_estimate: { dps: 700, ehp: 60000, speed: 3, evasion: 15 },
    tips: 'Flagship-grade nosač. Elite squadron bira najslabiji oklop svake mete. Ubojit u floti.',
    tipsKey: 'blueprint.bp_carrier_endgame.tips',
    source_req: 'Constellation 2, Hell boss drop',
    sourceKey: 'blueprint.bp_carrier_endgame.source',
  },

  // ════════════════════════════════════════════
  // 👑 FLAGSHIP BLUEPRINTI
  // ════════════════════════════════════════════

  // Alliance Admiral (support flagship)
  {
    id: 'bp_special_support',
    name: 'Flagship — Fleet Admiral',
    nameKey: 'blueprint.bp_special_support.name',
    shipClass: 'special', role: 'support', tier: 'endgame', icon: '👑',
    ship: 'special_AllianceAdmiral_I',
    loadout: { weapons: ['w_kinetic_annihilator_beam_II', 'w_heat_hellfire_beam_II'], shield: 'sh_aegis_prime_II', engine: 'eng_celestial_I', modules: ['mod_fleet_commander_II', 'mod_fortress_core_I', 'mod_repair_nano_III'] },
    stats_estimate: { dps: 420, ehp: 32000, speed: 3, evasion: 30 },
    tips: 'Flota support flagship. Fleet Commander daje +18% napad i odbrana svim brodovima.',
    tipsKey: 'blueprint.bp_special_support.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_support.source',
  },
  {
    id: 'bp_special_allianceadmiral_ii',
    name: 'Flagship — Admiral II',
    nameKey: 'blueprint.bp_special_allianceadmiral_ii.name',
    shipClass: 'special', role: 'support', tier: 'endgame', icon: '🌐',
    ship: 'special_AllianceAdmiral_II',
    loadout: { weapons: ['w_kinetic_railgun_II', 'w_magnetic_disruptor_II'], shield: 'sh_void_field_II', engine: 'eng_tactical_II', modules: ['mod_fleet_commander_II', 'mod_fortress_core_II', 'mod_repair_nano_II'] },
    stats_estimate: { dps: 600, ehp: 35000, speed: 3, evasion: 35 },
    tips: 'Admiral II — podrška floti sa Fleet Commander bonusom.',
    tipsKey: 'blueprint.bp_special_allianceadmiral_ii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_allianceadmiral_ii.source',
  },
  {
    id: 'bp_special_allianceadmiral_iii',
    name: 'Flagship — Admiral III',
    nameKey: 'blueprint.bp_special_allianceadmiral_iii.name',
    shipClass: 'special', role: 'support', tier: 'ultimate', icon: '🌐',
    ship: 'special_AllianceAdmiral_III',
    loadout: { weapons: ['w_kinetic_railgun_III', 'w_magnetic_disruptor_III', 'w_elite_squadron_II'], shield: 'sh_divine_II', engine: 'eng_celestial_I', modules: ['mod_fleet_commander_III', 'mod_fortress_core_III', 'mod_chrono_matrix_III'] },
    stats_estimate: { dps: 1100, ehp: 55000, speed: 3, evasion: 45 },
    tips: 'Admiral III — Fleet Commander + Celestial Drive = nepobjediva flota.',
    tipsKey: 'blueprint.bp_special_allianceadmiral_iii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_allianceadmiral_iii.source',
  },

  // Black Hole (glass cannon flagship)
  {
    id: 'bp_special_glass',
    name: 'Flagship — Black Hole Striker',
    nameKey: 'blueprint.bp_special_glass.name',
    shipClass: 'special', role: 'glass_cannon', tier: 'endgame', icon: '🕳️',
    ship: 'special_BlackHole_I',
    loadout: { weapons: ['w_kinetic_annihilator_beam_III', 'w_heat_hellfire_beam_III'], shield: 'sh_phoenix_core_I', engine: 'eng_hyperdrive_II', modules: ['mod_annihilator_II', 'mod_chrono_matrix_II', 'mod_emp_burst_II'] },
    stats_estimate: { dps: 1100, ehp: 22000, speed: 3, evasion: 42 },
    tips: 'Black Hole daje +300% štete vs Light armor. EMP + execute = instant kill combo.',
    tipsKey: 'blueprint.bp_special_glass.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_glass.source',
  },
  {
    id: 'bp_special_blackhole_ii',
    name: 'Flagship — Black Hole II',
    nameKey: 'blueprint.bp_special_blackhole_ii.name',
    shipClass: 'special', role: 'glass_cannon', tier: 'endgame', icon: '🕳️',
    ship: 'special_BlackHole_II',
    loadout: { weapons: ['w_kinetic_annihilator_beam_II', 'w_heat_hellfire_beam_II'], shield: 'sh_phoenix_core_I', engine: 'eng_hyperdrive_II', modules: ['mod_annihilator_II', 'mod_chrono_matrix_II', 'mod_overload_II'] },
    stats_estimate: { dps: 1800, ehp: 28000, speed: 4, evasion: 48 },
    tips: 'Još jači Black Hole. Dvostruki annihilator beam + hyperdrive.',
    tipsKey: 'blueprint.bp_special_blackhole_ii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_blackhole_ii.source',
  },
  {
    id: 'bp_special_blackhole_iii',
    name: 'Flagship — Black Hole III',
    nameKey: 'blueprint.bp_special_blackhole_iii.name',
    shipClass: 'special', role: 'glass_cannon', tier: 'ultimate', icon: '🕳️',
    ship: 'special_BlackHole_III',
    loadout: { weapons: ['w_kinetic_annihilator_beam_III', 'w_heat_hellfire_beam_III', 'w_elite_squadron_II'], shield: 'sh_phoenix_core_III', engine: 'eng_hyperdrive_III', modules: ['mod_annihilator_III', 'mod_chrono_matrix_III', 'mod_overload_III'] },
    stats_estimate: { dps: 3200, ehp: 40000, speed: 5, evasion: 55 },
    tips: 'Apsolutni Black Hole. 3× elite oružje + hyperdrive III. Trenutna eliminacija.',
    tipsKey: 'blueprint.bp_special_blackhole_iii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_blackhole_iii.source',
  },

  // Conquistador (balanced flagship)
  {
    id: 'bp_special_conquistador_i',
    name: 'Flagship — Conqueror I',
    nameKey: 'blueprint.bp_special_conquistador_i.name',
    shipClass: 'special', role: 'balanced', tier: 'mid', icon: '⚔️',
    ship: 'special_Conquistador_I',
    loadout: { weapons: ['w_kinetic_gauss_cannon_I', 'w_heat_inferno_I'], shield: 'sh_iron_guard_I', engine: 'eng_sentinel_I', modules: ['mod_siege_core_I', 'mod_repair_nano_I'] },
    stats_estimate: { dps: 320, ehp: 11000, speed: 2, evasion: 18 },
    tips: 'Balansirani napadački flagship. Dobar DPS uz solidnu odbranu.',
    tipsKey: 'blueprint.bp_special_conquistador_i.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_conquistador_i.source',
  },
  {
    id: 'bp_special_conquistador_ii',
    name: 'Flagship — Conqueror II',
    nameKey: 'blueprint.bp_special_conquistador_ii.name',
    shipClass: 'special', role: 'balanced', tier: 'endgame', icon: '⚔️',
    ship: 'special_Conquistador_II',
    loadout: { weapons: ['w_kinetic_gauss_cannon_II', 'w_heat_inferno_II'], shield: 'sh_iron_guard_II', engine: 'eng_sentinel_II', modules: ['mod_siege_core_II', 'mod_repair_nano_II', 'mod_annihilator_I'] },
    stats_estimate: { dps: 580, ehp: 20000, speed: 2, evasion: 22 },
    tips: 'Conqueror II — više DPS-a, bolji oklop.',
    tipsKey: 'blueprint.bp_special_conquistador_ii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_conquistador_ii.source',
  },
  {
    id: 'bp_special_conquistador_iii',
    name: 'Flagship — Conqueror III',
    nameKey: 'blueprint.bp_special_conquistador_iii.name',
    shipClass: 'special', role: 'balanced', tier: 'ultimate', icon: '⚔️',
    ship: 'special_Conquistador_III',
    loadout: { weapons: ['w_kinetic_gauss_cannon_III', 'w_heat_inferno_III', 'w_kinetic_obliterator_beam_II'], shield: 'sh_divine_II', engine: 'eng_divine_I', modules: ['mod_siege_core_III', 'mod_annihilator_II', 'mod_fleet_commander_II'] },
    stats_estimate: { dps: 1100, ehp: 35000, speed: 3, evasion: 30 },
    tips: 'Conqueror III — božanska moć osvajanja.',
    tipsKey: 'blueprint.bp_special_conquistador_iii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_conquistador_iii.source',
  },

  // Grim Reaper (glass cannon flagship)
  {
    id: 'bp_special_grimreaper_i',
    name: 'Flagship — Reaper I',
    nameKey: 'blueprint.bp_special_grimreaper_i.name',
    shipClass: 'special', role: 'glass_cannon', tier: 'mid', icon: '💀',
    ship: 'special_GrimReaper_I',
    loadout: { weapons: ['w_heat_thermal_lance_I', 'w_kinetic_obliterator_I'], shield: 'sh_carbon_shell_I', engine: 'eng_berserker_I', modules: ['mod_overload_I', 'mod_crit_amp_I'] },
    stats_estimate: { dps: 450, ehp: 8500, speed: 3, evasion: 22 },
    tips: 'Reaper I — visoki DPS, niska odbrana. Ubij prije nego što pogineš.',
    tipsKey: 'blueprint.bp_special_grimreaper_i.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_grimreaper_i.source',
  },
  {
    id: 'bp_special_grimreaper_ii',
    name: 'Flagship — Reaper II',
    nameKey: 'blueprint.bp_special_grimreaper_ii.name',
    shipClass: 'special', role: 'glass_cannon', tier: 'endgame', icon: '💀',
    ship: 'special_GrimReaper_II',
    loadout: { weapons: ['w_heat_thermal_lance_II', 'w_kinetic_obliterator_II'], shield: 'sh_carbon_shell_II', engine: 'eng_berserker_II', modules: ['mod_overload_II', 'mod_crit_amp_II', 'mod_annihilator_I'] },
    stats_estimate: { dps: 820, ehp: 15000, speed: 4, evasion: 28 },
    tips: 'Reaper II — veći DPS, berserker double-strike.',
    tipsKey: 'blueprint.bp_special_grimreaper_ii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_grimreaper_ii.source',
  },
  {
    id: 'bp_special_grimreaper_iii',
    name: 'Flagship — Reaper III',
    nameKey: 'blueprint.bp_special_grimreaper_iii.name',
    shipClass: 'special', role: 'glass_cannon', tier: 'ultimate', icon: '💀',
    ship: 'special_GrimReaper_III',
    loadout: { weapons: ['w_heat_thermal_lance_III', 'w_kinetic_obliterator_III', 'w_heat_hellfire_beam_II'], shield: 'sh_divine_I', engine: 'eng_berserker_III', modules: ['mod_overload_III', 'mod_crit_amp_III', 'mod_annihilator_II'] },
    stats_estimate: { dps: 1600, ehp: 25000, speed: 5, evasion: 35 },
    tips: 'Reaper III — smrtonosni kosac sa divine štitom.',
    tipsKey: 'blueprint.bp_special_grimreaper_iii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_grimreaper_iii.source',
  },

  // Independence (balanced flagship)
  {
    id: 'bp_special_independence_i',
    name: 'Flagship — Liberty I',
    nameKey: 'blueprint.bp_special_independence_i.name',
    shipClass: 'special', role: 'balanced', tier: 'mid', icon: '🗽',
    ship: 'special_Independence_I',
    loadout: { weapons: ['w_kinetic_railgun_I', 'w_heat_scorch_I'], shield: 'sh_void_plate_I', engine: 'eng_endurance_I', modules: ['mod_fortress_core_I', 'mod_repair_nano_I'] },
    stats_estimate: { dps: 280, ehp: 12000, speed: 2, evasion: 20 },
    tips: 'Solidan flagship za mid-game. Izdržljiv i pouzdan.',
    tipsKey: 'blueprint.bp_special_independence_i.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_independence_i.source',
  },
  {
    id: 'bp_special_independence_ii',
    name: 'Flagship — Liberty II',
    nameKey: 'blueprint.bp_special_independence_ii.name',
    shipClass: 'special', role: 'balanced', tier: 'endgame', icon: '🗽',
    ship: 'special_Independence_II',
    loadout: { weapons: ['w_kinetic_railgun_II', 'w_heat_scorch_II'], shield: 'sh_void_plate_II', engine: 'eng_endurance_II', modules: ['mod_fortress_core_II', 'mod_repair_nano_II', 'mod_annihilator_I'] },
    stats_estimate: { dps: 520, ehp: 22000, speed: 2, evasion: 25 },
    tips: 'Unapređena Liberty. Bolji štit i regeneracija.',
    tipsKey: 'blueprint.bp_special_independence_ii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_independence_ii.source',
  },
  {
    id: 'bp_special_independence_iii',
    name: 'Flagship — Liberty III',
    nameKey: 'blueprint.bp_special_independence_iii.name',
    shipClass: 'special', role: 'balanced', tier: 'ultimate', icon: '🗽',
    ship: 'special_Independence_III',
    loadout: { weapons: ['w_kinetic_railgun_III', 'w_heat_scorch_III', 'w_kinetic_annihilator_beam_I'], shield: 'sh_divine_I', engine: 'eng_divine_I', modules: ['mod_fortress_core_III', 'mod_repair_nano_III', 'mod_annihilator_II'] },
    stats_estimate: { dps: 950, ehp: 38000, speed: 3, evasion: 35 },
    tips: 'Vrhunska Liberty. Divine oprema za maksimalnu izdržljivost.',
    tipsKey: 'blueprint.bp_special_independence_iii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_independence_iii.source',
  },

  // Intrepid Nexus (speed flagship)
  {
    id: 'bp_special_intrepidnexus_i',
    name: 'Flagship — Nexus I',
    nameKey: 'blueprint.bp_special_intrepidnexus_i.name',
    shipClass: 'special', role: 'speed', tier: 'mid', icon: '🌀',
    ship: 'special_IntrepidNexus_I',
    loadout: { weapons: ['w_magnetic_pulsar_I', 'w_kinetic_railgun_beam_I'], shield: 'sh_pulse_ward_I', engine: 'eng_tactical_I', modules: ['mod_chrono_matrix_I', 'mod_overload_I'] },
    stats_estimate: { dps: 260, ehp: 9000, speed: 3, evasion: 30 },
    tips: 'Brzi flagship. Visoka agilnost i evazija.',
    tipsKey: 'blueprint.bp_special_intrepidnexus_i.tips',
    source_req: 'Nightmare/Hell boss drop',
    sourceKey: 'blueprint.bp_special_intrepidnexus_i.source',
  },
  {
    id: 'bp_special_intrepidnexus_ii',
    name: 'Flagship — Nexus II',
    nameKey: 'blueprint.bp_special_intrepidnexus_ii.name',
    shipClass: 'special', role: 'speed', tier: 'endgame', icon: '🌀',
    ship: 'special_IntrepidNexus_II',
    loadout: { weapons: ['w_magnetic_pulsar_II', 'w_kinetic_railgun_beam_II'], shield: 'sh_pulse_ward_II', engine: 'eng_tactical_II', modules: ['mod_chrono_matrix_II', 'mod_overload_II', 'mod_crit_amp_II'] },
    stats_estimate: { dps: 480, ehp: 16000, speed: 4, evasion: 40 },
    tips: 'Nexus II — brži i smrtonosniji.',
    tipsKey: 'blueprint.bp_special_intrepidnexus_ii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_intrepidnexus_ii.source',
  },
  {
    id: 'bp_special_intrepidnexus_iii',
    name: 'Flagship — Nexus III',
    nameKey: 'blueprint.bp_special_intrepidnexus_iii.name',
    shipClass: 'special', role: 'speed', tier: 'ultimate', icon: '🌀',
    ship: 'special_IntrepidNexus_III',
    loadout: { weapons: ['w_magnetic_pulsar_III', 'w_kinetic_annihilator_beam_III', 'w_magnetic_disruptor_beam_III'], shield: 'sh_divine_I', engine: 'eng_celestial_I', modules: ['mod_chrono_matrix_III', 'mod_overload_III', 'mod_crit_amp_III'] },
    stats_estimate: { dps: 980, ehp: 28000, speed: 5, evasion: 55 },
    tips: 'Nexus III — celestijalna brzina + divine štit.',
    tipsKey: 'blueprint.bp_special_intrepidnexus_iii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_intrepidnexus_iii.source',
  },

  // Presidio of Glory (balanced flagship)
  {
    id: 'bp_special_ultimate',
    name: 'Flagship — Divine Warlord',
    nameKey: 'blueprint.bp_special_ultimate.name',
    shipClass: 'special', role: 'balanced', tier: 'ultimate', icon: '✨',
    ship: 'special_PresidioOfGlory_I',
    loadout: { weapons: ['w_elite_squadron_III', 'w_kinetic_annihilator_beam_III'], shield: 'sh_divine_I', engine: 'eng_divine_I', modules: ['mod_divine_core_I', 'mod_fleet_commander_III', 'mod_chrono_matrix_III'] },
    stats_estimate: { dps: 1500, ehp: 55000, speed: 3, evasion: 60 },
    tips: 'Ultimate build. Sve divine komponente. 50% blok + uvijek prvi + +50% DPS. Boss Event drop potreban.',
    tipsKey: 'blueprint.bp_special_ultimate.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_ultimate.source',
  },
  {
    id: 'bp_special_presidioofglory_ii',
    name: 'Flagship — Glory II',
    nameKey: 'blueprint.bp_special_presidioofglory_ii.name',
    shipClass: 'special', role: 'balanced', tier: 'endgame', icon: '✨',
    ship: 'special_PresidioOfGlory_II',
    loadout: { weapons: ['w_kinetic_mass_driver_II', 'w_heat_phoenix_beam_II'], shield: 'sh_omega_absorber_I', engine: 'eng_titan_II', modules: ['mod_titan_carrier_I', 'mod_fleet_commander_II', 'mod_annihilator_I'] },
    stats_estimate: { dps: 750, ehp: 35000, speed: 2, evasion: 20 },
    tips: 'Glory II — Titan pogon + Omega apsorber. Skoro neuništiv.',
    tipsKey: 'blueprint.bp_special_presidioofglory_ii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_presidioofglory_ii.source',
  },
  {
    id: 'bp_special_presidioofglory_iii',
    name: 'Flagship — Glory III',
    nameKey: 'blueprint.bp_special_presidioofglory_iii.name',
    shipClass: 'special', role: 'balanced', tier: 'ultimate', icon: '✨',
    ship: 'special_PresidioOfGlory_III',
    loadout: { weapons: ['w_kinetic_mass_driver_III', 'w_heat_phoenix_beam_III', 'w_elite_squadron_III'], shield: 'sh_divine_III', engine: 'eng_titan_III', modules: ['mod_titan_carrier_II', 'mod_fleet_commander_III', 'mod_annihilator_II'] },
    stats_estimate: { dps: 1500, ehp: 60000, speed: 3, evasion: 30 },
    tips: 'Glory III — Titan III + Divine III. Apsolutna dominacija.',
    tipsKey: 'blueprint.bp_special_presidioofglory_iii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_presidioofglory_iii.source',
  },

  // Warlord (glass cannon flagship)
  {
    id: 'bp_special_aggressivewarlord_i',
    name: 'Flagship — Warlord I',
    nameKey: 'blueprint.bp_special_aggressivewarlord_i.name',
    shipClass: 'special', role: 'glass_cannon', tier: 'mid', icon: '💢',
    ship: 'special_AggressiveWarlord_I',
    loadout: { weapons: ['w_kinetic_railgun_I', 'w_explosive_crusher_missile_I'], shield: 'sh_flux_buffer_I', engine: 'eng_berserker_I', modules: ['mod_overload_I', 'mod_emp_burst_I'] },
    stats_estimate: { dps: 400, ehp: 9500, speed: 3, evasion: 20 },
    tips: 'Warlord I — agresivni berserker stil. Eksplozivni udar.',
    tipsKey: 'blueprint.bp_special_aggressivewarlord_i.tips',
    source_req: 'Nightmare/Hell boss drop',
    sourceKey: 'blueprint.bp_special_aggressivewarlord_i.source',
  },
  {
    id: 'bp_special_aggressivewarlord_ii',
    name: 'Flagship — Warlord II',
    nameKey: 'blueprint.bp_special_aggressivewarlord_ii.name',
    shipClass: 'special', role: 'glass_cannon', tier: 'endgame', icon: '💢',
    ship: 'special_AggressiveWarlord_II',
    loadout: { weapons: ['w_kinetic_railgun_II', 'w_explosive_crusher_missile_II'], shield: 'sh_flux_buffer_II', engine: 'eng_berserker_II', modules: ['mod_overload_II', 'mod_emp_burst_II', 'mod_crit_amp_I'] },
    stats_estimate: { dps: 750, ehp: 17000, speed: 4, evasion: 25 },
    tips: 'Warlord II — jači berserker, više eksploziva.',
    tipsKey: 'blueprint.bp_special_aggressivewarlord_ii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_aggressivewarlord_ii.source',
  },
  {
    id: 'bp_special_aggressivewarlord_iii',
    name: 'Flagship — Warlord III',
    nameKey: 'blueprint.bp_special_aggressivewarlord_iii.name',
    shipClass: 'special', role: 'glass_cannon', tier: 'ultimate', icon: '💢',
    ship: 'special_AggressiveWarlord_III',
    loadout: { weapons: ['w_kinetic_railgun_III', 'w_explosive_apocalypse_missile_III', 'w_heat_hellfire_beam_III'], shield: 'sh_divine_I', engine: 'eng_berserker_III', modules: ['mod_overload_III', 'mod_emp_burst_III', 'mod_crit_amp_II'] },
    stats_estimate: { dps: 1600, ehp: 28000, speed: 5, evasion: 32 },
    tips: 'Warlord III — apokalipsa. Railgun + Hellfire + berserker.',
    tipsKey: 'blueprint.bp_special_aggressivewarlord_iii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_aggressivewarlord_iii.source',
  },

  // Quick Assault (speed flagship)
  {
    id: 'bp_special_quickassault_i',
    name: 'Flagship — Assault I',
    nameKey: 'blueprint.bp_special_quickassault_i.name',
    shipClass: 'special', role: 'speed', tier: 'mid', icon: '💨',
    ship: 'special_QuickAssault_I',
    loadout: { weapons: ['w_kinetic_shredder_I', 'w_magnetic_pulsar_beam_I'], shield: 'sh_pulse_ward_I', engine: 'eng_tactical_I', modules: ['mod_chrono_matrix_I', 'mod_siege_core_I'] },
    stats_estimate: { dps: 300, ehp: 8500, speed: 4, evasion: 35 },
    tips: 'Assault I — munjeviti napad. Prvi udarac je ključan.',
    tipsKey: 'blueprint.bp_special_quickassault_i.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_quickassault_i.source',
  },
  {
    id: 'bp_special_quickassault_ii',
    name: 'Flagship — Assault II',
    nameKey: 'blueprint.bp_special_quickassault_ii.name',
    shipClass: 'special', role: 'speed', tier: 'endgame', icon: '💨',
    ship: 'special_QuickAssault_II',
    loadout: { weapons: ['w_kinetic_shredder_II', 'w_magnetic_pulsar_beam_II'], shield: 'sh_pulse_ward_II', engine: 'eng_tactical_II', modules: ['mod_chrono_matrix_II', 'mod_siege_core_II', 'mod_overload_I'] },
    stats_estimate: { dps: 550, ehp: 15000, speed: 5, evasion: 45 },
    tips: 'Assault II — brži, jači, smrtonosniji.',
    tipsKey: 'blueprint.bp_special_quickassault_ii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_quickassault_ii.source',
  },
  {
    id: 'bp_special_quickassault_iii',
    name: 'Flagship — Assault III',
    nameKey: 'blueprint.bp_special_quickassault_iii.name',
    shipClass: 'special', role: 'speed', tier: 'ultimate', icon: '💨',
    ship: 'special_QuickAssault_III',
    loadout: { weapons: ['w_kinetic_shredder_III', 'w_magnetic_pulsar_beam_III', 'w_kinetic_annihilator_beam_II'], shield: 'sh_divine_I', engine: 'eng_celestial_II', modules: ['mod_chrono_matrix_III', 'mod_siege_core_III', 'mod_overload_II'] },
    stats_estimate: { dps: 1100, ehp: 26000, speed: 6, evasion: 55 },
    tips: 'Assault III — Celestial Drive + Divine štit. Nemoguće ga je pogoditi.',
    tipsKey: 'blueprint.bp_special_quickassault_iii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_quickassault_iii.source',
  },

  // Striking Sword (balanced flagship)
  {
    id: 'bp_special_strikingsword_i',
    name: 'Flagship — Sword I',
    nameKey: 'blueprint.bp_special_strikingsword_i.name',
    shipClass: 'special', role: 'balanced', tier: 'mid', icon: '⚡',
    ship: 'special_StrikingSword_I',
    loadout: { weapons: ['w_kinetic_gauss_cannon_I', 'w_heat_thermal_lance_I'], shield: 'sh_fortress_I', engine: 'eng_sentinel_I', modules: ['mod_annihilator_I', 'mod_repair_nano_I'] },
    stats_estimate: { dps: 350, ehp: 13000, speed: 2, evasion: 20 },
    tips: 'Sword I — oštrica i štit. Balans napada i odbrane.',
    tipsKey: 'blueprint.bp_special_strikingsword_i.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_strikingsword_i.source',
  },
  {
    id: 'bp_special_strikingsword_ii',
    name: 'Flagship — Sword II',
    nameKey: 'blueprint.bp_special_strikingsword_ii.name',
    shipClass: 'special', role: 'balanced', tier: 'endgame', icon: '⚡',
    ship: 'special_StrikingSword_II',
    loadout: { weapons: ['w_kinetic_gauss_cannon_II', 'w_heat_thermal_lance_II'], shield: 'sh_fortress_II', engine: 'eng_sentinel_II', modules: ['mod_annihilator_II', 'mod_repair_nano_II', 'mod_fortress_core_I'] },
    stats_estimate: { dps: 640, ehp: 24000, speed: 2, evasion: 25 },
    tips: 'Sword II — Fortress štit + Sentinel pogon.',
    tipsKey: 'blueprint.bp_special_strikingsword_ii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_strikingsword_ii.source',
  },
  {
    id: 'bp_special_strikingsword_iii',
    name: 'Flagship — Sword III',
    nameKey: 'blueprint.bp_special_strikingsword_iii.name',
    shipClass: 'special', role: 'balanced', tier: 'ultimate', icon: '⚡',
    ship: 'special_StrikingSword_III',
    loadout: { weapons: ['w_kinetic_gauss_cannon_III', 'w_heat_thermal_lance_III', 'w_heat_hellfire_beam_II'], shield: 'sh_divine_II', engine: 'eng_titan_II', modules: ['mod_annihilator_III', 'mod_fortress_core_III', 'mod_fleet_commander_II'] },
    stats_estimate: { dps: 1200, ehp: 42000, speed: 3, evasion: 32 },
    tips: 'Sword III — Titan + Divine. Savršen balans moći i izdržljivosti.',
    tipsKey: 'blueprint.bp_special_strikingsword_iii.tips',
    source_req: 'Hell boss drop',
    sourceKey: 'blueprint.bp_special_strikingsword_iii.source',
  },
];

// ── RARITY / TIER COLORS ──
const BLUEPRINT_RARITY = {
  C: { name: 'Common',    color: '#ffdd00', label: 'Obično'  },
  R: { name: 'Rare',      color: '#4488ff', label: 'Rijetko' },
  E: { name: 'Epic',      color: '#aa44ff', label: 'Epsko'   },
  L: { name: 'Legendary', color: '#ffaa00', label: 'Legenda' },
};

// ── HELPER FUNKCIJE ──

function getBlueprintById(id) {
  return BLUEPRINTS.find(b => b.id === id) || null;
}

function getBlueprintsByClass(shipClass) {
  return BLUEPRINTS.filter(b => b.shipClass === shipClass);
}

function getBlueprintsByRole(role) {
  return BLUEPRINTS.filter(b => b.role === role);
}

function getBlueprintsByTier(tier) {
  return BLUEPRINTS.filter(b => b.tier === tier);
}

function getStarterBlueprintsForClass(shipClass) {
  return BLUEPRINTS.filter(b => b.shipClass === shipClass && b.tier === 'starter');
}

function getEndgameBlueprintsForClass(shipClass) {
  return BLUEPRINTS.filter(b => b.shipClass === shipClass && (b.tier === 'endgame' || b.tier === 'ultimate'));
}

// Export
if (typeof module !== 'undefined') {
  module.exports = {
    BLUEPRINTS, BLUEPRINT_ROLES, BLUEPRINT_TIERS, BLUEPRINT_RARITY,
    getBlueprintById, getBlueprintsByClass,
    getBlueprintsByRole, getBlueprintsByTier,
    getStarterBlueprintsForClass, getEndgameBlueprintsForClass,
  };
}