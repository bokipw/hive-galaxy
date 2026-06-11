// ============================================================
// HIVE GALAXY — data/special.js
// Special moduli — po klasi broda koja ima special slot
// Fighter, Cruiser, Battleship, Carrier, Flagship
// ============================================================

const SPECIAL_MODULES = [

  // ════════════════════════════════════════════
  // FIGHTER — Samo Lovci
  // ════════════════════════════════════════════

  // ── Crit Amplifier (Rare) ──
  {
    id: 'mod_crit_amp_I',
    name: 'Crit Amplifier I',
    variant: 'I', rarity: 'R', icon: '💥',
    shipClass: 'fighter',
    effect: { type: 'crit_chance', bonus: 3, crit_dmg: 25, desc: '+3% krit šansa, +25% krit šteta' },
    cost: { metal: 2000, crystal: 1400, he3: 700 },
    source: 'Instanca 20',
    desc: 'Amplifikator kritičnog udara. Svaki krit boli više.',
  },
  {
    id: 'mod_crit_amp_II',
    name: 'Crit Amplifier II',
    variant: 'II', rarity: 'R', icon: '💥',
    shipClass: 'fighter',
    effect: { type: 'crit_chance', bonus: 5, crit_dmg: 40, desc: '+5% krit šansa, +40% krit šteta' },
    cost: { metal: 4500, crystal: 3000, he3: 1500 },
    source: 'Instanca 24',
    desc: 'Poboljšani amplifikator krita.',
  },
  {
    id: 'mod_crit_amp_III',
    name: 'Crit Amplifier III',
    variant: 'III', rarity: 'R', icon: '💥',
    shipClass: 'fighter',
    effect: { type: 'crit_chance', bonus: 8, crit_dmg: 60, desc: '+8% krit šansa, +60% krit šteta' },
    cost: { metal: 9000, crystal: 6000, he3: 3000 },
    source: 'Restricted 2',
    desc: 'Napredni amplifikator krita.',
  },

  // ── Weapon Overload (Epic) ──
  {
    id: 'mod_overload_I',
    name: 'Weapon Overload I',
    variant: 'I', rarity: 'E', icon: '🔥',
    shipClass: 'fighter',
    effect: { type: 'dps_pct', bonus: 20, cost_hp: 50, desc: '+20% DPS ali -50 HP po rundi' },
    cost: { metal: 6000, crystal: 4500, he3: 2800 },
    source: 'Restricted 3',
    desc: 'Weapon overload. Enorman DPS uz cijenu HP-a.',
  },
  {
    id: 'mod_overload_II',
    name: 'Weapon Overload II',
    variant: 'II', rarity: 'E', icon: '🔥',
    shipClass: 'fighter',
    effect: { type: 'dps_pct', bonus: 35, cost_hp: 80, desc: '+35% DPS ali -80 HP po rundi' },
    cost: { metal: 13000, crystal: 9500, he3: 6000 },
    source: 'Restricted 5',
    desc: 'Poboljšani weapon overload.',
  },
  {
    id: 'mod_overload_III',
    name: 'Weapon Overload III',
    variant: 'III', rarity: 'E', icon: '🔥',
    shipClass: 'fighter',
    effect: { type: 'dps_pct', bonus: 55, cost_hp: 120, desc: '+55% DPS ali -120 HP po rundi' },
    cost: { metal: 26000, crystal: 19000, he3: 12000 },
    source: 'Restricted 7',
    desc: 'Napredni weapon overload. Razoran ali opasan.',
  },

  // ── EMP Burst (Epic) ──
  {
    id: 'mod_emp_burst_I',
    name: 'EMP Burst I',
    variant: 'I', rarity: 'E', icon: '⚡',
    shipClass: 'fighter',
    effect: { type: 'emp', chance: 8, duration: 1, desc: '8% šansa: EMP — onesposobi neprijatelja 1 rundu' },
    cost: { metal: 6500, crystal: 5000, he3: 3000 },
    source: 'Restricted 4',
    desc: 'EMP burst modul. Šansa za totalni shutdown neprijatelja.',
  },
  {
    id: 'mod_emp_burst_II',
    name: 'EMP Burst II',
    variant: 'II', rarity: 'E', icon: '⚡',
    shipClass: 'fighter',
    effect: { type: 'emp', chance: 14, duration: 1, desc: '14% šansa: EMP — onesposobi neprijatelja 1 rundu' },
    cost: { metal: 14000, crystal: 10500, he3: 6500 },
    source: 'Restricted 6',
    desc: 'Poboljšani EMP burst modul.',
  },
  {
    id: 'mod_emp_burst_III',
    name: 'EMP Burst III',
    variant: 'III', rarity: 'E', icon: '⚡',
    shipClass: 'fighter',
    effect: { type: 'emp', chance: 22, duration: 2, desc: '22% šansa: EMP — onesposobi sve sisteme 2 runde' },
    cost: { metal: 28000, crystal: 21000, he3: 13000 },
    source: 'Restricted 8',
    desc: 'Napredni EMP burst modul.',
  },

  // ════════════════════════════════════════════
  // CRUISER — Samo Krstarice
  // ════════════════════════════════════════════

  // ── Armor Plating (Common) ──
  {
    id: 'mod_armor_plating_I',
    name: 'Armor Plating I',
    variant: 'I', rarity: 'C', icon: '🔩',
    shipClass: 'cruiser',
    effect: { type: 'armor_flat', bonus: 100, desc: '+100 oklop' },
    cost: { metal: 600, crystal: 200, he3: 100 },
    source: 'Instanca 18',
    desc: 'Dodatna oklop ploča. Povećava izdržljivost.',
  },
  {
    id: 'mod_armor_plating_II',
    name: 'Armor Plating II',
    variant: 'II', rarity: 'C', icon: '🔩',
    shipClass: 'cruiser',
    effect: { type: 'armor_flat', bonus: 220, desc: '+220 oklop' },
    cost: { metal: 1400, crystal: 450, he3: 220 },
    source: 'Instanca 9',
    desc: 'Poboljšana oklop ploča.',
  },
  {
    id: 'mod_armor_plating_III',
    name: 'Armor Plating III',
    variant: 'III', rarity: 'C', icon: '🔩',
    shipClass: 'cruiser',
    effect: { type: 'armor_flat', bonus: 400, desc: '+400 oklop' },
    cost: { metal: 2800, crystal: 900, he3: 440 },
    source: 'Instanca 15',
    desc: 'Napredna oklop ploča.',
  },

  // ── Structure Reinforce (Common) ──
  {
    id: 'mod_structure_reinf_I',
    name: 'Structure Reinforce I',
    variant: 'I', rarity: 'C', icon: '🏗️',
    shipClass: 'cruiser',
    effect: { type: 'structure_flat', bonus: 150, desc: '+150 struktura (HP)' },
    cost: { metal: 700, crystal: 250, he3: 120 },
    source: 'Instanca 21',
    desc: 'Strukturno pojačanje. Više HP-a.',
  },
  {
    id: 'mod_structure_reinf_II',
    name: 'Structure Reinforce II',
    variant: 'II', rarity: 'C', icon: '🏗️',
    shipClass: 'cruiser',
    effect: { type: 'structure_flat', bonus: 350, desc: '+350 struktura (HP)' },
    cost: { metal: 1600, crystal: 550, he3: 280 },
    source: 'Instanca 10',
    desc: 'Poboljšano strukturno pojačanje.',
  },
  {
    id: 'mod_structure_reinf_III',
    name: 'Structure Reinforce III',
    variant: 'III', rarity: 'C', icon: '🏗️',
    shipClass: 'cruiser',
    effect: { type: 'structure_flat', bonus: 650, desc: '+650 struktura (HP)' },
    cost: { metal: 3200, crystal: 1100, he3: 560 },
    source: 'Instanca 16',
    desc: 'Napredno strukturno pojačanje.',
  },

  // ── Shield Booster (Rare) ──
  {
    id: 'mod_shield_booster_I',
    name: 'Shield Booster I',
    variant: 'I', rarity: 'R', icon: '🔋',
    shipClass: 'cruiser',
    effect: { type: 'shield_pct', bonus: 15, desc: '+15% maksimalni shield kapacitet' },
    cost: { metal: 2200, crystal: 1600, he3: 800 },
    source: 'Instanca 21',
    desc: 'Shield booster modul. Povećava max shield.',
  },
  {
    id: 'mod_shield_booster_II',
    name: 'Shield Booster II',
    variant: 'II', rarity: 'R', icon: '🔋',
    shipClass: 'cruiser',
    effect: { type: 'shield_pct', bonus: 25, desc: '+25% maksimalni shield kapacitet' },
    cost: { metal: 5000, crystal: 3500, he3: 1800 },
    source: 'Instanca 25',
    desc: 'Poboljšani shield booster.',
  },
  {
    id: 'mod_shield_booster_III',
    name: 'Shield Booster III',
    variant: 'III', rarity: 'R', icon: '🔋',
    shipClass: 'cruiser',
    effect: { type: 'shield_pct', bonus: 40, desc: '+40% maksimalni shield kapacitet' },
    cost: { metal: 10000, crystal: 7000, he3: 3500 },
    source: 'Restricted 3',
    desc: 'Napredni shield booster.',
  },

  // ════════════════════════════════════════════
  // BATTLESHIP — Samo Bojni Brodovi
  // ════════════════════════════════════════════

  // ── Siege Core (Common) ──
  {
    id: 'mod_siege_core_I',
    name: 'Siege Core I',
    variant: 'I', rarity: 'C', icon: '🔱',
    shipClass: 'battleship',
    effect: { type: 'armor_pen', bonus: 15, desc: '+15% probijanje oklopa neprijatelja' },
    cost: { metal: 800, crystal: 400, he3: 200 },
    source: 'Instanca 24',
    desc: 'Siege core. Bojni brod ignoruje dio oklopa.',
  },
  {
    id: 'mod_siege_core_II',
    name: 'Siege Core II',
    variant: 'II', rarity: 'C', icon: '🔱',
    shipClass: 'battleship',
    effect: { type: 'armor_pen', bonus: 28, desc: '+28% probijanje oklopa neprijatelja' },
    cost: { metal: 1800, crystal: 900, he3: 450 },
    source: 'Restricted 10',
    desc: 'Poboljšani siege core.',
  },
  {
    id: 'mod_siege_core_III',
    name: 'Siege Core III',
    variant: 'III', rarity: 'C', icon: '🔱',
    shipClass: 'battleship',
    effect: { type: 'armor_pen', bonus: 45, desc: '+45% probijanje oklopa' },
    cost: { metal: 3600, crystal: 1800, he3: 900 },
    source: 'Trial 10',
    desc: 'Napredni siege core. Teški topovi probijaju sve.',
  },

  // ── Heavy Barrage (Rare) ──
  {
    id: 'mod_heavy_barrage_I',
    name: 'Heavy Barrage I',
    variant: 'I', rarity: 'R', icon: '💣',
    shipClass: 'battleship',
    effect: { type: 'double_fire', chance: 12, desc: '12% šansa da sva oružja ispale dva puta' },
    cost: { metal: 3000, crystal: 2000, he3: 1200 },
    source: 'Restricted 2',
    desc: 'Heavy barrage sistem. Preopterećuje oružja za salvu.',
  },
  {
    id: 'mod_heavy_barrage_II',
    name: 'Heavy Barrage II',
    variant: 'II', rarity: 'R', icon: '💣',
    shipClass: 'battleship',
    effect: { type: 'double_fire', chance: 22, desc: '22% šansa za duplu salvu' },
    cost: { metal: 6500, crystal: 4500, he3: 2800 },
    source: 'Restricted 4',
    desc: 'Poboljšani heavy barrage.',
  },
  {
    id: 'mod_heavy_barrage_III',
    name: 'Heavy Barrage III',
    variant: 'III', rarity: 'R', icon: '💣',
    shipClass: 'battleship',
    effect: { type: 'double_fire', chance: 35, crit_on_double: true, desc: '35% šansa dupla salva + garantovani krit na duplu paljbu' },
    cost: { metal: 13000, crystal: 9000, he3: 5500 },
    source: 'Restricted 6',
    desc: 'Napredni heavy barrage.',
  },

  // ── Iron Fortress (Epic) ──
  {
    id: 'mod_iron_fortress_I',
    name: 'Iron Fortress I',
    variant: 'I', rarity: 'E', icon: '🏯',
    shipClass: 'battleship',
    effect: { type: 'fortress', reduction: 12, reflect: 8, desc: '-12% primljene štete + 8% refleksija' },
    cost: { metal: 7000, crystal: 5500, he3: 3500 },
    source: 'Trial 2',
    desc: 'Iron fortress modul. Bojni brod postaje tvrđava.',
  },
  {
    id: 'mod_iron_fortress_II',
    name: 'Iron Fortress II',
    variant: 'II', rarity: 'E', icon: '🏯',
    shipClass: 'battleship',
    effect: { type: 'fortress', reduction: 20, reflect: 15, desc: '-20% primljene štete + 15% refleksija' },
    cost: { metal: 15000, crystal: 12000, he3: 7500 },
    source: 'Trial 5',
    desc: 'Poboljšani iron fortress.',
  },
  {
    id: 'mod_iron_fortress_III',
    name: 'Iron Fortress III',
    variant: 'III', rarity: 'E', icon: '🏯',
    shipClass: 'battleship',
    effect: { type: 'fortress', reduction: 30, reflect: 25, taunt: true, desc: '-30% primljene štete + 25% refleksija + privlači vatru' },
    cost: { metal: 30000, crystal: 23000, he3: 14000 },
    source: 'Trial 8',
    desc: 'Napredni iron fortress. Privlači vatru i vraća je.',
  },

  // ── Annihilator Core (Legendary) ──
  {
    id: 'mod_annihilator_I',
    name: 'Annihilator Core I',
    variant: 'I', rarity: 'L', icon: '💀',
    shipClass: 'battleship',
    effect: { type: 'execute', threshold: 10, desc: 'Automatski uništi neprijatelja ispod 10% HP-a' },
    cost: { metal: 20000, crystal: 15000, he3: 9000 },
    source: 'Trial 4',
    desc: 'Annihilator core. Izvršava slabe neprijatelje.',
  },
  {
    id: 'mod_annihilator_II',
    name: 'Annihilator Core II',
    variant: 'II', rarity: 'L', icon: '💀',
    shipClass: 'battleship',
    effect: { type: 'execute', threshold: 15, desc: 'Automatski uništi neprijatelja ispod 15% HP-a' },
    cost: { metal: 45000, crystal: 34000, he3: 20000 },
    source: 'Trial 7',
    desc: 'Poboljšani annihilator core.',
  },
  {
    id: 'mod_annihilator_III',
    name: 'Annihilator Core III',
    variant: 'III', rarity: 'L', icon: '💀',
    shipClass: 'battleship',
    effect: { type: 'execute', threshold: 20, desc: 'Automatski uništi neprijatelja ispod 20% HP-a' },
    cost: { metal: 90000, crystal: 68000, he3: 40000 },
    source: 'Trial 10',
    desc: 'Napredni annihilator core.',
  },

  // ── Fortress Core (Legendary) ──
  {
    id: 'mod_fortress_core_I',
    name: 'Fortress Core I',
    variant: 'I', rarity: 'L', icon: '🏰',
    shipClass: 'battleship',
    effect: { type: 'damage_reduction', bonus: 15, desc: '-15% primljene štete od svih izvora' },
    cost: { metal: 22000, crystal: 16000, he3: 10000 },
    source: 'Trial 5',
    desc: 'Fortress core. Globalna redukcija primljene štete.',
  },
  {
    id: 'mod_fortress_core_II',
    name: 'Fortress Core II',
    variant: 'II', rarity: 'L', icon: '🏰',
    shipClass: 'battleship',
    effect: { type: 'damage_reduction', bonus: 25, desc: '-25% primljene štete od svih izvora' },
    cost: { metal: 50000, crystal: 37000, he3: 22000 },
    source: 'Trial 8',
    desc: 'Poboljšani fortress core.',
  },
  {
    id: 'mod_fortress_core_III',
    name: 'Fortress Core III',
    variant: 'III', rarity: 'L', icon: '🏰',
    shipClass: 'battleship',
    effect: { type: 'damage_reduction', bonus: 35, desc: '-35% primljene štete od svih izvora' },
    cost: { metal: 100000, crystal: 75000, he3: 45000 },
    source: 'Trial 10',
    desc: 'Napredni fortress core. Vrhunska pasivna odbrana.',
  },

  // ── Chrono Matrix (Legendary) ──
  {
    id: 'mod_chrono_matrix_I',
    name: 'Chrono Matrix I',
    variant: 'I', rarity: 'L', icon: '⏱️',
    shipClass: 'battleship',
    effect: { type: 'cooldown_reduce', bonus: 1, desc: '-1 cooldown svim oružjima (min 0)' },
    cost: { metal: 25000, crystal: 19000, he3: 12000 },
    source: 'Trial 6',
    desc: 'Chrono matrix. Smanjuje cooldown oružja za 1 rundu.',
  },
  {
    id: 'mod_chrono_matrix_II',
    name: 'Chrono Matrix II',
    variant: 'II', rarity: 'L', icon: '⏱️',
    shipClass: 'battleship',
    effect: { type: 'cooldown_reduce', bonus: 2, desc: '-2 cooldown svim oružjima (min 0)' },
    cost: { metal: 55000, crystal: 42000, he3: 26000 },
    source: 'Trial 8',
    desc: 'Poboljšani chrono matrix.',
  },
  {
    id: 'mod_chrono_matrix_III',
    name: 'Chrono Matrix III',
    variant: 'III', rarity: 'L', icon: '⏱️',
    shipClass: 'battleship',
    effect: { type: 'cooldown_reduce', bonus: 3, desc: '-3 cooldown svim oružjima. Ballistic puca 2x.' },
    cost: { metal: 110000, crystal: 85000, he3: 52000 },
    source: 'Trial 10',
    desc: 'Napredni chrono matrix. Ballistic oružja pucaju dvaput.',
  },

  // ── Dreadnought Protocol (Legendary) ──
  {
    id: 'mod_dreadnought_I',
    name: 'Dreadnought Protocol I',
    variant: 'I', rarity: 'L', icon: '☠️',
    shipClass: 'battleship',
    effect: { type: 'dreadnought', atk: 20, reduction: 10, execute: 10, desc: '+20% šteta + -10% primljeno + 10% execute' },
    cost: { metal: 25000, crystal: 18000, he3: 11000 },
    source: 'Constellation 1',
    desc: 'Dreadnought protocol. Nezaustavljiva sila.',
  },
  {
    id: 'mod_dreadnought_II',
    name: 'Dreadnought Protocol II',
    variant: 'II', rarity: 'L', icon: '☠️',
    shipClass: 'battleship',
    effect: { type: 'dreadnought', atk: 35, reduction: 18, execute: 15, desc: '+35% šteta + -18% primljeno + 15% execute' },
    cost: { metal: 55000, crystal: 42000, he3: 25000 },
    source: 'Constellation 2',
    desc: 'Poboljšani dreadnought protocol.',
  },
  {
    id: 'mod_dreadnought_III',
    name: 'Dreadnought Protocol III',
    variant: 'III', rarity: 'L', icon: '☠️',
    shipClass: 'battleship',
    effect: { type: 'dreadnought', atk: 50, reduction: 25, execute: 20, emp_immune: true, desc: '+50% šteta + -25% primljeno + 20% execute + imun na EMP' },
    cost: { metal: 110000, crystal: 85000, he3: 50000 },
    source: 'Constellation 3',
    desc: 'Napredni dreadnought protocol. Nema ništa jače.',
  },

  // ════════════════════════════════════════════
  // CARRIER — Samo Nosači
  // ════════════════════════════════════════════

  // ── Fighter Bay (Common) ──
  {
    id: 'mod_fighter_bay_I',
    name: 'Fighter Bay I',
    variant: 'I', rarity: 'C', icon: '✈️',
    shipClass: 'carrier',
    effect: { type: 'launch_fighters', squadrons: 1, desc: 'Na početku borbe lansira 1 eskadronu (5 lovaca)' },
    cost: { metal: 700, crystal: 500, he3: 250 },
    source: 'Instanca 12',
    desc: 'Fighter bay modul. Nosač lansira lovačku eskadronu.',
  },
  {
    id: 'mod_fighter_bay_II',
    name: 'Fighter Bay II',
    variant: 'II', rarity: 'C', icon: '✈️',
    shipClass: 'carrier',
    effect: { type: 'launch_fighters', squadrons: 2, desc: 'Lansira 2 eskadrone (10 lovaca)' },
    cost: { metal: 1600, crystal: 1100, he3: 560 },
    source: 'Pirate 10',
    desc: 'Poboljšani fighter bay.',
  },
  {
    id: 'mod_fighter_bay_III',
    name: 'Fighter Bay III',
    variant: 'III', rarity: 'C', icon: '✈️',
    shipClass: 'carrier',
    effect: { type: 'launch_fighters', squadrons: 3, fighter_hp_bonus: 20, desc: 'Lansira 3 eskadrone + lovci imaju +20% HP' },
    cost: { metal: 3200, crystal: 2200, he3: 1100 },
    source: 'Constellation 3',
    desc: 'Napredni fighter bay. Tri pune eskadrone.',
  },

  // ── Nano Repair (Rare) ──
  {
    id: 'mod_repair_nano_I',
    name: 'Nano Repair I',
    variant: 'I', rarity: 'R', icon: '🩺',
    shipClass: 'carrier',
    effect: { type: 'hp_regen', per_round: 30, desc: '+30 HP oporavak po rundi borbe' },
    cost: { metal: 2400, crystal: 1700, he3: 850 },
    source: 'Instanca 23',
    desc: 'Nano repair modul. Pasivni HP regen tokom borbe.',
  },
  {
    id: 'mod_repair_nano_II',
    name: 'Nano Repair II',
    variant: 'II', rarity: 'R', icon: '🩺',
    shipClass: 'carrier',
    effect: { type: 'hp_regen', per_round: 65, desc: '+65 HP oporavak po rundi borbe' },
    cost: { metal: 5500, crystal: 3800, he3: 1900 },
    source: 'Instanca 27',
    desc: 'Poboljšani nano repair modul.',
  },
  {
    id: 'mod_repair_nano_III',
    name: 'Nano Repair III',
    variant: 'III', rarity: 'R', icon: '🩺',
    shipClass: 'carrier',
    effect: { type: 'hp_regen', per_round: 120, desc: '+120 HP oporavak po rundi borbe' },
    cost: { metal: 11000, crystal: 7500, he3: 3800 },
    source: 'Restricted 5',
    desc: 'Napredni nano repair modul.',
  },

  // ── Drone Swarm (Rare) ──
  {
    id: 'mod_drone_swarm_I',
    name: 'Drone Swarm I',
    variant: 'I', rarity: 'R', icon: '🐝',
    shipClass: 'carrier',
    effect: { type: 'dot_swarm', chance: 15, dmg_pct: 5, rounds: 3, desc: '15% šansa: rojevi dronova -5% HP/rundi tokom 3 runde' },
    cost: { metal: 2800, crystal: 2200, he3: 1400 },
    source: 'Restricted 3',
    desc: 'Drone swarm modul. Mini dronovi grizu neprijatelja.',
  },
  {
    id: 'mod_drone_swarm_II',
    name: 'Drone Swarm II',
    variant: 'II', rarity: 'R', icon: '🐝',
    shipClass: 'carrier',
    effect: { type: 'dot_swarm', chance: 25, dmg_pct: 8, rounds: 3, desc: '25% šansa: -8% HP/rundi tokom 3 runde' },
    cost: { metal: 6000, crystal: 4800, he3: 3000 },
    source: 'Restricted 5',
    desc: 'Poboljšani drone swarm.',
  },
  {
    id: 'mod_drone_swarm_III',
    name: 'Drone Swarm III',
    variant: 'III', rarity: 'R', icon: '🐝',
    shipClass: 'carrier',
    effect: { type: 'dot_swarm', chance: 38, dmg_pct: 12, rounds: 4, slow: true, desc: '38% šansa: -12% HP/rundi tokom 4 runde + usporava neprijatelja' },
    cost: { metal: 12000, crystal: 9500, he3: 6000 },
    source: 'Restricted 7',
    desc: 'Napredni drone swarm. Zagušuje i usporava.',
  },

  // ── Warp Jammer (Epic) ──
  {
    id: 'mod_warp_jammer_I',
    name: 'Warp Jammer I',
    variant: 'I', rarity: 'E', icon: '🔌',
    shipClass: 'carrier',
    effect: { type: 'warp_block', chance: 15, desc: '15% šansa blokiranja bijega neprijatelja' },
    cost: { metal: 5000, crystal: 4000, he3: 2500 },
    source: 'Restricted 4',
    desc: 'Warp jammer. Sprječava bijeg neprijatelja.',
  },
  {
    id: 'mod_warp_jammer_II',
    name: 'Warp Jammer II',
    variant: 'II', rarity: 'E', icon: '🔌',
    shipClass: 'carrier',
    effect: { type: 'warp_block', chance: 30, desc: '30% šansa blokiranja bijega neprijatelja' },
    cost: { metal: 11000, crystal: 8500, he3: 5500 },
    source: 'Restricted 6',
    desc: 'Poboljšani warp jammer.',
  },
  {
    id: 'mod_warp_jammer_III',
    name: 'Warp Jammer III',
    variant: 'III', rarity: 'E', icon: '🔌',
    shipClass: 'carrier',
    effect: { type: 'warp_block', chance: 50, desc: '50% šansa blokiranja bijega neprijatelja' },
    cost: { metal: 22000, crystal: 17000, he3: 11000 },
    source: 'Restricted 8',
    desc: 'Napredni warp jammer.',
  },

  // ── Fleet Beacon (Epic) ──
  {
    id: 'mod_fleet_beacon_I',
    name: 'Fleet Beacon I',
    variant: 'I', rarity: 'E', icon: '📡',
    shipClass: 'carrier',
    effect: { type: 'fleet_regen', regen_pct: 10, desc: 'Svi saveznici regenerišu +10% HP/rundi' },
    cost: { metal: 8000, crystal: 6500, he3: 4000 },
    source: 'Trial 3',
    desc: 'Fleet beacon. Oporavlja cijelu flotu svaku rundu.',
  },
  {
    id: 'mod_fleet_beacon_II',
    name: 'Fleet Beacon II',
    variant: 'II', rarity: 'E', icon: '📡',
    shipClass: 'carrier',
    effect: { type: 'fleet_regen', regen_pct: 18, desc: 'Svi saveznici regenerišu +18% HP/rundi' },
    cost: { metal: 17000, crystal: 13500, he3: 8500 },
    source: 'Trial 6',
    desc: 'Poboljšani fleet beacon.',
  },
  {
    id: 'mod_fleet_beacon_III',
    name: 'Fleet Beacon III',
    variant: 'III', rarity: 'E', icon: '📡',
    shipClass: 'carrier',
    effect: { type: 'fleet_regen', regen_pct: 28, shield_bonus: 15, desc: '+28% HP regen/rundi + +15% shield cijeloj floti' },
    cost: { metal: 34000, crystal: 27000, he3: 17000 },
    source: 'Trial 9',
    desc: 'Napredni fleet beacon. Oporavlja i štiti cijelu flotu.',
  },

  // ── Titan Carrier (Legendary) ──
  {
    id: 'mod_titan_carrier_I',
    name: 'Titan Carrier I',
    variant: 'I', rarity: 'L', icon: '🌌',
    shipClass: 'carrier',
    effect: { type: 'titan', fleet_hp: 15, squadrons: 2, fleet_shield: 10, desc: '+15% HP flote + 2 eskadrone + +10% shield floti' },
    cost: { metal: 28000, crystal: 22000, he3: 13000 },
    source: 'Constellation 1',
    desc: 'Titan carrier protokol. Nosač postaje srce flote.',
  },
  {
    id: 'mod_titan_carrier_II',
    name: 'Titan Carrier II',
    variant: 'II', rarity: 'L', icon: '🌌',
    shipClass: 'carrier',
    effect: { type: 'titan', fleet_hp: 25, squadrons: 3, fleet_shield: 20, desc: '+25% HP flote + 3 eskadrone + +20% shield floti' },
    cost: { metal: 60000, crystal: 48000, he3: 29000 },
    source: 'Constellation 2',
    desc: 'Poboljšani titan carrier.',
  },
  {
    id: 'mod_titan_carrier_III',
    name: 'Titan Carrier III',
    variant: 'III', rarity: 'L', icon: '🌌',
    shipClass: 'carrier',
    effect: { type: 'titan', fleet_hp: 40, squadrons: 5, fleet_shield: 30, regen_pct: 5, desc: '+40% HP flote + 5 eskadron + +30% shield + regen 5%/rundi' },
    cost: { metal: 120000, crystal: 95000, he3: 58000 },
    source: 'Constellation 3',
    desc: 'Napredni titan carrier. Nepobjedivi nosač.',
  },

  // ════════════════════════════════════════════
  // FLAGSHIP — Samo Flagship
  // ════════════════════════════════════════════

  // ── Fleet Commander (Legendary) ──
  {
    id: 'mod_fleet_commander_I',
    name: 'Fleet Commander I',
    variant: 'I', rarity: 'L', icon: '👑',
    shipClass: 'special',
    effect: { type: 'fleet_atk_def', atk: 10, def: 10, desc: '+10% napad i +10% odbrana svim brodovima u floti' },
    cost: { metal: 30000, crystal: 22000, he3: 14000 },
    source: 'Constellation 1',
    desc: 'Fleet commander modul. Fleet aura. Samo Flagship.',
  },
  {
    id: 'mod_fleet_commander_II',
    name: 'Fleet Commander II',
    variant: 'II', rarity: 'L', icon: '👑',
    shipClass: 'special',
    effect: { type: 'fleet_atk_def', atk: 18, def: 18, desc: '+18% napad i +18% odbrana svim brodovima u floti' },
    cost: { metal: 65000, crystal: 50000, he3: 31000 },
    source: 'Constellation 2',
    desc: 'Poboljšani fleet commander modul.',
  },
  {
    id: 'mod_fleet_commander_III',
    name: 'Fleet Commander III',
    variant: 'III', rarity: 'L', icon: '👑',
    shipClass: 'special',
    effect: { type: 'fleet_atk_def', atk: 28, def: 28, desc: '+28% napad i +28% odbrana svim brodovima u floti' },
    cost: { metal: 130000, crystal: 100000, he3: 62000 },
    source: 'Constellation 3',
    desc: 'Napredni fleet commander. Samo Flagship.',
  },

  // ── Cargo Expansion (Common) ──
  {
    id: 'mod_cargo_I',
    name: 'Cargo Expansion I',
    variant: 'I', rarity: 'C', icon: '📦',
    shipClass: 'special',
    effect: { type: 'cargo', bonus: 500, desc: '+500 kapacitet plijena' },
    cost: { metal: 400, crystal: 150, he3: 80 },
    source: 'Instanca 27',
    desc: 'Proširenje skladišta. Više plijena po misiji.',
  },
  {
    id: 'mod_cargo_II',
    name: 'Cargo Expansion II',
    variant: 'II', rarity: 'C', icon: '📦',
    shipClass: 'special',
    effect: { type: 'cargo', bonus: 1200, desc: '+1200 kapacitet plijena' },
    cost: { metal: 900, crystal: 350, he3: 180 },
    source: 'Instanca 7',
    desc: 'Poboljšano proširenje skladišta.',
  },
  {
    id: 'mod_cargo_III',
    name: 'Cargo Expansion III',
    variant: 'III', rarity: 'C', icon: '📦',
    shipClass: 'special',
    effect: { type: 'cargo', bonus: 2500, desc: '+2500 kapacitet plijena' },
    cost: { metal: 1800, crystal: 700, he3: 360 },
    source: 'Instanca 13',
    desc: 'Napredni cargo modul. Maksimizira dobit po misiji.',
  },

  // ── Divine Core (Legendary, drop only) ──
  {
    id: 'mod_divine_core_I',
    name: 'Divine Core I',
    variant: 'I', rarity: 'L', icon: '✨',
    shipClass: 'special',
    effect: { type: 'divine', dps_pct: 50, crit_chance: 20, execute: 5, desc: '+50% DPS, +20% krit šansa, 5% execute ispod 20% HP' },
    cost: { metal: 0, crystal: 0, he3: 0 },
    source: 'Boss Event (drop only)',
    desc: 'Božanski modul. Kombinacija najboljeg napada. Max 1 po igraču.',
    max_per_player: 1,
    drop_only: true,
  },
];

// ── HELPER FUNKCIJE ──
function getSpecialById(id) {
  return SPECIAL_MODULES.find(m => m.id === id) || null;
}

function getSpecialByClass(shipClass) {
  return SPECIAL_MODULES.filter(m => m.shipClass === shipClass);
}

function getSpecialByRarity(rarity) {
  return SPECIAL_MODULES.filter(m => m.rarity === rarity);
}

// Export
if (typeof module !== 'undefined') {
  module.exports = { SPECIAL_MODULES };
}
