// ============================================================
// HIVE GALAXY — js/ui/battle-anim.js  (ENHANCED VISUALS v2)
// ============================================================

function getShipImageName(shipId) {
  if (!shipId) return null;
  const parts = shipId.split('_');
  if (parts.length < 2) return null;
  const namePart = parts[1].toLowerCase();
  const variantPart = parts[parts.length - 1];
  const variantNum = variantPart === 'I' ? '1' : variantPart === 'II' ? '2' : variantPart === 'III' ? '3' : '1';
  return `${namePart}${variantNum}`;
}

function getShipImageSrc(shipId) {
  const name = getShipImageName(shipId);
  if (!name) return null;
  return `img/${name}.png`;
}

window._battleAnim = {
  battle: null, logIndex: 0, timer: null, speed: 180, paused: false, done: false, onFinish: null,
  hpState: {}, shldState: {}, aliveState: {}
};

function updateShipCounters() {
  const anim = window._battleAnim;
  if (!anim || !anim.battle) return;
  const playerAlive = anim.battle.player.filter(u => anim.aliveState[u.id]).length;
  const enemyAlive = anim.battle.enemy.filter(u => anim.aliveState[u.id]).length;
  const totalPlayer = anim.battle.player.length;
  const totalEnemy = anim.battle.enemy.length;
  const destroyed = (totalPlayer - playerAlive) + (totalEnemy - enemyAlive);
  const pEl = document.getElementById('battleAlivePlayer');
  const eEl = document.getElementById('battleAliveEnemy');
  const dEl = document.getElementById('battleDestroyedCount');
  const tpEl = document.getElementById('battleTotalPlayer');
  const teEl = document.getElementById('battleTotalEnemy');
  if (pEl) pEl.innerText = playerAlive;
  if (eEl) eEl.innerText = enemyAlive;
  if (dEl) dEl.innerText = destroyed;
  if (tpEl) tpEl.innerText = totalPlayer;
  if (teEl) teEl.innerText = totalEnemy;
}

/* ── FX state ── */
let beams = [], impacts = [], particles = [], shockwaves = [], muzzleFlashes = [];
let ctxFX = null, fxCanvas = null, glassPanel = null, dmgLayer = null;

/* ── Damage type → boja (po tipu oružja) ── */
const DMG_TYPE_COLORS = {
  Kinetic:   '#dfe9f7', // metalno-bela (projektili)
  Heat:      '#ff7a2c', // narandžasto-crvena (toplotno)
  Magnetic:  '#36d6ff', // cijan/plava (magnetno)
  Explosive: '#ffd23a', // amber/zlatna (eksplozivno)
};
const DMG_TYPE_SHORT = { Kinetic: 'KIN', Heat: 'HEAT', Magnetic: 'MAG', Explosive: 'EXP' };
function dmgTypeColor(t) { return DMG_TYPE_COLORS[t] || '#dfe9f7'; }

/* Odredi tip štete napadača iz njegovih oružja (fallback ako log nema dmgType) */
function deriveDmgType(attackerId) {
  const anim = window._battleAnim;
  const u = anim && anim.battle && anim.battle.shipsById ? anim.battle.shipsById[attackerId] : null;
  if (!u || !u.slot || typeof getWeaponById !== 'function') return null;
  for (const w of ['weapon_1', 'weapon_2', 'weapon_3', 'weapon_4']) {
    const wid = u.slot[w];
    if (wid) { const wpn = getWeaponById(wid); if (wpn && wpn.dmgType) return wpn.dmgType; }
  }
  return null;
}
let fxW = 0, fxH = 0, dpr = 1;
let lastTimestamp = 0;
let animFrameId = null;
let screenShake = { x: 0, y: 0, t: 0, dur: 0, mag: 0, decay: 0.92 };

function addShake(mag, dur) {
  screenShake.mag = Math.max(screenShake.mag, mag);
  screenShake.dur = Math.max(screenShake.dur, dur);
  screenShake.t = 0;
}

/* ── Battle start ── */
function startBattleAnim(battle, onFinish) {
  const anim = window._battleAnim;
  anim.battle = battle;
  anim.logIndex = 0;
  anim.paused = false;
  anim.done = false;
  anim.onFinish = onFinish || null;
  anim.hpState = {};
  anim.shldState = {};
  anim.aliveState = {};
  [...battle.player, ...battle.enemy].forEach(u => {
    anim.hpState[u.id] = u.maxHp;
    anim.shldState[u.id] = u.maxShield || 0;
    anim.aliveState[u.id] = true;
  });
  const logLen = battle.log.length;
  anim.speed = logLen > 200 ? 80 : logLen > 100 ? 120 : 180;
  openBattleAnimModal(battle);
  scheduleTick();
}

function scheduleTick() {
  const anim = window._battleAnim;
  if (anim.timer) clearTimeout(anim.timer);
  if (anim.speed <= 0) anim.speed = 180;
  anim.timer = setTimeout(battleAnimTick, anim.speed);
}

// Razreši koji brod je uništen iz log unosa. Pravi combat log za 'destroy'
// unose šalje samo poruku (bez target id-a), pa ime izvlačimo iz poruke
// i mapiramo na još uvijek živ brod s tim imenom (najoštećeniji ako ih je više).
function resolveDestroyId(entry) {
  const anim = window._battleAnim;
  if (!anim || !anim.battle) return null;
  if (entry.target && anim.battle.shipsById[entry.target]) return entry.target;
  const m = entry.msg && entry.msg.match(/💀\s*(.+?)\s+UNIŠTEN/);
  if (!m) return null;
  const name = m[1].trim();
  const candidates = [...anim.battle.player, ...anim.battle.enemy]
    .filter(u => u.name === name && anim.aliveState[u.id] !== false);
  if (!candidates.length) return null;
  candidates.sort((a, b) => (anim.hpState[a.id] ?? a.hp) - (anim.hpState[b.id] ?? b.hp));
  return candidates[0].id;
}

function battleAnimTick() {
  const anim = window._battleAnim;
  if (!anim.battle || anim.paused || anim.done) return;
  const log = anim.battle.log;
  if (anim.logIndex >= log.length) { finishBattleAnim(); return; }
  const entry = log[anim.logIndex];
  anim.logIndex++;
  if (entry.type === 'attack' && entry.target) {
    const dmg = entry.dmg || 0;
    anim.hpState[entry.target] = Math.max(0, (anim.hpState[entry.target] || 0) - dmg);
    if (entry.shieldDmg) anim.shldState[entry.target] = Math.max(0, (anim.shldState[entry.target] || 0) - entry.shieldDmg);
    const dmgType = entry.dmgType || deriveDmgType(entry.attacker) || 'Kinetic';
    const isCrit = entry.isCrit != null ? !!entry.isCrit : /RIT/.test(entry.msg || '');
    animAttackFlash(entry.attacker, entry.target, dmg, entry.shieldDmg > 0, dmgType, isCrit);
  }
  if (entry.type === 'destroy') {
    const destroyId = resolveDestroyId(entry);
    if (destroyId && anim.aliveState[destroyId] !== false) {
      anim.aliveState[destroyId] = false;
      animDestroyEffect(destroyId);
    }
  }
  appendAnimEntry(entry);
  updateBattlefield();
  updateAnimProgress(anim.logIndex, log.length);
  updateShipCounters();
  scheduleTick();
}

