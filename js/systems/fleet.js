// ============================================================
// HIVE GALAXY — js/systems/fleet.js
// Fleet menadžment — 3x3 grid, stack sistem, statistike
// ============================================================

// ── MULTI-COMMANDER FLEET SISTEM ──

// Maksimalan broj deployanih komandira po player levelu
function getMaxDeployedCommanders() {
  const lvl = commander.level || 1;
  if (lvl >= 75) return 9;
  if (lvl >= 50) return 6;
  if (lvl >= 25) return 3;
  return 1;
}

// Dohvati (ili inicijaliziraj) fleet array od komandira
function getCmdFleet(cmdId) {
  const entry = (window.ownedCommanders || []).find(o => o.id === cmdId);
  if (!entry) return Array(9).fill(null);
  if (!Array.isArray(entry.fleet) || entry.fleet.length !== 9) {
    entry.fleet = Array(9).fill(null);
  }
  return entry.fleet;
}

// Svi slotovi iz svih deployanih komandira (za battle)
function getAllDeployedSlots() {
  const deployed = window._deployedCommanders || [];
  const slots = [];
  deployed.forEach(cmdId => {
    const cFleet = getCmdFleet(cmdId);
    cFleet.forEach((slot, idx) => {
      if (!slot) return;
      // Dodaj owner info za applyPlayerLosses
      // Ne dodajemo _ownerFleet direktno na slot (uzrokuje circular ref u JSON.stringify)
      // Čuvamo samo idx, fleet se rekonstruiše u applyPlayerLosses
      slot._ownerIdx = idx;
      slot._ownerCmdId = cmdId;
      slots.push(slot);
    });
  });

  // ── Backward compat / fallback ──
  // Ako nema ništa u komandirskim flotama, koristi globalni fleet array
  // (stari saves koji još imaju brodove u globalnom fleet-u)
  if (slots.length === 0) {
    fleet.forEach((slot) => {
      if (!slot) return;
      slots.push(slot);
    });
  }

  return slots;
}

// ── Migracija starih brodova iz globalnog fleet-a u komandirov fleet ──
function migrateGlobalFleetToCommander(cmdId) {
  const hasOldShips = fleet.some(s => s !== null);
  if (!hasOldShips) return;
  const cFleet = getCmdFleet(cmdId);
  const cmdHasShips = cFleet.some(s => s !== null);
  if (cmdHasShips) return; // komandir već ima brodove, ne migriramo

  let migrated = 0;
  fleet.forEach((slot, idx) => {
    if (!slot) return;
    const emptyIdx = cFleet.indexOf(null);
    if (emptyIdx === -1) return;
    cFleet[emptyIdx] = slot;
    fleet[idx] = null;
    migrated++;
  });
  if (migrated > 0) {
    toast(`↗️ ${migrated} flota${migrated > 1 ? 'e' : ''} prebačen${migrated > 1 ? 'e' : 'a'} komandiru!`, 'ok');
    saveGame();
  }
}

// Kojeg komandira trenutno gledamo u Fleet panelu
function getViewingCmdId() {
  const deployed = window._deployedCommanders || [];
  if (!window._viewingCmdId || !deployed.includes(window._viewingCmdId)) {
    window._viewingCmdId = deployed[0] || null;
  }
  return window._viewingCmdId;
}

function setViewingCmd(cmdId) {
  window._viewingCmdId = cmdId;
  renderFleet();
}

// Postavi/ukloni komandira iz deployment liste
function deployCommander(cmdId) {
  if (!window._deployedCommanders) window._deployedCommanders = [];
  const max = getMaxDeployedCommanders();
  if (window._deployedCommanders.includes(cmdId)) {
    toast('⚠️ Komandir je već deployovan!', 'warn');
    return;
  }
  if (window._deployedCommanders.length >= max) {
    toast(`⚠️ Maksimum ${max} komandira (Level ${commander.level})!`, 'warn');
    return;
  }
  window._deployedCommanders.push(cmdId);
  if (!window._activeCommander) window._activeCommander = cmdId;
  window._viewingCmdId = cmdId;
  // Ako je ovo prvi komandir, migriraj stare brodove iz globalnog fleet-a
  if (window._deployedCommanders.length === 1) {
    migrateGlobalFleetToCommander(cmdId);
  }
  renderFleet();
  saveGame();
  toast('✅ Komandir deployovan!', 'ok');
}

function undeployCommander(cmdId) {
  if (!window._deployedCommanders) return;
  window._deployedCommanders = window._deployedCommanders.filter(id => id !== cmdId);
  if (window._activeCommander === cmdId) {
    window._activeCommander = window._deployedCommanders[0] || null;
  }
  window._viewingCmdId = window._deployedCommanders[0] || null;
  renderFleet();
  saveGame();
  toast('🏠 Komandir povučen iz flote.', 'ok');
}

// ── CIJENA GRADNJE BRODA (sa Factory discountom) ──
function getShipBuildCost(ship) {
  const base     = ship.armor_val + ship.shield * 0.3 + ship.structure * 0.5;
  const discount = getShipFactoryDiscount() / 100;
  return {
    metal:   Math.floor(base * 3  * (1 - discount)),
    crystal: Math.floor(base * 2  * (1 - discount)),
    he3:     Math.floor(base * 1  * (1 - discount)),
  };
}

