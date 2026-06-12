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
  const clone = u => JSON.parse(JSON.stringify(u));
  const units = [...fleetA.map(clone), ...fleetB.map(clone)];

  const log = [];
  const armorMod = { Light: 1, Medium: 0.9, Heavy: 0.8, Nano: 1.1 };
  const alive = side => units.filter(u => u.side === side && u.alive);
  let round = 0;

  while (round < PVP_MAX_ROUNDS) {
    round++;
    log.push({ type: 'round', msg: `━━━ RUNDA ${round} ━━━` });

    const attackers = units.filter(u => u.alive).sort((a, b) => b.speed - a.speed);

    for (const att of attackers) {
      if (!att.alive) continue;
      const enemies = alive(att.side === 'player' ? 'enemy' : 'player');
      if (enemies.length === 0) break;

      const target = enemies[Math.floor(Math.random() * enemies.length)];

      // void_phase
      if (target.engineSpecial?.type === 'void_phase') {
        if (Math.random() * 100 < (target.engineSpecial.chance || 0)) {
          log.push({ type: 'effect', msg: `🕳️ ${target.name} fazira u void — imun!`, attackerId: att.id, targetId: target.id });
          continue;
        }
      }

      // dodge
      if (Math.random() * 100 < (target.agility || 0)) {
        log.push({ type: 'miss', msg: `💨 ${att.name} promašuje ${target.name}`, attackerId: att.id, targetId: target.id });
        continue;
      }

      // damage
      let dmg = att.dps;
      const critChance = 5 + (att.critBonus || 0);
      const isCrit = Math.random() * 100 < critChance;
      if (isCrit) dmg *= 1.5;
      dmg *= armorMod[target.armor] || 1;
      dmg *= 1 - ((target.dmgReduction || 0) / 100);
      dmg = Math.max(1, Math.round(dmg));

      // shield pa hp
      const shieldDmg = Math.min(target.shield, dmg);
      target.shield -= shieldDmg;
      target.hp = Math.max(0, target.hp - (dmg - shieldDmg));

      log.push({
        type: 'attack',
        msg:  `⚔️ ${att.name} → ${target.name}: ${fmt(dmg)} dmg${isCrit ? ' 💥KRIT' : ''}${shieldDmg > 0 ? ` (${fmt(shieldDmg)} 🛡)` : ''}`,
        attackerId: att.id, targetId: target.id,
        damage: dmg, isCrit, shieldDmg,
        hpAfter: target.hp, hpMax: target.maxHp,
        shieldAfter: target.shield, shieldMax: target.maxShield,
      });

      if (target.hp <= 0 && target.alive) {
        target.alive = false;
        log.push({ type: 'destroy', msg: `💀 ${target.name} uništen!`, targetId: target.id });
      }
    }

    // Shield regen na kraju runde
    units.filter(u => u.alive && u.shieldRegen > 0).forEach(u => {
      const before = u.shield;
      u.shield = Math.min(u.maxShield, u.shield + u.shieldRegen);
      if (u.shield > before)
        log.push({ type: 'effect', msg: `🔵 ${u.name} +${fmt(u.shield - before)} shield`, targetId: u.id });
    });

    const pAlive = alive('player').length > 0;
    const eAlive = alive('enemy').length > 0;
    if (!eAlive && !pAlive) { log.push({ type: 'info', msg: '⚖️ Neriješeno!' }); return { status: 'draw', round, log }; }
    if (!eAlive) { log.push({ type: 'info', msg: '🏆 Pobjeda!' }); return { status: 'victory', round, log }; }
    if (!pAlive) { log.push({ type: 'info', msg: '💀 Poraz!' });   return { status: 'defeat',  round, log }; }
  }

  log.push({ type: 'info', msg: '⏱️ Maks. rundi — neriješeno.' });
  return { status: 'draw', round: PVP_MAX_ROUNDS, log };
}

// ── Canvas PvP vizualna bitka ──
let _pvpAnimSpeed = 700;
let _pvpAnimTimer = null;
let _pvpAnimPaused = false;
let _pvpCanvas = null;
let _pvpCtx = null;
let _pvpRafId = null;
let _pvpParticles = [];
let _pvpProjectiles = [];
let _pvpShipStates = {};
let _pvpFloats = [];
let _pvpStars = [];
let _pvpNebulas = [];
let _pvpTime = 0;

