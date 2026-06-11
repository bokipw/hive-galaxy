// ============================================================
// HIVE GALAXY — js/systems/colonies.js
// Kolonije — kolonizacija planeta, produkcija, odbrana
// ============================================================

// ── TIPOVI PLANETA ──
const PLANET_TYPES = {
  rocky:    { name: 'Kameni',     icon: '🪨', color: '#ff8833', metalBonus: 30, crystalBonus: 5,  he3Bonus: 5,  desc: 'Bogat rudnicima metala. Idealan za industrijsku koloniju.' },
  crystal:  { name: 'Kristalni',  icon: '💎', color: '#4488ff', metalBonus: 5,  crystalBonus: 30, he3Bonus: 5,  desc: 'Kristalne formacije svuda. Odličan za nano-industriju.' },
  gas:      { name: 'Plinski',    icon: '🌫️', color: '#00ff88', metalBonus: 5,  crystalBonus: 5,  he3Bonus: 30, desc: 'Atmosfera bogata He3. Strateški važan za brodove.' },
  balanced: { name: 'Balansiran', icon: '🌍', color: '#00d4ff', metalBonus: 15, crystalBonus: 15, he3Bonus: 15, desc: 'Ravnomjerna distribucija resursa. Fleksibilan razvoj.' },
  barren:   { name: 'Pustošan',   icon: '🏜️', color: '#ffcc44', metalBonus: 10, crystalBonus: 10, he3Bonus: 10, desc: 'Oskudna tla. Niski prinos, ali bez konkurencije.' },
  volcanic: { name: 'Vulkanski',  icon: '🌋', color: '#ff4444', metalBonus: 40, crystalBonus: 0,  he3Bonus: 20, desc: 'Magma bogata metalima. Opasno, ali izuzetno vrijedno.' },
  frozen:   { name: 'Zaleđen',    icon: '❄️', color: '#aaddff', metalBonus: 0,  crystalBonus: 40, he3Bonus: 10, desc: 'Led konzervira kristalne strukture. Tehničarska zlatna jama.' },
  nebula:   { name: 'Maglinska',  icon: '🌌', color: '#aa44ff', metalBonus: 10, crystalBonus: 20, he3Bonus: 40, desc: 'Ionizovana magla puna He3. Rijetka i moćna lokacija.' },
};

// ── COLONY BUILDINGS ──
const COLONY_BUILDINGS = {
  // ── Resursi ──
  extractor: {
    name: 'Metal Ekstraktor', icon: '⛏️', maxLevel: 10,
    desc: (lv) => `+${lv * 20}% metal produkcija`,
    effect: (lv) => ({ metalMult: 1 + lv * 0.20 }),
    cost: (lv) => ({ metal: Math.floor(2000 * Math.pow(1.6, lv)), crystal: Math.floor(800  * Math.pow(1.6, lv)), he3: Math.floor(400  * Math.pow(1.6, lv)) }),
  },
  refinery: {
    name: 'Kristalna Rafinerija', icon: '💠', maxLevel: 10,
    desc: (lv) => `+${lv * 20}% crystal produkcija`,
    effect: (lv) => ({ crystalMult: 1 + lv * 0.20 }),
    cost: (lv) => ({ metal: Math.floor(800  * Math.pow(1.6, lv)), crystal: Math.floor(2000 * Math.pow(1.6, lv)), he3: Math.floor(400  * Math.pow(1.6, lv)) }),
  },
  harvester: {
    name: 'He3 Sakupljač', icon: '⛽', maxLevel: 10,
    desc: (lv) => `+${lv * 20}% He3 produkcija`,
    effect: (lv) => ({ he3Mult: 1 + lv * 0.20 }),
    cost: (lv) => ({ metal: Math.floor(800  * Math.pow(1.6, lv)), crystal: Math.floor(800  * Math.pow(1.6, lv)), he3: Math.floor(2000 * Math.pow(1.6, lv)) }),
  },
  // ── Specijalne ──
  jump_gate: {
    name: 'Galaktička Vrata', icon: '🌀', maxLevel: 1,
    desc: (lv) => lv ? 'Skok flote između kolonija · 1h cooldown' : 'Nije izgrađeno',
    effect: (lv) => ({ hasJumpGate: lv > 0 }),
    cost: () => ({ metal: 50000, crystal: 30000, he3: 15000 }),
  },
  // ── Odbrana (iste kao na bazi) ──
  turret: {
    name: 'Laserski Top', icon: '🔫', maxLevel: 10,
    desc: (lv) => `+${lv * 80} odbrana kolonije`,
    effect: (lv) => ({ defenseBonus: lv * 80 }),
    cost: (lv) => ({ metal: Math.floor(1500 * Math.pow(1.5, lv)), crystal: Math.floor(500  * Math.pow(1.5, lv)), he3: Math.floor(200  * Math.pow(1.5, lv)) }),
  },
  missile_bat: {
    name: 'Raketna Baterija', icon: '🚀', maxLevel: 10,
    desc: (lv) => `+${lv * 80} odbrana kolonije`,
    effect: (lv) => ({ defenseBonus: lv * 80 }),
    cost: (lv) => ({ metal: Math.floor(1800 * Math.pow(1.5, lv)), crystal: Math.floor(700  * Math.pow(1.5, lv)), he3: Math.floor(300  * Math.pow(1.5, lv)) }),
  },
  shield_gen: {
    name: 'Shield Generator', icon: '🛡️', maxLevel: 10,
    desc: (lv) => `+${lv * 80} odbrana kolonije`,
    effect: (lv) => ({ defenseBonus: lv * 80 }),
    cost: (lv) => ({ metal: Math.floor(2000 * Math.pow(1.5, lv)), crystal: Math.floor(1200 * Math.pow(1.5, lv)), he3: Math.floor(400  * Math.pow(1.5, lv)) }),
  },
  sensor: {
    name: 'Senzorski Toranj', icon: '📡', maxLevel: 5,
    desc: (lv) => `+${lv * 80} odbrana · Skenira ${lv} sistem${lv > 1 ? 'a' : ''} · 5k He3/sken`,
    effect: (lv) => ({ defenseBonus: lv * 80, scanRange: lv }),
    cost: (lv) => ({ metal: Math.floor(1200 * Math.pow(1.8, lv)), crystal: Math.floor(800  * Math.pow(1.8, lv)), he3: Math.floor(600  * Math.pow(1.8, lv)) }),
  },
};

// ── JUMP GATE ──
if (!window._jumpGateCooldowns) window._jumpGateCooldowns = {}; // { colonyId: timestamp_ms }
if (!window._fleetPosition)     window._fleetPosition     = null; // colonyId ili null (= baza)

const JUMP_GATE_COOLDOWN_MS = 3600 * 1000; // 1 sat

