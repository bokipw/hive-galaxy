// ============================================================
// HIVE GALAXY — js/systems/formations.js
// Formacije flote — bonusi za raspored brodova u 3x3 gridu
// ============================================================

// ── DEFINICIJE FORMACIJA ──
const FORMATIONS = [
  {
    id:    0,
    name:  'Slobodna',
    icon:  '⬜',
    desc:  'Bez posebne formacije. Nema bonusa ni penala.',
    color: '#6a90b8',
    // Nema bonusa
    bonus: {},
  },
  {
    id:    1,
    name:  'Delta',
    icon:  '▲',
    desc:  '+15% napad. Prve 3 pozicije (1,2,3 — frontalni napad) dobijaju bonus DPS.',
    color: '#ff4444',
    bonus: { dps: 15 },
    pattern: [0, 1, 2], // slotovi koji dobijaju bonus
  },
  {
    id:    2,
    name:  'Štit',
    icon:  '🛡️',
    desc:  '+20% odbrana. Srednja kolona (2,5,8) apsorbuje više štete.',
    color: '#4488ff',
    bonus: { shield: 20, armor: 10 },
    pattern: [1, 4, 7],
  },
  {
    id:    3,
    name:  'Klinasta',
    icon:  '◆',
    desc:  '+15% napad, +5% brzina. Tri kapetana u centralnoj koloni probijaju neprijatelja.',
    color: '#ff8833',
    bonus: { dps: 15, speed: 5 },
    pattern: [1, 4, 7], // vertikalni klin — sredina svakog reda
  },
  {
    id:    4,
    name:  'Crescent',
    icon:  '☽',
    desc:  '+12% agility. Raspoređeni u polukrug — teži za ciljanje.',
    color: '#00ff88',
    bonus: { agility: 12 },
    pattern: [0, 2, 3, 5, 6, 8],
  },
  {
    id:    5,
    name:  'Zid',
    icon:  '⬛',
    desc:  '+25% odbrana baze. Svi brodovi čuvaju jedni druge — manje žrtava.',
    color: '#aa44ff',
    bonus: { armor: 25 },
    pattern: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    id:    6,
    name:  'Roj',
    icon:  '🐝',
    desc:  '+8% napad po svakom aktivnom slotu (max +72%). Broj = moć.',
    color: '#ffcc44',
    bonus: { dps_per_slot: 8 },
    dynamic: true,
  },
  {
    id:    7,
    name:  'Vijak',
    icon:  '🌀',
    desc:  '+20% brzina, -10% odbrana. Za brze napade i bježanje.',
    color: '#00d4ff',
    bonus: { speed: 20, shield: -10 },
    pattern: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    id:    8,
    name:  'Legija',
    icon:  '⚔️',
    desc:  '+5% svega. Uravnotežena formacija za svaku situaciju.',
    color: '#ffffff',
    bonus: { dps: 5, shield: 5, armor: 5, agility: 5, speed: 5 },
    pattern: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
];

// ── STANJE FORMACIJSKIH SLOTOVA (koji komandir je u kojoj poziciji) ──
if (!window._formationSlots) window._formationSlots = Array(9).fill(null);

// ── POSTAVI KOMANDIRA U FORMACIJSKI SLOT ──
function assignCommanderToFormationSlot(cmdId, slotIdx) {
  if (slotIdx < 0 || slotIdx > 8) return;
  if (!window._formationSlots) window._formationSlots = Array(9).fill(null);
  // Ako je isti komandir već u tom slotu — ukloni
  if (window._formationSlots[slotIdx] === cmdId) {
    window._formationSlots[slotIdx] = null;
    saveGame();
    renderFormations();
    return;
  }
  // Ukloni komandira iz drugog slota ako postoji
  for (let i = 0; i < 9; i++) {
    if (window._formationSlots[i] === cmdId) window._formationSlots[i] = null;
  }
  window._formationSlots[slotIdx] = cmdId;
  saveGame();
  renderFormations();
}

// ── UKLONI KOMANDIRA IZ FORMACIJSKOG SLOTA ──
function removeCommanderFromFormationSlot(slotIdx) {
  if (!window._formationSlots) window._formationSlots = Array(9).fill(null);
  window._formationSlots[slotIdx] = null;
  saveGame();
  renderFormations();
}

// ── BROJ POPUNJENIH FORMACIJSKIH SLOTOVA ──
function getFilledFormationSlots() {
  if (!window._formationSlots) return 0;
  return window._formationSlots.filter(s => s !== null).length;
}

// ── DOBIJ AKTIVNU FORMACIJU ──
function getActiveFormation() {
  return FORMATIONS.find(f => f.id === activeFormation) || FORMATIONS[0];
}

// ── POSTAVI FORMACIJU ──
function setFormation(id) {
  const form = FORMATIONS.find(f => f.id === id);
  if (!form) return;
  activeFormation = id;
  saveGame();
  renderFormations();
  updateResUI();
  toast(`${form.icon} Formacija "${form.name}" aktivirana!`, 'ok');
  addLog(`${form.icon} Formacija promijenjena: ${form.name}`);
}

// ── IZRAČUNAJ BONUSE FORMACIJE ──
function getFormationBonus() {
  const form   = getActiveFormation();
  if (!form || form.id === 0) return { dps: 0, shield: 0, armor: 0, agility: 0, speed: 0 };

  const bonus  = { ...form.bonus };

  // Dinamični bonus (Roj — per popunjeni formacijski slot)
  if (form.dynamic && form.bonus.dps_per_slot) {
    const filledSlots = getFilledFormationSlots();
    bonus.dps         = form.bonus.dps_per_slot * Math.max(filledSlots, 1);
    delete bonus.dps_per_slot;
  }

  return {
    dps:     bonus.dps     || 0,
    shield:  bonus.shield  || 0,
    armor:   bonus.armor   || 0,
    agility: bonus.agility || 0,
    speed:   bonus.speed   || 0,
  };
}

// ── PRIMIJENI FORMACIJU NA FLEET STATS ──
function applyFormationToStats(stats) {
  const bonus = getFormationBonus();
  const form  = getActiveFormation();
  if (form.id === 0) return stats;

  return {
    ...stats,
    dps:     Math.floor(stats.dps     * (1 + bonus.dps     / 100)),
    shield:  Math.floor(stats.shield  * (1 + bonus.shield  / 100)),
    armor:   Math.floor(stats.armor   * (1 + bonus.armor   / 100)),
    agility: Math.min(90, stats.agility + (bonus.agility || 0)),
    speed:   Math.max(1,  stats.speed  + (bonus.speed   || 0)),
  };
}

// ── RENDER VIZUELNI GRID FORMACIJE (mini prikaz) ──
function renderFormationGrid(formId) {
  const form    = FORMATIONS.find(f => f.id === formId) || FORMATIONS[0];
  const pattern = form.pattern || [];
  const slots   = window._formationSlots || Array(9).fill(null);

  const cells = Array.from({ length: 9 }, (_, i) => {
    const active  = form.id === 0 || pattern.includes(i);
    const cmdId   = slots[i];
    const color   = active ? form.color : '#1a2540';
    let inner = '';
    if (cmdId) {
      const def = typeof COMMANDER_DEFS !== 'undefined' ? COMMANDER_DEFS.find(d => d.id === cmdId) : null;
      inner = `<span style="font-size:0.7rem;line-height:1">${def ? def.icon : '👤'}</span>`;
    } else if (active && form.id !== 0) {
      inner = `<span style="color:${color}44;font-size:0.5rem">●</span>`;
    }
    return `
      <div style="
        width:28px;height:28px;border-radius:4px;
        background:${active ? color + '22' : '#0a0f1e'};
        border:1px solid ${cmdId ? color : (active ? color + '44' : '#1a2540')};
        display:flex;align-items:center;justify-content:center;
        font-size:0.65rem;
      ">${inner}</div>`;
  });

  return `<div style="display:grid;grid-template-columns:repeat(3,28px);gap:3px">${cells.join('')}</div>`;
}

// ── RENDER INTERAKTIVNI GRID ZA POSTAVLJANJE KOMANDIRA ──
function renderFormationAssignGrid() {
  const form    = getActiveFormation();
  const pattern = form.pattern || [];
  const slots   = window._formationSlots || Array(9).fill(null);
  const owned   = window.ownedCommanders || [];

  // Lista komandira koji su owned
  const ownedList = owned.map(entry => {
    const def = typeof COMMANDER_DEFS !== 'undefined' ? COMMANDER_DEFS.find(d => d.id === entry.id) : null;
    return def ? { entry, def } : null;
  }).filter(Boolean);

  const cells = Array.from({ length: 9 }, (_, i) => {
    const active  = form.id === 0 || pattern.includes(i);
    const cmdId   = slots[i];
    const def     = cmdId ? (typeof COMMANDER_DEFS !== 'undefined' ? COMMANDER_DEFS.find(d => d.id === cmdId) : null) : null;
    const entry   = cmdId ? owned.find(e => e.id === cmdId) : null;
    const color   = active ? form.color : '#1a2540';

    if (cmdId && def) {
      // Popunjen slot — prikaži komandira s opcijom uklanjanja
      return `
        <div style="
          width:72px;height:72px;border-radius:6px;
          background:${color}22;border:2px solid ${color};
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          cursor:pointer;position:relative;gap:2px;
          " onclick="removeCommanderFromFormationSlot(${i})" title="Ukloni ${def.name}">
          <div style="font-size:1.5rem">${def.icon}</div>
          <div style="font-size:0.5rem;color:${color};text-align:center;font-weight:700;
            max-width:68px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${def.name}</div>
          <div style="position:absolute;top:2px;right:4px;font-size:0.55rem;color:#ff4444">✕</div>
        </div>`;
    } else {
      // Prazan slot
      const isBonus = active && form.id !== 0;
      return `
        <div style="
          width:72px;height:72px;border-radius:6px;
          background:${isBonus ? color + '11' : '#0a0f1e'};
          border:1px dashed ${isBonus ? color + '66' : '#1a2540'};
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          cursor:default;gap:2px;
          " id="fslot_${i}">
          <div style="font-size:1.2rem;color:${isBonus ? color + '44' : '#1a2540'}">+</div>
          <div style="font-size:0.45rem;color:${isBonus ? color + '66' : '#1a2540'}">${isBonus ? 'BONUS' : 'SLOT'} ${i+1}</div>
        </div>`;
    }
  });

  // Dropdown za dodjelu — prikaži listu komandira ispod grida
  const assignedIds = slots.filter(Boolean);
  const availableCommanders = ownedList.filter(({ entry }) => !assignedIds.includes(entry.id));

  const emptySlots = slots.map((s, i) => s === null ? i : -1).filter(i => i !== -1);

  return `
    <div style="margin-top:20px">
      <div style="font-family:'Orbitron',monospace;font-size:0.75rem;color:#00d4ff;
        letter-spacing:2px;margin-bottom:12px;padding-bottom:8px;
        border-bottom:1px solid rgba(0,212,255,0.15)">
        RASPOREDI KOMANDIRE
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start">
        <!-- 3x3 grid -->
        <div style="display:grid;grid-template-columns:repeat(3,72px);gap:6px">
          ${cells.join('')}
        </div>
        <!-- Panel za dodjelu -->
        <div style="flex:1;min-width:180px">
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:8px">
            Klikni ✕ na komandiru da ga ukloniš. Izaberi slot i komandira da dodijeliš:
          </div>
          ${emptySlots.length > 0 && availableCommanders.length > 0 ? `
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
              ${availableCommanders.map(({ entry, def }) => {
                const lvl = entry.level || 1;
                return `
                  <div style="background:#0d1b2e;border:1px solid rgba(0,212,255,0.2);border-radius:6px;
                    padding:6px 10px;cursor:pointer;display:flex;align-items:center;gap:6px;
                    font-size:0.65rem;color:#c0d8f0;"
                    onclick="window._pendingAssignCmd='${entry.id}';_showFormationSlotPicker()">
                    <span style="font-size:1rem">${def.icon}</span>
                    <div>
                      <div style="font-weight:700">${def.name}</div>
                      <div style="color:#6a90b8">Lv.${lvl}</div>
                    </div>
                    <span style="margin-left:4px;color:#00d4ff;font-size:0.8rem">→</span>
                  </div>`;
              }).join('')}
            </div>
            <div id="fslot_picker" style="display:none;background:#0a1628;border:1px solid rgba(0,212,255,0.2);
              border-radius:6px;padding:8px;margin-top:4px">
              <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:6px">Izaberi slot:</div>
              <div style="display:flex;flex-wrap:wrap;gap:4px">
                ${emptySlots.map(si => {
                  const isBonus = form.id === 0 || pattern.includes(si);
                  return `<button class="btn btn-g" style="font-size:0.6rem;padding:2px 8px;
                    ${isBonus && form.id !== 0 ? `border-color:${form.color};color:${form.color}` : ''}"
                    onclick="assignCommanderToFormationSlot(window._pendingAssignCmd,${si});
                      document.getElementById('fslot_picker').style.display='none'">
                    ${si+1}${isBonus && form.id !== 0 ? '★' : ''}
                  </button>`;
                }).join('')}
              </div>
            </div>
          ` : availableCommanders.length === 0 ? `
            <div style="font-size:0.65rem;color:#6a90b8">Svi komandiri su raspoređeni.</div>
          ` : `
            <div style="font-size:0.65rem;color:#6a90b8">Nema slobodnih komandira za dodjelu.</div>
          `}
        </div>
      </div>
    </div>`;
}

// ── PRIKAŽI/SAKRIJ SLOT PICKER ──
function _showFormationSlotPicker() {
  const el = document.getElementById('fslot_picker');
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// ── RENDER PANEL FORMACIJA ──
function renderFormations() {
  const el = document.getElementById('formationsContent');
  if (!el) return;

  const current  = getActiveFormation();
  const bonus    = getFormationBonus();
  const hasBonus = Object.values(bonus).some(v => v !== 0);

  el.innerHTML = `
    <!-- Trenutna formacija -->
    <div class="card" style="margin-bottom:20px;border-color:${current.color}44">
      <div style="display:flex;align-items:center;gap:14px">
        <div style="font-size:3rem;filter:drop-shadow(0 0 8px ${current.color})">${current.icon}</div>
        <div style="flex:1">
          <div style="font-size:0.65rem;color:#6a90b8;letter-spacing:2px;margin-bottom:4px">
            AKTIVNA FORMACIJA
          </div>
          <div style="font-size:1rem;font-weight:700;color:${current.color};
            font-family:'Orbitron',monospace">${current.name}</div>
          <div style="font-size:0.72rem;color:#6a90b8;margin-top:4px">${current.desc}</div>
        </div>
        ${renderFormationGrid(current.id)}
      </div>
      ${hasBonus ? `
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
          ${bonus.dps     !== 0 ? `<span style="background:rgba(255,68,68,0.1);border:1px solid rgba(255,68,68,0.3);
            border-radius:4px;padding:2px 8px;font-size:0.65rem;color:#ff4444">
            ⚔️ DPS ${bonus.dps > 0 ? '+' : ''}${bonus.dps}%</span>` : ''}
          ${bonus.shield  !== 0 ? `<span style="background:rgba(68,136,255,0.1);border:1px solid rgba(68,136,255,0.3);
            border-radius:4px;padding:2px 8px;font-size:0.65rem;color:#4488ff">
            🛡️ Štit ${bonus.shield > 0 ? '+' : ''}${bonus.shield}%</span>` : ''}
          ${bonus.armor   !== 0 ? `<span style="background:rgba(255,136,51,0.1);border:1px solid rgba(255,136,51,0.3);
            border-radius:4px;padding:2px 8px;font-size:0.65rem;color:#ff8833">
            🔩 Oklop ${bonus.armor > 0 ? '+' : ''}${bonus.armor}%</span>` : ''}
          ${bonus.agility !== 0 ? `<span style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);
            border-radius:4px;padding:2px 8px;font-size:0.65rem;color:#00ff88">
            💨 Agility ${bonus.agility > 0 ? '+' : ''}${bonus.agility}</span>` : ''}
          ${bonus.speed   !== 0 ? `<span style="background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);
            border-radius:4px;padding:2px 8px;font-size:0.65rem;color:#00d4ff">
            🚀 Brzina ${bonus.speed > 0 ? '+' : ''}${bonus.speed}</span>` : ''}
        </div>
      ` : ''}
    </div>

    ${renderFormationAssignGrid()}

    <!-- Sve formacije -->
    <div style="font-family:'Orbitron',monospace;font-size:0.75rem;color:#00d4ff;
      letter-spacing:2px;margin-bottom:12px;padding-bottom:8px;
      border-bottom:1px solid rgba(0,212,255,0.15)">
      ODABERI FORMACIJU
    </div>
    <div class="grid-3">
      ${FORMATIONS.map(form => {
        const isActive = form.id === activeFormation;
        return `
          <div class="card" style="
            cursor:pointer;
            border-color:${isActive ? form.color : 'rgba(0,212,255,0.1)'};
            background:${isActive ? form.color + '11' : ''};
            transition:all 0.2s;"
            onclick="setFormation(${form.id})">

            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <div style="font-size:1.8rem">${form.icon}</div>
              <div style="flex:1">
                <div style="font-size:0.8rem;font-weight:700;color:${isActive ? form.color : 'white'}">
                  ${form.name}
                </div>
                ${isActive ? `<div style="font-size:0.58rem;color:${form.color};
                  letter-spacing:1px">● AKTIVAN</div>` : ''}
              </div>
              ${renderFormationGrid(form.id)}
            </div>

            <div style="font-size:0.62rem;color:#6a90b8;margin-bottom:8px;line-height:1.5">
              ${form.desc}
            </div>

            <!-- Bonus tagovi -->
            <div style="display:flex;flex-wrap:wrap;gap:3px">
              ${Object.entries(form.bonus).map(([key, val]) => {
                if (key === 'dps_per_slot') return `<span style="font-size:0.55rem;color:#ffcc44;
                  background:rgba(255,204,68,0.1);border-radius:3px;padding:1px 5px">
                  ⚔️ +${val}%/slot</span>`;
                const colors = { dps:'#ff4444', shield:'#4488ff', armor:'#ff8833',
                                 agility:'#00ff88', speed:'#00d4ff' };
                const icons  = { dps:'⚔️', shield:'🛡️', armor:'🔩', agility:'💨', speed:'🚀' };
                const c      = colors[key] || '#6a90b8';
                const v      = val > 0 ? `+${val}%` : `${val}%`;
                return `<span style="font-size:0.55rem;color:${c};
                  background:${c}11;border-radius:3px;padding:1px 5px">
                  ${icons[key]||''} ${v}</span>`;
              }).join('')}
            </div>

            ${!isActive ? `
              <button class="btn btn-g" style="width:100%;margin-top:8px;font-size:0.68rem">
                Aktiviraj
              </button>` : ''}
          </div>`;
      }).join('')}
    </div>
  `;
}