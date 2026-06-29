// ============================================================
// HIVE GALAXY — js/systems/instances.js
// Instance sistem — odabir, borba, nagrade
// ============================================================

// ── DIFFICULTY MODOVI ──
const INST_DIFFICULTY_MODES = {
  easy: {
    label:       '🌿 Easy',
    color:       '#00ff88',
    cmdLevel:    [0, 25],
    commanders:  1,
    bpTier:      'I',
    enemyMult:   0.7,
    rewardMult:  1.0,
    energyMult:  0.8,
    keyCost:     1,
    desc:        'Komandir Lv 0-25 · 1 komandant · Blueprint Tier I',
  },
  normal: {
    label:       '⚔️ Normal',
    color:       '#ffcc44',
    cmdLevel:    [25, 50],
    commanders:  3,
    bpTier:      'II',
    enemyMult:   1.0,
    rewardMult:  1.5,
    energyMult:  1.0,
    keyCost:     1,
    desc:        'Komandir Lv 25-50 · do 3 komandanta · Blueprint Tier II',
  },
  nightmare: {
    label:       '💀 Nightmare',
    color:       '#ff8833',
    cmdLevel:    [50, 75],
    commanders:  6,
    bpTier:      'III',
    enemyMult:   1.5,
    rewardMult:  2.5,
    energyMult:  1.2,
    keyCost:     2,
    desc:        'Komandir Lv 50-75 · do 6 komandanata · Blueprint Tier III',
  },
  hell: {
    label:       '🔥 Hell',
    color:       '#ff3355',
    cmdLevel:    [75, 100],
    commanders:  9,
    bpTier:      'IV',
    enemyMult:   2.5,
    rewardMult:  5.0,
    energyMult:  1.5,
    keyCost:     3,
    desc:        'Komandir Lv 75-100 · do 9 komandanata · Blueprint Tier IV/Legendary',
  },
};

// ── BLUEPRINT TIER DROPOVI PO MODU ──
const BP_TIER_DROPS = {
  I:   { rarity: ['C'],       label: 'Tier I',       color: '#6a90b8' },
  II:  { rarity: ['C', 'R'],  label: 'Tier II',      color: '#00ff88' },
  III: { rarity: ['R', 'E'],  label: 'Tier III',     color: '#aa44ff' },
  IV:  { rarity: ['E', 'L'],  label: 'Tier IV',      color: '#ffcc44' },
};

// ── STATE ──
let _instTab          = 'standard';
let _instFilter       = 'available';
let _instDifficultyMode = 'easy'; // easy | normal | nightmare | hell

// ── PROVJERA DOSTUPNOSTI MODA ──
function isDifficultyModeAvailable(mode) {
  const cmdLvl = commander.level;
  switch(mode) {
    case 'easy':      return true;
    case 'normal':    return cmdLvl >= 25;
    case 'nightmare': return cmdLvl >= 50;
    case 'hell':      return cmdLvl >= 75;
    default:          return false;
  }
}

// ── ENERGIJA PO INSTANCI (skalirana po modu) ──
function getInstanceEnergyCost(inst) {
  const mode = INST_DIFFICULTY_MODES[_instDifficultyMode] || INST_DIFFICULTY_MODES.easy;
  const diff = inst.difficulty || 1;
  // Energy Lv100 — nema gubitka energije u instanci
  if (typeof isEnergyFreeInstance === 'function' && isEnergyFreeInstance()) return 0;
  return Math.floor(diff * 100 * mode.energyMult);
}

// ── MIN POWER SKALIRAN PO MODU ──
function getInstanceMinPower(inst) {
  // Mode multiplikator — Easy je baza, svaki mod skalira gore
  const modeMult = { easy: 1, normal: 3, nightmare: 6, hell: 9 }[_instDifficultyMode] || 1;

  // Koristi inst.min_power kao easy bazu i skaliraj modom
  if (inst.min_power != null) {
    return Math.round(inst.min_power * modeMult / 1000) * 1000;
  }

  // Boss instance — baza po tipu × mod
  if (['boss_rare','boss_epic','boss_legendary','boss_master','boss'].includes(inst.type)) {
    const bossEasyBase = { boss_rare: 1500000, boss_epic: 4500000, boss_legendary: 13500000, boss_master: 40000000, boss: 10000000 };
    return Math.round((bossEasyBase[inst.type] || 1500000) * modeMult / 1000) * 1000;
  }

  // Constellation — fiksno
  if (inst.type === 'constellation') {
    const constBase = { const_1: 5000000, const_2: 10000000, const_3: 20000000 };
    return Math.round((constBase[inst.id] || 5000000) * modeMult / 1000) * 1000;
  }

  // Restricted / trial / humanoid / pirate — skalira po difficulty (1-10), raste +150k po diffu
  // diff 1→67k, diff 4→517k, diff 7→967k, diff 10→1.417M (Easy) — ista logika kao standard
  const diff      = inst.difficulty || 1;
  const easyPow   = 67000 + (diff - 1) * 150000;
  return Math.round(easyPow * modeMult / 1000) * 1000;
}

