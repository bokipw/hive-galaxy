// ============================================================
// HIVE GALAXY — data/engines.js
// 90 motora — Svi motori s punim statistikama
// C:24 | R:24+6(he3/stealth) | E:24 | L:18 (15 + 3 Divine)
//
// SPEED SKALA: 1-10 (za taktički grid sistem)
//   Common   I/II/III  → speed 1 / 2 / 3
//   Rare     I/II/III  → speed 3 / 5 / 6
//   Epic     I/II/III  → speed 5 / 7 / 8
//   Legendary I/II/III → speed 7 / 9 / 10
//   Divine             → speed 10
//
// HE3_COST po misiji (po brodu koji ima taj motor):
//   Common   I/II/III  → 0.001 / 0.002 / 0.003
//   Rare     I/II/III  → 0.004 / 0.006 / 0.008
//   Epic     I/II/III  → 0.010 / 0.014 / 0.018
//   Legendary I/II/III → 0.020 / 0.030 / 0.050
//   Divine             → 0.060 (ali he3_save bonus od special)
//
// He3 Saver motori: isti speed kao Rare ali he3_cost smanjen za bonus%
// ============================================================

const ENGINES = [

  // ════════════════════════════════════════════════════════════
  // COMMON MOTORI (24) — 8 tipova × 3 nivoa
  // speed: 1/2/3 | he3_cost: 0.001/0.002/0.003
  // ════════════════════════════════════════════════════════════

  // 1. Basic Drive
  { id:'eng_basic_I',   name:'Basic Drive I',   variant:'I',   rarity:'C', icon:'🔩', speed:1, he3_cost:0.001, agility_bonus:0,  evasion_bonus:0,  special:null, cost:{metal:400,  crystal:200,  he3:150 }, source:'Instanca 5',  desc:'Standardni pogon za početnike.',      who:'Svi brodovi' },
  { id:'eng_basic_II',  name:'Basic Drive II',  variant:'II',  rarity:'C', icon:'🔩', speed:2, he3_cost:0.002, agility_bonus:2,  evasion_bonus:1,  special:null, cost:{metal:750,  crystal:380,  he3:280 }, source:'Instanca 10',  desc:'Poboljšani standardni pogon.',        who:'Svi brodovi' },
  { id:'eng_basic_III', name:'Basic Drive III', variant:'III', rarity:'C', icon:'🔩', speed:3, he3_cost:0.003, agility_bonus:4,  evasion_bonus:2,  special:null, cost:{metal:1200, crystal:600,  he3:450 }, source:'Instanca 15', desc:'Napredni standardni pogon.',           who:'Svi brodovi' },

  // 2. Tactical Drive
  { id:'eng_tactical_I',   name:'Tactical Drive I',   variant:'I',   rarity:'C', icon:'⚙️', speed:1, he3_cost:0.001, agility_bonus:5,  evasion_bonus:4,  special:null, cost:{metal:600,  crystal:320,  he3:230 }, source:'Instanca 20',  desc:'Taktički pogon. Naglasak na manevrabilnosti.',  who:'Svi brodovi' },
  { id:'eng_tactical_II',  name:'Tactical Drive II',  variant:'II',  rarity:'C', icon:'⚙️', speed:2, he3_cost:0.002, agility_bonus:9,  evasion_bonus:7,  special:null, cost:{metal:1150, crystal:600,  he3:440 }, source:'Instanca 25',  desc:'Poboljšani taktički pogon.',                    who:'Svi brodovi' },
  { id:'eng_tactical_III', name:'Tactical Drive III', variant:'III', rarity:'C', icon:'⚙️', speed:3, he3_cost:0.003, agility_bonus:13, evasion_bonus:10, special:null, cost:{metal:1840, crystal:960,  he3:700 }, source:'Instanca 30', desc:'Napredni taktički pogon. Idealan za Lovce.',    who:'Svi brodovi' },

  // 3. Scout Drive
  { id:'eng_scout_I',   name:'Scout Drive I',   variant:'I',   rarity:'C', icon:'🏃', speed:1, he3_cost:0.001, agility_bonus:8,  evasion_bonus:6,  special:null, cost:{metal:700,  crystal:380,  he3:270 }, source:'Restricted 1',  desc:'Izviđački pogon. Fokus na brzom izbjegavanju.',  who:'Svi brodovi' },
  { id:'eng_scout_II',  name:'Scout Drive II',  variant:'II',  rarity:'C', icon:'🏃', speed:2, he3_cost:0.002, agility_bonus:14, evasion_bonus:11, special:null, cost:{metal:1330, crystal:720,  he3:510 }, source:'Restricted 2',  desc:'Poboljšani izviđački pogon.',                    who:'Svi brodovi' },
  { id:'eng_scout_III', name:'Scout Drive III', variant:'III', rarity:'C', icon:'🏃', speed:3, he3_cost:0.003, agility_bonus:20, evasion_bonus:16, special:null, cost:{metal:2130, crystal:1150, he3:810 }, source:'Restricted 3', desc:'Napredni izviđački pogon.',                       who:'Svi brodovi' },

  // 4. Nano Drive
  { id:'eng_nano_I',   name:'Nano Drive I',   variant:'I',   rarity:'C', icon:'🔬', speed:1, he3_cost:0.001, agility_bonus:3,  evasion_bonus:2,  special:null, cost:{metal:550,  crystal:290,  he3:210 }, source:'Restricted 4',  desc:'Nano-molekularni pogon. Balansiran pristup.',  who:'Svi brodovi' },
  { id:'eng_nano_II',  name:'Nano Drive II',  variant:'II',  rarity:'C', icon:'🔬', speed:2, he3_cost:0.002, agility_bonus:6,  evasion_bonus:4,  special:null, cost:{metal:1050, crystal:560,  he3:400 }, source:'Restricted 5',  desc:'Poboljšani nano pogon.',                       who:'Svi brodovi' },
  { id:'eng_nano_III', name:'Nano Drive III', variant:'III', rarity:'C', icon:'🔬', speed:3, he3_cost:0.003, agility_bonus:9,  evasion_bonus:7,  special:null, cost:{metal:1680, crystal:890,  he3:640 }, source:'Restricted 6', desc:'Napredni nano pogon.',                          who:'Svi brodovi' },

  // 5. Pulse Drive — HP regen
  { id:'eng_pulse_I',   name:'Pulse Drive I',   variant:'I',   rarity:'C', icon:'💓', speed:1, he3_cost:0.001, agility_bonus:1, evasion_bonus:0, special:{type:'hp_regen', amount:15, desc:'Obnavlja 15 HP svake runde'}, cost:{metal:650,  crystal:360,  he3:260 }, source:'Restricted 7',  desc:'Impulsni pogon. Regenerira HP svake runde.',  who:'Svi brodovi' },
  { id:'eng_pulse_II',  name:'Pulse Drive II',  variant:'II',  rarity:'C', icon:'💓', speed:2, he3_cost:0.002, agility_bonus:2, evasion_bonus:1, special:{type:'hp_regen', amount:28, desc:'Obnavlja 28 HP svake runde'}, cost:{metal:1240, crystal:680,  he3:490 }, source:'Restricted 8',  desc:'Poboljšani impulsni pogon.',                  who:'Svi brodovi' },
  { id:'eng_pulse_III', name:'Pulse Drive III', variant:'III', rarity:'C', icon:'💓', speed:3, he3_cost:0.003, agility_bonus:3, evasion_bonus:2, special:{type:'hp_regen', amount:45, desc:'Obnavlja 45 HP svake runde'}, cost:{metal:1980, crystal:1080, he3:780 }, source:'Restricted 9', desc:'Napredni impulsni pogon. Stalan HP regen.',    who:'Svi brodovi' },

  // 6. Endurance Drive — jači HP regen
  { id:'eng_endurance_I',   name:'Endurance Drive I',   variant:'I',   rarity:'C', icon:'❤️', speed:1, he3_cost:0.001, agility_bonus:1, evasion_bonus:1, special:{type:'hp_regen', amount:25, desc:'Obnavlja 25 HP svake runde'}, cost:{metal:800,  crystal:440,  he3:320 }, source:'Restricted 10',  desc:'Izdržljivostni pogon. Brži oporavak HP-a.',   who:'Svi brodovi' },
  { id:'eng_endurance_II',  name:'Endurance Drive II',  variant:'II',  rarity:'C', icon:'❤️', speed:2, he3_cost:0.002, agility_bonus:2, evasion_bonus:2, special:{type:'hp_regen', amount:45, desc:'Obnavlja 45 HP svake runde'}, cost:{metal:1530, crystal:840,  he3:610 }, source:'Constellation 1', desc:'Poboljšani izdržljivostni pogon.',             who:'Svi brodovi' },
  { id:'eng_endurance_III', name:'Endurance Drive III', variant:'III', rarity:'C', icon:'❤️', speed:3, he3_cost:0.003, agility_bonus:3, evasion_bonus:3, special:{type:'hp_regen', amount:72, desc:'Obnavlja 72 HP svake runde'}, cost:{metal:2450, crystal:1340, he3:970 }, source:'Constellation 2', desc:'Napredni izdržljivostni pogon.',               who:'Svi brodovi' },

  // 7. Heavy Drive — armor boost
  { id:'eng_heavy_I',   name:'Heavy Drive I',   variant:'I',   rarity:'C', icon:'🔧', speed:1, he3_cost:0.001, agility_bonus:0, evasion_bonus:0, special:{type:'armor_boost', bonus:8,  desc:'-8% primljene štete' }, cost:{metal:750,  crystal:330,  he3:260 }, source:'Constellation 3',  desc:'Teški pogon. Smanjuje primljenu štetu.',  who:'Svi brodovi' },
  { id:'eng_heavy_II',  name:'Heavy Drive II',  variant:'II',  rarity:'C', icon:'🔧', speed:2, he3_cost:0.002, agility_bonus:0, evasion_bonus:0, special:{type:'armor_boost', bonus:14, desc:'-14% primljene štete'}, cost:{metal:1430, crystal:630,  he3:490 }, source:'Pirate 2', desc:'Poboljšani teški pogon.',                  who:'Svi brodovi' },
  { id:'eng_heavy_III', name:'Heavy Drive III', variant:'III', rarity:'C', icon:'🔧', speed:3, he3_cost:0.003, agility_bonus:0, evasion_bonus:0, special:{type:'armor_boost', bonus:20, desc:'-20% primljene štete'}, cost:{metal:2290, crystal:1010, he3:780 }, source:'Pirate 4', desc:'Napredni teški pogon.',                    who:'Svi brodovi' },

  // 8. Stabilizer Drive — visoki armor boost
  { id:'eng_stabilizer_I',   name:'Stabilizer Drive I',   variant:'I',   rarity:'C', icon:'🛡️', speed:1, he3_cost:0.001, agility_bonus:0, evasion_bonus:1, special:{type:'armor_boost', bonus:12, desc:'-12% primljene štete'}, cost:{metal:900,  crystal:400,  he3:310 }, source:'Pirate 6',  desc:'Stabilizatorski pogon. Pojačava oklop.',  who:'Svi brodovi' },
  { id:'eng_stabilizer_II',  name:'Stabilizer Drive II',  variant:'II',  rarity:'C', icon:'🛡️', speed:2, he3_cost:0.002, agility_bonus:1, evasion_bonus:2, special:{type:'armor_boost', bonus:18, desc:'-18% primljene štete'}, cost:{metal:1710, crystal:760,  he3:590 }, source:'Pirate 8', desc:'Poboljšani stabilizatorski pogon.',        who:'Svi brodovi' },
  { id:'eng_stabilizer_III', name:'Stabilizer Drive III', variant:'III', rarity:'C', icon:'🛡️', speed:3, he3_cost:0.003, agility_bonus:2, evasion_bonus:3, special:{type:'armor_boost', bonus:25, desc:'-25% primljene štete'}, cost:{metal:2740, crystal:1210, he3:940 }, source:'Pirate 10', desc:'Napredni stabilizatorski pogon.',          who:'Svi brodovi' },


  // ════════════════════════════════════════════════════════════
  // RARE MOTORI (30) — 10 tipova × 3 nivoa
  // speed: 3/5/6 | he3_cost: 0.004/0.006/0.008
  // He3 Saver: speed 3/5/6 ali cost smanjen za 25/35/45%
  // ════════════════════════════════════════════════════════════

  // 1. Sprint Drive — first_strike
  { id:'eng_sprint_I',   name:'Sprint Drive I',   variant:'I',   rarity:'R', icon:'💨', speed:3, he3_cost:0.004, agility_bonus:6,  evasion_bonus:8,  special:{type:'first_strike', desc:'Uvijek napada prvi svake runde'}, cost:{metal:2000, crystal:1300, he3:800  }, source:'Instanca 20',  desc:'Sprint pogon. Garantira inicijativu.',          who:'Svi brodovi' },
  { id:'eng_sprint_II',  name:'Sprint Drive II',  variant:'II',  rarity:'R', icon:'💨', speed:5, he3_cost:0.006, agility_bonus:10, evasion_bonus:12, special:{type:'first_strike', desc:'Uvijek napada prvi svake runde'}, cost:{metal:4100, crystal:2650, he3:1630 }, source:'Instanca 24',  desc:'Poboljšani sprint pogon.',                       who:'Svi brodovi' },
  { id:'eng_sprint_III', name:'Sprint Drive III', variant:'III', rarity:'R', icon:'💨', speed:6, he3_cost:0.008, agility_bonus:14, evasion_bonus:16, special:{type:'first_strike', desc:'Uvijek napada prvi svake runde'}, cost:{metal:8300, crystal:5350, he3:3300 }, source:'Restricted 2', desc:'Napredni sprint pogon. Maksimalna inicijativa.',  who:'Svi brodovi' },

  // 2. Surge Drive — first_strike + napadački
  { id:'eng_surge_I',   name:'Surge Drive I',   variant:'I',   rarity:'R', icon:'⚡', speed:3, he3_cost:0.004, agility_bonus:8,  evasion_bonus:6,  special:{type:'first_strike', desc:'Uvijek napada prvi svake runde'}, cost:{metal:2200, crystal:1440, he3:880  }, source:'Instanca 21',  desc:'Napadački pogon s udarnom inicijativom.',  who:'Svi brodovi' },
  { id:'eng_surge_II',  name:'Surge Drive II',  variant:'II',  rarity:'R', icon:'⚡', speed:5, he3_cost:0.006, agility_bonus:12, evasion_bonus:10, special:{type:'first_strike', desc:'Uvijek napada prvi svake runde'}, cost:{metal:4500, crystal:2930, he3:1800 }, source:'Instanca 25',  desc:'Poboljšani napadački pogon.',               who:'Svi brodovi' },
  { id:'eng_surge_III', name:'Surge Drive III', variant:'III', rarity:'R', icon:'⚡', speed:6, he3_cost:0.008, agility_bonus:16, evasion_bonus:14, special:{type:'first_strike', desc:'Uvijek napada prvi svake runde'}, cost:{metal:9100, crystal:5900, he3:3630 }, source:'Restricted 3', desc:'Napredni napadački pogon.',                 who:'Svi brodovi' },

  // 3. Combat Drive — double_strike
  { id:'eng_combat_I',   name:'Combat Drive I',   variant:'I',   rarity:'R', icon:'⚔️', speed:3, he3_cost:0.004, agility_bonus:5,  evasion_bonus:4,  special:{type:'double_strike', chance:8,  desc:'8% šansa za drugi napad' }, cost:{metal:2100, crystal:1370, he3:840  }, source:'Instanca 22',  desc:'Borbeni pogon. Šansa za dvostruki napad.',   who:'Svi brodovi' },
  { id:'eng_combat_II',  name:'Combat Drive II',  variant:'II',  rarity:'R', icon:'⚔️', speed:5, he3_cost:0.006, agility_bonus:8,  evasion_bonus:6,  special:{type:'double_strike', chance:12, desc:'12% šansa za drugi napad'}, cost:{metal:4300, crystal:2790, he3:1720 }, source:'Instanca 26',  desc:'Poboljšani borbeni pogon.',                  who:'Svi brodovi' },
  { id:'eng_combat_III', name:'Combat Drive III', variant:'III', rarity:'R', icon:'⚔️', speed:6, he3_cost:0.008, agility_bonus:11, evasion_bonus:8,  special:{type:'double_strike', chance:16, desc:'16% šansa za drugi napad'}, cost:{metal:8700, crystal:5640, he3:3470 }, source:'Restricted 4', desc:'Napredni borbeni pogon.',                     who:'Svi brodovi' },

  // 4. Phantom Drive — warp_skip
  { id:'eng_phantom_I',   name:'Phantom Drive I',   variant:'I',   rarity:'R', icon:'👻', speed:3, he3_cost:0.004, agility_bonus:8,  evasion_bonus:10, special:{type:'warp_skip', chance:10, desc:'10% šansa: negira dolazni napad'}, cost:{metal:2300, crystal:1500, he3:920  }, source:'Instanca 23',  desc:'Fantomski pogon. Negira dolazne napade.',   who:'Svi brodovi' },
  { id:'eng_phantom_II',  name:'Phantom Drive II',  variant:'II',  rarity:'R', icon:'👻', speed:5, he3_cost:0.006, agility_bonus:12, evasion_bonus:15, special:{type:'warp_skip', chance:15, desc:'15% šansa: negira dolazni napad'}, cost:{metal:4700, crystal:3050, he3:1880 }, source:'Instanca 27',  desc:'Poboljšani fantomski pogon.',               who:'Svi brodovi' },
  { id:'eng_phantom_III', name:'Phantom Drive III', variant:'III', rarity:'R', icon:'👻', speed:6, he3_cost:0.008, agility_bonus:16, evasion_bonus:20, special:{type:'warp_skip', chance:20, desc:'20% šansa: negira dolazni napad'}, cost:{metal:9500, crystal:6150, he3:3790 }, source:'Restricted 5', desc:'Napredni fantomski pogon.',                 who:'Svi brodovi' },

  // 5. Reactive Drive — reactive_boost
  { id:'eng_reactive_I',   name:'Reactive Drive I',   variant:'I',   rarity:'R', icon:'🔄', speed:3, he3_cost:0.004, agility_bonus:4,  evasion_bonus:5,  special:{type:'reactive_boost', bonus:20, desc:'Kad HP < 50%, trajno +20% DPS'}, cost:{metal:1900, crystal:1240, he3:760  }, source:'Instanca 20',  desc:'Reaktivni pogon. Aktivira se kad brod strada.',  who:'Svi brodovi' },
  { id:'eng_reactive_II',  name:'Reactive Drive II',  variant:'II',  rarity:'R', icon:'🔄', speed:5, he3_cost:0.006, agility_bonus:6,  evasion_bonus:8,  special:{type:'reactive_boost', bonus:28, desc:'Kad HP < 50%, trajno +28% DPS'}, cost:{metal:3880, crystal:2520, he3:1550 }, source:'Instanca 24',  desc:'Poboljšani reaktivni pogon.',                    who:'Svi brodovi' },
  { id:'eng_reactive_III', name:'Reactive Drive III', variant:'III', rarity:'R', icon:'🔄', speed:6, he3_cost:0.008, agility_bonus:8,  evasion_bonus:11, special:{type:'reactive_boost', bonus:36, desc:'Kad HP < 50%, trajno +36% DPS'}, cost:{metal:7850, crystal:5090, he3:3130 }, source:'Restricted 6', desc:'Napredni reaktivni pogon.',                       who:'Svi brodovi' },

  // 6. Adaptive Drive — jači reactive_boost
  { id:'eng_adaptive_I',   name:'Adaptive Drive I',   variant:'I',   rarity:'R', icon:'🔀', speed:3, he3_cost:0.004, agility_bonus:5,  evasion_bonus:6,  special:{type:'reactive_boost', bonus:25, desc:'Kad HP < 50%, trajno +25% DPS'}, cost:{metal:2100, crystal:1370, he3:840  }, source:'Instanca 21',  desc:'Adaptivni pogon. Snažnija reaktivna sposobnost.',  who:'Svi brodovi' },
  { id:'eng_adaptive_II',  name:'Adaptive Drive II',  variant:'II',  rarity:'R', icon:'🔀', speed:5, he3_cost:0.006, agility_bonus:8,  evasion_bonus:10, special:{type:'reactive_boost', bonus:35, desc:'Kad HP < 50%, trajno +35% DPS'}, cost:{metal:4280, crystal:2780, he3:1710 }, source:'Instanca 25',  desc:'Poboljšani adaptivni pogon.',                       who:'Svi brodovi' },
  { id:'eng_adaptive_III', name:'Adaptive Drive III', variant:'III', rarity:'R', icon:'🔀', speed:6, he3_cost:0.008, agility_bonus:11, evasion_bonus:14, special:{type:'reactive_boost', bonus:45, desc:'Kad HP < 50%, trajno +45% DPS'}, cost:{metal:8660, crystal:5620, he3:3460 }, source:'Restricted 7', desc:'Napredni adaptivni pogon.',                         who:'Svi brodovi' },

  // 7. Pulse Regen Drive — snažan HP regen
  { id:'eng_pulse_regen_I',   name:'Pulse Regen I',   variant:'I',   rarity:'R', icon:'💞', speed:3, he3_cost:0.004, agility_bonus:2, evasion_bonus:2, special:{type:'hp_regen', amount:65,  desc:'Obnavlja 65 HP svake runde' }, cost:{metal:1800, crystal:1170, he3:720  }, source:'Instanca 22',  desc:'Regen pogon. Stalna i jaka HP regeneracija.',  who:'Svi brodovi' },
  { id:'eng_pulse_regen_II',  name:'Pulse Regen II',  variant:'II',  rarity:'R', icon:'💞', speed:5, he3_cost:0.006, agility_bonus:4, evasion_bonus:4, special:{type:'hp_regen', amount:125, desc:'Obnavlja 125 HP svake runde'}, cost:{metal:3680, crystal:2390, he3:1470 }, source:'Instanca 26',  desc:'Poboljšani regen pogon.',                       who:'Svi brodovi' },
  { id:'eng_pulse_regen_III', name:'Pulse Regen III', variant:'III', rarity:'R', icon:'💞', speed:6, he3_cost:0.008, agility_bonus:6, evasion_bonus:6, special:{type:'hp_regen', amount:200, desc:'Obnavlja 200 HP svake runde'}, cost:{metal:7440, crystal:4830, he3:2970 }, source:'Restricted 8', desc:'Napredni regen pogon.',                          who:'Svi brodovi' },

  // 8. Fortified Drive — jaki armor boost
  { id:'eng_fortified_I',   name:'Fortified Drive I',   variant:'I',   rarity:'R', icon:'🏗️', speed:3, he3_cost:0.004, agility_bonus:0, evasion_bonus:0, special:{type:'armor_boost', bonus:18, desc:'-18% primljene štete'}, cost:{metal:2000, crystal:1100, he3:880  }, source:'Instanca 23',  desc:'Tvrđava pogon. Snažna redukcija primljene štete.',  who:'Svi brodovi' },
  { id:'eng_fortified_II',  name:'Fortified Drive II',  variant:'II',  rarity:'R', icon:'🏗️', speed:5, he3_cost:0.006, agility_bonus:1, evasion_bonus:1, special:{type:'armor_boost', bonus:26, desc:'-26% primljene štete'}, cost:{metal:4070, crystal:2240, he3:1790 }, source:'Instanca 27',  desc:'Poboljšani tvrđava pogon.',                          who:'Svi brodovi' },
  { id:'eng_fortified_III', name:'Fortified Drive III', variant:'III', rarity:'R', icon:'🏗️', speed:6, he3_cost:0.008, agility_bonus:2, evasion_bonus:2, special:{type:'armor_boost', bonus:34, desc:'-34% primljene štete'}, cost:{metal:8220, crystal:4530, he3:3620 }, source:'Restricted 9', desc:'Napredni tvrđava pogon.',                             who:'Svi brodovi' },

  // 9. Stealth Drive — stealth evasion
  // Speed kao Rare ali he3_cost smanjen (stealth taktika = tih motor)
  { id:'eng_stealth_I',   name:'Stealth Drive I',   variant:'I',   rarity:'R', icon:'👤', speed:3, he3_cost:0.003, agility_bonus:14, evasion_bonus:18, special:{type:'stealth', chance:12, desc:'12% šansa: neprijatelj promašuje'}, cost:{metal:2200, crystal:1440, he3:880 }, source:'Instanca 22',  desc:'Prikriveni pogon. Visoka šansa za izbjegavanje.',  who:'Svi brodovi' },
  { id:'eng_stealth_II',  name:'Stealth Drive II',  variant:'II',  rarity:'R', icon:'👤', speed:5, he3_cost:0.005, agility_bonus:20, evasion_bonus:26, special:{type:'stealth', chance:18, desc:'18% šansa: neprijatelj promašuje'}, cost:{metal:4480, crystal:2920, he3:1780}, source:'Instanca 25',  desc:'Poboljšani prikriveni pogon.',                      who:'Svi brodovi' },
  { id:'eng_stealth_III', name:'Stealth Drive III', variant:'III', rarity:'R', icon:'👤', speed:6, he3_cost:0.006, agility_bonus:26, evasion_bonus:34, special:{type:'stealth', chance:24, desc:'24% šansa: neprijatelj promašuje'}, cost:{metal:9060, crystal:5900, he3:3600}, source:'Restricted 8', desc:'Napredni prikriveni pogon. Gotovo nevidljiv.',      who:'Svi brodovi' },

  // 10. He3 Saver Drive — ekonomičan pogon, manji he3_cost
  // Speed kao Rare ali he3_cost = Rare * (1 - bonus/100)
  { id:'eng_he3_saver_I',   name:'He3 Saver I',   variant:'I',   rarity:'R', icon:'⛽', speed:3, he3_cost:0.003, agility_bonus:3, evasion_bonus:2, special:{type:'he3_save', bonus:25, desc:'-25% he3 potrošnje'}, cost:{metal:1900, crystal:1240, he3:580 }, source:'Instanca 20',  desc:'He3-ekonomičan pogon. Štedi gorivo u borbi.',        who:'Svi brodovi' },
  { id:'eng_he3_saver_II',  name:'He3 Saver II',  variant:'II',  rarity:'R', icon:'⛽', speed:5, he3_cost:0.004, agility_bonus:5, evasion_bonus:4, special:{type:'he3_save', bonus:35, desc:'-35% he3 potrošnje'}, cost:{metal:3870, crystal:2530, he3:1180}, source:'Instanca 24',  desc:'Poboljšani He3 Saver.',                               who:'Svi brodovi' },
  { id:'eng_he3_saver_III', name:'He3 Saver III', variant:'III', rarity:'R', icon:'⛽', speed:6, he3_cost:0.004, agility_bonus:7, evasion_bonus:6, special:{type:'he3_save', bonus:45, desc:'-45% he3 potrošnje'}, cost:{metal:7820, crystal:5110, he3:2380}, source:'Restricted 7', desc:'Napredni He3 Saver. Drastično štedi gorivo.',         who:'Svi brodovi' },


  // ════════════════════════════════════════════════════════════
  // EPIC MOTORI (24) — 8 tipova × 3 nivoa
  // speed: 5/7/8 | he3_cost: 0.010/0.014/0.018
  // ════════════════════════════════════════════════════════════

  // 1. Quantum Drive — warp_skip jak
  { id:'eng_quantum_I',   name:'Quantum Drive I',   variant:'I',   rarity:'E', icon:'🌀', speed:5, he3_cost:0.010, agility_bonus:12, evasion_bonus:15, special:{type:'warp_skip', chance:18, desc:'18% šansa: negira dolazni napad'}, cost:{metal:5000,  crystal:4000,  he3:2500  }, source:'Restricted 2', desc:'Kvantni pogon. Visoka šansa negiranja napada.',   who:'Svi brodovi' },
  { id:'eng_quantum_II',  name:'Quantum Drive II',  variant:'II',  rarity:'E', icon:'🌀', speed:7, he3_cost:0.014, agility_bonus:18, evasion_bonus:22, special:{type:'warp_skip', chance:25, desc:'25% šansa: negira dolazni napad'}, cost:{metal:10500, crystal:8400,  he3:5250  }, source:'Restricted 4', desc:'Poboljšani kvantni pogon.',                        who:'Svi brodovi' },
  { id:'eng_quantum_III', name:'Quantum Drive III', variant:'III', rarity:'E', icon:'🌀', speed:8, he3_cost:0.018, agility_bonus:24, evasion_bonus:30, special:{type:'warp_skip', chance:32, desc:'32% šansa: negira dolazni napad'}, cost:{metal:21000, crystal:16800, he3:10500 }, source:'Restricted 6', desc:'Napredni kvantni pogon. Gotovo nemoguće pogoditi.', who:'Svi brodovi' },

  // 2. Berserker Drive — double_strike jak
  { id:'eng_berserker_I',   name:'Berserker Drive I',   variant:'I',   rarity:'E', icon:'🔴', speed:5, he3_cost:0.010, agility_bonus:10, evasion_bonus:8,  special:{type:'double_strike', chance:18, desc:'18% šansa za drugi napad'}, cost:{metal:5500,  crystal:4400,  he3:2750  }, source:'Restricted 3', desc:'Berserker pogon. Agresivni dvostruki napad.',   who:'Svi brodovi' },
  { id:'eng_berserker_II',  name:'Berserker Drive II',  variant:'II',  rarity:'E', icon:'🔴', speed:7, he3_cost:0.014, agility_bonus:14, evasion_bonus:11, special:{type:'double_strike', chance:24, desc:'24% šansa za drugi napad'}, cost:{metal:11500, crystal:9200,  he3:5750  }, source:'Restricted 5', desc:'Poboljšani berserker pogon.',                   who:'Svi brodovi' },
  { id:'eng_berserker_III', name:'Berserker Drive III', variant:'III', rarity:'E', icon:'🔴', speed:8, he3_cost:0.018, agility_bonus:18, evasion_bonus:14, special:{type:'double_strike', chance:30, desc:'30% šansa za drugi napad'}, cost:{metal:23000, crystal:18400, he3:11500 }, source:'Restricted 7', desc:'Napredni berserker pogon.',                     who:'Svi brodovi' },

  // 3. Sentinel Drive — armor_boost jak
  { id:'eng_sentinel_I',   name:'Sentinel Drive I',   variant:'I',   rarity:'E', icon:'🛡️', speed:5, he3_cost:0.010, agility_bonus:5,  evasion_bonus:8,  special:{type:'armor_boost', bonus:28, desc:'-28% primljene štete'}, cost:{metal:5200,  crystal:4000,  he3:2600  }, source:'Restricted 3', desc:'Sentinel pogon. Masivna redukcija primljene štete.',  who:'Svi brodovi' },
  { id:'eng_sentinel_II',  name:'Sentinel Drive II',  variant:'II',  rarity:'E', icon:'🛡️', speed:7, he3_cost:0.014, agility_bonus:7,  evasion_bonus:11, special:{type:'armor_boost', bonus:38, desc:'-38% primljene štete'}, cost:{metal:10900, crystal:8400,  he3:5450  }, source:'Restricted 5', desc:'Poboljšani sentinel pogon.',                          who:'Svi brodovi' },
  { id:'eng_sentinel_III', name:'Sentinel Drive III', variant:'III', rarity:'E', icon:'🛡️', speed:8, he3_cost:0.018, agility_bonus:10, evasion_bonus:14, special:{type:'armor_boost', bonus:48, desc:'-48% primljene štete'}, cost:{metal:21800, crystal:16800, he3:10900 }, source:'Restricted 7', desc:'Napredni sentinel pogon. Gotovo neprobojni oklop.',    who:'Svi brodovi' },

  // 4. Void Drive — void_phase
  { id:'eng_void_I',   name:'Void Drive I',   variant:'I',   rarity:'E', icon:'🕳️', speed:5, he3_cost:0.010, agility_bonus:15, evasion_bonus:18, special:{type:'void_phase', chance:5,  desc:'5% šansa: potpuna imunost tu rundu' }, cost:{metal:5800,  crystal:4640,  he3:2900  }, source:'Restricted 4', desc:'Void pogon. Rijetka šansa za potpunu imunost.',   who:'Svi brodovi' },
  { id:'eng_void_II',  name:'Void Drive II',  variant:'II',  rarity:'E', icon:'🕳️', speed:7, he3_cost:0.014, agility_bonus:22, evasion_bonus:26, special:{type:'void_phase', chance:8,  desc:'8% šansa: potpuna imunost tu rundu' }, cost:{metal:12200, crystal:9760,  he3:6100  }, source:'Restricted 6', desc:'Poboljšani void pogon.',                           who:'Svi brodovi' },
  { id:'eng_void_III', name:'Void Drive III', variant:'III', rarity:'E', icon:'🕳️', speed:8, he3_cost:0.018, agility_bonus:30, evasion_bonus:35, special:{type:'void_phase', chance:12, desc:'12% šansa: potpuna imunost tu rundu'}, cost:{metal:24400, crystal:19520, he3:12200 }, source:'Restricted 8', desc:'Napredni void pogon.',                              who:'Svi brodovi' },

  // 5. Predator Drive — first_strike jak
  { id:'eng_predator_I',   name:'Predator Drive I',   variant:'I',   rarity:'E', icon:'🦅', speed:5, he3_cost:0.010, agility_bonus:16, evasion_bonus:12, special:{type:'first_strike', desc:'Uvijek napada prvi svake runde'}, cost:{metal:6000,  crystal:4800,  he3:3000  }, source:'Restricted 5', desc:'Predatorski pogon. Uvijek prva inicijativa.',   who:'Svi brodovi' },
  { id:'eng_predator_II',  name:'Predator Drive II',  variant:'II',  rarity:'E', icon:'🦅', speed:7, he3_cost:0.014, agility_bonus:22, evasion_bonus:17, special:{type:'first_strike', desc:'Uvijek napada prvi svake runde'}, cost:{metal:12600, crystal:10080, he3:6300  }, source:'Restricted 7', desc:'Poboljšani predatorski pogon.',                  who:'Svi brodovi' },
  { id:'eng_predator_III', name:'Predator Drive III', variant:'III', rarity:'E', icon:'🦅', speed:8, he3_cost:0.018, agility_bonus:28, evasion_bonus:22, special:{type:'first_strike', desc:'Uvijek napada prvi svake runde'}, cost:{metal:25200, crystal:20160, he3:12600 }, source:'Restricted 9', desc:'Napredni predatorski pogon.',                    who:'Svi brodovi' },

  // 6. Phoenix Core Drive — masivan HP regen
  { id:'eng_phoenix_core_I',   name:'Phoenix Core I',   variant:'I',   rarity:'E', icon:'🔥', speed:5, he3_cost:0.010, agility_bonus:3,  evasion_bonus:4,  special:{type:'hp_regen', amount:250, desc:'Obnavlja 250 HP svake runde'}, cost:{metal:5400,  crystal:4320,  he3:2700  }, source:'Trial 1', desc:'Feniksonski pogon. Masivna HP regeneracija.',  who:'Svi brodovi' },
  { id:'eng_phoenix_core_II',  name:'Phoenix Core II',  variant:'II',  rarity:'E', icon:'🔥', speed:7, he3_cost:0.014, agility_bonus:5,  evasion_bonus:6,  special:{type:'hp_regen', amount:450, desc:'Obnavlja 450 HP svake runde'}, cost:{metal:11340, crystal:9072,  he3:5670  }, source:'Trial 4', desc:'Poboljšani feniksonski pogon.',                 who:'Svi brodovi' },
  { id:'eng_phoenix_core_III', name:'Phoenix Core III', variant:'III', rarity:'E', icon:'🔥', speed:8, he3_cost:0.018, agility_bonus:7,  evasion_bonus:8,  special:{type:'hp_regen', amount:700, desc:'Obnavlja 700 HP svake runde'}, cost:{metal:22680, crystal:18144, he3:11340 }, source:'Trial 7', desc:'Napredni feniksonski pogon.',                   who:'Svi brodovi' },

  // 7. Fleet Sync Drive — fleet_aura
  { id:'eng_fleet_sync_I',   name:'Fleet Sync I',   variant:'I',   rarity:'E', icon:'🌐', speed:5, he3_cost:0.010, agility_bonus:6,  evasion_bonus:5,  special:{type:'fleet_aura', bonus:5,  desc:'Svi saveznici +5 agility na startu' }, cost:{metal:5600,  crystal:4480,  he3:2800  }, source:'Trial 2', desc:'Fleet Sync pogon. Ubrzava cijelu flotu.',   who:'Svi brodovi' },
  { id:'eng_fleet_sync_II',  name:'Fleet Sync II',  variant:'II',  rarity:'E', icon:'🌐', speed:7, he3_cost:0.014, agility_bonus:9,  evasion_bonus:8,  special:{type:'fleet_aura', bonus:8,  desc:'Svi saveznici +8 agility na startu' }, cost:{metal:11760, crystal:9408,  he3:5880  }, source:'Trial 5', desc:'Poboljšani Fleet Sync pogon.',               who:'Svi brodovi' },
  { id:'eng_fleet_sync_III', name:'Fleet Sync III', variant:'III', rarity:'E', icon:'🌐', speed:8, he3_cost:0.014, agility_bonus:12, evasion_bonus:11, special:{type:'fleet_aura', bonus:12, desc:'Svi saveznici +12 agility na startu'}, cost:{metal:23520, crystal:18816, he3:11760 }, source:'Trial 8', desc:'Napredni Fleet Sync pogon.',                 who:'Svi brodovi' },

  // 8. Apex Drive — double_strike jak
  { id:'eng_apex_I',   name:'Apex Drive I',   variant:'I',   rarity:'E', icon:'🎯', speed:5, he3_cost:0.010, agility_bonus:12, evasion_bonus:10, special:{type:'double_strike', chance:22, desc:'22% šansa za drugi napad'}, cost:{metal:6200,  crystal:4960,  he3:3100  }, source:'Trial 3', desc:'Apex pogon. Visoka šansa dvostrukog udara.',   who:'Svi brodovi' },
  { id:'eng_apex_II',  name:'Apex Drive II',  variant:'II',  rarity:'E', icon:'🎯', speed:7, he3_cost:0.014, agility_bonus:17, evasion_bonus:14, special:{type:'double_strike', chance:30, desc:'30% šansa za drugi napad'}, cost:{metal:13020, crystal:10416, he3:6510  }, source:'Trial 6', desc:'Poboljšani apex pogon.',                         who:'Svi brodovi' },
  { id:'eng_apex_III', name:'Apex Drive III', variant:'III', rarity:'E', icon:'🎯', speed:8, he3_cost:0.018, agility_bonus:22, evasion_bonus:18, special:{type:'double_strike', chance:38, desc:'38% šansa za drugi napad'}, cost:{metal:26040, crystal:20832, he3:13020 }, source:'Trial 9', desc:'Napredni apex pogon.',                           who:'Svi brodovi' },


  // ════════════════════════════════════════════════════════════
  // LEGENDARY MOTORI (18) — 5 tipova × 3 nivoa + 3 Divine
  // speed: 7/9/10 | he3_cost: 0.020/0.030/0.050
  // ════════════════════════════════════════════════════════════

  // 1. Hyperdrive — double_strike maksimalni
  { id:'eng_hyperdrive_I',   name:'Hyperdrive I',   variant:'I',   rarity:'L', icon:'⚡', speed:7,  he3_cost:0.020, agility_bonus:20, evasion_bonus:25, special:{type:'double_strike', chance:35, desc:'35% šansa za drugi napad'}, cost:{metal:15000, crystal:12000, he3:7500  }, source:'Trial 3',    desc:'Hiperpogon. Masivni dvostruki napad.',           who:'Svi brodovi' },
  { id:'eng_hyperdrive_II',  name:'Hyperdrive II',  variant:'II',  rarity:'L', icon:'⚡', speed:9,  he3_cost:0.030, agility_bonus:28, evasion_bonus:35, special:{type:'double_strike', chance:45, desc:'45% šansa za drugi napad'}, cost:{metal:34000, crystal:27200, he3:17000 }, source:'Trial 6',    desc:'Poboljšani hiperpogon.',                          who:'Svi brodovi' },
  { id:'eng_hyperdrive_III', name:'Hyperdrive III', variant:'III', rarity:'L', icon:'⚡', speed:10, he3_cost:0.050, agility_bonus:36, evasion_bonus:45, special:{type:'double_strike', chance:55, desc:'55% šansa za drugi napad'}, cost:{metal:68000, crystal:54400, he3:34000 }, source:'Trial 9',    desc:'Napredni hiperpogon. Dominantni pogon u igri.',   who:'Svi brodovi' },

  // 2. Voidwarp Drive — void_phase jak
  { id:'eng_voidwarp_I',   name:'Voidwarp I',   variant:'I',   rarity:'L', icon:'🕳️', speed:7,  he3_cost:0.020, agility_bonus:22, evasion_bonus:28, special:{type:'void_phase', chance:15, desc:'15% šansa: potpuna imunost tu rundu'}, cost:{metal:18000, crystal:14400, he3:9000  }, source:'Pirate 3',  desc:'Voidwarp pogon. Česta potpuna imunost.',    who:'Svi brodovi' },
  { id:'eng_voidwarp_II',  name:'Voidwarp II',  variant:'II',  rarity:'L', icon:'🕳️', speed:9,  he3_cost:0.030, agility_bonus:30, evasion_bonus:38, special:{type:'void_phase', chance:22, desc:'22% šansa: potpuna imunost tu rundu'}, cost:{metal:40000, crystal:32000, he3:20000 }, source:'Pirate 6',  desc:'Poboljšani voidwarp pogon.',                who:'Svi brodovi' },
  { id:'eng_voidwarp_III', name:'Voidwarp III', variant:'III', rarity:'L', icon:'🕳️', speed:10, he3_cost:0.050, agility_bonus:40, evasion_bonus:50, special:{type:'void_phase', chance:30, desc:'30% šansa: potpuna imunost tu rundu'}, cost:{metal:80000, crystal:64000, he3:40000 }, source:'Pirate 9',  desc:'Napredni voidwarp. Piratski ekskluziv.',    who:'Svi brodovi' },

  // 3. Celestial Drive — fleet_aura jak
  { id:'eng_celestial_I',   name:'Celestial Drive I',   variant:'I',   rarity:'L', icon:'🌟', speed:7,  he3_cost:0.020, agility_bonus:25, evasion_bonus:30, special:{type:'fleet_aura', bonus:15, desc:'Svi saveznici +15 agility na startu'}, cost:{metal:22000, crystal:17600, he3:11000 }, source:'Constellation 1', desc:'Celestijalni pogon. Ubrzava cijelu flotu.',     who:'Svi brodovi' },
  { id:'eng_celestial_II',  name:'Celestial Drive II',  variant:'II',  rarity:'L', icon:'🌟', speed:9,  he3_cost:0.030, agility_bonus:32, evasion_bonus:40, special:{type:'fleet_aura', bonus:22, desc:'Svi saveznici +22 agility na startu'}, cost:{metal:50000, crystal:40000, he3:25000 }, source:'Constellation 2', desc:'Poboljšani celestijalni pogon.',                 who:'Svi brodovi' },
  { id:'eng_celestial_III', name:'Celestial Drive III', variant:'III', rarity:'L', icon:'🌟', speed:10, he3_cost:0.050, agility_bonus:40, evasion_bonus:50, special:{type:'fleet_aura', bonus:30, desc:'Svi saveznici +30 agility na startu'}, cost:{metal:100000,crystal:80000, he3:50000 }, source:'Constellation 3', desc:'Napredni celestijalni. Constellation ekskluziv.', who:'Svi brodovi' },

  // 4. Titan Drive — armor_boost maksimalni
  { id:'eng_titan_I',   name:'Titan Drive I',   variant:'I',   rarity:'L', icon:'🏋️', speed:7,  he3_cost:0.020, agility_bonus:8,  evasion_bonus:10, special:{type:'armor_boost', bonus:55, desc:'-55% primljene štete'}, cost:{metal:20000, crystal:16000, he3:10000 }, source:'Trial 5',    desc:'Titan pogon. Masivna redukcija štete.',           who:'Svi brodovi' },
  { id:'eng_titan_II',  name:'Titan Drive II',  variant:'II',  rarity:'L', icon:'🏋️', speed:9,  he3_cost:0.030, agility_bonus:11, evasion_bonus:14, special:{type:'armor_boost', bonus:70, desc:'-70% primljene štete'}, cost:{metal:45000, crystal:36000, he3:22500 }, source:'Trial 8',    desc:'Poboljšani titan pogon.',                          who:'Svi brodovi' },
  { id:'eng_titan_III', name:'Titan Drive III', variant:'III', rarity:'L', icon:'🏋️', speed:10, he3_cost:0.050, agility_bonus:14, evasion_bonus:18, special:{type:'armor_boost', bonus:85, desc:'-85% primljene štete'}, cost:{metal:90000, crystal:72000, he3:45000 }, source:'Trial 10',   desc:'Napredni titan. Skoro neranjivi oklop.',           who:'Svi brodovi' },

  // 5. Annihilator Drive — first_strike + top agility
  { id:'eng_annihilator_I',   name:'Annihilator I',   variant:'I',   rarity:'L', icon:'☄️', speed:7,  he3_cost:0.020, agility_bonus:24, evasion_bonus:20, special:{type:'first_strike', desc:'Uvijek napada prvi + top agility'}, cost:{metal:17000, crystal:13600, he3:8500  }, source:'Trial 4',    desc:'Annihilator pogon. Brži od svega.',              who:'Svi brodovi' },
  { id:'eng_annihilator_II',  name:'Annihilator II',  variant:'II',  rarity:'L', icon:'☄️', speed:9,  he3_cost:0.030, agility_bonus:34, evasion_bonus:28, special:{type:'first_strike', desc:'Uvijek napada prvi + top agility'}, cost:{metal:38500, crystal:30800, he3:19250 }, source:'Trial 7',    desc:'Poboljšani annihilator pogon.',                  who:'Svi brodovi' },
  { id:'eng_annihilator_III', name:'Annihilator III', variant:'III', rarity:'L', icon:'☄️', speed:10, he3_cost:0.050, agility_bonus:44, evasion_bonus:36, special:{type:'first_strike', desc:'Uvijek napada prvi + top agility'}, cost:{metal:77000, crystal:61600, he3:38500 }, source:'Trial 10',   desc:'Napredni annihilator. Ultimativna inicijativa.',  who:'Svi brodovi' },

  // ── DIVINE MOTORI (3) — Boss Event drop only ──
  {
    id: 'eng_divine_I', name: 'Divine Drive I', variant: 'I', rarity: 'L', icon: '✨',
    speed: 10, he3_cost: 0.040,
    agility_bonus: 30, evasion_bonus: 40,
    special: { type: 'divine_speed', desc: 'Uvijek napada prvi + 20% void_phase + svi saveznici +5 agility' },
    cost: { metal: 0, crystal: 0, he3: 0 },
    source: 'Boss Event (drop only)',
    desc: 'Božanski pogon. Inicijativa + void phase + aura. Samo iz Boss Eventa.',
    who: 'Svi brodovi', max_per_player: 1, drop_only: true,
  },
  {
    id: 'eng_divine_II', name: 'Divine Drive II', variant: 'II', rarity: 'L', icon: '✨',
    speed: 10, he3_cost: 0.040,
    agility_bonus: 40, evasion_bonus: 55,
    special: { type: 'divine_speed', desc: 'Uvijek napada prvi + 25% void_phase + svi saveznici +8 agility' },
    cost: { metal: 0, crystal: 0, he3: 0 },
    source: 'Boss Event (drop only)',
    desc: 'Poboljšani božanski pogon. Najrjeđi pogon u igri.',
    who: 'Svi brodovi', max_per_player: 1, drop_only: true,
  },
  {
    id: 'eng_divine_III', name: 'Divine Drive III', variant: 'III', rarity: 'L', icon: '✨',
    speed: 10, he3_cost: 0.040,
    agility_bonus: 50, evasion_bonus: 70,
    special: { type: 'divine_speed', desc: 'Uvijek napada prvi + 30% void_phase + svi saveznici +12 agility' },
    cost: { metal: 0, crystal: 0, he3: 0 },
    source: 'Boss Event (drop only)',
    desc: 'Vrhunski božanski pogon. Mitski, jedinstven. Samo najboljima.',
    who: 'Svi brodovi', max_per_player: 1, drop_only: true,
  },
];

function getEngineById(id) {
  return ENGINES.find(e => e.id === id) || null;
}