// ── STATISTIKE JEDNOG SLOTA ──
function calcSlotStats(slot) {
  if (!slot) return null;
  const ship = getShipById(slot.ship_id);
  if (!ship) return null;
  const count = slot.count || 1;

  let dps = 0;
  for (let i = 1; i <= 4; i++) {
    const wid = slot[`weapon_${i}`];
    if (wid && typeof getWeaponById === 'function') {
      const wpn = getWeaponById(wid);
      if (wpn) dps += (wpn.dps || 0);
    }
  }

  // Izračunaj shield od opreme
  let totalShield = ship.shield;
  for (let i = 1; i <= 3; i++) {
    const sid = slot[`shield_${i}`];
    if (sid) {
      const sh = getShieldById(sid);
      if (sh) totalShield += sh.shield;
    }
  }

  // Brzina od motora
  let speed = ship.movement;
  const engineId = slot.engine_1 || slot.engine_id;
  if (engineId) {
    const eng = getEngineById(engineId);
    if (eng && eng.speed) speed += eng.speed;
  }

  // Agilnost od motora
  let agility = ship.agility;
  if (engineId) {
    const eng = getEngineById(engineId);
    if (eng && eng.agility_bonus) agility += eng.agility_bonus;
  }

  // Ship Factory Lv100 → shipStatBonus +5% na sve stats brodova
  const sfLv       = buildings.ship_factory?.level || 0;
  const sfStatMult = sfLv >= 100 ? 1.05 : 1.0;

  return {
    hp:        Math.floor((ship.armor_val + totalShield + ship.structure) * count * sfStatMult),
    dps:       Math.floor(dps * count * sfStatMult),
    armor:     Math.floor(ship.armor_val * count * sfStatMult),
    shield:    Math.floor(totalShield * count * sfStatMult),
    structure: Math.floor(ship.structure * count * sfStatMult),
    agility:   agility,
    speed:     speed,
    stability: ship.stability,
    count,
    power:     calcSlotPower(ship, dps, count),
  };
}

// ── POWER SCORE ──
function calcSlotPower(ship, dps, count) {
  const weapMult   = typeof getWeaponsDpsBonus    === 'function' ? (1 + getWeaponsDpsBonus()    / 100) : 1;
  const shieldMult = typeof getShieldBonus        === 'function' ? (1 + getShieldBonus()        / 100) : 1;
  const armorMult  = typeof getArmorDmgReduction  === 'function' ? (1 + getArmorDmgReduction()  / 100) : 1;
  const effDps     = dps           * weapMult;
  const effShield  = ship.shield   * shieldMult;
  const effArmor   = ship.armor_val * armorMult;
  return Math.floor((effArmor + effShield * 0.5 + ship.structure + ship.agility * 10 + effDps * 10) * count);
}

// ── STATISTIKE CIJELE FLOTE ──
function calcFleetStats(fleetSlots) {
  let total = { hp: 0, dps: 0, armor: 0, shield: 0, structure: 0, power: 0, count: 0, he3Cost: 0 };
  let minSpeed = 99, minAgility = 99;

  fleetSlots.forEach(slot => {
    if (!slot) return;
    const s = calcSlotStats(slot);
    if (!s) return;
    total.hp        += s.hp;
    total.dps       += s.dps;
    total.armor     += s.armor;
    total.shield    += s.shield;
    total.structure += s.structure;
    total.power     += s.power;
    total.count     += s.count;
    if (s.speed   < minSpeed)   minSpeed   = s.speed;
    if (s.agility < minAgility) minAgility = s.agility;
    // He3 cost po misiji — uzimamo iz engine definicije
    const engId = slot.engine || (slot.ship && slot.ship.engine);
    if (engId) {
      const engDef = (typeof ENGINES !== 'undefined' ? ENGINES : []).find(e => e.id === engId);
      if (engDef && engDef.he3_cost != null) total.he3Cost += engDef.he3_cost;
      else total.he3Cost += 0.005;
    } else {
      total.he3Cost += 0.005;
    }
  });

  total.speed   = minSpeed   === 99 ? 0 : minSpeed;
  total.agility = minAgility === 99 ? 0 : minAgility;
  return total;
}

function calcFleetTotalPower() {
  const deployed = getAllDeployedSlots();
  if (deployed.length > 0) return calcFleetStats(deployed).power;
  return calcFleetStats(fleet).power; // backward compat
}

// ── VALIDACIJA SLOTA ──
function slotMatches(slot, shipId, loadout) {
  if (!slot) return false;
  if (slot.ship_id !== shipId) return false;
  if (loadout.design_id && slot.design_id) return slot.design_id === loadout.design_id;
  return true;
}