// ── RENDER INSTANCE PANELA ──
function renderInstances() {
  const el = document.getElementById('instanceContent');
  if (!el) return;

  const playerPower = calcFleetTotalPower();
  const mode        = INST_DIFFICULTY_MODES[_instDifficultyMode];
  const bpTier      = BP_TIER_DROPS[mode.bpTier];

  el.innerHTML = `
    <!-- ── DIFFICULTY MOD DUGMAD ── -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">
      ${Object.entries(INST_DIFFICULTY_MODES).map(([key, m]) => {
        const isActive  = _instDifficultyMode === key;
        const available = isDifficultyModeAvailable(key);
        const locked    = !available;
        return `
          <div style="
            background:${isActive ? m.color + '18' : 'rgba(0,0,0,0.3)'};
            border:2px solid ${isActive ? m.color : locked ? '#1a2540' : m.color + '44'};
            border-radius:8px;
            padding:10px 8px;
            text-align:center;
            cursor:${locked ? 'not-allowed' : 'pointer'};
            opacity:${locked ? 0.4 : 1};
            transition:all 0.2s;
          " onclick="${locked ? '' : `_instDifficultyMode='${key}';renderInstances()`}">
            <div style="font-size:1.1rem;margin-bottom:4px">${m.label.split(' ')[0]}</div>
            <div style="font-size:0.75rem;font-weight:700;color:${isActive ? m.color : locked ? '#6a90b8' : 'white'}">
              ${m.label.split(' ').slice(1).join(' ')}
            </div>
            <div style="font-size:0.55rem;color:${locked ? '#444' : '#6a90b8'};margin-top:3px;line-height:1.4">
              ${locked ? `🔒 Komandir Lv${m.cmdLevel[0]}` : `BP ${BP_TIER_DROPS[m.bpTier].label}`}
            </div>
            ${isActive ? `<div style="width:100%;height:2px;background:${m.color};border-radius:2px;margin-top:6px"></div>` : ''}
          </div>`;
      }).join('')}
    </div>

    <!-- ── INFO BAR AKTIVNOG MODA ── -->
    <div class="card" style="margin-bottom:16px;border-color:${mode.color}44;
      background:${mode.color}08">
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <div style="flex:1">
          <div style="font-size:0.65rem;color:#6a90b8;letter-spacing:2px;margin-bottom:4px">AKTIVAN MOD</div>
          <div style="font-size:0.9rem;font-weight:700;color:${mode.color};font-family:'Orbitron',monospace">
            ${mode.label}
          </div>
          <div style="font-size:0.62rem;color:#6a90b8;margin-top:2px">${mode.desc}</div>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <div style="text-align:center">
            <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:2px">BLUEPRINT</div>
            <div style="font-size:0.78rem;font-weight:700;color:${bpTier.color}">${bpTier.label}</div>
            <div style="font-size:0.55rem;color:${bpTier.color}">${bpTier.rarity.join(', ')}</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:2px">NAGRADE</div>
            <div style="font-size:0.78rem;font-weight:700;color:#00ff88">×${mode.rewardMult}</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:2px">KEY COST</div>
            <div style="font-size:0.78rem;font-weight:700;color:#ffcc44">${mode.keyCost}🗝️</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:2px">KOMANDANTI</div>
            <div style="font-size:0.78rem;font-weight:700;color:#aa44ff">max ${mode.commanders}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── PLAYER POWER + FILTER ── -->
    <div class="card" style="margin-bottom:16px;display:flex;gap:24px;align-items:center">
      <div style="text-align:center">
        <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:2px">FLOTA MOĆ</div>
        <div style="font-size:1.3rem;font-family:'Orbitron',monospace;color:#00d4ff">
          ${fmt(playerPower)}
        </div>
      </div>
      <div style="flex:1">
        <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:4px">
          Aktivnih slotova: ${getAllDeployedSlots().length} / 9
        </div>
        ${getAllDeployedSlots().length === 0
          ? `<div style="font-size:0.72rem;color:#ff3355">⚠️ Flota je prazna! Rasporedi brodove iz Hangara.</div>`
          : `<div style="font-size:0.72rem;color:#00ff88">✅ Flota spremna za borbu</div>`}
      </div>
      <div style="display:flex;gap:6px">
        ${['available','all','completed'].map(f => `
          <button class="btn ${_instFilter===f?'btn-g':''}" style="font-size:0.65rem;padding:4px 10px"
            onclick="_instFilter='${f}';renderInstances()">
            ${f==='available'?'Dostupne':f==='all'?'Sve':'✅ Završene'}
          </button>`).join('')}
      </div>
    </div>

    <!-- ── TIP TABOVI ── -->
    <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap">
      ${[
        { key: 'standard',      label: '🌐 Standard',       color: '#4488ff' },
        { key: 'restricted',    label: '🔒 Restricted',     color: '#aa44ff' },
        { key: 'trial',         label: '⚔️ Trial',           color: '#ffaa00' },
        { key: 'humanoid',      label: '👤 Humanoid',       color: '#ff6644' },
        { key: 'pirate',        label: '☠️ Pirate',        color: '#884400' },
        { key: 'constellation', label: '⭐ Constellation',  color: '#ffcc33' },
        { key: 'boss_rare',     label: '💀 Rare Boss',      color: '#4488ff' },
        { key: 'boss_epic',     label: '👾 Epic Boss',      color: '#aa44ff' },
        { key: 'boss_legendary',label: '🌟 Legendary Boss', color: '#ffaa00' },
        { key: 'boss_master',   label: '👑 Master Boss',    color: '#ffffff' },
        { key: 'boss',          label: '💥 Boss Event',     color: '#ff0044' },
      ].map(t => `
        <button class="btn ${_instTab===t.key?'btn-gold':''}"
          style="font-size:0.72rem;padding:5px 12px;
            ${_instTab===t.key ? 'border-color:'+t.color+';color:'+t.color : ''}"
          onclick="_instTab='${t.key}';renderInstances()">
          ${t.label}
        </button>`).join('')}
    </div>

    <!-- ── INSTANCE GRID ── -->
    <div id="instanceGrid">
      ${renderInstanceGrid(playerPower)}
    </div>
  `;
}

// ── RENDER INSTANCE GRID ──
function renderInstanceGrid(playerPower) {
  const mode     = INST_DIFFICULTY_MODES[_instDifficultyMode];
  let instances  = getActiveInstances().filter(i => i.type === _instTab);
  const minPower = (inst) => getInstanceMinPower(inst);

  if (_instFilter === 'available') {
    instances = instances.filter(i => playerPower >= minPower(i) || minPower(i) === 0);
  } else if (_instFilter === 'completed') {
    instances = instances.filter(i => getInstanceProgress(i.id + '_' + _instDifficultyMode).completed);
  }

  if (instances.length === 0) {
    return `<div class="card" style="text-align:center;color:#6a90b8;padding:30px">
      ${_instFilter === 'available'
        ? `🔒 Nema dostupnih instanci za tvoju flotu moć na <span style="color:${mode.color}">${mode.label}</span>. Oj×Taj flotu!`
        : '📋 Nema rezultata.'}
    </div>`;
  }

  return `<div class="grid-3">` + instances.map(inst => renderInstanceCard(inst, playerPower)).join('') + '</div>';
}