function finishBattleAnim() {
  const anim = window._battleAnim;
  anim.done = true;
  if (anim.timer) clearTimeout(anim.timer);
  const finEl = document.getElementById('battleAnimFinish');
  if (finEl) finEl.style.display = 'flex';
}

/* ── Modal ── */
function openBattleAnimModal(battle) {
  const isVictory = battle.status === 'victory';
  const isDraw = battle.status === 'draw';
  const statusColor = isVictory ? '#00ff88' : isDraw ? '#ffcc44' : '#ff3355';
  const statusIcon = isVictory ? '🏆' : isDraw ? '⚖️' : '💀';
  const body = `
    <style>
      @keyframes grainAnim { to { transform: translate(-3%, 2%); } }
      @keyframes victoryGlowBattle { 0%,100% { text-shadow: 0 0 10px var(--vc); } 50% { text-shadow: 0 0 35px var(--vc); } }
      @keyframes dmgFloat { 0%{opacity:1;transform:translate(-50%,-50%) scale(.7)}30%{opacity:1;transform:translate(-50%,-80%) scale(1.2)}70%{opacity:1;transform:translate(-50%,-110%) scale(1.05)}100%{opacity:0;transform:translate(-50%,-140%) scale(.9)} }
      @keyframes dmgFloatCrit { 0%{opacity:1;transform:translate(-50%,-50%) scale(.5)}20%{transform:translate(-50%,-70%) scale(1.5)}50%{opacity:1;transform:translate(-50%,-100%) scale(1.15)}100%{opacity:0;transform:translate(-50%,-160%) scale(.8)} }
      @keyframes shake { 0%,100%{transform:translate(0)}10%{transform:translate(-5px,3px)}20%{transform:translate(4px,-4px)}30%{transform:translate(-4px,2px)}40%{transform:translate(3px,-2px)}50%{transform:translate(-2px,3px)}60%{transform:translate(3px,1px)}70%{transform:translate(-2px,-2px)}80%{transform:translate(1px,2px)} }
      @keyframes logIn { to { opacity:1; } }
      @keyframes twinkle { 0%,100%{opacity:var(--base-o)}50%{opacity:1} }
      @keyframes nebulaDrift { 0%{transform:translate(0,0) scale(1)}50%{transform:translate(8px,-6px) scale(1.05)}100%{transform:translate(0,0) scale(1)} }
      @keyframes holoBorder { 0%{border-color:rgba(0,212,255,.28)}50%{border-color:rgba(123,97,255,.5)}100%{border-color:rgba(0,212,255,.28)} }
      @keyframes holoBorderEnemy { 0%{border-color:rgba(255,51,85,.28)}50%{border-color:rgba(255,136,68,.5)}100%{border-color:rgba(255,51,85,.28)} }
      @keyframes enginePulse { 0%,100%{opacity:.6;transform:translateX(-50%) scale(.85)}50%{opacity:1;transform:translateX(-50%) scale(1.2)} }
      @keyframes floatShip { 0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)} }
      @keyframes barPulse { 0%,100%{box-shadow:inset 0 0 8px rgba(45,254,154,.2)}50%{box-shadow:inset 0 0 14px rgba(45,254,154,.5)} }
      @keyframes shieldShimmer { 0%{background-position:-200% center}100%{background-position:200% center} }
      .grain-overlay { position:fixed; inset:0; pointer-events:none; opacity:0.04; mix-blend-mode:screen; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); animation:grainAnim .4s steps(2) infinite; z-index:100; }
      .flash-overlay { position:fixed; inset:0; pointer-events:none; background:radial-gradient(circle at 50% 40%,rgba(255,255,255,.35),transparent 60%); opacity:0; transition:opacity .12s; z-index:90; mix-blend-mode:screen; }
      .flash-overlay.active { opacity:1; }
      .aberration { filter: hue-rotate(8deg) saturate(1.5) contrast(1.15); transition:filter 0.12s; }
      .dmg-layer { position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:40; }
      .damage-float { position:absolute; font-family:Orbitron,sans-serif; font-weight:800; font-size:15px; pointer-events:none; transform:translate(-50%,-50%); -webkit-text-stroke:1.2px rgba(0,0,0,.92); paint-order:stroke fill; text-shadow:0 0 6px currentColor,0 1px 3px rgba(0,0,0,.95); animation:dmgFloat 0.95s cubic-bezier(.15,.8,.2,1) forwards; z-index:40; letter-spacing:.5px; white-space:nowrap; }
      .damage-float .dt { font-size:8px; font-weight:700; opacity:.85; margin-left:3px; letter-spacing:.5px; -webkit-text-stroke:.8px rgba(0,0,0,.85); }
      .damage-float.crit { font-size:21px; font-weight:900; animation:dmgFloatCrit 1.05s cubic-bezier(.15,.8,.2,1) forwards; }
      .damage-float.shield { opacity:.95; }
      .log-entry { opacity:0; animation:logIn 0.25s forwards; }
      .shake { animation:shake 0.55s; }
      .pill { background:rgba(8,16,28,.85); border:1px solid rgba(0,212,255,.3); color:#bfefff; padding:8px 16px; border-radius:999px; font-family:'Share Tech Mono',monospace; font-size:12px; cursor:pointer; transition:.2s; backdrop-filter:blur(8px); text-transform:uppercase; letter-spacing:1px; }
      .pill:hover { box-shadow:0 0 18px rgba(0,212,255,.6),inset 0 0 12px rgba(0,212,255,.15); transform:translateY(-2px); border-color:#00d4ff; color:#ffffff; }
      .pill:active { transform:translateY(0); }
      .progress { height:8px; background:rgba(255,255,255,.06); border-radius:6px; overflow:hidden; border:1px solid rgba(0,212,255,.25); box-shadow:inset 0 0 12px rgba(0,212,255,.15); }
      .progress-fill { height:100%; width:0%; background:linear-gradient(90deg,#00d4ff,#7b61ff,#ff61d4); background-size:200% 100%; box-shadow:0 0 22px #00d4ff,0 0 6px #7b61ff; transition:width .3s; animation:shieldShimmer 3s linear infinite; }
      .log-panel { position:relative; background:linear-gradient(to top,rgba(2,4,10,.96),rgba(2,4,10,.88)); border-top:1px solid rgba(0,212,255,.22); border-radius:16px; margin-top:8px; overflow:hidden; }
      .log-header { padding:7px 16px; font-family:Orbitron,sans-serif; font-size:11px; letter-spacing:1.5px; color:#7dd3fc; border-bottom:1px solid rgba(255,255,255,.06); display:flex; justify-content:space-between; opacity:.9; }
      .log-header .live-dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:#00ff88; margin-right:6px; animation:twinkle 1.2s infinite; --base-o:.4; }
      #battleAnimLog { height:130px; overflow:hidden; padding:8px 16px; font-size:12.5px; line-height:19px; font-family:'Share Tech Mono',monospace; display:block; }
      #battleAnimLog .log-entry { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; height:19px; }
      .fleets { position:relative; display:flex; justify-content:space-between; gap:16px; }
      .fleet { width:46%; display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(3,1fr); gap:6px; }
      .fleet.enemy { direction:rtl; }
      .fleet.enemy .ship { direction:ltr; }
      .ship { position:relative; background:linear-gradient(180deg,rgba(14,22,42,.92),rgba(6,10,20,.75)); border:1.5px solid rgba(255,255,255,.08); border-radius:12px; padding:6px 6px 8px; backdrop-filter:blur(8px); transition:transform .3s cubic-bezier(.2,.8,.2,1),border-color .3s,box-shadow .3s; animation:floatShip 3.6s ease-in-out infinite; overflow:hidden; }
      .ship-placeholder { background:transparent; border:1px dashed rgba(255,255,255,.07); border-radius:12px; min-height:90px; }
      .ship::before { content:''; position:absolute; inset:0; border-radius:18px; background:linear-gradient(135deg,rgba(0,212,255,.06),transparent 40%,rgba(123,97,255,.04)); pointer-events:none; }
      .player .ship { border-color:rgba(0,212,255,.28); box-shadow:inset 0 0 24px rgba(0,212,255,.07),0 0 18px rgba(0,212,255,.1),0 4px 20px rgba(0,0,0,.4); animation:floatShip 3.6s ease-in-out infinite, holoBorder 4s ease infinite; }
      .enemy .ship { border-color:rgba(255,51,85,.28); box-shadow:inset 0 0 24px rgba(255,51,85,.07),0 0 18px rgba(255,51,85,.1),0 4px 20px rgba(0,0,0,.4); animation:floatShip 3.6s ease-in-out infinite, holoBorderEnemy 4s ease infinite; }
      .ship:hover { transform:translateY(-6px) scale(1.04); border-color:#00d4ff; box-shadow:0 0 30px rgba(0,212,255,.4),inset 0 0 20px rgba(0,212,255,.15); }
      .enemy .ship:hover { border-color:#ff3355; box-shadow:0 0 30px rgba(255,51,85,.4),inset 0 0 20px rgba(255,51,85,.15); }
      .ship.destroyed { opacity:.2; filter:grayscale(1) brightness(.4); transform:scale(.85); pointer-events:none; }
      .ship.destroyed::after { content:'✖'; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:28px; color:rgba(255,51,85,.6); text-shadow:0 0 20px rgba(255,51,85,.5); }
      .fleet.victory .ship:not(.destroyed) { animation:floatShip 3.6s ease-in-out infinite, victoryGlowBattle 1.8s infinite; }
      .player.victory .ship:not(.destroyed) { box-shadow:0 0 40px rgba(0,255,136,.4),inset 0 0 20px rgba(0,255,136,.15); }
      .enemy.victory .ship:not(.destroyed) { box-shadow:0 0 40px rgba(255,51,85,.4),inset 0 0 20px rgba(255,51,85,.15); }
      .ship-inner { position:relative; z-index:2; }
      .ship-image { display:flex; justify-content:center; align-items:center; height:38px; margin-bottom:4px; }
      .engine-glow { position:absolute; bottom:26px; left:50%; transform:translateX(-50%); width:52px; height:18px; border-radius:50%; background:radial-gradient(ellipse,currentColor,transparent 60%); filter:blur(8px); opacity:.85; animation:enginePulse 1.7s ease-in-out infinite; }
      .ship-name { font-family:Orbitron,sans-serif; font-size:8px; text-align:center; letter-spacing:1px; opacity:.85; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-transform:uppercase; }
      .bars { display:flex; flex-direction:column; gap:5px; }
      .bar { height:7px; background:rgba(0,0,0,.7); border-radius:4px; overflow:hidden; border:1px solid rgba(255,255,255,.06); position:relative; }
      .bar i { display:block; height:100%; width:100%; transition:width .5s cubic-bezier(.2,.8,.2,1); }
      .bar.hp i { background:linear-gradient(90deg,#ff1a40,#ffcc44 45%,#2dfe9a); box-shadow:inset 0 0 10px rgba(45,254,154,.3); animation:barPulse 2s ease infinite; }
      .bar.shield i { background:linear-gradient(90deg,#00d4ff,#7b61ff,#00d4ff); background-size:200% 100%; box-shadow:inset 0 0 12px rgba(0,212,255,.5); animation:shieldShimmer 2s linear infinite; position:relative; overflow:hidden; }
      .nebula { position:absolute; border-radius:50%; filter:blur(40px); opacity:.12; pointer-events:none; mix-blend-mode:screen; animation:nebulaDrift 18s ease-in-out infinite; }
      .vignette { position:absolute; inset:0; pointer-events:none; border-radius:28px; background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,.6) 100%); z-index:1; }
      #battleAnimFinish {
        position: sticky; bottom: 12px;
        background: rgba(2, 4, 10, 0.92); backdrop-filter: blur(24px);
        border-radius: 40px; padding: 14px 24px; margin-top: 20px; z-index: 55;
        display: flex; flex-direction: row; justify-content: space-between; gap: 24px;
        border: 1px solid rgba(0, 212, 255, 0.3);
        box-shadow: 0 0 40px rgba(0,212,255,.15);
      }
    </style>
    <div class="grain-overlay"></div>
    <div class="flash-overlay" id="flashOverlay"></div>
    <div id="battlefieldWrap" style="background: radial-gradient(ellipse at 30% 20%, rgba(20,40,80,.3), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(60,20,80,.2), transparent 50%), radial-gradient(ellipse at center, #0a0f1e 0%, #020408 100%); border:1.5px solid rgba(0,212,255,0.25); border-radius:28px; padding:20px; margin-bottom:16px; position:relative; overflow:hidden; box-shadow:0 0 100px rgba(0,212,255,0.12), 0 0 40px rgba(123,97,255,0.08), inset 0 0 60px rgba(123,97,255,0.06);">
      <div class="vignette"></div>
      <div class="nebula" style="width:200px;height:200px;background:radial-gradient(circle,rgba(0,212,255,.4),transparent);left:10%;top:15%;animation-delay:0s"></div>
      <div class="nebula" style="width:160px;height:160px;background:radial-gradient(circle,rgba(123,97,255,.35),transparent);right:15%;top:60%;animation-delay:-6s;animation-duration:22s"></div>
      <div class="nebula" style="width:120px;height:120px;background:radial-gradient(circle,rgba(255,51,85,.2),transparent);left:50%;top:40%;animation-delay:-12s;animation-duration:25s"></div>
      <div style="position:absolute;inset:0;pointer-events:none;z-index:0">${generateBattleStars(160)}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;position:relative;z-index:2">
        <div style="font-family:Orbitron,sans-serif; font-size:0.75rem;color:#7dd3fc">⚔️ <span id="battleAnimRound">Runda 1</span></div>
        <div style="font-size:0.7rem;color:#6a90b8"><span id="battleAnimPct">0%</span></div>
      </div>
      <div class="progress" style="margin-bottom:18px;position:relative;z-index:2"><div class="progress-fill" id="battleAnimProgressBar"></div></div>
      <div class="fleets" style="position:relative;z-index:2">
        <div class="fleet player" id="player-fleet"></div>
        <div style="text-align:center;display:flex;align-items:center;flex-direction:column;justify-content:center;gap:8px">
          <div style="font-size:2.2rem;color:#ffcc44;text-shadow:0 0 30px #ffcc44,0 0 60px rgba(255,204,68,.3);opacity:0.8;animation:enginePulse 1.5s infinite">⚔️</div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:9px;color:#6a90b8;letter-spacing:2px">VS</div>
        </div>
        <div class="fleet enemy" id="enemy-fleet"></div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; margin-bottom: 8px; font-family: 'Orbitron',sans-serif; font-size: 12px; color: #7dd3fc; background: rgba(0,0,0,0.55); padding: 8px 14px; border-radius: 40px; border:1px solid rgba(0,212,255,.12); position:relative; z-index:2; backdrop-filter:blur(6px);">
        <span>🛸 MOJI: <span id="battleAlivePlayer" style="color:#00ff88">0</span> / <span id="battleTotalPlayer">0</span></span>
        <span>💀 UNIŠTENI: <span id="battleDestroyedCount" style="color:#ff3355">0</span></span>
        <span>👾 NEPRIJATELJ: <span id="battleAliveEnemy" style="color:#ff3355">0</span> / <span id="battleTotalEnemy">0</span></span>
      </div>
      <canvas id="battleCanvas" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:15"></canvas>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:12px;justify-content:center;flex-wrap:wrap">
      <button class="pill" onclick="battleAnimTogglePause()" id="battleAnimPauseBtn">⏸ PAUSE</button>
      <button class="pill" onclick="battleAnimSetSpeed(500)">🐢 SPORO</button>
      <button class="pill" onclick="battleAnimSetSpeed(180)">▶ NORMALNO</button>
      <button class="pill" onclick="battleAnimSetSpeed(40)">⚡ BRZO</button>
      <button class="pill" onclick="battleAnimSkipToEnd()">⏭ SKIP</button>
    </div>
    <div class="log-panel">
      <div class="log-header"><span><span class="live-dot"></span>COMBAT LOG // HIVE_NET</span><span>LIVE</span></div>
      <div id="battleAnimLog"></div>
    </div>
    <div id="battleAnimFinish" style="display:none;flex-direction:column;align-items:center;gap:14px;margin-top:16px">
      <div style="font-family:Orbitron,sans-serif;font-size:2rem;color:${statusColor};text-shadow:0 0 25px ${statusColor},0 0 60px ${statusColor};animation:victoryGlowBattle 1.2s infinite;letter-spacing:2px">${statusIcon} ${isVictory ? 'POBJEDA!' : isDraw ? 'IZJEDNAČENJE' : 'PORAZ'}</div>
      <div style="font-size:0.8rem;color:#6a90b8;font-family:'Share Tech Mono',monospace">${battle.round} rundi · ${battle.log.length} akcija</div>
      <button class="pill" onclick="battleAnimClose()">✅ NASTAVI</button>
    </div>
  `;
  const modal = document.getElementById('modal');
  const mTitle = document.getElementById('mTitle');
  const mBody = document.getElementById('mBody');
  const mAct = document.getElementById('mActions');
  if (!modal) return;
  if (mTitle) mTitle.textContent = `⚔️ ${battle.instance?.name || 'Borba'} — Bitka`;
  if (mBody) { mBody.innerHTML = body; mBody.style.overflow = 'hidden'; }
  if (mAct) { mAct.innerHTML = ''; mAct.style.display = 'none'; }
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  const modalInner = modal.querySelector('div');
  if (modalInner) modalInner.style.maxWidth = '1100px';
  renderFleets(battle);

  /* reset FX */
  beams = []; impacts = []; particles = []; shockwaves = []; muzzleFlashes = [];
  screenShake = { x: 0, y: 0, t: 0, dur: 0, mag: 0, decay: 0.92 };

  setTimeout(() => {
    const wrap = document.getElementById('battlefieldWrap');
    const canvas = document.getElementById('battleCanvas');
    if (wrap && canvas) {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      fxW = wrap.offsetWidth;
      fxH = wrap.offsetHeight;
      canvas.width = fxW * dpr;
      canvas.height = fxH * dpr;
      ctxFX = canvas.getContext('2d');
      ctxFX.scale(dpr, dpr);
      fxCanvas = canvas;
      glassPanel = wrap;
      /* sloj za damage brojeve — IZNAD canvas-a sa eksplozijama (z-index:40 > 15) */
      dmgLayer = document.getElementById('battleDmgLayer');
      if (!dmgLayer) {
        dmgLayer = document.createElement('div');
        dmgLayer.id = 'battleDmgLayer';
        dmgLayer.className = 'dmg-layer';
        wrap.appendChild(dmgLayer);
      } else {
        dmgLayer.innerHTML = '';
      }
      if (animFrameId) cancelAnimationFrame(animFrameId);
      lastTimestamp = 0;
      animFrameId = requestAnimationFrame(effectLoop);
    }
  }, 50);
}

