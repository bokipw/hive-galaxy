// ============================================================
// HIVE GALAXY — js/systems/pvp.js
// Čist PvP sistem — odvojeno od instanci
// ============================================================

if (!window.pvpShield) window.pvpShield = { active: false, expiresAt: null };

window._currentOpponents = window._currentOpponents || [];

// ── Armor damage reduction (defender armor type) ──
const PVP_ARMOR_REDUCTION = { Light: 0, Medium: 0.10, Heavy: 0.20, Nano: -0.10 };
const PVP_MAX_ROUNDS = 60;

// ── Izgradi battle-ready fleet od snimljenih slotova ──
// Koristi se za LOKALNOG igrača (A) koji ima sve podatke
function buildPvpFleetLocal() {
  const rawSlots = typeof getAllDeployedSlots === 'function' ? getAllDeployedSlots() : [];
  if (rawSlots.length === 0) return [];

  // Research bonusi
  const resDps    = typeof getWeaponsDpsBonus  === 'function' ? (1 + getWeaponsDpsBonus()  / 100) : 1;
  const resShield = typeof getShieldBonus      === 'function' ? (1 + getShieldBonus()      / 100) : 1;
  const resRegen  = typeof getShieldRegenBonus === 'function' ? (1 + getShieldRegenBonus() / 100) : 1;
  const resCrit   = typeof getWeaponsCritBonus === 'function' ? getWeaponsCritBonus() : 0;
  const resDmgRed = typeof getArmorDmgReduction === 'function' ? getArmorDmgReduction() : 0;
  const sfMult    = (buildings.ship_factory?.level || 0) >= 100 ? 1.05 : 1.0;

  // Artifact bonusi
  const ab = typeof getArtifactBonuses === 'function' ? getArtifactBonuses() : {};
  const artAtk  = (ab.attack || 0) + (ab.fleet || 0);
  const artHp   = (ab.hp    || 0) + (ab.fleet || 0);
  const artDef  = (ab.defense || 0) + (ab.resist || 0);
  const artCrit = ab.crit || 0;

  // Commander bonusi
  const deployed = window._deployedCommanders || [];
  const cb = (typeof getAggregatedCommanderBonuses === 'function' && deployed.length > 0)
    ? getAggregatedCommanderBonuses(deployed)
    : {};

  return rawSlots.map((slot, idx) => {
    const stats = typeof calcSlotStats === 'function' ? calcSlotStats(slot) : null;
    const ship  = typeof getShipById   === 'function' ? getShipById(slot.ship_id) : null;
    if (!stats || !ship) return null;

    const cls = slot.ship_id.split('_')[0];

    // Shield specijal i regen
    let shieldRegen = 0;
    let shieldSpec  = null;
    for (let si = 1; si <= 3; si++) {
      const sh = (slot[`shield_${si}`] && typeof getShieldById === 'function')
        ? getShieldById(slot[`shield_${si}`]) : null;
      if (!sh) continue;
      shieldRegen += sh.regen || 0;
      if (!shieldSpec && sh.special) shieldSpec = sh.special;
    }

    // Engine specijal
    const engId   = slot.engine_1 || null;
    const eng     = (engId && typeof getEngineById === 'function') ? getEngineById(engId) : null;
    const engSpec = eng?.special || null;

    // Baza
    let dps     = stats.dps    * resDps    * sfMult;
    let hp      = stats.hp                 * sfMult;
    let shield  = stats.shield * resShield * sfMult;
    let regen   = shieldRegen  * resRegen;
    let agility = stats.agility + (eng?.agility_bonus || 0);
    let speed   = stats.speed   + (eng?.speed > 1 ? eng.speed - 1 : 0);
    let dmgRed  = resDmgRed;
    let critBonus = resCrit;

    // Shield specijal
    if (shieldSpec?.type === 'max_shield_boost') shield *= (1 + shieldSpec.bonus / 100);
    if (shieldSpec?.type === 'extra_regen')       regen  *= (1 + shieldSpec.bonus / 100);

    // Artifact bonusi
    dps    *= (1 + artAtk  / 100);
    hp     *= (1 + artHp   / 100);
    shield *= (1 + artHp   / 100);
    dmgRed += artDef;
    critBonus += artCrit;

    // Commander bonusi — flat
    if (cb.atk)    dps     *= (1 + cb.atk    / 100);
    if (cb.hp)     { hp *= (1 + cb.hp / 100); shield *= (1 + cb.hp / 100); }
    if (cb.shield) shield  *= (1 + cb.shield / 100);
    if (cb.shield_regen) regen *= (1 + cb.shield_regen / 100);
    if (cb.evasion) agility = Math.min(90, agility + cb.evasion);
    if (cb.speed)   speed  += cb.speed;
    if (cb.crit)    critBonus += cb.crit;
    if (cb.dmg_reduction) dmgRed += cb.dmg_reduction;

    // Commander bonusi — klasa-specifični
    if (cls === 'battleship') {
      if (cb.battleship_atk) dps *= (1 + cb.battleship_atk / 100);
      if (cb.battleship_hp)  { hp *= (1 + cb.battleship_hp / 100); }
    }
    if (cls === 'fighter') {
      if (cb.fighter_atk)    dps     *= (1 + cb.fighter_atk    / 100);
      if (cb.fighter_hp)     hp      *= (1 + cb.fighter_hp     / 100);
      if (cb.fighter_evasion) agility = Math.min(90, agility + cb.fighter_evasion);
      if (cb.fighter_speed)  speed   += cb.fighter_speed;
    }
    if (cls === 'cruiser') {
      if (cb.cruiser_atk)    dps    *= (1 + cb.cruiser_atk    / 100);
      if (cb.cruiser_hp)     hp     *= (1 + cb.cruiser_hp     / 100);
      if (cb.cruiser_shield) shield *= (1 + cb.cruiser_shield / 100);
    }
    if (cls === 'scout') {
      if (cb.scout_atk)    dps     *= (1 + cb.scout_atk    / 100);
      if (cb.scout_evasion) agility = Math.min(90, agility + cb.scout_evasion);
      if (cb.scout_speed)  speed   += cb.scout_speed;
    }
    if (cls === 'carrier') {
      if (cb.carrier_atk) dps *= (1 + cb.carrier_atk / 100);
      if (cb.carrier_hp)  hp  *= (1 + cb.carrier_hp  / 100);
    }
    if (cls === 'special') {
      if (cb.special_atk) dps *= (1 + cb.special_atk / 100);
      if (cb.special_hp)  hp  *= (1 + cb.special_hp  / 100);
    }

    const finalShield = Math.floor(shield);
    return {
      id:           `a_${idx}`,
      ship_id:      slot.ship_id,
      name:         ship.name || slot.ship_id,
      count:        slot.count || 1,
      hp:           Math.floor(hp),
      maxHp:        Math.floor(hp),
      shield:       finalShield,
      maxShield:    finalShield,
      shieldRegen:  Math.floor(regen),
      dps:          Math.floor(dps),
      agility:      Math.min(90, agility),
      speed:        Math.max(1, speed),
      armor:        ship.armor || 'Light',
      dmgReduction: Math.min(60, dmgRed),
      critBonus,
      engineSpecial: engSpec || null,
      effects:      [],
      alive:        true,
      side:         'player',
    };
  }).filter(Boolean);
}