// Draw ship shape by class
function _pvpDrawShip(ctx, x, y, cls, side, scale, alpha, glowColor) {
  ctx.save();
  ctx.translate(x, y);
  if (side === 'enemy') ctx.scale(-1, 1);
  ctx.scale(scale, scale);
  ctx.globalAlpha = alpha;

  const col  = side === 'player' ? '#00d4ff' : '#ff4466';
  const col2 = side === 'player' ? '#0088cc' : '#cc2244';
  const eng  = side === 'player' ? '#00ffcc' : '#ff8844';

  ctx.shadowBlur = 18;
  ctx.shadowColor = glowColor || col;

  if (cls === 'fighter' || cls === 'scout') {
    // Sleek fighter
    ctx.beginPath();
    ctx.moveTo(28, 0);
    ctx.lineTo(-14, -10);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-14, 10);
    ctx.closePath();
    ctx.fillStyle = col2;
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Wing fins
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(-12, -20);
    ctx.lineTo(-16, -8);
    ctx.closePath();
    ctx.fillStyle = col + '99';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(-12, 20);
    ctx.lineTo(-16, 8);
    ctx.closePath();
    ctx.fillStyle = col + '99';
    ctx.fill();
    // Cockpit
    ctx.beginPath();
    ctx.ellipse(10, 0, 6, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#aaeeff';
    ctx.shadowBlur = 8; ctx.shadowColor = '#aaeeff';
    ctx.fill();
    // Engine
    ctx.beginPath();
    ctx.ellipse(-12, 0, 4, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = eng;
    ctx.shadowBlur = 14; ctx.shadowColor = eng;
    ctx.fill();

  } else if (cls === 'cruiser') {
    // Heavy cruiser
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(10, -14);
    ctx.lineTo(-20, -14);
    ctx.lineTo(-30, -6);
    ctx.lineTo(-30, 6);
    ctx.lineTo(-20, 14);
    ctx.lineTo(10, 14);
    ctx.closePath();
    ctx.fillStyle = col2;
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Turrets
    [[10, -10], [10, 10], [-5, -10], [-5, 10]].forEach(([tx, ty]) => {
      ctx.beginPath();
      ctx.arc(tx, ty, 3.5, 0, Math.PI*2);
      ctx.fillStyle = col;
      ctx.shadowBlur = 6; ctx.shadowColor = col;
      ctx.fill();
    });
    // Bridge
    ctx.beginPath();
    ctx.rect(0, -5, 16, 10);
    ctx.fillStyle = '#aaeeff33';
    ctx.fill();
    ctx.strokeStyle = '#aaeeff';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // Engines
    [[-26, -4], [-26, 4]].forEach(([ex, ey]) => {
      ctx.beginPath();
      ctx.ellipse(ex, ey, 5, 3, 0, 0, Math.PI*2);
      ctx.fillStyle = eng;
      ctx.shadowBlur = 16; ctx.shadowColor = eng;
      ctx.fill();
    });

  } else if (cls === 'battleship') {
    // Massive battleship
    ctx.beginPath();
    ctx.moveTo(36, 0);
    ctx.lineTo(16, -18);
    ctx.lineTo(-10, -20);
    ctx.lineTo(-34, -10);
    ctx.lineTo(-34, 10);
    ctx.lineTo(-10, 20);
    ctx.lineTo(16, 18);
    ctx.closePath();
    ctx.fillStyle = col2;
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.stroke();
    // Heavy cannons
    [[22, -14], [22, 14]].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.rect(cx, cy - 3, 18, 6);
      ctx.fillStyle = col;
      ctx.shadowBlur = 8; ctx.shadowColor = col;
      ctx.fill();
    });
    // Center cannon
    ctx.beginPath();
    ctx.rect(20, -2, 22, 4);
    ctx.fillStyle = col;
    ctx.shadowBlur = 10; ctx.shadowColor = col;
    ctx.fill();
    // Armor plates detail
    ctx.strokeStyle = col + '55';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(0, 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-16, -18); ctx.lineTo(-16, 18); ctx.stroke();
    // Engines
    [[-30, -7], [-30, 0], [-30, 7]].forEach(([ex, ey]) => {
      ctx.beginPath();
      ctx.ellipse(ex, ey, 5, 3.5, 0, 0, Math.PI*2);
      ctx.fillStyle = eng;
      ctx.shadowBlur = 18; ctx.shadowColor = eng;
      ctx.fill();
    });

  } else if (cls === 'carrier') {
    // Carrier — wide flat ship
    ctx.beginPath();
    ctx.moveTo(30, -4);
    ctx.lineTo(20, -18);
    ctx.lineTo(-30, -18);
    ctx.lineTo(-36, -6);
    ctx.lineTo(-36, 6);
    ctx.lineTo(-30, 18);
    ctx.lineTo(20, 18);
    ctx.lineTo(30, 4);
    ctx.closePath();
    ctx.fillStyle = col2;
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Hangar bay
    ctx.beginPath();
    ctx.rect(-20, -12, 40, 24);
    ctx.fillStyle = '#000a1488';
    ctx.fill();
    ctx.strokeStyle = col + '66';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // Small fighters on deck
    [-8, 0, 8].forEach(fy => {
      ctx.beginPath();
      ctx.moveTo(10, fy); ctx.lineTo(-2, fy-4); ctx.lineTo(-2, fy+4);
      ctx.fillStyle = col + 'cc';
      ctx.fill();
    });
    // Engines
    [[-32, -12], [-32, 12]].forEach(([ex, ey]) => {
      ctx.beginPath();
      ctx.ellipse(ex, ey, 6, 4, 0, 0, Math.PI*2);
      ctx.fillStyle = eng;
      ctx.shadowBlur = 16; ctx.shadowColor = eng;
      ctx.fill();
    });

  } else {
    // Default — generic ship
    ctx.beginPath();
    ctx.moveTo(26, 0);
    ctx.lineTo(-14, -12);
    ctx.lineTo(-20, 0);
    ctx.lineTo(-14, 12);
    ctx.closePath();
    ctx.fillStyle = col2;
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(-16, 0, 5, 3, 0, 0, Math.PI*2);
    ctx.fillStyle = eng;
    ctx.shadowBlur = 14; ctx.shadowColor = eng;
    ctx.fill();
  }

  ctx.restore();
}

