// ============================================================
// HIVE GALAXY — data/shields.js
// 120 štitova — Svi štitovi s punim statistikama
// C:30 | R:30 | E:36 | L:24 (21 + 3 Divine)
// ============================================================

const SHIELDS = [

  // ════════════════════════════════════════════════════════════
  // COMMON ŠTITOVI (30) — 10 tipova × 3 nivoa, bez specijalnih
  // ════════════════════════════════════════════════════════════

  // 1. Nano Veil — ultra-laki nanofilament štit
  { id:'sh_nano_veil_I',   name:'Nano Veil I',   variant:'I',   rarity:'C', icon:'🛡️', shield:200,  regen:5,  special:null, cost:{metal:400,  crystal:250,  he3:100 }, source:'Instanca 3',  desc:'Nanofilament barijera. Osnovna zaštita skauta.',    who:'Svi brodovi' },
  { id:'sh_nano_veil_II',  name:'Nano Veil II',  variant:'II',  rarity:'C', icon:'🛡️', shield:400,  regen:10, special:null, cost:{metal:750,  crystal:480,  he3:190 }, source:'Restricted 1',  desc:'Poboljšana nanofilament barijera.',                 who:'Svi brodovi' },
  { id:'sh_nano_veil_III', name:'Nano Veil III', variant:'III', rarity:'C', icon:'🛡️', shield:640,  regen:16, special:null, cost:{metal:1200, crystal:760,  he3:300 }, source:'Restricted 6', desc:'Napredna nanofilament barijera za lake brodove.',    who:'Svi brodovi' },

  // 2. Iron Guard — klasični čelični oklop-štit
  { id:'sh_iron_guard_I',   name:'Iron Guard I',   variant:'I',   rarity:'C', icon:'🛡️', shield:300,  regen:7,  special:null, cost:{metal:600,  crystal:350,  he3:140 }, source:'Instanca 6',  desc:'Čelični zaštitni ekran. Pouzdan i jeftin.',          who:'Svi brodovi' },
  { id:'sh_iron_guard_II',  name:'Iron Guard II',  variant:'II',  rarity:'C', icon:'🛡️', shield:600,  regen:14, special:null, cost:{metal:1100, crystal:650,  he3:260 }, source:'Instanca 18',  desc:'Poboljšani čelični zaštitni ekran.',                 who:'Svi brodovi' },
  { id:'sh_iron_guard_III', name:'Iron Guard III', variant:'III', rarity:'C', icon:'🛡️', shield:960,  regen:22, special:null, cost:{metal:1700, crystal:1000, he3:400 }, source:'Restricted 9', desc:'Napredni čelični štit za lovce i izviđače.',          who:'Svi brodovi' },

  // 3. Photon Barrier — fotonska energetska barijera
  { id:'sh_photon_barrier_I',   name:'Photon Barrier I',   variant:'I',   rarity:'C', icon:'🛡️', shield:380,  regen:9,  special:null, cost:{metal:700,  crystal:450,  he3:180 }, source:'Instanca 9',  desc:'Fotonska energetska barijera. Standardna oprema.',   who:'Svi brodovi' },
  { id:'sh_photon_barrier_II',  name:'Photon Barrier II',  variant:'II',  rarity:'C', icon:'🛡️', shield:760,  regen:18, special:null, cost:{metal:1300, crystal:840,  he3:336 }, source:'Restricted 7',  desc:'Poboljšana fotonska barijera.',                       who:'Svi brodovi' },
  { id:'sh_photon_barrier_III', name:'Photon Barrier III', variant:'III', rarity:'C', icon:'🛡️', shield:1216, regen:29, special:null, cost:{metal:2100, crystal:1340, he3:536 }, source:'Trial 3', desc:'Napredna fotonska barijera.',                          who:'Svi brodovi' },

  // 4. Pulse Ward — impulsni zaštitni sloj
  { id:'sh_pulse_ward_I',   name:'Pulse Ward I',   variant:'I',   rarity:'C', icon:'🛡️', shield:440,  regen:11, special:null, cost:{metal:820,  crystal:520,  he3:210 }, source:'Instanca 12',  desc:'Impulsni zaštitni sloj koji apsorbuje udare.',       who:'Svi brodovi' },
  { id:'sh_pulse_ward_II',  name:'Pulse Ward II',  variant:'II',  rarity:'C', icon:'🛡️', shield:880,  regen:22, special:null, cost:{metal:1540, crystal:980,  he3:392 }, source:'Instanca 30',  desc:'Poboljšani impulsni zaštitni sloj.',                  who:'Svi brodovi' },
  { id:'sh_pulse_ward_III', name:'Pulse Ward III', variant:'III', rarity:'C', icon:'🛡️', shield:1408, regen:35, special:null, cost:{metal:2460, crystal:1560, he3:624 }, source:'Trial 7', desc:'Napredni impulsni štit za mid-tier brodove.',          who:'Svi brodovi' },

  // 5. Quartz Shell — kristalna kvarcna ljuska
  { id:'sh_quartz_shell_I',   name:'Quartz Shell I',   variant:'I',   rarity:'C', icon:'🛡️', shield:500,  regen:12, special:null, cost:{metal:900,  crystal:600,  he3:240 }, source:'Instanca 15',  desc:'Kristalna kvarcna ljuska. Dobra osnova za krstarice.',who:'Svi brodovi' },
  { id:'sh_quartz_shell_II',  name:'Quartz Shell II',  variant:'II',  rarity:'C', icon:'🛡️', shield:1000, regen:24, special:null, cost:{metal:1700, crystal:1130, he3:452 }, source:'Restricted 10',  desc:'Poboljšana kvarcna ljuska.',                          who:'Svi brodovi' },
  { id:'sh_quartz_shell_III', name:'Quartz Shell III', variant:'III', rarity:'C', icon:'🛡️', shield:1600, regen:38, special:null, cost:{metal:2720, crystal:1800, he3:720 }, source:'Trial 9', desc:'Napredna kvarcna ljuska.',                             who:'Svi brodovi' },

  // 6. Flux Buffer — fluksni tampon-štit
  { id:'sh_flux_buffer_I',   name:'Flux Buffer I',   variant:'I',   rarity:'C', icon:'🛡️', shield:560,  regen:14, special:null, cost:{metal:1000, crystal:660,  he3:264 }, source:'Restricted 3',  desc:'Fluksni tampon koji balansira energetska polja.',    who:'Svi brodovi' },
  { id:'sh_flux_buffer_II',  name:'Flux Buffer II',  variant:'II',  rarity:'C', icon:'🛡️', shield:1120, regen:28, special:null, cost:{metal:1880, crystal:1240, he3:496 }, source:'Trial 1', desc:'Poboljšani fluksni tampon.',                           who:'Svi brodovi' },
  { id:'sh_flux_buffer_III', name:'Flux Buffer III', variant:'III', rarity:'C', icon:'🛡️', shield:1792, regen:45, special:null, cost:{metal:3000, crystal:1980, he3:792 }, source:'Humanoid 2', desc:'Napredni fluksni tampon. Dobar za krstarice.',        who:'Svi brodovi' },

  // 7. Alloy Plate — legura-ploča kompozitni štit
  { id:'sh_alloy_plate_I',   name:'Alloy Plate I',   variant:'I',   rarity:'C', icon:'🛡️', shield:620,  regen:15, special:null, cost:{metal:1100, crystal:720,  he3:288 }, source:'Restricted 5',  desc:'Kompozitna legura-ploča. Teška ali izdržljiva.',      who:'Svi brodovi' },
  { id:'sh_alloy_plate_II',  name:'Alloy Plate II',  variant:'II',  rarity:'C', icon:'🛡️', shield:1240, regen:30, special:null, cost:{metal:2060, crystal:1360, he3:544 }, source:'Trial 4', desc:'Poboljšana kompozitna ploča.',                         who:'Svi brodovi' },
  { id:'sh_alloy_plate_III', name:'Alloy Plate III', variant:'III', rarity:'C', icon:'🛡️', shield:1984, regen:48, special:null, cost:{metal:3300, crystal:2170, he3:868 }, source:'Humanoid 5', desc:'Napredna kompozitna ploča za bojne brodove.',          who:'Svi brodovi' },

  // 8. Carbon Shell — karbonska nanovlaknasta ljuska
  { id:'sh_carbon_shell_I',   name:'Carbon Shell I',   variant:'I',   rarity:'C', icon:'🛡️', shield:680,  regen:17, special:null, cost:{metal:1200, crystal:790,  he3:316 }, source:'Instanca 21',  desc:'Karbonska nanovlaknasta ljuska. Lagana i čvrsta.',   who:'Svi brodovi' },
  { id:'sh_carbon_shell_II',  name:'Carbon Shell II',  variant:'II',  rarity:'C', icon:'🛡️', shield:1360, regen:34, special:null, cost:{metal:2250, crystal:1490, he3:596 }, source:'Trial 6', desc:'Poboljšana karbonska ljuska.',                        who:'Svi brodovi' },
  { id:'sh_carbon_shell_III', name:'Carbon Shell III', variant:'III', rarity:'C', icon:'🛡️', shield:2176, regen:54, special:null, cost:{metal:3600, crystal:2380, he3:952 }, source:'Humanoid 8', desc:'Napredna karbonska ljuska.',                          who:'Svi brodovi' },

  // 9. Mesh Barrier — mrežasta energetska barijera
  { id:'sh_mesh_barrier_I',   name:'Mesh Barrier I',   variant:'I',   rarity:'C', icon:'🛡️', shield:730,  regen:18, special:null, cost:{metal:1300, crystal:850,  he3:340 }, source:'Instanca 24',  desc:'Mrežasta energetska barijera. Raspoređuje udare.',   who:'Svi brodovi' },
  { id:'sh_mesh_barrier_II',  name:'Mesh Barrier II',  variant:'II',  rarity:'C', icon:'🛡️', shield:1460, regen:36, special:null, cost:{metal:2430, crystal:1600, he3:640 }, source:'Trial 8', desc:'Poboljšana mrežasta barijera.',                        who:'Svi brodovi' },
  { id:'sh_mesh_barrier_III', name:'Mesh Barrier III', variant:'III', rarity:'C', icon:'🛡️', shield:2336, regen:58, special:null, cost:{metal:3890, crystal:2560, he3:1024}, source:'Constellation 2', desc:'Napredna mrežasta barijera za nosače.',               who:'Svi brodovi' },

  // 10. Void Plate — tamnomaterijska zaštitna ploča (obična)
  { id:'sh_void_plate_I',   name:'Void Plate I',   variant:'I',   rarity:'C', icon:'🛡️', shield:800,  regen:20, special:null, cost:{metal:1430, crystal:940,  he3:376 }, source:'Instanca 27', desc:'Tamnomaterijska zaštitna ploča. Solid common štit.',  who:'Svi brodovi' },
  { id:'sh_void_plate_II',  name:'Void Plate II',  variant:'II',  rarity:'C', icon:'🛡️', shield:1600, regen:40, special:null, cost:{metal:2680, crystal:1760, he3:704 }, source:'Trial 10', desc:'Poboljšana tamnomaterijska ploča.',                    who:'Svi brodovi' },
  { id:'sh_void_plate_III', name:'Void Plate III', variant:'III', rarity:'C', icon:'🛡️', shield:2560, regen:64, special:null, cost:{metal:4290, crystal:2820, he3:1128}, source:'Constellation 3', desc:'Napredna tamnomaterijska ploča. Vrhunski common štit.',who:'Svi brodovi' },

  // 11. Srednji Štit — standardni srednji štit
  { id:'sh_srednji_I',   name:'Srednji Štit I',   variant:'I',   rarity:'C', icon:'🛡️', shield:420,  regen:10, special:null, cost:{metal:780,  crystal:500,  he3:200}, source:'Restricted 2',  desc:'Standardni srednji štit. Balansirana zaštita.',       who:'Svi brodovi' },
  { id:'sh_srednji_II',  name:'Srednji Štit II',  variant:'II',  rarity:'C', icon:'🛡️', shield:840,  regen:21, special:null, cost:{metal:1560, crystal:1000, he3:400}, source:'Restricted 8',  desc:'Poboljšani srednji štit.',                             who:'Svi brodovi' },
  { id:'sh_srednji_III', name:'Srednji Štit III', variant:'III', rarity:'C', icon:'🛡️', shield:1340, regen:33, special:null, cost:{metal:2500, crystal:1600, he3:640}, source:'Trial 5', desc:'Napredni srednji štit. Solidan common za srednji tier.',who:'Svi brodovi' },

  // 12. Jaki Štit — pojačani common štit
  { id:'sh_jaki_I',   name:'Jaki Štit I',   variant:'I',   rarity:'C', icon:'🛡️', shield:580,  regen:14, special:null, cost:{metal:1040, crystal:680,  he3:272}, source:'Restricted 4',  desc:'Pojačani common štit. Dobar za napredne borce.',      who:'Svi brodovi' },
  { id:'sh_jaki_II',  name:'Jaki Štit II',  variant:'II',  rarity:'C', icon:'🛡️', shield:1160, regen:29, special:null, cost:{metal:2080, crystal:1360, he3:544}, source:'Trial 2', desc:'Poboljšani jaki štit.',                                who:'Svi brodovi' },
  { id:'sh_jaki_III', name:'Jaki Štit III', variant:'III', rarity:'C', icon:'🛡️', shield:1860, regen:46, special:null, cost:{metal:3330, crystal:2180, he3:872}, source:'Constellation 1', desc:'Napredni jaki štit. Vrhunski common za visoki tier.',  who:'Svi brodovi' },


  // ════════════════════════════════════════════════════════════
  // RARE ŠTITOVI (30) — 10 tipova × 3 nivoa
  // ════════════════════════════════════════════════════════════

  // 1. Phase Curtain — fazna zavjesa (blok)
  { id:'sh_phase_curtain_I',   name:'Phase Curtain I',   variant:'I',   rarity:'R', icon:'💠', shield:1000, regen:25, special:{type:'block',          chance:10, desc:'10% šansa: potpuno blokira napad'},               cost:{metal:2200, crystal:1500, he3:600 }, source:'Instanca 18',  desc:'Fazna zavjesa. Šansa da potpuno blokira napad.',      who:'Svi brodovi' },
  { id:'sh_phase_curtain_II',  name:'Phase Curtain II',  variant:'II',  rarity:'R', icon:'💠', shield:1600, regen:40, special:{type:'block',          chance:10, desc:'10% šansa: potpuno blokira napad'},               cost:{metal:3500, crystal:2400, he3:960 }, source:'Instanca 22',  desc:'Poboljšana fazna zavjesa.',                           who:'Svi brodovi' },
  { id:'sh_phase_curtain_III', name:'Phase Curtain III', variant:'III', rarity:'R', icon:'💠', shield:2200, regen:55, special:{type:'block',          chance:10, desc:'10% šansa: potpuno blokira napad'},               cost:{metal:5200, crystal:3600, he3:1440}, source:'Instanca 26',  desc:'Napredna fazna zavjesa.',                             who:'Svi brodovi' },

  // 2. Particle Veil — čestični zaštitni koprena (stun)
  { id:'sh_particle_veil_I',   name:'Particle Veil I',   variant:'I',   rarity:'R', icon:'⚡', shield:800,  regen:20, special:{type:'stun',           chance:3,  desc:'3% šansa: stunuje napadača 1 rundu'},              cost:{metal:1800, crystal:1200, he3:480 }, source:'Instanca 19',  desc:'Čestična koprena. Šansa za stun neprijatelja.',       who:'Svi brodovi' },
  { id:'sh_particle_veil_II',  name:'Particle Veil II',  variant:'II',  rarity:'R', icon:'⚡', shield:1280, regen:32, special:{type:'stun',           chance:3,  desc:'3% šansa: stunuje napadača 1 rundu'},              cost:{metal:2900, crystal:1920, he3:768 }, source:'Instanca 23',  desc:'Poboljšana čestična koprena.',                        who:'Svi brodovi' },
  { id:'sh_particle_veil_III', name:'Particle Veil III', variant:'III', rarity:'R', icon:'⚡', shield:1760, regen:44, special:{type:'stun',           chance:3,  desc:'3% šansa: stunuje napadača 1 rundu'},              cost:{metal:4300, crystal:2880, he3:1152}, source:'Instanca 27',  desc:'Napredna čestična koprena.',                          who:'Svi brodovi' },

  // 3. Ballistic Ward — balističara brana (kinetic resist)
  { id:'sh_ballistic_ward_I',   name:'Ballistic Ward I',   variant:'I',   rarity:'R', icon:'🔩', shield:900,  regen:22, special:{type:'kinetic_resist',  bonus:20,  desc:'+20% otpornost na Kinetic štetu dok shield traje'},  cost:{metal:2000, crystal:1350, he3:540 }, source:'Instanca 20',  desc:'Balistička brana. Otporna na kinetičke projektile.', who:'Svi brodovi' },
  { id:'sh_ballistic_ward_II',  name:'Ballistic Ward II',  variant:'II',  rarity:'R', icon:'🔩', shield:1440, regen:36, special:{type:'kinetic_resist',  bonus:20,  desc:'+20% otpornost na Kinetic štetu dok shield traje'},  cost:{metal:3200, crystal:2160, he3:864 }, source:'Instanca 24',  desc:'Poboljšana balistička brana.',                       who:'Svi brodovi' },
  { id:'sh_ballistic_ward_III', name:'Ballistic Ward III', variant:'III', rarity:'R', icon:'🔩', shield:1980, regen:50, special:{type:'kinetic_resist',  bonus:20,  desc:'+20% otpornost na Kinetic štetu dok shield traje'},  cost:{metal:4800, crystal:3240, he3:1296}, source:'Instanca 28',  desc:'Napredna balistička brana.',                         who:'Svi brodovi' },

  // 4. Thermal Guard — termalni zaštitni štit (heat resist)
  { id:'sh_thermal_guard_I',   name:'Thermal Guard I',   variant:'I',   rarity:'R', icon:'🔥', shield:900,  regen:22, special:{type:'heat_resist',    bonus:20,  desc:'+20% otpornost na Heat štetu dok shield traje'},   cost:{metal:2000, crystal:1350, he3:540 }, source:'Instanca 21',  desc:'Termalni zaštitni sloj. Otporan na toplotne napade.', who:'Svi brodovi' },
  { id:'sh_thermal_guard_II',  name:'Thermal Guard II',  variant:'II',  rarity:'R', icon:'🔥', shield:1440, regen:36, special:{type:'heat_resist',    bonus:20,  desc:'+20% otpornost na Heat štetu dok shield traje'},   cost:{metal:3200, crystal:2160, he3:864 }, source:'Instanca 25',  desc:'Poboljšani termalni zaštitni sloj.',                  who:'Svi brodovi' },
  { id:'sh_thermal_guard_III', name:'Thermal Guard III', variant:'III', rarity:'R', icon:'🔥', shield:1980, regen:50, special:{type:'heat_resist',    bonus:20,  desc:'+20% otpornost na Heat štetu dok shield traje'},   cost:{metal:4800, crystal:3240, he3:1296}, source:'Instanca 29',  desc:'Napredni termalni zaštitni sloj.',                    who:'Svi brodovi' },

  // 5-orig. Mag-Field Shield — magnetno polje (magnetic resist)
  { id:'sh_mag_field_I',   name:'Mag-Field I',   variant:'I',   rarity:'R', icon:'🧲', shield:900,  regen:22, special:{type:'magnetic_resist', bonus:20,  desc:'+20% otpornost na Magnetic štetu dok shield traje'}, cost:{metal:2000, crystal:1350, he3:540 }, source:'Instanca 22',  desc:'Magnetno polje štita. Otporno na magnetske napade.',  who:'Svi brodovi' },
  { id:'sh_mag_field_II',  name:'Mag-Field II',  variant:'II',  rarity:'R', icon:'🧲', shield:1440, regen:36, special:{type:'magnetic_resist', bonus:20,  desc:'+20% otpornost na Magnetic štetu dok shield traje'}, cost:{metal:3200, crystal:2160, he3:864 }, source:'Instanca 26',  desc:'Poboljšano magnetno polje.',                          who:'Svi brodovi' },
  { id:'sh_mag_field_III', name:'Mag-Field III', variant:'III', rarity:'R', icon:'🧲', shield:1980, regen:50, special:{type:'magnetic_resist', bonus:20,  desc:'+20% otpornost na Magnetic štetu dok shield traje'}, cost:{metal:4800, crystal:3240, he3:1296}, source:'Instanca 30',  desc:'Napredni magnetni štit.',                             who:'Svi brodovi' },

  // Nova: Blast Barrier — eksplozivna brana (explosive resist)
  { id:'sh_blast_barrier_I',   name:'Blast Barrier I',   variant:'I',   rarity:'R', icon:'💣', shield:950,  regen:23, special:{type:'explosive_resist', bonus:20,  desc:'+20% otpornost na Explosive štetu dok shield traje'}, cost:{metal:2100, crystal:1420, he3:568 }, source:'Instanca 23',  desc:'Eksplozivna brana. Otporna na eksplozivna oružja.',   who:'Svi brodovi' },
  { id:'sh_blast_barrier_II',  name:'Blast Barrier II',  variant:'II',  rarity:'R', icon:'💣', shield:1520, regen:38, special:{type:'explosive_resist', bonus:20,  desc:'+20% otpornost na Explosive štetu dok shield traje'}, cost:{metal:3360, crystal:2272, he3:908 }, source:'Instanca 27',  desc:'Poboljšana eksplozivna brana.',                       who:'Svi brodovi' },
  { id:'sh_blast_barrier_III', name:'Blast Barrier III', variant:'III', rarity:'R', icon:'💣', shield:2090, regen:52, special:{type:'explosive_resist', bonus:20,  desc:'+20% otpornost na Explosive štetu dok shield traje'}, cost:{metal:5040, crystal:3408, he3:1363}, source:'Restricted 1', desc:'Napredna eksplozivna brana.',                         who:'Svi brodovi' },

  // 5. Deflector Web — deflektorska mreža (blok viši)
  { id:'sh_deflector_web_I',   name:'Deflector Web I',   variant:'I',   rarity:'R', icon:'🕸️', shield:1200, regen:30, special:{type:'block',          chance:12, desc:'12% šansa: potpuno blokira napad'},               cost:{metal:2600, crystal:1760, he3:704 }, source:'Restricted 1', desc:'Deflektorska mreža. Bolja šansa blokiranja napada.',  who:'Svi brodovi' },
  { id:'sh_deflector_web_II',  name:'Deflector Web II',  variant:'II',  rarity:'R', icon:'🕸️', shield:1920, regen:48, special:{type:'block',          chance:12, desc:'12% šansa: potpuno blokira napad'},               cost:{metal:4200, crystal:2820, he3:1128}, source:'Restricted 3', desc:'Poboljšana deflektorska mreža.',                      who:'Svi brodovi' },
  { id:'sh_deflector_web_III', name:'Deflector Web III', variant:'III', rarity:'R', icon:'🕸️', shield:2640, regen:66, special:{type:'block',          chance:12, desc:'12% šansa: potpuno blokira napad'},               cost:{metal:6200, crystal:4230, he3:1692}, source:'Restricted 5', desc:'Napredna deflektorska mreža.',                         who:'Svi brodovi' },

  // 6. Ionic Shell — jonska ljuska (stun viši)
  { id:'sh_ionic_shell_I',   name:'Ionic Shell I',   variant:'I',   rarity:'R', icon:'⚡', shield:1000, regen:25, special:{type:'stun',           chance:5,  desc:'5% šansa: stunuje napadača 1 rundu'},              cost:{metal:2200, crystal:1500, he3:600 }, source:'Restricted 2', desc:'Jonska ljuska s visokim nabojem. Stunuje napadače.',  who:'Svi brodovi' },
  { id:'sh_ionic_shell_II',  name:'Ionic Shell II',  variant:'II',  rarity:'R', icon:'⚡', shield:1600, regen:40, special:{type:'stun',           chance:5,  desc:'5% šansa: stunuje napadača 1 rundu'},              cost:{metal:3500, crystal:2400, he3:960 }, source:'Restricted 4', desc:'Poboljšana jonska ljuska.',                            who:'Svi brodovi' },
  { id:'sh_ionic_shell_III', name:'Ionic Shell III', variant:'III', rarity:'R', icon:'⚡', shield:2200, regen:55, special:{type:'stun',           chance:5,  desc:'5% šansa: stunuje napadača 1 rundu'},              cost:{metal:5200, crystal:3600, he3:1440}, source:'Restricted 6', desc:'Napredna jonska ljuska.',                              who:'Svi brodovi' },

  // 7. Ember Diffuser — ember difuzor (heat resist viši)
  { id:'sh_ember_diffuser_I',   name:'Ember Diffuser I',   variant:'I',   rarity:'R', icon:'🔥', shield:1100, regen:27, special:{type:'heat_resist',    bonus:28,  desc:'+28% otpornost na Heat štetu dok shield traje'},   cost:{metal:2400, crystal:1620, he3:648 }, source:'Instanca 22',  desc:'Ember difuzor. Rasipa termalne talase.',              who:'Svi brodovi' },
  { id:'sh_ember_diffuser_II',  name:'Ember Diffuser II',  variant:'II',  rarity:'R', icon:'🔥', shield:1760, regen:44, special:{type:'heat_resist',    bonus:28,  desc:'+28% otpornost na Heat štetu dok shield traje'},   cost:{metal:3840, crystal:2592, he3:1036}, source:'Instanca 26',  desc:'Poboljšani ember difuzor.',                           who:'Svi brodovi' },
  { id:'sh_ember_diffuser_III', name:'Ember Diffuser III', variant:'III', rarity:'R', icon:'🔥', shield:2420, regen:60, special:{type:'heat_resist',    bonus:28,  desc:'+28% otpornost na Heat štetu dok shield traje'},   cost:{metal:5700, crystal:3888, he3:1556}, source:'Instanca 30',  desc:'Napredni ember difuzor.',                             who:'Svi brodovi' },

  // 8. Pulse Nullifier — impulsni poništavač (magnetic resist viši)
  { id:'sh_pulse_nullifier_I',   name:'Pulse Nullifier I',   variant:'I',   rarity:'R', icon:'🧲', shield:1100, regen:27, special:{type:'magnetic_resist', bonus:28,  desc:'+28% otpornost na Magnetic štetu dok shield traje'}, cost:{metal:2400, crystal:1620, he3:648 }, source:'Instanca 23',  desc:'Impulsni poništavač. Apsorbuje magnetske udare.',     who:'Svi brodovi' },
  { id:'sh_pulse_nullifier_II',  name:'Pulse Nullifier II',  variant:'II',  rarity:'R', icon:'🧲', shield:1760, regen:44, special:{type:'magnetic_resist', bonus:28,  desc:'+28% otpornost na Magnetic štetu dok shield traje'}, cost:{metal:3840, crystal:2592, he3:1036}, source:'Instanca 27',  desc:'Poboljšani impulsni poništavač.',                     who:'Svi brodovi' },
  { id:'sh_pulse_nullifier_III', name:'Pulse Nullifier III', variant:'III', rarity:'R', icon:'🧲', shield:2420, regen:60, special:{type:'magnetic_resist', bonus:28,  desc:'+28% otpornost na Magnetic štetu dok shield traje'}, cost:{metal:5700, crystal:3888, he3:1556}, source:'Restricted 7', desc:'Napredni impulsni poništavač.',                        who:'Svi brodovi' },

  // 9. Mirror Plate — ogledalna ploča (reflect nizak)
  { id:'sh_mirror_plate_I',   name:'Mirror Plate I',   variant:'I',   rarity:'R', icon:'🪞', shield:1300, regen:32, special:{type:'reflect',        chance:8,  desc:'8% šansa: odbija 30% primljene štete nazad'},     cost:{metal:2800, crystal:1900, he3:760 }, source:'Restricted 3', desc:'Ogledalna ploča. Odbija dio štete na napadača.',      who:'Svi brodovi' },
  { id:'sh_mirror_plate_II',  name:'Mirror Plate II',  variant:'II',  rarity:'R', icon:'🪞', shield:2080, regen:52, special:{type:'reflect',        chance:8,  desc:'8% šansa: odbija 30% primljene štete nazad'},     cost:{metal:4500, crystal:3040, he3:1216}, source:'Restricted 5', desc:'Poboljšana ogledalna ploča.',                          who:'Svi brodovi' },
  { id:'sh_mirror_plate_III', name:'Mirror Plate III', variant:'III', rarity:'R', icon:'🪞', shield:2860, regen:71, special:{type:'reflect',        chance:8,  desc:'8% šansa: odbija 30% primljene štete nazad'},     cost:{metal:6650, crystal:4560, he3:1824}, source:'Restricted 8', desc:'Napredna ogledalna ploča.',                            who:'Svi brodovi' },

  // 11. Heat Diffuser — difuzor topline (heat resist)
  { id:'sh_heat_diff_I',   name:'Heat Diffuser I',   variant:'I',   rarity:'R', icon:'🔥', shield:950,  regen:24, special:{type:'heat_resist', bonus:20, desc:'+20% otpornost na Heat štetu dok shield traje'}, cost:{metal:2100, crystal:1420, he3:568}, source:'Instanca 21', desc:'Difuzor topline. Rasipa toplotne napade.',         who:'Svi brodovi' },
  { id:'sh_heat_diff_II',  name:'Heat Diffuser II',  variant:'II',  rarity:'R', icon:'🔥', shield:1520, regen:38, special:{type:'heat_resist', bonus:20, desc:'+20% otpornost na Heat štetu dok shield traje'}, cost:{metal:3360, crystal:2272, he3:909}, source:'Instanca 25', desc:'Poboljšani difuzor topline.',                     who:'Svi brodovi' },
  { id:'sh_heat_diff_III', name:'Heat Diffuser III', variant:'III', rarity:'R', icon:'🔥', shield:2090, regen:52, special:{type:'heat_resist', bonus:20, desc:'+20% otpornost na Heat štetu dok shield traje'}, cost:{metal:4620, crystal:3124, he3:1250}, source:'Instanca 28', desc:'Napredni difuzor topline. Odlican za kasni tier.',who:'Svi brodovi' },

  // 10. Charge Accumulator — akumulator naboja (extra regen)
  { id:'sh_charge_acc_I',   name:'Charge Accumulator I',   variant:'I',   rarity:'R', icon:'♻️', shield:1400, regen:35, special:{type:'extra_regen',    bonus:30,  desc:'+30% brži shield regen'},                         cost:{metal:3000, crystal:2040, he3:816 }, source:'Restricted 4', desc:'Akumulator naboja. Ubrzava obnavljanje štita.',       who:'Svi brodovi' },
  { id:'sh_charge_acc_II',  name:'Charge Accumulator II',  variant:'II',  rarity:'R', icon:'♻️', shield:2240, regen:56, special:{type:'extra_regen',    bonus:30,  desc:'+30% brži shield regen'},                         cost:{metal:4800, crystal:3264, he3:1306}, source:'Restricted 6', desc:'Poboljšani akumulator naboja.',                        who:'Svi brodovi' },
  { id:'sh_charge_acc_III', name:'Charge Accumulator III', variant:'III', rarity:'R', icon:'♻️', shield:3080, regen:77, special:{type:'extra_regen',    bonus:30,  desc:'+30% brži shield regen'},                         cost:{metal:7100, crystal:4896, he3:1958}, source:'Restricted 9', desc:'Napredni akumulator naboja. Odličan za duge borbe.',   who:'Svi brodovi' },


  // ════════════════════════════════════════════════════════════
  // EPIC ŠTITOVI (36) — 12 tipova × 3 nivoa
  // ════════════════════════════════════════════════════════════

  // 1. Quantum Veil — kvantna koprena (blok jak)
  { id:'sh_quantum_veil_I',   name:'Quantum Veil I',   variant:'I',   rarity:'E', icon:'🌀', shield:2000, regen:50,  special:{type:'block',          chance:15, desc:'15% šansa: potpuno blokira napad'},               cost:{metal:4200,  crystal:3200,  he3:1600 }, source:'Restricted 2',  desc:'Kvantna koprena. Visoka šansa blokiranja napada.',    who:'Svi brodovi' },
  { id:'sh_quantum_veil_II',  name:'Quantum Veil II',  variant:'II',  rarity:'E', icon:'🌀', shield:3200, regen:80,  special:{type:'block',          chance:15, desc:'15% šansa: potpuno blokira napad'},               cost:{metal:6700,  crystal:5120,  he3:2560 }, source:'Restricted 4',  desc:'Poboljšana kvantna koprena.',                         who:'Svi brodovi' },
  { id:'sh_quantum_veil_III', name:'Quantum Veil III', variant:'III', rarity:'E', icon:'🌀', shield:4800, regen:120, special:{type:'block',          chance:15, desc:'15% šansa: potpuno blokira napad'},               cost:{metal:10100, crystal:7680,  he3:3840 }, source:'Restricted 6',  desc:'Napredna kvantna koprena.',                           who:'Svi brodovi' },

  // 2. Nova Barrier — nova barijera (explosion retaliate nizak)
  { id:'sh_nova_barrier_I',   name:'Nova Barrier I',   variant:'I',   rarity:'E', icon:'💥', shield:1800, regen:45,  special:{type:'explosion_retaliate', chance:5,  desc:'5% šansa: kontra-eksplozija pri primanju štete'},  cost:{metal:3800,  crystal:2880,  he3:1440 }, source:'Restricted 7',  desc:'Nova barijera. Ponekad odgovara eksplozijom.',        who:'Svi brodovi' },
  { id:'sh_nova_barrier_II',  name:'Nova Barrier II',  variant:'II',  rarity:'E', icon:'💥', shield:2880, regen:72,  special:{type:'explosion_retaliate', chance:5,  desc:'5% šansa: kontra-eksplozija pri primanju štete'},  cost:{metal:6080,  crystal:4608,  he3:2304 }, source:'Restricted 9',  desc:'Poboljšana nova barijera.',                           who:'Svi brodovi' },
  { id:'sh_nova_barrier_III', name:'Nova Barrier III', variant:'III', rarity:'E', icon:'💥', shield:4320, regen:108, special:{type:'explosion_retaliate', chance:5,  desc:'5% šansa: kontra-eksplozija pri primanju štete'},  cost:{metal:9120,  crystal:6912,  he3:3456 }, source:'Trial 2',        desc:'Napredna nova barijera.',                             who:'Svi brodovi' },

  // 3. Kinetic Fortress — kinetička tvrđava (kinetic resist jak)
  { id:'sh_kinetic_fortress_I',   name:'Kinetic Fortress I',   variant:'I',   rarity:'E', icon:'🔩', shield:1900, regen:47,  special:{type:'kinetic_resist',  bonus:35,  desc:'+35% otpornost na Kinetic štetu dok shield traje'},  cost:{metal:4000,  crystal:3040,  he3:1520 }, source:'Restricted 3',  desc:'Kinetička tvrđava. Jaka otpornost na projektile.',    who:'Svi brodovi' },
  { id:'sh_kinetic_fortress_II',  name:'Kinetic Fortress II',  variant:'II',  rarity:'E', icon:'🔩', shield:3040, regen:76,  special:{type:'kinetic_resist',  bonus:35,  desc:'+35% otpornost na Kinetic štetu dok shield traje'},  cost:{metal:6400,  crystal:4864,  he3:2432 }, source:'Restricted 5',  desc:'Poboljšana kinetička tvrđava.',                       who:'Svi brodovi' },
  { id:'sh_kinetic_fortress_III', name:'Kinetic Fortress III', variant:'III', rarity:'E', icon:'🔩', shield:4560, regen:114, special:{type:'kinetic_resist',  bonus:35,  desc:'+35% otpornost na Kinetic štetu dok shield traje'},  cost:{metal:9600,  crystal:7296,  he3:3648 }, source:'Trial 3',        desc:'Napredna kinetička tvrđava.',                         who:'Svi brodovi' },

  // 4. Plasma Guard — plazma straža (heat resist jak)
  { id:'sh_plasma_guard_I',   name:'Plasma Guard I',   variant:'I',   rarity:'E', icon:'🔥', shield:1900, regen:47,  special:{type:'heat_resist',    bonus:35,  desc:'+35% otpornost na Heat štetu dok shield traje'},   cost:{metal:4000,  crystal:3040,  he3:1520 }, source:'Restricted 4',  desc:'Plazma straža. Jaka otpornost na termalne napade.',   who:'Svi brodovi' },
  { id:'sh_plasma_guard_II',  name:'Plasma Guard II',  variant:'II',  rarity:'E', icon:'🔥', shield:3040, regen:76,  special:{type:'heat_resist',    bonus:35,  desc:'+35% otpornost na Heat štetu dok shield traje'},   cost:{metal:6400,  crystal:4864,  he3:2432 }, source:'Restricted 6',  desc:'Poboljšana plazma straža.',                           who:'Svi brodovi' },
  { id:'sh_plasma_guard_III', name:'Plasma Guard III', variant:'III', rarity:'E', icon:'🔥', shield:4560, regen:114, special:{type:'heat_resist',    bonus:35,  desc:'+35% otpornost na Heat štetu dok shield traje'},   cost:{metal:9600,  crystal:7296,  he3:3648 }, source:'Trial 4',        desc:'Napredna plazma straža.',                             who:'Svi brodovi' },

  // 5. Void Field — prazninska polja (magnetic resist jak)
  { id:'sh_void_field_I',   name:'Void Field I',   variant:'I',   rarity:'E', icon:'🧲', shield:1900, regen:47,  special:{type:'magnetic_resist', bonus:35,  desc:'+35% otpornost na Magnetic štetu dok shield traje'}, cost:{metal:4000,  crystal:3040,  he3:1520 }, source:'Restricted 7',  desc:'Prazninska polja. Jaka otpornost na magnetske napade.',who:'Svi brodovi' },
  { id:'sh_void_field_II',  name:'Void Field II',  variant:'II',  rarity:'E', icon:'🧲', shield:3040, regen:76,  special:{type:'magnetic_resist', bonus:35,  desc:'+35% otpornost na Magnetic štetu dok shield traje'}, cost:{metal:6400,  crystal:4864,  he3:2432 }, source:'Restricted 9',  desc:'Poboljšano prazninska polja.',                        who:'Svi brodovi' },
  { id:'sh_void_field_III', name:'Void Field III', variant:'III', rarity:'E', icon:'🧲', shield:4560, regen:114, special:{type:'magnetic_resist', bonus:35,  desc:'+35% otpornost na Magnetic štetu dok shield traje'}, cost:{metal:9600,  crystal:7296,  he3:3648 }, source:'Trial 5',        desc:'Napredna prazninska polja.',                          who:'Svi brodovi' },

  // 6-nova: Shockwave Shell — udarni val ljuska (explosive resist jak)
  { id:'sh_shockwave_shell_I',   name:'Shockwave Shell I',   variant:'I',   rarity:'E', icon:'💣', shield:1900, regen:47,  special:{type:'explosive_resist', bonus:35,  desc:'+35% otpornost na Explosive štetu dok shield traje'}, cost:{metal:4000,  crystal:3040,  he3:1520 }, source:'Restricted 8',  desc:'Udarni val ljuska. Jaka otpornost na eksplozive.',    who:'Svi brodovi' },
  { id:'sh_shockwave_shell_II',  name:'Shockwave Shell II',  variant:'II',  rarity:'E', icon:'💣', shield:3040, regen:76,  special:{type:'explosive_resist', bonus:35,  desc:'+35% otpornost na Explosive štetu dok shield traje'}, cost:{metal:6400,  crystal:4864,  he3:2432 }, source:'Restricted 10', desc:'Poboljšana udarni val ljuska.',                       who:'Svi brodovi' },
  { id:'sh_shockwave_shell_III', name:'Shockwave Shell III', variant:'III', rarity:'E', icon:'💣', shield:4560, regen:114, special:{type:'explosive_resist', bonus:35,  desc:'+35% otpornost na Explosive štetu dok shield traje'}, cost:{metal:9600,  crystal:7296,  he3:3648 }, source:'Trial 6',        desc:'Napredna udarni val ljuska.',                         who:'Svi brodovi' },

  // 5. Echo Mirror — odjekujuće ogledalo (reflect jak)
  { id:'sh_echo_mirror_I',   name:'Echo Mirror I',   variant:'I',   rarity:'E', icon:'🪞', shield:2200, regen:55,  special:{type:'reflect',        chance:15, desc:'15% šansa: odbija 30% primljene štete nazad'},     cost:{metal:4600,  crystal:3520,  he3:1760 }, source:'Trial 1',        desc:'Odjekujuće ogledalo. Odbija štetu na napadača.',      who:'Svi brodovi' },
  { id:'sh_echo_mirror_II',  name:'Echo Mirror II',  variant:'II',  rarity:'E', icon:'🪞', shield:3520, regen:88,  special:{type:'reflect',        chance:15, desc:'15% šansa: odbija 30% primljene štete nazad'},     cost:{metal:7360,  crystal:5632,  he3:2816 }, source:'Trial 4',        desc:'Poboljšano odjekujuće ogledalo.',                     who:'Svi brodovi' },
  { id:'sh_echo_mirror_III', name:'Echo Mirror III', variant:'III', rarity:'E', icon:'🪞', shield:5280, regen:132, special:{type:'reflect',        chance:15, desc:'15% šansa: odbija 30% primljene štete nazad'},     cost:{metal:11040, crystal:8448,  he3:4224 }, source:'Trial 7',        desc:'Napredni odjekujuće ogledalo.',                       who:'Svi brodovi' },

  // 6. Phoenix Shell — feniksonska ljuska (extra regen jak)
  { id:'sh_phoenix_shell_I',   name:'Phoenix Shell I',   variant:'I',   rarity:'E', icon:'♻️', shield:2000, regen:50,  special:{type:'extra_regen',    bonus:55,  desc:'+55% brži shield regen'},                         cost:{metal:4200,  crystal:3200,  he3:1600 }, source:'Trial 2',        desc:'Feniksonska ljuska. Brza regeneracija štita.',        who:'Svi brodovi' },
  { id:'sh_phoenix_shell_II',  name:'Phoenix Shell II',  variant:'II',  rarity:'E', icon:'♻️', shield:3200, regen:80,  special:{type:'extra_regen',    bonus:55,  desc:'+55% brži shield regen'},                         cost:{metal:6720,  crystal:5120,  he3:2560 }, source:'Trial 5',        desc:'Poboljšana feniksonska ljuska.',                      who:'Svi brodovi' },
  { id:'sh_phoenix_shell_III', name:'Phoenix Shell III', variant:'III', rarity:'E', icon:'♻️', shield:4800, regen:120, special:{type:'extra_regen',    bonus:55,  desc:'+55% brži shield regen'},                         cost:{metal:10080, crystal:7680,  he3:3840 }, source:'Trial 8',        desc:'Napredna feniksonska ljuska.',                        who:'Svi brodovi' },

  // 7. Titan Core — titan jezgro (max shield boost)
  { id:'sh_titan_core_I',   name:'Titan Core I',   variant:'I',   rarity:'E', icon:'🏋️', shield:2600, regen:65,  special:{type:'max_shield_boost', bonus:28, desc:'+28% maksimalni shield kapacitet'},                cost:{metal:5500,  crystal:4160,  he3:2080 }, source:'Restricted 8',  desc:'Titan jezgro. Povećava ukupni shield kapacitet.',     who:'Svi brodovi' },
  { id:'sh_titan_core_II',  name:'Titan Core II',  variant:'II',  rarity:'E', icon:'🏋️', shield:4160, regen:104, special:{type:'max_shield_boost', bonus:28, desc:'+28% maksimalni shield kapacitet'},                cost:{metal:8800,  crystal:6656,  he3:3328 }, source:'Trial 3',        desc:'Poboljšano titan jezgro.',                            who:'Svi brodovi' },
  { id:'sh_titan_core_III', name:'Titan Core III', variant:'III', rarity:'E', icon:'🏋️', shield:6240, regen:156, special:{type:'max_shield_boost', bonus:28, desc:'+28% maksimalni shield kapacitet'},                cost:{metal:13200, crystal:9984,  he3:4992 }, source:'Trial 6',        desc:'Napredni titan jezgro.',                              who:'Svi brodovi' },

  // 8. Storm Absorber — olujni apsorber (absorb)
  { id:'sh_storm_absorber_I',   name:'Storm Absorber I',   variant:'I',   rarity:'E', icon:'🌊', shield:2400, regen:60,  special:{type:'absorb',         amount:20, desc:'Upija 20% primljene štete, pretvara u shield regen'}, cost:{metal:5000,  crystal:3840,  he3:1920 }, source:'Restricted 9',  desc:'Olujni apsorber. Pretvara dio štete u regen.',        who:'Svi brodovi' },
  { id:'sh_storm_absorber_II',  name:'Storm Absorber II',  variant:'II',  rarity:'E', icon:'🌊', shield:3840, regen:96,  special:{type:'absorb',         amount:20, desc:'Upija 20% primljene štete, pretvara u shield regen'}, cost:{metal:8000,  crystal:6144,  he3:3072 }, source:'Trial 2',        desc:'Poboljšani olujni apsorber.',                         who:'Svi brodovi' },
  { id:'sh_storm_absorber_III', name:'Storm Absorber III', variant:'III', rarity:'E', icon:'🌊', shield:5760, regen:144, special:{type:'absorb',         amount:20, desc:'Upija 20% primljene štete, pretvara u shield regen'}, cost:{metal:12000, crystal:9216,  he3:4608 }, source:'Trial 5',        desc:'Napredni olujni apsorber.',                           who:'Svi brodovi' },

  // 9. Flash Gate — blesak kapija (instant recovery)
  { id:'sh_flash_gate_I',   name:'Flash Gate I',   variant:'I',   rarity:'E', icon:'⚡', shield:2300, regen:57,  special:{type:'instant_recovery', chance:5, desc:'5% šansa: trenutno vraća cijeli shield'},           cost:{metal:4800,  crystal:3680,  he3:1840 }, source:'Restricted 10', desc:'Blesak kapija. Šansa za trenutni oporavak štita.',    who:'Svi brodovi' },
  { id:'sh_flash_gate_II',  name:'Flash Gate II',  variant:'II',  rarity:'E', icon:'⚡', shield:3680, regen:92,  special:{type:'instant_recovery', chance:5, desc:'5% šansa: trenutno vraća cijeli shield'},           cost:{metal:7680,  crystal:5888,  he3:2944 }, source:'Trial 4',        desc:'Poboljšana blesak kapija.',                           who:'Svi brodovi' },
  { id:'sh_flash_gate_III', name:'Flash Gate III', variant:'III', rarity:'E', icon:'⚡', shield:5520, regen:138, special:{type:'instant_recovery', chance:5, desc:'5% šansa: trenutno vraća cijeli shield'},           cost:{metal:11520, crystal:8832,  he3:4416 }, source:'Trial 7',        desc:'Napredna blesak kapija.',                             who:'Svi brodovi' },

  // 10. Arc Deflector — lučni deflktor (block + reflect)
  { id:'sh_arc_deflector_I',   name:'Arc Deflector I',   variant:'I',   rarity:'E', icon:'🌐', shield:2500, regen:62,  special:{type:'block_reflect', block:12, reflect:15, desc:'12% blok + 15% odbijanje štete nazad'},         cost:{metal:5200,  crystal:4000,  he3:2000 }, source:'Trial 1',        desc:'Lučni deflektor. Kombinacija bloka i odbijanja.',     who:'Svi brodovi' },
  { id:'sh_arc_deflector_II',  name:'Arc Deflector II',  variant:'II',  rarity:'E', icon:'🌐', shield:4000, regen:100, special:{type:'block_reflect', block:12, reflect:15, desc:'12% blok + 15% odbijanje štete nazad'},         cost:{metal:8320,  crystal:6400,  he3:3200 }, source:'Trial 4',        desc:'Poboljšani lučni deflektor.',                         who:'Svi brodovi' },
  { id:'sh_arc_deflector_III', name:'Arc Deflector III', variant:'III', rarity:'E', icon:'🌐', shield:6000, regen:150, special:{type:'block_reflect', block:12, reflect:15, desc:'12% blok + 15% odbijanje štete nazad'},         cost:{metal:12480, crystal:9600,  he3:4800 }, source:'Trial 7',        desc:'Napredni lučni deflektor.',                           who:'Svi brodovi' },

  // 11. Cryo Ward — kriogena straža (stun jak)
  { id:'sh_cryo_ward_I',   name:'Cryo Ward I',   variant:'I',   rarity:'E', icon:'❄️', shield:1700, regen:42,  special:{type:'stun',           chance:7,  desc:'7% šansa: stunuje napadača 1 rundu'},              cost:{metal:3600,  crystal:2720,  he3:1360 }, source:'Restricted 8',  desc:'Kriogena straža. Zamrzava napadača šansom.',          who:'Svi brodovi' },
  { id:'sh_cryo_ward_II',  name:'Cryo Ward II',  variant:'II',  rarity:'E', icon:'❄️', shield:2720, regen:68,  special:{type:'stun',           chance:7,  desc:'7% šansa: stunuje napadača 1 rundu'},              cost:{metal:5760,  crystal:4352,  he3:2176 }, source:'Trial 3',        desc:'Poboljšana kriogena straža.',                         who:'Svi brodovi' },
  { id:'sh_cryo_ward_III', name:'Cryo Ward III', variant:'III', rarity:'E', icon:'❄️', shield:4080, regen:102, special:{type:'stun',           chance:7,  desc:'7% šansa: stunuje napadača 1 rundu'},              cost:{metal:8640,  crystal:6528,  he3:3264 }, source:'Trial 6',        desc:'Napredna kriogena straža.',                           who:'Svi brodovi' },

  // 12. Detonator Field — detonatorsko polje (explosion retaliate jak)
  { id:'sh_detonator_field_I',   name:'Detonator Field I',   variant:'I',   rarity:'E', icon:'💥', shield:2100, regen:52,  special:{type:'explosion_retaliate', chance:10, desc:'10% šansa: kontra-eksplozija pri primanju štete'}, cost:{metal:4400,  crystal:3360,  he3:1680 }, source:'Trial 2',        desc:'Detonatorsko polje. Česta eksplozivna kontra.',       who:'Svi brodovi' },
  { id:'sh_detonator_field_II',  name:'Detonator Field II',  variant:'II',  rarity:'E', icon:'💥', shield:3360, regen:84,  special:{type:'explosion_retaliate', chance:10, desc:'10% šansa: kontra-eksplozija pri primanju štete'}, cost:{metal:7040,  crystal:5376,  he3:2688 }, source:'Trial 5',        desc:'Poboljšano detonatorsko polje.',                      who:'Svi brodovi' },
  { id:'sh_detonator_field_III', name:'Detonator Field III', variant:'III', rarity:'E', icon:'💥', shield:5040, regen:126, special:{type:'explosion_retaliate', chance:10, desc:'10% šansa: kontra-eksplozija pri primanju štete'}, cost:{metal:10560, crystal:8064,  he3:4032 }, source:'Trial 8',        desc:'Napredni detonatorsko polje.',                        who:'Svi brodovi' },


  // ════════════════════════════════════════════════════════════
  // LEGENDARY ŠTITOVI (24) — 7 tipova × 3 nivoa + 3 Divine
  // ════════════════════════════════════════════════════════════

  // 1. Aegis Prime — vrhunski blok štit
  { id:'sh_aegis_prime_I',   name:'Aegis Prime I',   variant:'I',   rarity:'L', icon:'⚜️', shield:4000,  regen:100, special:{type:'block',          chance:22, desc:'22% šansa: potpuno blokira napad'},               cost:{metal:8000,  crystal:6400,  he3:3200 }, source:'Trial 5',        desc:'Aegis Prime. Vrhunska šansa blokiranja napada.',       who:'Svi brodovi' },
  { id:'sh_aegis_prime_II',  name:'Aegis Prime II',  variant:'II',  rarity:'L', icon:'⚜️', shield:6400,  regen:160, special:{type:'block',          chance:22, desc:'22% šansa: potpuno blokira napad'},               cost:{metal:12800, crystal:10240, he3:5120 }, source:'Trial 7',        desc:'Poboljšani Aegis Prime.',                             who:'Svi brodovi' },
  { id:'sh_aegis_prime_III', name:'Aegis Prime III', variant:'III', rarity:'L', icon:'⚜️', shield:9600,  regen:240, special:{type:'block',          chance:22, desc:'22% šansa: potpuno blokira napad'},               cost:{metal:19200, crystal:15360, he3:7680 }, source:'Trial 10',       desc:'Napredni Aegis Prime. Jedan od najjačih blok štitova.',who:'Svi brodovi' },

  // 2. Eternal Fortress — vječna tvrđava (max shield boost jak)
  { id:'sh_eternal_fortress_I',   name:'Eternal Fortress I',   variant:'I',   rarity:'L', icon:'🏰', shield:5000,  regen:125, special:{type:'max_shield_boost', bonus:42, desc:'+42% maksimalni shield kapacitet'},                cost:{metal:10000, crystal:8000,  he3:4000 }, source:'Trial 6',        desc:'Vječna tvrđava. Masivni shield kapacitet.',           who:'Svi brodovi' },
  { id:'sh_eternal_fortress_II',  name:'Eternal Fortress II',  variant:'II',  rarity:'L', icon:'🏰', shield:8000,  regen:200, special:{type:'max_shield_boost', bonus:42, desc:'+42% maksimalni shield kapacitet'},                cost:{metal:16000, crystal:12800, he3:6400 }, source:'Trial 8',        desc:'Poboljšana Eternal Fortress.',                        who:'Svi brodovi' },
  { id:'sh_eternal_fortress_III', name:'Eternal Fortress III', variant:'III', rarity:'L', icon:'🏰', shield:12000, regen:300, special:{type:'max_shield_boost', bonus:42, desc:'+42% maksimalni shield kapacitet'},                cost:{metal:24000, crystal:19200, he3:9600 }, source:'Boss Event',     desc:'Napredna Eternal Fortress. Legendarna tvrđava.',      who:'Svi brodovi' },

  // 3. Bulwark Prime — vrhunska brana (kinetic resist jak)
  { id:'sh_bulwark_prime_I',   name:'Bulwark Prime I',   variant:'I',   rarity:'L', icon:'🔩', shield:4200,  regen:105, special:{type:'kinetic_resist',  bonus:50,  desc:'+50% otpornost na Kinetic štetu dok shield traje'},  cost:{metal:8400,  crystal:6720,  he3:3360 }, source:'Trial 5',        desc:'Vrhunska brana. Gotovo imuna na kinetičke napade.',   who:'Svi brodovi' },
  { id:'sh_bulwark_prime_II',  name:'Bulwark Prime II',  variant:'II',  rarity:'L', icon:'🔩', shield:6720,  regen:168, special:{type:'kinetic_resist',  bonus:50,  desc:'+50% otpornost na Kinetic štetu dok shield traje'},  cost:{metal:13440, crystal:10752, he3:5376 }, source:'Trial 7',        desc:'Poboljšana Bulwark Prime.',                           who:'Svi brodovi' },
  { id:'sh_bulwark_prime_III', name:'Bulwark Prime III', variant:'III', rarity:'L', icon:'🔩', shield:10080, regen:252, special:{type:'kinetic_resist',  bonus:50,  desc:'+50% otpornost na Kinetic štetu dok shield traje'},  cost:{metal:20160, crystal:16128, he3:8064 }, source:'Trial 10',       desc:'Napredni Bulwark Prime. Legendarni kinetički štit.',  who:'Svi brodovi' },

  // 4. Celestial Mirror — nebeski reflektor (reflect jak)
  { id:'sh_celestial_mirror_I',   name:'Celestial Mirror I',   variant:'I',   rarity:'L', icon:'🪞', shield:4500,  regen:112, special:{type:'reflect',        chance:22, desc:'22% šansa: odbija 30% primljene štete nazad'},     cost:{metal:9000,  crystal:7200,  he3:3600 }, source:'Trial 6',        desc:'Nebeski reflektor. Odbija veliku količinu štete.',    who:'Svi brodovi' },
  { id:'sh_celestial_mirror_II',  name:'Celestial Mirror II',  variant:'II',  rarity:'L', icon:'🪞', shield:7200,  regen:180, special:{type:'reflect',        chance:22, desc:'22% šansa: odbija 30% primljene štete nazad'},     cost:{metal:14400, crystal:11520, he3:5760 }, source:'Trial 8',        desc:'Poboljšani nebeski reflektor.',                       who:'Svi brodovi' },
  { id:'sh_celestial_mirror_III', name:'Celestial Mirror III', variant:'III', rarity:'L', icon:'🪞', shield:10800, regen:270, special:{type:'reflect',        chance:22, desc:'22% šansa: odbija 30% primljene štete nazad'},     cost:{metal:21600, crystal:17280, he3:8640 }, source:'Constellation',  desc:'Napredni nebeski reflektor. Constellation ekskluziv.', who:'Svi brodovi' },

  // 5. Supernova Shell — supernova ljuska (explosion retaliate jak)
  { id:'sh_supernova_shell_I',   name:'Supernova Shell I',   variant:'I',   rarity:'L', icon:'💥', shield:4200,  regen:105, special:{type:'explosion_retaliate', chance:15, desc:'15% šansa: masivna kontra-eksplozija pri primanju štete'}, cost:{metal:8400,  crystal:6720,  he3:3360 }, source:'Trial 6',        desc:'Supernova ljuska. Česta eksplozivna retalijacija.',   who:'Svi brodovi' },
  { id:'sh_supernova_shell_II',  name:'Supernova Shell II',  variant:'II',  rarity:'L', icon:'💥', shield:6720,  regen:168, special:{type:'explosion_retaliate', chance:15, desc:'15% šansa: masivna kontra-eksplozija pri primanju štete'}, cost:{metal:13440, crystal:10752, he3:5376 }, source:'Trial 9',        desc:'Poboljšana supernova ljuska.',                        who:'Svi brodovi' },
  { id:'sh_supernova_shell_III', name:'Supernova Shell III', variant:'III', rarity:'L', icon:'💥', shield:10080, regen:252, special:{type:'explosion_retaliate', chance:15, desc:'15% šansa: masivna kontra-eksplozija pri primanju štete'}, cost:{metal:20160, crystal:16128, he3:8064 }, source:'Boss Event',     desc:'Napredna supernova ljuska.',                          who:'Svi brodovi' },

  // Nova: Detonation Ward — detonacijska straža (explosive resist jak)
  { id:'sh_detonation_ward_I',   name:'Detonation Ward I',   variant:'I',   rarity:'L', icon:'💣', shield:4200,  regen:105, special:{type:'explosive_resist', bonus:50,  desc:'+50% otpornost na Explosive štetu dok shield traje'}, cost:{metal:8400,  crystal:6720,  he3:3360 }, source:'Trial 6',        desc:'Detonacijska straža. Gotovo imuna na eksplozive.',    who:'Svi brodovi' },
  { id:'sh_detonation_ward_II',  name:'Detonation Ward II',  variant:'II',  rarity:'L', icon:'💣', shield:6720,  regen:168, special:{type:'explosive_resist', bonus:50,  desc:'+50% otpornost na Explosive štetu dok shield traje'}, cost:{metal:13440, crystal:10752, he3:5376 }, source:'Trial 9',        desc:'Poboljšana detonacijska straža.',                     who:'Svi brodovi' },
  { id:'sh_detonation_ward_III', name:'Detonation Ward III', variant:'III', rarity:'L', icon:'💣', shield:10080, regen:252, special:{type:'explosive_resist', bonus:50,  desc:'+50% otpornost na Explosive štetu dok shield traje'}, cost:{metal:20160, crystal:16128, he3:8064 }, source:'Boss Event',     desc:'Napredna detonacijska straža. Boss Event ekskluziv.', who:'Svi brodovi' },

  // 5. Infinity Regen — beskonačni regen (extra regen jak)
  { id:'sh_infinity_regen_I',   name:'Infinity Regen I',   variant:'I',   rarity:'L', icon:'♾️', shield:3500,  regen:87,  special:{type:'extra_regen',    bonus:85,  desc:'+85% brži shield regen — gotovo konstantna obnova'}, cost:{metal:7000,  crystal:5600,  he3:2800 }, source:'Trial 7',        desc:'Beskonačni regen. Izuzetno brza regeneracija.',       who:'Svi brodovi' },
  { id:'sh_infinity_regen_II',  name:'Infinity Regen II',  variant:'II',  rarity:'L', icon:'♾️', shield:5600,  regen:140, special:{type:'extra_regen',    bonus:85,  desc:'+85% brži shield regen — gotovo konstantna obnova'}, cost:{metal:11200, crystal:8960,  he3:4480 }, source:'Trial 9',        desc:'Poboljšani beskonačni regen.',                        who:'Svi brodovi' },
  { id:'sh_infinity_regen_III', name:'Infinity Regen III', variant:'III', rarity:'L', icon:'♾️', shield:8400,  regen:210, special:{type:'extra_regen',    bonus:85,  desc:'+85% brži shield regen — gotovo konstantna obnova'}, cost:{metal:16800, crystal:13440, he3:6720 }, source:'Constellation',  desc:'Napredni beskonačni regen. Constellation ekskluziv.', who:'Svi brodovi' },

  // 6. Omega Absorber — omega apsorber (absorb jak)
  { id:'sh_omega_absorber_I',   name:'Omega Absorber I',   variant:'I',   rarity:'L', icon:'🕳️', shield:4800,  regen:120, special:{type:'absorb',         amount:38, desc:'Upija 38% primljene štete, pretvara u shield regen'}, cost:{metal:9600,  crystal:7680,  he3:3840 }, source:'Trial 5',        desc:'Omega apsorber. Pretvara veliku štetu u regen.',      who:'Svi brodovi' },
  { id:'sh_omega_absorber_II',  name:'Omega Absorber II',  variant:'II',  rarity:'L', icon:'🕳️', shield:7680,  regen:192, special:{type:'absorb',         amount:38, desc:'Upija 38% primljene štete, pretvara u shield regen'}, cost:{metal:15360, crystal:12288, he3:6144 }, source:'Trial 8',        desc:'Poboljšani omega apsorber.',                          who:'Svi brodovi' },
  { id:'sh_omega_absorber_III', name:'Omega Absorber III', variant:'III', rarity:'L', icon:'🕳️', shield:11520, regen:288, special:{type:'absorb',         amount:38, desc:'Upija 38% primljene štete, pretvara u shield regen'}, cost:{metal:23040, crystal:18432, he3:9216 }, source:'Boss Event',     desc:'Napredni omega apsorber. Boss Event ekskluziv.',       who:'Svi brodovi' },

  // 7. Phoenix Core — feniks jezgro (instant recovery jak)
  { id:'sh_phoenix_core_I',   name:'Phoenix Core I',   variant:'I',   rarity:'L', icon:'🔮', shield:5500,  regen:137, special:{type:'instant_recovery', chance:8, desc:'8% šansa: trenutno vraća cijeli shield'},           cost:{metal:11000, crystal:8800,  he3:4400 }, source:'Trial 6',        desc:'Feniks jezgro. Šansa za trenutni oporavak štita.',    who:'Svi brodovi' },
  { id:'sh_phoenix_core_II',  name:'Phoenix Core II',  variant:'II',  rarity:'L', icon:'🔮', shield:8800,  regen:220, special:{type:'instant_recovery', chance:8, desc:'8% šansa: trenutno vraća cijeli shield'},           cost:{metal:17600, crystal:14080, he3:7040 }, source:'Trial 9',        desc:'Poboljšano feniks jezgro.',                           who:'Svi brodovi' },
  { id:'sh_phoenix_core_III', name:'Phoenix Core III', variant:'III', rarity:'L', icon:'🔮', shield:13200, regen:330, special:{type:'instant_recovery', chance:8, desc:'8% šansa: trenutno vraća cijeli shield'},           cost:{metal:26400, crystal:21120, he3:10560}, source:'Constellation',  desc:'Napredni feniks jezgro. Constellation ekskluziv.',    who:'Svi brodovi' },

  // 8. Spacetime Shield — prostorno-vremenski štit (regen + block)
  { id:'sh_spacetime_I',   name:'Spacetime Shield I',   variant:'I',   rarity:'L', icon:'🌌', shield:4600,  regen:115, special:{type:'block', chance:18, desc:'18% šansa: potpuno blokira napad'},               cost:{metal:9200,  crystal:7360,  he3:3680}, source:'Instanca 30',     desc:'Prostorno-vremenski štit. Savija prostor oko broda.',  who:'Svi brodovi' },
  { id:'sh_spacetime_II',  name:'Spacetime Shield II',  variant:'II',  rarity:'L', icon:'🌌', shield:7360,  regen:184, special:{type:'block', chance:18, desc:'18% šansa: potpuno blokira napad'},               cost:{metal:14720, crystal:11776, he3:5888}, source:'Instanca 30',     desc:'Poboljšani prostorno-vremenski štit.',                 who:'Svi brodovi' },
  { id:'sh_spacetime_III', name:'Spacetime Shield III', variant:'III', rarity:'L', icon:'🌌', shield:11040, regen:276, special:{type:'block', chance:18, desc:'18% šansa: potpuno blokira napad'},               cost:{metal:22080, crystal:17664, he3:8832}, source:'Elite instanca',  desc:'Napredni prostorno-vremenski štit.',                   who:'Svi brodovi' },

  // 9. Eos Shield — štit zore (extra regen + reflect)
  { id:'sh_eos_I',   name:'Eos Shield I',   variant:'I',   rarity:'L', icon:'🌅', shield:5200,  regen:130, special:{type:'reflect', chance:15, desc:'15% šansa: odbija 30% primljene štete nazad'},    cost:{metal:10400, crystal:8320,  he3:4160}, source:'Elite instanca',  desc:'Štit zore. Sjajna reflektivna energija.',             who:'Svi brodovi' },
  { id:'sh_eos_II',  name:'Eos Shield II',  variant:'II',  rarity:'L', icon:'🌅', shield:8320,  regen:208, special:{type:'reflect', chance:15, desc:'15% šansa: odbija 30% primljene štete nazad'},    cost:{metal:16640, crystal:13312, he3:6656}, source:'Elite instanca',  desc:'Poboljšani Eos štit.',                                 who:'Svi brodovi' },
  { id:'sh_eos_III', name:'Eos Shield III', variant:'III', rarity:'L', icon:'🌅', shield:12480, regen:312, special:{type:'reflect', chance:15, desc:'15% šansa: odbija 30% primljene štete nazad'},    cost:{metal:24960, crystal:19968, he3:9984}, source:'Elite instanca',  desc:'Napredni Eos štit. Vrhunska refleksija.',             who:'Svi brodovi' },

  // 10. Fortress Shield — tvrđava štit (max_shield_boost)
  { id:'sh_fortress_I',   name:'Fortress Shield I',   variant:'I',   rarity:'L', icon:'🏰', shield:5800,  regen:145, special:{type:'max_shield_boost', bonus:35, desc:'+35% maksimalni shield kapacitet'},           cost:{metal:11600, crystal:9280,  he3:4640}, source:'Elite instanca',  desc:'Tvrđava štit. Masivni shield kapacitet.',             who:'Svi brodovi' },
  { id:'sh_fortress_II',  name:'Fortress Shield II',  variant:'II',  rarity:'L', icon:'🏰', shield:9280,  regen:232, special:{type:'max_shield_boost', bonus:35, desc:'+35% maksimalni shield kapacitet'},           cost:{metal:18560, crystal:14848, he3:7424}, source:'Elite instanca',  desc:'Poboljšani Fortress štit.',                           who:'Svi brodovi' },
  { id:'sh_fortress_III', name:'Fortress Shield III', variant:'III', rarity:'L', icon:'🏰', shield:13920, regen:348, special:{type:'max_shield_boost', bonus:35, desc:'+35% maksimalni shield kapacitet'},           cost:{metal:27840, crystal:22272, he3:11136}, source:'Elite instanca', desc:'Napredni Fortress štit.',                            who:'Svi brodovi' },

  // 11. Immortal Shield — besmrtni štit (absorb + regen)
  { id:'sh_immortal_I',   name:'Immortal Shield I',   variant:'I',   rarity:'L', icon:'💎', shield:7000,  regen:175, special:{type:'absorb', amount:30, desc:'Upija 30% primljene štete, pretvara u shield regen'}, cost:{metal:14000, crystal:11200, he3:5600}, source:'Elite instanca',  desc:'Besmrtni štit. Gotovo neuništiv.',                     who:'Svi brodovi' },
  { id:'sh_immortal_II',  name:'Immortal Shield II',  variant:'II',  rarity:'L', icon:'💎', shield:11200, regen:280, special:{type:'absorb', amount:30, desc:'Upija 30% primljene štete, pretvara u shield regen'}, cost:{metal:22400, crystal:17920, he3:8960}, source:'Elite instanca',  desc:'Poboljšani besmrtni štit.',                            who:'Svi brodovi' },
  { id:'sh_immortal_III', name:'Immortal Shield III', variant:'III', rarity:'L', icon:'💎', shield:16800, regen:420, special:{type:'absorb', amount:30, desc:'Upija 30% primljene štete, pretvara u shield regen'}, cost:{metal:33600, crystal:26880, he3:13440}, source:'Elite instanca', desc:'Napredni besmrtni štit. Legendarna zaštita.',         who:'Svi brodovi' },

  // ── DIVINE ŠTITOVI (3) — Boss Event drop only ──
  {
    id: 'sh_divine_I',
    name: 'Divine I',
    variant: 'I',
    rarity: 'L',
    icon: '✨',
    shield: 12000,
    regen: 300,
    special: { type: 'block', chance: 50, desc: '50% šansa blokiranja SVAKOG napada' },
    cost: { metal: 0, crystal: 0, he3: 0 },
    source: 'Boss Event (drop only)',
    desc: 'Božanski štit. 50% blok. Samo iz Boss Eventa. Max 1 po igraču.',
    who: 'Svi brodovi',
    max_per_player: 1,
    drop_only: true,
  },
  {
    id: 'sh_divine_II',
    name: 'Divine II',
    variant: 'II',
    rarity: 'L',
    icon: '✨',
    shield: 18000,
    regen: 450,
    special: { type: 'block', chance: 50, desc: '50% šansa blokiranja SVAKOG napada' },
    cost: { metal: 0, crystal: 0, he3: 0 },
    source: 'Boss Event (drop only)',
    desc: 'Poboljšani Divine štit. Najrjeđi predmet u igri.',
    who: 'Svi brodovi',
    max_per_player: 1,
    drop_only: true,
  },
  {
    id: 'sh_divine_III',
    name: 'Divine III',
    variant: 'III',
    rarity: 'L',
    icon: '✨',
    shield: 24000,
    regen: 600,
    special: { type: 'block', chance: 50, desc: '50% šansa blokiranja SVAKOG napada' },
    cost: { metal: 0, crystal: 0, he3: 0 },
    source: 'Boss Event (drop only)',
    desc: 'Vrhunski Divine štit. Mitski, legendarni, jedinstven. Samo najboljima.',
    who: 'Svi brodovi',
    max_per_player: 1,
    drop_only: true,
  },
];

