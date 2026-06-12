// ============================================================
// HIVE GALAXY — js/ui/render.js
// UI render funkcije — resursi, navigacija, log, modal
// ============================================================

// ── FORMAT BROJEVA ──
function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

// ── UPDATE RESOURCE BAR ──
function updateResUI() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('rMetal',   fmt(R.metal));
  set('rCrystal', fmt(R.crystal));
  set('rHe3',     fmt(R.he3));
  set('rEnergy',  Math.floor(R.energy));
  set('rScore',   fmt(R.score));
  set('rKeys',    R.instanceKeys || 0);
  set('rCardKeys', R.keys || 0);
  // HIVE tokeni
  set('hBCM',     R.bcm     || 0);
  set('hBoCrypto',R.bocrypto|| 0);
  set('hBPW',     R.spCard  || 0);

  const prod = getProd();
  const now  = Math.floor(Date.now() / 1000);
  const mB   = (window._metalBoost   || 1) > 1 && (window._metalBoostEnd   || 0) > now;
  const cB   = (window._crystalBoost || 1) > 1 && (window._crystalBoostEnd || 0) > now;
  const hB   = (window._he3Boost     || 1) > 1 && (window._he3BoostEnd     || 0) > now;
  const mT   = mB ? Math.max(0, (window._metalBoostEnd   - now)) : 0;
  const cT   = cB ? Math.max(0, (window._crystalBoostEnd - now)) : 0;
  const hT   = hB ? Math.max(0, (window._he3BoostEnd     - now)) : 0;
  const _fmtBoostTime = s => s >= 60 ? `${Math.ceil(s/60)}m` : `${s}s`;
  const _mMult = window._metalBoost   || 1;
  const _cMult = window._crystalBoost || 1;
  const _hMult = window._he3Boost     || 1;
  set('rMetalProd',   `+${(prod.metal).toFixed(3)}/s`   + (mB ? ` ⚡×${_mMult} ${_fmtBoostTime(mT)}` : ''));
  set('rCrystalProd', `+${(prod.crystal).toFixed(3)}/s` + (cB ? ` ⚡×${_cMult} ${_fmtBoostTime(cT)}` : ''));
  set('rHe3Prod',     `+${(prod.he3).toFixed(3)}/s`     + (hB ? ` ⚡×${_hMult} ${_fmtBoostTime(hT)}` : ''));

  // Active event badge
  const _evBadgeEl = document.getElementById('activeEventBadge');
  if (_evBadgeEl) {
    const _penalty  = (window._prodPenalty || 1.0) < 1.0;
    const _anyBoost = mB || cB || hB;
    if (_penalty) {
      _evBadgeEl.style.display = '';
      _evBadgeEl.innerHTML = `<span style="color:#ff3355">⚙️ Kvar opreme — produkcija -50%</span>`;
    } else if (_anyBoost) {
      const boostNames = [];
      if (mB) boostNames.push(`🔩×${_mMult}`);
      if (cB) boostNames.push(`💎×${_cMult}`);
      if (hB) boostNames.push(`⛽×${_hMult}`);
      _evBadgeEl.style.display = '';
      _evBadgeEl.innerHTML = `<span style="color:#ffcc44">⚡ EVENT BOOST: ${boostNames.join(' ')}</span>`;
    } else {
      _evBadgeEl.style.display = 'none';
    }
  }

  set('cmdLevel',   commander.level);
  set('cmdExp',     fmt(commander.exp));
  set('cmdNextExp', fmt(commander.nextExp));
  const expBar = document.getElementById('expBar');
  if (expBar) expBar.style.width = Math.min(100, (commander.exp / commander.nextExp) * 100) + '%';

  // Komandir titula
  if (typeof getCommanderTitle === 'function') {
    const titleData = getCommanderTitle();
    const titleEl   = document.getElementById('cmdTitle');
    if (titleEl) {
      titleEl.textContent = titleData.title;
      titleEl.style.color = titleData.color;
    }
  }

  set('fleetPowerDisplay', fmt(calcFleetTotalPower()));

  updateDepotStatus();
  updateFormationStatus();
  if (typeof updateHangarStatus === 'function') updateHangarStatus();
  if (typeof updateHiveTokenUI === 'function') updateHiveTokenUI();
}