function _pvpGetShipClass(shipId) {
  return (shipId || 'fighter').split('_')[0];
}

function openPvpBattleVisual(myFleet, oppFleet, opp) {
  const result = simulatePvpBattle(myFleet, oppFleet);

  const modalEl = document.createElement('div');
  modalEl.id = 'pvpBattleModal';
  modalEl.style.cssText = `
    position:fixed;inset:0;z-index:9999;background:#00050e;
    display:flex;flex-direction:column;overflow:hidden;
    font-family:'Share Tech Mono',monospace;
  `;

  modalEl.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;
      background:rgba(0,5,15,0.9);border-bottom:1px solid rgba(0,212,255,0.12);flex-shrink:0;z-index:2">
      <div style="display:flex;align-items:center;gap:14px">
        <span style="font-family:'Orbitron',monospace;font-size:0.85rem;color:#00d4ff;letter-spacing:2px">PvP BITKA</span>
        <span style="font-size:0.65rem;color:#00d4ff88">${window._hiveUser||'TI'}</span>
        <span style="font-size:0.6rem;color:#ffffff44">vs</span>
        <span style="font-size:0.65rem;color:#ff446688">${opp.name}</span>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <span id="pvpRoundLabel" style="font-size:0.65rem;color:#ffcc44;font-family:'Orbitron',monospace;min-width:80px;text-align:right"></span>
        <button onclick="togglePvpPause()" id="pvpPauseBtn" style="font-size:0.6rem;padding:4px 12px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.25);color:#00d4ff;border-radius:4px;cursor:pointer;letter-spacing:1px">⏸ PAUZA</button>
        <button onclick="setPvpSpeed(400)" style="font-size:0.6rem;padding:4px 10px;background:rgba(255,204,68,0.08);border:1px solid rgba(255,204,68,0.25);color:#ffcc44;border-radius:4px;cursor:pointer">2×</button>
        <button onclick="setPvpSpeed(120)" style="font-size:0.6rem;padding:4px 10px;background:rgba(255,204,68,0.08);border:1px solid rgba(255,204,68,0.25);color:#ffcc44;border-radius:4px;cursor:pointer">5×</button>
        <button onclick="skipPvpAnim()" style="font-size:0.6rem;padding:4px 10px;background:rgba(255,51,85,0.08);border:1px solid rgba(255,51,85,0.25);color:#ff3355;border-radius:4px;cursor:pointer">⏭ SKIP</button>
      </div>
    </div>
    <div style="flex:1;display:flex;overflow:hidden">
      <div style="flex:1;position:relative;overflow:hidden">
        <canvas id="pvpCanvas" style="width:100%;height:100%;display:block"></canvas>
      </div>
      <div id="pvpBattleLog" style="width:230px;flex-shrink:0;padding:10px 8px;overflow-y:auto;
        background:rgba(0,5,15,0.95);border-left:1px solid rgba(0,212,255,0.08);">
        <div style="color:#6a90b8;font-family:'Orbitron',monospace;letter-spacing:2px;margin-bottom:8px;font-size:0.48rem;text-align:center;opacity:0.7">BATTLE LOG</div>
      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  const canvas = document.getElementById('pvpCanvas');
  _pvpCanvas = canvas;
  _pvpCtx = canvas.getContext('2d');
  _pvpParticles = [];
  _pvpProjectiles = [];
  _pvpFloats = [];
  _pvpTime = 0;
  _pvpStars = [];
  _pvpNebulas = [];

  const resizeCanvas = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width  = Math.floor(rect.width);
    canvas.height = Math.floor(rect.height);
    _pvpStars = [];
    _pvpNebulas = [];
    _pvpLayoutShips(myFleet, oppFleet, canvas.width, canvas.height);
  };

  setTimeout(resizeCanvas, 30);
  window._pvpResizeFn = resizeCanvas;
  window.addEventListener('resize', resizeCanvas);

  _pvpStartRenderLoop();

  _pvpAnimSpeed  = 700;
  _pvpAnimPaused = false;
  window._pvpBattleResult = result;
  window._pvpBattleOpp    = opp;
  playPvpLog(result.log, 0, myFleet, oppFleet);
}

