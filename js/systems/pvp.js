// ============================================================
// HIVE GALAXY — js/systems/pvp.js
// PvP sistem — matchmaking, borba, rating, shield, plijen
// ============================================================

if (!window.pvpShield) window.pvpShield = { active: false, expiresAt: null };

// ── AI TITULE po ratingu ──
const AI_TITLES = [
  { min: 0,    max: 299,  title: 'Regrut',    icon: '🪖' },
  { min: 300,  max: 599,  title: 'Vojnik',    icon: '⚔️' },
  { min: 600,  max: 999,  title: 'Kapetan',   icon: '🎖️' },
  { min: 1000, max: 1499, title: 'Komandant', icon: '🌟' },
  { min: 1500, max: 1999, title: 'General',   icon: '💫' },
  { min: 2000, max: 9999, title: 'Admiral',   icon: '👑' },
];

function getAiTitle(rating) {
  return AI_TITLES.find(t => rating >= t.min && rating <= t.max) || AI_TITLES[0];
}

// ── Uzmi random komandira iz svih dostupnih ──
function pickRandomCommander() {
  const pool = [];
  if (typeof COMMANDERS_DATA !== 'undefined') pool.push(...COMMANDERS_DATA);
  if (typeof COMMANDERS_XENOS !== 'undefined') pool.push(...COMMANDERS_XENOS);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Generiši AI flotu od PRAVIH brodova iz SHIPS_DATA ──
function generateAIFleet(playerPower, difficulty) {
  if (typeof SHIPS_DATA === 'undefined' || SHIPS_DATA.length === 0) return [];

  // Odaberi klase brodova na osnovu težine / ratinga
  // difficulty: 0.3 = slab, 1.0 = jednak, 1.5 = jak
  const tierVariant = difficulty < 0.5 ? 'I' : difficulty < 0.9 ? 'II' : 'III';

  // Filtruj brodove po varijanti (I/II/III u id-u)
  const tierFilter = `_${tierVariant}`;
  let pool = SHIPS_DATA.filter(s => s.id.endsWith(tierFilter));
  if (pool.length === 0) pool = SHIPS_DATA; // fallback na sve

  // Odaberi 2-4 različite klase brodova
  const numGroups  = Math.floor(2 + Math.random() * 3); // 2, 3 ili 4
  const used       = new Set();
  const selected   = [];

  // Prioritizuj raznolikost klasa (scout, fighter, cruiser, battleship...)
  const classes = ['scout', 'fighter', 'cruiser', 'battleship', 'carrier', 'special'];
  // Miješaj klase
  const shuffledClasses = classes.sort(() => Math.random() - 0.5);

  for (const cls of shuffledClasses) {
    if (selected.length >= numGroups) break;
    const clsShips = pool.filter(s => s.id.startsWith(cls) && !used.has(s.id));
    if (clsShips.length === 0) continue;
    const ship = clsShips[Math.floor(Math.random() * clsShips.length)];
    used.add(ship.id);
    selected.push(ship);
  }

  // Ako nismo popunili, uzmi random
  while (selected.length < numGroups) {
    const remaining = pool.filter(s => !used.has(s.id));
    if (remaining.length === 0) break;
    const ship = remaining[Math.floor(Math.random() * remaining.length)];
    used.add(ship.id);
    selected.push(ship);
  }

  // Izračunaj DPS per ship na osnovu klase (aproksimacija jer AI nema equip)
  // HP = structure per ship, shield = shield per ship, DPS ≈ klasa-based
  const classBaseDps = {
    scout:      { dps: 120, mult: 1.0 },
    fighter:    { dps: 200, mult: 1.0 },
    cruiser:    { dps: 350, mult: 1.0 },
    battleship: { dps: 600, mult: 1.0 },
    carrier:    { dps: 250, mult: 1.0 },
    special:    { dps: 450, mult: 1.0 },
  };

  const varMult = tierVariant === 'I' ? 1.0 : tierVariant === 'II' ? 1.8 : 3.2;

  return selected.map((ship, idx) => {
    const cls     = ship.id.split('_')[0]; // scout, fighter, etc.
    const baseDps = (classBaseDps[cls]?.dps || 200) * varMult * difficulty;

    // Broj brodova: skalira sa powerom igrača
    const baseCount = Math.floor(10 + Math.random() * 40);
    const count     = Math.max(5, baseCount);

    const hpPer     = (ship.structure || 100) * varMult * difficulty;
    const shieldPer = (ship.shield    || 0)   * varMult * difficulty;

    return {
      id:        `ai_${idx}`,
      side:      'enemy',
      ship_id:   ship.id,
      name:      `${ship.name} ×${count}`,
      count,
      hp:        Math.floor(hpPer    * count),
      maxHp:     Math.floor(hpPer    * count),
      shield:    Math.floor(shieldPer * count),
      maxShield: Math.floor(shieldPer * count),
      dps:       Math.floor(baseDps  * count),
      agility:   ship.agility    || 10,
      speed:     ship.movement   || 1,
      armor:     ship.armor      || 'Nano',
      effects:   [],
      alive:     true,
    };
  });
}

// ── Generiši AI protivnika sa pravim komandirima i brodovima ──
function generateAIOpponent(playerPower, playerRating) {
  // Titula po ratingu
  const titleData = getAiTitle(playerRating);

  // Random komandir
  const cmd = pickRandomCommander();
  const cmdName   = cmd ? cmd.name  : '???';
  const cmdIcon   = cmd ? cmd.icon  : '👤';
  const cmdRarity = cmd ? cmd.rarity : 'C';

  // Naziv: titula + ime komandira
  const name   = `${titleData.title} ${cmdName}`;
  const avatar = cmdIcon;

  // Power i rating — lagan protivnik (50-85% snage igrača)
  const powerVar  = 0.5 + Math.random() * 0.35;
  const difficulty = powerVar; // koristi se i za skaliranje flote
  const aiPower   = Math.max(500, Math.floor(playerPower * powerVar));
  const ratingVar = Math.floor((Math.random() - 0.5) * 200);
  const aiRating  = Math.max(100, playerRating + ratingVar);

  const aiResources = {
    metal:   Math.floor(aiPower * 0.25 + Math.random() * aiPower * 0.25),
    crystal: Math.floor(aiPower * 0.18 + Math.random() * aiPower * 0.18),
    he3:     Math.floor(aiPower * 0.07 + Math.random() * aiPower * 0.08),
  };

  const aiFleet = generateAIFleet(playerPower, difficulty);

  return {
    name, avatar, power: aiPower, rating: aiRating,
    resources: aiResources, fleet: aiFleet,
    commander: cmd,    // puni objekat za prikaz
    titleIcon: titleData.icon,
    cmdRarity,
  };
}

function isPvpShieldActive() {
  if (!window.pvpShield?.active) return false;
  if (Date.now() > window.pvpShield.expiresAt) {
    window.pvpShield.active = false;
    return false;
  }
  return true;
}

function getPvpShieldTimeLeft() {
  if (!isPvpShieldActive()) return 0;
  return Math.max(0, window.pvpShield.expiresAt - Date.now());
}

function activatePvpShield(hours) {
  const ms = hours * 60 * 60 * 1000;
  window.pvpShield = {
    active:    true,
    expiresAt: Date.now() + ms,
  };
  saveGame();
}

function formatShieldTime(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function renderPvP() {
  const el = document.getElementById('pvpContent');
  if (!el) return;

  const shieldActive   = isPvpShieldActive();
  const shieldTimeLeft = getPvpShieldTimeLeft();
  const playerPower    = calcFleetTotalPower();

  el.innerHTML = `
    <div class="card" style="margin-bottom:16px">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;text-align:center">
        <div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">RATING</div><div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#ffcc44">${pvp.rating}</div></div>
        <div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">POBJEDE</div><div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#00ff88">${pvp.wins}</div></div>
        <div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">PORAZI</div><div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#ff3355">${pvp.losses}</div></div>
        <div><div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">WIN RATE</div><div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#00d4ff">${pvp.wins + pvp.losses > 0 ? Math.round(pvp.wins / (pvp.wins + pvp.losses) * 100) : 0}%</div></div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;border-color:${shieldActive ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)'}">
      <div style="display:flex;align-items:center;gap:16px">
        <div style="font-size:2rem">${shieldActive ? '🛡️' : '⚠️'}</div>
        <div style="flex:1">
          <div style="font-size:0.85rem;font-weight:700;color:${shieldActive ? '#00d4ff' : '#ff3355'}">${shieldActive ? 'SHIELD AKTIVAN' : 'SHIELD NEAKTIVAN'}</div>
          <div style="font-size:0.72rem;color:#6a90b8;margin-top:2px">${shieldActive ? `Zaštita ističe za: <strong style="color:#00d4ff">${formatShieldTime(shieldTimeLeft)}</strong>` : 'Tvoja baza je dostupna za napad!'}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:4px">KUPI SHIELD (BPW)</div>
          <div style="display:flex;gap:4px">
            ${[{h:1,sat:100},{h:4,sat:400},{h:12,sat:1080},{h:24,sat:1920}].map(s => `<button class="btn btn-gold" style="font-size:0.62rem;padding:3px 8px" onclick="buyShield(${s.h})">${s.h}h<br><span style="font-size:0.52rem">${s.sat} sat</span></button>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div>
        <div class="page-title" style="font-size:0.85rem">⚔️ NAPADNI</div>
        <div id="opponentList">${renderOpponentList(playerPower)}</div>
        <button class="btn btn-g" style="width:100%;margin-top:10px" onclick="refreshOpponents()">🔄 Osvježi listu</button>
      </div>
      <div>
        <div class="page-title" style="font-size:0.85rem">📋 HISTORIJA</div>
        <div id="pvpLog">${renderPvpLog()}</div>
      </div>
    </div>
  `;
}

window._currentOpponents = window._currentOpponents || [];

function refreshOpponents() {
  const playerPower = calcFleetTotalPower();
  window._currentOpponents = Array.from({ length: 5 }, () => generateAIOpponent(playerPower, pvp.rating));
  const el = document.getElementById('opponentList');
  if (el) el.innerHTML = renderOpponentList(playerPower);
  toast('🔄 Lista protivnika osvježena!', 'inf');
}

function renderOpponentList(playerPower) {
  if (window._currentOpponents.length === 0) {
    window._currentOpponents = Array.from({ length: 5 }, () => generateAIOpponent(playerPower, pvp.rating));
  }

  const rarColors = { L: '#ffaa00', E: '#aa44ff', R: '#4488ff', C: '#aaaaaa' };

  return window._currentOpponents.map((opp, idx) => {
    const powerDiff = opp.power - playerPower;
    const diffColor = powerDiff > 0 ? '#ff3355' : '#00ff88';
    const diffText  = powerDiff > 0 ? `▲ ${fmt(powerDiff)}` : `▼ ${fmt(Math.abs(powerDiff))}`;
    const rc        = rarColors[opp.cmdRarity] || '#aaa';

    // Prikaz flote — liste tipova brodova
    const fleetSummary = (opp.fleet || []).map(g =>
      `<span style="font-size:0.52rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
        border-radius:3px;padding:1px 5px;color:#b0cce8">${g.name}</span>`
    ).join(' ');

    return `
      <div class="card" style="margin-bottom:10px;border-color:rgba(255,51,85,0.25)">
        <!-- Komandir header -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="font-size:1.8rem;filter:drop-shadow(0 0 6px ${rc}88)">${opp.avatar}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:0.8rem;font-weight:700;color:white;
              white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${opp.name}</div>
            <div style="display:flex;gap:6px;align-items:center;margin-top:2px">
              <span style="font-size:0.55rem;font-weight:700;color:${rc};
                background:${rc}18;border-radius:3px;padding:0 5px;
                font-family:'Orbitron',monospace">${opp.titleIcon} ${opp.cmdRarity}</span>
              <span style="font-size:0.6rem;color:#6a90b8">Rating: <strong style="color:#ffcc44">${opp.rating}</strong></span>
            </div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:0.72rem;font-family:'Orbitron',monospace;color:#00d4ff">${fmt(opp.power)}</div>
            <div style="font-size:0.6rem;color:${diffColor}">${diffText}</div>
          </div>
        </div>

        <!-- Flota brodova -->
        <div style="margin-bottom:6px">
          <div style="font-size:0.55rem;color:#6a90b8;margin-bottom:3px">🚀 FLOTA (${opp.fleet.length} grupe)</div>
          <div style="display:flex;flex-wrap:wrap;gap:3px">${fleetSummary || '<span style="font-size:0.52rem;color:#444">prazna flota</span>'}</div>
        </div>

        <!-- Plijen -->
        <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:8px;
          background:rgba(255,204,68,0.05);border-radius:4px;padding:4px 6px">
          🎁 Plijen: 🔩${fmt(Math.floor(opp.resources.metal*0.1))}
                     💎${fmt(Math.floor(opp.resources.crystal*0.1))}
                     ⛽${fmt(Math.floor(opp.resources.he3*0.1))}
        </div>

        <button class="btn btn-r" style="width:100%;font-size:0.72rem"
          onclick="startPvpBattle(${idx})">⚔️ Napadni ${opp.avatar} ${opp.name}</button>
      </div>`;
  }).join('');
}