function getJumpGateCooldownLeft(colonyId) {
  const fired = window._jumpGateCooldowns[colonyId] || 0;
  return Math.max(0, Math.ceil((fired + JUMP_GATE_COOLDOWN_MS - Date.now()) / 1000));
}

function getColoniesWithJumpGate() {
  return colonies.filter(c => (c.buildings || {}).jump_gate > 0);
}

// He3 popust kada je flota pozicionirana na koloniji blizu mete
// Vraća multiplikator 0.0-1.0 (1.0 = nema popusta, 0.0 = besplatno)
function getJumpGateHe3Mult(targetDistance) {
  if (!window._fleetPosition) return 1.0;
  const col = colonies.find(c => c.id === window._fleetPosition);
  if (!col || !(col.buildings || {}).jump_gate) {
    window._fleetPosition = null; return 1.0;
  }
  const diff = Math.abs((col.distance || 1) - (targetDistance || 1));
  if (diff === 0)      return 0.0;  // isti sistem — besplatno
  if (diff === 1)      return 0.25; // 1 sistem dalje — 75% popust
  if (diff === 2)      return 0.5;  // 2 sistema dalje — 50% popust
  return 1.0;                       // previše daleko — nema popusta
}

function jumpFleetToColony(toColonyId) {
  const toCol = colonies.find(c => c.id === toColonyId);
  if (!toCol) return;
  if (!((toCol.buildings || {}).jump_gate > 0)) {
    toast('❌ Odredišna kolonija nema Galaktička Vrata!', 'err'); return;
  }

  // Provjeri cooldown odredišta
  const toCd = getJumpGateCooldownLeft(toColonyId);
  if (toCd > 0) {
    const fmtT = toCd >= 60 ? `${Math.ceil(toCd/60)}min` : `${toCd}s`;
    toast(`⏳ Vrata na ${toCol.name} su hladna još ${fmtT}!`, 'warn'); return;
  }

  // Provjeri izvor — baza ili kolonija
  if (!window._fleetPosition) {
    // Fleet je na bazi — baza mora imati Jump Gate
    if (!((buildings.jump_gate?.level || 0) > 0)) {
      toast('❌ Baza nema izgrađena Galaktička Vrata! (Specijalne zgrade → Jump Gate)', 'err'); return;
    }
    const baseCd = getJumpGateCooldownLeft('base');
    if (baseCd > 0) {
      const fmtT = baseCd >= 60 ? `${Math.ceil(baseCd/60)}min` : `${baseCd}s`;
      toast(`⏳ Vrata na Bazi su hladna još ${fmtT}!`, 'warn'); return;
    }
    window._jumpGateCooldowns['base'] = Date.now();
  } else {
    // Fleet je na koloniji — ta kolonija mora imati Jump Gate
    const fromCol = colonies.find(c => c.id === window._fleetPosition);
    if (!fromCol || !((fromCol.buildings || {}).jump_gate > 0)) {
      toast('❌ Kolonija na kojoj je flota nema Galaktička Vrata!', 'err'); return;
    }
    const fromCd = getJumpGateCooldownLeft(window._fleetPosition);
    if (fromCd > 0) {
      const fmtT = fromCd >= 60 ? `${Math.ceil(fromCd/60)}min` : `${fromCd}s`;
      toast(`⏳ Vrata na ${fromCol.name} su hladna još ${fmtT}!`, 'warn'); return;
    }
    window._jumpGateCooldowns[window._fleetPosition] = Date.now();
  }

  window._jumpGateCooldowns[toColonyId] = Date.now();
  window._fleetPosition = toColonyId;

  if (typeof renderBase === 'function') renderBase();
  renderColonies();
  saveGame();
  toast(`🌀 Flota preskočila na ${toCol.name} (Sistem ${toCol.distance})! He3 popust aktivan. Cooldown: 1h`, 'ok');
  addLog(`🌀 Jump Gate: flota premještena na ${toCol.name} (Sistem ${toCol.distance})`);
}

function recallFleetToBase() {
  if (!window._fleetPosition) return;
  const col = colonies.find(c => c.id === window._fleetPosition);
  // Ako oba imaju JG, skok nazad troši cooldown
  const fromHasJG = !!(col?.buildings?.jump_gate > 0);
  const baseHasJG = !!(buildings.jump_gate?.level > 0);
  if (fromHasJG && baseHasJG) {
    window._jumpGateCooldowns[window._fleetPosition] = Date.now();
    window._jumpGateCooldowns['base'] = Date.now();
  }
  window._fleetPosition = null;
  if (typeof renderBase === 'function') renderBase();
  renderColonies();
  saveGame();
  toast(`🏠 Flota povučena na bazu.`, 'ok');
  addLog(`🏠 Flota povučena sa ${col?.name || '?'} na bazu`);
}

// ── SENZORSKA FALANGA — SCAN ──
const SENSOR_SCAN_COST = 5000; // He3

function getSensorPhalanxLevel() {
  // Vraća najviši nivo sensor tornja od svih kolonija
  return colonies.reduce((max, col) => {
    const lv = (col.buildings || {}).sensor || 0;
    return Math.max(max, lv);
  }, 0);
}

function sensorPhalanxScan(colonyId) {
  const colony = colonies.find(c => c.id === colonyId);
  if (!colony) return;
  const phalanxLv = (colony.buildings || {}).sensor || 0;
  if (phalanxLv === 0) { toast('❌ Senzorski Toranj nije izgrađen!', 'err'); return; }
  if (R.he3 < SENSOR_SCAN_COST) {
    toast(`❌ Nema dovoljno He3! Treba ${fmt(SENSOR_SCAN_COST)}, imaš ${R.he3.toFixed(0)}`, 'err'); return;
  }

  R.he3 -= SENSOR_SCAN_COST;
  updateResUI();

  // Generiši scan rezultate ovisno o nivou falange
  const scanData = _generateScanData(phalanxLv, colony);
  _showScanModal(colony, phalanxLv, scanData);
  addLog(`📡 Senzorska Falanga na ${colony.name} aktivirana. (-${fmt(SENSOR_SCAN_COST)} He3)`);
  saveGame();
}