function _pvpLayoutShips(myFleet, oppFleet, W, H) {
  _pvpShipStates = {};
  const placeFleet = (fleet, xCenter, side) => {
    const n = fleet.length;
    const cols = n <= 2 ? 1 : n <= 6 ? 2 : 3;
    const rows = Math.ceil(n / cols);
    const colW = 110, rowH = 100;
    const startX = xCenter - (cols - 1) * colW * 0.5;
    const startY = H * 0.5 - (rows - 1) * rowH * 0.5;
    fleet.forEach((u, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      _pvpShipStates[u.id] = {
        x: startX + col * colW,
        y: startY + row * rowH,
        hp: u.maxHp, maxHp: u.maxHp,
        shield: u.maxShield, maxShield: u.maxShield,
        alive: true,
        shake: 0,
        flashColor: null, flashTime: 0,
        destroyAnim: 1,
        cls: _pvpGetShipClass(u.ship_id),
        name: u.name,
        side,
        engineFlicker: Math.random(),
        bob: Math.random() * Math.PI * 2,
      };
    });
  };
  placeFleet(myFleet,  W * 0.23, 'player');
  placeFleet(oppFleet, W * 0.77, 'enemy');
}

function _pvpStartRenderLoop() {
  if (_pvpRafId) cancelAnimationFrame(_pvpRafId);
  let last = 0;
  const loop = ts => {
    if (!document.getElementById('pvpBattleModal')) { _pvpRafId = null; return; }
    const dt = Math.min((ts - last) / 1000, 0.08);
    last = ts;
    _pvpTime += dt;
    _pvpRender(dt);
    _pvpRafId = requestAnimationFrame(loop);
  };
  _pvpRafId = requestAnimationFrame(loop);
}