function renderPvpLog() {
  if (!pvp.history || pvp.history.length === 0) {
    return '<div style="text-align:center;color:#6a90b8;padding:20px;font-size:0.72rem">Nema historije borbi.</div>';
  }
  const rarColors = { L: '#ffaa00', E: '#aa44ff', R: '#4488ff', C: '#aaaaaa' };
  return pvp.history.slice(0, 10).map(entry => {
    const isWin = entry.result === 'victory';
    const rc    = rarColors[entry.oppRarity] || '#aaa';
    const fleetTags = (entry.oppFleet || []).slice(0, 3).map(n =>
      `<span style="font-size:0.48rem;color:#6a90b8">${n}</span>`
    ).join(' · ');
    return `
      <div style="padding:8px 10px;margin-bottom:6px;border-radius:6px;
        background:${isWin ? 'rgba(0,255,136,0.04)' : 'rgba(255,51,85,0.04)'};
        border:1px solid ${isWin ? 'rgba(0,255,136,0.18)' : 'rgba(255,51,85,0.18)'}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:1rem">${entry.oppAvatar || '👤'}</span>
            <span style="font-size:0.7rem;color:${isWin ? '#00ff88' : '#ff3355'};font-weight:700">
              ${isWin ? '🏆 POBJEDA' : '💀 PORAZ'}
            </span>
          </div>
          <span style="font-size:0.62rem;color:${entry.ratingChange > 0 ? '#00ff88' : '#ff3355'}">
            ${entry.ratingChange > 0 ? '+' : ''}${entry.ratingChange} RP
          </span>
        </div>
        <div style="font-size:0.62rem;color:#b0cce8;margin-bottom:2px">vs <strong>${entry.opponent}</strong> · ${entry.rounds} rundi</div>
        ${fleetTags ? `<div style="margin-bottom:2px">${fleetTags}</div>` : ''}
        ${isWin && entry.loot ? `<div style="font-size:0.58rem;color:#ffcc44;margin-bottom:2px">
          🎁 +🔩${fmt(entry.loot.metal)} +💎${fmt(entry.loot.crystal)} +⛽${fmt(entry.loot.he3)}</div>` : ''}
        <div style="font-size:0.55rem;color:#6a90b8">${entry.date}</div>
      </div>`;
  }).join('');
}