function _generateScanData(phalanxLv, colony) {
  const results = [];
  const planets = generateAvailablePlanets();
  const range   = colony.distance + phalanxLv; // doseg = distanca kolonije + nivo falange

  // Skeniraj planete u dosegu
  planets.forEach((p, idx) => {
    if ((p.distance || 1) > range) return;
    if (colonies.some(c => c.planetId === p.id)) return; // vlastite kolonije preskoči

    const pType = PLANET_TYPES[p.type] || PLANET_TYPES.balanced;
    const conquered = (window._conqueredPlanets || []).includes(p.id);
    const defenders = typeof getPlanetDefenders === 'function' ? getPlanetDefenders(idx) : [];
    const totalFleet = defenders.reduce((s, g) => s + g.count, 0);
    const totalDps   = defenders.reduce((s, g) => s + g.dps,   0);

    results.push({
      name:      p.name,
      type:      pType,
      distance:  p.distance,
      conquered,
      fleet:     totalFleet,
      dps:       Math.floor(totalDps),
      defenders: defenders.slice(0, 4),
      more:      Math.max(0, defenders.length - 4),
    });
  });

  // PvP intel (viši nivo falange = bolje info)
  let pvpIntel = null;
  if (phalanxLv >= 3 && typeof window._pvpOpponents !== 'undefined' && window._pvpOpponents?.length > 0) {
    const opp = window._pvpOpponents[Math.floor(Math.random() * window._pvpOpponents.length)];
    pvpIntel = opp;
  }

  // Event intel (Lv.5 = vidiš sljedeći event)
  let eventIntel = null;
  if (phalanxLv >= 5 && typeof window._nextScheduledEvent !== 'undefined') {
    eventIntel = window._nextScheduledEvent;
  } else if (phalanxLv >= 4) {
    // Nagovjesti tip sljedećeg eventa
    const positiveHint = Math.random() > 0.5;
    eventIntel = { hint: true, positive: positiveHint };
  }

  return { results, pvpIntel, eventIntel, range };
}

function _showScanModal(colony, phalanxLv, data) {
  const { results, pvpIntel, eventIntel, range } = data;

  let html = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <div style="font-size:2rem">📡</div>
      <div>
        <div style="font-size:0.9rem;font-weight:700;color:#00d4ff">Senzorska Falanga</div>
        <div style="font-size:0.65rem;color:#6a90b8">${colony.name} · Lv.${phalanxLv} · Doseg: ${range} sistema</div>
      </div>
    </div>

    <!-- Planete u dosegu -->
    <div style="font-size:0.72rem;font-weight:700;color:#ffcc44;margin-bottom:8px;letter-spacing:1px">
      🌍 SKENIRANE PLANETE (${results.length})
    </div>`;

  if (results.length === 0) {
    html += `<div style="color:#6a90b8;font-size:0.7rem;margin-bottom:12px">Nema neprijateljskih planeta u dosegu.</div>`;
  } else {
    html += `<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">`;
    results.forEach(r => {
      html += `
        <div style="background:rgba(0,0,0,0.3);border-radius:6px;padding:8px;
          border:1px solid ${r.conquered ? 'rgba(0,255,136,0.2)' : 'rgba(255,51,85,0.2)'}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <span style="font-size:0.75rem;font-weight:700;color:${r.type.color}">${r.type.icon} ${r.name}</span>
            <span style="font-size:0.6rem;color:#6a90b8">Sistem ${r.distance}</span>
          </div>
          <div style="font-size:0.62rem;font-family:'Share Tech Mono',monospace;color:#6a90b8;line-height:1.7">
            ${r.conquered
              ? `<span style="color:#00ff88">✅ Već pokoren</span>`
              : `⚔️ Flota: <span style="color:#ff8833">${fmt(r.fleet)} brodova</span>
                 · DPS: <span style="color:#ff3355">${fmt(r.dps)}</span><br>
                 ${r.defenders.map(d => `· ${d.name} ×${d.count}`).join('<br>')}
                 ${r.more > 0 ? `<br><span style="color:#4a6a88">... +${r.more} grupe</span>` : ''}`}
          </div>
        </div>`;
    });
    html += `</div>`;
  }

  // PvP intel
  if (pvpIntel) {
    html += `
      <div style="font-size:0.72rem;font-weight:700;color:#ff3355;margin-bottom:8px;letter-spacing:1px">⚔️ PVP INTEL</div>
      <div style="background:rgba(255,51,85,0.07);border:1px solid rgba(255,51,85,0.2);
        border-radius:6px;padding:8px;margin-bottom:14px;font-size:0.65rem;color:#6a90b8;line-height:1.8">
        Protivnik: <span style="color:white">${pvpIntel.name || 'Nepoznat'}</span><br>
        Rating: <span style="color:#ffcc44">${pvpIntel.rating || '?'}</span>
      </div>`;
  }

  // Event intel
  if (eventIntel) {
    html += `
      <div style="font-size:0.72rem;font-weight:700;color:#aa44ff;margin-bottom:8px;letter-spacing:1px">🔭 EVENT INTEL</div>
      <div style="background:rgba(170,68,255,0.07);border:1px solid rgba(170,68,255,0.2);
        border-radius:6px;padding:8px;font-size:0.65rem;line-height:1.8">
        ${eventIntel.hint
          ? `<span style="color:${eventIntel.positive ? '#00ff88' : '#ff3355'}">
              ${eventIntel.positive ? '🟢 Povoljni event se sprema' : '🔴 Negativni event se sprema'}
             </span>`
          : `<span style="color:#aa44ff">${eventIntel.icon || '⚡'} ${eventIntel.name || 'Nepoznat event'}</span>`}
      </div>`;
  }

  if (typeof showModal === 'function') {
    showModal('📡 Scan Rezultati', html, [{ label: 'Zatvori', action: () => {} }]);
  }
  toast(`📡 Sken završen! Skenirano ${results.length} sistema. (-${fmt(SENSOR_SCAN_COST)} He3)`, 'ok');
}

function getColonyBuildingEffect(colony) {
  const blds = colony.buildings || {};
  let metalMult = 1, crystalMult = 1, he3Mult = 1, defenseBonus = 0, scanRange = 0;
  Object.entries(blds).forEach(([bid, lv]) => {
    if (!lv || lv <= 0) return;
    const bDef = COLONY_BUILDINGS[bid];
    if (!bDef) return;
    const eff = bDef.effect(lv);
    if (eff.metalMult)    metalMult    *= eff.metalMult;
    if (eff.crystalMult)  crystalMult  *= eff.crystalMult;
    if (eff.he3Mult)      he3Mult      *= eff.he3Mult;
    if (eff.defenseBonus) defenseBonus += eff.defenseBonus;
    if (eff.scanRange)    scanRange     = Math.max(scanRange, eff.scanRange);
  });
  return { metalMult, crystalMult, he3Mult, defenseBonus, scanRange };
}

function buildColonyBuilding(colonyId, buildingId) {
  const colony = colonies.find(c => c.id === colonyId);
  if (!colony) return;
  const bDef = COLONY_BUILDINGS[buildingId];
  if (!bDef) return;

  if (!colony.buildings) colony.buildings = {};
  const curLv = colony.buildings[buildingId] || 0;
  if (curLv >= bDef.maxLevel) { toast(`✅ ${bDef.name} je na max nivou!`, 'warn'); return; }

  const cost = bDef.cost(curLv);
  if (!canAfford(cost)) { toast('❌ Nedovoljno resursa!', 'err'); return; }

  spendResources(cost);
  colony.buildings[buildingId] = (curLv + 1);

  updateResUI();
  renderColonies();
  saveGame();
  toast(`${bDef.icon} ${bDef.name} Lv.${curLv + 1} na ${colony.name}!`, 'ok');
  addLog(`${bDef.icon} ${colony.name}: ${bDef.name} → Lv.${curLv + 1}`);
}

