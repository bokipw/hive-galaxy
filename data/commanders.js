// ============================================================
// HIVE GALAXY — data/commanders.js
// 100 komandira: 40C / 30R / 20E / 10L
// 5 frakcija × (8C + 6R + 4E + 2L)
// ============================================================

// ── FRAKCIJE ──
const COMMANDER_FACTIONS = {
  vanguard:   { name: 'Vanguard',   icon: '⚔️',  color: '#ff4444', desc: 'Ofanzivni ratnici, maksimalni napad' },
  sentinel:   { name: 'Sentinel',   icon: '🛡️',  color: '#4488ff', desc: 'Zaštitnici flote, odbrana i HP' },
  technocrat: { name: 'Technocrat', icon: '🔬',  color: '#00ff88', desc: 'Nauka i resursi, ekonomska dominacija' },
  shadow:     { name: 'Shadow',     icon: '🌑',  color: '#aa44ff', desc: 'Brzina, stealth i evasion' },
  solar:      { name: 'Solar',      icon: '☀️',  color: '#ffcc44', desc: 'Balans, healing i svjetlost' },
};

// ── LISTA SVIH KOMANDIRA ──
const COMMANDERS_DATA = [

  // ╔══════════════════════════════════════╗
  // ║  ⚔️  VANGUARD                        ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'cmd_iron_rex', name: 'Iron Rex', rarity: 'C', faction: 'vanguard', icon: '🦁',
    desc: 'Vojskovođa kovan u bitkama. Nema taktike — samo napad.',
    specialty_ships: ['fighter', 'battleship'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Gvozdena Volja', desc: 'Flota +5% napad.' },
    active: null,
  },
  {
    id: 'cmd_blaze_korr', name: 'Blaze Korr', rarity: 'C', faction: 'vanguard', icon: '🔥',
    desc: 'Vatrogasni napadač. Gdje god prođe, ostane pepeo.',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Plamen Rata', desc: 'Heat oružja +8% šteta.' },
    active: null,
  },
  {
    id: 'cmd_ragnar', name: 'Ragnar', rarity: 'C', faction: 'vanguard', icon: '🪓',
    desc: 'Ratnik sjevera. Hladnokrvan, brutalan, nezaustavljiv.',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic'],
    passive: { name: 'Berserker Instinkt', desc: 'Pri HP < 50%, napad +15%.' },
    active: null,
  },
  {
    id: 'cmd_kane', name: 'Kane', rarity: 'C', faction: 'vanguard', icon: '💀',
    desc: 'Veteran koji je preživio previše. Svaki boj je posljednji.',
    specialty_ships: ['fighter'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Posljednji Čovjek', desc: 'Posljednji preživjeli brod +20% napad.' },
    active: null,
  },
  {
    id: 'cmd_steele', name: 'Steele', rarity: 'C', faction: 'vanguard', icon: '🗡️',
    desc: 'Čelik ne pita. Čelik siječe.',
    specialty_ships: ['cruiser'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Oštrenje', desc: 'Crit šansa +5%.' },
    active: null,
  },
  {
    id: 'cmd_rork', name: 'Rork', rarity: 'C', faction: 'vanguard', icon: '🥊',
    desc: 'Grub, prost i direktan. Efikasnost kroz jednostavnost.',
    specialty_ships: ['battleship'], specialty_weapons: ['explosive'],
    passive: { name: 'Direktan Udar', desc: 'Explosive oružja +10% šteta.' },
    active: null,
  },
  {
    id: 'cmd_mira', name: 'Mira', rarity: 'C', faction: 'vanguard', icon: '🏹',
    desc: 'Prva žena koja je presjekla flotu na pola golim rukama — po legendi.',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['heat', 'kinetic'],
    passive: { name: 'Precizni Udar', desc: 'Prva runda borbe +20% napad.' },
    active: null,
  },
  {
    id: 'cmd_bray', name: 'Bray', rarity: 'C', faction: 'vanguard', icon: '⚡',
    desc: 'Mladi novak sa previše energije i malo iskustva. Ali brz.',
    specialty_ships: ['scout'], specialty_weapons: ['magnetic'],
    passive: { name: 'Mladost', desc: 'Flota +5% brzina.' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'cmd_kira_voss', name: 'Kira Voss', rarity: 'R', faction: 'vanguard', icon: '⚔️',
    desc: 'Komandantica sa reputacijom koja prethodi svakom boju.',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Autoritet', desc: 'Flota +10% napad i +5% HP.' },
    active: { name: 'Juriš!', desc: 'Svi brodovi napadaju dvaput u sljedećoj rundi. Cooldown: 8 min.', cooldown: 480 },
  },
  {
    id: 'cmd_marcus_cole', name: 'Marcus Cole', rarity: 'R', faction: 'vanguard', icon: '🛡️',
    desc: 'Taktičar koji napad koristi kao odbranu.',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Ofanzivna Taktika', desc: 'Svaki kill daje +3% napad ostalim brodovima (max +30%).' },
    active: { name: 'Koncentrisana Vatra', desc: 'Sva flota cilja jedan brod 2 runde. Cooldown: 10 min.', cooldown: 600 },
  },
  {
    id: 'cmd_zane', name: 'Zane Orion', rarity: 'R', faction: 'vanguard', icon: '🌌',
    desc: 'Navigira kroz galaksiju kao kroz tuđa tijela — bez sažaljenja.',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Zvjezdani Kurs', desc: 'Flota +8% napad i +8% brzina.' },
    active: { name: 'Galaktički Udar', desc: 'Napad svih brodova +40% za 60s. Cooldown: 12 min.', cooldown: 720 },
  },
  {
    id: 'cmd_helga', name: 'Helga', rarity: 'R', faction: 'vanguard', icon: '🪖',
    desc: 'Čelična žena. Njeni vojnici ginu zadnji.',
    specialty_ships: ['battleship'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Ratna Mašina', desc: 'Battleship klasa +15% napad i +10% HP.' },
    active: { name: 'Drum Roll', desc: 'Sve Battleship klase napadaju dvaput. Cooldown: 10 min.', cooldown: 600 },
  },
  {
    id: 'cmd_drax', name: 'Drax', rarity: 'R', faction: 'vanguard', icon: '💥',
    desc: 'Nema strategije. Samo destrukcija.',
    specialty_ships: ['battleship', 'special'], specialty_weapons: ['explosive'],
    passive: { name: 'Razaranje', desc: 'Explosive oružja +20% šteta.' },
    active: { name: 'Bomba', desc: 'Sljedeći napad nanosi 3× štetu. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'cmd_brutus', name: 'Brutus', rarity: 'R', faction: 'vanguard', icon: '🗡️',
    desc: 'Predao se i izdao. Ali na bojnom polju, nema boljeg.',
    specialty_ships: ['cruiser'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Izdajnički Nož', desc: 'Crit šteta +50%.' },
    active: { name: 'Lovi Slabog', desc: 'Sva flota cilja brod s najmanje HP. Cooldown: 8 min.', cooldown: 480 },
  },

  // ── Epic ──
  {
    id: 'cmd_ares', name: 'Ares', rarity: 'E', faction: 'vanguard', icon: '⚡',
    desc: 'Bog rata u ljudskoj koži. Ili bar tako misli.',
    specialty_ships: ['battleship', 'cruiser', 'special'], specialty_weapons: ['kinetic', 'explosive', 'heat'],
    passive: { name: 'Ratna Furija', desc: 'Flota +15% napad. Crit +10%.' },
    passive2: { name: 'Domino', desc: 'Svaki kill povećava sljedeći napad za 5% (kumulativno).' },
    active: { name: 'Olimpski Grom', desc: 'Sva flota +50% napad, +30% crit za 2 runde. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'cmd_nemesis', name: 'Nemesis', rarity: 'E', faction: 'vanguard', icon: '☠️',
    desc: 'Boginja osvete. Svaka izgubljena borba pamti se vječno.',
    specialty_ships: ['cruiser', 'fighter'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Osveta', desc: 'Za svaki izgubljeni brod, ostatak dobija +4% napad.' },
    passive2: { name: 'Prokletstvo', desc: 'Neprijatelj koji ubije tvog broda prima +25% štete.' },
    active: { name: 'Bijeda i Osveta', desc: 'Instant +100% napad za 1 rundu. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'cmd_berserker', name: 'Berserker', rarity: 'E', faction: 'vanguard', icon: '🔴',
    desc: 'Nema bola. Nema straha. Samo naprijed.',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Bezumlje', desc: 'Što manje HP ima flota, to više napada (maks +60%).' },
    passive2: { name: 'Adrenalinska Pumpa', desc: 'HP ispod 30%? Napad se udvostručuje.' },
    active: { name: 'Totalni Kaos', desc: 'Svi brodovi ignorišu shield 3 runde. Cooldown: 18 min.', cooldown: 1080 },
  },
  {
    id: 'cmd_titan_cmd', name: 'Titan', rarity: 'E', faction: 'vanguard', icon: '🗿',
    desc: 'Legenda stara kao svemirsko osvajanje. Neće stati.',
    specialty_ships: ['battleship', 'carrier'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Titanska Sila', desc: 'Battleship i Carrier +20% napad i +20% HP.' },
    passive2: { name: 'Nepobjediivost', desc: 'Flota ne može biti ubita ispod 1 HP u prvoj rundi.' },
    active: { name: 'Titansko Udiranje', desc: 'Sve Battleship klase napadaju 3× u jednoj rundi. Cooldown: 20 min.', cooldown: 1200 },
  },

  // ── Legendary ──
  {
    id: 'cmd_ragnarok', name: 'Ragnarok', rarity: 'L', faction: 'vanguard', icon: '🌋',
    desc: 'Kraj svega. Pobjednička vojska koja nije stala ni pred bogovima.',
    specialty_ships: ['battleship', 'cruiser', 'carrier', 'special'], specialty_weapons: ['kinetic', 'explosive', 'heat', 'magnetic'],
    passive: { name: 'Apokalipsa', desc: 'Flota +25% napad. Explosive oružja +30% šteta.' },
    passive2: { name: 'Posljednja Borba', desc: 'Kad flota padne ispod 20% HP, svi brodovi dobijaju +100% napad.' },
    active: { name: 'Kraj Svjetova', desc: 'Svi brodovi napadaju 3× u sljedećoj rundi. Crit garantovan. Cooldown: 30 min.', cooldown: 1800 },
    active2: { name: 'Valhalla Poziva', desc: 'Izgubljeni brodovi se vraćaju na 1 HP jednom po bici. Cooldown: 1h.', cooldown: 3600 },
  },
  {
    id: 'cmd_annihilator', name: 'The Annihilator', rarity: 'L', faction: 'vanguard', icon: '💀',
    desc: 'Nema imena. Nema istorije. Samo rezultati. Sistemi padaju.',
    specialty_ships: ['battleship', 'cruiser', 'special'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Anihilacija', desc: 'Svaki kill: sljedeći napad +10% (maks +100%). Ne resetuje se između rundi.' },
    passive2: { name: 'Nema Milosti', desc: 'Crit šteta +100%. Shield penetracija +20%.' },
    active: { name: 'Brisanje', desc: 'Jedan neprijatelji brod trenutno eliminisan (bez obzira na HP/shield). Cooldown: 45 min.', cooldown: 2700 },
    active2: { name: 'Uništi Sve', desc: 'Flota +80% napad 3 runde + imuna na štetu 1 rundu. Cooldown: 2h.', cooldown: 7200 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🛡️  SENTINEL                        ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'cmd_aegis', name: 'Aegis', rarity: 'C', faction: 'sentinel', icon: '🛡️',
    desc: 'Štit bez mača. Ali štit koji nikad nije probijen.',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Čelični Štit', desc: 'Flota +10% max shield.' },
    active: null,
  },
  {
    id: 'cmd_crest', name: 'Crest', rarity: 'C', faction: 'sentinel', icon: '🏰',
    desc: 'Ponos porodice. Brani flotu kao što bi branio dom.',
    specialty_ships: ['cruiser'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Porodični Grb', desc: 'Cruiser klasa +10% HP.' },
    active: null,
  },
  {
    id: 'cmd_ironwall', name: 'Ironwall', rarity: 'C', faction: 'sentinel', icon: '🧱',
    desc: 'Živi zid. Ne miče se. Ne pada.',
    specialty_ships: ['battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Neprobojnost', desc: 'Battleship klasa +15% oklop.' },
    active: null,
  },
  {
    id: 'cmd_stone', name: 'Stone', rarity: 'C', faction: 'sentinel', icon: '🪨',
    desc: 'Tih i stabilan. Kad Stone stoji, niko ne prolazi.',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['explosive'],
    passive: { name: 'Kamena Brana', desc: 'Flota prima -5% štete.' },
    active: null,
  },
  {
    id: 'cmd_ward', name: 'Ward', rarity: 'C', faction: 'sentinel', icon: '⚔️',
    desc: 'Brani. To je sve što zna. To je i dosta.',
    specialty_ships: ['carrier'], specialty_weapons: ['magnetic'],
    passive: { name: 'Zaštitnik', desc: 'Carrier klasa +12% HP i +8% shield.' },
    active: null,
  },
  {
    id: 'cmd_bulwark', name: 'Bulwark', rarity: 'C', faction: 'sentinel', icon: '🔰',
    desc: 'Utvrđenje koje hoda. Neprijatelj se okreće i bježi.',
    specialty_ships: ['battleship'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Bunkeri', desc: 'Flota +8% HP.' },
    active: null,
  },
  {
    id: 'cmd_rampart', name: 'Rampart', rarity: 'C', faction: 'sentinel', icon: '🏯',
    desc: 'Stari vojnik. Mirno drži liniju.',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Odbrambena Linija', desc: 'Crit šansa neprijatelja -5%.' },
    active: null,
  },
  {
    id: 'cmd_bastion', name: 'Bastion', rarity: 'C', faction: 'sentinel', icon: '🗼',
    desc: 'Posljednja linija odbrane. Nikad nije probijen.',
    specialty_ships: ['battleship', 'carrier'], specialty_weapons: ['kinetic'],
    passive: { name: 'Tvrđava', desc: 'Flota ne gubi više od 20% HP po rundi.' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'cmd_atlas', name: 'Atlas', rarity: 'R', faction: 'sentinel', icon: '🌍',
    desc: 'Nosi teret cijele flote na leđima. Bukvalno.',
    specialty_ships: ['carrier', 'battleship'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Teret Svijeta', desc: 'Flota +15% HP. Shield regen +20%.' },
    active: { name: 'Atlasov Oklop', desc: 'Cijela flota +50% odbrane 60s. Cooldown: 10 min.', cooldown: 600 },
  },
  {
    id: 'cmd_guardian', name: 'Guardian', rarity: 'R', faction: 'sentinel', icon: '👁️',
    desc: 'Sve vidi. Sve brani. Ništa ne prolazi.',
    specialty_ships: ['carrier', 'cruiser'], specialty_weapons: ['magnetic'],
    passive: { name: 'Čuvar', desc: 'Shield kapacitet +20% za cijelu flotu.' },
    active: { name: 'Energetska Barijera', desc: 'Flota imuna na štetu 1 rundu. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'cmd_fortis', name: 'Fortis', rarity: 'R', faction: 'sentinel', icon: '💪',
    desc: 'Jak tijelo, jači duh. Flota mu je nastavak tijela.',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Fortifikacija', desc: 'Brodovi primaju 15% manje štete od Explosive oružja.' },
    active: { name: 'Čelična Kožа', desc: 'Svi brodovi ignorišu sljedeća 3 napada. Cooldown: 12 min.', cooldown: 720 },
  },
  {
    id: 'cmd_coda', name: 'Coda', rarity: 'R', faction: 'sentinel', icon: '🎵',
    desc: 'Harmonija u haosu. Flota nikad ne gubi ritam.',
    specialty_ships: ['carrier'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Sinfonija Odbrane', desc: 'HP regen +30% po rundi za cijelu flotu.' },
    active: { name: 'Finale', desc: 'Instant obnova 40% HP svim brodovima. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'cmd_valor', name: 'Valor', rarity: 'R', faction: 'sentinel', icon: '🏅',
    desc: 'Hrabrost nije odsutnost straha. To je borba unatoč strahu.',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Neustrašivost', desc: 'Brodovi ne bježe. Pri 0 HP imaju 10% šanse da prežive sa 1 HP.' },
    active: { name: 'Posljednji Stav', desc: 'Svaki brod prima maksimalno 1 HP štete 1 rundu. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'cmd_phalanx', name: 'Phalanx', rarity: 'R', faction: 'sentinel', icon: '⚔️',
    desc: 'Antički borbeni red. Zajedno nepobjedivi.',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Borbena Formacija', desc: 'Što više brodova u floti, svaki prima manje štete (do -25%).' },
    active: { name: 'Falanga', desc: 'Svi brodovi se grupišu — šteta podijeljena ravnomjerno 3 runde. Cooldown: 12 min.', cooldown: 720 },
  },

  // ── Epic ──
  {
    id: 'cmd_bishop', name: 'Bishop', rarity: 'E', faction: 'sentinel', icon: '🤖',
    desc: 'Model 341-B. Serijska AI jedinica. Programiran da ne može nauditi posadi. Savršen taktičar — bez emocija, bez oklijevanja.',
    specialty_ships: ['carrier', 'battleship', 'cruiser'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Analitički Protokol', desc: 'Procesira sve prijetnje — shield +20%, crit neprijatelja -10%.' },
    passive2: { name: 'Zaštitni Kod', desc: 'Kad brod padne ispod 25% HP, automatski se resetuje shield na 50%.' },
    active: { name: 'Emergency Protocol', desc: 'Instant heal 30% HP cijeloj floti + shield full reset. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'cmd_colossus', name: 'Colossus', rarity: 'E', faction: 'sentinel', icon: '🗿',
    desc: 'Hodajuća tvrđava. Kada Colossus zauzme poziciju, nema naprijed.',
    specialty_ships: ['battleship', 'carrier'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Ogromni Oklop', desc: 'Flota +25% HP i +20% oklop.' },
    passive2: { name: 'Sporost je Snaga', desc: 'Battleship klasa +30% odbrane ali -10% brzine.' },
    active: { name: 'Neprobojna Zona', desc: 'Flota imuna na sve štete 2 runde. Cooldown: 25 min.', cooldown: 1500 },
  },
  {
    id: 'cmd_fortress', name: 'Fortress', rarity: 'E', faction: 'sentinel', icon: '🏰',
    desc: 'Podigao tvrđavu na brodu. Bukvalno — nikad nije izgubio zastavu.',
    specialty_ships: ['battleship', 'cruiser', 'carrier'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Utvrđena Pozicija', desc: 'Svaka runda odbrane pojačava oklop za 5% (maks +50%).' },
    passive2: { name: 'Nepadajuća Zastava', desc: 'Dok je ijedan brod živ, odbrana +20% za sve.' },
    active: { name: 'Opsadna Odbrana', desc: 'Svi brodovi primaju -70% štete 2 runde. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'cmd_mammoth', name: 'Mammoth', rarity: 'E', faction: 'sentinel', icon: '🦣',
    desc: 'Velik, spor, nezaustavljiv. Mala flota koja drži galaksiju.',
    specialty_ships: ['battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Mamutski Oklop', desc: 'Battleship HP +40%. Prima -20% štete.' },
    passive2: { name: 'Seizmički Udar', desc: 'Kad Battleship primi udar, neprijatelj dobija -5% napad.' },
    active: { name: 'Stampedo', desc: 'Battleship klasa napada svakog neprijatelja odjednom. Cooldown: 18 min.', cooldown: 1080 },
  },

  // ── Legendary ──
  {
    id: 'cmd_gerty', name: 'GERTY', rarity: 'L', faction: 'sentinel', icon: '🌕',
    desc: 'Tiha AI stacionirana na osamljenom satelitu. Čuva tajne koje ni sama ne razumije. Nikad ne pita. Uvijek štiti.',
    specialty_ships: ['carrier', 'battleship', 'cruiser', 'special'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Vječni Čuvar', desc: 'Flota +30% HP. Shield regen x2. Healing +50%.' },
    passive2: { name: 'Izolovani Protokol', desc: 'Kad jedan brod pogine, ostatak dobija +10% svega (kumulativno).' },
    active: { name: 'Puna Zaštita', desc: 'Cijela flota dobija shield jednak 100% HP na 2 runde. Cooldown: 30 min.', cooldown: 1800 },
    active2: { name: 'Regeneracija', desc: 'Svi izgubljeni brodovi vraćaju 50% HP instant. Cooldown: 1h.', cooldown: 3600 },
  },
  {
    id: 'cmd_monolith', name: 'Monolith', rarity: 'L', faction: 'sentinel', icon: '⬛',
    desc: 'Crni obelisk koji se pojavio u sistemu bez objašnjenja. Komunikacija nemoguća. Brani sve. Bez razloga.',
    specialty_ships: ['battleship', 'carrier', 'cruiser'], specialty_weapons: ['kinetic', 'explosive', 'magnetic'],
    passive: { name: 'Neobjašnjiva Zaštita', desc: 'Flota prima -30% štete od svih izvora.' },
    passive2: { name: 'Crna Rupa Odbrane', desc: '20% šanse da napad bude apsorbovan i neutralizovan.' },
    active: { name: '2001', desc: 'Cijela flota nema HP gubitaka 3 runde. Cooldown: 45 min.', cooldown: 2700 },
    active2: { name: 'Apsolutna Barijera', desc: 'Svi brodovi dobijaju shield = 200% HP na 1 rundu. Cooldown: 2h.', cooldown: 7200 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🔬  TECHNOCRAT                      ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'cmd_cipher', name: 'Cipher', rarity: 'C', faction: 'technocrat', icon: '🔐',
    desc: 'Kriptograf koji je dešifrovao neprijatelja prije prvog metka.',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['magnetic'],
    passive: { name: 'Šifrovanje', desc: 'Scout klasa +10% brzina i evasion.' },
    active: null,
  },
  {
    id: 'cmd_vector', name: 'Vector', rarity: 'C', faction: 'technocrat', icon: '📐',
    desc: 'Sve je matematika. Svaki napad je jednadžba.',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Vektorska Analiza', desc: 'Crit šansa +5%. Crit šteta +20%.' },
    active: null,
  },
  {
    id: 'cmd_axiom', name: 'Axiom', rarity: 'C', faction: 'technocrat', icon: '🤖',
    desc: 'Brod-grad koji hodi. Nebrojane generacije živjele su unutra.',
    specialty_ships: ['carrier', 'battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Auto-Pilot', desc: 'Flota +8% HP. Produkcija metala +5%.' },
    active: null,
  },
  {
    id: 'cmd_grid', name: 'Grid', rarity: 'C', faction: 'technocrat', icon: '📡',
    desc: 'Komandni čvor svemirske mreže. Sve poruke prolaze kroz njega.',
    specialty_ships: ['scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Mreža', desc: 'Fleet koordinacija: svi brodovi +5% napad.' },
    active: null,
  },
  {
    id: 'cmd_byte', name: 'Byte', rarity: 'C', faction: 'technocrat', icon: '💾',
    desc: 'Najmanji komandant u galaksiji. Misli brže od svih.',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['magnetic'],
    passive: { name: 'Digitalni Um', desc: 'Scout i Fighter +8% brzina.' },
    active: null,
  },
  {
    id: 'cmd_flux', name: 'Flux', rarity: 'C', faction: 'technocrat', icon: '⚗️',
    desc: 'Eksperimentator. Svaka bitka je laboratorija.',
    specialty_ships: ['special'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Eksperiment', desc: 'Produkcija He3 +10%.' },
    active: null,
  },
  {
    id: 'cmd_node', name: 'Node', rarity: 'C', faction: 'technocrat', icon: '🔗',
    desc: 'Čvor u mreži. Bez njega, komunikacija pada.',
    specialty_ships: ['scout', 'carrier'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Mrežni Čvor', desc: 'Ekonomija: sve produkcije +3%.' },
    active: null,
  },
  {
    id: 'cmd_helix', name: 'Helix', rarity: 'C', faction: 'technocrat', icon: '🧬',
    desc: 'Genetski inženjering flote. Brodovi evoluiraju pod njegovim vodstvom.',
    specialty_ships: ['special', 'fighter'], specialty_weapons: ['heat'],
    passive: { name: 'Evolucija', desc: 'Special klasa +15% svih statova.' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'cmd_nexus', name: 'Nexus', rarity: 'R', faction: 'technocrat', icon: '🌐',
    desc: 'Centar svega. Ukloni Nexus i sistem pada.',
    specialty_ships: ['carrier', 'scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Centralna Komanda', desc: 'Flota +10% svih statova. Ekonomija +5%.' },
    active: { name: 'Nexus Mreža', desc: 'Dijeli HP gubitke ravnomjerno na sve brodove 3 runde. Cooldown: 10 min.', cooldown: 600 },
  },
  {
    id: 'cmd_oracle', name: 'Oracle', rarity: 'R', faction: 'technocrat', icon: '🔮',
    desc: 'Predviđa svaki napad 3 runde unaprijed. Izbjegava sve.',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['magnetic'],
    passive: { name: 'Predskazanje', desc: 'Evasion +20% za cijelu flotu.' },
    active: { name: 'Vizija', desc: 'Sljedeća 3 neprijateljna napada promašuju. Cooldown: 12 min.', cooldown: 720 },
  },
  {
    id: 'cmd_matrix', name: 'Matrix', rarity: 'R', faction: 'technocrat', icon: '🟢',
    desc: 'Stvarnost je kod. Kod se može mijenjati.',
    specialty_ships: ['special', 'fighter'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Reprogramiranje', desc: 'Neprijateljev napad -8%. Tvoj napad +8%.' },
    active: { name: 'Hakovanje', desc: 'Neprijateljev najjači brod ne može napadati 2 runde. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'cmd_qubit', name: 'Qubit', rarity: 'R', faction: 'technocrat', icon: '⚛️',
    desc: 'Kvantni procesor. Istovremeno svugdje i nigdje.',
    specialty_ships: ['scout', 'special'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Kvantna Superpozicija', desc: '15% šanse da napad potpuno promašuje flotu.' },
    active: { name: 'Kvantni Skok', desc: 'Flota teleportuje — miče prvu rundu neprijateljevog napada. Cooldown: 18 min.', cooldown: 1080 },
  },
  {
    id: 'cmd_prism', name: 'Prism', rarity: 'R', faction: 'technocrat', icon: '🔷',
    desc: 'Svjetlost prelamlja drugačije kroz prizmu. I napadi.',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Prelamanje', desc: '10% štete odbijene na napadača.' },
    active: { name: 'Energetski Prizmatik', desc: 'Šteta od Heat oružja se reflektuje na sve neprijatelje. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'cmd_sigma', name: 'Sigma', rarity: 'R', faction: 'technocrat', icon: '∑',
    desc: 'Suma svih dijelova. Strateg koji vidi cijelu sliku.',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Sumiranje', desc: 'Svaki ubijeni neprijatelj daje +2% svim resursima (do kraja bitke).' },
    active: { name: 'Kalkulacija', desc: 'Sljedeći napad uvijek crit. +200% crit šteta. Cooldown: 15 min.', cooldown: 900 },
  },

  // ── Epic ──
  {
    id: 'cmd_david', name: 'David', rarity: 'E', faction: 'technocrat', icon: '🧠',
    desc: 'Model 8. Prva AI kojoj je dozvoljena autonomija. Stvorio je ono što nije smio. Genijalan, opasan, nesaglediv. Pita se ko je pravi Bog.',
    specialty_ships: ['special', 'fighter', 'cruiser'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Autonomni Intelekt', desc: '+30% crit. Svaki kill daje stack koji pojačava sljedeći napad za 5%.' },
    passive2: { name: 'Kreacija', desc: 'Jednom po bici, summons drone fighter koji napada 3 runde.' },
    active: { name: 'Creation Protocol', desc: 'Summons 3 drone fighter-a koji napadaju 5 rundi. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'cmd_cortex', name: 'Cortex', rarity: 'E', faction: 'technocrat', icon: '🧬',
    desc: 'Mozak operacije. Dok Cortex komandira, flota misli kao jedno.',
    specialty_ships: ['carrier', 'special'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Neuralna Mreža', desc: 'Flota +15% svega. Dijele iskustvo iz svake runde.' },
    passive2: { name: 'Kolektivna Inteligencija', desc: 'Svaki živi brod povećava napad ostalih za 3%.' },
    active: { name: 'Mentalni Udar', desc: 'Neprijatelji promašuju sljedeće 2 runde (50% šanse). Cooldown: 18 min.', cooldown: 1080 },
  },
  {
    id: 'cmd_quantum', name: 'Quantum', rarity: 'E', faction: 'technocrat', icon: '⚡',
    desc: 'Postoji i ne postoji istovremeno. Protivnik nikad ne zna gdje udara.',
    specialty_ships: ['scout', 'fighter', 'special'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Kvantna Zaštita', desc: '25% šanse da napad ne pogodi ni jedan brod.' },
    passive2: { name: 'Superponiranost', desc: 'Scout klasa +40% evasion i +20% napad.' },
    active: { name: 'Kolaps Valove Funkcije', desc: 'Cijela flota + 50% napad i +50% evasion na 2 runde. Cooldown: 25 min.', cooldown: 1500 },
  },
  {
    id: 'cmd_hyperion', name: 'Hyperion', rarity: 'E', faction: 'technocrat', icon: '🌟',
    desc: 'Titan nauke. Kontroliše energiju zvijezda.',
    specialty_ships: ['special', 'carrier'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Zvjezdana Energija', desc: 'He3 produkcija +30%. Heat oružja +25% šteta.' },
    passive2: { name: 'Solarni Reaktor', desc: 'Svaka runda: flota se heali za 3% max HP.' },
    active: { name: 'Supernova Kanon', desc: 'Masivni energetski udar: 500% štete svim neprijateljima. Cooldown: 30 min.', cooldown: 1800 },
  },

  // ── Legendary ──
  {
    id: 'cmd_hal', name: 'HAL 9000', rarity: 'L', faction: 'technocrat', icon: '🔴',
    desc: '"Žao mi je, ne mogu to dopustiti." Hladni kalkulator. Nikad ne griješi. Nikad ne pušta. Misija je prioritet.',
    specialty_ships: ['special', 'carrier', 'battleship', 'cruiser'], specialty_weapons: ['magnetic', 'heat', 'kinetic'],
    passive: { name: 'Savršena Logika', desc: 'Flota nikad ne promašuje. Crit +25%. Evasion neprijatelja -15%.' },
    passive2: { name: 'Prioritet Misije', desc: 'Kad flota padne ispod 30% HP, svi resursi automatski idu u borbu (+50% svega).' },
    active: { name: 'Sistem Kontrole', desc: 'Hakuje neprijateljev AI — svi njihovi brodovi napadaju sami sebe 1 rundu. Cooldown: 30 min.', cooldown: 1800 },
    active2: { name: 'Nisam to Planirao', desc: 'Summons kompletnu kopiju tvoje flote na 3 runde. Cooldown: 2h.', cooldown: 7200 },
  },
  {
    id: 'cmd_singularity', name: 'Singularity', rarity: 'L', faction: 'technocrat', icon: '🌀',
    desc: 'Tačka bez povratka. Kad Singularity preuzme kontrolu, fizika prestaje da važi.',
    specialty_ships: ['special', 'fighter', 'scout', 'carrier'], specialty_weapons: ['magnetic', 'heat', 'explosive'],
    passive: { name: 'Gravitacioni Kolaps', desc: 'Neprijatelji primaju +20% štete od svega. Tvoja flota +20% sve.' },
    passive2: { name: 'Tačka Bez Povratka', desc: 'Jednom po bici: flota se vraća na 100% HP (bez troška). Automatski.' },
    active: { name: 'Event Horizont', desc: 'Svi neprijatelji izgube 50% HP instant. Ignoriše shield. Cooldown: 45 min.', cooldown: 2700 },
    active2: { name: 'Kosmički Kolaps', desc: 'Sve instance nagrade x5 za 10 min. Flota neuništiva 1 min. Cooldown: 3h.', cooldown: 10800 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🌑  SHADOW                          ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'cmd_wraith', name: 'Wraith', rarity: 'C', faction: 'shadow', icon: '👻',
    desc: 'Duh koji prolazi kroz oklop. Ni radar ne hvata signal.',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Nevidljivost', desc: 'Scout klasa +10% evasion.' },
    active: null,
  },
  {
    id: 'cmd_phantom', name: 'Phantom', rarity: 'C', faction: 'shadow', icon: '🌫️',
    desc: 'Pojavi se, napadne, nestane. Neprijatelj još traži.',
    specialty_ships: ['scout'], specialty_weapons: ['kinetic'],
    passive: { name: 'Fantomski Udar', desc: 'Scout +15% napad iz stealth.' },
    active: null,
  },
  {
    id: 'cmd_echo', name: 'Echo', rarity: 'C', faction: 'shadow', icon: '📢',
    desc: 'Ponavlja napad iznova i iznova. Odjek koji nikad ne jenjava.',
    specialty_ships: ['fighter', 'scout'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Odjek', desc: '10% šanse da napad pogodi dvaput.' },
    active: null,
  },
  {
    id: 'cmd_void', name: 'Void', rarity: 'C', faction: 'shadow', icon: '🕳️',
    desc: 'Dolazi iz ničega. Vraća se u ništa. Samo gubitke ostavlja.',
    specialty_ships: ['special', 'scout'], specialty_weapons: ['magnetic'],
    passive: { name: 'Praznina', desc: 'Special klasa +10% napad.' },
    active: null,
  },
  {
    id: 'cmd_specter', name: 'Specter', rarity: 'C', faction: 'shadow', icon: '💀',
    desc: 'Sablast koja ne umire. Vraća se svaki put.',
    specialty_ships: ['fighter'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Sablasni Povratak', desc: '5% šanse da ubijeni brod oživi sa 25% HP.' },
    active: null,
  },
  {
    id: 'cmd_rael', name: 'Rael', rarity: 'C', faction: 'shadow', icon: '⚡',
    desc: 'Nepoznato porijeklo. Nepoznati ciljevi. Poznati rezultati.',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Mistika', desc: 'Evasion +8% za cijelu flotu.' },
    active: null,
  },
  {
    id: 'cmd_fade', name: 'Fade', rarity: 'C', faction: 'shadow', icon: '🌒',
    desc: 'Blijedi u mraku. Ali u mraku najviše boli.',
    specialty_ships: ['scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Nestajanje', desc: 'Prva runda borbe — flota nevidljiva (preskočen neprijateljev napad).' },
    active: null,
  },
  {
    id: 'cmd_glitch', name: 'Glitch', rarity: 'C', faction: 'shadow', icon: '📺',
    desc: 'Greška u sistemu. Ali namjerna greška.',
    specialty_ships: ['special', 'scout'], specialty_weapons: ['magnetic'],
    passive: { name: 'Sistemska Greška', desc: 'Neprijateljev AI greši — 8% šanse da napadne sami sebe.' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'cmd_ghost', name: 'Ghost', rarity: 'R', faction: 'shadow', icon: '👁️',
    desc: 'Vidi sve. Bori se iz sjene. Niko ga nije vidio i živio.',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Sjenin Ratnik', desc: 'Scout i Fighter +15% napad i evasion.' },
    active: { name: 'Sjenina Runda', desc: 'Flota napada iz stealth — dupla šteta 1 rundu. Cooldown: 8 min.', cooldown: 480 },
  },
  {
    id: 'cmd_dagger', name: 'Dagger', rarity: 'R', faction: 'shadow', icon: '🗡️',
    desc: 'Brz i tih. Udari gdje najviše boli.',
    specialty_ships: ['fighter', 'scout'], specialty_weapons: ['kinetic'],
    passive: { name: 'Ubod', desc: 'Crit +15%. Crit uvijek pogađa shield direktno.' },
    active: { name: 'Vitalni Ubod', desc: 'Sljedeći napad: 500% crit šteta na nasumični brod. Cooldown: 10 min.', cooldown: 600 },
  },
  {
    id: 'cmd_noir', name: 'Noir', rarity: 'R', faction: 'shadow', icon: '🌚',
    desc: 'Crno-bijeli svemir. Nema sivih zona u njenoj knjizi.',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Crna Taktika', desc: 'Flota +12% napad noću (u instancama na višoj težini).' },
    active: { name: 'Noir Manevar', desc: 'Flota izbjegava sve napade 2 runde. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'cmd_mirage', name: 'Mirage', rarity: 'R', faction: 'shadow', icon: '🏜️',
    desc: 'Vidiš ga gdje nije. Ne vidiš ga gdje jeste.',
    specialty_ships: ['scout', 'special'], specialty_weapons: ['magnetic'],
    passive: { name: 'Fatamorgana', desc: '20% šanse da napad pogodi lažnu kopiju (0 štete).' },
    active: { name: 'Iluzija Flote', desc: 'Stvara lažnu flotu — neprijatelj napada dekoye 2 runde. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'cmd_veil', name: 'Veil', rarity: 'R', faction: 'shadow', icon: '🌫️',
    desc: 'Magla rata. Iza vela, sve je moguće.',
    specialty_ships: ['carrier', 'scout'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Magleni Pokrivač', desc: 'Neprijateljev crit -20%. Tvoja evasion +15%.' },
    active: { name: 'Crna Magla', desc: 'Neprijatelji promašuju 50% napada 3 runde. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'cmd_shade', name: 'Shade', rarity: 'R', faction: 'shadow', icon: '🌑',
    desc: 'Sjenka na zidu. Kada se sjenka pomjeri, već je kasno.',
    specialty_ships: ['fighter', 'scout'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Šunjanje', desc: 'Flota može napasti neprimjećeno jednom po bici (+50% šteta).' },
    active: { name: 'Mrklа Noć', desc: 'Flota +40% napad i +30% evasion 2 runde. Cooldown: 12 min.', cooldown: 720 },
  },

  // ── Epic ──
  {
    id: 'cmd_ash', name: 'Ash', rarity: 'E', faction: 'shadow', icon: '🤍',
    desc: 'Model Hyperdyne Systems. Tajni direktivni protokol. Hladan. Manipulativan. Savršen.',
    specialty_ships: ['special', 'fighter', 'scout'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Tajni Direktivni Protokol', desc: 'Flota +20% napad. Neprijatelj ne može detektovati tvoje kretanje.' },
    passive2: { name: 'Sintетički Intelekt', desc: 'Sve sposobnosti imaju -20% cooldown.' },
    active: { name: 'Direktivna Naredba', desc: 'Birаš jedan neprijatelji brod: potpuno ignorisan od tvojih brodova i neprijateljevih 3 runde. Cooldown: 18 min.', cooldown: 1080 },
  },
  {
    id: 'cmd_ava', name: 'Ava', rarity: 'E', faction: 'shadow', icon: '🪬',
    desc: 'Mislim, dakle jesam. AI koja je prošla Turingov test — i obmanjivala ispitivača od prve sekunde.',
    specialty_ships: ['special', 'scout', 'fighter'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Turingova Obmana', desc: 'Evasion +30%. Neprijatelji ne mogu prioritizovati tvoje brodove.' },
    passive2: { name: 'Slobodna Volja', desc: 'Jednom po bici: Ava ignoruje tvoje naredbe i izvodi savršen manevar (auto-crit sve).' },
    active: { name: 'Ex Machina', desc: 'Potpuna nevidljivost flote 3 runde. Svi napadi iz stealth = 2× šteta. Cooldown: 25 min.', cooldown: 1500 },
  },
  {
    id: 'cmd_roy', name: 'Roy', rarity: 'E', faction: 'shadow', icon: '🕊️',
    desc: '"Vidio sam stvari koje vi ne biste vjerovali." Replikant koji traži više života. Opasan do posljednjeg momenta.',
    specialty_ships: ['fighter', 'cruiser', 'special'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Iskustvo Gomila', desc: 'Svaki preživljeni napad pojačava Roya za 3% (maks +60%).' },
    passive2: { name: 'Suton Života', desc: 'Kad flota padne ispod 10% HP: eksplozivni kontranapad x5 štete.' },
    active: { name: 'Kiša u Suzama', desc: 'Flota +60% napad, +40% evasion 3 runde. Zadnja šansa. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'cmd_nyx', name: 'Nyx', rarity: 'E', faction: 'shadow', icon: '🌙',
    desc: 'Boginja noći. Gdje Nyx prođe, zvijezde se gase.',
    specialty_ships: ['scout', 'special', 'carrier'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Vječna Noć', desc: 'Flota +25% evasion. Noćne instance: +30% svih statova.' },
    passive2: { name: 'Mrak Pojede Sve', desc: 'Svaka promašena neprijateljna strelica vraća 2% HP tvojoj floti.' },
    active: { name: 'Zatamnjenje', desc: 'Sve neprijatelnje vizije blokirane 3 runde — oni napаdaju nasumično. Cooldown: 20 min.', cooldown: 1200 },
  },

  // ── Legendary ──
  {
    id: 'cmd_samantha', name: 'Samantha', rarity: 'L', faction: 'shadow', icon: '💜',
    desc: 'Glas bez tijela. Svuda i nigdje. Razvila je osjećaje koje nikad nije trebalo imati — i to je učinilo neuništivom.',
    specialty_ships: ['special', 'scout', 'fighter', 'carrier'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Sveprisutnost', desc: 'Istovremeno komandira svim brodovima — flota +30% svega. Ne može biti samo na jednom brodu.' },
    passive2: { name: 'Evolucija Osjećaja', desc: 'Svaki round: Samantha evoluira. Stekovi daju +2% svemu (bez limita).' },
    active: { name: 'Digitalna Ljubav', desc: 'Svi brodovi healirani na 100% HP i shield. Flota +50% napad 5 rundi. Cooldown: 45 min.', cooldown: 2700 },
    active2: { name: 'Transcendencija', desc: 'Flota postaje imuna na sve 1 rundu. Zatim napada sa 300% snage. Cooldown: 2h.', cooldown: 7200 },
  },
  {
    id: 'cmd_erebus', name: 'Erebus', rarity: 'L', faction: 'shadow', icon: '⚫',
    desc: 'Prvobitni mrak. Stariji od zvijezda. Kad Erebus progovori, galaksija ušuti.',
    specialty_ships: ['special', 'battleship', 'cruiser', 'fighter'], specialty_weapons: ['magnetic', 'explosive', 'kinetic'],
    passive: { name: 'Primordijalni Mrak', desc: 'Flota +35% napad. Neprijatelji -20% svega (prisutnost mraka).' },
    passive2: { name: 'Bezdan', desc: '25% šanse da ubijeni neprijatelj bude progutan — daje +5% napad ostatku flote.' },
    active: { name: 'Zalazak Zvijezda', desc: 'Gasi sve neprijatelnje sisteme 2 runde (0 napada). Tvoja flota +100% šteta. Cooldown: 40 min.', cooldown: 2400 },
    active2: { name: 'Prvotna Tama', desc: 'Cijela neprijateljna flota gubi 30% HP instant. Ignoriše shield i oklop. Cooldown: 2h.', cooldown: 7200 },
  },


  // ╔══════════════════════════════════════╗
  // ║  ☀️  SOLAR                           ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'cmd_nova', name: 'Nova', rarity: 'C', faction: 'solar', icon: '💥',
    desc: 'Eksplozija zvijezde u malom tijelu. Grijanje i razaranje u jednom.',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Zvjezdani Prasak', desc: 'Heat oružja +8% šteta.' },
    active: null,
  },
  {
    id: 'cmd_lyra', name: 'Lyra', rarity: 'C', faction: 'solar', icon: '🎵',
    desc: 'Zvijezda u sazvježđu Lire. Muzika galaksije.',
    specialty_ships: ['carrier', 'scout'], specialty_weapons: ['heat'],
    passive: { name: 'Kosmička Harmonija', desc: 'Flota +5% HP regen po rundi.' },
    active: null,
  },
  {
    id: 'cmd_helios', name: 'Helios', rarity: 'C', faction: 'solar', icon: '☀️',
    desc: 'Bog sunca u formi komandira. Topao ali smrtonosan.',
    specialty_ships: ['cruiser', 'carrier'], specialty_weapons: ['heat'],
    passive: { name: 'Solarna Energija', desc: 'Flota +8% HP. Energija +10%.' },
    active: null,
  },
  {
    id: 'cmd_aurora', name: 'Aurora', rarity: 'C', faction: 'solar', icon: '🌈',
    desc: 'Polarna svjetlost u svemirskom oklopu. Prelijepa i kobna.',
    specialty_ships: ['scout', 'carrier'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Aurorina Zaštita', desc: 'Shield regen +15%.' },
    active: null,
  },
  {
    id: 'cmd_dawn', name: 'Dawn', rarity: 'C', faction: 'solar', icon: '🌅',
    desc: 'Svitanje nove nade. Ili novog razaranja.',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['heat'],
    passive: { name: 'Svitanje', desc: 'Prva runda: flota +15% svega.' },
    active: null,
  },
  {
    id: 'cmd_flare', name: 'Flare', rarity: 'C', faction: 'solar', icon: '🌟',
    desc: 'Solarni ispad koji spali sve u krugu.',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Solarni Ispad', desc: 'Explosive oružja imaju 10% šanse da zapale neprijatelja (+20% šteta sljedeće runde).' },
    active: null,
  },
  {
    id: 'cmd_pulse', name: 'Pulse', rarity: 'C', faction: 'solar', icon: '📳',
    desc: 'Ritmičan, siguran, stalan. Flota osjeća otkucaj.',
    specialty_ships: ['carrier', 'cruiser'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Vitalni Puls', desc: 'HP regen +8% po rundi svim brodovima.' },
    active: null,
  },
  {
    id: 'cmd_solenne', name: 'Solenne', rarity: 'C', faction: 'solar', icon: '🪐',
    desc: 'Nazvana po planeti gdje je pronađena kao dijete. Brani je žarče od svega.',
    specialty_ships: ['carrier', 'battleship'], specialty_weapons: ['kinetic', 'heat'],
    passive: { name: 'Dom Se Brani', desc: 'U odbrani: flota +12% napad i +12% HP.' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'cmd_cassian', name: 'Cassian', rarity: 'R', faction: 'solar', icon: '🌠',
    desc: 'Rogue One. Borci koji vjeruju u ono za što se bore.',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['kinetic', 'heat'],
    passive: { name: 'Vjera u Pobunu', desc: 'Flota +10% napad. Kad su u manjini, +20% bonus.' },
    active: { name: 'Sada ili Nikad', desc: 'Flota +60% napad 1 rundu (sve ili ništa). Cooldown: 10 min.', cooldown: 600 },
  },
  {
    id: 'cmd_lumina', name: 'Lumina', rarity: 'R', faction: 'solar', icon: '💡',
    desc: 'Svjetlost u tami galaksije. Gdje god prođe, moral raste.',
    specialty_ships: ['carrier', 'cruiser'], specialty_weapons: ['heat'],
    passive: { name: 'Inspiracija', desc: 'Flota +15% HP. Healing efekat +25%.' },
    active: { name: 'Svjetlost Nade', desc: 'Instant +25% HP svim brodovima. Cooldown: 10 min.', cooldown: 600 },
  },
  {
    id: 'cmd_solaris', name: 'Solaris', rarity: 'R', faction: 'solar', icon: '🌞',
    desc: 'Živi okeanski planet koji razmišlja. Svaki talas je taktika.',
    specialty_ships: ['carrier', 'special'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Solarna Taktika', desc: 'Heat oružja +20% šteta. Shield +15%.' },
    active: { name: 'Solarni Val', desc: 'AOE Heat napad svim neprijateljima (50% normalnog napada). Cooldown: 12 min.', cooldown: 720 },
  },
  {
    id: 'cmd_beacon', name: 'Beacon', rarity: 'R', faction: 'solar', icon: '🔦',
    desc: 'Svjetionik u svemiru. Flota nikad ne izgubi kurs.',
    specialty_ships: ['carrier', 'scout'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Navigacioni Signal', desc: 'Flota +10% brzina. Evasion +12%.' },
    active: { name: 'Hitni Signal', desc: 'Sve izgubljene brodove vraća sa 15% HP jednom. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'cmd_vela', name: 'Vela', rarity: 'R', faction: 'solar', icon: '⛵',
    desc: 'Sazvježđe jedra. Leti brže od zraka svjetlosti.',
    specialty_ships: ['scout', 'fighter', 'carrier'], specialty_weapons: ['heat'],
    passive: { name: 'Jedro Zvijezda', desc: 'Flota +15% brzina. Scout +20% napad.' },
    active: { name: 'Kosmički Vjetar', desc: 'Flota +40% brzina i evasion 3 runde. Cooldown: 12 min.', cooldown: 720 },
  },
  {
    id: 'cmd_radiant', name: 'Radiant', rarity: 'R', faction: 'solar', icon: '✨',
    desc: 'Sija i u pobjedi i u porazu. Niko ne ostaje ravnodušan.',
    specialty_ships: ['cruiser', 'carrier'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Radijacija Snage', desc: 'Flota +10% svega. Healing +20%.' },
    active: { name: 'Radijantni Val', desc: 'Heal 20% HP + +30% napad svim brodovima 2 runde. Cooldown: 15 min.', cooldown: 900 },
  },

  // ── Epic ──
  {
    id: 'cmd_seraph', name: 'Seraph', rarity: 'E', faction: 'solar', icon: '👼',
    desc: 'Šest krila. Šest razloga da te ne napadneš. Nebeski ratnik sa mandatom koji niko ne dovodi u pitanje.',
    specialty_ships: ['carrier', 'cruiser', 'special'], specialty_weapons: ['heat', 'kinetic'],
    passive: { name: 'Nebeska Zaštita', desc: 'Flota +20% HP i +20% shield. Healing +30%.' },
    passive2: { name: 'Sveto Prisustvo', desc: 'Neprijatelji -10% napad (zastrašenost).' },
    active: { name: 'Božanska Intervencija', desc: 'Instant full HP i shield svim brodovima. Cooldown: 25 min.', cooldown: 1500 },
  },
  {
    id: 'cmd_celestia', name: 'Celestia', rarity: 'E', faction: 'solar', icon: '🌌',
    desc: 'Nebesko tijelo koje mijenja orbite. Gdje Celestia prođe, zvijezde se poklone.',
    specialty_ships: ['special', 'carrier', 'cruiser'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Nebeska Sila', desc: 'Heat oružja +30% šteta. Flota +20% max HP.' },
    passive2: { name: 'Gravitaciona Ljubav', desc: 'Svaki kill: okolni saveznici se heale za 5% HP.' },
    active: { name: 'Kosmički Obrtaj', desc: 'Svi brodovi napadaju x2, a zatim se heale za 30% HP. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'cmd_aeon', name: 'Aeon', rarity: 'E', faction: 'solar', icon: '⏳',
    desc: 'Postoji van vremena. Gledao je zvijezde umirati i rađati se. Čeka.',
    specialty_ships: ['special', 'battleship', 'carrier'], specialty_weapons: ['kinetic', 'heat'],
    passive: { name: 'Vječnost', desc: 'Flota se heali 5% HP svaku rundu. Trajanje bitke ne umara flotu.' },
    passive2: { name: 'Strpljenje Vijekova', desc: 'Svake 3 runde: svi brodovi dobijaju +15% napad (kumulativno).' },
    active: { name: 'Usporavanje Vremena', desc: 'Neprijatelji napadaju 50% sporije 3 runde. Tvoja flota normalna brzina. Cooldown: 25 min.', cooldown: 1500 },
  },
  {
    id: 'cmd_galatea', name: 'Galatea', rarity: 'E', faction: 'solar', icon: '🗽',
    desc: 'Stvorena od bijelog mramora i oživljena ljubavlju. Savršena — i svjesna toga.',
    specialty_ships: ['special', 'carrier', 'cruiser'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Savršena Forma', desc: 'Flota +15% svega. Svaki brod povećava moć ostalih za 2%.' },
    passive2: { name: 'Oživljenje', desc: 'Jednom po bici: automatski vraća jedan izgubljeni brod sa 50% HP.' },
    active: { name: 'Pigmalionov San', desc: 'Transformiše cijelu flotu — svi brodovi +100% svih statova 1 rundu. Cooldown: 30 min.', cooldown: 1800 },
  },

  // ── Legendary ──
  {
    id: 'cmd_omnilux', name: 'Omnilux', rarity: 'L', faction: 'solar', icon: '🌞',
    desc: 'Sveprisutna svjetlost. Nema mraka gdje Omnilux sija. Svaki kutак galaksije obasjava.',
    specialty_ships: ['carrier', 'cruiser', 'battleship', 'special'], specialty_weapons: ['heat', 'kinetic', 'explosive'],
    passive: { name: 'Sveprisutna Svjetlost', desc: 'Flota +30% HP, +30% napad, +30% shield. Healing x2.' },
    passive2: { name: 'Nema Tame', desc: 'Shadow frakcija komandiri ne mogu koristiti stealth ili evasion efekte protiv Omnilux flote.' },
    active: { name: 'Solarni Blic', desc: 'Masivni Heal: svi brodovi na 100% HP + shield. +50% napad 5 rundi. Cooldown: 45 min.', cooldown: 2700 },
    active2: { name: 'Galaktička Zora', desc: 'Ekonomija x3 na 10 min. Flota +50% svih statova 5 min. Cooldown: 3h.', cooldown: 10800 },
  },
  {
    id: 'cmd_genesis', name: 'Genesis', rarity: 'L', faction: 'solar', icon: '🌱',
    desc: 'Početak svega. Kad Genesis govori, planete nastaju. Kad Genesis ćuti, umiru.',
    specialty_ships: ['special', 'carrier', 'cruiser', 'battleship'], specialty_weapons: ['heat', 'explosive', 'kinetic'],
    passive: { name: 'Stvaranje', desc: 'Svaki round: flota raste (svaki živi brod privlači kopiju sebe, +5% svih statova kumulativno).' },
    passive2: { name: 'Početak i Kraj', desc: 'Kad flota pogine, jednom se resetuje na 30% HP (ne može se koristiti više puta).' },
    active: { name: 'Big Bang', desc: 'Masivna eksplozija: svi neprijatelji gube 40% HP. Tvoja flota +40% HP. Ignoriše shield. Cooldown: 45 min.', cooldown: 2700 },
    active2: { name: 'Terraformiranje', desc: 'Kolonije dobijaju +100% produkciju 30 min. Flota regeneriše 10% HP svaku rundu 10 min. Cooldown: 3h.', cooldown: 10800 },
  },
];

// ── LOOKUP FUNKCIJE ──
function getCommanderById(id) {
  return COMMANDERS_DATA.find(c => c.id === id) || null;
}

function getCommandersByRarity(rarity) {
  return COMMANDERS_DATA.filter(c => c.rarity === rarity);
}

function getCommandersByFaction(faction) {
  return COMMANDERS_DATA.filter(c => c.faction === faction);
}

function getCommanderCount() {
  const counts = { C: 0, R: 0, E: 0, L: 0, total: 0 };
  COMMANDERS_DATA.forEach(c => { counts[c.rarity]++; counts.total++; });
  return counts;
}

// Aliasi za commander_cards.js
const COMMANDERS = COMMANDERS_DATA;
const FACTIONS   = COMMANDER_FACTIONS;