function startPvpBattle(opponentIdx) {
  const opp = window._currentOpponents[opponentIdx];
  if (!opp) return;

  const fleetSlots = getAllDeployedSlots();
  if (fleetSlots.length === 0) {
    toast('⚠️ Flota je prazna! Deploy komandira i rasporedi brodove.', 'warn');
    return;
  }

  // ── He3 potrošnja za PvP misiju ──
  const he3NeededPvp = fleetSlots.reduce((sum, ship) => {
    let cost = 0.005;
    if (ship && ship.engine) {
      const engDef = (typeof ENGINES !== 'undefined' ? ENGINES : [])
        .find(e => e.id === ship.engine);
      if (engDef && engDef.he3_cost != null) cost = engDef.he3_cost;
    }
    return sum + cost;
  }, 0);
  if (R.he3 < he3NeededPvp) {
    toast(`⚠️ He3 kritično nizak! (${R.he3.toFixed(2)} / ${he3NeededPvp.toFixed(3)})`, 'warn');
  }
  R.he3 = Math.max(0, R.he3 - he3NeededPvp);
  if (typeof updateResUI === 'function') updateResUI();
  // ─────────────────────────────────

  toast(`⚔️ Pokretanje PvP bitke vs ${opp.name}...`, 'inf');

  setTimeout(() => {
    // Espionage Lv100 → +10% krit u PvP
    const espLv100 = typeof getEspionageLevel === 'function' && getEspionageLevel() >= 100;
    const battle = simulateBattle(fleetSlots, opp.fleet, {
      name:       `⚔️ PvP — ${opp.avatar} ${opp.name}`,
      difficulty: Math.min(10, Math.ceil(opp.power / 10000)),
      resources:  { metal: [0,0], crystal: [0,0], he3: [0,0] },
      drops:      {},
      type:       'pvp',
      pvpCritBonus: espLv100 ? 10 : 0,
    });

    const isVictory    = battle.status === 'victory';
    const ratingChange = isVictory ? 25 : -15;
    pvp.rating = Math.max(0, pvp.rating + ratingChange);

    if (isVictory) {
      pvp.wins++;
      if (typeof trackWeeklyPvp  === 'function') trackWeeklyPvp();
      if (typeof addExp === 'function') addExp(80);
    } else {
      pvp.losses++;
    }
    if (typeof trackDailyPvp === 'function') trackDailyPvp(isVictory);

    let loot = null;
    if (isVictory) {
      loot = {
        metal:   Math.floor(opp.resources.metal   * 0.1),
        crystal: Math.floor(opp.resources.crystal * 0.1),
        he3:     Math.floor(opp.resources.he3     * 0.1),
      };
      R.metal   += loot.metal;
      R.crystal += loot.crystal;
      R.he3     += loot.he3;
    }

    pvp.history.unshift({
      opponent:   opp.name,
      oppAvatar:  opp.avatar,
      oppRarity:  opp.cmdRarity,
      oppFleet:   (opp.fleet || []).map(g => g.name),
      result:     battle.status,
      rounds:     battle.round,
      ratingChange,
      loot,
      date: new Date().toLocaleString('sr'),
    });
    if (pvp.history.length > 50) pvp.history.pop();

    window._currentOpponents.splice(opponentIdx, 1);
    updateResUI();
    saveGame();

    // ── Vizuelna animacija bitke, kao kod instanci ──
    if (typeof startBattleAnim === 'function' && battle.log && battle.log.length > 0) {
      startBattleAnim(battle, () => renderPvpBattleResult(battle, opp, loot, ratingChange));
    } else {
      renderPvpBattleResult(battle, opp, loot, ratingChange);
    }
  }, 150);
}