// ── MAX KOLONIJE PO JUMP GATE ──
function getMaxColonies() {
  const jgLevel = buildings.jump_gate?.level || 0;
  if (jgLevel === 0) return 0;
  let base = Math.min(9, Math.floor(jgLevel / 10) + 1);
  // Milestone bonusi iz data/buildings.js
  let extra = 0;
  if (typeof getBuildingMilestones === 'function') {
    const m = getBuildingMilestones('jump_gate');
    Object.entries(m).forEach(([mlvl, data]) => {
      if (jgLevel >= parseInt(mlvl) && data.extraColony) extra = Math.max(extra, data.extraColony);
    });
  }
  return Math.min(12, base + extra);
}

// ── GENERIŠI DOSTUPNE PLANETE ZA KOLONIZACIJU ──
function generateAvailablePlanets() {
  if (!window._availablePlanets || window._availablePlanets.length === 0) {
    const types = Object.keys(PLANET_TYPES);
    const names = [
      'Xerath IV', 'Kelos Prime', 'Vorn II', 'Draxis VII', 'Solenne III',
      'Tyrant Belt', 'Nova Kesh', 'Ashfall V', 'Cryonex II', 'Vaelmor',
      'Dust Ring', 'Pyros IX', 'Aquillon', 'Greystone VI', 'Ember Prime',
      'Coldpeak', 'Starfall II', 'Iridion IV', 'Halcyon III', 'Vexius',
    ];
    window._availablePlanets = names.map((name, i) => ({
      id: `planet_${i}`,
      name,
      type: types[i % types.length],
      distance: Math.floor(i / 4) + 1, // 1-5 sistema udaljenosti
      slots: Math.floor(Math.random() * 3) + 3, // 3-5 building slotova
      colonized: false,
    }));
  }
  return window._availablePlanets;
}

// ── CIJENA KOLONIZACIJE ──
function getColonyCost(planet) {
  const dist = planet.distance || 1;
  return {
    metal: Math.floor(5000 * Math.pow(1.5, dist - 1)),
    crystal: Math.floor(3000 * Math.pow(1.5, dist - 1)),
    he3: Math.floor(2000 * Math.pow(1.5, dist - 1)),
  };
}

// ── PRODUKCIJA KOLONIJE ──
// Multiplikator po sistemu (distanci) — dalje = teže osvojiti = više daje
const COLONY_DIST_MULT = {
  1: 1.0,   // Sistem 1 — osnova
  2: 1.4,   // Sistem 2 — 40% više
  3: 2.0,   // Sistem 3 — duplo
  4: 3.0,   // Sistem 4 — 3x
  5: 5.0,   // Sistem 5 — Legendary, 5x
};

function getColonyProduction(colony) {
  const pType    = PLANET_TYPES[colony.type] || PLANET_TYPES.balanced;
  const lvl      = colony.level || 1;
  const distMult = COLONY_DIST_MULT[colony.distance] || 1.0;
  const base     = lvl * 0.005 * distMult;
  const bEff     = getColonyBuildingEffect(colony);

  return {
    metal:   parseFloat((base * (1 + pType.metalBonus   / 100) * bEff.metalMult).toFixed(4)),
    crystal: parseFloat((base * (1 + pType.crystalBonus / 100) * bEff.crystalMult).toFixed(4)),
    he3:     parseFloat((base * (1 + pType.he3Bonus     / 100) * bEff.he3Mult).toFixed(4)),
  };
}

// ── UKUPNA PRODUKCIJA SVIH KOLONIJA ──
function getTotalColonyProduction() {
  return colonies.reduce((acc, col) => {
    const prod = getColonyProduction(col);
    acc.metal += prod.metal;
    acc.crystal += prod.crystal;
    acc.he3 += prod.he3;
    return acc;
  }, { metal: 0, crystal: 0, he3: 0 });
}

// ── CIJENA NADOGRADNJE KOLONIJE ──
function getColonyUpgradeCost(colony) {
  const lvl = colony.level || 1;
  return {
    metal:   Math.floor(1500 * Math.pow(1.10, lvl)),
    crystal: Math.floor(900  * Math.pow(1.10, lvl)),
    he3:     Math.floor(600  * Math.pow(1.10, lvl)),
  };
}

// ── SPY PLANET ──
window._planetSpyData = window._planetSpyData || {};

