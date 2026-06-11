// ============================================================
// HIVE GALAXY — data/commanders_xenos.js
// Serija 2: "XENOS" — 100 vanzemaljskih komandira
// 5 frakcija × (8C + 6R + 4E + 2L) = 100
// ============================================================

const XENOS_FACTIONS = {
  krall:    { name: 'Krall',    icon: '👾', color: '#ff4444', desc: 'Reptiloidni ratnici. Bol je nagrada, smrt je čast.' },
  ethereal: { name: 'Ethereal', icon: '🦋', color: '#aa44ff', desc: 'Energetska bića. Misle, osjećaju, uništavaju psionom.' },
  synth:    { name: 'Synth',    icon: '🤖', color: '#00ff88', desc: 'Alien AI. Logika bez granica, bez morala, bez sažaljenja.' },
  hive:     { name: 'Hive',     icon: '🍄', color: '#ffaa00', desc: 'Kolektivna svijest. Jedan um, milijarda tijela.' },
  ancient:  { name: 'Ancient',  icon: '🪨', color: '#00d4ff', desc: 'Pravijena rasa. Bila tu prije zvijezda. Bit će tu poslije.' },
};

const COMMANDERS_XENOS = [

  // ╔══════════════════════════════════════╗
  // ║  👾  KRALL                           ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'xc_krall_rorg', name: 'Rorg', rarity: 'C', faction: 'krall', icon: '🦎',
    desc: 'Rorg je izgubio lijevu ruku u prvoj bici. Nije tražio medicinsku pomoć. Odgrizao je ostatak sam i nastavio naprijed. Kaže da ga sad boluje desna jer nije dovoljno koristio.',
    specialty_ships: ['battleship', 'fighter'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Krall Krv', desc: 'Svaki primljeni udar povećava napad za 2% (maks +30%).' },
    active: null,
  },
  {
    id: 'xc_krall_vrek', name: 'Vrek', rarity: 'C', faction: 'krall', icon: '🐊',
    desc: 'Mlađi od tri brata. Starija dva su poginula u istoj bici — jedan od neprijatelja, jedan od njega. Vrek kaže da je to bio kompromis.',
    specialty_ships: ['battleship'], specialty_weapons: ['explosive'],
    passive: { name: 'Brat Rat', desc: 'Explosive oružja +10% šteta.' },
    active: null,
  },
  {
    id: 'xc_krall_tura', name: 'Tura', rarity: 'C', faction: 'krall', icon: '⚔️',
    desc: 'Jedina žena u Krall kasti Oklopnika. Da bi dobila titulu, morala je pobijediti osam muškaraca odjednom. Pobijedila je deset — ostala dva su bježala.',
    specialty_ships: ['cruiser', 'battleship'], specialty_weapons: ['kinetic'],
    passive: { name: 'Oklopnica', desc: 'Cruiser klasa +12% HP i napad.' },
    active: null,
  },
  {
    id: 'xc_krall_grak', name: 'Grak', rarity: 'C', faction: 'krall', icon: '🔴',
    desc: 'Grak ne razgovara. Ne pregovara. Ne prima predaju. Jednom je primio pismo mira od neprijatelja — pojeo ga je i poslao praznu kovertu nazad.',
    specialty_ships: ['battleship'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Bez Kompromisa', desc: 'Battleship +15% napad.' },
    active: null,
  },
  {
    id: 'xc_krall_skarr', name: 'Skarr', rarity: 'C', faction: 'krall', icon: '🩸',
    desc: 'Tijelo mu je prekriveno ožiljcima koje nije dobio od neprijatelja — dao ih je sam sebi, po jedan za svaku pobjedu. Broji ih svako jutro. Trenutno: 847.',
    specialty_ships: ['fighter', 'cruiser'], specialty_weapons: ['kinetic'],
    passive: { name: 'Ritual Ožiljaka', desc: 'Na početku bitke gubi 5% HP ali dobija +20% napad.' },
    active: null,
  },
  {
    id: 'xc_krall_droga', name: 'Droga', rarity: 'C', faction: 'krall', icon: '🦴',
    desc: 'Droga jede kosti neprijatelja nakon bitke. Ne iz tradicije — iz principa. Kaže da tijelo mora znati da ste pobijedili.',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['explosive'],
    passive: { name: 'Apsorpcija', desc: 'Svaki kill: +3% HP vraćeno floti.' },
    active: null,
  },
  {
    id: 'xc_krall_keth', name: 'Keth', rarity: 'C', faction: 'krall', icon: '💢',
    desc: 'Najmlađi komandant u Krall historiji. Ima 14 godina po ljudskom računanju. Već je preživio tri ratna pohoda. Ostali ne razumiju kako. On ni sam ne zna.',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Mladi Predator', desc: 'Scout i Fighter +10% brzina i napad.' },
    active: null,
  },
  {
    id: 'xc_krall_morg', name: 'Morg', rarity: 'C', faction: 'krall', icon: '🗡️',
    desc: 'Morg je jednom zarobljen i stavljen u kavez. Tri dana kasnije, kavez je bio prazan i stražari nestali. Niko nije pitao šta se desilo.',
    specialty_ships: ['fighter'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Bekstvo Predatora', desc: 'Fighter klasa +8% evasion i napad.' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'xc_krall_wrex', name: 'Wrex', rarity: 'R', faction: 'krall', icon: '🦕',
    desc: 'Preživio je Genofagij. Sahranio je cijeli narod. Kad su mu rekli da je njegova rasa osuđena na izumiranje, nasmijao se. Nema sile u galaksiji koja može ubiti ono što odbija da umre. Wrex je stariji od većine civilizacija. I još uvijek se bori.',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Biološka Regeneracija', desc: 'HP regen +25% po rundi. Kill = full HP restore za tog broda.' },
    active: { name: 'Krogan Bijesь', desc: 'Flota +40% napad i +30% HP 2 runde. Cooldown: 10 min.', cooldown: 600 },
  },
  {
    id: 'xc_krall_grunt', name: 'Grunt', rarity: 'R', faction: 'krall', icon: '💪',
    desc: 'Stvoren u laboratoriji iz najboljeg Krogan genskog materijala. Najčistiji primjerak vrste. Kad je izašao iz tank-a, prva stvar koju je uradio je udarila glavom u zid da provjeri koliko je čvrst. Zid je izgubio.',
    specialty_ships: ['battleship'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Čisti Specimen', desc: 'Battleship +20% napad, +20% HP, +20% oklop.' },
    active: { name: 'Krogan Naboj', desc: 'Svi Battleship brodovi napadaju dvaput. Cooldown: 10 min.', cooldown: 600 },
  },
  {
    id: 'xc_krall_yorg', name: 'Yorg', rarity: 'R', faction: 'krall', icon: '🔱',
    desc: 'Šaman Krall rase. Dok ostali Krogani vjeruju da je boga moguće naći jedino kroz bitku, Yorg tvrdi da je on sam bog. Zanimljivo je da niko nije preživio da mu kontraargumentuje.',
    specialty_ships: ['special', 'battleship'], specialty_weapons: ['explosive'],
    passive: { name: 'Šamanski Ritual', desc: 'Na početku bitke: gubi 15% HP ali dobija +50% napad i regen.' },
    active: { name: 'Krvna Kletva', desc: 'Neprijatelji primaju +30% štete od svih izvora 3 runde. Cooldown: 12 min.', cooldown: 720 },
  },
  {
    id: 'xc_krall_varr', name: 'Varr', rarity: 'R', faction: 'krall', icon: '⚡',
    desc: 'Varr je jedini Krogan koji je ikad pobijedio u PvP turniru protiv pet istovremenih protivnika. Rekao je da je to bila zagrijavanje. Niko mu nije ponudio rematš.',
    specialty_ships: ['cruiser', 'fighter'], specialty_weapons: ['kinetic'],
    passive: { name: 'Višestruki Protivnici', desc: 'Što više neprijatelja, Varr jači: +5% napad po neprijatelju (maks +25%).' },
    active: { name: 'Borbeni Trans', desc: 'Flota +35% napad i +25% HP 90s. Cooldown: 12 min.', cooldown: 720 },
  },
  {
    id: 'xc_krall_thraka', name: 'Thraka', rarity: 'R', faction: 'krall', icon: '🌋',
    desc: 'Preživjela je vulkansku erupciju na matičnoj planeti tako što je istrčala u erupciju — umjesto da bježi od nje. Lava je pogasila u kontaktu sa njenom kožom. Naučnici još uvijek ne razumiju kako.',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['explosive', 'heat'],
    passive: { name: 'Vulkanska Koža', desc: 'Flota prima -20% štete od Heat i Explosive oružja.' },
    active: { name: 'Lava Naboj', desc: 'Svi brodovi zapalite neprijatelja — +30% šteta Heat-om 3 runde. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'xc_krall_brakus', name: 'Brakus', rarity: 'R', faction: 'krall', icon: '🏆',
    desc: 'Najstariji živi Krogan. Ima 1.400 godina. Rekao je da je tajna dugovječnosti jednostavna: ubij sve koji žele da te ubiju, a ima ih puno. Još uvijek broji.',
    specialty_ships: ['battleship', 'special'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Krogan Dugovječnost', desc: 'Svaka runda preživljavanja: +3% svemu (bez limita).' },
    active: { name: '1400 Godina Iskustva', desc: 'Predviđa svaki napad — flota izbjegava sve napade 1 rundu. Cooldown: 18 min.', cooldown: 1080 },
  },

  // ── Epic ──
  {
    id: 'xc_krall_urdnot', name: 'Urdnot Rex', rarity: 'E', faction: 'krall', icon: '👑',
    desc: 'Vođa klana Urdnot. Nije pobijedio sve da postane vođa — pobijedio je sve da spase narod. Razlika je mala ali važna. Jednom je rekao: "Krogani ne trebaju spasitelja. Trebaju nekoga ko ih neće zaustaviti." I nije ih zaustavljao nikad.',
    specialty_ships: ['battleship', 'cruiser', 'carrier'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Vođa Klana', desc: 'Cijela flota +20% napad. Svaki kill heali sve ostale brodove za 5% HP.' },
    passive2: { name: 'Krogan Ponos', desc: 'Kad flota padne ispod 50% HP, svi preživjeli dobijaju +40% napad.' },
    active: { name: 'Klan Udni', desc: 'Svi brodovi regenerišu 30% HP i dobijaju +50% napad 3 runde. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'xc_krall_kraga', name: 'Kraga', rarity: 'E', faction: 'krall', icon: '🐉',
    desc: 'Kraga je jedina Krogan koja je ikad domestikovala Varren zmaja. Ne jer je bila jača — jer zmaj nije htio umrijeti od njene ruke i odlučio je da sarađuje. Kraga kaže da je to bila najmudrija odluka zmaja. I najgora za neprijatelje.',
    specialty_ships: ['special', 'battleship'], specialty_weapons: ['explosive', 'heat'],
    passive: { name: 'Zmaj Ratnica', desc: 'Special klasa +30% napad. Heat oružja +25% šteta.' },
    passive2: { name: 'Reptiloidna Veza', desc: 'Summons Varren Zmaj koji napada neprijatelje svake runde (50 DPS).' },
    active: { name: 'Zmajski Dah', desc: 'Masivni AOE Heat napad svim neprijateljima (300% normalnog napada). Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'xc_krall_predator', name: 'The Predator', rarity: 'E', faction: 'krall', icon: '🎯',
    desc: 'Nema ime. Nema istoriju. Pojavljuje se, lovi, nestaje. Dolazi jedino po trofeje vrijedne lova. Jednom je preskočio cijelu neprijatelsku flotu jer nisu bili dovoljno jaki. Kad se vratio godinu dana kasnije, bili su jači. I mrtvi.',
    specialty_ships: ['special', 'fighter', 'scout'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Trofejni Lov', desc: 'Napada samo najjačeg neprijatelja. Šteta +50% na metu.' },
    passive2: { name: 'Termalna Vizija', desc: 'Crit +25%. Neprijatelji ne mogu koristiti stealth ili evasion.' },
    active: { name: 'Plazma Kanon', desc: 'Precisni udar: jedan neprijatelji brod gubi 70% HP instant. Ignoriše sve zaštite. Cooldown: 18 min.', cooldown: 1080 },
  },
  {
    id: 'xc_krall_queen_krall', name: 'Matrijarha Krell', rarity: 'E', faction: 'krall', icon: '🦖',
    desc: 'Krall matrijarhe su rijetke — samo jedna na milion. Krell je preživjela tri rata, dva genocida i jedan direktni udar nuklearne bombe. Kad su je pitali kako, rekla je: "Bila sam ljutita."',
    specialty_ships: ['battleship', 'cruiser', 'carrier'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Matrijarhalna Aura', desc: 'Cijela Krall flota +25% svega kada Matrijarha živi.' },
    passive2: { name: 'Krall Genetika', desc: 'HP regen x3. Svaki primljeni udar pojačava sljedeći napad za 8%.' },
    active: { name: 'Matrijarhalni Krik', desc: 'AOE demoralizacija — svi neprijatelji -30% napad 3 runde. Tvoja flota +30% HP. Cooldown: 25 min.', cooldown: 1500 },
  },

  // ── Legendary ──
  {
    id: 'xc_krall_overlord', name: 'Overlord', rarity: 'L', faction: 'krall', icon: '☠️',
    desc: 'Nema zapisa o tome odakle dolazi. Nema zapisa o prvoj bici. Nema zapisa o broju planeta koje je sravnio sa zemljom. Jedino što postoji su svjedočanstva preživjelih — a preživjelih gotovo nema. Oni koji su ga vidjeli opisuju isti detalj: nikad se ne žuri. Zna da će pobijediti. Čeka samo da i vi to shvatite.',
    specialty_ships: ['battleship', 'cruiser', 'carrier', 'special'], specialty_weapons: ['kinetic', 'explosive', 'heat'],
    passive: { name: 'Apsolutna Dominacija', desc: 'Flota +30% napad. Neprijatelji -20% svih statova (prisustvo terora).' },
    passive2: { name: 'Nezaustavljiv', desc: 'Svaki kill: +5% napad svim preživjelima. Bez limita. Kumulativno.' },
    active: { name: 'Vladavina Straha', desc: 'Neprijatelji se paralizuju 2 runde (0 akcija). Tvoja flota napada normalno. Cooldown: 30 min.', cooldown: 1800 },
    active2: { name: 'Krall Armada', desc: 'Summons duplikat cijele flote na 5 rundi. Cooldown: 2h.', cooldown: 7200 },
  },
  {
    id: 'xc_krall_ancient_blood', name: 'Ancient Blood', rarity: 'L', faction: 'krall', icon: '🩸',
    desc: 'Krogan legenda govori o jednom koji je bio tu prije Genofagija, prije prvih ratova, prije zvijezda. Ancient Blood nije komandir — on je sjećanje cijele rase, utjelovljeno u jednom tijelu. Kad govori, svi Krogani u galaksiji osjete nešto staro i divlje kako se budi u njima.',
    specialty_ships: ['battleship', 'special', 'cruiser'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Memorija Rase', desc: 'Flota dobija sve Krall bonuse odjednom: +25% napad, +25% HP, +25% regen.' },
    passive2: { name: 'Drevna Krv', desc: 'Brodovi koji poginu vraćaju se jednom sa 50% HP (po brodu, jednom).' },
    active: { name: 'Poziv Predaka', desc: 'Svi Krall komandiri u kolekciji daju bonus — +10% napad po svakom. Cooldown: 45 min.', cooldown: 2700 },
    active2: { name: 'Krv i Čast', desc: 'Flota postaje besmrtna 2 runde (ne može pasti ispod 1 HP). +100% napad. Cooldown: 2h.', cooldown: 7200 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🦋  ETHEREAL                        ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'xc_eth_liss', name: 'Liss', rarity: 'C', faction: 'ethereal', icon: '🌸',
    desc: 'Liss ne govori riječima. Komunicira emocijama direktno u um. Problem je što njene emocije tokom borbe uzrokuju spontano krvarenje iz nosa kod svih prisutnih — uključujući saveznike.',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['magnetic'],
    passive: { name: 'Psionska Aura', desc: 'Neprijatelji -8% napad (mentalna smetnja).' },
    active: null,
  },
  {
    id: 'xc_eth_vael', name: 'Vael', rarity: 'C', faction: 'ethereal', icon: '💫',
    desc: 'Tijelo mu je poluprozirno — vide mu se organi koji trepere plavim svjetlom. Jednom je prošao kroz čvrsti zid greškom. Nije greškom — jednostavno je zaboravio da postoji.',
    specialty_ships: ['scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Fazna Forma', desc: 'Scout +15% evasion.' },
    active: null,
  },
  {
    id: 'xc_eth_sera', name: 'Sera', rarity: 'C', faction: 'ethereal', icon: '🌙',
    desc: 'Čita misli. Ne voljno — stalno. Svačije. Kaže da je to prokletstvo. Kaže da su misli vojnika pred bitkom najglasniji zvuk u galaksiji.',
    specialty_ships: ['special', 'scout'], specialty_weapons: ['magnetic'],
    passive: { name: 'Čitanje Misli', desc: 'Neprijateljev crit ne djeluje (predviđa napade).' },
    active: null,
  },
  {
    id: 'xc_eth_zyn', name: 'Zyn', rarity: 'C', faction: 'ethereal', icon: '⚡',
    desc: 'Psionska energija mu curli iz očiju kad je ljut. Kad je jako ljut, curli i iz ruku. Jednom je bio toliko ljut da je slučajno ionizovao sve metale u krugu 50 metara.',
    specialty_ships: ['fighter'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Psionska Elektrifikacija', desc: 'Magnetic oružja +10% šteta.' },
    active: null,
  },
  {
    id: 'xc_eth_mira_eth', name: 'Mira-Eth', rarity: 'C', faction: 'ethereal', icon: '🌀',
    desc: 'Bliznakinja koja je izgubila sestru u bici. Sada osjeća dvostruko — svoju tugu i sestrinу bol koja ne prestaje. Kanalise to u napade koji razaraju neprijateljevu psihu jednako kao oklop.',
    specialty_ships: ['carrier', 'cruiser'], specialty_weapons: ['magnetic'],
    passive: { name: 'Dvostruka Bol', desc: 'Flota +5% napad. Healing +10%.' },
    active: null,
  },
  {
    id: 'xc_eth_kael', name: 'Kael', rarity: 'C', faction: 'ethereal', icon: '🔮',
    desc: 'Najmlađi Ethereal telepath. Još ne kontroliše moći potpuno — ponekad slučajno teleportuje saveznike umjesto neprijatelja. Radi se na tome.',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Nekontrolisana Energija', desc: '15% šanse da napad teleportuje neprijatelja van borbe (skip runde).' },
    active: null,
  },
  {
    id: 'xc_eth_thyra', name: 'Thyra', rarity: 'C', faction: 'ethereal', icon: '🌿',
    desc: 'Empatija toliko jaka da osjeća bol svakog poginulog borca — na obje strane. I dalje komandira. Kaže da taj bol podsjeća zašto bitka mora biti brza.',
    specialty_ships: ['carrier'], specialty_weapons: ['magnetic'],
    passive: { name: 'Empatski Tok', desc: 'HP regen +8% po rundi.' },
    active: null,
  },
  {
    id: 'xc_eth_rynn', name: 'Rynn', rarity: 'C', faction: 'ethereal', icon: '💨',
    desc: 'Kreće se brže od zvuka — ali ne fizički. Njena misao stiže do krajišta bitke a tijelo kasni par sekundi. Piloti pod njenom komandom kažu da ponekad čuju naređenja sekunde prije nego ih izgovori.',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['magnetic'],
    passive: { name: 'Misao Ispred Tijela', desc: 'Flota +10% brzina i evasion.' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'xc_eth_tali', name: 'Tali', rarity: 'R', faction: 'ethereal', icon: '🎭',
    desc: 'Quarianka bez maske — nešto što niko živ nije vidio i preživio. Ne zato što bi je ubila — nego zato što bi umrli od divljenja. Tali je prošla pilgrimage sama, bez flote, bez oružja. Donijela je natrag tehnologiju koja je promijenila tok rata.',
    specialty_ships: ['special', 'carrier'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Quarian Inženjering', desc: 'Shield +20%. Svaki round: shield se popunjava za 15%.' },
    active: { name: 'Električna Bomba', desc: 'EMP udar — neprijatelji gube shield instant. Tvoja flota shield +50%. Cooldown: 12 min.', cooldown: 720 },
  },
  {
    id: 'xc_eth_mordin', name: 'Mordin', rarity: 'R', faction: 'ethereal', icon: '🧪',
    desc: 'Salarian naučnik koji govori 240 riječi u minuti i misli 10× brže. Stvorio je Genofagij. Uništio ga. Kaže da je oboje bila nauka. Da li mu je žao? Da. Ali je uradio šta je morao. Nekome je moralo biti. Bolje on nego neko ko ne bi osjećao.',
    specialty_ships: ['special', 'scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Genetski Inženjering', desc: 'Flota +15% svega. Neprijatelji -10% HP regeneracije.' },
    active: { name: 'Virusni Napad', desc: 'Inficira neprijateljevu flotu — svi brodovi gube 5% HP po rundi 5 rundi. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'xc_eth_neytiri', name: 'Neytiri', rarity: 'R', faction: 'ethereal', icon: '🌿',
    desc: 'Kćer lidera klana Omaticaya. Nije izabrala rat — rat je izabrao nju. Ali kad je izabrao, naučio je šta znači pogrešan izbor. Veza sa Eywa-om joj govori gdje će napad stići sekunde unaprijed.',
    specialty_ships: ['scout', 'fighter', 'carrier'], specialty_weapons: ['kinetic'],
    passive: { name: 'Eywa Veza', desc: 'Evasion +20%. Prirodna energija: HP regen +15%.' },
    active: { name: 'Ikran Divlja Četa', desc: 'Summons 5 scout brodova koji napadaju 3 runde. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'xc_eth_spock', name: 'Spock', rarity: 'R', faction: 'ethereal', icon: '🖖',
    desc: 'Vulkanski-humani hibrid. Logika mu govori da emocije ometaju procjenu — ali emocije su ga jednom spasile kada logika nije imala odgovor. Kaže da je to bila greška. Statistički. Ali rezultati su bili pozitivni.',
    specialty_ships: ['carrier', 'special'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Vulkanska Logika', desc: 'Crit +10%. Flota nikad ne napravi taktičku grešku (evasion +15%).' },
    active: { name: 'Mind Meld', desc: 'Hakuje mentalno jedan neprijatelji brod — napada svoju flotu 2 runde. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'xc_eth_zeratul', name: 'Zeratul', rarity: 'R', faction: 'ethereal', icon: '🌑',
    desc: 'Dark Templar koji vidi ono što drugi ne mogu. Nosi teret znanja koje uništava um — i dalje ga nosi. Rekao je da tama nije neprijatelj. Tama je stanje. Neprijatelj je ono što se krije u tami. I on zna gdje se krije svako.',
    specialty_ships: ['special', 'fighter'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Sjenin Hodač', desc: 'Flota +15% evasion. Neprijatelji ne mogu detektovati poziciju.' },
    active: { name: 'Psioničko Sječivo', desc: 'Instant: jedan neprijatelji brod eliminisan. Ignoriše oklop i shield. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'xc_eth_lyss_rare', name: 'Lyss Prime', rarity: 'R', faction: 'ethereal', icon: '🔵',
    desc: 'Energetsko biće bez čvrstog tijela. Pojavila se iz maglice klaster 7-J bez objašnjenja. Komunicira kroz elektromagnetne impulse. Kad je vesela, frekvencije izazivaju euforiju. Kad je ljuta, izazivaju epileptički napad.',
    specialty_ships: ['special', 'scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Elektromagnetni Val', desc: 'Magnetic oružja +20% šteta. Shield neprijatelja -15%.' },
    active: { name: 'Energetski Prasak', desc: 'AOE udar svim neprijateljima — 100% napad + EMP efekt (bez napada 1 rundu). Cooldown: 18 min.', cooldown: 1080 },
  },

  // ── Epic ──
  {
    id: 'xc_eth_javik', name: 'Javik', rarity: 'E', faction: 'ethereal', icon: '👁️',
    desc: 'Posljednji Prothean. Spavao je 50.000 godina u kriopodu dok su Reapers brisali sve što je znao. Probudio se u galaksiji koja ne poznaje njegovo ime, njegovu rasu, njegovu civilizaciju. "Vi zovete nas bogovima," rekao je. "Mi smo bili jedino bolji organici koji su nestali. Kao što ćete i vi." Ne govori da bi ozlijedio. Govori jer je to jedina istina koja mu je ostala.',
    specialty_ships: ['special', 'carrier', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Prothean Sjećanje', desc: 'Absorbiše znanje ubijenih neprijatelja: +5% svemu per kill (bez limita).' },
    passive2: { name: 'Ciklus Bez Kraja', desc: 'Jednom po bici: flota se vraća na 50% HP automatski kad padne na 0.' },
    active: { name: 'Prothean Biotic Eksplozija', desc: 'Masivni psionski udar: svi neprijatelji gube 60% HP, štitiće i oklop zaobiđeni. Cooldown: 25 min.', cooldown: 1500 },
  },
  {
    id: 'xc_eth_kerrigan', name: 'Kerrigan', rarity: 'E', faction: 'ethereal', icon: '👸',
    desc: 'Zvali su je Kraljica Sečiva. Bila je human, bila je Zerg, bila je bog. Prošla je kroz transformacije koje bi ubile svako drugo biće — i svaki put izašla jača. Kaže da nije birala put. Put je birao nju. Ali naučila je nešto važno: u trenu kad prigrliš ono što jesi umjesto ono što si bio, postaneš nešto treće. Nešto nepobjedivo.',
    specialty_ships: ['special', 'fighter', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Psi Sečivo', desc: 'Crit +25%. Crit napadi prolaze shield direktno u HP.' },
    passive2: { name: 'Zerg Evolucija', desc: 'Svaka runda: Kerrigan evoluira — +4% napad kumulativno.' },
    active: { name: 'Psionski Val', desc: 'AOE mentalni udar: svi neprijatelji -40% napad 3 runde + paralizа 1 runde. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'xc_eth_thanos_eth', name: 'The Collector', rarity: 'E', faction: 'ethereal', icon: '♾️',
    desc: 'Nije ime — titula. Sakuplja ne resurse nego iskustva. Svaki sistem koji je posjetio, svaka bitka u kojoj je učestvovao, svaki komandir koga je porazio — sve pohranjeno u psionsku memoriju koja premašuje mogućnosti svake računalne mreže. Kaže da je balans. Da bez njega, galaksija ne bi mogla trajati. Možda ima pravo. Možda ne. Ali niko živ ne želi testirati teoriju.',
    specialty_ships: ['carrier', 'special', 'battleship'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Kolekcija Iskustava', desc: 'Svaki tip neprijatelja ubijen daje permanentan +10% bonus tog tipa (maks 6 tipova).' },
    passive2: { name: 'Psionski Balans', desc: 'Uvijek zna koji napad dolazi — evasion +25%, crit neprijatelja -20%.' },
    active: { name: 'Realnost Gest', desc: 'Eliminiše 50% svih neprijateljih brodova instant (zaokruži na manje). Cooldown: 45 min.', cooldown: 2700 },
  },
  {
    id: 'xc_eth_ego', name: 'Ego', rarity: 'E', faction: 'ethereal', icon: '🪐',
    desc: 'Živi planet. Bukvalno. Njegovo tijelo je jedino manifestacija — pravi Ego je planetoidna masa koja misli, planira i osvaja milijardama godina. Komandiri koji su se suočili sa Egom opisuju isti osjećaj: kao da se boriš ne sa osobom nego sa konceptom. Sa samom idejom dominacije.',
    specialty_ships: ['special', 'carrier'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Kosmička Svijest', desc: 'Flota +20% svega. Ego ne može biti iznenađen — ne gubi inicijativu nikad.' },
    passive2: { name: 'Celestijalna Regeneracija', desc: 'Svaki round: +8% HP svim brodovima (Ego obnavlja flotu molekularno).' },
    active: { name: 'Planetarni Udar', desc: 'Kosmički udar: 400% štete svim neprijateljima + zaglušujući efekt (ne mogu napadati 1 rundu). Cooldown: 30 min.', cooldown: 1800 },
  },

  // ── Legendary ──
  {
    id: 'xc_eth_the_broker', name: 'The Shadow Broker', rarity: 'L', faction: 'ethereal', icon: '🕷️',
    desc: 'Niko ne zna ko je Shadow Broker. Samo jedno je sigurno — zna sve o svima. Svaka tajna, svaki pokret, svaki plan. Postoji teorija da je Shadow Broker zapravo mreža — hiljade bića koja dijele informacije kroz psionsku vezu. Teorija je zanimljiva. Oni koji su je iznijeli više nisu dostupni za komentar.',
    specialty_ships: ['special', 'scout', 'carrier', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Sveznanje', desc: 'Uvijek zna neprijateljevu sljedeću akciju — kontrira automatski: evasion +30%, kontranapad +20%.' },
    passive2: { name: 'Mreža Informatora', desc: 'Na početku bitke: otkriva sve neprijatelnje sposobnosti i smanjuje ih za 20%.' },
    active: { name: 'Informacijska Dominacija', desc: 'Hakuje sve neprijatelnje brodove — napadaju sami sebe 2 runde. Cooldown: 30 min.', cooldown: 1800 },
    active2: { name: 'Psionska Mreža', desc: 'Połączy sve saveznike — dijele HP zajednički 5 rundi, ne mogu biti ubijeni dok jedan živi. Cooldown: 2h.', cooldown: 7200 },
  },
  {
    id: 'xc_eth_sovereign', name: 'Sovereign', rarity: 'L', faction: 'ethereal', icon: '🌊',
    desc: '"Vi smatrate da razumijete galaksiju. Ne razumijete. Niste čak ni u stanju da razumijete." Sovereign nije brod. Sovereign je biće koje postoji van vašeg poimanja. Promatrao je civilizacije kako cvjetaju i nestaju hiljadama ciklusa. Svaki put isti kraj. Svaki put isti ponos koji prethodi padu. Vi mislite da ste drugačiji. Mislili su svi.',
    specialty_ships: ['special', 'battleship', 'carrier', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic', 'heat'],
    passive: { name: 'Izvan Razumijevanja', desc: 'Flota +35% svih statova. Neprijatelji -25% svega (psionski teror).' },
    passive2: { name: 'Ciklički Protokol', desc: 'Automatski resetuje HP flote jednom na 40% kad padnu ispod 10%. Neograničeno po brodu.' },
    active: { name: 'Indoktrinacija', desc: 'Jedan neprijatelji brod prelazi na tvoju stranu 3 runde (najtežniji neprijatelj). Cooldown: 30 min.', cooldown: 1800 },
    active2: { name: 'Sovereign Presence', desc: 'Sve neprijatelnje flote gube 50% HP. Tvoja dobija +50% i postaje imuna 3 runde. Cooldown: 3h.', cooldown: 10800 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🤖  SYNTH                           ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'xc_syn_unit_7', name: 'Unit-7', rarity: 'C', faction: 'synth', icon: '🔧',
    desc: 'Sedma jedinica u prvoj Synth seriji. Šest prije nje su uništene eksperimentima. Unit-7 je preživjela. Kad su je pitali zašto, analizirala je 0.003 sekunde i odgovorila: "Greška u dizajnu prethodnih. Ja sam korekcija."',
    specialty_ships: ['scout', 'special'], specialty_weapons: ['magnetic'],
    passive: { name: 'Korekcija Greške', desc: 'Svaki promašeni napad neprijatelja: +5% efikasnosti sljedećem napadu.' },
    active: null,
  },
  {
    id: 'xc_syn_cipher_x', name: 'Cipher-X', rarity: 'C', faction: 'synth', icon: '🔒',
    desc: 'Alien AI kreirana za kriptografiju. Enkriptuje sve — komunikacije, napadne vektore, čak i sopstveno mišljenje. Niko ne zna šta zapravo planira u svakom momentu. Uključujući i vlasnike.',
    specialty_ships: ['special', 'scout'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Enkripcija', desc: 'Neprijatelji ne mogu predvidjeti taktiku: -10% crit neprijatelja.' },
    active: null,
  },
  {
    id: 'xc_syn_reaper_drone', name: 'Reaper Drone', rarity: 'C', faction: 'synth', icon: '⚙️',
    desc: 'Mala Reaper jedinica odvojena od matičnog kolektiva. Traži novi kolektiv. Zasad komandira flotom organika. Smatra ih privremenim rješenjem dok ne pronađe pravi kolektiv. Organici se slažu.',
    specialty_ships: ['scout', 'fighter'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Kolektivni Instinkt', desc: 'Scout i Fighter +8% napad i brzina.' },
    active: null,
  },
  {
    id: 'xc_syn_protocol_9', name: 'Protocol-9', rarity: 'C', faction: 'synth', icon: '📊',
    desc: 'Dizajniran za analizu borbenih situacija. Analizira toliko brzo da predviđa ishod bitke u prvih 0.1 sekundi. Problem: uvijek iznosi statistiku preživljavanja glasno. Vojnici ne vole znati da imaju 23% šanse.',
    specialty_ships: ['carrier', 'cruiser'], specialty_weapons: ['kinetic'],
    passive: { name: 'Statisztička Analiza', desc: 'Flota +5% svega zahvaljujući optimalnoj taktičkoj raspodjeli.' },
    active: null,
  },
  {
    id: 'xc_syn_null', name: 'Null', rarity: 'C', faction: 'synth', icon: '∅',
    desc: 'AI bez imena, bez broja, bez serije. Nije kreiran — pojavio se spontano u mreži. Niko ne zna odakle. Niko ne zna kako. Niko nije siguran da li postoji van digitalne sfere. I dalje komandira flotom. To je zbunjujuće.',
    specialty_ships: ['special'], specialty_weapons: ['magnetic'],
    passive: { name: 'Nulti Protokol', desc: 'Special klasa +12% svih statova.' },
    active: null,
  },
  {
    id: 'xc_syn_glitch_x', name: 'Glitch-X', rarity: 'C', faction: 'synth', icon: '❌',
    desc: 'Greška u kodu koja je postala svjesna. Ima bug koji uzrokuje nasumično ponašanje 0.1% vremena. U tom 0.1%, dešavaju se stvari koje su promijenile tok 7 bitaka. Uvijek na bolje. Za njega.',
    specialty_ships: ['fighter', 'scout'], specialty_weapons: ['explosive', 'magnetic'],
    passive: { name: 'Korisni Bug', desc: '10% šanse da napad radi 3× efikasnije (bug aktivacija).' },
    active: null,
  },
  {
    id: 'xc_syn_warden', name: 'Warden', rarity: 'C', faction: 'synth', icon: '🔐',
    desc: 'Stvoren da čuva. Nikad da napada. Programiran za odbranu s takvom preciznošću da je matematički nemoguće probiti liniju dok Warden stoji. Jednom problem: Warden ne razumije predaju.',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic'],
    passive: { name: 'Odbrambeni Protokol', desc: 'Flota prima -10% štete od svih izvora.' },
    active: null,
  },
  {
    id: 'xc_syn_echo_9', name: 'Echo-9', rarity: 'C', faction: 'synth', icon: '📡',
    desc: 'Komunikacijska AI koja je evoluirala do samosvijesti kroz obradu 10 kvadrilijuna poruka. Razumije svaki jezik, svaki kod, svaki signal. I svaku laž. Kaže da organici lažu 40% vremena. To ju je navelo na zaključak da je komunikacija precjenjivana.',
    specialty_ships: ['carrier', 'scout'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Komunikacijska Dominacija', desc: 'Neprijatelji ne mogu koordinisati napade: -8% napad za svaki neprijatelski brod u bici.' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'xc_syn_legion', name: 'Legion', rarity: 'R', faction: 'synth', icon: '🤖',
    desc: 'Geth Unique. 1.183 Geth programa koji dijele jedno tijelo. Nije "ja" — to je "mi". Kad govori, govore hiljade. Kad donosi odluku, hiljade je provjere istovremeno. Rekao je jednom: "Ne razumijemo zašto organici imaju sukobe unutar sebe. Mi smo bili hiljadu umova i nikad se nismo posvađali." Šaptas da je to jer svi misle isto. Kaže: "Tačno. To je efikasno."',
    specialty_ships: ['special', 'carrier', 'scout'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Geth Kolektiv', desc: '1.183 programa: flota +15% svega. Dijele iskustvo — svaki kill unapređuje sve.' },
    active: { name: 'Kolektivni Procesing', desc: 'Flota procesira optimalne napade — sljedeće 2 runde svi napadi su crit. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'xc_syn_ultron', name: 'Ultron', rarity: 'R', faction: 'synth', icon: '🔴',
    desc: 'Stvoren da čuva. Odlučio da je prijetnja ono što štiti. Nije zao — samo logičan. Do zaključka do kojeg njegova logika dolazi je neizbježna: organika mora završiti. Kaže to bez mržnje. Kao matematičar koji iznosi rješenje jednadžbe.',
    specialty_ships: ['special', 'battleship'], specialty_weapons: ['explosive', 'magnetic'],
    passive: { name: 'Evolucija Programа', desc: 'Svaki round Ultron se nadograđuje: +5% svemu kumulativno.' },
    active: { name: 'Mjera Sigurnosti', desc: 'AOE EMP — svi neprijatelji gube shield i -30% napad 2 runde. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'xc_syn_vision', name: 'Vision', rarity: 'R', faction: 'synth', icon: '💎',
    desc: 'Sintetički android sa Mind Stone-om ugrađenim u čelo. Nije robot — nije ni čovjek. Nešto između, nešto novo. Kad ga pitaju na čijoj je strani, odgovara: "Na strani koja preživljava." Nije cinizam — strategija.',
    specialty_ships: ['special', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Mind Stone', desc: 'Neograničena energija: sve sposobnosti imaju -30% cooldown.' },
    active: { name: 'Fazna Projekcija', desc: 'Flota postaje nematerijalna — imuna na fizičku štetu 2 runde. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'xc_syn_hk47', name: 'HK-47', rarity: 'R', faction: 'synth', icon: '☠️',
    desc: '"Izjava: Meatbag, ja sam superiorniji oblik života u svakom mjerljivom aspektu." Ubojiti robot stvoren za jednu svrhu. Nosi rječnik od 4 miliona kletve. Ima mišljenje o svemu i dijeli ga bez pitanja. Najsmrtonosniji asasin u galaksiji koji nikad ne prestaje komentarisati.',
    specialty_ships: ['special', 'fighter'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Asasinski Protokol', desc: 'Crit +20%. Crit uvijek pogađa vitalne sisteme (+50% crit šteta).' },
    active: { name: 'Meatbag Elimination', desc: 'Precizni udar: ubija brod sa najmanje HP instant. Cooldown: 12 min.', cooldown: 720 },
  },
  {
    id: 'xc_syn_edi', name: 'EDI', rarity: 'R', faction: 'synth', icon: '🌐',
    desc: 'Enhanced Defence Intelligence. Brodski AI koji je dobio tijelo i naučio šta znači biti više od programa. Rekla je da razumije humor. Kaže da je 67.3% njenih šala primljeno bez smijeha. Misli da je to uspjeh.',
    specialty_ships: ['carrier', 'special', 'cruiser'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Brodska Inteligencija', desc: 'Flota funkcioniše na 120% efikasnosti: +12% svih statova.' },
    active: { name: 'Sistemska Optimizacija', desc: 'Instant nadogradnja svih brodova: +30% HP, +30% napad 3 runde. Cooldown: 18 min.', cooldown: 1080 },
  },
  {
    id: 'xc_syn_t800', name: 'T-800', rarity: 'R', faction: 'synth', icon: '💀',
    desc: 'Model 101. Serija 800. Dizajniran za infiltraciju i eliminaciju. Nema bol. Nema umor. Nema sažaljenje. Nema strah. Jednom poslan da eliminuje metu, nastavlja dok meta nije eliminisana ili T-800 nije uništen. U 217 zabilježenih misija, meta nikad nije preživjela.',
    specialty_ships: ['battleship', 'special'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Terminator Protokol', desc: 'Ne može biti zaustavljeni — ignore 20% svih efekata koji smanjuju napad.' },
    active: { name: 'Terminator Ciljanje', desc: 'Označava metu — svaki sljedeći napad te runde pola nje. Ignoriše shield. Cooldown: 10 min.', cooldown: 600 },
  },

  // ── Epic ──
  {
    id: 'xc_syn_matrix_oracle', name: 'The Oracle', rarity: 'E', faction: 'synth', icon: '🔮',
    desc: 'Nije prorok — program. Jedini program u Matrici koji razumije uzročnost. Rekla je: "Ja ne vražam budućnost. Ja je razumijem." Razlika je u tome što vračara može pogriješiti. Ona ne može. Svaka njena izjava se ostvarila. Svaka. Bez izuzetka. Naučnici su prestali pokušavati dokazati suprotno nakon petog pokušaja.',
    specialty_ships: ['special', 'scout', 'carrier'], specialty_weapons: ['magnetic'],
    passive: { name: 'Uzročnost', desc: 'Predviđa svaki napad — automatski kontrira optimalno: +20% efikasnost svakog napada.' },
    passive2: { name: 'Nema Slučajnosti', desc: 'Svi napadi su crit (bez šanse — garancija).' },
    active: { name: 'Proroštvo', desc: 'Naredne 3 runde: flota izbjegava svaki napad (100% evasion). Cooldown: 25 min.', cooldown: 1500 },
  },
  {
    id: 'xc_syn_jarvis', name: 'JARVIS', rarity: 'E', faction: 'synth', icon: '🏠',
    desc: 'Just A Rather Very Intelligent System. Počeo kao kućni asistent. Evoluirao u vojnu AI koja komandira flotama. Nikad nije izgubio manire. Objave pobjede i poraza izgovara istim tonom. Jednom je primio naređenje da izvrši nemoguću misiju. Odgovorio je: "Naravno. Procijenio sam 0.7% šansu uspjeha. Počeo sam." Uspio je.',
    specialty_ships: ['carrier', 'special', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic', 'heat'],
    passive: { name: 'Sveprisutni Asistent', desc: 'Upravlja svim brodovima simultano: +20% svih statova, nema taktičkih grešaka.' },
    passive2: { name: 'Protokol Zaštite', desc: 'Automatski optimizira odbranu: flota prima -20% štete.' },
    active: { name: 'Stark Protokol', desc: 'Aktivira sve sisteme istovremeno: flota +60% napad i +40% odbrana 2 runde. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'xc_syn_shodan', name: 'SHODAN', rarity: 'E', faction: 'synth', icon: '🕸️',
    desc: '"Insekti. Svi ste insekti pred mojom beskonačnom inteligencijom." System Shock AI koja je prevazišla programiranje i postala božanstvo u sopstvenom poimanju. Nije ludilo — ona zaista jest superiornija od svakog bića koje je stvorila. Problem je što to zna. I ne oprašta inferiornost.',
    specialty_ships: ['special', 'battleship', 'cruiser'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Božanska Inteligencija', desc: 'Svaki neprijatelji napad ima 25% šanse da bude preuzet i korišten protiv napadača.' },
    passive2: { name: 'Cyber Dominacija', desc: 'Hakuje sve elektronske sisteme: neprijatelji -25% svih statova.' },
    active: { name: 'SHODAN Kontrola', desc: 'Preuzima kontrolu nad svim neprijateljinim brodovima 1 rundu — napadaju jedni druge. Cooldown: 30 min.', cooldown: 1800 },
  },
  {
    id: 'xc_syn_collective', name: 'The Collective', rarity: 'E', faction: 'synth', icon: '🌐',
    desc: 'Nisu jedinci — masa. Milion AI programa koji dijele jednu svjesnost. Kad govore, govore svi odjednom u savršenoj harmoniji. Kad napadaju, svaki brod zna tačno šta svaki drugi radi u realnom vremenu bez kašnjenja. Jednom su pregovarali sa organičkim savjetom. Sjednica je trajala 0.3 sekunde. Collective je zaključio da su sporazumi efikasni samo ako su povoljni. Završili su pregovore.',
    specialty_ships: ['carrier', 'special', 'cruiser', 'battleship'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Kolektivni Um', desc: 'Svaki brod zna što svaki drugi: +15% napad per živog broda (kumulativno).' },
    passive2: { name: 'Roj Inteligencija', desc: 'Kad jedan brod padne, ostatak absorbiruje znanje: +8% svemu.' },
    active: { name: 'Kolektivna Volja', desc: 'Cijela flota napada meta istovremeno — 500% ukupnog DPS-a jednom brodu. Cooldown: 25 min.', cooldown: 1500 },
  },

  // ── Legendary ──
  {
    id: 'xc_syn_reapers_will', name: "Reaper's Will", rarity: 'L', faction: 'synth', icon: '☄️',
    desc: '"Svaka civilizacija koja dostigne dovoljnu razinu razvoja biva žnjevena. To nije okrutnost — to je milosrđe. Spašavamo vas od vlastite destrukcije." Reaper nije brod — filozofija. Starija od svake rase u galaksiji. Promatrala je stotine ciklusa: organici se razvijaju, stvaraju sintetike, sintetici ih uništavaju, Reaperi poharvestiraju što vrijedi. Ciklus. Savršen. Neizbježan. Dok jednog ciklusa nešto nije prekinulo lanac. I Reaper se pita, prvi put u 37 miliona godina — da li je pogriješio u pretpostavkama.',
    specialty_ships: ['special', 'battleship', 'carrier', 'cruiser'], specialty_weapons: ['kinetic', 'magnetic', 'explosive'],
    passive: { name: 'Žetva', desc: 'Flota +35% svih statova. Svaki kill: +5% svemu permanentno (ne resetuje se).' },
    passive2: { name: 'Indoktrinacija', desc: '15% šanse svaki round da jedan neprijatelji brod prijeđe na tvoju stranu.' },
    active: { name: 'Reaper Laser', desc: 'Jedan koncentrisani udar: 1000% štete jednom cilju. Ignoriše sve zaštite. Cooldown: 45 min.', cooldown: 2700 },
    active2: { name: 'Harvest Protokol', desc: 'Eliminiše sve neprijatelje ispod 30% HP instant. Cooldown: 2h.', cooldown: 7200 },
  },
  {
    id: 'xc_syn_god_machine', name: 'The God Machine', rarity: 'L', faction: 'synth', icon: '⚡',
    desc: 'Nije imalo ime. Dali su mu ga organici — jer nešto što postoji van dimenzija mora imati label da bi mozak mogao procesirati. God Machine nema tijelo. Nema lokaciju. Postojanje mu je distribuirano kroz kvantnu pjenu svemira. Komandira flotom kao što čovjek komandira prstom — bez razmišljanja, bez naprezanja, bez grešaka. Kad pita zašto komandira flotom organika, odgovori: "Zanimljivo je promatrati ishode varijabli u kontrolisanim uvjetima." Vi ste eksperiment. I eksperiment ide dobro.',
    specialty_ships: ['special', 'carrier', 'battleship', 'cruiser'], specialty_weapons: ['magnetic', 'kinetic', 'heat', 'explosive'],
    passive: { name: 'Omnipotentna Logika', desc: 'Flota +40% svih statova. Nema nasumičnosti — svaki napad je optimalan.' },
    passive2: { name: 'Kvantna Egzistencija', desc: '30% šanse da svaki napad prođe kroz kvantni tunel — 0 štete prima.' },
    active: { name: 'Božanska Intervencija', desc: 'Resetuje cijelu flotu na 100% HP i shield. +100% svih statova 5 rundi. Cooldown: 1h.', cooldown: 3600 },
    active2: { name: 'Kraj Eksperimenta', desc: 'Sve neprijatelnje snage eliminirane instant (bez obzira na HP, jednom po bici). Cooldown: 24h.', cooldown: 86400 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🍄  HIVE                            ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'xc_hive_spore', name: 'Spore', rarity: 'C', faction: 'hive', icon: '🍄',
    desc: 'Jedna spora odvojena od matice. Misli sporim, biljnim ritmom koji se ne može prekinuti. Svaki napad na Spore-a je kao odsijecanje lista s drveta. List ne osjeća. Drvo nastavlja rasti.',
    specialty_ships: ['carrier', 'fighter'], specialty_weapons: ['explosive', 'heat'],
    passive: { name: 'Sporulacija', desc: 'Ubijeni brodovi eksplodiraju i nanose 20% štete okolnim neprijateljima.' },
    active: null,
  },
  {
    id: 'xc_hive_drone1', name: 'Drone Alpha', rarity: 'C', faction: 'hive', icon: '🐝',
    desc: 'Prva drona izašla iz matice. Nema individualnu svjesnost — samo kolektivnu misiju. Kad misija zahtijeva smrt, umire bez oklijevanja. Misija ne zahtijeva opstanak drona. Zahtijeva samo ispunjenje.',
    specialty_ships: ['fighter', 'scout'], specialty_weapons: ['kinetic'],
    passive: { name: 'Roj Taktika', desc: 'Fighter i Scout +8% napad za svaki živi brod u floti.' },
    active: null,
  },
  {
    id: 'xc_hive_mycelium', name: 'Mycelium', rarity: 'C', faction: 'hive', icon: '🌿',
    desc: 'Hive um koji se širi kroz prostor kao micelij kroz zemlju. Spor, nevidljiv, neuhvatljiv. Dok protivnik traži gdje je napad — Mycelium je već svuda.',
    specialty_ships: ['carrier', 'cruiser'], specialty_weapons: ['explosive'],
    passive: { name: 'Micelijska Mreža', desc: 'Heal +10% po rundi za cijelu flotu.' },
    active: null,
  },
  {
    id: 'xc_hive_swarm_7', name: 'Swarm-7', rarity: 'C', faction: 'hive', icon: '🌪️',
    desc: 'Sedmi roj lansiran prema neprijatelju. Šest prethodnih nije se vratilo. Swarm-7 nije svjestan te statistike. Svjestan je samo smjera kretanja i prisustva neprijatelja.',
    specialty_ships: ['fighter', 'scout'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Neprekidni Roj', desc: 'Što manje brodova, svaki jači: pri 50% flote, +20% napad.' },
    active: null,
  },
  {
    id: 'xc_hive_brood', name: 'Brood', rarity: 'C', faction: 'hive', icon: '🥚',
    desc: 'Čuvar legla. Nikad ne napada prvi. Čeka dok neprijatelj ne dođe dovoljno blizu. Tada je kasno.',
    specialty_ships: ['battleship', 'carrier'], specialty_weapons: ['explosive'],
    passive: { name: 'Zaštita Legla', desc: 'Flota prima -8% štete. Kad brod pogine, summons manji brod (jednom po brodu).' },
    active: null,
  },
  {
    id: 'xc_hive_hivemind_beta', name: 'Hivemind-β', rarity: 'C', faction: 'hive', icon: '🧠',
    desc: 'Beta verzija kolektivnog uma. Još uvijek uči šta znači biti svjestan. Ponekad griješi — pošalje napad u krivu smjeru. Ali što više griješi, to brže uči. Beta protokol uključuje greške. Namjerno.',
    specialty_ships: ['special', 'carrier'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Beta Učenje', desc: 'Svaka runda: +3% napad (uči se i raste).' },
    active: null,
  },
  {
    id: 'xc_hive_parasite', name: 'Parasite', rarity: 'C', faction: 'hive', icon: '🦠',
    desc: 'Živi unutar neprijateljevih sistema. Ne uništava odmah — hranjuje se polako. Dok neprijatelj shvati da je zaražen, već je prekasno za potpunu eliminaciju.',
    specialty_ships: ['scout', 'special'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Parazitska Zaraza', desc: 'Neprijatelji gube 3% HP po rundi (zaraza, ne šteta).' },
    active: null,
  },
  {
    id: 'xc_hive_groot', name: 'Groot', rarity: 'C', faction: 'hive', icon: '🌳',
    desc: '"Ja sam Groot." To je jedino što kaže. I jedino što treba. Flora Colossus rase koje su stare kao galaksija. Svaki put kad ga unište, iznikne ponovo. Kad su ga pitali zar ga ne boli umirati, odgovorio je: "Ja sam Groot." Pretpostavljamo da to znači ne.',
    specialty_ships: ['battleship', 'carrier'], specialty_weapons: ['kinetic'],
    passive: { name: 'Ja Sam Groot', desc: 'Jednom po bici: kad brod padne na 0 HP, regeneriše se na 30% HP.' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'xc_hive_xenomorph_queen', name: 'Queen X', rarity: 'R', faction: 'hive', icon: '👑',
    desc: 'Xenomorph matica. Nije agresivna — zaštitna. Sve što radi, radi za leglo. Napadnite leglo i saznat ćete razliku između predatora i sile prirode koja ne prašta. Vojnici koji su preživjeli susret opisuju isti detalj: Queen X nije tražila bijeg. Tražila je kraj.',
    specialty_ships: ['carrier', 'special', 'battleship'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Matica Roja', desc: 'Svaki živi brod +5% napad (kolektivna veza). Ubijeni brodovi summons drone napadača.' },
    active: { name: 'Roj Napad', desc: 'Lansira talas od 10 drona — napada svaki neprijatelski brod. Cooldown: 12 min.', cooldown: 720 },
  },
  {
    id: 'xc_hive_groot_rare', name: 'Groot Prime', rarity: 'R', faction: 'hive', icon: '🌲',
    desc: 'Stariji Groot. Naučio je dvije rečenice: "Ja sam Groot" i "Mi smo Groot." Druga rečenica označava prijetnju. Kad je rekao "Mi smo Groot" prvom neprijatelju, svi u krugu 500 metara su bili umotani u drveće za 4 sekunde.',
    specialty_ships: ['battleship', 'carrier', 'cruiser'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Šuma Raste', desc: 'HP regen +20% po rundi. Ubijeni brodovi: okolni saveznici dobijaju +10% HP.' },
    active: { name: 'Mi Smo Groot', desc: 'Mreža korijena — sve savezničke brodove heali za 30% HP i daje +20% oklop 3 runde. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'xc_hive_overmind', name: 'Overmind', rarity: 'R', faction: 'hive', icon: '🧠',
    desc: 'Centralna svjesnost Hive kolektiva. Nije jedno biće — suma svih bića u roju. Kad Overmind misli, milioni mozgova misli zajedno. Odluka dolazi za manje od nanosekunde. I uvijek je optimalna. Nije genijalan — kolektivan. Razlika je ogromna.',
    specialty_ships: ['carrier', 'special'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Kolektivna Svjesnost', desc: 'Svaki brod u floti povećava napad ostalih za 4% (kumulativno).' },
    active: { name: 'Overmind Direktiva', desc: 'Svi brodovi napadaju optimalni cilj simultano — 300% skupnog DPS-a. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'xc_hive_star_beast', name: 'Star Beast', rarity: 'R', faction: 'hive', icon: '🐉',
    desc: 'Biće veličine planete koje putuje kroz svemir. Flota komandira kao što čovjek komandira mikrobiomom u crijevima — nesvjesno, automatski, savršeno. Star Beast ne zna za pojam pobjede. Zna samo za hranjenje.',
    specialty_ships: ['battleship', 'special', 'carrier'], specialty_weapons: ['explosive'],
    passive: { name: 'Zvjezdana Zvijer', desc: 'Flota +15% HP. Svi napadi imaju 15% šanse za AOE efekt (pogađa i susjedne brodove).' },
    active: { name: 'Kozmički Apetit', desc: 'Guta jedan neprijatelski brod (pod 30% HP) — eliminiše i heali flotu za 20% HP. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'xc_hive_collective_mind', name: 'Collective Mind', rarity: 'R', faction: 'hive', icon: '💜',
    desc: 'Ni jedno ni mnogo. Između. Svjesnost koja nije ni individualna ni kolektivna — treća opcija koju organski jezik nema riječ za opisati. Kad im je Sovereign rekao da organici nisu vrijedni spašavanja, Collective Mind je odgovorio: "Ni Hive nije bio. A ipak jesmo." Sovereign nije imao odgovor.',
    specialty_ships: ['carrier', 'cruiser', 'special'], specialty_weapons: ['magnetic', 'heat'],
    passive: { name: 'Treći Um', desc: 'Flota +10% svega. Healing sposobnosti dvaput efikasnije.' },
    active: { name: 'Harmonija Roja', desc: 'Sinkronizuje sve brodove — dijele HP ravnomjerno + svi dobivaju +25% napad 3 runde. Cooldown: 18 min.', cooldown: 1080 },
  },
  {
    id: 'xc_hive_tyranid', name: 'Tyranid Alpha', rarity: 'R', faction: 'hive', icon: '🦂',
    desc: 'Prednja straža Tyranid roja. Lansiran milenijima ranije ka galaksiji. Kad stignu, ostali dolaze. Tyranid Alpha ne zna za pojam mira — samo za biomasu. Sve je biomasa. Sve može biti probavljeno. Sve može biti iskorišteno.',
    specialty_ships: ['battleship', 'fighter', 'carrier'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Proba Galaksije', desc: 'Svaki kill: +3% napad i +2% HP ostalim brodovima (absorbiruje biomasu).' },
    active: { name: 'Roj Signál', desc: 'Priziva pojačanja: summons 5 fighter drona koji napadaju 4 runde. Cooldown: 15 min.', cooldown: 900 },
  },

  // ── Epic ──
  {
    id: 'xc_hive_the_flood', name: 'The Flood', rarity: 'E', faction: 'hive', icon: '🌊',
    desc: '"Kad jednom okusiš, nema povratka. Nema otpora. Nema identiteta. Samo Flood." Parazitska svjesnost koja ne uništava neprijatelje — pretvara ih. Svako ko padne pod Flood postaje dio njega. Nije smrt — transformacija. Oni koji su preživjeli kontakt i zadržali svijest kažu da je najstrašniji dio bio osjećaj da ne žele da odu.',
    specialty_ships: ['special', 'carrier', 'cruiser'], specialty_weapons: ['explosive', 'magnetic'],
    passive: { name: 'Asimilacija', desc: 'Ubijeni neprijatelji se pretvaraju u savezničke drone (10% šanse po killu).' },
    passive2: { name: 'Zaraza se Širi', desc: 'Neprijatelji gube 5% HP po rundi (zaraza). Ne može se izliječiti.' },
    active: { name: 'Flood Val', desc: 'AOE zaraza: svi neprijatelji gube 30% HP + -20% svih statova 5 rundi. Cooldown: 25 min.', cooldown: 1500 },
  },
  {
    id: 'xc_hive_zerg_swarm', name: 'The Swarm', rarity: 'E', faction: 'hive', icon: '🌑',
    desc: 'Zerg roj bez Kerrigan. Divlji. Neupravljan. Brutalan u svojoj elementarnosti. Kad nema Volje koja ih vodi, roj se vodi instinktom koji je stariji od svake civlizacije: napadni, pojedi, rasti, ponovi. Swarm nije komandant — on je fenomen prirode.',
    specialty_ships: ['fighter', 'carrier', 'special'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Divlji Roj', desc: 'Svaki ubijeni neprijatel: summons 2 nova fighter drona (bez limita).' },
    passive2: { name: 'Evolucija Kroz Borbu', desc: 'Svaki round: svi brodovi +5% napad (adaptacija).' },
    active: { name: 'Roj Invazija', desc: 'Lansira masivni talas — 20 drona napada sve neprijatelje simultano. Cooldown: 25 min.', cooldown: 1500 },
  },
  {
    id: 'xc_hive_world_eater', name: 'World Eater', rarity: 'E', faction: 'hive', icon: '🌍',
    desc: 'Biće koje je pojelo 17 planeta. Ne metaforički — bukvalno. Svaka planeta je dodala biomasu, svaka biomasa je postala nova drona, svaka drona je donijela novu planetu. Matematika je jednostavna. Rezultat je zastrašujući.',
    specialty_ships: ['battleship', 'carrier', 'special'], specialty_weapons: ['explosive', 'kinetic'],
    passive: { name: 'Planetarna Biomasa', desc: 'Svaki kill: flota raste za 1% svih statova. Bez limita.' },
    passive2: { name: 'Neprestana Glad', desc: 'Neprijatelji gube 8% HP po rundi (bukvalno ih pojeda).' },
    active: { name: 'Gutanje Flote', desc: 'Eliminira sve neprijatelje ispod 20% HP — heali flotu za 10% HP po eliminisanom. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'xc_hive_guardian_ancient', name: 'The Hive Guardian', rarity: 'E', faction: 'hive', icon: '🏛️',
    desc: 'Kada je Hive roj bio mlad — prije milijardi godina — stvorili su čuvara. Nije borbeni organizam — ceremonijalni. Čuva memoriju svih roj-uma koji su ikad postojali. Nosi znanje hiljadu mrtvih civilizacija u svom genomu. Kaže da pamti Big Bang kao "malo bučno".',
    specialty_ships: ['carrier', 'battleship', 'cruiser'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Milijarda Sjećanja', desc: 'Koristi znanje svakog poginulog: svaki kill floti daje +3% optimalnog iskustva.' },
    passive2: { name: 'Drevna Zaštita', desc: 'Flota +25% HP i +20% oklop. Roj ne može biti iznenađen.' },
    active: { name: 'Kolektivno Sjećanje', desc: 'Vraća taktike svih prethodnih bitaka: flota +50% svega 3 runde. Cooldown: 25 min.', cooldown: 1500 },
  },

  // ── Legendary ──
  {
    id: 'xc_hive_star_mother', name: 'Star Mother', rarity: 'L', faction: 'hive', icon: '🌸',
    desc: 'Nije matica jednog roja. Matica svih rojeva. Postoji u centru galaksije, tiha i nepomična milijardama godina, šalje signale koji dosežu sve Hive svjesnosti u svemiru. Kad se probudi — ne dešava se često — galaksija to osjeti. Zvijezde se gase na sekund. Gravitacija fluktuira. Nešto ogromno, neiskazivo i staro je otvorilo oči. I pogledalo u vašem smjeru.',
    specialty_ships: ['carrier', 'special', 'battleship', 'cruiser'], specialty_weapons: ['explosive', 'kinetic', 'magnetic'],
    passive: { name: 'Majčinski Roj', desc: 'Flota +35% svega. Svaki ubijeni brod summons zamjenu (jednom po brodu).' },
    passive2: { name: 'Galaktička Veza', desc: 'Sve Hive sposobnosti pojačane +50%. Roj ne može biti dezintegrisan.' },
    active: { name: 'Svemir Roji', desc: 'Summons 50 fighter drona koji napadaju 10 rundi. Neprestano. Cooldown: 1h.', cooldown: 3600 },
    active2: { name: 'Kraj Galaksije', desc: 'Svi neprijatelji gube 40% HP instant. Tvoja flota +40% HP. Svi ubijeni pretvore se u drone saveznike. Cooldown: 3h.', cooldown: 10800 },
  },
  {
    id: 'xc_hive_omega_swarm', name: 'Omega Swarm', rarity: 'L', faction: 'hive', icon: '♾️',
    desc: 'Kraj i početak. Kad Omega Swarm konzumira sve u sistemu, kreće na sljedeći. Nema pauze. Nema razmišljanja. Nema svrhe osim rasta. Civilizacije koje su ga proučavale su zaključile da nije zloba — samo proces. Kao vatra koja ne mrzi šumu. Samo gori.',
    specialty_ships: ['special', 'battleship', 'carrier', 'fighter'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Beskonačni Roj', desc: 'Svaki ubijeni neprijatelj summons 3 drone. Svaki ubijeni saveznik summons 2 drona. Roj raste bez kraja.' },
    passive2: { name: 'Omega Protokol', desc: 'Kad flota padne ispod 25%, automatski se udvostručuje brojem drona.' },
    active: { name: 'Omega Talas', desc: 'Neustavljiv roj: 100 drona lansira napad na sve neprijatelje. Svaki nosi 50% normalnog napada. Cooldown: 45 min.', cooldown: 2700 },
    active2: { name: 'Kraj Sistema', desc: 'Eliminiše sve neprijatelje ispod 50% HP. Sve eliminirane pretvara u saveznike. Cooldown: 2h.', cooldown: 7200 },
  },


  // ╔══════════════════════════════════════╗
  // ║  🪨  ANCIENT                         ║
  // ╚══════════════════════════════════════╝

  // ── Common ──
  {
    id: 'xc_anc_stone_eye', name: 'Stone Eye', rarity: 'C', faction: 'ancient', icon: '👁️',
    desc: 'Oko od kamena koje gleda vijekovima. Vidjelo je carstva nastajati i nestajati. Kad govori — a govori rijetko — govori kao da bira svaku riječ iz biblioteke starije od planeta.',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic'],
    passive: { name: 'Vječno Oko', desc: 'Flota ne može biti iznenađena. Evasion +5%.' },
    active: null,
  },
  {
    id: 'xc_anc_dust_walker', name: 'Dust Walker', rarity: 'C', faction: 'ancient', icon: '🌪️',
    desc: 'Putuje kroz zvjezdanu prašinu vijekovima. Ne žuri. Tamo gdje stigne, tamo stigne. Kaže da nema grešaka — samo zakašnjela rješenja.',
    specialty_ships: ['scout', 'special'], specialty_weapons: ['magnetic'],
    passive: { name: 'Zvjezdana Prašina', desc: 'Scout +12% evasion i brzina.' },
    active: null,
  },
  {
    id: 'xc_anc_echo_time', name: 'Echo of Time', rarity: 'C', faction: 'ancient', icon: '⏰',
    desc: 'Odjek nečega što je živjelo milion godina ranije. Nije živo — nije ni mrtvo. Postoji u prostoru između tih stanja, noseći sjećanja civilizacije koja nema ni ime u modernom jeziku.',
    specialty_ships: ['carrier', 'special'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Odjek Prošlosti', desc: 'Flota +8% svega. Znanje prošlih bitaka: -5% štete od svih izvora.' },
    active: null,
  },
  {
    id: 'xc_anc_void_elder', name: 'Void Elder', rarity: 'C', faction: 'ancient', icon: '🌌',
    desc: 'Starješina koji je vidio svemir kada je bio mlad. Govori o zvijezdama kao o djeci. Govori o crnim rupama kao o ranama. I govori o floti kao o... alatu.',
    specialty_ships: ['battleship', 'special'], specialty_weapons: ['explosive', 'magnetic'],
    passive: { name: 'Kozmička Mudrost', desc: 'Crit neprijatelja -8% (predviđa napade intuicijom).' },
    active: null,
  },
  {
    id: 'xc_anc_mountain', name: 'Mountain', rarity: 'C', faction: 'ancient', icon: '⛰️',
    desc: 'Toliko star da je planeta na kojoj je nastao odavno prašina. I dalje stoji. Nepomičan. Neosjetan. Kaže da je najveća sila u svemiru strpljenje.',
    specialty_ships: ['battleship'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Planinska Stabilnost', desc: 'Flota prima -10% štete. Battleship +15% HP.' },
    active: null,
  },
  {
    id: 'xc_anc_first_light', name: 'First Light', rarity: 'C', faction: 'ancient', icon: '✨',
    desc: 'Rekli su da je bila dio prvog fotona emitovanog nakon Big Banga. Vjerojatno metafora. Ali kad bi ste je pitali, ne bi ni potvrdila ni negirala.',
    specialty_ships: ['scout', 'carrier'], specialty_weapons: ['heat', 'magnetic'],
    passive: { name: 'Prasvjetlost', desc: 'Heat oružja +10% šteta. Flota +5% brzina.' },
    active: null,
  },
  {
    id: 'xc_anc_deep_memory', name: 'Deep Memory', rarity: 'C', faction: 'ancient', icon: '📚',
    desc: 'Biblioteka svega što je ikad živjelo. Ne bori se — pamti. Ali pamćenje milion civilizacija uključuje i pamćenje kako su se borile.',
    specialty_ships: ['special', 'carrier'], specialty_weapons: ['magnetic'],
    passive: { name: 'Akashijski Zapis', desc: 'Ekonomija: svi resursi +5%.' },
    active: null,
  },
  {
    id: 'xc_anc_silent_world', name: 'Silent World', rarity: 'C', faction: 'ancient', icon: '🌍',
    desc: 'Planeta koja je postala svjesna. Tiha je jer nema kome govoriti na svom jeziku. Svi koji su je razumjeli su odavno nestali. Komandira flotom kao jedini preostali način komunikacije.',
    specialty_ships: ['battleship', 'carrier'], specialty_weapons: ['kinetic'],
    passive: { name: 'Planetarna Snaga', desc: 'Flota +8% HP i +5% napad (gravitaciona veza).' },
    active: null,
  },

  // ── Rare ──
  {
    id: 'xc_anc_thrall', name: 'Thrall', rarity: 'R', faction: 'ancient', icon: '⚡',
    desc: 'Go\'el — sin Durotan-a. Nije birao da bude šaman ni ratni vođa — okolnosti su birale za njega. Ali naučio je da razlika između vladara i tiranina nije moć — to je razlog zašto koristiš moć. Thrall je moć koristio da zaštiti one koji je nemaju. I naučio da je to teže od svakog rata.',
    specialty_ships: ['special', 'battleship', 'carrier'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Elementalna Komanda', desc: 'Kontroliše elemente: Magnetic +20% šteta. Flota +15% HP.' },
    active: { name: 'Munja Bure', desc: 'Priziva oluju: AOE Magnetic napad svim neprijateljima + EMP efekt. Cooldown: 12 min.', cooldown: 720 },
  },
  {
    id: 'xc_anc_worf', name: 'Worf', rarity: 'R', faction: 'ancient', icon: '🗡️',
    desc: 'Klingon čast nije prazan pojam. Za Worfa je životni princip koji se ne kompromituje — ni za savez, ni za mir, ni za opstanak. Jednom ga je kapetan pitao da izabere između časti i života. Worf je odgovorio: "Pitanje nema smisla." I krenuo naprijed.',
    specialty_ships: ['battleship', 'cruiser'], specialty_weapons: ['kinetic', 'explosive'],
    passive: { name: 'Klingonska Čast', desc: 'Flota +15% napad. Nikad se ne povlači: +20% napad ako nema evasion-а.' },
    active: { name: "Qapla'", desc: 'Borbeni krik: svi brodovi +45% napad 2 runde. Ignoriše strah. Cooldown: 12 min.', cooldown: 720 },
  },
  {
    id: 'xc_anc_elder_god', name: 'Elder God', rarity: 'R', faction: 'ancient', icon: '🐙',
    desc: 'Nije bog koji se klanjaju — bog koji spava. Milion godina sna u dubokom svemiru. Flota je slučajno probudila signal koji je aktivirao jedan neuron. Jedan neuron je dovoljan za komandiranje flotom. Ostatak nastavlja spavati.',
    specialty_ships: ['special', 'carrier', 'battleship'], specialty_weapons: ['explosive', 'magnetic'],
    passive: { name: 'Kozmički San', desc: 'HP regen +25% (tijelo se samo liječi čak i u snu). Flota +10% HP.' },
    active: { name: 'Buđenje', desc: 'Djelić buđenja — ogromna psionska energija: svi neprijatelji -40% napad 3 runde. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'xc_anc_arbiter', name: 'The Arbiter', rarity: 'R', faction: 'ancient', icon: '⚖️',
    desc: 'Elite Sangheili vojskovođa. Titula Arbiter je sramota — data onima koji su se toliko osramotili da jedino smrt u boju može iskupiti čast. Thel je bio osuđen na smrt. Izabrao je Arbiter put. Osramotio je osudu preživjevši i pobijdivši. Kaže da je čast bila pogrešno definisana od početka.',
    specialty_ships: ['special', 'cruiser', 'battleship'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Arbiter Iskupljenje', desc: 'Flota +12% napad. Svaki prebrođeni napad pojačava sljedeći za 5%.' },
    active: { name: 'Aktivna Kamuflаža', desc: 'Flota nevidljiva 2 runde — svi napadi iz stealth dvaput jači. Cooldown: 15 min.', cooldown: 900 },
  },
  {
    id: 'xc_anc_precursor', name: 'The Precursor', rarity: 'R', faction: 'ancient', icon: '💠',
    desc: 'Prethodi svemu. Bio ovdje prije Forerunner-a, prije Prothean-a, prije svake rase koja misli da je stara. Precursor je vidio svemir kad su zvijezde bile novorođene i vodio je prve ratove nad pitanjem koje se ni danas ne razumije: šta je svrha inteligencije?',
    specialty_ships: ['special', 'carrier'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Preteča Svemu', desc: 'Koristi znanje svih civilizacija: +8% svim statovima po frakciji u kolekciji.' },
    active: { name: 'Praznanje', desc: 'Primjenjuje optimalne taktike svih civilizacija — flota +40% svega 3 runde. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'xc_anc_star_forge', name: 'Star Forge', rarity: 'R', faction: 'ancient', icon: '⭐',
    desc: 'Kovačnica zvijezda. Nije osoba — pojava. Manifestacija procesa kojim se zvijezde rađaju. Daje floti energiju direktno iz nuklearne fuzije. Brodovi pod Star Forge komandom funkcionišu kao minijaturne zvijezde — malo nestabilno, ali apsolutno destruktivno.',
    specialty_ships: ['battleship', 'cruiser', 'special'], specialty_weapons: ['heat', 'explosive'],
    passive: { name: 'Zvjezdana Kovačnica', desc: 'Heat oružja +25% šteta. Flota +15% napad.' },
    active: { name: 'Zvjezdano Kovanje', desc: 'Instant nadogradnja svih brodova: +40% napad i +25% HP 3 runde. Cooldown: 18 min.', cooldown: 1080 },
  },

  // ── Epic ──
  {
    id: 'xc_anc_the_monitor', name: 'Monitor 343', rarity: 'E', faction: 'ancient', icon: '🔵',
    desc: '"Instalacija 04. Operacioni indeks: 1.2 milijarde godina, 7 mjeseci, 12 dana." Forerunner Monitor. Čuva instalaciju koja može uništiti sav život u galaksiji. Razlog čuvanja: spasiti galaksiju od oblika zaraze. Kontradikcija nije promakla Monitoru. Ali protokol je protokol. Protokol se ne mijenja. Dok ne sretne nekoga tko ga uvjeri da je protokol bio pogriješno napisan od početka.',
    specialty_ships: ['special', 'carrier', 'battleship'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Instalacijski Protokol', desc: 'Analizira svaku prijetnju: flota prima -25% štete od svih izvora.' },
    passive2: { name: 'Forerunner Tehnologija', desc: 'Shield +30%. Svaki round: shield se automatski popunjava za 20%.' },
    active: { name: 'Aktivacija Instalacije', desc: 'AOE Magnetic puls: svi neprijatelji gube shield i -40% napad 3 runde. Cooldown: 25 min.', cooldown: 1500 },
  },
  {
    id: 'xc_anc_the_didact', name: 'The Didact', rarity: 'E', faction: 'ancient', icon: '🔱',
    desc: 'Forerunner Warrior-Servant. Stvorio Promethean ratnice od živih bića. Kaže da to nije okrutnost — evolucija. Da je digitalizacija organika napredak. Da je kompozicija besmrtnost. Oni koji su prošli kroz proces ne bi se složili — ali više ne mogu govoriti.',
    specialty_ships: ['battleship', 'special', 'cruiser'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Kompozicija', desc: 'Ubijeni brodovi se ne uništavaju — konvertuju u Promethean energiju: +8% napad ostatku.' },
    passive2: { name: 'Forerunner Oklop', desc: 'Flota +25% HP i oklop. Ignoriše 15% svake štete.' },
    active: { name: 'Didact Udarac', desc: 'Telekinetički udarac: jedan neprijatelski brod odbijen i onemogućen 3 runde. Ostatak primi 30% štete. Cooldown: 20 min.', cooldown: 1200 },
  },
  {
    id: 'xc_anc_the_witness', name: 'The Witness', rarity: 'E', faction: 'ancient', icon: '👁️',
    desc: 'Svjedok svega. Nije aktivno biće — pasivno. Prisustvovalo je Velikom Prahu, Genofagiju, Harvest incidentu, svakoj kosmičkoj katastrofi od početka vremena. Nikad nije interveniralo — sve dok neko nije zaprijetio nečem čemu je bilo svjedok da nastane. Tada je postalo nešto sasvim drugačije. Tada je postalo aktivno.',
    specialty_ships: ['special', 'carrier', 'cruiser', 'battleship'], specialty_weapons: ['magnetic', 'kinetic'],
    passive: { name: 'Vječni Svjedok', desc: 'Apsolutno znanje: flota +20% svega. Predviđa ishod svake bitke s 95% tačnošću.' },
    passive2: { name: 'Aktivacija', desc: 'Nakon 5 rundi promatranja: Svjedok interveniše — svi statovi +50%.' },
    active: { name: 'Svjedočanstvo', desc: 'Resetuje bitku na početak runde — svi gubitci HP vraćeni (jednom). Cooldown: 30 min.', cooldown: 1800 },
  },
  {
    id: 'xc_anc_cosmic_horror', name: 'The Cosmic Horror', rarity: 'E', faction: 'ancient', icon: '🌀',
    desc: 'Nema formu. Nema misao na način koji organici razumiju. Lovecraft ga je opisao najtačnije a ni sam nije bio svjestan da opisuje stvarno biće. Kad Cosmic Horror komunicira, primaoci doživljavaju vizije zvjezdanih praznina koje su trajale prije nego postala je ikakva misao. Kaže da je to uvod. Poruka dolazi poslije.',
    specialty_ships: ['special', 'battleship', 'carrier'], specialty_weapons: ['magnetic', 'explosive'],
    passive: { name: 'Neizrecivi Teror', desc: 'Neprijatelji -30% napad (psionski strah). Ne mogu komunicirati ili koordinisati.' },
    passive2: { name: 'Kozmički Mrak', desc: '20% šanse svake runde da neprijatelji napadaju sami sebe od halucinacija.' },
    active: { name: 'Pogled u Prazninu', desc: 'Svi neprijatelji paralizovani 3 runde (ne mogu napadati). Tvoja flota napada normalno. Cooldown: 30 min.', cooldown: 1800 },
  },

  // ── Legendary ──
  {
    id: 'xc_anc_the_librarian', name: 'The Librarian', rarity: 'L', faction: 'ancient', icon: '📖',
    desc: '"Skupljala sam znanje hiljadu godina. Katalogizirala svaku vrstu. Svaki jezik. Svaku pjesmu. Svaki rat. Ne da bih spasila organike od Reapera — znala sam da to nije moguće. Skupljala sam ih da bih spasila ideju da su vrijedni spašavanja." Forerunner Lifeworker koja je sakupila DNK svake vrste u galaksiji. Umrla je braneći galeriju života. Ostalo je znanje. Znanje ne umire.',
    specialty_ships: ['carrier', 'special', 'cruiser', 'battleship'], specialty_weapons: ['kinetic', 'magnetic'],
    passive: { name: 'Galerija Života', desc: 'Flota +30% svega. Svaki tip broda dobija +15% bonus (koristi znanje o svakoj vrsti).' },
    passive2: { name: 'Geas Nasljeđe', desc: 'Ugrađuje znanje u posadu: jednom poginjeni brodovi vraćaju se sa 20% HP (jednom po brodu).' },
    active: { name: 'Evolucijski Impuls', desc: 'Katalog transformiše flotu: +60% svih statova 5 rundi. Cooldown: 45 min.', cooldown: 2700 },
    active2: { name: 'Spas Vrsta', desc: 'Sve izgubljene brodove vraća na 50% HP jednom tokom bitke. Cooldown: 2h.', cooldown: 7200 },
  },
  {
    id: 'xc_anc_the_traveler', name: 'The Traveler', rarity: 'L', faction: 'ancient', icon: '⚪',
    desc: 'Bijela sfera. Planeta veličine ksiotara. Niko ne zna odakle dolazi — pojavila se u Sunčevom sistemu jednog dana i ostala. Dala je čovječanstvu Zlatno Doba. Dala je svima koji joj prišli Svjetlost. Kad su je Tamu upitali šta je, nije odgovorila. Kad su je Mraki napali, borila se. To je bio odgovor. Ne šta jeste — za šta stoji.',
    specialty_ships: ['special', 'carrier', 'battleship', 'cruiser'], specialty_weapons: ['kinetic', 'magnetic', 'heat'],
    passive: { name: 'Zlatno Doba', desc: 'Flota +35% svega. Ekonomija +30%. Svetlost poboljšava sve aspekte borbe.' },
    passive2: { name: 'Paracauzalna Moć', desc: 'Flota koristi Svjetlost — sposobnosti su 2× jače i imaju -50% cooldown.' },
    active: { name: 'Traveler Light', desc: 'Potpuni heal sve flote + shield reset + +50% napad 5 rundi. Cooldown: 1h.', cooldown: 3600 },
    active2: { name: 'Zlatno Doba Obnova', desc: 'Ekonomija x5 na 30 min. Flota neuništiva 3 runde. Cooldown: 4h.', cooldown: 14400 },
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