// ── RARITY INFO ──
const SHIELD_RARITY = {
  C: { name: 'Common',    color: '#a0b8c8', label: 'Obično'  },
  R: { name: 'Rare',      color: '#4488ff', label: 'Rijetko' },
  E: { name: 'Epic',      color: '#aa44ff', label: 'Epsko'   },
  L: { name: 'Legendary', color: '#ffaa00', label: 'Legenda' },
};

// ── HELPER FUNKCIJE ──

function getShieldById(id) {
  return SHIELDS.find(s => s.id === id) || null;
}

function getShieldsByRarity(rarity) {
  return SHIELDS.filter(s => s.rarity === rarity);
}

function getShieldsByVariant(variant) {
  return SHIELDS.filter(s => s.variant === variant);
}

function getBestShieldForClass(shipClass) {
  const recommendations = {
    scout:      'sh_quartz_shell_III',
    fighter:    'sh_flux_buffer_III',
    cruiser:    'sh_alloy_plate_III',
    battleship: 'sh_phase_curtain_III',
    carrier:    'sh_titan_core_III',
    special:    'sh_aegis_prime_III',
  };
  return getShieldById(recommendations[shipClass]);
}

// Export
if (typeof module !== 'undefined') {
  module.exports = {
    SHIELDS, SHIELD_RARITY,
    getShieldById, getShieldsByRarity,
    getShieldsByVariant, getBestShieldForClass,
  };
}