function _pvpRender(dt) {
  const cv = _pvpCanvas, ctx = _pvpCtx;
  if (!cv || !ctx || cv.width === 0) return;
  const W = cv.width, H = cv.height;

  // ── Background ──
  const bg = ctx.createRadialGradient(W*0.5, H*0.5, 0, W*0.5, H*0.5, W*0.7);
  bg.addColorStop(0, '#001428');
  bg.addColorStop(1, '#00050e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Stars ──
  if (_pvpStars.length === 0) {
    for (let i = 0; i < 200; i++)
      _pvpStars.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.4+0.2, a: Math.random()*0.8+0.2, twinkle: Math.random()*Math.PI*2 });
  }
  _pvpStars.forEach(s => {
    s.twinkle += dt * (0.5 + Math.random()*0.5);
    const alpha = s.a * (0.7 + 0.3 * Math.sin(s.twinkle));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
    ctx.fill();
  });

  // ── Nebulas ──
  if (_pvpNebulas.length === 0) {
    const cols = ['#0033aa', '#220044', '#003322', '#440011'];
    for (let i = 0; i < 4; i++)
      _pvpNebulas.push({ x: Math.random()*W, y: Math.random()*H, rx: 80+Math.random()*120, ry: 60+Math.random()*80, color: cols[i%cols.length] });
  }
  _pvpNebulas.forEach(n => {
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(n.rx, n.ry));
    g.addColorStop(0, n.color + '22');
    g.addColorStop(1, 'transparent');
    ctx.save();
    ctx.scale(n.rx / Math.max(n.rx, n.ry), n.ry / Math.max(n.rx, n.ry));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(n.x * (Math.max(n.rx,n.ry)/n.rx), n.y * (Math.max(n.rx,n.ry)/n.ry), Math.max(n.rx,n.ry), 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  });

  // ── Center line ──
  const cg = ctx.createLinearGradient(W*0.5, 0, W*0.5, H);
  cg.addColorStop(0, 'transparent');
  cg.addColorStop(0.3, 'rgba(255,255,255,0.06)');
  cg.addColorStop(0.7, 'rgba(255,255,255,0.06)');
  cg.addColorStop(1, 'transparent');
  ctx.strokeStyle = cg;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 10]);
  ctx.beginPath(); ctx.moveTo(W*0.5, 0); ctx.lineTo(W*0.5, H); ctx.stroke();
  ctx.setLineDash([]);

  // ── Projectiles ──
  _pvpProjectiles = _pvpProjectiles.filter(p => p.t < 1);
  _pvpProjectiles.forEach(p => {
    p.t += dt * p.speed;
    const t = Math.min(p.t, 1);
    const cx = p.x1 + (p.x2 - p.x1) * t;
    const cy = p.y1 + (p.y2 - p.y1) * t;

    // Laser beam glow (drawn from origin to current pos)
    ctx.save();
    ctx.shadowBlur = p.isCrit ? 24 : 14;
    ctx.shadowColor = p.color;
    const lg = ctx.createLinearGradient(p.x1, p.y1, cx, cy);
    lg.addColorStop(0, 'transparent');
    lg.addColorStop(0.6, p.color + '88');
    lg.addColorStop(1, p.color);
    ctx.strokeStyle = lg;
    ctx.lineWidth = p.isCrit ? 3.5 : 2;
    ctx.beginPath(); ctx.moveTo(p.x1, p.y1); ctx.lineTo(cx, cy); ctx.stroke();
    ctx.lineWidth = p.isCrit ? 1.5 : 0.8;
    ctx.strokeStyle = '#ffffff99';
    ctx.beginPath(); ctx.moveTo(p.x1, p.y1); ctx.lineTo(cx, cy); ctx.stroke();
    // Head
    ctx.beginPath(); ctx.arc(cx, cy, p.isCrit ? 6 : 4, 0, Math.PI*2);
    ctx.fillStyle = '#ffffff'; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, p.isCrit ? 12 : 7, 0, Math.PI*2);
    ctx.fillStyle = p.color + '66'; ctx.fill();
    ctx.restore();
  });

  // ── Particles ──
  _pvpParticles = _pvpParticles.filter(p => p.life > 0);
  _pvpParticles.forEach(p => {
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.vx *= 0.97; p.vy *= 0.97;
    p.life -= dt;
    const a = Math.max(0, p.life / p.maxLife);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * (p.grow ? 1 + (1-a)*3 : a), 0, Math.PI*2);
    if (p.grow) {
      ctx.fillStyle = p.color + Math.floor((1-a) * 0.5 * 255).toString(16).padStart(2,'0');
    } else {
      ctx.fillStyle = p.color + Math.floor(a * 255).toString(16).padStart(2,'0');
    }
    ctx.fill();
  });

  // ── Ships ──
  for (const id in _pvpShipStates) {
    const s = _pvpShipStates[id];
    if (!s.alive && s.destroyAnim <= 0) continue;

    s.bob += dt * 0.8;
    let dx = 0, dy = Math.sin(s.bob) * 2.5;
    if (s.shake > 0) {
      s.shake -= dt * 10;
      if (s.shake < 0) s.shake = 0;
      dx += (Math.random()-0.5) * s.shake * 14;
      dy += (Math.random()-0.5) * s.shake * 8;
    }

    const x = s.x + dx, y = s.y + dy;
    const alpha = s.alive ? 1 : Math.max(0, s.destroyAnim);
    if (!s.alive) s.destroyAnim -= dt * 1.5;

    // Flash overlay
    let glowOverride = null;
    if (s.flashColor && s.flashTime > 0) {
      s.flashTime -= dt * 4;
      if (s.flashTime < 0) { s.flashTime = 0; s.flashColor = null; }
      else glowOverride = s.flashColor;
    }

    // Engine flicker
    s.engineFlicker += dt * 6;

    // Draw ship
    _pvpDrawShip(ctx, x, y, s.cls, s.side, 1, alpha, glowOverride);

    // HP bar
    const bW = 60, bH = 6, bx = x - bW*0.5, by = y + 44;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath(); ctx.roundRect(bx-1, by-1, bW+2, bH+2, 3); ctx.fill();
    const hpP = s.maxHp > 0 ? Math.max(0, s.hp / s.maxHp) : 0;
    const hpCol = hpP > 0.5 ? '#00ff88' : hpP > 0.25 ? '#ffcc44' : '#ff3355';
    if (hpP > 0) {
      ctx.save();
      ctx.shadowBlur = 6; ctx.shadowColor = hpCol;
      ctx.fillStyle = hpCol;
      ctx.beginPath(); ctx.roundRect(bx, by, bW * hpP, bH, 2); ctx.fill();
      ctx.restore();
    }

    // Shield bar
    if (s.maxShield > 0) {
      const shP = Math.max(0, s.shield / s.maxShield);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.roundRect(bx-1, by+bH+3, bW+2, 4, 2); ctx.fill();
      if (shP > 0) {
        ctx.save();
        ctx.shadowBlur = 8; ctx.shadowColor = '#00aaff';
        ctx.fillStyle = '#00aaff';
        ctx.beginPath(); ctx.roundRect(bx, by+bH+4, bW*shP, 3, 1); ctx.fill();
        ctx.restore();
      }
    }

    // Name label
    ctx.save();
    ctx.globalAlpha = alpha * 0.85;
    ctx.font = '9px "Share Tech Mono", monospace';
    ctx.fillStyle = s.side === 'player' ? '#00d4ff' : '#ff4466';
    ctx.textAlign = 'center';
    ctx.fillText(s.name, x, by + bH + (s.maxShield > 0 ? 18 : 12));
    ctx.restore();
  }

  // ── Floating damage numbers ──
  _pvpFloats = _pvpFloats.filter(f => f.life > 0);
  _pvpFloats.forEach(f => {
    f.y -= 50 * dt;
    f.life -= dt;
    const a = Math.max(0, f.life / f.maxLife);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.shadowBlur = f.isCrit ? 16 : 6;
    ctx.shadowColor = f.isCrit ? '#ff8800' : '#ff3355';
    ctx.font = `bold ${f.isCrit ? 18 : 13}px "Orbitron", monospace`;
    ctx.fillStyle = f.isCrit ? '#ffaa00' : '#ff5566';
    ctx.textAlign = 'center';
    ctx.fillText(f.text, f.x, f.y);
    ctx.restore();
  });
}

