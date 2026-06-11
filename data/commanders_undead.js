// ============================================================
// HIVE GALAXY — data/commanders_undead.js
// UNDEAD PACK — 100 komandira
// 40C / 30R / 20E / 10L
// Frakcije: revenant | wraith_lord | tomb_keeper | kaels_chosen
//
// fleet_recovery: X% izgubljene flote se vraća nakon poraza
// ============================================================

const UNDEAD_FACTIONS = {
  revenant:     { name: 'Revenant',     icon: '💀', color: '#aaaaaa', desc: 'Mrtvi vojnici koji odbijaju pasti.' },
  wraith_lord:  { name: 'Wraith Lord',  icon: '👻', color: '#aa44ff', desc: 'Duhovi bez tijela, puni mržnje.' },
  tomb_keeper:  { name: 'Tomb Keeper',  icon: '⚰️', color: '#00d4ff', desc: 'Čuvari drevnih grobnica i tajni.' },
  kaels_chosen: { name: "Kael's Chosen", icon: '☠️', color: '#ff4444', desc: 'Elita tamne sile. Odabrani od samog Kaela.' },
};

const COMMANDERS_UNDEAD = [

  // ════════════════════════════════════════════════════════════
  // COMMON (40) — Revenant + Wraith Lord osnovni
  // fleet_recovery: 10%
  // ════════════════════════════════════════════════════════════

  { id:'und_ash_walker',    name:'Ash Walker',    rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['fighter'],     specialty_weapons:['kinetic'],
    passive:{ name:'Povratak iz Pepela', desc:'10% izgubljene flote se vraća nakon poraza.', fleet_recovery:10 },
    lore:'Vojnik koji je poginuo u eksploziji. Vatra ga nije uništila — preobrazila ga je.' },

  { id:'und_bone_march',    name:'Bone March',    rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive'],
    passive:{ name:'Marš Mrtvih', desc:'10% izgubljene flote se vraća. Battleship klasa +5% HP.', fleet_recovery:10, hp_bonus:5, ship_class:'battleship' },
    lore:'Predvodi mrtve vojnike u beskonačnoj paradi kroz void.' },

  { id:'und_corpse_tide',   name:'Corpse Tide',   rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['fighter','cruiser'], specialty_weapons:['kinetic'],
    passive:{ name:'Plima Leševa', desc:'10% izgubljene flote se vraća. +5% napad na startu bitke.', fleet_recovery:10, attack_bonus:5 },
    lore:'Dolazi u talasima. Uvijek ih ima više nego što misliš.' },

  { id:'und_dust_revenant', name:'Dust Revenant', rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['scout'],       specialty_weapons:['kinetic'],
    passive:{ name:'Prašina Rata', desc:'10% izgubljene flote se vraća. Scout klasa +8% brzina.', fleet_recovery:10, speed_bonus:8, ship_class:'scout' },
    lore:'Toliko je star da se polako pretvara u prah, ali još uvijek ubija.' },

  { id:'und_fell_infantry', name:'Fell Infantry', rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['fighter'],     specialty_weapons:['explosive'],
    passive:{ name:'Pala Pješadija', desc:'10% izgubljene flote se vraća. Fighter klasa +6% napad.', fleet_recovery:10, attack_bonus:6, ship_class:'fighter' },
    lore:'Pali vojnici koji se ne mogu odmoriti dok ima živih neprijatelja.' },

  { id:'und_grave_runner',  name:'Grave Runner',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['scout','fighter'], specialty_weapons:['kinetic'],
    passive:{ name:'Trač iz Groba', desc:'10% izgubljene flote se vraća. +5% evasion.', fleet_recovery:10, evasion_bonus:5 },
    lore:'Trči prema neprijatelju kao da bježi od nečeg gorog.' },

  { id:'und_hollow_eye',    name:'Hollow Eye',    rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['cruiser'],     specialty_weapons:['heat'],
    passive:{ name:'Šuplje Oko', desc:'10% izgubljene flote se vraća. Neprijatelj -4% napad.', fleet_recovery:10, enemy_attack_debuff:4 },
    lore:'Gleda u tebe ali tamo nema ničeg. Samo praznina.' },

  { id:'und_iron_cadaver',  name:'Iron Cadaver',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Željezni Leš', desc:'10% izgubljene flote se vraća. -6% primljene štete.', fleet_recovery:10, armor_bonus:6 },
    lore:'Toliko mrtav da ni oštrice ni metci ne mogu proći kroz njega.' },

  { id:'und_lost_legion',   name:'Lost Legion',   rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['explosive'],
    passive:{ name:'Izgubljena Legija', desc:'10% izgubljene flote se vraća. Za svaki pogibali brod, +2% napad (max +20%).', fleet_recovery:10, kill_stack_attack:2 },
    lore:'Legija koja je poginula zajedno. Zajedno se i vratila.' },

  { id:'und_mort_blade',    name:'Mort Blade',    rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['fighter'],     specialty_weapons:['kinetic'],
    passive:{ name:'Smrtna Oštrica', desc:'10% izgubljene flote se vraća. +7% kritični napad.', fleet_recovery:10, crit_bonus:7 },
    lore:'Mač koji je ubio toliko da je i sam postao žedan krvi.' },

  { id:'und_pale_march',    name:'Pale March',    rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['cruiser'],     specialty_weapons:['kinetic'],
    passive:{ name:'Blijedi Marš', desc:'10% izgubljene flote se vraća. Cijela flota +3% HP.', fleet_recovery:10, hp_bonus:3 },
    lore:'Tiho maršira. Nema zvuka koraka. Nema disanja.' },

  { id:'und_rot_vanguard',  name:'Rot Vanguard',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive','heat'],
    passive:{ name:'Trulež Avangarde', desc:'10% izgubljene flote se vraća. Neprijatelj -5% HP.', fleet_recovery:10, enemy_hp_debuff:5 },
    lore:'Prva linija napada. Uvijek trulo, uvijek naprijed.' },

  { id:'und_shadow_horde',  name:'Shadow Horde',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['fighter'],     specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Sjenčasta Horda', desc:'10% izgubljene flote se vraća. Broj brodova +5% napad.', fleet_recovery:10, fleet_size_attack:5 },
    lore:'Dolaze u masama. Jedan po jedan ništa nisu, ali zajedno su noćna mora.' },

  { id:'und_skull_bearer',  name:'Skull Bearer',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive'],
    passive:{ name:'Nosač Lubanja', desc:'10% izgubljene flote se vraća. +5% oklop.', fleet_recovery:10, armor_bonus:5 },
    lore:'Nosi lubanje poraženih neprijatelja kao trofeje.' },

  { id:'und_tomb_soldier',  name:'Tomb Soldier',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['cruiser','battleship'], specialty_weapons:['kinetic'],
    passive:{ name:'Vojnik Grobnice', desc:'10% izgubljene flote se vraća. -5% primljene štete.', fleet_recovery:10, armor_bonus:5 },
    lore:'Čuvao je grobnice milionima godina. Sada je spreman za rat.' },

  { id:'und_undying_grunt', name:'Undying Grunt',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['fighter'],     specialty_weapons:['kinetic'],
    passive:{ name:'Besmrtni Vojnik', desc:'10% izgubljene flote se vraća. Posljednji brod +15% napad.', fleet_recovery:10, last_stand_attack:15 },
    lore:'Beznačajan u životu. Neizmjerno opasan u smrti.' },

  { id:'und_void_grunt',    name:'Void Grunt',    rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['scout'],       specialty_weapons:['kinetic'],
    passive:{ name:'Void Vojnik', desc:'10% izgubljene flote se vraća. +4% void evasion.', fleet_recovery:10, evasion_bonus:4 },
    lore:'Popunio se void energijom. Ne zna sam šta je sada.' },

  { id:'und_worm_rider',    name:'Worm Rider',    rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['cruiser'],     specialty_weapons:['explosive'],
    passive:{ name:'Jahač Crva', desc:'10% izgubljene flote se vraća. +6% napad cruiser klasi.', fleet_recovery:10, attack_bonus:6, ship_class:'cruiser' },
    lore:'Jahao je kosmičke crve kroz void galaksije. Sada ih nema, ali on još jaše.' },

  { id:'und_ashen_guard',   name:'Ashen Guard',   rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['kinetic'],
    passive:{ name:'Pepelni Stražar', desc:'10% izgubljene flote se vraća. +5% shield.', fleet_recovery:10, shield_bonus:5 },
    lore:'Čuva pepeo mrtvih civilizacija.' },

  { id:'und_blight_runner', name:'Blight Runner',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['scout','fighter'], specialty_weapons:['heat'],
    passive:{ name:'Trač Kuge', desc:'10% izgubljene flote se vraća. Scout +10% brzina.', fleet_recovery:10, speed_bonus:10, ship_class:'scout' },
    lore:'Trči ispred kuge. Ili je on kuga.' },

  { id:'und_cold_revenant', name:'Cold Revenant',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['cruiser'],     specialty_weapons:['kinetic','magnetic'],
    passive:{ name:'Hladni Povratnik', desc:'10% izgubljene flote se vraća. Neprijatelj -3% brzina.', fleet_recovery:10, enemy_speed_debuff:3 },
    lore:'Toliko hladan da smrzava sve oko sebe.' },

  { id:'und_death_crawler', name:'Death Crawler',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['fighter'],     specialty_weapons:['kinetic'],
    passive:{ name:'Puzač Smrti', desc:'10% izgubljene flote se vraća. +5% napad u prvoj rundi.', fleet_recovery:10, first_round_attack:5 },
    lore:'Puže prema neprijatelju. Polako. Neumoljivo.' },

  { id:'und_ember_revenant',name:'Ember Revenant', rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['fighter','cruiser'], specialty_weapons:['heat'],
    passive:{ name:'Žar Povratnik', desc:'10% izgubljene flote se vraća. +6% napad toplinom.', fleet_recovery:10, attack_bonus:6 },
    lore:'Njegova tijelo još gori. Milionima godina.' },

  { id:'und_fell_scout',    name:'Fell Scout',    rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['scout'],       specialty_weapons:['kinetic','magnetic'],
    passive:{ name:'Pali Izviđač', desc:'10% izgubljene flote se vraća. Scout +6% evasion.', fleet_recovery:10, evasion_bonus:6, ship_class:'scout' },
    lore:'Izviđao je pred smrt. Izviđa i poslije.' },

  { id:'und_grim_runner',   name:'Grim Runner',   rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['scout'],       specialty_weapons:['kinetic'],
    passive:{ name:'Mračni Trkač', desc:'10% izgubljene flote se vraća. +8% agility.', fleet_recovery:10, agility_bonus:8 },
    lore:'Brži od života. Možda zato što ne živi.' },

  { id:'und_hollow_blade',  name:'Hollow Blade',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['fighter'],     specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Šuplja Oštrica', desc:'10% izgubljene flote se vraća. +5% DPS.', fleet_recovery:10, dps_bonus:5 },
    lore:'Mač bez duše. Ubija bez razloga.' },

  { id:'und_mist_walker',   name:'Mist Walker',   rarity:'C', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['scout','fighter'], specialty_weapons:['kinetic'],
    passive:{ name:'Hodač kroz Maglinu', desc:'10% izgubljene flote se vraća. +6% evasion.', fleet_recovery:10, evasion_bonus:6 },
    lore:'Hoda kroz maglu void prostora. Niko ga nije vidio i preživio.' },

  { id:'und_phantom_revenant', name:'Phantom Revenant', rarity:'C', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['scout'],       specialty_weapons:['kinetic','magnetic'],
    passive:{ name:'Fantomski Povratnik', desc:'10% izgubljene flote se vraća. Prva runda +8% evasion.', fleet_recovery:10, evasion_bonus:8 },
    lore:'Pojavljuje se i nestaje. Ni mrtav ni živ.' },

  { id:'und_shade_walker',  name:'Shade Walker',  rarity:'C', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['scout','fighter'], specialty_weapons:['magnetic'],
    passive:{ name:'Hodač Sjene', desc:'10% izgubljene flote se vraća. +5% evasion svim brodovima.', fleet_recovery:10, evasion_bonus:5 },
    lore:'Hoda između sjene i svjetlosti. Uvijek u sjeni.' },

  { id:'und_soul_fragment', name:'Soul Fragment',  rarity:'C', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['cruiser'],     specialty_weapons:['heat','kinetic'],
    passive:{ name:'Fragment Duše', desc:'10% izgubljene flote se vraća. Za svaki kill +1% napad.', fleet_recovery:10, kill_stack_attack:1 },
    lore:'Ostatak nečije duše koja je ostala zarobljena u void-u.' },

  { id:'und_specter_lance', name:'Specter Lance',  rarity:'C', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['fighter'],     specialty_weapons:['kinetic'],
    passive:{ name:'Koplje Spektra', desc:'10% izgubljene flote se vraća. +6% napad fighter klasi.', fleet_recovery:10, attack_bonus:6, ship_class:'fighter' },
    lore:'Koplje napravljeno od kristalizovane void energije.' },

  { id:'und_veil_walker',   name:'Veil Walker',   rarity:'C', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['scout'],       specialty_weapons:['magnetic'],
    passive:{ name:'Hodač Vela', desc:'10% izgubljene flote se vraća. Scout +5% speed i +3% evasion.', fleet_recovery:10, speed_bonus:5, evasion_bonus:3, ship_class:'scout' },
    lore:'Prolazi kroz velove između dimenzija kao kroz vazduh.' },

  { id:'und_wraith_blade',  name:'Wraith Blade',  rarity:'C', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['fighter'],     specialty_weapons:['kinetic','magnetic'],
    passive:{ name:'Oštrica Wraitha', desc:'10% izgubljene flote se vraća. +5% kritični napad.', fleet_recovery:10, crit_bonus:5 },
    lore:'Oštrica napravljena od materijalizovane mržnje.' },

  { id:'und_wraith_grunt',  name:'Wraith Grunt',  rarity:'C', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['fighter','cruiser'], specialty_weapons:['kinetic'],
    passive:{ name:'Vojnik Wraitha', desc:'10% izgubljene flote se vraća. +4% napad i evasion.', fleet_recovery:10, attack_bonus:4, evasion_bonus:4 },
    lore:'Najmanji od wraith vojnika. Ali i dalje opasan.' },

  { id:'und_wraith_scout',  name:'Wraith Scout',  rarity:'C', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['scout'],       specialty_weapons:['kinetic'],
    passive:{ name:'Wraith Izviđač', desc:'10% izgubljene flote se vraća. Scout +12% agility.', fleet_recovery:10, agility_bonus:12, ship_class:'scout' },
    lore:'Izviđa za wraith lordove. Nevidljiv, nečujan.' },

  { id:'und_zombie_fleet',  name:'Zombie Fleet',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['explosive'],
    passive:{ name:'Zombi Flota', desc:'10% izgubljene flote se vraća. +5% HP svim brodovima.', fleet_recovery:10, hp_bonus:5 },
    lore:'Cijela flota mrtva. Cijela flota se kreće.' },

  { id:'und_cursed_marine', name:'Cursed Marine',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['cruiser'],     specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Prokleti Marinac', desc:'10% izgubljene flote se vraća. -4% primljene štete.', fleet_recovery:10, armor_bonus:4 },
    lore:'Proklet da ratuje zauvijek. Ne pita zašto više.' },

  { id:'und_death_bringer', name:'Death Bringer',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive','kinetic'],
    passive:{ name:'Donosilac Smrti', desc:'10% izgubljene flote se vraća. +6% DPS battleship klasi.', fleet_recovery:10, dps_bonus:6, ship_class:'battleship' },
    lore:'Dolazi samo sa jednom porukom. Kraj.' },

  { id:'und_silent_grave',  name:'Silent Grave',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['cruiser','battleship'], specialty_weapons:['kinetic'],
    passive:{ name:'Tiha Grobnica', desc:'10% izgubljene flote se vraća. Neprijatelj -5% DPS.', fleet_recovery:10, enemy_dps_debuff:5 },
    lore:'Tiha kao grob. Smrtonosna kao smrt.' },

  { id:'und_war_revenant',  name:'War Revenant',  rarity:'C', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive'],
    passive:{ name:'Ratni Povratnik', desc:'10% izgubljene flote se vraća. +5% napad i +3% HP.', fleet_recovery:10, attack_bonus:5, hp_bonus:3 },
    lore:'Rat ga je ubio. Rat ga je vratio. Rat je sve što poznaje.' },


  // ════════════════════════════════════════════════════════════
  // RARE (30) — Revenant R + Wraith Lords R + Tomb Keepers R
  // fleet_recovery: 15-20%
  // ════════════════════════════════════════════════════════════

  { id:'und_ancient_revenant', name:'Ancient Revenant', rarity:'R', faction:'revenant', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Drevni Povratnik', desc:'15% izgubljene flote se vraća. Battleship +10% HP.', fleet_recovery:15, hp_bonus:10, ship_class:'battleship' },
    lore:'Star koliko i sama galaksija. Pamti sve ratove.' },

  { id:'und_bone_admiral',  name:'Bone Admiral',  rarity:'R', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive','kinetic'],
    passive:{ name:'Koštani Admiral', desc:'15% izgubljene flote se vraća. Flota +8% napad i +6% HP.', fleet_recovery:15, attack_bonus:8, hp_bonus:6 },
    lore:'Vodio je armade u životu. Vodi ih i u smrti.' },

  { id:'und_carrion_lord',  name:'Carrion Lord',  rarity:'R', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['cruiser','battleship'], specialty_weapons:['explosive'],
    passive:{ name:'Lord Strvina', desc:'15% izgubljene flote se vraća. Za svaki kill +3% DPS (max +30%).', fleet_recovery:15, kill_stack_dps:3 },
    lore:'Slavi smrt tuđih. Hrani se njihovom energijom.' },

  { id:'und_corpse_king',   name:'Corpse King',   rarity:'R', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive','kinetic'],
    passive:{ name:'Kralj Leševa', desc:'15% izgubljene flote se vraća. Neprijatelj -8% napad i -5% HP.', fleet_recovery:15, enemy_attack_debuff:8, enemy_hp_debuff:5 },
    lore:'Vlada mrtvima. Čak i neprijatelji postaju njegova vojska.' },

  { id:'und_death_captain', name:'Death Captain',  rarity:'R', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['cruiser'],     specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Kapetan Smrti', desc:'15% izgubljene flote se vraća. Cruiser +10% napad i +5% speed.', fleet_recovery:15, attack_bonus:10, speed_bonus:5, ship_class:'cruiser' },
    lore:'Kapetan koji je odbio da umre. Brod mu je srušen tri puta. Uvijek se vratio.' },

  { id:'und_fell_general',  name:'Fell General',  rarity:'R', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser','fighter'], specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Pali General', desc:'15% izgubljene flote se vraća. Sve klase +7% napad.', fleet_recovery:15, attack_bonus:7 },
    lore:'General koji je izgubio posljednju bitku. Ali ne i rat.' },

  { id:'und_grave_general', name:'Grave General',  rarity:'R', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive'],
    passive:{ name:'General Groblja', desc:'15% izgubljene flote se vraća. +8% oklop svim brodovima.', fleet_recovery:15, armor_bonus:8 },
    lore:'Komandira iz groba. Nema tijela ali ima autoriteta.' },

  { id:'und_iron_revenant', name:'Iron Revenant',  rarity:'R', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['kinetic'],
    passive:{ name:'Željezni Povratnik', desc:'15% izgubljene flote se vraća. -10% primljene štete.', fleet_recovery:15, armor_bonus:10 },
    lore:'Oklop koji nosi više nije metal — to su kristalizovane kosti.' },

  { id:'und_plague_admiral', name:'Plague Admiral', rarity:'R', faction:'revenant',   icon:'💀', pack:'undead',
    specialty_ships:['cruiser','battleship'], specialty_weapons:['heat','explosive'],
    passive:{ name:'Admiral Kuge', desc:'15% izgubljene flote se vraća. Neprijatelj -10% DPS.', fleet_recovery:15, enemy_dps_debuff:10 },
    lore:'Širi kugu kroz flote. Nema lijeka za ono što on donosi.' },

  { id:'und_risen_commander', name:'Risen Commander', rarity:'R', faction:'revenant', icon:'💀', pack:'undead',
    specialty_ships:['cruiser','fighter'], specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Uzdignuti Komandant', desc:'15% izgubljene flote se vraća. +8% napad i +5% evasion.', fleet_recovery:15, attack_bonus:8, evasion_bonus:5 },
    lore:'Uzdignut iz mrtvila voljom Kaela. Lojalan beskonačno.' },

  { id:'und_soul_eater',    name:'Soul Eater',    rarity:'R', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['fighter','cruiser'], specialty_weapons:['heat','kinetic'],
    passive:{ name:'Jedač Duša', desc:'20% izgubljene flote se vraća. Svaki kill +2% HP regen.', fleet_recovery:20, kill_hp_regen:2 },
    lore:'Jede duše poraženih. Postaje jači svakim ubojstvom.' },

  { id:'und_void_wraith',   name:'Void Wraith',   rarity:'R', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['scout','fighter'], specialty_weapons:['magnetic'],
    passive:{ name:'Void Wraith', desc:'20% izgubljene flote se vraća. 8% šansa da negira dolazni napad.', fleet_recovery:20, warp_skip_chance:8 },
    lore:'Pojavljuje se i nestaje u void-u. Napadi prolaze kroz njega.' },

  { id:'und_wraith_admiral', name:'Wraith Admiral', rarity:'R', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Wraith Admiral', desc:'20% izgubljene flote se vraća. Flota +8% evasion.', fleet_recovery:20, evasion_bonus:8 },
    lore:'Admiralitet koji lebdi između živih i mrtvih.' },

  { id:'und_wraith_captain', name:'Wraith Captain', rarity:'R', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['cruiser'],     specialty_weapons:['kinetic'],
    passive:{ name:'Wraith Kapetan', desc:'20% izgubljene flote se vraća. Cruiser +8% evasion i +6% napad.', fleet_recovery:20, evasion_bonus:8, attack_bonus:6, ship_class:'cruiser' },
    lore:'Kapetan flote duhova. Brod mu je napravljen od void materije.' },

  { id:'und_wraith_general', name:'Wraith General', rarity:'R', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['battleship','fighter'], specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Wraith General', desc:'20% izgubljene flote se vraća. Prva runda: +12% napad.', fleet_recovery:20, first_round_attack:12 },
    lore:'Generale koji je vodio armadu duhova kroz cijelu galaksiju.' },

  { id:'und_dark_keeper',   name:'Dark Keeper',   rarity:'R', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['kinetic'],
    passive:{ name:'Tamni Čuvar', desc:'20% izgubljene flote se vraća. -10% primljene štete i +5% HP.', fleet_recovery:20, armor_bonus:10, hp_bonus:5 },
    lore:'Čuva tamne tajne piramida. Nikome ih ne otkriva.' },

  { id:'und_tomb_guardian', name:'Tomb Guardian',  rarity:'R', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['explosive','kinetic'],
    passive:{ name:'Čuvar Grobnice', desc:'20% izgubljene flote se vraća. -12% primljene štete.', fleet_recovery:20, armor_bonus:12 },
    lore:'Milijonima godina je čuvao grobnicu. Niko nije prošao.' },

  { id:'und_pyramid_warden', name:'Pyramid Warden', rarity:'R', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Čuvar Piramide', desc:'20% izgubljene flote se vraća. +10% shield svim brodovima.', fleet_recovery:20, shield_bonus:10 },
    lore:'Piramida je njegova kuća. Branit će je do posljednjeg atoma.' },

  { id:'und_ancient_guardian', name:'Ancient Guardian', rarity:'R', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['kinetic'],
    passive:{ name:'Drevni Čuvar', desc:'20% izgubljene flote se vraća. Neprijatelj -8% oklop.', fleet_recovery:20, enemy_armor_debuff:8 },
    lore:'Toliko star da su piramide sagrađene oko njega.' },

  { id:'und_crypt_warden',  name:'Crypt Warden',  rarity:'R', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['cruiser','battleship'], specialty_weapons:['explosive'],
    passive:{ name:'Čuvar Kripte', desc:'20% izgubljene flote se vraća. +8% HP i +6% oklop.', fleet_recovery:20, hp_bonus:8, armor_bonus:6 },
    lore:'Čuva kriptu ispod najstarije piramide.' },

  { id:'und_stone_sentinel', name:'Stone Sentinel', rarity:'R', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['kinetic'],
    passive:{ name:'Kameni Stražar', desc:'20% izgubljene flote se vraća. -15% primljene štete. -2% napad.', fleet_recovery:20, armor_bonus:15, attack_penalty:2 },
    lore:'Napravljen od kamena najstarijih piramida. Gotovo neuništiv.' },

  { id:'und_mummy_admiral', name:'Mummy Admiral',  rarity:'R', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['explosive','kinetic'],
    passive:{ name:'Mumija Admiral', desc:'20% izgubljene flote se vraća. Neprijatelj -10% HP i -5% napad.', fleet_recovery:20, enemy_hp_debuff:10, enemy_attack_debuff:5 },
    lore:'Omatan u drevne zavoje koji kriju strašnu snagu.' },

  { id:'und_sarcophagus',   name:'Sarcophagus',   rarity:'R', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['kinetic'],
    passive:{ name:'Sarkofag', desc:'20% izgubljene flote se vraća. Brod koji pogine ima 15% šanse da ne umre.', fleet_recovery:20, death_resist:15 },
    lore:'Zatvoren u sarkofag. Bezbijedan od svega.' },

  { id:'und_wraith_commander', name:'Wraith Commander', rarity:'R', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['cruiser','fighter'], specialty_weapons:['magnetic','kinetic'],
    passive:{ name:'Wraith Komandant', desc:'20% izgubljene flote se vraća. 10% šansa negiranja napada.', fleet_recovery:20, warp_skip_chance:10 },
    lore:'Komandira iz void dimenzije. Naređenja mu prolaze kroz prostor.' },

  { id:'und_specter_general', name:'Specter General', rarity:'R', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['fighter','cruiser'], specialty_weapons:['kinetic','heat'],
    passive:{ name:'General Spektar', desc:'20% izgubljene flote se vraća. +10% napad i +6% evasion.', fleet_recovery:20, attack_bonus:10, evasion_bonus:6 },
    lore:'Toliko brz da izgleda kao sjena.' },

  { id:'und_ghost_fleet_admiral', name:'Ghost Fleet Admiral', rarity:'R', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['explosive'],
    passive:{ name:'Admiral Flote Duhova', desc:'20% izgubljene flote se vraća. Flota +8% napad i -6% primljene štete.', fleet_recovery:20, attack_bonus:8, armor_bonus:6 },
    lore:'Admiralitet flote duhova koji luta void-om od pamtivijeka.' },

  { id:'und_phantom_admiral', name:'Phantom Admiral', rarity:'R', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['scout','fighter'], specialty_weapons:['magnetic'],
    passive:{ name:'Fantomski Admiral', desc:'20% izgubljene flote se vraća. Scout +15% agility.', fleet_recovery:20, agility_bonus:15, ship_class:'scout' },
    lore:'Admir koji se nikad ne vidi dok ne bude prekasno.' },

  { id:'und_shadow_admiral', name:'Shadow Admiral',  rarity:'R', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Admiral Sjene', desc:'20% izgubljene flote se vraća. +8% napad iz zasjede (prva runda).', fleet_recovery:20, first_round_attack:8 },
    lore:'Napada iz sjene. Uvijek iznenađuje.' },

  { id:'und_veil_admiral',  name:'Veil Admiral',  rarity:'R', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['cruiser','battleship'], specialty_weapons:['kinetic'],
    passive:{ name:'Admiral Vela', desc:'20% izgubljene flote se vraća. +7% evasion i -5% primljene štete.', fleet_recovery:20, evasion_bonus:7, armor_bonus:5 },
    lore:'Krije flotu iza vela void energije.' },

  { id:'und_death_admiral', name:'Death Admiral',  rarity:'R', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive','kinetic'],
    passive:{ name:'Admiral Smrti', desc:'15% izgubljene flote se vraća. +10% DPS battleship klasi.', fleet_recovery:15, dps_bonus:10, ship_class:'battleship' },
    lore:'Admiral koji nije prihvatio poraz. Niti smrt.' },


  // ════════════════════════════════════════════════════════════
  // EPIC (20) — Wraith Lords E + Tomb Keepers E
  // fleet_recovery: 25-30%
  // ════════════════════════════════════════════════════════════

  { id:'und_ancient_tomb_lord', name:'Ancient Tomb Lord', rarity:'E', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Drevni Lord Grobnice', desc:'30% izgubljene flote se vraća. -15% primljene štete i +10% HP.', fleet_recovery:30, armor_bonus:15, hp_bonus:10 },
    lore:'Lord koji je vladao grobnicama prije nastanka civilizacija.' },

  { id:'und_crypt_lord',    name:'Crypt Lord',    rarity:'E', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive','kinetic'],
    passive:{ name:'Lord Kripte', desc:'30% izgubljene flote se vraća. Neprijatelj -15% HP i -8% napad.', fleet_recovery:30, enemy_hp_debuff:15, enemy_attack_debuff:8 },
    lore:'Vladao je kriptom ispod svih piramida. Kael ga je probudio.' },

  { id:'und_death_priest',  name:'Death Priest',  rarity:'E', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['cruiser','battleship'], specialty_weapons:['heat','explosive'],
    passive:{ name:'Svećenik Smrti', desc:'30% izgubljene flote se vraća. Brod koji pogine 20% šanse da ne umre.', fleet_recovery:30, death_resist:20 },
    lore:'Rituali koje izvodi mogu prevariti i samu smrt.' },

  { id:'und_eternal_guardian', name:'Eternal Guardian', rarity:'E', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['kinetic'],
    passive:{ name:'Vječni Čuvar', desc:'30% izgubljene flote se vraća. -20% primljene štete.', fleet_recovery:30, armor_bonus:20 },
    lore:'Čuva grobnice od vječnosti. Neće prestati nikada.' },

  { id:'und_grave_titan',   name:'Grave Titan',   rarity:'E', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive'],
    passive:{ name:'Titan Groblja', desc:'30% izgubljene flote se vraća. +15% HP i +10% oklop.', fleet_recovery:30, hp_bonus:15, armor_bonus:10 },
    lore:'Titan koji leži u grobu veličine planete.' },

  { id:'und_mummy_emperor', name:'Mummy Emperor',  rarity:'E', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser','fighter'], specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Car Mumija', desc:'30% izgubljene flote se vraća. Sve klase +10% napad i +8% HP.', fleet_recovery:30, attack_bonus:10, hp_bonus:8 },
    lore:'Car koji je vladao galaksijom. Umro je ali nije otišao.' },

  { id:'und_pyramid_pharaoh', name:'Pyramid Pharaoh', rarity:'E', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive','kinetic'],
    passive:{ name:'Faraon Piramide', desc:'30% izgubljene flote se vraća. Neprijatelj -12% oklop i -10% DPS.', fleet_recovery:30, enemy_armor_debuff:12, enemy_dps_debuff:10 },
    lore:'Faraon koji je sagradio piramide kao kapiju u underworld.' },

  { id:'und_tomb_emperor',  name:'Tomb Emperor',  rarity:'E', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Car Grobnice', desc:'30% izgubljene flote se vraća. +12% napad i -10% primljene štete.', fleet_recovery:30, attack_bonus:12, armor_bonus:10 },
    lore:'Car koji je odabrao grobnicu nad životom.' },

  { id:'und_void_pharaoh',  name:'Void Pharaoh',  rarity:'E', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['kinetic'],
    passive:{ name:'Void Faraon', desc:'30% izgubljene flote se vraća. 12% šansa imunosti od napada.', fleet_recovery:30, void_phase_chance:12 },
    lore:'Faraon koji je naučio tajne void-a. Napadi ga ne dodiruju.' },

  { id:'und_wraith_emperor', name:'Wraith Emperor', rarity:'E', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Car Wraith', desc:'25% izgubljene flote se vraća. Flota +12% evasion i +8% napad.', fleet_recovery:25, evasion_bonus:12, attack_bonus:8 },
    lore:'Car svih wraith lordova. Kael mu je dao drugi život.' },

  { id:'und_wraith_titan',  name:'Wraith Titan',  rarity:'E', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive'],
    passive:{ name:'Wraith Titan', desc:'25% izgubljene flote se vraća. +15% napad i 10% šansa negiranja.', fleet_recovery:25, attack_bonus:15, warp_skip_chance:10 },
    lore:'Titan koji živi između dimenzija.' },

  { id:'und_soul_lord',     name:'Soul Lord',     rarity:'E', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['cruiser','battleship'], specialty_weapons:['heat'],
    passive:{ name:'Lord Duša', desc:'25% izgubljene flote se vraća. Svaki kill +3% napad (max +30%).', fleet_recovery:25, kill_stack_attack:3 },
    lore:'Sakuplja duše poraženih. Postaje neograničeno moćniji.' },

  { id:'und_specter_lord',  name:'Specter Lord',  rarity:'E', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['fighter','cruiser'], specialty_weapons:['kinetic','magnetic'],
    passive:{ name:'Lord Spektar', desc:'25% izgubljene flote se vraća. +12% napad i +10% evasion.', fleet_recovery:25, attack_bonus:12, evasion_bonus:10 },
    lore:'Lord koji ne može biti viđen niti opipan.' },

  { id:'und_phantom_lord',  name:'Phantom Lord',  rarity:'E', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['scout','fighter'], specialty_weapons:['magnetic','kinetic'],
    passive:{ name:'Fantomski Lord', desc:'25% izgubljene flote se vraća. Scout +20% agility i +12% evasion.', fleet_recovery:25, agility_bonus:20, evasion_bonus:12, ship_class:'scout' },
    lore:'Lord koji je ovladao fantomskim dimenzijama.' },

  { id:'und_void_wraith_lord', name:'Void Wraith Lord', rarity:'E', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Void Wraith Lord', desc:'25% izgubljene flote se vraća. 15% šansa imunosti i +10% napad.', fleet_recovery:25, void_phase_chance:15, attack_bonus:10 },
    lore:'Lord koji je u potpunosti prešao u void dimenziju.' },

  { id:'und_death_emperor', name:'Death Emperor',  rarity:'E', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser','fighter'], specialty_weapons:['explosive','kinetic'],
    passive:{ name:'Car Smrti', desc:'25% izgubljene flote se vraća. Sve klase +12% napad i +5% DPS.', fleet_recovery:25, attack_bonus:12, dps_bonus:5 },
    lore:'Car koji je vladao smrću. Ne životom — smrću.' },

  { id:'und_lich_commander', name:'Lich Commander', rarity:'E', faction:'revenant',   icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive'],
    passive:{ name:'Lich Komandant', desc:'25% izgubljene flote se vraća. -15% primljene štete i +10% DPS.', fleet_recovery:25, armor_bonus:15, dps_bonus:10 },
    lore:'Lich koji je dao dušu za besmrtnost. Vrijedi svake kapi.' },

  { id:'und_risen_emperor', name:'Risen Emperor',  rarity:'E', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Uzdignuti Car', desc:'25% izgubljene flote se vraća. +10% napad i +10% HP.', fleet_recovery:25, attack_bonus:10, hp_bonus:10 },
    lore:'Car koji je uzdignut voljom tame. Moćniji nego ikad.' },

  { id:'und_undying_emperor', name:'Undying Emperor', rarity:'E', faction:'revenant', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser','fighter'], specialty_weapons:['kinetic','explosive','heat'],
    passive:{ name:'Besmrtni Car', desc:'25% izgubljene flote se vraća. Brod koji pogine 25% šanse da ne umre.', fleet_recovery:25, death_resist:25 },
    lore:'Car koji nije mogao umrijeti. Ni htio.' },

  { id:'und_necro_admiral', name:'Necro Admiral',  rarity:'E', faction:'revenant',    icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['explosive','kinetic'],
    passive:{ name:'Nekro Admiral', desc:'25% izgubljene flote se vraća. Za svaki kill +2% HP regen i +1% napad.', fleet_recovery:25, kill_hp_regen:2, kill_stack_attack:1 },
    lore:'Admiral koji oživljava poražene protivničke brodove.' },


  // ════════════════════════════════════════════════════════════
  // LEGENDARY (10) — Tomb Keeper L + Kael's Chosen L + KAEL
  // fleet_recovery: 50-100%
  // ════════════════════════════════════════════════════════════

  { id:'und_tomb_god',      name:'Tomb God',      rarity:'L', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive','kinetic'],
    passive:{ name:'Bog Grobnice', desc:'50% izgubljene flote se vraća. -25% primljene štete i +15% HP.', fleet_recovery:50, armor_bonus:25, hp_bonus:15 },
    lore:'Bio je bog prije nego što su piramide sagrađene. I dalje jest.' },

  { id:'und_eternal_pharaoh', name:'Eternal Pharaoh', rarity:'L', faction:'tomb_keeper', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Vječni Faraon', desc:'50% izgubljene flote se vraća. -20% primljene štete i neprijatelj -15% napad.', fleet_recovery:50, armor_bonus:20, enemy_attack_debuff:15 },
    lore:'Faraon koji je vladao i živima i mrtvima. Vječan i nepobjediv.' },

  { id:'und_void_god',      name:'Void God',      rarity:'L', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser','fighter'], specialty_weapons:['kinetic','explosive','magnetic'],
    passive:{ name:'Bog Void-a', desc:'50% izgubljene flote se vraća. 20% šansa imunosti od napada, +15% napad.', fleet_recovery:50, void_phase_chance:20, attack_bonus:15 },
    lore:'Bio je bog void dimenzije. Kael ga je probudio i sad mu služi.' },

  { id:'und_wraith_god',    name:'Wraith God',    rarity:'L', faction:'wraith_lord', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['kinetic','explosive'],
    passive:{ name:'Bog Wraitha', desc:'50% izgubljene flote se vraća. Flota +18% evasion i +12% napad.', fleet_recovery:50, evasion_bonus:18, attack_bonus:12 },
    lore:'Najmoćniji od svih wraith lordova. Kael jedva uspio pobjediti.' },

  { id:'und_death_god',     name:'Death God',     rarity:'L', faction:'kaels_chosen', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser','fighter'], specialty_weapons:['explosive','kinetic','heat'],
    passive:{ name:'Bog Smrti', desc:'50% izgubljene flote se vraća. Sve klase +15% napad i +12% DPS.', fleet_recovery:50, attack_bonus:15, dps_bonus:12 },
    lore:'Bio je bog smrti. Kael ga je pobijedio i naučio njegovu moć.' },

  { id:'und_lich_king',     name:'Lich King',     rarity:'L', faction:'kaels_chosen', icon:'💀', pack:'undead',
    specialty_ships:['battleship'],  specialty_weapons:['explosive','kinetic'],
    passive:{ name:'Kralj Lichova', desc:'50% izgubljene flote se vraća. -20% primljene štete, +15% napad, brod 20% šanse preživljavanja.', fleet_recovery:50, armor_bonus:20, attack_bonus:15, death_resist:20 },
    lore:'Kralj svih lichova. Dao je Kaelu tajnu besmrtnosti.' },

  { id:'und_necro_god',     name:'Necro God',     rarity:'L', faction:'kaels_chosen', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser','fighter'], specialty_weapons:['kinetic','explosive','heat'],
    passive:{ name:'Bog Nekromancije', desc:'50% izgubljene flote se vraća. Za svaki kill +4% svi statovi (max +40%).', fleet_recovery:50, kill_stack_all:4 },
    lore:'Nekromant koji je dostigao božanski status. Oživljava čitave armade.' },

  { id:'und_undead_king',   name:'Undead King',   rarity:'L', faction:'kaels_chosen', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser','fighter','scout'], specialty_weapons:['kinetic','explosive','heat','magnetic'],
    passive:{ name:'Kralj Undeada', desc:'50% izgubljene flote se vraća. +15% napad, +15% HP, -15% primljene štete.', fleet_recovery:50, attack_bonus:15, hp_bonus:15, armor_bonus:15 },
    lore:'Kralj koji vlada svim undeadima. Direktno pod Kaelom.' },

  { id:'und_shadow_god',    name:'Shadow God',    rarity:'L', faction:'kaels_chosen', icon:'💀', pack:'undead',
    specialty_ships:['battleship','cruiser'], specialty_weapons:['kinetic','magnetic'],
    passive:{ name:'Bog Sjene', desc:'50% izgubljene flote se vraća. +18% evasion, +12% napad, 12% šansa imunosti.', fleet_recovery:50, evasion_bonus:18, attack_bonus:12, void_phase_chance:12 },
    lore:'Bio je bog sjene dimenzije. Kael je jedini koji ga je vidio i preživio.' },

  // ── KAEL "THE EXILE" — Jedinstven Legendary ──────────────────
  {
    id:    'und_kael_exile',
    name:  'Kael "The Exile"',
    rarity:'L',
    faction:'kaels_chosen',
    icon:  '💀',
    pack:  'undead',
    specialty_ships:   ['battleship','cruiser','fighter','scout'],
    specialty_weapons: ['kinetic','explosive','heat','magnetic'],
    passive: {
      name: 'Duh Prvog Kralja',
      desc: '100% izgubljene flote se vraća nakon poraza. +20% napad, -15% primljene štete, 15% šansa imunosti. Jedinstven.',
      fleet_recovery: 100,
      attack_bonus:   20,
      armor_bonus:    15,
      void_phase_chance: 15,
      unique: true,
    },
    lore: 'Nepravedno optužen. Pobjegao na granicu svemira. Crna rupa ga je progutala i odvela u Underworld galaksiju. U piramidi je slučajno probudio Prvog Kralja Undeada — i ubio ga u samoobrani. Energija Prvog Kralja ušla je u Kaela. Sada luta od piramide do piramide, budeći spavajuće armade koje mu se pokoravaju. On nije tražio ovu moć. Ali nema kuda nazad.',
  },
];