/* ── Fleets ── */
function renderFleets(battle) {
  const pf = document.getElementById('player-fleet');
  const ef = document.getElementById('enemy-fleet');
  if (!pf || !ef) return;
  pf.innerHTML = ''; ef.innerHTML = '';
  battle.shipsById = {};

  // Mapiraj brodove po slotIndex
  const playerBySlot = {};
  battle.player.forEach(ship => { playerBySlot[ship.slotIndex ?? 99] = ship; });
  const enemyBySlot = {};
  battle.enemy.forEach(ship => { enemyBySlot[ship.slotIndex ?? 99] = ship; });

  // Render 9 slotova (0-8) za oba tima
  for (let i = 0; i < 9; i++) {
    const ps = playerBySlot[i];
    if (ps) {
      ps.el = createShipElement(ps, 'player');
      pf.appendChild(ps.el);
      battle.shipsById[ps.id] = ps;
      updateShipBars(ps);
    } else {
      const ph = document.createElement('div');
      ph.className = 'ship-placeholder';
      pf.appendChild(ph);
    }
    const es = enemyBySlot[i];
    if (es) {
      es.el = createShipElement(es, 'enemy');
      ef.appendChild(es.el);
      battle.shipsById[es.id] = es;
      updateShipBars(es);
    } else {
      const ph = document.createElement('div');
      ph.className = 'ship-placeholder';
      ef.appendChild(ph);
    }
  }
}

