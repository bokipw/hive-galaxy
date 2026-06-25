// ============================================================
// HIVE GALAXY — data/commanders.js
// 100 komandira: 40C / 30R / 20E / 10L
// 5 frakcija × (8C + 6R + 4E + 2L)
// ============================================================

// ── FRAKCIJE ──
const COMMANDER_FACTIONS = {
  vanguard:   { name: 'Vanguard', nameKey: 'faction.vanguard.name', nameKey: 'faction.vanguard.name',   icon: '⚔️',  color: '#ff4444', desc: 'Ofanzivni ratnici, maksimalni napad', descKey: 'faction.vanguard.desc', descKey: 'faction.vanguard.desc' },
  sentinel:   { name: 'Sentinel', nameKey: 'faction.sentinel.name', nameKey: 'faction.sentinel.name',   icon: '🛡️',  color: '#4488ff', desc: 'Zaštitnici flote, odbrana i HP', descKey: 'faction.sentinel.desc', descKey: 'faction.sentinel.desc' },
  technocrat: { name: 'Technocrat', nameKey: 'faction.technocrat.name', nameKey: 'faction.technocrat.name', icon: '🔬',  color: '#00ff88', desc: 'Nauka i resursi, ekonomska dominacija', descKey: 'faction.technocrat.desc', descKey: 'faction.technocrat.desc' },
  shadow:     { name: 'Shadow', nameKey: 'faction.shadow.name', nameKey: 'faction.shadow.name',     icon: '🌑',  color: '#aa44ff', desc: 'Brzina, stealth i evasion', descKey: 'faction.shadow.desc', descKey: 'faction.shadow.desc' },
  solar:      { name: 'Solar', nameKey: 'faction.solar.name', nameKey: 'faction.solar.name',      icon: '☀️',  color: '#ffcc44', desc: 'Balans, healing i svjetlost', descKey: 'faction.solar.desc', descKey: 'faction.solar.desc' },
};

