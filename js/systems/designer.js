// ============================================================
// HIVE GALAXY — js/systems/designer.js
// Ship Designer — sa vizuelnim prikazom slotova
// ============================================================

function genDesignId() {
  return 'design_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

// ── SLOT SISTEM ZA DIZAJNE ──
// Cijena svakog paketa od +10 slotova (počinje od 25k, dupla cijena svaki put)
const DESIGN_SLOT_PACKAGES = [
  { slots: 10, price: 25000 },
  { slots: 10, price: 50000 },
  { slots: 10, price: 100000 },
  { slots: 10, price: 200000 },
  { slots: 10, price: 400000 },
  { slots: 10, price: 800000 },
  { slots: 10, price: 1600000 },
  { slots: 10, price: 3200000 },
  { slots: 10, price: 6400000 },
];
const DESIGN_SLOTS_FREE = 10;
const DESIGN_SLOTS_MAX  = 100;

function getMaxDesignSlots() {
  return Math.min(DESIGN_SLOTS_MAX, DESIGN_SLOTS_FREE + (window._designExtraSlots || 0));
}

function buyDesignSlots() {
  const current = getMaxDesignSlots();
  if (current >= DESIGN_SLOTS_MAX) {
    toast('✅ Već imaš maksimum od 100 slotova!', 'ok');
    return;
  }
  const bought = window._designSlotsBought || 0; // koliko paketa je već kupljeno
  const nextPkg = DESIGN_SLOT_PACKAGES[bought];
  if (!nextPkg) { toast('✅ Maksimum slotova dostupno!', 'ok'); return; }

  const bpw = R.spCard || 0;
  const canAffordIt = bpw >= nextPkg.price;

  const body = `
    <div style="margin-bottom:14px">
      <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:8px">Trenutni slotovi: <strong style="color:white">${current} / ${DESIGN_SLOTS_MAX}</strong></div>
      <div style="background:rgba(255,204,68,0.06);border:1px solid rgba(255,204,68,0.2);border-radius:6px;padding:10px;margin-bottom:10px">
        <div style="font-size:0.8rem;font-weight:700;color:#ffcc44;margin-bottom:4px">📦 Sljedeći paket: +10 slotova</div>
        <div style="font-size:0.72rem;color:#6a90b8">Novi total: <strong style="color:white">${current + nextPkg.slots} slotova</strong></div>
        <div style="font-size:0.82rem;color:#ffcc44;margin-top:6px">💰 Cijena: <strong>${nextPkg.price.toLocaleString()} BPW</strong></div>
        <div style="font-size:0.68rem;color:${canAffordIt ? '#00ff88' : '#ff4444'};margin-top:4px">
          ${canAffordIt ? '✅ Možeš kupiti' : `❌ Nemaš dovoljno BPW (imaš: ${bpw.toLocaleString()})`}
        </div>
      </div>
      <div style="font-size:0.65rem;color:#3a5070">
        ${DESIGN_SLOT_PACKAGES.slice(bought+1, bought+4).map((p, i) =>
          `Paket ${bought+i+2}: +10 slotova za ${p.price.toLocaleString()} BPW`
        ).join('<br>')}
        ${bought + 4 < DESIGN_SLOT_PACKAGES.length ? '<br>...' : ''}
      </div>
    </div>`;

  openModal('📋 Kupi slotove za dizajne', body, [
    {
      label: `💰 Kupi za ${nextPkg.price.toLocaleString()} BPW`,
      cls: canAffordIt ? 'btn-gold' : 'btn',
      fn: () => {
        if (!canAffordIt) { toast('❌ Nedovoljno BPW!', 'err'); return; }
        R.spCard = (R.spCard || 0) - nextPkg.price;
        window._designExtraSlots = (window._designExtraSlots || 0) + nextPkg.slots;
        window._designSlotsBought = (window._designSlotsBought || 0) + 1;
        closeModal();
        updateResUI();
        saveGame();
        renderDesigner();
        toast(`✅ +10 slotova za dizajne! Ukupno: ${getMaxDesignSlots()}`, 'ok');
      }
    },
    { label: 'Zatvori', fn: closeModal }
  ]);
}

// ── SLOTOVI PO KLASI ──
function getClassSlots(cls) {
  const s = SHIP_CLASSES[cls]?.slots || {};
  return {
    weapon:  typeof s.weapon  === 'number' ? s.weapon  : 4,
    shield:  typeof s.shield  === 'number' ? s.shield  : 1,
    engine:  s.engine  || 1,
    recon:   s.recon   || 0,
    special: typeof s.special === 'number' ? s.special : 0,
    module:  s.module  || 0,
  };
}

// ── IZRAČUNAJ SVE STATISTIKE ZA JEDAN BROD IZ DIZAJNA ──
function calcDesignStats(design) {
  const ship = getShipById(design.ship_id);
  if (!ship) return { shield: 0, hp: 0, speed: 0, dps: 0, armor: 0, structure: 0 };

  let totalShield = ship.shield || 0;
  for (let i = 1; i <= 3; i++) {
    const sid = design[`shield_${i}`];
    if (sid) {
      const sh = getShieldById(sid);
      if (sh) totalShield += sh.shield;
    }
  }

  const totalHP = (ship.armor_val || 0) + totalShield + (ship.structure || 0);

  let speed = ship.movement || 0;
  const engineId = design.engine_1;
  if (engineId) {
    const eng = getEngineById(engineId);
    if (eng && eng.speed) speed += eng.speed;
  }

  let dps = 0;
  for (let i = 1; i <= 4; i++) {
    const wid = design[`weapon_${i}`];
    if (wid) {
      const wpn = getWeaponById(wid);
      if (wpn) dps += wpn.dps;
    }
  }

  return { shield: totalShield, hp: totalHP, speed: speed, dps: dps, armor: ship.armor_val || 0, structure: ship.structure || 0 };
}

// ── RENDER DESIGNER PANELA ──
function renderDesigner() {
  const el = document.getElementById('designerContent');
  if (!el) return;
  el.innerHTML = `
    <div class="page-title" style="font-size:0.85rem;margin-bottom:12px">🔧 DIZAJNER BRODOVA</div>
    <div class="card" id="designerForm" style="margin-bottom:16px">${renderDesignerForm()}</div>
    <div class="page-title" style="font-size:0.85rem;margin-bottom:12px">📋 MOJI DIZAJNI (${shipDesigns.length})</div>
    <div id="designList">${renderDesignList()}</div>
  `;
}

// ── SVG SILUETE PO KLASI BRODA ──
const SHIP_SVG = {
  scout: (c) => `
    <!-- SCOUT: mali, šiljasti, aerodinamičan -->
    <polygon points="100,8 118,55 130,70 118,85 100,142 82,85 70,70 82,55" fill="${c}08" stroke="${c}" stroke-width="1.5"/>
    <polygon points="100,20 112,52 120,65 112,78 100,125 88,78 80,65 88,52" fill="${c}06" stroke="${c}" stroke-width="1" opacity="0.5"/>
    <line x1="100" y1="8" x2="100" y2="142" stroke="${c}" stroke-width="0.8" opacity="0.25"/>
    <!-- Krila -->
    <polygon points="82,55 40,45 38,72 70,70" fill="${c}10" stroke="${c}" stroke-width="1" opacity="0.7"/>
    <polygon points="118,55 160,45 162,72 130,70" fill="${c}10" stroke="${c}" stroke-width="1" opacity="0.7"/>
    <!-- Motori -->
    <ellipse cx="88" cy="128" rx="7" ry="4" fill="${c}30" stroke="${c}" stroke-width="1"/>
    <ellipse cx="112" cy="128" rx="7" ry="4" fill="${c}30" stroke="${c}" stroke-width="1"/>`,

  fighter: (c) => `
    <!-- FIGHTER: kompaktan borbeni, kratka krila -->
    <polygon points="100,10 125,45 140,80 130,110 100,138 70,110 60,80 75,45" fill="${c}08" stroke="${c}" stroke-width="1.5"/>
    <polygon points="100,22 118,50 130,80 122,105 100,128 78,105 70,80 82,50" fill="${c}05" stroke="${c}" stroke-width="1" opacity="0.5"/>
    <!-- Kabina -->
    <ellipse cx="100" cy="42" rx="12" ry="16" fill="${c}15" stroke="${c}" stroke-width="1.2"/>
    <!-- Krila srednja -->
    <polygon points="75,65 32,58 28,88 60,85" fill="${c}12" stroke="${c}" stroke-width="1" opacity="0.8"/>
    <polygon points="125,65 168,58 172,88 140,85" fill="${c}12" stroke="${c}" stroke-width="1" opacity="0.8"/>
    <!-- Oružni pyloni -->
    <rect x="62" y="72" width="5" height="18" rx="2" fill="${c}40" stroke="${c}" stroke-width="0.8"/>
    <rect x="133" y="72" width="5" height="18" rx="2" fill="${c}40" stroke="${c}" stroke-width="0.8"/>
    <!-- Motor -->
    <ellipse cx="100" cy="132" rx="14" ry="6" fill="${c}25" stroke="${c}" stroke-width="1.2"/>`,

  cruiser: (c) => `
    <!-- CRUISER: širok, masivan, zaštitni -->
    <polygon points="100,15 145,40 160,75 155,110 130,135 100,142 70,135 45,110 40,75 55,40" fill="${c}08" stroke="${c}" stroke-width="1.8"/>
    <!-- Unutrašnji oklop -->
    <polygon points="100,28 135,48 148,78 144,108 122,128 100,134 78,128 56,108 52,78 65,48" fill="${c}05" stroke="${c}" stroke-width="1" opacity="0.5"/>
    <!-- Štitni pojasevi -->
    <path d="M 55,75 Q 100,55 145,75" fill="none" stroke="${c}" stroke-width="1" opacity="0.4"/>
    <path d="M 50,100 Q 100,82 150,100" fill="none" stroke="${c}" stroke-width="1" opacity="0.4"/>
    <!-- Topovi sa strane -->
    <rect x="30" y="68" width="18" height="8" rx="2" fill="${c}35" stroke="${c}" stroke-width="1"/>
    <rect x="152" y="68" width="18" height="8" rx="2" fill="${c}35" stroke="${c}" stroke-width="1"/>
    <rect x="33" y="88" width="14" height="7" rx="2" fill="${c}25" stroke="${c}" stroke-width="0.8"/>
    <rect x="153" y="88" width="14" height="7" rx="2" fill="${c}25" stroke="${c}" stroke-width="0.8"/>
    <!-- Motori (3x) -->
    <ellipse cx="80" cy="136" rx="10" ry="5" fill="${c}30" stroke="${c}" stroke-width="1"/>
    <ellipse cx="100" cy="139" rx="12" ry="5" fill="${c}30" stroke="${c}" stroke-width="1"/>
    <ellipse cx="120" cy="136" rx="10" ry="5" fill="${c}30" stroke="${c}" stroke-width="1"/>`,

  battleship: (c) => `
    <!-- BATTLESHIP: ogromna, teška, simetrična -->
    <polygon points="100,8 155,35 175,70 170,108 145,130 120,142 100,145 80,142 55,130 30,108 25,70 45,35" fill="${c}10" stroke="${c}" stroke-width="2"/>
    <!-- Oklop slojevi -->
    <polygon points="100,20 145,42 162,72 158,106 136,126 100,135 64,126 42,106 38,72 55,42" fill="${c}06" stroke="${c}" stroke-width="1.2" opacity="0.6"/>
    <!-- Glavni top (prednji) -->
    <rect x="88" y="8" width="24" height="32" rx="3" fill="${c}25" stroke="${c}" stroke-width="1.5"/>
    <rect x="93" y="5" width="14" height="20" rx="2" fill="${c}40" stroke="${c}" stroke-width="1"/>
    <!-- Sekundarni topovi -->
    <rect x="22" y="60" width="22" height="10" rx="2" fill="${c}30" stroke="${c}" stroke-width="1"/>
    <rect x="156" y="60" width="22" height="10" rx="2" fill="${c}30" stroke="${c}" stroke-width="1"/>
    <rect x="18" y="85" width="20" height="9" rx="2" fill="${c}25" stroke="${c}" stroke-width="1"/>
    <rect x="162" y="85" width="20" height="9" rx="2" fill="${c}25" stroke="${c}" stroke-width="1"/>
    <!-- Toranj -->
    <rect x="82" y="60" width="36" height="28" rx="4" fill="${c}18" stroke="${c}" stroke-width="1.2"/>
    <ellipse cx="100" cy="62" rx="14" ry="8" fill="${c}25" stroke="${c}" stroke-width="1"/>
    <!-- Motori (4x) -->
    <ellipse cx="72" cy="138" rx="11" ry="5" fill="${c}35" stroke="${c}" stroke-width="1.2"/>
    <ellipse cx="90" cy="141" rx="9" ry="5" fill="${c}35" stroke="${c}" stroke-width="1.2"/>
    <ellipse cx="110" cy="141" rx="9" ry="5" fill="${c}35" stroke="${c}" stroke-width="1.2"/>
    <ellipse cx="128" cy="138" rx="11" ry="5" fill="${c}35" stroke="${c}" stroke-width="1.2"/>`,

  carrier: (c) => `
    <!-- CARRIER: širok, ravan, hangar paluba -->
    <polygon points="100,18 170,38 185,65 180,100 165,125 100,140 35,125 20,100 15,65 30,38" fill="${c}08" stroke="${c}" stroke-width="1.8"/>
    <!-- Paluba -->
    <rect x="38" y="55" width="124" height="50" rx="4" fill="${c}06" stroke="${c}" stroke-width="1.2" opacity="0.8"/>
    <!-- Hangar otvori -->
    <rect x="48" y="62" width="28" height="35" rx="2" fill="${c}18" stroke="${c}" stroke-width="1"/>
    <rect x="86" y="62" width="28" height="35" rx="2" fill="${c}18" stroke="${c}" stroke-width="1"/>
    <rect x="124" y="62" width="28" height="35" rx="2" fill="${c}18" stroke="${c}" stroke-width="1"/>
    <!-- Runway linija -->
    <line x1="50" y1="79" x2="150" y2="79" stroke="${c}" stroke-width="1" stroke-dasharray="6 4" opacity="0.5"/>
    <!-- Komandni toranj -->
    <rect x="88" y="22" width="24" height="30" rx="3" fill="${c}20" stroke="${c}" stroke-width="1.2"/>
    <rect x="92" y="14" width="16" height="12" rx="2" fill="${c}30" stroke="${c}" stroke-width="1"/>
    <!-- Oružje sa strana -->
    <rect x="14" y="70" width="18" height="8" rx="2" fill="${c}25" stroke="${c}" stroke-width="1"/>
    <rect x="168" y="70" width="18" height="8" rx="2" fill="${c}25" stroke="${c}" stroke-width="1"/>
    <!-- Motori (4x) -->
    <ellipse cx="60" cy="134" rx="12" ry="5" fill="${c}30" stroke="${c}" stroke-width="1"/>
    <ellipse cx="82" cy="137" rx="10" ry="5" fill="${c}30" stroke="${c}" stroke-width="1"/>
    <ellipse cx="118" cy="137" rx="10" ry="5" fill="${c}30" stroke="${c}" stroke-width="1"/>
    <ellipse cx="140" cy="134" rx="12" ry="5" fill="${c}30" stroke="${c}" stroke-width="1"/>`,

  special: (c) => `
    <!-- FLAGSHIP: impresivna, asimetrična, flagship dizajn -->
    <polygon points="100,5 165,30 188,65 182,105 158,130 130,142 100,148 70,142 42,130 18,105 12,65 35,30" fill="${c}10" stroke="${c}" stroke-width="2"/>
    <!-- Vanjski oklop -->
    <polygon points="100,16 152,36 172,66 167,102 146,125 120,136 100,141 80,136 54,125 33,102 28,66 48,36" fill="${c}06" stroke="${c}" stroke-width="1.2" opacity="0.5"/>
    <!-- Centralni reaktor -->
    <circle cx="100" cy="82" r="22" fill="${c}12" stroke="${c}" stroke-width="1.5"/>
    <circle cx="100" cy="82" r="14" fill="${c}18" stroke="${c}" stroke-width="1"/>
    <circle cx="100" cy="82" r="6" fill="${c}40" stroke="${c}" stroke-width="1.5"/>
    <!-- Primarni top (prednji) -->
    <rect x="90" y="5" width="20" height="38" rx="3" fill="${c}28" stroke="${c}" stroke-width="1.5"/>
    <rect x="94" y="2" width="12" height="22" rx="2" fill="${c}45" stroke="${c}" stroke-width="1"/>
    <!-- Sekundarni topovi (sa strane) -->
    <rect x="10" y="55" width="25" height="11" rx="2" fill="${c}30" stroke="${c}" stroke-width="1"/>
    <rect x="165" y="55" width="25" height="11" rx="2" fill="${c}30" stroke="${c}" stroke-width="1"/>
    <rect x="8" y="78" width="22" height="10" rx="2" fill="${c}25" stroke="${c}" stroke-width="1"/>
    <rect x="170" y="78" width="22" height="10" rx="2" fill="${c}25" stroke="${c}" stroke-width="1"/>
    <!-- Energetska krila -->
    <polygon points="42,55 8,42 5,72 33,75" fill="${c}12" stroke="${c}" stroke-width="1" opacity="0.7"/>
    <polygon points="158,55 192,42 195,72 167,75" fill="${c}12" stroke="${c}" stroke-width="1" opacity="0.7"/>
    <!-- Special oruđe (dijamant) -->
    <polygon points="100,44 112,56 100,68 88,56" fill="${c}22" stroke="${c}" stroke-width="1.5"/>
    <!-- Motori (5x) -->
    <ellipse cx="68" cy="140" rx="10" ry="5" fill="${c}35" stroke="${c}" stroke-width="1.2"/>
    <ellipse cx="84" cy="143" rx="9" ry="5" fill="${c}40" stroke="${c}" stroke-width="1.2"/>
    <ellipse cx="100" cy="144" rx="11" ry="5" fill="${c}40" stroke="${c}" stroke-width="1.2"/>
    <ellipse cx="116" cy="143" rx="9" ry="5" fill="${c}40" stroke="${c}" stroke-width="1.2"/>
    <ellipse cx="132" cy="140" rx="10" ry="5" fill="${c}35" stroke="${c}" stroke-width="1.2"/>`,
};

// ── POZICIJE SLOTOVA PO KLASI ──
const SLOT_POSITIONS = {
  scout:      { w: [[22,58],[158,58]], s: [[100,75]], e: [[100,128]], sp: [] },
  fighter:    { w: [[28,72],[172,72],[28,95]], s: [[100,72],[100,98]], e: [[100,130]], sp: [] },
  cruiser:    { w: [[22,62],[158,62],[22,85]], s: [[78,90],[100,82],[122,90]], e: [[100,134]], sp: [] },
  battleship: { w: [[18,58],[162,58],[18,82],[162,82]], s: [[78,85],[100,75],[122,85]], e: [[100,138]], sp: [[100,115]] },
  carrier:    { w: [[12,68],[168,68]], s: [[68,92],[100,90],[132,92]], e: [[100,135]], sp: [[100,50]] },
  special:    { w: [[6,52],[162,52],[6,76],[162,76]], s: [[70,82],[100,62],[130,82]], e: [[100,142]], sp: [[100,110]] },
};

// ── VIZUELNI PRIKAZ BRODA ──
function renderShipVisual(shipId, prefill = {}) {
  const ship = getShipById(shipId);
  if (!ship) return '<div style="color:#6a90b8">Nepoznat brod</div>';
  const cls  = getShipClass(shipId);
  const slots = getClassSlots(cls);
  const clsDef = SHIP_CLASSES[cls] || {};
  const color  = clsDef.color || '#00d4ff';

  const svgBody = SHIP_SVG[cls] ? SHIP_SVG[cls](color) : SHIP_SVG.fighter(color);
  const pos = SLOT_POSITIONS[cls] || SLOT_POSITIONS.fighter;

  const wc  = (i) => prefill[`weapon_${i}`]  ? '#00ff88' : '#ff4444';
  const sc2 = (i) => prefill[`shield_${i}`]  ? '#00d4ff' : '#1a3a6a';
  const ec  = ()  => prefill.engine_1        ? '#ffcc44' : '#664400';
  const spc = ()  => prefill.special_1       ? '#cc44ff' : '#440066';

  // Generiši slot overlay točkice
  let slotOverlay = '';

  pos.w.slice(0, slots.weapon).forEach((p, i) => {
    slotOverlay += `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${wc(i+1)}33" stroke="${wc(i+1)}" stroke-width="1.5" style="cursor:pointer" onclick="document.getElementById('dWeapon${i+1}')?.focus()"/>
    <text x="${p[0]}" y="${p[1]+4}" text-anchor="middle" font-size="7" fill="white" font-family="monospace" style="pointer-events:none">W${i+1}</text>`;
  });

  pos.s.slice(0, slots.shield).forEach((p, i) => {
    slotOverlay += `<rect x="${p[0]-9}" y="${p[1]-9}" width="18" height="18" rx="3" fill="${sc2(i+1)}55" stroke="${sc2(i+1)}" stroke-width="1.5" style="cursor:pointer" onclick="document.getElementById('dShield${i+1}')?.focus()"/>
    <text x="${p[0]}" y="${p[1]+4}" text-anchor="middle" font-size="6" fill="white" font-family="monospace" style="pointer-events:none">S${i+1}</text>`;
  });

  if (pos.e[0]) {
    const p = pos.e[0];
    slotOverlay += `<polygon points="${p[0]},${p[1]-9} ${p[0]+9},${p[1]+6} ${p[0]-9},${p[1]+6}" fill="${ec()}55" stroke="${ec()}" stroke-width="1.5" style="cursor:pointer" onclick="document.getElementById('dEngine1')?.focus()"/>
    <text x="${p[0]}" y="${p[1]+8}" text-anchor="middle" font-size="6" fill="white" font-family="monospace" style="pointer-events:none">ENG</text>`;
  }

  if (slots.special > 0 && pos.sp[0]) {
    const p = pos.sp[0];
    slotOverlay += `<polygon points="${p[0]},${p[1]-10} ${p[0]+10},${p[1]} ${p[0]},${p[1]+10} ${p[0]-10},${p[1]}" fill="${spc()}55" stroke="${spc()}" stroke-width="1.5" style="cursor:pointer" onclick="document.getElementById('dSpecial1')?.focus()"/>
    <text x="${p[0]}" y="${p[1]+4}" text-anchor="middle" font-size="6" fill="white" font-family="monospace" style="pointer-events:none">SPC</text>`;
  }

  return `
    <div style="background:radial-gradient(ellipse at 40% 35%, #0d1830, #020408);border-radius:10px;padding:8px;text-align:center;border:1px solid ${color}44;position:relative">
      <div style="font-size:0.55rem;color:${color};letter-spacing:1px;margin-bottom:4px;font-family:'Orbitron',monospace">${clsDef.icon || ''} ${clsDef.name?.toUpperCase() || cls.toUpperCase()}</div>
      <svg width="140" height="105" viewBox="0 0 200 150" style="filter:drop-shadow(0 0 4px ${color}55)">
        ${svgBody}
        ${slotOverlay}
      </svg>
    </div>`;
}

// ── DESIGNER FORM ──
function renderDesignerForm(prefill = {}) {
  const unlocked = getUnlockedShipClasses();
  const allShips = [];
  unlocked.forEach(cls => {
    (SHIPS[cls] || []).forEach(s => {
      if (ownedBlueprints[s.id]) allShips.push({ ...s, cls });
    });
  });

  if (allShips.length === 0) {
    return `<div style="text-align:center;color:#6a90b8;padding:20px">🔒 Nemaš blueprinte brodova.<br><span style="font-size:0.72rem">Unapredi Ship Factory na Lv.2 ili igraj instance.</span></div>`;
  }

  const prefillCls = prefill.ship_id ? getShipClass(prefill.ship_id) : null;
  const prefillSlots = prefillCls ? getClassSlots(prefillCls) : null;

  // Grupiši brodove po klasi
  const shipGroups = {};
  allShips.forEach(s => {
    const clsName = dn(SHIP_CLASSES[s.cls]) || s.cls;
    if (!shipGroups[clsName]) shipGroups[clsName] = [];
    shipGroups[clsName].push(s);
  });

  return `
    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;gap:10px">
        <div style="flex:1">
          <div style="font-size:0.7rem;color:#6a90b8;margin-bottom:4px">IME DIZAJNA</div>
          <input id="dName" type="text" placeholder="npr. Swift Laser Alpha" value="${prefill.name || ''}" style="width:100%;background:#070c1a;border:1px solid rgba(0,212,255,0.3);color:white;padding:6px 10px;border-radius:4px;font-size:0.82rem">
        </div>
        <div style="flex:1">
          <div style="font-size:0.7rem;color:#6a90b8;margin-bottom:4px">BROD</div>
          <input id="dShipSearch" type="text" placeholder="🔍 Ime ili klasa..." style="width:100%;background:#070c1a;border:1px solid rgba(0,212,255,0.3);color:white;padding:5px 8px;border-radius:4px;font-size:0.78rem;margin-bottom:4px" oninput="filterShipOptions(this.value)">
          <select id="dShip" style="width:100%;background:#070c1a;border:1px solid rgba(0,212,255,0.3);color:white;padding:6px 10px;border-radius:4px;font-size:0.82rem;min-height:100px" onchange="refreshDesignerSlots();document.getElementById('dShipSearch').value=this.options[this.selectedIndex]?.text.split(' [')[0]||''">
            <option value="">-- Odaberi brod --</option>
            ${Object.entries(shipGroups).map(([clsName, ships]) =>
              `<optgroup label="${clsName}">
                ${ships.map(s => `<option value="${s.id}" data-cls="${s.cls}" data-name="${s.name.toLowerCase()}" ${prefill.ship_id === s.id ? 'selected' : ''}>${s.name} ⭐${s.rarity}</option>`).join('')}
              </optgroup>`
            ).join('')}
          </select>
        </div>
      </div>
      
      <div style="display:flex;gap:12px">
        <div id="visualShipContainer" style="flex-shrink:0">
          ${prefill.ship_id ? renderShipVisual(prefill.ship_id, prefill) : '<div style="background:radial-gradient(circle at 30% 40%, #0a1020, #020408); border-radius:16px; padding:20px; text-align:center; border:1px solid rgba(0,212,255,0.3); color:#6a90b8;">⬡ ODABERI BROD ⬡</div>'}
        </div>
        <div style="flex:1;min-width:0">
          <div id="dynamicSlots" style="margin-bottom:8px">${prefill.ship_id ? renderDynamicSlots(prefillCls, prefillSlots, prefill) : '<div style="font-size:0.72rem;color:#6a90b8">Odaberi brod da vidiš slotove...</div>'}</div>
          <div id="designPreview" style="background:rgba(0,0,0,0.3);border-radius:6px;padding:10px;font-size:0.68rem;font-family:\'Share Tech Mono\',monospace;color:#6a90b8;min-height:50px">${prefill.ship_id ? getShipPreviewHTML(prefill.ship_id) : 'Odaberi brod da vidiš statistike...'}</div>
        </div>
      </div>
      
      <button class="btn btn-g" style="width:100%" onclick="saveDesign('${prefill.id || ''}')">💾 Sačuvaj dizajn</button>
    </div>
  `;
}

// ── REFRESH SLOTOVA ──
function refreshDesignerSlots() {
  const shipId = document.getElementById('dShip')?.value;
  const slotsEl = document.getElementById('dynamicSlots');
  const visualEl = document.getElementById('visualShipContainer');
  const prevEl = document.getElementById('designPreview');
  
  if (!shipId) {
    if (slotsEl) slotsEl.innerHTML = '<div style="font-size:0.72rem;color:#6a90b8">Odaberi brod da vidiš slotove...</div>';
    if (visualEl) visualEl.innerHTML = '<div style="background:radial-gradient(circle at 30% 40%, #0a1020, #020408); border-radius:16px; padding:20px; text-align:center; border:1px solid rgba(0,212,255,0.3); color:#6a90b8;">⬡ ODABERI BROD ⬡</div>';
    if (prevEl) prevEl.innerHTML = 'Odaberi brod da vidiš statistike...';
    return;
  }
  
  const cls = getShipClass(shipId);
  const slots = getClassSlots(cls);
  if (slotsEl) slotsEl.innerHTML = renderDynamicSlots(cls, slots, {});
  if (visualEl) visualEl.innerHTML = renderShipVisual(shipId, {});
  updateDesignPreview();
}

// ── INFO KARTICA ZA OPREMU ──
function renderEquipInfo(type, id) {
  if (!id) return '';
  const rc = { C:'#aaaaaa', R:'#4488ff', E:'#aa44ff', L:'#ffaa00' };

  if (type === 'weapon') {
    const w = (typeof WEAPONS !== 'undefined') ? WEAPONS.find(x => x.id === id) : null;
    if (!w) return '';
    const dt = DAMAGE_TYPES?.[w.dmgType] || {};
    const st = WEAPON_SUBTYPES?.[w.subtype] || {};
    const c = rc[w.rarity] || '#aaaaaa';
    return `<div style="background:#070c1a;border:1px solid ${c}44;border-radius:6px;padding:8px 10px;margin-top:4px;font-size:0.68rem;line-height:1.7">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="color:${c};font-weight:700">${w.icon} ${dn(w)}</span>
        <span style="background:${c}22;border:1px solid ${c}55;border-radius:3px;padding:1px 6px;color:${c}">${w.rarity}</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px">
        <span style="color:#ff4444">⚔️ DPS: <strong>${w.dps}</strong></span>
        <span style="color:${dt.color||'#aaa'}">${dt.icon||''} ${w.dmgType}</span>
        <span style="color:#6a90b8">${st.icon||''} ${w.subtype}</span>
        <span style="color:#6a90b8">📏 Domet: ${w.range?.min}-${w.range?.max}</span>
      </div>
      ${w.special ? `<div style="color:#ffcc44">✨ ${t(w.specialKey || '') || w.special.desc}</div>` : ''}
      <div style="color:#6a90b8;margin-top:2px">${dd(w)}</div>
      <div style="color:#3a5070;margin-top:2px;font-size:0.6rem">📦 Izvor: ${t(w.sourceKey || '') || w.source}</div>
    </div>`;
  }

  if (type === 'shield') {
    const s = (typeof SHIELDS !== 'undefined') ? SHIELDS.find(x => x.id === id) : null;
    if (!s) return '';
    const c = rc[s.rarity] || '#aaaaaa';
    return `<div style="background:#070c1a;border:1px solid ${c}44;border-radius:6px;padding:8px 10px;margin-top:4px;font-size:0.68rem;line-height:1.7">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="color:${c};font-weight:700">${s.icon} ${dn(s)}</span>
        <span style="background:${c}22;border:1px solid ${c}55;border-radius:3px;padding:1px 6px;color:${c}">${s.rarity}</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px">
        <span style="color:#00d4ff">🛡️ Shield: <strong>${s.shield}</strong></span>
        <span style="color:#00ff88">♻️ Regen: <strong>${s.regen}/s</strong></span>
      </div>
      ${s.special ? `<div style="color:#ffcc44">✨ ${t(s.specialKey || '') || s.special.desc || JSON.stringify(s.special)}</div>` : ''}
      <div style="color:#6a90b8">${dd(s)}</div>
      <div style="color:#3a5070;margin-top:2px;font-size:0.6rem">📦 Izvor: ${t(s.sourceKey || '') || s.source}</div>
    </div>`;
  }

  if (type === 'engine') {
    const e = (typeof ENGINES !== 'undefined') ? ENGINES.find(x => x.id === id) : null;
    if (!e) return '';
    const c = rc[e.rarity] || '#aaaaaa';
    return `<div style="background:#070c1a;border:1px solid ${c}44;border-radius:6px;padding:8px 10px;margin-top:4px;font-size:0.68rem;line-height:1.7">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="color:${c};font-weight:700">${e.icon} ${dn(e)}</span>
        <span style="background:${c}22;border:1px solid ${c}55;border-radius:3px;padding:1px 6px;color:${c}">${e.rarity}</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px">
        <span style="color:#ffcc44">💨 Speed: <strong>+${e.speed}</strong></span>
        ${e.agility_bonus ? `<span style="color:#00ff88">🏃 Agility: <strong>+${e.agility_bonus}</strong></span>` : ''}
        ${e.evasion_bonus ? `<span style="color:#00d4ff">💫 Evasion: <strong>+${e.evasion_bonus}%</strong></span>` : ''}
      </div>
      ${e.special ? `<div style="color:#ffcc44">✨ ${t(e.specialKey || '') || e.special.desc || e.special.type}</div>` : ''}
      <div style="color:#6a90b8">${dd(e)}</div>
      <div style="color:#3a5070;margin-top:2px;font-size:0.6rem">📦 Izvor: ${t(e.sourceKey || '') || e.source}</div>
    </div>`;
  }

  if (type === 'module') {
    const m = (typeof getModuleById === 'function') ? getModuleById(id) : null;
    if (!m) return '';
    const c = rc[m.rarity] || '#aaaaaa';
    return `<div style="background:#070c1a;border:1px solid ${c}44;border-radius:6px;padding:8px 10px;margin-top:4px;font-size:0.68rem;line-height:1.7">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="color:${c};font-weight:700">${m.icon} ${dn(m)}</span>
        <span style="background:${c}22;border:1px solid ${c}55;border-radius:3px;padding:1px 6px;color:${c}">${m.rarity}</span>
      </div>
      <div style="color:#aaaaaa;margin-bottom:4px">⚙️ ${t(m.effectKey || '') || m.effect.desc}</div>
      <div style="color:#6a90b8">${dd(m)}</div>
      <div style="color:#3a5070;margin-top:2px;font-size:0.6rem">📦 Izvor: ${t(m.sourceKey || '') || m.source}</div>
    </div>`;
  }

  if (type === 'special') {
    const m = (typeof getModuleById === 'function') ? getModuleById(id) : null;
    if (!m) return '';
    const c = rc[m.rarity] || '#aaaaaa';
    return `<div style="background:#070c1a;border:1px solid ${c}44;border-radius:6px;padding:8px 10px;margin-top:4px;font-size:0.68rem;line-height:1.7">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="color:${c};font-weight:700">${m.icon} ${dn(m)}</span>
        <span style="background:${c}22;border:1px solid ${c}55;border-radius:3px;padding:1px 6px;color:${c}">${m.rarity}</span>
      </div>
      <div style="color:#aa44ff;margin-bottom:4px">⭐ ${t(m.effectKey || '') || m.effect.desc}</div>
      <div style="color:#6a90b8">${dd(m)}</div>
      <div style="color:#3a5070;margin-top:2px;font-size:0.6rem">📦 Izvor: ${t(m.sourceKey || '') || m.source} &nbsp;|&nbsp; 🔒 ${Array.isArray(m.shipClass) ? m.shipClass.join('/') : m.shipClass || 'special'}</div>
    </div>`;
  }

  if (type === 'recon') {
    const m = (typeof getModuleById === 'function') ? getModuleById(id) : null;
    if (!m) return '';
    const c = rc[m.rarity] || '#aaaaaa';
    return `<div style="background:#070c1a;border:1px solid ${c}44;border-radius:6px;padding:8px 10px;margin-top:4px;font-size:0.68rem;line-height:1.7">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="color:${c};font-weight:700">${m.icon} ${dn(m)}</span>
        <span style="background:${c}22;border:1px solid ${c}55;border-radius:3px;padding:1px 6px;color:${c}">${m.rarity}</span>
      </div>
      <div style="color:#00e5ff;margin-bottom:4px">🛸 ${t(m.effectKey || '') || m.effect.desc}</div>
      <div style="color:#6a90b8">${dd(m)}</div>
      <div style="color:#3a5070;margin-top:2px;font-size:0.6rem">📦 Izvor: ${t(m.sourceKey || '') || m.source} &nbsp;|&nbsp; 🔒 Samo Izviđači</div>
    </div>`;
  }

  return '';
}

console.log('designer.js v2 loaded');
// ── FILTER ZA BRODOVE ──
function filterShipOptions(q) {
  const sel = document.getElementById('dShip');
  if (!sel) return;
  q = q.toLowerCase().trim();
  for (let i = 0; i < sel.options.length; i++) {
    const opt = sel.options[i];
    if (!opt.value) continue;
    const match = !q || opt.dataset.name.includes(q) || opt.parentElement?.label?.toLowerCase().includes(q) || opt.text.toLowerCase().includes(q);
    opt.style.display = match ? '' : 'none';
  }
  // Sakrij prazne optgroup-e
  sel.querySelectorAll('optgroup').forEach(grp => {
    const hasVisible = Array.from(grp.options).some(o => o.style.display !== 'none');
    grp.style.display = hasVisible ? '' : 'none';
  });
  if (!q && sel.value) { sel.value = ''; refreshDesignerSlots(); }
}

// ── BROWSER ZA BLUEPRINTE ──
function openEquipBrowser(type, slotIdx) {
  let items = [];
  const typeLabel = { weapon:'Oružje', shield:'Štit', engine:'Motor' }[type] || type;
  if (type === 'weapon') items = typeof WEAPONS !== 'undefined' ? WEAPONS.filter(w => ownedBlueprints[w.id]) : [];
  else if (type === 'shield') items = typeof SHIELDS !== 'undefined' ? SHIELDS.filter(s => ownedBlueprints[s.id]) : [];
  else if (type === 'engine') items = typeof ENGINES !== 'undefined' ? ENGINES.filter(e => ownedBlueprints[e.id]) : [];
  if (!items.length) { toast(`❌ Nemaš nijedan ${typeLabel.toLowerCase()} blueprint.`, 'err'); return; }

  // Grupiši oružja po podtipu
  let groups = {};
  if (type === 'weapon') {
    items.forEach(w => {
      const g = w.subtype || 'Ostalo';
      if (!groups[g]) groups[g] = [];
      groups[g].push(w);
    });
  } else {
    groups['Sve'] = items;
  }

  const uid = 'browse_' + Date.now();
  let body = `
    <div style="margin-bottom:8px">
      <input id="${uid}_search" type="text" placeholder="🔍 Pretraži ${typeLabel.toLowerCase()}..." style="width:100%;background:#070c1a;border:1px solid rgba(0,212,255,0.3);color:white;padding:6px 8px;border-radius:4px;font-size:0.78rem">
    </div>
    <div id="${uid}_list" style="max-height:45vh;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding:2px">
      ${Object.entries(groups).map(([gname, gitems]) => `
        <div class="browse-group">
          <div style="font-size:0.65rem;color:#6a90b8;padding:4px 6px;margin-bottom:2px;border-bottom:1px solid rgba(0,212,255,0.1)">${gname}</div>
          ${gitems.map(item => {
            const info = renderEquipInfo(type, item.id);
            return `<div class="browse-item" data-name="${(item.name||'').toLowerCase()}" data-id="${item.id}" onclick="selectEquipFromBrowser('${type}',${slotIdx},'${item.id}')" style="cursor:pointer;transition:0.15s" onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1">${info}</div>`;
          }).join('')}
        </div>`).join('')}
    </div>`;

  openModal(`📖 Biramo: ${typeLabel}`, body, [{ label: 'Zatvori', fn: closeModal }]);
  // Pretraga uživo — filter prikazuje/sakriva grupe i iteme
  setTimeout(() => {
    const inp = document.getElementById(uid + '_search');
    if (!inp) return;
    inp.oninput = function() {
      const q = this.value.toLowerCase().trim();
      document.querySelectorAll('.browse-group').forEach(grp => {
        let anyVisible = false;
        grp.querySelectorAll('.browse-item').forEach(el => {
          const match = el.dataset.name.includes(q) || el.dataset.id.toLowerCase().includes(q);
          el.style.display = match ? '' : 'none';
          if (match) anyVisible = true;
        });
        grp.style.display = anyVisible ? '' : 'none';
      });
    };
  }, 50);
}

function selectEquipFromBrowser(type, slotIdx, id) {
  const el = document.getElementById(`d${type.charAt(0).toUpperCase()+type.slice(1)}${slotIdx}`);
  if (el) {
    el.value = id;
    updateSlotVisual();
    updateEquipInfo(type, slotIdx, id);
  }
  closeModal();
}

// ── RENDER DINAMIČKIH SLOTOVA ──
function renderDynamicSlots(cls, slots, prefill) {
  const myWeapons = typeof WEAPONS !== 'undefined' ? WEAPONS.filter(w => ownedBlueprints[w.id]) : [];
  const myShields = typeof SHIELDS !== 'undefined' ? SHIELDS.filter(s => ownedBlueprints[s.id]) : [];
  const myEngines = typeof ENGINES !== 'undefined' ? ENGINES.filter(e => ownedBlueprints[e.id]) : [];

  let html = '';

  for (let i = 1; i <= slots.weapon; i++) {
    const val = prefill[`weapon_${i}`] || '';
    html += `
      <div style="margin-bottom:8px">
        <div style="font-size:0.7rem;color:#ff4444;margin-bottom:2px;display:flex;justify-content:space-between;align-items:center">⚔️ ORUŽJE ${i}<span style="font-size:0.6rem;color:#6a90b8;cursor:pointer" onclick="openEquipBrowser('weapon',${i})">📖</span></div>
        <select id="dWeapon${i}" style="width:100%;background:#070c1a;border:1px solid rgba(255,68,68,0.3);color:white;padding:5px 8px;border-radius:4px;font-size:0.78rem"
          onchange="updateSlotVisual();updateEquipInfo('weapon',${i},this.value)">
          <option value="">-- Bez oružja --</option>
          ${myWeapons.map(w => `<option value="${w.id}" ${val === w.id ? 'selected' : ''}>${dn(w)} [${w.rarity}] ⚔${w.dps} ${w.dmgType} ${w.subtype}${w.special?.desc ? ' · '+w.special.desc : w.special?.type ? ' · '+w.special.type : ''}</option>`).join('')}
        </select>
        <div id="info_weapon_${i}">${renderEquipInfo('weapon', val)}</div>
      </div>`;
  }

  for (let i = 1; i <= slots.shield; i++) {
    const val = prefill[`shield_${i}`] || '';
    html += `
      <div style="margin-bottom:8px">
        <div style="font-size:0.7rem;color:#00d4ff;margin-bottom:2px;display:flex;justify-content:space-between;align-items:center">🛡️ ŠTIT ${i}<span style="font-size:0.6rem;color:#6a90b8;cursor:pointer" onclick="openEquipBrowser('shield',${i})">📖</span></div>
        <select id="dShield${i}" style="width:100%;background:#070c1a;border:1px solid rgba(0,212,255,0.3);color:white;padding:5px 8px;border-radius:4px;font-size:0.78rem"
          onchange="updateSlotVisual();updateEquipInfo('shield',${i},this.value)">
          <option value="">-- Bez štita --</option>
          ${myShields.map(s => `<option value="${s.id}" ${val === s.id ? 'selected' : ''}>${dn(s)} [${s.rarity}] 🛡+${s.shield} ♻${s.regen}/r</option>`).join('')}
        </select>
        <div id="info_shield_${i}">${renderEquipInfo('shield', val)}</div>
      </div>`;
  }

  const engVal = prefill.engine_1 || '';
  html += `
    <div style="margin-bottom:8px">
      <div style="font-size:0.7rem;color:#ffcc44;margin-bottom:2px;display:flex;justify-content:space-between;align-items:center">🔩 MOTOR<span style="font-size:0.6rem;color:#6a90b8;cursor:pointer" onclick="openEquipBrowser('engine',1)">📖</span></div>
      <select id="dEngine1" style="width:100%;background:#070c1a;border:1px solid rgba(255,204,68,0.3);color:white;padding:5px 8px;border-radius:4px;font-size:0.78rem"
        onchange="updateSlotVisual();updateEquipInfo('engine',1,this.value)">
        <option value="">-- Bez motora --</option>
        ${myEngines.map(e => `<option value="${e.id}" ${engVal === e.id ? 'selected' : ''}>${dn(e)} [${e.rarity}] 💨+${e.speed} 🏃+${e.agility_bonus}${e.evasion_bonus ? ' 💫+'+e.evasion_bonus+'%' : ''}</option>`).join('')}
      </select>
      <div id="info_engine_1">${renderEquipInfo('engine', engVal)}</div>
    </div>`;

  if (slots.module > 0) {
    const myMods   = (typeof SPECIAL_MODULES !== 'undefined') ? SPECIAL_MODULES.filter(m => (Array.isArray(m.shipClass) ? m.shipClass.includes(cls) : m.shipClass === cls) && ownedBlueprints[m.id]) : [];
    const modVal   = prefill.module_1 || '';
    const modIcon  = cls === 'fighter' ? '⚔️' : '🛡️';
    html += `
      <div style="margin-bottom:8px">
        <div style="font-size:0.7rem;color:${cls === 'fighter' ? '#ff4444' : '#00ff88'};margin-bottom:2px">${modIcon} MODULE</div>
        <select id="dModule1" style="width:100%;background:#070c1a;border:1px solid rgba(${cls === 'fighter' ? '255,68,68' : '0,255,136'},0.3);color:white;padding:5px 8px;border-radius:4px;font-size:0.78rem"
          onchange="updateEquipInfo('module',1,this.value)">
          <option value="">-- Bez modula --</option>
          ${myMods.map(m => `<option value="${m.id}" ${modVal === m.id ? 'selected' : ''}>${m.icon} ${dn(m)} (${m.rarity}) — ${t(m.effectKey || '') || m.effect.desc}</option>`).join('')}
        </select>
        <div id="info_module_1">${renderEquipInfo('module', modVal)}</div>
      </div>`;
  }

  if (slots.recon > 0) {
    const myRecon = typeof RECON_MODULES !== 'undefined' ? RECON_MODULES.filter(m => ownedBlueprints[m.id]) : [];
    const reconVal = prefill.recon_1 || '';
    html += `
      <div style="margin-bottom:8px">
        <div style="font-size:0.7rem;color:#00e5ff;margin-bottom:2px">🛸 RECON</div>
        <select id="dRecon1" style="width:100%;background:#070c1a;border:1px solid rgba(0,229,255,0.3);color:white;padding:5px 8px;border-radius:4px;font-size:0.78rem"
          onchange="updateEquipInfo('recon',1,this.value)">
          <option value="">-- Bez recon modula --</option>
          ${myRecon.map(m => `<option value="${m.id}" ${reconVal === m.id ? 'selected' : ''}>${m.icon} ${dn(m)} (${m.rarity}) — ${t(m.effectKey || '') || m.effect.desc}</option>`).join('')}
        </select>
        <div id="info_recon_1">${renderEquipInfo('recon', reconVal)}</div>
      </div>`;
  }

  for (let i = 1; i <= slots.special; i++) {
    const mySpecial  = (typeof SPECIAL_MODULES !== 'undefined')
      ? SPECIAL_MODULES.filter(m => (Array.isArray(m.shipClass) ? m.shipClass.includes(cls) : m.shipClass === cls) && ownedBlueprints[m.id])
      : [];
    const specialVal = prefill[`special_${i}`] || '';
    const specialIcon = cls === 'battleship' ? '💥' : cls === 'carrier' ? '🌌' : '⭐';
    html += `
      <div style="margin-bottom:8px">
        <div style="font-size:0.7rem;color:#aa44ff;margin-bottom:2px">${specialIcon} SPECIAL ${i}</div>
        <select id="dSpecial${i}" style="width:100%;background:#070c1a;border:1px solid rgba(170,68,255,0.3);color:white;padding:5px 8px;border-radius:4px;font-size:0.78rem"
          onchange="updateEquipInfo('special',${i},this.value)">
          <option value="">-- Bez special modula --</option>
          ${mySpecial.map(m => `<option value="${m.id}" ${specialVal === m.id ? 'selected' : ''}>${m.icon} ${dn(m)} (${m.rarity}) — ${t(m.effectKey || '') || m.effect.desc}</option>`).join('')}
        </select>
        <div id="info_special_${i}">${renderEquipInfo('special', specialVal)}</div>
      </div>`;
  }

  return html;
}

// ── AŽURIRAJ INFO KARTICU ISPOD DROPDOWNA ──
function updateEquipInfo(type, idx, id) {
  const el = document.getElementById(`info_${type}_${idx}`);
  if (el) el.innerHTML = renderEquipInfo(type, id);
  updateDesignPreview();
}

// ── AŽURIRAJ VIZUELNI PRIKAZ KADA SE PROMENI OPREMA ──
function updateSlotVisual() {
  const shipId = document.getElementById('dShip')?.value;
  if (!shipId) return;
  
  const slots = getClassSlots(getShipClass(shipId));
  const currentLoadout = {};
  for (let i = 1; i <= slots.weapon; i++) {
    const val = document.getElementById(`dWeapon${i}`)?.value;
    if (val) currentLoadout[`weapon_${i}`] = val;
  }
  for (let i = 1; i <= slots.shield; i++) {
    const val = document.getElementById(`dShield${i}`)?.value;
    if (val) currentLoadout[`shield_${i}`] = val;
  }
  const engineVal = document.getElementById('dEngine1')?.value;
  if (engineVal) currentLoadout.engine_1 = engineVal;
  
  const visualEl = document.getElementById('visualShipContainer');
  if (visualEl) visualEl.innerHTML = renderShipVisual(shipId, currentLoadout);
}

// ── LIVE STAT PREVIEW KADA SE MIJENJA OPREMA ──
function updateDesignPreview() {
  const shipId = document.getElementById('dShip')?.value;
  if (!shipId) return;
  const ship = getShipById(shipId);
  if (!ship) return;
  const cls = getShipClass(shipId);
  const slots = getClassSlots(cls);
  const clsDef = SHIP_CLASSES[cls];
  const at = (typeof ARMOR_RESISTANCE !== 'undefined') ? (ARMOR_RESISTANCE[ship.armor] || {}) : {};

  let totalShield = ship.shield || 0;
  for (let i = 1; i <= slots.shield; i++) {
    const sid = document.getElementById(`dShield${i}`)?.value;
    if (sid) { const sh = getShieldById(sid); if (sh) totalShield += sh.shield; }
  }
  const totalHP = (ship.armor_val || 0) + totalShield + (ship.structure || 0);

  let speed = ship.movement || 0, agility = ship.agility || 0, evasion = 0;
  let engSpecial = '';
  const eid = document.getElementById('dEngine1')?.value;
  if (eid) {
    const eng = getEngineById(eid);
    if (eng) {
      speed += eng.speed;
      agility += (eng.agility_bonus || 0);
      evasion = eng.evasion_bonus || 0;
      engSpecial = eng.special?.type || '';
    }
  }

  let dps = 0, crit = 0, weaponSpecials = [];
  for (let i = 1; i <= slots.weapon; i++) {
    const wid = document.getElementById(`dWeapon${i}`)?.value;
    if (wid) {
      const wpn = getWeaponById(wid);
      if (wpn) {
        dps += wpn.dps;
        if (wpn.special?.type === 'crit') crit = Math.max(crit, wpn.special.bonus || 0);
        if (wpn.special?.type) weaponSpecials.push(wpn.special.type);
      }
    }
  }

  const armorStr = ship.armor ? `${ship.armor} (Kin${at.Kinetic||'?'}% H${at.Heat||'?'}% Mag${at.Magnetic||'?'}% Exp${at.Explosive||'?'}%)` : '?';
  const el = document.getElementById('designPreview');
  if (!el) return;
  el.innerHTML = `
    <div style="color:${clsDef?.color||'white'};font-weight:700;font-size:0.75rem;margin-bottom:6px">${clsDef?.icon||''} ${ship.name} — Pregled opreme</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;font-family:'Share Tech Mono',monospace">
      <span>🛡️ Shield: <strong style="color:#00d4ff">${fmt(totalShield)}</strong></span>
      <span>❤️ HP: <strong style="color:white">${fmt(totalHP)}</strong></span>
      <span>⚔️ DPS: <strong style="color:#ff4444">${fmt(dps)}</strong></span>
      <span>💨 Speed: <strong style="color:#ffcc44">${speed}</strong></span>
      <span>🏃 Agility: <strong style="color:#00ff88">${agility}</strong></span>
      <span>💫 Evasion: <strong style="color:#00d4ff">${evasion}%</strong></span>
      <span>🎯 Crit: <strong style="color:#ff8844">${5 + crit}%</strong></span>
      <span>🔰 Armor: <strong style="color:#6a90b8">${armorStr}</strong></span>
    </div>
    ${weaponSpecials.length ? `<div style="margin-top:4px;font-size:0.6rem;color:#ffcc44">✨ ${weaponSpecials.join(' · ')}</div>` : ''}
    ${engSpecial ? `<div style="font-size:0.6rem;color:#ffcc44">🔩 Engine: ${engSpecial}</div>` : ''}`;
}

// ── SHIP PREVIEW HTML ──
function getShipPreviewHTML(shipId) {
  const ship = getShipById(shipId);
  if (!ship) return '';
  const cls = SHIP_CLASSES[getShipClass(shipId)];
  return `<span style="color:${cls?.color || 'white'};font-weight:700">${ship.name}</span> · ${t('armor.' + (ship.armor || 'light'))}<br>🛡️ Armor: ${ship.armor_val} &nbsp; 💠 Shield: ${ship.shield} &nbsp; ❤️ HP: ${ship.structure}<br>⚡ Agility: ${ship.agility} &nbsp; 💨 Speed: ${ship.movement} &nbsp; 🏆 Stability: ${ship.stability}`;
}

// ── SAČUVAJ DIZAJN ──
function saveDesign(existingId = '') {
  const name = document.getElementById('dName')?.value?.trim();
  const shipId = document.getElementById('dShip')?.value;
  if (!name) { toast('❌ Upiši ime dizajna!', 'err'); return; }
  if (!shipId) { toast('❌ Odaberi brod!', 'err'); return; }
  // Provjeri limit slotova (samo za nove dizajne, ne za edit)
  if (!existingId && shipDesigns.length >= getMaxDesignSlots()) {
    toast(`❌ Popunio si ${getMaxDesignSlots()} slotova! Kupi više slotova.`, 'err');
    buyDesignSlots();
    return;
  }
  const cls = getShipClass(shipId);
  const slots = getClassSlots(cls);
  const design = { id: existingId || genDesignId(), name, ship_id: shipId, cls };
  for (let i = 1; i <= slots.weapon; i++) design[`weapon_${i}`] = document.getElementById(`dWeapon${i}`)?.value || null;
  for (let i = 1; i <= slots.shield; i++) design[`shield_${i}`] = document.getElementById(`dShield${i}`)?.value || null;
  design.engine_1 = document.getElementById('dEngine1')?.value || null;
  if (slots.module > 0) design.module_1 = document.getElementById('dModule1')?.value || null;
  if (slots.recon > 0) design.recon_1 = document.getElementById('dRecon1')?.value || null;
  for (let i = 1; i <= slots.special; i++) design[`special_${i}`] = document.getElementById(`dSpecial${i}`)?.value || null;
  if (existingId) {
    const idx = shipDesigns.findIndex(d => d.id === existingId);
    if (idx !== -1) shipDesigns[idx] = design;
  } else {
    shipDesigns.push(design);
  }
  toast(`✅ Dizajn "${name}" sačuvan!`, 'ok');
  addLog(`📋 Dizajn sačuvan: ${name}`);
  saveGame();
  renderDesigner();
}

// ── OBRIŠI DIZAJN ──
function deleteDesign(designId) {
  const design = shipDesigns.find(d => d.id === designId);
  if (!design) return;

  const inFleet  = fleet.filter(s => s && s.design_id === designId);
  const inFleetCount = inFleet.reduce((a, s) => a + (s.count || 1), 0);
  const inHangar = hangar.find(h => h.design_id === designId);

  let warning = `Obrisati dizajn "${design.name}"?`;
  if (inFleet.length > 0 || inHangar) {
    warning += `

⚠️ UPOZORENJE:
`;
    if (inFleet.length > 0) warning += `• ${inFleetCount} brod(ova) u floti će biti uklonjeno
`;
    if (inHangar)            warning += `• ${inHangar.count} brod(ova) u hangaru će biti uklonjeno
`;
    warning += `
Ovi brodovi neće moći biti reciklirani!`;
  }

  if (!confirm(warning)) return;

  fleet      = fleet.map(s => (s && s.design_id === designId) ? null : s);
  hangar     = hangar.filter(h => h.design_id !== designId);
  shipDesigns = shipDesigns.filter(d => d.id !== designId);

  toast('🗑️ Dizajn obrisan.', 'warn');
  addLog(`🗑️ Dizajn "${design.name}" obrisan — brodovi uklonjeni iz flote i hangara.`);
  saveGame();
  renderDesigner();
  if (typeof renderFleet === 'function') renderFleet();
}

// ── EDIT DIZAJN ──
function editDesign(designId) {
  const design = shipDesigns.find(d => d.id === designId);
  if (!design) return;
  const formEl = document.getElementById('designerForm');
  if (formEl) formEl.innerHTML = renderDesignerForm(design);
  // Nakon što se form popuni, refresh-ujemo slotove i vizuelni prikaz
  setTimeout(() => {
    const shipId = document.getElementById('dShip')?.value;
    if (shipId) {
      const cls = getShipClass(shipId);
      const slots = getClassSlots(cls);
      // Postavi vrednosti u dropdownove
      for (let i = 1; i <= slots.weapon; i++) {
        const val = design[`weapon_${i}`];
        if (val && document.getElementById(`dWeapon${i}`)) document.getElementById(`dWeapon${i}`).value = val;
      }
      for (let i = 1; i <= slots.shield; i++) {
        const val = design[`shield_${i}`];
        if (val && document.getElementById(`dShield${i}`)) document.getElementById(`dShield${i}`).value = val;
      }
      if (design.engine_1 && document.getElementById('dEngine1')) document.getElementById('dEngine1').value = design.engine_1;
      updateSlotVisual();
      updateDesignPreview();
    }
  }, 50);
}

// ── RENDER LISTA DIZAJNA ──
function renderDesignList() {
  const maxSlots = getMaxDesignSlots();
  const used = shipDesigns.length;
  const pct = Math.round((used / maxSlots) * 100);
  const barColor = pct >= 100 ? '#ff4444' : pct >= 80 ? '#ffcc44' : '#00ff88';

  const slotBar = `
    <div style="margin-bottom:12px;background:#0a1628;border:1px solid rgba(0,212,255,0.1);border-radius:6px;padding:8px 12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
        <span style="font-size:0.65rem;color:#6a90b8">📋 SLOTOVI ZA DIZAJNE</span>
        <span style="font-size:0.7rem;font-family:'Orbitron',monospace;color:${barColor}">${used} / ${maxSlots}</span>
      </div>
      <div style="background:#0d1b2e;border-radius:3px;height:4px;margin-bottom:6px">
        <div style="width:${pct}%;height:100%;background:${barColor};border-radius:3px;transition:width 0.3s"></div>
      </div>
      ${maxSlots < DESIGN_SLOTS_MAX ? `
        <button class="btn btn-gold" style="width:100%;font-size:0.62rem;padding:3px" onclick="buyDesignSlots()">
          💰 Kupi još slotova (sledeći: ${(DESIGN_SLOT_PACKAGES[window._designSlotsBought||0]?.price||0).toLocaleString()} BPW)
        </button>` : `
        <div style="font-size:0.6rem;color:#00ff88;text-align:center">✅ Maksimum slotova (100)</div>`}
    </div>`;

  if (shipDesigns.length === 0) return slotBar + `<div class="card" style="text-align:center;color:#6a90b8">📋 Nemaš sačuvanih dizajna.<br><span style="font-size:0.72rem">Kreiraj novi dizajn iznad.</span></div>`;
  return slotBar + `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px">` + shipDesigns.map(d => {
    const ship = getShipById(d.ship_id);
    const cls = SHIP_CLASSES[d.cls || getShipClass(d.ship_id)];
    const slots = getClassSlots(d.cls || getShipClass(d.ship_id));
    const hangarCount = hangar.find(h => h.design_id === d.id)?.count || 0;
    const stats = calcDesignStats(d);
    let equipLines = '';
    for (let i = 1; i <= slots.weapon; i++) if (d[`weapon_${i}`]) { const w = WEAPONS?.find(x => x.id === d[`weapon_${i}`]); equipLines += `⚔️ ${dn(w) || d[`weapon_${i}`]}<br>`; }
    for (let i = 1; i <= slots.shield; i++) if (d[`shield_${i}`]) { const s = SHIELDS?.find(x => x.id === d[`shield_${i}`]); equipLines += `🛡️ ${dn(s) || d[`shield_${i}`]}<br>`; }
    if (d.engine_1) { const e = ENGINES?.find(x => x.id === d.engine_1); equipLines += `🔩 ${dn(e) || d.engine_1}`; }
    return `<div class="card" style="border-color:${cls?.color || '#00d4ff'}33"><div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px"><div><div style="font-size:0.85rem;font-weight:700;color:${cls?.color || 'white'}">${d.name}</div><div style="font-size:0.65rem;color:#6a90b8">${ship?.name || d.ship_id} · ${dn(cls) || ''}</div></div><div style="display:flex;gap:4px"><button class="btn" style="font-size:0.6rem;padding:2px 6px" onclick="editDesign('${d.id}')">✏️</button><button class="btn btn-r" style="font-size:0.6rem;padding:2px 6px" onclick="deleteDesign('${d.id}')">🗑️</button></div></div><div style="display:flex;gap:12px;font-size:0.65rem;color:#6a90b8;margin-bottom:8px;padding:6px 8px;background:rgba(0,0,0,0.25);border-radius:4px"><span>🛡️<strong style="color:#00d4ff">${stats.shield}</strong></span><span>❤️<strong style="color:white">${stats.hp}</strong></span><span>💨<strong style="color:#ffcc44">${stats.speed}</strong></span><span>⚔️<strong style="color:#ff4444">${stats.dps}</strong></span></div><div style="font-size:0.62rem;color:#6a90b8;margin-bottom:8px;line-height:1.6">${equipLines || '<span style="opacity:0.5">Bez opreme</span>'}</div><div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:0.65rem;color:#6a90b8">🏠 <strong style="color:white">${fmt(hangarCount)}</strong> u hangaru</span><button class="btn btn-gold" style="font-size:0.65rem" onclick="openBuildModal('${d.id}')">🏭 Gradi</button></div></div>`;
  }).join('') + `</div>`;
}

// ── RENDER HANGARA ──
// ── RECIKLAŽA BRODOVA BEZ DIZAJNA ──
function forceRecycleOrphan(designId) {
  const h = hangar.find(h => h.design_id === designId);
  if (!h) return;

  const count = h.count;
  // Daj minimalni povraćaj resursa (20% od prosečne cene broda)
  const metalReturn   = count * 500;
  const crystalReturn = count * 250;

  R.metal   += metalReturn;
  R.crystal += crystalReturn;
  hangar     = hangar.filter(h => h.design_id !== designId);

  toast(`♻️ Reciklirano ${count} brodova: +${fmt(metalReturn)} Metal, +${fmt(crystalReturn)} Crystal`, 'ok');
  addLog(`♻️ Obrisani dizajn — ${count} brodova reciklirano za minimalni povraćaj.`);
  updateResUI();
  renderHangar();
  saveGame();
}

function renderHangarList() {
  if (hangar.length === 0) return `<div class="card" style="text-align:center;color:#6a90b8;padding:20px">🏠 Hangar je prazan.<br><span style="font-size:0.72rem">Izgradi brodove u Ship Factory ili kroz Designer.</span></div>`;
  return `<div class="grid-3">` + hangar.map(h => {
    const design = shipDesigns.find(d => d.id === h.design_id);
    // Dizajn obrisan — prikaži kao obrisani brod koji se može reciklirati
    if (!design) {
      return `<div class="card" style="border-color:rgba(255,51,85,0.3);opacity:0.7">
        <div style="font-size:0.82rem;font-weight:700;color:#ff3355;margin-bottom:2px">❓ [Obrisan dizajn]</div>
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:10px">Dizajn je obrisan — brodovi se mogu samo reciklirati</div>
        <div style="font-size:1.6rem;font-family:'Orbitron',monospace;color:white;text-align:center;margin-bottom:10px">${fmt(h.count)}</div>
        <button class="btn btn-r" style="width:100%;font-size:0.72rem"
          onclick="forceRecycleOrphan('${h.design_id}')">♻️ Recikliraj sve</button>
      </div>`;
    }
    const ship = getShipById(design.ship_id);
    const cls = SHIP_CLASSES[design.cls || getShipClass(design.ship_id)];
    const inFleet = fleet.reduce((a, s) => a + (s?.design_id === design.id ? (s.count || 0) : 0), 0);
    return `<div class="card" style="border-color:${cls?.color || '#00d4ff'}33"><div style="font-size:0.82rem;font-weight:700;color:${cls?.color || 'white'};margin-bottom:2px">${design.name}</div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:10px">${ship?.name || ''} · ${dn(cls) || ''}</div><div style="font-size:1.6rem;font-family:'Orbitron',monospace;color:white;text-align:center;margin-bottom:4px">${fmt(h.count)}</div><div style="font-size:0.62rem;color:#6a90b8;text-align:center;margin-bottom:10px">brodova u hangaru<br><span style="color:#ffcc44">⚔️ ${fmt(inFleet)} u floti</span></div><button class="btn btn-g" style="width:100%;font-size:0.72rem" onclick="deployToFleet('${h.design_id}')">🚀 Rasporedi u flotu</button></div>`;
  }).join('') + `</div>`;
}

// ── OPEN BUILD MODAL ──
function openBuildModal(designId) {
  const design = shipDesigns.find(d => d.id === designId);
  if (!design) return;
  const ship = getShipById(design.ship_id);
  if (!ship) return;
  const cls = SHIP_CLASSES[design.cls || getShipClass(design.ship_id)];
  const cost = getShipBuildCost(ship);
  const stats = calcDesignStats(design);

  const body = `
    <div style="margin-bottom:12px">
      <div style="font-size:0.9rem;font-weight:700;color:${cls?.color || 'white'}">${design.name}</div>
      <div style="font-size:0.72rem;color:#6a90b8">${ship.name} · ${cls?.name || ''}</div>
    </div>
    <div style="background:rgba(0,0,0,0.3);border-radius:6px;padding:8px;margin-bottom:12px;font-size:0.65rem;font-family:'Share Tech Mono',monospace">
      <div>🛡️ Shield: <span style="color:#00d4ff">${stats.shield}</span></div>
      <div>❤️ HP: <span style="color:white">${stats.hp}</span></div>
      <div>💨 Speed: <span style="color:#aa44ff">${stats.speed}</span></div>
      <div>⚔️ DPS: <span style="color:#ff4444">${stats.dps}</span></div>
    </div>
    <div style="margin-bottom:12px">
      <label style="font-size:0.72rem;color:#6a90b8">Broj brodova (1-3000):</label>
      <div style="display:flex;gap:6px;margin-top:4px">
        <input id="buildCount" type="number" min="1" max="3000" value="100"
          style="flex:1;background:#070c1a;border:1px solid rgba(0,212,255,0.3);color:white;padding:6px 10px;border-radius:4px;font-size:0.82rem"
          oninput="updateBuildCost('${designId}')" onchange="fixBuildCount(this,'${designId}')">
        <button class="btn" style="font-size:0.7rem;white-space:nowrap;padding:6px 10px"
          onclick="setBuildMax('${designId}')">⚡ Max</button>
      </div>
    </div>
    <div id="buildCostBlock" style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px;font-size:0.72rem;font-family:'Share Tech Mono',monospace;margin-bottom:12px"></div>
    <div style="font-size:0.65rem;color:#6a90b8">Ship Factory Lv.${buildings.ship_factory?.level || 1} · Popust: -${getShipFactoryDiscount()}% · Brzina: +${getShipFactorySpeedBonus()}%</div>`;

  openModal(`🏭 Gradi: ${design.name}`, body, [
    {
      label: '🏭 Izgradi',
      cls: 'btn-g',
      fn: () => {
        let rawCount = parseInt(document.getElementById('buildCount')?.value || '1');
        let count = rawCount;
        if (rawCount > 3000) { count = 3000; toast(`⚠️ Maksimum je 3000 brodova. Napravljeno ${count}.`, 'warn'); }
        if (count < 1) count = 1;
        const total = { metal: cost.metal * count, crystal: cost.crystal * count, he3: cost.he3 * count };
        if (!canAfford(total)) { toast('❌ Nedovoljno resursa!', 'err'); return; }
        spendResources(total);
        window._totalShipsBuilt = (window._totalShipsBuilt || 0) + count;
        const existing = hangar.find(h => h.design_id === designId);
        if (existing) existing.count += count;
        else hangar.push({ design_id: designId, count });
        closeModal();
        updateResUI();
        if (typeof trackDailyShips === 'function') trackDailyShips(count);
        window._totalShipsBuilt = (window._totalShipsBuilt || 0) + count;
        addLog(`🏭 Izgrađeno ${count}x ${design.name} → Hangar.`);
        toast(`✅ ${fmt(count)}x ${design.name} dodano u hangar!`, 'ok');
        saveGame();
        if (typeof renderHangar === 'function') renderHangar();
      }
    },
    { label: 'Odustani', fn: closeModal }
  ]);
  setTimeout(() => updateBuildCost(designId), 50);
}

function setBuildMax(designId) {
  const design = shipDesigns.find(d => d.id === designId);
  if (!design) return;
  const ship = getShipById(design.ship_id);
  if (!ship) return;
  const cost = getShipBuildCost(ship);
  const metalCost   = Math.max(1, cost.metal);
  const crystalCost = Math.max(1, cost.crystal);
  const he3Cost     = Math.max(1, cost.he3);
  const maxByMetal   = metalCost   > 0 ? Math.floor(R.metal   / metalCost)   : 9999;
  const maxByCrystal = crystalCost > 0 ? Math.floor(R.crystal / crystalCost) : 9999;
  const maxByHe3     = he3Cost     > 0 ? Math.floor(R.he3     / he3Cost)     : 9999;
  const maxCount = Math.min(3000, maxByMetal, maxByCrystal, maxByHe3);
  const input = document.getElementById('buildCount');
  if (!input) return;
  input.value = Math.max(0, maxCount);
  updateBuildCost(designId);
  if (maxCount <= 0) toast('❌ Nemaš resursa ni za 1 brod!', 'err');
}

function fixBuildCount(input, designId) {
  let val = parseInt(input.value);
  if (isNaN(val)) val = 1;
  if (val > 3000) { input.value = 3000; toast('⚠️ Maksimum je 3000 brodova. Ispravljeno na 3000.', 'warn'); }
  else if (val < 1) input.value = 1;
  if (designId && typeof updateBuildCost === 'function') updateBuildCost(designId);
}

function updateBuildCost(designId) {
  const design = shipDesigns.find(d => d.id === designId);
  if (!design) return;
  const ship = getShipById(design.ship_id);
  if (!ship) return;
  let count = parseInt(document.getElementById('buildCount')?.value || '1');
  if (count > 3000) count = 3000;
  if (count < 1) count = 1;
  const cost = getShipBuildCost(ship);
  const total = { metal: cost.metal * count, crystal: cost.crystal * count, he3: cost.he3 * count };
  const af = canAfford(total);
  const block = document.getElementById('buildCostBlock');
  if (!block) return;
  block.innerHTML = `<div class="${af ? 'ck' : 'cn'}">🔩 Metal: ${fmt(total.metal)}</div><div class="${af ? 'ck' : 'cn'}">💎 Crystal: ${fmt(total.crystal)}</div><div class="${af ? 'ck' : 'cn'}">⛽ He3: ${fmt(total.he3)}</div><div style="margin-top:6px;color:${af ? '#00ff88' : '#ff3355'}">${af ? '✅ Možeš izgraditi' : '❌ Nedovoljno resursa'}</div>`;
}

// ── RASPOREDI U FLOTU ──
function deployToFleet(designId) {
  const h = hangar.find(h => h.design_id === designId);
  if (!h || h.count === 0) { toast('🏠 Hangar je prazan!', 'warn'); return; }
  const design = shipDesigns.find(d => d.id === designId);
  if (!design) return;
  const body = `<div style="margin-bottom:12px;font-size:0.82rem;color:#6a90b8">Dostupno u hangaru: <strong style="color:white">${fmt(h.count)}</strong> brodova</div><div style="margin-bottom:12px"><label style="font-size:0.72rem;color:#6a90b8">Koliko rasporediti:</label><input id="deployCount" type="number" min="1" max="${Math.min(h.count, 3000)}" value="${Math.min(h.count, 3000)}" style="width:100%;background:#070c1a;border:1px solid rgba(0,212,255,0.3);color:white;padding:6px 10px;border-radius:4px;margin-top:4px;font-size:0.82rem"></div><div style="font-size:0.72rem;color:#6a90b8">💡 Brodovi s istim dizajnom idu u isti slot (max 3000 po slotu).</div>`;
  openModal(`🚀 Rasporedi: ${design.name}`, body, [
    {
      label: '🚀 Rasporedi',
      cls: 'btn-g',
      fn: () => {
        const count = Math.max(1, Math.min(h.count, parseInt(document.getElementById('deployCount')?.value || '1')));
        const cls = design.cls || getShipClass(design.ship_id);
        const slots = getClassSlots(cls);
        const loadout = { design_id: design.id, engine_id: design.engine_1 || null };
        for (let i = 1; i <= slots.weapon; i++) loadout[`weapon_${i}`] = design[`weapon_${i}`] || null;
        for (let i = 1; i <= slots.shield; i++) loadout[`shield_${i}`] = design[`shield_${i}`] || null;
        if (slots.module > 0) loadout.module_1 = design.module_1 || null;
        if (slots.recon > 0) loadout.recon_1 = design.recon_1 || null;
        for (let i = 1; i <= slots.special; i++) loadout[`special_${i}`] = design[`special_${i}`] || null;
        const success = addShipsToFleet(design.ship_id, loadout, count);
        if (success) {
          h.count -= count;
          if (h.count <= 0) hangar = hangar.filter(x => x.design_id !== designId);
          closeModal();
          saveGame();
          if (typeof renderHangar === 'function') renderHangar();
        }
      }
    },
    { label: 'Odustani', fn: closeModal }
  ]);
}