function createShipElement(ship, team) {
  const div = document.createElement('div');
  div.className = 'ship';
  div.dataset.id = ship.id;
  const imgSrc = ship.ship_id ? getShipImageSrc(ship.ship_id) : null;
  const hpPct = ship.maxHp > 0 ? (ship.hp / ship.maxHp) * 100 : 100;
  const shPct = ship.maxShield > 0 ? (ship.shield / ship.maxShield) * 100 : 0;
  const color = team === 'player' ? '#00d4ff' : '#ff3355';
  const delay = (Math.random() * 2).toFixed(1);
  div.style.animationDelay = `${delay}s, 0s`;
  div.innerHTML = `
    <div class="ship-inner">
      <div class="ship-image">
        ${imgSrc ? `<img src="${imgSrc}" style="width:44px;height:34px;object-fit:contain;filter:drop-shadow(0 0 10px ${color}) drop-shadow(0 0 3px ${color})" onerror="this.style.display='none'">` : `<svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:44px;height:34px;filter:drop-shadow(0 0 10px ${color})"><path d="M2 24 L16 8 L30 12 L48 5 L62 24 L48 43 L30 36 L16 40 Z" fill="${color}" opacity="0.8"/><path d="M2 24 L16 8 L30 12 L48 5 L62 24 L48 43 L30 36 L16 40 Z" fill="none" stroke="white" stroke-width="0.5" opacity="0.4"/><rect x="28" y="22" width="12" height="4" rx="1" fill="white" opacity="0.95"/><circle cx="48" cy="24" r="2" fill="white" opacity="0.7"/></svg>`}
      </div>
      <div class="engine-glow" style="color:${color}"></div>
      <div class="ship-name">${ship.name}</div>
      <div class="bars">
        ${ship.maxShield > 0 ? `<div class="bar shield"><i style="width:${shPct}%"></i></div>` : ''}
        <div class="bar hp"><i style="width:${hpPct}%"></i></div>
      </div>
    </div>
  `;
  return div;
}

function updateShipBars(ship) {
  if (!ship.el) return;
  const anim = window._battleAnim;
  const hpPct = ship.maxHp > 0 ? ((anim.hpState[ship.id] ?? ship.hp) / ship.maxHp) * 100 : 100;
  const shPct = ship.maxShield > 0 ? ((anim.shldState[ship.id] ?? ship.shield) / ship.maxShield) * 100 : 0;
  const hpBar = ship.el.querySelector('.bar.hp i');
  const shBar = ship.el.querySelector('.bar.shield i');
  if (hpBar) hpBar.style.width = Math.max(0, hpPct) + '%';
  if (shBar) shBar.style.width = Math.max(0, shPct) + '%';
  if (!anim.aliveState[ship.id] && ship.el) ship.el.classList.add('destroyed');
}

function updateBattlefield() {
  const anim = window._battleAnim;
  if (!anim.battle) return;
  [...anim.battle.player, ...anim.battle.enemy].forEach(u => updateShipBars(u));
  updateShipCounters();
}

/* ── Combat log ── */
function appendAnimEntry(entry) {
  const logEl = document.getElementById('battleAnimLog');
  if (!logEl) return;
  const div = document.createElement('div');
  div.className = 'log-entry';
  let txt = '';
  if (entry.type === 'round') {
    txt = `─── ROUND ${entry.round} INITIATED ───`;
    div.style.color = '#7b61ff';
    div.style.textShadow = '0 0 8px rgba(123,97,255,.4)';
    const rndEl = document.getElementById('battleAnimRound');
    if (rndEl) rndEl.textContent = `Runda ${entry.round}`;
  } else if (entry.type === 'attack') {
    const anim = window._battleAnim;
    const a = anim.battle.shipsById[entry.attacker]?.name || entry.attacker;
    const d = anim.battle.shipsById[entry.target]?.name || entry.target;
    txt = `${a} → ${d}  |  -${entry.dmg} HP${entry.shieldDmg ? ` (${entry.shieldDmg} SHD)` : ''}`;
    div.style.color = '#b8ecff';
  } else if (entry.type === 'destroy') {
    const anim = window._battleAnim;
    const m = entry.msg && entry.msg.match(/💀\s*(.+?)\s+UNIŠTEN/);
    const s = anim.battle.shipsById[entry.target]?.name || (m && m[1].trim()) || entry.target || 'Nepoznati';
    const burned = entry.msg && entry.msg.includes('gorenja');
    txt = `✖ ${s} UNIŠTEN${burned ? ' (gorenje)' : ''}`;
    div.style.color = '#ffcc44';
    div.style.textShadow = '0 0 10px rgba(255,204,68,.5)';
    div.style.fontWeight = 'bold';
  } else {
    txt = entry.msg || '';
    div.style.color = '#6a90b8';
  }
  div.textContent = txt;
  logEl.appendChild(div);
  while (logEl.children.length > 6) logEl.removeChild(logEl.firstChild);
}

function updateAnimProgress(current, total) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  const fill = document.getElementById('battleAnimProgressBar');
  const pctSpan = document.getElementById('battleAnimPct');
  if (fill) fill.style.width = pct + '%';
  if (pctSpan) pctSpan.textContent = Math.floor(pct) + '%';
}

/* ── FX render loop ── */
function effectLoop(ts) {
  const dt = Math.min(33, ts - (lastTimestamp || ts) || 16);
  lastTimestamp = ts;
  updateEffects(dt);
  animFrameId = requestAnimationFrame(effectLoop);
}

function updateEffects(dt) {
  if (!ctxFX || !fxCanvas) return;
  const ctx = ctxFX;
  const dtSec = dt / 1000;

  /* screen shake update */
  if (screenShake.dur > 0) {
    screenShake.t += dtSec;
    if (screenShake.t >= screenShake.dur) {
      screenShake.mag = 0; screenShake.dur = 0; screenShake.x = 0; screenShake.y = 0;
    } else {
      const p = 1 - screenShake.t / screenShake.dur;
      const m = screenShake.mag * p;
      screenShake.x = (Math.random() - 0.5) * 2 * m;
      screenShake.y = (Math.random() - 0.5) * 2 * m;
    }
  }

  ctx.save();
  ctx.clearRect(-10, -10, fxW + 20, fxH + 20);
  ctx.translate(screenShake.x, screenShake.y);

  /* ── Pass 1: Smoke particles (source-over, behind everything) ── */
  ctx.globalCompositeOperation = 'source-over';
  particles.forEach(p => {
    if (p.type !== 'smoke') return;
    const a = Math.max(0, p.life / p.maxLife) * 0.5;
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (2.2 - p.life / p.maxLife), 0, Math.PI * 2);
    ctx.fill();
  });

  /* ── Pass 2: Additive FX ── */
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = 1;

  /* Beams */
  beams = beams.filter(b => { b.life += dtSec; return b.life < b.maxLife; });
  beams.forEach(b => {
    const p = b.life / b.maxLife;
    const fadeOut = 1 - p;
    const sx = b.start.x, sy = b.start.y, ex = b.end.x, ey = b.end.y;
    const mx = (sx + ex) / 2 + Math.sin(p * Math.PI) * -28 * (b.flip || 1);
    const my = (sy + ey) / 2 - 40;

    /* outer glow */
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(mx, my, ex, ey);
    ctx.strokeStyle = hexToRgba(b.color, 0.12 * fadeOut);
    ctx.lineWidth = b.width * 8; ctx.shadowBlur = 30; ctx.shadowColor = b.color;
    ctx.stroke();

    /* mid beam */
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(mx, my, ex, ey);
    ctx.strokeStyle = hexToRgba(b.color, 0.6 * fadeOut);
    ctx.lineWidth = b.width * 2; ctx.shadowBlur = 12; ctx.shadowColor = b.color;
    ctx.stroke();

    /* bright core */
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(mx, my, ex, ey);
    ctx.strokeStyle = hexToRgba('#ffffff', 0.7 * fadeOut);
    ctx.lineWidth = b.width * 0.6; ctx.shadowBlur = 6; ctx.shadowColor = '#ffffff';
    ctx.stroke();

    /* bolt head traveling along curve */
    const t = Math.min(1, p * 3); // head moves fast
    const bx = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * mx + t * t * ex;
    const by = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * my + t * t * ey;
    if (t < 1) {
      ctx.beginPath(); ctx.arc(bx, by, b.width * 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 25; ctx.shadowColor = b.color;
      ctx.fill();
      ctx.beginPath(); ctx.arc(bx, by, b.width * 6, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(b.color, 0.15);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
  });

  /* Muzzle flashes */
  muzzleFlashes = muzzleFlashes.filter(m => { m.life += dtSec; return m.life < m.maxLife; });
  muzzleFlashes.forEach(m => {
    const p = m.life / m.maxLife;
    const r = 8 + p * 15;
    const a = (1 - p) * 0.8;
    ctx.beginPath(); ctx.arc(m.x, m.y, r, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba('#ffffff', a * 0.7);
    ctx.shadowBlur = 20; ctx.shadowColor = m.color;
    ctx.fill();
    ctx.beginPath(); ctx.arc(m.x, m.y, r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(m.color, a * 0.2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  /* Impacts */
  impacts = impacts.filter(i => { i.life += dtSec; return i.life < i.maxLife; });
  impacts.forEach(i => {
    const p = i.life / i.maxLife;
    const fadeOut = 1 - p;

    /* bright flash core (fast fade) */
    if (p < 0.3) {
      const flashA = (1 - p / 0.3) * 0.9;
      ctx.beginPath(); ctx.arc(i.x, i.y, 6 + p * 30, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba('#ffffff', flashA);
      ctx.shadowBlur = 30; ctx.shadowColor = i.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    /* ring 1 */
    const r1 = 15 + p * 55;
    ctx.beginPath(); ctx.arc(i.x, i.y, r1, 0, Math.PI * 2);
    ctx.strokeStyle = hexToRgba(i.color, 0.7 * fadeOut);
    ctx.lineWidth = 2.5 * fadeOut + 0.5;
    ctx.stroke();

    /* ring 2 (delayed, larger) */
    if (p > 0.15) {
      const p2 = (p - 0.15) / 0.85;
      const r2 = 10 + p2 * 70;
      ctx.beginPath(); ctx.arc(i.x, i.y, r2, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(i.color, 0.35 * (1 - p2));
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    /* warm inner glow */
    ctx.beginPath(); ctx.arc(i.x, i.y, 12 * fadeOut, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(i.color, 0.25 * fadeOut);
    ctx.fill();
  });

  /* Shockwaves (big rings for explosions) */
  shockwaves = shockwaves.filter(s => { s.life += dtSec; return s.life < s.maxLife; });
  shockwaves.forEach(s => {
    const p = s.life / s.maxLife;
    const r = s.startR + p * s.expandR;
    const fadeOut = 1 - p * p;
    ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = hexToRgba(s.color, 0.6 * fadeOut);
    ctx.lineWidth = (3 - p * 2.5);
    ctx.shadowBlur = 15; ctx.shadowColor = s.color;
    ctx.stroke();
    ctx.shadowBlur = 0;
  });

  /* Spark & ember particles */
  particles.forEach(p => {
    if (p.type === 'smoke' || p.type === 'debris') return;
    const a = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 6; ctx.shadowColor = p.color;
    if (p.type === 'fireball') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1.5 - a * 0.5), 0, Math.PI * 2);
      ctx.fill();
    } else {
      const s = p.size * (0.5 + a * 0.5);
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.shadowBlur = 0;
  });
  ctx.globalAlpha = 1;

  /* ── Pass 3: Debris (source-over) ── */
  ctx.globalCompositeOperation = 'source-over';
  particles.forEach(p => {
    if (p.type !== 'debris') return;
    const a = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = a;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot || 0));
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
    ctx.restore();
  });
  ctx.globalAlpha = 1;

  /* Update all particles physics */
  particles = particles.filter(p => {
    p.life -= dtSec;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += (p.gravity || 0);
    if (p.drag) { p.vx *= p.drag; p.vy *= p.drag; }
    if (p.rot !== undefined && p.vrot) p.rot += p.vrot;
    return p.life > 0;
  });

  ctx.restore();
}

/* ── Helpers ── */
function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${a})`;
}