// ── INSTANCE KARTICA ──
function renderInstanceCard(inst, playerPower) {
  const mode       = INST_DIFFICULTY_MODES[_instDifficultyMode];
  const bpTier     = BP_TIER_DROPS[mode.bpTier];
  const progKey    = inst.id + '_' + _instDifficultyMode;
  const prog       = getInstanceProgress(progKey);
  const scaledPow  = getInstanceMinPower(inst);
  const locked     = playerPower < scaledPow;
  const diff       = DIFFICULTY[inst.difficulty] || DIFFICULTY[1];
  const typeInfo   = INSTANCE_TYPES[inst.type] || {};
  const isTrial    = inst.type === 'trial';
  const energyCost = getInstanceEnergyCost(inst);
  const hasEnergy  = R.energy >= energyCost;

  // Nagrade preview skalirane
  const metalMin   = Math.floor(inst.resources.metal[0]   * mode.rewardMult);
  const metalMax   = Math.floor(inst.resources.metal[1]   * mode.rewardMult);
  const crystalMin = Math.floor(inst.resources.crystal[0] * mode.rewardMult);
  const crystalMax = Math.floor(inst.resources.crystal[1] * mode.rewardMult);

  return `
    <div class="card" style="
      border-color:${locked ? 'rgba(255,255,255,0.06)' : mode.color + '33'};
      opacity:${locked ? 0.55 : 1};
      position:relative">

      <!-- Difficulty badge -->
      <div style="position:absolute;top:8px;left:8px;font-size:0.55rem;
        background:${mode.color}22;border:1px solid ${mode.color}66;
        color:${mode.color};padding:1px 5px;border-radius:3px;letter-spacing:1px">
        ${mode.label.split(' ').slice(1).join(' ').toUpperCase()}
      </div>

      ${locked ? `<div style="position:absolute;top:8px;right:8px;font-size:1.2rem">🔒</div>` : ''}
      ${prog.completed ? `
        <div style="position:absolute;top:8px;right:8px;font-size:0.65rem;
          background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);
          color:#00ff88;padding:2px 6px;border-radius:4px">✅ ${prog.clear_count}x</div>` : ''}
      ${prog.bpCompleted ? `
        <div style="position:absolute;top:34px;right:8px;font-size:0.65rem;
          background:rgba(255,204,68,0.1);border:1px solid rgba(255,204,68,0.3);
          color:#ffcc44;padding:2px 6px;border-radius:4px">📋 BP ✅</div>` : ''}

      <!-- Header -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;margin-top:18px">
        <div style="font-size:1.5rem">${typeInfo.icon || '🌌'}</div>
        <div>
          <div style="font-size:0.85rem;font-weight:700;color:${typeInfo.color || 'white'}">
            ${dn(inst)}
          </div>
          <div style="font-size:0.62rem;color:#6a90b8">${dn(typeInfo)}</div>
        </div>
      </div>

      <!-- Težina -->
      <div style="font-size:0.72rem;margin-bottom:6px">
        ${dl(diff)}
        <span style="font-size:0.6rem;color:#6a90b8;margin-left:6px">Težina ${inst.difficulty}/10</span>
      </div>

      <!-- Boss -->
      <div style="font-size:0.68rem;color:#6a90b8;margin-bottom:6px">
        👾 Boss: <span style="color:white">${t(inst.bossKey || '') || inst.boss}</span>
      </div>
      ${({'boss_rare':3,'boss_epic':6,'boss_legendary':10,'boss_master':15}[inst.type]) ? `
      <div style="font-size:0.65rem;color:#00ff88;margin-bottom:6px">
        🎁 Garant drop: <strong>${{'boss_rare':3,'boss_epic':6,'boss_legendary':10,'boss_master':15}[inst.type]} itema</strong>
      </div>` : ''}

      <!-- Enemy Komandiri -->
      ${(() => {
        const cmdRarityMap = { easy: 'C', normal: 'R', nightmare: 'E', hell: 'L' };
        const cmdCountMap  = { easy: 1,   normal: 3,   nightmare: 6,   hell: 9   };
        const cmdRarity    = cmdRarityMap[_instDifficultyMode] || 'C';
        const cmdCount     = cmdCountMap[_instDifficultyMode]  || 1;
        const cmdLevel     = getInstCmdLevel(inst.number);
        const rarColors    = { C:'#ffdd00', R:'#4488ff', E:'#aa44ff', L:'#ff8800' };
        const rarCol       = rarColors[cmdRarity] || '#aaa';
        const stars        = '⭐'.repeat(inst.difficulty || 1);

        // Pokupi sve komandire (izbjegni duplikate)
        const picked = [];
        let totalAtk = 0, totalHp = 0;
        const lvlMult = Math.min(1.0, cmdLevel / 100);
        for (let i = 0; i < cmdCount; i++) {
          const seed = _instHashCode(inst.id + '_cmd_' + _instDifficultyMode + '_' + i);
          const cmd  = pickEnemyCommander(cmdRarity, seed);
          if (!cmd || picked.find(c => c.id === cmd.id)) continue;
          picked.push(cmd);
          const b1 = parsePassiveBonus(cmd.passive?.desc);
          const b2 = parsePassiveBonus(cmd.passive2?.desc);
          totalAtk += b1.atk + b2.atk;
          totalHp  += b1.hp  + b2.hp;
        }
        if (!picked.length) return '';
        const atkB = Math.round(totalAtk * lvlMult);
        const hpB  = Math.round(totalHp  * lvlMult);
        const bonusTxt = [atkB > 0 ? `+${atkB}% DPS` : '', hpB > 0 ? `+${hpB}% HP` : ''].filter(Boolean).join(' · ');
        return `
        <div style="background:${rarCol}10;border:1px solid ${rarCol}33;border-radius:5px;
          padding:5px 7px;margin-bottom:6px;font-size:0.62rem">
          <div style="color:${rarCol};font-weight:700;margin-bottom:4px">
            ⚔️ Komandiri (${picked.length})
            <span style="font-size:0.55rem;opacity:0.7;margin-left:4px">Lv.${cmdLevel} ${stars}</span>
            ${bonusTxt ? `<span style="font-size:0.58rem;color:${rarCol};margin-left:6px">${bonusTxt}</span>` : ''}
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:3px">
            ${picked.map(cmd => `
              <span style="background:${rarCol}15;border:1px solid ${rarCol}44;border-radius:3px;
                padding:1px 6px;font-size:0.58rem;color:${rarCol}">
                ${cmd.icon} ${cmd.name}
              </span>`).join('')}
          </div>
        </div>`;
      })()}

      ${isTrial ? `
        <div style="font-size:0.65rem;color:#ffcc44;margin-bottom:6px">
          ⏱️ Limit: ${inst.time_limit_minutes} min
          ${prog.best_rank ? ` · Best: <strong>${prog.best_rank}</strong>` : ''}
        </div>` : ''}

      <!-- Min power -->
      <div style="font-size:0.62rem;margin-bottom:4px;
        color:${locked ? '#ff3355' : playerPower >= scaledPow * 1.5 ? '#00ff88' : '#ffcc44'}">
        ⚡ Min moć: ${fmt(scaledPow)} ${locked ? '(nedovoljno)' : ''}
      </div>

      <!-- Energija -->
      <div style="font-size:0.62rem;margin-bottom:6px;color:${hasEnergy ? '#6a90b8' : '#ff3355'}">
        ⚡ ${energyCost} MWh ${hasEnergy ? '' : '(nedovoljno)'}
      </div>

      <!-- BP tier badge -->
      <div style="display:flex;align-items:center;gap:4px;margin-bottom:8px">
        <div style="font-size:0.58rem;background:${bpTier.color}18;border:1px solid ${bpTier.color}44;
          color:${bpTier.color};padding:2px 6px;border-radius:3px">
          📋 ${bpTier.label} · ${bpTier.rarity.join('/')}
        </div>
      </div>

      <!-- Nagrade preview -->
      <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:8px;
        font-family:'Share Tech Mono',monospace;line-height:1.6">
        🪙 ${fmt(metalMin)}-${fmt(metalMax)}
        💎 ${fmt(crystalMin)}-${fmt(crystalMax)}
      </div>

      <!-- Dugme -->
      <button class="btn ${!locked && hasEnergy ? 'btn-g' : ''}"
        style="width:100%;font-size:0.75rem;border-color:${!locked && hasEnergy ? mode.color : ''}"
        onclick="${locked ? '' : `openInstanceModal('${inst.id}')`}"
        ${locked || !hasEnergy ? 'disabled' : ''}>
        ${locked
          ? `🔒 Treba ${fmt(scaledPow)} moći`
          : !hasEnergy
            ? `⚡ Treba ${energyCost} MWh`
            : isTrial ? '⚔️ Pokreni Trial' : '⚔️ Napadni'}
      </button>
    </div>`;
}

// ── DROP PREVIEW ──
function getDropPreview(inst) {
  const modeName   = _instDifficultyMode || 'easy';
  const mode       = INST_DIFFICULTY_MODES[modeName];
  const bpTier     = BP_TIER_DROPS[mode.bpTier];

  const rarityColor = { C: '#ffdd00', R: '#4488ff', E: '#aa44ff', L: '#ffaa00' };
  const rarityName  = { C: 'Common',  R: 'Rare',    E: 'Epic',    L: 'Legendary' };

  const FRAG_CHANCE = {
    easy:      { C: 60 },
    normal:    { C: 70, R: 40 },
    nightmare: { C: 80, R: 60, E: 30 },
    hell:      { C: 90, R: 75, E: 50, L: 20 },
  };
  const BP_CHANCE = {
    easy:      {},
    normal:    { C: 20, R: 8 },
    nightmare: { C: 35, R: 18, E: 6 },
    hell:      { C: 50, R: 30, E: 15, L: 5 },
  };

  const fragChance = FRAG_CHANCE[modeName] || {};
  const bpChance   = BP_CHANCE[modeName]   || {};

  let html = '';

  // Fragmenti
  html += `<div style="font-size:0.62rem;color:#6a90b8;letter-spacing:1px;margin-bottom:4px">⚡ FRAGMENTI</div>`;
  html += `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">`;
  Object.entries(fragChance).forEach(([r, pct]) => {
    html += `<span style="background:${rarityColor[r]}18;border:1px solid ${rarityColor[r]}44;
      border-radius:4px;padding:2px 8px;font-size:0.65rem;color:${rarityColor[r]}">
      ${rarityName[r]} ${pct}%</span>`;
  });
  html += `</div>`;

  // Blueprinti
  if (Object.keys(bpChance).length > 0) {
    html += `<div style="font-size:0.62rem;color:#6a90b8;letter-spacing:1px;margin-bottom:4px">⚡ BLUEPRINT DROP</div>`;
    html += `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">`;
    Object.entries(bpChance).forEach(([r, pct]) => {
      html += `<span style="background:${rarityColor[r]}18;border:1px solid ${rarityColor[r]}44;
        border-radius:4px;padding:2px 8px;font-size:0.65rem;color:${rarityColor[r]}">
        ${rarityName[r]} ${pct}%</span>`;
    });
    html += `</div>`;
  } else {
    html += `<div style="font-size:0.62rem;color:#6a90b8">⚡ Blueprinti ne padaju na <span style="color:#00ff88">Easy</span></div>`;
  }

  return html;
}