// ── Izgradi battle-ready fleet od snapshota (igrač B iz baze) ──
// Snapshot već ima sve stats snimljene — samo inicijalizujemo
function buildPvpFleetFromSnapshot(snapshotFleet) {
  return (snapshotFleet || []).map((s, idx) => ({
    id:           `b_${idx}`,
    ship_id:      s.ship_id,
    name:         s.name || s.ship_id,
    count:        s.count || 1,
    hp:           s.hp,
    maxHp:        s.hp,
    shield:       s.shield  || 0,
    maxShield:    s.shield  || 0,
    shieldRegen:  s.shield_regen || 0,
    dps:          s.dps,
    agility:      s.agility || 0,
    speed:        s.speed   || 1,
    armor:        s.armor   || 'Light',
    dmgReduction: s.dmg_reduction || 0,
    critBonus:    s.crit_bonus    || 0,
    engineSpecial: s.engine_special || null,
    effects:      [],
    alive:        true,
    side:         'enemy',
  })).filter(s => s.hp > 0 && s.dps > 0);
}

// ── PvP simulacija ──
function simulatePvpBattle(fleetA, fleetB) {
  const log = [];
  let round = 0;

  const allUnits = [...fleetA, ...fleetB];
  if (allUnits.length === 0) return { status: 'draw', round: 0, log };

  const alive = side => allUnits.filter(u => u.alive && u.side === side);

  while (round < PVP_MAX_ROUNDS) {
    round++;
    log.push({ type: 'round', msg: `━━━ RUNDA ${round} ━━━` });

    const active = allUnits.filter(u => u.alive);
    // Sortiramo po brzini — brži idu prvi
    active.sort((a, b) => b.speed - a.speed);

    for (const attacker of active) {
      if (!attacker.alive) continue;

      // Shield regen na početku poteza
      if (attacker.shieldRegen > 0 && attacker.shield < attacker.maxShield) {
        attacker.shield = Math.min(attacker.maxShield, attacker.shield + attacker.shieldRegen);
      }

      // Odaberi metu — nasumični živi neprijatelj
      const enemies = allUnits.filter(u => u.alive && u.side !== attacker.side);
      if (enemies.length === 0) break;
      const target = enemies[Math.floor(Math.random() * enemies.length)];

      // Dodge provjera
      if (target.agility > 0 && Math.random() * 100 < target.agility) {
        log.push({ type: 'miss', msg: `💨 ${target.name} izbjegao napad od ${attacker.name}` });
        continue;
      }

      // Kritični udarac
      const critChance = 5 + (attacker.critBonus || 0);
      const isCrit = Math.random() * 100 < critChance;
      const critMult = isCrit ? 1.5 : 1.0;

      // Damage kalkulacija
      const armorRed = PVP_ARMOR_REDUCTION[target.armor] || 0;
      const dmgRed   = (target.dmgReduction || 0) / 100;
      let dmg = Math.floor(attacker.dps * critMult * (1 - armorRed) * (1 - dmgRed));
      dmg = Math.max(1, dmg);

      // Engine specijal — void phase (dodge sve)
      if (target.engineSpecial?.type === 'void_phase') {
        const voidChance = target.engineSpecial.chance || 0;
        if (Math.random() * 100 < voidChance) {
          log.push({ type: 'effect', msg: `🕳️ ${target.name} ušao u void — imun na štetu!` });
          continue;
        }
      }

      // Primijeni štetu — shield prvi, pa hp
      let shieldDmg = 0;
      let hpDmg = 0;
      if (target.shield > 0) {
        shieldDmg = Math.min(target.shield, dmg);
        target.shield -= shieldDmg;
        hpDmg = dmg - shieldDmg;
      } else {
        hpDmg = dmg;
      }
      target.hp -= hpDmg;

      const critTxt = isCrit ? ' 💥KRIT' : '';
      log.push({
        type:        'attack',
        msg:         `⚔️ ${attacker.name} → ${target.name}: ${fmt(dmg)} dmg${critTxt}${shieldDmg > 0 ? ` (${fmt(shieldDmg)} shield)` : ''}`,
        attackerId:  attacker.id,
        targetId:    target.id,
        damage:      dmg,
        isCrit,
        shieldDmg,
        hpAfter:     Math.max(0, target.hp),
        hpMax:       target.maxHp,
        shieldAfter: Math.max(0, target.shield),
        shieldMax:   target.maxShield,
      });

      if (target.hp <= 0) {
        target.hp = 0;
        target.alive = false;
        log.push({ type: 'destroy', msg: `💀 ${target.name} uništen!`, targetId: target.id });
      }
    }

    // Provjeri završetak
    const aAlive = alive('player').length;
    const bAlive = alive('enemy').length;

    if (aAlive === 0 && bAlive === 0) {
      log.push({ type: 'info', msg: '⚖️ Obje flote uništene — neriješeno!' });
      return { status: 'draw', round, log };
    }
    if (bAlive === 0) {
      log.push({ type: 'info', msg: '🏆 Pobjeda!' });
      return { status: 'victory', round, log };
    }
    if (aAlive === 0) {
      log.push({ type: 'info', msg: '💀 Poraz!' });
      return { status: 'defeat', round, log };
    }
  }

  log.push({ type: 'info', msg: '⏱️ Maksimalan broj rundi — neriješeno.' });
  return { status: 'draw', round, log };
}