/* ── Attack visuals ── */
function animAttackFlash(attackerId, targetId, dmg, isShield, dmgType, isCrit) {
  let targetEl = document.getElementById(`battleship_${targetId}`);
  if (!targetEl) targetEl = document.querySelector(`.ship[data-id="${targetId}"]`);
  if (targetEl) {
    targetEl.style.filter = 'brightness(2) drop-shadow(0 0 14px white)';
    targetEl.style.transform = `translateY(-3px) scale(1.03)`;
    setTimeout(() => {
      if (targetEl) { targetEl.style.filter = ''; targetEl.style.transform = ''; }
    }, 180);
  }
  animProjectile(attackerId, targetId);
  showDamageNumber(targetId, dmg, isShield, dmgType, isCrit);
  addShake(2.5, 0.15);
}

/* stagger da se brojevi ne preklapaju kad više brodova pogodi istu metu */
let _dmgStagger = 0, _dmgStaggerT = 0;

function animProjectile(fromId, toId) {
  if (!fxCanvas || !ctxFX) return;
  let fromEl = document.getElementById(`battleship_${fromId}`);
  if (!fromEl) fromEl = document.querySelector(`.ship[data-id="${fromId}"]`);
  let toEl = document.getElementById(`battleship_${toId}`);
  if (!toEl) toEl = document.querySelector(`.ship[data-id="${toId}"]`);
  if (!fromEl || !toEl || !glassPanel) return;
  const wrapRect = glassPanel.getBoundingClientRect();
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();
  const start = { x: fromRect.left + fromRect.width / 2 - wrapRect.left, y: fromRect.top + fromRect.height / 2 - wrapRect.top };
  const end = { x: toRect.left + toRect.width / 2 - wrapRect.left, y: toRect.top + toRect.height / 2 - wrapRect.top };
  const color = fromId?.startsWith('p') ? '#00d4ff' : '#ff3355';

  /* beam */
  beams.push({
    start, end, life: 0, maxLife: 0.32,
    color, width: 2.5 + Math.random() * 1.8,
    flip: Math.random() > 0.5 ? 1 : -1
  });

  /* muzzle flash at origin */
  muzzleFlashes.push({ x: start.x, y: start.y, life: 0, maxLife: 0.18, color });

  /* impact + particles at target (delayed to sync with bolt travel) */
  setTimeout(() => {
    impacts.push({ x: end.x, y: end.y, life: 0, maxLife: 0.45, color: '#ffcc44' });
    /* sparks */
    for (let i = 0; i < 20; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = Math.random() * 4 + 1.5;
      particles.push({
        x: end.x, y: end.y,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        life: 0.35 + Math.random() * 0.25, maxLife: 0.6,
        size: 2 + Math.random() * 2, color: Math.random() > 0.3 ? '#fbbf24' : '#ffffff',
        type: 'spark', gravity: 0.03, drag: 0.98
      });
    }
    /* small embers */
    for (let i = 0; i < 6; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = Math.random() * 2 + 0.5;
      particles.push({
        x: end.x, y: end.y,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        life: 0.5 + Math.random() * 0.3, maxLife: 0.8,
        size: 3 + Math.random() * 3, color: '#ff6622',
        type: 'fireball', gravity: 0.01, drag: 0.96
      });
    }
  }, 110);
}