// ── OTVORI INSTANCE MODAL ──
function openInstanceModal(instId) {
  const inst       = getActiveInstances().find(i => i.id === instId);
  if (!inst) return;

  const mode       = INST_DIFFICULTY_MODES[_instDifficultyMode];
  const bpTier     = BP_TIER_DROPS[mode.bpTier];
  const fleetSlots = getAllDeployedSlots();
  const progKey    = inst.id + '_' + _instDifficultyMode;
  const prog       = getInstanceProgress(progKey);

  if (fleetSlots.length === 0) {
    toast('⚠️ Flota je prazna! Rasporedi brodove iz Hangara.', 'warn');
    return;
  }

  // Upozorenje ako su svi dropovi već nađeni
  const _modeOrder = ['easy', 'normal', 'nightmare', 'hell'];
  const _curModeIdx = _modeOrder.indexOf(_instDifficultyMode || 'easy');
  const _visibleChance = (inst.drops?.chance||[]).filter(c => !c.minMode || _modeOrder.indexOf(c.minMode) <= _curModeIdx);
  const _allDropItems = [...(inst.drops?.guaranteed||[]), ..._visibleChance.map(c=>c.item)];
  const _allFound = _allDropItems.length > 0 && _allDropItems.every(id => ownedBlueprints[id]);

  const typeInfo   = INSTANCE_TYPES[inst.type] || {};
  const diff       = DIFFICULTY[inst.difficulty] || DIFFICULTY[1];
  const playerPower = calcFleetTotalPower();
  const energyCost = getInstanceEnergyCost(inst);

  const metalMin   = Math.floor(inst.resources.metal[0]   * mode.rewardMult);
  const metalMax   = Math.floor(inst.resources.metal[1]   * mode.rewardMult);
  const crystalMin = Math.floor(inst.resources.crystal[0] * mode.rewardMult);
  const crystalMax = Math.floor(inst.resources.crystal[1] * mode.rewardMult);
  const he3Min     = Math.floor(inst.resources.he3[0]     * mode.rewardMult);
  const he3Max     = Math.floor(inst.resources.he3[1]     * mode.rewardMult);

  const body = `
    <!-- All found upozorenje -->
    ${_allFound ? `<div style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.4);
      border-radius:6px;padding:10px 14px;margin-bottom:12px;display:flex;align-items:center;gap:10px">
      <div style="font-size:1.5rem">✅</div>
      <div>
        <div style="font-size:0.78rem;font-weight:700;color:#00ff88">Svi dropovi pronađeni!</div>
        <div style="font-size:0.62rem;color:#6a90b8">Možeš i dalje igrati za resurse, ali novi blueprinti neće padati.</div>
      </div>
    </div>` : ''}

    <!-- Difficulty banner -->
    <div style="background:${mode.color}18;border:1px solid ${mode.color}44;border-radius:6px;
      padding:8px 12px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
      <div style="font-size:1.2rem">${mode.label.split(' ')[0]}</div>
      <div>
        <div style="font-size:0.78rem;font-weight:700;color:${mode.color}">${mode.label}</div>
        <div style="font-size:0.6rem;color:#6a90b8">${mode.desc}</div>
      </div>
      <div style="margin-left:auto;text-align:right">
        <div style="font-size:0.6rem;color:#6a90b8">Blueprint</div>
        <div style="font-size:0.72rem;color:${bpTier.color};font-weight:700">${bpTier.label}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">

      <!-- Lijevo: Info -->
      <div>
        <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:8px">INSTANCA INFO</div>
        <div style="font-size:0.68rem;line-height:1.8;font-family:'Share Tech Mono',monospace">
          <div>⚡ Tip: <span style="color:${typeInfo.color||'white'}">${dn(typeInfo)}</span></div>
          <div>⚡ Težina: ${dl(diff)}</div>
          <div>👾 Boss: <span style="color:white">${t(inst.bossKey || '') || inst.boss}</span></div>
          ${({'boss_rare':3,'boss_epic':6,'boss_legendary':10,'boss_master':15}[inst.type]) ? `<div>🎁 Garant drop: <span style="color:#00ff88;font-weight:700">${{'boss_rare':3,'boss_epic':6,'boss_legendary':10,'boss_master':15}[inst.type]} itema</span></div>` : ''}
          <div>⚡ Min moć: ${fmt(getInstanceMinPower(inst))}</div>
          <div>⚡ Energija: ${energyCost} MWh</div>
          <div>✅ Clearova: ${prog.clear_count}</div>
          <div style="font-size:0.55rem;color:#00d4ff;margin-top:2px">${t('instance.milestone100.progress', { count: prog.clear_count % 100 })}</div>
          ${prog.best_rank ? `<div>⚡ 🏆 Best rank: ${prog.best_rank}</div>` : ''}
        </div>

        <div style="margin-top:12px;font-size:0.72rem;color:#6a90b8;margin-bottom:6px">NAGRADE ×${mode.rewardMult}</div>
        <div style="font-size:0.62rem;font-family:'Share Tech Mono',monospace;line-height:1.6">
          <div>🔩 ${fmt(metalMin)}-${fmt(metalMax)} metal</div>
          <div>💎 ${fmt(crystalMin)}-${fmt(crystalMax)} crystal</div>
          <div>⛽ ${fmt(he3Min)}-${fmt(he3Max)} he3</div>
          <div style="margin-top:8px">
            ${getDropPreview(inst)}
          </div>
        </div>

        <!-- Specifični item dropovi -->
        ${(() => {
          const rarCol = { C:'#ffdd00', R:'#4488ff', E:'#aa44ff', L:'#ffaa00' };
          const guaranteed = inst.drops?.guaranteed || [];
          const chance     = inst.drops?.chance     || [];
          if (guaranteed.length === 0 && chance.length === 0) return '';

          let html = `<div style="margin-top:12px;font-size:0.72rem;color:#6a90b8;margin-bottom:6px;letter-spacing:1px">ITEM DROPOVI</div>`;

          const _resolveItemName = id => {
            if (id.startsWith('art_')) {
              const art = typeof ARTIFACTS_DATA !== 'undefined' ? ARTIFACTS_DATA.find(a => a.id === id) : null;
              return art ? art.name + ' fragment' : id;
            }
            return typeof getBpName === 'function' ? getBpName(id) : id;
          };
          const _resolveItemRarity = id => {
            if (id.startsWith('art_')) {
              const art = typeof ARTIFACTS_DATA !== 'undefined' ? ARTIFACTS_DATA.find(a => a.id === id) : null;
              return art ? art.rarity : 'C';
            }
            return typeof getBlueprintRarity === 'function' ? getBlueprintRarity(id) : 'C';
          };

          if (guaranteed.length > 0) {
            html += `<div style="font-size:0.6rem;color:#00ff88;margin-bottom:4px">✅ GARANTOVANO</div>`;
            guaranteed.forEach(id => {
              const name = _resolveItemName(id);
              const rar  = _resolveItemRarity(id);
              const col  = rarCol[rar] || '#aaa';
              const owned = ownedBlueprints?.[id];
              html += `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;
                padding:3px 6px;background:rgba(0,255,136,0.04);border-radius:3px;
                border-left:2px solid ${col}44">
                <span style="color:${col};font-size:0.58rem;font-weight:700">[${rar}]</span>
                <span style="color:${owned ? '#6a90b8' : 'white'};text-decoration:${owned ? 'line-through' : 'none'}">${name}</span>
                ${owned ? `<span style="color:#00ff88;font-size:0.55rem;margin-left:auto">✅</span>` : ''}
              </div>`;
            });
          }

          const modeOrd = ['easy','normal','nightmare','hell'];
          const curModeIdx = modeOrd.indexOf(_instDifficultyMode || 'easy');
          const visChance = chance.filter(c => !c.minMode || modeOrd.indexOf(c.minMode) <= curModeIdx);
          if (visChance.length > 0) {
            html += `<div style="font-size:0.6rem;color:#6a90b8;margin-top:6px;margin-bottom:4px">🎲 ŠANSA</div>`;
            visChance.forEach(({item: id, rate, minMode}) => {
              const name = _resolveItemName(id);
              const rar  = _resolveItemRarity(id);
              const col  = rarCol[rar] || '#aaa';
              const owned = ownedBlueprints?.[id];
              html += `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;
                padding:3px 6px;background:rgba(255,255,255,0.02);border-radius:3px;
                border-left:2px solid ${col}33">
                <span style="color:${col};font-size:0.58rem;font-weight:700">[${rar}]</span>
                <span style="color:${owned ? '#6a90b8' : 'white'};text-decoration:${owned ? 'line-through' : 'none'};flex:1">${name}</span>
                <span style="color:#ffcc44;font-size:0.6rem;font-weight:700">${rate}%</span>
                ${owned ? `<span style="color:#00ff88;font-size:0.55rem">✅</span>` : ''}
              </div>`;
            });
          }

          return html;
        })()}
      </div>

      <!-- Desno: Flota -->
      <div>
        <div style="font-size:0.72rem;color:#6a90b8;margin-bottom:8px">TVOJA FLOTA</div>
        ${fleetSlots.map(slot => {
          const ship  = getShipById(slot.ship_id);
          const stats = calcSlotStats(slot);
          const cls   = SHIP_CLASSES[getShipClass(slot.ship_id)];
          return `
            <div style="display:flex;justify-content:space-between;align-items:center;
              padding:5px 8px;background:rgba(0,0,0,0.3);border-radius:4px;margin-bottom:4px;
              border-left:3px solid ${cls?.color||'#00d4ff'}">
              <div>
                <div style="font-size:0.72rem;color:${cls?.color||'white'}">${ship?.name||''}</div>
                <div style="font-size:0.6rem;color:#6a90b8">×${fmt(slot.count)}</div>
              </div>
              <div style="text-align:right;font-size:0.6rem;font-family:'Share Tech Mono',monospace;color:#6a90b8">
                <div>HP: ${fmt(stats.hp)}</div>
                <div>DPS: ${fmt(stats.dps)}</div>
              </div>
            </div>`;
        }).join('')}
        <div style="margin-top:8px;font-size:0.65rem;color:#00d4ff;font-family:'Orbitron',monospace">
          UKUPNA MOĆ: ${fmt(playerPower)}
        </div>
      </div>
    </div>

    <!-- Neprijatelji -->
    <div style="background:rgba(255,51,85,0.05);border:1px solid rgba(255,51,85,0.2);
      border-radius:6px;padding:10px;margin-bottom:16px">
      <div style="font-size:0.7rem;color:#ff3355;margin-bottom:6px;font-weight:700">
        💥 NEPRIJATELJI (×${mode.enemyMult} j×Tina)
      </div>
      <div style="font-size:0.65rem;color:#6a90b8">
        ${inst.enemies.join(', ')} + Boss: ${t(inst.bossKey || '') || inst.boss}
      </div>
    </div>

    <div style="font-size:0.72rem;color:#6a90b8;text-align:center">
      ⚠️ Borba je automatska. Rezultat zavisi od moći flote vs neprijatelja.
    </div>
  `;

  openModal(`⚔️ ${dn(inst)}`, body, [
    {
      label: `⚔️ NAPADNI! (-${energyCost} MWh)`,
      cls:   'btn-r',
      fn: () => { closeModal(); startBattle(inst); }
    },
    {
      label: `⚡ INSTANT (-${energyCost} MWh)`,
      cls:   'btn-g',
      fn: () => { closeModal(); startBattle(inst, true); }
    },
    { label: 'Odustani', fn: closeModal }
  ]);
  // Omogući scroll samo za ovaj modal (info je dugačak)
  const mBody = document.getElementById('mBody');
  if (mBody) { mBody.style.overflowY = 'auto'; mBody.style.overflowX = 'hidden'; }
  // Dugmad na sredini, NAPADNI šira
  const mAct = document.getElementById('mActions');
  if (mAct) {
    const btns = mAct.querySelectorAll('button');
    btns.forEach(b => { b.style.minWidth = '140px'; });
  }
}