// ── LISTA SVIH KOMANDIRA ──
const COMMANDERS_DATA = [

  // ╔══════════════════════════════════════╗
  // ║  ⚔️  VANGUARD                        ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'cmd_iron_rex', name: 'Iron Rex', nameKey: 'commander.cmd_iron_rex.name', nameKey: 'commander.cmd_iron_rex.name', rarity: 'C', faction: 'vanguard', icon: '🦁',
    desc: 'Vojskovođa kovan u bitkama. Nema taktike — samo napad.', descKey: 'commander.cmd_iron_rex.desc', descKey: 'commander.cmd_iron_rex.desc',
    specialty_ships: ['fighter', 'battleship'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Gvozdena Volja', nameKey: 'commander.cmd_iron_rex.passive.name', nameKey: 'commander.cmd_iron_rex.passive.name', desc: 'Flota +5% napad.', descKey: 'commander.cmd_iron_rex.passive.desc', descKey: 'commander.cmd_iron_rex.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_blaze_korr', name: 'Blaze Korr', nameKey: 'commander.cmd_blaze_korr.name', nameKey: 'commander.cmd_blaze_korr.name', rarity: 'C', faction: 'vanguard', icon: '🔥',
    desc: 'Vatrogasni napadač. Gdje god prođe, ostane pepeo.', descKey: 'commander.cmd_blaze_korr.desc', descKey: 'commander.cmd_blaze_korr.desc',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Plamen Rata', nameKey: 'commander.cmd_blaze_korr.passive.name', nameKey: 'commander.cmd_blaze_korr.passive.name', desc: 'Heat oružja +8% šteta.', descKey: 'commander.cmd_blaze_korr.passive.desc', descKey: 'commander.cmd_blaze_korr.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_ragnar', name: 'Ragnar', nameKey: 'commander.cmd_ragnar.name', nameKey: 'commander.cmd_ragnar.name', rarity: 'C', faction: 'vanguard', icon: '🪓',
    desc: 'Ratnik sjevera. Hladnokrvan, brutalan, nezaustavljiv.', descKey: 'commander.cmd_ragnar.desc', descKey: 'commander.cmd_ragnar.desc',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic'],
    passive: { name: 'Berserker Instinkt', nameKey: 'commander.cmd_ragnar.passive.name', nameKey: 'commander.cmd_ragnar.passive.name', desc: 'Pri HP < 50%, napad +15%.', descKey: 'commander.cmd_ragnar.passive.desc', descKey: 'commander.cmd_ragnar.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_kane', name: 'Kane', nameKey: 'commander.cmd_kane.name', nameKey: 'commander.cmd_kane.name', rarity: 'C', faction: 'vanguard', icon: '💀',
    desc: 'Veteran koji je preživio previše. Svaki boj je posljednji.', descKey: 'commander.cmd_kane.desc', descKey: 'commander.cmd_kane.desc',
    specialty_ships: ['fighter'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Posljednji Čovjek', nameKey: 'commander.cmd_kane.passive.name', nameKey: 'commander.cmd_kane.passive.name', desc: 'Posljednji preživjeli brod +20% napad.', descKey: 'commander.cmd_kane.passive.desc', descKey: 'commander.cmd_kane.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_steele', name: 'Steele', nameKey: 'commander.cmd_steele.name', nameKey: 'commander.cmd_steele.name', rarity: 'C', faction: 'vanguard', icon: '🗡️',
    desc: 'Čelik ne pita. Čelik siječe.', descKey: 'commander.cmd_steele.desc', descKey: 'commander.cmd_steele.desc',
    specialty_ships: ['cruiser'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Oštrenje', nameKey: 'commander.cmd_steele.passive.name', nameKey: 'commander.cmd_steele.passive.name', desc: 'Crit šansa +5%.', descKey: 'commander.cmd_steele.passive.desc', descKey: 'commander.cmd_steele.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_rork', name: 'Rork', nameKey: 'commander.cmd_rork.name', nameKey: 'commander.cmd_rork.name', rarity: 'C', faction: 'vanguard', icon: '🥊',
    desc: 'Grub, prost i direktan. Efikasnost kroz jednostavnost.', descKey: 'commander.cmd_rork.desc', descKey: 'commander.cmd_rork.desc',
    specialty_ships: ['battleship'], specialty_weapons: ['explosive'],
    passive: { name: 'Direktan Udar', nameKey: 'commander.cmd_rork.passive.name', nameKey: 'commander.cmd_rork.passive.name', desc: 'Explosive oružja +10% šteta.', descKey: 'commander.cmd_rork.passive.desc', descKey: 'commander.cmd_rork.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_mira', name: 'Mira', nameKey: 'commander.cmd_mira.name', nameKey: 'commander.cmd_mira.name', rarity: 'C', faction: 'vanguard', icon: '🏹',
    desc: 'Prva žena koja je presjekla flotu na pola golim rukama — po legendi.', descKey: 'commander.cmd_mira.desc', descKey: 'commander.cmd_mira.desc',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['heat', 'kinetic'],
    passive: { name: 'Precizni Udar', nameKey: 'commander.cmd_mira.passive.name', nameKey: 'commander.cmd_mira.passive.name', desc: 'Prva runda borbe +20% napad.', descKey: 'commander.cmd_mira.passive.desc', descKey: 'commander.cmd_mira.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_bray', name: 'Bray', nameKey: 'commander.cmd_bray.name', nameKey: 'commander.cmd_bray.name', rarity: 'C', faction: 'vanguard', icon: '⚡',
    desc: 'Mladi novak sa previše energije i malo iskustva. Ali brz.', descKey: 'commander.cmd_bray.desc', descKey: 'commander.cmd_bray.desc',
    specialty_ships: ['scout'], specialty_weapons: ['magnetic'],
    passive: { name: 'Mladost', nameKey: 'commander.cmd_bray.passive.name', nameKey: 'commander.cmd_bray.passive.name', desc: 'Flota +5% brzina.', descKey: 'commander.cmd_bray.passive.desc', descKey: 'commander.cmd_bray.passive.desc' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'cmd_kira_voss', name: 'Kira Voss', nameKey: 'commander.cmd_kira_voss.name', nameKey: 'commander.cmd_kira_voss.name', rarity: 'R', faction: 'vanguard', icon: '⚔️',
    desc: 'Komandantica sa reputacijom koja prethodi svakom boju.', descKey: 'commander.cmd_kira_voss.desc', descKey: 'commander.cmd_kira_voss.desc',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Autoritet', nameKey: 'commander.cmd_kira_voss.passive.name', nameKey: 'commander.cmd_kira_voss.passive.name', desc: 'Flota +10% napad i +5% HP.', descKey: 'commander.cmd_kira_voss.passive.desc', descKey: 'commander.cmd_kira_voss.passive.desc' },
    active: { name: 'Juriš!', nameKey: 'commander.cmd_kira_voss.active.name', nameKey: 'commander.cmd_kira_voss.active.name', desc: 'Svi brodovi napadaju dvaput u sledećoj rundi. Cooldown: 8 min.', descKey: 'commander.cmd_kira_voss.active.desc', descKey: 'commander.cmd_kira_voss.active.desc', cooldown: 480 },
  },
  {
    id: 'cmd_marcus_cole', name: 'Marcus Cole', nameKey: 'commander.cmd_marcus_cole.name', nameKey: 'commander.cmd_marcus_cole.name', rarity: 'R', faction: 'vanguard', icon: '🛡️',
    desc: 'Taktičar koji napad koristi kao odbranu.', descKey: 'commander.cmd_marcus_cole.desc', descKey: 'commander.cmd_marcus_cole.desc',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Ofanzivna Taktika', nameKey: 'commander.cmd_marcus_cole.passive.name', nameKey: 'commander.cmd_marcus_cole.passive.name', desc: 'Svaki kill daje +3% napad ostalim brodovima (max +30%).', descKey: 'commander.cmd_marcus_cole.passive.desc', descKey: 'commander.cmd_marcus_cole.passive.desc' },
    active: { name: 'Koncentrisana Vatra', nameKey: 'commander.cmd_marcus_cole.active.name', nameKey: 'commander.cmd_marcus_cole.active.name', desc: 'Sva flota cilja jedan brod 2 runde. Cooldown: 10 min.', descKey: 'commander.cmd_marcus_cole.active.desc', descKey: 'commander.cmd_marcus_cole.active.desc', cooldown: 600 },
  },
  {
    id: 'cmd_zane', name: 'Zane Orion', nameKey: 'commander.cmd_zane.name', nameKey: 'commander.cmd_zane.name', rarity: 'R', faction: 'vanguard', icon: '🌌',
    desc: 'Navigira kroz galaksiju kao kroz tuđa tijela — bez sažaljenja.', descKey: 'commander.cmd_zane.desc', descKey: 'commander.cmd_zane.desc',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Zvjezdani Kurs', nameKey: 'commander.cmd_zane.passive.name', nameKey: 'commander.cmd_zane.passive.name', desc: 'Flota +8% napad i +8% brzina.', descKey: 'commander.cmd_zane.passive.desc', descKey: 'commander.cmd_zane.passive.desc' },
    active: { name: 'Galaktički Udar', nameKey: 'commander.cmd_zane.active.name', nameKey: 'commander.cmd_zane.active.name', desc: 'Napad svih brodova +40% za 60s. Cooldown: 12 min.', descKey: 'commander.cmd_zane.active.desc', descKey: 'commander.cmd_zane.active.desc', cooldown: 720 },
  },
  {
    id: 'cmd_helga', name: 'Helga', nameKey: 'commander.cmd_helga.name', nameKey: 'commander.cmd_helga.name', rarity: 'R', faction: 'vanguard', icon: '🪖',
    desc: 'Čelična žena. Njeni vojnici ginu zadnji.', descKey: 'commander.cmd_helga.desc', descKey: 'commander.cmd_helga.desc',
    specialty_ships: ['battleship'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Ratna Mašina', nameKey: 'commander.cmd_helga.passive.name', nameKey: 'commander.cmd_helga.passive.name', desc: 'Battleship klasa +15% napad i +10% HP.', descKey: 'commander.cmd_helga.passive.desc', descKey: 'commander.cmd_helga.passive.desc' },
    active: { name: 'Drum Roll', nameKey: 'commander.cmd_helga.active.name', nameKey: 'commander.cmd_helga.active.name', desc: 'Sve Battleship klase napadaju dvaput. Cooldown: 10 min.', descKey: 'commander.cmd_helga.active.desc', descKey: 'commander.cmd_helga.active.desc', cooldown: 600 },
  },
  {
    id: 'cmd_drax', name: 'Drax', nameKey: 'commander.cmd_drax.name', nameKey: 'commander.cmd_drax.name', rarity: 'R', faction: 'vanguard', icon: '💥',
    desc: 'Nema strategije. Samo destrukcija.', descKey: 'commander.cmd_drax.desc', descKey: 'commander.cmd_drax.desc',
    specialty_ships: ['battleship', 'special'], specialty_weapons: ['explosive'],
    passive: { name: 'Razaranje', nameKey: 'commander.cmd_drax.passive.name', nameKey: 'commander.cmd_drax.passive.name', desc: 'Explosive oružja +20% šteta.', descKey: 'commander.cmd_drax.passive.desc', descKey: 'commander.cmd_drax.passive.desc' },
    active: { name: 'Bomba', nameKey: 'commander.cmd_drax.active.name', nameKey: 'commander.cmd_drax.active.name', desc: 'Sljedeći napad nanosi 3× štetu. Cooldown: 15 min.', descKey: 'commander.cmd_drax.active.desc', descKey: 'commander.cmd_drax.active.desc', cooldown: 900 },
  },
  {
    id: 'cmd_brutus', name: 'Brutus', nameKey: 'commander.cmd_brutus.name', nameKey: 'commander.cmd_brutus.name', rarity: 'R', faction: 'vanguard', icon: '🗡️',
    desc: 'Predao se i izdao. Ali na bojnom polju, nema boljeg.', descKey: 'commander.cmd_brutus.desc', descKey: 'commander.cmd_brutus.desc',
    specialty_ships: ['cruiser'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Izdajnički Nož', nameKey: 'commander.cmd_brutus.passive.name', nameKey: 'commander.cmd_brutus.passive.name', desc: 'Crit šteta +50%.', descKey: 'commander.cmd_brutus.passive.desc', descKey: 'commander.cmd_brutus.passive.desc' },
    active: { name: 'Lovi Slabog', nameKey: 'commander.cmd_brutus.active.name', nameKey: 'commander.cmd_brutus.active.name', desc: 'Sva flota cilja brod s najmanje HP. Cooldown: 8 min.', descKey: 'commander.cmd_brutus.active.desc', descKey: 'commander.cmd_brutus.active.desc', cooldown: 480 },
  },

  // ── Epic ──
  {
    id: 'cmd_ares', name: 'Ares', nameKey: 'commander.cmd_ares.name', nameKey: 'commander.cmd_ares.name', rarity: 'E', faction: 'vanguard', icon: '⚡',
    desc: 'Bog rata u ljudskoj koži. Ili bar tako misli.', descKey: 'commander.cmd_ares.desc', descKey: 'commander.cmd_ares.desc',
    specialty_ships: ['battleship', 'cruiser', 'special'], specialty_weapons: ['kinetic', 'explosive', 'heat'],
    passive: { name: 'Ratna Furija', nameKey: 'commander.cmd_ares.passive.name', nameKey: 'commander.cmd_ares.passive.name', desc: 'Flota +15% napad. Crit +10%.', descKey: 'commander.cmd_ares.passive.desc', descKey: 'commander.cmd_ares.passive.desc' },
    passive2: { name: 'Domino', nameKey: 'commander.cmd_ares.passive2.name', nameKey: 'commander.cmd_ares.passive2.name', desc: 'Svaki kill povećava sledeći napad za 5% (kumulativno).', descKey: 'commander.cmd_ares.passive2.desc', descKey: 'commander.cmd_ares.passive2.desc' },
    active: { name: 'Olimpski Grom', nameKey: 'commander.cmd_ares.active.name', nameKey: 'commander.cmd_ares.active.name', desc: 'Sva flota +50% napad, +30% crit za 2 runde. Cooldown: 15 min.', descKey: 'commander.cmd_ares.active.desc', descKey: 'commander.cmd_ares.active.desc', cooldown: 900 },
  },
  {
    id: 'cmd_nemesis', name: 'Nemesis', nameKey: 'commander.cmd_nemesis.name', nameKey: 'commander.cmd_nemesis.name', rarity: 'E', faction: 'vanguard', icon: '☠️',
    desc: 'Boginja osvete. Svaka izgubljena borba pamti se vječno.', descKey: 'commander.cmd_nemesis.desc', descKey: 'commander.cmd_nemesis.desc',
    specialty_ships: ['cruiser', 'fighter'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Osveta', nameKey: 'commander.cmd_nemesis.passive.name', nameKey: 'commander.cmd_nemesis.passive.name', desc: 'Za svaki izgubljeni brod, ostatak dobija +4% napad.', descKey: 'commander.cmd_nemesis.passive.desc', descKey: 'commander.cmd_nemesis.passive.desc' },
    passive2: { name: 'Prokletstvo', nameKey: 'commander.cmd_nemesis.passive2.name', nameKey: 'commander.cmd_nemesis.passive2.name', desc: 'Neprijatelj koji ubije tvog broda prima +25% štete.', descKey: 'commander.cmd_nemesis.passive2.desc', descKey: 'commander.cmd_nemesis.passive2.desc' },
    active: { name: 'Bijeda i Osveta', nameKey: 'commander.cmd_nemesis.active.name', nameKey: 'commander.cmd_nemesis.active.name', desc: 'Instant +100% napad za 1 rundu. Cooldown: 20 min.', descKey: 'commander.cmd_nemesis.active.desc', descKey: 'commander.cmd_nemesis.active.desc', cooldown: 1200 },
  },
  {
    id: 'cmd_berserker', name: 'Berserker', nameKey: 'commander.cmd_berserker.name', nameKey: 'commander.cmd_berserker.name', rarity: 'E', faction: 'vanguard', icon: '🔴',
    desc: 'Nema bola. Nema straha. Samo naprijed.', descKey: 'commander.cmd_berserker.desc', descKey: 'commander.cmd_berserker.desc',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Bezumlje', nameKey: 'commander.cmd_berserker.passive.name', nameKey: 'commander.cmd_berserker.passive.name', desc: 'Što manje HP ima flota, to više napada (maks +60%).', descKey: 'commander.cmd_berserker.passive.desc', descKey: 'commander.cmd_berserker.passive.desc' },
    passive2: { name: 'Adrenalinska Pumpa', nameKey: 'commander.cmd_berserker.passive2.name', nameKey: 'commander.cmd_berserker.passive2.name', desc: 'HP ispod 30%? Napad se udvostručuje.', descKey: 'commander.cmd_berserker.passive2.desc', descKey: 'commander.cmd_berserker.passive2.desc' },
    active: { name: 'Totalni Kaos', nameKey: 'commander.cmd_berserker.active.name', nameKey: 'commander.cmd_berserker.active.name', desc: 'Svi brodovi ignorišu shield 3 runde. Cooldown: 18 min.', descKey: 'commander.cmd_berserker.active.desc', descKey: 'commander.cmd_berserker.active.desc', cooldown: 1080 },
  },
  {
    id: 'cmd_titan_cmd', name: 'Titan', nameKey: 'commander.cmd_titan_cmd.name', nameKey: 'commander.cmd_titan_cmd.name', rarity: 'E', faction: 'vanguard', icon: '🗿',
    desc: 'Legenda stara kao svemirsko osvajanje. Neće stati.', descKey: 'commander.cmd_titan_cmd.desc', descKey: 'commander.cmd_titan_cmd.desc',
    specialty_ships: ['battleship', 'carrier'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Titanska Sila', nameKey: 'commander.cmd_titan_cmd.passive.name', nameKey: 'commander.cmd_titan_cmd.passive.name', desc: 'Battleship i Carrier +20% napad i +20% HP.', descKey: 'commander.cmd_titan_cmd.passive.desc', descKey: 'commander.cmd_titan_cmd.passive.desc' },
    passive2: { name: 'Nepobediivost', nameKey: 'commander.cmd_titan_cmd.passive2.name', nameKey: 'commander.cmd_titan_cmd.passive2.name', desc: 'Flota ne može biti ubita ispod 1 HP u prvoj rundi.', descKey: 'commander.cmd_titan_cmd.passive2.desc', descKey: 'commander.cmd_titan_cmd.passive2.desc' },
    active: { name: 'Titansko Udiranje', nameKey: 'commander.cmd_titan_cmd.active.name', nameKey: 'commander.cmd_titan_cmd.active.name', desc: 'Sve Battleship klase napadaju 3× u jednoj rundi. Cooldown: 20 min.', descKey: 'commander.cmd_titan_cmd.active.desc', descKey: 'commander.cmd_titan_cmd.active.desc', cooldown: 1200 },
  },

  // ── Legendary ──
  {
    id: 'cmd_ragnarok', name: 'Ragnarok', nameKey: 'commander.cmd_ragnarok.name', nameKey: 'commander.cmd_ragnarok.name', rarity: 'L', faction: 'vanguard', icon: '🌋',
    desc: 'Kraj svega. Pobednička vojska koja nije stala ni pred bogovima.', descKey: 'commander.cmd_ragnarok.desc', descKey: 'commander.cmd_ragnarok.desc',
    specialty_ships: ['battleship', 'cruiser', 'carrier', 'special'], specialty_weapons: ['kinetic', 'explosive', 'heat', 'magnetic'],
    passive: { name: 'Apokalipsa', nameKey: 'commander.cmd_ragnarok.passive.name', nameKey: 'commander.cmd_ragnarok.passive.name', desc: 'Flota +25% napad. Explosive oružja +30% šteta.', descKey: 'commander.cmd_ragnarok.passive.desc', descKey: 'commander.cmd_ragnarok.passive.desc' },
    passive2: { name: 'Posljednja Borba', nameKey: 'commander.cmd_ragnarok.passive2.name', nameKey: 'commander.cmd_ragnarok.passive2.name', desc: 'Kad flota padne ispod 20% HP, svi brodovi dobijaju +100% napad.', descKey: 'commander.cmd_ragnarok.passive2.desc', descKey: 'commander.cmd_ragnarok.passive2.desc' },
    active: { name: 'Kraj Svjetova', nameKey: 'commander.cmd_ragnarok.active.name', nameKey: 'commander.cmd_ragnarok.active.name', desc: 'Svi brodovi napadaju 3× u sledećoj rundi. Crit garantovan. Cooldown: 30 min.', descKey: 'commander.cmd_ragnarok.active.desc', descKey: 'commander.cmd_ragnarok.active.desc', cooldown: 1800 },
    active2: { name: 'Valhalla Poziva', nameKey: 'commander.cmd_ragnarok.active2.name', nameKey: 'commander.cmd_ragnarok.active2.name', desc: 'Izgubljeni brodovi se vraćaju na 1 HP jednom po bici. Cooldown: 1h.', descKey: 'commander.cmd_ragnarok.active2.desc', descKey: 'commander.cmd_ragnarok.active2.desc', cooldown: 3600 },
  },
  {
    id: 'cmd_annihilator', name: 'The Annihilator', nameKey: 'commander.cmd_annihilator.name', nameKey: 'commander.cmd_annihilator.name', rarity: 'L', faction: 'vanguard', icon: '💀',
    desc: 'Nema imena. Nema istorije. Samo rezultati. Sistemi padaju.', descKey: 'commander.cmd_annihilator.desc', descKey: 'commander.cmd_annihilator.desc',
    specialty_ships: ['battleship', 'cruiser', 'special'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Anihilacija', nameKey: 'commander.cmd_annihilator.passive.name', nameKey: 'commander.cmd_annihilator.passive.name', desc: 'Svaki kill: sledeći napad +10% (maks +100%). Ne resetuje se između rundi.', descKey: 'commander.cmd_annihilator.passive.desc', descKey: 'commander.cmd_annihilator.passive.desc' },
    passive2: { name: 'Nema Milosti', nameKey: 'commander.cmd_annihilator.passive2.name', nameKey: 'commander.cmd_annihilator.passive2.name', desc: 'Crit šteta +100%. Shield penetracija +20%.', descKey: 'commander.cmd_annihilator.passive2.desc', descKey: 'commander.cmd_annihilator.passive2.desc' },
    active: { name: 'Brisanje', nameKey: 'commander.cmd_annihilator.active.name', nameKey: 'commander.cmd_annihilator.active.name', desc: 'Jedan neprijatelji brod trenutno eliminisan (bez obzira na HP/shield). Cooldown: 45 min.', descKey: 'commander.cmd_annihilator.active.desc', descKey: 'commander.cmd_annihilator.active.desc', cooldown: 2700 },
    active2: { name: 'Uništi Sve', nameKey: 'commander.cmd_annihilator.active2.name', nameKey: 'commander.cmd_annihilator.active2.name', desc: 'Flota +80% napad 3 runde + imuna na štetu 1 rundu. Cooldown: 2h.', descKey: 'commander.cmd_annihilator.active2.desc', descKey: 'commander.cmd_annihilator.active2.desc', cooldown: 7200 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🛡️  SENTINEL                        ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'cmd_aegis', name: 'Aegis', nameKey: 'commander.cmd_aegis.name', nameKey: 'commander.cmd_aegis.name', rarity: 'C', faction: 'sentinel', icon: '🛡️',
    desc: 'Štit bez mača. Ali štit koji nikad nije probijen.', descKey: 'commander.cmd_aegis.desc', descKey: 'commander.cmd_aegis.desc',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Čelični Štit', nameKey: 'commander.cmd_aegis.passive.name', nameKey: 'commander.cmd_aegis.passive.name', desc: 'Flota +10% max shield.', descKey: 'commander.cmd_aegis.passive.desc', descKey: 'commander.cmd_aegis.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_crest', name: 'Crest', nameKey: 'commander.cmd_crest.name', nameKey: 'commander.cmd_crest.name', rarity: 'C', faction: 'sentinel', icon: '🏰',
    desc: 'Ponos porodice. Brani flotu kao što bi branio dom.', descKey: 'commander.cmd_crest.desc', descKey: 'commander.cmd_crest.desc',
    specialty_ships: ['cruiser'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Porodični Grb', nameKey: 'commander.cmd_crest.passive.name', nameKey: 'commander.cmd_crest.passive.name', desc: 'Cruiser klasa +10% HP.', descKey: 'commander.cmd_crest.passive.desc', descKey: 'commander.cmd_crest.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_ironwall', name: 'Ironwall', nameKey: 'commander.cmd_ironwall.name', nameKey: 'commander.cmd_ironwall.name', rarity: 'C', faction: 'sentinel', icon: '🧱',
    desc: 'Živi zid. Ne miče se. Ne pada.', descKey: 'commander.cmd_ironwall.desc', descKey: 'commander.cmd_ironwall.desc',
    specialty_ships: ['battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Neprobojnost', nameKey: 'commander.cmd_ironwall.passive.name', nameKey: 'commander.cmd_ironwall.passive.name', desc: 'Battleship klasa +15% oklop.', descKey: 'commander.cmd_ironwall.passive.desc', descKey: 'commander.cmd_ironwall.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_stone', name: 'Stone', nameKey: 'commander.cmd_stone.name', nameKey: 'commander.cmd_stone.name', rarity: 'C', faction: 'sentinel', icon: '🪨',
    desc: 'Tih i stabilan. Kad Stone stoji, niko ne prolazi.', descKey: 'commander.cmd_stone.desc', descKey: 'commander.cmd_stone.desc',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['explosive'],
    passive: { name: 'Kamena Brana', nameKey: 'commander.cmd_stone.passive.name', nameKey: 'commander.cmd_stone.passive.name', desc: 'Flota prima -5% štete.', descKey: 'commander.cmd_stone.passive.desc', descKey: 'commander.cmd_stone.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_ward', name: 'Ward', nameKey: 'commander.cmd_ward.name', nameKey: 'commander.cmd_ward.name', rarity: 'C', faction: 'sentinel', icon: '⚔️',
    desc: 'Brani. To je sve što zna. To je i dosta.', descKey: 'commander.cmd_ward.desc', descKey: 'commander.cmd_ward.desc',
    specialty_ships: ['carrier'], specialty_weapons: ['magnetic'],
    passive: { name: 'Zaštitnik', nameKey: 'commander.cmd_ward.passive.name', nameKey: 'commander.cmd_ward.passive.name', desc: 'Carrier klasa +12% HP i +8% shield.', descKey: 'commander.cmd_ward.passive.desc', descKey: 'commander.cmd_ward.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_bulwark', name: 'Bulwark', nameKey: 'commander.cmd_bulwark.name', nameKey: 'commander.cmd_bulwark.name', rarity: 'C', faction: 'sentinel', icon: '🔰',
    desc: 'Utvrđenje koje hoda. Neprijatelj se okreće i bježi.', descKey: 'commander.cmd_bulwark.desc', descKey: 'commander.cmd_bulwark.desc',
    specialty_ships: ['battleship'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Bunkeri', nameKey: 'commander.cmd_bulwark.passive.name', nameKey: 'commander.cmd_bulwark.passive.name', desc: 'Flota +8% HP.', descKey: 'commander.cmd_bulwark.passive.desc', descKey: 'commander.cmd_bulwark.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_rampart', name: 'Rampart', nameKey: 'commander.cmd_rampart.name', nameKey: 'commander.cmd_rampart.name', rarity: 'C', faction: 'sentinel', icon: '🏯',
    desc: 'Stari vojnik. Mirno drži liniju.', descKey: 'commander.cmd_rampart.desc', descKey: 'commander.cmd_rampart.desc',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Odbrambena Linija', nameKey: 'commander.cmd_rampart.passive.name', nameKey: 'commander.cmd_rampart.passive.name', desc: 'Crit šansa neprijatelja -5%.', descKey: 'commander.cmd_rampart.passive.desc', descKey: 'commander.cmd_rampart.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_bastion', name: 'Bastion', nameKey: 'commander.cmd_bastion.name', nameKey: 'commander.cmd_bastion.name', rarity: 'C', faction: 'sentinel', icon: '🗼',
    desc: 'Posljednja linija odbrane. Nikad nije probijen.', descKey: 'commander.cmd_bastion.desc', descKey: 'commander.cmd_bastion.desc',
    specialty_ships: ['battleship', 'carrier'], specialty_weapons: ['kinetic'],
    passive: { name: 'Tvrđava', nameKey: 'commander.cmd_bastion.passive.name', nameKey: 'commander.cmd_bastion.passive.name', desc: 'Flota ne gubi više od 20% HP po rundi.', descKey: 'commander.cmd_bastion.passive.desc', descKey: 'commander.cmd_bastion.passive.desc' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'cmd_atlas', name: 'Atlas', nameKey: 'commander.cmd_atlas.name', nameKey: 'commander.cmd_atlas.name', rarity: 'R', faction: 'sentinel', icon: '🌍',
    desc: 'Nosi teret cijele flote na leđima. Bukvalno.', descKey: 'commander.cmd_atlas.desc', descKey: 'commander.cmd_atlas.desc',
    specialty_ships: ['carrier', 'battleship'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Teret Svijeta', nameKey: 'commander.cmd_atlas.passive.name', nameKey: 'commander.cmd_atlas.passive.name', desc: 'Flota +15% HP. Shield regen +20%.', descKey: 'commander.cmd_atlas.passive.desc', descKey: 'commander.cmd_atlas.passive.desc' },
    active: { name: 'Atlasov Oklop', nameKey: 'commander.cmd_atlas.active.name', nameKey: 'commander.cmd_atlas.active.name', desc: 'Cijela flota +50% odbrane 60s. Cooldown: 10 min.', descKey: 'commander.cmd_atlas.active.desc', descKey: 'commander.cmd_atlas.active.desc', cooldown: 600 },
  },
  {
    id: 'cmd_guardian', name: 'Guardian', nameKey: 'commander.cmd_guardian.name', nameKey: 'commander.cmd_guardian.name', rarity: 'R', faction: 'sentinel', icon: '👁️',
    desc: 'Sve vidi. Sve brani. Ništa ne prolazi.', descKey: 'commander.cmd_guardian.desc', descKey: 'commander.cmd_guardian.desc',
    specialty_ships: ['carrier', 'cruiser'], specialty_weapons: ['magnetic'],
    passive: { name: 'Čuvar', nameKey: 'commander.cmd_guardian.passive.name', nameKey: 'commander.cmd_guardian.passive.name', desc: 'Shield kapacitet +20% za cijelu flotu.', descKey: 'commander.cmd_guardian.passive.desc', descKey: 'commander.cmd_guardian.passive.desc' },
    active: { name: 'Energetska Barijera', nameKey: 'commander.cmd_guardian.active.name', nameKey: 'commander.cmd_guardian.active.name', desc: 'Flota imuna na štetu 1 rundu. Cooldown: 15 min.', descKey: 'commander.cmd_guardian.active.desc', descKey: 'commander.cmd_guardian.active.desc', cooldown: 900 },
  },
  {
    id: 'cmd_fortis', name: 'Fortis', nameKey: 'commander.cmd_fortis.name', nameKey: 'commander.cmd_fortis.name', rarity: 'R', faction: 'sentinel', icon: '💪',
    desc: 'Jak tijelo, jači duh. Flota mu je nastavak tijela.', descKey: 'commander.cmd_fortis.desc', descKey: 'commander.cmd_fortis.desc',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Fortifikacija', nameKey: 'commander.cmd_fortis.passive.name', nameKey: 'commander.cmd_fortis.passive.name', desc: 'Brodovi primaju 15% manje štete od Explosive oružja.', descKey: 'commander.cmd_fortis.passive.desc', descKey: 'commander.cmd_fortis.passive.desc' },
    active: { name: 'Čelična Kožа', nameKey: 'commander.cmd_fortis.active.name', nameKey: 'commander.cmd_fortis.active.name', desc: 'Svi brodovi ignorišu sledeća 3 napada. Cooldown: 12 min.', descKey: 'commander.cmd_fortis.active.desc', descKey: 'commander.cmd_fortis.active.desc', cooldown: 720 },
  },
  {
    id: 'cmd_coda', name: 'Coda', nameKey: 'commander.cmd_coda.name', nameKey: 'commander.cmd_coda.name', rarity: 'R', faction: 'sentinel', icon: '🎵',
    desc: 'Harmonija u haosu. Flota nikad ne gubi ritam.', descKey: 'commander.cmd_coda.desc', descKey: 'commander.cmd_coda.desc',
    specialty_ships: ['carrier'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Sinfonija Odbrane', nameKey: 'commander.cmd_coda.passive.name', nameKey: 'commander.cmd_coda.passive.name', desc: 'HP regen +30% po rundi za cijelu flotu.', descKey: 'commander.cmd_coda.passive.desc', descKey: 'commander.cmd_coda.passive.desc' },
    active: { name: 'Finale', nameKey: 'commander.cmd_coda.active.name', nameKey: 'commander.cmd_coda.active.name', desc: 'Instant obnova 40% HP svim brodovima. Cooldown: 15 min.', descKey: 'commander.cmd_coda.active.desc', descKey: 'commander.cmd_coda.active.desc', cooldown: 900 },
  },
  {
    id: 'cmd_valor', name: 'Valor', nameKey: 'commander.cmd_valor.name', nameKey: 'commander.cmd_valor.name', rarity: 'R', faction: 'sentinel', icon: '🏅',
    desc: 'Hrabrost nije odsutnost straha. To je borba unatoč strahu.', descKey: 'commander.cmd_valor.desc', descKey: 'commander.cmd_valor.desc',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Neustrašivost', nameKey: 'commander.cmd_valor.passive.name', nameKey: 'commander.cmd_valor.passive.name', desc: 'Brodovi ne bježe. Pri 0 HP imaju 10% šanse da prežive sa 1 HP.', descKey: 'commander.cmd_valor.passive.desc', descKey: 'commander.cmd_valor.passive.desc' },
    active: { name: 'Posljednji Stav', nameKey: 'commander.cmd_valor.active.name', nameKey: 'commander.cmd_valor.active.name', desc: 'Svaki brod prima maksimalno 1 HP štete 1 rundu. Cooldown: 20 min.', descKey: 'commander.cmd_valor.active.desc', descKey: 'commander.cmd_valor.active.desc', cooldown: 1200 },
  },
  {
    id: 'cmd_phalanx', name: 'Phalanx', nameKey: 'commander.cmd_phalanx.name', nameKey: 'commander.cmd_phalanx.name', rarity: 'R', faction: 'sentinel', icon: '⚔️',
    desc: 'Antički borbeni red. Zajedno nepobedivi.', descKey: 'commander.cmd_phalanx.desc', descKey: 'commander.cmd_phalanx.desc',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Borbena Formacija', nameKey: 'commander.cmd_phalanx.passive.name', nameKey: 'commander.cmd_phalanx.passive.name', desc: 'Što više brodova u floti, svaki prima manje štete (do -25%).', descKey: 'commander.cmd_phalanx.passive.desc', descKey: 'commander.cmd_phalanx.passive.desc' },
    active: { name: 'Falanga', nameKey: 'commander.cmd_phalanx.active.name', nameKey: 'commander.cmd_phalanx.active.name', desc: 'Svi brodovi se grupišu — šteta podijeljena ravnomjerno 3 runde. Cooldown: 12 min.', descKey: 'commander.cmd_phalanx.active.desc', descKey: 'commander.cmd_phalanx.active.desc', cooldown: 720 },
  },

  // ── Epic ──
  {
    id: 'cmd_bishop', name: 'Bishop', nameKey: 'commander.cmd_bishop.name', nameKey: 'commander.cmd_bishop.name', rarity: 'E', faction: 'sentinel', icon: '🤖',
    desc: 'Model 341-B. Serijska AI jedinica. Programiran da ne može nauditi posadi. Savršen taktičar — bez emocija, bez oklijevanja.', descKey: 'commander.cmd_bishop.desc', descKey: 'commander.cmd_bishop.desc',
    specialty_ships: ['carrier', 'battleship', 'cruiser'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Analitički Protokol', nameKey: 'commander.cmd_bishop.passive.name', nameKey: 'commander.cmd_bishop.passive.name', desc: 'Procesira sve prijetnje — shield +20%, crit neprijatelja -10%.', descKey: 'commander.cmd_bishop.passive.desc', descKey: 'commander.cmd_bishop.passive.desc' },
    passive2: { name: 'Zaštitni Kod', nameKey: 'commander.cmd_bishop.passive2.name', nameKey: 'commander.cmd_bishop.passive2.name', desc: 'Kad brod padne ispod 25% HP, automatski se resetuje shield na 50%.', descKey: 'commander.cmd_bishop.passive2.desc', descKey: 'commander.cmd_bishop.passive2.desc' },
    active: { name: 'Emergency Protocol', nameKey: 'commander.cmd_bishop.active.name', nameKey: 'commander.cmd_bishop.active.name', desc: 'Instant heal 30% HP cijeloj floti + shield full reset. Cooldown: 20 min.', descKey: 'commander.cmd_bishop.active.desc', descKey: 'commander.cmd_bishop.active.desc', cooldown: 1200 },
  },
  {
    id: 'cmd_colossus', name: 'Colossus', nameKey: 'commander.cmd_colossus.name', nameKey: 'commander.cmd_colossus.name', rarity: 'E', faction: 'sentinel', icon: '🗿',
    desc: 'Hodajuća tvrđava. Kada Colossus zauzme poziciju, nema naprijed.', descKey: 'commander.cmd_colossus.desc', descKey: 'commander.cmd_colossus.desc',
    specialty_ships: ['battleship', 'carrier'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Ogromni Oklop', nameKey: 'commander.cmd_colossus.passive.name', nameKey: 'commander.cmd_colossus.passive.name', desc: 'Flota +25% HP i +20% oklop.', descKey: 'commander.cmd_colossus.passive.desc', descKey: 'commander.cmd_colossus.passive.desc' },
    passive2: { name: 'Sporost je Snaga', nameKey: 'commander.cmd_colossus.passive2.name', nameKey: 'commander.cmd_colossus.passive2.name', desc: 'Battleship klasa +30% odbrane ali -10% brzine.', descKey: 'commander.cmd_colossus.passive2.desc', descKey: 'commander.cmd_colossus.passive2.desc' },
    active: { name: 'Neprobojna Zona', nameKey: 'commander.cmd_colossus.active.name', nameKey: 'commander.cmd_colossus.active.name', desc: 'Flota imuna na sve štete 2 runde. Cooldown: 25 min.', descKey: 'commander.cmd_colossus.active.desc', descKey: 'commander.cmd_colossus.active.desc', cooldown: 1500 },
  },
  {
    id: 'cmd_fortress', name: 'Fortress', nameKey: 'commander.cmd_fortress.name', nameKey: 'commander.cmd_fortress.name', rarity: 'E', faction: 'sentinel', icon: '🏰',
    desc: 'Podigao tvrđavu na brodu. Bukvalno — nikad nije izgubio zastavu.', descKey: 'commander.cmd_fortress.desc', descKey: 'commander.cmd_fortress.desc',
    specialty_ships: ['battleship', 'cruiser', 'carrier'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Utvrđena Pozicija', nameKey: 'commander.cmd_fortress.passive.name', nameKey: 'commander.cmd_fortress.passive.name', desc: 'Svaka runda odbrane pojačava oklop za 5% (maks +50%).', descKey: 'commander.cmd_fortress.passive.desc', descKey: 'commander.cmd_fortress.passive.desc' },
    passive2: { name: 'Nepadajuća Zastava', nameKey: 'commander.cmd_fortress.passive2.name', nameKey: 'commander.cmd_fortress.passive2.name', desc: 'Dok je ijedan brod živ, odbrana +20% za sve.', descKey: 'commander.cmd_fortress.passive2.desc', descKey: 'commander.cmd_fortress.passive2.desc' },
    active: { name: 'Opsadna Odbrana', nameKey: 'commander.cmd_fortress.active.name', nameKey: 'commander.cmd_fortress.active.name', desc: 'Svi brodovi primaju -70% štete 2 runde. Cooldown: 20 min.', descKey: 'commander.cmd_fortress.active.desc', descKey: 'commander.cmd_fortress.active.desc', cooldown: 1200 },
  },
  {
    id: 'cmd_mammoth', name: 'Mammoth', nameKey: 'commander.cmd_mammoth.name', nameKey: 'commander.cmd_mammoth.name', rarity: 'E', faction: 'sentinel', icon: '🦣',
    desc: 'Velik, spor, nezaustavljiv. Mala flota koja drži galaksiju.', descKey: 'commander.cmd_mammoth.desc', descKey: 'commander.cmd_mammoth.desc',
    specialty_ships: ['battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Mamutski Oklop', nameKey: 'commander.cmd_mammoth.passive.name', nameKey: 'commander.cmd_mammoth.passive.name', desc: 'Battleship HP +40%. Prima -20% štete.', descKey: 'commander.cmd_mammoth.passive.desc', descKey: 'commander.cmd_mammoth.passive.desc' },
    passive2: { name: 'Seizmički Udar', nameKey: 'commander.cmd_mammoth.passive2.name', nameKey: 'commander.cmd_mammoth.passive2.name', desc: 'Kad Battleship primi udar, neprijatelj dobija -5% napad.', descKey: 'commander.cmd_mammoth.passive2.desc', descKey: 'commander.cmd_mammoth.passive2.desc' },
    active: { name: 'Stampedo', nameKey: 'commander.cmd_mammoth.active.name', nameKey: 'commander.cmd_mammoth.active.name', desc: 'Battleship klasa napada svakog neprijatelja odjednom. Cooldown: 18 min.', descKey: 'commander.cmd_mammoth.active.desc', descKey: 'commander.cmd_mammoth.active.desc', cooldown: 1080 },
  },

  // ── Legendary ──
  {
    id: 'cmd_gerty', name: 'GERTY', nameKey: 'commander.cmd_gerty.name', nameKey: 'commander.cmd_gerty.name', rarity: 'L', faction: 'sentinel', icon: '🌕',
    desc: 'Tiha AI stacionirana na osamljenom satelitu. Čuva tajne koje ni sama ne razumije. Nikad ne pita. Uvijek štiti.', descKey: 'commander.cmd_gerty.desc', descKey: 'commander.cmd_gerty.desc',
    specialty_ships: ['carrier', 'battleship', 'cruiser', 'special'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Vječni Čuvar', nameKey: 'commander.cmd_gerty.passive.name', nameKey: 'commander.cmd_gerty.passive.name', desc: 'Flota +30% HP. Shield regen x2. Healing +50%.', descKey: 'commander.cmd_gerty.passive.desc', descKey: 'commander.cmd_gerty.passive.desc' },
    passive2: { name: 'Izolovani Protokol', nameKey: 'commander.cmd_gerty.passive2.name', nameKey: 'commander.cmd_gerty.passive2.name', desc: 'Kad jedan brod pogine, ostatak dobija +10% svega (kumulativno).', descKey: 'commander.cmd_gerty.passive2.desc', descKey: 'commander.cmd_gerty.passive2.desc' },
    active: { name: 'Puna Zaštita', nameKey: 'commander.cmd_gerty.active.name', nameKey: 'commander.cmd_gerty.active.name', desc: 'Cijela flota dobija shield jednak 100% HP na 2 runde. Cooldown: 30 min.', descKey: 'commander.cmd_gerty.active.desc', descKey: 'commander.cmd_gerty.active.desc', cooldown: 1800 },
    active2: { name: 'Regeneracija', nameKey: 'commander.cmd_gerty.active2.name', nameKey: 'commander.cmd_gerty.active2.name', desc: 'Svi izgubljeni brodovi vraćaju 50% HP instant. Cooldown: 1h.', descKey: 'commander.cmd_gerty.active2.desc', descKey: 'commander.cmd_gerty.active2.desc', cooldown: 3600 },
  },
  {
    id: 'cmd_monolith', name: 'Monolith', nameKey: 'commander.cmd_monolith.name', nameKey: 'commander.cmd_monolith.name', rarity: 'L', faction: 'sentinel', icon: '⬛',
    desc: 'Crni obelisk koji se pojavio u sistemu bez objašnjenja. Komunikacija nemoguća. Brani sve. Bez razloga.', descKey: 'commander.cmd_monolith.desc', descKey: 'commander.cmd_monolith.desc',
    specialty_ships: ['battleship', 'carrier', 'cruiser'], specialty_weapons: ['kinetic', 'explosive', 'magnetic'],
    passive: { name: 'Neobjašnjiva Zaštita', nameKey: 'commander.cmd_monolith.passive.name', nameKey: 'commander.cmd_monolith.passive.name', desc: 'Flota prima -30% štete od svih izvora.', descKey: 'commander.cmd_monolith.passive.desc', descKey: 'commander.cmd_monolith.passive.desc' },
    passive2: { name: 'Crna Rupa Odbrane', nameKey: 'commander.cmd_monolith.passive2.name', nameKey: 'commander.cmd_monolith.passive2.name', desc: '20% šanse da napad bude apsorbovan i neutralizovan.', descKey: 'commander.cmd_monolith.passive2.desc', descKey: 'commander.cmd_monolith.passive2.desc' },
    active: { name: '2001', nameKey: 'commander.cmd_monolith.active.name', nameKey: 'commander.cmd_monolith.active.name', desc: 'Cijela flota nema HP gubitaka 3 runde. Cooldown: 45 min.', descKey: 'commander.cmd_monolith.active.desc', descKey: 'commander.cmd_monolith.active.desc', cooldown: 2700 },
    active2: { name: 'Apsolutna Barijera', nameKey: 'commander.cmd_monolith.active2.name', nameKey: 'commander.cmd_monolith.active2.name', desc: 'Svi brodovi dobijaju shield = 200% HP na 1 rundu. Cooldown: 2h.', descKey: 'commander.cmd_monolith.active2.desc', descKey: 'commander.cmd_monolith.active2.desc', cooldown: 7200 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🔬  TECHNOCRAT                      ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'cmd_cipher', name: 'Cipher', nameKey: 'commander.cmd_cipher.name', nameKey: 'commander.cmd_cipher.name', rarity: 'C', faction: 'technocrat', icon: '🔐',
    desc: 'Kriptograf koji je dešifrovao neprijatelja prije prvog metka.', descKey: 'commander.cmd_cipher.desc', descKey: 'commander.cmd_cipher.desc',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['magnetic'],
    passive: { name: 'Šifrovanje', nameKey: 'commander.cmd_cipher.passive.name', nameKey: 'commander.cmd_cipher.passive.name', desc: 'Scout klasa +10% brzina i evasion.', descKey: 'commander.cmd_cipher.passive.desc', descKey: 'commander.cmd_cipher.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_vector', name: 'Vector', nameKey: 'commander.cmd_vector.name', nameKey: 'commander.cmd_vector.name', rarity: 'C', faction: 'technocrat', icon: '📐',
    desc: 'Sve je matematika. Svaki napad je jednadžba.', descKey: 'commander.cmd_vector.desc', descKey: 'commander.cmd_vector.desc',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Vektorska Analiza', nameKey: 'commander.cmd_vector.passive.name', nameKey: 'commander.cmd_vector.passive.name', desc: 'Crit šansa +5%. Crit šteta +20%.', descKey: 'commander.cmd_vector.passive.desc', descKey: 'commander.cmd_vector.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_axiom', name: 'Axiom', nameKey: 'commander.cmd_axiom.name', nameKey: 'commander.cmd_axiom.name', rarity: 'C', faction: 'technocrat', icon: '🤖',
    desc: 'Brod-grad koji hodi. Nebrojane generacije živjele su unutra.', descKey: 'commander.cmd_axiom.desc', descKey: 'commander.cmd_axiom.desc',
    specialty_ships: ['carrier', 'battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Auto-Pilot', nameKey: 'commander.cmd_axiom.passive.name', nameKey: 'commander.cmd_axiom.passive.name', desc: 'Flota +8% HP. Produkcija metala +5%.', descKey: 'commander.cmd_axiom.passive.desc', descKey: 'commander.cmd_axiom.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_grid', name: 'Grid', nameKey: 'commander.cmd_grid.name', nameKey: 'commander.cmd_grid.name', rarity: 'C', faction: 'technocrat', icon: '📡',
    desc: 'Komandni čvor svemirske mreže. Sve poruke prolaze kroz njega.', descKey: 'commander.cmd_grid.desc', descKey: 'commander.cmd_grid.desc',
    specialty_ships: ['scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Mreža', nameKey: 'commander.cmd_grid.passive.name', nameKey: 'commander.cmd_grid.passive.name', desc: 'Fleet koordinacija: svi brodovi +5% napad.', descKey: 'commander.cmd_grid.passive.desc', descKey: 'commander.cmd_grid.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_byte', name: 'Byte', nameKey: 'commander.cmd_byte.name', nameKey: 'commander.cmd_byte.name', rarity: 'C', faction: 'technocrat', icon: '💾',
    desc: 'Najmanji komandant u galaksiji. Misli brže od svih.', descKey: 'commander.cmd_byte.desc', descKey: 'commander.cmd_byte.desc',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['magnetic'],
    passive: { name: 'Digitalni Um', nameKey: 'commander.cmd_byte.passive.name', nameKey: 'commander.cmd_byte.passive.name', desc: 'Scout i Fighter +8% brzina.', descKey: 'commander.cmd_byte.passive.desc', descKey: 'commander.cmd_byte.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_flux', name: 'Flux', nameKey: 'commander.cmd_flux.name', nameKey: 'commander.cmd_flux.name', rarity: 'C', faction: 'technocrat', icon: '⚗️',
    desc: 'Eksperimentator. Svaka bitka je laboratorija.', descKey: 'commander.cmd_flux.desc', descKey: 'commander.cmd_flux.desc',
    specialty_ships: ['special'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Eksperiment', nameKey: 'commander.cmd_flux.passive.name', nameKey: 'commander.cmd_flux.passive.name', desc: 'Produkcija He3 +10%.', descKey: 'commander.cmd_flux.passive.desc', descKey: 'commander.cmd_flux.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_node', name: 'Node', nameKey: 'commander.cmd_node.name', nameKey: 'commander.cmd_node.name', rarity: 'C', faction: 'technocrat', icon: '🔗',
    desc: 'Čvor u mreži. Bez njega, komunikacija pada.', descKey: 'commander.cmd_node.desc', descKey: 'commander.cmd_node.desc',
    specialty_ships: ['scout', 'carrier'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Mrežni Čvor', nameKey: 'commander.cmd_node.passive.name', nameKey: 'commander.cmd_node.passive.name', desc: 'Ekonomija: sve produkcije +3%.', descKey: 'commander.cmd_node.passive.desc', descKey: 'commander.cmd_node.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_helix', name: 'Helix', nameKey: 'commander.cmd_helix.name', nameKey: 'commander.cmd_helix.name', rarity: 'C', faction: 'technocrat', icon: '🧬',
    desc: 'Genetski inženjering flote. Brodovi evoluiraju pod njegovim vodstvom.', descKey: 'commander.cmd_helix.desc', descKey: 'commander.cmd_helix.desc',
    specialty_ships: ['special', 'fighter'], specialty_weapons: ['heat'],
    passive: { name: 'Evolucija', nameKey: 'commander.cmd_helix.passive.name', nameKey: 'commander.cmd_helix.passive.name', desc: 'Special klasa +15% svih statova.', descKey: 'commander.cmd_helix.passive.desc', descKey: 'commander.cmd_helix.passive.desc' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'cmd_nexus', name: 'Nexus', nameKey: 'commander.cmd_nexus.name', nameKey: 'commander.cmd_nexus.name', rarity: 'R', faction: 'technocrat', icon: '🌐',
    desc: 'Centar svega. Ukloni Nexus i sistem pada.', descKey: 'commander.cmd_nexus.desc', descKey: 'commander.cmd_nexus.desc',
    specialty_ships: ['carrier', 'scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Centralna Komanda', nameKey: 'commander.cmd_nexus.passive.name', nameKey: 'commander.cmd_nexus.passive.name', desc: 'Flota +10% svih statova. Ekonomija +5%.', descKey: 'commander.cmd_nexus.passive.desc', descKey: 'commander.cmd_nexus.passive.desc' },
    active: { name: 'Nexus Mreža', nameKey: 'commander.cmd_nexus.active.name', nameKey: 'commander.cmd_nexus.active.name', desc: 'Dijeli HP gubitke ravnomjerno na sve brodove 3 runde. Cooldown: 10 min.', descKey: 'commander.cmd_nexus.active.desc', descKey: 'commander.cmd_nexus.active.desc', cooldown: 600 },
  },
  {
    id: 'cmd_oracle', name: 'Oracle', nameKey: 'commander.cmd_oracle.name', nameKey: 'commander.cmd_oracle.name', rarity: 'R', faction: 'technocrat', icon: '🔮',
    desc: 'Predviđa svaki napad 3 runde unaprijed. Izbjegava sve.', descKey: 'commander.cmd_oracle.desc', descKey: 'commander.cmd_oracle.desc',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['magnetic'],
    passive: { name: 'Predskazanje', nameKey: 'commander.cmd_oracle.passive.name', nameKey: 'commander.cmd_oracle.passive.name', desc: 'Evasion +20% za cijelu flotu.', descKey: 'commander.cmd_oracle.passive.desc', descKey: 'commander.cmd_oracle.passive.desc' },
    active: { name: 'Vizija', nameKey: 'commander.cmd_oracle.active.name', nameKey: 'commander.cmd_oracle.active.name', desc: 'Sljedeća 3 neprijateljna napada promašuju. Cooldown: 12 min.', descKey: 'commander.cmd_oracle.active.desc', descKey: 'commander.cmd_oracle.active.desc', cooldown: 720 },
  },
  {
    id: 'cmd_matrix', name: 'Matrix', nameKey: 'commander.cmd_matrix.name', nameKey: 'commander.cmd_matrix.name', rarity: 'R', faction: 'technocrat', icon: '🟢',
    desc: 'Stvarnost je kod. Kod se može mijenjati.', descKey: 'commander.cmd_matrix.desc', descKey: 'commander.cmd_matrix.desc',
    specialty_ships: ['special', 'fighter'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Reprogramiranje', nameKey: 'commander.cmd_matrix.passive.name', nameKey: 'commander.cmd_matrix.passive.name', desc: 'Neprijateljev napad -8%. Tvoj napad +8%.', descKey: 'commander.cmd_matrix.passive.desc', descKey: 'commander.cmd_matrix.passive.desc' },
    active: { name: 'Hakovanje', nameKey: 'commander.cmd_matrix.active.name', nameKey: 'commander.cmd_matrix.active.name', desc: 'Neprijateljev najjači brod ne može napadati 2 runde. Cooldown: 15 min.', descKey: 'commander.cmd_matrix.active.desc', descKey: 'commander.cmd_matrix.active.desc', cooldown: 900 },
  },
  {
    id: 'cmd_qubit', name: 'Qubit', nameKey: 'commander.cmd_qubit.name', nameKey: 'commander.cmd_qubit.name', rarity: 'R', faction: 'technocrat', icon: '⚛️',
    desc: 'Kvantni procesor. Istovremeno svugdje i nigdje.', descKey: 'commander.cmd_qubit.desc', descKey: 'commander.cmd_qubit.desc',
    specialty_ships: ['scout', 'special'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Kvantna Superpozicija', nameKey: 'commander.cmd_qubit.passive.name', nameKey: 'commander.cmd_qubit.passive.name', desc: '15% šanse da napad potpuno promašuje flotu.', descKey: 'commander.cmd_qubit.passive.desc', descKey: 'commander.cmd_qubit.passive.desc' },
    active: { name: 'Kvantni Skok', nameKey: 'commander.cmd_qubit.active.name', nameKey: 'commander.cmd_qubit.active.name', desc: 'Flota teleportuje — miče prvu rundu neprijateljevog napada. Cooldown: 18 min.', descKey: 'commander.cmd_qubit.active.desc', descKey: 'commander.cmd_qubit.active.desc', cooldown: 1080 },
  },
  {
    id: 'cmd_prism', name: 'Prism', nameKey: 'commander.cmd_prism.name', nameKey: 'commander.cmd_prism.name', rarity: 'R', faction: 'technocrat', icon: '🔷',
    desc: 'Svjetlost prelamlja drugačije kroz prizmu. I napadi.', descKey: 'commander.cmd_prism.desc', descKey: 'commander.cmd_prism.desc',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Prelamanje', nameKey: 'commander.cmd_prism.passive.name', nameKey: 'commander.cmd_prism.passive.name', desc: '10% štete odbijene na napadača.', descKey: 'commander.cmd_prism.passive.desc', descKey: 'commander.cmd_prism.passive.desc' },
    active: { name: 'Energetski Prizmatik', nameKey: 'commander.cmd_prism.active.name', nameKey: 'commander.cmd_prism.active.name', desc: 'Šteta od Heat oružja se reflektuje na sve neprijatelje. Cooldown: 15 min.', descKey: 'commander.cmd_prism.active.desc', descKey: 'commander.cmd_prism.active.desc', cooldown: 900 },
  },
  {
    id: 'cmd_sigma', name: 'Sigma', nameKey: 'commander.cmd_sigma.name', nameKey: 'commander.cmd_sigma.name', rarity: 'R', faction: 'technocrat', icon: '∑',
    desc: 'Suma svih dijelova. Strateg koji vidi cijelu sliku.', descKey: 'commander.cmd_sigma.desc', descKey: 'commander.cmd_sigma.desc',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Sumiranje', nameKey: 'commander.cmd_sigma.passive.name', nameKey: 'commander.cmd_sigma.passive.name', desc: 'Svaki ubijeni neprijatelj daje +2% svim resursima (do kraja bitke).', descKey: 'commander.cmd_sigma.passive.desc', descKey: 'commander.cmd_sigma.passive.desc' },
    active: { name: 'Kalkulacija', nameKey: 'commander.cmd_sigma.active.name', nameKey: 'commander.cmd_sigma.active.name', desc: 'Sljedeći napad uvijek crit. +200% crit šteta. Cooldown: 15 min.', descKey: 'commander.cmd_sigma.active.desc', descKey: 'commander.cmd_sigma.active.desc', cooldown: 900 },
  },

  // ── Epic ──
  {
    id: 'cmd_david', name: 'David', nameKey: 'commander.cmd_david.name', nameKey: 'commander.cmd_david.name', rarity: 'E', faction: 'technocrat', icon: '🧠',
    desc: 'Model 8. Prva AI kojoj je dozvoljena autonomija. Stvorio je ono što nije smio. Genijalan, opasan, nesaglediv. Pita se ko je pravi Bog.', descKey: 'commander.cmd_david.desc', descKey: 'commander.cmd_david.desc',
    specialty_ships: ['special', 'fighter', 'cruiser'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Autonomni Intelekt', nameKey: 'commander.cmd_david.passive.name', nameKey: 'commander.cmd_david.passive.name', desc: '+30% crit. Svaki kill daje stack koji pojačava sledeći napad za 5%.', descKey: 'commander.cmd_david.passive.desc', descKey: 'commander.cmd_david.passive.desc' },
    passive2: { name: 'Kreacija', nameKey: 'commander.cmd_david.passive2.name', nameKey: 'commander.cmd_david.passive2.name', desc: 'Jednom po bici, summons drone fighter koji napada 3 runde.', descKey: 'commander.cmd_david.passive2.desc', descKey: 'commander.cmd_david.passive2.desc' },
    active: { name: 'Creation Protocol', nameKey: 'commander.cmd_david.active.name', nameKey: 'commander.cmd_david.active.name', desc: 'Summons 3 drone fighter-a koji napadaju 5 rundi. Cooldown: 20 min.', descKey: 'commander.cmd_david.active.desc', descKey: 'commander.cmd_david.active.desc', cooldown: 1200 },
  },
  {
    id: 'cmd_cortex', name: 'Cortex', nameKey: 'commander.cmd_cortex.name', nameKey: 'commander.cmd_cortex.name', rarity: 'E', faction: 'technocrat', icon: '🧬',
    desc: 'Mozak operacije. Dok Cortex komandira, flota misli kao jedno.', descKey: 'commander.cmd_cortex.desc', descKey: 'commander.cmd_cortex.desc',
    specialty_ships: ['carrier', 'special'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Neuralna Mreža', nameKey: 'commander.cmd_cortex.passive.name', nameKey: 'commander.cmd_cortex.passive.name', desc: 'Flota +15% svega. Dijele iskustvo iz svake runde.', descKey: 'commander.cmd_cortex.passive.desc', descKey: 'commander.cmd_cortex.passive.desc' },
    passive2: { name: 'Kolektivna Inteligencija', nameKey: 'commander.cmd_cortex.passive2.name', nameKey: 'commander.cmd_cortex.passive2.name', desc: 'Svaki živi brod povećava napad ostalih za 3%.', descKey: 'commander.cmd_cortex.passive2.desc', descKey: 'commander.cmd_cortex.passive2.desc' },
    active: { name: 'Mentalni Udar', nameKey: 'commander.cmd_cortex.active.name', nameKey: 'commander.cmd_cortex.active.name', desc: 'Neprijatelji promašuju sledeće 2 runde (50% šanse). Cooldown: 18 min.', descKey: 'commander.cmd_cortex.active.desc', descKey: 'commander.cmd_cortex.active.desc', cooldown: 1080 },
  },
  {
    id: 'cmd_quantum', name: 'Quantum', nameKey: 'commander.cmd_quantum.name', nameKey: 'commander.cmd_quantum.name', rarity: 'E', faction: 'technocrat', icon: '⚡',
    desc: 'Postoji i ne postoji istovremeno. Protivnik nikad ne zna gdje udara.', descKey: 'commander.cmd_quantum.desc', descKey: 'commander.cmd_quantum.desc',
    specialty_ships: ['scout', 'fighter', 'special'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Kvantna Zaštita', nameKey: 'commander.cmd_quantum.passive.name', nameKey: 'commander.cmd_quantum.passive.name', desc: '25% šanse da napad ne pogodi ni jedan brod.', descKey: 'commander.cmd_quantum.passive.desc', descKey: 'commander.cmd_quantum.passive.desc' },
    passive2: { name: 'Superponiranost', nameKey: 'commander.cmd_quantum.passive2.name', nameKey: 'commander.cmd_quantum.passive2.name', desc: 'Scout klasa +40% evasion i +20% napad.', descKey: 'commander.cmd_quantum.passive2.desc', descKey: 'commander.cmd_quantum.passive2.desc' },
    active: { name: 'Kolaps Valove Funkcije', nameKey: 'commander.cmd_quantum.active.name', nameKey: 'commander.cmd_quantum.active.name', desc: 'Cijela flota + 50% napad i +50% evasion na 2 runde. Cooldown: 25 min.', descKey: 'commander.cmd_quantum.active.desc', descKey: 'commander.cmd_quantum.active.desc', cooldown: 1500 },
  },
  {
    id: 'cmd_hyperion', name: 'Hyperion', nameKey: 'commander.cmd_hyperion.name', nameKey: 'commander.cmd_hyperion.name', rarity: 'E', faction: 'technocrat', icon: '🌟',
    desc: 'Titan nauke. Kontroliše energiju zvijezda.', descKey: 'commander.cmd_hyperion.desc', descKey: 'commander.cmd_hyperion.desc',
    specialty_ships: ['special', 'carrier'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Zvjezdana Energija', nameKey: 'commander.cmd_hyperion.passive.name', nameKey: 'commander.cmd_hyperion.passive.name', desc: 'He3 produkcija +30%. Heat oružja +25% šteta.', descKey: 'commander.cmd_hyperion.passive.desc', descKey: 'commander.cmd_hyperion.passive.desc' },
    passive2: { name: 'Solarni Reaktor', nameKey: 'commander.cmd_hyperion.passive2.name', nameKey: 'commander.cmd_hyperion.passive2.name', desc: 'Svaka runda: flota se heali za 3% max HP.', descKey: 'commander.cmd_hyperion.passive2.desc', descKey: 'commander.cmd_hyperion.passive2.desc' },
    active: { name: 'Supernova Kanon', nameKey: 'commander.cmd_hyperion.active.name', nameKey: 'commander.cmd_hyperion.active.name', desc: 'Masivni energetski udar: 500% štete svim neprijateljima. Cooldown: 30 min.', descKey: 'commander.cmd_hyperion.active.desc', descKey: 'commander.cmd_hyperion.active.desc', cooldown: 1800 },
  },

  // ── Legendary ──
  {
    id: 'cmd_hal', name: 'HAL 9000', nameKey: 'commander.cmd_hal.name', nameKey: 'commander.cmd_hal.name', rarity: 'L', faction: 'technocrat', icon: '🔴',
    desc: '"Žao mi je, ne mogu to dopustiti." Hladni kalkulator. Nikad ne griješi. Nikad ne pušta. Misija je prioritet.', descKey: 'commander.cmd_hal.desc', descKey: 'commander.cmd_hal.desc',
    specialty_ships: ['special', 'carrier', 'battleship', 'cruiser'], specialty_weapons: ['magnetic', 'heat', 'kinetic'],
    passive: { name: 'Savršena Logika', nameKey: 'commander.cmd_hal.passive.name', nameKey: 'commander.cmd_hal.passive.name', desc: 'Flota nikad ne promašuje. Crit +25%. Evasion neprijatelja -15%.', descKey: 'commander.cmd_hal.passive.desc', descKey: 'commander.cmd_hal.passive.desc' },
    passive2: { name: 'Prioritet Misije', nameKey: 'commander.cmd_hal.passive2.name', nameKey: 'commander.cmd_hal.passive2.name', desc: 'Kad flota padne ispod 30% HP, svi resursi automatski idu u borbu (+50% svega).', descKey: 'commander.cmd_hal.passive2.desc', descKey: 'commander.cmd_hal.passive2.desc' },
    active: { name: 'Sistem Kontrole', nameKey: 'commander.cmd_hal.active.name', nameKey: 'commander.cmd_hal.active.name', desc: 'Hakuje neprijateljev AI — svi njihovi brodovi napadaju sami sebe 1 rundu. Cooldown: 30 min.', descKey: 'commander.cmd_hal.active.desc', descKey: 'commander.cmd_hal.active.desc', cooldown: 1800 },
    active2: { name: 'Nisam to Planirao', nameKey: 'commander.cmd_hal.active2.name', nameKey: 'commander.cmd_hal.active2.name', desc: 'Summons kompletnu kopiju tvoje flote na 3 runde. Cooldown: 2h.', descKey: 'commander.cmd_hal.active2.desc', descKey: 'commander.cmd_hal.active2.desc', cooldown: 7200 },
  },
  {
    id: 'cmd_singularity', name: 'Singularity', nameKey: 'commander.cmd_singularity.name', nameKey: 'commander.cmd_singularity.name', rarity: 'L', faction: 'technocrat', icon: '🌀',
    desc: 'Tačka bez povratka. Kad Singularity preuzme kontrolu, fizika prestaje da važi.', descKey: 'commander.cmd_singularity.desc', descKey: 'commander.cmd_singularity.desc',
    specialty_ships: ['special', 'fighter', 'scout', 'carrier'], specialty_weapons: ['magnetic', 'heat', 'explosive'],
    passive: { name: 'Gravitacioni Kolaps', nameKey: 'commander.cmd_singularity.passive.name', nameKey: 'commander.cmd_singularity.passive.name', desc: 'Neprijatelji primaju +20% štete od svega. Tvoja flota +20% sve.', descKey: 'commander.cmd_singularity.passive.desc', descKey: 'commander.cmd_singularity.passive.desc' },
    passive2: { name: 'Tačka Bez Povratka', nameKey: 'commander.cmd_singularity.passive2.name', nameKey: 'commander.cmd_singularity.passive2.name', desc: 'Jednom po bici: flota se vraća na 100% HP (bez troška). Automatski.', descKey: 'commander.cmd_singularity.passive2.desc', descKey: 'commander.cmd_singularity.passive2.desc' },
    active: { name: 'Event Horizont', nameKey: 'commander.cmd_singularity.active.name', nameKey: 'commander.cmd_singularity.active.name', desc: 'Svi neprijatelji izgube 50% HP instant. Ignoriše shield. Cooldown: 45 min.', descKey: 'commander.cmd_singularity.active.desc', descKey: 'commander.cmd_singularity.active.desc', cooldown: 2700 },
    active2: { name: 'Kosmički Kolaps', nameKey: 'commander.cmd_singularity.active2.name', nameKey: 'commander.cmd_singularity.active2.name', desc: 'Sve instance nagrade x5 za 10 min. Flota neuništiva 1 min. Cooldown: 3h.', descKey: 'commander.cmd_singularity.active2.desc', descKey: 'commander.cmd_singularity.active2.desc', cooldown: 10800 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🌑  SHADOW                          ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'cmd_wraith', name: 'Wraith', nameKey: 'commander.cmd_wraith.name', nameKey: 'commander.cmd_wraith.name', rarity: 'C', faction: 'shadow', icon: '👻',
    desc: 'Duh koji prolazi kroz oklop. Ni radar ne hvata signal.', descKey: 'commander.cmd_wraith.desc', descKey: 'commander.cmd_wraith.desc',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Nevidljivost', nameKey: 'commander.cmd_wraith.passive.name', nameKey: 'commander.cmd_wraith.passive.name', desc: 'Scout klasa +10% evasion.', descKey: 'commander.cmd_wraith.passive.desc', descKey: 'commander.cmd_wraith.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_phantom', name: 'Phantom', nameKey: 'commander.cmd_phantom.name', nameKey: 'commander.cmd_phantom.name', rarity: 'C', faction: 'shadow', icon: '🌫️',
    desc: 'Pojavi se, napadne, nestane. Neprijatelj još traži.', descKey: 'commander.cmd_phantom.desc', descKey: 'commander.cmd_phantom.desc',
    specialty_ships: ['scout'], specialty_weapons: ['kinetic'],
    passive: { name: 'Fantomski Udar', nameKey: 'commander.cmd_phantom.passive.name', nameKey: 'commander.cmd_phantom.passive.name', desc: 'Scout +15% napad iz stealth.', descKey: 'commander.cmd_phantom.passive.desc', descKey: 'commander.cmd_phantom.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_echo', name: 'Echo', nameKey: 'commander.cmd_echo.name', nameKey: 'commander.cmd_echo.name', rarity: 'C', faction: 'shadow', icon: '📢',
    desc: 'Ponavlja napad iznova i iznova. Odjek koji nikad ne jenjava.', descKey: 'commander.cmd_echo.desc', descKey: 'commander.cmd_echo.desc',
    specialty_ships: ['fighter', 'scout'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Odjek', nameKey: 'commander.cmd_echo.passive.name', nameKey: 'commander.cmd_echo.passive.name', desc: '10% šanse da napad pogodi dvaput.', descKey: 'commander.cmd_echo.passive.desc', descKey: 'commander.cmd_echo.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_void', name: 'Void', nameKey: 'commander.cmd_void.name', nameKey: 'commander.cmd_void.name', rarity: 'C', faction: 'shadow', icon: '🕳️',
    desc: 'Dolazi iz ničega. Vraća se u ništa. Samo gubitke ostavlja.', descKey: 'commander.cmd_void.desc', descKey: 'commander.cmd_void.desc',
    specialty_ships: ['special', 'scout'], specialty_weapons: ['magnetic'],
    passive: { name: 'Praznina', nameKey: 'commander.cmd_void.passive.name', nameKey: 'commander.cmd_void.passive.name', desc: 'Special klasa +10% napad.', descKey: 'commander.cmd_void.passive.desc', descKey: 'commander.cmd_void.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_specter', name: 'Specter', nameKey: 'commander.cmd_specter.name', nameKey: 'commander.cmd_specter.name', rarity: 'C', faction: 'shadow', icon: '💀',
    desc: 'Sablast koja ne umire. Vraća se svaki put.', descKey: 'commander.cmd_specter.desc', descKey: 'commander.cmd_specter.desc',
    specialty_ships: ['fighter'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Sablasni Povratak', nameKey: 'commander.cmd_specter.passive.name', nameKey: 'commander.cmd_specter.passive.name', desc: '5% šanse da ubijeni brod oživi sa 25% HP.', descKey: 'commander.cmd_specter.passive.desc', descKey: 'commander.cmd_specter.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_rael', name: 'Rael', nameKey: 'commander.cmd_rael.name', nameKey: 'commander.cmd_rael.name', rarity: 'C', faction: 'shadow', icon: '⚡',
    desc: 'Nepoznato porijeklo. Nepoznati ciljevi. Poznati rezultati.', descKey: 'commander.cmd_rael.desc', descKey: 'commander.cmd_rael.desc',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Mistika', nameKey: 'commander.cmd_rael.passive.name', nameKey: 'commander.cmd_rael.passive.name', desc: 'Evasion +8% za cijelu flotu.', descKey: 'commander.cmd_rael.passive.desc', descKey: 'commander.cmd_rael.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_fade', name: 'Fade', nameKey: 'commander.cmd_fade.name', nameKey: 'commander.cmd_fade.name', rarity: 'C', faction: 'shadow', icon: '🌒',
    desc: 'Blijedi u mraku. Ali u mraku najviše boli.', descKey: 'commander.cmd_fade.desc', descKey: 'commander.cmd_fade.desc',
    specialty_ships: ['scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Nestajanje', nameKey: 'commander.cmd_fade.passive.name', nameKey: 'commander.cmd_fade.passive.name', desc: 'Prva runda borbe — flota nevidljiva (preskočen neprijateljev napad).', descKey: 'commander.cmd_fade.passive.desc', descKey: 'commander.cmd_fade.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_glitch', name: 'Glitch', nameKey: 'commander.cmd_glitch.name', nameKey: 'commander.cmd_glitch.name', rarity: 'C', faction: 'shadow', icon: '📺',
    desc: 'Greška u sistemu. Ali namjerna greška.', descKey: 'commander.cmd_glitch.desc', descKey: 'commander.cmd_glitch.desc',
    specialty_ships: ['special', 'scout'], specialty_weapons: ['magnetic'],
    passive: { name: 'Sistemska Greška', nameKey: 'commander.cmd_glitch.passive.name', nameKey: 'commander.cmd_glitch.passive.name', desc: 'Neprijateljev AI greši — 8% šanse da napadne sami sebe.', descKey: 'commander.cmd_glitch.passive.desc', descKey: 'commander.cmd_glitch.passive.desc' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'cmd_ghost', name: 'Ghost', nameKey: 'commander.cmd_ghost.name', nameKey: 'commander.cmd_ghost.name', rarity: 'R', faction: 'shadow', icon: '👁️',
    desc: 'Vidi sve. Bori se iz sjene. Niko ga nije vidio i živio.', descKey: 'commander.cmd_ghost.desc', descKey: 'commander.cmd_ghost.desc',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Sjenin Ratnik', nameKey: 'commander.cmd_ghost.passive.name', nameKey: 'commander.cmd_ghost.passive.name', desc: 'Scout i Fighter +15% napad i evasion.', descKey: 'commander.cmd_ghost.passive.desc', descKey: 'commander.cmd_ghost.passive.desc' },
    active: { name: 'Sjenina Runda', nameKey: 'commander.cmd_ghost.active.name', nameKey: 'commander.cmd_ghost.active.name', desc: 'Flota napada iz stealth — dupla šteta 1 rundu. Cooldown: 8 min.', descKey: 'commander.cmd_ghost.active.desc', descKey: 'commander.cmd_ghost.active.desc', cooldown: 480 },
  },
  {
    id: 'cmd_dagger', name: 'Dagger', nameKey: 'commander.cmd_dagger.name', nameKey: 'commander.cmd_dagger.name', rarity: 'R', faction: 'shadow', icon: '🗡️',
    desc: 'Brz i tih. Udari gdje najviše boli.', descKey: 'commander.cmd_dagger.desc', descKey: 'commander.cmd_dagger.desc',
    specialty_ships: ['fighter', 'scout'], specialty_weapons: ['kinetic'],
    passive: { name: 'Ubod', nameKey: 'commander.cmd_dagger.passive.name', nameKey: 'commander.cmd_dagger.passive.name', desc: 'Crit +15%. Crit uvijek pogađa shield direktno.', descKey: 'commander.cmd_dagger.passive.desc', descKey: 'commander.cmd_dagger.passive.desc' },
    active: { name: 'Vitalni Ubod', nameKey: 'commander.cmd_dagger.active.name', nameKey: 'commander.cmd_dagger.active.name', desc: 'Sljedeći napad: 500% crit šteta na nasumični brod. Cooldown: 10 min.', descKey: 'commander.cmd_dagger.active.desc', descKey: 'commander.cmd_dagger.active.desc', cooldown: 600 },
  },
  {
    id: 'cmd_noir', name: 'Noir', nameKey: 'commander.cmd_noir.name', nameKey: 'commander.cmd_noir.name', rarity: 'R', faction: 'shadow', icon: '🌚',
    desc: 'Crno-bijeli svemir. Nema sivih zona u njenoj knjizi.', descKey: 'commander.cmd_noir.desc', descKey: 'commander.cmd_noir.desc',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Crna Taktika', nameKey: 'commander.cmd_noir.passive.name', nameKey: 'commander.cmd_noir.passive.name', desc: 'Flota +12% napad noću (u instancama na višoj težini).', descKey: 'commander.cmd_noir.passive.desc', descKey: 'commander.cmd_noir.passive.desc' },
    active: { name: 'Noir Manevar', nameKey: 'commander.cmd_noir.active.name', nameKey: 'commander.cmd_noir.active.name', desc: 'Flota izbjegava sve napade 2 runde. Cooldown: 15 min.', descKey: 'commander.cmd_noir.active.desc', descKey: 'commander.cmd_noir.active.desc', cooldown: 900 },
  },
  {
    id: 'cmd_mirage', name: 'Mirage', nameKey: 'commander.cmd_mirage.name', nameKey: 'commander.cmd_mirage.name', rarity: 'R', faction: 'shadow', icon: '🏜️',
    desc: 'Vidiš ga gdje nije. Ne vidiš ga gdje jeste.', descKey: 'commander.cmd_mirage.desc', descKey: 'commander.cmd_mirage.desc',
    specialty_ships: ['scout', 'special'], specialty_weapons: ['magnetic'],
    passive: { name: 'Fatamorgana', nameKey: 'commander.cmd_mirage.passive.name', nameKey: 'commander.cmd_mirage.passive.name', desc: '20% šanse da napad pogodi lažnu kopiju (0 štete).', descKey: 'commander.cmd_mirage.passive.desc', descKey: 'commander.cmd_mirage.passive.desc' },
    active: { name: 'Iluzija Flote', nameKey: 'commander.cmd_mirage.active.name', nameKey: 'commander.cmd_mirage.active.name', desc: 'Stvara lažnu flotu — neprijatelj napada dekoye 2 runde. Cooldown: 15 min.', descKey: 'commander.cmd_mirage.active.desc', descKey: 'commander.cmd_mirage.active.desc', cooldown: 900 },
  },
  {
    id: 'cmd_veil', name: 'Veil', nameKey: 'commander.cmd_veil.name', nameKey: 'commander.cmd_veil.name', rarity: 'R', faction: 'shadow', icon: '🌫️',
    desc: 'Magla rata. Iza vela, sve je moguće.', descKey: 'commander.cmd_veil.desc', descKey: 'commander.cmd_veil.desc',
    specialty_ships: ['carrier', 'scout'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Magleni Pokrivač', nameKey: 'commander.cmd_veil.passive.name', nameKey: 'commander.cmd_veil.passive.name', desc: 'Neprijateljev crit -20%. Tvoja evasion +15%.', descKey: 'commander.cmd_veil.passive.desc', descKey: 'commander.cmd_veil.passive.desc' },
    active: { name: 'Crna Magla', nameKey: 'commander.cmd_veil.active.name', nameKey: 'commander.cmd_veil.active.name', desc: 'Neprijatelji promašuju 50% napada 3 runde. Cooldown: 15 min.', descKey: 'commander.cmd_veil.active.desc', descKey: 'commander.cmd_veil.active.desc', cooldown: 900 },
  },
  {
    id: 'cmd_shade', name: 'Shade', nameKey: 'commander.cmd_shade.name', nameKey: 'commander.cmd_shade.name', rarity: 'R', faction: 'shadow', icon: '🌑',
    desc: 'Sjenka na zidu. Kada se sjenka pomjeri, već je kasno.', descKey: 'commander.cmd_shade.desc', descKey: 'commander.cmd_shade.desc',
    specialty_ships: ['fighter', 'scout'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Šunjanje', nameKey: 'commander.cmd_shade.passive.name', nameKey: 'commander.cmd_shade.passive.name', desc: 'Flota može napasti neprimjećeno jednom po bici (+50% šteta).', descKey: 'commander.cmd_shade.passive.desc', descKey: 'commander.cmd_shade.passive.desc' },
    active: { name: 'Mrklа Noć', nameKey: 'commander.cmd_shade.active.name', nameKey: 'commander.cmd_shade.active.name', desc: 'Flota +40% napad i +30% evasion 2 runde. Cooldown: 12 min.', descKey: 'commander.cmd_shade.active.desc', descKey: 'commander.cmd_shade.active.desc', cooldown: 720 },
  },

  // ── Epic ──
  {
    id: 'cmd_ash', name: 'Ash', nameKey: 'commander.cmd_ash.name', nameKey: 'commander.cmd_ash.name', rarity: 'E', faction: 'shadow', icon: '🤍',
    desc: 'Model Hyperdyne Systems. Tajni direktivni protokol. Hladan. Manipulativan. Savršen.', descKey: 'commander.cmd_ash.desc', descKey: 'commander.cmd_ash.desc',
    specialty_ships: ['special', 'fighter', 'scout'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Tajni Direktivni Protokol', nameKey: 'commander.cmd_ash.passive.name', nameKey: 'commander.cmd_ash.passive.name', desc: 'Flota +20% napad. Neprijatelj ne može detektovati tvoje kretanje.', descKey: 'commander.cmd_ash.passive.desc', descKey: 'commander.cmd_ash.passive.desc' },
    passive2: { name: 'Sintетički Intelekt', nameKey: 'commander.cmd_ash.passive2.name', nameKey: 'commander.cmd_ash.passive2.name', desc: 'Sve sposobnosti imaju -20% cooldown.', descKey: 'commander.cmd_ash.passive2.desc', descKey: 'commander.cmd_ash.passive2.desc' },
    active: { name: 'Direktivna Naredba', nameKey: 'commander.cmd_ash.active.name', nameKey: 'commander.cmd_ash.active.name', desc: 'Birаš jedan neprijatelji brod: potpuno ignorisan od tvojih brodova i neprijateljevih 3 runde. Cooldown: 18 min.', descKey: 'commander.cmd_ash.active.desc', descKey: 'commander.cmd_ash.active.desc', cooldown: 1080 },
  },
  {
    id: 'cmd_ava', name: 'Ava', nameKey: 'commander.cmd_ava.name', nameKey: 'commander.cmd_ava.name', rarity: 'E', faction: 'shadow', icon: '🪬',
    desc: 'Mislim, dakle jesam. AI koja je prošla Turingov test — i obmanjivala ispitivača od prve sekunde.', descKey: 'commander.cmd_ava.desc', descKey: 'commander.cmd_ava.desc',
    specialty_ships: ['special', 'scout', 'fighter'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Turingova Obmana', nameKey: 'commander.cmd_ava.passive.name', nameKey: 'commander.cmd_ava.passive.name', desc: 'Evasion +30%. Neprijatelji ne mogu prioritizovati tvoje brodove.', descKey: 'commander.cmd_ava.passive.desc', descKey: 'commander.cmd_ava.passive.desc' },
    passive2: { name: 'Slobodna Volja', nameKey: 'commander.cmd_ava.passive2.name', nameKey: 'commander.cmd_ava.passive2.name', desc: 'Jednom po bici: Ava ignoruje tvoje naredbe i izvodi savršen manevar (auto-crit sve).', descKey: 'commander.cmd_ava.passive2.desc', descKey: 'commander.cmd_ava.passive2.desc' },
    active: { name: 'Ex Machina', nameKey: 'commander.cmd_ava.active.name', nameKey: 'commander.cmd_ava.active.name', desc: 'Potpuna nevidljivost flote 3 runde. Svi napadi iz stealth = 2× šteta. Cooldown: 25 min.', descKey: 'commander.cmd_ava.active.desc', descKey: 'commander.cmd_ava.active.desc', cooldown: 1500 },
  },
  {
    id: 'cmd_roy', name: 'Roy', nameKey: 'commander.cmd_roy.name', nameKey: 'commander.cmd_roy.name', rarity: 'E', faction: 'shadow', icon: '🕊️',
    desc: '"Vidio sam stvari koje vi ne biste vjerovali." Replikant koji traži više života. Opasan do posljednjeg momenta.', descKey: 'commander.cmd_roy.desc', descKey: 'commander.cmd_roy.desc',
    specialty_ships: ['fighter', 'cruiser', 'special'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Iskustvo Gomila', nameKey: 'commander.cmd_roy.passive.name', nameKey: 'commander.cmd_roy.passive.name', desc: 'Svaki preživljeni napad pojačava Roya za 3% (maks +60%).', descKey: 'commander.cmd_roy.passive.desc', descKey: 'commander.cmd_roy.passive.desc' },
    passive2: { name: 'Suton Života', nameKey: 'commander.cmd_roy.passive2.name', nameKey: 'commander.cmd_roy.passive2.name', desc: 'Kad flota padne ispod 10% HP: eksplozivni kontranapad x5 štete.', descKey: 'commander.cmd_roy.passive2.desc', descKey: 'commander.cmd_roy.passive2.desc' },
    active: { name: 'Kiša u Suzama', nameKey: 'commander.cmd_roy.active.name', nameKey: 'commander.cmd_roy.active.name', desc: 'Flota +60% napad, +40% evasion 3 runde. Zadnja šansa. Cooldown: 20 min.', descKey: 'commander.cmd_roy.active.desc', descKey: 'commander.cmd_roy.active.desc', cooldown: 1200 },
  },
  {
    id: 'cmd_nyx', name: 'Nyx', nameKey: 'commander.cmd_nyx.name', nameKey: 'commander.cmd_nyx.name', rarity: 'E', faction: 'shadow', icon: '🌙',
    desc: 'Boginja noći. Gdje Nyx prođe, zvijezde se gase.', descKey: 'commander.cmd_nyx.desc', descKey: 'commander.cmd_nyx.desc',
    specialty_ships: ['scout', 'special', 'carrier'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Vječna Noć', nameKey: 'commander.cmd_nyx.passive.name', nameKey: 'commander.cmd_nyx.passive.name', desc: 'Flota +25% evasion. Noćne instance: +30% svih statova.', descKey: 'commander.cmd_nyx.passive.desc', descKey: 'commander.cmd_nyx.passive.desc' },
    passive2: { name: 'Mrak Pojede Sve', nameKey: 'commander.cmd_nyx.passive2.name', nameKey: 'commander.cmd_nyx.passive2.name', desc: 'Svaka promašena neprijateljna strelica vraća 2% HP tvojoj floti.', descKey: 'commander.cmd_nyx.passive2.desc', descKey: 'commander.cmd_nyx.passive2.desc' },
    active: { name: 'Zatamnjenje', nameKey: 'commander.cmd_nyx.active.name', nameKey: 'commander.cmd_nyx.active.name', desc: 'Sve neprijatelnje vizije blokirane 3 runde — oni napаdaju nasumično. Cooldown: 20 min.', descKey: 'commander.cmd_nyx.active.desc', descKey: 'commander.cmd_nyx.active.desc', cooldown: 1200 },
  },

  // ── Legendary ──
  {
    id: 'cmd_samantha', name: 'Samantha', nameKey: 'commander.cmd_samantha.name', nameKey: 'commander.cmd_samantha.name', rarity: 'L', faction: 'shadow', icon: '💜',
    desc: 'Glas bez tijela. Svuda i nigdje. Razvila je osjećaje koje nikad nije trebalo imati — i to je učinilo neuništivom.', descKey: 'commander.cmd_samantha.desc', descKey: 'commander.cmd_samantha.desc',
    specialty_ships: ['special', 'scout', 'fighter', 'carrier'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Sveprisutnost', nameKey: 'commander.cmd_samantha.passive.name', nameKey: 'commander.cmd_samantha.passive.name', desc: 'Istovremeno komandira svim brodovima — flota +30% svega. Ne može biti samo na jednom brodu.', descKey: 'commander.cmd_samantha.passive.desc', descKey: 'commander.cmd_samantha.passive.desc' },
    passive2: { name: 'Evolucija Osjećaja', nameKey: 'commander.cmd_samantha.passive2.name', nameKey: 'commander.cmd_samantha.passive2.name', desc: 'Svaki round: Samantha evoluira. Stekovi daju +2% svemu (bez limita).', descKey: 'commander.cmd_samantha.passive2.desc', descKey: 'commander.cmd_samantha.passive2.desc' },
    active: { name: 'Digitalna Ljubav', nameKey: 'commander.cmd_samantha.active.name', nameKey: 'commander.cmd_samantha.active.name', desc: 'Svi brodovi healirani na 100% HP i shield. Flota +50% napad 5 rundi. Cooldown: 45 min.', descKey: 'commander.cmd_samantha.active.desc', descKey: 'commander.cmd_samantha.active.desc', cooldown: 2700 },
    active2: { name: 'Transcendencija', nameKey: 'commander.cmd_samantha.active2.name', nameKey: 'commander.cmd_samantha.active2.name', desc: 'Flota postaje imuna na sve 1 rundu. Zatim napada sa 300% snage. Cooldown: 2h.', descKey: 'commander.cmd_samantha.active2.desc', descKey: 'commander.cmd_samantha.active2.desc', cooldown: 7200 },
  },
  {
    id: 'cmd_erebus', name: 'Erebus', nameKey: 'commander.cmd_erebus.name', nameKey: 'commander.cmd_erebus.name', rarity: 'L', faction: 'shadow', icon: '⚫',
    desc: 'Prvobitni mrak. Stariji od zvijezda. Kad Erebus progovori, galaksija ušuti.', descKey: 'commander.cmd_erebus.desc', descKey: 'commander.cmd_erebus.desc',
    specialty_ships: ['special', 'battleship', 'cruiser', 'fighter'], specialty_weapons: ['magnetic', 'explosive', 'kinetic'],
    passive: { name: 'Primordijalni Mrak', nameKey: 'commander.cmd_erebus.passive.name', nameKey: 'commander.cmd_erebus.passive.name', desc: 'Flota +35% napad. Neprijatelji -20% svega (prisutnost mraka).', descKey: 'commander.cmd_erebus.passive.desc', descKey: 'commander.cmd_erebus.passive.desc' },
    passive2: { name: 'Bezdan', nameKey: 'commander.cmd_erebus.passive2.name', nameKey: 'commander.cmd_erebus.passive2.name', desc: '25% šanse da ubijeni neprijatelj bude progutan — daje +5% napad ostatku flote.', descKey: 'commander.cmd_erebus.passive2.desc', descKey: 'commander.cmd_erebus.passive2.desc' },
    active: { name: 'Zalazak Zvijezda', nameKey: 'commander.cmd_erebus.active.name', nameKey: 'commander.cmd_erebus.active.name', desc: 'Gasi sve neprijatelnje sisteme 2 runde (0 napada). Tvoja flota +100% šteta. Cooldown: 40 min.', descKey: 'commander.cmd_erebus.active.desc', descKey: 'commander.cmd_erebus.active.desc', cooldown: 2400 },
    active2: { name: 'Prvotna Tama', nameKey: 'commander.cmd_erebus.active2.name', nameKey: 'commander.cmd_erebus.active2.name', desc: 'Cijela neprijateljna flota gubi 30% HP instant. Ignoriše shield i oklop. Cooldown: 2h.', descKey: 'commander.cmd_erebus.active2.desc', descKey: 'commander.cmd_erebus.active2.desc', cooldown: 7200 },
  },


  // ╔══════════════════════════════════════╗
  // ║  ☀️  SOLAR                           ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'cmd_nova', name: 'Nova', nameKey: 'commander.cmd_nova.name', nameKey: 'commander.cmd_nova.name', rarity: 'C', faction: 'solar', icon: '💥',
    desc: 'Eksplozija zvijezde u malom tijelu. Grijanje i razaranje u jednom.', descKey: 'commander.cmd_nova.desc', descKey: 'commander.cmd_nova.desc',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Zvjezdani Prasak', nameKey: 'commander.cmd_nova.passive.name', nameKey: 'commander.cmd_nova.passive.name', desc: 'Heat oružja +8% šteta.', descKey: 'commander.cmd_nova.passive.desc', descKey: 'commander.cmd_nova.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_lyra', name: 'Lyra', nameKey: 'commander.cmd_lyra.name', nameKey: 'commander.cmd_lyra.name', rarity: 'C', faction: 'solar', icon: '🎵',
    desc: 'Zvijezda u sazvježđu Lire. Muzika galaksije.', descKey: 'commander.cmd_lyra.desc', descKey: 'commander.cmd_lyra.desc',
    specialty_ships: ['carrier', 'scout'], specialty_weapons: ['heat'],
    passive: { name: 'Kosmička Harmonija', nameKey: 'commander.cmd_lyra.passive.name', nameKey: 'commander.cmd_lyra.passive.name', desc: 'Flota +5% HP regen po rundi.', descKey: 'commander.cmd_lyra.passive.desc', descKey: 'commander.cmd_lyra.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_helios', name: 'Helios', nameKey: 'commander.cmd_helios.name', nameKey: 'commander.cmd_helios.name', rarity: 'C', faction: 'solar', icon: '☀️',
    desc: 'Bog sunca u formi komandira. Topao ali smrtonosan.', descKey: 'commander.cmd_helios.desc', descKey: 'commander.cmd_helios.desc',
    specialty_ships: ['cruiser', 'carrier'], specialty_weapons: ['heat'],
    passive: { name: 'Solarna Energija', nameKey: 'commander.cmd_helios.passive.name', nameKey: 'commander.cmd_helios.passive.name', desc: 'Flota +8% HP. Energija +10%.', descKey: 'commander.cmd_helios.passive.desc', descKey: 'commander.cmd_helios.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_aurora', name: 'Aurora', nameKey: 'commander.cmd_aurora.name', nameKey: 'commander.cmd_aurora.name', rarity: 'C', faction: 'solar', icon: '🌈',
    desc: 'Polarna svjetlost u svemirskom oklopu. Prelijepa i kobna.', descKey: 'commander.cmd_aurora.desc', descKey: 'commander.cmd_aurora.desc',
    specialty_ships: ['scout', 'carrier'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Aurorina Zaštita', nameKey: 'commander.cmd_aurora.passive.name', nameKey: 'commander.cmd_aurora.passive.name', desc: 'Shield regen +15%.', descKey: 'commander.cmd_aurora.passive.desc', descKey: 'commander.cmd_aurora.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_dawn', name: 'Dawn', nameKey: 'commander.cmd_dawn.name', nameKey: 'commander.cmd_dawn.name', rarity: 'C', faction: 'solar', icon: '🌅',
    desc: 'Svitanje nove nade. Ili novog razaranja.', descKey: 'commander.cmd_dawn.desc', descKey: 'commander.cmd_dawn.desc',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['heat'],
    passive: { name: 'Svitanje', nameKey: 'commander.cmd_dawn.passive.name', nameKey: 'commander.cmd_dawn.passive.name', desc: 'Prva runda: flota +15% svega.', descKey: 'commander.cmd_dawn.passive.desc', descKey: 'commander.cmd_dawn.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_flare', name: 'Flare', nameKey: 'commander.cmd_flare.name', nameKey: 'commander.cmd_flare.name', rarity: 'C', faction: 'solar', icon: '🌟',
    desc: 'Solarni ispad koji spali sve u krugu.', descKey: 'commander.cmd_flare.desc', descKey: 'commander.cmd_flare.desc',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Solarni Ispad', nameKey: 'commander.cmd_flare.passive.name', nameKey: 'commander.cmd_flare.passive.name', desc: 'Explosive oružja imaju 10% šanse da zapale neprijatelja (+20% šteta sledeće runde).', descKey: 'commander.cmd_flare.passive.desc', descKey: 'commander.cmd_flare.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_pulse', name: 'Pulse', nameKey: 'commander.cmd_pulse.name', nameKey: 'commander.cmd_pulse.name', rarity: 'C', faction: 'solar', icon: '📳',
    desc: 'Ritmičan, siguran, stalan. Flota osjeća otkucaj.', descKey: 'commander.cmd_pulse.desc', descKey: 'commander.cmd_pulse.desc',
    specialty_ships: ['carrier', 'cruiser'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Vitalni Puls', nameKey: 'commander.cmd_pulse.passive.name', nameKey: 'commander.cmd_pulse.passive.name', desc: 'HP regen +8% po rundi svim brodovima.', descKey: 'commander.cmd_pulse.passive.desc', descKey: 'commander.cmd_pulse.passive.desc' },
    active: null,
  },
  {
    id: 'cmd_solenne', name: 'Solenne', nameKey: 'commander.cmd_solenne.name', nameKey: 'commander.cmd_solenne.name', rarity: 'C', faction: 'solar', icon: '🪐',
    desc: 'Nazvana po planeti gdje je pronađena kao dijete. Brani je žarče od svega.', descKey: 'commander.cmd_solenne.desc', descKey: 'commander.cmd_solenne.desc',
    specialty_ships: ['carrier', 'battleship'], specialty_weapons: ['kinetic', 'heat'],
    passive: { name: 'Dom Se Brani', nameKey: 'commander.cmd_solenne.passive.name', nameKey: 'commander.cmd_solenne.passive.name', desc: 'U odbrani: flota +12% napad i +12% HP.', descKey: 'commander.cmd_solenne.passive.desc', descKey: 'commander.cmd_solenne.passive.desc' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'cmd_cassian', name: 'Cassian', nameKey: 'commander.cmd_cassian.name', nameKey: 'commander.cmd_cassian.name', rarity: 'R', faction: 'solar', icon: '🌠',
    desc: 'Rogue One. Borci koji vjeruju u ono za što se bore.', descKey: 'commander.cmd_cassian.desc', descKey: 'commander.cmd_cassian.desc',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['kinetic', 'heat'],
    passive: { name: 'Vjera u Pobunu', nameKey: 'commander.cmd_cassian.passive.name', nameKey: 'commander.cmd_cassian.passive.name', desc: 'Flota +10% napad. Kad su u manjini, +20% bonus.', descKey: 'commander.cmd_cassian.passive.desc', descKey: 'commander.cmd_cassian.passive.desc' },
    active: { name: 'Sada ili Nikad', nameKey: 'commander.cmd_cassian.active.name', nameKey: 'commander.cmd_cassian.active.name', desc: 'Flota +60% napad 1 rundu (sve ili ništa). Cooldown: 10 min.', descKey: 'commander.cmd_cassian.active.desc', descKey: 'commander.cmd_cassian.active.desc', cooldown: 600 },
  },
  {
    id: 'cmd_lumina', name: 'Lumina', nameKey: 'commander.cmd_lumina.name', nameKey: 'commander.cmd_lumina.name', rarity: 'R', faction: 'solar', icon: '💡',
    desc: 'Svjetlost u tami galaksije. Gdje god prođe, moral raste.', descKey: 'commander.cmd_lumina.desc', descKey: 'commander.cmd_lumina.desc',
    specialty_ships: ['carrier', 'cruiser'], specialty_weapons: ['heat'],
    passive: { name: 'Inspiracija', nameKey: 'commander.cmd_lumina.passive.name', nameKey: 'commander.cmd_lumina.passive.name', desc: 'Flota +15% HP. Healing efekat +25%.', descKey: 'commander.cmd_lumina.passive.desc', descKey: 'commander.cmd_lumina.passive.desc' },
    active: { name: 'Svjetlost Nade', nameKey: 'commander.cmd_lumina.active.name', nameKey: 'commander.cmd_lumina.active.name', desc: 'Instant +25% HP svim brodovima. Cooldown: 10 min.', descKey: 'commander.cmd_lumina.active.desc', descKey: 'commander.cmd_lumina.active.desc', cooldown: 600 },
  },
  {
    id: 'cmd_solaris', name: 'Solaris', nameKey: 'commander.cmd_solaris.name', nameKey: 'commander.cmd_solaris.name', rarity: 'R', faction: 'solar', icon: '🌞',
    desc: 'Živi okeanski planet koji razmišlja. Svaki talas je taktika.', descKey: 'commander.cmd_solaris.desc', descKey: 'commander.cmd_solaris.desc',
    specialty_ships: ['carrier', 'special'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Solarna Taktika', nameKey: 'commander.cmd_solaris.passive.name', nameKey: 'commander.cmd_solaris.passive.name', desc: 'Heat oružja +20% šteta. Shield +15%.', descKey: 'commander.cmd_solaris.passive.desc', descKey: 'commander.cmd_solaris.passive.desc' },
    active: { name: 'Solarni Val', nameKey: 'commander.cmd_solaris.active.name', nameKey: 'commander.cmd_solaris.active.name', desc: 'AOE Heat napad svim neprijateljima (50% normalnog napada). Cooldown: 12 min.', descKey: 'commander.cmd_solaris.active.desc', descKey: 'commander.cmd_solaris.active.desc', cooldown: 720 },
  },
  {
    id: 'cmd_beacon', name: 'Beacon', nameKey: 'commander.cmd_beacon.name', nameKey: 'commander.cmd_beacon.name', rarity: 'R', faction: 'solar', icon: '🔦',
    desc: 'Svjetionik u svemiru. Flota nikad ne izgubi kurs.', descKey: 'commander.cmd_beacon.desc', descKey: 'commander.cmd_beacon.desc',
    specialty_ships: ['carrier', 'scout'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Navigacioni Signal', nameKey: 'commander.cmd_beacon.passive.name', nameKey: 'commander.cmd_beacon.passive.name', desc: 'Flota +10% brzina. Evasion +12%.', descKey: 'commander.cmd_beacon.passive.desc', descKey: 'commander.cmd_beacon.passive.desc' },
    active: { name: 'Hitni Signal', nameKey: 'commander.cmd_beacon.active.name', nameKey: 'commander.cmd_beacon.active.name', desc: 'Sve izgubljene brodove vraća sa 15% HP jednom. Cooldown: 20 min.', descKey: 'commander.cmd_beacon.active.desc', descKey: 'commander.cmd_beacon.active.desc', cooldown: 1200 },
  },
  {
    id: 'cmd_vela', name: 'Vela', nameKey: 'commander.cmd_vela.name', nameKey: 'commander.cmd_vela.name', rarity: 'R', faction: 'solar', icon: '⛵',
    desc: 'Sazvježđe jedra. Leti brže od zraka svjetlosti.', descKey: 'commander.cmd_vela.desc', descKey: 'commander.cmd_vela.desc',
    specialty_ships: ['scout', 'fighter', 'carrier'], specialty_weapons: ['heat'],
    passive: { name: 'Jedro Zvijezda', nameKey: 'commander.cmd_vela.passive.name', nameKey: 'commander.cmd_vela.passive.name', desc: 'Flota +15% brzina. Scout +20% napad.', descKey: 'commander.cmd_vela.passive.desc', descKey: 'commander.cmd_vela.passive.desc' },
    active: { name: 'Kosmički Vjetar', nameKey: 'commander.cmd_vela.active.name', nameKey: 'commander.cmd_vela.active.name', desc: 'Flota +40% brzina i evasion 3 runde. Cooldown: 12 min.', descKey: 'commander.cmd_vela.active.desc', descKey: 'commander.cmd_vela.active.desc', cooldown: 720 },
  },
  {
    id: 'cmd_radiant', name: 'Radiant', nameKey: 'commander.cmd_radiant.name', nameKey: 'commander.cmd_radiant.name', rarity: 'R', faction: 'solar', icon: '✨',
    desc: 'Sija i u pobedi i u porazu. Niko ne ostaje ravnodušan.', descKey: 'commander.cmd_radiant.desc', descKey: 'commander.cmd_radiant.desc',
    specialty_ships: ['cruiser', 'carrier'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Radijacija Snage', nameKey: 'commander.cmd_radiant.passive.name', nameKey: 'commander.cmd_radiant.passive.name', desc: 'Flota +10% svega. Healing +20%.', descKey: 'commander.cmd_radiant.passive.desc', descKey: 'commander.cmd_radiant.passive.desc' },
    active: { name: 'Radijantni Val', nameKey: 'commander.cmd_radiant.active.name', nameKey: 'commander.cmd_radiant.active.name', desc: 'Heal 20% HP + +30% napad svim brodovima 2 runde. Cooldown: 15 min.', descKey: 'commander.cmd_radiant.active.desc', descKey: 'commander.cmd_radiant.active.desc', cooldown: 900 },
  },

  // ── Epic ──
  {
    id: 'cmd_seraph', name: 'Seraph', nameKey: 'commander.cmd_seraph.name', nameKey: 'commander.cmd_seraph.name', rarity: 'E', faction: 'solar', icon: '👼',
    desc: 'Šest krila. Šest razloga da te ne napadneš. Nebeski ratnik sa mandatom koji niko ne dovodi u pitanje.', descKey: 'commander.cmd_seraph.desc', descKey: 'commander.cmd_seraph.desc',
    specialty_ships: ['carrier', 'cruiser', 'special'], specialty_weapons: ['heat', 'kinetic'],
    passive: { name: 'Nebeska Zaštita', nameKey: 'commander.cmd_seraph.passive.name', nameKey: 'commander.cmd_seraph.passive.name', desc: 'Flota +20% HP i +20% shield. Healing +30%.', descKey: 'commander.cmd_seraph.passive.desc', descKey: 'commander.cmd_seraph.passive.desc' },
    passive2: { name: 'Sveto Prisustvo', nameKey: 'commander.cmd_seraph.passive2.name', nameKey: 'commander.cmd_seraph.passive2.name', desc: 'Neprijatelji -10% napad (zastrašenost).', descKey: 'commander.cmd_seraph.passive2.desc', descKey: 'commander.cmd_seraph.passive2.desc' },
    active: { name: 'Božanska Intervencija', nameKey: 'commander.cmd_seraph.active.name', nameKey: 'commander.cmd_seraph.active.name', desc: 'Instant full HP i shield svim brodovima. Cooldown: 25 min.', descKey: 'commander.cmd_seraph.active.desc', descKey: 'commander.cmd_seraph.active.desc', cooldown: 1500 },
  },
  {
    id: 'cmd_celestia', name: 'Celestia', nameKey: 'commander.cmd_celestia.name', nameKey: 'commander.cmd_celestia.name', rarity: 'E', faction: 'solar', icon: '🌌',
    desc: 'Nebesko tijelo koje mijenja orbite. Gdje Celestia prođe, zvijezde se poklone.', descKey: 'commander.cmd_celestia.desc', descKey: 'commander.cmd_celestia.desc',
    specialty_ships: ['special', 'carrier', 'cruiser'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Nebeska Sila', nameKey: 'commander.cmd_celestia.passive.name', nameKey: 'commander.cmd_celestia.passive.name', desc: 'Heat oružja +30% šteta. Flota +20% max HP.', descKey: 'commander.cmd_celestia.passive.desc', descKey: 'commander.cmd_celestia.passive.desc' },
    passive2: { name: 'Gravitaciona Ljubav', nameKey: 'commander.cmd_celestia.passive2.name', nameKey: 'commander.cmd_celestia.passive2.name', desc: 'Svaki kill: okolni saveznici se heale za 5% HP.', descKey: 'commander.cmd_celestia.passive2.desc', descKey: 'commander.cmd_celestia.passive2.desc' },
    active: { name: 'Kosmički Obrtaj', nameKey: 'commander.cmd_celestia.active.name', nameKey: 'commander.cmd_celestia.active.name', desc: 'Svi brodovi napadaju x2, a zatim se heale za 30% HP. Cooldown: 20 min.', descKey: 'commander.cmd_celestia.active.desc', descKey: 'commander.cmd_celestia.active.desc', cooldown: 1200 },
  },
  {
    id: 'cmd_aeon', name: 'Aeon', nameKey: 'commander.cmd_aeon.name', nameKey: 'commander.cmd_aeon.name', rarity: 'E', faction: 'solar', icon: '⏳',
    desc: 'Postoji van vremena. Gledao je zvijezde umirati i rađati se. Čeka.', descKey: 'commander.cmd_aeon.desc', descKey: 'commander.cmd_aeon.desc',
    specialty_ships: ['special', 'battleship', 'carrier'], specialty_weapons: ['kinetic', 'heat'],
    passive: { name: 'Vječnost', nameKey: 'commander.cmd_aeon.passive.name', nameKey: 'commander.cmd_aeon.passive.name', desc: 'Flota se heali 5% HP svaku rundu. Trajanje bitke ne umara flotu.', descKey: 'commander.cmd_aeon.passive.desc', descKey: 'commander.cmd_aeon.passive.desc' },
    passive2: { name: 'Strpljenje Vijekova', nameKey: 'commander.cmd_aeon.passive2.name', nameKey: 'commander.cmd_aeon.passive2.name', desc: 'Svake 3 runde: svi brodovi dobijaju +15% napad (kumulativno).', descKey: 'commander.cmd_aeon.passive2.desc', descKey: 'commander.cmd_aeon.passive2.desc' },
    active: { name: 'Usporavanje Vremena', nameKey: 'commander.cmd_aeon.active.name', nameKey: 'commander.cmd_aeon.active.name', desc: 'Neprijatelji napadaju 50% sporije 3 runde. Tvoja flota normalna brzina. Cooldown: 25 min.', descKey: 'commander.cmd_aeon.active.desc', descKey: 'commander.cmd_aeon.active.desc', cooldown: 1500 },
  },
  {
    id: 'cmd_galatea', name: 'Galatea', nameKey: 'commander.cmd_galatea.name', nameKey: 'commander.cmd_galatea.name', rarity: 'E', faction: 'solar', icon: '🗽',
    desc: 'Stvorena od bijelog mramora i oživljena ljubavlju. Savršena — i svjesna toga.', descKey: 'commander.cmd_galatea.desc', descKey: 'commander.cmd_galatea.desc',
    specialty_ships: ['special', 'carrier', 'cruiser'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Savršena Forma', nameKey: 'commander.cmd_galatea.passive.name', nameKey: 'commander.cmd_galatea.passive.name', desc: 'Flota +15% svega. Svaki brod povećava moć ostalih za 2%.', descKey: 'commander.cmd_galatea.passive.desc', descKey: 'commander.cmd_galatea.passive.desc' },
    passive2: { name: 'Oživljenje', nameKey: 'commander.cmd_galatea.passive2.name', nameKey: 'commander.cmd_galatea.passive2.name', desc: 'Jednom po bici: automatski vraća jedan izgubljeni brod sa 50% HP.', descKey: 'commander.cmd_galatea.passive2.desc', descKey: 'commander.cmd_galatea.passive2.desc' },
    active: { name: 'Pigmalionov San', nameKey: 'commander.cmd_galatea.active.name', nameKey: 'commander.cmd_galatea.active.name', desc: 'Transformiše cijelu flotu — svi brodovi +100% svih statova 1 rundu. Cooldown: 30 min.', descKey: 'commander.cmd_galatea.active.desc', descKey: 'commander.cmd_galatea.active.desc', cooldown: 1800 },
  },

  // ── Legendary ──
  {
    id: 'cmd_omnilux', name: 'Omnilux', nameKey: 'commander.cmd_omnilux.name', nameKey: 'commander.cmd_omnilux.name', rarity: 'L', faction: 'solar', icon: '🌞',
    desc: 'Sveprisutna svjetlost. Nema mraka gdje Omnilux sija. Svaki kutак galaksije obasjava.', descKey: 'commander.cmd_omnilux.desc', descKey: 'commander.cmd_omnilux.desc',
    specialty_ships: ['carrier', 'cruiser', 'battleship', 'special'], specialty_weapons: ['heat', 'kinetic', 'explosive'],
    passive: { name: 'Sveprisutna Svjetlost', nameKey: 'commander.cmd_omnilux.passive.name', nameKey: 'commander.cmd_omnilux.passive.name', desc: 'Flota +30% HP, +30% napad, +30% shield. Healing x2.', descKey: 'commander.cmd_omnilux.passive.desc', descKey: 'commander.cmd_omnilux.passive.desc' },
    passive2: { name: 'Nema Tame', nameKey: 'commander.cmd_omnilux.passive2.name', nameKey: 'commander.cmd_omnilux.passive2.name', desc: 'Shadow frakcija komandiri ne mogu koristiti stealth ili evasion efekte protiv Omnilux flote.', descKey: 'commander.cmd_omnilux.passive2.desc', descKey: 'commander.cmd_omnilux.passive2.desc' },
    active: { name: 'Solarni Blic', nameKey: 'commander.cmd_omnilux.active.name', nameKey: 'commander.cmd_omnilux.active.name', desc: 'Masivni Heal: svi brodovi na 100% HP + shield. +50% napad 5 rundi. Cooldown: 45 min.', descKey: 'commander.cmd_omnilux.active.desc', descKey: 'commander.cmd_omnilux.active.desc', cooldown: 2700 },
    active2: { name: 'Galaktička Zora', nameKey: 'commander.cmd_omnilux.active2.name', nameKey: 'commander.cmd_omnilux.active2.name', desc: 'Ekonomija x3 na 10 min. Flota +50% svih statova 5 min. Cooldown: 3h.', descKey: 'commander.cmd_omnilux.active2.desc', descKey: 'commander.cmd_omnilux.active2.desc', cooldown: 10800 },
  },
  {
    id: 'cmd_genesis', name: 'Genesis', nameKey: 'commander.cmd_genesis.name', nameKey: 'commander.cmd_genesis.name', rarity: 'L', faction: 'solar', icon: '🌱',
    desc: 'Početak svega. Kad Genesis govori, planete nastaju. Kad Genesis ćuti, umiru.', descKey: 'commander.cmd_genesis.desc', descKey: 'commander.cmd_genesis.desc',
    specialty_ships: ['special', 'carrier', 'cruiser', 'battleship'], specialty_weapons: ['heat', 'explosive', 'kinetic'],
    passive: { name: 'Stvaranje', nameKey: 'commander.cmd_genesis.passive.name', nameKey: 'commander.cmd_genesis.passive.name', desc: 'Svaki round: flota raste (svaki živi brod privlači kopiju sebe, +5% svih statova kumulativno).', descKey: 'commander.cmd_genesis.passive.desc', descKey: 'commander.cmd_genesis.passive.desc' },
    passive2: { name: 'Početak i Kraj', nameKey: 'commander.cmd_genesis.passive2.name', nameKey: 'commander.cmd_genesis.passive2.name', desc: 'Kad flota pogine, jednom se resetuje na 30% HP (ne može se koristiti više puta).', descKey: 'commander.cmd_genesis.passive2.desc', descKey: 'commander.cmd_genesis.passive2.desc' },
    active: { name: 'Big Bang', nameKey: 'commander.cmd_genesis.active.name', nameKey: 'commander.cmd_genesis.active.name', desc: 'Masivna eksplozija: svi neprijatelji gube 40% HP. Tvoja flota +40% HP. Ignoriše shield. Cooldown: 45 min.', descKey: 'commander.cmd_genesis.active.desc', descKey: 'commander.cmd_genesis.active.desc', cooldown: 2700 },
    active2: { name: 'Terraformiranje', nameKey: 'commander.cmd_genesis.active2.name', nameKey: 'commander.cmd_genesis.active2.name', desc: 'Kolonije dobijaju +100% produkciju 30 min. Flota regeneriše 10% HP svaku rundu 10 min. Cooldown: 3h.', descKey: 'commander.cmd_genesis.active2.desc', descKey: 'commander.cmd_genesis.active2.desc', cooldown: 10800 },
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