function showDamageNumber(targetId, amount, isShield, dmgType, isCrit) {
  if (!amount) return;
  let targetEl = document.getElementById(`battleship_${targetId}`);
  if (!targetEl) targetEl = document.querySelector(`.ship[data-id="${targetId}"]`);
  if (!targetEl) return;

  /* pozicija iznad mete, relativno na battlefield (dmgLayer) — IZNAD eksplozija */
  let leftPct = 50, topPx = 12, useLayer = !!(dmgLayer && glassPanel);
  if (useLayer) {
    const wrapRect = glassPanel.getBoundingClientRect();
    const r = targetEl.getBoundingClientRect();
    const now = performance.now();
    if (now - _dmgStaggerT > 350) _dmgStagger = 0;
    _dmgStaggerT = now;
    const jitterX = (_dmgStagger % 3 - 1) * 22 + (Math.random() * 10 - 5);
    const jitterY = Math.floor(_dmgStagger / 3) * 16;
    _dmgStagger++;
    leftPct = ((r.left + r.width / 2 - wrapRect.left + jitterX) / wrapRect.width) * 100;
    topPx = (r.top - wrapRect.top) + 14 + jitterY;
  }

  const dmgDiv = document.createElement('div');
  dmgDiv.className = 'damage-float' + (isCrit ? ' crit' : '') + (isShield ? ' shield' : '');
  dmgDiv.style.color = isShield ? '#7fdcff' : dmgTypeColor(dmgType);

  const label = isShield ? '⛉' : (DMG_TYPE_SHORT[dmgType] || '');
  dmgDiv.innerHTML = `${isCrit ? '💥' : ''}-${Math.floor(amount)}` +
    (label ? `<span class="dt">${label}</span>` : '');

  if (useLayer) {
    dmgDiv.style.left = leftPct + '%';
    dmgDiv.style.top = topPx + 'px';
    dmgLayer.appendChild(dmgDiv);
  } else {
    dmgDiv.style.left = (40 + Math.random() * 20) + '%';
    dmgDiv.style.top = '-15px';
    targetEl.style.position = 'relative';
    targetEl.appendChild(dmgDiv);
  }
  setTimeout(() => dmgDiv.remove(), isCrit ? 1100 : 950);
}