function renderPvpBattleResult(battle, opp, loot, ratingChange) {
  const isVictory = battle.status === 'victory';
  const statusColor = isVictory ? '#00ff88' : '#ff3355';
  const statusIcon = isVictory ? '🏆' : '💀';
  const statusText = isVictory ? 'POBJEDA' : 'PORAZ';

  const rarColors = { L: '#ffaa00', E: '#aa44ff', R: '#4488ff', C: '#aaaaaa' };
  const rc = rarColors[opp.cmdRarity] || '#aaa';
  const cmd = opp.commander;

  const cmdBlock = cmd ? `
    <div style="display:flex;align-items:center;gap:10px;background:rgba(0,0,0,0.3);
      border:1px solid ${rc}33;border-radius:8px;padding:10px;margin-bottom:14px">
      <div style="font-size:2rem">${cmd.icon}</div>
      <div style="flex:1">
        <div style="font-size:0.75rem;font-weight:700;color:${rc}">${cmd.name}</div>
        <div style="font-size:0.6rem;color:#6a90b8;margin-top:2px">
          ${cmd.passive ? `🛡️ ${cmd.passive.name}` : ''}
        </div>
        <div style="font-size:0.55rem;color:#6a90b8;margin-top:1px">
          ${cmd.faction ? `Frakcija: ${cmd.faction}` : ''} · ${opp.titleIcon} ${opp.name}
        </div>
      </div>
      <div style="font-size:0.6rem;font-weight:700;color:${rc};font-family:'Orbitron',monospace;
        background:${rc}18;border-radius:4px;padding:3px 8px">${opp.cmdRarity}</div>
    </div>` : '';

  const fleetBlock = opp.fleet && opp.fleet.length > 0 ? `
    <div style="margin-bottom:14px">
      <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:4px">⚔️ Neprijateljska flota:</div>
      <div style="display:flex;flex-wrap:wrap;gap:3px">
        ${opp.fleet.map(g => `
          <span style="font-size:0.55rem;background:rgba(255,51,85,0.08);
            border:1px solid rgba(255,51,85,0.2);border-radius:3px;padding:2px 6px;color:#ff8888">
            ${g.name}
          </span>`).join('')}
      </div>
    </div>` : '';

  const body = `
    <div style="text-align:center;margin-bottom:16px">
      <div style="font-size:2.5rem;margin-bottom:6px">${statusIcon}</div>
      <div style="font-family:'Orbitron',monospace;font-size:1.3rem;color:${statusColor}">${statusText}</div>
      <div style="font-size:0.7rem;color:#6a90b8;margin-top:3px">${battle.round} rundi borbe</div>
    </div>

    ${cmdBlock}
    ${fleetBlock}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;text-align:center">
      <div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px">
        <div style="font-size:0.62rem;color:#6a90b8">RATING PROMJENA</div>
        <div style="font-size:1.2rem;font-family:'Orbitron',monospace;color:${ratingChange > 0 ? '#00ff88' : '#ff3355'}">
          ${ratingChange > 0 ? '+' : ''}${ratingChange}
        </div>
      </div>
      <div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px">
        <div style="font-size:0.62rem;color:#6a90b8">NOVI RATING</div>
        <div style="font-size:1.2rem;font-family:'Orbitron',monospace;color:#ffcc44">${pvp.rating}</div>
      </div>
    </div>

    ${loot ? `
    <div style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.2);
      border-radius:8px;padding:10px;margin-bottom:14px">
      <div style="font-size:0.7rem;color:#00ff88;font-weight:700;margin-bottom:8px">🎁 PLIJEN</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center">
        <div><div style="font-size:0.6rem;color:#6a90b8">METAL</div>
          <div style="color:white;font-family:'Share Tech Mono',monospace">+${fmt(loot.metal)}</div></div>
        <div><div style="font-size:0.6rem;color:#6a90b8">CRYSTAL</div>
          <div style="color:white;font-family:'Share Tech Mono',monospace">+${fmt(loot.crystal)}</div></div>
        <div><div style="font-size:0.6rem;color:#6a90b8">HE3</div>
          <div style="color:white;font-family:'Share Tech Mono',monospace">+${fmt(loot.he3)}</div></div>
      </div>
    </div>` : ''}

    <div style="background:rgba(0,0,0,0.4);border-radius:8px;padding:10px;
      max-height:160px;overflow-y:auto;font-size:0.6rem;font-family:'Share Tech Mono',monospace">
      <div style="color:#6a90b8;margin-bottom:4px">BATTLE LOG:</div>
      ${battle.log.map(e => `<div style="color:${
        e.type === 'round'   ? '#00d4ff' :
        e.type === 'attack'  ? '#b0cce8' :
        e.type === 'destroy' ? '#ff3355' :
        e.type === 'effect'  ? '#ffcc44' :
        e.type === 'result'  ? '#00ff88' : '#6a90b8'
      };margin-bottom:2px">${e.msg}</div>`).join('')}
    </div>
  `;

  openModal(`${statusIcon} PvP: ${opp.name}`, body, [{ label: 'Zatvori', fn: () => { closeModal(); renderPvP(); } }]);
}

const SHIELD_PRICES = { 1: { satoshi: 100 }, 4: { satoshi: 400 }, 12: { satoshi: 1080 }, 24: { satoshi: 1920 } };

function buyShield(hours) {
  const price = SHIELD_PRICES[hours] || { satoshi: hours * 100 };
  openModal('🛡️ Kupi Shield', `<div style="text-align:center;padding:20px"><div style="font-size:2.5rem;margin-bottom:12px">🛡️</div><div style="font-size:1rem;font-weight:700;color:white;margin-bottom:4px">${hours}h zaštita</div><div style="font-size:1.4rem;color:#ffcc44;font-family:'Orbitron',monospace;margin-bottom:16px">${price.satoshi} satoshi BPW</div><div style="font-size:0.72rem;color:#6a90b8;background:rgba(0,0,0,0.3);padding:10px;border-radius:6px">HIVE blockchain plaćanje — uskoro dostupno.<br>BPW token integracija u razvoju.</div></div>`, [{ label: 'Zatvori', fn: closeModal }]);
}