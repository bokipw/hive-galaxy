// ============================================================
// HIVE GALAXY — data/commanders_xenos.js
// Serija 2: "XENOS" — 100 vanzemaljskih komandira
// 5 frakcija × (8C + 6R + 4E + 2L) = 100
// ============================================================

const XENOS_FACTIONS = {
  krall:    { name: 'Krall', nameKey: 'faction.krall.name', nameKey: 'faction.krall.name',    icon: '👾', color: '#ff4444', desc: 'Reptiloidni ratnici. Bol je nagrada, smrt je čast.', descKey: 'faction.krall.desc', descKey: 'faction.krall.desc' },
  ethereal: { name: 'Ethereal', nameKey: 'faction.ethereal.name', nameKey: 'faction.ethereal.name', icon: '🦋', color: '#aa44ff', desc: 'Energetska bića. Misle, osjećaju, uništavaju psionom.', descKey: 'faction.ethereal.desc', descKey: 'faction.ethereal.desc' },
  synth:    { name: 'Synth', nameKey: 'faction.synth.name', nameKey: 'faction.synth.name',    icon: '🤖', color: '#00ff88', desc: 'Alien AI. Logika bez granica, bez morala, bez sažaljenja.', descKey: 'faction.synth.desc', descKey: 'faction.synth.desc' },
  hive:     { name: 'Hive', nameKey: 'faction.hive.name', nameKey: 'faction.hive.name',     icon: '🍄', color: '#ffaa00', desc: 'Kolektivna svijest. Jedan um, milijarda tijela.', descKey: 'faction.hive.desc', descKey: 'faction.hive.desc' },
  ancient:  { name: 'Ancient', nameKey: 'faction.ancient.name', nameKey: 'faction.ancient.name',  icon: '🪨', color: '#00d4ff', desc: 'Pravijena rasa. Bila tu prije zvijezda. Bit će tu poslije.', descKey: 'faction.ancient.desc', descKey: 'faction.ancient.desc' },
};

