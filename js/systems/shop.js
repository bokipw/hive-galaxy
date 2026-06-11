// ============================================================
// HIVE GALAXY — js/systems/shop.js
// tab: 'hive' = HIVE/HBD/BCM plaćanje
// tab: 'email' = BTC/USDT/LTC plaćanje
// tab: 'both' = pojavljuje se u oba taba
// ============================================================

const SHOP_ITEMS = [
  {
    id: 'premium',
    category: 'premium',
    tab: 'both',
    name: 'PREMIUM STATUS',
    icon: '⭐',
    color: '#ffcc44',
    desc: 'Otključaj blockchain zarade, BPW tokene, BCM i ekskluzivni sadržaj. Jednokratno — doživotno.',
    price: '10€',
    priceLabel: 'Jednokratno · Doživotno',
    perks: [
      '✓ BPW token zarade iz misija i instance',
      '✓ BCM i BoCrypto token pristup',
      '✓ Ekskluzivni Premium commander pack',
      '✓ +20% XP bonus na sve aktivnosti',
      '✓ Premium badge na leaderboardu',
    ],
    cryptosHive:  [
      { name: 'BCM (HIVE)', symbol: 'BCM', icon: '⛏️' },
      { name: 'HBD', symbol: 'HBD', icon: '🟡' },
      { name: 'HIVE', symbol: 'HIVE', icon: '⛓️' },
    ],
    cryptosEmail: [
      { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
      { name: 'USDT', symbol: 'USDT', icon: '💵' },
      { name: 'Litecoin', symbol: 'LTC', icon: 'Ł' },
    ],
    action: 'buyPremium',
  },

  // ── KLJUČEVI KOMANDIRA ──
  {
    id: 'keys_5',
    category: 'keys',
    tab: 'email',
    name: '5 KLJUČEVA',
    icon: '🗝️',
    color: '#00d4ff',
    desc: 'Otvori 5 paketa komandira. Svaki ključ = 1 otvaranje paketa.',
    price: '2.5€',
    priceLabel: '0.5€ po ključu',
    perks: [
      '5× otvaranje paketa komandira',
      'Šansa za Legendary komandira',
      'Pity sistem — 90 ključeva garantuje Legendary',
    ],
    cryptosEmail: [
      { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
      { name: 'USDT', symbol: 'USDT', icon: '💵' },
    ],
    action: 'buyKeys',
    amount: 5,
  },
  {
    id: 'keys_20',
    category: 'keys',
    tab: 'both',
    name: '20 KLJUČEVA',
    icon: '🗝️🗝️',
    color: '#00d4ff',
    badge: 'NAJPOPULARNIJE',
    badgeColor: '#00ff88',
    desc: 'Optimalna vrijednost. 20 paketa odjednom — veća šansa za Legendary.',
    price: '8€',
    priceLabel: '0.40€ po ključu · Uštedi 20%',
    perks: [
      '20× otvaranje paketa komandira',
      'Garantovano 1× Epic ili bolje na 10',
      'Pity sistem aktivniji sa više otvaranja',
    ],
    cryptosHive:  [
      { name: 'HBD', symbol: 'HBD', icon: '🟡' },
      { name: 'HIVE', symbol: 'HIVE', icon: '⛓️' },
    ],
    cryptosEmail: [
      { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
      { name: 'USDT', symbol: 'USDT', icon: '💵' },
    ],
    action: 'buyKeys',
    amount: 20,
  },
  {
    id: 'keys_100',
    category: 'keys',
    tab: 'both',
    name: '100 KLJUČEVA',
    icon: '💰',
    color: '#ffcc44',
    badge: 'BEST VALUE',
    badgeColor: '#ffcc44',
    desc: 'Hardcore paket. Garantovano više Legendary komandira kroz pity sistem.',
    price: '35€',
    priceLabel: '0.35€ po ključu · Uštedi 30%',
    perks: [
      '100× otvaranje paketa komandira',
      'Garantovano 1× Legendary kroz pity',
      'Maksimalna vrijednost za kolekcionare',
    ],
    cryptosHive:  [
      { name: 'HBD', symbol: 'HBD', icon: '🟡' },
      { name: 'HIVE', symbol: 'HIVE', icon: '⛓️' },
    ],
    cryptosEmail: [
      { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
      { name: 'USDT', symbol: 'USDT', icon: '💵' },
    ],
    action: 'buyKeys',
    amount: 100,
  },

  // ── BOOSTERS ──
  {
    id: 'boost_exp',
    category: 'boosters',
    tab: 'both',
    name: '100% EXP BOOST',
    icon: '⚡',
    color: '#ffcc44',
    badge: '1 MJESEC',
    badgeColor: '#ffcc44',
    desc: 'Duplo brži XP na sve aktivnosti — misije, instance, PvP, kolonije. Traje 30 dana.',
    price: '10€ / 1 BCM',
    priceLabel: '30 dana · Aktivira se odmah',
    perks: [
      '+100% XP iz misija',
      '+100% XP iz instanci',
      '+100% XP iz PvP borbi',
      '+100% XP iz kolonija',
      'Stacka se sa Premium bonusom',
    ],
    cryptosHive:  [
      { name: 'BCM (HIVE)', symbol: 'BCM', icon: '⛏️' },
      { name: 'HBD', symbol: 'HBD', icon: '🟡' },
      { name: 'HIVE', symbol: 'HIVE', icon: '⛓️' },
    ],
    cryptosEmail: [
      { name: 'USDT', symbol: 'USDT', icon: '💵' },
      { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
    ],
    action: 'buyBooster',
  },
  {
    id: 'boost_mining',
    category: 'boosters',
    tab: 'both',
    name: '100% MINING BOOST',
    icon: '⛏️',
    color: '#00ff88',
    badge: '1 MJESEC',
    badgeColor: '#00ff88',
    desc: 'Dupla produkcija metala, kristala i He3 iz svih izvora. Traje 30 dana.',
    price: '10€ / 1 BCM',
    priceLabel: '30 dana · Aktivira se odmah',
    perks: [
      '+100% Metal produkcija',
      '+100% Crystal produkcija',
      '+100% He3 produkcija',
      'Važi za bazu i sve kolonije',
      'Stacka se sa building bonusima',
    ],
    cryptosHive:  [
      { name: 'BCM (HIVE)', symbol: 'BCM', icon: '⛏️' },
      { name: 'HBD', symbol: 'HBD', icon: '🟡' },
      { name: 'HIVE', symbol: 'HIVE', icon: '⛓️' },
    ],
    cryptosEmail: [
      { name: 'USDT', symbol: 'USDT', icon: '💵' },
      { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
    ],
    action: 'buyBooster',
  },

  // ── PAKETI ──
  {
    id: 'vip_commander_pack',
    category: 'paketi',
    tab: 'both',
    name: 'VIP COMMANDER PACK',
    icon: '👑',
    color: '#ff44aa',
    badge: 'GARANTOVANO EPIC',
    badgeColor: '#ff44aa',
    desc: 'Garantovano 3 Epic komandira u jednom paketu. Ekskluzivno za premium igrače.',
    price: '20€ / 2 BCM',
    priceLabel: 'Jednokratno · Instant isporuka',
    perks: [
      '3× garantovano Epic komandiri',
      'Šansa da jedan bude Legendary',
      'Ekskluzivni komandiri nedostupni iz ključeva',
      'Direktno u tvoju kolekciju',
    ],
    cryptosHive:  [
      { name: 'BCM (HIVE)', symbol: 'BCM', icon: '⛏️' },
      { name: 'HBD', symbol: 'HBD', icon: '🟡' },
      { name: 'HIVE', symbol: 'HIVE', icon: '⛓️' },
    ],
    cryptosEmail: [
      { name: 'USDT', symbol: 'USDT', icon: '💵' },
      { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
    ],
    action: 'buyPack',
  },
  {
    id: 'booster_bundle',
    category: 'paketi',
    tab: 'both',
    name: 'BOOSTER BUNDLE',
    icon: '🚀',
    color: '#00d4ff',
    badge: '3 U 1 · 30 DANA',
    badgeColor: '#00d4ff',
    desc: 'Tri boostera u jednom paketu — maksimalna efikasnost za 30 dana.',
    price: '10€ / 1 BCM',
    priceLabel: '30 dana · Aktivira se odmah',
    perks: [
      '−50% He3 potrošnja (gorivo na pola)',
      '+1 extra misija dnevno',
      '2× drop šansa u instancama',
      'Sve tri prednosti odjednom',
    ],
    cryptosHive:  [
      { name: 'BCM (HIVE)', symbol: 'BCM', icon: '⛏️' },
      { name: 'HBD', symbol: 'HBD', icon: '🟡' },
      { name: 'HIVE', symbol: 'HIVE', icon: '⛓️' },
    ],
    cryptosEmail: [
      { name: 'USDT', symbol: 'USDT', icon: '💵' },
      { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
    ],
    action: 'buyBooster',
  },

  // ── INSTANCE KLJUČEVI ──
  {
    id: 'ikeys_100',
    category: 'ikeys',
    tab: 'email',
    name: '100 INSTANCE KLJUČEVA',
    icon: '🔑',
    color: '#00ff88',
    desc: 'Ulaz u instance — bitke za rijetke blueprinte i komandire.',
    price: '2€',
    priceLabel: '0.02€ po ključu',
    perks: [
      '100× ulaz u instance',
      'Instance dropaju rijetke blueprinte',
      'Šansa za Epic/Legendary komandira',
    ],
    cryptosEmail: [
      { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
      { name: 'USDT', symbol: 'USDT', icon: '💵' },
    ],
    action: 'buyIKeys',
    amount: 100,
  },
  {
    id: 'ikeys_400',
    category: 'ikeys',
    tab: 'both',
    name: '400 INSTANCE KLJUČEVA',
    icon: '🔑🔑',
    color: '#00ff88',
    badge: 'NAJPOPULARNIJE',
    badgeColor: '#00ff88',
    desc: 'Optimalna vrijednost. 400 ulaza u instance po super cijeni.',
    price: '5€',
    priceLabel: '0.0125€ po ključu · Uštedi 37%',
    perks: [
      '400× ulaz u instance',
      'Garantovano više Epic dropova',
      'Idealno za farm blueprintova',
    ],
    cryptosHive:  [
      { name: 'HBD', symbol: 'HBD', icon: '🟡' },
      { name: 'HIVE', symbol: 'HIVE', icon: '⛓️' },
    ],
    cryptosEmail: [
      { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
      { name: 'USDT', symbol: 'USDT', icon: '💵' },
    ],
    action: 'buyIKeys',
    amount: 400,
  },
  {
    id: 'ikeys_1000',
    category: 'ikeys',
    tab: 'hive',
    name: '1000 INSTANCE KLJUČEVA',
    icon: '💎',
    color: '#ff44aa',
    badge: 'BCM SPECIAL',
    badgeColor: '#ff44aa',
    desc: '1000 instance ključeva za cijenu 1 BCM tokena (BoCrypto Miner). Ekskluzivna HIVE ponuda.',
    price: '10€ / 1 BCM',
    priceLabel: '0.01€ po ključu · Best Value',
    perks: [
      '1000× ulaz u instance',
      'Plati sa 1 BCM tokenom',
      'BCM = BoCrypto Miner token na HIVE',
      'Maksimalan farm potencijal',
    ],
    cryptosHive: [
      { name: 'BCM (HIVE)', symbol: 'BCM', icon: '⛏️' },
      { name: 'HBD', symbol: 'HBD', icon: '🟡' },
    ],
    action: 'buyIKeys',
    amount: 1000,
  },

  // ── OSTALO ──
  {
    id: 'rename',
    category: 'ostalo',
    tab: 'email',
    name: 'PROMJENA IMENA',
    icon: '✏️',
    color: '#aaaaaa',
    desc: 'Promijeni svoje display ime u igri. Samo za email igrače — HIVE username se ne može mijenjati.',
    price: '10€',
    priceLabel: 'Jednokratno · Samo email igrači',
    perks: [
      'Novo display ime na leaderboardu',
      'Novo ime vidljivo svim igračima',
      '⚠️ Nije dostupno za HIVE Keychain igrače',
      '⚠️ HIVE username je permanentan na blockchainu',
    ],
    cryptosEmail: [
      { name: 'USDT', symbol: 'USDT', icon: '💵' },
      { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
    ],
    action: 'buyRename',
  },
];

// ── Aktivan tab ──
let _shopTab = 'hive';

function renderShop() {
  const el = document.getElementById('shopContent');
  if (!el) return;

  const isPremium = window._playerPremium || false;
  const t = _shopTab;

  const filter = item => item.tab === 'both' || item.tab === t;

  const premiumItems = SHOP_ITEMS.filter(i => i.category === 'premium'  && filter(i));
  const keyItems     = SHOP_ITEMS.filter(i => i.category === 'keys'     && filter(i));
  const boosterItems = SHOP_ITEMS.filter(i => i.category === 'boosters' && filter(i));
  const paketiItems  = SHOP_ITEMS.filter(i => i.category === 'paketi'   && filter(i));
  const ikeyItems    = SHOP_ITEMS.filter(i => i.category === 'ikeys'    && filter(i));
  const ostaloItems  = SHOP_ITEMS.filter(i => i.category === 'ostalo'   && filter(i));

  const tabBtn = (id, label, icon) => {
    const active = _shopTab === id;
    return `<button onclick="_shopTab='${id}';renderShop()" style="
      flex:1;padding:10px;border-radius:8px;border:1px solid ${active ? (id==='hive' ? '#00d4ff' : '#ffcc44') : 'rgba(255,255,255,0.1)'};
      background:${active ? (id==='hive' ? 'rgba(0,212,255,0.1)' : 'rgba(255,204,68,0.1)') : 'rgba(0,0,0,0.2)'};
      color:${active ? (id==='hive' ? '#00d4ff' : '#ffcc44') : '#6a90b8'};
      font-family:'Orbitron',monospace;font-size:0.65rem;font-weight:700;letter-spacing:1px;cursor:pointer">
      ${icon} ${label}
    </button>`;
  };

  el.innerHTML = `
    <!-- Status bar -->
    <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;margin-bottom:16px;
      border-radius:8px;background:${isPremium ? 'rgba(255,204,68,0.08)' : 'rgba(0,0,0,0.2)'};
      border:1px solid ${isPremium ? 'rgba(255,204,68,0.3)' : 'rgba(255,255,255,0.07)'}">
      <div style="font-size:1.8rem">${isPremium ? '⭐' : '🎮'}</div>
      <div>
        <div style="font-size:0.72rem;font-weight:700;color:${isPremium ? '#ffcc44' : '#c0d8f0'}">
          ${isPremium ? 'PREMIUM IGRAČ' : 'FREE IGRAČ'}
        </div>
        <div style="font-size:0.6rem;color:#6a90b8">
          ${isPremium ? 'Imaš pristup svim premium funkcijama i blockchain zaradama.' : 'Nadogradi na Premium za blockchain zarade i ekskluzivni sadržaj.'}
        </div>
      </div>
      ${isPremium ? `<div style="margin-left:auto;font-size:0.55rem;color:#ffcc44;
        font-family:'Orbitron',monospace;border:1px solid #ffcc4444;padding:3px 10px;border-radius:4px">
        ✓ AKTIVAN</div>` : ''}
    </div>

    <!-- Tabovi -->
    <div style="display:flex;gap:8px;margin-bottom:24px">
      ${tabBtn('hive',  'HIVE SHOP',  '⛓️')}
      ${tabBtn('email', 'EMAIL SHOP', '📧')}
    </div>

    <!-- Info o tabu -->
    <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:20px;padding:10px 14px;
      border-radius:6px;background:rgba(0,0,0,0.15);border-left:3px solid ${t==='hive' ? '#00d4ff' : '#ffcc44'}">
      ${t === 'hive'
        ? '⛓️ <strong style="color:#00d4ff">HIVE Shop</strong> — plaćanje putem HIVE Keychain: HBD, HIVE ili BCM token. Transakcije na blockchain — brzo i sigurno.'
        : '📧 <strong style="color:#ffcc44">Email Shop</strong> — plaćanje putem Bitcoin, USDT ili Litecoin. Ručna verifikacija 10–30 min nakon uplate.'}
    </div>

    <!-- Premium sekcija -->
    ${!isPremium ? `
    <div style="font-size:0.6rem;color:#ffcc44;font-family:'Orbitron',monospace;
      letter-spacing:2px;margin-bottom:12px">⭐ PREMIUM STATUS</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-bottom:28px">
      ${premiumItems.map(item => renderShopCard(item, t)).join('')}
    </div>` : ''}

    <!-- Specijalni paketi -->
    ${paketiItems.length ? `
    <div style="font-size:0.6rem;color:#ff44aa;font-family:'Orbitron',monospace;
      letter-spacing:2px;margin-bottom:12px">🚀 SPECIJALNI PAKETI</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-bottom:28px">
      ${paketiItems.map(item => renderShopCard(item, t)).join('')}
    </div>` : ''}

    <!-- Boosters -->
    ${boosterItems.length ? `
    <div style="font-size:0.6rem;color:#ffcc44;font-family:'Orbitron',monospace;
      letter-spacing:2px;margin-bottom:12px">⚡ BOOSTERS — 30 DANA</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-bottom:28px">
      ${boosterItems.map(item => renderShopCard(item, t)).join('')}
    </div>` : ''}

    <!-- Ključevi komandira -->
    ${keyItems.length ? `
    <div style="font-size:0.6rem;color:#00d4ff;font-family:'Orbitron',monospace;
      letter-spacing:2px;margin-bottom:12px">🗝️ KLJUČEVI KOMANDIRA</div>
    <div style="font-size:0.75rem;color:#6a90b8;margin-bottom:14px">
      Trenutno imaš: <strong style="color:white">${fmt(R.keys || 0)} 🗝️</strong> ključeva
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-bottom:28px">
      ${keyItems.map(item => renderShopCard(item, t)).join('')}
    </div>` : ''}

    <!-- Instance ključevi -->
    ${ikeyItems.length ? `
    <div style="font-size:0.6rem;color:#00ff88;font-family:'Orbitron',monospace;
      letter-spacing:2px;margin-bottom:12px">🔑 INSTANCE KLJUČEVI</div>
    <div style="font-size:0.75rem;color:#6a90b8;margin-bottom:14px">
      Trenutno imaš: <strong style="color:white">${fmt(R.instanceKeys || 0)} 🔑</strong> instance ključeva
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-bottom:28px">
      ${ikeyItems.map(item => renderShopCard(item, t)).join('')}
    </div>` : ''}

    <!-- Ostalo -->
    ${ostaloItems.length ? `
    <div style="font-size:0.6rem;color:#aaaaaa;font-family:'Orbitron',monospace;
      letter-spacing:2px;margin-bottom:12px">✏️ OSTALO</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-bottom:28px">
      ${ostaloItems.map(item => renderShopCard(item, t)).join('')}
    </div>` : ''}

    <!-- Info -->
    <div style="margin-top:8px;padding:14px;background:rgba(0,0,0,0.2);border-radius:8px;
      border:1px solid rgba(255,255,255,0.05);font-size:0.68rem;color:#6a90b8;line-height:1.8">
      💡 <strong style="color:#c0d8f0">Kako platiti?</strong><br>
      ${t === 'hive'
        ? 'Klikni "Kupi" → odaberi token → pošalji tačan iznos na <strong style="color:#c0d8f0">bokica80</strong> sa memo-om.<br><span style="color:#ffcc44">⚠️ Memo je obavezan — bez njega uplata ne može biti identificirana!</span>'
        : 'Klikni "Kupi" → odaberi kriptovalutu → dobij adresu → pošalji tačan iznos.<br>Nakon potvrde transakcije (10–30 min) tvoj nalog se ažurira.<br><span style="color:#ffcc44">⚠️ Šalji tačan iznos na ispravnu adresu. Transakcije su nepovratne.</span>'}
    </div>
  `;
}

function renderShopCard(item, activeTab) {
  const rc = item.color || '#00d4ff';
  const cryptos = activeTab === 'hive'
    ? (item.cryptosHive  || [])
    : (item.cryptosEmail || []);
  return `
    <div style="border-radius:10px;border:1px solid ${rc}33;background:rgba(0,0,0,0.3);
      padding:18px;position:relative;transition:border-color 0.2s"
      onmouseenter="this.style.borderColor='${rc}77'"
      onmouseleave="this.style.borderColor='${rc}33'">
      ${item.badge ? `<div style="position:absolute;top:10px;right:10px;font-size:0.5rem;
        font-family:'Orbitron',monospace;letter-spacing:1px;padding:2px 8px;border-radius:3px;
        background:${item.badgeColor}22;color:${item.badgeColor};border:1px solid ${item.badgeColor}44">
        ${item.badge}</div>` : ''}
      <div style="font-size:2rem;margin-bottom:8px">${item.icon}</div>
      <div style="font-size:0.75rem;font-weight:700;color:${rc};font-family:'Orbitron',monospace;
        margin-bottom:4px;letter-spacing:1px">${item.name}</div>
      <div style="font-size:0.68rem;color:#6a90b8;margin-bottom:12px;line-height:1.5">${item.desc}</div>
      <ul style="list-style:none;margin-bottom:14px">
        ${item.perks.map(p => `<li style="font-size:0.62rem;color:#6a90b8;padding:2px 0;
          border-bottom:1px solid rgba(255,255,255,0.03)">${p}</li>`).join('')}
      </ul>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div>
          <div style="font-size:1rem;font-weight:700;color:${rc};font-family:'Orbitron',monospace">${item.price}</div>
          <div style="font-size:0.55rem;color:#6a90b8">${item.priceLabel}</div>
        </div>
        <div style="display:flex;gap:4px">
          ${cryptos.map(c => `<span title="${c.name}" style="font-size:0.9rem;opacity:0.7">${c.icon}</span>`).join('')}
        </div>
      </div>
      <button class="btn btn-g" style="width:100%;font-size:0.68rem"
        onclick="openShopPurchase('${item.id}')">
        💎 KUPI
      </button>
    </div>`;
}

function openShopPurchase(itemId) {
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  const cryptos = _shopTab === 'hive'
    ? (item.cryptosHive  || [])
    : (item.cryptosEmail || []);

  const cryptoButtons = cryptos.map(c => `
    <button class="btn" style="flex:1;font-size:0.65rem;padding:8px 6px"
      onclick="closeModal();showCryptoPayment('${itemId}','${c.symbol}')">
      ${c.icon} ${c.symbol}
    </button>`).join('');

  openModal(
    `${item.icon} ${item.name}`,
    `<div style="font-size:0.75rem;color:#6a90b8;margin-bottom:16px">${item.desc}</div>
    <div style="font-size:0.8rem;color:#c0d8f0;margin-bottom:6px">Cijena: <strong style="color:${item.color}">${item.price}</strong></div>
    <div style="font-size:0.7rem;color:#6a90b8;margin-bottom:16px">Odaberi metodu plaćanja:</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">${cryptoButtons}</div>`,
    [{ label: 'Otkaži', cls: '', fn: closeModal }]
  );
}

function showCryptoPayment(itemId, symbol) {
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  const addresses = {
    BTC:  'bc1q_TVOJA_BTC_ADRESA',
    USDT: '0x_TVOJA_USDT_ADRESA',
    LTC:  'ltc1q_TVOJA_LTC_ADRESA',
    HBD:  'bokica80',
    HIVE: 'bokica80',
    BCM:  'bokica80',
  };

  const addr = addresses[symbol] || '—';
  const isHive = symbol === 'HBD' || symbol === 'HIVE' || symbol === 'BCM';
  const memo = isHive ? `HIVEGALAXY_${item.id}_${Date.now()}` : null;

  openModal(
    `💳 Plaćanje — ${symbol}`,
    `<div style="font-size:0.72rem;color:#6a90b8;margin-bottom:14px">
      Šalji tačno <strong style="color:${item.color}">${item.price}</strong> u ${symbol} na adresu ispod.
    </div>
    <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);border-radius:6px;
      padding:12px;margin-bottom:12px;word-break:break-all">
      <div style="font-size:0.55rem;color:#6a90b8;margin-bottom:4px;font-family:'Orbitron',monospace">
        ${isHive ? 'HIVE KORISNIČKO IME' : `${symbol} ADRESA`}
      </div>
      <div style="font-size:0.8rem;color:#00d4ff;font-family:'Share Tech Mono',monospace">${addr}</div>
    </div>
    ${memo ? `<div style="background:rgba(255,204,68,0.08);border:1px solid rgba(255,204,68,0.2);
      border-radius:6px;padding:12px;margin-bottom:12px">
      <div style="font-size:0.55rem;color:#ffcc44;margin-bottom:4px;font-family:'Orbitron',monospace">MEMO (OBAVEZNO!)</div>
      <div style="font-size:0.75rem;color:#ffcc44;font-family:'Share Tech Mono',monospace">${memo}</div>
      <div style="font-size:0.6rem;color:#6a90b8;margin-top:4px">⚠️ Bez memoa ne možemo identifikovati tvoju uplatu!</div>
    </div>` : ''}
    <div style="font-size:0.65rem;color:#6a90b8;line-height:1.7">
      ⏱ Nakon slanja transakcije čekaj 10–30 minuta.<br>
      ✉️ Tvoj nalog će biti automatski ažuriran.
    </div>`,
    [{ label: '✓ Poslao sam uplatu', cls: 'btn-g', fn: () => { closeModal(); toast('Hvala! Nalog će biti ažuriran čim se transakcija potvrdi.', 'ok'); } },
     { label: 'Otkaži', cls: '', fn: closeModal }]
  );
}