// ── DODAJ BRODOVE U FLOTU ──
function addShipsToFleet(shipId, loadout, count) {
  // Uvijek koristiti _currentFleet() — komandirov fleet ili globalni ako nema komandira
  const f = _currentFleet();

  const existingIdx = f.findIndex(s => slotMatches(s, shipId, loadout));

  if (existingIdx !== -1) {
    const newCount = f[existingIdx].count + count;
    f[existingIdx].count = Math.min(3000, newCount);
    if (newCount > 3000) toast('⚠️ Maksimum 3000 brodova po slotu!', 'warn');
    else toast(`✅ Dodano ${count}x u slot ${existingIdx + 1}`, 'ok');
    renderFleet();
    if (typeof updateHangarStatus === 'function') updateHangarStatus();
    saveGame();
    return true;
  }

  const emptyIdx = f.findIndex(s => s === null);
  if (emptyIdx === -1) {
    // Provjeri je li komandir uopšte odabran
    const viewId = getViewingCmdId();
    if (!viewId) {
      toast('❌ Odaberi komandira u Fleet tabu pa dodaj brodove!', 'err');
    } else {
      toast('❌ Komandir ima punu flotu! Svih 9 slotova zauzeto.', 'err');
    }
    return false;
  }

  f[emptyIdx] = { ship_id: shipId, count: Math.min(count, 3000), ...loadout };
  toast(`✅ ${count}x dodano u slot ${emptyIdx + 1}`, 'ok');
  addLog(`🚀 ${count}x ${shipId} dodano u flotu.`);
  renderFleet();
  if (typeof updateHangarStatus === 'function') updateHangarStatus();
  saveGame();
  return true;
}

// ── Dohvati aktuelni fleet array (komandirov ili globalni) ──
function _currentFleet() {
  const cmdId = getViewingCmdId();
  return cmdId ? getCmdFleet(cmdId) : fleet;
}

// ── UKLONI SVE IZ SLOTA → hangar ──
function removeFleetSlot(slotIdx) {
  if (slotIdx < 0 || slotIdx >= 9) return;
  const f    = _currentFleet();
  const slot = f[slotIdx];
  if (!slot) return;
  const ship = getShipById(slot.ship_id);
  if (!confirm(`Vratiti sve (${slot.count}x ${ship?.name || slot.ship_id}) u hangar?`)) return;

  if (slot.design_id) {
    const existing = hangar.find(h => h.design_id === slot.design_id);
    if (existing) existing.count += slot.count;
    else hangar.push({ design_id: slot.design_id, count: slot.count });
    toast(`🏠 ${slot.count}x vraćeno u hangar.`, 'ok');
  } else {
    toast('🗑️ Uklonjeno (bez dizajna — nije vraćeno u hangar).', 'warn');
  }

  f[slotIdx] = null;
  renderFleet();
  if (typeof updateHangarStatus === 'function') updateHangarStatus();
  saveGame();
  addLog(`🏠 Slot ${slotIdx + 1} obrisan.`);
}

// ── PREMJESTI SLOT ──
function moveFleetSlot(fromIdx, toIdx) {
  if (fromIdx === toIdx) return;
  const f        = _currentFleet();
  const temp     = f[fromIdx];
  f[fromIdx]     = f[toIdx];
  f[toIdx]       = temp;
  renderFleet();
  saveGame();
}