function spyPlanet(planetId) {
  const planets = generateAvailablePlanets();
  const planet  = planets.find(p => p.id === planetId);
  if (!planet) return;

  const pIdx    = parseInt(planetId.replace('planet_','')) || 0;
  const pType   = PLANET_TYPES[planet.type] || PLANET_TYPES.balanced;
  const diffMap = ['easy','easy','easy','easy','easy',
                   'normal','normal','normal','normal','normal',
                   'nightmare','nightmare','nightmare','nightmare','nightmare',
                   'hell','hell','hell','hell','hell'];
  const modeName = diffMap[pIdx] || 'easy';
  const modeLabels = { easy:'🌿 Easy', normal:'⚔️ Normal', nightmare:'💀 Nightmare', hell:'🔥 Hell' };
  const modeColors = { easy:'#00ff88', normal:'#ffcc44', nightmare:'#ff8833', hell:'#ff3355' };

  // Generiši branitelje da možemo pokazati info
  const defenders = typeof getPlanetDefenders === 'function' ? getPlanetDefenders(pIdx) : [];
  const totalCount = defenders.reduce((s,g) => s+g.count, 0);
  const totalDps   = defenders.reduce((s,g) => s+g.dps,   0);
  const totalHp    = defenders.reduce((s,g) => s+g.hp,    0);

  // Boss / komandiri (grupe sa 'Admiral', 'Fleet Lord', itd.)
  const commanders = defenders.filter(g =>
    g.name.includes('Admiral') || g.name.includes('Lord') || g.name.includes('Commander') || g.name.includes('Supreme')
  );

  const PLANET_REWARDS = {
    1: { metal:10000,  crystal:10000,  he3:10000,  instKeys:10,  cmdKeys:1  },
    2: { metal:20000,  crystal:20000,  he3:20000,  instKeys:15,  cmdKeys:2  },
    3: { metal:50000,  crystal:50000,  he3:50000,  instKeys:20,  cmdKeys:5  },
    4: { metal:100000, crystal:100000, he3:100000, instKeys:50,  cmdKeys:10 },
    5: { metal:500000, crystal:500000, he3:500000, instKeys:100, cmdKeys:50 },
  };
  const rw = PLANET_REWARDS[planet.distance || 1] || PLANET_REWARDS[1];
  const alreadyConquered = (window._conqueredPlanets || []).includes(planet.id);

  const spyHtml = `
    <div style="font-size:0.62rem;color:#6a90b8;margin-bottom:6px;display:flex;align-items:center;gap:6px">
      <span style="color:${modeColors[modeName]};font-weight:700">${modeLabels[modeName]}</span>
      <span>· Level ${pIdx+1}</span>
    </div>

    <div style="font-size:0.6rem;font-family:'Share Tech Mono',monospace;
      background:rgba(0,0,0,0.4);border-radius:5px;padding:8px;margin-bottom:6px;line-height:1.8">
      <div style="color:#6a90b8;margin-bottom:3px;font-size:0.55rem">🌍 PLANETA TIP</div>
      <div style="color:${pType.color}">${pType.icon} ${pType.name}</div>
      <div style="color:#aaa;font-size:0.55rem">${pType.desc || ''}</div>
    </div>

    <div style="font-size:0.6rem;font-family:'Share Tech Mono',monospace;
      background:rgba(255,51,85,0.07);border-radius:5px;padding:8px;margin-bottom:6px;line-height:1.8">
      <div style="color:#ff3355;margin-bottom:3px;font-size:0.55rem">⚔️ ODBRANA (${defenders.length} grupe)</div>
      ${defenders.slice(0,5).map(g => `
        <div>· ${g.name} <span style="color:#ff8833">×${g.count}</span></div>
      `).join('')}
      ${defenders.length > 5 ? `<div style="color:#6a90b8">... +${defenders.length-5} grupe</div>` : ''}
      <div style="margin-top:4px;color:#6a90b8">
        Ukupno brodova: <span style="color:white">${fmt(totalCount)}</span>
        · DPS: <span style="color:#ff8833">${fmt(Math.floor(totalDps))}</span>
      </div>
    </div>

    ${commanders.length > 0 ? `
    <div style="font-size:0.6rem;font-family:'Share Tech Mono',monospace;
      background:rgba(255,170,0,0.07);border-radius:5px;padding:8px;margin-bottom:6px;line-height:1.8">
      <div style="color:#ffaa00;margin-bottom:3px;font-size:0.55rem">👑 KOMANDIRI</div>
      ${commanders.map(c => `<div>· <span style="color:#ffaa00">${c.name}</span> ×${c.count}</div>`).join('')}
    </div>` : ''}

    <div style="font-size:0.6rem;font-family:'Share Tech Mono',monospace;
      background:rgba(0,255,136,0.06);border-radius:5px;padding:8px;line-height:1.8;
      ${alreadyConquered ? 'opacity:0.45;' : ''}">
      <div style="color:#00ff88;margin-bottom:3px;font-size:0.55rem">
        🎁 NAGRADE ${alreadyConquered ? '(već pokupljeno)' : '(jednom)'}
      </div>
      <div>🔩 ${fmt(rw.metal)} &nbsp;💎 ${fmt(rw.crystal)} &nbsp;⛽ ${fmt(rw.he3)}</div>
      <div>🗝️ ${rw.instKeys} inst. ključeva &nbsp;·&nbsp; 🎴 ${rw.cmdKeys} kap. ključ${rw.cmdKeys > 1 ? 'eva' : ''}</div>
    </div>
  `;

  window._planetSpyData[planetId] = spyHtml;
  renderColonies();
  toast(`🔭 ${planet.name} skeniran!`, 'ok');
}

// ── NAPADNI I KOLONIZUJ (iz Colonies tabela) ──
function attackAndColonize(planetId) {
  if (typeof window.launchGalaxyMission === 'function') {
    window.launchGalaxyMission(planetId);
  } else {
    toast('❌ Galaxy sistem nije učitan!', 'err');
  }
}

// ── UNAPREDI KOLONIJU ──
function upgradeColony(colonyId) {
  const colony = colonies.find(c => c.id === colonyId);
  if (!colony) return;

  if (colony.level >= 100) { toast('✅ Kolonija je na MAX nivou!', 'warn'); return; }

  const cost = getColonyUpgradeCost(colony);
  if (!canAfford(cost)) { toast('❌ Nedovoljno resursa!', 'err'); return; }

  spendResources(cost);
  colony.level++;

  // ── NAGRADE ZA TERRAFORMING ──
  // Svaki level → +1 instance key
  R.instanceKeys = (R.instanceKeys || 0) + 1;

  // Milestones → commander keys + 1 slobodan slot
  const CMD_KEY_MILESTONES = { 25: 5, 50: 10, 75: 25, 100: 50 };
  const cmdKeyReward = CMD_KEY_MILESTONES[colony.level] || 0;
  if (cmdKeyReward > 0) {
    R.keys = (R.keys || 0) + cmdKeyReward;
    toast(`🌍 TERRAFORMING MILESTONE Lv.${colony.level}! +${cmdKeyReward} 🃏 Komandir Ključeva!`, 'ok');
    addLog(`🌍 ${colony.name} Lv.${colony.level} — +${cmdKeyReward} Komandir Ključeva`);
  }

  updateResUI();
  renderColonies();
  saveGame();

  toast(`🌍 Terraformer ${colony.name} → Lv.${colony.level}! +1 🗝️`, 'ok');
  addLog(`🌍 Terraformer ${colony.name} → Lv.${colony.level}`);
}

// ── NAPUSTI KOLONIJU ──
function abandonColony(colonyId) {
  if (!confirm('⚠️ Napustiti ovu koloniju? Izgubit ćeš sav napredak!')) return;

  const idx = colonies.findIndex(c => c.id === colonyId);
  if (idx === -1) return;

  const colony = colonies[idx];
  const planets = generateAvailablePlanets();
  const planet = planets.find(p => p.id === colony.planetId);
  if (planet) planet.colonized = false;

  // Vrati dio resursa (20%)
  const refund = {
    metal: Math.floor(getColonyCost({ distance: colony.distance }).metal * 0.2),
    crystal: Math.floor(getColonyCost({ distance: colony.distance }).crystal * 0.2),
    he3: Math.floor(getColonyCost({ distance: colony.distance }).he3 * 0.2),
  };
  R.metal += refund.metal;
  R.crystal += refund.crystal;
  R.he3 += refund.he3;

  colonies.splice(idx, 1);

  updateResUI();
  renderColonies();
  saveGame();

  toast(`🪐 ${colony.name} napuštena. Refund: 🔩${fmt(refund.metal)} 💎${fmt(refund.crystal)} ⛽${fmt(refund.he3)}`, 'warn');
  addLog(`🪐 Kolonija ${colony.name} napuštena.`);
}

