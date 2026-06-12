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

const SHIP_EMOJIS = {
  fighter:    '🚀',
  scout:      '🛸',
  cruiser:    '🛡️',
  battleship: '⚔️',
  carrier:    '🛳️',
  special:    '💫',
};

function _pvpGetEmoji(shipId) {
  const cls = (shipId || '').split('_')[0];
  return SHIP_EMOJIS[cls] || '🚀';
}

function openPvpBattleVisual(myFleet, oppFleet, opp) {
  const result = simulatePvpBattle(myFleet, oppFleet);

  // Modal
  const modalEl = document.createElement('div');
  modalEl.id = 'pvpBattleModal';
  modalEl.style.cssText = `
    position:fixed;inset:0;z-index:9999;background:#000a14;
    display:flex;flex-direction:column;overflow:hidden;
    font-family:'Share Tech Mono',monospace;
  `;

  modalEl.innerHTML = `
    <div id="pvpHeader" style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;border-bottom:1px solid rgba(0,212,255,0.15);flex-shrink:0;z-index:2">
      <div style="font-family:'Orbitron',monospace;font-size:0.8rem;color:#00d4ff">⚔️ PvP BITKA</div>
      <div style="display:flex;gap:6px;align-items:center">
        <span id="pvpRoundLabel" style="font-size:0.7rem;color:#ffcc44;font-family:'Orbitron',monospace">●</span>
        <button onclick="togglePvpPause()" id="pvpPauseBtn" style="font-size:0.6rem;padding:3px 10px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);color:#00d4ff;border-radius:4px;cursor:pointer">⏸</button>
        <button onclick="setPvpSpeed(400)" style="font-size:0.6rem;padding:3px 9px;background:rgba(255,204,68,0.1);border:1px solid rgba(255,204,68,0.3);color:#ffcc44;border-radius:4px;cursor:pointer">2×</button>
        <button onclick="setPvpSpeed(150)" style="font-size:0.6rem;padding:3px 9px;background:rgba(255,204,68,0.1);border:1px solid rgba(255,204,68,0.3);color:#ffcc44;border-radius:4px;cursor:pointer">5×</button>
        <button onclick="skipPvpAnim()" style="font-size:0.6rem;padding:3px 9px;background:rgba(255,51,85,0.1);border:1px solid rgba(255,51,85,0.3);color:#ff3355;border-radius:4px;cursor:pointer">⏭</button>
      </div>
    </div>
    <div style="flex:1;display:flex;overflow:hidden">
      <!-- Canvas arena -->
      <div style="flex:1;position:relative;overflow:hidden">
        <canvas id="pvpCanvas" style="width:100%;height:100%;display:block"></canvas>
      </div>
      <!-- Battle log -->
      <div id="pvpBattleLog" style="width:240px;flex-shrink:0;padding:8px;overflow-y:auto;border-left:1px solid rgba(255,255,255,0.05);font-size:0.52rem;">
        <div style="color:#6a90b8;font-family:'Orbitron',monospace;letter-spacing:1px;margin-bottom:6px;font-size:0.5rem;text-align:center">LOG</div>
      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  // Init canvas
  const canvas = document.getElementById('pvpCanvas');
  _pvpCanvas = canvas;
  _pvpCtx = canvas.getContext('2d');
  _pvpParticles = [];
  _pvpProjectiles = [];
  _pvpFloats = [];

  const resizeCanvas = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width  = rect.width;
    canvas.height = rect.height;
    _pvpLayoutShips(myFleet, oppFleet, canvas.width, canvas.height);
  };

  // Layout brodova na canvasu
  _pvpLayoutShips(myFleet, oppFleet, canvas.offsetWidth || 600, canvas.offsetHeight || 400);

  setTimeout(resizeCanvas, 50);
  window._pvpResizeFn = resizeCanvas;
  window.addEventListener('resize', resizeCanvas);

  // Start render loop
  _pvpStartRenderLoop();

  // Start log playback
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
    const colW = 90, rowH = 80;
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const startX = xCenter - (cols - 1) * colW * 0.5;
    const startY = H * 0.5 - (rows - 1) * rowH * 0.5;

    fleet.forEach((u, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      _pvpShipStates[u.id] = {
        x: startX + col * colW,
        y: startY + row * rowH,
        baseX: startX + col * colW,
        baseY: startY + row * rowH,
        hp: u.maxHp, maxHp: u.maxHp,
        shield: u.maxShield, maxShield: u.maxShield,
        alive: true,
        shake: 0, shakeTime: 0,
        flashColor: null, flashTime: 0,
        destroyAnim: 0,
        emoji: _pvpGetEmoji(u.ship_id),
        name: u.name,
        side,
      };
    });
  };

  placeFleet(myFleet,   W * 0.22, 'player');
  placeFleet(oppFleet,  W * 0.78, 'enemy');
}

function _pvpStartRenderLoop() {
  if (_pvpRafId) cancelAnimationFrame(_pvpRafId);
  let last = 0;
  const loop = (ts) => {
    if (!document.getElementById('pvpBattleModal')) {
      _pvpRafId = null;
      return;
    }
    const dt = Math.min((ts - last) / 1000, 0.1);
    last = ts;
    _pvpRender(dt);
    _pvpRafId = requestAnimationFrame(loop);
  };
  _pvpRafId = requestAnimationFrame(loop);
}

function _pvpRender(dt) {
  const cv = _pvpCanvas;
  const ctx = _pvpCtx;
  if (!cv || !ctx) return;
  const W = cv.width, H = cv.height;

  // Background — deep space
  ctx.fillStyle = '#000a14';
  ctx.fillRect(0, 0, W, H);

  // Stars
  if (!_pvpStars || _pvpStars.length === 0 || _pvpStars._W !== W) {
    _pvpStars = [];
    _pvpStars._W = W;
    for (let i = 0; i < 120; i++) {
      _pvpStars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.2 + 0.2, a: Math.random() * 0.7 + 0.3 });
    }
  }
  _pvpStars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.a})`;
    ctx.fill();
  });

  // Center divider
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(W * 0.5, 20);
  ctx.lineTo(W * 0.5, H - 20);
  ctx.stroke();
  ctx.setLineDash([]);

  // Update + draw projectiles
  _pvpProjectiles = _pvpProjectiles.filter(p => p.t < 1);
  _pvpProjectiles.forEach(p => {
    p.t += dt * p.speed;
    if (p.t > 1) p.t = 1;
    const x = p.x1 + (p.x2 - p.x1) * p.t;
    const y = p.y1 + (p.y2 - p.y1) * p.t;

    // Trail
    const grad = ctx.createLinearGradient(p.x1, p.y1, x, y);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, p.color + 'cc');
    ctx.strokeStyle = grad;
    ctx.lineWidth = p.isCrit ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(p.x1, p.y1);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Head glow
    ctx.beginPath();
    ctx.arc(x, y, p.isCrit ? 5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, p.isCrit ? 9 : 5, 0, Math.PI * 2);
    ctx.fillStyle = p.color + '44';
    ctx.fill();
  });

  // Update + draw particles
  _pvpParticles = _pvpParticles.filter(p => p.life > 0);
  _pvpParticles.forEach(p => {
    p.x  += p.vx * dt;
    p.y  += p.vy * dt;
    p.vy += 30 * dt;
    p.life -= dt;
    const a = Math.max(0, p.life / p.maxLife);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * a, 0, Math.PI * 2);
    ctx.fillStyle = p.color + Math.floor(a * 255).toString(16).padStart(2,'0');
    ctx.fill();
  });

  // Draw ships
  ctx.font = '28px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const id in _pvpShipStates) {
    const s = _pvpShipStates[id];
    if (!s.alive && s.destroyAnim <= 0) continue;

    // Shake
    let dx = 0, dy = 0;
    if (s.shake > 0) {
      s.shake -= dt * 8;
      if (s.shake < 0) s.shake = 0;
      dx = (Math.random() - 0.5) * s.shake * 12;
      dy = (Math.random() - 0.5) * s.shake * 12;
    }
    const x = s.x + dx;
    const y = s.y + dy;

    const alpha = s.alive ? 1.0 : Math.max(0, s.destroyAnim);
    if (!s.alive) s.destroyAnim -= dt * 2;

    ctx.globalAlpha = alpha;

    // Flash glow
    if (s.flashColor && s.flashTime > 0) {
      s.flashTime -= dt * 3;
      if (s.flashTime < 0) { s.flashTime = 0; s.flashColor = null; }
      if (s.flashColor) {
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fillStyle = s.flashColor + Math.floor(s.flashTime * 0.6 * 255).toString(16).padStart(2,'0');
        ctx.fill();
      }
    }

    // Side color ring
    const ringColor = s.side === 'player' ? '#00d4ff' : '#ff3355';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.strokeStyle = ringColor + '66';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Ship emoji
    ctx.fillStyle = 'white';
    ctx.fillText(s.emoji, x, y);

    // HP bar (below ship)
    const barW = 52, barH = 5;
    const bx = x - barW * 0.5;
    const by = y + 30;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(bx, by, barW, barH);
    const hpPct = s.maxHp > 0 ? Math.max(0, s.hp / s.maxHp) : 0;
    const hpColor = hpPct > 0.5 ? '#00ff88' : hpPct > 0.25 ? '#ffcc44' : '#ff3355';
    ctx.fillStyle = hpColor;
    ctx.fillRect(bx, by, barW * hpPct, barH);

    // Shield bar
    if (s.maxShield > 0) {
      const shPct = Math.max(0, s.shield / s.maxShield);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(bx, by + barH + 2, barW, 3);
      ctx.fillStyle = '#00aaff';
      ctx.fillRect(bx, by + barH + 2, barW * shPct, 3);
    }

    // Name
    ctx.font = '9px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(176,204,232,0.8)';
    ctx.fillText(s.name, x, by + barH + 8 + (s.maxShield > 0 ? 3 : 0));

    ctx.globalAlpha = 1;
  }

  // Floating damage numbers
  _pvpFloats = _pvpFloats.filter(f => f.life > 0);
  _pvpFloats.forEach(f => {
    f.y -= 40 * dt;
    f.life -= dt;
    const a = Math.max(0, f.life / f.maxLife);
    ctx.globalAlpha = a;
    ctx.font = `bold ${f.isCrit ? 16 : 12}px "Orbitron", monospace`;
    ctx.fillStyle = f.isCrit ? '#ff6600' : '#ff3355';
    ctx.textAlign = 'center';
    ctx.fillText(f.text, f.x, f.y);
    ctx.globalAlpha = 1;
  });

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function _pvpSpawnExplosion(x, y, isBig) {
  const count = isBig ? 40 : 16;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (isBig ? 180 : 100) + 30;
    const colors = ['#ff6600', '#ff3300', '#ffcc44', '#ffffff', '#ff9900'];
    _pvpParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: Math.random() * (isBig ? 5 : 3) + 1,
      life: Math.random() * 0.8 + 0.3,
      maxLife: 1.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function _pvpSpawnHitSparks(x, y, color) {
  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 80 + 20;
    _pvpParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: Math.random() * 2 + 0.5,
      life: 0.3 + Math.random() * 0.2,
      maxLife: 0.5,
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