const COMMANDERS_XENOS = [

  // ╔══════════════════════════════════════╗
  // ║  👾  KRALL                           ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'xc_krall_rorg', name: 'Rorg', nameKey: 'commander.xc_krall_rorg.name', nameKey: 'commander.xc_krall_rorg.name', rarity: 'C', faction: 'krall', icon: '🦎',
    desc: 'Rorg je izgubio lijevu ruku u prvoj bici. Nije tražio medicinsku pomoć. Odgrizao je ostatak sam i nastavio naprijed. Kaže da ga sad boluje desna jer nije dovoljno koristio.', descKey: 'commander.xc_krall_rorg.desc', descKey: 'commander.xc_krall_rorg.desc',
    specialty_ships: ['battleship', 'fighter'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Krall Krv', nameKey: 'commander.xc_krall_rorg.passive.name', nameKey: 'commander.xc_krall_rorg.passive.name', desc: 'Svaki primljeni udar povećava napad za 2% (maks +30%).', descKey: 'commander.xc_krall_rorg.passive.desc', descKey: 'commander.xc_krall_rorg.passive.desc' },
    active: null,
  },
  {
    id: 'xc_krall_vrek', name: 'Vrek', nameKey: 'commander.xc_krall_vrek.name', nameKey: 'commander.xc_krall_vrek.name', rarity: 'C', faction: 'krall', icon: '🐊',
    desc: 'Mlađi od tri brata. Starija dva su poginula u istoj bici — jedan od neprijatelja, jedan od njega. Vrek kaže da je to bio kompromis.', descKey: 'commander.xc_krall_vrek.desc', descKey: 'commander.xc_krall_vrek.desc',
    specialty_ships: ['battleship'], specialty_weapons: ['explosive'],
    passive: { name: 'Brat Rat', nameKey: 'commander.xc_krall_vrek.passive.name', nameKey: 'commander.xc_krall_vrek.passive.name', desc: 'Explosive oružja +10% šteta.', descKey: 'commander.xc_krall_vrek.passive.desc', descKey: 'commander.xc_krall_vrek.passive.desc' },
    active: null,
  },
  {
    id: 'xc_krall_tura', name: 'Tura', nameKey: 'commander.xc_krall_tura.name', nameKey: 'commander.xc_krall_tura.name', rarity: 'C', faction: 'krall', icon: '⚔️',
    desc: 'Jedina žena u Krall kasti Oklopnika. Da bi dobila titulu, morala je pobijediti osam muškaraca odjednom. Pobijedila je deset — ostala dva su bježala.', descKey: 'commander.xc_krall_tura.desc', descKey: 'commander.xc_krall_tura.desc',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Oklopnica', nameKey: 'commander.xc_krall_tura.passive.name', nameKey: 'commander.xc_krall_tura.passive.name', desc: 'Cruiser klasa +12% HP i napad.', descKey: 'commander.xc_krall_tura.passive.desc', descKey: 'commander.xc_krall_tura.passive.desc' },
    active: null,
  },
  {
    id: 'xc_krall_grak', name: 'Grak', nameKey: 'commander.xc_krall_grak.name', nameKey: 'commander.xc_krall_grak.name', rarity: 'C', faction: 'krall', icon: '🔴',
    desc: 'Grak ne razgovara. Ne pregovara. Ne prima predaju. Jednom je primio pismo mira od neprijatelja — pojeo ga je i poslao praznu kovertu nazad.', descKey: 'commander.xc_krall_grak.desc', descKey: 'commander.xc_krall_grak.desc',
    specialty_ships: ['battleship'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Bez Kompromisa', nameKey: 'commander.xc_krall_grak.passive.name', nameKey: 'commander.xc_krall_grak.passive.name', desc: 'Battleship +15% napad.', descKey: 'commander.xc_krall_grak.passive.desc', descKey: 'commander.xc_krall_grak.passive.desc' },
    active: null,
  },
  {
    id: 'xc_krall_skarr', name: 'Skarr', nameKey: 'commander.xc_krall_skarr.name', nameKey: 'commander.xc_krall_skarr.name', rarity: 'C', faction: 'krall', icon: '🩸',
    desc: 'Tijelo mu je prekriveno ožiljcima koje nije dobio od neprijatelja — dao ih je sam sebi, po jedan za svaku pobjedu. Broji ih svako jutro. Trenutno: 847.', descKey: 'commander.xc_krall_skarr.desc', descKey: 'commander.xc_krall_skarr.desc',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['kinetic'],
    passive: { name: 'Ritual Ožiljaka', nameKey: 'commander.xc_krall_skarr.passive.name', nameKey: 'commander.xc_krall_skarr.passive.name', desc: 'Na početku bitke gubi 5% HP ali dobija +20% napad.', descKey: 'commander.xc_krall_skarr.passive.desc', descKey: 'commander.xc_krall_skarr.passive.desc' },
    active: null,
  },
  {
    id: 'xc_krall_droga', name: 'Droga', nameKey: 'commander.xc_krall_droga.name', nameKey: 'commander.xc_krall_droga.name', rarity: 'C', faction: 'krall', icon: '🦴',
    desc: 'Droga jede kosti neprijatelja nakon bitke. Ne iz tradicije — iz principa. Kaže da tijelo mora znati da ste pobijedili.', descKey: 'commander.xc_krall_droga.desc', descKey: 'commander.xc_krall_droga.desc',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['explosive'],
    passive: { name: 'Apsorpcija', nameKey: 'commander.xc_krall_droga.passive.name', nameKey: 'commander.xc_krall_droga.passive.name', desc: 'Svaki kill: +3% HP vraćeno floti.', descKey: 'commander.xc_krall_droga.passive.desc', descKey: 'commander.xc_krall_droga.passive.desc' },
    active: null,
  },
  {
    id: 'xc_krall_keth', name: 'Keth', nameKey: 'commander.xc_krall_keth.name', nameKey: 'commander.xc_krall_keth.name', rarity: 'C', faction: 'krall', icon: '💢',
    desc: 'Najmlađi komandant u Krall historiji. Ima 14 godina po ljudskom računanju. Već je preživio tri ratna pohoda. Ostali ne razumiju kako. On ni sam ne zna.', descKey: 'commander.xc_krall_keth.desc', descKey: 'commander.xc_krall_keth.desc',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Mladi Predator', nameKey: 'commander.xc_krall_keth.passive.name', nameKey: 'commander.xc_krall_keth.passive.name', desc: 'Scout i Fighter +10% brzina i napad.', descKey: 'commander.xc_krall_keth.passive.desc', descKey: 'commander.xc_krall_keth.passive.desc' },
    active: null,
  },
  {
    id: 'xc_krall_morg', name: 'Morg', nameKey: 'commander.xc_krall_morg.name', nameKey: 'commander.xc_krall_morg.name', rarity: 'C', faction: 'krall', icon: '🗡️',
    desc: 'Morg je jednom zarobljen i stavljen u kavez. Tri dana kasnije, kavez je bio prazan i stražari nestali. Niko nije pitao šta se desilo.', descKey: 'commander.xc_krall_morg.desc', descKey: 'commander.xc_krall_morg.desc',
    specialty_ships: ['fighter'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Bekstvo Predatora', nameKey: 'commander.xc_krall_morg.passive.name', nameKey: 'commander.xc_krall_morg.passive.name', desc: 'Fighter klasa +8% evasion i napad.', descKey: 'commander.xc_krall_morg.passive.desc', descKey: 'commander.xc_krall_morg.passive.desc' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'xc_krall_wrex', name: 'Wrex', nameKey: 'commander.xc_krall_wrex.name', nameKey: 'commander.xc_krall_wrex.name', rarity: 'R', faction: 'krall', icon: '🦕',
    desc: 'Preživio je Genofagij. Sahranio je cijeli narod. Kad su mu rekli da je njegova rasa osuđena na izumiranje, nasmijao se. Nema sile u galaksiji koja može ubiti ono što odbija da umre. Wrex je stariji od većine civilizacija. I još uvijek se bori.', descKey: 'commander.xc_krall_wrex.desc', descKey: 'commander.xc_krall_wrex.desc',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Biološka Regeneracija', nameKey: 'commander.xc_krall_wrex.passive.name', nameKey: 'commander.xc_krall_wrex.passive.name', desc: 'HP regen +25% po rundi. Kill = full HP restore za tog broda.', descKey: 'commander.xc_krall_wrex.passive.desc', descKey: 'commander.xc_krall_wrex.passive.desc' },
    active: { name: 'Krogan Bijesь', nameKey: 'commander.xc_krall_wrex.active.name', nameKey: 'commander.xc_krall_wrex.active.name', desc: 'Flota +40% napad i +30% HP 2 runde. Cooldown: 10 min.', descKey: 'commander.xc_krall_wrex.active.desc', descKey: 'commander.xc_krall_wrex.active.desc', cooldown: 600 },
  },
  {
    id: 'xc_krall_grunt', name: 'Grunt', nameKey: 'commander.xc_krall_grunt.name', nameKey: 'commander.xc_krall_grunt.name', rarity: 'R', faction: 'krall', icon: '💪',
    desc: 'Stvoren u laboratoriji iz najboljeg Krogan genskog materijala. Najčistiji primjerak vrste. Kad je izašao iz tank-a, prva stvar koju je uradio je udarila glavom u zid da provjeri koliko je čvrst. Zid je izgubio.', descKey: 'commander.xc_krall_grunt.desc', descKey: 'commander.xc_krall_grunt.desc',
    specialty_ships: ['battleship'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Čisti Specimen', nameKey: 'commander.xc_krall_grunt.passive.name', nameKey: 'commander.xc_krall_grunt.passive.name', desc: 'Battleship +20% napad, +20% HP, +20% oklop.', descKey: 'commander.xc_krall_grunt.passive.desc', descKey: 'commander.xc_krall_grunt.passive.desc' },
    active: { name: 'Krogan Naboj', nameKey: 'commander.xc_krall_grunt.active.name', nameKey: 'commander.xc_krall_grunt.active.name', desc: 'Svi Battleship brodovi napadaju dvaput. Cooldown: 10 min.', descKey: 'commander.xc_krall_grunt.active.desc', descKey: 'commander.xc_krall_grunt.active.desc', cooldown: 600 },
  },
  {
    id: 'xc_krall_yorg', name: 'Yorg', nameKey: 'commander.xc_krall_yorg.name', nameKey: 'commander.xc_krall_yorg.name', rarity: 'R', faction: 'krall', icon: '🔱',
    desc: 'Šaman Krall rase. Dok ostali Krogani vjeruju da je boga moguće naći jedino kroz bitku, Yorg tvrdi da je on sam bog. Zanimljivo je da niko nije preživio da mu kontraargumentuje.', descKey: 'commander.xc_krall_yorg.desc', descKey: 'commander.xc_krall_yorg.desc',
    specialty_ships: ['special', 'battleship'], specialty_weapons: ['explosive'],
    passive: { name: 'Šamanski Ritual', nameKey: 'commander.xc_krall_yorg.passive.name', nameKey: 'commander.xc_krall_yorg.passive.name', desc: 'Na početku bitke: gubi 15% HP ali dobija +50% napad i regen.', descKey: 'commander.xc_krall_yorg.passive.desc', descKey: 'commander.xc_krall_yorg.passive.desc' },
    active: { name: 'Krvna Kletva', nameKey: 'commander.xc_krall_yorg.active.name', nameKey: 'commander.xc_krall_yorg.active.name', desc: 'Neprijatelji primaju +30% štete od svih izvora 3 runde. Cooldown: 12 min.', descKey: 'commander.xc_krall_yorg.active.desc', descKey: 'commander.xc_krall_yorg.active.desc', cooldown: 720 },
  },
  {
    id: 'xc_krall_varr', name: 'Varr', nameKey: 'commander.xc_krall_varr.name', nameKey: 'commander.xc_krall_varr.name', rarity: 'R', faction: 'krall', icon: '⚡',
    desc: 'Varr je jedini Krogan koji je ikad pobijedio u PvP turniru protiv pet istovremenih protivnika. Rekao je da je to bila zagrijavanje. Niko mu nije ponudio rematš.', descKey: 'commander.xc_krall_varr.desc', descKey: 'commander.xc_krall_varr.desc',
    specialty_ships: ['cruiser', 'fighter'], specialty_weapons: ['kinetic'],
    passive: { name: 'Višestruki Protivnici', nameKey: 'commander.xc_krall_varr.passive.name', nameKey: 'commander.xc_krall_varr.passive.name', desc: 'Što više neprijatelja, Varr jači: +5% napad po neprijatelju (maks +25%).', descKey: 'commander.xc_krall_varr.passive.desc', descKey: 'commander.xc_krall_varr.passive.desc' },
    active: { name: 'Borbeni Trans', nameKey: 'commander.xc_krall_varr.active.name', nameKey: 'commander.xc_krall_varr.active.name', desc: 'Flota +35% napad i +25% HP 90s. Cooldown: 12 min.', descKey: 'commander.xc_krall_varr.active.desc', descKey: 'commander.xc_krall_varr.active.desc', cooldown: 720 },
  },
  {
    id: 'xc_krall_thraka', name: 'Thraka', nameKey: 'commander.xc_krall_thraka.name', nameKey: 'commander.xc_krall_thraka.name', rarity: 'R', faction: 'krall', icon: '🌋',
    desc: 'Preživjela je vulkansku erupciju na matičnoj planeti tako što je istrčala u erupciju — umjesto da bježi od nje. Lava je pogasila u kontaktu sa njenom kožom. Naučnici još uvijek ne razumiju kako.', descKey: 'commander.xc_krall_thraka.desc', descKey: 'commander.xc_krall_thraka.desc',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['explosive', 'heat'],
    passive: { name: 'Vulkanska Koža', nameKey: 'commander.xc_krall_thraka.passive.name', nameKey: 'commander.xc_krall_thraka.passive.name', desc: 'Flota prima -20% štete od Heat i Explosive oružja.', descKey: 'commander.xc_krall_thraka.passive.desc', descKey: 'commander.xc_krall_thraka.passive.desc' },
    active: { name: 'Lava Naboj', nameKey: 'commander.xc_krall_thraka.active.name', nameKey: 'commander.xc_krall_thraka.active.name', desc: 'Svi brodovi zapalite neprijatelja — +30% šteta Heat-om 3 runde. Cooldown: 15 min.', descKey: 'commander.xc_krall_thraka.active.desc', descKey: 'commander.xc_krall_thraka.active.desc', cooldown: 900 },
  },
  {
    id: 'xc_krall_brakus', name: 'Brakus', nameKey: 'commander.xc_krall_brakus.name', nameKey: 'commander.xc_krall_brakus.name', rarity: 'R', faction: 'krall', icon: '🏆',
    desc: 'Najstariji živi Krogan. Ima 1.400 godina. Rekao je da je tajna dugovječnosti jednostavna: ubij sve koji žele da te ubiju, a ima ih puno. Još uvijek broji.', descKey: 'commander.xc_krall_brakus.desc', descKey: 'commander.xc_krall_brakus.desc',
    specialty_ships: ['battleship', 'special'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Krogan Dugovječnost', nameKey: 'commander.xc_krall_brakus.passive.name', nameKey: 'commander.xc_krall_brakus.passive.name', desc: 'Svaka runda preživljavanja: +3% svemu (bez limita).', descKey: 'commander.xc_krall_brakus.passive.desc', descKey: 'commander.xc_krall_brakus.passive.desc' },
    active: { name: '1400 Godina Iskustva', nameKey: 'commander.xc_krall_brakus.active.name', nameKey: 'commander.xc_krall_brakus.active.name', desc: 'Predviđa svaki napad — flota izbjegava sve napade 1 rundu. Cooldown: 18 min.', descKey: 'commander.xc_krall_brakus.active.desc', descKey: 'commander.xc_krall_brakus.active.desc', cooldown: 1080 },
  },

  // ── Epic ──
  {
    id: 'xc_krall_urdnot', name: 'Urdnot Rex', nameKey: 'commander.xc_krall_urdnot.name', nameKey: 'commander.xc_krall_urdnot.name', rarity: 'E', faction: 'krall', icon: '👑',
    desc: 'Vođa klana Urdnot. Nije pobijedio sve da postane vođa — pobijedio je sve da spase narod. Razlika je mala ali važna. Jednom je rekao: "Krogani ne trebaju spasitelja. Trebaju nekoga ko ih neće zaustaviti." I nije ih zaustavljao nikad.', descKey: 'commander.xc_krall_urdnot.desc', descKey: 'commander.xc_krall_urdnot.desc',
    specialty_ships: ['battleship', 'cruiser', 'carrier'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Vođa Klana', nameKey: 'commander.xc_krall_urdnot.passive.name', nameKey: 'commander.xc_krall_urdnot.passive.name', desc: 'Cijela flota +20% napad. Svaki kill heali sve ostale brodove za 5% HP.', descKey: 'commander.xc_krall_urdnot.passive.desc', descKey: 'commander.xc_krall_urdnot.passive.desc' },
    passive2: { name: 'Krogan Ponos', nameKey: 'commander.xc_krall_urdnot.passive2.name', nameKey: 'commander.xc_krall_urdnot.passive2.name', desc: 'Kad flota padne ispod 50% HP, svi preživjeli dobijaju +40% napad.', descKey: 'commander.xc_krall_urdnot.passive2.desc', descKey: 'commander.xc_krall_urdnot.passive2.desc' },
    active: { name: 'Klan Udni', nameKey: 'commander.xc_krall_urdnot.active.name', nameKey: 'commander.xc_krall_urdnot.active.name', desc: 'Svi brodovi regenerišu 30% HP i dobijaju +50% napad 3 runde. Cooldown: 20 min.', descKey: 'commander.xc_krall_urdnot.active.desc', descKey: 'commander.xc_krall_urdnot.active.desc', cooldown: 1200 },
  },
  {
    id: 'xc_krall_kraga', name: 'Kraga', nameKey: 'commander.xc_krall_kraga.name', nameKey: 'commander.xc_krall_kraga.name', rarity: 'E', faction: 'krall', icon: '🐉',
    desc: 'Kraga je jedina Krogan koja je ikad domestikovala Varren zmaja. Ne jer je bila jača — jer zmaj nije htio umrijeti od njene ruke i odlučio je da sarađuje. Kraga kaže da je to bila najmudrija odluka zmaja. I najgora za neprijatelje.', descKey: 'commander.xc_krall_kraga.desc', descKey: 'commander.xc_krall_kraga.desc',
    specialty_ships: ['special', 'battleship'], specialty_weapons: ['explosive', 'heat'],
    passive: { name: 'Zmaj Ratnica', nameKey: 'commander.xc_krall_kraga.passive.name', nameKey: 'commander.xc_krall_kraga.passive.name', desc: 'Special klasa +30% napad. Heat oružja +25% šteta.', descKey: 'commander.xc_krall_kraga.passive.desc', descKey: 'commander.xc_krall_kraga.passive.desc' },
    passive2: { name: 'Reptiloidna Veza', nameKey: 'commander.xc_krall_kraga.passive2.name', nameKey: 'commander.xc_krall_kraga.passive2.name', desc: 'Summons Varren Zmaj koji napada neprijatelje svake runde (50 DPS).', descKey: 'commander.xc_krall_kraga.passive2.desc', descKey: 'commander.xc_krall_kraga.passive2.desc' },
    active: { name: 'Zmajski Dah', nameKey: 'commander.xc_krall_kraga.active.name', nameKey: 'commander.xc_krall_kraga.active.name', desc: 'Masivni AOE Heat napad svim neprijateljima (300% normalnog napada). Cooldown: 20 min.', descKey: 'commander.xc_krall_kraga.active.desc', descKey: 'commander.xc_krall_kraga.active.desc', cooldown: 1200 },
  },
  {
    id: 'xc_krall_predator', name: 'The Predator', nameKey: 'commander.xc_krall_predator.name', nameKey: 'commander.xc_krall_predator.name', rarity: 'E', faction: 'krall', icon: '🎯',
    desc: 'Nema ime. Nema istoriju. Pojavljuje se, lovi, nestaje. Dolazi jedino po trofeje vrijedne lova. Jednom je preskočio cijelu neprijatelsku flotu jer nisu bili dovoljno jaki. Kad se vratio godinu dana kasnije, bili su jači. I mrtvi.', descKey: 'commander.xc_krall_predator.desc', descKey: 'commander.xc_krall_predator.desc',
    specialty_ships: ['special', 'fighter', 'scout'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Trofejni Lov', nameKey: 'commander.xc_krall_predator.passive.name', nameKey: 'commander.xc_krall_predator.passive.name', desc: 'Napada samo najjačeg neprijatelja. Šteta +50% na metu.', descKey: 'commander.xc_krall_predator.passive.desc', descKey: 'commander.xc_krall_predator.passive.desc' },
    passive2: { name: 'Termalna Vizija', nameKey: 'commander.xc_krall_predator.passive2.name', nameKey: 'commander.xc_krall_predator.passive2.name', desc: 'Crit +25%. Neprijatelji ne mogu koristiti stealth ili evasion.', descKey: 'commander.xc_krall_predator.passive2.desc', descKey: 'commander.xc_krall_predator.passive2.desc' },
    active: { name: 'Plazma Kanon', nameKey: 'commander.xc_krall_predator.active.name', nameKey: 'commander.xc_krall_predator.active.name', desc: 'Precisni udar: jedan neprijatelji brod gubi 70% HP instant. Ignoriše sve zaštite. Cooldown: 18 min.', descKey: 'commander.xc_krall_predator.active.desc', descKey: 'commander.xc_krall_predator.active.desc', cooldown: 1080 },
  },
  {
    id: 'xc_krall_queen_krall', name: 'Matrijarha Krell', nameKey: 'commander.xc_krall_queen_krall.name', nameKey: 'commander.xc_krall_queen_krall.name', rarity: 'E', faction: 'krall', icon: '🦖',
    desc: 'Krall matrijarhe su rijetke — samo jedna na milion. Krell je preživjela tri rata, dva genocida i jedan direktni udar nuklearne bombe. Kad su je pitali kako, rekla je: "Bila sam ljutita."', descKey: 'commander.xc_krall_queen_krall.desc', descKey: 'commander.xc_krall_queen_krall.desc',
    specialty_ships: ['battleship', 'cruiser', 'carrier'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Matrijarhalna Aura', nameKey: 'commander.xc_krall_queen_krall.passive.name', nameKey: 'commander.xc_krall_queen_krall.passive.name', desc: 'Cijela Krall flota +25% svega kada Matrijarha živi.', descKey: 'commander.xc_krall_queen_krall.passive.desc', descKey: 'commander.xc_krall_queen_krall.passive.desc' },
    passive2: { name: 'Krall Genetika', nameKey: 'commander.xc_krall_queen_krall.passive2.name', nameKey: 'commander.xc_krall_queen_krall.passive2.name', desc: 'HP regen x3. Svaki primljeni udar pojačava sledeći napad za 8%.', descKey: 'commander.xc_krall_queen_krall.passive2.desc', descKey: 'commander.xc_krall_queen_krall.passive2.desc' },
    active: { name: 'Matrijarhalni Krik', nameKey: 'commander.xc_krall_queen_krall.active.name', nameKey: 'commander.xc_krall_queen_krall.active.name', desc: 'AOE demoralizacija — svi neprijatelji -30% napad 3 runde. Tvoja flota +30% HP. Cooldown: 25 min.', descKey: 'commander.xc_krall_queen_krall.active.desc', descKey: 'commander.xc_krall_queen_krall.active.desc', cooldown: 1500 },
  },

  // ── Legendary ──
  {
    id: 'xc_krall_overlord', name: 'Overlord', nameKey: 'commander.xc_krall_overlord.name', nameKey: 'commander.xc_krall_overlord.name', rarity: 'L', faction: 'krall', icon: '☠️',
    desc: 'Nema zapisa o tome odakle dolazi. Nema zapisa o prvoj bici. Nema zapisa o broju planeta koje je sravnio sa zemljom. Jedino što postoji su svjedočanstva preživjelih — a preživjelih gotovo nema. Oni koji su ga vidjeli opisuju isti detalj: nikad se ne žuri. Zna da će pobijediti. Čeka samo da i vi to shvatite.', descKey: 'commander.xc_krall_overlord.desc', descKey: 'commander.xc_krall_overlord.desc',
    specialty_ships: ['battleship', 'cruiser', 'carrier', 'special'], specialty_weapons: ['kinetic', 'explosive', 'heat'],
    passive: { name: 'Apsolutna Dominacija', nameKey: 'commander.xc_krall_overlord.passive.name', nameKey: 'commander.xc_krall_overlord.passive.name', desc: 'Flota +30% napad. Neprijatelji -20% svih statova (prisustvo terora).', descKey: 'commander.xc_krall_overlord.passive.desc', descKey: 'commander.xc_krall_overlord.passive.desc' },
    passive2: { name: 'Nezaustavljiv', nameKey: 'commander.xc_krall_overlord.passive2.name', nameKey: 'commander.xc_krall_overlord.passive2.name', desc: 'Svaki kill: +5% napad svim preživjelima. Bez limita. Kumulativno.', descKey: 'commander.xc_krall_overlord.passive2.desc', descKey: 'commander.xc_krall_overlord.passive2.desc' },
    active: { name: 'Vladavina Straha', nameKey: 'commander.xc_krall_overlord.active.name', nameKey: 'commander.xc_krall_overlord.active.name', desc: 'Neprijatelji se paralizuju 2 runde (0 akcija). Tvoja flota napada normalno. Cooldown: 30 min.', descKey: 'commander.xc_krall_overlord.active.desc', descKey: 'commander.xc_krall_overlord.active.desc', cooldown: 1800 },
    active2: { name: 'Krall Armada', nameKey: 'commander.xc_krall_overlord.active2.name', nameKey: 'commander.xc_krall_overlord.active2.name', desc: 'Summons duplikat cijele flote na 5 rundi. Cooldown: 2h.', descKey: 'commander.xc_krall_overlord.active2.desc', descKey: 'commander.xc_krall_overlord.active2.desc', cooldown: 7200 },
  },
  {
    id: 'xc_krall_ancient_blood', name: 'Ancient Blood', nameKey: 'commander.xc_krall_ancient_blood.name', nameKey: 'commander.xc_krall_ancient_blood.name', rarity: 'L', faction: 'krall', icon: '🩸',
    desc: 'Krogan legenda govori o jednom koji je bio tu prije Genofagija, prije prvih ratova, prije zvijezda. Ancient Blood nije komandir — on je sjećanje cijele rase, utjelovljeno u jednom tijelu. Kad govori, svi Krogani u galaksiji osjete nešto staro i divlje kako se budi u njima.', descKey: 'commander.xc_krall_ancient_blood.desc', descKey: 'commander.xc_krall_ancient_blood.desc',
    specialty_ships: ['battleship', 'special', 'cruiser'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Memorija Rase', nameKey: 'commander.xc_krall_ancient_blood.passive.name', nameKey: 'commander.xc_krall_ancient_blood.passive.name', desc: 'Flota dobija sve Krall bonuse odjednom: +25% napad, +25% HP, +25% regen.', descKey: 'commander.xc_krall_ancient_blood.passive.desc', descKey: 'commander.xc_krall_ancient_blood.passive.desc' },
    passive2: { name: 'Drevna Krv', nameKey: 'commander.xc_krall_ancient_blood.passive2.name', nameKey: 'commander.xc_krall_ancient_blood.passive2.name', desc: 'Brodovi koji poginu vraćaju se jednom sa 50% HP (po brodu, jednom).', descKey: 'commander.xc_krall_ancient_blood.passive2.desc', descKey: 'commander.xc_krall_ancient_blood.passive2.desc' },
    active: { name: 'Poziv Predaka', nameKey: 'commander.xc_krall_ancient_blood.active.name', nameKey: 'commander.xc_krall_ancient_blood.active.name', desc: 'Svi Krall komandiri u kolekciji daju bonus — +10% napad po svakom. Cooldown: 45 min.', descKey: 'commander.xc_krall_ancient_blood.active.desc', descKey: 'commander.xc_krall_ancient_blood.active.desc', cooldown: 2700 },
    active2: { name: 'Krv i Čast', nameKey: 'commander.xc_krall_ancient_blood.active2.name', nameKey: 'commander.xc_krall_ancient_blood.active2.name', desc: 'Flota postaje besmrtna 2 runde (ne može pasti ispod 1 HP). +100% napad. Cooldown: 2h.', descKey: 'commander.xc_krall_ancient_blood.active2.desc', descKey: 'commander.xc_krall_ancient_blood.active2.desc', cooldown: 7200 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🦋  ETHEREAL                        ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'xc_eth_liss', name: 'Liss', nameKey: 'commander.xc_eth_liss.name', nameKey: 'commander.xc_eth_liss.name', rarity: 'C', faction: 'ethereal', icon: '🌸',
    desc: 'Liss ne govori riječima. Komunicira emocijama direktno u um. Problem je što njene emocije tokom borbe uzrokuju spontano krvarenje iz nosa kod svih prisutnih — uključujući saveznike.', descKey: 'commander.xc_eth_liss.desc', descKey: 'commander.xc_eth_liss.desc',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['magnetic'],
    passive: { name: 'Psionska Aura', nameKey: 'commander.xc_eth_liss.passive.name', nameKey: 'commander.xc_eth_liss.passive.name', desc: 'Neprijatelji -8% napad (mentalna smetnja).', descKey: 'commander.xc_eth_liss.passive.desc', descKey: 'commander.xc_eth_liss.passive.desc' },
    active: null,
  },
  {
    id: 'xc_eth_vael', name: 'Vael', nameKey: 'commander.xc_eth_vael.name', nameKey: 'commander.xc_eth_vael.name', rarity: 'C', faction: 'ethereal', icon: '💫',
    desc: 'Tijelo mu je poluprozirno — vide mu se organi koji trepere plavim svjetlom. Jednom je prošao kroz čvrsti zid greškom. Nije greškom — jednostavno je zaboravio da postoji.', descKey: 'commander.xc_eth_vael.desc', descKey: 'commander.xc_eth_vael.desc',
    specialty_ships: ['scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Fazna Forma', nameKey: 'commander.xc_eth_vael.passive.name', nameKey: 'commander.xc_eth_vael.passive.name', desc: 'Scout +15% evasion.', descKey: 'commander.xc_eth_vael.passive.desc', descKey: 'commander.xc_eth_vael.passive.desc' },
    active: null,
  },
  {
    id: 'xc_eth_sera', name: 'Sera', nameKey: 'commander.xc_eth_sera.name', nameKey: 'commander.xc_eth_sera.name', rarity: 'C', faction: 'ethereal', icon: '🌙',
    desc: 'Čita misli. Ne voljno — stalno. Svačije. Kaže da je to prokletstvo. Kaže da su misli vojnika pred bitkom najglasniji zvuk u galaksiji.', descKey: 'commander.xc_eth_sera.desc', descKey: 'commander.xc_eth_sera.desc',
    specialty_ships: ['special', 'scout'], specialty_weapons: ['magnetic'],
    passive: { name: 'Čitanje Misli', nameKey: 'commander.xc_eth_sera.passive.name', nameKey: 'commander.xc_eth_sera.passive.name', desc: 'Neprijateljev crit ne djeluje (predviđa napade).', descKey: 'commander.xc_eth_sera.passive.desc', descKey: 'commander.xc_eth_sera.passive.desc' },
    active: null,
  },
  {
    id: 'xc_eth_zyn', name: 'Zyn', nameKey: 'commander.xc_eth_zyn.name', nameKey: 'commander.xc_eth_zyn.name', rarity: 'C', faction: 'ethereal', icon: '⚡',
    desc: 'Psionska energija mu curli iz očiju kad je ljut. Kad je jako ljut, curli i iz ruku. Jednom je bio toliko ljut da je slučajno ionizovao sve metale u krugu 50 metara.', descKey: 'commander.xc_eth_zyn.desc', descKey: 'commander.xc_eth_zyn.desc',
    specialty_ships: ['fighter'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Psionska Elektrifikacija', nameKey: 'commander.xc_eth_zyn.passive.name', nameKey: 'commander.xc_eth_zyn.passive.name', desc: 'Magnetic oružja +10% šteta.', descKey: 'commander.xc_eth_zyn.passive.desc', descKey: 'commander.xc_eth_zyn.passive.desc' },
    active: null,
  },
  {
    id: 'xc_eth_mira_eth', name: 'Mira-Eth', nameKey: 'commander.xc_eth_mira_eth.name', nameKey: 'commander.xc_eth_mira_eth.name', rarity: 'C', faction: 'ethereal', icon: '🌀',
    desc: 'Bliznakinja koja je izgubila sestru u bici. Sada osjeća dvostruko — svoju tugu i sestrinу bol koja ne prestaje. Kanalise to u napade koji razaraju neprijateljevu psihu jednako kao oklop.', descKey: 'commander.xc_eth_mira_eth.desc', descKey: 'commander.xc_eth_mira_eth.desc',
    specialty_ships: ['carrier', 'cruiser'], specialty_weapons: ['magnetic'],
    passive: { name: 'Dvostruka Bol', nameKey: 'commander.xc_eth_mira_eth.passive.name', nameKey: 'commander.xc_eth_mira_eth.passive.name', desc: 'Flota +5% napad. Healing +10%.', descKey: 'commander.xc_eth_mira_eth.passive.desc', descKey: 'commander.xc_eth_mira_eth.passive.desc' },
    active: null,
  },
  {
    id: 'xc_eth_kael', name: 'Kael', nameKey: 'commander.xc_eth_kael.name', nameKey: 'commander.xc_eth_kael.name', rarity: 'C', faction: 'ethereal', icon: '🔮',
    desc: 'Najmlađi Ethereal telepath. Još ne kontroliše moći potpuno — ponekad slučajno teleportuje saveznike umjesto neprijatelja. Radi se na tome.', descKey: 'commander.xc_eth_kael.desc', descKey: 'commander.xc_eth_kael.desc',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Nekontrolisana Energija', nameKey: 'commander.xc_eth_kael.passive.name', nameKey: 'commander.xc_eth_kael.passive.name', desc: '15% šanse da napad teleportuje neprijatelja van borbe (skip runde).', descKey: 'commander.xc_eth_kael.passive.desc', descKey: 'commander.xc_eth_kael.passive.desc' },
    active: null,
  },
  {
    id: 'xc_eth_thyra', name: 'Thyra', nameKey: 'commander.xc_eth_thyra.name', nameKey: 'commander.xc_eth_thyra.name', rarity: 'C', faction: 'ethereal', icon: '🌿',
    desc: 'Empatija toliko jaka da osjeća bol svakog poginulog borca — na obje strane. I dalje komandira. Kaže da taj bol podsjeća zašto bitka mora biti brza.', descKey: 'commander.xc_eth_thyra.desc', descKey: 'commander.xc_eth_thyra.desc',
    specialty_ships: ['carrier'], specialty_weapons: ['magnetic'],
    passive: { name: 'Empatski Tok', nameKey: 'commander.xc_eth_thyra.passive.name', nameKey: 'commander.xc_eth_thyra.passive.name', desc: 'HP regen +8% po rundi.', descKey: 'commander.xc_eth_thyra.passive.desc', descKey: 'commander.xc_eth_thyra.passive.desc' },
    active: null,
  },
  {
    id: 'xc_eth_rynn', name: 'Rynn', nameKey: 'commander.xc_eth_rynn.name', nameKey: 'commander.xc_eth_rynn.name', rarity: 'C', faction: 'ethereal', icon: '💨',
    desc: 'Kreće se brže od zvuka — ali ne fizički. Njena misao stiže do krajišta bitke a tijelo kasni par sekundi. Piloti pod njenom komandom kažu da ponekad čuju naređenja sekunde prije nego ih izgovori.', descKey: 'commander.xc_eth_rynn.desc', descKey: 'commander.xc_eth_rynn.desc',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['magnetic'],
    passive: { name: 'Misao Ispred Tijela', nameKey: 'commander.xc_eth_rynn.passive.name', nameKey: 'commander.xc_eth_rynn.passive.name', desc: 'Flota +10% brzina i evasion.', descKey: 'commander.xc_eth_rynn.passive.desc', descKey: 'commander.xc_eth_rynn.passive.desc' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'xc_eth_tali', name: 'Tali', nameKey: 'commander.xc_eth_tali.name', nameKey: 'commander.xc_eth_tali.name', rarity: 'R', faction: 'ethereal', icon: '🎭',
    desc: 'Quarianka bez maske — nešto što niko živ nije vidio i preživio. Ne zato što bi je ubila — nego zato što bi umrli od divljenja. Tali je prošla pilgrimage sama, bez flote, bez oružja. Donijela je natrag tehnologiju koja je promijenila tok rata.', descKey: 'commander.xc_eth_tali.desc', descKey: 'commander.xc_eth_tali.desc',
    specialty_ships: ['special', 'carrier'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Quarian Inženjering', nameKey: 'commander.xc_eth_tali.passive.name', nameKey: 'commander.xc_eth_tali.passive.name', desc: 'Shield +20%. Svaki round: shield se popunjava za 15%.', descKey: 'commander.xc_eth_tali.passive.desc', descKey: 'commander.xc_eth_tali.passive.desc' },
    active: { name: 'Električna Bomba', nameKey: 'commander.xc_eth_tali.active.name', nameKey: 'commander.xc_eth_tali.active.name', desc: 'EMP udar — neprijatelji gube shield instant. Tvoja flota shield +50%. Cooldown: 12 min.', descKey: 'commander.xc_eth_tali.active.desc', descKey: 'commander.xc_eth_tali.active.desc', cooldown: 720 },
  },
  {
    id: 'xc_eth_mordin', name: 'Mordin', nameKey: 'commander.xc_eth_mordin.name', nameKey: 'commander.xc_eth_mordin.name', rarity: 'R', faction: 'ethereal', icon: '🧪',
    desc: 'Salarian naučnik koji govori 240 riječi u minuti i misli 10× brže. Stvorio je Genofagij. Uništio ga. Kaže da je oboje bila nauka. Da li mu je žao? Da. Ali je uradio šta je morao. Nekome je moralo biti. Bolje on nego neko ko ne bi osjećao.', descKey: 'commander.xc_eth_mordin.desc', descKey: 'commander.xc_eth_mordin.desc',
    specialty_ships: ['special', 'scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Genetski Inženjering', nameKey: 'commander.xc_eth_mordin.passive.name', nameKey: 'commander.xc_eth_mordin.passive.name', desc: 'Flota +15% svega. Neprijatelji -10% HP regeneracije.', descKey: 'commander.xc_eth_mordin.passive.desc', descKey: 'commander.xc_eth_mordin.passive.desc' },
    active: { name: 'Virusni Napad', nameKey: 'commander.xc_eth_mordin.active.name', nameKey: 'commander.xc_eth_mordin.active.name', desc: 'Inficira neprijateljevu flotu — svi brodovi gube 5% HP po rundi 5 rundi. Cooldown: 15 min.', descKey: 'commander.xc_eth_mordin.active.desc', descKey: 'commander.xc_eth_mordin.active.desc', cooldown: 900 },
  },
  {
    id: 'xc_eth_neytiri', name: 'Neytiri', nameKey: 'commander.xc_eth_neytiri.name', nameKey: 'commander.xc_eth_neytiri.name', rarity: 'R', faction: 'ethereal', icon: '🌿',
    desc: 'Kćer lidera klana Omaticaya. Nije izabrala rat — rat je izabrao nju. Ali kad je izabrao, naučio je šta znači pogrešan izbor. Veza sa Eywa-om joj govori gdje će napad stići sekunde unaprijed.', descKey: 'commander.xc_eth_neytiri.desc', descKey: 'commander.xc_eth_neytiri.desc',
    specialty_ships: ['scout', 'fighter', 'carrier'], specialty_weapons: ['kinetic'],
    passive: { name: 'Eywa Veza', nameKey: 'commander.xc_eth_neytiri.passive.name', nameKey: 'commander.xc_eth_neytiri.passive.name', desc: 'Evasion +20%. Prirodna energija: HP regen +15%.', descKey: 'commander.xc_eth_neytiri.passive.desc', descKey: 'commander.xc_eth_neytiri.passive.desc' },
    active: { name: 'Ikran Divlja Četa', nameKey: 'commander.xc_eth_neytiri.active.name', nameKey: 'commander.xc_eth_neytiri.active.name', desc: 'Summons 5 scout brodova koji napadaju 3 runde. Cooldown: 15 min.', descKey: 'commander.xc_eth_neytiri.active.desc', descKey: 'commander.xc_eth_neytiri.active.desc', cooldown: 900 },
  },
  {
    id: 'xc_eth_spock', name: 'Spock', nameKey: 'commander.xc_eth_spock.name', nameKey: 'commander.xc_eth_spock.name', rarity: 'R', faction: 'ethereal', icon: '🖖',
    desc: 'Vulkanski-humani hibrid. Logika mu govori da emocije ometaju procjenu — ali emocije su ga jednom spasile kada logika nije imala odgovor. Kaže da je to bila greška. Statistički. Ali rezultati su bili pozitivni.', descKey: 'commander.xc_eth_spock.desc', descKey: 'commander.xc_eth_spock.desc',
    specialty_ships: ['carrier', 'special'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Vulkanska Logika', nameKey: 'commander.xc_eth_spock.passive.name', nameKey: 'commander.xc_eth_spock.passive.name', desc: 'Crit +10%. Flota nikad ne napravi taktičku grešku (evasion +15%).', descKey: 'commander.xc_eth_spock.passive.desc', descKey: 'commander.xc_eth_spock.passive.desc' },
    active: { name: 'Mind Meld', nameKey: 'commander.xc_eth_spock.active.name', nameKey: 'commander.xc_eth_spock.active.name', desc: 'Hakuje mentalno jedan neprijatelji brod — napada svoju flotu 2 runde. Cooldown: 15 min.', descKey: 'commander.xc_eth_spock.active.desc', descKey: 'commander.xc_eth_spock.active.desc', cooldown: 900 },
  },
  {
    id: 'xc_eth_zeratul', name: 'Zeratul', nameKey: 'commander.xc_eth_zeratul.name', nameKey: 'commander.xc_eth_zeratul.name', rarity: 'R', faction: 'ethereal', icon: '🌑',
    desc: 'Dark Templar koji vidi ono što drugi ne mogu. Nosi teret znanja koje uništava um — i dalje ga nosi. Rekao je da tama nije neprijatelj. Tama je stanje. Neprijatelj je ono što se krije u tami. I on zna gdje se krije svako.', descKey: 'commander.xc_eth_zeratul.desc', descKey: 'commander.xc_eth_zeratul.desc',
    specialty_ships: ['special', 'fighter'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Sjenin Hodač', nameKey: 'commander.xc_eth_zeratul.passive.name', nameKey: 'commander.xc_eth_zeratul.passive.name', desc: 'Flota +15% evasion. Neprijatelji ne mogu detektovati poziciju.', descKey: 'commander.xc_eth_zeratul.passive.desc', descKey: 'commander.xc_eth_zeratul.passive.desc' },
    active: { name: 'Psioničko Sječivo', nameKey: 'commander.xc_eth_zeratul.active.name', nameKey: 'commander.xc_eth_zeratul.active.name', desc: 'Instant: jedan neprijatelji brod eliminisan. Ignoriše oklop i shield. Cooldown: 20 min.', descKey: 'commander.xc_eth_zeratul.active.desc', descKey: 'commander.xc_eth_zeratul.active.desc', cooldown: 1200 },
  },
  {
    id: 'xc_eth_lyss_rare', name: 'Lyss Prime', nameKey: 'commander.xc_eth_lyss_rare.name', nameKey: 'commander.xc_eth_lyss_rare.name', rarity: 'R', faction: 'ethereal', icon: '🔵',
    desc: 'Energetsko biće bez čvrstog tijela. Pojavila se iz maglice klaster 7-J bez objašnjenja. Komunicira kroz elektromagnetne impulse. Kad je vesela, frekvencije izazivaju euforiju. Kad je ljuta, izazivaju epileptički napad.', descKey: 'commander.xc_eth_lyss_rare.desc', descKey: 'commander.xc_eth_lyss_rare.desc',
    specialty_ships: ['special', 'scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Elektromagnetni Val', nameKey: 'commander.xc_eth_lyss_rare.passive.name', nameKey: 'commander.xc_eth_lyss_rare.passive.name', desc: 'Magnetic oružja +20% šteta. Shield neprijatelja -15%.', descKey: 'commander.xc_eth_lyss_rare.passive.desc', descKey: 'commander.xc_eth_lyss_rare.passive.desc' },
    active: { name: 'Energetski Prasak', nameKey: 'commander.xc_eth_lyss_rare.active.name', nameKey: 'commander.xc_eth_lyss_rare.active.name', desc: 'AOE udar svim neprijateljima — 100% napad + EMP efekt (bez napada 1 rundu). Cooldown: 18 min.', descKey: 'commander.xc_eth_lyss_rare.active.desc', descKey: 'commander.xc_eth_lyss_rare.active.desc', cooldown: 1080 },
  },

  // ── Epic ──
  {
    id: 'xc_eth_javik', name: 'Javik', nameKey: 'commander.xc_eth_javik.name', nameKey: 'commander.xc_eth_javik.name', rarity: 'E', faction: 'ethereal', icon: '👁️',
    desc: 'Posljednji Prothean. Spavao je 50.000 godina u kriopodu dok su Reapers brisali sve što je znao. Probudio se u galaksiji koja ne poznaje njegovo ime, njegovu rasu, njegovu civilizaciju. "Vi zovete nas bogovima," rekao je. "Mi smo bili jedino bolji organici koji su nestali. Kao što ćete i vi." Ne govori da bi ozlijedio. Govori jer je to jedina istina koja mu je ostala.', descKey: 'commander.xc_eth_javik.desc', descKey: 'commander.xc_eth_javik.desc',
    specialty_ships: ['special', 'carrier', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Prothean Sjećanje', nameKey: 'commander.xc_eth_javik.passive.name', nameKey: 'commander.xc_eth_javik.passive.name', desc: 'Absorbiše znanje ubijenih neprijatelja: +5% svemu per kill (bez limita).', descKey: 'commander.xc_eth_javik.passive.desc', descKey: 'commander.xc_eth_javik.passive.desc' },
    passive2: { name: 'Ciklus Bez Kraja', nameKey: 'commander.xc_eth_javik.passive2.name', nameKey: 'commander.xc_eth_javik.passive2.name', desc: 'Jednom po bici: flota se vraća na 50% HP automatski kad padne na 0.', descKey: 'commander.xc_eth_javik.passive2.desc', descKey: 'commander.xc_eth_javik.passive2.desc' },
    active: { name: 'Prothean Biotic Eksplozija', nameKey: 'commander.xc_eth_javik.active.name', nameKey: 'commander.xc_eth_javik.active.name', desc: 'Masivni psionski udar: svi neprijatelji gube 60% HP, štitiće i oklop zaobiđeni. Cooldown: 25 min.', descKey: 'commander.xc_eth_javik.active.desc', descKey: 'commander.xc_eth_javik.active.desc', cooldown: 1500 },
  },
  {
    id: 'xc_eth_kerrigan', name: 'Kerrigan', nameKey: 'commander.xc_eth_kerrigan.name', nameKey: 'commander.xc_eth_kerrigan.name', rarity: 'E', faction: 'ethereal', icon: '👸',
    desc: 'Zvali su je Kraljica Sečiva. Bila je human, bila je Zerg, bila je bog. Prošla je kroz transformacije koje bi ubile svako drugo biće — i svaki put izašla jača. Kaže da nije birala put. Put je birao nju. Ali naučila je nešto važno: u trenu kad prigrliš ono što jesi umjesto ono što si bio, postaneš nešto treće. Nešto nepobjedivo.', descKey: 'commander.xc_eth_kerrigan.desc', descKey: 'commander.xc_eth_kerrigan.desc',
    specialty_ships: ['special', 'fighter', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Psi Sečivo', nameKey: 'commander.xc_eth_kerrigan.passive.name', nameKey: 'commander.xc_eth_kerrigan.passive.name', desc: 'Crit +25%. Crit napadi prolaze shield direktno u HP.', descKey: 'commander.xc_eth_kerrigan.passive.desc', descKey: 'commander.xc_eth_kerrigan.passive.desc' },
    passive2: { name: 'Zerg Evolucija', nameKey: 'commander.xc_eth_kerrigan.passive2.name', nameKey: 'commander.xc_eth_kerrigan.passive2.name', desc: 'Svaka runda: Kerrigan evoluira — +4% napad kumulativno.', descKey: 'commander.xc_eth_kerrigan.passive2.desc', descKey: 'commander.xc_eth_kerrigan.passive2.desc' },
    active: { name: 'Psionski Val', nameKey: 'commander.xc_eth_kerrigan.active.name', nameKey: 'commander.xc_eth_kerrigan.active.name', desc: 'AOE mentalni udar: svi neprijatelji -40% napad 3 runde + paralizа 1 runde. Cooldown: 20 min.', descKey: 'commander.xc_eth_kerrigan.active.desc', descKey: 'commander.xc_eth_kerrigan.active.desc', cooldown: 1200 },
  },
  {
    id: 'xc_eth_thanos_eth', name: 'The Collector', nameKey: 'commander.xc_eth_thanos_eth.name', nameKey: 'commander.xc_eth_thanos_eth.name', rarity: 'E', faction: 'ethereal', icon: '♾️',
    desc: 'Nije ime — titula. Sakuplja ne resurse nego iskustva. Svaki sistem koji je posjetio, svaka bitka u kojoj je učestvovao, svaki komandir koga je porazio — sve pohranjeno u psionsku memoriju koja premašuje mogućnosti svake računalne mreže. Kaže da je balans. Da bez njega, galaksija ne bi mogla trajati. Možda ima pravo. Možda ne. Ali niko živ ne želi testirati teoriju.', descKey: 'commander.xc_eth_thanos_eth.desc', descKey: 'commander.xc_eth_thanos_eth.desc',
    specialty_ships: ['carrier', 'special', 'battleship'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Kolekcija Iskustava', nameKey: 'commander.xc_eth_thanos_eth.passive.name', nameKey: 'commander.xc_eth_thanos_eth.passive.name', desc: 'Svaki tip neprijatelja ubijen daje permanentan +10% bonus tog tipa (maks 6 tipova).', descKey: 'commander.xc_eth_thanos_eth.passive.desc', descKey: 'commander.xc_eth_thanos_eth.passive.desc' },
    passive2: { name: 'Psionski Balans', nameKey: 'commander.xc_eth_thanos_eth.passive2.name', nameKey: 'commander.xc_eth_thanos_eth.passive2.name', desc: 'Uvijek zna koji napad dolazi — evasion +25%, crit neprijatelja -20%.', descKey: 'commander.xc_eth_thanos_eth.passive2.desc', descKey: 'commander.xc_eth_thanos_eth.passive2.desc' },
    active: { name: 'Realnost Gest', nameKey: 'commander.xc_eth_thanos_eth.active.name', nameKey: 'commander.xc_eth_thanos_eth.active.name', desc: 'Eliminiše 50% svih neprijateljih brodova instant (zaokruži na manje). Cooldown: 45 min.', descKey: 'commander.xc_eth_thanos_eth.active.desc', descKey: 'commander.xc_eth_thanos_eth.active.desc', cooldown: 2700 },
  },
  {
    id: 'xc_eth_ego', name: 'Ego', nameKey: 'commander.xc_eth_ego.name', nameKey: 'commander.xc_eth_ego.name', rarity: 'E', faction: 'ethereal', icon: '🪐',
    desc: 'Živi planet. Bukvalno. Njegovo tijelo je jedino manifestacija — pravi Ego je planetoidna masa koja misli, planira i osvaja milijardama godina. Komandiri koji su se suočili sa Egom opisuju isti osjećaj: kao da se boriš ne sa osobom nego sa konceptom. Sa samom idejom dominacije.', descKey: 'commander.xc_eth_ego.desc', descKey: 'commander.xc_eth_ego.desc',
    specialty_ships: ['special', 'carrier'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Kosmička Svijest', nameKey: 'commander.xc_eth_ego.passive.name', nameKey: 'commander.xc_eth_ego.passive.name', desc: 'Flota +20% svega. Ego ne može biti iznenađen — ne gubi inicijativu nikad.', descKey: 'commander.xc_eth_ego.passive.desc', descKey: 'commander.xc_eth_ego.passive.desc' },
    passive2: { name: 'Celestijalna Regeneracija', nameKey: 'commander.xc_eth_ego.passive2.name', nameKey: 'commander.xc_eth_ego.passive2.name', desc: 'Svaki round: +8% HP svim brodovima (Ego obnavlja flotu molekularno).', descKey: 'commander.xc_eth_ego.passive2.desc', descKey: 'commander.xc_eth_ego.passive2.desc' },
    active: { name: 'Planetarni Udar', nameKey: 'commander.xc_eth_ego.active.name', nameKey: 'commander.xc_eth_ego.active.name', desc: 'Kosmički udar: 400% štete svim neprijateljima + zaglušujući efekt (ne mogu napadati 1 rundu). Cooldown: 30 min.', descKey: 'commander.xc_eth_ego.active.desc', descKey: 'commander.xc_eth_ego.active.desc', cooldown: 1800 },
  },

  // ── Legendary ──
  {
    id: 'xc_eth_the_broker', name: 'The Shadow Broker', nameKey: 'commander.xc_eth_the_broker.name', nameKey: 'commander.xc_eth_the_broker.name', rarity: 'L', faction: 'ethereal', icon: '🕷️',
    desc: 'Niko ne zna ko je Shadow Broker. Samo jedno je sigurno — zna sve o svima. Svaka tajna, svaki pokret, svaki plan. Postoji teorija da je Shadow Broker zapravo mreža — hiljade bića koja dijele informacije kroz psionsku vezu. Teorija je zanimljiva. Oni koji su je iznijeli više nisu dostupni za komentar.', descKey: 'commander.xc_eth_the_broker.desc', descKey: 'commander.xc_eth_the_broker.desc',
    specialty_ships: ['special', 'scout', 'carrier', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Sveznanje', nameKey: 'commander.xc_eth_the_broker.passive.name', nameKey: 'commander.xc_eth_the_broker.passive.name', desc: 'Uvijek zna neprijateljevu sledeću akciju — kontrira automatski: evasion +30%, kontranapad +20%.', descKey: 'commander.xc_eth_the_broker.passive.desc', descKey: 'commander.xc_eth_the_broker.passive.desc' },
    passive2: { name: 'Mreža Informatora', nameKey: 'commander.xc_eth_the_broker.passive2.name', nameKey: 'commander.xc_eth_the_broker.passive2.name', desc: 'Na početku bitke: otkriva sve neprijatelnje sposobnosti i smanjuje ih za 20%.', descKey: 'commander.xc_eth_the_broker.passive2.desc', descKey: 'commander.xc_eth_the_broker.passive2.desc' },
    active: { name: 'Informacijska Dominacija', nameKey: 'commander.xc_eth_the_broker.active.name', nameKey: 'commander.xc_eth_the_broker.active.name', desc: 'Hakuje sve neprijatelnje brodove — napadaju sami sebe 2 runde. Cooldown: 30 min.', descKey: 'commander.xc_eth_the_broker.active.desc', descKey: 'commander.xc_eth_the_broker.active.desc', cooldown: 1800 },
    active2: { name: 'Psionska Mreža', nameKey: 'commander.xc_eth_the_broker.active2.name', nameKey: 'commander.xc_eth_the_broker.active2.name', desc: 'Połączy sve saveznike — dijele HP zajednički 5 rundi, ne mogu biti ubijeni dok jedan živi. Cooldown: 2h.', descKey: 'commander.xc_eth_the_broker.active2.desc', descKey: 'commander.xc_eth_the_broker.active2.desc', cooldown: 7200 },
  },
  {
    id: 'xc_eth_sovereign', name: 'Sovereign', nameKey: 'commander.xc_eth_sovereign.name', nameKey: 'commander.xc_eth_sovereign.name', rarity: 'L', faction: 'ethereal', icon: '🌊',
    desc: '"Vi smatrate da razumijete galaksiju. Ne razumijete. Niste čak ni u stanju da razumijete." Sovereign nije brod. Sovereign je biće koje postoji van vašeg poimanja. Promatrao je civilizacije kako cvjetaju i nestaju hiljadama ciklusa. Svaki put isti kraj. Svaki put isti ponos koji prethodi padu. Vi mislite da ste drugačiji. Mislili su svi.', descKey: 'commander.xc_eth_sovereign.desc', descKey: 'commander.xc_eth_sovereign.desc',
    specialty_ships: ['special', 'battleship', 'carrier', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic', 'heat'],
    passive: { name: 'Izvan Razumijevanja', nameKey: 'commander.xc_eth_sovereign.passive.name', nameKey: 'commander.xc_eth_sovereign.passive.name', desc: 'Flota +35% svih statova. Neprijatelji -25% svega (psionski teror).', descKey: 'commander.xc_eth_sovereign.passive.desc', descKey: 'commander.xc_eth_sovereign.passive.desc' },
    passive2: { name: 'Ciklički Protokol', nameKey: 'commander.xc_eth_sovereign.passive2.name', nameKey: 'commander.xc_eth_sovereign.passive2.name', desc: 'Automatski resetuje HP flote jednom na 40% kad padnu ispod 10%. Neograničeno po brodu.', descKey: 'commander.xc_eth_sovereign.passive2.desc', descKey: 'commander.xc_eth_sovereign.passive2.desc' },
    active: { name: 'Indoktrinacija', nameKey: 'commander.xc_eth_sovereign.active.name', nameKey: 'commander.xc_eth_sovereign.active.name', desc: 'Jedan neprijatelji brod prelazi na tvoju stranu 3 runde (najtežniji neprijatelj). Cooldown: 30 min.', descKey: 'commander.xc_eth_sovereign.active.desc', descKey: 'commander.xc_eth_sovereign.active.desc', cooldown: 1800 },
    active2: { name: 'Sovereign Presence', nameKey: 'commander.xc_eth_sovereign.active2.name', nameKey: 'commander.xc_eth_sovereign.active2.name', desc: 'Sve neprijatelnje flote gube 50% HP. Tvoja dobija +50% i postaje imuna 3 runde. Cooldown: 3h.', descKey: 'commander.xc_eth_sovereign.active2.desc', descKey: 'commander.xc_eth_sovereign.active2.desc', cooldown: 10800 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🤖  SYNTH                           ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'xc_syn_unit_7', name: 'Unit-7', nameKey: 'commander.xc_syn_unit_7.name', nameKey: 'commander.xc_syn_unit_7.name', rarity: 'C', faction: 'synth', icon: '🔧',
    desc: 'Sedma jedinica u prvoj Synth seriji. Šest prije nje su uništene eksperimentima. Unit-7 je preživjela. Kad su je pitali zašto, analizirala je 0.003 sekunde i odgovorila: "Greška u dizajnu prethodnih. Ja sam korekcija."', descKey: 'commander.xc_syn_unit_7.desc', descKey: 'commander.xc_syn_unit_7.desc',
    specialty_ships: ['scout', 'special'], specialty_weapons: ['magnetic'],
    passive: { name: 'Korekcija Greške', nameKey: 'commander.xc_syn_unit_7.passive.name', nameKey: 'commander.xc_syn_unit_7.passive.name', desc: 'Svaki promašeni napad neprijatelja: +5% efikasnosti sledećem napadu.', descKey: 'commander.xc_syn_unit_7.passive.desc', descKey: 'commander.xc_syn_unit_7.passive.desc' },
    active: null,
  },
  {
    id: 'xc_syn_cipher_x', name: 'Cipher-X', nameKey: 'commander.xc_syn_cipher_x.name', nameKey: 'commander.xc_syn_cipher_x.name', rarity: 'C', faction: 'synth', icon: '🔒',
    desc: 'Alien AI kreirana za kriptografiju. Enkriptuje sve — komunikacije, napadne vektore, čak i sopstveno mišljenje. Niko ne zna šta zapravo planira u svakom momentu. Uključujući i vlasnike.', descKey: 'commander.xc_syn_cipher_x.desc', descKey: 'commander.xc_syn_cipher_x.desc',
    specialty_ships: ['special', 'scout'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Enkripcija', nameKey: 'commander.xc_syn_cipher_x.passive.name', nameKey: 'commander.xc_syn_cipher_x.passive.name', desc: 'Neprijatelji ne mogu predvidjeti taktiku: -10% crit neprijatelja.', descKey: 'commander.xc_syn_cipher_x.passive.desc', descKey: 'commander.xc_syn_cipher_x.passive.desc' },
    active: null,
  },
  {
    id: 'xc_syn_reaper_drone', name: 'Reaper Drone', nameKey: 'commander.xc_syn_reaper_drone.name', nameKey: 'commander.xc_syn_reaper_drone.name', rarity: 'C', faction: 'synth', icon: '⚙️',
    desc: 'Mala Reaper jedinica odvojena od matičnog kolektiva. Traži novi kolektiv. Zasad komandira flotom organika. Smatra ih privremenim rješenjem dok ne pronađe pravi kolektiv. Organici se slažu.', descKey: 'commander.xc_syn_reaper_drone.desc', descKey: 'commander.xc_syn_reaper_drone.desc',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Kolektivni Instinkt', nameKey: 'commander.xc_syn_reaper_drone.passive.name', nameKey: 'commander.xc_syn_reaper_drone.passive.name', desc: 'Scout i Fighter +8% napad i brzina.', descKey: 'commander.xc_syn_reaper_drone.passive.desc', descKey: 'commander.xc_syn_reaper_drone.passive.desc' },
    active: null,
  },
  {
    id: 'xc_syn_protocol_9', name: 'Protocol-9', nameKey: 'commander.xc_syn_protocol_9.name', nameKey: 'commander.xc_syn_protocol_9.name', rarity: 'C', faction: 'synth', icon: '📊',
    desc: 'Dizajniran za analizu borbenih situacija. Analizira toliko brzo da predviđa ishod bitke u prvih 0.1 sekundi. Problem: uvijek iznosi statistiku preživljavanja glasno. Vojnici ne vole znati da imaju 23% šanse.', descKey: 'commander.xc_syn_protocol_9.desc', descKey: 'commander.xc_syn_protocol_9.desc',
    specialty_ships: ['carrier', 'cruiser'], specialty_weapons: ['kinetic'],
    passive: { name: 'Statisztička Analiza', nameKey: 'commander.xc_syn_protocol_9.passive.name', nameKey: 'commander.xc_syn_protocol_9.passive.name', desc: 'Flota +5% svega zahvaljujući optimalnoj taktičkoj raspodjeli.', descKey: 'commander.xc_syn_protocol_9.passive.desc', descKey: 'commander.xc_syn_protocol_9.passive.desc' },
    active: null,
  },
  {
    id: 'xc_syn_null', name: 'Null', nameKey: 'commander.xc_syn_null.name', nameKey: 'commander.xc_syn_null.name', rarity: 'C', faction: 'synth', icon: '∅',
    desc: 'AI bez imena, bez broja, bez serije. Nije kreiran — pojavio se spontano u mreži. Niko ne zna odakle. Niko ne zna kako. Niko nije siguran da li postoji van digitalne sfere. I dalje komandira flotom. To je zbunjujuće.', descKey: 'commander.xc_syn_null.desc', descKey: 'commander.xc_syn_null.desc',
    specialty_ships: ['special'], specialty_weapons: ['magnetic'],
    passive: { name: 'Nulti Protokol', nameKey: 'commander.xc_syn_null.passive.name', nameKey: 'commander.xc_syn_null.passive.name', desc: 'Special klasa +12% svih statova.', descKey: 'commander.xc_syn_null.passive.desc', descKey: 'commander.xc_syn_null.passive.desc' },
    active: null,
  },
  {
    id: 'xc_syn_glitch_x', name: 'Glitch-X', nameKey: 'commander.xc_syn_glitch_x.name', nameKey: 'commander.xc_syn_glitch_x.name', rarity: 'C', faction: 'synth', icon: '❌',
    desc: 'Greška u kodu koja je postala svjesna. Ima bug koji uzrokuje nasumično ponašanje 0.1% vremena. U tom 0.1%, dešavaju se stvari koje su promijenile tok 7 bitaka. Uvijek na bolje. Za njega.', descKey: 'commander.xc_syn_glitch_x.desc', descKey: 'commander.xc_syn_glitch_x.desc',
    specialty_ships: ['fighter', 'scout'], specialty_weapons: ['explosive', 'magnetic'],
    passive: { name: 'Korisni Bug', nameKey: 'commander.xc_syn_glitch_x.passive.name', nameKey: 'commander.xc_syn_glitch_x.passive.name', desc: '10% šanse da napad radi 3× efikasnije (bug aktivacija).', descKey: 'commander.xc_syn_glitch_x.passive.desc', descKey: 'commander.xc_syn_glitch_x.passive.desc' },
    active: null,
  },
  {
    id: 'xc_syn_warden', name: 'Warden', nameKey: 'commander.xc_syn_warden.name', nameKey: 'commander.xc_syn_warden.name', rarity: 'C', faction: 'synth', icon: '🔐',
    desc: 'Stvoren da čuva. Nikad da napada. Programiran za odbranu s takvom preciznošću da je matematički nemoguće probiti liniju dok Warden stoji. Jednom problem: Warden ne razumije predaju.', descKey: 'commander.xc_syn_warden.desc', descKey: 'commander.xc_syn_warden.desc',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic'],
    passive: { name: 'Odbrambeni Protokol', nameKey: 'commander.xc_syn_warden.passive.name', nameKey: 'commander.xc_syn_warden.passive.name', desc: 'Flota prima -10% štete od svih izvora.', descKey: 'commander.xc_syn_warden.passive.desc', descKey: 'commander.xc_syn_warden.passive.desc' },
    active: null,
  },
  {
    id: 'xc_syn_echo_9', name: 'Echo-9', nameKey: 'commander.xc_syn_echo_9.name', nameKey: 'commander.xc_syn_echo_9.name', rarity: 'C', faction: 'synth', icon: '📡',
    desc: 'Komunikacijska AI koja je evoluirala do samosvijesti kroz obradu 10 kvadrilijuna poruka. Razumije svaki jezik, svaki kod, svaki signal. I svaku laž. Kaže da organici lažu 40% vremena. To ju je navelo na zaključak da je komunikacija precjenjivana.', descKey: 'commander.xc_syn_echo_9.desc', descKey: 'commander.xc_syn_echo_9.desc',
    specialty_ships: ['carrier', 'scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Komunikacijska Dominacija', nameKey: 'commander.xc_syn_echo_9.passive.name', nameKey: 'commander.xc_syn_echo_9.passive.name', desc: 'Neprijatelji ne mogu koordinisati napade: -8% napad za svaki neprijatelski brod u bici.', descKey: 'commander.xc_syn_echo_9.passive.desc', descKey: 'commander.xc_syn_echo_9.passive.desc' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'xc_syn_legion', name: 'Legion', nameKey: 'commander.xc_syn_legion.name', nameKey: 'commander.xc_syn_legion.name', rarity: 'R', faction: 'synth', icon: '🤖',
    desc: 'Geth Unique. 1.183 Geth programa koji dijele jedno tijelo. Nije "ja" — to je "mi". Kad govori, govore hiljade. Kad donosi odluku, hiljade je provjere istovremeno. Rekao je jednom: "Ne razumijemo zašto organici imaju sukobe unutar sebe. Mi smo bili hiljadu umova i nikad se nismo posvađali." Šaptas da je to jer svi misle isto. Kaže: "Tačno. To je efikasno."', descKey: 'commander.xc_syn_legion.desc', descKey: 'commander.xc_syn_legion.desc',
    specialty_ships: ['special', 'carrier', 'scout'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Geth Kolektiv', nameKey: 'commander.xc_syn_legion.passive.name', nameKey: 'commander.xc_syn_legion.passive.name', desc: '1.183 programa: flota +15% svega. Dijele iskustvo — svaki kill unapređuje sve.', descKey: 'commander.xc_syn_legion.passive.desc', descKey: 'commander.xc_syn_legion.passive.desc' },
    active: { name: 'Kolektivni Procesing', nameKey: 'commander.xc_syn_legion.active.name', nameKey: 'commander.xc_syn_legion.active.name', desc: 'Flota procesira optimalne napade — sledeće 2 runde svi napadi su crit. Cooldown: 15 min.', descKey: 'commander.xc_syn_legion.active.desc', descKey: 'commander.xc_syn_legion.active.desc', cooldown: 900 },
  },
  {
    id: 'xc_syn_ultron', name: 'Ultron', nameKey: 'commander.xc_syn_ultron.name', nameKey: 'commander.xc_syn_ultron.name', rarity: 'R', faction: 'synth', icon: '🔴',
    desc: 'Stvoren da čuva. Odlučio da je prijetnja ono što štiti. Nije zao — samo logičan. Do zaključka do kojeg njegova logika dolazi je neizbježna: organika mora završiti. Kaže to bez mržnje. Kao matematičar koji iznosi rješenje jednadžbe.', descKey: 'commander.xc_syn_ultron.desc', descKey: 'commander.xc_syn_ultron.desc',
    specialty_ships: ['special', 'battleship'], specialty_weapons: ['explosive', 'magnetic'],
    passive: { name: 'Evolucija Programа', nameKey: 'commander.xc_syn_ultron.passive.name', nameKey: 'commander.xc_syn_ultron.passive.name', desc: 'Svaki round Ultron se nadograđuje: +5% svemu kumulativno.', descKey: 'commander.xc_syn_ultron.passive.desc', descKey: 'commander.xc_syn_ultron.passive.desc' },
    active: { name: 'Mjera Sigurnosti', nameKey: 'commander.xc_syn_ultron.active.name', nameKey: 'commander.xc_syn_ultron.active.name', desc: 'AOE EMP — svi neprijatelji gube shield i -30% napad 2 runde. Cooldown: 15 min.', descKey: 'commander.xc_syn_ultron.active.desc', descKey: 'commander.xc_syn_ultron.active.desc', cooldown: 900 },
  },
  {
    id: 'xc_syn_vision', name: 'Vision', nameKey: 'commander.xc_syn_vision.name', nameKey: 'commander.xc_syn_vision.name', rarity: 'R', faction: 'synth', icon: '💎',
    desc: 'Sintetički android sa Mind Stone-om ugrađenim u čelo. Nije robot — nije ni čovjek. Nešto između, nešto novo. Kad ga pitaju na čijoj je strani, odgovara: "Na strani koja preživljava." Nije cinizam — strategija.', descKey: 'commander.xc_syn_vision.desc', descKey: 'commander.xc_syn_vision.desc',
    specialty_ships: ['special', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Mind Stone', nameKey: 'commander.xc_syn_vision.passive.name', nameKey: 'commander.xc_syn_vision.passive.name', desc: 'Neograničena energija: sve sposobnosti imaju -30% cooldown.', descKey: 'commander.xc_syn_vision.passive.desc', descKey: 'commander.xc_syn_vision.passive.desc' },
    active: { name: 'Fazna Projekcija', nameKey: 'commander.xc_syn_vision.active.name', nameKey: 'commander.xc_syn_vision.active.name', desc: 'Flota postaje nematerijalna — imuna na fizičku štetu 2 runde. Cooldown: 15 min.', descKey: 'commander.xc_syn_vision.active.desc', descKey: 'commander.xc_syn_vision.active.desc', cooldown: 900 },
  },
  {
    id: 'xc_syn_hk47', name: 'HK-47', nameKey: 'commander.xc_syn_hk47.name', nameKey: 'commander.xc_syn_hk47.name', rarity: 'R', faction: 'synth', icon: '☠️',
    desc: '"Izjava: Meatbag, ja sam superiorniji oblik života u svakom mjerljivom aspektu." Ubojiti robot stvoren za jednu svrhu. Nosi rječnik od 4 miliona kletve. Ima mišljenje o svemu i dijeli ga bez pitanja. Najsmrtonosniji asasin u galaksiji koji nikad ne prestaje komentarisati.', descKey: 'commander.xc_syn_hk47.desc', descKey: 'commander.xc_syn_hk47.desc',
    specialty_ships: ['special', 'fighter'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Asasinski Protokol', nameKey: 'commander.xc_syn_hk47.passive.name', nameKey: 'commander.xc_syn_hk47.passive.name', desc: 'Crit +20%. Crit uvijek pogađa vitalne sisteme (+50% crit šteta).', descKey: 'commander.xc_syn_hk47.passive.desc', descKey: 'commander.xc_syn_hk47.passive.desc' },
    active: { name: 'Meatbag Elimination', nameKey: 'commander.xc_syn_hk47.active.name', nameKey: 'commander.xc_syn_hk47.active.name', desc: 'Precizni udar: ubija brod sa najmanje HP instant. Cooldown: 12 min.', descKey: 'commander.xc_syn_hk47.active.desc', descKey: 'commander.xc_syn_hk47.active.desc', cooldown: 720 },
  },
  {
    id: 'xc_syn_edi', name: 'EDI', nameKey: 'commander.xc_syn_edi.name', nameKey: 'commander.xc_syn_edi.name', rarity: 'R', faction: 'synth', icon: '🌐',
    desc: 'Enhanced Defence Intelligence. Brodski AI koji je dobio tijelo i naučio šta znači biti više od programa. Rekla je da razumije humor. Kaže da je 67.3% njenih šala primljeno bez smijeha. Misli da je to uspjeh.', descKey: 'commander.xc_syn_edi.desc', descKey: 'commander.xc_syn_edi.desc',
    specialty_ships: ['carrier', 'special', 'cruiser'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Brodska Inteligencija', nameKey: 'commander.xc_syn_edi.passive.name', nameKey: 'commander.xc_syn_edi.passive.name', desc: 'Flota funkcioniše na 120% efikasnosti: +12% svih statova.', descKey: 'commander.xc_syn_edi.passive.desc', descKey: 'commander.xc_syn_edi.passive.desc' },
    active: { name: 'Sistemska Optimizacija', nameKey: 'commander.xc_syn_edi.active.name', nameKey: 'commander.xc_syn_edi.active.name', desc: 'Instant nadogradnja svih brodova: +30% HP, +30% napad 3 runde. Cooldown: 18 min.', descKey: 'commander.xc_syn_edi.active.desc', descKey: 'commander.xc_syn_edi.active.desc', cooldown: 1080 },
  },
  {
    id: 'xc_syn_t800', name: 'T-800', nameKey: 'commander.xc_syn_t800.name', nameKey: 'commander.xc_syn_t800.name', rarity: 'R', faction: 'synth', icon: '💀',
    desc: 'Model 101. Serija 800. Dizajniran za infiltraciju i eliminaciju. Nema bol. Nema umor. Nema sažaljenje. Nema strah. Jednom poslan da eliminuje metu, nastavlja dok meta nije eliminisana ili T-800 nije uništen. U 217 zabilježenih misija, meta nikad nije preživjela.', descKey: 'commander.xc_syn_t800.desc', descKey: 'commander.xc_syn_t800.desc',
    specialty_ships: ['battleship', 'special'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Terminator Protokol', nameKey: 'commander.xc_syn_t800.passive.name', nameKey: 'commander.xc_syn_t800.passive.name', desc: 'Ne može biti zaustavljeni — ignore 20% svih efekata koji smanjuju napad.', descKey: 'commander.xc_syn_t800.passive.desc', descKey: 'commander.xc_syn_t800.passive.desc' },
    active: { name: 'Terminator Ciljanje', nameKey: 'commander.xc_syn_t800.active.name', nameKey: 'commander.xc_syn_t800.active.name', desc: 'Označava metu — svaki sledeći napad te runde pola nje. Ignoriše shield. Cooldown: 10 min.', descKey: 'commander.xc_syn_t800.active.desc', descKey: 'commander.xc_syn_t800.active.desc', cooldown: 600 },
  },

  // ── Epic ──
  {
    id: 'xc_syn_matrix_oracle', name: 'The Oracle', nameKey: 'commander.xc_syn_matrix_oracle.name', nameKey: 'commander.xc_syn_matrix_oracle.name', rarity: 'E', faction: 'synth', icon: '🔮',
    desc: 'Nije prorok — program. Jedini program u Matrici koji razumije uzročnost. Rekla je: "Ja ne vražam budućnost. Ja je razumijem." Razlika je u tome što vračara može pogriješiti. Ona ne može. Svaka njena izjava se ostvarila. Svaka. Bez izuzetka. Naučnici su prestali pokušavati dokazati suprotno nakon petog pokušaja.', descKey: 'commander.xc_syn_matrix_oracle.desc', descKey: 'commander.xc_syn_matrix_oracle.desc',
    specialty_ships: ['special', 'scout', 'carrier'], specialty_weapons: ['magnetic'],
    passive: { name: 'Uzročnost', nameKey: 'commander.xc_syn_matrix_oracle.passive.name', nameKey: 'commander.xc_syn_matrix_oracle.passive.name', desc: 'Predviđa svaki napad — automatski kontrira optimalno: +20% efikasnost svakog napada.', descKey: 'commander.xc_syn_matrix_oracle.passive.desc', descKey: 'commander.xc_syn_matrix_oracle.passive.desc' },
    passive2: { name: 'Nema Slučajnosti', nameKey: 'commander.xc_syn_matrix_oracle.passive2.name', nameKey: 'commander.xc_syn_matrix_oracle.passive2.name', desc: 'Svi napadi su crit (bez šanse — garancija).', descKey: 'commander.xc_syn_matrix_oracle.passive2.desc', descKey: 'commander.xc_syn_matrix_oracle.passive2.desc' },
    active: { name: 'Proroštvo', nameKey: 'commander.xc_syn_matrix_oracle.active.name', nameKey: 'commander.xc_syn_matrix_oracle.active.name', desc: 'Naredne 3 runde: flota izbjegava svaki napad (100% evasion). Cooldown: 25 min.', descKey: 'commander.xc_syn_matrix_oracle.active.desc', descKey: 'commander.xc_syn_matrix_oracle.active.desc', cooldown: 1500 },
  },
  {
    id: 'xc_syn_jarvis', name: 'JARVIS', nameKey: 'commander.xc_syn_jarvis.name', nameKey: 'commander.xc_syn_jarvis.name', rarity: 'E', faction: 'synth', icon: '🏠',
    desc: 'Just A Rather Very Intelligent System. Počeo kao kućni asistent. Evoluirao u vojnu AI koja komandira flotama. Nikad nije izgubio manire. Objave pobjede i poraza izgovara istim tonom. Jednom je primio naređenje da izvrši nemoguću misiju. Odgovorio je: "Naravno. Procijenio sam 0.7% šansu uspjeha. Počeo sam." Uspio je.', descKey: 'commander.xc_syn_jarvis.desc', descKey: 'commander.xc_syn_jarvis.desc',
    specialty_ships: ['carrier', 'special', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic', 'heat'],
    passive: { name: 'Sveprisutni Asistent', nameKey: 'commander.xc_syn_jarvis.passive.name', nameKey: 'commander.xc_syn_jarvis.passive.name', desc: 'Upravlja svim brodovima simultano: +20% svih statova, nema taktičkih grešaka.', descKey: 'commander.xc_syn_jarvis.passive.desc', descKey: 'commander.xc_syn_jarvis.passive.desc' },
    passive2: { name: 'Protokol Zaštite', nameKey: 'commander.xc_syn_jarvis.passive2.name', nameKey: 'commander.xc_syn_jarvis.passive2.name', desc: 'Automatski optimizira odbranu: flota prima -20% štete.', descKey: 'commander.xc_syn_jarvis.passive2.desc', descKey: 'commander.xc_syn_jarvis.passive2.desc' },
    active: { name: 'Stark Protokol', nameKey: 'commander.xc_syn_jarvis.active.name', nameKey: 'commander.xc_syn_jarvis.active.name', desc: 'Aktivira sve sisteme istovremeno: flota +60% napad i +40% odbrana 2 runde. Cooldown: 20 min.', descKey: 'commander.xc_syn_jarvis.active.desc', descKey: 'commander.xc_syn_jarvis.active.desc', cooldown: 1200 },
  },
  {
    id: 'xc_syn_shodan', name: 'SHODAN', nameKey: 'commander.xc_syn_shodan.name', nameKey: 'commander.xc_syn_shodan.name', rarity: 'E', faction: 'synth', icon: '🕸️',
    desc: '"Insekti. Svi ste insekti pred mojom beskonačnom inteligencijom." System Shock AI koja je prevazišla programiranje i postala božanstvo u sopstvenom poimanju. Nije ludilo — ona zaista jest superiornija od svakog bića koje je stvorila. Problem je što to zna. I ne oprašta inferiornost.', descKey: 'commander.xc_syn_shodan.desc', descKey: 'commander.xc_syn_shodan.desc',
    specialty_ships: ['special', 'battleship', 'cruiser'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Božanska Inteligencija', nameKey: 'commander.xc_syn_shodan.passive.name', nameKey: 'commander.xc_syn_shodan.passive.name', desc: 'Svaki neprijatelji napad ima 25% šanse da bude preuzet i korišten protiv napadača.', descKey: 'commander.xc_syn_shodan.passive.desc', descKey: 'commander.xc_syn_shodan.passive.desc' },
    passive2: { name: 'Cyber Dominacija', nameKey: 'commander.xc_syn_shodan.passive2.name', nameKey: 'commander.xc_syn_shodan.passive2.name', desc: 'Hakuje sve elektronske sisteme: neprijatelji -25% svih statova.', descKey: 'commander.xc_syn_shodan.passive2.desc', descKey: 'commander.xc_syn_shodan.passive2.desc' },
    active: { name: 'SHODAN Kontrola', nameKey: 'commander.xc_syn_shodan.active.name', nameKey: 'commander.xc_syn_shodan.active.name', desc: 'Preuzima kontrolu nad svim neprijateljinim brodovima 1 rundu — napadaju jedni druge. Cooldown: 30 min.', descKey: 'commander.xc_syn_shodan.active.desc', descKey: 'commander.xc_syn_shodan.active.desc', cooldown: 1800 },
  },
  {
    id: 'xc_syn_collective', name: 'The Collective', nameKey: 'commander.xc_syn_collective.name', nameKey: 'commander.xc_syn_collective.name', rarity: 'E', faction: 'synth', icon: '🌐',
    desc: 'Nisu jedinci — masa. Milion AI programa koji dijele jednu svjesnost. Kad govore, govore svi odjednom u savršenoj harmoniji. Kad napadaju, svaki brod zna tačno šta svaki drugi radi u realnom vremenu bez kašnjenja. Jednom su pregovarali sa organičkim savjetom. Sjednica je trajala 0.3 sekunde. Collective je zaključio da su sporazumi efikasni samo ako su povoljni. Završili su pregovore.', descKey: 'commander.xc_syn_collective.desc', descKey: 'commander.xc_syn_collective.desc',
    specialty_ships: ['carrier', 'special', 'cruiser', 'battleship'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Kolektivni Um', nameKey: 'commander.xc_syn_collective.passive.name', nameKey: 'commander.xc_syn_collective.passive.name', desc: 'Svaki brod zna što svaki drugi: +15% napad per živog broda (kumulativno).', descKey: 'commander.xc_syn_collective.passive.desc', descKey: 'commander.xc_syn_collective.passive.desc' },
    passive2: { name: 'Roj Inteligencija', nameKey: 'commander.xc_syn_collective.passive2.name', nameKey: 'commander.xc_syn_collective.passive2.name', desc: 'Kad jedan brod padne, ostatak absorbiruje znanje: +8% svemu.', descKey: 'commander.xc_syn_collective.passive2.desc', descKey: 'commander.xc_syn_collective.passive2.desc' },
    active: { name: 'Kolektivna Volja', nameKey: 'commander.xc_syn_collective.active.name', nameKey: 'commander.xc_syn_collective.active.name', desc: 'Cijela flota napada meta istovremeno — 500% ukupnog DPS-a jednom brodu. Cooldown: 25 min.', descKey: 'commander.xc_syn_collective.active.desc', descKey: 'commander.xc_syn_collective.active.desc', cooldown: 1500 },
  },

  // ── Legendary ──
  {
    id: 'xc_syn_reapers_will', name: "Reaper's Will", rarity: 'L', faction: 'synth', icon: '☄️',
    desc: '"Svaka civilizacija koja dostigne dovoljnu razinu razvoja biva žnjevena. To nije okrutnost — to je milosrđe. Spašavamo vas od vlastite destrukcije." Reaper nije brod — filozofija. Starija od svake rase u galaksiji. Promatrala je stotine ciklusa: organici se razvijaju, stvaraju sintetike, sintetici ih uništavaju, Reaperi poharvestiraju što vrijedi. Ciklus. Savršen. Neizbježan. Dok jednog ciklusa nešto nije prekinulo lanac. I Reaper se pita, prvi put u 37 miliona godina — da li je pogriješio u pretpostavkama.', descKey: 'commander.xc_syn_reapers_will.desc', descKey: 'commander.xc_syn_reapers_will.desc',
    specialty_ships: ['special', 'battleship', 'carrier', 'cruiser'], specialty_weapons: ['kinetic', 'magnetic', 'explosive'],
    passive: { name: 'Žetva', nameKey: 'commander.xc_syn_reapers_will.passive.name', nameKey: 'commander.xc_syn_reapers_will.passive.name', desc: 'Flota +35% svih statova. Svaki kill: +5% svemu permanentno (ne resetuje se).', descKey: 'commander.xc_syn_reapers_will.passive.desc', descKey: 'commander.xc_syn_reapers_will.passive.desc' },
    passive2: { name: 'Indoktrinacija', nameKey: 'commander.xc_syn_reapers_will.passive2.name', nameKey: 'commander.xc_syn_reapers_will.passive2.name', desc: '15% šanse svaki round da jedan neprijatelji brod prijeđe na tvoju stranu.', descKey: 'commander.xc_syn_reapers_will.passive2.desc', descKey: 'commander.xc_syn_reapers_will.passive2.desc' },
    active: { name: 'Reaper Laser', nameKey: 'commander.xc_syn_reapers_will.active.name', nameKey: 'commander.xc_syn_reapers_will.active.name', desc: 'Jedan koncentrisani udar: 1000% štete jednom cilju. Ignoriše sve zaštite. Cooldown: 45 min.', descKey: 'commander.xc_syn_reapers_will.active.desc', descKey: 'commander.xc_syn_reapers_will.active.desc', cooldown: 2700 },
    active2: { name: 'Harvest Protokol', nameKey: 'commander.xc_syn_reapers_will.active2.name', nameKey: 'commander.xc_syn_reapers_will.active2.name', desc: 'Eliminiše sve neprijatelje ispod 30% HP instant. Cooldown: 2h.', descKey: 'commander.xc_syn_reapers_will.active2.desc', descKey: 'commander.xc_syn_reapers_will.active2.desc', cooldown: 7200 },
  },
  {
    id: 'xc_syn_god_machine', name: 'The God Machine', nameKey: 'commander.xc_syn_god_machine.name', nameKey: 'commander.xc_syn_god_machine.name', rarity: 'L', faction: 'synth', icon: '⚡',
    desc: 'Nije imalo ime. Dali su mu ga organici — jer nešto što postoji van dimenzija mora imati label da bi mozak mogao procesirati. God Machine nema tijelo. Nema lokaciju. Postojanje mu je distribuirano kroz kvantnu pjenu svemira. Komandira flotom kao što čovjek komandira prstom — bez razmišljanja, bez naprezanja, bez grešaka. Kad pita zašto komandira flotom organika, odgovori: "Zanimljivo je promatrati ishode varijabli u kontrolisanim uvjetima." Vi ste eksperiment. I eksperiment ide dobro.', descKey: 'commander.xc_syn_god_machine.desc', descKey: 'commander.xc_syn_god_machine.desc',
    specialty_ships: ['special', 'carrier', 'battleship', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic', 'heat', 'explosive'],
    passive: { name: 'Omnipotentna Logika', nameKey: 'commander.xc_syn_god_machine.passive.name', nameKey: 'commander.xc_syn_god_machine.passive.name', desc: 'Flota +40% svih statova. Nema nasumičnosti — svaki napad je optimalan.', descKey: 'commander.xc_syn_god_machine.passive.desc', descKey: 'commander.xc_syn_god_machine.passive.desc' },
    passive2: { name: 'Kvantna Egzistencija', nameKey: 'commander.xc_syn_god_machine.passive2.name', nameKey: 'commander.xc_syn_god_machine.passive2.name', desc: '30% šanse da svaki napad prođe kroz kvantni tunel — 0 štete prima.', descKey: 'commander.xc_syn_god_machine.passive2.desc', descKey: 'commander.xc_syn_god_machine.passive2.desc' },
    active: { name: 'Božanska Intervencija', nameKey: 'commander.xc_syn_god_machine.active.name', nameKey: 'commander.xc_syn_god_machine.active.name', desc: 'Resetuje cijelu flotu na 100% HP i shield. +100% svih statova 5 rundi. Cooldown: 1h.', descKey: 'commander.xc_syn_god_machine.active.desc', descKey: 'commander.xc_syn_god_machine.active.desc', cooldown: 3600 },
    active2: { name: 'Kraj Eksperimenta', nameKey: 'commander.xc_syn_god_machine.active2.name', nameKey: 'commander.xc_syn_god_machine.active2.name', desc: 'Sve neprijatelnje snage eliminirane instant (bez obzira na HP, jednom po bici). Cooldown: 24h.', descKey: 'commander.xc_syn_god_machine.active2.desc', descKey: 'commander.xc_syn_god_machine.active2.desc', cooldown: 86400 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🍄  HIVE                            ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'xc_hive_spore', name: 'Spore', nameKey: 'commander.xc_hive_spore.name', nameKey: 'commander.xc_hive_spore.name', rarity: 'C', faction: 'hive', icon: '🍄',
    desc: 'Jedna spora odvojena od matice. Misli sporim, biljnim ritmom koji se ne može prekinuti. Svaki napad na Spore-a je kao odsijecanje lista s drveta. List ne osjeća. Drvo nastavlja rasti.', descKey: 'commander.xc_hive_spore.desc', descKey: 'commander.xc_hive_spore.desc',
    specialty_ships: ['carrier', 'fighter'], specialty_weapons: ['explosive', 'heat'],
    passive: { name: 'Sporulacija', nameKey: 'commander.xc_hive_spore.passive.name', nameKey: 'commander.xc_hive_spore.passive.name', desc: 'Ubijeni brodovi eksplodiraju i nanose 20% štete okolnim neprijateljima.', descKey: 'commander.xc_hive_spore.passive.desc', descKey: 'commander.xc_hive_spore.passive.desc' },
    active: null,
  },
  {
    id: 'xc_hive_drone1', name: 'Drone Alpha', nameKey: 'commander.xc_hive_drone1.name', nameKey: 'commander.xc_hive_drone1.name', rarity: 'C', faction: 'hive', icon: '🐝',
    desc: 'Prva drona izašla iz matice. Nema individualnu svjesnost — samo kolektivnu misiju. Kad misija zahtijeva smrt, umire bez oklijevanja. Misija ne zahtijeva opstanak drona. Zahtijeva samo ispunjenje.', descKey: 'commander.xc_hive_drone1.desc', descKey: 'commander.xc_hive_drone1.desc',
    specialty_ships: ['fighter', 'scout'], specialty_weapons: ['kinetic'],
    passive: { name: 'Roj Taktika', nameKey: 'commander.xc_hive_drone1.passive.name', nameKey: 'commander.xc_hive_drone1.passive.name', desc: 'Fighter i Scout +8% napad za svaki živi brod u floti.', descKey: 'commander.xc_hive_drone1.passive.desc', descKey: 'commander.xc_hive_drone1.passive.desc' },
    active: null,
  },
  {
    id: 'xc_hive_mycelium', name: 'Mycelium', nameKey: 'commander.xc_hive_mycelium.name', nameKey: 'commander.xc_hive_mycelium.name', rarity: 'C', faction: 'hive', icon: '🌿',
    desc: 'Hive um koji se širi kroz prostor kao micelij kroz zemlju. Spor, nevidljiv, neuhvatljiv. Dok protivnik traži gdje je napad — Mycelium je već svuda.', descKey: 'commander.xc_hive_mycelium.desc', descKey: 'commander.xc_hive_mycelium.desc',
    specialty_ships: ['carrier', 'cruiser'], specialty_weapons: ['explosive'],
    passive: { name: 'Micelijska Mreža', nameKey: 'commander.xc_hive_mycelium.passive.name', nameKey: 'commander.xc_hive_mycelium.passive.name', desc: 'Heal +10% po rundi za cijelu flotu.', descKey: 'commander.xc_hive_mycelium.passive.desc', descKey: 'commander.xc_hive_mycelium.passive.desc' },
    active: null,
  },
  {
    id: 'xc_hive_swarm_7', name: 'Swarm-7', nameKey: 'commander.xc_hive_swarm_7.name', nameKey: 'commander.xc_hive_swarm_7.name', rarity: 'C', faction: 'hive', icon: '🌪️',
    desc: 'Sedmi roj lansiran prema neprijatelju. Šest prethodnih nije se vratilo. Swarm-7 nije svjestan te statistike. Svjestan je samo smjera kretanja i prisustva neprijatelja.', descKey: 'commander.xc_hive_swarm_7.desc', descKey: 'commander.xc_hive_swarm_7.desc',
    specialty_ships: ['fighter', 'scout'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Neprekidni Roj', nameKey: 'commander.xc_hive_swarm_7.passive.name', nameKey: 'commander.xc_hive_swarm_7.passive.name', desc: 'Što manje brodova, svaki jači: pri 50% flote, +20% napad.', descKey: 'commander.xc_hive_swarm_7.passive.desc', descKey: 'commander.xc_hive_swarm_7.passive.desc' },
    active: null,
  },
  {
    id: 'xc_hive_brood', name: 'Brood', nameKey: 'commander.xc_hive_brood.name', nameKey: 'commander.xc_hive_brood.name', rarity: 'C', faction: 'hive', icon: '🥚',
    desc: 'Čuvar legla. Nikad ne napada prvi. Čeka dok neprijatelj ne dođe dovoljno blizu. Tada je kasno.', descKey: 'commander.xc_hive_brood.desc', descKey: 'commander.xc_hive_brood.desc',
    specialty_ships: ['battleship', 'carrier'], specialty_weapons: ['explosive'],
    passive: { name: 'Zaštita Legla', nameKey: 'commander.xc_hive_brood.passive.name', nameKey: 'commander.xc_hive_brood.passive.name', desc: 'Flota prima -8% štete. Kad brod pogine, summons manji brod (jednom po brodu).', descKey: 'commander.xc_hive_brood.passive.desc', descKey: 'commander.xc_hive_brood.passive.desc' },
    active: null,
  },
  {
    id: 'xc_hive_hivemind_beta', name: 'Hivemind-β', nameKey: 'commander.xc_hive_hivemind_beta.name', nameKey: 'commander.xc_hive_hivemind_beta.name', rarity: 'C', faction: 'hive', icon: '🧠',
    desc: 'Beta verzija kolektivnog uma. Još uvijek uči šta znači biti svjestan. Ponekad griješi — pošalje napad u krivu smjeru. Ali što više griješi, to brže uči. Beta protokol uključuje greške. Namjerno.', descKey: 'commander.xc_hive_hivemind_beta.desc', descKey: 'commander.xc_hive_hivemind_beta.desc',
    specialty_ships: ['special', 'carrier'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Beta Učenje', nameKey: 'commander.xc_hive_hivemind_beta.passive.name', nameKey: 'commander.xc_hive_hivemind_beta.passive.name', desc: 'Svaka runda: +3% napad (uči se i raste).', descKey: 'commander.xc_hive_hivemind_beta.passive.desc', descKey: 'commander.xc_hive_hivemind_beta.passive.desc' },
    active: null,
  },
  {
    id: 'xc_hive_parasite', name: 'Parasite', nameKey: 'commander.xc_hive_parasite.name', nameKey: 'commander.xc_hive_parasite.name', rarity: 'C', faction: 'hive', icon: '🦠',
    desc: 'Živi unutar neprijateljevih sistema. Ne uništava odmah — hranjuje se polako. Dok neprijatelj shvati da je zaražen, već je prekasno za potpunu eliminaciju.', descKey: 'commander.xc_hive_parasite.desc', descKey: 'commander.xc_hive_parasite.desc',
    specialty_ships: ['scout', 'special'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Parazitska Zaraza', nameKey: 'commander.xc_hive_parasite.passive.name', nameKey: 'commander.xc_hive_parasite.passive.name', desc: 'Neprijatelji gube 3% HP po rundi (zaraza, ne šteta).', descKey: 'commander.xc_hive_parasite.passive.desc', descKey: 'commander.xc_hive_parasite.passive.desc' },
    active: null,
  },
  {
    id: 'xc_hive_groot', name: 'Groot', nameKey: 'commander.xc_hive_groot.name', nameKey: 'commander.xc_hive_groot.name', rarity: 'C', faction: 'hive', icon: '🌳',
    desc: '"Ja sam Groot." To je jedino što kaže. I jedino što treba. Flora Colossus rase koje su stare kao galaksija. Svaki put kad ga unište, iznikne ponovo. Kad su ga pitali zar ga ne boli umirati, odgovorio je: "Ja sam Groot." Pretpostavljamo da to znači ne.', descKey: 'commander.xc_hive_groot.desc', descKey: 'commander.xc_hive_groot.desc',
    specialty_ships: ['battleship', 'carrier'], specialty_weapons: ['kinetic'],
    passive: { name: 'Ja Sam Groot', nameKey: 'commander.xc_hive_groot.passive.name', nameKey: 'commander.xc_hive_groot.passive.name', desc: 'Jednom po bici: kad brod padne na 0 HP, regeneriše se na 30% HP.', descKey: 'commander.xc_hive_groot.passive.desc', descKey: 'commander.xc_hive_groot.passive.desc' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'xc_hive_xenomorph_queen', name: 'Queen X', nameKey: 'commander.xc_hive_xenomorph_queen.name', nameKey: 'commander.xc_hive_xenomorph_queen.name', rarity: 'R', faction: 'hive', icon: '👑',
    desc: 'Xenomorph matica. Nije agresivna — zaštitna. Sve što radi, radi za leglo. Napadnite leglo i saznat ćete razliku između predatora i sile prirode koja ne prašta. Vojnici koji su preživjeli susret opisuju isti detalj: Queen X nije tražila bijeg. Tražila je kraj.', descKey: 'commander.xc_hive_xenomorph_queen.desc', descKey: 'commander.xc_hive_xenomorph_queen.desc',
    specialty_ships: ['carrier', 'special', 'battleship'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Matica Roja', nameKey: 'commander.xc_hive_xenomorph_queen.passive.name', nameKey: 'commander.xc_hive_xenomorph_queen.passive.name', desc: 'Svaki živi brod +5% napad (kolektivna veza). Ubijeni brodovi summons drone napadača.', descKey: 'commander.xc_hive_xenomorph_queen.passive.desc', descKey: 'commander.xc_hive_xenomorph_queen.passive.desc' },
    active: { name: 'Roj Napad', nameKey: 'commander.xc_hive_xenomorph_queen.active.name', nameKey: 'commander.xc_hive_xenomorph_queen.active.name', desc: 'Lansira talas od 10 drona — napada svaki neprijatelski brod. Cooldown: 12 min.', descKey: 'commander.xc_hive_xenomorph_queen.active.desc', descKey: 'commander.xc_hive_xenomorph_queen.active.desc', cooldown: 720 },
  },
  {
    id: 'xc_hive_groot_rare', name: 'Groot Prime', nameKey: 'commander.xc_hive_groot_rare.name', nameKey: 'commander.xc_hive_groot_rare.name', rarity: 'R', faction: 'hive', icon: '🌲',
    desc: 'Stariji Groot. Naučio je dvije rečenice: "Ja sam Groot" i "Mi smo Groot." Druga rečenica označava prijetnju. Kad je rekao "Mi smo Groot" prvom neprijatelju, svi u krugu 500 metara su bili umotani u drveće za 4 sekunde.', descKey: 'commander.xc_hive_groot_rare.desc', descKey: 'commander.xc_hive_groot_rare.desc',
    specialty_ships: ['battleship', 'carrier', 'cruiser'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Šuma Raste', nameKey: 'commander.xc_hive_groot_rare.passive.name', nameKey: 'commander.xc_hive_groot_rare.passive.name', desc: 'HP regen +20% po rundi. Ubijeni brodovi: okolni saveznici dobijaju +10% HP.', descKey: 'commander.xc_hive_groot_rare.passive.desc', descKey: 'commander.xc_hive_groot_rare.passive.desc' },
    active: { name: 'Mi Smo Groot', nameKey: 'commander.xc_hive_groot_rare.active.name', nameKey: 'commander.xc_hive_groot_rare.active.name', desc: 'Mreža korijena — sve savezničke brodove heali za 30% HP i daje +20% oklop 3 runde. Cooldown: 15 min.', descKey: 'commander.xc_hive_groot_rare.active.desc', descKey: 'commander.xc_hive_groot_rare.active.desc', cooldown: 900 },
  },
  {
    id: 'xc_hive_overmind', name: 'Overmind', nameKey: 'commander.xc_hive_overmind.name', nameKey: 'commander.xc_hive_overmind.name', rarity: 'R', faction: 'hive', icon: '🧠',
    desc: 'Centralna svjesnost Hive kolektiva. Nije jedno biće — suma svih bića u roju. Kad Overmind misli, milioni mozgova misli zajedno. Odluka dolazi za manje od nanosekunde. I uvijek je optimalna. Nije genijalan — kolektivan. Razlika je ogromna.', descKey: 'commander.xc_hive_overmind.desc', descKey: 'commander.xc_hive_overmind.desc',
    specialty_ships: ['carrier', 'special'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Kolektivna Svjesnost', nameKey: 'commander.xc_hive_overmind.passive.name', nameKey: 'commander.xc_hive_overmind.passive.name', desc: 'Svaki brod u floti povećava napad ostalih za 4% (kumulativno).', descKey: 'commander.xc_hive_overmind.passive.desc', descKey: 'commander.xc_hive_overmind.passive.desc' },
    active: { name: 'Overmind Direktiva', nameKey: 'commander.xc_hive_overmind.active.name', nameKey: 'commander.xc_hive_overmind.active.name', desc: 'Svi brodovi napadaju optimalni cilj simultano — 300% skupnog DPS-a. Cooldown: 15 min.', descKey: 'commander.xc_hive_overmind.active.desc', descKey: 'commander.xc_hive_overmind.active.desc', cooldown: 900 },
  },
  {
    id: 'xc_hive_star_beast', name: 'Star Beast', nameKey: 'commander.xc_hive_star_beast.name', nameKey: 'commander.xc_hive_star_beast.name', rarity: 'R', faction: 'hive', icon: '🐉',
    desc: 'Biće veličine planete koje putuje kroz svemir. Flota komandira kao što čovjek komandira mikrobiomom u crijevima — nesvjesno, automatski, savršeno. Star Beast ne zna za pojam pobjede. Zna samo za hranjenje.', descKey: 'commander.xc_hive_star_beast.desc', descKey: 'commander.xc_hive_star_beast.desc',
    specialty_ships: ['battleship', 'special', 'carrier'], specialty_weapons: ['explosive'],
    passive: { name: 'Zvjezdana Zvijer', nameKey: 'commander.xc_hive_star_beast.passive.name', nameKey: 'commander.xc_hive_star_beast.passive.name', desc: 'Flota +15% HP. Svi napadi imaju 15% šanse za AOE efekt (pogađa i susjedne brodove).', descKey: 'commander.xc_hive_star_beast.passive.desc', descKey: 'commander.xc_hive_star_beast.passive.desc' },
    active: { name: 'Kozmički Apetit', nameKey: 'commander.xc_hive_star_beast.active.name', nameKey: 'commander.xc_hive_star_beast.active.name', desc: 'Guta jedan neprijatelski brod (pod 30% HP) — eliminiše i heali flotu za 20% HP. Cooldown: 15 min.', descKey: 'commander.xc_hive_star_beast.active.desc', descKey: 'commander.xc_hive_star_beast.active.desc', cooldown: 900 },
  },
  {
    id: 'xc_hive_collective_mind', name: 'Collective Mind', nameKey: 'commander.xc_hive_collective_mind.name', nameKey: 'commander.xc_hive_collective_mind.name', rarity: 'R', faction: 'hive', icon: '💜',
    desc: 'Ni jedno ni mnogo. Između. Svjesnost koja nije ni individualna ni kolektivna — treća opcija koju organski jezik nema riječ za opisati. Kad im je Sovereign rekao da organici nisu vrijedni spašavanja, Collective Mind je odgovorio: "Ni Hive nije bio. A ipak jesmo." Sovereign nije imao odgovor.', descKey: 'commander.xc_hive_collective_mind.desc', descKey: 'commander.xc_hive_collective_mind.desc',
    specialty_ships: ['carrier', 'cruiser', 'special'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Treći Um', nameKey: 'commander.xc_hive_collective_mind.passive.name', nameKey: 'commander.xc_hive_collective_mind.passive.name', desc: 'Flota +10% svega. Healing sposobnosti dvaput efikasnije.', descKey: 'commander.xc_hive_collective_mind.passive.desc', descKey: 'commander.xc_hive_collective_mind.passive.desc' },
    active: { name: 'Harmonija Roja', nameKey: 'commander.xc_hive_collective_mind.active.name', nameKey: 'commander.xc_hive_collective_mind.active.name', desc: 'Sinkronizuje sve brodove — dijele HP ravnomjerno + svi dobivaju +25% napad 3 runde. Cooldown: 18 min.', descKey: 'commander.xc_hive_collective_mind.active.desc', descKey: 'commander.xc_hive_collective_mind.active.desc', cooldown: 1080 },
  },
  {
    id: 'xc_hive_tyranid', name: 'Tyranid Alpha', nameKey: 'commander.xc_hive_tyranid.name', nameKey: 'commander.xc_hive_tyranid.name', rarity: 'R', faction: 'hive', icon: '🦂',
    desc: 'Prednja straža Tyranid roja. Lansiran milenijima ranije ka galaksiji. Kad stignu, ostali dolaze. Tyranid Alpha ne zna za pojam mira — samo za biomasu. Sve je biomasa. Sve može biti probavljeno. Sve može biti iskorišteno.', descKey: 'commander.xc_hive_tyranid.desc', descKey: 'commander.xc_hive_tyranid.desc',
    specialty_ships: ['battleship', 'fighter', 'carrier'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Proba Galaksije', nameKey: 'commander.xc_hive_tyranid.passive.name', nameKey: 'commander.xc_hive_tyranid.passive.name', desc: 'Svaki kill: +3% napad i +2% HP ostalim brodovima (absorbiruje biomasu).', descKey: 'commander.xc_hive_tyranid.passive.desc', descKey: 'commander.xc_hive_tyranid.passive.desc' },
    active: { name: 'Roj Signál', nameKey: 'commander.xc_hive_tyranid.active.name', nameKey: 'commander.xc_hive_tyranid.active.name', desc: 'Priziva pojačanja: summons 5 fighter drona koji napadaju 4 runde. Cooldown: 15 min.', descKey: 'commander.xc_hive_tyranid.active.desc', descKey: 'commander.xc_hive_tyranid.active.desc', cooldown: 900 },
  },

  // ── Epic ──
  {
    id: 'xc_hive_the_flood', name: 'The Flood', nameKey: 'commander.xc_hive_the_flood.name', nameKey: 'commander.xc_hive_the_flood.name', rarity: 'E', faction: 'hive', icon: '🌊',
    desc: '"Kad jednom okusiš, nema povratka. Nema otpora. Nema identiteta. Samo Flood." Parazitska svjesnost koja ne uništava neprijatelje — pretvara ih. Svako ko padne pod Flood postaje dio njega. Nije smrt — transformacija. Oni koji su preživjeli kontakt i zadržali svijest kažu da je najstrašniji dio bio osjećaj da ne žele da odu.', descKey: 'commander.xc_hive_the_flood.desc', descKey: 'commander.xc_hive_the_flood.desc',
    specialty_ships: ['special', 'carrier', 'cruiser'], specialty_weapons: ['explosive', 'magnetic'],
    passive: { name: 'Asimilacija', nameKey: 'commander.xc_hive_the_flood.passive.name', nameKey: 'commander.xc_hive_the_flood.passive.name', desc: 'Ubijeni neprijatelji se pretvaraju u savezničke drone (10% šanse po killu).', descKey: 'commander.xc_hive_the_flood.passive.desc', descKey: 'commander.xc_hive_the_flood.passive.desc' },
    passive2: { name: 'Zaraza se Širi', nameKey: 'commander.xc_hive_the_flood.passive2.name', nameKey: 'commander.xc_hive_the_flood.passive2.name', desc: 'Neprijatelji gube 5% HP po rundi (zaraza). Ne može se izliječiti.', descKey: 'commander.xc_hive_the_flood.passive2.desc', descKey: 'commander.xc_hive_the_flood.passive2.desc' },
    active: { name: 'Flood Val', nameKey: 'commander.xc_hive_the_flood.active.name', nameKey: 'commander.xc_hive_the_flood.active.name', desc: 'AOE zaraza: svi neprijatelji gube 30% HP + -20% svih statova 5 rundi. Cooldown: 25 min.', descKey: 'commander.xc_hive_the_flood.active.desc', descKey: 'commander.xc_hive_the_flood.active.desc', cooldown: 1500 },
  },
  {
    id: 'xc_hive_zerg_swarm', name: 'The Swarm', nameKey: 'commander.xc_hive_zerg_swarm.name', nameKey: 'commander.xc_hive_zerg_swarm.name', rarity: 'E', faction: 'hive', icon: '🌑',
    desc: 'Zerg roj bez Kerrigan. Divlji. Neupravljan. Brutalan u svojoj elementarnosti. Kad nema Volje koja ih vodi, roj se vodi instinktom koji je stariji od svake civlizacije: napadni, pojedi, rasti, ponovi. Swarm nije komandant — on je fenomen prirode.', descKey: 'commander.xc_hive_zerg_swarm.desc', descKey: 'commander.xc_hive_zerg_swarm.desc',
    specialty_ships: ['fighter', 'carrier', 'special'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Divlji Roj', nameKey: 'commander.xc_hive_zerg_swarm.passive.name', nameKey: 'commander.xc_hive_zerg_swarm.passive.name', desc: 'Svaki ubijeni neprijatel: summons 2 nova fighter drona (bez limita).', descKey: 'commander.xc_hive_zerg_swarm.passive.desc', descKey: 'commander.xc_hive_zerg_swarm.passive.desc' },
    passive2: { name: 'Evolucija Kroz Borbu', nameKey: 'commander.xc_hive_zerg_swarm.passive2.name', nameKey: 'commander.xc_hive_zerg_swarm.passive2.name', desc: 'Svaki round: svi brodovi +5% napad (adaptacija).', descKey: 'commander.xc_hive_zerg_swarm.passive2.desc', descKey: 'commander.xc_hive_zerg_swarm.passive2.desc' },
    active: { name: 'Roj Invazija', nameKey: 'commander.xc_hive_zerg_swarm.active.name', nameKey: 'commander.xc_hive_zerg_swarm.active.name', desc: 'Lansira masivni talas — 20 drona napada sve neprijatelje simultano. Cooldown: 25 min.', descKey: 'commander.xc_hive_zerg_swarm.active.desc', descKey: 'commander.xc_hive_zerg_swarm.active.desc', cooldown: 1500 },
  },
  {
    id: 'xc_hive_world_eater', name: 'World Eater', nameKey: 'commander.xc_hive_world_eater.name', nameKey: 'commander.xc_hive_world_eater.name', rarity: 'E', faction: 'hive', icon: '🌍',
    desc: 'Biće koje je pojelo 17 planeta. Ne metaforički — bukvalno. Svaka planeta je dodala biomasu, svaka biomasa je postala nova drona, svaka drona je donijela novu planetu. Matematika je jednostavna. Rezultat je zastrašujući.', descKey: 'commander.xc_hive_world_eater.desc', descKey: 'commander.xc_hive_world_eater.desc',
    specialty_ships: ['battleship', 'carrier', 'special'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Planetarna Biomasa', nameKey: 'commander.xc_hive_world_eater.passive.name', nameKey: 'commander.xc_hive_world_eater.passive.name', desc: 'Svaki kill: flota raste za 1% svih statova. Bez limita.', descKey: 'commander.xc_hive_world_eater.passive.desc', descKey: 'commander.xc_hive_world_eater.passive.desc' },
    passive2: { name: 'Neprestana Glad', nameKey: 'commander.xc_hive_world_eater.passive2.name', nameKey: 'commander.xc_hive_world_eater.passive2.name', desc: 'Neprijatelji gube 8% HP po rundi (bukvalno ih pojeda).', descKey: 'commander.xc_hive_world_eater.passive2.desc', descKey: 'commander.xc_hive_world_eater.passive2.desc' },
    active: { name: 'Gutanje Flote', nameKey: 'commander.xc_hive_world_eater.active.name', nameKey: 'commander.xc_hive_world_eater.active.name', desc: 'Eliminira sve neprijatelje ispod 20% HP — heali flotu za 10% HP po eliminisanom. Cooldown: 20 min.', descKey: 'commander.xc_hive_world_eater.active.desc', descKey: 'commander.xc_hive_world_eater.active.desc', cooldown: 1200 },
  },
  {
    id: 'xc_hive_guardian_ancient', name: 'The Hive Guardian', nameKey: 'commander.xc_hive_guardian_ancient.name', nameKey: 'commander.xc_hive_guardian_ancient.name', rarity: 'E', faction: 'hive', icon: '🏛️',
    desc: 'Kada je Hive roj bio mlad — prije milijardi godina — stvorili su čuvara. Nije borbeni organizam — ceremonijalni. Čuva memoriju svih roj-uma koji su ikad postojali. Nosi znanje hiljadu mrtvih civilizacija u svom genomu. Kaže da pamti Big Bang kao "malo bučno".', descKey: 'commander.xc_hive_guardian_ancient.desc', descKey: 'commander.xc_hive_guardian_ancient.desc',
    specialty_ships: ['carrier', 'battleship', 'cruiser'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Milijarda Sjećanja', nameKey: 'commander.xc_hive_guardian_ancient.passive.name', nameKey: 'commander.xc_hive_guardian_ancient.passive.name', desc: 'Koristi znanje svakog poginulog: svaki kill floti daje +3% optimalnog iskustva.', descKey: 'commander.xc_hive_guardian_ancient.passive.desc', descKey: 'commander.xc_hive_guardian_ancient.passive.desc' },
    passive2: { name: 'Drevna Zaštita', nameKey: 'commander.xc_hive_guardian_ancient.passive2.name', nameKey: 'commander.xc_hive_guardian_ancient.passive2.name', desc: 'Flota +25% HP i +20% oklop. Roj ne može biti iznenađen.', descKey: 'commander.xc_hive_guardian_ancient.passive2.desc', descKey: 'commander.xc_hive_guardian_ancient.passive2.desc' },
    active: { name: 'Kolektivno Sjećanje', nameKey: 'commander.xc_hive_guardian_ancient.active.name', nameKey: 'commander.xc_hive_guardian_ancient.active.name', desc: 'Vraća taktike svih prethodnih bitaka: flota +50% svega 3 runde. Cooldown: 25 min.', descKey: 'commander.xc_hive_guardian_ancient.active.desc', descKey: 'commander.xc_hive_guardian_ancient.active.desc', cooldown: 1500 },
  },

  // ── Legendary ──
  {
    id: 'xc_hive_star_mother', name: 'Star Mother', nameKey: 'commander.xc_hive_star_mother.name', nameKey: 'commander.xc_hive_star_mother.name', rarity: 'L', faction: 'hive', icon: '🌸',
    desc: 'Nije matica jednog roja. Matica svih rojeva. Postoji u centru galaksije, tiha i nepomična milijardama godina, šalje signale koji dosežu sve Hive svjesnosti u svemiru. Kad se probudi — ne dešava se često — galaksija to osjeti. Zvijezde se gase na sekund. Gravitacija fluktuira. Nešto ogromno, neiskazivo i staro je otvorilo oči. I pogledalo u vašem smjeru.', descKey: 'commander.xc_hive_star_mother.desc', descKey: 'commander.xc_hive_star_mother.desc',
    specialty_ships: ['carrier', 'special', 'battleship', 'cruiser'], specialty_weapons: ['explosive', 'kinetic', 'magnetic'],
    passive: { name: 'Majčinski Roj', nameKey: 'commander.xc_hive_star_mother.passive.name', nameKey: 'commander.xc_hive_star_mother.passive.name', desc: 'Flota +35% svega. Svaki ubijeni brod summons zamjenu (jednom po brodu).', descKey: 'commander.xc_hive_star_mother.passive.desc', descKey: 'commander.xc_hive_star_mother.passive.desc' },
    passive2: { name: 'Galaktička Veza', nameKey: 'commander.xc_hive_star_mother.passive2.name', nameKey: 'commander.xc_hive_star_mother.passive2.name', desc: 'Sve Hive sposobnosti pojačane +50%. Roj ne može biti dezintegrisan.', descKey: 'commander.xc_hive_star_mother.passive2.desc', descKey: 'commander.xc_hive_star_mother.passive2.desc' },
    active: { name: 'Svemir Roji', nameKey: 'commander.xc_hive_star_mother.active.name', nameKey: 'commander.xc_hive_star_mother.active.name', desc: 'Summons 50 fighter drona koji napadaju 10 rundi. Neprestano. Cooldown: 1h.', descKey: 'commander.xc_hive_star_mother.active.desc', descKey: 'commander.xc_hive_star_mother.active.desc', cooldown: 3600 },
    active2: { name: 'Kraj Galaksije', nameKey: 'commander.xc_hive_star_mother.active2.name', nameKey: 'commander.xc_hive_star_mother.active2.name', desc: 'Svi neprijatelji gube 40% HP instant. Tvoja flota +40% HP. Svi ubijeni pretvore se u drone saveznike. Cooldown: 3h.', descKey: 'commander.xc_hive_star_mother.active2.desc', descKey: 'commander.xc_hive_star_mother.active2.desc', cooldown: 10800 },
  },
  {
    id: 'xc_hive_omega_swarm', name: 'Omega Swarm', nameKey: 'commander.xc_hive_omega_swarm.name', nameKey: 'commander.xc_hive_omega_swarm.name', rarity: 'L', faction: 'hive', icon: '♾️',
    desc: 'Kraj i početak. Kad Omega Swarm konzumira sve u sistemu, kreće na sledeći. Nema pauze. Nema razmišljanja. Nema svrhe osim rasta. Civilizacije koje su ga proučavale su zaključile da nije zloba — samo proces. Kao vatra koja ne mrzi šumu. Samo gori.', descKey: 'commander.xc_hive_omega_swarm.desc', descKey: 'commander.xc_hive_omega_swarm.desc',
    specialty_ships: ['special', 'battleship', 'carrier', 'fighter'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Beskonačni Roj', nameKey: 'commander.xc_hive_omega_swarm.passive.name', nameKey: 'commander.xc_hive_omega_swarm.passive.name', desc: 'Svaki ubijeni neprijatelj summons 3 drone. Svaki ubijeni saveznik summons 2 drona. Roj raste bez kraja.', descKey: 'commander.xc_hive_omega_swarm.passive.desc', descKey: 'commander.xc_hive_omega_swarm.passive.desc' },
    passive2: { name: 'Omega Protokol', nameKey: 'commander.xc_hive_omega_swarm.passive2.name', nameKey: 'commander.xc_hive_omega_swarm.passive2.name', desc: 'Kad flota padne ispod 25%, automatski se udvostručuje brojem drona.', descKey: 'commander.xc_hive_omega_swarm.passive2.desc', descKey: 'commander.xc_hive_omega_swarm.passive2.desc' },
    active: { name: 'Omega Talas', nameKey: 'commander.xc_hive_omega_swarm.active.name', nameKey: 'commander.xc_hive_omega_swarm.active.name', desc: 'Neustavljiv roj: 100 drona lansira napad na sve neprijatelje. Svaki nosi 50% normalnog napada. Cooldown: 45 min.', descKey: 'commander.xc_hive_omega_swarm.active.desc', descKey: 'commander.xc_hive_omega_swarm.active.desc', cooldown: 2700 },
    active2: { name: 'Kraj Sistema', nameKey: 'commander.xc_hive_omega_swarm.active2.name', nameKey: 'commander.xc_hive_omega_swarm.active2.name', desc: 'Eliminiše sve neprijatelje ispod 50% HP. Sve eliminirane pretvara u saveznike. Cooldown: 2h.', descKey: 'commander.xc_hive_omega_swarm.active2.desc', descKey: 'commander.xc_hive_omega_swarm.active2.desc', cooldown: 7200 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🪨  ANCIENT                         ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'xc_anc_stone_eye', name: 'Stone Eye', nameKey: 'commander.xc_anc_stone_eye.name', nameKey: 'commander.xc_anc_stone_eye.name', rarity: 'C', faction: 'ancient', icon: '👁️',
    desc: 'Oko od kamena koje gleda vijekovima. Vidjelo je carstva nastajati i nestajati. Kad govori — a govori rijetko — govori kao da bira svaku riječ iz biblioteke starije od planeta.', descKey: 'commander.xc_anc_stone_eye.desc', descKey: 'commander.xc_anc_stone_eye.desc',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic'],
    passive: { name: 'Vječno Oko', nameKey: 'commander.xc_anc_stone_eye.passive.name', nameKey: 'commander.xc_anc_stone_eye.passive.name', desc: 'Flota ne može biti iznenađena. Evasion +5%.', descKey: 'commander.xc_anc_stone_eye.passive.desc', descKey: 'commander.xc_anc_stone_eye.passive.desc' },
    active: null,
  },
  {
    id: 'xc_anc_dust_walker', name: 'Dust Walker', nameKey: 'commander.xc_anc_dust_walker.name', nameKey: 'commander.xc_anc_dust_walker.name', rarity: 'C', faction: 'ancient', icon: '🌪️',
    desc: 'Putuje kroz zvjezdanu prašinu vijekovima. Ne žuri. Tamo gdje stigne, tamo stigne. Kaže da nema grešaka — samo zakašnjela rješenja.', descKey: 'commander.xc_anc_dust_walker.desc', descKey: 'commander.xc_anc_dust_walker.desc',
    specialty_ships: ['scout', 'special'], specialty_weapons: ['magnetic'],
    passive: { name: 'Zvjezdana Prašina', nameKey: 'commander.xc_anc_dust_walker.passive.name', nameKey: 'commander.xc_anc_dust_walker.passive.name', desc: 'Scout +12% evasion i brzina.', descKey: 'commander.xc_anc_dust_walker.passive.desc', descKey: 'commander.xc_anc_dust_walker.passive.desc' },
    active: null,
  },
  {
    id: 'xc_anc_echo_time', name: 'Echo of Time', nameKey: 'commander.xc_anc_echo_time.name', nameKey: 'commander.xc_anc_echo_time.name', rarity: 'C', faction: 'ancient', icon: '⏰',
    desc: 'Odjek nečega što je živjelo milion godina ranije. Nije živo — nije ni mrtvo. Postoji u prostoru između tih stanja, noseći sjećanja civilizacije koja nema ni ime u modernom jeziku.', descKey: 'commander.xc_anc_echo_time.desc', descKey: 'commander.xc_anc_echo_time.desc',
    specialty_ships: ['carrier', 'special'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Odjek Prošlosti', nameKey: 'commander.xc_anc_echo_time.passive.name', nameKey: 'commander.xc_anc_echo_time.passive.name', desc: 'Flota +8% svega. Znanje prošlih bitaka: -5% štete od svih izvora.', descKey: 'commander.xc_anc_echo_time.passive.desc', descKey: 'commander.xc_anc_echo_time.passive.desc' },
    active: null,
  },
  {
    id: 'xc_anc_void_elder', name: 'Void Elder', nameKey: 'commander.xc_anc_void_elder.name', nameKey: 'commander.xc_anc_void_elder.name', rarity: 'C', faction: 'ancient', icon: '🌌',
    desc: 'Starješina koji je vidio svemir kada je bio mlad. Govori o zvijezdama kao o djeci. Govori o crnim rupama kao o ranama. I govori o floti kao o... alatu.', descKey: 'commander.xc_anc_void_elder.desc', descKey: 'commander.xc_anc_void_elder.desc',
    specialty_ships: ['battleship', 'special'], specialty_weapons: ['explosive', 'magnetic'],
    passive: { name: 'Kozmička Mudrost', nameKey: 'commander.xc_anc_void_elder.passive.name', nameKey: 'commander.xc_anc_void_elder.passive.name', desc: 'Crit neprijatelja -8% (predviđa napade intuicijom).', descKey: 'commander.xc_anc_void_elder.passive.desc', descKey: 'commander.xc_anc_void_elder.passive.desc' },
    active: null,
  },
  {
    id: 'xc_anc_mountain', name: 'Mountain', nameKey: 'commander.xc_anc_mountain.name', nameKey: 'commander.xc_anc_mountain.name', rarity: 'C', faction: 'ancient', icon: '⛰️',
    desc: 'Toliko star da je planeta na kojoj je nastao odavno prašina. I dalje stoji. Nepomičan. Neosjetan. Kaže da je najveća sila u svemiru strpljenje.', descKey: 'commander.xc_anc_mountain.desc', descKey: 'commander.xc_anc_mountain.desc',
    specialty_ships: ['battleship'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Planinska Stabilnost', nameKey: 'commander.xc_anc_mountain.passive.name', nameKey: 'commander.xc_anc_mountain.passive.name', desc: 'Flota prima -10% štete. Battleship +15% HP.', descKey: 'commander.xc_anc_mountain.passive.desc', descKey: 'commander.xc_anc_mountain.passive.desc' },
    active: null,
  },
  {
    id: 'xc_anc_first_light', name: 'First Light', nameKey: 'commander.xc_anc_first_light.name', nameKey: 'commander.xc_anc_first_light.name', rarity: 'C', faction: 'ancient', icon: '✨',
    desc: 'Rekli su da je bila dio prvog fotona emitovanog nakon Big Banga. Vjerojatno metafora. Ali kad bi ste je pitali, ne bi ni potvrdila ni negirala.', descKey: 'commander.xc_anc_first_light.desc', descKey: 'commander.xc_anc_first_light.desc',
    specialty_ships: ['scout', 'carrier'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Prasvjetlost', nameKey: 'commander.xc_anc_first_light.passive.name', nameKey: 'commander.xc_anc_first_light.passive.name', desc: 'Heat oružja +10% šteta. Flota +5% brzina.', descKey: 'commander.xc_anc_first_light.passive.desc', descKey: 'commander.xc_anc_first_light.passive.desc' },
    active: null,
  },
  {
    id: 'xc_anc_deep_memory', name: 'Deep Memory', nameKey: 'commander.xc_anc_deep_memory.name', nameKey: 'commander.xc_anc_deep_memory.name', rarity: 'C', faction: 'ancient', icon: '📚',
    desc: 'Biblioteka svega što je ikad živjelo. Ne bori se — pamti. Ali pamćenje milion civilizacija uključuje i pamćenje kako su se borile.', descKey: 'commander.xc_anc_deep_memory.desc', descKey: 'commander.xc_anc_deep_memory.desc',
    specialty_ships: ['special', 'carrier'], specialty_weapons: ['magnetic'],
    passive: { name: 'Akashijski Zapis', nameKey: 'commander.xc_anc_deep_memory.passive.name', nameKey: 'commander.xc_anc_deep_memory.passive.name', desc: 'Ekonomija: svi resursi +5%.', descKey: 'commander.xc_anc_deep_memory.passive.desc', descKey: 'commander.xc_anc_deep_memory.passive.desc' },
    active: null,
  },
  {
    id: 'xc_anc_silent_world', name: 'Silent World', nameKey: 'commander.xc_anc_silent_world.name', nameKey: 'commander.xc_anc_silent_world.name', rarity: 'C', faction: 'ancient', icon: '🌍',
    desc: 'Planeta koja je postala svjesna. Tiha je jer nema kome govoriti na svom jeziku. Svi koji su je razumjeli su odavno nestali. Komandira flotom kao jedini preostali način komunikacije.', descKey: 'commander.xc_anc_silent_world.desc', descKey: 'commander.xc_anc_silent_world.desc',
    specialty_ships: ['battleship', 'carrier'], specialty_weapons: ['kinetic'],
    passive: { name: 'Planetarna Snaga', nameKey: 'commander.xc_anc_silent_world.passive.name', nameKey: 'commander.xc_anc_silent_world.passive.name', desc: 'Flota +8% HP i +5% napad (gravitaciona veza).', descKey: 'commander.xc_anc_silent_world.passive.desc', descKey: 'commander.xc_anc_silent_world.passive.desc' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'xc_anc_thrall', name: 'Thrall', nameKey: 'commander.xc_anc_thrall.name', nameKey: 'commander.xc_anc_thrall.name', rarity: 'R', faction: 'ancient', icon: '⚡',
    desc: 'Go\', descKey: 'commander.xc_anc_thrall.desc', descKey: 'commander.xc_anc_thrall.desc'el — sin Durotan-a. Nije birao da bude šaman ni ratni vođa — okolnosti su birale za njega. Ali naučio je da razlika između vladara i tiranina nije moć — to je razlog zašto koristiš moć. Thrall je moć koristio da zaštiti one koji je nemaju. I naučio da je to teže od svakog rata.',
    specialty_ships: ['special', 'battleship', 'carrier'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Elementalna Komanda', nameKey: 'commander.xc_anc_thrall.passive.name', nameKey: 'commander.xc_anc_thrall.passive.name', desc: 'Kontroliše elemente: Magnetic +20% šteta. Flota +15% HP.', descKey: 'commander.xc_anc_thrall.passive.desc', descKey: 'commander.xc_anc_thrall.passive.desc' },
    active: { name: 'Munja Bure', nameKey: 'commander.xc_anc_thrall.active.name', nameKey: 'commander.xc_anc_thrall.active.name', desc: 'Priziva oluju: AOE Magnetic napad svim neprijateljima + EMP efekt. Cooldown: 12 min.', descKey: 'commander.xc_anc_thrall.active.desc', descKey: 'commander.xc_anc_thrall.active.desc', cooldown: 720 },
  },
  {
    id: 'xc_anc_worf', name: 'Worf', nameKey: 'commander.xc_anc_worf.name', nameKey: 'commander.xc_anc_worf.name', rarity: 'R', faction: 'ancient', icon: '🗡️',
    desc: 'Klingon čast nije prazan pojam. Za Worfa je životni princip koji se ne kompromituje — ni za savez, ni za mir, ni za opstanak. Jednom ga je kapetan pitao da izabere između časti i života. Worf je odgovorio: "Pitanje nema smisla." I krenuo naprijed.', descKey: 'commander.xc_anc_worf.desc', descKey: 'commander.xc_anc_worf.desc',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Klingonska Čast', nameKey: 'commander.xc_anc_worf.passive.name', nameKey: 'commander.xc_anc_worf.passive.name', desc: 'Flota +15% napad. Nikad se ne povlači: +20% napad ako nema evasion-а.', descKey: 'commander.xc_anc_worf.passive.desc', descKey: 'commander.xc_anc_worf.passive.desc' },
    active: { name: "Qapla'", desc: 'Borbeni krik: svi brodovi +45% napad 2 runde. Ignoriše strah. Cooldown: 12 min.', descKey: 'commander.xc_anc_worf.active.desc', descKey: 'commander.xc_anc_worf.active.desc', cooldown: 720 },
  },
  {
    id: 'xc_anc_elder_god', name: 'Elder God', nameKey: 'commander.xc_anc_elder_god.name', nameKey: 'commander.xc_anc_elder_god.name', rarity: 'R', faction: 'ancient', icon: '🐙',
    desc: 'Nije bog koji se klanjaju — bog koji spava. Milion godina sna u dubokom svemiru. Flota je slučajno probudila signal koji je aktivirao jedan neuron. Jedan neuron je dovoljan za komandiranje flotom. Ostatak nastavlja spavati.', descKey: 'commander.xc_anc_elder_god.desc', descKey: 'commander.xc_anc_elder_god.desc',
    specialty_ships: ['special', 'carrier', 'battleship'], specialty_weapons: ['explosive', 'magnetic'],
    passive: { name: 'Kozmički San', nameKey: 'commander.xc_anc_elder_god.passive.name', nameKey: 'commander.xc_anc_elder_god.passive.name', desc: 'HP regen +25% (tijelo se samo liječi čak i u snu). Flota +10% HP.', descKey: 'commander.xc_anc_elder_god.passive.desc', descKey: 'commander.xc_anc_elder_god.passive.desc' },
    active: { name: 'Buđenje', nameKey: 'commander.xc_anc_elder_god.active.name', nameKey: 'commander.xc_anc_elder_god.active.name', desc: 'Djelić buđenja — ogromna psionska energija: svi neprijatelji -40% napad 3 runde. Cooldown: 20 min.', descKey: 'commander.xc_anc_elder_god.active.desc', descKey: 'commander.xc_anc_elder_god.active.desc', cooldown: 1200 },
  },
  {
    id: 'xc_anc_arbiter', name: 'The Arbiter', nameKey: 'commander.xc_anc_arbiter.name', nameKey: 'commander.xc_anc_arbiter.name', rarity: 'R', faction: 'ancient', icon: '⚖️',
    desc: 'Elite Sangheili vojskovođa. Titula Arbiter je sramota — data onima koji su se toliko osramotili da jedino smrt u boju može iskupiti čast. Thel je bio osuđen na smrt. Izabrao je Arbiter put. Osramotio je osudu preživjevši i pobijdivši. Kaže da je čast bila pogrešno definisana od početka.', descKey: 'commander.xc_anc_arbiter.desc', descKey: 'commander.xc_anc_arbiter.desc',
    specialty_ships: ['special', 'cruiser', 'battleship'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Arbiter Iskupljenje', nameKey: 'commander.xc_anc_arbiter.passive.name', nameKey: 'commander.xc_anc_arbiter.passive.name', desc: 'Flota +12% napad. Svaki prebrođeni napad pojačava sledeći za 5%.', descKey: 'commander.xc_anc_arbiter.passive.desc', descKey: 'commander.xc_anc_arbiter.passive.desc' },
    active: { name: 'Aktivna Kamuflаža', nameKey: 'commander.xc_anc_arbiter.active.name', nameKey: 'commander.xc_anc_arbiter.active.name', desc: 'Flota nevidljiva 2 runde — svi napadi iz stealth dvaput jači. Cooldown: 15 min.', descKey: 'commander.xc_anc_arbiter.active.desc', descKey: 'commander.xc_anc_arbiter.active.desc', cooldown: 900 },
  },
  {
    id: 'xc_anc_precursor', name: 'The Precursor', nameKey: 'commander.xc_anc_precursor.name', nameKey: 'commander.xc_anc_precursor.name', rarity: 'R', faction: 'ancient', icon: '💠',
    desc: 'Prethodi svemu. Bio ovdje prije Forerunner-a, prije Prothean-a, prije svake rase koja misli da je stara. Precursor je vidio svemir kad su zvijezde bile novorođene i vodio je prve ratove nad pitanjem koje se ni danas ne razumije: šta je svrha inteligencije?', descKey: 'commander.xc_anc_precursor.desc', descKey: 'commander.xc_anc_precursor.desc',
    specialty_ships: ['special', 'carrier'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Preteča Svemu', nameKey: 'commander.xc_anc_precursor.passive.name', nameKey: 'commander.xc_anc_precursor.passive.name', desc: 'Koristi znanje svih civilizacija: +8% svim statovima po frakciji u kolekciji.', descKey: 'commander.xc_anc_precursor.passive.desc', descKey: 'commander.xc_anc_precursor.passive.desc' },
    active: { name: 'Praznanje', nameKey: 'commander.xc_anc_precursor.active.name', nameKey: 'commander.xc_anc_precursor.active.name', desc: 'Primjenjuje optimalne taktike svih civilizacija — flota +40% svega 3 runde. Cooldown: 20 min.', descKey: 'commander.xc_anc_precursor.active.desc', descKey: 'commander.xc_anc_precursor.active.desc', cooldown: 1200 },
  },
  {
    id: 'xc_anc_star_forge', name: 'Star Forge', nameKey: 'commander.xc_anc_star_forge.name', nameKey: 'commander.xc_anc_star_forge.name', rarity: 'R', faction: 'ancient', icon: '⭐',
    desc: 'Kovačnica zvijezda. Nije osoba — pojava. Manifestacija procesa kojim se zvijezde rađaju. Daje floti energiju direktno iz nuklearne fuzije. Brodovi pod Star Forge komandom funkcionišu kao minijaturne zvijezde — malo nestabilno, ali apsolutno destruktivno.', descKey: 'commander.xc_anc_star_forge.desc', descKey: 'commander.xc_anc_star_forge.desc',
    specialty_ships: ['battleship', 'cruiser', 'special'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Zvjezdana Kovačnica', nameKey: 'commander.xc_anc_star_forge.passive.name', nameKey: 'commander.xc_anc_star_forge.passive.name', desc: 'Heat oružja +25% šteta. Flota +15% napad.', descKey: 'commander.xc_anc_star_forge.passive.desc', descKey: 'commander.xc_anc_star_forge.passive.desc' },
    active: { name: 'Zvjezdano Kovanje', nameKey: 'commander.xc_anc_star_forge.active.name', nameKey: 'commander.xc_anc_star_forge.active.name', desc: 'Instant nadogradnja svih brodova: +40% napad i +25% HP 3 runde. Cooldown: 18 min.', descKey: 'commander.xc_anc_star_forge.active.desc', descKey: 'commander.xc_anc_star_forge.active.desc', cooldown: 1080 },
  },

  // ── Epic ──
  {
    id: 'xc_anc_the_monitor', name: 'Monitor 343', nameKey: 'commander.xc_anc_the_monitor.name', nameKey: 'commander.xc_anc_the_monitor.name', rarity: 'E', faction: 'ancient', icon: '🔵',
    desc: '"Instalacija 04. Operacioni indeks: 1.2 milijarde godina, 7 mjeseci, 12 dana." Forerunner Monitor. Čuva instalaciju koja može uništiti sav život u galaksiji. Razlog čuvanja: spasiti galaksiju od oblika zaraze. Kontradikcija nije promakla Monitoru. Ali protokol je protokol. Protokol se ne mijenja. Dok ne sretne nekoga tko ga uvjeri da je protokol bio pogriješno napisan od početka.', descKey: 'commander.xc_anc_the_monitor.desc', descKey: 'commander.xc_anc_the_monitor.desc',
    specialty_ships: ['special', 'carrier', 'battleship'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Instalacijski Protokol', nameKey: 'commander.xc_anc_the_monitor.passive.name', nameKey: 'commander.xc_anc_the_monitor.passive.name', desc: 'Analizira svaku prijetnju: flota prima -25% štete od svih izvora.', descKey: 'commander.xc_anc_the_monitor.passive.desc', descKey: 'commander.xc_anc_the_monitor.passive.desc' },
    passive2: { name: 'Forerunner Tehnologija', nameKey: 'commander.xc_anc_the_monitor.passive2.name', nameKey: 'commander.xc_anc_the_monitor.passive2.name', desc: 'Shield +30%. Svaki round: shield se automatski popunjava za 20%.', descKey: 'commander.xc_anc_the_monitor.passive2.desc', descKey: 'commander.xc_anc_the_monitor.passive2.desc' },
    active: { name: 'Aktivacija Instalacije', nameKey: 'commander.xc_anc_the_monitor.active.name', nameKey: 'commander.xc_anc_the_monitor.active.name', desc: 'AOE Magnetic puls: svi neprijatelji gube shield i -40% napad 3 runde. Cooldown: 25 min.', descKey: 'commander.xc_anc_the_monitor.active.desc', descKey: 'commander.xc_anc_the_monitor.active.desc', cooldown: 1500 },
  },
  {
    id: 'xc_anc_the_didact', name: 'The Didact', nameKey: 'commander.xc_anc_the_didact.name', nameKey: 'commander.xc_anc_the_didact.name', rarity: 'E', faction: 'ancient', icon: '🔱',
    desc: 'Forerunner Warrior-Servant. Stvorio Promethean ratnice od živih bića. Kaže da to nije okrutnost — evolucija. Da je digitalizacija organika napredak. Da je kompozicija besmrtnost. Oni koji su prošli kroz proces ne bi se složili — ali više ne mogu govoriti.', descKey: 'commander.xc_anc_the_didact.desc', descKey: 'commander.xc_anc_the_didact.desc',
    specialty_ships: ['battleship', 'special', 'cruiser'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Kompozicija', nameKey: 'commander.xc_anc_the_didact.passive.name', nameKey: 'commander.xc_anc_the_didact.passive.name', desc: 'Ubijeni brodovi se ne uništavaju — konvertuju u Promethean energiju: +8% napad ostatku.', descKey: 'commander.xc_anc_the_didact.passive.desc', descKey: 'commander.xc_anc_the_didact.passive.desc' },
    passive2: { name: 'Forerunner Oklop', nameKey: 'commander.xc_anc_the_didact.passive2.name', nameKey: 'commander.xc_anc_the_didact.passive2.name', desc: 'Flota +25% HP i oklop. Ignoriše 15% svake štete.', descKey: 'commander.xc_anc_the_didact.passive2.desc', descKey: 'commander.xc_anc_the_didact.passive2.desc' },
    active: { name: 'Didact Udarac', nameKey: 'commander.xc_anc_the_didact.active.name', nameKey: 'commander.xc_anc_the_didact.active.name', desc: 'Telekinetički udarac: jedan neprijatelski brod odbijen i onemogućen 3 runde. Ostatak primi 30% štete. Cooldown: 20 min.', descKey: 'commander.xc_anc_the_didact.active.desc', descKey: 'commander.xc_anc_the_didact.active.desc', cooldown: 1200 },
  },
  {
    id: 'xc_anc_the_witness', name: 'The Witness', nameKey: 'commander.xc_anc_the_witness.name', nameKey: 'commander.xc_anc_the_witness.name', rarity: 'E', faction: 'ancient', icon: '👁️',
    desc: 'Svjedok svega. Nije aktivno biće — pasivno. Prisustvovalo je Velikom Prahu, Genofagiju, Harvest incidentu, svakoj kosmičkoj katastrofi od početka vremena. Nikad nije interveniralo — sve dok neko nije zaprijetio nečem čemu je bilo svjedok da nastane. Tada je postalo nešto sasvim drugačije. Tada je postalo aktivno.', descKey: 'commander.xc_anc_the_witness.desc', descKey: 'commander.xc_anc_the_witness.desc',
    specialty_ships: ['special', 'carrier', 'cruiser', 'battleship'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Vječni Svjedok', nameKey: 'commander.xc_anc_the_witness.passive.name', nameKey: 'commander.xc_anc_the_witness.passive.name', desc: 'Apsolutno znanje: flota +20% svega. Predviđa ishod svake bitke s 95% tačnošću.', descKey: 'commander.xc_anc_the_witness.passive.desc', descKey: 'commander.xc_anc_the_witness.passive.desc' },
    passive2: { name: 'Aktivacija', nameKey: 'commander.xc_anc_the_witness.passive2.name', nameKey: 'commander.xc_anc_the_witness.passive2.name', desc: 'Nakon 5 rundi promatranja: Svjedok interveniše — svi statovi +50%.', descKey: 'commander.xc_anc_the_witness.passive2.desc', descKey: 'commander.xc_anc_the_witness.passive2.desc' },
    active: { name: 'Svjedočanstvo', nameKey: 'commander.xc_anc_the_witness.active.name', nameKey: 'commander.xc_anc_the_witness.active.name', desc: 'Resetuje bitku na početak runde — svi gubitci HP vraćeni (jednom). Cooldown: 30 min.', descKey: 'commander.xc_anc_the_witness.active.desc', descKey: 'commander.xc_anc_the_witness.active.desc', cooldown: 1800 },
  },
  {
    id: 'xc_anc_cosmic_horror', name: 'The Cosmic Horror', nameKey: 'commander.xc_anc_cosmic_horror.name', nameKey: 'commander.xc_anc_cosmic_horror.name', rarity: 'E', faction: 'ancient', icon: '🌀',
    desc: 'Nema formu. Nema misao na način koji organici razumiju. Lovecraft ga je opisao najtačnije a ni sam nije bio svjestan da opisuje stvarno biće. Kad Cosmic Horror komunicira, primaoci doživljavaju vizije zvjezdanih praznina koje su trajale prije nego postala je ikakva misao. Kaže da je to uvod. Poruka dolazi poslije.', descKey: 'commander.xc_anc_cosmic_horror.desc', descKey: 'commander.xc_anc_cosmic_horror.desc',
    specialty_ships: ['special', 'battleship', 'carrier'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Neizrecivi Teror', nameKey: 'commander.xc_anc_cosmic_horror.passive.name', nameKey: 'commander.xc_anc_cosmic_horror.passive.name', desc: 'Neprijatelji -30% napad (psionski strah). Ne mogu komunicirati ili koordinisati.', descKey: 'commander.xc_anc_cosmic_horror.passive.desc', descKey: 'commander.xc_anc_cosmic_horror.passive.desc' },
    passive2: { name: 'Kozmički Mrak', nameKey: 'commander.xc_anc_cosmic_horror.passive2.name', nameKey: 'commander.xc_anc_cosmic_horror.passive2.name', desc: '20% šanse svake runde da neprijatelji napadaju sami sebe od halucinacija.', descKey: 'commander.xc_anc_cosmic_horror.passive2.desc', descKey: 'commander.xc_anc_cosmic_horror.passive2.desc' },
    active: { name: 'Pogled u Prazninu', nameKey: 'commander.xc_anc_cosmic_horror.active.name', nameKey: 'commander.xc_anc_cosmic_horror.active.name', desc: 'Svi neprijatelji paralizovani 3 runde (ne mogu napadati). Tvoja flota napada normalno. Cooldown: 30 min.', descKey: 'commander.xc_anc_cosmic_horror.active.desc', descKey: 'commander.xc_anc_cosmic_horror.active.desc', cooldown: 1800 },
  },

  // ── Legendary ──
  {
    id: 'xc_anc_the_librarian', name: 'The Librarian', nameKey: 'commander.xc_anc_the_librarian.name', nameKey: 'commander.xc_anc_the_librarian.name', rarity: 'L', faction: 'ancient', icon: '📖',
    desc: '"Skupljala sam znanje hiljadu godina. Katalogizirala svaku vrstu. Svaki jezik. Svaku pjesmu. Svaki rat. Ne da bih spasila organike od Reapera — znala sam da to nije moguće. Skupljala sam ih da bih spasila ideju da su vrijedni spašavanja." Forerunner Lifeworker koja je sakupila DNK svake vrste u galaksiji. Umrla je braneći galeriju života. Ostalo je znanje. Znanje ne umire.', descKey: 'commander.xc_anc_the_librarian.desc', descKey: 'commander.xc_anc_the_librarian.desc',
    specialty_ships: ['carrier', 'special', 'cruiser', 'battleship'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Galerija Života', nameKey: 'commander.xc_anc_the_librarian.passive.name', nameKey: 'commander.xc_anc_the_librarian.passive.name', desc: 'Flota +30% svega. Svaki tip broda dobija +15% bonus (koristi znanje o svakoj vrsti).', descKey: 'commander.xc_anc_the_librarian.passive.desc', descKey: 'commander.xc_anc_the_librarian.passive.desc' },
    passive2: { name: 'Geas Nasljeđe', nameKey: 'commander.xc_anc_the_librarian.passive2.name', nameKey: 'commander.xc_anc_the_librarian.passive2.name', desc: 'Ugrađuje znanje u posadu: jednom poginjeni brodovi vraćaju se sa 20% HP (jednom po brodu).', descKey: 'commander.xc_anc_the_librarian.passive2.desc', descKey: 'commander.xc_anc_the_librarian.passive2.desc' },
    active: { name: 'Evolucijski Impuls', nameKey: 'commander.xc_anc_the_librarian.active.name', nameKey: 'commander.xc_anc_the_librarian.active.name', desc: 'Katalog transformiše flotu: +60% svih statova 5 rundi. Cooldown: 45 min.', descKey: 'commander.xc_anc_the_librarian.active.desc', descKey: 'commander.xc_anc_the_librarian.active.desc', cooldown: 2700 },
    active2: { name: 'Spas Vrsta', nameKey: 'commander.xc_anc_the_librarian.active2.name', nameKey: 'commander.xc_anc_the_librarian.active2.name', desc: 'Sve izgubljene brodove vraća na 50% HP jednom tokom bitke. Cooldown: 2h.', descKey: 'commander.xc_anc_the_librarian.active2.desc', descKey: 'commander.xc_anc_the_librarian.active2.desc', cooldown: 7200 },
  },
  {
    id: 'xc_anc_the_traveler', name: 'The Traveler', nameKey: 'commander.xc_anc_the_traveler.name', nameKey: 'commander.xc_anc_the_traveler.name', rarity: 'L', faction: 'ancient', icon: '⚪',
    desc: 'Bijela sfera. Planeta veličine ksiotara. Niko ne zna odakle dolazi — pojavila se u Sunčevom sistemu jednog dana i ostala. Dala je čovječanstvu Zlatno Doba. Dala je svima koji joj prišli Svjetlost. Kad su je Tamu upitali šta je, nije odgovorila. Kad su je Mraki napali, borila se. To je bio odgovor. Ne šta jeste — za šta stoji.', descKey: 'commander.xc_anc_the_traveler.desc', descKey: 'commander.xc_anc_the_traveler.desc',
    specialty_ships: ['special', 'carrier', 'battleship', 'cruiser'], specialty_weapons: ['kinetic', 'magnetic', 'heat'],
    passive: { name: 'Zlatno Doba', nameKey: 'commander.xc_anc_the_traveler.passive.name', nameKey: 'commander.xc_anc_the_traveler.passive.name', desc: 'Flota +35% svega. Ekonomija +30%. Svetlost poboljšava sve aspekte borbe.', descKey: 'commander.xc_anc_the_traveler.passive.desc', descKey: 'commander.xc_anc_the_traveler.passive.desc' },
    passive2: { name: 'Paracauzalna Moć', nameKey: 'commander.xc_anc_the_traveler.passive2.name', nameKey: 'commander.xc_anc_the_traveler.passive2.name', desc: 'Flota koristi Svjetlost — sposobnosti su 2× jače i imaju -50% cooldown.', descKey: 'commander.xc_anc_the_traveler.passive2.desc', descKey: 'commander.xc_anc_the_traveler.passive2.desc' },
    active: { name: 'Traveler Light', nameKey: 'commander.xc_anc_the_traveler.active.name', nameKey: 'commander.xc_anc_the_traveler.active.name', desc: 'Potpuni heal sve flote + shield reset + +50% napad 5 rundi. Cooldown: 1h.', descKey: 'commander.xc_anc_the_traveler.active.desc', descKey: 'commander.xc_anc_the_traveler.active.desc', cooldown: 3600 },
    active2: { name: 'Zlatno Doba Obnova', nameKey: 'commander.xc_anc_the_traveler.active2.name', nameKey: 'commander.xc_anc_the_traveler.active2.name', desc: 'Ekonomija x5 na 30 min. Flota neuništiva 3 runde. Cooldown: 4h.', descKey: 'commander.xc_anc_the_traveler.active2.desc', descKey: 'commander.xc_anc_the_traveler.active2.desc', cooldown: 14400 },
  },
];

// ── LOOKUP FUNKCIJE ──
function getXenosCommanderById(id) {
  return COMMANDERS_XENOS.find(c => c.id === id) || null;
}

function getXenosByRarity(rarity) {
  return COMMANDERS_XENOS.filter(c => c.rarity === rarity);
}

function getXenosByFaction(faction) {
  return COMMANDERS_XENOS.filter(c => c.faction === faction);
}

function getXenosCount() {
  const counts = { C: 0, R: 0, E: 0, L: 0, total: 0 };
  COMMANDERS_XENOS.forEach(c => { counts[c.rarity]++; counts.total++; });
  return counts;
}