// ── COLONY TICK — produkcija ide direktno u R (bypass Depot) ──
// Poziva se iz economy tickProduction
function tickColonyProduction() {
  if (colonies.length === 0) return;
  const prod = getTotalColonyProduction();
  R.metal += prod.metal;
  R.crystal += prod.crystal;
  R.he3 += prod.he3;
}

// ── RENDER KOLONIJA ──
let _colTab = 'colonies'; // 'colonies' | 'explore'

function renderColonies() {
  const el = document.getElementById('coloniesContent');
  if (!el) return;

  const jgLevel = buildings.jump_gate?.level || 0;
  const maxCol = getMaxColonies();
  const colProd = getTotalColonyProduction();

  el.innerHTML = `
    <!-- Status bar -->
    <div class="card" style="margin-bottom:16px">
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;text-align:center">
        <div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">KOLONIJE</div>
          <div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#00d4ff">
            ${colonies.length} / ${maxCol}
          </div>
        </div>
        <div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">JUMP GATE</div>
          <div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#aa44ff">
            Lv.${jgLevel}
          </div>
        </div>
        <div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">METAL/s</div>
          <div style="font-size:1rem;font-family:'Orbitron',monospace;color:#ffcc44">
            +${colProd.metal.toFixed(3)}
          </div>
        </div>
        <div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">CRYSTAL/s</div>
          <div style="font-size:1rem;font-family:'Orbitron',monospace;color:#4488ff">
            +${colProd.crystal.toFixed(3)}
          </div>
        </div>
        <div>
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">HE3/s</div>
          <div style="font-size:1rem;font-family:'Orbitron',monospace;color:#00ff88">
            +${colProd.he3.toFixed(3)}
          </div>
        </div>
      </div>
    </div>

    <!-- Jump Gate fleet position strip -->
    ${window._fleetPosition ? (() => {
      const fc = colonies.find(c => c.id === window._fleetPosition);
      return fc ? `
        <div style="background:rgba(170,68,255,0.1);border:1px solid rgba(170,68,255,0.3);
          border-radius:6px;padding:8px 12px;margin-bottom:12px;
          display:flex;justify-content:space-between;align-items:center">
          <div style="font-size:0.7rem">
            🌀 <span style="color:#aa44ff;font-weight:700">Flota na: ${fc.name}</span>
            <span style="color:#6a90b8;font-size:0.6rem;margin-left:6px">Sistem ${fc.distance} · He3 popust aktivan</span>
          </div>
          <button class="btn" style="font-size:0.62rem;color:#6a90b8;padding:3px 8px"
            onclick="recallFleetToBase()">🏠 Vrati</button>
        </div>` : '';
    })() : ''}

    ${jgLevel === 0? `
      <div class="card" style="text-align:center;padding:30px;border-color:rgba(255,204,68,0.3)">
        <div style="font-size:3rem;margin-bottom:12px">🌀</div>
        <div style="font-size:0.9rem;font-weight:700;color:#ffcc44;margin-bottom:8px">
          Jump Gate Potreban
        </div>
        <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:16px">
          Izgradi Jump Gate u Bazi da otključaš kolonizaciju galaksije.
        </div>
        <button class="btn btn-gold" onclick="showPanel('base')">
          🌀 Idi na Bazu → Specijalne Zgrade
        </button>
      </div>
    ` : `
      <!-- Tabovi -->
      <div style="display:flex;gap:8px;margin-bottom:16px">
        <button class="btn ${_colTab==='colonies'?'btn-gold':''}"
          onclick="_colTab='colonies';renderColonies()">
          🪐 Moje Kolonije (${colonies.length})
        </button>
        <button class="btn ${_colTab==='explore'?'btn-gold':''}"
          onclick="_colTab='explore';renderColonies()">
          🔭 Istraži Galaksiju
        </button>
      </div>

      ${_colTab === 'colonies'? renderMyColonies(maxCol) : renderExploreGalaxy(jgLevel)}
    `}
  `;
}