// ── POKRENI BORBU ──
function startBattle(inst, instant = false) {
  const fleetSlots  = getAllDeployedSlots();
  if (fleetSlots.length === 0) { toast('⚠️ Flota je prazna!', 'warn'); return; }

  const energyCost  = getInstanceEnergyCost(inst);
  if (R.energy < energyCost) {
    toast(`✖ Nedovoljno energije! Treba ${energyCost} MWh, imaš ${Math.floor(R.energy)} MWh.`, 'err');
    return;
  }

  // Provjeri key cost
  const mode     = INST_DIFFICULTY_MODES[_instDifficultyMode];
  if ((R.instanceKeys || 0) < mode.keyCost) {
    toast(`✖ Nemaš dovoljno ključeva! Treba ${mode.keyCost}🗝️, imaš ${R.instanceKeys||0}.`, 'err');
    return;
  }

  // ── Boss cooldown provjera ──────────────────────────────
  if (inst.cooldown_hours) {
    if (!window._bossCooldowns) window._bossCooldowns = {};
    const lastKill = window._bossCooldowns[inst.id];
    if (lastKill) {
      const elapsed = (Date.now() - lastKill) / 3600000;
      if (elapsed < inst.cooldown_hours) {
        const remaining = inst.cooldown_hours - elapsed;
        const days  = Math.floor(remaining / 24);
        const hours = Math.floor(remaining % 24);
        const mins  = Math.floor((remaining % 1) * 60);
        const parts = [];
        if (days)  parts.push(`${days}d`);
        if (hours) parts.push(`${hours}h`);
        if (mins)  parts.push(`${mins}m`);
        toast(`⏳ Boss na cooldownu još ${parts.join(' ')}`, 'warn');
        return;
      }
    }
  }
  // ────────────────────────────────────────────────────────

  // ── He3 potrošnja po misiji (računa se ali ne blokira) ────
  const he3Needed = fleetSlots.reduce((sum, ship) => {
    let cost = 0.005;
    if (ship && ship.engine) {
      const engDef = (typeof ENGINES !== 'undefined' ? ENGINES : [])
        .find(e => e.id === ship.engine);
      if (engDef && engDef.he3_cost != null) cost = engDef.he3_cost;
    }
    return sum + cost;
  }, 0);
  if (R.he3 < he3Needed) {
    toast(`⚠️ He3 kritično nizak! (${R.he3.toFixed(2)} / ${he3Needed.toFixed(3)})`, 'warn');
  }
  // ────────────────────────────────────────────────────────

  R.energy       -= energyCost;
  R.instanceKeys  = (R.instanceKeys || 0) - mode.keyCost;
  R.he3 = Math.max(0, R.he3 - he3Needed);
  updateResUI();

  const enemyGroups = generateEnemies(inst);
  toast(`⚔️ Borba u toku... (-${energyCost} MWh, -${mode.keyCost}🗝️, -${he3Needed.toFixed(3)}⛽)`, 'inf');

  setTimeout(() => {
    // ── FAZA 1 — normalna borba ──
    let battle = simulateBattle(fleetSlots, enemyGroups, inst);

    // ── FAZA 2 — boss (ako instanca ima bossShip i faza 1 je pobjeda) ──
    if (battle.status === 'victory' && inst.bossShip) {
      const bs = inst.bossShip;
      const bossGroup = [{
        name:    bs.name,
        ship_id: '__boss__',
        count:   1,
        hp:      bs.structure,
        shield:  bs.shield || 0,
        dps:     bs.dps,
        agility: bs.agility || 5,
        speed:   bs.speed || 3,
        armor:   'Heavy',
        row: 2, col: 2,
        isBoss: true,
      }];
      // Igrač ulazi s trenutnim stanjem (ranjenici ostaju ranjenici)
      const survivingSlots = fleetSlots.filter((s, i) => {
        const unit = battle.player.find(u => u.slotIndex === (s?._ownerIdx ?? i));
        return s && unit && unit.alive;
      });
      const bossBattle = simulateBattle(survivingSlots.length > 0 ? survivingSlots : fleetSlots, bossGroup, inst);
      // Spoji logove
      bossBattle.log = [
        ...battle.log,
        { round: 0, type: 'info', msg: '━━━ 💀 BOSS FAZA ━━━' },
        ...bossBattle.log,
      ];
      bossBattle.phase1 = battle;
      battle = bossBattle;
    }

    const progKey = inst.id + '_' + _instDifficultyMode;

    let rewards = null;
    if (battle.status === 'victory') {
      const prog2  = getInstanceProgress(progKey);
      rewards      = calculateRewards(battle, inst, prog2);

      // Skaliraj nagrade po modu
      rewards.metal   = Math.floor(rewards.metal   * mode.rewardMult);
      rewards.crystal = Math.floor(rewards.crystal * mode.rewardMult);
      rewards.he3     = Math.floor(rewards.he3     * mode.rewardMult);

      applyRewards(rewards);

      prog2.completed = true;
      prog2.clear_count++;
      // Every 100 completions → +1 commander key
      const expectedTimes = Math.floor(prog2.clear_count / 100);
      if (expectedTimes > prog2.timesRewarded) {
        prog2.timesRewarded = expectedTimes;
        R.keys = (R.keys || 0) + 1;
        addLog(`🃏 +1 komandir ključ (${expectedTimes * 100}x ${dn(inst)} [${mode.label}])`);
        setTimeout(() => {
          if (typeof toast === 'function') {
            toast(t('instance.milestone100.keyReward', { name: dn(inst), mode: mode.label }), 'ok');
          }
        }, 300);
      }
      if (rewards.allFound) {
        prog2.bpCompleted = true;
        toast('⚡ Svi blueprinti iz ove instance su nađeni!', 'ok');
      }
      // Postavi boss cooldown
      if (inst.cooldown_hours) {
        if (!window._bossCooldowns) window._bossCooldowns = {};
        window._bossCooldowns[inst.id] = Date.now();
      }
      if (!window._instProgress) window._instProgress = {};
      window._instProgress[progKey] = prog2;

      addLog(`⚡ ${dn(inst)} [${mode.label}] Završena! +${fmt(rewards.metal)} metal`);
      if (typeof trackDailyInstance  === 'function') trackDailyInstance();
      if (typeof trackWeeklyInstance === 'function') trackWeeklyInstance();
      // Komandir XP se daje automatski kroz addExp() hook u commander.js

      // ── ACHIEVEMENT TRACKING: pobjede po težini ──
      const _dm = _instDifficultyMode || 'easy';
      window[`_wins_${_dm}`] = (window[`_wins_${_dm}`] || 0) + 1;
      // Flawless win — nijedan igrački brod nije uništen
      const _flawless = battle.player.every(u => u.alive);
      if (_flawless) window._flawlessWins = (window._flawlessWins || 0) + 1;
      // Instance streak — uzastopne pobjede
      window._instanceStreak = (window._instanceStreak || 0) + 1;
      if (typeof dropRandomArtifactFragment === 'function' && Math.random() < 0.3) {
        dropRandomArtifactFragment(inst.difficulty);
      }
    } else if (battle.status === 'defeat') {
      // Resetuj streak pri porazu
      window._instanceStreak = 0;
      addLog(`⚡ Poraz u ${dn(inst)} [${mode.label}]. Pokušaj ponovo.`);
    }

    applyPlayerLosses(battle);
    if (typeof showBattleOutcome === 'function') {
      if (!instant && battle.phase1 && typeof startBattleAnim === 'function') {
        // Prikaži fazu 1, pa boss fazu s nagradama
        startBattleAnim(battle.phase1, () => {
          setTimeout(() => showBattleOutcome(battle, rewards, true), 400);
        });
      } else {
        showBattleOutcome(battle, rewards, !instant);
      }
    } else {
      renderBattleResult(battle, rewards);
    }
    saveGame();
    updateResUI();
  }, 100);
}