function _pvpSpawnExplosion(x, y, isBig) {
  const n = isBig ? 55 : 20;
  const cols = ['#ff6600','#ff3300','#ffcc44','#ffffff','#ff9900','#ffee88'];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const spd = Math.random() * (isBig ? 220 : 120) + 40;
    _pvpParticles.push({
      x, y, vx: Math.cos(a)*spd, vy: Math.sin(a)*spd,
      r: Math.random() * (isBig ? 5 : 3) + 1,
      life: Math.random() * 1.0 + 0.4, maxLife: 1.4,
      color: cols[Math.floor(Math.random() * cols.length)],
    });
  }
  // Shockwave ring
  _pvpParticles.push({
    x, y, vx: 0, vy: 0,
    r: isBig ? 60 : 30,
    life: 0.5, maxLife: 0.5,
    color: '#ff8800', grow: true,
  });
  if (isBig) {
    _pvpParticles.push({
      x, y, vx: 0, vy: 0,
      r: 80,
      life: 0.4, maxLife: 0.4,
      color: '#ffffff', grow: true,
    });
  }
}

function _pvpSpawnHitSparks(x, y, color) {
  for (let i = 0; i < 12; i++) {
    const a = Math.random() * Math.PI * 2;
    const spd = Math.random() * 120 + 30;
    _pvpParticles.push({
      x, y, vx: Math.cos(a)*spd, vy: Math.sin(a)*spd,
      r: Math.random() * 2.5 + 0.5,
      life: 0.35 + Math.random()*0.2, maxLife: 0.55,
      color,
    });
  }
}