// ── Vizuelna PvP bitka ──
let _pvpAnimSpeed = 600; // ms između akcija
let _pvpAnimTimer = null;
let _pvpAnimPaused = false;

function openPvpBattleVisual(myFleet, oppFleet, opp) {
  const result = simulatePvpBattle(myFleet, oppFleet);

  // Snapshot stanja svih jedinica za vizualizaciju
  const units = {};
  [...myFleet, ...oppFleet].forEach(u => {
    units[u.id] = {
      id: u.id, name: u.name, side: u.side,
      hp: u.maxHp, maxHp: u.maxHp,
      shield: u.maxShield, maxShield: u.maxShield,
      alive: true,
    };
  });

  // Grupišemo po strani
  const playerUnits = myFleet.map(u => ({ ...units[u.id] }));
  const enemyUnits  = oppFleet.map(u => ({ ...units[u.id] }));

  // Reset stanja
  [...myFleet, ...oppFleet].forEach(u => {
    u.hp = u.maxHp; u.shield = u.maxShield; u.alive = true;
  });

  const modalEl = document.createElement('div');
  modalEl.id = 'pvpBattleModal';
  modalEl.style.cssText = `
    position:fixed;inset:0;z-index:9999;background:rgba(0,5,15,0.97);
    display:flex;flex-direction:column;overflow:hidden;
    font-family:'Share Tech Mono',monospace;
  `;

  modalEl.innerHTML = `
    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 20px;border-bottom:1px solid rgba(0,212,255,0.15);flex-shrink:0">
      <div style="font-family:'Orbitron',monospace;font-size:0.8rem;color:#00d4ff">⚔️ PvP BITKA</div>
      <div style="display:flex;gap:8px;align-items:center">
        <span id="pvpRoundLabel" style="font-size:0.7rem;color:#ffcc44">Runda 0</span>
        <button onclick="togglePvpPause()" id="pvpPauseBtn" style="font-size:0.65rem;padding:4px 12px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);color:#00d4ff;border-radius:4px;cursor:pointer">⏸ Pauza</button>
        <button onclick="setPvpSpeed(300)" style="font-size:0.65rem;padding:4px 10px;background:rgba(255,204,68,0.1);border:1px solid rgba(255,204,68,0.3);color:#ffcc44;border-radius:4px;cursor:pointer">2×</button>
        <button onclick="setPvpSpeed(100)" style="font-size:0.65rem;padding:4px 10px;background:rgba(255,204,68,0.1);border:1px solid rgba(255,204,68,0.3);color:#ffcc44;border-radius:4px;cursor:pointer">5×</button>
        <button onclick="skipPvpAnim()" style="font-size:0.65rem;padding:4px 10px;background:rgba(255,51,85,0.1);border:1px solid rgba(255,51,85,0.3);color:#ff3355;border-radius:4px;cursor:pointer">⏭ Skip</button>
      </div>
    </div>

    <!-- Bojna mapa -->
    <div style="flex:1;display:flex;gap:0;overflow:hidden;position:relative">
      <!-- SVG overlay za projektile -->
      <svg id="pvpProjectileSvg" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:10"></svg>

      <!-- Lijeva strana (player) -->
      <div id="pvpSideA" style="flex:1;padding:12px;overflow-y:auto;border-right:1px solid rgba(0,212,255,0.1)">
        <div style="font-size:0.55rem;color:#00d4ff;font-family:'Orbitron',monospace;letter-spacing:2px;margin-bottom:10px;text-align:center">
          ${window._hiveUser || 'TI'}
        </div>
        <div id="pvpUnitsA" style="display:flex;flex-direction:column;gap:6px"></div>
      </div>

      <!-- Sredina — log -->
      <div style="width:260px;flex-shrink:0;padding:10px;overflow-y:auto;border-right:1px solid rgba(255,255,255,0.05)" id="pvpBattleLog">
        <div style="font-size:0.55rem;color:#6a90b8;font-family:'Orbitron',monospace;letter-spacing:1px;margin-bottom:8px;text-align:center">LOG</div>
      </div>

      <!-- Desna strana (enemy) -->
      <div id="pvpSideB" style="flex:1;padding:12px;overflow-y:auto">
        <div style="font-size:0.55rem;color:#ff3355;font-family:'Orbitron',monospace;letter-spacing:2px;margin-bottom:10px;text-align:center">
          ${opp.name}
        </div>
        <div id="pvpUnitsB" style="display:flex;flex-direction:column;gap:6px"></div>
      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  // Render početnih jedinica
  renderPvpUnits(myFleet, 'pvpUnitsA', 'player');
  renderPvpUnits(oppFleet, 'pvpUnitsB', 'enemy');

  // Pokreni animaciju
  _pvpAnimSpeed  = 600;
  _pvpAnimPaused = false;
  window._pvpBattleResult = result;
  window._pvpBattleOpp    = opp;
  playPvpLog(result.log, 0, myFleet, oppFleet);
}

function renderPvpUnits(fleet, containerId, side) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const color = side === 'player' ? '#00d4ff' : '#ff3355';
  el.innerHTML = fleet.map(u => `
    <div id="pvpUnit_${u.id}" style="
      background:rgba(0,0,0,0.4);border:1px solid ${color}33;border-radius:6px;
      padding:8px 10px;transition:border-color 0.2s,box-shadow 0.2s;position:relative;overflow:hidden
    ">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
        <span style="font-size:0.65rem;color:white;font-weight:700">${u.name}</span>
        <span style="font-size:0.55rem;color:#6a90b8">×${u.count}</span>
      </div>
      <!-- HP bar -->
      <div style="height:4px;background:rgba(255,255,255,0.08);border-radius:2px;margin-bottom:3px">
        <div id="pvpHp_${u.id}" style="height:100%;width:100%;background:#00ff88;border-radius:2px;transition:width 0.3s,background 0.3s"></div>
      </div>
      <!-- Shield bar -->
      <div style="height:3px;background:rgba(255,255,255,0.05);border-radius:2px">
        <div id="pvpShield_${u.id}" style="height:100%;width:${u.maxShield > 0 ? '100' : '0'}%;background:#00aaff;border-radius:2px;transition:width 0.3s"></div>
      </div>
      <!-- HP text -->
      <div style="display:flex;justify-content:space-between;margin-top:3px">
        <span id="pvpHpTxt_${u.id}" style="font-size:0.5rem;color:#6a90b8">${fmt(u.maxHp)} HP</span>
        ${u.maxShield > 0 ? `<span id="pvpShieldTxt_${u.id}" style="font-size:0.5rem;color:#00aaff">${fmt(u.maxShield)} 🛡</span>` : ''}
      </div>
      <!-- Damage float container -->
      <div id="pvpDmg_${u.id}" style="position:absolute;top:4px;right:8px;pointer-events:none"></div>
    </div>
  `).join('');
}

function updatePvpUnit(unitId, hpAfter, hpMax, shieldAfter, shieldMax) {
  const hpPct     = hpMax > 0 ? Math.max(0, (hpAfter / hpMax) * 100) : 0;
  const shieldPct = shieldMax > 0 ? Math.max(0, (shieldAfter / shieldMax) * 100) : 0;
  const hpColor   = hpPct > 50 ? '#00ff88' : hpPct > 25 ? '#ffcc44' : '#ff3355';

  const hpBar     = document.getElementById(`pvpHp_${unitId}`);
  const shieldBar = document.getElementById(`pvpShield_${unitId}`);
  const hpTxt     = document.getElementById(`pvpHpTxt_${unitId}`);
  const shTxt     = document.getElementById(`pvpShieldTxt_${unitId}`);

  if (hpBar)     { hpBar.style.width = hpPct + '%'; hpBar.style.background = hpColor; }
  if (shieldBar) shieldBar.style.width = shieldPct + '%';
  if (hpTxt)     hpTxt.textContent = fmt(Math.max(0, hpAfter)) + ' HP';
  if (shTxt)     shTxt.textContent = fmt(Math.max(0, shieldAfter)) + ' 🛡';
}

function flashPvpUnit(unitId, isAttacker, isCrit) {
  const el = document.getElementById(`pvpUnit_${unitId}`);
  if (!el) return;
  const col = isAttacker ? (isCrit ? '#ffcc44' : '#00d4ff') : (isCrit ? '#ff6600' : '#ff3355');
  el.style.borderColor  = col;
  el.style.boxShadow    = `0 0 12px ${col}66`;
  setTimeout(() => {
    if (el) { el.style.borderColor = ''; el.style.boxShadow = ''; }
  }, 400);
}

function destroyPvpUnit(unitId) {
  const el = document.getElementById(`pvpUnit_${unitId}`);
  if (!el) return;
  el.style.transition = 'opacity 0.5s, transform 0.5s';
  el.style.opacity    = '0.15';
  el.style.filter     = 'grayscale(1)';
  const hpBar = document.getElementById(`pvpHp_${unitId}`);
  if (hpBar) { hpBar.style.width = '0%'; hpBar.style.background = '#ff3355'; }
}

function showDamageFloat(unitId, dmg, isCrit) {
  const el = document.getElementById(`pvpDmg_${unitId}`);
  if (!el) return;
  const span = document.createElement('span');
  span.style.cssText = `
    position:absolute;right:0;top:0;font-size:${isCrit ? '0.75' : '0.6'}rem;
    font-weight:700;color:${isCrit ? '#ff6600' : '#ff3355'};
    font-family:'Orbitron',monospace;pointer-events:none;
    animation:pvpDmgFloat 0.8s ease-out forwards;
  `;
  span.textContent = '-' + fmt(dmg) + (isCrit ? '!' : '');
  el.appendChild(span);
  setTimeout(() => { if (span.parentNode) span.parentNode.removeChild(span); }, 900);
}

function shootPvpProjectile(attackerId, targetId, isCrit) {
  const svg = document.getElementById('pvpProjectileSvg');
  const aEl = document.getElementById(`pvpUnit_${attackerId}`);
  const tEl = document.getElementById(`pvpUnit_${targetId}`);
  if (!svg || !aEl || !tEl) return;

  const aRect = aEl.getBoundingClientRect();
  const tRect = tEl.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();

  const x1 = aRect.left + aRect.width / 2 - svgRect.left;
  const y1 = aRect.top  + aRect.height / 2 - svgRect.top;
  const x2 = tRect.left + tRect.width  / 2 - svgRect.left;
  const y2 = tRect.top  + tRect.height / 2 - svgRect.top;

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1); line.setAttribute('y1', y1);
  line.setAttribute('x2', x2); line.setAttribute('y2', y2);
  line.setAttribute('stroke', isCrit ? '#ff6600' : '#00d4ff');
  line.setAttribute('stroke-width', isCrit ? '2' : '1');
  line.setAttribute('opacity', '0.8');
  line.setAttribute('stroke-dasharray', '4 3');
  svg.appendChild(line);

  // Animiraj nestajanje
  let op = 0.8;
  const fade = setInterval(() => {
    op -= 0.15;
    if (op <= 0) { clearInterval(fade); if (line.parentNode) line.parentNode.removeChild(line); }
    else line.setAttribute('opacity', op);
  }, 50);
}

function addPvpLog(msg, type) {
  const el = document.getElementById('pvpBattleLog');
  if (!el) return;
  const color = type === 'round' ? '#ffcc44' : type === 'destroy' ? '#ff3355' : type === 'miss' ? '#6a90b8' : type === 'effect' ? '#aa44ff' : type === 'info' ? '#00ff88' : '#b0cce8';
  const div = document.createElement('div');
  div.style.cssText = `font-size:0.55rem;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.03);color:${color}`;
  div.textContent = msg;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function playPvpLog(log, idx, myFleet, oppFleet) {
  if (!document.getElementById('pvpBattleModal')) return;
  if (idx >= log.length) {
    finishPvpBattle();
    return;
  }

  if (_pvpAnimPaused) {
    setTimeout(() => playPvpLog(log, idx, myFleet, oppFleet), 100);
    return;
  }

  const entry = log[idx];

  if (entry.type === 'round') {
    const lbl = document.getElementById('pvpRoundLabel');
    if (lbl) lbl.textContent = entry.msg.replace('━━━ ', '').replace(' ━━━', '');
  }

  addPvpLog(entry.msg, entry.type);

  if (entry.type === 'attack') {
    shootPvpProjectile(entry.attackerId, entry.targetId, entry.isCrit);
    flashPvpUnit(entry.attackerId, true, entry.isCrit);
    flashPvpUnit(entry.targetId, false, entry.isCrit);
    showDamageFloat(entry.targetId, entry.damage, entry.isCrit);
    updatePvpUnit(entry.targetId, entry.hpAfter, entry.hpMax, entry.shieldAfter, entry.shieldMax);
  }

  if (entry.type === 'destroy') {
    destroyPvpUnit(entry.targetId);
  }

  _pvpAnimTimer = setTimeout(() => playPvpLog(log, idx + 1, myFleet, oppFleet), _pvpAnimSpeed);
}

function finishPvpBattle() {
  const result = window._pvpBattleResult;
  const opp    = window._pvpBattleOpp;
  if (!result || !opp) return;

  // Izračunaj rezultat
  const isVictory = result.status === 'victory';
  const ratingChange = calcRatingChange(pvp.rating || 1000, opp.rating, isVictory);
  pvp.rating = Math.max(0, (pvp.rating || 1000) + ratingChange);
  if (isVictory) pvp.wins = (pvp.wins || 0) + 1;
  else if (result.status === 'defeat') pvp.losses = (pvp.losses || 0) + 1;

  window._dailyPvpCount = (window._dailyPvpCount || 0) + 1;

  let loot = { metal: 0, crystal: 0, he3: 0 };
  if (isVictory) {
    loot.metal   = Math.floor((opp.power || 10000) * 5);
    loot.crystal = Math.floor((opp.power || 10000) * 4);
    loot.he3     = Math.floor((opp.power || 10000) * 2);
    R.metal   += loot.metal;
    R.crystal += loot.crystal;
    R.he3     += loot.he3;
  }

  if (!pvp.log) pvp.log = [];
  pvp.log.unshift({ time: Date.now(), opponent: opp.name, rating: opp.rating, result: result.status, rounds: result.round, ratingChange, loot });
  if (pvp.log.length > 20) pvp.log = pvp.log.slice(0, 20);

  if (typeof updateResUI === 'function') updateResUI();
  saveGame();

  // Prikaži rezultat overlay unutar modal-a
  const modal = document.getElementById('pvpBattleModal');
  if (!modal) return;

  const statusColor = isVictory ? '#00ff88' : result.status === 'draw' ? '#ffcc44' : '#ff3355';
  const statusText  = isVictory ? '🏆 POBJEDA!' : result.status === 'draw' ? '⚖️ NERIJEŠENO' : '💀 PORAZ';

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:absolute;inset:0;z-index:20;background:rgba(0,0,0,0.85);
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;
  `;
  overlay.innerHTML = `
    <div style="font-size:2rem;font-family:'Orbitron',monospace;font-weight:900;color:${statusColor}">${statusText}</div>
    <div style="font-size:0.8rem;color:#6a90b8">${result.round} rundi · Rating: <span style="color:${ratingChange >= 0 ? '#00ff88' : '#ff3355'}">${ratingChange >= 0 ? '+' : ''}${ratingChange}</span></div>
    ${isVictory ? `<div style="font-size:0.75rem;color:#00ff88">🔩 ${fmt(loot.metal)} · 💎 ${fmt(loot.crystal)} · ⛽ ${fmt(loot.he3)}</div>` : ''}
    <button onclick="closePvpBattleModal()" style="margin-top:10px;padding:10px 32px;font-family:'Orbitron',monospace;font-size:0.75rem;background:linear-gradient(135deg,rgba(0,212,255,0.2),rgba(0,212,255,0.05));border:1px solid #00d4ff;color:#00d4ff;border-radius:6px;cursor:pointer">ZATVORI</button>
  `;
  modal.style.position = 'relative';
  modal.appendChild(overlay);
}