// ── INSTANCE PROGRESS (po modu) ──
function getInstanceProgress(progKey) {
  if (!window._instProgress) window._instProgress = {};
  if (!window._instProgress[progKey]) {
    window._instProgress[progKey] = {
      completed:    false,
      clear_count:  0,
      best_rank:    null,
      best_time:    null,
      bpCompleted:  false,
      timesRewarded: 0,
    };
  }
  return window._instProgress[progKey];
}

// ── RETROACTIVE: every 100x commander key migration ──
function _migrateInstance100Keys() {
  if (!window._instProgress || window._instProgress100Migrated) return;
  let total = 0;
  for (const key in window._instProgress) {
    const p = window._instProgress[key];
    const expected = Math.floor(p.clear_count / 100);
    const prev = p.timesRewarded || 0;
    if (expected > prev) {
      const reward = expected - prev;
      p.timesRewarded = expected;
      R.keys = (R.keys || 0) + reward;
      total += reward;
    }
  }
  if (total > 0) {
    addLog(`🃏 +${total} komandir ključ(ev/a) — svakih 100 instanci (retroaktivno)`);
    if (typeof toast === 'function') {
      toast(t('instance.milestone100.retro', { n: total }), 'ok');
    }
    saveGame();
  }
  window._instProgress100Migrated = true;
}