// ── RENDER MOJIH KOLONIJA ──
function renderMyColonies(maxCol) {
  if (colonies.length === 0) {
    return `
      <div class="card" style="text-align:center;padding:30px;color:#6a90b8">
        <div style="font-size:3rem;margin-bottom:12px">🪐</div>
        <div style="font-size:0.85rem;color:white;margin-bottom:8px">Nemaš kolonija</div>
        <div style="font-size:0.72rem;margin-bottom:16px">
          Idi na <strong style="color:#00d4ff">Istraži Galaksiju</strong> da pronađeš planete.
        </div>
        <button class="btn btn-g" onclick="_colTab='explore';renderColonies()">
          🔭 Istraži Galaksiju
        </button>
      </div>`;
  }

  const CMD_KEY_MILESTONES = [25, 50, 75, 100];

  return `<div style="display:flex;flex-direction:column;gap:14px">` + colonies.map(col => {
    const pType  = PLANET_TYPES[col.type] || PLANET_TYPES.balanced;
    const prod   = getColonyProduction(col);
    const upCost = getColonyUpgradeCost(col);
    const canUp  = canAfford(upCost) && col.level < 100;
    const bEff   = getColonyBuildingEffect(col);
    const nameColor = col.level >= 75 ? '#ffaa00' : col.level >= 50 ? '#aa44ff' :
                      col.level >= 25 ? '#4488ff' : '#ffcc44';

    // Milestone progress
    const nextMs = CMD_KEY_MILESTONES.find(m => m > col.level) || null;
    const prevMs = CMD_KEY_MILESTONES.filter(m => m <= col.level).pop() || 0;
    const msPct  = nextMs ? Math.floor(((col.level - prevMs) / (nextMs - prevMs)) * 100) : 100;
    const msRewards = { 25: '5🃏', 50: '10🃏', 75: '25🃏', 100: '50🃏' };

    // Buildings
    const colBuildings = col.buildings || {};

    return `
      <div class="card" style="border-color:${pType.color}44">

        <!-- Header -->
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <div style="font-size:1.8rem">${pType.icon}</div>
          <div style="flex:1">
            <div style="font-size:0.82rem;font-weight:700;color:${nameColor}">${col.name}</div>
            <div style="font-size:0.6rem;color:${pType.color}">${pType.name} · Sistem ${col.distance}</div>
          </div>
          <div class="lv-badge" style="color:${pType.color};border-color:${pType.color}44">Lv.${col.level}</div>
        </div>

        <!-- Milestone progress -->
        ${nextMs ? `
          <div style="margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;font-size:0.58rem;color:#6a90b8;margin-bottom:2px">
              <span>Terraformer Lv.${nextMs} → +${msRewards[nextMs]} 🃏</span>
              <span>${col.level}/${nextMs}</span>
            </div>
            <div style="height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden">
              <div style="height:100%;width:${msPct}%;background:linear-gradient(90deg,${pType.color},#ffaa00);border-radius:2px"></div>
            </div>
          </div>` : `
          <div style="font-size:0.62rem;color:#ffaa00;margin-bottom:8px">👑 Svi milestones završeni!</div>`}

        <!-- Produkcija /h -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-bottom:10px">
          ${[
            { label:'🔩 Metal/h', val: (prod.metal * 3600),   color:'#ffcc44' },
            { label:'💎 Crystal/h', val: (prod.crystal * 3600), color:'#4488ff' },
            { label:'⛽ He3/h', val: (prod.he3 * 3600),     color:'#00ff88' },
          ].map(r => `
            <div style="text-align:center;background:rgba(0,0,0,0.3);border-radius:5px;padding:5px">
              <div style="font-size:0.52rem;color:#6a90b8">${r.label}</div>
              <div style="font-size:0.72rem;font-weight:700;color:${r.color}">${fmt(Math.floor(r.val))}</div>
            </div>`).join('')}
        </div>

        <!-- Terraformer dugme -->
        ${col.level < 100 ? `
          <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:4px">
            <span class="${canAfford(upCost)?'ck':'cn'}">🔩${fmt(upCost.metal)}</span>
            <span class="${canAfford(upCost)?'ck':'cn'}"> 💎${fmt(upCost.crystal)}</span>
            <span class="${canAfford(upCost)?'ck':'cn'}"> ⛽${fmt(upCost.he3)}</span>
          </div>
          <div style="display:flex;gap:5px;margin-bottom:14px">
            <button class="btn ${canUp?'btn-g':''}" style="flex:1;font-size:0.68rem"
              onclick="upgradeColony('${col.id}')" ${canUp?'':'disabled'}>🌍 Terraformer Lv.${col.level+1}</button>
            <button class="btn btn-r" style="font-size:0.62rem;padding:4px 7px"
              onclick="abandonColony('${col.id}')">🗑️</button>
          </div>` : `
          <div style="display:flex;gap:5px;margin-bottom:14px;align-items:center">
            <div style="flex:1;text-align:center;color:#ffaa00;font-size:0.72rem">👑 MAX LEVEL</div>
            <button class="btn btn-r" style="font-size:0.63rem" onclick="abandonColony('${col.id}')">🗑️ Napusti</button>
          </div>`}

        <!-- Zgrade -->
        <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:10px">
          <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">
            🏗️ Zgrade
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
            ${Object.entries(COLONY_BUILDINGS).map(([bid, bDef]) => {
              const curLv    = colBuildings[bid] || 0;
              const isBuilt  = curLv > 0;
              const isMax    = curLv >= bDef.maxLevel;
              const nextLv   = curLv + 1;
              const cost     = bDef.cost(curLv);
              const affordable = canAfford(cost);
              const canBuild = !isMax;
              const defBuilds = ['turret','missile_bat','shield_gen','sensor'];
              const accentColor = bid === 'jump_gate' ? '#aa44ff' : defBuilds.includes(bid) ? '#ff6644' : '#ffcc44';

              // Extra action panel (Jump Gate / Sensor)
              let extraPanel = '';
              if (bid === 'jump_gate' && isBuilt) {
                const isHere      = window._fleetPosition === col.id;
                const cdLeft      = getJumpGateCooldownLeft(col.id);
                const onCd        = cdLeft > 0;
                const fmtCd       = cdLeft >= 60 ? `${Math.ceil(cdLeft/60)}min` : `${cdLeft}s`;
                const fleetAtBase = !window._fleetPosition;
                const fleetCol2   = window._fleetPosition ? colonies.find(c => c.id === window._fleetPosition) : null;
                const baseHasJG   = (buildings.jump_gate?.level || 0) > 0;
                const sourceHasJG = fleetAtBase ? baseHasJG : !!((fleetCol2?.buildings || {}).jump_gate > 0);
                const sourceName  = fleetAtBase ? '🏠 Baza' : (fleetCol2?.name || '?');
                const sourceCd    = fleetAtBase ? getJumpGateCooldownLeft('base') : (window._fleetPosition ? getJumpGateCooldownLeft(window._fleetPosition) : 0);
                const srcFmtCd   = sourceCd >= 60 ? `${Math.ceil(sourceCd/60)}min` : `${sourceCd}s`;
                extraPanel = isHere ? `
                  <div style="font-size:0.55rem;color:#00ff88;margin-top:4px">✅ Flota ovdje</div>
                  <button class="btn" style="width:100%;font-size:0.52rem;margin-top:3px;color:#6a90b8"
                    onclick="recallFleetToBase()">🏠 Vrati na bazu</button>` :
                onCd ? `<div style="font-size:0.55rem;color:#ff8833;margin-top:4px">⏳ Cooldown: ${fmtCd}</div>` :
                sourceHasJG && sourceCd === 0 ? `
                  <div style="font-size:0.5rem;color:#6a90b8;margin-top:4px">Flota: <span style="color:white">${sourceName}</span></div>
                  <button class="btn" style="width:100%;font-size:0.52rem;margin-top:3px;color:#aa44ff;
                    border-color:rgba(170,68,255,0.3);background:rgba(170,68,255,0.06)"
                    onclick="jumpFleetToColony('${col.id}')">🌀 Skoči ovdje</button>` :
                sourceCd > 0 ? `<div style="font-size:0.52rem;color:#ff8833;margin-top:4px">⏳ ${sourceName}: ${srcFmtCd}</div>` :
                `<div style="font-size:0.5rem;color:#ff8833;margin-top:4px">⚠️ ${fleetAtBase?'Baza':'Kolonija'} nema JG</div>`;
              }
              if (bid === 'sensor' && isBuilt) {
                extraPanel += `
                  <button class="btn" style="width:100%;font-size:0.52rem;margin-top:4px;
                    color:#00d4ff;border-color:rgba(0,212,255,0.25);background:rgba(0,212,255,0.06)"
                    onclick="sensorPhalanxScan('${col.id}')">
                    📡 Skeniraj (${fmt(SENSOR_SCAN_COST)} He3)
                  </button>`;
              }

              return `
                <div style="background:rgba(0,0,0,0.25);border-radius:6px;padding:7px;
                  border:1px solid ${isBuilt ? accentColor+'33' : 'rgba(255,255,255,0.05)'}">
                  <!-- Ime + level -->
                  <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px">
                    <span style="font-size:1rem">${bDef.icon}</span>
                    <div style="flex:1;min-width:0">
                      <div style="font-size:0.6rem;font-weight:700;color:${isMax?'#ffaa00':isBuilt?'white':'#6a90b8'};
                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${bDef.name}</div>
                      <div style="font-size:0.52rem;color:${accentColor}">
                        ${isBuilt ? `Lv.${curLv} / ${bDef.maxLevel}` : `Lv.0 / ${bDef.maxLevel}`}
                      </div>
                    </div>
                  </div>
                  <!-- Efekat -->
                  <div style="font-size:0.52rem;color:#6a90b8;margin-bottom:4px;min-height:1em">
                    ${isBuilt ? bDef.desc(curLv) : '<span style="color:#4a6a88">Nije izgrađeno</span>'}
                  </div>
                  <!-- Cijena -->
                  ${!isMax ? `
                  <div style="font-size:0.5rem;margin-bottom:3px;line-height:1.5">
                    <span class="${affordable&&canBuild?'ck':'cn'}">🔩${fmt(cost.metal)}</span>
                    <span class="${affordable&&canBuild?'ck':'cn'}"> 💎${fmt(cost.crystal)}</span>
                    <span class="${affordable&&canBuild?'ck':'cn'}"> ⛽${fmt(cost.he3)}</span>
                  </div>
                  <button class="btn ${affordable&&canBuild?'btn-g':''}"
                    style="width:100%;font-size:0.55rem;padding:3px 4px"
                    onclick="buildColonyBuilding('${col.id}','${bid}')"
                    ${!canBuild?'disabled':''}>
                    ${isBuilt ? `⬆️ Upgrade Lv.${nextLv}` : `🏗️ Sagradi`}
                  </button>` : `
                  <div style="font-size:0.55rem;color:#ffaa00;text-align:center;padding:2px 0">✅ MAX</div>`}
                  ${extraPanel}
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;
  }).join('') + `</div>`;
}