// ── RENDER FLOTE ──
function renderFleet() {
  const el = document.getElementById('fleetGrid');
  if (!el) return;

  // Sve deployane flote za combined stats
  const allSlots   = getAllDeployedSlots();
  const stats      = allSlots.length > 0 ? calcFleetStats(allSlots) : calcFleetStats(fleet);
  const deployed   = window._deployedCommanders || [];
  const maxDeploy  = getMaxDeployedCommanders();
  const viewingId  = getViewingCmdId();

  // Lookup svih komandira
  const allCmds = [
    ...(typeof COMMANDERS !== 'undefined' ? COMMANDERS : []),
    ...(typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
    ...(typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  ];
  const getCmd = id => allCmds.find(c => c.id === id) || null;
  const getOwned = id => (window.ownedCommanders || []).find(o => o.id === id) || null;

  const rarC = typeof rarityColor === 'function' ? rarityColor : () => '#aaa';
  const rarG = typeof rarityGlow  === 'function' ? rarityGlow  : () => '#888';

  // ── COMMANDER FILTER ──
  if (!window._fleetCmdFilter) window._fleetCmdFilter = { rarity: 'all', faction: 'all' };
  const flt = window._fleetCmdFilter;

  // Skupi dostupne frakcije od deployanih komandira
  const allFactions = [...new Set(deployed.map(id => {
    const d = getCmd(id);
    return d?.faction || d?.series || null;
  }).filter(Boolean))];

  const selStyle = `style="flex:1;min-width:120px;padding:7px 10px;border-radius:6px;
    background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);
    color:#c8d8e8;font-size:0.65rem;cursor:pointer;outline:none;
    font-family:'Orbitron',monospace;letter-spacing:0.5px"`;

  const raritySelect = `<select ${selStyle} onchange="window._fleetCmdFilter.rarity=this.value;renderFleet()">
    <option value="all"${flt.rarity==='all'?' selected':''}>★ Svi Rariteti</option>
    <option value="L"${flt.rarity==='L'?' selected':''}>★ Legendary</option>
    <option value="E"${flt.rarity==='E'?' selected':''}>◆ Epic</option>
    <option value="R"${flt.rarity==='R'?' selected':''}>● Rare</option>
    <option value="C"${flt.rarity==='C'?' selected':''}>○ Common</option>
  </select>`;

  const factionSelect = allFactions.length > 1 ? `<select ${selStyle}
    onchange="window._fleetCmdFilter.faction=this.value;renderFleet()">
    <option value="all"${flt.faction==='all'?' selected':''}>⬡ Sve Frakcije</option>
    ${allFactions.map(f => `<option value="${f}"${flt.faction===f?' selected':''}>${f}</option>`).join('')}
  </select>` : '';

  const filterBar = `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      ${raritySelect}
      ${factionSelect}
    </div>`;

  // Filtriraj deployed komandire
  const filteredDeployed = deployed.filter(cmdId => {
    const d = getCmd(cmdId);
    if (!d) return true;
    if (flt.rarity !== 'all' && d.rarity !== flt.rarity) return false;
    if (flt.faction !== 'all') {
      const f = d.faction || d.series || null;
      if (f !== flt.faction) return false;
    }
    return true;
  });

  // ── COMMANDER TABOVI ──
  const cmdTabs = filteredDeployed.map(cmdId => {
    const def    = getCmd(cmdId);
    const owned  = getOwned(cmdId);
    const rc     = def ? rarC(def.rarity) : '#aaa';
    const isView = cmdId === viewingId;
    const isAct  = cmdId === window._activeCommander;
    const cFleet = getCmdFleet(cmdId);
    const filled = cFleet.filter(Boolean).length;

    return `
      <div onclick="setViewingCmd('${cmdId}')"
        style="flex:1;min-width:0;cursor:pointer;padding:10px 12px;border-radius:8px;
          border:${isView ? `2px solid ${rc}` : '1px solid rgba(255,255,255,0.08)'};
          background:${isView ? rc+'14' : 'rgba(0,0,0,0.3)'};
          transition:all 0.2s;position:relative">
        ${isAct ? `<div style="position:absolute;top:4px;right:4px;font-size:0.45rem;
          color:${rc};background:${rc}22;border-radius:3px;padding:1px 4px;
          font-family:'Orbitron',monospace">★ LEAD</div>` : ''}
        <div style="display:flex;align-items:center;gap:7px;margin-bottom:4px">
          <span style="font-size:1.4rem;filter:drop-shadow(0 0 6px ${rc}88)">${def?.icon || '👤'}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:0.65rem;font-weight:700;color:${rc};
              white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${def?.name || '???'}
            </div>
            <div style="font-size:0.52rem;color:#6a90b8">Lv.${owned?.level || 1}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div style="display:flex;gap:2px">
            ${Array.from({length:9},(_,i) => `<div style="width:5px;height:5px;border-radius:1px;
              background:${cFleet[i] ? rc : 'rgba(255,255,255,0.08)'}"></div>`).join('')}
          </div>
          <span style="font-size:0.5rem;color:#6a90b8">${filled}/9</span>
        </div>
      </div>`;
  });

  // Prazni slot za dodavanje komandira
  const emptySlots = maxDeploy - deployed.length;
  const emptySlotsHtml = Array.from({length: emptySlots}, (_, i) => `
    <div onclick="showPanel('commander-cards')"
      style="flex:1;min-width:0;cursor:pointer;padding:10px 12px;border-radius:8px;
        border:1px dashed rgba(170,68,255,0.25);background:rgba(0,0,0,0.15);
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
        opacity:0.5;transition:opacity 0.2s;min-height:82px"
      onmouseenter="this.style.opacity='0.8'" onmouseleave="this.style.opacity='0.5'">
      <div style="font-size:1.2rem;color:#aa44ff">+</div>
      <div style="font-size:0.55rem;color:#6a90b8;text-align:center">Deploy<br>komandira</div>
    </div>`).join('');

  // Locked slotovi
  const lockedCount = 9 - maxDeploy;
  const lockedHtml = lockedCount > 0 ? `
    <div style="flex:1;min-width:0;padding:10px;border-radius:8px;
      border:1px dashed rgba(255,255,255,0.05);background:rgba(0,0,0,0.1);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      opacity:0.3;min-height:82px">
      <div style="font-size:1rem">🔒</div>
      <div style="font-size:0.5rem;color:#6a90b8;text-align:center;margin-top:3px">
        ${lockedCount} zaključano<br>Level ${commander.level < 25 ? '25/50/75' : commander.level < 50 ? '50/75' : '75'}+
      </div>
    </div>` : '';

  // ── VIEWING COMMANDER INFO ──
  const viewDef   = getCmd(viewingId);
  const viewOwned = getOwned(viewingId);
  const viewFleet = viewingId ? getCmdFleet(viewingId) : Array(9).fill(null);
  const viewRc    = viewDef ? rarC(viewDef.rarity) : '#00d4ff';
  const isLeadCmd = viewingId === window._activeCommander;

  let viewHeader = '';
  if (viewDef && viewOwned) {
    viewHeader = `
      <div class="card" style="margin-bottom:12px;border-color:${viewRc}33;padding:10px 16px">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <div style="font-size:2.2rem;filter:drop-shadow(0 0 10px ${viewRc}88)">${viewDef.icon}</div>
          <div style="flex:1;min-width:120px">
            <div style="font-size:0.55rem;color:#6a90b8;font-family:'Orbitron',monospace;
              letter-spacing:1px">${isLeadCmd ? '★ LEAD KOMANDIR' : 'KOMANDIR'} · ${viewDef.rarity}</div>
            <div style="font-size:0.85rem;font-weight:700;color:${viewRc};
              font-family:'Orbitron',monospace">${viewDef.name}
              <span style="font-size:0.58rem;color:#6a90b8"> · Lv.${viewOwned.level}</span>
            </div>
            ${viewDef.passive ? `<div style="font-size:0.58rem;color:#aa44ff;margin-top:2px">
              🛡️ ${viewDef.passive.name}: ${viewDef.passive.desc || ''}</div>` : ''}
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            ${!isLeadCmd ? `<button class="btn" style="font-size:0.6rem;padding:3px 10px"
              onclick="window._activeCommander='${viewingId}';renderFleet();saveGame();toast('★ Lead komandir promijenjen!','ok')">
              ★ Postavi za Lead
            </button>` : ''}
            <button class="btn btn-r" style="font-size:0.6rem;padding:3px 10px"
              onclick="undeployCommander('${viewingId}')">
              🏠 Povuci
            </button>
          </div>
        </div>
      </div>`;
  } else {
    viewHeader = `
      <div class="card" style="margin-bottom:12px;border-color:rgba(170,68,255,0.15);
        padding:20px;text-align:center">
        <div style="font-size:2rem;margin-bottom:8px;opacity:0.3">👤</div>
        <div style="font-size:0.78rem;color:#6a90b8;margin-bottom:10px">
          Nema deployovanog komandira.<br>
          <span style="font-size:0.65rem">Idi na 🃏 Karte → Deploy komandira</span>
        </div>
        <button class="btn" style="font-size:0.72rem"
          onclick="window._cardTab='fleet';showPanel('commander-cards')">
          🚀 Deploy Komandira
        </button>
      </div>`;
  }

  // ── COMBINED STATS (svi komandiri) ──
  const totalPower = Math.floor(stats.power);
  const statsHtml = `
    <div class="card" style="margin-bottom:14px">
      <div style="font-size:0.58rem;color:#6a90b8;font-family:'Orbitron',monospace;
        letter-spacing:2px;margin-bottom:8px">
        📊 UKUPNA MOĆ FLOTE (${deployed.length} komandira · ${allSlots.length} flotnih grupa)
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;text-align:center">
        ${[
          { label:'MOĆ',     val: fmt(stats.power),              color:'#00d4ff' },
          { label:'HP',      val: fmt(stats.hp),                  color:'#00ff88' },
          { label:'DPS',     val: fmt(stats.dps),                 color:'#ff4444' },
          { label:'SHIELD',  val: fmt(stats.shield),              color:'#4488ff' },
          { label:'BRODOVI', val: fmt(stats.count),               color:'#ffcc44' },
          { label:'BRZINA',  val: stats.speed || 0,               color:'#aa44ff' },
          { label:'⛽/MIS',  val: (stats.he3Cost||0).toFixed(3), color:'#ff9944' },
        ].map(s => `
          <div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:6px 3px">
            <div style="font-size:0.5rem;color:#6a90b8;margin-bottom:2px">${s.label}</div>
            <div style="font-size:0.82rem;font-family:'Orbitron',monospace;color:${s.color}">${s.val}</div>
          </div>`).join('')}
      </div>
    </div>`;

  // Provjeri stare brodove u globalnom fleet-u
  const oldFleetCount = fleet.filter(s => s !== null).length;
  const migrationBanner = (oldFleetCount > 0 && deployed.length > 0) ? `
    <div style="background:rgba(255,204,68,0.1);border:1px solid rgba(255,204,68,0.4);
      border-radius:8px;padding:10px 14px;margin-bottom:12px;
      display:flex;align-items:center;gap:10px">
      <div style="font-size:1.4rem">⚠️</div>
      <div style="flex:1">
        <div style="font-size:0.72rem;font-weight:700;color:#ffcc44">
          ${oldFleetCount} flota${oldFleetCount > 1 ? 'e' : ''} u starom sistemu!
        </div>
        <div style="font-size:0.6rem;color:#6a90b8">
          Brodovi su u starom fleet arrayu — klikni da ih prebaciš aktivnom komandiru
        </div>
      </div>
      <button class="btn btn-g" style="font-size:0.65rem;padding:4px 12px;white-space:nowrap"
        onclick="migrateGlobalFleetToCommander(getViewingCmdId());renderFleet()">
        ↗️ Migracija
      </button>
    </div>` : '';

  // Aktivan komandir info bar (jasno pokazuje kome idu brodovi)
  const activeInfoBar = viewingId ? `
    <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.2);
      border-radius:6px;padding:6px 12px;margin-bottom:10px;
      display:flex;align-items:center;gap:8px">
      <div style="font-size:0.55rem;color:#00d4ff;font-family:'Orbitron',monospace;letter-spacing:1px">
        ✏️ DODAJEŠ BRODOVE KOMANDIRU:
      </div>
      <div style="font-size:0.72rem;font-weight:700;color:${viewRc}">
        ${viewDef?.icon || '👤'} ${viewDef?.name || '?'}
      </div>
      <div style="font-size:0.55rem;color:#6a90b8;margin-left:auto">
        ${viewFleet.filter(Boolean).length}/9 slotova
      </div>
    </div>` : '';

  el.innerHTML = `
    <!-- Commander filter -->
    ${deployed.length > 1 ? filterBar : ''}

    <!-- Commander tabovi -->
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      ${cmdTabs.join('')}
      ${emptySlotsHtml}
      ${lockedHtml}
    </div>

    <!-- Migracija stare flote -->
    ${migrationBanner}

    <!-- Viewing commander header -->
    ${viewHeader}

    <!-- Info bar: kome idu brodovi -->
    ${activeInfoBar}

    <!-- 3×3 grid odabranog komandira -->
    ${viewingId || deployed.length === 0 ? `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">
        ${viewFleet.map((slot, idx) => renderFleetSlot(slot, idx)).join('')}
      </div>` : ''}

    <!-- Combined stats -->
    ${deployed.length > 0 ? statsHtml : ''}
  `;
}

// ── RENDER JEDNOG SLOTA ──
function renderFleetSlot(slot, idx) {
  const cmdId = getViewingCmdId();
  if (!slot) {
    const canAdd = !!cmdId; // može dodati samo ako ima komandir
    return `
      <div class="card" style="min-height:160px;display:flex;align-items:center;
        justify-content:center;border:1px dashed rgba(0,212,255,0.2);
        cursor:${canAdd?'pointer':'default'};opacity:${canAdd?'0.5':'0.25'}"
        ${canAdd ? `onclick="openShipSelector(${idx})"` : ''}>
        <div style="text-align:center;color:#6a90b8">
          <div style="font-size:2rem;margin-bottom:6px">${canAdd?'+':'🔒'}</div>
          <div style="font-size:0.72rem">${canAdd?'Dodaj brodove':'Nema komandira'}</div>
          <div style="font-size:0.65rem">Slot ${idx + 1}</div>
        </div>
      </div>`;
  }

  const ship = getShipById(slot.ship_id);
  if (!ship) return `<div class="card" style="min-height:160px;color:#ff3355;text-align:center">⚠️ Greška</div>`;

  const cls     = SHIP_CLASSES[getShipClass(slot.ship_id)];
  const s       = calcSlotStats(slot);
  const pctFill = Math.min(100, (slot.count / 3000) * 100);
  const design  = slot.design_id ? shipDesigns.find(d => d.id === slot.design_id) : null;
  const hangarCount = slot.design_id ? (hangar.find(h => h.design_id === slot.design_id)?.count || 0) : 0;

  // Prikaz opreme
  let equipHtml = '';
  for (let i = 1; i <= 4; i++) {
    if (slot[`weapon_${i}`]) equipHtml += `<div>⚔️ ${slot[`weapon_${i}`]}</div>`;
  }
  for (let i = 1; i <= 3; i++) {
    if (slot[`shield_${i}`]) equipHtml += `<div>🛡️ ${slot[`shield_${i}`]}</div>`;
  }
  if (slot.engine_1 || slot.engine_id) equipHtml += `<div>🔩 ${slot.engine_1 || slot.engine_id}</div>`;
  if (!equipHtml) equipHtml = '<div style="opacity:0.4">Bez opreme</div>';

  return `
    <div class="card" style="border-color:${cls?.color || '#00d4ff'}33">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
        <div>
          <div style="font-size:0.8rem;font-weight:700;color:${cls?.color || 'white'}">
            ${design?.name || ship.name}
          </div>
          <div style="font-size:0.62rem;color:#6a90b8">${ship.name} · ${cls?.name || ''}</div>
        </div>
        <button class="btn btn-r" style="font-size:0.6rem;padding:2px 6px"
          title="Vrati sve u hangar"
          onclick="removeFleetSlot(${idx})">✕</button>
      </div>

      <!-- Count bar -->
      <div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px">
          <span style="font-size:0.62rem;color:#6a90b8">U floti</span>
          <span style="font-size:0.72rem;color:white;font-family:'Share Tech Mono',monospace">
            ${fmt(slot.count)} / 3000
          </span>
        </div>
        <div class="pbar"><div class="pbar-fill" style="width:${pctFill}%"></div></div>
        ${hangarCount > 0 ? `<div style="font-size:0.6rem;color:#ffcc44;margin-top:2px">🏠 ${fmt(hangarCount)} u hangaru</div>` : ''}
      </div>

      <!-- Stats -->
      <div style="font-size:0.63rem;font-family:'Share Tech Mono',monospace;line-height:1.7;color:#6a90b8;margin-bottom:8px">
        <div>🛡️ Shield: <span style="color:#00d4ff">${fmt(s.shield)}</span></div>
        <div>❤️ HP: <span style="color:white">${fmt(s.hp)}</span></div>
        <div>💨 Speed: <span style="color:#aa44ff">${s.speed}</span></div>
        <div>⚔️ DPS: <span style="color:#ff4444">${fmt(s.dps)}</span></div>
        <div>💫 Power: <span style="color:#ffcc44">${fmt(s.power)}</span></div>
      </div>

      <!-- Oprema -->
      <div style="font-size:0.6rem;color:#6a90b8;border-top:1px solid rgba(255,255,255,0.05);
        padding-top:6px;margin-bottom:8px;line-height:1.6">
        ${equipHtml}
      </div>

      <!-- Jedan gumb: Upravljaj -->
      <button class="btn btn-gold" style="width:100%;font-size:0.72rem"
        onclick="openSlotManager(${idx})">
        ⚙️ Upravljaj
      </button>

    </div>`;
}

// ── SLOT MANAGER — dodaj/oduzmi iz hangara ──
function openSlotManager(slotIdx) {
  const slot = _currentFleet()[slotIdx];
  if (!slot) return;

  const ship   = getShipById(slot.ship_id);
  const cls    = SHIP_CLASSES[getShipClass(slot.ship_id)];
  const design = slot.design_id ? shipDesigns.find(d => d.id === slot.design_id) : null;
  const hEntry = slot.design_id ? hangar.find(h => h.design_id === slot.design_id) : null;
  const hangarCount = hEntry?.count || 0;
  const maxAdd  = Math.min(hangarCount, 3000 - slot.count);
  const maxBack = slot.count;

  const body = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;text-align:center">
      <div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px">
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">U FLOTI (slot ${slotIdx+1})</div>
        <div style="font-size:1.4rem;font-family:'Orbitron',monospace;color:#00d4ff">${fmt(slot.count)}</div>
      </div>
      <div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px">
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">U HANGARU</div>
        <div style="font-size:1.4rem;font-family:'Orbitron',monospace;color:#ffcc44">${fmt(hangarCount)}</div>
      </div>
    </div>

    <!-- Dodaj iz hangara -->
    <div style="margin-bottom:16px;padding:12px;background:rgba(0,255,136,0.05);
      border:1px solid rgba(0,255,136,0.2);border-radius:6px">
      <div style="font-size:0.72rem;color:#00ff88;margin-bottom:8px;font-weight:700">
        ➕ DODAJ IZ HANGARA U FLOTU
      </div>
      ${maxAdd > 0 ? `
        <div style="display:flex;gap:8px;align-items:center">
          <input id="addCount" type="number" min="1" max="${maxAdd}" value="${maxAdd}"
            style="flex:1;background:#070c1a;border:1px solid rgba(0,255,136,0.3);
              color:white;padding:6px 10px;border-radius:4px;font-size:0.82rem">
          <button class="btn btn-g" onclick="slotManagerAdd(${slotIdx})">➕ Dodaj</button>
        </div>
        <div style="font-size:0.62rem;color:#6a90b8;margin-top:4px">Max: ${fmt(maxAdd)}</div>
      ` : `<div style="font-size:0.72rem;color:#6a90b8">
        ${hangarCount === 0 ? '🏠 Hangar prazan.' : '⚠️ Slot je pun (3000/3000).'}
      </div>`}
    </div>

    <!-- Vrati u hangar -->
    <div style="padding:12px;background:rgba(255,204,68,0.05);
      border:1px solid rgba(255,204,68,0.2);border-radius:6px">
      <div style="font-size:0.72rem;color:#ffcc44;margin-bottom:8px;font-weight:700">
        ➖ VRATI U HANGAR
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <input id="backCount" type="number" min="1" max="${maxBack}" value="1"
          style="flex:1;background:#070c1a;border:1px solid rgba(255,204,68,0.3);
            color:white;padding:6px 10px;border-radius:4px;font-size:0.82rem">
        <button class="btn btn-gold" onclick="slotManagerReturn(${slotIdx})">🏠 Vrati</button>
      </div>
      <div style="font-size:0.62rem;color:#6a90b8;margin-top:4px">Max: ${fmt(maxBack)}</div>
    </div>
  `;

  openModal(
    `⚙️ Upravljaj — ${design?.name || ship?.name || 'Slot ' + (slotIdx+1)}`,
    body,
    [{ label: 'Zatvori', fn: closeModal }]
  );
}

// ── DODAJ IZ HANGARA U SLOT ──
function slotManagerAdd(slotIdx) {
  const slot   = _currentFleet()[slotIdx];
  if (!slot || !slot.design_id) return;
  const hEntry = hangar.find(h => h.design_id === slot.design_id);
  if (!hEntry || hEntry.count === 0) { toast('🏠 Hangar prazan!', 'warn'); return; }

  const count = Math.max(1, Math.min(hEntry.count, 3000 - slot.count, parseInt(document.getElementById('addCount')?.value || '1')));
  if (count <= 0) { toast('⚠️ Slot je pun!', 'warn'); return; }

  slot.count    += count;
  hEntry.count  -= count;
  if (hEntry.count <= 0) hangar.splice(hangar.indexOf(hEntry), 1);

  closeModal();
  renderFleet();
  if (typeof updateHangarStatus === 'function') updateHangarStatus();
  saveGame();
  toast(`✅ +${count} brodova u slot ${slotIdx + 1}`, 'ok');
  addLog(`➕ ${count}x dodano u slot ${slotIdx + 1} iz hangara.`);
}

// ── VRATI IZ SLOTA U HANGAR ──
function slotManagerReturn(slotIdx) {
  const f    = _currentFleet();
  const slot = f[slotIdx];
  if (!slot) return;

  const count = Math.max(1, Math.min(slot.count, parseInt(document.getElementById('backCount')?.value || '1')));

  if (slot.design_id) {
    const hEntry = hangar.find(h => h.design_id === slot.design_id);
    if (hEntry) hEntry.count += count;
    else hangar.push({ design_id: slot.design_id, count });
  }

  slot.count -= count;
  if (slot.count <= 0) f[slotIdx] = null;

  closeModal();
  renderFleet();
  if (typeof updateHangarStatus === 'function') updateHangarStatus();
  saveGame();
  toast(`🏠 ${count} brodova vraćeno u hangar.`, 'ok');
  addLog(`➖ ${count}x vraćeno u hangar iz slota ${slotIdx + 1}.`);
}

// ── OPEN SHIP SELECTOR — iz hangara ──
function openShipSelector(slotIdx) {
  if (hangar.length === 0) {
    toast('🏠 Hangar je prazan! Dizajniraj i izgradi brodove.', 'warn');
    return;
  }

  const body = `
    <div style="font-size:0.78rem;color:#6a90b8;margin-bottom:12px">
      Odaberi brodove iz hangara za slot ${slotIdx + 1}:
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;max-height:400px;overflow-y:auto">
      ${hangar.map(h => {
        const design = shipDesigns.find(d => d.id === h.design_id);
        if (!design) return '';
        const ship = getShipById(design.ship_id);
        const cls  = SHIP_CLASSES[design.cls || getShipClass(design.ship_id)];
        return `
          <div class="card" style="cursor:pointer;border-color:${cls?.color || '#00d4ff'}44"
            onclick="selectHangarForSlot(${slotIdx},'${h.design_id}')">
            <div style="font-size:0.78rem;font-weight:700;color:${cls?.color || 'white'}">${design.name}</div>
            <div style="font-size:0.65rem;color:#6a90b8">${ship?.name || ''} · ${cls?.name || ''}</div>
            <div style="font-size:0.72rem;color:white;margin-top:4px">🏠 ${fmt(h.count)} dostupno</div>
          </div>`;
      }).join('')}
    </div>`;

  openModal(`🚀 Hangar → Slot ${slotIdx + 1}`, body);
}

function selectHangarForSlot(slotIdx, designId) {
  closeModal();
  const h = hangar.find(h => h.design_id === designId);
  if (!h || h.count === 0) { toast('🏠 Nema brodova!', 'warn'); return; }
  const design = shipDesigns.find(d => d.id === designId);
  if (!design) return;

  const f        = _currentFleet();
  const existing = f[slotIdx];
  if (existing && existing.design_id !== designId) {
    toast('❌ Slot je zauzet drugim dizajnom! Prvo ga oslobodi.', 'err');
    return;
  }

  const body = `
    <div style="margin-bottom:12px;font-size:0.82rem;color:#6a90b8">
      Dostupno u hangaru: <strong style="color:white">${fmt(h.count)}</strong>
      ${existing ? ` · Već u slotu: <strong style="color:#00d4ff">${fmt(existing.count)}</strong>` : ''}
    </div>
    <div>
      <label style="font-size:0.72rem;color:#6a90b8">Koliko rasporediti:</label>
      <input id="slotDeployCount" type="number" min="1"
        max="${Math.min(h.count, existing ? 3000 - existing.count : 3000)}"
        value="${Math.min(h.count, existing ? 3000 - existing.count : 3000)}"
        style="width:100%;background:#070c1a;border:1px solid rgba(0,212,255,0.3);
          color:white;padding:6px 10px;border-radius:4px;margin-top:4px;font-size:0.82rem">
    </div>`;

  openModal(`🚀 Rasporedi u slot ${slotIdx + 1}`, body, [
    {
      label: '🚀 Rasporedi',
      cls:   'btn-g',
      fn: () => {
        const maxAdd = existing ? 3000 - existing.count : 3000;
        const count  = Math.max(1, Math.min(h.count, maxAdd, parseInt(document.getElementById('slotDeployCount')?.value || '1')));

        const cls    = design.cls || getShipClass(design.ship_id);
        const slots  = typeof getClassSlots === 'function' ? getClassSlots(cls) : { weapon: 4, shield: 1 };
        const loadout = { design_id: design.id, engine_id: design.engine_1 || null, engine_1: design.engine_1 || null };
        for (let i = 1; i <= (slots.weapon || 4); i++) loadout[`weapon_${i}`] = design[`weapon_${i}`] || null;
        for (let i = 1; i <= (slots.shield || 1); i++) loadout[`shield_${i}`] = design[`shield_${i}`] || null;

        if (existing) {
          f[slotIdx].count = Math.min(3000, existing.count + count);
        } else {
          f[slotIdx] = { ...loadout, ship_id: design.ship_id, count };
        }

        h.count -= count;
        if (h.count <= 0) hangar.splice(hangar.indexOf(h), 1);

        closeModal();
        renderFleet();
        if (typeof updateHangarStatus === 'function') updateHangarStatus();
        saveGame();
        toast(`✅ ${count}x ${design.name} → slot ${slotIdx + 1}`, 'ok');
        addLog(`🚀 ${count}x ${design.name} raspoređeno u slot ${slotIdx + 1}.`);
      }
    },
    { label: 'Odustani', fn: closeModal }
  ]);
}