// ── SEEDED RNG (deterministički, isti za sve igrače) ──
function _instHashCode(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (Math.imul(h, 0x01000193)) >>> 0;
  }
  return h;
}
function _instSeededRng(seed) {
  let s = seed >>> 0;
  return function() {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    s = s >>> 0;
    return s / 0xFFFFFFFF;
  };
}

// ── PARSOVANJE PASIVNIH BONUSA KOMANDIRA (za enemy multiplier) ──
function parsePassiveBonus(desc) {
  if (!desc) return { atk: 0, hp: 0, shield: 0 };
  let atk = 0, hp = 0, shield = 0;

  // +X% napad (i napad) — fleet attack
  const atkMatches = desc.matchAll(/\+(\d+)%\s*napad/gi);
  for (const m of atkMatches) atk += parseInt(m[1]);

  // +X% šteta — weapon damage = attack
  const shtMatches = desc.matchAll(/\+(\d+)%\s*(šteta|damage)/gi);
  for (const m of shtMatches) atk += parseInt(m[1]);

  // +X% HP
  const hpMatches = desc.matchAll(/\+(\d+)%\s*HP/gi);
  for (const m of hpMatches) hp += parseInt(m[1]);

  // +X% max shield
  const shMatches = desc.matchAll(/\+(\d+)%\s*(max\s*)?shield/gi);
  for (const m of shMatches) shield += parseInt(m[1]);

  // Condicionalni bonusi (svaki kill, pri HP<X%, itd.) — uzmi 40% vrijednosti
  const condMatch = desc.match(/\b(svaki|pri|kad|when)\b.+?\+(\d+)%/i);
  if (condMatch) {
    // već je uhvaćen gore ako se preklapa, ali ako nije:
    const val = parseInt(condMatch[2]) * 0.4;
    if (condMatch[0].match(/napad/i)) atk += val;
    if (condMatch[0].match(/HP/i)) hp += val;
  }

  return { atk: Math.round(atk), hp: Math.round(hp), shield: Math.round(shield) };
}