function addPvpLog(msg, type) {
  const el = document.getElementById('pvpBattleLog');
  if (!el) return;
  const color = type === 'round' ? '#ffcc44' : type === 'destroy' ? '#ff3355' : type === 'miss' ? '#6a90b8' : type === 'effect' ? '#aa44ff' : type === 'info' ? '#00ff88' : '#b0cce8';
  const div = document.createElement('div');
  div.style.cssText = `font-size:0.52rem;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.03);color:${color}`;
  div.textContent = msg;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function playPvpLog(log, idx, myFleet, oppFleet) {
  if (!document.getElementById('pvpBattleModal')) return;
  if (idx >= log.length) {
    setTimeout(finishPvpBattle, 800);
    return;
  }

  if (_pvpAnimPaused) {
    setTimeout(() => playPvpLog(log, idx, myFleet, oppFleet), 100);
    return;
  }

  const entry = log[idx];

  if (entry.type === 'round') {
    const lbl = document.getElementById('pvpRoundLabel');
    if (lbl) lbl.textContent = 'RUNDA ' + entry.msg.replace(/━/g, '').trim().split(' ')[1];
  }

  addPvpLog(entry.msg, entry.type);

  if (entry.type === 'attack') {
    const att = _pvpShipStates[entry.attackerId];
    const tgt = _pvpShipStates[entry.targetId];
    if (att && tgt) {
      // Projectile
      _pvpProjectiles.push({
        x1: att.x, y1: att.y,
        x2: tgt.x, y2: tgt.y,
        t: 0, speed: 2.5,
        color: entry.isCrit ? '#ff6600' : (att.side === 'player' ? '#00d4ff' : '#ff3355'),
        isCrit: entry.isCrit,
      });

      // Hit effects after projectile arrives
      const delay = 400;
      setTimeout(() => {
        if (!_pvpShipStates[entry.targetId]) return;
        const t2 = _pvpShipStates[entry.targetId];
        t2.hp     = entry.hpAfter;
        t2.shield = entry.shieldAfter;
        t2.shake  = 1;
        t2.shakeTime = 1;
        t2.flashColor = entry.isCrit ? '#ff6600' : '#ff3355';
        t2.flashTime  = 1;
        _pvpSpawnHitSparks(t2.x, t2.y, entry.isCrit ? '#ff6600' : '#ffffff');

        // Flash attacker
        const a2 = _pvpShipStates[entry.attackerId];
        if (a2) { a2.flashColor = entry.isCrit ? '#ffcc44' : '#00d4ff'; a2.flashTime = 0.5; }

        // Floating damage
        _pvpFloats.push({
          x: t2.x + (Math.random() - 0.5) * 20,
          y: t2.y - 20,
          text: '-' + fmt(entry.damage) + (entry.isCrit ? '!' : ''),
          isCrit: entry.isCrit,
          life: 1.0, maxLife: 1.0,
        });
      }, delay);
    }
  }

  if (entry.type === 'destroy') {
    const s = _pvpShipStates[entry.targetId];
    if (s) {
      setTimeout(() => {
        s.alive = false;
        s.destroyAnim = 1.0;
        _pvpSpawnExplosion(s.x, s.y, true);
      }, 300);
    }
  }

  if (entry.type === 'effect' && entry.targetId) {
    const s = _pvpShipStates[entry.targetId];
    if (s && s.alive) {
      s.flashColor = '#00aaff'; s.flashTime = 0.6;
      // Update shield if regen
      const shieldMatch = entry.msg.match(/\+([0-9,]+) shield/);
      if (shieldMatch) {
        const reg = parseInt(shieldMatch[1].replace(',', ''));
        s.shield = Math.min(s.maxShield, s.shield + reg);
      }
    }
  }

  _pvpAnimTimer = setTimeout(() => playPvpLog(log, idx + 1, myFleet, oppFleet), _pvpAnimSpeed);
}

function finishPvpBattle() {
  const result = window._pvpBattleResult;
  const opp    = window._pvpBattleOpp;
  if (!result || !opp) return;

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

  const modal = document.getElementById('pvpBattleModal');
  if (!modal) return;

  const statusColor = isVictory ? '#00ff88' : result.status === 'draw' ? '#ffcc44' : '#ff3355';
  const statusText  = isVictory ? '🏆 POBJEDA!' : result.status === 'draw' ? '⚖️ NERIJEŠENO' : '💀 PORAZ';

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:absolute;inset:0;z-index:20;background:rgba(0,5,15,0.88);
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
  `;
  overlay.innerHTML = `
    <div style="font-size:2.2rem;font-family:'Orbitron',monospace;font-weight:900;color:${statusColor};text-shadow:0 0 30px ${statusColor}">${statusText}</div>
    <div style="font-size:0.8rem;color:#6a90b8">${result.round} rundi · Rating: <span style="color:${ratingChange >= 0 ? '#00ff88' : '#ff3355'}">${ratingChange >= 0 ? '+' : ''}${ratingChange}</span></div>
    ${isVictory ? `<div style="font-size:0.75rem;color:#00ff88">🔩 ${fmt(loot.metal)} · 💎 ${fmt(loot.crystal)} · ⛽ ${fmt(loot.he3)}</div>` : ''}
    <button onclick="closePvpBattleModal()" style="margin-top:8px;padding:10px 32px;font-family:'Orbitron',monospace;font-size:0.75rem;background:linear-gradient(135deg,rgba(0,212,255,0.2),rgba(0,212,255,0.05));border:1px solid #00d4ff;color:#00d4ff;border-radius:6px;cursor:pointer;letter-spacing:1px">ZATVORI</button>
  `;
  modal.style.position = 'relative';
  modal.appendChild(overlay);
}

function closePvpBattleModal() {
  if (_pvpAnimTimer) clearTimeout(_pvpAnimTimer);
  if (_pvpRafId) { cancelAnimationFrame(_pvpRafId); _pvpRafId = null; }
  if (window._pvpResizeFn) { window.removeEventListener('resize', window._pvpResizeFn); window._pvpResizeFn = null; }
  _pvpParticles = []; _pvpProjectiles = []; _pvpFloats = []; _pvpShipStates = {};
  const el = document.getElementById('pvpBattleModal');
  if (el) el.remove();
  renderPvp();
}

function togglePvpPause() {
  _pvpAnimPaused = !_pvpAnimPaused;
  const btn = document.getElementById('pvpPauseBtn');
  if (btn) btn.textContent = _pvpAnimPaused ? '▶' : '⏸';
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