/* ── Destroy visuals ── */
function animDestroyEffect(unitId) {
  let shipEl = document.getElementById(`battleship_${unitId}`);
  if (!shipEl) shipEl = document.querySelector(`.ship[data-id="${unitId}"]`);
  if (!shipEl) return;
  shipEl.classList.add('destroyed');

  /* screen shake (strong) */
  addShake(8, 0.5);

  /* CSS shake */
  if (glassPanel) glassPanel.classList.add('shake');
  setTimeout(() => glassPanel?.classList.remove('shake'), 550);

  /* white flash */
  const flash = document.getElementById('flashOverlay');
  if (flash) { flash.classList.add('active'); setTimeout(() => flash.classList.remove('active'), 180); }

  /* chromatic aberration */
  document.body.classList.add('aberration');
  setTimeout(() => document.body.classList.remove('aberration'), 200);

  /* canvas explosion */
  const rect = shipEl.getBoundingClientRect();
  const wrapRect = glassPanel?.getBoundingClientRect() || { left: 0, top: 0 };
  const centerX = rect.left + rect.width / 2 - wrapRect.left;
  const centerY = rect.top + rect.height / 2 - wrapRect.top;
  createExplosionParticles(centerX, centerY, unitId.startsWith('p') ? 'player' : 'enemy');
}