// ── ODABIR ENEMY KOMANDIRA PO RARITETU ──
function pickEnemyCommander(rarity, seed) {
  const allCmds = [
    ...(typeof COMMANDERS_DATA !== 'undefined' ? COMMANDERS_DATA : []),
    ...(typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
  ].filter(c => c.rarity === rarity);
  if (!allCmds.length) return null;
  // Seeded pick
  let s = seed >>> 0;
  s ^= s << 13; s ^= s >> 17; s ^= s << 5; s = s >>> 0;
  return allCmds[s % allCmds.length];
}

// ── IZRAČUNAJ LEVEL KOMANDIRA PO BROJU INSTANCE ──
// 3 instance po zvjezdici: pos0=+1, pos1=+5, pos2=+10
function getInstCmdLevel(instNumber) {
  const n       = (instNumber || 1) - 1;
  const group   = Math.floor(n / 3);       // 0-9 (zvjezdica 1-10)
  const pos     = n % 3;                    // 0,1,2
  const starBase = group * 10;
  return starBase + [1, 5, 10][pos];
}

// ── PRIMIJENI ENEMY KOMANDIRE NA GRUPE (višestruki po modu) ──
function _applyEnemyCommander(inst, groups) {
  const cmdRarityMap  = { easy: 'C', normal: 'R', nightmare: 'E', hell: 'L' };
  const cmdCountMap   = { easy: 1,   normal: 3,   nightmare: 6,   hell: 9   };
  const cmdRarity     = cmdRarityMap[_instDifficultyMode] || 'C';
  const cmdCount      = cmdCountMap[_instDifficultyMode]  || 1;
  const cmdLevel      = getInstCmdLevel(inst.number);
  const lvlMult       = Math.min(1.0, cmdLevel / 100);

  let totalAtk = 0, totalHp = 0, totalShield = 0;
  const pickedCmds = [];

  for (let i = 0; i < cmdCount; i++) {
    const cmdSeed = _instHashCode(inst.id + '_cmd_' + _instDifficultyMode + '_' + i);
    const cmd     = pickEnemyCommander(cmdRarity, cmdSeed);
    if (!cmd) continue;
    // Izbjegni duplikate
    if (pickedCmds.find(c => c.id === cmd.id)) continue;
    pickedCmds.push(cmd);
    const b1 = parsePassiveBonus(cmd.passive?.desc);
    const b2 = parsePassiveBonus(cmd.passive2?.desc);
    totalAtk    += b1.atk + b2.atk;
    totalHp     += b1.hp  + b2.hp;
    totalShield += b1.shield + b2.shield;
  }

  if (pickedCmds.length > 0) {
    const atkMult    = 1 + (totalAtk    * lvlMult / 100);
    const hpMult     = 1 + (totalHp     * lvlMult / 100);
    const shieldMult = 1 + (totalShield * lvlMult / 100);
    groups.forEach(g => {
      g.dps    = Math.round(g.dps    * atkMult);
      g.hp     = Math.round(g.hp     * hpMult);
      g.shield = Math.round(g.shield * shieldMult);
    });
    window._lastEnemyCommanders = pickedCmds.map(cmd => ({
      id: cmd.id, name: cmd.name, icon: cmd.icon,
      rarity: cmd.rarity, faction: cmd.faction, level: cmdLevel,
      passive: cmd.passive, passive2: cmd.passive2 || null,
    }));
    window._lastEnemyCommander = pickedCmds[0]; // backwards compat
    window._lastEnemyCommander.bonuses = {
      atk: Math.round(totalAtk * lvlMult),
      hp:  Math.round(totalHp  * lvlMult),
      shield: Math.round(totalShield * lvlMult),
    };
  } else {
    window._lastEnemyCommanders = [];
    window._lastEnemyCommander  = null;
  }
}

// ── DETERMINISTIČKI NEPRIJATELJI (fiksni po instanci + difficultyu) ──
function generateEnemies(inst) {
  const mode       = INST_DIFFICULTY_MODES[_instDifficultyMode] || INST_DIFFICULTY_MODES.easy;
  const instNumber = inst.number || 1;
  const groups     = [];

  // ── Prikupi sve brodove u flat array ──
  let allShips = [];
  if (typeof SHIPS !== 'undefined') {
    Object.values(SHIPS).forEach(arr => { if (Array.isArray(arr)) allShips.push(...arr); });
  }

  // ── FIKSNA FORMACIJA — za sve modove koji imaju enemyGroups ──
  if (inst.enemyGroups && inst.enemyGroups.length > 0) {
    inst.enemyGroups.forEach(eg => {
      const ship = allShips.find(s => s.id === eg.ship_id);
      if (!ship) return;
      const count = eg.count;
      const cls = ship.id.split('_')[0];
      const weaponSlots = { scout: 2, fighter: 3, cruiser: 3, battleship: 4, carrier: 2, special: 3 }[cls] || 2;
      const tierM = ship.id.match(/_([IVX]+)$/);
      const avgDps = { 'I': 95, 'II': 175, 'III': 270 }[tierM ? tierM[1] : 'I'] || 95;
      groups.push({
        name:    ship.name,
        count,
        hp:      (ship.armor_val + (ship.shield || 0) + (ship.structure || 0)) * count,
        shield:  (ship.shield || 0) * count,
        dps:     avgDps * weaponSlots * count,
        agility: ship.agility || 10,
        speed:   ship.movement || 1,
        armor:   ship.armor || 'Light',
        ship_id: ship.id,
        row:     eg.row || 1,
        col:     eg.col || 1,
        isBoss:  eg.isBoss || false,
      });
    });
    // Primijeni enemy komandira i na fiksne grupe
    _applyEnemyCommander(inst, groups);
    return groups;
  }

  if (allShips.length === 0) return groups;

  // Seeded RNG — isti seed = isti neprijatelji svaki put za svakog igrača
  const seed = _instHashCode(inst.id + '_' + _instDifficultyMode);
  const rng  = _instSeededRng(seed);

  // ── Odaberi tier brodova po težini moda ──
  // Easy → I varijante, Normal → II, Nightmare/Hell → III
  const tierMap    = { easy: 'I', normal: 'II', nightmare: 'III', hell: 'III' };
  const tier       = tierMap[_instDifficultyMode] || 'I';

  // Rarity pool po modu
  const rarityPool = {
    easy:      ['C'],
    normal:    ['C', 'R'],
    nightmare: ['R', 'E'],
    hell:      ['E', 'L'],
  }[_instDifficultyMode] || ['C'];

  // Filtriraj brodove koji odgovaraju tier-u (id završava na _I, _II, _III)
  let pool = allShips.filter(s => s.id.endsWith('_' + tier) && rarityPool.includes(s.rarity));
  if (pool.length === 0) pool = allShips.filter(s => s.id.endsWith('_' + tier));
  if (pool.length === 0) pool = allShips;

  // ── Baze brojeva brodova (FIKSNE, ne skaliraju po power igrača) ──
  // Skaliraju SAMO po instNum (1-30) i modu — isti za svakog igrača
  const baseCountMap = {
    easy:      [15, 40],
    normal:    [35, 100],
    nightmare: [70, 200],
    hell:      [120, 400],
  };
  const [baseMin, baseMax] = baseCountMap[_instDifficultyMode] || [15, 40];
  // +12% po instanci (inst 1 = ×1.00, inst 10 = ×2.08, inst 20 = ×3.28, inst 30 = ×4.48)
  const instScale = 1.0 + (instNumber - 1) * 0.12;

  // ── Broj neprijateljskih grupa (3-9 po instNum) ──
  const numGroups = Math.min(9, Math.max(3, 2 + Math.floor(instNumber / 5)));

  // ── Odaberi raznolike klase brodova (seeded = isti svaki put) ──
  const classes = ['scout', 'fighter', 'cruiser', 'battleship', 'carrier'];
  // Seeded shuffle
  const shuffled = [...classes].sort((a, b) => rng() - 0.5);
  const numClasses = Math.max(2, Math.min(classes.length, Math.floor(numGroups * 0.6)));
  const selectedClasses = shuffled.slice(0, numClasses);

  // ── Grupe neprijatelja ──
  for (let i = 0; i < numGroups; i++) {
    const cls     = selectedClasses[i % selectedClasses.length];
    const clsPool = pool.filter(s => s.id.startsWith(cls + '_'));
    const shipPick = clsPool.length > 0
      ? clsPool[Math.floor(rng() * clsPool.length)]
      : pool[Math.floor(rng() * pool.length)];
    if (!shipPick) continue;

    // Deterministički broj brodova (seeded, NE ovisi o igraču)
    const countRaw = baseMin + rng() * (baseMax - baseMin);
    const count    = Math.max(1, Math.floor(countRaw * instScale));
    const hp       = (shipPick.armor_val + (shipPick.shield || 0) + (shipPick.structure || 0)) * count;
    const dps      = (shipPick.armor_val * 0.3 + (shipPick.shield || 0) * 0.2) * count;

    groups.push({
      name:    shipPick.name,
      count,
      hp,
      shield:  (shipPick.shield || 0) * count,
      dps,
      agility: shipPick.agility || 10,
      speed:   shipPick.movement || 1,
      armor:   shipPick.armor || 'Light',
      ship_id: shipPick.id,
    });
  }

  // ── Boss ── (jači brod sljedećeg tier-a, fiksni count po instNum)
  if (inst.boss && groups.length < 9) {
    const bossTier = tier === 'I' ? 'II' : 'III';
    let bossPool   = allShips.filter(s => s.id.endsWith('_' + bossTier) && ['E', 'L'].includes(s.rarity));
    if (bossPool.length === 0) bossPool = allShips.filter(s => s.id.endsWith('_' + bossTier));
    if (bossPool.length === 0) bossPool = pool;

    const boss = bossPool[Math.floor(rng() * bossPool.length)];
    if (boss) {
      // Boss count: 1 na inst1 easy, skalirano gore
      const bossCount = Math.max(1, Math.floor((1 + instNumber * 0.3) * instScale * 0.4));
      groups.push({
        name:    t(inst.bossKey || '') || inst.boss,
        count:   bossCount,
        hp:      (boss.armor_val + (boss.shield || 0) + (boss.structure || 0)) * bossCount * 2.5,
        shield:  (boss.shield || 0) * bossCount * 2.5,
        dps:     (boss.armor_val * 0.4 + (boss.shield || 0) * 0.3) * bossCount * 2.0,
        agility: boss.agility || 8,
        speed:   boss.movement || 1,
        armor:   boss.armor || 'Chrome',
        ship_id: boss.id,
        isBoss:  true,
      });
    }
  }

  _applyEnemyCommander(inst, groups);

  return groups;
}

// ── RANDOM OKLOP ──
function getRandomArmor(diff) {
  const armors = Object.keys(ARMOR_RESISTANCE);
  return armors[Math.floor(Math.random() * armors.length)];
}
