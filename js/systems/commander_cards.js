// ============================================================
// HIVE GALAXY — js/systems/commander_cards.js
// Sistem kolekcionarskih karti komandira
// ============================================================

// ── RARITY CONFIG ──
const CARD_RARITY = {
  C: { name: 'Common',    color: '#aaaaaa', glow: '#888888', weight: 60, maxGrade: 'C' },
  R: { name: 'Rare',      color: '#4488ff', glow: '#2266ff', weight: 25, maxGrade: 'B' },
  E: { name: 'Epic',      color: '#aa44ff', glow: '#8822ff', weight: 12, maxGrade: 'A' },
  L: { name: 'Legendary', color: '#ffaa00', glow: '#ff8800', weight:  3, maxGrade: 'S' },
};

const GRADE_ORDER = ['F', 'D', 'C', 'B', 'A', 'S'];

// Prosječna distribucija ocjena po raritetu
const GRADE_WEIGHTS = {
  C: { F:30, D:35, C:25, B:8,  A:2,  S:0  },
  R: { F:5,  D:15, C:35, B:30, A:13, S:2  },
  E: { F:0,  D:5,  C:15, B:30, A:35, S:15 },
  L: { F:0,  D:0,  C:5,  B:15, A:40, S:40 },
};

const CMD_SHIP_CLASSES  = ['scout','fighter','cruiser','battleship','carrier','special'];
const CMD_DAMAGE_TYPES  = ['kinetic','heat','magnetic','explosive'];