function createExplosionParticles(x, y, team) {
  const teamColors = team === 'player' ? ['#00d4ff', '#7b61ff', '#ffffff'] : ['#ff3355', '#ff8844', '#ffcc44'];
  const pick = () => teamColors[Math.floor(Math.random() * teamColors.length)];

  /* shockwaves (2 rings) */
  shockwaves.push({ x, y, life: 0, maxLife: 0.6, startR: 5, expandR: 100, color: pick() });
  shockwaves.push({ x, y, life: 0, maxLife: 0.9, startR: 3, expandR: 140, color: teamColors[0] });

  /* bright flash impact */
  impacts.push({ x, y, life: 0, maxLife: 0.5, color: '#ffffff' });

  /* fireball (large additive circles) */
  for (let i = 0; i < 12; i++) {
    const ang = Math.random() * Math.PI * 2;
    const sp = Math.random() * 2.5 + 0.5;
    particles.push({
      x: x + (Math.random() - 0.5) * 10, y: y + (Math.random() - 0.5) * 10,
      vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 0.5,
      life: 0.5 + Math.random() * 0.5, maxLife: 1.0,
      size: 6 + Math.random() * 10, color: Math.random() > 0.5 ? '#ffcc44' : '#ff8844',
      type: 'fireball', gravity: -0.02, drag: 0.95
    });
  }

  /* sparks/embers (many) */
  const sparkCount = 100 + Math.random() * 50;
  for (let i = 0; i < sparkCount; i++) {
    const ang = Math.random() * Math.PI * 2;
    const sp = Math.random() * 5.5 + 1.5;
    particles.push({
      x, y,
      vx: Math.cos(ang) * sp * (0.5 + Math.random()),
      vy: Math.sin(ang) * sp * (0.5 + Math.random()) - 1.5,
      life: 0.6 + Math.random() * 1.0,
      maxLife: 1.6,
      size: Math.random() * 3.5 + 1,
      color: pick(),
      type: 'spark', gravity: 0.04 + Math.random() * 0.03, drag: 0.99
    });
  }

  /* smoke (dark, expands slowly) */
  for (let i = 0; i < 10; i++) {
    const ang = Math.random() * Math.PI * 2;
    const sp = Math.random() * 1.5 + 0.3;
    particles.push({
      x: x + (Math.random() - 0.5) * 15, y: y + (Math.random() - 0.5) * 15,
      vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 0.8,
      life: 1.2 + Math.random() * 0.8, maxLife: 2.0,
      size: 8 + Math.random() * 8, color: 'rgba(80,80,100,0.5)',
      type: 'smoke', gravity: -0.01, drag: 0.97
    });
  }

  /* debris chunks */
  for (let i = 0; i < 8; i++) {
    const ang = Math.random() * Math.PI * 2;
    const sp = Math.random() * 4 + 2;
    particles.push({
      x, y,
      vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 2,
      life: 0.8 + Math.random() * 0.6, maxLife: 1.4,
      size: 3 + Math.random() * 4, color: '#8899aa',
      type: 'debris', gravity: 0.08, drag: 0.98,
      rot: Math.random() * Math.PI * 2, vrot: (Math.random() - 0.5) * 0.3
    });
  }
}

/* ── Stars ── */
function generateBattleStars(count) {
  return Array.from({ length: count }, () => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const s = Math.random() * 2 + 0.4;
    const baseO = (Math.random() * 0.4 + 0.1).toFixed(2);
    const dur = (Math.random() * 4 + 2).toFixed(1);
    const delay = (Math.random() * 5).toFixed(1);
    return `<div style="position:absolute;left:${x}%;top:${y}%;width:${s}px;height:${s}px;border-radius:50%;background:white;opacity:${baseO};box-shadow:0 0 ${s + 2}px rgba(255,255,255,0.6);--base-o:${baseO};animation:twinkle ${dur}s ease-in-out ${delay}s infinite"></div>`;
  }).join('');
}

/* ── Controls ── */
function battleAnimTogglePause() {
  const anim = window._battleAnim;
  anim.paused = !anim.paused;
  const btn = document.getElementById('battleAnimPauseBtn');
  if (btn) btn.textContent = anim.paused ? '▶ RESUME' : '⏸ PAUSE';
  if (!anim.paused) scheduleTick();
}

function battleAnimSetSpeed(ms) {
  window._battleAnim.speed = ms;
  if (!window._battleAnim.paused) scheduleTick();
}

function battleAnimSkipToEnd() {
  const anim = window._battleAnim;
  if (anim.timer) clearTimeout(anim.timer);
  anim.paused = false;
  while (anim.logIndex < anim.battle.log.length) {
    const entry = anim.battle.log[anim.logIndex];
    if (entry.type === 'attack' && entry.target) {
      anim.hpState[entry.target] = Math.max(0, (anim.hpState[entry.target] || 0) - (entry.dmg || 0));
      if (entry.shieldDmg) anim.shldState[entry.target] = Math.max(0, (anim.shldState[entry.target] || 0) - entry.shieldDmg);
    }
    if (entry.type === 'destroy') {
      const destroyId = resolveDestroyId(entry);
      if (destroyId) anim.aliveState[destroyId] = false;
    }
    appendAnimEntry(entry);
    anim.logIndex++;
  }
  updateBattlefield();
  updateAnimProgress(anim.logIndex, anim.battle.log.length);
  finishBattleAnim();
}

function battleAnimClose() {
  const anim = window._battleAnim;
  if (anim.timer) clearTimeout(anim.timer);
  if (animFrameId) cancelAnimationFrame(animFrameId);
  const mAct = document.getElementById('mActions');
  if (mAct) mAct.style.display = '';
  document.body.style.overflow = '';
  closeModal();
  if (typeof anim.onFinish === 'function') anim.onFinish(anim.battle);
}

function showBattleResultDirect(battle, rewards) {
  if (typeof renderBattleResult === 'function') renderBattleResult(battle, rewards);
}

function showBattleOutcome(battle, rewards, useAnim = true) {
  if (useAnim && battle.log && battle.log.length > 0) {
    startBattleAnim(battle, () => showBattleResultDirect(battle, rewards));
  } else {
    showBattleResultDirect(battle, rewards);
  }
}

if (!document.getElementById('battleAnimStyles')) {
  const style = document.createElement('style');
  style.id = 'battleAnimStyles';
  style.textContent = `
    @keyframes victoryGlowBattle { 0%,100% { filter:brightness(1); } 50% { filter:brightness(1.4); } }
    @keyframes shieldShimmer { 0%{background-position:-200% center}100%{background-position:200% center} }
    .battle-ship { transition: transform 0.2s, filter 0.2s; cursor: pointer; }
    .battle-ship:hover { transform: scale(1.03); filter: drop-shadow(0 0 16px cyan); }
  `;
  document.head.appendChild(style);
}