function closePvpBattleModal() {
  if (_pvpAnimTimer) clearTimeout(_pvpAnimTimer);
  const el = document.getElementById('pvpBattleModal');
  if (el) el.remove();
  renderPvp();
}

function togglePvpPause() {
  _pvpAnimPaused = !_pvpAnimPaused;
  const btn = document.getElementById('pvpPauseBtn');
  if (btn) btn.textContent = _pvpAnimPaused ? '▶ Nastavi' : '⏸ Pauza';
}

function setPvpSpeed(ms) {
  _pvpAnimSpeed = ms;
}

function skipPvpAnim() {
  _pvpAnimSpeed = 0;
  _pvpAnimPaused = false;
}

// ── ELO rating promjena ──
function calcRatingChange(myRating, oppRating, won) {
  const K = 32;
  const expected = 1 / (1 + Math.pow(10, (oppRating - myRating) / 400));
  const actual = won ? 1 : 0;
  return Math.round(K * (actual - expected));
}

// ── Dohvati protivnike iz Supabase ──
async function refreshOpponents() {
  const el = document.getElementById('opponentList');
  if (el) el.innerHTML = '<div style="color:#6a90b8;padding:20px;text-align:center">⏳ Tražim protivnike...</div>';

  if (!window._supa) {
    if (el) el.innerHTML = '<div style="color:#6a90b8;padding:20px;text-align:center">Nije moguće učitati protivnike.</div>';
    return;
  }

  const myId = window._supaSession
    ? window._supaSession.user.id
    : (window._hiveUser ? 'hive_' + window._hiveUser : null);

  const { data, error } = await window._supa
    .from('pvp_snapshots')
    .select('*')
    .neq('id', myId || '')
    .order('rating', { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) {
    window._currentOpponents = [];
    if (el) el.innerHTML = '<div style="color:#6a90b8;padding:20px;text-align:center">Nema dostupnih protivnika.</div>';
    return;
  }

  // Sortiraj po blizini ratinga
  const sorted = data.sort((a, b) =>
    Math.abs(a.rating - (pvp.rating || 1000)) - Math.abs(b.rating - (pvp.rating || 1000))
  );

  window._currentOpponents = sorted.slice(0, 8).map(row => ({
    id:       row.id,
    name:     row.username,
    rating:   row.rating  || 1000,
    level:    row.level   || 1,
    power:    row.power   || 0,
    fleet:    Array.isArray(row.fleet) ? row.fleet : [],
    isPremium: row.is_premium || false,
    updatedAt: row.updated_at,
  }));

  if (el) el.innerHTML = renderOpponentListHTML();
  toast('🔄 Protivnici učitani!', 'inf');
}

// ── Render liste protivnika ──
function renderOpponentListHTML() {
  if (window._currentOpponents.length === 0) {
    return '<div style="color:#6a90b8;padding:20px;text-align:center">Nema dostupnih protivnika.</div>';
  }

  const myRating = pvp.rating || 1000;

  return window._currentOpponents.map((opp, idx) => {
    const ratingDiff = opp.rating - myRating;
    const diffColor  = ratingDiff > 0 ? '#ff3355' : '#00ff88';
    const diffText   = (ratingDiff > 0 ? '+' : '') + ratingDiff;
    const fleetCount = opp.fleet ? opp.fleet.length : 0;
    const premBadge  = opp.isPremium ? '<span style="font-size:0.5rem;color:#ffcc44;border:1px solid #ffcc4444;padding:1px 5px;border-radius:3px;margin-left:5px">★ PREMIUM</span>' : '';

    return `
      <div class="card" style="margin-bottom:10px;border-color:rgba(255,51,85,0.2)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div>
            <div style="font-size:0.8rem;font-weight:700;color:white">${opp.name}${premBadge}</div>
            <div style="font-size:0.6rem;color:#6a90b8;margin-top:2px">
              Level ${opp.level} · Rating <span style="color:#ffcc44">${opp.rating}</span>
              <span style="color:${diffColor};margin-left:6px">(${diffText})</span>
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:0.65rem;color:#00d4ff;font-family:'Orbitron',monospace">${fmt(opp.power)}</div>
            <div style="font-size:0.55rem;color:#6a90b8">${fleetCount} brodova</div>
          </div>
        </div>
        <button class="btn btn-danger" style="width:100%;font-size:0.68rem"
          onclick="startPvpBattle(${idx})">
          ⚔️ NAPADNI
        </button>
      </div>`;
  }).join('');
}

// ── Pokretanje PvP bitke ──
function startPvpBattle(oppIdx) {
  const opp = window._currentOpponents[oppIdx];
  if (!opp) return;

  // Provjeri shield
  if (window.pvpShield?.active && Date.now() < new Date(window.pvpShield.expiresAt).getTime()) {
    toast('🛡️ Tvoj shield je aktivan — ne možeš napadati!', 'warn');
    return;
  }

  // He3 trošak
  const he3Cost = 10;
  if (R.he3 < he3Cost) {
    toast(`⛽ Nedovoljno He3! Treba ${he3Cost}`, 'warn');
    return;
  }
  R.he3 -= he3Cost;
  if (typeof updateResUI === 'function') updateResUI();

  // Provjeri da li protivnik ima fleet
  if (!opp.fleet || opp.fleet.length === 0) {
    toast('⚠️ Protivnik nema raspoređenu flotu!', 'warn');
    return;
  }

  toast(`⚔️ Napadam ${opp.name}...`, 'inf');

  setTimeout(() => {
    const myFleet  = buildPvpFleetLocal();
    const oppFleet = buildPvpFleetFromSnapshot(opp.fleet);

    if (myFleet.length === 0) {
      toast('⚠️ Nemaš brodova u floti!', 'warn');
      return;
    }
    if (oppFleet.length === 0) {
      toast('⚠️ Protivnik nema validnu flotu!', 'warn');
      return;
    }

    // Otvori vizuelnu bitku — rezultat se obrađuje unutar finishPvpBattle()
    openPvpBattleVisual(myFleet, oppFleet, opp);
  }, 200);
}

// ── Prikaz rezultata bitke ──
function renderPvpResult(result, opp, loot, ratingChange) {
  const isVictory = result.status === 'victory';
  const isDraw    = result.status === 'draw';

  const statusColor = isVictory ? '#00ff88' : isDraw ? '#ffcc44' : '#ff3355';
  const statusText  = isVictory ? '🏆 POBJEDA!' : isDraw ? '⚖️ NERIJEŠENO' : '💀 PORAZ';

  const lootHtml = isVictory ? `
    <div style="margin:12px 0;padding:10px;background:rgba(0,255,136,0.06);border-radius:6px;border:1px solid rgba(0,255,136,0.15)">
      <div style="font-size:0.6rem;color:#00ff88;font-family:'Orbitron',monospace;margin-bottom:6px">PLIJEN</div>
      <div style="font-size:0.7rem;color:#c0d8f0">
        🔩 ${fmt(loot.metal)} · 💎 ${fmt(loot.crystal)} · ⛽ ${fmt(loot.he3)}
      </div>
    </div>` : '';

  const logHtml = result.log.slice(-30).map(e => `
    <div style="font-size:0.6rem;padding:1px 0;color:${
      e.type === 'round'   ? '#ffcc44' :
      e.type === 'destroy' ? '#ff3355' :
      e.type === 'miss'    ? '#6a90b8' :
      e.type === 'effect'  ? '#aa44ff' :
      e.type === 'info'    ? '#00ff88' :
      '#b0cce8'
    }">${e.msg}</div>`).join('');

  openModal(
    `⚔️ PvP — ${opp.name}`,
    `<div style="text-align:center;margin-bottom:14px">
      <div style="font-size:1.4rem;font-weight:700;color:${statusColor};font-family:'Orbitron',monospace">${statusText}</div>
      <div style="font-size:0.7rem;color:#6a90b8;margin-top:4px">${result.round} rundi · Rating: <span style="color:${ratingChange >= 0 ? '#00ff88' : '#ff3355'}">${ratingChange >= 0 ? '+' : ''}${ratingChange}</span></div>
    </div>
    ${lootHtml}
    <div style="max-height:220px;overflow-y:auto;background:rgba(0,0,0,0.3);border-radius:6px;padding:10px;font-family:'Share Tech Mono',monospace">
      ${logHtml}
    </div>`,
    [{ label: 'Zatvori', cls: 'btn-g', fn: () => { closeModal(); renderPvp(); } }]
  );
}

// ── PvP log ──
function renderPvpLogHTML() {
  if (!pvp.log || pvp.log.length === 0) {
    return '<div style="color:#6a90b8;font-size:0.7rem;text-align:center;padding:20px">Nema borbi još.</div>';
  }
  return pvp.log.map(e => {
    const color  = e.result === 'victory' ? '#00ff88' : e.result === 'draw' ? '#ffcc44' : '#ff3355';
    const icon   = e.result === 'victory' ? '🏆' : e.result === 'draw' ? '⚖️' : '💀';
    const d      = new Date(e.time);
    const timeStr = `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
        <div>
          <span style="color:${color};font-size:0.75rem">${icon} ${e.opponent}</span>
          <span style="color:#6a90b8;font-size:0.6rem;margin-left:8px">${e.rounds} rundi</span>
        </div>
        <div style="text-align:right">
          <span style="color:${e.ratingChange >= 0 ? '#00ff88' : '#ff3355'};font-size:0.7rem">${e.ratingChange >= 0 ? '+' : ''}${e.ratingChange}</span>
          <span style="color:#6a90b8;font-size:0.55rem;margin-left:6px">${timeStr}</span>
        </div>
      </div>`;
  }).join('');
}

// ── Glavni render PvP panela ──
function renderPvp() {
  const el = document.getElementById('pvpContent');
  if (!el) return;

  const shield    = window.pvpShield || { active: false };
  const shieldActive = shield.active && shield.expiresAt && Date.now() < new Date(shield.expiresAt).getTime();
  const shieldLeft   = shieldActive ? Math.ceil((new Date(shield.expiresAt).getTime() - Date.now()) / 60000) : 0;

  el.innerHTML = `
    <!-- Header stats -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">
      <div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;text-align:center;border:1px solid rgba(255,204,68,0.15)">
        <div style="font-size:1.2rem;font-family:'Orbitron',monospace;color:#ffcc44">${pvp.rating || 1000}</div>
        <div style="font-size:0.55rem;color:#6a90b8;margin-top:2px">RATING</div>
      </div>
      <div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;text-align:center;border:1px solid rgba(0,212,255,0.15)">
        <div style="font-size:1.2rem;font-family:'Orbitron',monospace;color:#00d4ff">${pvp.wins || 0}</div>
        <div style="font-size:0.55rem;color:#6a90b8;margin-top:2px">POBJEDE</div>
      </div>
      <div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;text-align:center;border:1px solid rgba(255,51,85,0.15)">
        <div style="font-size:1.2rem;font-family:'Orbitron',monospace;color:#ff3355">${pvp.losses || 0}</div>
        <div style="font-size:0.55rem;color:#6a90b8;margin-top:2px">PORAZI</div>
      </div>
    </div>

    <!-- Shield status -->
    ${shieldActive ? `
    <div style="padding:10px 14px;background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.2);border-radius:8px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between">
      <span style="font-size:0.7rem;color:#00d4ff">🛡️ Shield aktivan — ${shieldLeft} min</span>
      <button onclick="deactivatePvpShield()" style="font-size:0.6rem;padding:3px 10px;background:rgba(255,51,85,0.1);border:1px solid rgba(255,51,85,0.3);color:#ff3355;border-radius:4px;cursor:pointer">Deaktiviraj</button>
    </div>` : `
    <div style="display:flex;gap:8px;margin-bottom:16px">
      <button onclick="activatePvpShield(4)" class="btn" style="flex:1;font-size:0.62rem">🛡️ Shield 4h (${fmt(50000)} metal)</button>
      <button onclick="refreshOpponents()" class="btn btn-g" style="flex:1;font-size:0.62rem">🔄 Osvježi</button>
    </div>`}

    <!-- Protivnici -->
    <div style="font-size:0.6rem;color:#ff3355;font-family:'Orbitron',monospace;letter-spacing:2px;margin-bottom:10px">⚔️ PROTIVNICI</div>
    <div id="opponentList">
      ${window._currentOpponents.length > 0 ? renderOpponentListHTML() : '<div style="color:#6a90b8;padding:20px;text-align:center">⏳ Učitavam...</div>'}
    </div>

    <!-- Log -->
    <div style="font-size:0.6rem;color:#6a90b8;font-family:'Orbitron',monospace;letter-spacing:2px;margin:20px 0 10px">📋 ISTORIJA BORBI</div>
    ${renderPvpLogHTML()}
  `;

  // Učitaj protivnike ako lista prazna
  if (window._currentOpponents.length === 0) refreshOpponents();
}

// ── Shield funkcije ──
function activatePvpShield(hours) {
  const metalCost = 50000;
  if (R.metal < metalCost) { toast(`Nedovoljno metala (${fmt(metalCost)})`, 'warn'); return; }
  R.metal -= metalCost;
  window.pvpShield = { active: true, expiresAt: new Date(Date.now() + hours * 3600000).toISOString() };
  if (typeof updateResUI === 'function') updateResUI();
  saveGame();
  renderPvp();
  toast(`🛡️ Shield aktivan ${hours}h!`, 'ok');
}

function deactivatePvpShield() {
  window.pvpShield = { active: false, expiresAt: null };
  saveGame();
  renderPvp();
}