// ── DEPOT STATUS (desni panel) ──
function updateDepotStatus() {
  const el = document.getElementById('depotStatus');
  if (!el) return;
  const cap   = getDepotCapacity();
  const total = storageBuffer.metal + storageBuffer.crystal + storageBuffer.he3;
  const pct   = cap > 0 ? Math.min(100, (total / cap) * 100) : 0;
  const color = pct >= 90 ? '#ff3355' : pct >= 70 ? '#ffcc44' : '#00ff88';
  el.innerHTML = `
    <div style="font-size:0.72rem;color:${color};margin-bottom:4px">
      ${pct >= 90 ? '⚠️ Skoro pun!' : pct >= 70 ? '📦 Punjenje...' : '✅ OK'}
    </div>
    <div class="pbar"><div class="pbar-fill" style="width:${pct}%;background:${color}"></div></div>
    <div style="font-size:0.65rem;color:#6a90b8;margin-top:4px">${fmt(Math.floor(total))} / ${fmt(cap)}</div>
    ${pct >= 70 ? `<button class="btn btn-gold" style="width:100%;margin-top:6px;font-size:0.72rem" onclick="pickupResources()">📦 Pokupi</button>` : ''}
  `;
}

// ── FORMACIJA STATUS (desni panel) ──
function updateFormationStatus() {
  const el = document.getElementById('formationStatus');
  if (!el) return;
  if (typeof getActiveFormation !== 'function') {
    el.innerHTML = '<div style="font-size:0.7rem;color:#6a90b8">—</div>';
    return;
  }
  const form  = getActiveFormation();
  const bonus = typeof getFormationBonus === 'function' ? getFormationBonus() : {};
  const hasBonus = Object.values(bonus).some(v => v !== 0);
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
      <span style="font-size:1rem">${form.icon}</span>
      <span style="font-size:0.72rem;color:${form.color};font-weight:700">${form.name}</span>
    </div>
    ${hasBonus ? `<div style="display:flex;flex-wrap:wrap;gap:3px">
      ${bonus.dps     ? `<span style="font-size:0.58rem;color:#ff4444;background:rgba(255,68,68,0.1);border-radius:3px;padding:1px 4px">⚔️+${bonus.dps}%</span>` : ''}
      ${bonus.shield  ? `<span style="font-size:0.58rem;color:#4488ff;background:rgba(68,136,255,0.1);border-radius:3px;padding:1px 4px">🛡️${bonus.shield > 0 ? '+' : ''}${bonus.shield}%</span>` : ''}
      ${bonus.armor   ? `<span style="font-size:0.58rem;color:#ff8833;background:rgba(255,136,51,0.1);border-radius:3px;padding:1px 4px">🔩+${bonus.armor}%</span>` : ''}
      ${bonus.agility ? `<span style="font-size:0.58rem;color:#00ff88;background:rgba(0,255,136,0.1);border-radius:3px;padding:1px 4px">💨+${bonus.agility}</span>` : ''}
      ${bonus.speed   ? `<span style="font-size:0.58rem;color:#00d4ff;background:rgba(0,212,255,0.1);border-radius:3px;padding:1px 4px">🚀${bonus.speed > 0 ? '+' : ''}${bonus.speed}</span>` : ''}
    </div>` : `<div style="font-size:0.62rem;color:#6a90b8">Bez bonusa</div>`}
    <button class="btn" style="width:100%;margin-top:6px;font-size:0.65rem"
      onclick="showPanel('formations')">⬛ Promijeni</button>
  `;
}

// ── HANGAR STATUS (desni panel) ──
function updateHangarStatus() {
  const el = document.getElementById('hangarStatus');
  if (!el) return;
  const total   = hangar.reduce((a, h) => a + h.count, 0);
  const designs = hangar.length;
  el.innerHTML = `
    <div style="font-size:0.72rem;color:#6a90b8">
      ${designs === 0
        ? '<span style="color:#6a90b8">🏠 Prazan</span>'
        : `<span style="color:white">${fmt(total)}</span> brodova · <span style="color:#ffcc44">${designs}</span> dizajna`}
    </div>
    ${designs > 0 ? `<button class="btn btn-gold" style="width:100%;margin-top:6px;font-size:0.72rem" onclick="showPanel('hangar')">🏠 Otvori Hangar</button>` : ''}
  `;
}

// ── NAVIGACIJA ──
function showPanel(panelId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (typeof ensureNavGroupVisible === 'function') ensureNavGroupVisible(panelId);

  const panel = document.getElementById(`panel-${panelId}`);
  const btn   = document.querySelector(`[data-panel="${panelId}"]`);
  if (panel) panel.classList.add('active');
  if (btn)   btn.classList.add('active');

  switch(panelId) {
    case 'base':         renderBase();              break;
    case 'recycler':     renderRecycler();          break;
    case 'shipfactory':  renderShipFactory();       break;
    case 'depot':        renderDepot();             break;
    case 'fleet':        renderFleet();             break;
    case 'hangar':       renderHangar();            break;
    case 'designer':     renderDesigner();          break;
    case 'formations':   renderFormations();        break;
    case 'blueprints':   renderBlueprints();        break;
    case 'galaxy':       renderGalaxy();            break;
    case 'instances':    renderInstances();         break;
    case 'pvp':          renderPvP();               break;
    case 'research':     renderResearch();          break;
    case 'missions':     renderMissions();          break;
    case 'espionage':    renderEspionage();         break;
    case 'colonies':     renderColonies();          break;
    case 'artifacts':    renderArtifacts();         break;
    case 'achievements': renderAchievements();      break;
    case 'commander':         renderCommanderPanel();    break;
    case 'commander-cards':   renderCardTabs();           break;
    case 'shop':              renderShop();               break;
  }
}

// ── LOG ──
function addLog(msg) {
  const el = document.getElementById('logPanel');
  if (!el) return;
  const time = new Date().toLocaleTimeString('sr', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  el.innerHTML = `<div style="margin-bottom:3px">[${time}] ${msg}</div>` + el.innerHTML;
  while (el.children.length > 50) el.removeChild(el.lastChild);
}

// ── RIGHT PANEL TAB SWITCH ──
function switchRightTab(tab) {
  const panels = { log: 'logPanel', events: 'eventsPanel', pvp: 'pvpPanel' };
  const tabs   = { log: 'tab-log',  events: 'tab-events',  pvp: 'tab-pvp'  };
  const colors = { log: '#00d4ff',  events: '#ffcc44',      pvp: '#ff3355'  };

  // Sakrij sve, reset svih tabova
  Object.keys(panels).forEach(t => {
    const p = document.getElementById(panels[t]);
    const b = document.getElementById(tabs[t]);
    if (p) p.style.display = 'none';
    if (b) { b.style.borderBottomColor = 'transparent'; b.style.color = '#6a90b8'; }
  });

  // Prikaži aktivni
  const activePanel = document.getElementById(panels[tab]);
  const activeTab   = document.getElementById(tabs[tab]);
  if (activePanel) activePanel.style.display = '';
  if (activeTab)   { activeTab.style.borderBottomColor = colors[tab]; activeTab.style.color = colors[tab]; }

  if (tab === 'events') renderEventsPanel();
  if (tab === 'pvp')    renderPvpPanel();
}

// ── PVP PANEL RENDER ──
function renderPvpPanel() {
  const el = document.getElementById('pvpPanel');
  if (!el) return;

  const history = window._pvpHistory || [];
  const shield  = window._pvpShieldEnd || 0;
  const now     = Math.floor(Date.now() / 1000);
  const shieldActive = shield > now;
  const shieldLeft   = shieldActive ? Math.ceil((shield - now) / 60) : 0;

  // Rating i rank
  const rating = window._pvpRating || 0;
  const rank   = window._pvpRank   || '-';

  el.innerHTML = `
    <!-- Rating strip -->
    <div style="display:flex;gap:6px;margin-bottom:10px">
      <div style="flex:1;text-align:center;background:rgba(255,51,85,0.07);
        border:1px solid rgba(255,51,85,0.2);border-radius:5px;padding:5px 2px">
        <div style="font-size:0.85rem">⚔️</div>
        <div style="font-size:0.75rem;color:#ff3355;font-weight:700">${rating}</div>
        <div style="font-size:0.55rem;color:#6a90b8">Rating</div>
      </div>
      <div style="flex:1;text-align:center;background:rgba(255,204,68,0.07);
        border:1px solid rgba(255,204,68,0.2);border-radius:5px;padding:5px 2px">
        <div style="font-size:0.85rem">🏆</div>
        <div style="font-size:0.75rem;color:#ffcc44;font-weight:700">${rank}</div>
        <div style="font-size:0.55rem;color:#6a90b8">Rank</div>
      </div>
      <div style="flex:1;text-align:center;
        background:${shieldActive ? 'rgba(0,212,255,0.1)' : 'rgba(106,144,184,0.05)'};
        border:1px solid ${shieldActive ? 'rgba(0,212,255,0.3)' : 'rgba(106,144,184,0.15)'};
        border-radius:5px;padding:5px 2px">
        <div style="font-size:0.85rem">${shieldActive ? '🛡️' : '🔓'}</div>
        <div style="font-size:0.65rem;color:${shieldActive ? '#00d4ff' : '#6a90b8'};font-weight:700">
          ${shieldActive ? shieldLeft+'m' : 'OFF'}
        </div>
        <div style="font-size:0.55rem;color:#6a90b8">Shield</div>
      </div>
    </div>

    <!-- Napad/Odbrana statistika -->
    ${(() => {
      const wins   = history.filter(e => e.result === 'victory' && e.role === 'attacker').length;
      const losses = history.filter(e => e.result === 'defeat'  && e.role === 'attacker').length;
      const def_ok = history.filter(e => e.result === 'defeat'  && e.role === 'defender').length;
      const def_ko = history.filter(e => e.result === 'victory' && e.role === 'defender').length;
      if (history.length === 0) return '';
      return `
        <div style="display:flex;gap:4px;margin-bottom:10px;font-size:0.6rem;color:#6a90b8">
          <span style="flex:1;text-align:center">⚔️ ${wins}W/${losses}L napadi</span>
          <span style="flex:1;text-align:center">🛡️ ${def_ok}/${def_ko} odbrane</span>
        </div>`;
    })()}

    <!-- Historija -->
    ${history.length === 0 ? `
      <div style="text-align:center;padding:30px 10px;color:#6a90b8;font-size:0.72rem">
        <div style="font-size:1.5rem;margin-bottom:8px">⚔️</div>
        Nema PvP aktivnosti.<br>
        <span style="font-size:0.6rem;opacity:0.6">Napadi i odbrane će se prikazati ovdje.</span>
      </div>` :
      history.map(ev => {
        const isAttack  = ev.role === 'attacker';
        const isVictory = ev.result === 'victory';
        const col = isVictory ? '#00ff88' : '#ff3355';
        const icon = isAttack
          ? (isVictory ? '⚔️✅' : '⚔️❌')
          : (isVictory ? '🛡️❌' : '🛡️✅');
        const roleLabel = isAttack ? 'Napad' : 'Odbrana';
        const time = new Date(ev.time).toLocaleTimeString('sr', {
          hour: '2-digit', minute: '2-digit'
        });
        return `
          <div style="background:rgba(255,51,85,0.04);border:1px solid ${col}22;
            border-radius:5px;padding:7px 8px;margin-bottom:5px;
            display:flex;align-items:center;gap:8px">
            <div style="font-size:1.1rem;flex-shrink:0">${icon}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:0.7rem;font-weight:700;color:${col}">
                ${roleLabel} — ${isVictory ? 'POBJEDA' : 'PORAZ'}
              </div>
              <div style="font-size:0.6rem;color:#8ab0cc;margin-top:1px">
                vs ${ev.opponent || 'Nepoznat'}
                ${ev.ratingChange ? `<span style="color:${ev.ratingChange > 0 ? '#00ff88' : '#ff3355'};margin-left:5px">
                  ${ev.ratingChange > 0 ? '+' : ''}${ev.ratingChange} rating</span>` : ''}
              </div>
            </div>
            <div style="font-size:0.55rem;color:#6a90b8;flex-shrink:0">${time}</div>
          </div>`;
      }).join('')
    }
  `;
}

// ── EVENTS PANEL RENDER ──
function renderEventsPanel() {
  const el = document.getElementById('eventsPanel');
  if (!el) return;

  const history = window._eventHistory || [];

  if (history.length === 0) {
    el.innerHTML = `
      <div style="text-align:center;padding:30px 10px;color:#6a90b8;font-size:0.72rem">
        <div style="font-size:1.5rem;margin-bottom:8px">🌌</div>
        Nema zabilježenih galaktičkih evenata.<br>
        <span style="font-size:0.6rem;opacity:0.6">Eventi se javljaju nasumično tokom igre.</span>
      </div>`;
    return;
  }

  // Broji po tipu
  const pos = history.filter(e => e.type === 'positive').length;
  const neg = history.filter(e => e.type === 'negative').length;
  const neu = history.filter(e => e.type === 'neutral').length;

  el.innerHTML = `
    <!-- Mini statistika -->
    <div style="display:flex;gap:6px;margin-bottom:10px">
      <div style="flex:1;text-align:center;background:rgba(0,255,136,0.07);
        border:1px solid rgba(0,255,136,0.2);border-radius:5px;padding:5px 2px">
        <div style="font-size:0.85rem">🌟</div>
        <div style="font-size:0.75rem;color:#00ff88;font-weight:700">${pos}</div>
        <div style="font-size:0.55rem;color:#6a90b8">pozit.</div>
      </div>
      <div style="flex:1;text-align:center;background:rgba(255,51,85,0.07);
        border:1px solid rgba(255,51,85,0.2);border-radius:5px;padding:5px 2px">
        <div style="font-size:0.85rem">⚠️</div>
        <div style="font-size:0.75rem;color:#ff3355;font-weight:700">${neg}</div>
        <div style="font-size:0.55rem;color:#6a90b8">negat.</div>
      </div>
      <div style="flex:1;text-align:center;background:rgba(106,144,184,0.07);
        border:1px solid rgba(106,144,184,0.2);border-radius:5px;padding:5px 2px">
        <div style="font-size:0.85rem">ℹ️</div>
        <div style="font-size:0.75rem;color:#6a90b8;font-weight:700">${neu}</div>
        <div style="font-size:0.55rem;color:#6a90b8">neutral.</div>
      </div>
    </div>

    <!-- Lista evenata -->
    ${history.map(ev => {
      const bgColor  = ev.type === 'positive' ? 'rgba(0,255,136,0.05)' :
                       ev.type === 'negative' ? 'rgba(255,51,85,0.05)'  :
                       'rgba(106,144,184,0.05)';
      const time = new Date(ev.time).toLocaleTimeString('sr', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      return `
        <div style="background:${bgColor};border:1px solid ${ev.color}22;
          border-radius:5px;padding:7px 8px;margin-bottom:5px;
          display:flex;align-items:center;gap:8px">
          <div style="font-size:1.3rem;flex-shrink:0">${ev.icon}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:0.7rem;font-weight:700;color:${ev.color};
              white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${ev.name}</div>
            <div style="font-size:0.6rem;color:#8ab0cc;margin-top:1px">${ev.result}</div>
          </div>
          <div style="font-size:0.55rem;color:#6a90b8;flex-shrink:0">${time}</div>
        </div>`;
    }).join('')}
  `;
}

// ── MODAL ──
function openModal(title, body, actions = []) {
  const modal  = document.getElementById('modal');
  const mTitle = document.getElementById('mTitle');
  const mBody  = document.getElementById('mBody');
  const mAct   = document.getElementById('mActions');
  if (!modal) return;

  if (mTitle) mTitle.textContent = title;
  if (mBody)  mBody.innerHTML = body;
  if (mAct) {
    mAct.innerHTML = '';
    mAct.style.display = 'flex';
    if (actions.length === 0) {
      const btn = document.createElement('button');
      btn.className   = 'btn';
      btn.textContent = 'Zatvori';
      btn.onclick     = closeModal;
      mAct.appendChild(btn);
    } else {
      actions.forEach(a => {
        const btn = document.createElement('button');
        btn.className   = 'btn ' + (a.cls || '');
        btn.textContent = a.label;
        btn.onclick     = a.fn;
        mAct.appendChild(btn);
      });
    }
  }
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

document.getElementById('modal')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ── MISSIONS — definisano u js/systems/missions.js ──

// ── KOLONIJE — delegira na colonies.js ──
function renderColonies() {
  if (typeof window !== 'undefined' && typeof colonizePlanet === 'function') {
    // colonies.js je učitan — pozovi njegovu funkciju
    const el = document.getElementById('coloniesContent');
    if (!el) return;
    // renderColonies je definisan u colonies.js, ali ovdje je placeholder
    // colonies.js override-uje ovu funkciju
  }
  const el = document.getElementById('coloniesContent');
  if (el) el.innerHTML = '<div class="card" style="text-align:center;color:#6a90b8;padding:30px">🪐 Učitavanje kolonija...</div>';
}

// ── HANGAR render (poziva designer.js funkciju) ──
function renderHangar() {
  const el = document.getElementById('hangarContent');
  if (!el) return;
  el.innerHTML = typeof renderHangarList === 'function'
    ? renderHangarList()
    : '<div class="card" style="text-align:center;color:#6a90b8;padding:30px">🏠 Hangar — u razvoju</div>';
  updateHangarStatus();
}