// ── PAKOVI ──
const CARD_PACKS = {
  origin: {
    id: 'origin',
    name: 'Origin Pack',
    icon: '🌌',
    desc: 'Serija 1 — 100 human komandira iz 5 frakcija: Vanguard, Sentinel, Technocrat, Shadow, Solar.',
    color: '#00d4ff',
    costSingle: 5,
    costMulti: 45,
    pool: () => (typeof COMMANDERS !== 'undefined' ? COMMANDERS : []),
  },
  xenos: {
    id: 'xenos',
    name: 'Xenos Pack',
    icon: '👾',
    desc: 'Serija 2 — 100 alien komandira iz 5 frakcija: Krall, Ethereal, Synth, Hive, Ancient.',
    color: '#ff44aa',
    costSingle: 7,
    costMulti: 63,
    pool: () => (typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
  },
  undead: {
    id: 'undead',
    name: 'Undead Pack',
    icon: '💀',
    desc: 'Serija 3 — 100 undead komandira. Predvođeni Kaelom "The Exile" koji vraća 100% izgubljene flote.',
    color: '#8833ff',
    costSingle: 10,
    costMulti: 90,
    pool: () => (typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  },
};

// ── STATE ──
// window.ownedCommanders = [ { id, level, xp, masteryShips:{}, masteryWeapons:{}, pullCount } ]
// window._activeCommander = id | null  (aktivni komandir)
// window._packs = { pity_origin: 0, pity_xenos: 0 }

function initCardState() {
  if (!window.ownedCommanders) {
    window.ownedCommanders = [];
    console.log('[initCardState] ownedCommanders initialized to []');
  }
  if (!window._activeCommander) window._activeCommander = null;
  if (!window._packPity) window._packPity = { origin: 0, xenos: 0, undead: 0 };
  if (!window._packPulls) window._packPulls = { origin: 0, xenos: 0, undead: 0 };
  if (!window._packPity.undead)  window._packPity.undead  = 0;
  if (!window._packPulls.undead) window._packPulls.undead = 0;
}

// ── RANDOM OCJENA ──
function randomGrade(rarity, isSpecialty) {
  const weights = { ...GRADE_WEIGHTS[rarity] };
  if (isSpecialty) {
    // specialty dobiva pomak prema S
    const g = GRADE_ORDER;
    const boosted = {};
    for (let i = 0; i < g.length; i++) {
      const shifted = Math.min(i + 2, g.length - 1);
      boosted[g[shifted]] = (boosted[g[shifted]] || 0) + (weights[g[i]] || 0);
    }
    Object.assign(weights, boosted);
  }
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (const grade of GRADE_ORDER) {
    roll -= (weights[grade] || 0);
    if (roll <= 0) return grade;
  }
  return 'C';
}

// ── MASTERY GENERACIJA ──
function generateMastery(commander) {
  const minIdx = GRADE_ORDER.indexOf('C');
  const ships = {};
  CMD_SHIP_CLASSES.forEach(cls => {
    const isSp = (commander.specialty_ships || []).includes(cls);
    let g = randomGrade(commander.rarity, isSp);
    // ⭐ garantuje minimum C
    if (isSp) {
      const idx = GRADE_ORDER.indexOf(g);
      if (idx < minIdx) g = 'C';
    }
    ships[cls] = g;
  });
  const weapons = {};
  CMD_DAMAGE_TYPES.forEach(type => {
    const isSp = (commander.specialty_weapons || []).includes(type);
    let g = randomGrade(commander.rarity, isSp);
    // ⭐ garantuje minimum C
    if (isSp) {
      const idx = GRADE_ORDER.indexOf(g);
      if (idx < minIdx) g = 'C';
    }
    weapons[type] = g;
  });
  return { ships, weapons };
}

// ── XP ZA LEVEL KARTE (gameplay XP) ──
// Raste eksponencijalno: Lv1→2 = 200xp, Lv99→100 = ~180.000xp
function getCardXpForLevel(level) {
  return Math.floor(200 * Math.pow(1.08, level - 1));
}

// ── SHARD SISTEM (duplikati) ──
// Koliko shardova treba za 1 level
const SHARD_COST_PER_LEVEL = { C: 12, R: 6, E: 3, L: 1 };

// Daj shard komandir i provjeri level up
function giveCommanderShard(ownedEntry, rarity) {
  ownedEntry.shards = (ownedEntry.shards || 0) + 1;
  const cost = SHARD_COST_PER_LEVEL[rarity] || 12;
  let leveled = 0;
  while (ownedEntry.shards >= cost && (ownedEntry.level || 1) < 100) {
    ownedEntry.shards -= cost;
    ownedEntry.level   = (ownedEntry.level || 1) + 1;
    leveled++;
  }
  return leveled;
}

// NAPOMENA: giveFleetCommandersXp je zamijenjena s giveFleetCmdsXpFromPool u commander.js
// XP se sada automatski dijeli kroz addExp() hook — ne treba pozivati ručno

// ── PULL LOGIKA ──
function rollRarity(packId) {
  const pity = window._packPity[packId] || 0;
  // Pity sustav: na 90 pullova garantovani Legendary
  if (pity >= 89) {
    window._packPity[packId] = 0;
    return 'L';
  }
  // Na 10. potu garantovani minimum R
  const pulls = (window._packPulls[packId] || 0) % 10;
  const weights = { ...CARD_RARITY };
  if (pulls === 9) {
    // garantovano R+
    const total = weights.R.weight + weights.E.weight + weights.L.weight;
    let roll = Math.random() * total;
    for (const r of ['L', 'E', 'R']) {
      roll -= weights[r].weight;
      if (roll <= 0) return r;
    }
    return 'R';
  }
  const total = Object.values(weights).reduce((a, b) => a + b.weight, 0);
  let roll = Math.random() * total;
  for (const r of ['L', 'E', 'R', 'C']) {
    roll -= weights[r].weight;
    if (roll <= 0) return r;
  }
  return 'C';
}

function doPull(packId, count = 1) {
  initCardState();
  const pack = CARD_PACKS[packId];
  if (!pack) return [];

  const cost = count === 1 ? pack.costSingle : pack.costMulti;
  if ((R.keys || 0) < cost) {
    toast(`❌ Nema dovoljno ključeva! Trebaš ${cost} 🗝️`, 'err');
    return [];
  }
  R.keys = (R.keys || 0) - cost;
  updateResUI();

  const pool = pack.pool();
  if (!pool.length) {
    toast('❌ Pack nema komandira!', 'err');
    return [];
  }

  const results = [];
  for (let i = 0; i < count; i++) {
    window._packPity[packId] = (window._packPity[packId] || 0) + 1;
    window._packPulls[packId] = (window._packPulls[packId] || 0) + 1;

    const rarity = rollRarity(packId);
    const candidates = pool.filter(c => c.rarity === rarity);
    if (!candidates.length) continue;
    const cmd = candidates[Math.floor(Math.random() * candidates.length)];

    // Provjeri postoji li već
    const existing = window.ownedCommanders.find(o => o.id === cmd.id);
    if (existing) {
      // Duplikat — 1 shard → možda level up
      const leveled = giveCommanderShard(existing, rarity);
      const cost    = SHARD_COST_PER_LEVEL[rarity] || 12;
      results.push({ cmd, duplicate: true, leveled, shardsNow: existing.shards, cost });
    } else {
      const mastery = generateMastery(cmd);
      const entry = {
        id: cmd.id,
        level: 1,
        xp: 0,
        shards: 0,
        masteryShips: mastery.ships,
        masteryWeapons: mastery.weapons,
        pullCount: 1,
      };
      window.ownedCommanders.push(entry);
      results.push({ cmd, duplicate: false });
    }
  }

  // Achievement tracking
  window._totalCardPulls = (window._totalCardPulls || 0) + count;
  checkAchievements();
  saveGame();
  return results;
}

// ── AKTIVNI KOMANDIR BONUSI ──
function getActiveCommanderData() {
  if (!window._activeCommander || !window.ownedCommanders) return null;
  const owned = window.ownedCommanders.find(o => o.id === window._activeCommander);
  if (!owned) return null;

  // Traži u obje serije
  const allCmds = [
    ...(typeof COMMANDERS !== 'undefined' ? COMMANDERS : []),
    ...(typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
    ...(typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  ];
  const def = allCmds.find(c => c.id === owned.id);
  if (!def) return null;
  return { def, owned };
}

function getCardFleetBonus() {
  const data = getActiveCommanderData();
  if (!data) return 0;
  const { def, owned } = data;
  const lvlBonus = (owned.level - 1) * 0.5; // +0.5% po levelu
  return Math.floor(lvlBonus);
}

function getCardPassiveDesc() {
  const data = getActiveCommanderData();
  if (!data) return null;
  return data.def.passive || null;
}

// ── AKTIVACIJA ACTIVE ABILITY ──
function activateCardAbility(abilityKey) {
  const data = getActiveCommanderData();
  if (!data) return;
  const { def, owned } = data;
  const ability = def[abilityKey];
  if (!ability) return;

  const cdKey = `_cardAbility_${owned.id}_${abilityKey}`;
  const now = Date.now();
  const lastUsed = window[cdKey] || 0;
  const elapsed = (now - lastUsed) / 1000;

  if (elapsed < (ability.cooldown || 600)) {
    toast(`⏳ Cooldown: ${formatTimer(Math.ceil((ability.cooldown||600) - elapsed))}`, 'warn');
    return;
  }
  window[cdKey] = now;
  toast(`✅ ${def.name}: ${ability.name} aktiviran!`, 'ok');
  addLog(`🃏 ${def.icon} ${def.name} — ${ability.name}`);
  renderCommanderCards();
}

// ── RARITY BOJA HELPERS ──
function rarityColor(r) { return (CARD_RARITY[r] || {}).color || '#aaa'; }
function rarityGlow(r)  { return (CARD_RARITY[r] || {}).glow  || '#888'; }
function rarityName(r)  { return (CARD_RARITY[r] || {}).name  || r; }

function gradeColor(g) {
  return { S:'#ffcc00', A:'#00ff88', B:'#4488ff', C:'#aaaaaa', D:'#ff8833', F:'#ff4444' }[g] || '#aaa';
}

// ── CARD HTML (Blueprint-style) ──
function renderCardMini(cmd, owned, isActive) {
  const rc  = rarityColor(cmd.rarity);
  const rg  = rarityGlow(cmd.rarity);
  const lvl = owned ? owned.level : 0;
  const xpPct = owned ? Math.min(100, (owned.xp / getCardXpForLevel(lvl)) * 100) : 0;
  const isL = cmd.rarity === 'L';
  const isE = cmd.rarity === 'E';

  const allFactions = {
    ...(typeof FACTIONS !== 'undefined' ? FACTIONS : {}),
    ...(typeof XENOS_FACTIONS !== 'undefined' ? XENOS_FACTIONS : {}),
    ...(typeof UNDEAD_FACTIONS !== 'undefined' ? UNDEAD_FACTIONS : {}),
  };
  const fac = allFactions[cmd.faction] || { name: cmd.faction, icon: '?' };

  // Border: pun ako owned, providan ako ne
  const borderStyle = owned
    ? (isL ? `3px solid ${rc}` : `1px solid ${rc}`)
    : `1px solid ${rc}33`;
  const boxShadow = owned && isL ? `0 0 14px ${rg}44` : 'none';
  const opacity   = owned ? '1' : '0.5';

  // Mastery - top 2 specialty ako owned
  let masteryHtml = '';
  if (owned) {
    const topShips = (cmd.specialty_ships || []).slice(0, 2).map(s => {
      const g = owned.masteryShips[s] || 'F';
      return `<span style="color:${gradeColor(g)};font-weight:700">${g}</span>
              <span style="color:#6a90b8">${s.slice(0,3)}</span>`;
    }).join(' · ');
    const topWps = (cmd.specialty_weapons || []).slice(0, 2).map(w => {
      const g = owned.masteryWeapons[w] || 'F';
      return `<span style="color:${gradeColor(g)};font-weight:700">${g}</span>
              <span style="color:#6a90b8">${w.slice(0,3)}</span>`;
    }).join(' · ');
    if (topShips || topWps) {
      masteryHtml = `<div style="font-size:0.5rem;margin-top:5px;padding-top:5px;
        border-top:1px solid rgba(255,255,255,0.06);line-height:1.8;text-align:left">
        ${topShips ? `<div>🚀 ${topShips}</div>` : ''}
        ${topWps   ? `<div>⚔️ ${topWps}</div>`   : ''}
      </div>`;
    }
  }

  // Passive preview (skraćen)
  const passivePreview = cmd.passive
    ? `<div style="font-size:0.5rem;color:${owned ? '#aa44ff' : '#444'};
        margin-top:4px;line-height:1.5;text-align:left;
        display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
        🛡️ ${cmd.passive.name}
      </div>`
    : '';

  return `
    <div class="card commander-card ${isActive ? 'cmd-active' : ''}"
      style="border:${borderStyle};box-shadow:${boxShadow};opacity:${opacity};
        cursor:${owned ? 'pointer' : 'default'};position:relative;
        padding:10px 10px 12px;overflow:hidden;display:flex;flex-direction:column"
      ${owned ? `onclick="showCardDetail('${cmd.id}')"` : ''}
    >
      <!-- Legendary / Epic banner -->
      ${isL && owned ? `
        <div style="position:absolute;top:0;left:0;right:0;height:3px;
          background:linear-gradient(90deg,transparent,${rc},transparent)"></div>
        <div style="position:absolute;top:6px;right:6px;background:linear-gradient(135deg,${rc},#ff6600);
          color:#000;font-size:0.48rem;font-weight:700;padding:1px 7px;
          border-radius:3px;letter-spacing:1px;z-index:3">★ LEGENDARY</div>` : ''}
      ${isE && owned ? `
        <div style="position:absolute;top:0;left:0;right:0;height:2px;
          background:linear-gradient(90deg,transparent,${rc},transparent)"></div>` : ''}

      <!-- OWN / ??? badge -->
      <div style="position:absolute;top:6px;left:7px;font-size:0.48rem;font-weight:700;
        color:${owned ? rc : '#444'};
        background:${owned ? rc+'18' : 'rgba(0,0,0,0.3)'};
        border:1px solid ${owned ? rc+'44' : '#2a2a2a'};
        border-radius:3px;padding:1px 5px;font-family:'Orbitron',monospace;letter-spacing:1px">
        ${owned ? 'OWN' : '???'}
      </div>

      <!-- Ikona + frakcija -->
      <div style="text-align:center;margin:18px 0 8px">
        <div style="font-size:2.6rem;
          filter:${owned ? `drop-shadow(0 0 10px ${rg})` : 'grayscale(0.8) brightness(0.4)'}">
          ${cmd.icon}
        </div>
        <div style="font-size:0.52rem;color:${owned ? '#6a90b8' : '#333'};margin-top:3px">
          ${fac.icon} ${owned ? fac.name : '???'}
        </div>
      </div>

      <!-- Zvezdice levela (samo ako owned) -->
      ${owned ? (() => {
        const sl = Math.max(1, Math.min(10, Math.ceil((lvl || 1) / 10)));
        return `<div style="text-align:center;margin-bottom:3px;letter-spacing:1px">
          ${Array.from({ length: 10 }, (_, i) =>
            `<span style="font-size:0.55rem;color:${i < sl ? '#ffcc44' : '#1e2d45'};
              filter:${i < sl ? 'drop-shadow(0 0 2px #ffcc44aa)' : 'none'}">★</span>`
          ).join('')}
        </div>`;
      })() : ''}

      <!-- Ime -->
      <div style="font-size:0.68rem;font-weight:700;
        color:${owned ? rc : '#444'};
        font-family:'Orbitron',monospace;letter-spacing:0.5px;
        margin-bottom:2px;text-align:center;
        white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
        ${owned ? cmd.name : '???'}
      </div>

      <!-- Raritet -->
      <div style="text-align:center;margin-bottom:4px">
        <span style="font-size:0.52rem;font-weight:700;
          color:${owned ? rc : '#444'};
          background:${owned ? rc+'15' : 'transparent'};
          border-radius:3px;padding:1px 6px;
          font-family:'Orbitron',monospace">
          ${rarityName(cmd.rarity)}
        </span>
      </div>

      <!-- Level + XP + Shards (samo ako owned) -->
      ${owned ? (() => {
        const shards    = owned.shards || 0;
        const shardCost = SHARD_COST_PER_LEVEL[cmd.rarity] || 12;
        const shardPct  = Math.min(100, (shards / shardCost) * 100);
        return `
          <div style="font-size:0.55rem;color:#888;text-align:center;margin-bottom:2px">
            Lv.<strong style="color:${rc};font-size:0.62rem"> ${lvl}</strong>/100
          </div>
          <div class="pbar" style="height:3px;margin-bottom:2px" title="XP: ${owned.xp}/${getCardXpForLevel(lvl)}">
            <div class="pbar-fill" style="width:${xpPct}%;background:${rc}"></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px">
            <span style="font-size:0.45rem;color:#ffcc4499">🧩 ${shards}/${shardCost}</span>
          </div>
          <div class="pbar" style="height:2px;margin-bottom:4px" title="Shards: ${shards}/${shardCost}">
            <div class="pbar-fill" style="width:${shardPct}%;background:#ffcc44"></div>
          </div>
        `;
      })() : `<div style="height:16px"></div>`}

      <!-- Passive preview -->
      ${passivePreview}

      <!-- Mastery preview -->
      ${masteryHtml}

      <!-- Aktivan indicator -->
      ${isActive ? `
        <div style="position:absolute;bottom:0;left:0;right:0;height:2px;
          background:linear-gradient(90deg,transparent,${rc},transparent)"></div>
        <div style="text-align:center;margin-top:auto;padding-top:6px">
          <span style="font-size:0.5rem;color:${rc};font-family:'Orbitron',monospace;
            background:${rc}18;border-radius:3px;padding:1px 8px;letter-spacing:1px">
            ★ AKTIVAN
          </span>
        </div>` : ''}
    </div>`;
}

// ── DETALJ KARTICE ──
function showCardDetail(cmdId) {
  const allCmds = [
    ...(typeof COMMANDERS !== 'undefined' ? COMMANDERS : []),
    ...(typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
    ...(typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  ];
  const def = allCmds.find(c => c.id === cmdId);
  if (!def) return;
  // Pokusaj pronaci owned entry — provjeri i lowercase/trim varijante
  let owned = (window.ownedCommanders || []).find(o => o.id === cmdId);
  if (!owned) owned = (window.ownedCommanders || []).find(o => String(o.id).trim() === String(cmdId).trim());
  if (!owned) owned = (window.ownedCommanders || []).find(o => String(o.id).toLowerCase() === String(cmdId).toLowerCase());
  console.log('[showCardDetail] cmdId=', cmdId, 'owned=', owned, 'ownedCommanders=', (window.ownedCommanders||[]).map(o=>o.id));
  const rc = rarityColor(def.rarity);
  const rg = rarityGlow(def.rarity);
  const isActive = window._activeCommander === cmdId;
  const factions = {
    ...(typeof FACTIONS !== 'undefined' ? FACTIONS : {}),
    ...(typeof XENOS_FACTIONS !== 'undefined' ? XENOS_FACTIONS : {}),
    ...(typeof UNDEAD_FACTIONS !== 'undefined' ? UNDEAD_FACTIONS : {}),
  };
  const fac = factions[def.faction] || { name: def.faction, icon: '?' };

  // Mastery prikaz
  let masteryHtml = '';
  if (owned) {
    const shipRows = CMD_SHIP_CLASSES.map(cls => {
      const g = owned.masteryShips[cls] || 'F';
      const isSp = (def.specialty_ships || []).includes(cls);
      return `<div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0">
        <span style="font-size:0.62rem;color:${isSp?'#ffcc44':'#6a90b8'}">${isSp?'⭐':''} ${cls}</span>
        <span style="font-size:0.7rem;font-weight:700;color:${gradeColor(g)};
          font-family:'Orbitron',monospace">${g}</span>
      </div>`;
    }).join('');

    const wpRows = CMD_DAMAGE_TYPES.map(type => {
      const g = owned.masteryWeapons[type] || 'F';
      const isSp = (def.specialty_weapons || []).includes(type);
      return `<div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0">
        <span style="font-size:0.62rem;color:${isSp?'#ffcc44':'#6a90b8'}">${isSp?'⭐':''} ${type}</span>
        <span style="font-size:0.7rem;font-weight:700;color:${gradeColor(g)};
          font-family:'Orbitron',monospace">${g}</span>
      </div>`;
    }).join('');

    const lvl = owned.level;
    const xpNeed = getCardXpForLevel(lvl);
    const xpPct = Math.min(100, (owned.xp / xpNeed) * 100);

    masteryHtml = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        <div class="card" style="padding:10px">
          <div style="font-size:0.65rem;color:#00d4ff;font-family:'Orbitron',monospace;
            margin-bottom:8px">🚀 BRODOVI</div>
          ${shipRows}
        </div>
        <div class="card" style="padding:10px">
          <div style="font-size:0.65rem;color:#00d4ff;font-family:'Orbitron',monospace;
            margin-bottom:8px">⚔️ ORUŽJA</div>
          ${wpRows}
        </div>
      </div>
      <div class="card" style="padding:10px;margin-bottom:16px">
        <!-- Level + gameplay XP -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <span style="font-size:0.65rem;color:#6a90b8">Nivo Karte</span>
          <span style="font-size:0.85rem;font-weight:700;color:${rc};font-family:'Orbitron',monospace">
            ${lvl}/100
          </span>
        </div>
        <div class="pbar" style="height:5px;margin-bottom:3px">
          <div class="pbar-fill" style="width:${xpPct}%;background:${rc}"></div>
        </div>
        <div style="font-size:0.58rem;color:#6a90b8;margin-bottom:10px">
          ⚔️ Gameplay XP: ${fmt(owned.xp)} / ${fmt(xpNeed)}
        </div>
        <!-- Shard sistem -->
        <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <span style="font-size:0.62rem;color:#ffcc44">🧩 Shardhovi (duplikati)</span>
            <span style="font-size:0.75rem;font-weight:700;color:#ffcc44;font-family:'Orbitron',monospace">
              ${owned.shards || 0} / ${SHARD_COST_PER_LEVEL[def.rarity]}
            </span>
          </div>
          <div class="pbar" style="height:5px;margin-bottom:4px">
            <div class="pbar-fill" style="width:${Math.min(100,((owned.shards||0)/SHARD_COST_PER_LEVEL[def.rarity])*100)}%;
              background:#ffcc44"></div>
          </div>
          <div style="font-size:0.55rem;color:#6a90b8">
            Treba ${SHARD_COST_PER_LEVEL[def.rarity]} duplikata za +1 level
            · ${Math.max(0, SHARD_COST_PER_LEVEL[def.rarity] - (owned.shards||0))} još
          </div>
        </div>
      </div>
    `;
  }

  // Sposobnosti
  const abilities = ['passive', 'passive2', 'active', 'active2']
    .filter(k => def[k])
    .map(k => {
      const ab = def[k];
      const isActive2 = k.startsWith('active');
      const cdKey = `_cardAbility_${cmdId}_${k}`;
      const now = Date.now();
      const elapsed = ((now - (window[cdKey] || 0)) / 1000);
      const onCd = isActive2 && elapsed < (ab.cooldown || 600);
      const fleetRecoveryBadge = (!isActive2 && ab.fleet_recovery)
        ? `<div style="display:inline-block;margin-top:6px;padding:3px 8px;
            background:rgba(136,51,255,0.18);border:1px solid rgba(136,51,255,0.5);
            border-radius:4px;font-size:0.65rem;color:#cc88ff;font-weight:700">
            ☠️ Fleet Recovery: ${ab.fleet_recovery}% brodova vraća se u hangar
          </div>`
        : '';
      return `
        <div class="card" style="padding:10px;border-color:rgba(${isActive2?'0,212,255':'170,68,255'},0.2)">
          <div style="font-size:0.7rem;font-weight:700;color:${isActive2?'#00d4ff':'#aa44ff'};
            margin-bottom:4px">${isActive2?'⚡':'🛡️'} ${ab.name}</div>
          <div style="font-size:0.62rem;color:#6a90b8;margin-bottom:${isActive2&&owned?'8px':'0'};
            line-height:1.5">${ab.desc}</div>
          ${fleetRecoveryBadge}
          ${isActive2 && owned ? `
            <button class="btn ${onCd?'':'btn-g'}" style="width:100%;font-size:0.65rem"
              onclick="activateCardAbility('${k}')" ${onCd?'disabled':''}>
              ${onCd ? `⏳ ${formatTimer(Math.ceil((ab.cooldown||600)-elapsed))}` : '▶ Aktiviraj'}
            </button>` : ''}
        </div>`;
    }).join('');

  // ── Zvezdice (1 zvezdica = 10 levela, max 10 zvezdica) ──
  const starLevel  = owned ? Math.max(1, Math.min(10, Math.ceil((owned.level || 1) / 10))) : 0;
  const starsHtml  = owned ? Array.from({ length: 10 }, (_, i) => {
    const lit = i < starLevel;
    return `<span style="font-size:0.95rem;color:${lit ? '#ffcc44' : '#2a3550'};
      filter:${lit ? 'drop-shadow(0 0 4px #ffcc44aa)' : 'none'};
      transition:all 0.2s">★</span>`;
  }).join('') : '';

  // ── BURN INFO ──
  const rarityMultBurn = { C: 1, R: 2.5, E: 5, L: 10 }[def?.rarity] || 1;
  const burnKeysNow = owned ? Math.floor((owned.level || 1) * rarityMultBurn) : 0;
  const burnInfo = owned ? `
    <div class="card" style="padding:10px;margin-bottom:16px;border-color:rgba(255,51,85,0.2)">
      <div style="font-size:0.65rem;color:#ff4455;font-family:'Orbitron',monospace;margin-bottom:4px">
        ${t('commanders.burn')}</div>
      <div style="font-size:0.62rem;color:#6a90b8">
        ${t('commanders.burnRewardFormula', { mult: rarityMultBurn, keys: burnKeysNow })}</div>
    </div>` : '';

  const modalActions = owned
    ? [
        { label: isActive ? '✓ Aktivan Komandir' : '★ Postavi kao Aktivnog', cls: isActive ? 'btn-g' : 'btn-gold', fn: () => { setActiveCommander(cmdId); closeModal(); } },
        { label: t('commanders.burn'), cls: 'btn-r', fn: () => { if (confirm(t('commanders.burnConfirm', { keys: burnKeysNow }))) { destroyCommander(cmdId); closeModal(); } } },
        { label: 'Zatvori', cls: '', fn: closeModal }
      ]
    : [{ label: 'Zatvori', cls: '', fn: closeModal }];

  openModal(
    `${def.icon} ${def.name}`,
    `
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:3rem;filter:drop-shadow(0 0 12px ${rg});margin-bottom:8px">${def.icon}</div>
        ${owned ? `<div style="margin-bottom:6px;letter-spacing:2px">${starsHtml}</div>` : ''}
        <div style="font-size:0.65rem;font-family:'Orbitron',monospace">
          <span style="color:${rc};font-weight:700">${rarityName(def.rarity)}</span>
          <span style="color:#6a90b8;margin:0 8px">·</span>
          <span style="color:white">${fac.icon} ${fac.name}</span>
          ${owned ? `<span style="color:#6a90b8;margin:0 8px">·</span>
          <span style="color:#ffcc44;font-weight:700">Lv.${owned.level}</span>` : ''}
        </div>
      </div>
      <div class="card" style="padding:12px;margin-bottom:16px;border-color:${rc}22">
        <div style="font-size:0.7rem;color:#aaa;line-height:1.6;font-style:italic">"${def.desc || def.lore || '???'}"</div>
      </div>
      ${masteryHtml}
      ${burnInfo}
      <div style="display:grid;gap:8px;margin-bottom:16px">${abilities}</div>
      ${!owned ? `<div class="card" style="text-align:center;color:#6a90b8;font-size:0.7rem;padding:12px">
        🔒 Nije u kolekciji — otvori paket da dobijes ovog komandira
      </div>` : ''}
    `,
    modalActions
  );
}

// ── POSTAVI AKTIVNOG ──
function setActiveCommander(cmdId) {
  const owned = (window.ownedCommanders || []).find(o => o.id === cmdId)
    || (window.ownedCommanders || []).find(o => String(o.id).toLowerCase() === String(cmdId).toLowerCase());
  if (!owned) { toast('❌ Nemaš ovog komandira!', 'err'); return; }

  window._activeCommander = cmdId;

  const allCmds = [
    ...(typeof COMMANDERS !== 'undefined' ? COMMANDERS : []),
    ...(typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
    ...(typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  ];
  const def = allCmds.find(c => c.id === cmdId);
  toast(`✅ ${def ? def.icon+' '+def.name : cmdId} je sada aktivan komandir!`, 'ok');
  saveGame();
  renderCommanderCards();
}

// ── UNIŠTI KOMANDIRA ──
function destroyCommander(cmdId) {
  if (!window.ownedCommanders) return;
  const idx = window.ownedCommanders.findIndex(o => o.id === cmdId);
  if (idx === -1) { toast('❌ Nemaš ovog komandira!', 'err'); return; }

  const def = [
    ...(typeof COMMANDERS !== 'undefined' ? COMMANDERS : []),
    ...(typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
    ...(typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  ].find(c => c.id === cmdId) || null;

  // Skini sa deploymenta ako je deployovan
  if (window._deployedCommanders?.includes(cmdId)) {
    undeployCommander(cmdId);
  }

  // Vrati brodove u hangar
  clearCommanderFleet(cmdId);

  // Očisti _cmdFleet referencu
  if (window._cmdFleet) {
    window._cmdFleet = window._cmdFleet.map(id => id === cmdId ? null : id);
  }

  // Ako je bio aktivan, postavi drugog
  if (window._activeCommander === cmdId) {
    const next = (window._deployedCommanders || [])[0] || null;
    window._activeCommander = next;
  }

  // Uhvati nivo pre nego što obrišemo
  const burnedLevel = window.ownedCommanders[idx]?.level || 0;

  window.ownedCommanders.splice(idx, 1);

  // Nagrada: ključevi = nivo × rarity multiplikator
  const rarityMult = { C: 1, R: 2.5, E: 5, L: 10 }[def?.rarity] || 1;
  const keyReward = Math.floor(burnedLevel * rarityMult);
  if (keyReward > 0) {
    if (typeof R !== 'undefined' && R.keys !== undefined) R.keys += keyReward;
    if (typeof updateResUI === 'function') updateResUI();
    toast(`🔥 ${def ? def.icon+' '+def.name : cmdId} spaljen! +${keyReward} 🗝️ ključeva`, 'ok');
  } else {
    toast(`💀 ${def ? def.icon+' '+def.name : cmdId} uništen!`, 'ok');
  }

  saveGame();
  renderCommanderCards();
}

// ── PULL ANIMACIJA ──
function doPullAndShow(packId, count) {
  const results = doPull(packId, count);
  if (!results.length) return;

  const allCmds = [
    ...(typeof COMMANDERS !== 'undefined' ? COMMANDERS : []),
    ...(typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
    ...(typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  ];

  const cardsHtml = results.map(({ cmd, duplicate, leveled, shardsNow, cost }) => {
    const rc = rarityColor(cmd.rarity);
    const rg = rarityGlow(cmd.rarity);
    return `
      <div style="text-align:center;background:rgba(0,0,0,0.4);border-radius:10px;
        border:1px solid ${duplicate ? rc+'55' : rc+'88'};padding:14px 10px;position:relative">
        ${leveled > 0 ? `<div style="position:absolute;top:4px;right:6px;font-size:0.55rem;
          color:#00ff88;background:rgba(0,0,0,0.85);border-radius:4px;padding:2px 6px;font-weight:700">
          ▲ +${leveled} LVL!</div>` : ''}
        ${duplicate && !leveled ? `<div style="position:absolute;top:4px;right:6px;font-size:0.52rem;
          color:#ffcc44;background:rgba(0,0,0,0.75);border-radius:4px;padding:2px 5px">
          🧩 ${shardsNow}/${cost}</div>` : ''}
        <div style="font-size:2.2rem;filter:drop-shadow(0 0 10px ${rg})">${cmd.icon}</div>
        <div style="font-size:0.65rem;font-weight:700;color:${rc};margin:4px 0;
          font-family:'Orbitron',monospace">${cmd.name}</div>
        <div style="font-size:0.55rem;color:${rc}">${rarityName(cmd.rarity)}</div>
        <div style="font-size:0.52rem;margin-top:4px;color:${leveled>0?'#00ff88':duplicate?'#6a90b8':'#00ff88'}">
          ${duplicate ? (leveled > 0 ? `▲ Level Up!` : `Duplikat → Shard`) : '✨ Novo!'}
        </div>
      </div>`;
  }).join('');

  const newCount = results.filter(r => !r.duplicate).length;
  const dupCount = results.filter(r => r.duplicate).length;

  openModal(
    `🎴 Pull Rezultati`,
    `
      <div style="text-align:center;margin-bottom:14px;font-size:0.72rem;color:#6a90b8">
        ${newCount > 0 ? `<span style="color:#00ff88">✨ ${newCount} novi komandir${newCount>1?'a':''}!</span>` : ''}
        ${dupCount > 0 ? `<span style="color:#ffcc44;margin-left:8px">🔄 ${dupCount} duplikat${dupCount>1?'a':''}</span>` : ''}
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px;
        max-height:60vh;overflow-y:auto">
        ${cardsHtml}
      </div>
    `,
    [{ label: '✓ Zatvori', fn: closeModal }]
  );

  renderCommanderCards();
}

// ── TAB SISTEM ──
window._cardTab = window._cardTab || 'packs'; // 'packs' | 'collection' | 'fleet'

function showCardTab(tab) {
  window._cardTab = tab;
  renderCardTabs();
}

function renderCardTabs() {
  const nav  = document.getElementById('cardTabNav');
  const body = document.getElementById('cardTabBody');
  if (!nav || !body) return;

  const tabs = [
    { id: 'packs',      icon: '🎴', label: 'Paketi & Kolekcija' },
    { id: 'fleet',      icon: '🚀', label: 'Flota Komandira' },
  ];

  nav.innerHTML = tabs.map(t => `
    <button class="btn ${window._cardTab === t.id ? 'btn-g' : ''}"
      style="font-size:0.72rem;padding:6px 16px"
      onclick="showCardTab('${t.id}')">
      ${t.icon} ${t.label}
    </button>`).join('');

  // Prikaži odgovarajući tab
  const cardsEl = document.getElementById('commanderCardsContent');
  const fleetEl = document.getElementById('cmdFleetContent');
  if (!cardsEl || !fleetEl) return;

  if (window._cardTab === 'fleet') {
    body.innerHTML = '';
    fleetEl.style.display = '';
    cardsEl.style.display = 'none';
    renderFleetCommanders();
  } else {
    body.innerHTML = '';
    cardsEl.style.display = '';
    fleetEl.style.display = 'none';
    renderCommanderCards();
  }
}

// ── GLAVNI RENDER ──
function renderCommanderCards() {
  const el = document.getElementById('commanderCardsContent');
  if (!el) return;

  try {
  initCardState();

  const allCmds = [
    ...(typeof COMMANDERS !== 'undefined' ? COMMANDERS : []),
    ...(typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
    ...(typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  ];

  const owned = window.ownedCommanders || [];
  const ownedIds = new Set(owned.map(o => o.id));
  const activeCmdId = window._activeCommander;
  const activeCmdData = getActiveCommanderData();

  const keys = R.keys || 0;

  // ── AKTIVNI KOMANDIR HEADER ──
  let activeHeader = '';
  if (activeCmdData) {
    const { def, owned: ownedCmd } = activeCmdData;
    const rc = rarityColor(def.rarity);
    const rg = rarityGlow(def.rarity);
    const factions = {
      ...(typeof FACTIONS !== 'undefined' ? FACTIONS : {}),
      ...(typeof XENOS_FACTIONS !== 'undefined' ? XENOS_FACTIONS : {}),
    ...(typeof UNDEAD_FACTIONS !== 'undefined' ? UNDEAD_FACTIONS : {}),
    };
    const fac = factions[def.faction] || { name: def.faction, icon: '?' };
    const xpNeed = getCardXpForLevel(ownedCmd.level);
    const xpPct = Math.min(100, (ownedCmd.xp / xpNeed) * 100);
    activeHeader = `
      <div class="card" style="margin-bottom:20px;border-color:${rc}55;
        background:linear-gradient(135deg,rgba(0,0,0,0.5),rgba(${rc.replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)).join(',')},0.05))">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="font-size:3.5rem;filter:drop-shadow(0 0 16px ${rg})">${def.icon}</div>
          <div style="flex:1">
            <div style="font-size:0.6rem;color:#6a90b8;font-family:'Orbitron',monospace;
              letter-spacing:2px;margin-bottom:2px">AKTIVNI KOMANDIR</div>
            <div style="font-size:1.1rem;font-weight:700;color:${rc};
              font-family:'Orbitron',monospace">${def.name}</div>
            <div style="font-size:0.65rem;color:#6a90b8;margin:2px 0">
              ${fac.icon} ${fac.name} · <span style="color:${rc}">${rarityName(def.rarity)}</span>
              · Lv. <strong style="color:white">${ownedCmd.level}</strong>/100
            </div>
            <div class="pbar" style="height:5px;margin:6px 0">
              <div class="pbar-fill" style="width:${xpPct}%;background:${rc}"></div>
            </div>
            <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:8px">
              ${fmt(ownedCmd.xp)} / ${fmt(xpNeed)} XP
              · Flota bonus: <span style="color:#00ff88">+${getCardFleetBonus()}%</span>
            </div>
            ${def.passive ? `
              <div style="font-size:0.62rem;color:#aa44ff;padding:4px 8px;
                background:rgba(170,68,255,0.1);border-radius:4px;border-left:2px solid #aa44ff44">
                🛡️ <strong>${def.passive.name}</strong> — ${def.passive.desc}
              </div>` : ''}
          </div>
          <button class="btn" style="font-size:0.65rem;white-space:nowrap"
            onclick="showCardDetail('${def.id}')">👁️ Detalji</button>
        </div>
      </div>`;
  } else {
    activeHeader = `
      <div class="card" style="margin-bottom:20px;border-color:rgba(106,144,184,0.2);
        text-align:center;padding:20px">
        <div style="font-size:2rem;margin-bottom:8px">🎴</div>
        <div style="font-size:0.8rem;color:#6a90b8">Nema aktivnog komandira</div>
        <div style="font-size:0.65rem;color:#444;margin-top:4px">Otvori paket i postavi komandira</div>
      </div>`;
  }

  // ── PAKOVI ──
  const packsHtml = Object.values(CARD_PACKS).map(pack => {
    const poolSize = pack.pool().length;
    const ownedInPack = pack.pool().filter(c => ownedIds.has(c.id)).length;
    const pct = poolSize > 0 ? Math.floor((ownedInPack / poolSize) * 100) : 0;
    const pity = window._packPity[pack.id] || 0;
    const canSingle = keys >= pack.costSingle;
    const canMulti  = keys >= pack.costMulti;
    return `
      <div class="card" style="border-color:${pack.color}44">
        <div style="display:flex;align-items:flex-start;gap:14px">
          <div style="font-size:3rem;filter:drop-shadow(0 0 10px ${pack.color})">${pack.icon}</div>
          <div style="flex:1">
            <div style="font-size:0.85rem;font-weight:700;color:${pack.color};
              font-family:'Orbitron',monospace;margin-bottom:4px">${pack.name}</div>
            <div style="font-size:0.65rem;color:#6a90b8;margin-bottom:8px;line-height:1.5">
              ${pack.desc}
            </div>
            <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:8px">
              Kolekcija: <strong style="color:${pack.color}">${ownedInPack}/${poolSize}</strong>
              (${pct}%) · Pity: <strong style="color:#ffcc44">${pity}/90</strong>
            </div>
            <div class="pbar" style="height:4px;margin-bottom:12px">
              <div class="pbar-fill" style="width:${pct}%;background:${pack.color}"></div>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn ${canSingle?'btn-g':''}" style="flex:1;font-size:0.68rem"
                onclick="doPullAndShow('${pack.id}',1)" ${canSingle?'':' disabled'}>
                🎴 ×1 — ${pack.costSingle} 🗝️
              </button>
              <button class="btn ${canMulti?'btn-g':''}" style="flex:1;font-size:0.68rem"
                onclick="doPullAndShow('${pack.id}',10)" ${canMulti?'':' disabled'}>
                🎴 ×10 — ${pack.costMulti} 🗝️
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');

  // ── FILTERI ZA KOLEKCIJU ──
  // Object.assign osigurava da svi ključevi imaju default 'all' ako nedostaju
  const filterState = Object.assign(
    { faction: 'all', rarity: 'all', owned: 'all', series: 'all' },
    window._cardFilterState || {}
  );

  // ── KOLEKCIJA ──
  const seriesMap = {
    origin: (typeof COMMANDERS !== 'undefined' ? COMMANDERS : []),
    xenos:  (typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
    undead: (typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  };

  const factions = {
    ...(typeof FACTIONS !== 'undefined' ? FACTIONS : {}),
    ...(typeof XENOS_FACTIONS !== 'undefined' ? XENOS_FACTIONS : {}),
    ...(typeof UNDEAD_FACTIONS !== 'undefined' ? UNDEAD_FACTIONS : {}),
  };

  let displayCmds = [...allCmds];
  if (filterState.series !== 'all') {
    const pool = seriesMap[filterState.series] || [];
    const poolIds = new Set(pool.map(c => c.id));
    displayCmds = displayCmds.filter(c => poolIds.has(c.id));
  }
  if (filterState.faction !== 'all') displayCmds = displayCmds.filter(c => c.faction === filterState.faction);
  if (filterState.rarity !== 'all') displayCmds = displayCmds.filter(c => c.rarity === filterState.rarity);
  if (filterState.owned === 'owned')   displayCmds = displayCmds.filter(c =>  ownedIds.has(c.id));
  if (filterState.owned === 'missing') displayCmds = displayCmds.filter(c => !ownedIds.has(c.id));

  // Sortiraj: owned prvo, unutar owned Legendary→Common, unutar not-owned isto
  const rarOrder = { L: 0, E: 1, R: 2, C: 3 };
  displayCmds.sort((a, b) => {
    const aOwned = ownedIds.has(a.id) ? 0 : 1;
    const bOwned = ownedIds.has(b.id) ? 0 : 1;
    if (aOwned !== bOwned) return aOwned - bOwned;
    return (rarOrder[a.rarity] || 3) - (rarOrder[b.rarity] || 3);
  });

  const collectionCards = displayCmds.map(cmd => {
    const ownedEntry = owned.find(o => o.id === cmd.id);
    const isAct = cmd.id === activeCmdId;
    return renderCardMini(cmd, ownedEntry, isAct);
  }).join('');

  // Faction options
  const allFactions = [...new Set(allCmds.map(c => c.faction))];
  const factionOpts = allFactions.map(f => {
    const fDef = factions[f] || { name: f, icon: '?' };
    return `<option value="${f}" ${filterState.faction===f?'selected':''}>${fDef.icon} ${fDef.name}</option>`;
  }).join('');

  el.innerHTML = `
    <!-- Aktivni komandir -->
    ${activeHeader}

    <!-- Pakovi -->
    <div style="font-family:'Orbitron',monospace;font-size:0.75rem;color:#00d4ff;
      letter-spacing:2px;margin-bottom:12px;padding-bottom:8px;
      border-bottom:1px solid rgba(0,212,255,0.15)">
      🎴 PAKOVI KARTI
    </div>
    <div style="display:grid;gap:14px;margin-bottom:28px">
      ${packsHtml}
    </div>

    <!-- Kolekcija -->
    <div style="display:flex;align-items:center;justify-content:space-between;
      margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(0,212,255,0.15)">
      <div style="font-family:'Orbitron',monospace;font-size:0.75rem;color:#00d4ff;letter-spacing:2px">
        📚 KOLEKCIJA (${ownedIds.size}/${allCmds.length})
      </div>
      <div style="font-size:0.62rem;color:#6a90b8">
        Ključevi: <strong style="color:white">${fmt(keys)} 🗝️</strong>
      </div>
    </div>

    <!-- Filteri -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      <select class="input-field" style="font-size:0.65rem;padding:4px 8px;flex:1;min-width:100px"
        onchange="window._cardFilterState=window._cardFilterState||{};window._cardFilterState.series=this.value;renderCommanderCards()">
        <option value="all" ${filterState.series==='all'?'selected':''}>📦 Sve Serije</option>
        <option value="origin" ${filterState.series==='origin'?'selected':''}>🌌 Origin</option>
        <option value="xenos" ${filterState.series==='xenos'?'selected':''}>👾 Xenos</option>
        <option value="undead" ${filterState.series==='undead'?'selected':''}>💀 Undead</option>
      </select>
      <select class="input-field" style="font-size:0.65rem;padding:4px 8px;flex:1;min-width:100px"
        onchange="window._cardFilterState=window._cardFilterState||{};window._cardFilterState.faction=this.value;renderCommanderCards()">
        <option value="all" ${filterState.faction==='all'?'selected':''}>🌐 Sve Frakcije</option>
        ${factionOpts}
      </select>
      <select class="input-field" style="font-size:0.65rem;padding:4px 8px;flex:1;min-width:100px"
        onchange="window._cardFilterState=window._cardFilterState||{};window._cardFilterState.rarity=this.value;renderCommanderCards()">
        <option value="all" ${filterState.rarity==='all'?'selected':''}>⭐ Svi Rariteti</option>
        <option value="C" ${filterState.rarity==='C'?'selected':''}>⬜ Common</option>
        <option value="R" ${filterState.rarity==='R'?'selected':''}>🔵 Rare</option>
        <option value="E" ${filterState.rarity==='E'?'selected':''}>🟣 Epic</option>
        <option value="L" ${filterState.rarity==='L'?'selected':''}>🟡 Legendary</option>
      </select>
      <select class="input-field" style="font-size:0.65rem;padding:4px 8px;flex:1;min-width:100px"
        onchange="window._cardFilterState=window._cardFilterState||{};window._cardFilterState.owned=this.value;renderCommanderCards()">
        <option value="all" ${filterState.owned==='all'?'selected':''}>Svi</option>
        <option value="owned" ${filterState.owned==='owned'?'selected':''}>✅ Imam</option>
        <option value="missing" ${filterState.owned==='missing'?'selected':''}>🔒 Nemam</option>
      </select>
    </div>

    <!-- Statistike kolekcije po raritetu -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">
      ${['L','E','R','C'].map(r => {
        const total = allCmds.filter(c => c.rarity === r).length;
        const have  = allCmds.filter(c => c.rarity === r && ownedIds.has(c.id)).length;
        const rc2   = rarityColor(r);
        return `<div style="text-align:center;background:rgba(0,0,0,0.3);border-radius:6px;
          border:1px solid ${rc2}33;padding:8px">
          <div style="font-size:0.8rem;font-weight:700;color:${rc2};
            font-family:'Orbitron',monospace">${have}/${total}</div>
          <div style="font-size:0.55rem;color:#6a90b8;margin-top:2px">${rarityName(r)}</div>
          <div class="pbar" style="height:3px;margin-top:4px">
            <div class="pbar-fill" style="width:${total>0?Math.floor((have/total)*100):0}%;background:${rc2}"></div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <!-- Kartice grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:10px">
      ${collectionCards || '<div style="color:#6a90b8;font-size:0.7rem;padding:20px;text-align:center;grid-column:1/-1">Nema komandira za prikaz</div>'}
    </div>
  `;
  } catch(err) {
    console.error('[commander_cards] renderCommanderCards error:', err);
    el.innerHTML = `<div class="card" style="color:#ff4444;padding:20px;text-align:center">
      ❌ Greška pri učitavanju karti:<br>
      <code style="font-size:0.65rem;color:#ffaa00">${err.message}</code><br><br>
      <button class="btn" onclick="renderCommanderCards()">🔄 Pokušaj ponovo</button>
    </div>`;
  }
}

// CSS za aktivnu karticu
(function injectCardCss() {
  const style = document.createElement('style');
  style.textContent = `
    .commander-card {
      transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    }
    .commander-card[onclick]:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important;
    }
    .commander-card:not([onclick]):hover {
      /* Nije owned — blagi glow ali bez lifta */
      filter: brightness(0.75);
    }
    .cmd-active {
      outline: 2px solid rgba(0,212,255,0.5) !important;
      outline-offset: 2px;
    }
    .input-field {
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(0,212,255,0.2);
      border-radius: 6px;
      color: white;
      outline: none;
    }
    .input-field:focus { border-color: rgba(0,212,255,0.5); }
    .input-field option { background: #0c1428; }
  `;
  document.head.appendChild(style);

  // Fleet dodatni CSS
  const s2 = document.createElement('style');
  s2.textContent = `
    .fleet-slot {
      position: relative;
      border-radius: 10px;
      transition: all 0.2s;
      cursor: pointer;
    }
    .fleet-slot:hover { transform: translateY(-3px); }
    .fleet-slot-empty {
      border: 2px dashed rgba(0,212,255,0.2);
      background: rgba(0,0,0,0.2);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
    }
    .fleet-slot-empty:hover {
      border-color: rgba(0,212,255,0.5);
      background: rgba(0,212,255,0.05);
    }
    .fleet-slot-locked {
      border: 2px dashed rgba(106,144,184,0.1);
      background: rgba(0,0,0,0.1);
      cursor: not-allowed;
      opacity: 0.4;
    }
    .fleet-slot-locked:hover { transform: none; }
    .fleet-bonus-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 5px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 0.62rem;
    }
    .fleet-bonus-row:last-child { border-bottom: none; }
    @keyframes fleetGlow {
      0%,100% { box-shadow: 0 0 8px rgba(0,212,255,0.2); }
      50%      { box-shadow: 0 0 20px rgba(0,212,255,0.5); }
    }
    .fleet-full { animation: fleetGlow 2s infinite; }
  `;
  document.head.appendChild(s2);
})();

// ============================================================
// FLEET COMMANDER SISTEM
// ============================================================

// Slot definicije — svaki slot ima ulogu i bonus tip
const FLEET_SLOTS = [
  // Row 1 — Vrhovna komanda (uvijek dostupan)
  { id: 0, role: 'Admiral',           icon: '👑', bonus: 'attack',   row: 1, reqLvl: 0  },
  // Row 2 — Unlocked na 25
  { id: 1, role: 'Wing Commander L',  icon: '⚔️',  bonus: 'attack',   row: 2, reqLvl: 25 },
  { id: 2, role: 'Wing Commander D',  icon: '🛡️',  bonus: 'defense',  row: 2, reqLvl: 25 },
  // Row 3 — Unlocked na 50
  { id: 3, role: 'Ace Pilot',         icon: '🚀',  bonus: 'speed',    row: 3, reqLvl: 50 },
  { id: 4, role: 'Weapons Officer',   icon: '💥',  bonus: 'attack',   row: 3, reqLvl: 50 },
  { id: 5, role: 'Shield Officer',    icon: '🔵',  bonus: 'shield',   row: 3, reqLvl: 50 },
  // Row 4 — Unlocked na 75
  { id: 6, role: 'Scout Master',      icon: '🔭',  bonus: 'evasion',  row: 4, reqLvl: 75 },
  { id: 7, role: 'Logistics',         icon: '⚙️',  bonus: 'economy',  row: 4, reqLvl: 75 },
  { id: 8, role: 'Berserker',         icon: '🔥',  bonus: 'crit',     row: 4, reqLvl: 75 },
];

const FLEET_BONUS_LABELS = {
  attack:  { label: 'Napad Flote',    color: '#ff4444', icon: '⚔️'  },
  defense: { label: 'Odbrana',        color: '#4488ff', icon: '🛡️'  },
  speed:   { label: 'Brzina',         color: '#00ff88', icon: '🚀'  },
  shield:  { label: 'Štit',           color: '#00d4ff', icon: '🔵'  },
  economy: { label: 'Ekonomija',      color: '#ffcc44', icon: '💰'  },
  evasion: { label: 'Evasion',        color: '#aa44ff', icon: '👻'  },
  crit:    { label: 'Kritičan Udar',  color: '#ff8833', icon: '💥'  },
};

// Multiplikator bonusa po raritetu (base = level karte)
const SLOT_RARITY_MULT = { C: 0.5, R: 1.0, E: 1.8, L: 3.0 };

// Inicijalizacija fleet state-a
function initFleetState() {
  if (!window._cmdFleet) {
    // 9 slotova, null = prazan
    window._cmdFleet = new Array(9).fill(null);
  }
}

// Koliko slotova je dostupno
function getFleetCapacity() {
  const lvl = commander.level || 1;
  if (lvl >= 75) return 9;
  if (lvl >= 50) return 6;
  if (lvl >= 25) return 3;
  return 1;
}

// Sledeći unlock
function getNextFleetUnlock() {
  const lvl = commander.level || 1;
  if (lvl < 25) return { at: 25, slots: 3 };
  if (lvl < 50) return { at: 50, slots: 6 };
  if (lvl < 75) return { at: 75, slots: 9 };
  return null;
}

// Izračunaj ukupne fleet bonuse
function calcFleetBonuses() {
  initFleetState();
  const bonuses = { attack: 0, defense: 0, speed: 0, shield: 0, economy: 0, evasion: 0, crit: 0 };
  const allCmds = [
    ...(typeof COMMANDERS !== 'undefined' ? COMMANDERS : []),
    ...(typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
    ...(typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  ];
  const cap = getFleetCapacity();

  FLEET_SLOTS.slice(0, cap).forEach(slot => {
    const cmdId = window._cmdFleet[slot.id];
    if (!cmdId) return;
    const owned = (window.ownedCommanders || []).find(o => o.id === cmdId);
    if (!owned) return;
    const def = allCmds.find(c => c.id === cmdId);
    if (!def) return;

    const mult   = SLOT_RARITY_MULT[def.rarity] || 1;
    const lvlPct = ((owned.level - 1) / 99); // 0→1 kako raste nivo
    const base   = 5 + lvlPct * 25; // 5% na Lv1, 30% na Lv100

    bonuses[slot.bonus] = (bonuses[slot.bonus] || 0) + Math.floor(base * mult);

    // Synergy: ako specialty odgovara slot bonusu
    const shipSynergy = (def.specialty_ships || []).some(s =>
      (slot.bonus === 'attack'  && ['battleship','cruiser','fighter'].includes(s)) ||
      (slot.bonus === 'defense' && ['battleship','cruiser','carrier'].includes(s)) ||
      (slot.bonus === 'speed'   && ['scout','fighter'].includes(s)) ||
      (slot.bonus === 'shield'  && ['carrier','cruiser'].includes(s)) ||
      (slot.bonus === 'evasion' && ['scout','fighter'].includes(s)) ||
      (slot.bonus === 'crit'    && ['fighter','special'].includes(s))
    );
    if (shipSynergy) bonuses[slot.bonus] += 5;
  });

  // Faction synergy: broji iz slotova i deployovanih komandira
  const factionCount = {};
  const countFaction = id => {
    const def = allCmds.find(c => c.id === id);
    if (def) factionCount[def.faction] = (factionCount[def.faction] || 0) + 1;
  };
  FLEET_SLOTS.slice(0, cap).forEach(slot => {
    const cmdId = window._cmdFleet[slot.id];
    if (cmdId) countFaction(cmdId);
  });
  (window._deployedCommanders || []).forEach(id => countFaction(id));
  const hasFactionBonus = Object.values(factionCount).some(v => v >= 3);
  if (hasFactionBonus) {
    Object.keys(bonuses).forEach(k => { bonuses[k] = Math.floor(bonuses[k] * 1.1); });
  }

  return { bonuses, hasFactionBonus, factionCount };
}

// Dodaj komandira u slot
function assignCommanderToSlot(slotId, cmdId) {
  initFleetState();
  // Ukloni ga iz drugog slota ako je već tamo
  window._cmdFleet = window._cmdFleet.map((id, i) => (id === cmdId && i !== slotId) ? null : id);
  window._cmdFleet[slotId] = cmdId;
  saveGame();
  renderFleetCommanders();
}

// Ukloni komandira iz slota
function removeCommanderFromSlot(slotId) {
  initFleetState();
  window._cmdFleet[slotId] = null;
  saveGame();
  renderFleetCommanders();
}

// Modal za odabir komandira za slot
function openSlotPicker(slotId) {
  const slot = FLEET_SLOTS[slotId];
  const owned = window.ownedCommanders || [];
  const allCmds = [
    ...(typeof COMMANDERS !== 'undefined' ? COMMANDERS : []),
    ...(typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
    ...(typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  ];
  const bonusInfo = FLEET_BONUS_LABELS[slot.bonus];
  const cap = getFleetCapacity();

  // Sortiraj owned komandire po raritetu pa levelu
  const rarOrd = { L:0, E:1, R:2, C:3 };
  const ownedList = [...owned].sort((a, b) => {
    const da = allCmds.find(c => c.id === a.id);
    const db = allCmds.find(c => c.id === b.id);
    const ra = da ? rarOrd[da.rarity] : 3;
    const rb = db ? rarOrd[db.rarity] : 3;
    if (ra !== rb) return ra - rb;
    return (b.level || 1) - (a.level || 1);
  });

  const cards = ownedList.map(o => {
    const def = allCmds.find(c => c.id === o.id);
    if (!def) return '';
    const rc  = rarityColor(def.rarity);
    const rg  = rarityGlow(def.rarity);
    const inFleet = (window._cmdFleet || []).some((id, i) => id === o.id && i !== slotId);
    const isAssigned = window._cmdFleet[slotId] === o.id;

    // Synergy check
    const hasSynergy = (def.specialty_ships || []).some(s =>
      (slot.bonus === 'attack'  && ['battleship','cruiser','fighter'].includes(s)) ||
      (slot.bonus === 'speed'   && ['scout','fighter'].includes(s)) ||
      (slot.bonus === 'shield'  && ['carrier','cruiser'].includes(s)) ||
      (slot.bonus === 'evasion' && ['scout','fighter'].includes(s)) ||
      (slot.bonus === 'crit'    && ['fighter','special'].includes(s))
    );

    const mult = SLOT_RARITY_MULT[def.rarity] || 1;
    const lvlPct = ((o.level - 1) / 99);
    const preview = Math.floor((5 + lvlPct * 25) * mult) + (hasSynergy ? 5 : 0);

    return `
      <div onclick="assignCommanderToSlot(${slotId},'${def.id}');closeModal()"
        style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;
          cursor:pointer;border:1px solid ${isAssigned ? rc : rc+'33'};
          background:${isAssigned ? rc+'15' : 'rgba(0,0,0,0.2)'};
          transition:all 0.15s;margin-bottom:6px;
          opacity:${inFleet ? 0.45 : 1}"
        onmouseover="this.style.background='${rc}15'"
        onmouseout="this.style.background='${isAssigned ? rc+'15' : 'rgba(0,0,0,0.2)'}'"
      >
        <div style="font-size:2rem;filter:drop-shadow(0 0 6px ${rg})">${def.icon}</div>
        <div style="flex:1">
          <div style="font-size:0.72rem;font-weight:700;color:${rc};
            font-family:'Orbitron',monospace">${def.name}</div>
          <div style="font-size:0.58rem;color:#6a90b8">
            ${rarityName(def.rarity)} · Lv.${o.level}
            ${inFleet ? '<span style="color:#ff4444"> · već u floti</span>' : ''}
          </div>
          ${def.passive ? `<div style="font-size:0.55rem;color:#aa44ff;margin-top:2px">
            🛡️ ${def.passive.name}</div>` : ''}
        </div>
        <div style="text-align:right">
          ${hasSynergy ? `<div style="font-size:0.55rem;color:#ffcc44;margin-bottom:3px">⭐ Sinergija</div>` : ''}
          <div style="font-size:0.72rem;font-weight:700;color:${bonusInfo.color};
            font-family:'Orbitron',monospace">
            +${preview}%
          </div>
          <div style="font-size:0.52rem;color:#6a90b8">${bonusInfo.label}</div>
        </div>
      </div>`;
  }).join('');

  openModal(
    `${slot.icon} ${slot.role} — Odaberi Komandira`,
    `<div style="font-size:0.65rem;color:#6a90b8;margin-bottom:12px;padding:8px;
      background:rgba(0,0,0,0.3);border-radius:6px;border-left:3px solid ${bonusInfo.color}">
      ${bonusInfo.icon} Ovaj slot pojačava: <strong style="color:${bonusInfo.color}">${bonusInfo.label}</strong>
      — odaberi komandira čija se specialnost poklapa za sinergiju bonus
    </div>
    <div style="max-height:55vh;overflow-y:auto;padding-right:4px">
      ${cards || '<div style="color:#6a90b8;text-align:center;padding:20px">Nemaš niti jednog komandira. Otvori paket!</div>'}
    </div>`,
    []
  );
}

// ── RENDER FLEET PANEL ──
function renderFleetCommanders() {
  const el = document.getElementById('cmdFleetContent');
  if (!el) return;

  const cmdLvl    = commander.level || 1;
  const maxDeploy = typeof getMaxDeployedCommanders === 'function' ? getMaxDeployedCommanders() : 1;
  const deployed  = window._deployedCommanders || [];
  const owned     = window.ownedCommanders || [];
  const allCmds   = [
    ...(typeof COMMANDERS !== 'undefined' ? COMMANDERS : []),
    ...(typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
    ...(typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  ];
  const isFull = deployed.length >= maxDeploy;

  // ── KAPACITET HEADER ──
  const tierNames = { 1:'Flagship', 3:'Battle Wing', 6:'Strike Force', 9:'Grand Armada' };
  const tierName  = tierNames[maxDeploy] || `${maxDeploy} Komandira`;

  const nextUnlockLvl = cmdLvl < 25 ? 25 : cmdLvl < 50 ? 50 : cmdLvl < 75 ? 75 : null;

  const headerHtml = `
    <div class="card" style="margin-bottom:16px;
      border-color:${isFull ? '#00d4ff55' : 'rgba(0,212,255,0.15)'};padding:14px 16px">
      <div style="display:flex;align-items:center;gap:14px">
        <div style="font-size:2.5rem">
          ${maxDeploy === 1 ? '🚀' : maxDeploy === 3 ? '⚔️' : maxDeploy === 6 ? '🌟' : '🔱'}
        </div>
        <div style="flex:1">
          <div style="font-size:0.58rem;color:#6a90b8;font-family:'Orbitron',monospace;
            letter-spacing:2px;margin-bottom:2px">FORMACIJA FLOTE KOMANDIRA</div>
          <div style="font-size:0.9rem;font-weight:700;color:white;
            font-family:'Orbitron',monospace">${tierName}</div>
          <div style="font-size:0.6rem;color:#6a90b8;margin-top:3px">
            Komandir Lv.${cmdLvl} ·
            <span style="color:${isFull?'#00ff88':'#ffcc44'}">${deployed.length}/${maxDeploy} komandira deployovano</span>
            ${isFull ? ' · <span style="color:#00d4ff">★ Puna formacija!</span>' : ''}
          </div>
          ${nextUnlockLvl ? `
            <div style="font-size:0.55rem;color:#6a90b8;margin-top:4px">
              🔒 Sledeći unlock na Komandir Lv.<strong style="color:#aa44ff">${nextUnlockLvl}</strong>
            </div>` : `
            <div style="font-size:0.55rem;color:#00ff88;margin-top:4px">✅ Maksimalna formacija!</div>`}
        </div>
        <button class="btn" style="font-size:0.65rem;padding:5px 12px"
          onclick="showPanel('fleet')">🚀 Uredi flote</button>
      </div>
    </div>`;

  // ── FACTION SYNERGY panel (tutorial-style) ──
  const fb = typeof calcFleetBonuses === 'function' ? calcFleetBonuses() : null;
  const factionCt = fb ? Object.entries(fb.factionCount) : [];
  const hasSyn = fb?.hasFactionBonus;
  const nearSyn = factionCt.find(([,c]) => c === 2);
  const noDeploy = factionCt.length === 0;
  const synHtml = `
    <div style="margin-bottom:12px;padding:14px 16px;border-radius:8px;
      background:${hasSyn ? 'rgba(255,204,68,0.06)' : 'rgba(0,212,255,0.04)'};
      border:1px solid ${hasSyn ? 'rgba(255,204,68,0.2)' : 'rgba(0,212,255,0.1)'}">
      <div style="font-size:0.85rem;font-weight:700;color:${hasSyn ? '#ffcc44' : '#00d4ff'};
        font-family:'Orbitron',monospace;margin-bottom:8px">
        ${hasSyn ? '🔗 FACTION SYNERGY AKTIVNA! +10%' : '🔗 FACTION SYNERGY'}
      </div>
      <div style="font-size:0.8rem;color:#c8d8e8;margin-bottom:10px;line-height:1.5">
        ${hasSyn
          ? 'Svi bonusi flote su uvećani za <strong>+10%</strong> jer imaš 3+ komandira iste frakcije.'
          : noDeploy
            ? 'Svaki komandir pripada nekoj frakciji. Ako deployuješ <strong>3 komandira iste frakcije</strong>, dobijaš <strong>+10%</strong> na sve bonuse.'
            : 'Deployuj <strong>još 1 komandira</strong> iste frakcije da aktiviraš Faction Synergy i dobiješ <strong>+10%</strong> na sve bonuse.'}
      </div>
      ${factionCt.length > 0 ? `
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:${noDeploy ? '0' : '6px'}">
          ${factionCt.map(([f, c]) => {
            const ff = (typeof FACTIONS !== 'undefined' ? FACTIONS : {})[f]
              || (typeof XENOS_FACTIONS !== 'undefined' ? XENOS_FACTIONS : {})[f]
              || (typeof UNDEAD_FACTIONS !== 'undefined' ? UNDEAD_FACTIONS : {})[f]
              || null;
            const icon = (ff?.icon && ff.icon !== '??' && ff.icon !== '???' ? ff.icon : '');
            const isTarget = c >= 3 || nearSyn?.[0] === f;
            return `<span style="font-size:0.8rem;background:rgba(255,255,255,0.06);padding:4px 12px;border-radius:6px;
              color:${c >= 3 ? '#ffcc44' : '#8ab0d8'};border:1px solid ${c >= 3 ? '#ffcc4433' : 'transparent'}">
              ${icon} ${ff?.name||f}: ${c} ${c >= 3 ? '⭐' : nearSyn?.[0] === f ? '🔜' : ''}
            </span>`;
          }).join('')}
        </div>` : ''}
      <div style="font-size:0.8rem;color:#6a90b8;margin-top:4px">
        <span style="background:rgba(255,255,255,0.04);padding:4px 10px;border-radius:4px;display:inline-block">
          💡 ${hasSyn
            ? 'Odlično! Drži 3+ komandira ove frakcije u floti da synergy ostane aktivna.'
            : nearSyn
              ? 'Fali ti još 1 komandir u toj frakciji — deployuj ga sa liste ispod!'
              : noDeploy
                ? 'Deployuj komandire preko dugmeta 🚀 Deploy ispod, pa gledaj ovde.'
                : 'Trenutno nijedna frakcija nema 3+ komandira. Deployuj još komandira iste frakcije!'}
        </span>
      </div>
    </div>`;

  // ── DEPLOYED KOMANDIRI (gore — pregled aktivnih) ──
  if (!window._deployedCmdFilter) window._deployedCmdFilter = 'all';
  const depFlt = window._deployedCmdFilter;
  const depRarityBar = deployed.length > 1 ? `
    <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
      <select onchange="window._deployedCmdFilter=this.value;renderFleetCommanders()"
        style="flex:1;min-width:120px;padding:7px 10px;border-radius:6px;
          background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);
          color:#c8d8e8;font-size:0.65rem;cursor:pointer;outline:none;
          font-family:'Orbitron',monospace;letter-spacing:0.5px">
        <option value="all"${depFlt==='all'?' selected':''}>★ Svi Rariteti</option>
        <option value="L"${depFlt==='L'?' selected':''}>★ Legendary</option>
        <option value="E"${depFlt==='E'?' selected':''}>◆ Epic</option>
        <option value="R"${depFlt==='R'?' selected':''}>● Rare</option>
        <option value="C"${depFlt==='C'?' selected':''}>○ Common</option>
      </select>
    </div>` : '';

  const filteredDeployed = deployed.filter(cmdId => {
    if (depFlt === 'all') return true;
    const d = allCmds.find(c => c.id === cmdId);
    return d && d.rarity === depFlt;
  });

  const deployedHtml = deployed.length === 0 ? '' : `
    <div style="margin-bottom:16px">
      <div style="font-size:0.6rem;color:#00d4ff;font-family:'Orbitron',monospace;
        letter-spacing:2px;margin-bottom:8px">🚀 DEPLOYOVANI KOMANDIRI (${deployed.length}/${maxDeploy})</div>
      ${depRarityBar}
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${filteredDeployed.map(cmdId => {
          const def   = allCmds.find(c => c.id === cmdId);
          const entry = owned.find(o => o.id === cmdId);
          if (!def || !entry) return '';
          const rc  = rarityColor(def.rarity);
          const isLead = cmdId === window._activeCommander;
          const cFleet = typeof getCmdFleet === 'function' ? getCmdFleet(cmdId) : [];
          const filled = cFleet.filter(Boolean).length;
          const fDef = (typeof FACTIONS !== 'undefined' ? FACTIONS : {})[def.faction]
            || (typeof XENOS_FACTIONS !== 'undefined' ? XENOS_FACTIONS : {})[def.faction]
            || (typeof UNDEAD_FACTIONS !== 'undefined' ? UNDEAD_FACTIONS : {})[def.faction]
            || null;
          return `
            <div style="flex:1;min-width:120px;max-width:180px;border-radius:8px;
              border:1px solid ${rc}55;background:rgba(0,0,0,0.3);padding:10px;
              position:relative;text-align:center">
              ${isLead ? `<div style="position:absolute;top:4px;left:4px;font-size:0.45rem;
                color:${rc};background:${rc}22;border-radius:3px;padding:1px 5px;
                font-family:'Orbitron',monospace">★ LEAD</div>` : ''}
              <div style="font-size:1.8rem;filter:drop-shadow(0 0 8px ${rc}88);margin-bottom:4px">${def.icon}</div>
              <div style="font-size:0.62rem;font-weight:700;color:${rc};
                white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${def.name}</div>
              <div style="font-size:0.65rem;color:#6a90b8;margin:3px 0">
                <span title="${fDef?.name || def.faction}" style="cursor:default;font-size:0.7rem">${(fDef?.icon && fDef.icon !== '??' && fDef.icon !== '???' ? fDef.icon : '')}</span>
                Lv.${entry.level} · ${filled}/9 brodova</div>
              <div style="display:flex;gap:4px;justify-content:center;margin-top:6px">
                ${!isLead ? `<button class="btn" style="font-size:0.5rem;padding:2px 6px"
                  onclick="window._activeCommander='${cmdId}';renderFleetCommanders();saveGame()">★ Lead</button>` : ''}
                <button class="btn btn-r" style="font-size:0.5rem;padding:2px 6px"
                  onclick="undeployCommander('${cmdId}');renderFleetCommanders()">✕</button>
                <button class="btn" style="font-size:0.5rem;padding:2px 6px;background:#b8860b;color:#fff"
                  onclick="if(confirm('Skinuti sve brodove?')){clearCommanderFleet('${cmdId}');renderFleetCommanders()}">📦</button>
              </div>
            </div>`;
        }).join('')}
        ${!isFull ? `
          <div style="flex:1;min-width:100px;max-width:140px;border-radius:8px;
            border:1px dashed rgba(170,68,255,0.25);background:rgba(0,0,0,0.1);
            padding:10px;text-align:center;opacity:0.5;
            display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px">
            <div style="font-size:1.2rem;color:#aa44ff">+</div>
            <div style="font-size:0.52rem;color:#6a90b8">Slobodan slot</div>
          </div>` : ''}
      </div>
    </div>`;

  // ── LISTA POSJEDOVANIH KOMANDIRA (za deploy) ──
  if (!window._ownedCmdFilter) window._ownedCmdFilter = { series: 'all', faction: 'all', rarity: 'all', show: 'all' };
  const ownFlt = window._ownedCmdFilter;

  const fleetFactions = {
    ...(typeof FACTIONS !== 'undefined' ? FACTIONS : {}),
    ...(typeof XENOS_FACTIONS !== 'undefined' ? XENOS_FACTIONS : {}),
    ...(typeof UNDEAD_FACTIONS !== 'undefined' ? UNDEAD_FACTIONS : {}),
  };
  const fleetFactionOpts = [...new Set(allCmds.map(c => c.faction))].map(f => {
    const fDef = fleetFactions[f] || { name: f, icon: '?' };
    return `<option value="${f}" ${ownFlt.faction===f?'selected':''}>${fDef.icon} ${fDef.name}</option>`;
  }).join('');

  const ownedFilterBar = `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      <select class="input-field" style="font-size:0.65rem;padding:4px 8px;flex:1;min-width:100px"
        onchange="window._ownedCmdFilter.series=this.value;renderFleetCommanders()">
        <option value="all" ${ownFlt.series==='all'?'selected':''}>📦 Sve Serije</option>
        <option value="origin" ${ownFlt.series==='origin'?'selected':''}>🌌 Origin</option>
        <option value="xenos" ${ownFlt.series==='xenos'?'selected':''}>👾 Xenos</option>
        <option value="undead" ${ownFlt.series==='undead'?'selected':''}>💀 Undead</option>
      </select>
      <select class="input-field" style="font-size:0.65rem;padding:4px 8px;flex:1;min-width:100px"
        onchange="window._ownedCmdFilter.faction=this.value;renderFleetCommanders()">
        <option value="all" ${ownFlt.faction==='all'?'selected':''}>🌐 Sve Frakcije</option>
        ${fleetFactionOpts}
      </select>
      <select class="input-field" style="font-size:0.65rem;padding:4px 8px;flex:1;min-width:100px"
        onchange="window._ownedCmdFilter.rarity=this.value;renderFleetCommanders()">
        <option value="all" ${ownFlt.rarity==='all'?'selected':''}>⭐ Svi Rariteti</option>
        <option value="C" ${ownFlt.rarity==='C'?'selected':''}>⬜ Common</option>
        <option value="R" ${ownFlt.rarity==='R'?'selected':''}>🔵 Rare</option>
        <option value="E" ${ownFlt.rarity==='E'?'selected':''}>🟣 Epic</option>
        <option value="L" ${ownFlt.rarity==='L'?'selected':''}>🟡 Legendary</option>
      </select>
      <select class="input-field" style="font-size:0.65rem;padding:4px 8px;flex:1;min-width:100px"
        onchange="window._ownedCmdFilter.show=this.value;renderFleetCommanders()">
        <option value="all" ${ownFlt.show==='all'?'selected':''}>Svi</option>
        <option value="free" ${ownFlt.show==='free'?'selected':''}>✅ Slobodni</option>
        <option value="deployed" ${ownFlt.show==='deployed'?'selected':''}>🚀 Aktivni</option>
      </select>
    </div>`;

  const seriesMap2 = {
    origin: new Set((typeof COMMANDERS !== 'undefined' ? COMMANDERS : []).map(c => c.id)),
    xenos:  new Set((typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []).map(c => c.id)),
    undead: new Set((typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []).map(c => c.id)),
  };

  const ownedOwnedList = owned
    .map(entry => ({ entry, def: allCmds.find(c => c.id === entry.id) }))
    .filter(x => x.def)
    .filter(({ def }) => {
      if (ownFlt.series !== 'all' && !(seriesMap2[ownFlt.series] || new Set()).has(def.id)) return false;
      if (ownFlt.faction !== 'all' && def.faction !== ownFlt.faction) return false;
      if (ownFlt.rarity !== 'all' && def.rarity !== ownFlt.rarity) return false;
      if (ownFlt.show === 'free' && deployed.includes(def.id)) return false;
      if (ownFlt.show === 'deployed' && !deployed.includes(def.id)) return false;
      return true;
    })
    .sort((a, b) => {
      const rarOrd = { L:0, E:1, R:2, C:3 };
      return (rarOrd[a.def.rarity]||3) - (rarOrd[b.def.rarity]||3);
    });

  const listHtml = owned.length === 0
    ? `<div style="text-align:center;color:#6a90b8;padding:30px;font-size:0.72rem">
        Nemaš komandira. Otvori pakete u tab-u "Paketi & Kolekcija"!
      </div>`
    : ownedOwnedList.length === 0
    ? `${ownedFilterBar}<div style="text-align:center;color:#6a90b8;padding:20px;font-size:0.72rem">
        Nema komandira za odabrane filtere.
      </div>`
    : `${ownedFilterBar}<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px">
        ${ownedOwnedList.map(({ entry, def }) => {
          const rc         = rarityColor(def.rarity);
          const isDeployed = deployed.includes(def.id);
          const isLead     = def.id === window._activeCommander;
          const cFleet     = typeof getCmdFleet === 'function' ? getCmdFleet(def.id) : [];
          const filled     = cFleet.filter(Boolean).length;
          const xpPct      = Math.min(100, ((entry.xp||0) / getCardXpForLevel(entry.level||1)) * 100);
          const oFdef = (typeof FACTIONS !== 'undefined' ? FACTIONS : {})[def.faction]
            || (typeof XENOS_FACTIONS !== 'undefined' ? XENOS_FACTIONS : {})[def.faction]
            || (typeof UNDEAD_FACTIONS !== 'undefined' ? UNDEAD_FACTIONS : {})[def.faction]
            || null;
          return `
            <div style="border-radius:8px;border:${isDeployed ? `2px solid ${rc}` : `1px solid rgba(255,255,255,0.07)`};
              background:${isDeployed ? rc+'0d' : 'rgba(0,0,0,0.25)'};
              padding:10px;position:relative;text-align:center">
              ${isLead ? `<div style="position:absolute;top:3px;left:3px;font-size:0.55rem;
                color:#ffcc44;background:#ffcc4422;border-radius:3px;padding:1px 5px;
                font-family:'Orbitron',monospace">★ LEAD</div>` : ''}
              ${isDeployed ? `<div style="position:absolute;top:3px;right:3px;font-size:0.5rem;
                color:${rc};background:${rc}22;border-radius:3px;padding:1px 5px;
                font-family:'Orbitron',monospace">AKTIVAN</div>` : ''}
              <div style="font-size:1.6rem;filter:drop-shadow(0 0 6px ${rc}66);margin-bottom:3px">${def.icon}</div>
              <div style="font-size:0.72rem;font-weight:700;color:${rc};
                white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px">${def.name}</div>
              <div style="font-size:0.6rem;color:#6a90b8;margin-bottom:2px">
                ${(oFdef?.icon && oFdef.icon !== '??' && oFdef.icon !== '???' ? oFdef.icon : '')} ${oFdef?.name || def.faction} · Lv.${entry.level}
              </div>
              <div style="font-size:0.55rem;color:#6a90b8;margin-bottom:4px">${filled}/9 🚀</div>
              <div class="pbar" style="height:2px;margin-bottom:6px">
                <div class="pbar-fill" style="width:${xpPct}%;background:${rc}"></div>
              </div>
              ${isDeployed
                ? `<button class="btn btn-r" style="width:100%;font-size:0.55rem;padding:3px"
                    onclick="undeployCommander('${def.id}');renderFleetCommanders()">
                    🏠 Povuci
                  </button>
                  <button class="btn" style="width:100%;font-size:0.55rem;padding:3px;margin-top:4px;background:#b8860b;color:#fff"
                    onclick="if(confirm('Skinuti sve brodove sa komandira?')){clearCommanderFleet('${def.id}');renderFleetCommanders()}">
                    📦 Skini brodove
                  </button>`
                : isFull
                  ? `<button class="btn" style="width:100%;font-size:0.55rem;padding:3px;opacity:0.4" disabled>
                      🔒 Puna formacija
                    </button>`
                  : `<button class="btn btn-g" style="width:100%;font-size:0.55rem;padding:3px"
                      onclick="deployCommander('${def.id}');renderFleetCommanders()">
                      🚀 Deploy
                    </button>`
              }
            </div>`;
        }).join('')}
      </div>`;

  el.innerHTML = `
    ${headerHtml}
    ${synHtml}
    ${deployedHtml}
    <div style="font-size:0.6rem;color:#00d4ff;font-family:'Orbitron',monospace;
      letter-spacing:2px;margin-bottom:10px;padding-bottom:6px;
      border-bottom:1px solid rgba(0,212,255,0.1)">
      📋 POSJEDOVANI KOMANDIRI (${owned.length})
    </div>
    ${listHtml}`;
}

// Klik na popunjen slot → detalji ili ukloni
function openFleetSlotMenu(slotId) {
  const slot   = FLEET_SLOTS[slotId];
  const cmdId  = window._cmdFleet[slotId];
  if (!cmdId) { openSlotPicker(slotId); return; }

  const allCmds = [
    ...(typeof COMMANDERS !== 'undefined' ? COMMANDERS : []),
    ...(typeof COMMANDERS_XENOS !== 'undefined' ? COMMANDERS_XENOS : []),
    ...(typeof COMMANDERS_UNDEAD !== 'undefined' ? COMMANDERS_UNDEAD : []),
  ];
  const def = allCmds.find(c => c.id === cmdId);
  if (!def) return;
  const rc = rarityColor(def.rarity);

  openModal(
    `${slot.icon} ${slot.role} — ${def.icon} ${def.name}`,
    `<div style="text-align:center;padding:10px 0">
      <div style="font-size:3rem;margin-bottom:8px">${def.icon}</div>
      <div style="font-size:0.85rem;font-weight:700;color:${rc};font-family:'Orbitron',monospace">
        ${def.name}</div>
      <div style="font-size:0.65rem;color:#6a90b8;margin-top:4px">${rarityName(def.rarity)}</div>
    </div>`,
    [
      { label: '👁️ Detalji', cls: '', fn: () => { closeModal(); showCardDetail(cmdId); } },
      { label: '🔄 Zamijeni', cls: 'btn-g', fn: () => { closeModal(); openSlotPicker(slotId); } },
      { label: '❌ Ukloni', cls: 'btn-red', fn: () => { removeCommanderFromSlot(slotId); closeModal(); } },
    ]
  );
}