// ── RENDER ISTRAŽUJ GALAKSIJU ──
function renderExploreGalaxy(jgLevel) {
  const planets = generateAvailablePlanets();
  const jgRange = jgLevel;
  const maxCol = getMaxColonies();
  const full = colonies.length >= maxCol;

  // Grupiši po sistemu
  const systems = {};
  planets.forEach(p => {
    if (!systems[p.distance]) systems[p.distance] = [];
    systems[p.distance].push(p);
  });

  let html = '';

  if (full) {
    html += `
      <div class="card" style="margin-bottom:16px;border-color:rgba(255,204,68,0.3);text-align:center">
        <div style="color:#ffcc44;font-size:0.82rem">
          ⚠️ Dostignut maksimum kolonija (${maxCol}/${maxCol}).<br>
          <span style="font-size:0.65rem;color:#6a90b8">Unapredi Jump Gate za više slotova.</span>
        </div>
      </div>`;
  }

  Object.entries(systems).sort(([a],[b]) => a-b).forEach(([dist, planetsInSys]) => {
    const distNum = parseInt(dist);
    const inRange = jgRange >= distNum;
    const sysColor = inRange? '#00d4ff' : '#6a90b8';

    html += `
      <div style="margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="font-size:0.75rem;color:${sysColor};letter-spacing:2px;font-weight:700">
            ${inRange? '✅' : '🔒'} SISTEM ${distNum}
          </div>
          ${!inRange? `<div style="font-size:0.62rem;color:#ff3355">
            Jump Gate Lv.${distNum} potreban
          </div>` : ''}
          <div style="flex:1;height:1px;background:rgba(255,255,255,0.06)"></div>
          <div style="font-size:0.6rem;color:#6a90b8">Udaljenost: ${distNum} skok${distNum > 1? 'a' : ''}</div>
        </div>

        <div class="grid-4" style="opacity:${inRange?1:0.4}">
          ${planetsInSys.map(planet => renderPlanetCard(planet, inRange, full)).join('')}
        </div>
      </div>`;
  });

  return html;
}

// ── RENDER KARTICE PLANETA ──
function renderPlanetCard(planet, inRange, full) {
  const pType     = PLANET_TYPES[planet.type] || PLANET_TYPES.balanced;
  const colonized = planet.colonized || colonies.some(c => c.planetId === planet.id);
  const canAttack = inRange && !colonized && !full;
  const spyData   = window._planetSpyData?.[planet.id] || null;

  const pIdx      = parseInt(planet.id.replace('planet_','')) || 0;
  const diffMap   = ['easy','easy','easy','easy','easy',
                     'normal','normal','normal','normal','normal',
                     'nightmare','nightmare','nightmare','nightmare','nightmare',
                     'hell','hell','hell','hell','hell'];
  const modeName  = diffMap[pIdx] || 'easy';
  const modeColors = { easy:'#00ff88', normal:'#ffcc44', nightmare:'#ff8833', hell:'#ff3355' };
  const modeIcons  = { easy:'🌿', normal:'⚔️', nightmare:'💀', hell:'🔥' };

  return `
    <div class="card" style="border-color:${colonized?'rgba(0,255,136,0.3)':pType.color+'33'}">

      <!-- Header -->
      <div style="text-align:center;margin-bottom:8px">
        <div style="font-size:2rem">${colonized?'✅':pType.icon}</div>
        <div style="font-size:0.75rem;font-weight:700;color:${colonized?'#00ff88':pType.color}">
          ${planet.name}
        </div>
        <div style="font-size:0.58rem;color:#6a90b8">${pType.name}</div>
        ${!colonized ? `
          <div style="font-size:0.55rem;color:${modeColors[modeName]};margin-top:2px">
            ${modeIcons[modeName]} Lv.${pIdx+1}
          </div>` : ''}
      </div>

      ${colonized ? `
        <div style="text-align:center;font-size:0.68rem;color:#00ff88;padding:4px 0">✅ Kolonizovano</div>
      ` : !inRange ? `
        <div style="text-align:center;font-size:0.62rem;color:#6a90b8;padding:6px 0">
          🔒 JG Lv.${planet.distance} potreban
        </div>
      ` : full ? `
        <div style="text-align:center;font-size:0.62rem;color:#ffcc44;padding:6px 0">
          🔒 Nema slobodnih slotova
        </div>
      ` : `
        <!-- Spy rezultati -->
        ${spyData ? `<div style="margin-bottom:8px">${spyData}</div>` : ''}

        <!-- Dugmad -->
        <div style="display:flex;gap:5px;flex-direction:column">
          <button class="btn" style="width:100%;font-size:0.65rem;background:rgba(0,180,255,0.12);
            border-color:rgba(0,180,255,0.3);color:#00d4ff"
            onclick="spyPlanet('${planet.id}')">
            🔭 ${spyData ? 'Reskeniranje' : 'Špijuniraj'}
          </button>
          <button class="btn btn-r" style="width:100%;font-size:0.68rem"
            onclick="attackAndColonize('${planet.id}')">
            ⚔️ Napadni & Kolonizuj
          </button>
        </div>
      `}
    </div>`;
}

// ── INICIJALIZACIJA ──
if (!window._availablePlanets) window._availablePlanets = [];